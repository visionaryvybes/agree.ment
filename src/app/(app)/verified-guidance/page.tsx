'use client';

import { 
  ShieldCheck, 
  ChatTeardropText, 
  Warning, 
  MagicWand, 
  PaperPlaneRight,
  Fingerprint,
  CaretRight
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Magnetic from '@/components/ui/magnetic';
import { cn } from '@/lib/utils';

export default function VerifiedGuidancePage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm here to help you formalize agreements and navigate disputes. Are you looking to turn a chat into a contract, or do you need help with an existing agreement?" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    
    // Simulated system response
    setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: "I've analyzed your request. Based on local regulations in your jurisdiction (e.g., Lagos, London, Dubai), I recommend following the 'Enforcement Path' on the right: starting with a Friendly Reminder before moving to a Formal Notice." }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-7xl mx-auto space-y-12 px-4 relative">
      
      {/* Background Glows */}
      <div className="vibrant-glow top-0 left-1/4 w-[600px] h-[600px] bg-emerald/10 animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 right-1/4 w-[500px] h-[500px] bg-blue/10" />

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-12 border-b border-white/10 relative z-10">
         <div className="space-y-4 text-center lg:text-left">
            <span className="text-[12px] font-black text-emerald uppercase tracking-[0.5em] block">Secure Support</span>
            <h1 className="heading-display text-6xl md:text-8xl text-white tracking-tighter italic uppercase leading-none">Guidance.</h1>
         </div>

         <div className="flex flex-wrap justify-center lg:justify-end gap-6">
            {[
              { label: 'Friendly', color: 'emerald' },
              { label: 'Formal', color: 'blue' },
              { label: 'Demand', color: 'amber' },
              { label: 'Court', color: 'rose' }
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border",
                  i === 0 ? "bg-emerald/20 border-emerald/40 text-emerald" : "bg-white/5 border-white/10 text-white/40"
                )}>{i + 1}</div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  i === 0 ? "text-emerald" : "text-white/40"
                )}>{step.label}</span>
                {i < 3 && <CaretRight size={12} className="text-white/10" />}
              </div>
            ))}
         </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        {/* ── CHAT INTERFACE ────────────────────────────────────────── */}
        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[56px] flex flex-col overflow-hidden relative group backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.5)] z-10">
           <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#010101]/80 to-transparent z-10 pointer-events-none" />
           
           <div 
             ref={scrollRef}
             className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar scroll-smooth"
            >
              <AnimatePresence>
                 {messages.map((m, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                       <div className={cn(
                          "max-w-[85%] p-10 rounded-[40px] shadow-2xl relative overflow-hidden",
                          m.role === 'user' 
                          ? 'bg-emerald text-[#010101] font-black uppercase tracking-tight rounded-br-[8px] border-4 border-[#010101] shadow-emerald/20' 
                          : 'bg-white/[0.05] border border-white/10 text-white font-black leading-relaxed rounded-bl-[8px] backdrop-blur-3xl'
                       )}>
                          <div className={cn(
                             "flex items-center gap-4 mb-6",
                             m.role === 'user' ? 'opacity-40' : 'text-emerald'
                          )}>
                             {m.role === 'assistant' ? <Fingerprint size={24} weight="bold" /> : <div className="w-3 h-3 rounded-full bg-[#010101]" />}
                             <span className="text-[10px] font-black uppercase tracking-[0.3em]">{m.role === 'assistant' ? 'AGREEMINT SUPPORT' : 'YOU'}</span>
                          </div>
                          <p className={cn(
                             "text-xl tracking-tight leading-relaxed italic uppercase",
                             m.role === 'assistant' ? 'text-white/90' : 'text-[#010101]'
                          )}>{m.content}</p>
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
           </div>

           {/* ── INPUT AREA ───────────────────────────────────────────── */}
           <div className="p-10 pb-16 bg-white/[0.03] border-t border-white/10 backdrop-blur-3xl">
              <div className="relative max-w-4xl mx-auto flex items-center gap-6">
                 <div className="flex-1 relative group">
                    <ChatTeardropText size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-text-3 group-focus-within:text-emerald transition-colors" weight="bold" />
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="ASK A QUESTION..."
                      className="w-full bg-white/5 border border-white/10 rounded-[32px] py-8 pl-20 pr-10 text-[12px] font-black tracking-[0.3em] uppercase focus:outline-none focus:border-emerald/50 focus:bg-white/10 transition-all text-white placeholder:text-text-3/40"
                    />
                 </div>
                 <Magnetic>
                    <button 
                      onClick={handleSend}
                      className="btn-vibrant btn-vibrant-emerald w-20 h-20 rounded-[32px]"
                    >
                       <PaperPlaneRight size={32} weight="bold" />
                    </button>
                 </Magnetic>
              </div>
           </div>
        </div>

        {/* ── SIDEBAR ESCALATION ───────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col gap-6 w-80">
           <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl space-y-6 flex-1">
              <h4 className="text-[12px] font-black text-amber uppercase tracking-[0.4em]">Enforcement Path</h4>
              <div className="space-y-4">
                 {[
                    { title: 'Friendly Reminder', desc: 'Soft outreach via app notification.', active: true },
                    { title: 'Formal Notice', desc: 'Timestamped official communication.', active: false },
                    { title: 'Demand Letter', desc: 'Legally structured final warning.', active: false },
                    { title: 'Legal Escalation', desc: 'Small claims or court guidance.', active: false }
                 ].map((step, i) => (
                    <div key={i} className={cn(
                      "p-5 rounded-2xl border transition-all",
                      step.active ? "bg-amber/10 border-amber/40" : "bg-white/5 border-white/5 opacity-40"
                    )}>
                       <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{step.title}</p>
                       <p className="text-[9px] font-bold text-text-3 uppercase opacity-60 leading-tight">{step.desc}</p>
                    </div>
                 ))}
              </div>
           </div>

           <div className="p-8 rounded-[40px] bg-emerald/10 border border-emerald/20 backdrop-blur-3xl group cursor-pointer hover:bg-emerald transition-all">
              <div className="flex items-center gap-4 mb-4">
                 <ShieldCheck size={28} weight="bold" className="text-emerald group-hover:text-[#010101]" />
                 <h4 className="text-[12px] font-black text-white group-hover:text-[#010101] uppercase tracking-widest">Global Sync</h4>
              </div>
              <p className="text-[10px] font-bold text-text-3 group-hover:text-[#010101] uppercase tracking-widest opacity-60 leading-relaxed">Your agreement is verified against local laws in Lagos, London, Dubai, and beyond.</p>
           </div>
        </aside>
      </div>

      {/* ── FOOTER HINT ───────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-16 text-[12px] font-black text-text-3 uppercase tracking-[0.5em] pb-10">
         <div className="flex items-center gap-4 group cursor-help transition-colors hover:text-white">
            <Warning size={18} className="text-emerald animate-pulse" weight="bold" /> 
            Not Legal Advice
         </div>
         <div className="flex items-center gap-4 group cursor-default transition-colors hover:text-white">
            <MagicWand size={18} className="text-emerald shadow-[0_0_10px_rgba(0,255,209,0.5)]" weight="bold" /> 
            AgreeMint Secure
         </div>
      </div>
    </div>
  );
}
