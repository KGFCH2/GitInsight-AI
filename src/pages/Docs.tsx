import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book, Code2, FileQuestion, Rocket, BarChart3, ShieldCheck, Cpu, Users, TrendingUp, Download, Key, Tags, Lock, Zap } from "lucide-react";

const faqs = [
  {
    q: "How is the profile score calculated?",
    a: "We score across six dimensions: popularity (stars + forks), activity (recent commits), breadth (languages used), quality (descriptions, topics, licenses), community (followers), and tenure (account age). Total is capped at 100.",
    icon: BarChart3,
  },
  {
    q: "Is my data stored?",
    a: "No. We fetch your public GitHub data on-demand and pass it through our analyzer. Nothing is persisted on our servers.",
    icon: ShieldCheck,
  },
  {
    q: "Which AI model powers the insights?",
    a: "Google Gemini is the primary model. If unavailable, we fall back to Groq (Llama 3.3 70B). Both are called directly from your browser using your provided API keys.",
    icon: Cpu,
  },
  {
    q: "Can I analyze any GitHub user?",
    a: "Yes — any public GitHub username. Private repos are not visible to us.",
    icon: Users,
  },
  {
    q: "How do I improve my score quickly?",
    a: "Add descriptions, topics, and licenses to your top repos. Pin your best work. Push consistently. The Action Steps tab gives personalized advice.",
    icon: TrendingUp,
  },
  {
    q: "Can I export the report?",
    a: "Yes — click the Export PDF button on any result page to download a polished report card.",
    icon: Download,
  },
  {
    q: "What happens if I don't provide an API key?",
    a: "The app will still calculate your score and classify your repositories using deterministic logic, but you won't get AI-powered insights or the recruiter view.",
    icon: Key,
  },
  {
    q: "How does the 'Good / Improve / Archive' classification work?",
    a: "Our algorithm analyzes repo age, recent activity, star count, and documentation completeness to categorize them. 'Good' repos are active and well-maintained.",
    icon: Tags,
  },
  {
    q: "Can I use this for private repositories?",
    a: "Currently, GitInsight AI only analyzes public data. Support for private repositories would require a GitHub OAuth flow which is not implemented in this version.",
    icon: Lock,
  },
  {
    q: "Is there a limit to how many profiles I can analyze?",
    a: "The limit is primarily determined by your GitHub API token rate limits. For public tokens, it's quite generous, but you can always provide your own token for higher limits.",
    icon: Zap,
  },
];

const Docs = () => {
  const [open, setOpen] = useState<string | undefined>("item-0");
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-brand">Documentation</div>
        <h1 className="hover-pop mt-2 font-display text-4xl font-bold sm:text-5xl">Everything you need to know</h1>
        <p className="mt-3 text-muted-foreground">Learn how GitInsight AI works, and how to get the most out of your profile report.</p>

        {/* Getting Started */}
        <section id="start" className="mt-12 scroll-mt-24">
          <SectionHeading icon={Rocket} title="Getting Started" />
          <ol className="mt-4 space-y-3 text-sm">
            <Step n={1} title="Enter your GitHub username">From the home page or any analyze form.</Step>
            <Step n={2} title="Wait ~10 seconds">We fetch your data and generate AI insights in parallel.</Step>
            <Step n={3} title="Review your report">Score, AI feedback, recruiter view, repos, and badges.</Step>
            <Step n={4} title="Export or share">Download a PDF or copy a shareable link.</Step>
          </ol>
        </section>

        {/* Scoring */}
        <section id="scoring" className="mt-12 scroll-mt-24">
          <SectionHeading icon={Book} title="Scoring Methodology" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["Popularity", "25", "Stars and forks across all original repos."],
              ["Activity", "20", "Repos pushed to in the last 90 days."],
              ["Breadth", "15", "Distinct programming languages used."],
              ["Quality", "20", "Descriptions, topics, and licenses present."],
              ["Community", "10", "Follower count, log-scaled."],
              ["Tenure", "10", "Years on GitHub."],
            ].map(([k, max, d]) => (
              <div key={k} className="hover-pop rounded-xl border border-border bg-card-grad p-4">
                <div className="flex items-baseline justify-between">
                  <div className="font-display font-semibold">{k}</div>
                  <div className="font-mono text-xs text-muted-foreground">/{max}</div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* API */}
        <section id="api" className="mt-12 scroll-mt-24">
          <SectionHeading icon={Code2} title="API" />
          <p className="mt-2 text-sm text-muted-foreground">
            GitInsight AI processes everything client-side. It fetches data from the GitHub REST API and sends it to Gemini/Groq for analysis.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-12 scroll-mt-24">
          <SectionHeading icon={FileQuestion} title="Frequently Asked Questions" />
          <Accordion
            type="single"
            collapsible
            value={open}
            onValueChange={setOpen}
            className="mt-4 overflow-hidden rounded-2xl border border-border bg-card-grad"
          >
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border last:border-0">
                <AccordionTrigger className="hover-pop group px-5 text-left font-display text-base font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-primary-foreground shadow-sm">
                      <f.icon className="h-4 w-4" />
                    </div>
                    <span>{f.q}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 text-sm text-muted-foreground">
                  <div className="flex gap-3 pb-4 pt-1">
                    <div className="w-8 shrink-0" aria-hidden="true" /> {/* Spacer to align with text above */}
                    <div>{f.a}</div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
};

function SectionHeading({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="hover-pop flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-primary-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="hover-pop flex gap-3 rounded-xl border border-border bg-card-grad p-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand font-mono text-xs font-bold text-primary-foreground">
        {n}
      </span>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{children}</div>
      </div>
    </li>
  );
}

export default Docs;
