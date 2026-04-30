import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ title, icon: Icon, children, className = "" }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`glass-card p-6 rounded-3xl border border-border shadow-xl ${className}`}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-xl bg-brand-1/10 text-brand-1">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display font-black italic text-lg uppercase tracking-tight">
        {title}
      </h3>
    </div>
    {children}
  </motion.div>
);
