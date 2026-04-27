# 🚀 GitInsight AI

> AI-powered GitHub Profile Analyzer with recruiter-grade insights and gamified feedback.
>
> **Built for AICore Connect Hackathon by UnsaidTalks Education.**

Enter a GitHub username, get a **0–100 profile score**, AI-generated strengths and weaknesses, a recruiter view, repo-level classification (Good / Improve / Archive), badges, and a downloadable PDF report — all in under 2 minutes.

---

## ✨ Features

1. **📊 0–100 Profile Score** — Transparent 6-dimension breakdown of popularity, activity, breadth, quality, community, and tenure.
2. **🤖 AI Insights** — Summary, strengths, weaknesses, and action steps (powered by Gemini & Groq).
3. **💼 Recruiter View** — Hireability paragraph from a professional recruiter's perspective.
4. **📁 Repo Quality Classifier** — Every repository tagged as Good / Improve / Archive with visual badges.
5. **🌟 Best Repo Highlight** — Detailed README improvement tips and innovative project ideas.
6. **🏆 Interactive Dashboards** — Clickable stat tiles for deep dives into starred repos, followers, and languages.
7. **📄 PDF Export** — Download your results as a polished, color-themed report.
8. **🌗 Dark / Light Mode** — Premium, responsive design with theme-aware colors and smooth animations.
9. **🔄 Real-time Refresh** — Fetch the latest GitHub data with a single click to bypass cache.
10. **💾 Persistence** — Remembers your last analyzed profile even when browsing documentation.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + ShadCN UI + Vanilla CSS
- **Animations:** Framer Motion
- **APIs:** GitHub REST API · Google Gemini · Groq
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

Create a `.env` file in the root directory and add your API keys:

```env
VITE_GITHUB_TOKEN=your_github_token
VITE_GROQ_API_KEY=your_groq_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to see the app.

---

## 🔑 API Keys Setup

- **Gemini:** Get your API key from [Google AI Studio](https://aistudio.google.com/apikey).
- **Groq:** Get your API key from [Groq Console](https://console.groq.com/keys).
- **GitHub Token:** Generate a token at [GitHub Settings](https://github.com/settings/tokens) (no scopes needed for public data).

---

## 📦 Build for Production

```bash
npm run build
```

The build artifacts will be located in the `dist/` directory.

---

## 🏆 Hackathon & Attribution

This project was developed for the **AICore Connect Hackathon**.

- **Organization:** UnsaidTalks Education
- **Project Name:** GitInsight AI
- **Developer:** Babin Bid
- **Focus:** AI-powered evaluation for Campus Ambassador programs and developer profiles.

---

## 📜 License

This project is licensed under the [MIT LICENSE](LICENSE.md).
