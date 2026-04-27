# 🏗️ Architecture GitInsight AI

GitInsight AI is a client-side React application that analyzes a GitHub profile, calculates a deterministic score, enriches the result with AI-generated insights, stores local history, and exports a PDF report.

## 🌐 System Topology

```mermaid
flowchart LR
   U[User Browser] --> UI[React App]
   UI --> R[React Router]
   UI --> Q[React Query]
   UI --> LS[LocalStorage]
   UI --> PDF[jsPDF Export]

   Q --> API[analyzeProfile in src lib api ts]
   API --> GH[GitHub REST API]
   API --> G1[Gemini API - Key Rotation]
   API --> G2[Groq API Fallback]

   GH --> API
   G1 --> API
   G2 --> API
   API --> UI
```

## 🧭 Route Architecture

```mermaid
flowchart TD
   A[src main tsx] --> B[src App tsx]
   B --> C[Layout]
   C --> D[Navbar - Result Persistence]
   C --> E[Footer]
   C --> F[Outlet]

   F --> H[Home page]
   F --> I[Analyze page]
   F --> J[Result page username]
   F --> K[History page]
   F --> L[Docs page]
```

## 🔄 Analyze Pipeline End-to-End

```mermaid
sequenceDiagram
   participant User
   participant AnalyzePage as Analyze page
   participant ResultPage as Result page
   participant API as src lib api ts
   participant GitHub as GitHub API
   participant Gemini as Gemini API
   participant Groq as Groq API

   User->>AnalyzePage: Submit username
   AnalyzePage->>ResultPage: Navigate to result route
   ResultPage->>API: analyzeProfile username
   API->>GitHub: Fetch user profile
   API->>API: Validate Case-Sensitive Match
   alt Casing Mismatch
      API-->>ResultPage: Throw Error
      ResultPage-->>User: Show mismatch message
   else Valid Casing
      API->>GitHub: Fetch repositories (per_page=100)
      API->>API: Classify repos and compute score
      API->>Gemini: Request JSON (Multi-Key Rotation)
      alt Gemini success
         Gemini-->>API: Structured JSON
      else Gemini fail or rate limit
         API->>Groq: Request JSON fallback
         Groq-->>API: Structured JSON
      end
      API-->>ResultPage: AnalysisResult object
      ResultPage-->>User: Render score breakdown and insights
   end
```

## 📊 Scoring And Classification Logic

The system uses a 0–100 deterministic scoring engine based on:
1. **Popularity**: Stars and forks (including forked repos).
2. **Activity**: Recent push dates (< 90 days).
3. **Breadth**: Unique primary language count.
4. **Quality**: README presence, topics, metadata, and licensing.
5. **Community**: Followers and engagement.
6. **Tenure**: Account age in years.

## 💾 State And Persistence

1. **Analysis Memory**: The application remembers the last successfully analyzed user. Navigating away (e.g. to Docs) and back to "Analyze" preserves the result.
2. **Reset Logic**: Navigating to the Home page via the logo or Home link clears the persistence state for a fresh start.
3. **History**: Results are appended to a local history list for quick access.

## 📄 PDF Export Flow

Uses `jsPDF` to generate a high-fidelity, color-themed report including:
- Profile summary and avatar.
- Score dimension bar charts.
- Detailed AI strengths/weaknesses.
- Repository classification table and badges.

## 🔐 Security Model

1. API tokens are read from `import.meta.env` with the custom `APP_` prefix configured in Vite.
2. The system supports up to **3 Gemini API keys** to distribute traffic and prevent rate limiting during high-volume hackathon usage.

## 🛟 Resilience And Failure Handling

- **Strict Validation**: Invalid formats or casing mismatches are caught early.
- **Provider Fallback**: Gemini errors trigger an immediate Groq fallback attempt.
- **Cache Busting**: "Refresh" actions use timestamp parameters to ensure fresh GitHub data.

---
© 2026 GitInsight AI · Developed by Babin Bid for AICore Connect Hackathon.
