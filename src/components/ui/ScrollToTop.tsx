"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Magnetic from "./magnetic";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
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
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          className="fixed bottom-10 right-10 z-[100]"
        >
          <Magnetic>
            <button
              onClick={scrollToTop}
              className={cn(
                "w-16 h-16 rounded-full bg-emerald text-[#010101] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,209,0.5)] border-4 border-black hover:scale-110 transition-all group overflow-hidden relative"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <ArrowUp size={32} weight="bold" className="relative z-10 group-hover:-translate-y-1 transition-transform duration-500" />
            </button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
