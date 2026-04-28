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
        "relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-all duration-300",
        dark 
          ? "hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
          : "hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]"
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
            dark ? "bg-emerald-500/10" : "bg-orange-500/10"
          )}
        >
          {dark ? (
            <Moon className="h-4 w-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          ) : (
            <Sun className="h-4 w-4 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Lower Edge Glow Glow */}
      <div className={cn(
        "absolute -bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100",
        dark ? "bg-emerald-500" : "bg-orange-500"
      )} />
    </motion.button>
  );
}
