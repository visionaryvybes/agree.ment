'use client';

import { 
  Books, 
  Scales, 
  FileText, 
  ShieldCheck, 
  MagnifyingGlass,
  ArrowRight,
  Gavel,
  Files,
  Signature
} from "@phosphor-icons/react";
import { motion } from 'framer-motion';
import Link from 'next/link';
import Magnetic from '@/components/ui/magnetic';
import { cn } from '@/lib/utils';

export default function LegalLibraryPage() {
  const categories = [
    { name: 'Personal Sales', icon: Files, count: 124, color: 'emerald' },
    { name: 'Private Loans', icon: Scales, count: 85, color: 'blue' },
    { name: 'Work & Freelance', icon: ShieldCheck, count: 62, color: 'amber' },
    { name: 'Private Rentals', icon: Gavel, count: 45, color: 'rose' },
  ];

  const featured = [
    { title: 'Simple Service Agreement', category: 'Commercial', time: 'Instant', grade: 'A+', color: 'emerald' },
    { title: 'Privacy Agreement', category: 'General', time: '30s', grade: 'A', color: 'blue' },
    { title: 'Software Use Agreement', category: 'Tech', time: '45s', grade: 'A-', color: 'amber' },
  ];

  return (
    <div className="space-y-16 pb-32 max-w-7xl mx-auto px-4 relative">
      
      {/* Background Glows */}
      <div className="vibrant-glow top-0 right-0 w-[600px] h-[600px] bg-emerald/10 animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 left-0 w-[500px] h-[500px] bg-blue/10" />

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-12 border-b border-white/10 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <span className="text-[11px] font-black text-emerald uppercase tracking-[0.5em] block">AGREEMENT STYLE</span>
          <h1 className="heading-display text-7xl md:text-9xl text-white tracking-tighter italic uppercase leading-none">Library.</h1>
        </motion.div>

        <div className="flex-1 max-w-md relative group">
           <MagnifyingGlass className="absolute left-6 top-1/2 -translate-y-1/2 text-text-3 group-focus-within:text-emerald transition-colors" size={20} weight="bold" />
           <input
             type="text"
             placeholder="SEARCH AGREEMENTS..."
             className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-[11px] font-black tracking-widest uppercase focus:outline-none focus:border-emerald/50 focus:bg-white/10 transition-all liquid-gloss shadow-2xl"
           />
        </div>
      </header>

      {/* ── CATEGORIES ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
         {categories.map((cat, i) => (
           <motion.div
             key={cat.name}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className={cn(
               "p-8 rounded-[40px] bg-white/[0.03] border transition-all duration-700 group backdrop-blur-3xl cursor-pointer relative overflow-hidden flex flex-col items-center text-center",
               cat.color === 'emerald' ? "border-emerald/20 hover:border-emerald/60 shadow-[0_0_40px_rgba(0,255,209,0.05)] hover:shadow-[0_0_60px_rgba(0,255,209,0.15)]" :
               cat.color === 'blue' ? "border-blue/20 hover:border-blue/60 shadow-[0_0_40px_rgba(0,112,255,0.05)] hover:shadow-[0_0_60px_rgba(0,112,255,0.15)]" :
               cat.color === 'amber' ? "border-amber/20 hover:border-amber/60 shadow-[0_0_40px_rgba(255,184,0,0.05)] hover:shadow-[0_0_60px_rgba(255,184,0,0.15)]" :
               "border-rose/20 hover:border-rose/60 shadow-[0_0_40px_rgba(255,0,110,0.05)] hover:shadow-[0_0_60px_rgba(255,0,110,0.15)]"
             )}
           >
              <div className={cn(
                 "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
                 cat.color === 'emerald' ? "bg-emerald" : cat.color === 'blue' ? "bg-blue" : cat.color === 'amber' ? "bg-amber" : "bg-rose"
              )} />
              
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 shadow-2xl mx-auto",
                cat.color === 'emerald' ? "bg-emerald/10 text-emerald" :
                cat.color === 'blue' ? "bg-blue/10 text-blue" :
                cat.color === 'amber' ? "bg-amber/10 text-amber" :
                "bg-rose/10 text-rose"
              )}>
                 <cat.icon size={32} weight="bold" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2 transition-transform">{cat.name}</h3>
              <p className="text-[10px] font-black text-text-3 uppercase tracking-[0.2em]">{cat.count} Available</p>
           </motion.div>
         ))}
      </div>

      {/* ── FEATURED ASSETS ────────────────────────────────────────── */}
      <section className="space-y-10">
         <div className="flex items-center justify-between px-2">
            <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white">Popular Contracts</h2>
            <Link href="#" className="text-[10px] font-black text-emerald uppercase tracking-widest flex items-center gap-3 group">
               VIEW ALL <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {featured.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
              >
                <Link 
                  href="/contracts/new"
                  className={cn(
                    "p-10 rounded-[50px] bg-[#080808] border relative group overflow-hidden backdrop-blur-3xl transition-all duration-700 flex flex-col h-full",
                    item.color === 'emerald' ? "border-emerald/20 hover:border-emerald/60 hover:shadow-[0_0_50px_rgba(0,255,209,0.1)]" :
                    item.color === 'blue' ? "border-blue/20 hover:border-blue/60 hover:shadow-[0_0_50px_rgba(0,112,255,0.1)]" :
                    "border-amber/20 hover:border-amber/60 hover:shadow-[0_0_50px_rgba(255,184,0,0.1)]"
                  )}
                >
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-60 group-hover:rotate-12 transition-all duration-700">
                      <Signature size={80} weight="thin" className={cn(
                        item.color === 'emerald' ? "text-emerald" : item.color === 'blue' ? "text-blue" : "text-amber"
                      )} />
                   </div>

                   <div className="space-y-8 relative z-10 flex-1">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-[0.4em] px-4 py-2 rounded-full border shadow-2xl inline-block",
                        item.color === 'emerald' ? "text-emerald bg-emerald/10 border-emerald/20 shadow-emerald/10" :
                        item.color === 'blue' ? "text-blue bg-blue/10 border-blue/20 shadow-blue/10" :
                        "text-amber bg-amber/10 border-amber/20 shadow-amber/10"
                      )}>{item.category}</span>
                      <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-[0.9] group-hover:text-emerald transition-colors">{item.title}</h3>

                      <div className="flex items-center justify-between pt-10 border-t border-white/5 mt-4">
                         <div className="space-y-2">
                            <p className="text-[9px] font-black text-text-3 uppercase tracking-widest">Ready In</p>
                            <p className="text-lg font-black text-white">{item.time}</p>
                         </div>
                         <div className="space-y-2 text-right">
                            <p className="text-[9px] font-black text-text-3 uppercase tracking-widest">Match Grade</p>
                            <p className={cn(
                              "text-lg font-black",
                              item.color === 'emerald' ? "text-emerald" : item.color === 'blue' ? "text-blue" : "text-amber"
                            )}>{item.grade}</p>
                         </div>
                      </div>
                   </div>

                   <div className="mt-10 flex justify-center relative z-10">
                      <Magnetic>
                         <div className={cn(
                           "px-10 py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 shadow-2xl",
                           item.color === 'emerald' ? "bg-emerald/10 text-emerald border border-emerald/20 group-hover:bg-emerald group-hover:text-[#010101] shadow-emerald/5" :
                           item.color === 'blue' ? "bg-blue/10 text-blue border border-blue/20 group-hover:bg-blue group-hover:text-white shadow-blue/5" :
                           "bg-amber/10 text-amber border border-amber/20 group-hover:bg-amber group-hover:text-[#010101] shadow-amber/5"
                         )}>
                            USE THIS STYLE
                         </div>
                      </Magnetic>
                   </div>
                </Link>
              </motion.div>
            ))}
          </div>
      </section>

      {/* ── RESOURCE BANNER ───────────────────────────────────────── */}
      <motion.section 
        className="rounded-[60px] bg-emerald p-16 md:p-24 text-[#010101] relative overflow-hidden group shadow-[0_0_120px_rgba(0,255,209,0.2)]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
         <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-1000">
            <Books size={240} weight="bold" />
         </div>
         <div className="max-w-xl space-y-12 relative z-10">
            <h2 className="heading-display text-6xl md:text-8xl tracking-tighter uppercase italic leading-[0.85]">Need a <br /> Specific <br /> Style?</h2>
            <p className="text-xl font-bold opacity-80 uppercase tracking-widest leading-relaxed">We can help you create a custom agreement based on your local requirements.</p>
            <Magnetic>
               <Link href="/verified-guidance" className="inline-flex items-center gap-6 bg-[#010101] text-emerald px-12 py-6 rounded-3xl text-[12px] font-black uppercase tracking-widest shadow-2xl hover:scale-110 transition-transform">
                  GET A CUSTOM STYLE <ArrowRight size={24} weight="bold" />
               </Link>
            </Magnetic>
         </div>
      </motion.section>
    </div>
  );
}
