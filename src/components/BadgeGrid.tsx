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

export function BadgeGrid({ badges }: { badges: string[] }) {
  if (!badges.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
        No badges yet — keep contributing to unlock achievements.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {badges.map((b, i) => {
        const Icon = ICONS[b] ?? Award;
        return (
          <motion.div
            key={b}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card-grad p-4 transition-all hover:border-brand-1 hover:shadow-glow"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold leading-tight">{b}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
