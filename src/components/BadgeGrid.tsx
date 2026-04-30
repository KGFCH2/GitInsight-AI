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

const BADGE_IMAGES: Record<string, string> = {
  "Star Collector": "/badge-star.png",
  "Open Source Hero": "/badge-hero.png",
  "Polyglot": "/badge-polyglot.png",
  "Consistent Contributor": "/badge-consistent.png",
  "Community Builder": "/badge-community.png",
  "Prolific Creator": "/badge-prolific.png",
  "Elite Profile": "/badge-hero.png",
  "Top Repo Builder": "/badge-star.png",
  "Rising Star": "/badge-polyglot.png",
  "Veteran Coder": "/badge-community.png",
};

const ICONS: Record<string, typeof Star> = {
  "Star Collector": Star,
  "Open Source Hero": Trophy,
  "Polyglot": Code2,
  "Consistent Contributor": Flame,
  "Community Builder": Users,
  "Prolific Creator": Rocket,
  "Elite Profile": Sparkles,
  "Top Repo Builder": Award,
  "Rising Star": Zap,
  "Veteran Coder": ShieldCheck,
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
        const img = BADGE_IMAGES[b.name];
        return (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card-grad p-4 transition-all hover:border-brand-1 hover:shadow-glow"
          >
            <div className="flex gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-brand/20 bg-muted/20 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:border-brand-1/50 group-hover:shadow-brand-1/20">
                {img ? (
                  <img src={img} alt={b.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand text-primary-foreground">
                    <Icon className="h-7 w-7" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center gap-1">
                <div className="text-sm font-black uppercase tracking-tight text-gradient">{b.name}</div>
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
