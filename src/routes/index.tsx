import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Download, PlayCircle } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mahadevi Computers — Premium learning resources" },
      {
        name: "description",
        content:
          "Curated, premium educational resources for computer training, programming, competitive exams, and more. Learn at your own pace.",
      },
      { property: "og:title", content: "Mahadevi Computers — Premium learning resources" },
      {
        property: "og:description",
        content:
          "Curated educational resources for computer training, programming, and competitive exams.",
      },
    ],
  }),
  component: Home,
});

const categories = [
  "Computer Education",
  "Programming",
  "Typing",
  "Graphic Design",
  "Video Editing",
  "AI Tools",
  "Accounting",
  "Competitive Exams",
  "General Knowledge",
];

const features = [
  {
    icon: Shield,
    title: "Curated by experts",
    body: "Every resource is hand-picked and reviewed for quality — no filler, no noise.",
  },
  {
    icon: PlayCircle,
    title: "Watch or download",
    body: "Stream lectures securely in-browser or download PDFs, assignments, and practice files.",
  },
  {
    icon: Download,
    title: "Yours forever",
    body: "Once purchased, resources stay in your library. Access them anytime, on any device.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-40 pb-32">
          <div
            className="absolute inset-0 -z-10"
            style={{ background: "var(--gradient-radial)" }}
            aria-hidden
          />
          <div className="absolute inset-0 -z-10 grid-fade" aria-hidden />

          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
            >
              <Sparkles className="h-3 w-3 text-accent" />
              <span>Introducing Mahadevi — premium learning, simplified</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="mt-6 text-5xl md:text-7xl font-semibold tracking-tighter text-gradient leading-[1.05]"
            >
              Learn without limits.
              <br />
              Built for serious students.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed"
            >
              A hand-curated library of computer training, programming, and
              competitive-exam resources. No clutter. No distractions. Just the
              material you need to move forward.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="mt-10 flex items-center justify-center gap-3"
            >
              <Link
                to="/resources"
                className="group inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Browse resources
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface transition-colors"
              >
                Learn more
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Categories marquee */}
        <section className="border-y border-border py-6 overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap animate-[marquee_40s_linear_infinite]">
            {[...categories, ...categories, ...categories].map((c, i) => (
              <span
                key={i}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
              >
                {c} <span className="ml-8 text-border">/</span>
              </span>
            ))}
          </div>
          <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }`}</style>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
            className="max-w-2xl"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              What you get
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tighter">
              Built with care.
              <br />
              <span className="text-muted-foreground">Priced with respect.</span>
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="group relative rounded-2xl border border-border bg-surface p-6 hover:bg-surface-elevated transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-subtle grid place-items-center">
                  <f.icon className="h-4 w-4 text-accent" />
                </div>
                <h3 className="mt-6 text-base font-medium">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 pb-32">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-12 md:p-20 text-center">
            <div
              className="absolute inset-0 -z-10 opacity-60"
              style={{ background: "var(--gradient-radial)" }}
              aria-hidden
            />
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter">
              Ready when you are.
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-muted-foreground">
              Create a free account and start exploring the library today.
            </p>
            <Link
              to="/auth"
              className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
