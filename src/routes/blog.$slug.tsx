import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Payal Education Center Blog` },
      { name: "description", content: "Read on Payal Education Center Computers blog." },
    ],
  }),
  component: BlogPost,
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      return data;
    },
  });

  if (isLoading) return <><Header /><main className="min-h-screen" /></>;
  if (!post) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-md px-6 pt-40 pb-32 min-h-screen text-center">
          <h1 className="text-3xl font-semibold tracking-tighter">Post not found</h1>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-1 text-sm underline"><ArrowLeft className="h-3 w-3" /> Back to blog</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24 min-h-screen">
        <Link to="/blog" className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Blog
        </Link>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tighter">{post.title}</h1>
        {post.published_at && (
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {new Date(post.published_at).toLocaleDateString()}
          </p>
        )}
        {post.cover_url && (
          <img src={post.cover_url} alt={post.title} className="mt-8 rounded-2xl w-full" />
        )}
        <article className="mt-10 prose prose-invert max-w-none whitespace-pre-line text-muted-foreground leading-relaxed">
          {post.content}
        </article>
      </main>
      <Footer />
    </>
  );
}
