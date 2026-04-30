# 📝 Platform Instructions & Full File Directory — GitInsight AI

This document provides a comprehensive technical guide to every single file in the GitInsight AI project, detailing their specific purpose and working principle.

---

## 🛠️ Root Directory
- **`ARCHITECTURE.md`** 🏗️: Detailed system design, data flow, and image optimization logic.
- **`CORE_LOGIC.md`** 🧠: Scoring algorithms, metric weighting, and AI intelligence pipeline.
- **`INSTRUCTIONS.md`** 📖: (This file) Comprehensive technical guide and operational manual.
- **`README.md`** 🚀: Project overview, professional branding, and quick-start guide.
- **`LICENSE.md`** 📄: Legal information and MIT license terms.
- **`.gitignore`** 🙈: Specifies which files and directories should be ignored by Git.
- **`index.html`** 🌐: The main entry point for the browser. Loads the React root.
- **`package.json`** 📦: Project metadata, scripts, and dependency management.
- **`package-lock.json`** 🔒: Exact versions of every dependency for reproducible builds.
- **`postcss.config.js`** 🎨: Configuration for CSS post-processing with Tailwind.
- **`tailwind.config.ts`** ✨: Design system configuration (colors, fonts, glassmorphism).
- **`tsconfig.json` / `tsconfig.node.json`** ⌨️: TypeScript compiler settings for app and build tools.
- **`vite.config.ts`** ⚡: Build tool configuration, path aliases, and development server settings.
- **`components.json`** 🧱: Configuration for the UI component library primitives.

---

## 📁 `src/` (Core Application)
- **`App.tsx`** 📱: Main application component and routing configuration.
- **`main.tsx`** 🚀: Bootstraps the React application into the DOM.
- **`index.css`** 🖌️: Global styles, design tokens, and glassmorphism utilities.
- **`vite-env.d.ts`** 🏷️: TypeScript definitions for Vite environment variables.

### 📁 `src/lib/` (The Engine)
- **`api.ts`** ⚙️: **Core Logic Hub**. Handles API calls, scoring, and registry logic.
- **`pdf.ts`** 📄: **Reporting Engine**. Generates professional PDF Audit Reports.
- **`types.ts`** 🏷️: Global TypeScript interfaces and domain models.
- **`utils.ts`** 🛠️: Shared utility functions and Tailwind class merging logic.

### 📁 `src/pages/` (Views)
- **`Home.tsx`** 🏠: The primary landing page and username entry.
- **`Result.tsx`** ✨: **The Analysis Dashboard**. Shows scores, insights, and badges.
- **`AdminAuth.tsx`** 🔑: Administrative login and registration gateway.
- **`AdminDashboard.tsx`** 🛡️: **Commander Terminal**. Registry and history management.
- **`Analyze.tsx`** 🔍: Logic wrapper for the analysis state and fetching sequence.
- **`APIReference.tsx`** 🔗: Developer documentation for the underlying GitInsight API.
- **`Documentation.tsx`** 📖: Technical background on how the platform works.
- **`FAQs.tsx`** ❓: Comprehensive knowledge base for common questions.
- **`History.tsx`** 📜: Full log of past profile analyses for reference.
- **`Privacy.tsx`** 🔒: Legal disclosure of data handling and privacy policies.
- **`Terms.tsx`** ⚖️: Legal terms and conditions of service.
- **`NotFound.tsx`** 🚫: Graceful 404 error page for invalid routes.

### 📁 `src/components/` (UI Blocks)
- **`AnalyzeForm.tsx`** 🔍: Reusable username input with validation logic.
- **`BadgeGrid.tsx`** 🏆: Interactive achievement display with hover effects.
- **`BulletList.tsx`** 📝: Styled lists for strengths, weaknesses, and ideas.
- **`Card.tsx`** 🗂️: The base glassmorphism card component used everywhere.
- **`Footer.tsx`** 🦶: Global site footer with credits and legal links.
- **`Layout.tsx`** 🖼️: The main page wrapper and navigation coordinator.
- **`Navbar.tsx`** 🧭: Global navigation bar with theme and admin controls.
- **`NavLink.tsx`** 🔗: Smart links with active-state styling.
- **`RepoCard.tsx`** 📁: Detailed repository audit cards with AI feedback.
- **`ScoreRing.tsx`** 🔢: SVG-based animated score visualization.
- **`ScoreBreakdownChart.tsx`** 📊: Visual breakdown of the 6 score dimensions.
- **`ThemeToggle.tsx`** 🌓: Switch between dark and light modes.
- **`ScrollToTop.tsx`** 🔝: Utility to reset scroll position on navigation.

#### 📁 `src/components/ui/` (Primitives)
- **`accordion.tsx`** 🔽: Collapsible content sections for FAQs.
- **`button.tsx` / `button-variants.ts`** 🖱️: Flexible, theme-aware button system.
- **`input.tsx`** ⌨️: Styled text inputs with glassmorphism support.
- **`sonner.tsx`** 🔔: Toast notification provider and styling.
- **`tabs.tsx`** 📑: Multi-view container for the Results page.
- **`tooltip.tsx`** 💬: Hover information overlays for metrics.
- **`toast.tsx`** 🍞: Legacy notification components.

### 📁 `src/test/` (Quality Assurance)
- **`example.test.ts`** 🧪: Template for unit and integration testing.
- **`setup.ts`** 🏗️: Configuration for the Vitest testing environment.

---
<p align="center">
  <i>Maintained by <b>Babin Bid</b> — GitInsight AI Engineering</i>
</p>
