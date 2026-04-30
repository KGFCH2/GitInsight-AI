import { useEffect, useState } from "react";
import { Link, NavLink as RNavLink, useLocation, useParams } from "react-router-dom";
import { BookOpen, Github, History as HistoryIcon, Home as HomeIcon, Search, HelpCircle, BarChart3, Menu, X as CloseIcon, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/analyze", label: "Analyze", icon: Search, id: "analyze-link" },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/documentation", label: "Docs", icon: BookOpen },
];

export function Navbar() {
  const loc = useLocation();
  const { username: resultUsername } = useParams();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastUser, setLastUser] = useState<string | null>(null);
  const isOnResult = loc.pathname.startsWith("/result/");

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

  const handleAnalyzeClick = (e: React.MouseEvent) => {
    if (loc.pathname === "/analyze") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      const inputs = document.querySelectorAll("input");
      inputs.forEach(input => {
        if (input.placeholder.toLowerCase().includes("username")) {
          input.value = "";
          // Trigger a change event so React state updates
          const event = new Event("input", { bubbles: true });
          input.dispatchEvent(event);
          input.focus();
        }
      });
    }
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
            ? "mx-4 flex w-full max-w-5xl items-center rounded-full glass py-2 navbar-glow shadow-lg"
            : "w-full border-b border-brand-1/20 bg-transparent py-2 shadow-[0_1px_10px_-5px_hsl(var(--brand-1)/0.2)]"
        )}
      >
        <div className="container flex h-14 items-center justify-between px-6">
          <Link
            to="/"
            onClick={handleBrandClick}
            className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl transition-transform duration-300 group-hover:brightness-110">
              <img src="/favicon.png" alt="GitInsight AI" className="h-full w-full object-cover" />
            </div>
            <div className="hover-pop font-display text-lg font-bold leading-none">
              GitInsight<span className="text-brand"> AI</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const to = l.to;
              const isHome = l.to === "/";
              const isAnalyze = l.to === "/analyze";

              const handleLinkClick = (e: React.MouseEvent) => {
                if (isHome) handleHomeClick();
                if (isAnalyze) {
                  localStorage.removeItem("lastAnalyzedUser");
                  handleAnalyzeClick(e);
                }
              };

              return (
                <RNavLink
                  key={l.to}
                  to={to}
                  end={isHome}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/40 hover:text-foreground hover:shadow-sm",
                      (isActive || (isAnalyze && loc.pathname.startsWith("/result"))) &&
                      "bg-muted text-foreground shadow-sm",
                    )
                  }
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </RNavLink>
              );
            })}

            {/* Result Link - Only shows when viewing a result */}
            {isOnResult && resultUsername && (
              <RNavLink
                to={`/result/${resultUsername}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/40 hover:text-foreground hover:shadow-sm",
                    isActive && "bg-muted text-foreground shadow-sm",
                  )
                }
              >
                <BarChart3 className="h-4 w-4" />
                <span className="truncate max-w-[100px]">@{resultUsername}</span>
              </RNavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/admin"
              className="group icon-pop flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/40 transition-all duration-300 hover:-translate-y-1 hover:border-brand-1/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]"
              title="Admin Terminal"
            >
              <ShieldCheck className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:text-brand-1 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
            </Link>
            <a
              href="https://github.com/KGFCH2/GitInsight-AI"
              target="_blank"
              rel="noreferrer"
              className="group icon-pop flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/40 transition-all duration-300 hover:-translate-y-1 hover:border-brand-1/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:text-brand-1 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
            </a>
            
            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden ml-1"
              aria-label="Toggle Menu"
            >
              {isOpen ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-background/95 backdrop-blur-md md:hidden"
            >
              <div className="container flex flex-col gap-1 p-4 border-t border-border/50">
                {links.map((l) => (
                  <RNavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors",
                        isActive ? "bg-brand/10 text-brand-1" : "text-muted-foreground hover:bg-muted/50"
                      )
                    }
                  >
                    <l.icon className="h-4 w-4" />
                    {l.label}
                  </RNavLink>
                ))}
                {isOnResult && resultUsername && (
                  <RNavLink
                    to={`/result/${resultUsername}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-muted/50"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Current: @{resultUsername}
                  </RNavLink>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
