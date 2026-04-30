import React from "react";
import { Code2, Globe, Lock, Cpu, Server, Zap } from "lucide-react";

export default function APIReference() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-brand">Developers</div>
        <h1 className="text-gradient hover-pop mt-2 flex items-center gap-4 font-display text-4xl font-bold sm:text-5xl">
          <Code2 className="h-10 w-10 text-brand-1" />
          API Reference
        </h1>
        <p className="mt-3 text-muted-foreground">Technical details on how GitInsight AI interacts with external services.</p>

        <section className="mt-12 space-y-10">
          <div className="space-y-4">
            <Feature icon={Globe} title="GitHub REST API v3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                We use the official GitHub REST API to fetch user profiles, repository data, and activity statistics.
                Most requests are performed using standard <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">GET</code> endpoints.
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>User metadata (followers, account age)</li>
                <li>Repository listings (stars, forks, languages)</li>
                <li>Recent commit activity (push events)</li>
              </ul>
            </Feature>

            <Feature icon={Lock} title="Authentication & Rate Limits">
              <p className="text-sm leading-relaxed text-muted-foreground">
                By default, unauthenticated requests to GitHub are limited to 60 per hour.
                Users can provide a <strong>Personal Access Token (PAT)</strong> in the settings to increase this limit to 5,000 requests per hour.
              </p>
            </Feature>

            <Feature icon={Cpu} title="LLM Integration (Gemini & Groq)">
              <p className="text-sm leading-relaxed text-muted-foreground">
                The analysis is powered by cutting-edge Large Language Models. We use a multi-provider strategy:
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-4">
                  <div className="font-semibold">Google Gemini</div>
                  <p className="text-xs text-muted-foreground">Primary model for deep reasoning and recruiter-perspective insights.</p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <div className="font-semibold">Groq (Llama 3)</div>
                  <p className="text-xs text-muted-foreground">High-speed fallback provider ensuring low latency when Gemini is busy.</p>
                </div>
              </div>
            </Feature>

            <Feature icon={Server} title="Client-Side Architecture">
              <p className="text-sm leading-relaxed text-muted-foreground">
                GitInsight AI is a <strong>Serverless</strong> application. All API calls are initiated directly from your browser.
                Your API keys are stored in <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">localStorage</code> and never touch our servers.
              </p>
            </Feature>
          </div>
        </section>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="hover-pop group rounded-2xl border border-border bg-card-grad p-6 shadow-sm transition-all duration-300 hover:shadow-glow">
      <div className="flex items-center gap-4">
        <div className="icon-pop flex h-12 w-12 shrink-0 items-center justify-center text-brand-1">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-gradient font-display text-xl font-bold">{title}</h3>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
