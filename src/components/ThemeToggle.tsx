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
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-all duration-300 hover:shadow-[0_8px_20px_-8px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_8px_20px_-8px_rgba(20,184,166,0.4)]",
        dark ? "hover:border-purple-500/50" : "hover:border-brand-1/50"
      )}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={dark ? "dark" : "light"}
          initial={{ y: 8, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -8, opacity: 0, rotate: 90 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            dark ? "bg-purple-600/10 text-purple-400" : "bg-yellow-400/10 text-yellow-600"
          )}
        >
          {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </motion.div>
      </AnimatePresence>
      
      {/* Lower Edge Glow Glow */}
      <div className={cn(
        "absolute -bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100",
        dark ? "bg-purple-600" : "bg-yellow-400"
      )} />
    </motion.button>
  );
}
