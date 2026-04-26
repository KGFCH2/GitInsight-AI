import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors duration-500",
        dark 
          ? "bg-zinc-900 shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)]" 
          : "bg-white shadow-[0_0_15px_-3px_rgba(234,179,8,0.4)]"
      )}
      aria-label="Toggle theme"
    >
      {/* Dynamic background glow */}
      <div className={cn(
        "absolute inset-0 rounded-full blur-md transition-opacity duration-500",
        dark ? "bg-purple-500/10" : "bg-yellow-500/10"
      )} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={dark ? "dark" : "light"}
          initial={{ y: 10, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -10, opacity: 0, rotate: 90 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          className="relative z-10"
        >
          {dark ? (
            <Moon className="h-[1.1rem] w-[1.1rem] text-purple-400" />
          ) : (
            <Sun className="h-[1.1rem] w-[1.1rem] text-yellow-500" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Futuristic ring animation */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-dashed border-border/40"
      />
    </motion.button>
  );
}
