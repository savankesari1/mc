import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms — Mahadevi Computers" }, { name: "description", content: "Terms of service." }],
  }),
  component: () => (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-40 pb-32 min-h-screen prose prose-invert">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Legal</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tighter">Terms of Service</h1>
        <p className="mt-8 text-muted-foreground">Terms content to be finalized.</p>
      </main>
      <Footer />
    </>
  ),
});
