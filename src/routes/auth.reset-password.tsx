import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Lazy load DotField so it never runs during SSR
const DotField = lazy(() => import("@/components/ui/DotField"));

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Payal Education Society Computers" },
      { name: "description", content: "Set a new password for your Payal Education Society Computers account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false); // true when Supabase has set the recovery session
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setIsClient(true); }, []);

  // Supabase fires PASSWORD_RECOVERY when the user arrives from the reset email link.
  // The SDK automatically parses the token from the URL hash and sets the session.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setReady(true);
      }
      // If already signed in normally (shouldn't happen here, but guard anyway)
      if (event === "SIGNED_IN" && session) {
        setReady(true);
      }
    });

    // Also check if there's already a session (page reload case)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully! Redirecting…");
      setTimeout(() => navigate({ to: "/dashboard" }), 1500);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to update password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {isClient && (
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <DotField
              dotRadius={3.5}
              dotSpacing={7}
              bulgeStrength={98}
              glowRadius={240}
              sparkle={false}
              waveAmplitude={0}
              cursorRadius={650}
              cursorForce={0.14}
              gradientFrom="rgba(255, 255, 255, 0.55)"
              gradientTo="rgba(255, 255, 255, 0.18)"
              glowColor="#0d0b14"
            />
          </Suspense>
        </div>
      )}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/60 to-background/95 pointer-events-none" />

      <div className="relative z-10">
        <Header />
        <main className="mx-auto max-w-md px-6 pt-36 pb-24 min-h-screen flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-border/40 bg-surface/30 backdrop-blur-xl p-8 shadow-2xl"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Security
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tighter">
              {ready ? "Set new password" : "Verifying link…"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {ready
                ? "Choose a strong password for your account."
                : "Please wait while we verify your reset link."}
            </p>

            {ready ? (
              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <Label htmlFor="new-password">New password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-surface/30 backdrop-blur-sm border-border/60 pr-10"
                      required
                      minLength={8}
                      maxLength={72}
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="h-11 bg-surface/30 backdrop-blur-sm border-border/60 pr-10"
                      required
                      minLength={8}
                      maxLength={72}
                      placeholder="Repeat your password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Password strength hint */}
                {password.length > 0 && (
                  <PasswordStrength password={password} />
                )}

                <Button
                  type="submit"
                  className="w-full h-11 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={busy}
                >
                  {busy ? "Updating…" : "Update password"}
                </Button>
              </form>
            ) : (
              <div className="mt-7 flex justify-center">
                <div className="h-6 w-6 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
              </div>
            )}
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const strengthLabel = ["Weak", "Fair", "Good", "Strong"][score - 1] ?? "Too short";
  const strengthColor =
    score <= 1 ? "bg-red-500" : score === 2 ? "bg-orange-400" : score === 3 ? "bg-yellow-400" : "bg-emerald-500";

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? strengthColor : "bg-border"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Strength: <span className="text-foreground font-medium">{strengthLabel}</span>
      </p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((c) => (
          <li key={c.label} className={`text-xs flex items-center gap-1 ${c.pass ? "text-emerald-400" : "text-muted-foreground"}`}>
            <span>{c.pass ? "✓" : "○"}</span> {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
