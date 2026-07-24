import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, lazy, Suspense } from "react";
import { Lock, Loader2, Unlock, ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const DotField = lazy(() => import("@/components/ui/DotField"));

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: [
      { title: "Resources — Payal Education Society Computers" },
      {
        name: "description",
        content:
          "Browse our premium library of computer training, programming, and competitive exam resources.",
      },
    ],
  }),
  component: ResourcesPage,
});

interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price_inr: number;
  is_free: boolean;
  is_published: boolean;
  thumbnail_url: string | null;
}

const easeOut = [0.23, 1, 0.32, 1] as const;

function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const [thumbError, setThumbError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: easeOut }}
      className="group flex flex-col rounded-2xl border border-border/40 bg-surface/20 hover:bg-surface/40 hover:border-border/80 overflow-hidden transition-[background,border-color,transform,box-shadow] duration-300 hover:scale-[1.015] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]"
    >
      {/* Thumbnail */}
      <div className="aspect-[16/9] overflow-hidden relative bg-surface/40 shrink-0">
        {resource.thumbnail_url && !thumbError ? (
          <img
            src={resource.thumbnail_url}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={() => setThumbError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-surface/60">
            <FileText className="h-8 w-8 text-white/15" />
          </div>
        )}
        {/* Price badge */}
        <div className="absolute top-3 right-3">
          {resource.is_free || resource.price_inr <= 0 ? (
            <span className="bg-emerald-500/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              Free
            </span>
          ) : (
            <span className="bg-black/70 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
              ₹{resource.price_inr}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <h3 className="text-base font-semibold text-white leading-snug">{resource.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {resource.description ?? "No description available."}
        </p>

        <Link
          to="/resources/$slug"
          params={{ slug: resource.slug }}
          className="mt-5 inline-flex items-center justify-center gap-2 h-10 rounded-full border text-sm font-medium transition-[background,border-color,transform] duration-200 active:scale-[0.97] px-4 w-full group/btn"
          style={{
            borderColor: resource.is_free ? "oklch(1 0 0 / 16%)" : "oklch(1 0 0 / 20%)",
            background: resource.is_free ? "transparent" : "oklch(1 0 0 / 6%)",
            color: "oklch(0.98 0 0)",
          }}
        >
          {resource.is_free ? (
            <><Unlock className="w-3.5 h-3.5 text-emerald-400" /> View Free</>
          ) : (
            <><Lock className="w-3.5 h-3.5 text-white/60" /> Buy & Unlock</>
          )}
          <ArrowRight className="w-3.5 h-3.5 ml-auto transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}

function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    async function fetchResources() {
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("id, slug, title, description, price_inr, is_free, is_published, thumbnail_url")
          .eq("is_published", true)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setResources(data ?? []);
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast.error("Failed to load resources.");
      } finally {
        setLoadingResources(false);
      }
    }
    fetchResources();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative w-full min-h-[360px] md:min-h-[440px] flex items-center justify-center overflow-hidden border-b border-border">
        {/* DotField background — client only */}
        {isClient && (
          <div className="absolute inset-0 z-0">
            <Suspense fallback={null}>
              <DotField
                dotRadius={1.5}
                dotSpacing={22}
                cursorRadius={200}
                cursorForce={0.08}
                bulgeOnly={true}
                bulgeStrength={40}
                glowRadius={120}
                sparkle={false}
                gradientFrom="rgba(255,255,255,0.7)"
                gradientTo="rgba(255,255,255,0.12)"
                glowColor="#0d0e14"
              />
            </Suspense>
          </div>
        )}
        {/* Vignette */}
        <div className="absolute inset-0 z-[5] bg-gradient-to-b from-background/50 via-transparent to-background/90 pointer-events-none" />

        <div className="relative z-10 text-center px-4 sm:px-6 pt-28 pb-8">
          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground/60 mb-4"
          >
            Library
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easeOut }}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tighter text-white"
          >
            Resource Library
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
            className="mt-4 text-muted-foreground max-w-md mx-auto text-sm sm:text-base"
          >
            Premium courses and materials. Purchase once, access forever.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
        {loadingResources ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-7 w-7 animate-spin text-white/40" />
            <span className="ml-3 text-sm text-muted-foreground">Loading…</span>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-sm">No resources published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {resources.map((resource, i) => (
              <ResourceCard key={resource.id} resource={resource} index={i} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
