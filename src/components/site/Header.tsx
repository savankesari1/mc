import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAuth, useUserRole } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const nav = [
  { to: "/resources", label: "Resources" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const easeOut = [0.23, 1, 0.32, 1] as const;

export function Header() {
  const { isAuthenticated, user, loading } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [navigate]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: easeOut }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-4">
          <div
            className={`rounded-full flex items-center justify-between px-4 sm:px-5 py-2.5 transition-[background,border-color,backdrop-filter,box-shadow] duration-300 border ${
              scrolled
                ? "bg-background/80 backdrop-blur-xl border-border/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]"
                : "bg-white/5 backdrop-blur-md border-white/8"
            }`}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 group">
              <img
                src="/logo.png"
                alt="Payal Education Society"
                className="h-9 w-auto object-contain invert opacity-90 group-hover:opacity-100 transition-opacity duration-200"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-full"
                  activeProps={{ className: "relative px-3.5 py-1.5 text-sm text-foreground rounded-full" }}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-white/8 border border-white/10"
                          transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </>
                  )}
                </Link>
              ))}
              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  className="relative px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-full"
                  activeProps={{ className: "relative px-3.5 py-1.5 text-sm text-foreground rounded-full" }}
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right: auth + mobile toggle */}
            <div className="flex items-center gap-2">
              {loading ? (
                <div className="h-7 w-20 rounded-full bg-white/8 animate-pulse" />
              ) : isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
                    title={user?.email ?? ""}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1 rounded-full bg-foreground text-background text-sm font-medium px-4 py-1.5 transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.97]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-1 rounded-full bg-foreground text-background text-sm font-semibold px-4 py-1.5 transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.97]"
                  >
                    Get started
                  </Link>
                </>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden ml-1 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors duration-150"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle navigation"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <motion.div
            initial={false}
            animate={mobileOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="md:hidden overflow-hidden mt-2"
          >
            <div className="rounded-3xl border border-border/60 bg-background/90 backdrop-blur-xl px-4 py-3 space-y-0.5">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-2xl hover:bg-white/5 transition-colors duration-150"
                  activeProps={{ className: "block px-3 py-2.5 text-sm text-foreground rounded-2xl bg-white/8" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-2xl hover:bg-white/5 transition-colors duration-150"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
              )}
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-2xl hover:bg-white/5 transition-colors duration-150"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
              ) : null}
            </div>
          </motion.div>
        </div>
      </motion.header>
    </>
  );
}
