import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Privacy — Payal Education Society Computers" }, { name: "description", content: "Privacy policy." }],
  }),
  component: () => (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-40 pb-32 min-h-screen">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Legal</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tighter">Privacy Policy</h1>
        <p className="mt-8 text-muted-foreground">Privacy content to be finalized.</p>
      </main>
      <Footer />
    </>
  ),
});
