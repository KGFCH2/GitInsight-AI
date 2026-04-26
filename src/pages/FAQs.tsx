import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileQuestion, BarChart3, ShieldCheck, Cpu, Users, TrendingUp, Download, Key, Tags, Lock, Zap } from "lucide-react";

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

export default function FAQs() {
  const [open, setOpen] = useState<string | undefined>("item-0");

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-brand">Support</div>
        <h1 className="hover-pop mt-2 font-display text-4xl font-bold sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-3 text-muted-foreground">Everything you need to know about GitInsight AI.</p>

        <section className="mt-12">
          <Accordion
            type="single"
            collapsible
            value={open}
            onValueChange={setOpen}
            className="overflow-hidden rounded-2xl border border-border bg-card-grad"
          >
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border last:border-0">
                <AccordionTrigger className="hover-pop group px-5 text-left font-display text-base font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="icon-pop flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-primary-foreground shadow-sm">
                      <f.icon className="h-4 w-4" />
                    </div>
                    <span>{f.q}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 text-sm text-muted-foreground">
                  <div className="flex gap-3 pb-4 pt-1">
                    <div className="w-8 shrink-0" aria-hidden="true" />
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
}
