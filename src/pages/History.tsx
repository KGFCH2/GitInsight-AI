import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2, User, X } from "lucide-react";
import { getHistory, removeFromHistory, type HistoryItem } from "@/lib/api";
import { Button } from "@/components/ui/button";

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("gitinsight:history");
    setHistory([]);
  };

  const removeOne = (e: React.MouseEvent, login: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromHistory(login);
    setHistory(getHistory());
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand">Activity</div>
            <h1 className="hover-pop mt-2 font-display text-4xl font-bold sm:text-5xl">Search History</h1>
            <p className="mt-3 text-muted-foreground">Your last 10 analyzed GitHub profiles.</p>
          </div>
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="w-fit gap-2 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" /> Clear All
            </Button>
          )}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {history.map((item) => (
            <div key={item.login + item.timestamp} className="group relative">
              <Link
                to={`/result/${item.login}?from=history`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card-grad p-4 transition-all hover:-translate-y-1 hover:border-brand-1/40 hover:shadow-glow"
              >
                <img
                  src={item.avatar}
                  alt={item.login}
                  className="h-14 w-14 rounded-xl border border-border object-cover transition-transform group-hover:scale-105"
                />
                <div className="flex-1 overflow-hidden">
                  <div className="font-display text-lg font-bold truncate">
                    {item.name || item.login}
                  </div>
                  <div className="text-sm text-muted-foreground">@{item.login}</div>
                  <div className="mt-1 flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(item.timestamp).toLocaleDateString('en-GB')}
                    </span>
                    <span className="font-bold text-brand-1">Score: {item.score}</span>
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => removeOne(e, item.login)}
                className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground opacity-0 shadow-sm transition-all hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                title="Remove from history"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {history.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-20 text-center">
              <div className="icon-pop flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="hover-pop mt-4 font-display text-xl font-bold">No history yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Profiles you analyze will appear here.</p>
              <Button asChild className="mt-6 bg-brand">
                <Link to="/analyze">Analyze a Profile</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
