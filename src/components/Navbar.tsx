import { Link, NavLink as RNavLink, useLocation } from "react-router-dom";
import { Github, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/analyze", label: "Analyze" },
  { to: "/history", label: "History" },
  { to: "/docs", label: "Docs" },
];

export function Navbar() {
  const loc = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-background shadow-glow transition-transform duration-300 group-hover:rotate-6">
            <img src="/favicon.png" alt="GitInsight AI" className="h-full w-full object-cover" />
          </div>
          <div className="font-display text-lg font-bold leading-none">
            GitInsight<span className="text-brand"> AI</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <RNavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted hover:text-foreground hover:shadow-sm",
                  (isActive || (l.to === "/analyze" && loc.pathname.startsWith("/result"))) &&
                    "bg-muted text-foreground shadow-sm",
                )
              }
            >
              {l.label}
            </RNavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-1/60 hover:bg-muted hover:shadow-glow sm:inline-flex"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
