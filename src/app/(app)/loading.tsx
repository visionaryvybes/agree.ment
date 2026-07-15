"use client";

import { motion } from "framer-motion";
import { Seal } from "@phosphor-icons/react";

/** The registry stamp, mid-air. On-brand, no assets, respects reduced motion. */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ground">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotate: [-10, -6, -10], y: [0, -3, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full border-[3px] border-mint text-mint bg-card
                     flex items-center justify-center shadow-[var(--shadow-sheet)]"
        >
          <div className="text-center leading-tight">
            <Seal size={26} weight="fill" className="mx-auto" />
            <p className="font-mono text-[8px] font-bold tracking-[0.2em] mt-0.5">FILING</p>
          </div>
        </motion.div>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-3">
          Pulling the file…
        </p>
      </div>
    </div>
  );
}
