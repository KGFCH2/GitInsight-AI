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
      
      // Extract filename from path (e.g., /badge-star.png -> badge-star.png)
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
        const filter = BADGE_FILTERS[b.name] || "";
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
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-brand/20 bg-muted/20 shadow-xl transition-all duration-300 hover:scale-110 hover:border-brand-1/50 hover:shadow-brand-1/20">
                {img ? (
                  <img 
                    src={img} 
                    alt={b.name} 
                    className="h-full w-full object-cover transition-transform duration-300" 
                    style={{ filter }}
                  />
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
