"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useScrollStore } from "@/hooks/useScrollStore";

export function Toast() {
  const message = useScrollStore((s) => s.toast);
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-12 left-1/2 z-[90] -translate-x-1/2">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            className="glass rounded-[8px] px-4 py-2.5 font-mono text-xs text-text"
          >
            <span className="text-accent">✓</span> {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
