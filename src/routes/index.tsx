import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Download, PlayCircle, Code, Terminal, Zap } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useState, useEffect } from "react";

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
    body: "Every resource is hand-picked and reviewed for quality.",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    icon: PlayCircle,
    title: "Watch or download",
    body: "Stream lectures securely or download PDFs and practice files.",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: Download,
    title: "Yours forever",
    body: "Once purchased, resources stay in your library.",
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: Code,
    title: "Project-based",
    body: "Learn by building real-world projects that you can add to your portfolio.",
    colSpan: "md:col-span-2 lg:col-span-2",
  },
];

const easeOut = [0.23, 1, 0.32, 1] as const;

function Home() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  const reduce = useReducedMotion();

  return (
    <div className="bg-background relative selection:bg-accent/30 selection:text-accent-foreground">
      <Header />
      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden pt-16 border-b border-border/40">
          {/* Subtle noise and glow */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-white/[0.04] to-transparent pointer-events-none" />
          
          <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            <div className="flex-1">
              {/* Badge */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: easeOut }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] sm:text-xs text-foreground/80 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] mb-8"
              >
                <Sparkles className="h-3 w-3 text-white/70" />
                <span className="font-medium tracking-wide">Introducing premium learning</span>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center lg:items-start"
              >
                <motion.h1
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-white leading-[1.05]"
                >
                  Learn without limits.
                </motion.h1>
                <motion.h1
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-muted-foreground leading-[1.05] mt-2"
                >
                  Built for serious students.
                </motion.h1>
              </motion.div>

              {/* Subtext */}
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: easeOut }}
                className="mt-6 max-w-lg mx-auto lg:mx-0 text-base sm:text-lg text-muted-foreground leading-relaxed"
              >
                A hand-curated library of computer training, programming, and
                competitive-exam resources. No clutter. No distractions.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: easeOut }}
                className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <Link
                  to="/resources"
                  className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 text-sm font-medium text-black transition-[transform,filter,opacity] duration-200 ease-out hover:bg-neutral-200 active:scale-[0.97] w-full sm:w-auto"
                >
                  Browse resources
                </Link>
                <Link
                  to="/about"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border/40 bg-surface/10 backdrop-blur-md px-8 text-sm font-medium text-foreground transition-[transform,background,border] duration-200 ease-out hover:bg-surface/30 hover:border-border/80 active:scale-[0.97] w-full sm:w-auto"
                >
                  Learn more
                </Link>
              </motion.div>
            </div>
            
            {/* Hero Visual Placeholder (Minimalist Asset) */}
            <motion.div 
              initial={reduce ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: easeOut }}
              className="flex-1 w-full max-w-md lg:max-w-none hidden md:block"
            >
              <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent shadow-2xl backdrop-blur-xl">
                 <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono text-sm tracking-widest uppercase">
                   Visual Asset Space
                 </div>
              </div>
            </motion.div>
            
          </div>
        </section>

        {/* Categories marquee */}
        <section className="border-b border-border/40 py-6 overflow-hidden bg-background relative z-20">
          <div className="flex gap-12 whitespace-nowrap animate-[marquee_25s_linear_infinite]">
            {[...categories, ...categories, ...categories, ...categories].map((c, i) => (
              <span
                key={i}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground/40 transition-colors duration-300 hover:text-foreground cursor-default"
              >
                {c} <span className="ml-12 text-border/40">/</span>
              </span>
            ))}
          </div>
          <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-25%); } }`}</style>
        </section>

        {/* Features Bento Grid */}
        <section className="relative bg-background py-24 sm:py-32 overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="max-w-2xl mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter leading-[1.1] text-white">
                Built with care. <br/>
                <span className="text-muted-foreground">Priced with respect.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: reduce ? 0 : i * 0.08,
                    ease: easeOut,
                  }}
                  className={`group relative flex flex-col rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 ${f.colSpan}`}
                >
                  <div className="h-12 w-12 mb-6 rounded-2xl bg-white/5 border border-white/10 grid place-items-center transition-[transform,background] duration-300 group-hover:scale-110 group-hover:bg-white/10">
                    <f.icon className="h-5 w-5 text-white/70 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-white tracking-tight">{f.title}</h3>
                  <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                    {f.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-24 sm:pb-32">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-surface/30 p-12 md:p-20 text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white">
              Ready when you are.
            </h2>
            <p className="mt-5 max-w-md mx-auto text-base text-muted-foreground">
              Create a free account and start exploring the library today.
            </p>
            <Link
              to="/auth"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-medium text-black transition-[transform,filter,opacity] duration-200 ease-out hover:bg-neutral-200 active:scale-[0.97]"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
