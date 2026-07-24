import { Link } from "@tanstack/react-router";

const platformLinks = [
  { to: "/resources", label: "Browse Resources" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const legalLinks = [
  { to: "/terms", label: "Terms of Service" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/refund", label: "Refund Policy" },
];

export function Footer() {
  return (
    <footer className="mt-24 sm:mt-32">
      {/* Top divider with fade */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand block */}
          <div className="sm:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Payal Education Society"
                className="h-8 w-auto object-contain grayscale opacity-60 invert group-hover:opacity-90 transition-opacity duration-200"
              />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                Payal Education Society Computers
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Premium educational resources for computer training, programming,
              and competitive exams — curated for serious learners.
            </p>
            <p className="mt-6 text-xs font-mono text-muted-foreground/50 tracking-wider">
              OWNER: SUBHASH
            </p>
          </div>

          {/* Platform links */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-5">
              Platform
            </p>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-5">
              Legal
            </p>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Payal Education Society. All rights reserved.
          </p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/30">
            Built with craft
          </p>
        </div>
      </div>
    </footer>
  );
}
