import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/60">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-4">
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
              AI-powered GitHub profile analyzer with recruiter-grade insights and gamified feedback.
            </p>
          </div>

          <FooterCol title="Product" links={[
            { to: "/analyze", label: "Analyze" },
            { to: "/history", label: "History" },
            { to: "/docs", label: "Documentation" },
            { to: "/docs#faq", label: "FAQs" },
          ]} />
          <FooterCol title="Legal" links={[
            { to: "/terms", label: "Terms of Service" },
            { to: "/privacy", label: "Privacy Policy" },
          ]} />
          <FooterCol title="Resources" links={[
            { to: "/docs", label: "Getting Started" },
            { to: "/docs#api", label: "API Reference" },
            { to: "/docs#faq", label: "FAQ" },
          ]} />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} GitInsight AI. Built for developers.</div>
          <div className="font-mono">v1.0.0</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="mb-3 text-sm font-semibold">{title}</div>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
