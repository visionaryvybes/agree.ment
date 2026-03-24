"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#010101]/60 backdrop-blur-md">
      {/* Background Glows */}
      <div className="vibrant-glow top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald/10 blur-[100px] animate-glow-pulse" />
      
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo Wrapper - Smaller & Faster */}
        <motion.div
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-20 h-20 relative"
        >
          <img 
            src="/logo_verified.png" 
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,255,209,0.4)]" 
            alt="Loading..." 
          />
        </motion.div>

        {/* Text - Subtler */}
        <div className="space-y-2 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald animate-pulse">
            MINTING...
          </p>
        </div>
      </div>
    </div>
  );
}
