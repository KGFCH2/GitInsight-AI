import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  defaultValue?: string;
  large?: boolean;
}

export function AnalyzeForm({ defaultValue = "", large = false }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { username: currentUsername } = useParams();

  useEffect(() => {
    setValue(defaultValue);
    setLoading(false);
  }, [defaultValue]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = value.trim().replace(/^@/, "");
    if (!cleaned) {
      toast.error("Enter a GitHub username");
      return;
    }
    if (!/^[a-zA-Z0-9-]+$/.test(cleaned) || cleaned.length > 39) {
      toast.error("Invalid GitHub username");
      return;
    }

    // Save the analyzed username to localStorage for later retrieval
    localStorage.setItem("lastAnalyzedUser", cleaned);

    if (cleaned.toLowerCase() === currentUsername?.toLowerCase()) {
      navigate(`/result/${encodeURIComponent(cleaned)}?t=${Date.now()}`);
    } else {
      setLoading(true);
      navigate(`/result/${encodeURIComponent(cleaned)}`);
    }
    setValue(""); // Clear the input after initiating analysis
  };

  return (
    <form onSubmit={submit} className="flex-1">
      <div
        className={
          "group relative flex flex-col gap-2 rounded-2xl glass-card p-1.5 transition-all focus-within:ring-brand sm:flex-row sm:flex-nowrap sm:items-center sm:gap-1 " +
          (large ? "sm:p-2" : "")
        }
      >
        <div className="flex flex-1 items-center gap-2 px-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit(e)}
            placeholder="GitHub username (e.g. KGFCH2)"
            className="flex-[2] h-10 min-w-[220px] border-none bg-transparent text-sm outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          size={large ? "lg" : "default"}
          className="h-10 shrink-0 gap-2 rounded-xl bg-brand font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-95"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
          <span className="whitespace-nowrap">Analyze Profile</span>
        </Button>
      </div>
    </form>
  );
}
