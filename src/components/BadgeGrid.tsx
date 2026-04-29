import {
  Award,
  Code2,
  Flame,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const ICONS: Record<string, typeof Star> = {
  "Star Collector": Star,
  "Open Source Hero": Trophy,
  "Polyglot": Code2,
  "Consistent Contributor": Flame,
  "Community Builder": Users,
  "Prolific Creator": Rocket,
  "Elite Profile": Sparkles,
  "Top Repo Builder": Award,
};

export function BadgeGrid({ badges }: { badges: { name: string; description: string }[] }) {
  if (!badges.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
        No badges yet — keep contributing to unlock achievements.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {badges.map((b, i) => {
        const Icon = ICONS[b.name] ?? Award;
        return (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card-grad p-4 transition-all hover:border-brand-1 hover:shadow-glow"
          >
            <div className="flex gap-4">
              <div className="icon-pop flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-primary-foreground shadow-lg">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <div className="text-sm font-black uppercase tracking-tight">{b.name}</div>
                <div className="text-[11px] leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  {b.description}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
