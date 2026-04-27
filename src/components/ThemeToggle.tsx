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
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      className={cn(
        "relative flex h-10 w-20 items-center rounded-full p-1 transition-all duration-500 realistic-switch",
        dark 
          ? "bg-zinc-900 border-purple-500/30 hover:shadow-glow-intense" 
          : "bg-zinc-100 border-yellow-500/30 hover:shadow-glow-intense"
      )}
      aria-label="Toggle theme"
    >
      <motion.div
        layout
        className={cn(
          "z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-colors duration-500",
          dark ? "bg-purple-600 ml-auto" : "bg-yellow-400 mr-auto"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={dark ? "dark" : "light"}
            initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {dark ? (
              <Moon className="h-4 w-4 text-white" />
            ) : (
              <Sun className="h-4 w-4 text-white" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Internal Track Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 opacity-40">
        <Sun className={cn("h-3.5 w-3.5", dark ? "text-muted-foreground" : "text-yellow-600")} />
        <Moon className={cn("h-3.5 w-3.5", dark ? "text-purple-400" : "text-muted-foreground")} />
      </div>
    </motion.button>
  );
}
