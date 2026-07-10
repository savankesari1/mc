import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-foreground text-background grid place-items-center font-mono text-xs font-semibold">
              M
            </div>
            <span className="text-sm font-medium">Mahadevi Computers</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
            Premium educational resources for computer training, programming,
            competitive exams, and beyond.
          </p>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Platform
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">Browse</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Legal
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
            <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Mahadevi Computers & Education Center. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-mono">Owned by Subhash</p>
        </div>
      </div>
    </footer>
  );
}
