# 🏗️ Architecture - GitInsight AI

GitInsight AI is a modern, fully client-side web application designed to analyze GitHub profiles using AI.

## 🚀 System Overview

The project has been migrated from a serverless/Edge Function architecture to a **Pure Frontend** architecture. This ensures maximum speed, lower latency, and simpler deployment.

### 🛠️ Technology Stack

- **Framework**: [React 18](https://reactjs.org/) + TypeScript tooling
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/)
- **AI Models**: [Google Gemini 2.0 Flash](https://ai.google.dev/) (Primary) & [Groq Llama 3.3](https://groq.com/) (Fallback)
- **PDF Generation**: [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/index.html)

## 📡 API Orchestration

The core logic resides in `src/lib/api.ts`. The flow is as follows:

1. **Data Fetching**: Fetches user profile and repository data directly from the GitHub API using the provided `APP_GITHUB_TOKEN`.
2. **Scoring Engine**: Computes a deterministic score (0-100) based on popularity, activity, breadth, quality, community, and tenure.
3. **AI Analysis**:
   - Sends the aggregated data to **Gemini**.
   - If Gemini fails or hits a rate limit, the system automatically falls back to **Groq**.
4. **Insight Parsing**: The AI returns a structured JSON containing a summary, strengths, weaknesses, and recruiter-specific insights.

## 📂 Project Structure

- `src/components/`: Reusable UI components and layout elements.
- `src/lib/`: Core logic (API handling, PDF generation, type definitions).
- `src/pages/`: Application views (Home, Analyze, Result, Docs).
- `public/`: Static assets like the favicon.

## ⚖️ License

This project is licensed under the [MIT License](LICENSE.md).
