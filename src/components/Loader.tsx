import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  text?: string;
  duration?: number;
  onComplete?: () => void;
}

const statusMessages = [
  "Initializing GitInsight Engine",
  "Fetching GitHub Profile Data",
  "Analyzing Repository Patterns",
  "Classifying Code Quality",
  "Computing Developer Score",
  "Generating AI Insights",
  "Finalizing Report",
];

export function Loader({ text, duration = 2500, onComplete }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 60fps update rate for smoother "load balancing" visual
    const fps = 60;
    const intervalMs = 1000 / fps;
    const step = 100 / (duration / intervalMs);
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (onComplete) {
            // Balanced delay before completing
            setTimeout(onComplete, 400);
          }
          return 100;
        }
        return Math.min(100, prev + step);
      });
    }, intervalMs);

    return () => clearInterval(progressInterval);
  }, [duration, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-6 transition-colors duration-500">
      {/* Centered Brand Icon */}
      <div className="relative mb-8">
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-brand/30 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-card/80 shadow-glow backdrop-blur"
        >
          <img src="/favicon.png" alt="GitInsight" className="h-10 w-10 object-contain" />
        </motion.div>
      </div>

      <div className="w-full max-w-[300px] space-y-6">
        {/* Step List */}
        <div className="space-y-3 px-1">
          {statusMessages.map((msg, i) => {
            const stepThreshold = (i / statusMessages.length) * 100;
            const isCompleted = progress > stepThreshold + (100 / statusMessages.length) || (i === statusMessages.length - 1 && progress >= 100);
            const isActive = progress > stepThreshold && !isCompleted;
            
            return (
              <motion.div 
                key={i}
                animate={{ 
                  opacity: isActive || isCompleted ? 1 : 0.3,
                  x: isActive ? 4 : 0
                }}
                className="flex items-center gap-3"
              >
                <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isCompleted ? "border-brand bg-brand text-primary-foreground" : 
                  isActive ? "border-brand animate-pulse" : "border-muted"
                }`}>
                  {isCompleted && (
                    <motion.svg 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      className="h-2.5 w-2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  )}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive ? "text-brand" : isCompleted ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {msg}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress System */}
        <div className="space-y-2">
          <div className="flex justify-between px-1 font-mono text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
            <span>Neural Analysis</span>
            <span className="text-brand">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted/30">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-brand shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
