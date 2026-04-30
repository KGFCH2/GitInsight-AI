# 📝 Platform Instructions & File Principles — GitInsight AI

Welcome to the technical and operational manual for GitInsight AI. This document details how to use the platform and explains the **working principle** of every core file in the codebase.

---

## 🛠️ File-by-File Working Principles

### 📁 Root Directory
- **`index.html`** 🌐: The entry point. Loads the React application and sets up the root viewport and metadata.
- **`package.json`** 📦: Manages project dependencies (React, Vite, Lucide, Framer Motion) and build scripts.
- **`tailwind.config.ts`** 🎨: Defines the premium design system, including custom brand colors and glassmorphism utilities.
- **`vite.config.ts`** ⚡: Configuration for the Vite build tool, handling path aliases and plugin management.

### 📁 `src/lib/` (The Engine)
- **`api.ts`** ⚙️: **The Core Logic Hub**. Handles GitHub API communication, score calculation heuristics, XP management, and administrative profile updates.
- **`pdf.ts`** 📄: **The Reporting Engine**. Uses `jsPDF` to programmatically draw professional vector-based reports with custom icons and multi-layered typography.
- **`types.ts`** 🏷️: Defines the global TypeScript interfaces for users, repositories, scores, and AI insights to ensure data integrity.
- **`utils.ts`** 🛠️: Contains helper functions like `cn` (class merging) and formatters used across the app.

### 📁 `src/pages/` (The Views)
- **`Home.tsx`** 🏠: The landing page. Handles the initial search input and brand introduction.
- **`Result.tsx`** ✨: **The Analysis Dashboard**. Orchestrates the display of scores, badges, recruiter insights, and repository lists.
- **`AdminAuth.tsx`** 🔑: Manages administrative login and registration security.
- **`AdminDashboard.tsx`** 🛡️: The "Commander Terminal". Provides ecosystem leads with tools to monitor ambassadors and manage their registry.
- **`Documentation.tsx`** 📖: Provides users with technical background on scoring and platform usage.
- **`FAQs.tsx`** ❓: A curated knowledge base answering common user and recruiter questions.

### 📁 `src/components/` (The Building Blocks)
- **`BadgeGrid.tsx`** 🏆: Renders the achievement grid with high-fidelity hover effects and floating animations.
- **`ScoreRing.tsx`** 🔢: A SVG-based dynamic progress ring that visualizes the final profile score.
- **`RepoCard.tsx`** 📁: A specialized card for displaying individual repository metrics and AI improvement tips.
- **`AnalyzeForm.tsx`** 🔍: The reusable search component with built-in validation.
- **`Layout.tsx`** 🖼️: The global wrapper that handles navigation, footers, and page transitions.

---

## 🚀 Operational Guides

### 👨‍💻 For Developers (Profile Analysis)
1. **Initiate**: Enter your username. Ensure casing is correct (e.g., `BabinBid`).
2. **Review**: Analyze your 0-100 score across 6 key dimensions.
3. **Badges**: Check the "Badges" tab to see your unlocked 3D achievements.
4. **Audit**: Click **Export PDF** to download your professional credentials.

### 👑 For Commanders (Admin Terminal)
1. **Security**: Access `/admin` to log into the Commander Terminal.
2. **Monitoring**: Track the Ambassador Progress leaderboard and XP rankings.
3. **History**: Use the "Full History Console" to audit all past profile analyses.
4. **Optimization**: Upload your avatar; the system will automatically compress it to save storage.

---
<p align="center">
  <i>Created by <b>Babin Bid</b> — GitInsight AI Engineering</i>
</p>
