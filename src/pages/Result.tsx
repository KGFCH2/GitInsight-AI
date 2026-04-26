import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [filter, setFilter] = useState<"all" | RepoClassification>("all");
  const [showTop, setShowTop] = useState(false);
  const { username = "" } = useParams();

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);
    analyzeProfile(username)
      .then((r) => {
        if (cancelled) return;
        setData(r);
        cacheResult(r);
        addToHistory(r);
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setError(e.message || "Failed to analyze");
        toast.error(e.message || "Failed to analyze");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [username]);

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
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Profile Report</div>
          <h1 className="hover-pop font-display text-3xl font-bold sm:text-4xl">
            @{username}
          </h1>
        </div>
        <div className="w-full max-w-md sm:w-auto">
          <AnalyzeForm defaultValue={username} />
        </div>
      </div>

      {loading && <LoadingState />}
      {error && !loading && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-center">
          <div className="font-display text-lg font-semibold">{error}</div>
          <p className="mt-1 text-sm text-muted-foreground">Try a different username or check the spelling.</p>
        </div>
      )}

      {data && !loading && (
        <>
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
                    <h2 className="hover-pop font-display text-2xl font-bold">
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
                <Stat label="Stars" value={data.score.stats.totalStars} icon={Star} />
                <Stat label="Followers" value={data.user.followers} icon={Users} />
                <Stat label="Repos" value={data.score.stats.originalRepoCount} icon={Sparkles} />
                <Stat label="Languages" value={data.score.stats.languageCount} icon={TrendingUp} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button onClick={share} variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button onClick={() => exportPdf(data)} variant="outline" size="sm" className="gap-2">
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
                    className="hover-pop font-display text-2xl font-bold hover:text-brand-1"
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
          <div className="mt-8">
            <Tabs defaultValue="ai" className="w-full">
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

              <TabsContent value="repos" className="mt-6">
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
                    .slice(0, 30)
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
        </>
      )}
    </div>
  );
};

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="icon-pop rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 font-display text-xl font-bold tabular-nums">{value.toLocaleString()}</div>
    </div>
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
    <div className="icon-pop rounded-2xl border border-border bg-card-grad p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accentClass}`} />
        <h3 className="hover-pop font-display text-base font-semibold">{title}</h3>
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

function LoadingState() {
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
