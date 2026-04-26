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
  const original = repos.filter((r) => !r.fork && !r.archived);
  const stars = original.reduce((s, r) => s + r.stargazers_count, 0);
  const forks = original.reduce((s, r) => s + r.forks_count, 0);
  const langs = new Set(original.map((r) => r.language).filter(Boolean));
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
  const breadth = Math.min(15, langs.size * 3);
  const quality = Math.min(20, Math.round(((withDesc + withTopics + withLicense) / Math.max(1, original.length * 3)) * 20));
  const community = Math.min(10, Math.round(Math.log2(user.followers + 1) * 2));
  const tenure = Math.min(10, Math.round(accountAgeYears * 2));

  const total = popularity + activity + breadth + quality + community + tenure;

  return {
    total,
    breakdown: { popularity, activity, breadth, quality, community, tenure },
    stats: {
      totalStars: stars,
      totalForks: forks,
      languageCount: langs.size,
      languages: Array.from(langs) as string[],
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

  for (const key of GEMINI_KEYS) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
          }),
        },
      );
      if (r.ok) {
        const j = await r.json();
        const text = j.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.error("Gemini error with key", key.substring(0, 6) + "...", e);
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
    if (!r.ok) return null;
    const j = await r.json();
    return j.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

function buildAiPrompt(payload: unknown): string {
  return `You are a senior tech recruiter and engineering mentor analyzing a GitHub profile.
Return ONLY a JSON object with this exact shape (no markdown, no commentary):
{
  "summary": "2-3 sentence profile summary, confident and specific",
  "strengths": ["3-5 short bullet points"],
  "weaknesses": ["3-5 short bullet points"],
  "recruiterInsights": "1 paragraph from a recruiter's perspective on hireability and fit",
  "actionSteps": ["4-6 concrete improvement actions"],
  "readmeTips": ["3-4 specific README improvement tips for the best repo"],
  "projectIdeas": ["3 portfolio project ideas tailored to their stack"]
}

Profile data:
${JSON.stringify(payload, null, 2)}`;
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

export async function analyzeProfile(username: string, force = false): Promise<AnalysisResult> {
  const cleaned = username.trim().replace(/^@/, "");
  if (!/^[a-zA-Z0-9-]+$/.test(cleaned)) {
    throw new Error("Invalid GitHub username format");
  }

  const user = await gh<GhUser>(`https://api.github.com/users/${cleaned}`, force);
  const repos = await gh<GhRepo[]>(`https://api.github.com/users/${cleaned}/repos?per_page=100&sort=updated`, force);

  const score = computeScore(user, repos);
  const badges = deriveBadges(user, repos, score.total);

  const classified: AnalyzedRepo[] = repos
    .filter((r) => !r.fork)
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
    }))
    .sort((a, b) => b.stars - a.stars);

  const bestRepo = classified[0] ?? null;

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
    topRepos: classified.slice(0, 8),
    bestRepo,
  };

  const prompt = buildAiPrompt(aiPayload);
  let aiText = await callGemini(prompt);
  if (!aiText) aiText = await callGroq(prompt);

  const ai = aiText ? (safeParseJson(aiText) as unknown as AiInsights) : null;

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
    repos: classified,
    bestRepo,
    ai: ai ?? {
      summary: "AI insights unavailable right now.",
      strengths: [],
      weaknesses: [],
      recruiterInsights: "",
      actionSteps: [],
      readmeTips: [],
      projectIdeas: [],
    },
    aiProvider: aiText ? (GEMINI_KEYS.length > 0 ? "gemini" : "groq") : "none",
  };
}

const RESULT_KEY = "gitinsight:last";
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
    
    // Remove if already exists
    history = history.filter(item => item.login.toLowerCase() !== result.user.login.toLowerCase());
    
    // Add to start
    history.unshift({
      login: result.user.login,
      name: result.user.name,
      avatar: result.user.avatar,
      score: result.score.total,
      timestamp: Date.now(),
    });
    
    // Limit to 10
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
  } catch (e) {
    console.error("History error", e);
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
