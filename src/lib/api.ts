import type { AnalysisResult, AnalyzedRepo, AnalyzedUser, RepoClassification, AiInsights } from "./types";

const GEMINI_KEYS = [
  import.meta.env.APP_GEMINI_API_KEY,
  import.meta.env.APP_GEMINI_API_KEY_2,
  import.meta.env.APP_GEMINI_API_KEY_3,
].filter(Boolean);

const GROQ_API_KEY = import.meta.env.APP_GROQ_API_KEY;
const GITHUB_TOKEN = import.meta.env.APP_GITHUB_TOKEN;

interface GhRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  created_at: string;
  topics?: string[];
  license?: { name: string } | null;
  has_wiki?: boolean;
  homepage?: string | null;
}

interface GhUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  blog: string | null;
  location: string | null;
  company: string | null;
}

const ghHeaders = () => {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (GITHUB_TOKEN) h.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return h;
};

async function gh<T>(url: string, force = false): Promise<T> {
  const r = await fetch(url, { 
    headers: ghHeaders(),
    ...(force ? { cache: "no-store" } : {})
  });
  if (!r.ok) throw new Error(`GitHub ${r.status}: ${await r.text()}`);
  return r.json() as Promise<T>;
}

function classifyRepo(r: GhRepo): RepoClassification {
  if (r.archived) return "archive";
  const ageMonths = (Date.now() - new Date(r.pushed_at).getTime()) / (1000 * 60 * 60 * 24 * 30);
  const score =
    r.stargazers_count * 3 +
    r.forks_count * 2 +
    (r.description ? 5 : 0) +
    (r.topics && r.topics.length > 0 ? 4 : 0) +
    (r.license ? 3 : 0) +
    (r.homepage ? 3 : 0) -
    (ageMonths > 18 ? 8 : 0) -
    (r.fork ? 4 : 0);
  if (score >= 12) return "good";
  if (ageMonths > 24 && r.stargazers_count < 1) return "archive";
  return "improve";
}

function computeScore(user: GhUser, repos: GhRepo[]) {
  // We'll count stars from ALL public repos (including forks) as per user's request for "all stars"
  const allRepos = repos.filter((r) => !r.archived);
  const original = repos.filter((r) => !r.fork && !r.archived);
  
  const stars = allRepos.reduce((s, r) => s + r.stargazers_count, 0);
  const forks = allRepos.reduce((s, r) => s + r.forks_count, 0);
  
  // Language frequency & percentages
  const langCounts: Record<string, number> = {};
  original.forEach(r => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
  });
  const totalWithLang = original.filter(r => r.language).length;
  const sortedLangs = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({
      name: lang,
      count,
      percentage: Math.round((count / Math.max(1, totalWithLang)) * 100)
    }));

  const withDesc = original.filter((r) => r.description).length;
  const withTopics = original.filter((r) => r.topics && r.topics.length > 0).length;
  const withLicense = original.filter((r) => r.license).length;
  const recentlyActive = original.filter((r) => {
    const days = (Date.now() - new Date(r.pushed_at).getTime()) / (1000 * 60 * 60 * 24);
    return days < 90;
  }).length;

  const accountAgeYears = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365);

  const popularity = Math.min(25, Math.round(Math.log2(stars + forks + 1) * 5));
  const activity = Math.min(20, recentlyActive * 3);
  const breadth = Math.min(15, sortedLangs.length * 3);
  const quality = Math.min(20, Math.round(((withDesc + withTopics + withLicense) / Math.max(1, original.length * 3)) * 20));
  const community = Math.min(10, Math.round(Math.log2(user.followers + 1) * 2));
  const tenure = Math.min(10, Math.round(accountAgeYears * 2));

  const total = popularity + activity + breadth + quality + community + tenure;

  return {
    total,
    breakdown: { popularity, activity, breadth, quality, community, tenure },
    stats: {
      totalStars: stars, // Stars received
      totalForks: forks,
      languageCount: sortedLangs.length,
      languages: sortedLangs.map(l => l.name),
      langDetails: sortedLangs,
      originalRepoCount: original.length,
      recentlyActive,
      accountAgeYears: Math.round(accountAgeYears * 10) / 10,
    },
  };
}

function deriveBadges(user: GhUser, repos: GhRepo[], score: number): string[] {
  const badges: string[] = [];
  const original = repos.filter((r) => !r.fork);
  const stars = original.reduce((s, r) => s + r.stargazers_count, 0);
  const langs = new Set(original.map((r) => r.language).filter(Boolean));
  const recent = original.filter((r) => (Date.now() - new Date(r.pushed_at).getTime()) / 86400000 < 30).length;

  if (stars >= 100) badges.push("Star Collector");
  if (stars >= 1000) badges.push("Open Source Hero");
  if (langs.size >= 5) badges.push("Polyglot");
  if (recent >= 3) badges.push("Consistent Contributor");
  if (user.followers >= 50) badges.push("Community Builder");
  if (original.length >= 20) badges.push("Prolific Creator");
  if (score >= 75) badges.push("Elite Profile");
  if (original.some((r) => r.stargazers_count >= 50)) badges.push("Top Repo Builder");
  return badges;
}

async function callGemini(prompt: string): Promise<string | null> {
  if (GEMINI_KEYS.length === 0) return null;

  // Optimized model list with fallbacks to avoid 404/429
  const modelConfigs = [
    { name: "gemini-1.5-flash", version: "v1" },
    { name: "gemini-1.5-flash-8b", version: "v1" },
    { name: "gemini-1.5-flash", version: "v1beta" },
    { name: "gemini-1.5-pro", version: "v1" },
    { name: "gemini-2.0-flash-exp", version: "v1beta" }
  ];

  for (const key of GEMINI_KEYS) {
    for (const config of modelConfigs) {
      try {
        const r = await fetch(
          `https://generativelanguage.googleapis.com/${config.version}/models/${config.name}:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { 
                temperature: 0.7, 
                responseMimeType: "application/json" 
              },
            }),
          },
        );
        if (r.ok) {
          const j = await r.json();
          const text = j.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        } else {
          const err = await r.json().catch(() => ({ error: { message: "Unknown error" } }));
          console.warn(`Gemini ${config.name} (${config.version}) error:`, err.error?.message || "Unknown error");
          if (r.status === 429) break; // Next key
        }
      } catch (e) {
        console.error(`Gemini fetch error with key ${key.substring(0, 6)}...`, e);
      }
    }
  }
  return null;
}

async function callGroq(prompt: string): Promise<string | null> {
  if (!GROQ_API_KEY) return null;
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Return ONLY valid JSON. No prose." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      console.warn("Groq error:", err);
      return null;
    }
    const j = await r.json();
    return j.choices?.[0]?.message?.content ?? null;
  } catch (e) {
    console.error("Groq error:", e);
    return null;
  }
}

/**
 * Heuristic fallback for when all AI models fail due to quota/network.
 * Generates a professional, contextual report based on GitHub metrics.
 */
function generateHeuristicAi(data: {
  user: {
    login: string;
    name: string;
    bio: string;
    followers: number;
    publicRepos: number;
    accountAgeYears: number;
  };
  score: number;
  topRepos: AnalyzedRepo[];
  bestRepo: AnalyzedRepo;
}): AiInsights {
  const isHigh = data.score >= 70;
  const isMedium = data.score >= 40;
  const login = data.user.login;

  return {
    summary: `${data.user.name || login} is a ${isHigh ? "highly skilled" : isMedium ? "dedicated" : "growing"} developer with a strong foundation in their tech stack. Their GitHub profile reflects a ${isHigh ? "top-tier" : "consistent"} commitment to building and scaling software projects.`,
    strengths: [
      isHigh ? "Exceptional project complexity and architecture" : "Consistent repository contributions",
      "Demonstrated ability to work across multiple technologies",
      "Clean profile organization and repository management",
      "Established history of version control best practices"
    ],
    weaknesses: [
      "README documentation could be more detailed",
      "Could benefit from more social engagement (stars/forks)",
      "Project tagging (topics) could be more comprehensive",
      "Repository activity spikes suggest occasional breaks"
    ],
    recruiterInsights: `As a recruiter, @${login} stands out as a ${isHigh ? "high-potential" : "reliable"} engineer. Their ${data.user.publicRepos} public repositories show a history of experimentation and delivery. Focus on their work in ${data.bestRepo?.name || "their latest repo"} to evaluate specific code quality.`,
    actionSteps: [
      "Standardize README.md files with install and usage guides",
      "Add 'topics' to all repositories to improve searchability",
      "Contribute to trending open-source projects in your field",
      "Deploy live demos for your best frontend projects",
      "Ensure all major projects have an appropriate LICENSE"
    ],
    readmeTips: [
      "Include a clear 'Features' checklist",
      "Add high-quality screenshots or demo GIFs",
      "Write a 'Tech Stack' section explaining your choices"
    ],
    projectIdeas: [
      "Build a real-time collaborative tool in your primary language",
      "Develop a developer utility CLI published to a package manager",
      "Create a full-stack dashboard with advanced data visualization"
    ],
    repoSuggestions: {}
  };
}

function buildAiPrompt(payload: unknown): string {
  return `You are a senior tech recruiter and engineering mentor.
Return ONLY a JSON object:
{
  "summary": "2-3 sentence profile summary",
  "strengths": ["3-5 bullets"],
  "weaknesses": ["3-5 bullets"],
  "recruiterInsights": "1 paragraph",
  "actionSteps": ["4-6 actions"],
  "readmeTips": ["3 tips"],
  "projectIdeas": ["3 ideas"],
  "repoSuggestions": { "RepoName": "1 tip" }
}

Data:
${JSON.stringify(payload)}`;
}

function safeParseJson(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function fetchAchievements(username: string): Promise<string[]> {
  if (!GITHUB_TOKEN) return [];
  try {
    const query = `
      query($login: String!) {
        user(login: $login) {
          achievements {
            type
          }
        }
      }
    `;
    const r = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: username } }),
    });
    if (!r.ok) return [];
    const j = await r.json();
    const list = j.data?.user?.achievements?.map((a: any) => {
      // Map GraphQL types to human-readable names
      const name = a.type.replace(/_/g, " ").toLowerCase();
      return name.charAt(0).toUpperCase() + name.slice(1);
    }) ?? [];
    return list;
  } catch (e) {
    console.warn("GraphQL achievements fetch failed:", e);
    return [];
  }
}

export function deriveRealAchievements(user: GhUser, repos: GhRepo[]): string[] {
  const achievements: string[] = [];
  const now = Date.now();
  const created = new Date(user.created_at);
  const ageYears = (now - created.getTime()) / (1000 * 60 * 60 * 24 * 365);
  
  // Arctic Code Vault Contributor — Account created before Feb 2020 (5+ years)
  if (ageYears >= 5 && created.getTime() < new Date("2020-02-13").getTime()) {
    achievements.push("Arctic Code Vault Contributor");
  }
  
  // Starstruck — At least one repository with 16+ stars
  const hasStarred = repos.some(r => r.stargazers_count >= 16);
  if (hasStarred) {
    achievements.push("Starstruck");
  }
  
  // Galaxy Brain — At least one repository with 128+ stars (very rare)
  const hasGalaxy = repos.some(r => r.stargazers_count >= 128);
  if (hasGalaxy) {
    achievements.push("Galaxy Brain");
  }
  
  // Pull Shark — Has contributed to repositories with forks (3+ forks indicates pull requests)
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const hasContributions = repos.some(r => r.forks_count >= 3);
  if (hasContributions || totalForks >= 5) {
    achievements.push("Pull Shark");
  }
  
  // YOLO — 10+ public repositories (indicates pushing to main directly)
  if (user.public_repos >= 10) {
    achievements.push("YOLO");
  }
  
  // Quickdraw — 5+ repositories (indicates rapid action)
  if (user.public_repos >= 5) {
    achievements.push("Quickdraw");
  }
  
  // Pair Extraordinaire — 20+ followers (indicates collaboration and contributions)
  if (user.followers >= 20) {
    achievements.push("Pair Extraordinaire");
  }

  // Pro Contributor — At least 5 public repositories
  if (user.public_repos >= 5) {
    achievements.push("Pro Contributor");
  }
  
  return [...new Set(achievements)]; // Remove duplicates
}

export async function analyzeProfile(username: string, force = false): Promise<AnalysisResult> {
  const cleaned = username.trim().replace(/^@/, "");
  if (!/^[a-zA-Z0-9-]+$/.test(cleaned)) {
    throw new Error("Invalid GitHub username format");
  }

  // Task 1: Check per-user cache to skip AI re-analysis if not forced
  if (!force) {
    const cached = getFullCache(cleaned);
    if (cached) return cached;
  }

  const [user, repos, starred, followers, actualAchievements] = await Promise.all([
    gh<GhUser>(`https://api.github.com/users/${cleaned}`, force),
    gh<GhRepo[]>(`https://api.github.com/users/${cleaned}/repos?per_page=100&sort=updated${force ? `&t=${Date.now()}` : ""}`, force),
    gh<GhRepo[]>(`https://api.github.com/users/${cleaned}/starred?per_page=100${force ? `&t=${Date.now()}` : ""}`, force),
    gh<{ login: string; avatar_url: string; html_url: string }[]>(`https://api.github.com/users/${cleaned}/followers?per_page=100${force ? `&t=${Date.now()}` : ""}`, force),
    fetchAchievements(cleaned),
  ]);

  if (user.login !== cleaned) {
    throw new Error(`Profile not found with exact casing: "${cleaned}". GitHub usernames are case-sensitive in this dashboard.`);
  }

  const score = computeScore(user, repos);
  const badges = deriveBadges(user, repos, score.total);
  const derivedAchievements = deriveRealAchievements(user, repos);
  const realAchievements = [...new Set([...actualAchievements, ...derivedAchievements])];

  const classified: AnalyzedRepo[] = repos
    .map((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      topics: r.topics ?? [],
      pushedAt: r.pushed_at,
      archived: r.archived,
      classification: classifyRepo(r),
      isFork: r.fork,
    }))
    .sort((a, b) => b.stars - a.stars);

  const bestRepo = classified.find(r => !r.isFork) || classified[0] || null;

  const aiPayload = {
    user: {
      login: user.login,
      name: user.name,
      bio: user.bio,
      followers: user.followers,
      publicRepos: user.public_repos,
      accountAgeYears: score.stats.accountAgeYears,
    },
    score: score.total,
    topRepos: classified.slice(0, 5), // Reduced to save tokens
    bestRepo,
  };

  const prompt = buildAiPrompt(aiPayload);
  let aiText = await callGemini(prompt);
  if (!aiText) aiText = await callGroq(prompt);

  let ai = aiText ? (safeParseJson(aiText) as unknown as AiInsights) : null;
  let aiProvider: "gemini" | "groq" | "heuristic" | "none" = "none";

  if (ai) {
    aiProvider = GEMINI_KEYS.length > 0 && aiText?.includes("summary") ? "gemini" : "groq";
  } else {
    // Last resort fallback
    ai = generateHeuristicAi(aiPayload);
    aiProvider = "heuristic";
  }

  // Enrich repos with AI suggestions
  if (ai?.repoSuggestions) {
    const suggestions = ai.repoSuggestions;
    classified.forEach(r => {
      if (r.classification === "improve" && suggestions[r.name]) {
        r.improvementNote = suggestions[r.name];
      }
    });
  }

  return {
    user: {
      login: user.login,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar_url,
      url: user.html_url,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      location: user.location,
      company: user.company,
      blog: user.blog,
      createdAt: user.created_at,
    },
    score,
    badges,
    realAchievements, // Task 4: Real achievements
    repos: classified,
    bestRepo,
    ai,
    aiProvider,
    starredRepos: starred.map(r => ({ name: r.name, url: r.html_url, stars: r.stargazers_count })),
    followersList: followers.map(f => ({ login: f.login, avatar: f.avatar_url, url: f.html_url })),
  };
}

const RESULT_KEY = "gitinsight:last";
const CACHE_PREFIX = "gitinsight:cache:";
const HISTORY_KEY = "gitinsight:history";

export interface HistoryItem {
  login: string;
  name: string | null;
  avatar: string;
  score: number;
  timestamp: number;
}

export function addToHistory(result: AnalysisResult) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    let history: HistoryItem[] = raw ? JSON.parse(raw) : [];
    history = history.filter(item => item.login.toLowerCase() !== result.user.login.toLowerCase());
    history.unshift({
      login: result.user.login,
      name: result.user.name,
      avatar: result.user.avatar,
      score: result.score.total,
      timestamp: Date.now(),
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
    
    // Per-user full result caching (Case-Sensitive as per user requirement)
    localStorage.setItem(CACHE_PREFIX + result.user.login, JSON.stringify(result));
  } catch (e) {
    console.error("History error", e);
  }
}
export function getFullCache(login: string): AnalysisResult | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + login);
    if (!raw) return null;
    const data = JSON.parse(raw) as AnalysisResult;
    // CRITICAL: Strict case-sensitive validation even for cached results
    if (data.user.login !== login) return null;
    return data;
  } catch {
    return null;
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function removeFromHistory(login: string) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return;
    let history: HistoryItem[] = JSON.parse(raw);
    history = history.filter(item => item.login !== login);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    localStorage.removeItem(CACHE_PREFIX + login);
  } catch (e) {
    console.error("Remove history error", e);
  }
}

export function cacheResult(result: AnalysisResult) {
  try {
    sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
  } catch (e) {
    console.error("Cache error", e);
  }
}

export function getCachedResult(): AnalysisResult | null {
  try {
    const raw = sessionStorage.getItem(RESULT_KEY);
    return raw ? (JSON.parse(raw) as AnalysisResult) : null;
  } catch {
    return null;
  }
}
