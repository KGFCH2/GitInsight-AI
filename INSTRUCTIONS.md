# 📘 Instructions GitInsight AI

This document explains how to run the project, how users should use it, and the working principle of every file in the repository.

## 🧰 Prerequisites

1. Node.js 18 or newer.
1. npm 9 or newer.
1. Internet access for GitHub API and AI APIs.

## ⚙️ Setup

1. Open the project folder.

```bash
cd gitinsight-ai
```

1. Install dependencies.

```bash
npm install
```

1. Create a `.env` file from `.env.example` and set values.

```env
APP_GITHUB_TOKEN=your_github_token
APP_GEMINI_API_KEY=your_gemini_key
APP_GEMINI_API_KEY_2=optional_second_gemini_key
APP_GEMINI_API_KEY_3=optional_third_gemini_key
APP_GROQ_API_KEY=your_groq_key
```

1. Start development server.

```bash
npm run dev
```

1. Open the URL shown in terminal, usually `http://localhost:8080`.

## 🧭 User Guidance

1. Open Home and read feature summary.
1. Go to Analyze and enter a valid GitHub username without URL.
1. Wait for profile, repos, score, and AI insights to load.
1. Review score breakdown and repository labels good improve archive.
1. Export report using PDF download action on Result page.
1. Reopen previous analyses from History page.
1. Use Docs page for scoring method and FAQ.
1. Toggle theme using the navbar icon as needed.

## 🛠️ Troubleshooting

1. If analysis fails with API errors, verify keys in `.env` and restart dev server.
1. If GitHub requests fail, check token validity and public rate limit.
1. If AI insights fail, the app should still render deterministic score and repo analysis.
1. If favicon or static assets do not update, hard refresh browser cache.
1. If styles look broken, ensure Tailwind build is running through Vite.

## 🧪 Scripts

1. `npm run dev` starts development server.
1. `npm run build` creates production build.
1. `npm run build:dev` creates development mode build.
1. `npm run preview` previews built output.
1. `npm run lint` runs ESLint.
1. `npm run test` runs Vitest once.
1. `npm run test:watch` runs Vitest in watch mode.

## 🗂️ Working Principle Of Every File

### 📁 Root Files

1. `.env.example` defines safe template variables for local environment setup.
1. `.gitignore` prevents local secrets and generated artifacts from being committed.
1. `ARCHITECTURE.md` documents system design, flow, and architectural decisions.
1. `INSTRUCTIONS.md` provides setup guidance and per file behavior notes.
1. `LICENSE.md` contains project license terms.
1. `README.md` presents project overview, features, and quick start information.
1. `components.json` configures ShadCN component generator aliases and style options.
1. `eslint.config.js` configures lint rules for TypeScript and React files.
1. `index.html` is the single HTML shell used by Vite and React runtime.
1. `package.json` defines scripts and dependency metadata for npm workflows.
1. `package-lock.json` locks dependency versions for reproducible installations.
1. `postcss.config.js` enables Tailwind and Autoprefixer in CSS pipeline.
1. `tailwind.config.ts` defines Tailwind theme tokens and scanned file globs.
1. `tsconfig.json` sets shared TypeScript compiler configuration.
1. `tsconfig.app.json` sets TypeScript rules for browser app source files.
1. `tsconfig.node.json` sets TypeScript rules for Node side config files.
1. `vite.config.ts` configures dev server, alias resolution, and build behavior.
1. `vitest.config.ts` configures test environment and setup files for Vitest.

### 🖼️ Public Asset

1. `public/favicon.png` provides browser tab favicon and in app logo image source.

### 🏁 Runtime Entry And Global Styling

1. `src/main.tsx` mounts React app into root DOM element.
1. `src/App.tsx` defines providers and full route tree.
1. `src/index.css` defines global CSS variables, theme tokens, and utility classes.
1. `src/vite-env.d.ts` types `import.meta.env` keys used in client code.

### 🧠 Core Logic In src lib

1. `src/lib/api.ts` fetches GitHub data, computes score, calls AI models, and stores history helpers.
1. `src/lib/pdf.ts` generates downloadable PDF report using jsPDF.
1. `src/lib/types.ts` defines domain types for results, repos, user, and AI payloads.
1. `src/lib/utils.ts` provides shared utility helpers such as class name merging.

### 🧱 Feature Components In src components

1. `src/components/Layout.tsx` composes page shell with navbar footer and outlet.
1. `src/components/Navbar.tsx` renders top navigation, theme toggle, and brand identity.
1. `src/components/Footer.tsx` renders footer links, branding, and legal navigation.
1. `src/components/AnalyzeForm.tsx` captures username input and triggers navigation.
1. `src/components/BadgeGrid.tsx` renders earned badge list with icon mapping.
1. `src/components/RepoCard.tsx` renders single repository metrics and classification state.
1. `src/components/ScoreBreakdownChart.tsx` visualizes score dimension bars.
1. `src/components/ScoreRing.tsx` renders circular score visualization with gradient stroke.
1. `src/components/ScrollToTop.tsx` resets scroll position on route transitions.
1. `src/components/ThemeToggle.tsx` switches between light and dark themes.
1. `src/components/NavLink.tsx` provides reusable styled navigation link behavior.

### 🎛️ UI Primitives In src components ui

1. `src/components/ui/accordion.tsx` exports accordion primitives and styles.
1. `src/components/ui/button.tsx` exports variant based button primitive.
1. `src/components/ui/input.tsx` exports styled input primitive.
1. `src/components/ui/sonner.tsx` exports toast container wrapper.
1. `src/components/ui/tabs.tsx` exports tab primitives and styles.
1. `src/components/ui/toast.tsx` exports toast components and action helpers.
1. `src/components/ui/tooltip.tsx` exports tooltip primitives.

### 🪝 Custom Hook

1. `src/hooks/use-mobile.tsx` detects mobile viewport state for responsive logic.

### 📄 Pages In src pages

1. `src/pages/Home.tsx` renders landing page, value proposition, and entry actions.
1. `src/pages/Analyze.tsx` renders analyze workflow wrapper and form context.
1. `src/pages/Result.tsx` orchestrates analysis fetch, displays result panels, and export actions.
1. `src/pages/History.tsx` reads and renders locally stored analysis history.
1. `src/pages/Docs.tsx` shows user facing scoring and usage documentation.
1. `src/pages/Privacy.tsx` displays privacy policy content.
1. `src/pages/Terms.tsx` displays terms of use content.
1. `src/pages/NotFound.tsx` renders fallback for unknown routes.

### ✅ Test Files In src test

1. `src/test/example.test.ts` contains baseline unit test example.
1. `src/test/setup.ts` configures test environment and shared test utilities.

## 🔁 Development Workflow Guidance

1. Create feature in small commits by page or module.
1. Keep secrets only in `.env` and never hardcode keys.
1. Add or update types in `src/lib/types.ts` first when API shape changes.
1. Keep UI primitives in `src/components/ui` and feature composition in `src/components`.
1. Run lint and tests before push.

## 📦 Production Build And Preview

```bash
npm run build
npm run preview
```

Build output is generated in `dist`.

## ⚖️ License

Project license text is in `LICENSE.md`.
