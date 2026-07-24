import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Download,
  PlayCircle,
  Code,
  Terminal,
  Zap,
  BookOpen,
} from "lucide-react";
import { lazy, Suspense, useState, useEffect } from "react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

// Lazy-load so Three.js never runs during SSR
const FloatingLines = lazy(() => import("@/components/ui/FloatingLines"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Payal Education Society Computers — Premium learning resources" },
      {
        name: "description",
        content:
          "Curated, premium educational resources for computer training, programming, competitive exams, and more. Learn at your own pace.",
      },
      { property: "og:title", content: "Payal Education Society Computers — Premium learning resources" },
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
    colSpan: "md:col-span-2",
    accent: "from-indigo-500/10 to-transparent",
  },
  {
    icon: PlayCircle,
    title: "Watch or download",
    body: "Stream lectures in-browser or download PDFs, assignments, and practice files.",
    colSpan: "md:col-span-1",
    accent: "from-violet-500/10 to-transparent",
  },
  {
    icon: Download,
    title: "Yours forever",
    body: "Once purchased, resources stay in your library — on any device, anytime.",
    colSpan: "md:col-span-1",
    accent: "from-pink-500/10 to-transparent",
  },
  {
    icon: Code,
    title: "Project-based",
    body: "Learn by building real-world projects you can add to your portfolio.",
    colSpan: "md:col-span-2",
    accent: "from-cyan-500/10 to-transparent",
  },
  {
    icon: Terminal,
    title: "Developer focused",
    body: "Content designed with modern frameworks, tools, and best practices in mind.",
    colSpan: "md:col-span-1",
    accent: "from-emerald-500/10 to-transparent",
  },
  {
    icon: Zap,
    title: "Instant access",
    body: "Skip the fluff. Get straight to the core concepts and start learning immediately.",
    colSpan: "md:col-span-1",
    accent: "from-amber-500/10 to-transparent",
  },
  {
    icon: BookOpen,
    title: "Structured learning",
    body: "Follow clear learning paths built for beginners through advanced learners.",
    colSpan: "md:col-span-1",
    accent: "from-indigo-500/10 to-transparent",
  },
];

// Strong ease-out — the "feels alive" curve (Emil Kowalski)
const easeOut = [0.23, 1, 0.32, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: easeOut },
  },
};

function Home() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  const reduce = useReducedMotion();

  return (
    <div className="bg-background relative selection:bg-accent/30 selection:text-accent-foreground">
      <Header />
      <main className="overflow-x-hidden">

        {/* ─── HERO ───────────────────────────────────────────────────────────── */}
        <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden pt-24 border-b border-border">

          {/* FloatingLines WebGL — client-only, SSR-safe */}
          {isClient && !reduce && (
            <div className="absolute inset-0 z-0">
              <Suspense fallback={null}>
                <FloatingLines
                  enabledWaves={['top', 'middle', 'bottom']}
                  lineCount={5}
                  lineDistance={4.5}
                  bendRadius={4.5}
                  bendStrength={-0.5}
                  interactive={true}
                  parallax={true}
                  animationSpeed={1}
                  mixBlendMode="screen"
                />
              </Suspense>
            </div>
          )}

          {/* Readability gradient layers — let lines bleed through centre */}
          <div className="absolute inset-0 z-[5] pointer-events-none bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,transparent_20%,oklch(0.13_0.005_240/70%)_80%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-48 z-[5] pointer-events-none bg-gradient-to-t from-background to-transparent" />

          {/* Content */}
          <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 text-center">

            {/* Intro badge */}
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.9, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] sm:text-xs text-foreground/80 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] mb-8"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span className="font-medium tracking-wide">
                Payal Education Society — premium learning, simplified
              </span>
            </motion.div>

            {/* Headline staggered */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl leading-[1.04]"
              >
                Learn without limits.
              </motion.h1>
              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-muted-foreground leading-[1.1] mt-2"
              >
                Built for serious students.
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed"
              >
                A hand-curated library of computer training, programming, and
                competitive-exam resources. No clutter. Just the material you need.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
              >
                <Link
                  to="/resources"
                  className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 text-sm font-semibold text-black transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(255,255,255,0.25)] active:scale-[0.97] w-full sm:w-auto"
                >
                  <span className="relative z-10">Browse resources</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  {/* Neutral shimmer on hover — no purple */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border/60 bg-white/5 backdrop-blur-md px-8 text-sm font-medium text-foreground transition-[transform,background,border-color] duration-200 ease-out hover:bg-white/10 hover:border-border hover:scale-[1.03] active:scale-[0.97] w-full sm:w-auto"
                >
                  Learn more
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ─── MARQUEE ────────────────────────────────────────────────────────── */}
        <section className="border-b border-border py-5 sm:py-7 overflow-hidden bg-background relative z-20">
          <div className="flex gap-10 sm:gap-12 whitespace-nowrap animate-[marquee_24s_linear_infinite]">
            {[...categories, ...categories, ...categories, ...categories].map((c, i) => (
              <span
                key={i}
                className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground/50 transition-colors duration-200 hover:text-foreground/80 cursor-default"
              >
                {c} <span className="ml-10 sm:ml-12 text-border">/</span>
              </span>
            ))}
          </div>
          <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-25%); } }`}</style>
        </section>

        {/* ─── FEATURES BENTO ──────────────────────────────────────────────────── */}
        <section className="relative bg-background py-20 sm:py-28 overflow-hidden">
          {/* Ambient glow behind the grid */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/8 rounded-full blur-[140px] -z-10 pointer-events-none" />

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            {/* Section heading */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="max-w-xl mb-14 sm:mb-20"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-surface/30 px-3 py-1 text-[10px] sm:text-xs text-indigo-400 font-mono uppercase tracking-widest mb-5">
                What you get
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter leading-[1.1]">
                Built with care.
                <br />
                <span className="text-muted-foreground">Priced with respect.</span>
              </h2>
            </motion.div>

            {/* Asymmetric bento grid */}
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={reduce ? false : { opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: reduce ? 0 : i * 0.07, ease: easeOut }}
                  className={`group relative flex flex-col rounded-2xl sm:rounded-3xl border border-border/40 bg-surface/20 backdrop-blur-xl p-5 sm:p-7 hover:bg-surface/40 hover:border-border/80 transition-[background,border-color,transform,box-shadow] duration-300 hover:scale-[1.015] hover:shadow-[0_8px_40px_-8px_oklch(0_0_0/50%)] cursor-default overflow-hidden ${f.colSpan}`}
                >
                  {/* Per-card accent glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-60 pointer-events-none`} />
                  {/* Hover shimmer top line */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

                  <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/8 grid place-items-center transition-[transform,background] duration-300 group-hover:scale-110 group-hover:bg-white/10">
                    <f.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white/60 transition-colors duration-300 group-hover:text-white/90" />
                  </div>
                  <h3 className="relative mt-5 sm:mt-6 text-base sm:text-lg font-semibold text-white">{f.title}</h3>
                  <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">
                    {f.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CALL TO ACTION ──────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-20 sm:pb-28">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-border/50 bg-surface/30 backdrop-blur-lg p-10 sm:p-16 md:p-20 text-center shadow-2xl"
          >
            {/* Radial glow */}
            <div
              className="absolute inset-0 -z-10 opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"
              aria-hidden
            />
            {/* Top inner border highlight */}
            <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white drop-shadow-md">
              Ready when you are.
            </h2>
            <p className="mt-4 sm:mt-5 max-w-md mx-auto text-sm sm:text-base text-muted-foreground">
              Create a free account and start exploring the library today.
            </p>
            <Link
              to="/auth"
              className="group mt-8 sm:mt-10 inline-flex h-12 sm:h-13 items-center justify-center gap-2 rounded-full bg-white px-9 sm:px-11 text-sm sm:text-base font-semibold text-black transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] active:scale-[0.97]"
            >
              Get started
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
