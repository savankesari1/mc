import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth, useUserRole } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const nav = [
  { to: "/resources", label: "Resources" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { isAuthenticated, user, loading } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-6 pt-4">
        <div className="glass rounded-full flex items-center justify-between px-5 py-2.5">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Payal Education Center Logo" className="h-8 w-auto object-contain" />
            <span className="text-sm font-medium tracking-tight">Payal Education Center</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full"
                activeProps={{ className: "text-foreground" }}
              >
                Admin
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="h-7 w-20 rounded-full bg-surface animate-pulse" />
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
                  className="inline-flex items-center gap-1 rounded-full bg-foreground text-background text-sm font-medium px-4 py-1.5 hover:opacity-90 transition-opacity"
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
                  className="inline-flex items-center gap-1 rounded-full bg-foreground text-background text-sm font-medium px-4 py-1.5 hover:opacity-90 transition-opacity"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
