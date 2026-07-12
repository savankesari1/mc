import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, randomInt } from "crypto";

const BIRD_SMS_URL = "https://eu1.platform.bird.com/v1/sms/messages";
const OTP_TTL_MINUTES = 10; // Bird template requires ttl as integer 1–999

function hashOtp(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function generateOtp(): string {
  return String(randomInt(100000, 999999));
}

// ─── Step 1: Send OTP ────────────────────────────────────────────────────────

/**
 * Generates a 6-digit OTP, stores it (hashed) in phone_otps, and sends it
 * via the Bird "bird_otp_verification_ttl" SMS template.
 */
export const sendPhoneOtp = createServerFn({ method: "POST" })
  .inputValidator((data: { phone: string }) =>
    z
      .object({
        /** 10-digit Indian mobile number without country code, e.g. "9876543210" */
        phone: z
          .string()
          .trim()
          .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.BIRD_API_KEY;
    if (!apiKey || apiKey === "bk_xxxxxxxxx") {
      throw new Error("BIRD_API_KEY is not configured on the server.");
    }

    const e164 = `+91${data.phone}`;
    const code = generateOtp();
    const hash = hashOtp(code);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

    // Store hashed OTP in DB (upsert — one row per phone)
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: dbErr } = await supabaseAdmin.from("phone_otps").upsert(
      { phone: e164, otp_hash: hash, expires_at: expiresAt },
      { onConflict: "phone" },
    );
    if (dbErr) throw new Error(`Failed to store OTP: ${dbErr.message}`);

    // Send SMS via Bird
    const res = await fetch(BIRD_SMS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: e164,
        template: {
          name: "bird_otp_verification_ttl",
          parameters: {
            code,
            ttl: OTP_TTL_MINUTES, // integer minutes, per Bird API requirement
          },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Bird SMS API error (${res.status}): ${body.slice(0, 200)}`);
    }

    return { ok: true };
  });

// ─── Step 2: Verify OTP + create session ─────────────────────────────────────

/**
 * Validates the user-entered OTP against the stored hash.
 * On success, finds-or-creates the Supabase user and returns a
 * magic-link token_hash the client can exchange for a real session.
 */
export const verifyPhoneOtp = createServerFn({ method: "POST" })
  .inputValidator((data: { phone: string; code: string }) =>
    z
      .object({
        phone: z
          .string()
          .trim()
          .regex(/^[6-9]\d{9}$/, "Invalid phone number"),
        code: z.string().length(6, "OTP must be 6 digits"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const e164 = `+91${data.phone}`;

    // Fetch the stored challenge
    const { data: row, error: fetchErr } = await supabaseAdmin
      .from("phone_otps")
      .select("otp_hash, expires_at")
      .eq("phone", e164)
      .maybeSingle();

    if (fetchErr) throw new Error(`DB error: ${fetchErr.message}`);
    if (!row) throw new Error("No OTP was sent to this number. Please request a new one.");

    // Check expiry
    if (new Date(row.expires_at) < new Date()) {
      await supabaseAdmin.from("phone_otps").delete().eq("phone", e164);
      throw new Error("OTP expired. Please request a new one.");
    }

    // Check hash
    if (hashOtp(data.code) !== row.otp_hash) {
      throw new Error("Incorrect OTP. Please try again.");
    }

    // OTP is valid — delete it (one-time use)
    await supabaseAdmin.from("phone_otps").delete().eq("phone", e164);

    // Find or create a Supabase user tied to this phone.
    // We use a deterministic "phone email" as the account anchor.
    const phoneEmail = `phone_${data.phone}@auth.mahadevi.internal`;

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === phoneEmail);

    let userId: string;
    if (existing) {
      userId = existing.id;
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: phoneEmail,
        email_confirm: true,
        user_metadata: { phone: e164, auth_method: "phone_otp" },
      });
      if (createErr) throw new Error(`Failed to create account: ${createErr.message}`);
      userId = created.user.id;
    }

    // Generate a magic-link token the client can exchange for a session
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: phoneEmail,
    });
    if (linkErr || !linkData) throw new Error(`Failed to create session: ${linkErr?.message}`);

    const tokenHash = linkData.properties?.hashed_token;
    if (!tokenHash) throw new Error("Session token missing from magic link response.");

    return { ok: true, tokenHash, userId };
  });
