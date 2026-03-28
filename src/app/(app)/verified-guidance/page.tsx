'use client';

import {
  ShieldCheck, ChatTeardropText, Warning, Sparkle,
  PaperPlaneRight, Robot, CaretRight,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

const ESCALATION_STEPS = [
  { title: 'Friendly Reminder', desc: 'Soft outreach via app notification.',         active: true  },
  { title: 'Formal Notice',     desc: 'Timestamped official communication.',          active: false },
  { title: 'Demand Letter',     desc: 'Legally structured final warning.',            active: false },
  { title: 'Legal Escalation',  desc: 'Small claims court or attorney referral.',    active: false },
];

const SUGGESTED = [
  "What are my rights if someone doesn't pay?",
  'How do I send a formal notice?',
  'Is my contract enforceable internationally?',
];

export default function VerifiedGuidancePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'assistant', content: "Hi! I'm here to help you navigate agreements and resolve disputes. What's going on?" },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim() };
    const assistantId = (Date.now() + 1).toString();

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Add empty assistant message placeholder
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/system/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          jurisdiction: '',
        }),
      });

      if (!res.ok) throw new Error('API error');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: accumulated } : m
        ));
      }

      // If nothing was accumulated (stream format issue), use a fallback
      if (!accumulated) {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: "I'm sorry, I couldn't process that. Please try again." } : m
        ));
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, content: "Sorry, there was an error. Please check your connection and try again." } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col pb-8 max-w-6xl mx-auto gap-6 h-[calc(100svh-120px)] relative">

      {/* Glows */}
      <div className="vibrant-glow top-0 left-1/4 w-[350px] h-[350px] bg-emerald/[0.06] animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 right-1/4 w-[280px] h-[280px] bg-blue/[0.05]" />

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.07] relative z-10 flex-shrink-0">
        <div>
          <span className="text-[10px] font-black text-emerald uppercase tracking-[0.4em] block mb-1">Secure Support</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight italic uppercase">Guidance.</h1>
        </div>

        {/* Escalation progress */}
        <div className="flex items-center gap-2">
          {[
            { label: 'Friendly', color: 'text-emerald', active: true  },
            { label: 'Formal',   color: 'text-blue',    active: false },
            { label: 'Demand',   color: 'text-amber',   active: false },
            { label: 'Court',    color: 'text-rose',    active: false },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-1.5">
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black border',
                step.active
                  ? 'bg-emerald/15 border-emerald/30 text-emerald'
                  : 'bg-white/[0.03] border-white/[0.07] text-white/20',
              )}>{i + 1}</div>
              <span className={cn('text-[9px] font-black uppercase tracking-wider hidden sm:block', step.active ? step.color : 'text-white/20')}>
                {step.label}
              </span>
              {i < 3 && <CaretRight size={10} className="text-white/10" />}
            </div>
          ))}
        </div>
      </header>

      {/* ── MAIN LAYOUT ────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">

        {/* Chat */}
        <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/[0.07] rounded-3xl overflow-hidden relative z-10">
          {/* Top fade */}
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#010101]/60 to-transparent z-10 pointer-events-none rounded-t-3xl" />

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar scroll-smooth">
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  transition={{ duration: 0.4 }}
                  className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div className={cn(
                    'max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl relative',
                    m.role === 'user'
                      ? 'bg-emerald text-[#010101] font-black rounded-br-md'
                      : 'bg-white/[0.05] border border-white/[0.08] text-white rounded-bl-md',
                  )}>
                    {m.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Robot size={12} weight="bold" className="text-emerald opacity-60" />
                        <span className="text-[8px] font-black text-white/25 uppercase tracking-widest">AgreeMint AI</span>
                      </div>
                    )}
                    <p className={cn('text-sm leading-relaxed whitespace-pre-wrap', m.role === 'user' ? 'text-[#010101]' : 'text-white/80')}>
                      {m.content || (m.role === 'assistant' && isLoading ? '...' : '')}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator when loading but no content yet */}
              {isLoading && messages[messages.length - 1]?.role === 'assistant' && !messages[messages.length - 1]?.content && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                    {[0, 0.15, 0.3].map(d => (
                      <motion.div key={d} className="w-1.5 h-1.5 rounded-full bg-emerald/60"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, delay: d, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggested prompts */}
          {messages.length === 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {SUGGESTED.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-[10px] font-bold text-white/40 border border-white/[0.08] px-3 py-1.5 rounded-xl hover:border-emerald/30 hover:text-emerald transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/[0.07] bg-white/[0.02] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative group">
                <ChatTeardropText
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald transition-colors"
                  weight="bold"
                />
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask a question about your agreement…"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-[12px] font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-emerald/40 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-emerald text-[#010101] flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-30 disabled:scale-100 flex-shrink-0"
              >
                <PaperPlaneRight size={16} weight="bold" />
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">
          {/* Enforcement path */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.07] space-y-3 flex-1">
            <h4 className="text-[10px] font-black text-amber uppercase tracking-[0.35em] mb-4">Enforcement Path</h4>
            {ESCALATION_STEPS.map((step, i) => (
              <div key={i} className={cn(
                'p-3.5 rounded-xl border transition-all',
                step.active ? 'bg-amber/[0.08] border-amber/25' : 'bg-white/[0.02] border-white/[0.05] opacity-40',
              )}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('w-5 h-5 rounded-lg flex items-center justify-center text-[8px] font-black border flex-shrink-0',
                    step.active ? 'bg-amber/20 border-amber/30 text-amber' : 'bg-white/[0.04] border-white/10 text-white/30',
                  )}>{i + 1}</span>
                  <p className="text-[10px] font-black text-white uppercase tracking-wide">{step.title}</p>
                </div>
                <p className="text-[9px] text-white/30 leading-relaxed pl-7">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Global sync card */}
          <div className="p-5 rounded-3xl bg-emerald/[0.07] border border-emerald/20 group hover:bg-emerald transition-all duration-400 cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck size={18} weight="bold" className="text-emerald group-hover:text-[#010101] transition-colors" />
              <h4 className="text-[11px] font-black text-white group-hover:text-[#010101] uppercase tracking-wide transition-colors">Global Sync</h4>
            </div>
            <p className="text-[10px] text-white/30 group-hover:text-[#010101]/60 leading-relaxed transition-colors">
              Your agreement is verified against local laws in 180+ countries including Lagos, London, and Dubai.
            </p>
          </div>
        </aside>
      </div>

      {/* Footer disclaimer */}
      <div className="flex items-center justify-center gap-8 flex-shrink-0">
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
          <Warning size={12} className="text-amber/50" weight="bold" />
          Not Legal Advice
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
          <Sparkle size={12} className="text-emerald/50" weight="bold" />
          AgreeMint Secure
        </div>
      </div>
    </div>
  );
}
