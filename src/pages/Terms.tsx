const Terms = () => (
  <div className="container max-w-3xl py-12">
    <h1 className="font-display text-4xl font-bold">Terms of Service</h1>
    <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
    <div className="prose prose-sm mt-8 max-w-none text-foreground/90">
      <p>GitInsight AI is provided as-is, without warranties of any kind. By using the service, you agree to use it responsibly and only with public GitHub usernames.</p>
      <h2 className="mt-6 font-display text-xl font-bold">Acceptable use</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
        <li>Do not use the service to harass or harm any individual.</li>
        <li>Do not attempt to overload, scrape, or reverse-engineer the service.</li>
        <li>AI-generated insights are subjective and should not be the sole basis for hiring decisions.</li>
      </ul>
      <h2 className="mt-6 font-display text-xl font-bold">Liability</h2>
      <p className="mt-2 text-sm text-muted-foreground">We are not responsible for decisions made based on the analysis. Always corroborate with direct review.</p>
    </div>
  </div>
);
export default Terms;
