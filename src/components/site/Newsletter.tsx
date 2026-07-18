import { useState } from "react";
import { z } from "zod";
import { emailSchema } from "@/lib/validation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const parsed = emailSchema.parse(email);
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: parsed });
      if (error && !error.message.includes("duplicate")) throw error;
      toast.success("Subscribed. Thanks!");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof z.ZodError ? "Invalid email" : (err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={subscribe} className="flex gap-2 max-w-md">
      <Input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 rounded-full"
        required
      />
      <Button type="submit" disabled={busy} className="rounded-full h-11 px-5">
        {busy ? "…" : "Subscribe"}
      </Button>
    </form>
  );
}
