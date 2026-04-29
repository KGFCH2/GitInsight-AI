import { useEffect, useState } from "react";
import { AnalyzeForm } from "@/components/AnalyzeForm";

const Analyze = () => {
  const [lastUsername, setLastUsername] = useState("");

  useEffect(() => {
    // Get the last analyzed username from localStorage
    const stored = localStorage.getItem("lastAnalyzedUser");
    if (stored) {
      setLastUsername(stored);
    }
  }, []);

  return (
    <div className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-gradient hover-pop font-display text-4xl font-bold sm:text-5xl">Analyze a GitHub Profile</h1>
        <p className="mt-3 text-muted-foreground">
          Paste any GitHub username to generate an AI-powered profile report.
        </p>
        <div className="mt-10">
          <AnalyzeForm large defaultValue={lastUsername} />
        </div>
      </div>
    </div>
  );
};

export default Analyze;
