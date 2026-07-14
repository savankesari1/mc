import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from "react";
import { Lock, Loader2, Unlock, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

import { Particles } from "@/components/ui/Particles";

export const Route = createFileRoute('/resources/')({
  head: () => ({
    meta: [
      { title: "Resources — Payal Education Center Computers" },
      { name: "description", content: "Browse our premium library of computer training, programming, and competitive exam resources." },
    ],
  }),
  component: ResourcesPage,
})

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

function ResourceCard({ resource }: { resource: Resource }) {
  const [thumbError, setThumbError] = useState(false);

  return (
    <Card className="flex flex-col border-border/50 bg-surface/50 hover:bg-surface transition-colors overflow-hidden">
      {/* Thumbnail — always show a 16/9 area, fall back to gradient */}
      <div className="aspect-[16/9] overflow-hidden relative">
        {resource.thumbnail_url && !thumbError ? (
          <img
            src={resource.thumbnail_url}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            referrerPolicy="no-referrer"
            onError={() => setThumbError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)" }}
          >
            <FileText className="h-10 w-10 text-white/25" />
          </div>
        )}
        {/* Price badge overlay */}
        <div className="absolute top-2 right-2">
          {resource.is_free || resource.price_inr <= 0 ? (
            <span className="bg-green-500/90 text-white text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
              Free
            </span>
          ) : (
            <span className="bg-black/70 text-white text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
              ₹{resource.price_inr}
            </span>
          )}
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg leading-snug">{resource.title}</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {resource.description ?? "No description available."}
        </p>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full" variant={resource.is_free ? "outline" : "default"}>
          <Link to="/resources/$slug" params={{ slug: resource.slug }}>
            {resource.is_free ? (
              <>
                <Unlock className="w-4 h-4 mr-2" />
                View Free Resource
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Buy &amp; Unlock
              </>
            )}
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('id, slug, title, description, price_inr, is_free, is_published, thumbnail_url')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

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
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden border-b border-border">
          <div className="absolute inset-0 z-0 bg-background">
            <Particles
              particleColors={["#ffffff", "#6366f1", "#a855f7"]}
              particleCount={50}
              particleSpread={10}
              speed={0.05}
              particleBaseSize={100}
              moveParticlesOnHover={false}
              alphaParticles={false}
              disableRotation={false}
            />
          </div>
          
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 z-[5] bg-gradient-to-b from-background/40 via-background/10 to-background/90" />
          
          <div className="relative z-10 text-center px-6 mt-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter drop-shadow-md">
              Resource Library
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
              Premium courses and materials. Purchase once, access forever.
            </p>
          </div>
        </div>

        <div className="container mx-auto py-16 px-6">

          {loadingResources ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading resources...</span>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>No resources have been published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
