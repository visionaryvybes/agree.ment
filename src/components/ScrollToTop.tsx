"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "@phosphor-icons/react";
import Magnetic from "./ui/magnetic";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          className="fixed bottom-12 right-12 z-[100]"
        >
          <Magnetic>
            <button
              onClick={scrollToTop}
              className="w-20 h-20 rounded-[32px] bg-emerald text-[#010101] flex items-center justify-center shadow-[0_20px_50px_rgba(0,255,209,0.4)] border-4 border-[#010101] hover:scale-110 transition-transform group"
            >
              <ArrowUp size={32} weight="bold" className="group-hover:-translate-y-2 transition-transform" />
            </button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
