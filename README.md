# GitInsight AI — Premium GitHub Profile Analyzer

GitInsight AI is a gamified, AI-powered platform designed to help developers showcase their impact, analyze their growth, and connect with recruiters through data-driven insights. It transforms raw GitHub data into a professional, strategic career asset.

![GitInsight AI Favicon](/public/favicon.png)

## 🚀 Core Features

- **Multi-Dimensional Scoring**: A precise 0-100 score evaluating Popularity, Activity, Quality, Breadth, Community, and Tenure.
*   **Repository-Centric Analysis**: Intelligent classification of "Own Repositories" vs "Forked Repositories" for accurate impact measurement.
- **Recruiter Perspective**: Exclusive AI insights (Gemini/Groq) detailing how a technical recruiter perceives your profile.
- **Ambassador Dashboard**: A secure "Commander-in-Chief" terminal for community leads to track progress, rank ambassadors, and manage the registry.
- **Elite Badge System**: 10 high-fidelity 3D badges awarded for milestones like "Star Collector," "Polyglot," and "Elite Profile."
- **Professional PDF Audit**: One-click professional reports with detailed metric sublabels, ideal for inclusion in job applications.
- **Admin Optimization**: Advanced client-side image compression (Auto-resize to 400px, JPEG 80% quality) for efficient profile management.

## 📊 Key Metrics Explained

*   **Stars**: "All Stars Earned by users" — Total stars across the entire public presence.
*   **Forks**: "All Forked Repos" — Measure of community contribution and reach.
*   **Repositories**: "Only Own Repos, excluding Forked" — A true measure of original engineering output.
*   **Languages**: "Most Used Languages" — Tech stack diversity and specialization.

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Vanilla CSS, Tailwind CSS, Framer Motion (Glassmorphism & High-Fidelity Animations)
- **Icons**: Lucide React (Star, GitFork, Code2, etc.)
- **AI Engine**: Google Gemini 1.5 Pro / Groq Llama 3
- **Reporting**: Custom jsPDF Implementation

## 📖 Documentation

For detailed technical and operational info, see:
- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design, data flow, and image optimization logic.
- [CORE_LOGIC.md](./CORE_LOGIC.md) — Scoring algorithms, metric weighting, and AI prompts.
- [INSTRUCTIONS.md](./INSTRUCTIONS.md) — Step-by-step guide for developers and platform commanders.

## 🏁 Quick Start

```bash
npm install
npm run dev
```

---
*Created by Babin Bid — GitInsight AI Engineering*
