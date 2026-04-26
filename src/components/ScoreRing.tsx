import { motion } from "framer-motion";

interface Props {
  value: number;
  size?: number;
  label?: string;
}

export function ScoreRing({ value, size = 220, label = "Profile Score" }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  const tier =
    clamped >= 80 ? "Elite" : clamped >= 60 ? "Strong" : clamped >= 40 ? "Solid" : clamped >= 20 ? "Emerging" : "Beginner";

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-1))" />
            <stop offset="50%" stopColor="hsl(var(--brand-2))" />
            <stop offset="100%" stopColor="hsl(var(--brand-3))" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#scoreGrad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-display text-6xl font-bold tabular-nums"
        >
          {clamped}
        </motion.div>
        <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mt-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-brand">
          {tier}
        </div>
      </div>
    </div>
  );
}
