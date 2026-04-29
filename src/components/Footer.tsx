import { Link } from "react-router-dom";
import { Sparkles, Book, Code2, HelpCircle, Github, Linkedin, Mail, Search, History as HistoryIcon, ShieldCheck, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="icon-pop flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-background">
                <img src="/favicon.png" alt="GitInsight AI" className="h-full w-full object-cover" />
              </div>
              <div className="font-display font-bold">
                GitInsight<span className="text-brand"> AI</span>
              </div>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              AI-powered platform for organizations to onboard, rank, and improve campus ambassadors using GitHub performance metrics.
            </p>
          </div>

          <FooterCol title="Product" links={[
            { to: "/analyze", label: "Analyze", icon: Search },
            { to: "/history", label: "History", icon: HistoryIcon },
          ]} />
          <FooterCol title="Legal" links={[
            { to: "/terms", label: "Terms of Service", icon: ShieldCheck },
            { to: "/privacy", label: "Privacy Policy", icon: FileText },
          ]} />
          <FooterCol title="Resources" links={[
            { to: "/documentation", label: "Documentation", icon: Book },
            { to: "/api", label: "API Reference", icon: Code2 },
            { to: "/faqs", label: "FAQ", icon: HelpCircle },
          ]} />

          {/* Developer Profile */}
          <div>
            <div className="mb-3 text-sm font-semibold">Developer</div>
            <div className="space-y-3">
              <a 
                href="https://github.com/KGFCH2" 
                target="_blank" 
                rel="noreferrer" 
                className="text-sm font-medium text-foreground hover:text-brand-1 hover:underline"
              >
                Babin Bid
              </a>
              <div className="flex flex-col gap-2">
                <a 
                  href="https://github.com/KGFCH2" 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                  <span className="text-xs">GitHub</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/babinbid123/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Linkedin className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                  <span className="text-xs">LinkedIn</span>
                </a>
                <a 
                  href="mailto:babinbid05@gmail.com"
                  className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                  <span className="text-xs">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} GitInsight AI · A Professional Developer Analytics Platform</div>
          <div className="font-mono">v1.2.0</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string; icon?: React.ComponentType<{ className?: string }> }[] }) {
  return (
    <div>
      <div className="mb-3 text-sm font-semibold">{title}</div>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground group">
              {l.icon && <l.icon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />}
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
