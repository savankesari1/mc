import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Heart, Star, ArrowLeft, Lock, Unlock, CheckCircle } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

// IMPORT BACKEND FUNCTIONS DIRECTLY (Do not use useServerFn)
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getResourceDownloadUrl,
} from "@/lib/payments.functions";

declare global {
  interface Window {
    Razorpay?: new (opts: unknown) => { open: () => void };
  }
}

export const Route = createFileRoute("/resources/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Mahadevi Computers` },
      { name: "description", content: "Premium learning resource on Mahadevi Computers." },
    ],
  }),
  component: ResourceDetail,
});

function ResourceDetail() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);

  const { data: resource, isLoading } = useQuery({
    queryKey: ["resource", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("resources")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (data) {
        supabase.from("resources").update({ views_count: (data.views_count ?? 0) + 1 }).eq("id", data.id).then(() => {});
      }
      return data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", resource?.id],
    queryFn: async () => {
      if (!resource) return [];
      const { data } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, user_id, profiles(full_name, avatar_url)")
        .eq("resource_id", resource.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!resource,
  });

  const { data: purchase } = useQuery({
    queryKey: ["purchase", resource?.id, user?.id],
    queryFn: async () => {
      if (!resource || !user) return null;
      const { data } = await supabase
        .from("purchases")
        .select("id, status")
        .eq("resource_id", resource.id)
        .eq("user_id", user.id)
        .eq("status", "completed")
        .maybeSingle();
      return data;
    },
    enabled: !!resource && !!user,
  });

  const { data: wishItem } = useQuery({
    queryKey: ["wish", resource?.id, user?.id],
    queryFn: async () => {
      if (!resource || !user) return null;
      const { data } = await supabase
        .from("wishlists")
        .select("id")
        .eq("resource_id", resource.id)
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!resource && !!user,
  });

  const toggleWish = useMutation({
    mutationFn: async () => {
      if (!user || !resource) throw new Error("Sign in required");
      if (wishItem) {
        await supabase.from("wishlists").delete().eq("id", wishItem.id);
      } else {
        await supabase.from("wishlists").insert({ user_id: user.id, resource_id: resource.id });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wish", resource?.id, user?.id] }),
  });

  // Load Razorpay checkout script
  useEffect(() => {
    if (window.Razorpay) return;
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  async function handleBuy() {
    console.log("1. Buy button clicked");
    
    if (!user) {
      console.log("2. No user found. Redirecting...");
      alert("Please sign in to buy this resource.");
      return navigate({ to: "/auth", search: { next: `/resources/${slug}` } });
    }
    
    if (!resource) return;
    
    setIsProcessingBuy(true);
    console.log("3. Calling createRazorpayOrder for Resource ID:", resource.id);
    
    try {
      // Calling the backend function directly
      const order = await createRazorpayOrder({ data: { resourceId: resource.id } });
      console.log("4. Order created successfully from backend:", order);
      
      if (!window.Razorpay) {
        alert("Payment SDK is blocked. Please disable your Adblocker.");
        toast.error("Payment SDK not loaded");
        setIsProcessingBuy(false);
        return;
      }
      
      console.log("5. Opening Razorpay Modal...");
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Mahadevi Computers",
        description: order.resourceTitle,
        order_id: order.orderId,
        theme: { color: "#111111" },
        handler: async (resp: any) => {
          console.log("6. Payment succeeded. Verifying signature on backend...");
          try {
            toast.loading("Verifying payment...", { id: "payment-verify" });
            await verifyRazorpayPayment({
              data: {
                purchaseId: order.purchaseId,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              },
            });
            console.log("7. Verification successful! Unlocking document.");
            toast.success("Payment successful! Resource unlocked.", { id: "payment-verify" });
            qc.invalidateQueries({ queryKey: ["purchase", resource.id, user.id] });
          } catch (e) {
            console.error("Verification failed:", e);
            alert("Verification Error: " + (e as Error).message);
            toast.error((e as Error).message, { id: "payment-verify" });
          } finally {
            setIsProcessingBuy(false);
          }
        },
        modal: {
          ondismiss: function() {
            console.log("Modal closed by user.");
            setIsProcessingBuy(false);
          }
        }
      });
      rzp.open();
    } catch (e) {
      console.error("Failed to create order:", e);
      alert("Checkout Error: " + (e as Error).message);
      toast.error((e as Error).message);
      setIsProcessingBuy(false);
    }
  }

  async function handleDownload() {
    if (!resource) return;
    try {
      const { url } = await getResourceDownloadUrl({ data: { resourceId: resource.id } });
      window.open(url, "_blank");
    } catch (e) {
      alert("Download Error: " + (e as Error).message);
      toast.error((e as Error).message);
    }
  }

  const canDownload = resource && (resource.is_free || purchase);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-5xl px-6 pt-32 pb-24 min-h-screen">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="mt-6 aspect-[16/9] w-full rounded-2xl" />
        </main>
      </>
    );
  }

  if (!resource) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-md px-6 pt-40 pb-32 min-h-screen text-center">
          <h1 className="text-3xl font-semibold tracking-tighter">Not found</h1>
          <Link to="/resources" className="mt-6 inline-flex items-center gap-1 text-sm underline">
            <ArrowLeft className="h-3 w-3" /> Back to library
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 pt-32 pb-24 min-h-screen">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/resources" className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Library
          </Link>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tighter">{resource.title}</h1>
        </motion.div>

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-border bg-subtle relative">
              {resource.thumbnail_url ? (
                <img src={resource.thumbnail_url} alt={resource.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ background: "var(--gradient-radial)" }} />
              )}
            </div>

            <section className="mt-14">
              <h2 className="text-xl font-semibold tracking-tight">Reviews</h2>
              {user && purchase && <ReviewForm resourceId={resource.id} />}
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 h-fit">
            <div className="rounded-2xl border border-border bg-surface p-6 relative overflow-hidden">
              
              {canDownload && !resource.is_free && (
                <div className="absolute top-0 right-0 bg-green-500/10 text-green-500 px-3 py-1.5 rounded-bl-xl text-xs font-semibold flex items-center gap-1.5 z-10">
                  <CheckCircle className="h-3.5 w-3.5" /> Unlocked
                </div>
              )}

              <div className="text-3xl font-semibold tracking-tighter">
                {resource.is_free || resource.price_inr <= 0 ? "Free" : `₹${resource.price_inr}`}
              </div>
              
              <div className="mt-6 space-y-2">
                {canDownload ? (
                  <Button className="w-full h-11 rounded-full bg-green-600 hover:bg-green-700 text-white" onClick={handleDownload}>
                    <Unlock className="h-4 w-4 mr-2" /> View & Download Document
                  </Button>
                ) : (
                  <Button className="w-full h-11 rounded-full" onClick={handleBuy} disabled={isProcessingBuy}>
                    <Lock className="h-4 w-4 mr-2" /> {isProcessingBuy ? "Processing Payment..." : "Buy to Unlock"}
                  </Button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ReviewForm({ resourceId }: { resourceId: string }) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    await supabase.from("reviews").upsert({ resource_id: resourceId, user_id: u.user.id, rating, comment }, { onConflict: "resource_id,user_id" as never });
    setBusy(false);
    qc.invalidateQueries({ queryKey: ["reviews", resourceId] });
  }

  return (
    <div className="mt-4 rounded-xl border border-border p-4">
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts…" />
      <Button onClick={submit} disabled={busy} className="mt-3 rounded-full">Submit</Button>
    </div>
  );
}
