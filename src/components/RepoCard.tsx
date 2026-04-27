import { ExternalLink, GitFork, Star } from "lucide-react";
import type { AnalyzedRepo } from "@/lib/types";
import { motion } from "framer-motion";

const tagStyles: Record<AnalyzedRepo["classification"], string> = {
  good: "bg-success/15 text-success border-success/30",
  improve: "bg-warning/15 text-warning border-warning/30",
  archive: "bg-muted text-muted-foreground border-border",
};

const tagLabel: Record<AnalyzedRepo["classification"], string> = {
  good: "Good",
  improve: "Improve",
  archive: "Archive",
};

export function RepoCard({ repo, index = 0 }: { repo: AnalyzedRepo; index?: number }) {
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04 }}
      className="group flex h-full flex-col rounded-xl border border-border bg-card-grad p-5 transition-all hover:-translate-y-0.5 hover:border-brand-1/60 hover:shadow-glow"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-display text-base font-semibold leading-tight">
          {repo.name}
          {repo.isFork && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Fork</span>
          )}
        </div>
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
      </div>
      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
        {repo.description ?? "No description."}
      </p>
      {repo.improvementNote && (
        <div className="mb-4 rounded-lg border border-warning/20 bg-warning/5 p-2.5 text-[11px] leading-relaxed text-warning/90">
          <span className="font-bold uppercase tracking-wider italic">💡 Tip:</span> {repo.improvementNote}
        </div>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 text-xs">
        {repo.language && (
          <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{repo.language}</span>
        )}
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Star className="h-3 w-3" /> {repo.stars}
        </span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <GitFork className="h-3 w-3" /> {repo.forks}
        </span>
        <span className={`ml-auto rounded-full border px-2.5 py-1 font-semibold ${tagStyles[repo.classification]}`}>
          {tagLabel[repo.classification]}
        </span>
      </div>
    </motion.a>
  );
}
