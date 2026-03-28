'use client';

import {
  MagicWand, Robot, Scales, Warning, CheckCircle,
  ArrowRight, Sparkle, ShieldCheck, FileMagnifyingGlass,
  TrendUp, XCircle, CaretDown, CaretUp,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Severity = 'high' | 'medium' | 'low';

interface Analysis {
  overallScore: number;
  grade: string;
  summary: string;
  scores: { clarity: number; enforceability: number; completeness: number; fairness: number };
  redFlags: Array<{ severity: Severity; title: string; description: string }>;
  missingClauses: string[];
  strengths: string[];
  recommendations: string[];
  contractType?: string;
  parties?: string[];
}

const SCORE_COLOR = (n: number) =>
  n >= 80 ? 'text-emerald' : n >= 60 ? 'text-blue' : n >= 40 ? 'text-amber' : 'text-rose';

const FLAG_CONFIG = {
  high:   { color: 'text-rose',   bg: 'bg-rose/10',   border: 'border-rose/20',   label: 'HIGH' },
  medium: { color: 'text-amber',  bg: 'bg-amber/10',  border: 'border-amber/20',  label: 'MED'  },
  low:    { color: 'text-blue',   bg: 'bg-blue/10',   border: 'border-blue/20',   label: 'LOW'  },
};

export default function ToolsPage() {
  const [text, setText] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>('flags');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const res = await fetch('/api/system/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, jurisdiction }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError('Analysis failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key: string) => setExpanded(prev => prev === key ? null : key);

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-8 relative">
      <div className="vibrant-glow top-0 left-1/4 w-[400px] h-[400px] bg-emerald/[0.07] animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 right-0 w-[300px] h-[300px] bg-blue/[0.05]" />

      {/* Header */}
      <header className="pb-6 border-b border-white/[0.07] relative z-10">
        <span className="text-[10px] font-black text-emerald uppercase tracking-[0.4em] block mb-1">AI-Powered</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight italic uppercase">Tools.</h1>
        <p className="text-sm text-white/30 mt-2">Analyze contracts, generate clauses, and get legal insights.</p>
      </header>

      {/* Tool Cards Row */}
      <div className="grid sm:grid-cols-3 gap-4 relative z-10">
        {[
          { label: 'Contract Analyzer', desc: 'Paste any contract and get an AI risk report', icon: FileMagnifyingGlass, active: true, color: 'emerald' },
          { label: 'Clause Builder', desc: 'Generate individual legal clauses with AI', icon: MagicWand, active: false, color: 'blue' },
          { label: 'Jurisdiction Lookup', desc: 'Laws that apply to your location', icon: Scales, active: false, color: 'amber' },
        ].map(tool => (
          <div key={tool.label} className={cn(
            'p-5 rounded-2xl border flex flex-col gap-3 transition-all',
            tool.active
              ? 'bg-emerald/[0.08] border-emerald/25'
              : 'bg-white/[0.02] border-white/[0.07] opacity-60'
          )}>
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              tool.color === 'emerald' ? 'bg-emerald/15 text-emerald' :
              tool.color === 'blue' ? 'bg-blue/15 text-blue' : 'bg-amber/15 text-amber'
            )}>
              <tool.icon size={20} weight="bold" />
            </div>
            <div>
              <p className="text-[11px] font-black text-white uppercase tracking-widest">{tool.label}</p>
              <p className="text-[10px] text-white/30 mt-1">{tool.desc}</p>
            </div>
            {!tool.active && <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Coming Soon</span>}
          </div>
        ))}
      </div>

      {/* Contract Analyzer */}
      <div className="relative z-10 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.07]">
          <div className="w-8 h-8 rounded-xl bg-emerald/15 flex items-center justify-center text-emerald">
            <FileMagnifyingGlass size={16} weight="bold" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tight">Contract Analyzer</h2>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">AI-powered risk assessment</p>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste your contract or agreement text here..."
                rows={8}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-emerald/40 transition-all resize-none leading-relaxed"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Jurisdiction (optional) — e.g., Lagos Nigeria, London UK"
              value={jurisdiction}
              onChange={e => setJurisdiction(e.target.value)}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-emerald/40 transition-all"
            />
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,209,0.2)] disabled:opacity-40 disabled:scale-100 flex-shrink-0"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-[#010101]/20 border-t-[#010101] rounded-full animate-spin" /> Analyzing...</>
              ) : (
                <><Robot size={16} weight="bold" /> Analyze</>
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-rose text-[11px] font-black uppercase tracking-widest text-center">{error}</p>
        )}

        {/* Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Score Header */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center gap-6">
                {/* Big Score */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={cn('text-6xl font-black leading-none', SCORE_COLOR(analysis.overallScore))}>
                    {analysis.grade}
                  </div>
                  <div className={cn('text-[11px] font-black uppercase tracking-widest mt-1', SCORE_COLOR(analysis.overallScore))}>
                    {analysis.overallScore}/100
                  </div>
                </div>

                {/* Sub scores */}
                <div className="flex-1 space-y-2.5 w-full">
                  {Object.entries(analysis.scores).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest w-24 flex-shrink-0">{key}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={cn('h-full rounded-full', val >= 80 ? 'bg-emerald' : val >= 60 ? 'bg-blue' : val >= 40 ? 'bg-amber' : 'bg-rose')}
                        />
                      </div>
                      <span className={cn('text-[10px] font-black w-8 text-right', SCORE_COLOR(val))}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07]">
                <p className="text-sm text-white/60 leading-relaxed">{analysis.summary}</p>
                {analysis.contractType && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Detected:</span>
                    <span className="text-[10px] font-black text-emerald uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald/10 border border-emerald/20">{analysis.contractType}</span>
                    {analysis.parties?.map(p => (
                      <span key={p} className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10">{p}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Red Flags */}
              {analysis.redFlags?.length > 0 && (
                <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
                  <button
                    onClick={() => toggle('flags')}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Warning size={16} weight="bold" className="text-rose" />
                      <span className="text-[11px] font-black text-white uppercase tracking-widest">Red Flags</span>
                      <span className="text-[9px] font-black text-rose uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose/10 border border-rose/20">
                        {analysis.redFlags.length}
                      </span>
                    </div>
                    {expanded === 'flags' ? <CaretUp size={14} className="text-white/30" weight="bold" /> : <CaretDown size={14} className="text-white/30" weight="bold" />}
                  </button>
                  <AnimatePresence>
                    {expanded === 'flags' && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-4 pt-0 space-y-2">
                          {analysis.redFlags.map((flag, i) => {
                            const cfg = FLAG_CONFIG[flag.severity];
                            return (
                              <div key={i} className={cn('p-4 rounded-xl border flex gap-3', cfg.bg, cfg.border)}>
                                <span className={cn('text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border flex-shrink-0 mt-0.5', cfg.color, cfg.bg, cfg.border)}>{cfg.label}</span>
                                <div>
                                  <p className="text-[11px] font-black text-white">{flag.title}</p>
                                  <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">{flag.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Missing Clauses */}
              {analysis.missingClauses?.length > 0 && (
                <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
                  <button onClick={() => toggle('missing')} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <XCircle size={16} weight="bold" className="text-amber" />
                      <span className="text-[11px] font-black text-white uppercase tracking-widest">Missing Clauses</span>
                      <span className="text-[9px] font-black text-amber uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber/10 border border-amber/20">{analysis.missingClauses.length}</span>
                    </div>
                    {expanded === 'missing' ? <CaretUp size={14} className="text-white/30" weight="bold" /> : <CaretDown size={14} className="text-white/30" weight="bold" />}
                  </button>
                  <AnimatePresence>
                    {expanded === 'missing' && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-4 pt-0 space-y-2">
                          {analysis.missingClauses.map((clause, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" />
                              <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">{clause}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Strengths */}
              {analysis.strengths?.length > 0 && (
                <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
                  <button onClick={() => toggle('strengths')} className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} weight="bold" className="text-emerald" />
                      <span className="text-[11px] font-black text-white uppercase tracking-widest">Strengths</span>
                      <span className="text-[9px] font-black text-emerald uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald/10 border border-emerald/20">{analysis.strengths.length}</span>
                    </div>
                    {expanded === 'strengths' ? <CaretUp size={14} className="text-white/30" weight="bold" /> : <CaretDown size={14} className="text-white/30" weight="bold" />}
                  </button>
                  <AnimatePresence>
                    {expanded === 'strengths' && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-4 pt-0 space-y-2">
                          {analysis.strengths.map((s, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-emerald/[0.04] border border-emerald/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald flex-shrink-0" />
                              <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">{s}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations?.length > 0 && (
                <div className="p-5 rounded-2xl bg-emerald/[0.06] border border-emerald/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendUp size={16} weight="bold" className="text-emerald" />
                    <span className="text-[11px] font-black text-emerald uppercase tracking-widest">Recommendations</span>
                  </div>
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-[9px] font-black text-emerald opacity-60 flex-shrink-0 mt-0.5">{i + 1}.</span>
                        <p className="text-[11px] text-white/60 leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-3 pt-2">
                <Link href="/contracts/new" className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(0,255,209,0.2)]">
                  <Sparkle size={16} weight="bold" /> Create Better Agreement
                </Link>
                <Link href="/verified-guidance" className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-[11px] font-black text-white/40 uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">
                  Ask AI <ArrowRight size={14} weight="bold" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!analysis && !loading && (
          <div className="py-12 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Robot size={28} weight="thin" className="text-white/20" />
            </div>
            <p className="text-xs font-black text-white/20 uppercase tracking-widest">Paste a contract above to get started</p>
            <p className="text-[10px] text-white/10 max-w-xs">The AI will analyze risk, missing clauses, enforceability, and give you improvement recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
