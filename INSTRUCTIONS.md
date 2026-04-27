# 📘 Instructions GitInsight AI

This document explains how to run the project, how users should use it, and the working principle of every file in the repository.

## 🧰 Prerequisites

1. Node.js 18 or newer.
2. npm 9 or newer.
3. Internet access for GitHub API and AI APIs.

## ⚙️ Setup

1. Open the project folder.

```bash
cd gitinsight-ai
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file from `.env.example` and set values.

```env
APP_GITHUB_TOKEN=your_github_token
APP_GROQ_API_KEY=your_groq_key
APP_GEMINI_API_KEY=your_gemini_key_1
APP_GEMINI_API_KEY_2=optional_second_gemini_key
APP_GEMINI_API_KEY_3=optional_third_gemini_key
```

4. Start development server.

```bash
npm run dev
```

5. Open the URL shown in terminal, usually `http://localhost:8080`.

## 🧭 User Guidance

1. Open Home and read feature summary.
2. Go to Analyze and enter a valid GitHub username without URL.
3. **Note on Casing**: The analyzer enforces **Strict Case Matching**. If a user's GitHub username is `KGFCH2`, entering `kgfch2` will result in a casing mismatch error. Always use the exact casing found on GitHub.
4. Wait for profile, repos, score, and AI insights to load.
5. Review score breakdown and repository labels (good, improve, archive).
6. Export report using PDF download action on Result page.
7. Reopen previous analyses from History page.
8. Use Docs page for scoring method and FAQ.
9. Toggle theme using the navbar icon as needed.

## 🛠️ Troubleshooting

1. **Casing Mismatch**: If you see an error about username mismatch, double check the exact casing of the GitHub login.
2. **API Keys**: If AI insights fail, ensure you have at least one valid Gemini API key. The system will rotate through up to 3 keys if provided.
3. **GitHub Requests**: If requests fail, check your GitHub token. No scopes are required for public data.
4. **Deterministic Mode**: If all AI providers fail (rate limits/keys), the app will still render a complete report using deterministic score and repo analytics.
5. **Static Assets**: If images or icons do not update, hard refresh your browser.

## 🧪 Scripts

1. `npm run dev` starts development server.
2. `npm run build` creates production build.
3. `npm run preview` previews built output.
4. `npm run lint` runs ESLint.
5. `npm run test` runs Vitest.

## 🗂️ Working Principle Of Every File

### 📁 Root Files

1. `.env.example` defines safe template variables for local environment setup.
2. `.gitignore` prevents local secrets and generated artifacts from being committed.
3. `ARCHITECTURE.md` documents system design, flow, and architectural decisions.
4. `INSTRUCTIONS.md` provides setup guidance and per-file behavior notes.
5. `LICENSE.md` contains project license terms.
6. `README.md` presents project overview, features, and quick start information.
7. `vite.config.ts` configures dev server with the custom `APP_` environment prefix.

### 🧠 Core Logic In src/lib

1. `src/lib/api.ts` handles:
   - **Strict Case Validation**: Verifies input matches GitHub login casing.
   - **Multi-Key Gemini Integration**: Rotates through API keys to handle volume.
   - **Groq Fallback**: Ensures insights generate even if Gemini is unavailable.
   - **Deterministic Scoring**: Calculates the 0–100 profile score.
2. `src/lib/pdf.ts` generates downloadable PDF report using jsPDF.

### 🧱 Feature Components In src/components

1. `src/components/Navbar.tsx` implements analysis persistence logic (remembers results until Home is clicked).
2. `src/components/AnalyzeForm.tsx` captures username and handles initial navigation.

### 📄 Pages In src/pages

1. `src/pages/Result.tsx` orchestrates the analysis fetch, displays the report, handles real-time refreshes, and renders themed detail modals for stars, followers, and languages.
2. `src/pages/Documentation.tsx` explains the scoring methodology and provides user FAQs.

## 🔁 Development Workflow Guidance

1. Keep secrets only in `.env` and never hardcode keys.
2. Add or update types in `src/lib/types.ts` first when API shape changes.
3. Keep UI primitives in `src/components/ui` and feature composition in `src/components`.

## ⚖️ License

Project license text is in `LICENSE.md`.
