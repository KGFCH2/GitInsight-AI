import {
  Award,
  Code2,
  Flame,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { toast } from "sonner";

const BADGE_IMAGES: Record<string, string> = {
  "Star Collector": "/badge-star.png",
  "Open Source Hero": "/badge-hero.png",
  "Polyglot": "/badge-polyglot.png",
  "Consistent Contributor": "/badge-consistent.png",
  "Community Builder": "/badge-community.png",
  "Prolific Creator": "/badge-prolific.png",
  "Elite Profile": "/badge-elite.png",
  "Top Repo Builder": "/badge-toprepo.png",
  "Rising Star": "/badge-rising.png",
  "Veteran Coder": "/badge-veteran.png",
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

const BADGE_FILTERS: Record<string, string> = {
  "Star Collector": "",
  "Open Source Hero": "hue-rotate(15deg) brightness(1.1)",
  "Polyglot": "hue-rotate(200deg)",
  "Consistent Contributor": "hue-rotate(330deg)",
  "Community Builder": "hue-rotate(250deg)",
  "Prolific Creator": "hue-rotate(30deg)",
  "Elite Profile": "hue-rotate(45deg) saturate(1.5)",
  "Top Repo Builder": "hue-rotate(180deg)",
  "Rising Star": "hue-rotate(280deg)",
  "Veteran Coder": "hue-rotate(120deg) brightness(0.8)",
};

const BADGE_THEMES: Record<string, { bg: string; border: string; glow: string }> = {
  "Star Collector": { bg: "from-amber-400/20 to-orange-500/20", border: "border-amber-500/50", glow: "shadow-amber-500/20" },
  "Open Source Hero": { bg: "from-emerald-400/20 to-teal-500/20", border: "border-emerald-500/50", glow: "shadow-emerald-500/20" },
  "Polyglot": { bg: "from-blue-400/20 to-cyan-500/20", border: "border-blue-500/50", glow: "shadow-blue-500/20" },
  "Consistent Contributor": { bg: "from-rose-400/20 to-red-500/20", border: "border-rose-500/50", glow: "shadow-rose-500/20" },
  "Community Builder": { bg: "from-indigo-400/20 to-violet-500/20", border: "border-indigo-500/50", glow: "shadow-indigo-500/20" },
  "Prolific Creator": { bg: "from-purple-400/20 to-fuchsia-500/20", border: "border-purple-500/50", glow: "shadow-purple-500/20" },
  "Elite Profile": { bg: "from-sky-400/20 to-blue-600/20", border: "border-sky-500/50", glow: "shadow-sky-500/20" },
  "Top Repo Builder": { bg: "from-slate-400/20 to-gray-600/20", border: "border-slate-500/50", glow: "shadow-slate-500/20" },
  "Rising Star": { bg: "from-yellow-400/20 to-amber-600/20", border: "border-yellow-500/50", glow: "shadow-yellow-500/20" },
  "Veteran Coder": { bg: "from-orange-400/20 to-red-700/20", border: "border-orange-600/50", glow: "shadow-orange-600/20" },
};

export function BadgeGrid({ badges }: { badges: { name: string; description: string }[] }) {
  const handleDownload = async (badgeName: string) => {
    const imgUrl = BADGE_IMAGES[badgeName];
    if (!imgUrl) return;

    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const filename = imgUrl.split("/").pop() || `${badgeName.toLowerCase().replace(/\s+/g, "-")}.png`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded ${filename}`);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download badge");
    }
  };

  if (!badges.length) {
    return (
      <div className="rounded-xl border border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
        No badges yet — keep contributing to unlock achievements.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {badges.map((b, i) => {
        const Icon = ICONS[b.name] ?? Award;
        const img = BADGE_IMAGES[b.name];
        const filter = BADGE_FILTERS[b.name] || "";
        const theme = BADGE_THEMES[b.name] ?? { bg: "from-brand-1/20 to-brand-2/20", border: "border-brand-1/40", glow: "shadow-brand-1/20" };
        return (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card-grad p-4 transition-all hover:border-brand-1 hover:shadow-glow"
          >
            <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(b.name)}
                className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm hover:bg-brand-1 hover:text-white"
                title="Download Badge PNG"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-4">
              <div className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 ${theme.border} bg-gradient-to-br ${theme.bg} ${theme.glow} shadow-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl flex items-center justify-center p-1.5`}>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
                {img ? (
                  <img 
                    src={img} 
                    alt={b.name} 
                    className="relative z-10 h-full w-full object-contain drop-shadow-xl transition-transform duration-300" 
                    style={{ filter }}
                  />
                ) : (
                  <div className="relative z-10 flex h-full w-full items-center justify-center text-foreground">
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
