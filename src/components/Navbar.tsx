import { useEffect, useState } from "react";
import { Link, NavLink as RNavLink, useLocation } from "react-router-dom";
import { Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/analyze", label: "Analyze" },
  { to: "/history", label: "History" },
  { to: "/documentation", label: "Docs" },
];

export function Navbar() {
  const loc = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [lastUser, setLastUser] = useState<string | null>(null);

  useEffect(() => {
    // Check for last analyzed user on mount and location change
    const stored = localStorage.getItem("lastAnalyzedUser");
    setLastUser(stored);
  }, [loc.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBrandClick = () => {
    localStorage.removeItem("lastAnalyzedUser");
    setLastUser(null);
    if (loc.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleHomeClick = () => {
    localStorage.removeItem("lastAnalyzedUser");
    setLastUser(null);
  };

  return (
    <div 
      className={cn(
        "sticky top-0 z-40 flex w-full justify-center transition-all duration-500",
        scrolled ? "pt-4" : "pt-0"
      )}
    >
      <header 
        className={cn(
          "transition-all duration-500",
          scrolled 
            ? "mx-4 flex w-full max-w-5xl items-center rounded-full border border-border/40 bg-background/40 py-2 shadow-glow-intense backdrop-blur-2xl" 
            : "w-full border-b border-border/0 bg-transparent py-2"
        )}
      >
        <div className="container flex h-14 items-center justify-between px-6">
          <Link 
            to="/" 
            onClick={handleBrandClick}
            className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="icon-pop relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-background shadow-glow transition-transform duration-300 group-hover:rotate-6">
              <img src="/favicon.png" alt="GitInsight AI" className="h-full w-full object-cover" />
            </div>
            <div className="hover-pop font-display text-lg font-bold leading-none">
              GitInsight<span className="text-brand"> AI</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const to = (l.to === "/analyze" && lastUser) ? `/result/${lastUser}` : l.to;
              const isHome = l.to === "/";
              
              return (
                <RNavLink
                  key={l.to}
                  to={to}
                  end={isHome}
                  onClick={isHome ? handleHomeClick : undefined}
                  className={({ isActive }) =>
                    cn(
                      "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/40 hover:text-foreground hover:shadow-sm",
                      (isActive || (l.to === "/analyze" && loc.pathname.startsWith("/result"))) &&
                        "bg-muted text-foreground shadow-sm",
                    )
                  }
                >
                  {l.label}
                </RNavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="https://github.com/KGFCH2/GitInsight-AI"
              target="_blank"
              rel="noreferrer"
              className="icon-pop flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-1/80 hover:bg-muted hover:shadow-glow-intense"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}
