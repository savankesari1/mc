import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Returns the public Razorpay key_id so the browser can open Checkout. */
export const getRazorpayKey = createServerFn({ method: "GET" }).handler(async () => {
  return { keyId: process.env.RAZORPAY_KEY_ID ?? "" };
});

/** Creates a Razorpay order for a resource the user is trying to buy. */
export const createRazorpayOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { resourceId: string }) =>
    z.object({ resourceId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Fetch resource
    const { data: resource, error: rErr } = await supabase
      .from("resources")
      .select("id, title, price_inr, is_free, is_published")
      .eq("id", data.resourceId)
      .maybeSingle();
    if (rErr || !resource) throw new Error("Resource not found");
    if (!resource.is_published) throw new Error("Resource unavailable");
    if (resource.is_free || resource.price_inr <= 0) throw new Error("Resource is free");

    const amountPaise = Math.round(Number(resource.price_inr) * 100);

    // Insert pending purchase
    const { data: purchase, error: pErr } = await supabase
      .from("purchases")
      .insert({
        user_id: userId,
        resource_id: resource.id,
        amount_inr: resource.price_inr,
        status: "pending",
      })
      .select()
      .single();
    if (pErr) throw pErr;

    // Create Razorpay order
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new Error("Razorpay is not configured");

    const auth = btoa(`${keyId}:${keySecret}`);
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: purchase.id,
        notes: { purchase_id: purchase.id, resource_id: resource.id },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Razorpay: ${text.slice(0, 200)}`);
    }
    const order = (await res.json()) as { id: string };

    await supabase
      .from("purchases")
      .update({ razorpay_order_id: order.id })
      .eq("id", purchase.id);

    return {
      orderId: order.id,
      amount: amountPaise,
      currency: "INR",
      purchaseId: purchase.id,
      keyId,
      resourceTitle: resource.title,
    };
  });

/** Verifies Razorpay signature and marks purchase completed. */
export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    purchaseId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    z
      .object({
        purchaseId: z.string().uuid(),
        razorpay_order_id: z.string().min(1),
        razorpay_payment_id: z.string().min(1),
        razorpay_signature: z.string().min(1),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error("Razorpay not configured");

    const { createHmac } = await import("crypto");
    const expected = createHmac("sha256", secret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");
    if (expected !== data.razorpay_signature) throw new Error("Invalid signature");

    const { supabase } = context;
    const { error } = await supabase
      .from("purchases")
      .update({
        status: "completed",
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      })
      .eq("id", data.purchaseId);
    if (error) throw error;
    return { ok: true };
  });

/** Signed URL to download a purchased resource file. */
export const getResourceDownloadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { resourceId: string }) =>
    z.object({ resourceId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: resource } = await supabase
      .from("resources")
      .select("id, file_path, is_free, price_inr")
      .eq("id", data.resourceId)
      .maybeSingle();
    if (!resource?.file_path) throw new Error("No file for this resource");

    if (!resource.is_free) {
      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("resource_id", data.resourceId)
        .eq("user_id", userId)
        .eq("status", "completed")
        .maybeSingle();
      if (!purchase) throw new Error("You haven't purchased this resource");
    }

    // Use the service-role client to actually create the signed URL: the
    // resource-files bucket's RLS only grants admins read access, but we've
    // already verified entitlement above, so it's safe to bypass RLS here.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("resource-files")
      .createSignedUrl(resource.file_path, 60 * 10);
    if (error || !signed) throw error ?? new Error("Cannot create download link");

    await supabase.from("downloads").insert({ resource_id: data.resourceId, user_id: userId });
    return { url: signed.signedUrl };
  });
