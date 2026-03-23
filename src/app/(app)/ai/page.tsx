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
  Robot
} from "@phosphor-icons/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { countries } from '@/data/countries';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

import { useChat } from '@ai-sdk/react';

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
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { messages, input, setInput, handleInputChange, handleSubmit, append, isLoading } = (useChat as any)({
    api: '/api/ai/chat',
    body: { jurisdiction }
  });

  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="flex flex-col h-screen bg-[var(--bg)] selection:bg-[var(--text-1)] selection:text-[var(--bg)]">
      {/* ─── AI Header: Protocol Intelligence ────────────────── */}
      <header className="px-8 py-6 border-b-4 border-[var(--text-1)] bg-[var(--bg)] flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-2 border-[var(--text-1)] bg-[var(--bg)] flex items-center justify-center shadow-[2px_2px_0_0_var(--text-1)]">
            <Robot weight="fill" size={24} className="text-[var(--text-1)]" />
          </div>
          <div>
            <div className="font-black text-[14px] text-[var(--text-1)] tracking-tighter uppercase leading-none mb-1">AI Assistant</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--blue)]">Smart Legal Help</div>
          </div>
        </div>

        {/* Jurisdiction selector */}
        <div className="relative">
          <button
            onClick={() => setShowJurisdictions(v => !v)}
            className="btn-secondary py-3 px-6 gap-3 text-[9px] shadow-lg"
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
                className="absolute right-0 top-[calc(100%+12px)] w-72 max-h-[400px] overflow-y-auto bg-transparent border border-[var(--glass-border)] shadow-2xl p-4 z-50 custom-scrollbar"
              >
                <div className="px-2 py-3 mb-4 border-b-2 border-[var(--glass-border)]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">Node Jurisdictions</span>
                </div>
                <button
                  onClick={() => { setJurisdiction(''); setShowJurisdictions(false); }}
                  className="w-full text-left px-4 py-3 text-[11px] font-black uppercase hover:bg-[var(--bg)] transition-colors mb-2 border-2 border-transparent hover:border-[var(--glass-border)]"
                >
                  International Law
                </button>
                <div className="space-y-1">
                  {countries.map(c => (
                    <button
                      key={c.code}
                      onClick={() => { setJurisdiction(c.name); setShowJurisdictions(false); }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-[11px] font-bold hover:bg-[var(--color-white)]/5 transition-colors flex items-center gap-3 border border-transparent",
                        jurisdiction === c.name ? "bg-[var(--color-white)]/10 border-[var(--glass-border)]" : ""
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
                  <div className="inline-block p-8 bg-[var(--text-1)] text-[var(--bg)] mb-12 shadow-[6px_6px_0_0_#1447E6]">
                    <Sparkle size={64} weight="bold" />
                  </div>
                  <h2 className="heading-section text-4xl mb-6 uppercase font-black">AI Assistant Ready.</h2>
                  <p className="text-xl font-bold text-[var(--text-2)] leading-relaxed">Jurisdiction: <span className="text-[var(--text-1)]">{jurisdiction || "GLOBAL ROOT"}</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getPrompts(jurisdiction).map((p, i) => (
                    <button
                      key={i}
                      onClick={() => append({ role: 'user', content: p.text })}
                      className="brutalist-card bg-[var(--color-white)] border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] p-8 text-left group hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--text-1)] transition-all"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 border-2 border-[var(--text-1)] bg-[var(--bg)] shadow-[2px_2px_0_0_var(--text-1)] flex items-center justify-center">
                          <p.icon size={20} weight="bold" className="text-[var(--text-1)]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">{p.tag}</span>
                      </div>
                      <p className="text-sm font-black text-[var(--text-1)] leading-relaxed uppercase tracking-tight">{p.text}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    "max-w-[85%] p-10 border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)]",
                    m.role === 'user'
                      ? "bg-[var(--text-1)] text-[var(--bg)]"
                      : "bg-[var(--color-white)] text-[var(--text-1)]"
                  )}>
                    <div className="prose prose-sm font-bold leading-relaxed max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:mb-6">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">
                      {m.role === 'assistant' ? 'AI Assistant' : 'You'}
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
                <div className="brutalist-card bg-[var(--color-white)] p-8 border-2 border-[var(--text-1)] flex items-center gap-6 shadow-[4px_4px_0_0_var(--text-1)]">
                  <div className="w-6 h-6 border-4 border-[var(--text-1)] border-t-transparent animate-spin" />
                  <span className="text-sm font-black uppercase tracking-widest">Thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      </main>

      {/* ─── Input Protocol ─────────────────────────────────────── */}
      <footer className="p-10 border-t-4 border-[var(--text-1)] bg-[var(--bg)] z-20">
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
                  "btn-primary w-16 h-16 p-0 border transition-all",
                  isListening ? "bg-red-500 text-[var(--bg)] animate-pulse border-red-700" : "btn-secondary text-[var(--text-1)]"
                )}
              >
                <Microphone weight="bold" size={24} />
              </button>
              <div className="flex-1 relative brutalist-card bg-[var(--color-white)] border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] overflow-hidden">
                <textarea
                  ref={inputRef}
                  value={input || ''}
                  onChange={handleInputChange}
                  onKeyDown={handleKey}
                  placeholder="Describe legal intent (e.g., 'Freelance contract for UAE with 20% downpayment')..."
                  className="w-full bg-transparent p-6 text-base font-bold min-h-[64px] h-[64px] max-h-[300px] outline-none resize-none placeholder:text-[var(--text-3)] custom-scrollbar"
                />
              </div>
              <button
                type="submit"
                disabled={!input?.trim() || isLoading}
                className="btn-primary w-32 h-16 bg-[var(--blue)] border-2 border-[var(--text-1)] text-[var(--bg)] shadow-[4px_4px_0_0_var(--text-1)] disabled:opacity-20 disabled:grayscale transition-all hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--text-1)]"
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
                Trace ID: {Math.random().toString(16).substring(2, 10).toUpperCase()} {/* Encrypted */}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-[#FF5F56] border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] p-4 text-[var(--bg)] text-[10px] font-black uppercase tracking-widest mt-[-10px]">
              <Warning weight="bold" size={16} className="animate-pulse" />
              Not Legal Advice. AgreeMint provides structural guidance only. Consult a qualified lawyer.
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}
