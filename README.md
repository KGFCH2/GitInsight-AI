# 🚀 GitInsight AI

> Professional GitHub Profile Analytics & Ambassador Ranking Platform.

GitInsight AI is a powerful evaluation system that helps organizations identify, rank, and improve campus ambassadors using GitHub performance metrics. Get a **0–100 profile score**, AI-generated recruiter-style insights, repo-level classification (Strong / Improve), badges, and exportable reports.

---

## ✨ Ambassador Dashboard

- **Rank ambassadors** by 0–100 score, XP and streaks
- **Recruiter-style** first impressions & TL;DRs
- **Per-repo classification**: Strong / Improve
- **Shareable reports**, exportable JSON

### 🎯 Problem Statement

> "Turn a single ambassador cohort into an always-on, self-sustaining growth engine — making community-led marketing structured, scalable, and measurable."

---

## 🛠️ Features

1. **📊 0–100 Profile Score** — Transparent 6-dimension breakdown of popularity, activity, breadth, quality, community, and tenure.
2. **🤖 AI Insights** — Summary, strengths, weaknesses, and action steps (powered by **Multi-Key Gemini** & Groq fallback).
3. **💼 Recruiter View** — Hireability paragraph from a professional recruiter's perspective.
4. **📁 Repo Quality Classifier** — Every repository tagged as Strong / Improve with visual badges.
5. **🌟 Best Repo Highlight** — Detailed README improvement tips and innovative project ideas.
6. **🏆 Interactive Dashboards** — Clickable stat tiles for deep dives into starred repos, followers, and languages.
7. **📄 PDF Export** — Download your results as a polished, color-themed report with real GitHub Achievement logos.
8. **🌓 Strict Case Matching** — Enforces exact username casing for professional profile accuracy.
9. **🌗 Dark / Light Mode** — Premium, responsive design with theme-aware colors and smooth animations.
10. **🔄 Real-time Refresh** — Fetch the latest GitHub data with a single click to bypass cache.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + ShadCN UI + Vanilla CSS
- **Animations:** Framer Motion
- **APIs:** GitHub REST API · Google Gemini (Multi-Key) · Groq
- **PDF Generation:** jsPDF
- **State Management:** React Query
- **Tooling:** Vite

---

## 📖 Documentation

- [🏗️ Architecture](ARCHITECTURE.md) — Deep dive into system design and API flow.
- [📝 Setup Instructions](INSTRUCTIONS.md) — Detailed guide to run and build locally.
- [⚖️ License](LICENSE.md) — MIT License information.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/KGFCH2/GitInsight-AI.git
cd gitinsight-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add your API keys. **This project supports multiple Gemini keys for high-volume analysis.**

```env
APP_GITHUB_TOKEN=your_github_token
APP_GROQ_API_KEY=your_groq_api_key

# Primary Gemini Keys (Rotation supported)
APP_GEMINI_API_KEY=your_gemini_key_1
APP_GEMINI_API_KEY_2=your_gemini_key_2
APP_GEMINI_API_KEY_3=your_gemini_key_3
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to see the app.

---

## 🔑 API Keys Setup

- **Gemini:** Get your API keys from [Google AI Studio](https://aistudio.google.com/apikey). You can provide up to 3 keys for rotation.
- **Groq:** Get your API key from [Groq Console](https://console.groq.com/keys).
- **GitHub Token:** Generate a token at [GitHub Settings](https://github.com/settings/tokens) (no scopes needed for public data).

---

## 📦 Build for Production

```bash
npm run build
```

The build artifacts will be located in the `dist/` directory.

---

## 📊 Metrics Calculation

GitInsight AI uses a transparent logic to calculate ambassador performance:

| Metric | Calculation Logic |
| :--- | :--- |
| **Ambassador Score** | Weighted average of 6 dimensions (Popularity, Quality, Activity, etc.) |
| **Ambassador XP** | `(Total Score * 10) + (Original Repositories * 5)` |
| **Activity Streak** | Count of repositories updated/pushed within the last 30 days |

---

## 📜 License

This project is licensed under the [MIT LICENSE](LICENSE.md).
