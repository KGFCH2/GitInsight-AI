import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  Crown,
  Download,
  ExternalLink,
  Globe,
  Lightbulb,
  Loader2,
  MapPin,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  Target,
  Users,
  ChevronUp,
  RefreshCw,
  X,
  Zap,
  Award,
  ShieldCheck,
  Gauge,
  Trophy,
  FileCode,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { analyzeProfile, cacheResult, addToHistory } from "@/lib/api";
import type { AnalysisResult, RepoClassification } from "@/lib/types";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreBreakdownChart } from "@/components/ScoreBreakdownChart";
import { BadgeGrid } from "@/components/BadgeGrid";
import { RepoCard } from "@/components/RepoCard";
import { AnalyzeForm } from "@/components/AnalyzeForm";
import { exportPdf } from "@/lib/pdf";
import { Loader } from "@/components/Loader";
import { cn } from "@/lib/utils";

const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-muted ${className}`} />
);

const Result = () => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | RepoClassification>("all");
  const [showTop, setShowTop] = useState(false);
  const { username = "" } = useParams();
  const location = useLocation();
  const [modalType, setModalType] = useState<"stars" | "followers" | "langs" | "badge-guide" | null>(null);
  const [activeTab, setActiveTab] = useState("ai");

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadData = useCallback((isRefresh = false) => {
    const params = new URLSearchParams(location.search);
    const fromHistory = params.get("from") === "history";

    setLoading(true);
    setError(null);
    if (!isRefresh && !fromHistory) {
      setData(null);
      setIsRefreshing(false);
    } else {
      setIsRefreshing(true);
    }

    // Task 1: analyzeProfile will skip AI re-analysis if force is false and cache exists
    analyzeProfile(username, isRefresh)
      .then((r) => {
        setData(r);
        cacheResult(r);
        addToHistory(r);
        localStorage.setItem("lastAnalyzedUser", r.user.login);
      })
      .catch((e: Error) => {
        console.error("Analysis Error:", e);
        setError(e.message || "Failed to analyze");
        toast.error(e.message || "Failed to analyze");
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  }, [username, location.search]);

  useEffect(() => {
    loadData(false);
  }, [username, location.search, loadData]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `GitInsight: @${username}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Share link copied");
      }
    } catch {
      // user cancelled
    }
  };

  // Task 3: Load actual favicon and achievement icons for PDF export
  const handleExport = async () => {
    if (!data) return;
    try {
      const fetchB64 = async (url: string): Promise<string | null> => {
        try {
          const resp = await fetch(url);
          const blob = await resp.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch { return null; }
      };

      const faviconB64 = await fetchB64("/favicon.png");

      const badgeAssetMap: Record<string, string> = {
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

      const badgeFilters: Record<string, string> = {
        "Star Collector": "none",
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

      const fetchProcessedB64 = async (url: string, filter: string): Promise<string | null> => {
        try {
          const resp = await fetch(url);
          const blob = await resp.blob();
          const img = await new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = URL.createObjectURL(blob);
          });
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;
          ctx.filter = filter;
          ctx.drawImage(img, 0, 0);
          return canvas.toDataURL("image/png");
        } catch { return null; }
      };

      const badgePromises = data.badges.map(async (b) => {
        const path = badgeAssetMap[b.name];
        if (!path) return null;
        const filter = badgeFilters[b.name] || "none";
        const b64 = await fetchProcessedB64(path, filter);
        return b64 ? { name: b.name, b64 } : null;
      });

      const badgeResults = await Promise.all(badgePromises);
      const badgeData: Record<string, string> = {};
      badgeResults.forEach(i => { if (i?.b64) badgeData[i.name] = i.b64; });

      const achievementMap: Record<string, string> = {
        "Arctic Code Vault Contributor": "https://github.githubassets.com/images/modules/profile/achievements/arctic-code-vault-contributor-default.png",
        "Pull Shark": "https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png",
        "Starstruck": "https://github.githubassets.com/images/modules/profile/achievements/starstruck-default.png",
        "YOLO": "https://github.githubassets.com/images/modules/profile/achievements/yolo-default.png",
        "Pair Extraordinaire": "https://github.githubassets.com/images/modules/profile/achievements/pair-extraordinaire-default.png",
        "Galaxy Brain": "https://github.githubassets.com/images/modules/profile/achievements/galaxy-brain-default.png",
        "Quickdraw": "https://github.githubassets.com/images/modules/profile/achievements/quickdraw-default.png"
      };

      const iconPromises = (data.realAchievements || []).map(async (ach) => {
        const url = achievementMap[ach];
        if (!url) return null;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const b64 = await fetchB64(proxyUrl);
        return b64 ? { name: ach, b64 } : null;
      });

      const icons = await Promise.all(iconPromises);
      const iconData: Record<string, string> = {};
      icons.forEach(i => { if (i?.b64) iconData[i.name] = i.b64; });

      exportPdf(data, faviconB64 || undefined, iconData, badgeData);
    } catch (e) {
      console.warn("Failed to load assets for PDF", e);
      exportPdf(data);
    }
  };

  return (
    <div className="container py-10">
      {/* Back to Top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-glow shadow-brand/40 transition-transform hover:scale-110 active:scale-95"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="group mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Public Profile Report</div>
          <h1 className="text-gradient font-display text-xl font-black italic tracking-tighter sm:text-3xl">
            <a
              href={`https://github.com/${data?.user.login || username}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-1 hover:underline transition-colors"
            >
              @{username}
            </a>
          </h1>
        </div>
        <div className="flex w-full max-w-lg flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <AnalyzeForm defaultValue="" />
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-muted/60 dark:border-border/60"
            onClick={() => loadData(true)}
            disabled={loading}
            title="Refresh latest data"
          >
            <RefreshCw className={`h-4 w-4 transition-all duration-300 hover:rotate-180 text-foreground ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && !data && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingState simple />
          </motion.div>
        )}

        {loading && data && isRefreshing && (
          <motion.div
            key="refreshing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center rounded-2xl glass-card p-12"
          >
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
            <p className="mt-4 text-sm font-medium text-muted-foreground">Updating latest GitHub data...</p>
          </motion.div>
        )}

        {error && !loading && !data && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-center"
          >
            <div className="font-display text-lg font-semibold">{error}</div>
            <p className="mt-1 text-sm text-muted-foreground">Try a different username or check the spelling.</p>
          </motion.div>
        )}

        {data && !loading && (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Top profile + score */}
            <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex flex-col rounded-2xl glass-card p-6 h-full"
              >
                <div className="flex-1">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <img
                      src={data.user.avatar}
                      alt={data.user.login}
                      className="h-20 w-20 rounded-2xl border border-border object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                        Ambassador Report
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-gradient font-display text-2xl font-bold">
                          {data.user.name || data.user.login}
                        </h2>
                        <a
                          href={data.user.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand-1"
                        >
                          @{data.user.login}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      {data.user.bio && (
                        <p className="mt-2 max-w-prose text-sm text-muted-foreground leading-relaxed">{data.user.bio}</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {data.user.location && (
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {data.user.location}</span>
                        )}
                        {data.user.company && (
                          <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" /> {data.user.company}</span>
                        )}
                        {data.user.blog && (
                          <a href={data.user.blog} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-brand-1">
                            <Globe className="h-3 w-3" /> Website
                          </a>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {data.score.stats.accountAgeYears}y on GitHub
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <Stat
                      label="Ambassador XP"
                      value={data.score.xp}
                      icon={Zap}
                      color="brand"
                      subLabel="Points earned"
                    />
                    <Stat
                      label="Activity Streak"
                      value={data.score.streak}
                      icon={Flame}
                      color="amber"
                      subLabel="Active repos"
                    />
                    <Stat
                      label="Total Stars"
                      value={data.starredRepos?.length || 0}
                      icon={Star}
                      onClick={() => setModalType("stars")}
                      subLabel="Starred by user"
                      color="amber"
                    />
                    <Stat
                      label="Followers"
                      value={data.user.followers}
                      icon={Users}
                      onClick={() => setModalType("followers")}
                      color="brand"
                    />
                    <Stat
                      label="Projects"
                      value={data.repos.length}
                      icon={Sparkles}
                      onClick={() => {
                        setActiveTab("repos");
                        setTimeout(() => {
                          document.getElementById("repos-list")?.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                      color="brand"
                    />
                    <Stat
                      label="Top Languages"
                      value={data.score.stats.languageCount}
                      icon={TrendingUp}
                      onClick={() => setModalType("langs")}
                      color="brand"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-2 border-t border-border/40 pt-4 text-xs font-medium">
                  <div className="flex items-center gap-1 font-black text-[#f59e0b]">
                    <Star className="h-3.5 w-3.5 fill-current" /> {data.score.stats.totalStars} Stars Earned
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="italic text-brand-1">Click tiles for deep analysis</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col rounded-2xl glass-card p-8 h-full"
              >
                <div className="flex flex-col h-full lg:flex-row lg:items-center gap-10">
                  <div className="flex flex-col items-center justify-center flex-1">
                    <ScoreRing value={data.score.total} />
                  </div>
                  <div className="flex-[1.5]">
                    <ScoreBreakdownChart
                      data={[
                        { label: "Popularity", value: data.score.breakdown.popularity, max: 25 },
                        { label: "Activity", value: data.score.breakdown.activity, max: 20 },
                        { label: "Breadth", value: data.score.breakdown.breadth, max: 15 },
                        { label: "Quality", value: data.score.breakdown.quality, max: 20 },
                        { label: "Community", value: data.score.breakdown.community, max: 10 },
                        { label: "Tenure", value: data.score.breakdown.tenure, max: 10 },
                      ]}
                    />
                  </div>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-2 pt-6 lg:grid-cols-3">
                  <Button
                    onClick={share}
                    size="sm"
                    className="gap-2 bg-blue-600 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700"
                  >
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button
                    onClick={handleExport}
                    size="sm"
                    className="gap-2 bg-emerald-600 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                  >
                    <Download className="h-4 w-4" /> Export PDF
                  </Button>
                  <Button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `gitinsight-${data.user.login}.json`;
                      a.click();
                    }}
                    size="sm"
                    className="gap-2 bg-amber-600 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400"
                  >
                    <FileCode className="h-4 w-4" /> Export JSON
                  </Button>
                </div>
              </motion.div>
            </div>


            {/* Best Repo */}
            {data.bestRepo && (
              <div className="mt-6 overflow-hidden rounded-2xl glass-card p-6">
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-1">
                  <Crown className="h-4 w-4" /> Best Repo Highlight
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <a
                      href={data.bestRepo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-display text-2xl font-bold hover:text-brand-1"
                    >
                      {data.bestRepo.name}
                    </a>
                    {data.bestRepo.description && (
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {data.bestRepo.description ?? "No description."}
                      </p>
                    )}
                    {data.bestRepo.improvementNote && (
                      <div className="mb-4 rounded-lg border border-warning/20 bg-warning/5 p-2.5 text-[11px] leading-relaxed text-warning/90">
                        <span className="font-bold uppercase tracking-wider italic">💡 Tip:</span> {data.bestRepo.improvementNote}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4" /> {data.bestRepo.stars}</span>
                    {data.bestRepo.language && (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{data.bestRepo.language}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="mt-10">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-2 lg:grid-cols-4">
                  <TabsTrigger value="ai" className="gap-2 font-bold"><TrendingUp className="h-4 w-4" /> Main Growth View</TabsTrigger>
                  <TabsTrigger value="recruiter" className="gap-2 font-bold"><Users className="h-4 w-4" /> What Recruiters See</TabsTrigger>
                  <TabsTrigger value="badges" className="gap-2 font-bold"><Crown className="h-4 w-4" /> Badges</TabsTrigger>
                  <TabsTrigger value="repos" className="gap-2 font-bold"><Sparkles className="h-4 w-4" /> Project List</TabsTrigger>
                </TabsList>

                <TabsContent value="ai" className="mt-6 space-y-6">
                  {data.ai.summary && (
                    <Card title="Summary" icon={Sparkles}>
                      <p className="text-sm leading-relaxed text-muted-foreground">{data.ai.summary}</p>
                    </Card>
                  )}
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card title="Strengths" icon={TrendingUp} accent="success">
                      <BulletList items={data.ai.strengths} iconType="success" />
                    </Card>
                    <Card title="Weaknesses" icon={Lightbulb} accent="warning">
                      <BulletList items={data.ai.weaknesses} iconType="warning" />
                    </Card>
                  </div>
                  <Card title="Performance Scores" icon={Gauge}>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-1 group/item">
                        <div className="flex items-center gap-2 text-xs font-black uppercase text-success">
                          <div className="h-1.5 w-1.5 rounded-full bg-success shadow-glow animate-pulse" />
                          Popularity & Reach
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">Measures star count, forks, and follower velocity across all public contributions.</p>
                      </div>
                      <div className="space-y-1 group/item">
                        <div className="flex items-center gap-2 text-xs font-black uppercase text-warning">
                          <div className="h-1.5 w-1.5 rounded-full bg-warning shadow-glow animate-pulse" />
                          Quality & Documentation
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">Evaluates README depth, repository topics, licensing, and homepage availability.</p>
                      </div>
                    </div>
                  </Card>
                   {data.bestRepo && data.ai.readmeTips?.length > 0 && (
                    <Card title={`README tips for ${data.bestRepo.name}`} icon={Lightbulb} iconColor="text-amber-500">
                      <div className="mb-4 text-xs">
                        <a 
                          href={`${data.bestRepo.url}/blob/main/README.md`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-brand-1 hover:underline font-bold"
                        >
                          View README source <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <BulletList items={data.ai.readmeTips} iconType="tip" />
                    </Card>
                  )}
                  {data.ai.projectIdeas?.length > 0 && (
                    <Card title="Project Ideas" icon={Sparkles} iconColor="text-cyan-500">
                      <BulletList items={data.ai.projectIdeas} iconType="idea" />
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="recruiter" className="mt-6">
                  <Card title="What recruiters think" icon={Users}>
                    <p className="leading-relaxed text-muted-foreground italic">
                      {data.ai.recruiterInsights || "No recruiter insights generated."}
                    </p>
                  </Card>
                </TabsContent>


                <TabsContent value="repos" id="repos-list" className="mt-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {(["all", "good", "improve"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={
                          "rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-colors " +
                          (filter === f
                            ? "border-brand-1 bg-brand text-primary-foreground"
                            : "border-border bg-card text-muted-foreground hover:text-foreground")
                        }
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data.repos.filter((r) => filter === "all" || r.classification === filter).length > 0 ? (
                      data.repos
                        .filter((r) => filter === "all" || r.classification === filter)
                        .map((r, i) => <RepoCard key={r.name} repo={r} index={i} />)
                    ) : (
                      <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/5">
                        <p className="text-sm italic">No Repos are there in this category till now...</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="badges" className="mt-6 space-y-6">
                   <Card title="AI Badges" icon={Sparkles}>
                    <p className="mb-2 text-sm text-muted-foreground italic">Top 10 strategic badges based on your GitHub performance and AI analysis.</p>
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-black text-brand-1">
                      <Trophy className="h-3.5 w-3.5" /> You've earned {data.badges.length} badges!
                    </div>
                     <BadgeGrid badges={data.badges} />
                     <div className="mt-8 border-t border-border/40 pt-6">
                       <button 
                         onClick={() => setModalType("badge-guide")}
                         className="inline-flex items-center gap-2 text-sm font-bold text-brand-1 hover:underline"
                       >
                         <Target className="h-4 w-4" /> View all Badges & Find How to Get them
                       </button>
                     </div>
                   </Card>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modals */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b p-5 bg-white dark:bg-black text-black dark:text-white">
                <h3 className="flex items-center gap-2 font-display text-xl font-black italic tracking-tight">
                  {modalType === "stars" && <><Star className="h-6 w-6 fill-current text-brand-1" /> Starred Repositories</>}
                  {modalType === "followers" && <><Users className="h-6 w-6 text-brand-1" /> Followers List</>}
                  {modalType === "langs" && <><TrendingUp className="h-6 w-6 text-brand-1" /> Language Breakdown</>}
                  {modalType === "badge-guide" && <><Target className="h-6 w-6 text-brand-1" /> Badge Guide</>}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setModalType(null)}
                  className="h-10 w-10 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg hover:bg-orange-500 dark:hover:bg-green-500 hover:text-white dark:hover:text-black transition-colors"
                >
                  <X className="h-6 w-6 stroke-[3]" />
                </Button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4">
                {modalType === "stars" && (
                  <div className="space-y-3">
                    {data?.starredRepos?.map((r, i) => (
                      <a
                        key={i}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-xl border border-l-4 border-l-brand-1 bg-card p-4 transition-all hover:bg-brand-1/5 hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-brand-1/10 p-2 text-brand-1">
                            <Star className="h-4 w-4 fill-current" />
                          </div>
                          <span className="font-bold text-gradient">{r.name}</span>
                        </div>
                        <span className="flex items-center gap-1 font-display text-lg font-black text-gradient">
                          {r.stars}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
                {modalType === "followers" && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {data?.followersList?.map((f, i) => (
                      <a
                        key={i}
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center gap-3 rounded-2xl border border-l-4 border-l-brand-1 bg-card p-4 transition-all hover:bg-brand-1/5 hover:shadow-md"
                      >
                        <div className="relative">
                          <img src={f.avatar} alt={f.login} className="h-16 w-16 rounded-full border-2 border-brand-1/30 shadow-sm" />
                          <div className="absolute -bottom-1 -right-1 rounded-full bg-brand-1 p-1 text-white shadow-sm">
                            <Users className="h-3 w-3" />
                          </div>
                        </div>
                        <span className="text-xs font-black text-gradient">@{f.login}</span>
                      </a>
                    ))}
                  </div>
                )}
                {modalType === "langs" && (
                   <div className="space-y-4">
                     {data?.score.stats.langDetails?.map((l, i) => (
                       <div key={i} className="space-y-1.5">
                         <div className="flex justify-between text-sm">
                           <span className="font-semibold text-gradient">{l.name}</span>
                           <span className="text-muted-foreground">{l.percentage}% ({l.count} repos)</span>
                         </div>
                         <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                           <motion.div
                             initial={{ width: 0 }}
                             animate={{ width: `${l.percentage}%` }}
                             className="h-full bg-gradient-to-r from-brand-1 to-brand-2"
                           />
                         </div>
                       </div>
                     ))}
                     {(!data?.score.stats.langDetails || data.score.stats.langDetails.length === 0) && (
                       <p className="py-8 text-center text-sm text-muted-foreground">No language data available.</p>
                     )}
                   </div>
                 )}
                 {modalType === "badge-guide" && (
                   <div className="space-y-6">
                     <p className="text-sm text-muted-foreground">Master your GitHub profile to unlock these 10 strategic ambassador badges.</p>
                     <div className="grid gap-4 sm:grid-cols-2">
                       {[
                         { name: "Star Collector", req: "Accumulate 100+ total stars across your repos.", img: "/badge-star.png", filter: "" },
                         { name: "Open Source Hero", req: "Reach a prestigious 1,000+ total stars.", img: "/badge-hero.png", filter: "hue-rotate(15deg) brightness(1.1)" },
                         { name: "Polyglot", req: "Show proficiency in 5+ different languages.", img: "/badge-polyglot.png", filter: "hue-rotate(200deg)" },
                         { name: "Consistent Contributor", req: "Maintain activity with 3+ repos updated in 30 days.", img: "/badge-consistent.png", filter: "hue-rotate(330deg)" },
                         { name: "Community Builder", req: "Build an audience of 50+ followers.", img: "/badge-community.png", filter: "hue-rotate(250deg)" },
                         { name: "Prolific Creator", req: "Successfully manage 20+ public repositories.", img: "/badge-prolific.png", filter: "hue-rotate(30deg)" },
                         { name: "Elite Profile", req: "Achieve a total profile score of 75+.", img: "/badge-elite.png", filter: "hue-rotate(45deg) saturate(1.5)" },
                         { name: "Top Repo Builder", req: "Build at least one 'flagship' repo with 50+ stars.", img: "/badge-toprepo.png", filter: "hue-rotate(180deg)" },
                         { name: "Rising Star", req: "Score 50+ in your very first year on GitHub.", img: "/badge-rising.png", filter: "hue-rotate(280deg)" },
                         { name: "Veteran Coder", req: "Maintain an active presence for 5+ years.", img: "/badge-veteran.png", filter: "hue-rotate(120deg) brightness(0.8)" },
                       ].map((b, i) => (
                         <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-muted/20 p-3">
                           <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-brand/20 bg-background shadow-sm">
                             <img src={b.img} alt={b.name} className="h-full w-full object-cover" style={{ filter: b.filter }} />
                           </div>
                           <div>
                             <div className="text-xs font-black uppercase text-brand-1">{b.name}</div>
                             <div className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{b.req}</div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function Stat({
  label,
  value,
  icon: Icon,
  onClick,
  subLabel,
  color = "brand",
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  subLabel?: string;
  color?: "brand" | "amber" | "purple" | "blue";
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`group relative overflow-hidden rounded-xl border border-border bg-background/40 p-4 text-left transition-all ${onClick ? "hover:border-brand-1/40 dark:hover:border-brand-1/40 hover:bg-muted/5 active:scale-95 shadow-sm" : ""
        }`}
    >
      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-brand-1 duration-300">
        <Icon className="h-3.5 w-3.5 shrink-0" /> {label}
      </div>
      <div className="mt-1 font-display text-2xl font-black tabular-nums text-foreground transition-all group-hover:scale-105 duration-300">
        {value.toLocaleString()}
      </div>
      {subLabel && (
        <div className="mt-0.5 text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-brand-1/70 duration-300">
          {subLabel}
        </div>
      )}

      {/* Subtle background glow on hover */}
      {onClick && (
        <div className={cn(
          "absolute -right-4 -top-4 h-12 w-12 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-20",
          "bg-brand-1 dark:bg-brand-1"
        )} />
      )}
    </button>
  );
}

function Card({
  title,
  icon: Icon,
  children,
  accent,
  iconColor,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  accent?: "success" | "warning";
  iconColor?: string;
}) {
  const accentClass =
    iconColor || (accent === "success" ? "text-success" : accent === "warning" ? "text-warning" : "text-brand-1");
  return (
    <div className="group rounded-2xl glass-card p-6 transition-all duration-300 hover:-translate-y-1">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center transition-all duration-300 group-hover:scale-105">
          <Icon className={`h-5 w-5 ${accentClass}`} />
        </div>
        <h3 className="font-display text-base font-bold text-gradient">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function BulletList({
  items,
  numbered = false,
  iconType = "dot"
}: {
  items: string[];
  numbered?: boolean;
  iconType?: "dot" | "success" | "warning" | "step" | "tip" | "idea"
}) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">—</p>;

  const getIcon = (i: number) => {
    if (numbered) return <span className="text-xs font-black">{i + 1}</span>;

    // Diverse icons for variety
    const icons = [Sparkles, Zap, Target, Award, ShieldCheck, Gauge, Lightbulb];
    const IconComp = icons[i % icons.length];

    if (iconType === "success") return <IconComp className="h-3.5 w-3.5 text-success brightness-125" />;
    if (iconType === "warning") return <IconComp className="h-3.5 w-3.5 text-warning brightness-125" />;
    if (iconType === "step") return <IconComp className="h-3.5 w-3.5 text-brand-1 brightness-125" />;
    if (iconType === "tip") return <IconComp className="h-3.5 w-3.5 text-amber-500 brightness-110" />;
    if (iconType === "idea") return <IconComp className="h-3.5 w-3.5 text-cyan-500 brightness-110" />;
    return <div className="h-1.5 w-1.5 rounded-full bg-brand-1 shadow-glow" />;
  };

  return (
    <ol className="space-y-4">
      {items.map((it, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex gap-4 text-sm leading-relaxed group cursor-default"
        >
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
            {getIcon(i)}
          </div>
          <span className="flex-1 text-foreground/80 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300">
            {it}
          </span>
        </motion.li>
      ))}
    </ol>
  );
}

function LoadingState({ simple = false }: { simple?: boolean }) {
  if (simple) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card-grad p-12 shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">Analyzing GitHub profile...</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonBlock className="h-56" />
          <SkeletonBlock className="h-56" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card-grad p-8 shadow-sm">
        <Loader text="Fetching GitHub data and generating AI insights…" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonBlock className="h-56" />
        <SkeletonBlock className="h-56" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonBlock className="h-40" />
        <SkeletonBlock className="h-40" />
        <SkeletonBlock className="h-40" />
      </div>
    </div>
  );
}

export default Result;
