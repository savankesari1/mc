import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Heart, Star, ArrowLeft, Lock, Unlock, CheckCircle,
  FileText, ExternalLink, Download, X, Loader2,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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
      { title: `${params.slug} — Payal Education Center Computers` },
      { name: "description", content: "Premium learning resource on Payal Education Center Computers." },
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
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<"pdf" | "file" | "external" | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);

  const { data: resource, isLoading } = useQuery({
    queryKey: ["resource", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("resources")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .maybeSingle();
      if (data) {
        supabase
          .from("resources")
          .update({ views_count: (data.views_count ?? 0) + 1 })
          .eq("id", data.id)
          .then(() => {});
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

  // Clear document view when resource changes
  useEffect(() => {
    setDocumentUrl(null);
    setDocumentType(null);
  }, [slug]);

  async function handleBuy() {
    if (!user) {
      toast.error("Please sign in to purchase this resource");
      return navigate({ to: "/auth", search: { next: `/resources/${slug}` } });
    }
    if (!resource) return;

    setIsProcessingBuy(true);

    try {
      const order = await createRazorpayOrder({ data: { resourceId: resource.id } });

      if (!window.Razorpay) {
        toast.error("Payment SDK failed to load. Please disable any ad-blocker and try again.");
        setIsProcessingBuy(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Payal Education Center Computers",
        description: order.resourceTitle,
        order_id: order.orderId,
        theme: { color: "#6366f1" },
        handler: async (resp: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            toast.loading("Verifying payment…", { id: "payment-verify" });
            await verifyRazorpayPayment({
              data: {
                purchaseId: order.purchaseId,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              },
            });
            toast.success("🎉 Payment successful! Resource unlocked.", { id: "payment-verify" });
            // Refresh purchase status — button will change to "View Document"
            qc.invalidateQueries({ queryKey: ["purchase", resource.id, user.id] });
          } catch (e) {
            toast.error("Verification failed: " + (e as Error).message, { id: "payment-verify" });
          } finally {
            setIsProcessingBuy(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessingBuy(false),
        },
      });
      rzp.open();
    } catch (e) {
      toast.error("Checkout error: " + (e as Error).message);
      setIsProcessingBuy(false);
    }
  }

  async function handleViewDocument() {
    if (!resource) return;

    // If already loaded, toggle the viewer closed
    if (documentUrl) {
      setDocumentUrl(null);
      setDocumentType(null);
      return;
    }

    setIsLoadingDoc(true);
    try {
      const result = await getResourceDownloadUrl({ data: { resourceId: resource.id } });

      if (result.type === "external") {
        // External URL — open in new tab
        window.open(result.url, "_blank", "noopener,noreferrer");
        toast.success("Opened external resource in new tab");
      } else {
        setDocumentUrl(result.url);
        setDocumentType(result.type);
        // Scroll down to the viewer
        setTimeout(() => {
          document.getElementById("document-viewer")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch (e) {
      toast.error("Could not load document: " + (e as Error).message);
    } finally {
      setIsLoadingDoc(false);
    }
  }

  const canAccess = resource && (resource.is_free || purchase);

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
          <h1 className="text-3xl font-semibold tracking-tighter">Resource not found</h1>
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
          <Link
            to="/resources"
            className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Library
          </Link>

          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tighter">{resource.title}</h1>
          {resource.description && (
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{resource.description}</p>
          )}
        </motion.div>

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          {/* LEFT: thumbnail + reviews */}
          <div className="lg:col-span-2">
            {/* Thumbnail */}
            <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-border bg-muted relative">
              {resource.thumbnail_url && !thumbnailError ? (
                <img
                  src={resource.thumbnail_url}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setThumbnailError(true)}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)" }}
                >
                  <FileText className="h-16 w-16 text-white/30" />
                </div>
              )}
            </div>

            {/* Reviews section */}
            <section className="mt-14">
              <h2 className="text-xl font-semibold tracking-tight">Reviews</h2>
              {reviews && reviews.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{r.profiles?.full_name ?? "Anonymous"}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                          ))}
                        </div>
                      </div>
                      {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">No reviews yet. Be the first!</p>
              )}
              {user && purchase && <ReviewForm resourceId={resource.id} />}
            </section>
          </div>

          {/* RIGHT: price card */}
          <aside className="lg:sticky lg:top-28 h-fit">
            <div className="rounded-2xl border border-border bg-surface p-6 relative overflow-hidden">
              {/* Unlocked badge */}
              {canAccess && !resource.is_free && (
                <div className="absolute top-0 right-0 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-bl-xl text-xs font-semibold flex items-center gap-1.5 z-10">
                  <CheckCircle className="h-3.5 w-3.5" /> Unlocked
                </div>
              )}

              {/* Price */}
              <div className="text-3xl font-semibold tracking-tighter">
                {resource.is_free || Number(resource.price_inr) <= 0
                  ? <span className="text-green-400">Free</span>
                  : `₹${resource.price_inr}`}
              </div>

              {/* Action buttons */}
              <div className="mt-6 space-y-2">
                {canAccess ? (
                  <Button
                    id="view-document-btn"
                    className="w-full h-11 rounded-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleViewDocument}
                    disabled={isLoadingDoc}
                  >
                    {isLoadingDoc ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading document…
                      </>
                    ) : documentUrl ? (
                      <>
                        <X className="h-4 w-4 mr-2" /> Close Document
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4 mr-2" /> View &amp; Download Document
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    id="buy-unlock-btn"
                    className="w-full h-11 rounded-full"
                    onClick={handleBuy}
                    disabled={isProcessingBuy}
                  >
                    {isProcessingBuy ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing…
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" /> Buy &amp; Unlock — ₹{resource.price_inr}
                      </>
                    )}
                  </Button>
                )}

                {/* Wishlist */}
                {user && !canAccess && (
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-full"
                    onClick={() => toggleWish.mutate()}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${wishItem ? "fill-rose-500 text-rose-500" : ""}`} />
                    {wishItem ? "Wishlisted" : "Add to Wishlist"}
                  </Button>
                )}
              </div>

              {/* Meta */}
              <div className="mt-6 space-y-1.5 text-xs text-muted-foreground font-mono">
                {(resource as any).categories?.name && (
                  <div>Category: {(resource as any).categories.name}</div>
                )}
                <div>Views: {resource.views_count ?? 0}</div>
                {!resource.is_free && (
                  <div className="text-green-600/70">✓ One-time purchase — access forever</div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* ─── DOCUMENT VIEWER ─── */}
        <AnimatePresence>
          {documentUrl && (
            <motion.div
              id="document-viewer"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.4 }}
              className="mt-12"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-400" />
                  {resource.title}
                </h2>
                <div className="flex items-center gap-2">
                  <a
                    href={documentUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1.5 transition-colors"
                  >
                    <Download className="h-3 w-3" /> Download
                  </a>
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1.5 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" /> Open in tab
                  </a>
                  <button
                    onClick={() => { setDocumentUrl(null); setDocumentType(null); }}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1.5 transition-colors"
                  >
                    <X className="h-3 w-3" /> Close
                  </button>
                </div>
              </div>

              {documentType === "pdf" ? (
                <div className="rounded-2xl overflow-hidden border border-border bg-muted" style={{ height: "80vh" }}>
                  <iframe
                    src={`${documentUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                    title={resource.title}
                    className="w-full h-full"
                    style={{ border: "none" }}
                  />
                </div>
              ) : (
                /* Non-PDF file: show a prominent download card */
                <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                  <FileText className="h-12 w-12 text-green-400 mx-auto" />
                  <p className="mt-4 text-lg font-medium">{resource.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This file cannot be previewed in the browser. Click below to download it.
                  </p>
                  <a
                    href={documentUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-sm font-medium transition-colors"
                  >
                    <Download className="h-4 w-4" /> Download File
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
    if (!u.user) { setBusy(false); return; }
    await supabase
      .from("reviews")
      .upsert(
        { resource_id: resourceId, user_id: u.user.id, rating, comment },
        { onConflict: "resource_id,user_id" as never },
      );
    setBusy(false);
    setComment("");
    qc.invalidateQueries({ queryKey: ["reviews", resourceId] });
    toast.success("Review submitted!");
  }

  return (
    <div className="mt-6 rounded-xl border border-border p-4">
      <p className="text-sm font-medium mb-3">Write a review</p>
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} onClick={() => setRating(i + 1)}>
            <Star className={`h-5 w-5 transition-colors ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-yellow-400"}`} />
          </button>
        ))}
      </div>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts…" />
      <Button onClick={submit} disabled={busy} className="mt-3 rounded-full">
        {busy ? "Submitting…" : "Submit Review"}
      </Button>
    </div>
  );
}
