const Privacy = () => (
  <div className="container max-w-3xl py-12">
    <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
    <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
    <div className="prose prose-sm mt-8 max-w-none text-foreground/90">
      <p>GitInsight AI does not require an account and does not store personal data. When you submit a GitHub username, we fetch publicly available data from the GitHub API and process it in-memory to generate your report.</p>
      <h2 className="mt-6 font-display text-xl font-bold">What we access</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
        <li>Public profile information (avatar, bio, follower count, account creation date)</li>
        <li>Public repositories and their metadata (stars, forks, topics, language)</li>
      </ul>
      <h2 className="mt-6 font-display text-xl font-bold">AI processing</h2>
      <p className="mt-2 text-sm text-muted-foreground">Profile data is sent to Google Gemini (or Groq as fallback) to generate insights. No data is retained for training.</p>
      <h2 className="mt-6 font-display text-xl font-bold">Cookies</h2>
      <p className="mt-2 text-sm text-muted-foreground">We use a single localStorage entry for your theme preference. No tracking cookies.</p>
    </div>
  </div>
);
export default Privacy;
