"use client";

import { useEffect, useState } from "react";
import { ArrowLineUp } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-28 right-5 md:bottom-8 md:right-8 z-[90] flex items-center gap-2
                     bg-card text-ink border-[1.5px] border-line-strong rounded-[3px]
                     px-3 py-2.5 shadow-[var(--shadow-sheet)]
                     font-mono text-[10px] font-bold uppercase tracking-[0.18em]
                     hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]
                     active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
                     transition-[transform,box-shadow] duration-150"
        >
          <ArrowLineUp size={13} weight="bold" className="text-mint" />
          <span className="hidden sm:inline">Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
