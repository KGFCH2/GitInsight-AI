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
        "relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card shadow-elev transition-all duration-300 hover:shadow-glow-intense",
        dark ? "hover:border-purple-500/50" : "hover:border-yellow-500/50"
      )}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={dark ? "dark" : "light"}
          initial={{ y: 10, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -10, opacity: 0, rotate: 90 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            dark ? "bg-purple-600/10 text-purple-400" : "bg-yellow-400/10 text-yellow-600"
          )}
        >
          {dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </motion.div>
      </AnimatePresence>
      
      {/* Morphing Glow behind */}
      <div className={cn(
        "absolute inset-0 -z-10 rounded-xl opacity-0 blur-xl transition-opacity duration-500 hover:opacity-40",
        dark ? "bg-purple-600" : "bg-yellow-400"
      )} />
    </motion.button>
  );
}
