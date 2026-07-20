import { createAPIFileRoute } from "@tanstack/react-start/api";

const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "weekly" | "monthly";
  priority?: string;
}

export const APIRoute = createAPIFileRoute("/sitemap.xml")({
  GET: async () => {
    const entries: SitemapEntry[] = [
      { path: "/", changefreq: "weekly", priority: "1.0" },
      { path: "/resources", changefreq: "weekly", priority: "0.9" },
      { path: "/about", changefreq: "monthly", priority: "0.6" },
      { path: "/contact", changefreq: "monthly", priority: "0.5" },
      { path: "/terms", changefreq: "monthly", priority: "0.3" },
      { path: "/privacy", changefreq: "monthly", priority: "0.3" },
      { path: "/refund", changefreq: "monthly", priority: "0.3" },
    ];

    const urls = entries.map((e) =>
      [
        `  <url>`,
        `    <loc>${BASE_URL}${e.path}</loc>`,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        `  </url>`,
      ].filter(Boolean).join("\n"),
    );

    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      ...urls,
      `</urlset>`,
    ].join("\n");

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
});
