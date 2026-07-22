import { createAPIFileRoute } from "@tanstack/react-start/api";
import { createClient } from "@supabase/supabase-js";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

function buildXml(base: string, entries: SitemapEntry[]): string {
  const today = new Date().toISOString().split("T")[0];

  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${base}${e.path}</loc>`,
      `    <lastmod>${e.lastmod ?? today}</lastmod>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

export const APIRoute = createAPIFileRoute("/sitemap.xml")({
  GET: async ({ request }) => {
    // Derive the origin from the incoming request — works on any deployment automatically
    const { origin } = new URL(request.url);
    const BASE_URL = origin;

    // ── Static pages ──────────────────────────────────────────────────────────
    const staticEntries: SitemapEntry[] = [
      { path: "/",          changefreq: "weekly",  priority: "1.0" },
      { path: "/resources", changefreq: "daily",   priority: "0.9" },
      { path: "/blog",      changefreq: "weekly",  priority: "0.8" },
      { path: "/about",     changefreq: "monthly", priority: "0.6" },
      { path: "/contact",   changefreq: "monthly", priority: "0.5" },
      { path: "/terms",     changefreq: "monthly", priority: "0.3" },
      { path: "/privacy",   changefreq: "monthly", priority: "0.3" },
      { path: "/refund",    changefreq: "monthly", priority: "0.3" },
    ];

    // ── Dynamic pages from Supabase ───────────────────────────────────────────
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Resources
    const { data: resources } = await supabase
      .from("resources")
      .select("slug, updated_at")
      .eq("is_published", true)
      .order("updated_at", { ascending: false });

    const resourceEntries: SitemapEntry[] = (resources ?? []).map((r) => ({
      path: `/resources/${r.slug}`,
      changefreq: "monthly" as const,
      priority: "0.7",
      lastmod: r.updated_at ? r.updated_at.split("T")[0] : undefined,
    }));

    // Blog posts
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    const blogEntries: SitemapEntry[] = (posts ?? []).map((p) => ({
      path: `/blog/${p.slug}`,
      changefreq: "monthly" as const,
      priority: "0.6",
      lastmod: (p.updated_at ?? p.published_at ?? undefined)?.split("T")[0],
    }));

    const allEntries = [...staticEntries, ...resourceEntries, ...blogEntries];
    const xml = buildXml(BASE_URL, allEntries);

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  },
});
