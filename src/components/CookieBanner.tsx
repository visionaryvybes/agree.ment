"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("agreemint_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
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
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-auto z-50 w-auto sm:w-[420px] bg-[#080808] border border-white/[0.08] rounded-2xl shadow-lg p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500/10 text-blue-400 flex items-center justify-center rounded-lg shrink-0">
                <Cookie size={20} weight="fill" />
              </div>
              <h3 className="text-sm font-semibold text-white">Cookie Preferences</h3>
            </div>
            <button
              onClick={() => setShow(false)}
              className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <p className="text-xs text-white/60 mb-4 leading-relaxed">
            We use essential cookies to keep things running smoothly, and optional analytics cookies to help us improve your experience.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => accept(true)}
              className="flex-1 btn-primary py-2.5 text-xs font-semibold rounded-lg"
            >
              Accept All
            </button>
            <button
              onClick={() => accept(false)}
              className="flex-1 btn-secondary py-2.5 text-xs font-semibold rounded-lg"
            >
              Essential Only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
