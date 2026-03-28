'use client';

import {
  Books, Scales, FileText, ShieldCheck, MagnifyingGlass,
  ArrowRight, Gavel, Files, Signature, Robot, Sparkle,
  Handshake, House, Car, Briefcase, PaperPlane,
  CaretRight, Warning, CheckCircle,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { name: 'Personal Sales',    icon: Files,      count: 124, color: 'emerald', href: '/templates?cat=personal' },
  { name: 'Private Loans',     icon: Scales,     count: 85,  color: 'blue',    href: '/templates?cat=loan'     },
  { name: 'Work & Freelance',  icon: ShieldCheck,count: 62,  color: 'amber',   href: '/templates?cat=creative'  },
  { name: 'Private Rentals',   icon: Gavel,      count: 45,  color: 'rose',    href: '/templates?cat=rental'   },
];

const ARTICLES = [
  {
    category: 'Contracts 101',
    color: 'emerald',
    icon: FileText,
    title: 'What Makes a Contract Legally Binding?',
    summary: 'A contract requires: offer, acceptance, consideration, mutual assent, and legal capacity. Without all five, it may not be enforceable.',
    points: ['Both parties must agree voluntarily', 'There must be an exchange of value', 'Both parties must have legal capacity', 'The subject must be legal'],
  },
  {
    category: 'Signatures',
    color: 'blue',
    icon: Signature,
    title: 'Electronic Signatures Are Legally Valid',
    summary: 'Under ESIGN (USA), eIDAS (EU), and similar laws in 50+ countries, digital signatures carry the same legal weight as handwritten ones.',
    points: ['Accepted in US, UK, EU, Canada, Australia', 'Email or typed name can qualify', 'Timestamps add legal strength', 'AgreeMint signatures are compliant'],
  },
  {
    category: 'Disputes',
    color: 'amber',
    icon: Gavel,
    title: 'How to Resolve a Contract Dispute',
    summary: 'Start with friendly communication, then escalate systematically. Most disputes are resolved before court.',
    points: ['1. Document everything in writing', '2. Send a formal notice via AgreeMint', '3. Propose mediation or arbitration', '4. Small claims court as last resort'],
  },
  {
    category: 'Loans',
    color: 'rose',
    icon: Handshake,
    title: 'Lending Money to Friends & Family',
    summary: 'Without a written agreement, loans to loved ones can destroy relationships. A simple written record protects everyone.',
    points: ['Specify exact repayment date', 'Include what happens if late', '0% interest loans are legal', 'Both parties should sign'],
  },
];

const QUICK_FACTS = [
  { icon: CheckCircle, color: 'text-emerald', text: 'Verbal contracts are legally binding but nearly impossible to enforce' },
  { icon: Warning,     color: 'text-amber',   text: 'A contract without consideration (exchange of value) is void' },
  { icon: CheckCircle, color: 'text-emerald', text: 'You can contract with anyone over 18 with legal capacity' },
  { icon: Warning,     color: 'text-rose',    text: 'Contracts for illegal activities are unenforceable in all jurisdictions' },
  { icon: CheckCircle, color: 'text-emerald', text: 'Digital signatures are legally equivalent to handwritten ones in 50+ countries' },
  { icon: CheckCircle, color: 'text-blue',    text: 'A "handshake deal" is a contract — get it in writing to prove it' },
];

export default function LegalLibraryPage() {
  const [search, setSearch] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const filteredArticles = ARTICLES.filter(a =>
    !search || a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.summary.toLowerCase().includes(search.toLowerCase())
  );

  const askAI = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiAnswer('');
    try {
      const res = await fetch('/api/system/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Legal library question: ${aiQuestion}` }],
          jurisdiction: '',
        }),
      });
      if (!res.ok) throw new Error();
      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setAiAnswer(acc);
      }
    } catch {
      setAiAnswer('Sorry, AI is temporarily unavailable. Please try the Guidance page.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-32 max-w-6xl mx-auto relative">

      <div className="vibrant-glow top-0 right-0 w-[500px] h-[500px] bg-emerald/8 animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 left-0 w-[400px] h-[400px] bg-blue/8" />

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.07] relative z-10">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-[10px] font-black text-emerald uppercase tracking-[0.4em] block mb-1">Knowledge Base</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight italic uppercase">Library.</h1>
        </motion.div>

        <div className="flex-1 max-w-xs relative group">
          <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-emerald transition-colors" size={14} weight="bold" />
          <input
            type="text"
            placeholder="Search articles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl py-2.5 pl-9 pr-4 text-[11px] font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-emerald/40 transition-all"
          />
        </div>
      </header>

      {/* Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              href={cat.href}
              className={cn(
                'p-5 rounded-2xl bg-white/[0.02] border flex flex-col items-center text-center gap-3 cursor-pointer transition-all duration-500 group relative overflow-hidden',
                cat.color === 'emerald' ? 'border-emerald/15 hover:border-emerald/40 hover:bg-emerald/5' :
                cat.color === 'blue'    ? 'border-blue/15    hover:border-blue/40    hover:bg-blue/5'    :
                cat.color === 'amber'   ? 'border-amber/15   hover:border-amber/40   hover:bg-amber/5'   :
                                          'border-rose/15    hover:border-rose/40    hover:bg-rose/5',
              )}
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500',
                cat.color === 'emerald' ? 'bg-emerald/10 text-emerald' :
                cat.color === 'blue'    ? 'bg-blue/10    text-blue'    :
                cat.color === 'amber'   ? 'bg-amber/10   text-amber'   :
                                          'bg-rose/10    text-rose',
              )}>
                <cat.icon size={20} weight="bold" />
              </div>
              <div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-tight">{cat.name}</h3>
                <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">{cat.count} Templates</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick AI Answer Box */}
      <div className="relative z-10 p-5 rounded-3xl bg-emerald/[0.05] border border-emerald/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald/15 flex items-center justify-center text-emerald">
            <Robot size={18} weight="bold" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Ask a Legal Question</h3>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">AI-powered • Not legal advice</p>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={aiQuestion}
            onChange={e => setAiQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && askAI()}
            placeholder="e.g. Can I sue if someone breaks a verbal agreement?"
            className="flex-1 bg-white/[0.04] border border-emerald/20 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald/40 transition-all"
          />
          <button
            onClick={askAI}
            disabled={!aiQuestion.trim() || aiLoading}
            className="px-5 py-3 rounded-xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-40 disabled:scale-100 flex-shrink-0"
          >
            {aiLoading ? <div className="w-4 h-4 border-2 border-[#010101]/20 border-t-[#010101] rounded-full animate-spin" /> : <PaperPlane size={14} weight="bold" />}
          </button>
        </div>
        {aiAnswer && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkle size={11} weight="bold" className="text-emerald" />
              <span className="text-[8px] font-black text-white/25 uppercase tracking-widest">AgreeMint AI</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{aiAnswer}</p>
          </motion.div>
        )}
      </div>

      {/* Legal Articles */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">Legal Basics</h2>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{filteredArticles.length} articles</span>
        </div>

        <div className="space-y-3">
          {filteredArticles.map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                'rounded-2xl border overflow-hidden transition-all duration-300',
                article.color === 'emerald' ? 'border-emerald/15 bg-emerald/[0.03]' :
                article.color === 'blue'    ? 'border-blue/15    bg-blue/[0.03]'    :
                article.color === 'amber'   ? 'border-amber/15   bg-amber/[0.03]'   :
                                              'border-rose/15    bg-rose/[0.03]',
              )}
            >
              <button
                onClick={() => setExpandedArticle(expandedArticle === i ? null : i)}
                className="w-full p-5 flex items-center gap-4 text-left"
              >
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                  article.color === 'emerald' ? 'bg-emerald/15 text-emerald' :
                  article.color === 'blue'    ? 'bg-blue/15    text-blue'    :
                  article.color === 'amber'   ? 'bg-amber/15   text-amber'   :
                                                'bg-rose/15    text-rose',
                )}>
                  <article.icon size={17} weight="bold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn('text-[8px] font-black uppercase tracking-widest',
                      article.color === 'emerald' ? 'text-emerald' :
                      article.color === 'blue'    ? 'text-blue'    :
                      article.color === 'amber'   ? 'text-amber'   : 'text-rose'
                    )}>{article.category}</span>
                  </div>
                  <h3 className="text-sm font-black text-white tracking-tight">{article.title}</h3>
                </div>
                <CaretRight size={14} weight="bold" className={cn('flex-shrink-0 transition-transform text-white/20', expandedArticle === i && 'rotate-90')} />
              </button>

              <AnimatePresence>
                {expandedArticle === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4 border-t border-white/[0.06]">
                      <p className="text-sm text-white/50 leading-relaxed pt-4">{article.summary}</p>
                      <div className="space-y-2">
                        {article.points.map((point, j) => (
                          <div key={j} className="flex items-start gap-3">
                            <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5',
                              article.color === 'emerald' ? 'bg-emerald' :
                              article.color === 'blue'    ? 'bg-blue'    :
                              article.color === 'amber'   ? 'bg-amber'   : 'bg-rose'
                            )} />
                            <p className="text-[11px] text-white/40 leading-relaxed">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Facts */}
      <div className="relative z-10 space-y-4">
        <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">Quick Facts</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {QUICK_FACTS.map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
            >
              <fact.icon size={15} weight="bold" className={cn(fact.color, 'flex-shrink-0 mt-0.5')} />
              <p className="text-[11px] text-white/45 leading-relaxed">{fact.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-emerald p-8 md:p-12 text-[#010101] relative overflow-hidden shadow-[0_0_80px_rgba(0,255,209,0.15)] z-10"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Books size={160} weight="bold" />
        </div>
        <div className="max-w-lg space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase italic">Need a Custom Agreement?</h2>
          <p className="text-sm font-bold opacity-70 uppercase tracking-widest leading-relaxed">Our AI generates jurisdiction-specific contracts in under 60 seconds.</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/contracts/new" className="flex items-center gap-2 bg-[#010101] text-emerald px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
              Create Agreement <ArrowRight size={16} weight="bold" />
            </Link>
            <Link href="/verified-guidance" className="flex items-center gap-2 bg-[#010101]/20 text-[#010101] px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#010101]/30 transition-colors">
              Ask AI <Robot size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
