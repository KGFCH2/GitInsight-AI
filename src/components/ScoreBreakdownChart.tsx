import { motion } from "framer-motion";

interface Props {
  data: { label: string; value: number; max: number }[];
}

export function ScoreBreakdownChart({ data }: Props) {
  return (
    <div className="space-y-4">
      {data.map((d, i) => {
        const pct = Math.round((d.value / d.max) * 100);
        return (
          <div key={d.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium">{d.label}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {d.value}/{d.max}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, delay: i * 0.08, ease: "easeOut" }}
                className="h-full rounded-full bg-brand"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
