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
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted/20 shadow-lg transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                {img ? (
                  <img 
                    src={img} 
                    alt={b.name} 
                    className="h-full w-full object-contain" 
                  />
                ) : (
                  <Icon className="h-8 w-8 text-brand-1" />
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
