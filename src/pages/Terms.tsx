import React from "react";
import { FileText, UserCheck, Scale, ShieldAlert } from "lucide-react";

export default function Terms() {
  return (
    <div className="container max-w-3xl py-12">
      <div className="group flex items-center gap-3">
        <div className="icon-pop flex h-12 w-12 items-center justify-center text-brand-1">
          <FileText className="h-7 w-7" />
        </div>
        <div>
          <h1 className="hover-pop font-display text-4xl font-bold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      <div className="mt-10 space-y-12">
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <ShieldAlert className="h-5 w-5 text-brand-1" />
            <h2 className="font-display text-2xl font-bold italic underline decoration-brand/30 decoration-2 underline-offset-4 transition-transform hover:translate-x-1 hover:text-brand-1 cursor-default">1. Agreement</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            GitInsight AI is provided as-is, without warranties of any kind. By using the service, you agree to use it responsibly and only with public GitHub usernames.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <UserCheck className="h-5 w-5 text-brand-1" />
            <h2 className="font-display text-2xl font-bold italic underline decoration-brand/30 decoration-2 underline-offset-4 transition-transform hover:translate-x-1 hover:text-brand-1 cursor-default">2. Acceptable use</h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Do not use the service to harass or harm individuals",
              "Do not overload or scrape the platform",
              "AI insights are for guidance only",
              "Use only with public GitHub data"
            ].map((item, i) => (
              <li key={i} className="hover-pop flex items-start gap-2 rounded-xl border border-border bg-card-grad p-3 text-sm text-muted-foreground">
                <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <Scale className="h-5 w-5 text-brand-1" />
            <h2 className="font-display text-2xl font-bold italic underline decoration-brand/30 decoration-2 underline-offset-4 transition-transform hover:translate-x-1 hover:text-brand-1 cursor-default">3. Liability</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed bg-muted/30 rounded-xl p-5 border border-dashed border-border">
            We are not responsible for decisions made based on the analysis. Always corroborate with direct review. AI-generated insights are subjective and should not be the sole basis for hiring decisions.
          </p>
        </section>
      </div>
    </div>
  );
}
