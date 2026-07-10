import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Mahadevi Computers" },
      { name: "description", content: "Insights, tutorials, and updates from Mahadevi Computers." },
    ],
  }),
  component: BlogList,
});

function BlogList() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_url, published_at, tags")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 pt-32 pb-24 min-h-screen">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Journal</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tighter">Blog</h1>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          {!isLoading && posts && posts.length === 0 && (
            <p className="col-span-full text-muted-foreground text-sm">No posts yet.</p>
          )}
          {posts?.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group rounded-2xl border border-border bg-surface overflow-hidden hover:bg-surface-elevated transition-colors"
            >
              {p.cover_url && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={p.cover_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-medium tracking-tight">{p.title}</h2>
                {p.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
                {p.published_at && (
                  <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {new Date(p.published_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
