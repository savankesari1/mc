import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import ProfileCard from "@/components/ProfileCard";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Payal Education Society Computers" },
      { name: "description", content: "About Payal Education Society Computers & Education Center — curated learning resources by Subhash." },
    ],
  }),
  component: () => (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-40 pb-32 min-h-screen">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">About</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tighter">Learning, done right.</h1>
        <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
          Payal Education Society Computers & Education Center is a small, opinionated library of learning resources
          curated by Subhash. Every video, PDF, and assignment on this platform was chosen because it
          teaches something worth learning.
        </p>
        <div className="mt-16 flex justify-center">
          <ProfileCard
            name="Subhash"
            title="Curator & Educator"
            handle="subhash"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/avatar.png"
            showUserInfo
            enableTilt={true}
            enableMobileTilt
            onContactClick={() => console.log('Contact clicked')}
            behindGlowEnabled
            innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
          />
        </div>
      </main>
      <Footer />
    </>
  ),
});
