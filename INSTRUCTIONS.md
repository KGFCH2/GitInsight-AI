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
APP_GEMINI_API_KEY=your_gemini_key
APP_GEMINI_API_KEY_2=optional_second_gemini_key
APP_GEMINI_API_KEY_3=optional_third_gemini_key
APP_GROQ_API_KEY=your_groq_key
```

4. Start development server.

```bash
npm run dev
```

5. Open the URL shown in terminal, usually `http://localhost:8080`.

## 🧭 User Guidance

1. Open Home and read feature summary.
2. Go to Analyze and enter a valid GitHub username without URL.
3. Wait for profile, repos, score, and AI insights to load.
4. Review score breakdown and repository labels (good, improve, archive).
5. Export report using PDF download action on Result page.
6. Reopen previous analyses from History page.
7. Use Docs page for scoring method and FAQ.
8. Toggle theme using the navbar icon as needed.

## 🛠️ Troubleshooting

1. If analysis fails with API errors, verify keys in `.env` and restart dev server.
2. If GitHub requests fail, check token validity and public rate limit.
3. If AI insights fail, the app should still render deterministic score and repo analysis.
4. If favicon or static assets do not update, hard refresh browser cache.
5. If styles look broken, ensure Tailwind build is running through Vite.

## 🧪 Scripts

1. `npm run dev` starts development server.
2. `npm run build` creates production build.
3. `npm run build:dev` creates development mode build.
4. `npm run preview` previews built output.
5. `npm run lint` runs ESLint.
6. `npm run test` runs Vitest once.
7. `npm run test:watch` runs Vitest in watch mode.

## 🗂️ Working Principle Of Every File

### 📁 Root Files

1. `.env.example` defines safe template variables for local environment setup.
2. `.gitignore` prevents local secrets and generated artifacts from being committed.
3. `ARCHITECTURE.md` documents system design, flow, and architectural decisions.
4. `INSTRUCTIONS.md` provides setup guidance and per-file behavior notes.
5. `LICENSE.md` contains project license terms.
6. `README.md` presents project overview, features, and quick start information.
7. `components.json` configures ShadCN component generator aliases and style options.
8. `eslint.config.js` configures lint rules for TypeScript and React files.
9. `index.html` is the single HTML shell used by Vite and React runtime.
10. `package.json` defines scripts and dependency metadata for npm workflows.
11. `package-lock.json` locks dependency versions for reproducible installations.
12. `postcss.config.js` enables Tailwind and Autoprefixer in CSS pipeline.
13. `tailwind.config.ts` defines Tailwind theme tokens and scanned file globs.
14. `tsconfig.json` sets shared TypeScript compiler configuration.
15. `tsconfig.app.json` sets TypeScript rules for browser app source files.
16. `tsconfig.node.json` sets TypeScript rules for Node-side config files.
17. `vite.config.ts` configures dev server, alias resolution, and build behavior.
18. `vitest.config.ts` configures test environment and setup files for Vitest.

### 🖼️ Public Asset

1. `public/favicon.png` provides browser tab favicon and in-app logo image source.

### 🏁 Runtime Entry And Global Styling

1. `src/main.tsx` mounts React app into root DOM element.
2. `src/App.tsx` defines providers and full route tree.
3. `src/index.css` defines global CSS variables, theme tokens, and utility classes.
4. `src/vite-env.d.ts` types `import.meta.env` keys used in client code.

### 🧠 Core Logic In src/lib

1. `src/lib/api.ts` fetches GitHub data, computes score, calls AI models, and stores history helpers.
2. `src/lib/pdf.ts` generates downloadable PDF report using jsPDF.
3. `src/lib/types.ts` defines domain types for results, repos, user, and AI payloads.
4. `src/lib/utils.ts` provides shared utility helpers such as class name merging.

### 🧱 Feature Components In src/components

1. `src/components/Layout.tsx` composes page shell with navbar, footer, and outlet.
2. `src/components/Navbar.tsx` renders top navigation, theme toggle, and brand identity.
3. `src/components/Footer.tsx` renders footer links, branding, and legal navigation.
4. `src/components/AnalyzeForm.tsx` captures username input and triggers navigation.
5. `src/components/BadgeGrid.tsx` renders earned badge list with icon mapping.
6. `src/components/RepoCard.tsx` renders single repository metrics and classification state.
7. `src/components/ScoreBreakdownChart.tsx` visualizes score dimension bars.
8. `src/components/ScoreRing.tsx` renders circular score visualization with gradient stroke.
9. `src/components/ScrollToTop.tsx` resets scroll position on route transitions.
10. `src/components/ThemeToggle.tsx` switches between light and dark themes.
11. `src/components/NavLink.tsx` provides reusable styled navigation link behavior.

### 🎛️ UI Primitives In src/components/ui

1. `src/components/ui/accordion.tsx` exports accordion primitives and styles.
2. `src/components/ui/button.tsx` exports variant-based button primitive.
3. `src/components/ui/input.tsx` exports styled input primitive.
4. `src/components/ui/sonner.tsx` exports toast container wrapper.
5. `src/components/ui/tabs.tsx` exports tab primitives and styles.
6. `src/components/ui/toast.tsx` exports toast components and action helpers.
7. `src/components/ui/tooltip.tsx` exports tooltip primitives.

### 🪝 Custom Hook

1. `src/hooks/use-mobile.tsx` detects mobile viewport state for responsive logic.

### 📄 Pages In src/pages

1. `src/pages/Home.tsx` renders landing page, value proposition, and entry actions.
2. `src/pages/Analyze.tsx` renders analyze workflow wrapper and form context.
3. `src/pages/Result.tsx` orchestrates analysis fetch, displays result panels, and export actions.
4. `src/pages/History.tsx` reads and renders locally stored analysis history.
5. `src/pages/Docs.tsx` shows user-facing scoring and usage documentation.
6. `src/pages/Privacy.tsx` displays privacy policy content.
7. `src/pages/Terms.tsx` displays terms of use content.
8. `src/pages/NotFound.tsx` renders fallback for unknown routes.

### ✅ Test Files In src/test

1. `src/test/example.test.ts` contains baseline unit test example.
2. `src/test/setup.ts` configures test environment and shared test utilities.

## 🔁 Development Workflow Guidance

1. Create features in small commits by page or module.
2. Keep secrets only in `.env` and never hardcode keys.
3. Add or update types in `src/lib/types.ts` first when API shape changes.
4. Keep UI primitives in `src/components/ui` and feature composition in `src/components`.
5. Run lint and tests before pushing.

## 📦 Production Build And Preview

1. Run `npm run build` to create a production build.
2. Run `npm run preview` to preview the built output.

Build output is generated in `dist`.

## ⚖️ License

Project license text is in `LICENSE.md`.
