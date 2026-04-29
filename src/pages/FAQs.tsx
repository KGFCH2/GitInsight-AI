import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileQuestion, BarChart3, ShieldCheck, Cpu, Users, TrendingUp, Download, Key, Tags, Lock, Zap, HelpCircle, ExternalLink, Lightbulb, Gauge } from "lucide-react";

const faqs = [
  {
    q: "What exactly is GitInsight AI?",
    a: "GitInsight AI is a premium developer-grade analytics platform that transforms your raw GitHub data into strategic career insights. It uses advanced heuristics and optional AI (Gemini/Groq) to score your profile, assign strategic badges, and provide actionable tips for repository improvement.",
    icon: HelpCircle,
  },
  {
    q: "How does the scoring system work?",
    a: "Our engine evaluates five core dimensions: Popularity (stars/forks), Activity (commit frequency), Breadth (language diversity), Quality (documentation/README depth), and Community (followers/collaboration). These are weighted to produce a final score out of 100.",
    icon: BarChart3,
  },
  {
    q: "Is my GitHub data safe with you?",
    a: "Absolutely. GitInsight AI only accesses public information via the GitHub API. We do not store your personal data or code. All analysis is performed in real-time and remains within your current session.",
    icon: ShieldCheck,
  },
  {
    q: "Do I need to provide a GitHub Personal Access Token?",
    a: "No, a token is not required for basic analysis. However, providing a token allows the platform to fetch data at a higher rate limit and enables advanced GraphQL features like actual profile achievements.",
    icon: Key,
  },
  {
    q: "What are AI Badges?",
    a: "AI Badges are strategic titles assigned by our analysis engine based on your unique performance patterns. Examples include 'Architecture Veteran' for structured repos or 'Community Catalyst' for high-engagement developers.",
    icon: Tags,
  },
  {
    q: "How are the 'README tips' generated?",
    a: "We analyze the structure, length, and content of your repository's README file. Our AI then suggests specific improvements like adding installation steps, usage examples, or better visual screenshots to improve discoverability.",
    icon: Lightbulb,
  },
  {
    q: "Can I export or share my results?",
    a: "Yes! You can export your full profile analysis as a professionally formatted PDF. You can also share your score and unique insight link directly to Twitter, LinkedIn, or via a clipboard link.",
    icon: Download,
  },
  {
    q: "Which AI models power the insights?",
    a: "We currently support Google's Gemini 1.5 Pro and Groq's Llama 3 for deep analysis. If no API key is provided, the platform falls back to our robust rule-based heuristic engine.",
    icon: Cpu,
  },
  {
    q: "Is GitInsight AI free to use?",
    a: "Yes, the core features of GitInsight AI are completely free. We believe in empowering developers to understand and showcase their impact without any barriers.",
    icon: Zap,
  },
  {
    q: "What determines the 'Best Repo' highlight?",
    a: "Our algorithm identifies the repository with the highest combined impact score, factoring in stars, forks, recent activity, and the quality of documentation relative to its complexity.",
    icon: BarChart3,
  },
  {
    q: "Does it support private repositories?",
    a: "Currently, GitInsight AI focuses on public contributions to ensure transparency and security. Support for private repo analysis via OAuth is a feature we are exploring for future updates.",
    icon: Lock,
  },
  {
    q: "How do I improve my GitInsight score?",
    a: "Focus on 'Quality over Quantity.' Improving your READMEs, using consistent commit messages, diversifying your tech stack, and engaging with the community (stars/forks) will naturally boost your score.",
    icon: TrendingUp,
  },
  {
    q: "What is the 'Ambassador' program mentioned?",
    a: "The Ambassador dashboard is a specialized view for community leads to identify top contributors and high-impact developers within their specific ecosystem or organization.",
    icon: Users,
  },
  {
    q: "How often can I refresh my profile data?",
    a: "You can refresh your data as often as you like! The platform will fetch the latest live data from GitHub each time you initiate a new search or click the refresh icon.",
    icon: Zap,
  },
  {
    q: "What are 'Project Ideas' in the result view?",
    a: "Based on your strongest languages and interests, our AI suggests 5 personalized project ideas that could help you fill gaps in your portfolio or take your skills to the next level.",
    icon: Lightbulb,
  },
  {
    q: "Why is the username casing important?",
    a: "GitHub usernames are unique and sometimes case-sensitive for specific API lookups. To ensure we fetch the exact profile you're looking for, we enforce case-accurate searches.",
    icon: FileQuestion,
  },
  {
    q: "Can I use GitInsight AI for recruitment?",
    a: "Yes, the 'Recruiter Perspective' tab provides a high-level summary designed to help hiring managers quickly understand a developer's technical strengths and cultural fit.",
    icon: Users,
  },
  {
    q: "How can I contribute to this project?",
    a: "GitInsight AI is an evolving platform. If you have suggestions or want to report a bug, please reach out via our official GitHub repository or contact the lead developer, <a href='https://github.com/KGFCH2' target='_blank' rel='noreferrer' class='text-brand-1 hover:underline font-bold'>Babin Bid</a>.",
    icon: ExternalLink,
  }
];

export default function FAQs() {
  const [open, setOpen] = useState<string | undefined>("item-0");

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-brand">Support</div>
        <h1 className="text-gradient hover-pop mt-2 flex items-center gap-4 font-display text-4xl font-bold sm:text-5xl">
          <HelpCircle className="h-10 w-10 text-brand-1" />
          Frequently Asked Questions
        </h1>
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
                    <div className="icon-pop flex h-8 w-8 shrink-0 items-center justify-center text-brand-1">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <span className="text-gradient">{f.q}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 text-sm text-muted-foreground">
                  <div className="flex gap-3 pb-4 pt-1">
                    <div className="w-8 shrink-0" aria-hidden="true" />
                    <div dangerouslySetInnerHTML={{ __html: f.a }} />
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
