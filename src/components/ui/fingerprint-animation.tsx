import { motion } from 'framer-motion';

export default function FingerprintAnimation() {
  return (
    <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center group">
      {/* ── BACKGROUND PROTOCOL GRID ────────────────────────────── */}
      <div className="absolute inset-0 border border-white/5 rounded-3xl overflow-hidden bg-black/40 backdrop-blur-sm">
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `linear-gradient(#00F5D4 1px, transparent 1px), linear-gradient(90deg, #00F5D4 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} 
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-create/5 to-transparent h-[50%]"
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* ── SCANNING CORE ───────────────────────────────────────── */}
      <div className="relative z-10 w-48 h-64 flex flex-col items-center justify-center">
        <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,245,212,0.3)]">
          {/* Fingerprint Ridge Groups */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.path
              key={i}
              d={`M${20 + i * 5} 120 Q50 ${20 + i * 15} ${80 - i * 5} 120`}
              stroke="var(--create)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
                strokeWidth: [2, 3, 2]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                delay: i * 0.2,
                times: [0, 0.2, 0.8, 1]
              }}
            />
          ))}

          {/* Vertical Data Stream Lines */}
          {[10, 30, 50, 70, 90].map((x, idx) => (
            <motion.line
              key={idx}
              x1={x} y1="0" x2={x} y2="140"
              stroke="rgba(0, 245, 212, 0.1)"
              strokeWidth="1"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
            />
          ))}
        </svg>

        {/* High-Integrity Scanning Bar */}
        <motion.div 
          className="absolute left-0 right-0 h-[2px] bg-create shadow-[0_0_20px_#00F5D4] z-20"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute right-[-100px] top-[-10px] whitespace-nowrap">
            <span className="text-[8px] font-mono text-create tracking-[0.2em] uppercase opacity-50 bg-black/80 px-2 py-1 rounded">
              Verification System Active...
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── DECORATIVE ELEMENTS ───────────────────────────────────── */}
      <div className="absolute top-4 left-4 text-[8px] font-mono text-[#A1A1AA] opacity-40 leading-tight">
        PRTCL_ID: AG-X99<br />
        LYR: SECURITY_A<br />
        STS: ENCRYPTED
      </div>
      
      <div className="absolute bottom-4 right-4 flex gap-1 items-center">
        <div className="w-1 h-1 rounded-full bg-create animate-pulse" />
        <span className="text-[8px] font-mono text-create opacity-40 tracking-widest">LIVE_SYNC</span>
      </div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-create/40 rounded-full"
          animate={{ 
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, (Math.random() - 0.5) * 200],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            repeat: Infinity, 
            delay: Math.random() * 5 
          }}
        />
      ))}
    </div>
  );
}
