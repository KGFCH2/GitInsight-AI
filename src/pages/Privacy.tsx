import React from "react";
import { Shield, Eye, Cpu, Cookie, Lock } from "lucide-react";

export default function Privacy() {
  return (
    <div className="container max-w-3xl py-12">
      <div className="flex items-center gap-3">
        <div className="icon-pop flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-primary shadow-glow transition-transform duration-300">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="hover-pop font-display text-4xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      <div className="mt-10 space-y-12">
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold italic underline decoration-brand/30 decoration-2 underline-offset-4">1. Data Handling</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            GitInsight AI does not require an account and does not store personal data. When you submit a GitHub username, we fetch publicly available data from the GitHub API and process it in-memory to generate your report.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <Eye className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold italic underline decoration-brand/30 decoration-2 underline-offset-4">2. What we access</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="hover-pop rounded-xl border border-border bg-card-grad p-4">
              <div className="font-semibold mb-1">Public Profile</div>
              <p className="text-xs text-muted-foreground">Avatar, bio, follower count, and account creation date.</p>
            </div>
            <div className="hover-pop rounded-xl border border-border bg-card-grad p-4">
              <div className="font-semibold mb-1">Public Repos</div>
              <p className="text-xs text-muted-foreground">Stars, forks, topics, languages, and activity metadata.</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <Cpu className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold italic underline decoration-brand/30 decoration-2 underline-offset-4">3. AI processing</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Profile data is sent to Google Gemini (or Groq as fallback) to generate insights. No data is retained for training. The processing happens in real-time and results are displayed directly to you.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <Cookie className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold italic underline decoration-brand/30 decoration-2 underline-offset-4">4. Cookies</h2>
          </div>
          <div className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
            We use a single <code className="rounded bg-muted px-1 font-mono">localStorage</code> entry for your theme preference. We do not use tracking cookies or 3rd party analytics.
          </div>
        </section>
      </div>
    </div>
  );
}
