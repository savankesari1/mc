import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingPaths } from "@/components/ui/background-paths";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(4000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mahadevi Computers" },
      { name: "description", content: "Get in touch with Mahadevi Computers & Education Center." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = schema.parse(form);
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
      toast.error(err instanceof z.ZodError ? err.issues[0].message : (err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
      
      {/* Gradient overlay to ensure text is readable over the lines */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/60 to-background/95 pointer-events-none" />

      <div className="relative z-10">
        <Header />
        <main className="mx-auto max-w-5xl px-6 pt-32 pb-24 min-h-screen">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Contact</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tighter">Say hello.</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Questions about a resource, custom coaching, or partnerships? Send a note.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <ContactCard icon={Mail} label="Email" value="mahadevicomputers@gmail.com" />
            <ContactCard icon={Phone} label="Phone" value="+91 91645 54716" />
            <ContactCard icon={MapPin} label="Location" value="Mahadevi Computers & Education Center" />
          </div>

          <form onSubmit={submit} className="lg:col-span-3 space-y-4 rounded-2xl border border-border/40 bg-surface/30 backdrop-blur-xl p-8 shadow-xl transition-all duration-300 hover:bg-surface/50">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" maxLength={100} required /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" maxLength={255} required /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Phone (optional)</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" maxLength={20} /></div>
              <div><Label>Subject (optional)</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1.5" maxLength={200} /></div>
            </div>
            <div><Label>Message</Label><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1.5 min-h-32" maxLength={4000} required /></div>
            <Button type="submit" disabled={busy} className="rounded-full">{busy ? "Sending…" : "Send message"}</Button>
          </form>
        </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function ContactCard({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-surface/30 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:bg-surface/50 hover:shadow-2xl">
      <div className="h-10 w-10 rounded-xl bg-accent/10 grid place-items-center backdrop-blur-md">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <div className="mt-5 text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-base font-medium">{value}</div>
    </div>
  );
}
