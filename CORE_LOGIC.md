# Core Logic & Scoring Engine — GitInsight AI

GitInsight AI utilizes a sophisticated heuristic engine coupled with LLM intelligence to transform raw Git metadata into strategic insights.

## 1. Metric Classification & Logic

The system distinguishes between several key repository types to ensure accuracy:
- **Total Presence**: Includes all stars earned across the entire GitHub account, including forks.
- **Original Output**: Specifically measures "Own Repositories" (excluding forked) to quantify a developer's creative contribution.
- **Community Engagement**: Measured through "Forked Repos" and follower velocity.

## 2. The GitInsight Score (0-100)

The score is a weighted aggregation across six distinct engineering dimensions:

| Dimension | Weight | Primary Data Source |
| :--- | :--- | :--- |
| **Popularity** | 25% | Sum of Stars and Forks on original repos |
| **Activity** | 20% | Commit frequency, push events, and streak |
| **Quality** | 20% | README depth, Licenses, and Topic usage |
| **Breadth** | 15% | Language diversity and tech stack overlap |
| **Community** | 10% | Follower count and network engagement |
| **Tenure** | 10% | Account age and consistency over years |

## 3. Achievement & Badge System

The platform tracks 10 strategic achievements using high-fidelity assets:
1.  **Star Collector**: 100+ Total Stars.
2.  **Open Source Hero**: 1,000+ Total Stars (Master Level).
3.  **Polyglot**: Proficiency in 5+ distinct programming languages.
4.  **Consistent Contributor**: 3+ active repos updated within 30 days.
5.  **Community Builder**: 50+ Followers.
6.  **Prolific Creator**: 20+ Public Repositories.
7.  **Elite Profile**: Total Score of 75+.
8.  **Top Repo Builder**: At least one flagship repo with 50+ stars.
9.  **Rising Star**: Score 50+ within the first year of account creation.
10. **Veteran Coder**: Active presence for 5+ years.

## 4. AI Insight Generation

When an API Key (Gemini/Groq) is provided, the system enhances raw scores with:
- **Recruiter Perspective**: Narrative analysis of technical strengths.
- **Actionable Growth**: Specific steps to increase profile visibility.
- **Repository Optimization**: Automated README improvement suggestions.
- **Repository Ideas**: Personalized project suggestions based on user specialization.

---
*Created by Babin Bid — GitInsight AI Engineering*
