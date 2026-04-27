import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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

    if (cleaned.toLowerCase() === currentUsername?.toLowerCase()) {
      // If same user, just trigger a refresh by navigating to the same path with a hash or just let Result handle it
      // Actually, if I navigate to the same path, useEffect in Result won't trigger if it only depends on [username]
      // I'll add a timestamp to the navigate or just call a window reload if necessary, 
      // but better to navigate to /result/user?refresh=...
      navigate(`/result/${encodeURIComponent(cleaned)}?t=${Date.now()}`);
    } else {
      setLoading(true);
      navigate(`/result/${encodeURIComponent(cleaned)}`);
    }
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={
          "group relative flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-elev transition-all focus-within:ring-brand sm:flex-row " +
          (large ? "sm:p-3" : "")
        }
      >
        <div className="flex flex-1 items-center gap-3 px-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="GitHub username (e.g. KGFCH2)"
            className="flex-1 h-12 border-none bg-transparent text-base outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          size={large ? "lg" : "default"}
          className="h-12 gap-2 rounded-xl bg-brand font-semibold text-primary-foreground hover:opacity-90"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Analyze Profile
        </Button>
      </div>
    </form>
  );
}
