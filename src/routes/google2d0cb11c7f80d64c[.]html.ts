import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/google2d0cb11c7f80d64c.html")({
  GET: async () => {
    return new Response("google-site-verification: google2d0cb11c7f80d64c.html", {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
});
