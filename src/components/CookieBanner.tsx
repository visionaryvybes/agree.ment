"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("agreemint_cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = (all: boolean) => {
    localStorage.setItem(
      "agreemint_cookie_consent",
      JSON.stringify({ strict: true, analytics: all, date: new Date().toISOString() })
    );
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 sm:bottom-8 left-0 sm:left-8 right-0 sm:right-auto z-50 w-full sm:w-[450px] bg-transparent border border-[var(--glass-border)] shadow-2xl p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--blue)] text-[var(--bg)] flex items-center justify-center border-2 border-[var(--glass-border)] shrink-0">
                <Cookie size={24} weight="bold" />
              </div>
              <h3 className="heading-section text-xl uppercase font-black tracking-tight">Protocol Telemetry</h3>
            </div>
            <button onClick={() => setShow(false)} className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors">
              <X size={20} weight="bold" />
            </button>
          </div>
          
          <p className="text-xs font-bold text-[var(--text-2)] mb-6 leading-relaxed">
            We use absolute necessity cookies for protocol enforcement and optional analytics to optimize the legal architecture network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => accept(true)}
              className="flex-1 btn-primary py-3 text-[10px] bg-[var(--text-1)] text-[var(--bg)]"
            >
              Accept All
            </button>
            <button
              onClick={() => accept(false)}
              className="flex-1 btn-secondary py-3 text-[10px]"
            >
              Strict Only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
