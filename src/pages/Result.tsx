import { useEffect, useState } from "react";
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
  Users,
  ChevronUp,
  RefreshCw,
  X,
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
  const [modalType, setModalType] = useState<"stars" | "followers" | "langs" | null>(null);
  const [activeTab, setActiveTab] = useState("ai");

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadData = (isRefresh = false) => {
    setLoading(true);
    setError(null);
    if (!isRefresh) {
      setData(null);
      setIsRefreshing(false);
    } else {
      setIsRefreshing(true);
    }
    analyzeProfile(username, isRefresh)
      .then((r) => {
        setData(r);
        cacheResult(r);
        addToHistory(r);
        localStorage.setItem("lastAnalyzedUser", username);
      })
      .catch((e: Error) => {
        setError(e.message || "Failed to analyze");
        toast.error(e.message || "Failed to analyze");
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    loadData(false);
  }, [username, location.search]);

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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Public Profile Report</div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            @{username}
          </h1>
        </div>
        <div className="flex w-full max-w-md flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <AnalyzeForm defaultValue={username} />
          {data && (
            <Button
              variant="outline"
              size="icon"
              className="group h-12 w-12 shrink-0 rounded-xl transition-all duration-300 hover:scale-105 hover:border-brand/50 hover:bg-brand/5 hover:shadow-glow"
              onClick={() => loadData(true)}
              disabled={loading}
              title="Refresh latest data"
            >
              <RefreshCw className={`h-4 w-4 transition-colors group-hover:text-brand-1 dark:group-hover:text-brand ${loading ? "animate-spin text-brand" : "text-foreground/70"}`} />
            </Button>
          )}
        </div>
      </div>

      {loading && !data && <LoadingState simple />}
      {loading && data && isRefreshing && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card-grad p-12 shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">Updating latest GitHub data...</p>
        </div>
      )}
      
      {error && !loading && !data && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-center">
          <div className="font-display text-lg font-semibold">{error}</div>
          <p className="mt-1 text-sm text-muted-foreground">Try a different username or check the spelling.</p>
        </div>
      )}

      {data && (
        <div className={`transition-opacity duration-300 ${loading ? "opacity-40 grayscale-[0.5] pointer-events-none" : ""}`}>
          {/* Top profile + score */}
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card-grad p-6 shadow-elev"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <img
                  src={data.user.avatar}
                  alt={data.user.login}
                  className="h-20 w-20 rounded-2xl border border-border object-cover"
                  loading="lazy"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl font-bold">
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
                    <p className="mt-2 max-w-prose text-sm text-muted-foreground">{data.user.bio}</p>
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

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                  color="purple"
                />
                <Stat 
                  label="Public Repos" 
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
                  color="blue"
                />
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                <div className="flex h-5 items-center gap-1 rounded-md border border-amber/30 bg-amber/10 px-2 font-black text-[#f59e0b] shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-current" /> {data.score.stats.totalStars} Stars Earned
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="italic text-brand-1">Click tiles for deep analysis</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button 
                  onClick={share} 
                  size="sm" 
                  className="gap-2 bg-blue-600 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button 
                  onClick={() => exportPdf(data)} 
                  size="sm" 
                  className="gap-2 bg-emerald-600 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                >
                  <Download className="h-4 w-4" /> Export PDF
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card-grad p-6 shadow-elev"
            >
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <ScoreRing value={data.score.total} />
                <div className="flex-1 self-stretch">
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
            </motion.div>
          </div>

          {/* Best Repo */}
          {data.bestRepo && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-brand-1/40 bg-card-grad p-6 shadow-glow">
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
                    <p className="mt-1 max-w-prose text-sm text-muted-foreground">{data.bestRepo.description}</p>
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
                <TabsList className="bg-muted">
                  <TabsTrigger value="ai">AI Insights</TabsTrigger>
                  <TabsTrigger value="recruiter">Recruiter View</TabsTrigger>
                  <TabsTrigger value="repos">Repositories</TabsTrigger>
                  <TabsTrigger value="badges">Badges</TabsTrigger>
                </TabsList>

                <TabsContent value="ai" className="mt-6 space-y-6">
                {data.ai.summary && (
                  <Card title="Summary" icon={Sparkles}>
                    <p className="text-sm leading-relaxed text-muted-foreground">{data.ai.summary}</p>
                  </Card>
                )}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card title="Strengths" icon={TrendingUp} accent="success">
                    <BulletList items={data.ai.strengths} />
                  </Card>
                  <Card title="Weaknesses" icon={Lightbulb} accent="warning">
                    <BulletList items={data.ai.weaknesses} />
                  </Card>
                </div>
                <Card title="Action Steps" icon={Sparkles}>
                  <BulletList items={data.ai.actionSteps} numbered />
                </Card>
                {data.bestRepo && data.ai.readmeTips?.length > 0 && (
                  <Card title={`README tips for ${data.bestRepo.name}`} icon={Lightbulb}>
                    <BulletList items={data.ai.readmeTips} />
                  </Card>
                )}
                {data.ai.projectIdeas?.length > 0 && (
                  <Card title="Project Ideas" icon={Sparkles}>
                    <BulletList items={data.ai.projectIdeas} />
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="recruiter" className="mt-6">
                <Card title="Recruiter Perspective" icon={Users}>
                  <p className="leading-relaxed text-muted-foreground">
                    {data.ai.recruiterInsights || "No recruiter insights generated."}
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="repos" id="repos-list" className="mt-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  {(["all", "good", "improve", "archive"] as const).map((f) => (
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
                  {data.repos
                    .filter((r) => filter === "all" || r.classification === filter)
                    .map((r, i) => (
                      <RepoCard key={r.name} repo={r} index={i} />
                    ))}
                </div>
                {data.repos.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">No public repositories found.</p>
                )}
              </TabsContent>

              <TabsContent value="badges" className="mt-6">
                <BadgeGrid badges={data.badges} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

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
              <div className={`flex items-center justify-between border-b p-5 ${
                modalType === "stars" ? "bg-[#f59e0b] text-white" : 
                modalType === "followers" ? "bg-[#a855f7] text-white" : 
                "bg-[#2563eb] text-white"
              }`}>
                <h3 className="flex items-center gap-2 font-display text-xl font-black italic tracking-tight">
                  {modalType === "stars" && <><Star className="h-6 w-6 fill-current" /> Starred Repositories</>}
                  {modalType === "followers" && <><Users className="h-6 w-6" /> Followers List</>}
                  {modalType === "langs" && <><TrendingUp className="h-6 w-6" /> Language Breakdown</>}
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setModalType(null)} 
                  className="h-10 w-10 rounded-full bg-white text-[#ef4444] shadow-lg hover:bg-red-50 hover:text-red-600"
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
                        className="flex items-center justify-between rounded-xl border border-l-4 border-l-[#f59e0b] bg-card p-4 transition-all hover:bg-[#f59e0b]/5 hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-[#f59e0b]/10 p-2 text-[#f59e0b]">
                            <Star className="h-4 w-4 fill-current" />
                          </div>
                          <span className="font-bold">{r.name}</span>
                        </div>
                        <span className="flex items-center gap-1 font-display text-lg font-black text-[#f59e0b]">
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
                        className="flex flex-col items-center gap-3 rounded-2xl border border-l-4 border-l-[#a855f7] bg-card p-4 transition-all hover:bg-[#a855f7]/5 hover:shadow-md"
                      >
                        <div className="relative">
                          <img src={f.avatar} alt={f.login} className="h-16 w-16 rounded-full border-2 border-[#a855f7]/30 shadow-sm" />
                          <div className="absolute -bottom-1 -right-1 rounded-full bg-[#a855f7] p-1 text-white shadow-sm">
                            <Users className="h-3 w-3" />
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#a855f7]">@{f.login}</span>
                      </a>
                    ))}
                  </div>
                )}
                {modalType === "langs" && (
                  <div className="space-y-4">
                    {data?.score.stats.langDetails?.map((l, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold">{l.name}</span>
                          <span className="text-muted-foreground">{l.percentage}% ({l.count} repos)</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${l.percentage}%` }}
                            className="h-full bg-brand"
                          />
                        </div>
                      </div>
                    ))}
                    {(!data?.score.stats.langDetails || data.score.stats.langDetails.length === 0) && (
                      <p className="py-8 text-center text-sm text-muted-foreground">No language data available.</p>
                    )}
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
  const themes = {
    brand: "hover:border-brand/40 hover:bg-brand/5 text-brand-1",
    amber: "hover:border-amber/40 hover:bg-amber/5 text-amber",
    purple: "hover:border-purple/40 hover:bg-purple/5 text-purple",
    blue: "hover:border-blue/40 hover:bg-blue/5 text-blue",
  };

  return (
    <button 
      onClick={onClick}
      disabled={!onClick}
      className={`group relative overflow-hidden rounded-xl border border-border bg-background/40 p-3 text-left transition-all ${onClick ? themes[color] + " active:scale-95 shadow-sm" : ""}`}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-inherit">
        <Icon className="h-3.5 w-3.5 shrink-0" /> {label}
      </div>
      <div className="mt-1 font-display text-2xl font-black tabular-nums transition-transform group-hover:scale-105 group-hover:tracking-tight">{value.toLocaleString()}</div>
      {subLabel && <div className="mt-0.5 text-[10px] font-medium text-muted-foreground/60 transition-colors group-hover:text-inherit">{subLabel}</div>}
      
      {/* Subtle background glow on hover */}
      {onClick && (
        <div className={`absolute -right-4 -top-4 h-12 w-12 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-20 ${
          color === "brand" ? "bg-brand" : color === "amber" ? "bg-amber" : color === "purple" ? "bg-purple" : "bg-blue"
        }`} />
      )}
    </button>
  );
}

function Card({
  title,
  icon: Icon,
  children,
  accent,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  accent?: "success" | "warning";
}) {
  const accentClass =
    accent === "success" ? "text-success" : accent === "warning" ? "text-warning" : "text-brand-1";
  return (
    <div className="rounded-2xl border border-border bg-card-grad p-6 transition-all duration-300 hover:border-brand-1/30 hover:bg-muted/10 hover:shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accentClass}`} />
        <h3 className="font-display text-base font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items, numbered = false }: { items: string[]; numbered?: boolean }) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">—</p>;
  return (
    <ol className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed">
          <span className="mt-0.5 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-mono font-semibold">
            {numbered ? i + 1 : "•"}
          </span>
          <span className="text-foreground/90">{it}</span>
        </li>
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
