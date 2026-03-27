'use client';

import { motion } from 'framer-motion';

const SIG_PATH =
  "M 10 40 C 30 18, 50 18, 70 40 C 90 52, 110 22, 130 35 C 150 48, 168 25, 188 35 C 208 45, 228 28, 252 35 C 262 37, 268 36, 272 36";

const CYCLE = 4.5; // seconds per cycle
const TIMES: [number, number, number, number] = [0, 0.5, 0.75, 0.9];

export default function HandSigningScene() {
  return (
    <div className="w-full h-full min-h-[500px] relative flex items-center justify-center select-none">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_55%,rgba(0,255,209,0.06),transparent)]" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue/[0.04] blur-[100px] rounded-full pointer-events-none" />

      {/* Floating card wrapper */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
        className="relative w-[300px] sm:w-[360px] md:w-[420px]"
      >
        {/* Drop shadow glow */}
        <motion.div
          animate={{ opacity: [0.25, 0.1, 0.25], scaleX: [1, 0.8, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-emerald/20 blur-[28px] rounded-full pointer-events-none"
        />

        {/* Contract card */}
        <div className="relative bg-[#080808] border border-white/[0.08] rounded-[32px] p-7 overflow-hidden"
          style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.04)' }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald/[0.02] via-transparent to-blue/[0.02] pointer-events-none rounded-[32px]" />
          {/* Top highlight line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald/25 to-transparent" />

          {/* Header row */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald/[0.12] border border-emerald/20 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-emerald">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[9px] font-black text-emerald uppercase tracking-[0.35em]">AGREEMINT</span>
            </div>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse inline-block" />
              <span className="text-[8px] font-black text-emerald/50 uppercase tracking-widest">LIVE</span>
            </motion.div>
          </div>

          {/* Document title lines */}
          <div className="space-y-2 mb-5 relative z-10">
            <div className="h-2.5 bg-white/20 rounded-full w-[70%]" />
            <div className="h-1.5 bg-white/[0.08] rounded-full w-[44%]" />
          </div>

          {/* Body text lines */}
          <div className="space-y-2 mb-5 relative z-10">
            {[100, 91, 87, 62, 94, 72].map((w, i) => (
              <div key={i} className="h-1 rounded-full bg-white/[0.05]" style={{ width: `${w}%` }} />
            ))}
          </div>

          <div className="border-t border-white/[0.06] mb-4 relative z-10" />

          {/* Signature section */}
          <div className="relative z-10">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.35em] mb-2.5">
              Digital Signature
            </p>

            {/* Signature box */}
            <div
              className="relative overflow-hidden rounded-2xl border border-white/[0.06]"
              style={{ height: 68, background: 'rgba(255,255,255,0.018)' }}
            >
              <svg
                viewBox="0 0 280 60"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="sig-glow" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Soft glow layer */}
                <motion.path
                  d={SIG_PATH}
                  fill="none"
                  stroke="rgba(0,255,209,0.15)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: CYCLE, times: TIMES, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Main signature stroke */}
                <motion.path
                  d={SIG_PATH}
                  fill="none"
                  stroke="rgba(0,255,209,0.85)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#sig-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: CYCLE, times: TIMES, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </div>

            <div className="mt-2 h-px bg-white/[0.05]" />
          </div>

          {/* Footer row */}
          <div className="mt-4 flex items-center justify-between relative z-10">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-emerald animate-pulse inline-block" />
              <span className="text-[8px] font-black text-emerald uppercase tracking-[0.2em]">Signing...</span>
            </motion.div>
            <span className="text-[8px] text-white/20 font-black uppercase tracking-widest">256-bit AES</span>
          </div>
        </div>

        {/* Floating badge — top right */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          className="absolute -top-5 -right-5 w-14 h-14 bg-[#090909] border border-white/[0.07] rounded-2xl flex flex-col items-center justify-center"
          style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.7)' }}
        >
          <span className="text-emerald text-base font-black leading-none">✓</span>
          <span className="text-[6px] font-black text-white/25 uppercase tracking-wide mt-0.5">Secure</span>
        </motion.div>

        {/* Floating badge — bottom left */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          className="absolute -bottom-3 -left-8 flex items-center gap-2 bg-[#090909] border border-white/[0.07] rounded-2xl px-3 py-2"
          style={{ boxShadow: '0 16px 32px rgba(0,0,0,0.7)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse inline-block" />
          <span className="text-[7px] font-black text-white/40 uppercase tracking-wider">Active</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
