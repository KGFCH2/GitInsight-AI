# 🏗️ Architecture GitInsight AI

GitInsight AI is a client side React application that analyzes a GitHub profile, calculates a deterministic score, enriches the result with AI generated insights, stores local history, and exports a PDF report.

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
   API --> G1[Gemini API]
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
   C --> D[Navbar]
   C --> E[Footer]
   C --> F[Outlet]

   F --> H[Home page]
   F --> I[Analyze page]
   F --> J[Result page username]
   F --> K[History page]
   F --> L[Docs page]
   F --> M[Privacy page]
   F --> N[Terms page]
   F --> O[NotFound page]
```

## 🔄 Analyze Pipeline End to End

```mermaid
sequenceDiagram
   participant User
   participant AnalyzePage as Analyze page
   participant ResultPage as Result page
   participant API as src lib api ts
   participant GitHub as GitHub API
   participant Gemini as Gemini API
   participant Groq as Groq API
   participant Storage as LocalStorage

   User->>AnalyzePage: Submit username
   AnalyzePage->>ResultPage: Navigate to result route
   ResultPage->>API: analyzeProfile username
   API->>GitHub: Fetch user profile
   API->>GitHub: Fetch repositories
   API->>API: Classify repos and compute score
   API->>Gemini: Request JSON insights
   alt Gemini success
      Gemini-->>API: Structured JSON
   else Gemini fail or rate limit
      API->>Groq: Request JSON insights fallback
      Groq-->>API: Structured JSON
   end
   API-->>ResultPage: AnalysisResult object
   ResultPage->>Storage: Save last result and append history
   ResultPage-->>User: Render score breakdown repos and insights
```

## 📊 Scoring And Classification Logic

```mermaid
flowchart TD
   A[GitHub profile and repos] --> B[Filter non fork active repos]
   B --> C[Compute metrics]
   C --> C1[Popularity stars forks]
   C --> C2[Activity recent pushes]
   C --> C3[Breadth language count]
   C --> C4[Quality readme metadata topics license]
   C --> C5[Community followers]
   C --> C6[Tenure account age]
   C1 --> D[Aggregate to total 0 to 100]
   C2 --> D
   C3 --> D
   C4 --> D
   C5 --> D
   C6 --> D
   B --> E[Per repo classification]
   E --> E1[good]
   E --> E2[improve]
   E --> E3[archive]
```

## 🧩 Data Contracts

`src/lib/types.ts` defines the shared contracts used across the app.

1. `AnalyzedUser`: normalized profile model used by UI.
2. `AnalyzedRepo`: repository metadata and classification.
3. `AnalysisResult`: full payload returned by `analyzeProfile`.
4. `AiInsights`: strict shape expected from Gemini or Groq JSON.

## 💾 State And Persistence

```mermaid
flowchart LR
   UI[Result page state] --> K1[gitinsight last]
   UI --> K2[gitinsight history]
   K1 --> LS[(LocalStorage)]
   K2 --> LS
   LS --> H[History page list]
```

1. Last analyzed profile is stored for quick revisit.
2. History list is append only with deduping by login where needed.
3. No backend database is used.

## 📄 PDF Export Flow

```mermaid
flowchart TD
   A[Result page export action] --> B[src lib pdf ts]
   B --> C[Build report sections]
   C --> D[Header and profile summary]
   C --> E[Score metrics and charts]
   C --> F[AI insights and action steps]
   C --> G[Repo table and badges]
   G --> H[Download file GitInsight username pdf]
```

## 🔐 Security Model

1. API tokens are read from `import.meta.env` with `APP_` prefixed keys.
2. `.env` is ignored by git and `.env.example` is tracked as template.
3. Since this is a client side app, tokens loaded into the browser are not fully secret.
4. For stricter security move API calls to a backend and keep keys server side.

## 🛟 Resilience And Failure Handling

1. Username input is validated before network calls.
2. GitHub API errors are surfaced with status details.
3. Gemini fallback to Groq improves completion reliability.
4. If both AI providers fail, deterministic score and repo analytics still render.

## 🚀 Deployment Shape

```mermaid
flowchart LR
   A[Source] --> B[Vite build]
   B --> C[Static assets in dist]
   C --> D[Any static host]
   D --> E[Browser runtime only]
```

This project is licensed under the MIT License in `LICENSE.md`.
