'use client';

import { motion } from 'framer-motion';

export default function HandSigningAnimation() {
  return (
    <div className="relative w-full max-w-[600px] aspect-[4/3] flex items-center justify-center group overflow-hidden bg-black/40 rounded-[40px] border border-white/5 backdrop-blur-xl">
      {/* ── AMBIENT BACKGROUND CORE ─────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-tr from-create/5 via-titanium/10 to-transparent opacity-50" />
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `radial-gradient(#00F5D4 0.5px, transparent 0.5px)`,
          backgroundSize: '24px 24px'
        }} 
      />

      {/* ── THE CONTRACT SHEET ───────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 40, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-[80%] h-[70%] bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 overflow-hidden backdrop-blur-lg"
      >
        {/* Holographic Protocol Header */}
        <div className="flex justify-between items-center mb-8 opacity-40">
          <div className="space-y-1">
            <div className="h-1 w-24 bg-white/20 rounded-full" />
            <div className="h-1 w-16 bg-white/20 rounded-full" />
          </div>
          <div className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center">
             <div className="w-4 h-4 rounded-full border-2 border-create animate-pulse" />
          </div>
        </div>

        {/* Mock Text Lines */}
        <div className="space-y-4 mb-20">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-1.5 w-full bg-white/10 rounded-full" />
              {i % 2 === 0 && <div className="h-1.5 w-2/3 bg-white/10 rounded-full" />}
            </div>
          ))}
        </div>

        {/* The Signing Line & Label */}
        <div className="absolute bottom-16 left-8 right-8">
          <div className="flex items-end justify-between mb-2">
            <span className="text-[8px] font-mono text-create tracking-[0.2em] uppercase opacity-40">System Active</span>
            <span className="text-[8px] font-mono text-white opacity-20">AUTH_ID: XM-092</span>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-create/30 to-transparent" />
        </div>

        {/* ── THE HAND & PEN (Animated Layer) ─────────────────────── */}
        <motion.div 
          className="absolute -right-20 -bottom-20 w-[400px] h-[400px] pointer-events-none z-30"
          initial={{ x: 100, y: 100, rotate: 10 }}
          animate={{ 
            x: [100, -20, -5, -40, -10, 100],
            y: [100, -20, -30, -10, -15, 100],
            rotate: [10, 5, 8, 3, 10, 10]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.2, 0.4, 0.6, 0.8, 1]
          }}
        >
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <defs>
              <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E1E22" />
                <stop offset="100%" stopColor="#050505" />
              </linearGradient>
            </defs>
            {/* Extremely Stylized Hand (Simplified but Fluid) */}
            <path 
              d="M320 380 C280 340, 240 300, 200 280 C160 260, 120 280, 100 320 C80 340, 100 380, 120 400" 
              fill="url(#handGrad)" 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="2" 
            />
            {/* The Pen */}
            <rect x="180" y="240" width="8" height="120" rx="4" fill="#0D0D0E" stroke="rgba(255,255,255,0.1)" transform="rotate(-40 180 240)" />
            <path d="M102 334 L90 350 L110 348 Z" fill="#00F5D4" /> {/* Pen Tip Glow */}
          </svg>
        </motion.div>

        {/* ── THE SIGNATURE (Drawing) ─────────────────────────────── */}
        <div className="absolute bottom-16 left-20 z-20">
          <svg width="200" height="80" viewBox="0 0 200 80" className="overflow-visible">
            <motion.path
              d="M10 50 C20 40, 30 60, 40 40 S60 70, 80 30 S100 60, 130 40 S160 70, 190 30"
              fill="none"
              stroke="#00F5D4"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 0, 1, 1],
                opacity: [0, 0.5, 1, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                times: [0, 0.2, 0.8, 1],
                ease: "linear"
              }}
              className="drop-shadow-[0_0_8px_rgba(0,245,212,0.8)]"
            />
            {/* Signature "Createing" Sparkles */}
            {[...Array(6)].map((_, i) => (
               <motion.circle
                 key={i}
                 r="1.5"
                 fill="#00F5D4"
                 initial={{ opacity: 0 }}
                 animate={{ 
                   opacity: [0, 1, 0],
                   x: [50 + i * 20, 60 + i * 20],
                   y: [40, 30]
                 }}
                 transition={{ 
                   duration: 2, 
                   repeat: Infinity, 
                   delay: 2 + i * 0.5 
                 }}
               />
            ))}
          </svg>
        </div>
      </motion.div>

      {/* ── FLOATING UI ELEMENTS (TECH OVERLAY) ──────────────────── */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 right-12 glass-panel p-4 rounded-xl border border-create/20 z-40"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-create animate-pulse" />
          <span className="text-[9px] font-black text-white uppercase tracking-widest">Verified & Saved</span>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-12 space-y-2 z-40">
        <div className="flex items-center gap-2 opacity-40">
           <div className="w-1 h-3 bg-white" />
           <span className="text-[8px] font-mono text-white tracking-[0.3em]">SECURE_V3_MINT</span>
        </div>
        <div className="h-[2px] w-32 bg-white/10" />
      </div>

      {/* Scanning Laser Line (Post-Signature) */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-create/10 to-transparent h-[10%] z-50 pointer-events-none"
        animate={{ top: ['-20%', '120%'] }}
        transition={{ duration: 3, repeat: Infinity, delay: 5 }}
      />
    </div>
  );
}
