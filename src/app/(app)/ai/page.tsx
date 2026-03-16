'use client';

import { useState, useRef, useEffect } from 'react';
import {
  PaperPlaneRight,
  Sparkle,
  Globe,
  FileText,
  Scales,
  Warning,
  Microphone,
  CaretDown,
  CircleNotch,
  Shield,
  Robot
} from "@phosphor-icons/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { countries } from '@/data/countries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

import { useChat } from 'ai/react';

const getPrompts = (loc: string) => [
  { icon: Scales, text: `What are my rights if someone defaults on a personal loan${loc ? ` in ${loc}` : ''}?`, tag: 'Rights' },
  { icon: FileText, text: `Draft a formal demand letter for an unpaid debt of $3,000 under ${loc || 'applicable'} law.`, tag: 'Document' },
  { icon: Warning, text: `How do I file a small claims court case${loc ? ` in ${loc}` : ''}?`, tag: 'Legal Action' },
  { icon: Globe, text: `What interest rate can I legally charge on a personal loan${loc ? ` in ${loc}` : ''}?`, tag: 'Regulation' },
  { icon: FileText, text: `Explain what makes an informal agreement legally binding${loc ? ` in ${loc}` : ''}.`, tag: 'Education' },
  { icon: Scales, text: `What is the difference between mediation and arbitration${loc ? ` in ${loc}` : ''}?`, tag: 'ADR' },
];

export default function AIPage() {
  const [jurisdiction, setJurisdiction] = useState('');
  const [showJurisdictions, setShowJurisdictions] = useState(false);
  
  const { messages, input, setInput, handleInputChange, handleSubmit, append, isLoading } = useChat({
    api: '/api/ai/chat',
    body: { jurisdiction }
  });

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(input ? input + ' ' + transcript : transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [input, setInput]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech recognition error", e);
      }
    }
  };

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>); }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--bg)] selection:bg-[var(--text-1)] selection:text-white">
      {/* ─── AI Header: Protocol Intelligence ────────────────── */}
      <header className="px-8 py-6 border-b-4 border-[var(--text-1)] bg-white flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[var(--text-1)] flex items-center justify-center shadow-[2px_2px_0_0_black]">
            <Robot weight="fill" size={24} className="text-white" />
          </div>
          <div>
            <div className="font-black text-[14px] text-[var(--text-1)] tracking-tighter uppercase leading-none mb-1">Protocol Advisor_v4</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--blue)]">Autonomous Intelligence Layer</div>
          </div>
        </div>

        {/* Jurisdiction selector */}
        <div className="relative">
          <button
            onClick={() => setShowJurisdictions(v => !v)}
            className="brutalist-button-outline brutalist-button py-3 px-6 gap-3 text-[9px]"
          >
            <Globe size={16} weight="bold" />
            {jurisdiction || 'Select Framework'}
            <CaretDown size={14} weight="bold" className={cn("transition-transform duration-300", showJurisdictions && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showJurisdictions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-[calc(100%+12px)] w-72 max-h-[400px] overflow-y-auto bg-white border-4 border-[var(--text-1)] shadow-[8px_8px_0_0_black] p-4 z-50 custom-scrollbar"
              >
                <div className="px-2 py-3 mb-4 border-b-2 border-[var(--text-1)]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">Node Jurisdictions</span>
                </div>
                <button
                  onClick={() => { setJurisdiction(''); setShowJurisdictions(false); }}
                  className="w-full text-left px-4 py-3 text-[11px] font-black uppercase hover:bg-[var(--bg)] transition-colors mb-2 border-2 border-transparent hover:border-[var(--text-1)]"
                >
                  Global Protocol (Root)
                </button>
                <div className="space-y-1">
                  {countries.map(c => (
                    <button
                      key={c.code}
                      onClick={() => { setJurisdiction(c.name); setShowJurisdictions(false); }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-[11px] font-bold hover:bg-[var(--bg)] transition-colors flex items-center gap-3 border-2 border-transparent",
                        jurisdiction === c.name ? "bg-[var(--bg)] border-[var(--text-1)]" : ""
                      )}
                    >
                      <span className="text-base">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ─── Logic Stream ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(var(--text-1) 1px, transparent 1px), linear-gradient(90deg, var(--text-1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-4xl mx-auto space-y-12 py-12 relative z-10">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 py-20"
              >
                <div className="text-center max-w-2xl mx-auto">
                  <div className="inline-block p-8 bg-[var(--text-1)] text-white mb-12 shadow-[6px_6px_0_0_#1447E6]">
                    <Sparkle size={64} weight="bold" />
                  </div>
                  <h2 className="heading-section text-4xl mb-6 uppercase font-black">Synthesizer Active.</h2>
                  <p className="text-xl font-bold text-[var(--text-2)] leading-relaxed">Jurisdiction: <span className="text-[var(--text-1)]">{jurisdiction || "GLOBAL ROOT"}</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getPrompts(jurisdiction).map((p, i) => (
                    <button
                      key={i}
                      onClick={() => append({ role: 'user', content: p.text })}
                      className="brutalist-card p-8 text-left group hover:bg-[var(--text-1)] transition-all"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 border-2 border-[var(--text-1)] flex items-center justify-center group-hover:bg-white transition-colors shadow-[2px_2px_0_0_black] group-hover:shadow-none translate-x-[-2px] translate-y-[-2px] group-hover:translate-x-0 group-hover:translate-y-0">
                          <p.icon size={20} weight="bold" className="group-hover:text-[var(--text-1)]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] group-hover:text-white/60">{p.tag}</span>
                      </div>
                      <p className="text-sm font-black text-[var(--text-1)] group-hover:text-white transition-colors leading-relaxed uppercase tracking-tight">{p.text}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((m: any) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex flex-col",
                    m.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] p-10 border-4 shadow-[6px_6px_0_0_black]",
                    m.role === 'user'
                      ? "bg-[var(--text-1)] text-white border-black"
                      : "bg-white border-black"
                  )}>
                    <div className="prose prose-sm font-bold leading-relaxed max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:mb-6">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">
                      {m.role === 'assistant' ? 'Intelligence Node' : 'Administrator'}
                    </span>
                    <span className="text-[10px] font-black text-[var(--text-3)] opacity-40">
                      {m.createdAt ? m.createdAt.toLocaleTimeString() : new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="brutalist-card bg-white p-8 border-4 flex items-center gap-6 shadow-[8px_8px_0_0_#1447E6]">
                  <div className="w-6 h-6 border-4 border-[var(--text-1)] border-t-transparent animate-spin" />
                  <span className="text-sm font-black uppercase tracking-widest">Synthesizing Protocol...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      </main>

      {/* ─── Input Protocol ─────────────────────────────────────── */}
      <footer className="p-10 border-t-4 border-[var(--text-1)] bg-white z-20">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
          >
            <div className="flex gap-6">
              <button 
                type="button" 
                onClick={toggleListening}
                className={cn(
                  "brutalist-button w-16 h-16 p-0 border-4 transition-all",
                  isListening ? "bg-red-500 text-white animate-pulse border-red-700" : "brutalist-button-outline text-[var(--text-1)]"
                )}
              >
                <Microphone weight="bold" size={24} />
              </button>
              <div className="flex-1 relative brutalist-card border-4">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKey}
                  placeholder="Describe legal intent (e.g., 'Freelance contract for UAE with 20% downpayment')..."
                  className="w-full bg-transparent p-6 text-base font-bold min-h-[64px] h-[64px] max-h-[300px] outline-none resize-none placeholder:text-[var(--text-3)] custom-scrollbar"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="brutalist-button w-32 h-16 bg-[var(--blue)] disabled:opacity-20 disabled:grayscale transition-all border-4"
              >
                <PaperPlaneRight weight="bold" size={28} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-3">
                  <Globe weight="bold" size={16} className="text-[var(--text-1)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-1)]">Network: {jurisdiction || "ROOT"}</span>
                </div>
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-3)] opacity-40 hidden md:block">
                Trace ID: {Math.random().toString(16).substring(2, 10).toUpperCase()} // Encrypted
              </div>
            </div>
            <div className="text-center text-[9px] font-black uppercase tracking-widest text-[var(--text-3)] opacity-60 mt-[-10px]">
              <Warning weight="bold" className="inline mr-1" size={12} />
              AgreeMint AI provides protocol architecture, not verified legal counsel. Final verification rests with the nodes.
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}
