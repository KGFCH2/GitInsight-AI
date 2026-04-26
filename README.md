# 🚀 GitInsight AI

> AI-powered GitHub Profile Analyzer with recruiter-grade insights and gamified feedback.

Enter a GitHub username, get a **0–100 profile score**, AI-generated strengths and weaknesses, a recruiter view, repo-level classification (Good / Improve / Archive), badges, and a downloadable PDF report — all in under 2 minutes.

---

## ✨ Features

1. **📊 0–100 Profile Score** with transparent 6-dimension breakdown.
2. **🤖 AI Insights** — summary, strengths, weaknesses, and action steps (powered by Gemini & Groq).
3. **💼 Recruiter View** — hireability paragraph from a professional recruiter's perspective.
4. **📁 Repo Quality Classifier** — every repository tagged as Good / Improve / Archive.
5. **🌟 Best Repo Highlight** — README improvement tips and project ideas.
6. **🏆 Gamified Badges** — Polyglot, Top Repo Builder, Elite Profile, and more.
7. **📄 PDF Export** — Download your results as a polished report.
8. **🌗 Dark / Light Mode** — Fully responsive and accessible design.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + ShadCN UI
- **Animations:** Framer Motion
- **APIs:** GitHub REST API · Google Gemini · Groq
- **PDF Generation:** jsPDF
- **State Management:** React Query

---

## 📖 Documentation

- [🏗️ Architecture](ARCHITECTURE.md) — Deep dive into system design and API flow.
- [📝 Setup Instructions](INSTRUCTIONS.md) — Detailed guide to run and build locally.
- [⚖️ License](LICENSE.md) — MIT License information.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/gitinsight-ai.git
cd gitinsight-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add your API keys:

```env
APP_GITHUB_TOKEN=your_github_token
APP_GROQ_API_KEY=your_groq_api_key
APP_GEMINI_API_KEY=your_gemini_api_key
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

## 📜 License

This project is licensed under the [MIT LICENSE](LICENSE.md).
