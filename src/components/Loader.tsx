import { motion } from "framer-motion";

interface Props {
  text?: string;
}

export function Loader({ text = "Loading insights..." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-b-2 border-l-2 border-brand shadow-[0_0_20px_-5px_hsl(var(--brand-1))]"
        />
        
        {/* Middle Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-t-2 border-r-2 border-brand-2 opacity-70"
        />
        
        {/* Inner Pulsing Core */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-8 rounded-full bg-brand shadow-glow"
        />
        
        {/* Scanning Beam */}
        <motion.div
          animate={{ 
            rotate: 360,
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-4px] rounded-full border-t border-brand/20 blur-[1px]"
        />
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 font-display text-sm font-medium tracking-wide text-muted-foreground"
      >
        <span className="bg-brand bg-clip-text text-transparent">{text}</span>
      </motion.p>
      
      <div className="mt-2 flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
            className="h-1 w-1 rounded-full bg-brand"
          />
        ))}
      </div>
    </div>
  );
}
