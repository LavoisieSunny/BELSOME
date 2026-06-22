import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, ChevronDown, ChevronUp } from "lucide-react";

interface AIReasoningProps {
  bullets: string[];
  label?: string;
  defaultOpen?: boolean;
}

export default function AIReasoning({ bullets, label = "Why?", defaultOpen = false }: AIReasoningProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Filter out any empty bullets
  const validBullets = bullets.filter((b) => b && b.trim().length > 0);

  if (validBullets.length === 0) return null;

  return (
    <div className="inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30 text-[9px] font-extrabold tracking-wide uppercase shadow-sm select-none transition-colors"
      >
        <Sparkles className="w-2.5 h-2.5 text-purple-500 animate-pulse-glow" />
        <span>{label}</span>
        {isOpen ? (
          <ChevronUp className="w-2.5 h-2.5 text-purple-450" />
        ) : (
          <ChevronDown className="w-2.5 h-2.5 text-purple-455 group-hover:translate-y-0.2" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden mt-1 max-w-xs sm:max-w-sm relative z-20"
          >
            <div className="p-3 rounded-lg bg-purple-500/[0.03] dark:bg-purple-500/[0.06] border border-purple-100/50 dark:border-purple-900/30 text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-semibold shadow-inner space-y-1 text-left">
              <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-purple-600 dark:text-purple-400 font-mono font-bold uppercase tracking-wider mb-0.5">
                <Brain className="w-2.5 h-2.5 text-pink-500 shrink-0" />
                <span>AI Auditor Reasoning</span>
              </div>
              <motion.ul 
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15,
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
                className="space-y-1 list-disc list-inside"
              >
                {validBullets.map((bullet, idx) => (
                  <motion.li 
                    key={idx} 
                    variants={{
                      hidden: { opacity: 0, y: 4 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
                    }}
                    className="marker:text-purple-400 leading-normal pl-0.5"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{bullet}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
