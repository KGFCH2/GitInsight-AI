import { Rocket, Book, MousePointer2 } from "lucide-react";

export default function Documentation() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-brand">Resources</div>
        <h1 className="hover-pop mt-2 font-display text-4xl font-bold sm:text-5xl">Documentation</h1>
        <p className="mt-3 text-muted-foreground">Comprehensive guide to understanding and using GitInsight AI.</p>

        <section id="start" className="mt-12 scroll-mt-24">
          <SectionHeading icon={Rocket} title="Getting Started" />
          <ol className="mt-4 space-y-4">
            <Step n={1} title="Enter your GitHub username">
              Simply type your username (or any public username) into the analyzer to begin.
            </Step>
            <Step n={2} title="Provide an API Key (Optional)">
              To unlock AI-powered insights, add your Google Gemini or Groq API key in the settings.
            </Step>
            <Step n={3} title="Review your Report">
              Get an instant score across 6 dimensions, repo classifications, and career-focused feedback.
            </Step>
          </ol>
        </section>

        <section id="scoring" className="mt-16 scroll-mt-24">
          <SectionHeading icon={Book} title="Scoring Methodology" />
          <p className="mt-4 text-sm text-muted-foreground">
            Our multi-dimensional scoring algorithm evaluates public profiles based on industry-standard engineering metrics:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Popularity", "25 pts", "Stars and forks received on original repositories."],
              ["Activity", "20 pts", "Frequency and recency of contributions."],
              ["Breadth", "15 pts", "Diversity of programming languages and technologies."],
              ["Quality", "20 pts", "Documentation, licenses, and repository metadata."],
              ["Community", "10 pts", "Follower growth and network engagement."],
              ["Tenure", "10 pts", "Account age and long-term consistency."],
            ].map(([k, max, d]) => (
              <div key={k} className="hover-pop rounded-2xl border border-border bg-card-grad p-5">
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-lg font-bold">{k}</div>
                  <div className="font-mono text-xs font-bold text-brand">{max}</div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="usage" className="mt-16 scroll-mt-24">
          <SectionHeading icon={MousePointer2} title="How to use insights" />
          <div className="mt-4 rounded-2xl border border-dashed border-border p-6 text-sm leading-relaxed text-muted-foreground">
            Use the <strong>Action Steps</strong> tab to identify quick wins for your profile. 
            The <strong>Recruiter View</strong> is specifically designed to help you communicate your technical value 
            to non-technical stakeholders during hiring processes.
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeading({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="hover-pop flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-primary-foreground shadow-glow">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="hover-pop flex gap-4 rounded-2xl border border-border bg-card-grad p-5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-mono text-sm font-bold text-primary-foreground">
        {n}
      </span>
      <div>
        <div className="font-display text-lg font-bold">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </li>
  );
}
