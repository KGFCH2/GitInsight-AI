import { AnalyzeForm } from "@/components/AnalyzeForm";

const Analyze = () => {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="hover-pop font-display text-4xl font-bold sm:text-5xl">Analyze a GitHub Profile</h1>
        <p className="mt-3 text-muted-foreground">
          Paste any GitHub username to generate an AI-powered profile report.
        </p>
        <div className="mt-10">
          <AnalyzeForm large />
        </div>
      </div>
    </div>
  );
};

export default Analyze;
