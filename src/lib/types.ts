export type RepoClassification = "good" | "improve" | "archive";

export interface AnalyzedRepo {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  pushedAt: string;
  archived: boolean;
  classification: RepoClassification;
  isFork?: boolean;
  improvementNote?: string;
}

export interface AnalyzedUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar: string;
  url: string;
  followers: number;
  following: number;
  publicRepos: number;
  location: string | null;
  company: string | null;
  blog: string | null;
  createdAt: string;
}

export interface ScoreBreakdown {
  popularity: number;
  activity: number;
  breadth: number;
  quality: number;
  community: number;
  tenure: number;
}

export interface ScoreStats {
  totalStars: number;
  totalForks: number;
  languageCount: number;
  languages: string[];
  originalRepoCount: number;
  recentlyActive: number;
  accountAgeYears: number;
  langDetails?: { name: string; count: number; percentage: number }[];
}

export interface AiInsights {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recruiterInsights: string;
  actionSteps: string[];
  readmeTips: string[];
  projectIdeas: string[];
  repoSuggestions?: Record<string, string>;
}

export interface AnalysisResult {
  user: AnalyzedUser;
  score: { total: number; breakdown: ScoreBreakdown; stats: ScoreStats };
  badges: string[];
  repos: AnalyzedRepo[];
  bestRepo: AnalyzedRepo | null;
  ai: AiInsights;
  aiProvider: "gemini" | "groq" | "none";
  starredRepos?: { name: string; url: string; stars: number }[];
  followersList?: { login: string; avatar: string; url: string }[];
  langDetails?: { name: string; count: number; percentage: number }[];
}
