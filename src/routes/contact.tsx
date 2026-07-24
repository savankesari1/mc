import { createFileRoute } from "@tanstack/react-router";
import { useState, lazy, Suspense, useEffect } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { contactFormSchema } from "@/lib/validation";

const DotField = lazy(() => import("@/components/ui/DotField"));

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Payal Education Society Computers" },
      {
        name: "description",
        content: "Get in touch with Payal Education Society Computers & Education Center.",
      },
    ],
  }),
  component: ContactPage,
});

const easeOut = [0.23, 1, 0.32, 1] as const;

const contactDetails = [
  { icon: Mail, label: "Email", value: "payaleducationsocietycomputers@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 91645 54716" },
  { icon: MapPin, label: "Location", value: "Payal Education Society Computers & Education Center" },
];

function ContactCard({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="group flex items-start gap-4 p-5 rounded-2xl border border-border/40 bg-surface/20 hover:bg-surface/40 hover:border-border/80 transition-[background,border-color,transform] duration-300 hover:scale-[1.01]">
      <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/8 grid place-items-center transition-[background,transform] duration-300 group-hover:bg-white/10 group-hover:scale-110">
        <Icon className="h-4.5 w-4.5 text-white/60 group-hover:text-white/90 transition-colors duration-300" />
      </div>
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">{label}</p>
        <p className="mt-1 text-sm font-medium text-foreground leading-snug">{value}</p>
      </div>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = contactFormSchema.parse(form);
      const { error } = await supabase.from("contact_submissions").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
      });
      if (error) throw error;
      toast.success("Message sent. We'll be in touch.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.issues[0].message);
      } else {
        console.error("[Contact] Submit failed:", err);
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* DotField bg — client only */}
      {isClient && (
        <div className="absolute inset-0 z-0 opacity-50">
          <Suspense fallback={null}>
            <DotField
              dotRadius={1}
              dotSpacing={28}
              cursorRadius={180}
              cursorForce={0.06}
              bulgeOnly={true}
              bulgeStrength={30}
              glowRadius={100}
              sparkle={false}
              gradientFrom="rgba(255,255,255,0.5)"
              gradientTo="rgba(255,255,255,0.08)"
              glowColor="#0d0e14"
            />
          </Suspense>
        </div>
      )}
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 z-[2] bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="relative z-10">
        <Header />

        <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-32 sm:pt-40 pb-24 sm:pb-32 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <p className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground/60">
              Contact
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tighter">
              Say hello.
            </h1>
            <p className="mt-4 max-w-lg text-muted-foreground text-sm sm:text-base leading-relaxed">
              Questions about a resource, custom coaching, or partnerships? Send a note.
            </p>
          </motion.div>

          <div className="mt-12 sm:mt-14 grid gap-6 lg:grid-cols-5">
            {/* Contact details */}
            <motion.div
              className="lg:col-span-2 space-y-4"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
            >
              {contactDetails.map((c) => (
                <ContactCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
              ))}
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={submit}
              className="lg:col-span-3 rounded-3xl border border-border/50 bg-surface/20 backdrop-blur-xl p-6 sm:p-8 space-y-5 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.5)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: easeOut }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1.5 rounded-xl border-border/50 bg-white/5 focus:border-white/20 transition-colors"
                    maxLength={100}
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1.5 rounded-xl border-border/50 bg-white/5 focus:border-white/20 transition-colors"
                    maxLength={255}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Phone (optional)</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1.5 rounded-xl border-border/50 bg-white/5 focus:border-white/20 transition-colors"
                    maxLength={20}
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Subject (optional)</Label>
                  <Input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="mt-1.5 rounded-xl border-border/50 bg-white/5 focus:border-white/20 transition-colors"
                    maxLength={200}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Message</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1.5 min-h-32 rounded-xl border-border/50 bg-white/5 focus:border-white/20 transition-colors resize-none"
                  maxLength={4000}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 h-11 rounded-full bg-white text-black text-sm font-semibold px-7 transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? (
                  "Sending…"
                ) : (
                  <><Send className="h-3.5 w-3.5" /> Send message</>
                )}
              </button>
            </motion.form>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
