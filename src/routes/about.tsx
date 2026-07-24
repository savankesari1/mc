import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import ProfileCard from "@/components/ProfileCard";
import { GraduationCap, Users, BookOpen, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Payal Education Society Computers" },
      {
        name: "description",
        content:
          "About Payal Education Society Computers & Education Center — curated learning resources by Subhash.",
      },
    ],
  }),
  component: AboutPage,
});

const easeOut = [0.23, 1, 0.32, 1] as const;

const values = [
  {
    icon: GraduationCap,
    title: "Quality above all",
    body: "Every resource is selected because it teaches something genuinely worth knowing. No filler, no fluff.",
  },
  {
    icon: Award,
    title: "Permanent access",
    body: "You pay once and own it forever. No subscriptions, no expiry dates, no gotchas.",
  },
  {
    icon: BookOpen,
    title: "Curriculum-aligned",
    body: "Content is built around what Indian students actually need — vocational, competitive, and practical.",
  },
  {
    icon: Users,
    title: "Community-first",
    body: "A small, serious library with real attention paid to every learner who joins.",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOut },
  },
};

function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">

        {/* Hero */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 pt-32 sm:pt-40 pb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.p
              variants={itemVariants}
              className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground/60"
            >
              About
            </motion.p>
            <motion.h1
              variants={itemVariants}
              className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter leading-[1.08]"
            >
              Learning, done right.
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              Payal Education Society Computers & Education Center is a small,
              opinionated library of learning resources curated by Subhash. Every
              video, PDF, and assignment on this platform was chosen because it
              teaches something worth learning — nothing more, nothing less.
            </motion.p>
          </motion.div>
        </section>

        {/* Values grid */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-20 sm:pb-24">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-16" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-10"
          >
            Our principles
          </motion.p>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: easeOut }}
                className="group relative p-6 sm:p-7 rounded-2xl border border-border/40 bg-surface/20 hover:bg-surface/40 hover:border-border/80 transition-[background,border-color,transform] duration-300 hover:scale-[1.015]"
              >
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/8 grid place-items-center mb-5 transition-[background,transform] duration-300 group-hover:bg-white/10 group-hover:scale-110">
                  <v.icon className="h-4.5 w-4.5 text-white/60 group-hover:text-white/90 transition-colors duration-300" />
                </div>
                <h3 className="text-base font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Curator section */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-24 sm:pb-32">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-16" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-10">
              The curator
            </p>
            <div className="flex justify-center">
              <ProfileCard
                name="Subhash"
                title="Curator & Educator"
                handle="subhash"
                status="Online"
                contactText="Contact Me"
                avatarUrl="/avatar.png"
                enableTilt={true}
                enableMobileTilt
                onContactClick={() => console.log("Contact clicked")}
                behindGlowEnabled
                innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
              />
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </>
  );
}
