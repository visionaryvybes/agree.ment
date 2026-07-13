'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlass, Warning, CheckCircle, ListChecks, ArrowCounterClockwise,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface Analysis {
  overallScore: number;
  grade: string;
  summary: string;
  scores: { clarity: number; enforceability: number; completeness: number; fairness: number };
  redFlags: { severity: 'high' | 'medium' | 'low'; title: string; description: string }[];
  missingClauses: string[];
  strengths: string[];
  recommendations: string[];
  contractType?: string;
  parties?: string[];
}

const SEVERITY = {
  high:   { label: 'Serious',      cls: 'text-rose border-rose/40' },
  medium: { label: 'Worth asking', cls: 'text-amber border-amber/40' },
  low:    { label: 'Minor',        cls: 'text-ink-3 border-line-strong' },
};

export default function ExplainPage() {
  const [text, setText] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  async function analyze() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/system/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, jurisdiction }),
      });
      const data = await res.json();
      if (!res.ok || !data.analysis) throw new Error(data.error || 'Analysis failed');
      setAnalysis(data.analysis);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-24">
      {/* ── Masthead ── */}
      <header className="pb-8 border-b-2 border-ink/80">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">The reading room</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h1 className="heading-display text-5xl sm:text-6xl">Explain this.</h1>
          <p className="font-display italic text-lg text-ink-2 pb-1.5 max-w-md">
            Someone handed you a contract? Paste it here before you sign it —
            we translate the jargon and flag what deserves a question.
          </p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!analysis ? (
          <motion.section
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="pt-10 max-w-3xl"
          >
            <div className="relative">
              {/* margin rule, like a legal pad */}
              <span className="absolute left-10 top-0 bottom-0 w-px bg-rose/20 pointer-events-none rounded" />
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={14}
                placeholder="Paste the full text of the agreement here — a lease, a freelance contract, an NDA, terms someone sent you…"
                className="w-full bg-card border border-line rounded-md pl-14 pr-6 py-5 text-[15px] leading-[1.9] text-ink placeholder:text-ink-3/60 shadow-[var(--shadow-sheet)] focus:outline-none focus:border-mint/50 resize-y font-sans"
                style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 26.5px, var(--border) 27px)' }}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <input
                value={jurisdiction}
                onChange={e => setJurisdiction(e.target.value)}
                placeholder="Where are you? (optional — e.g. California, Kenya, UK)"
                className="flex-1 min-w-56 px-4 py-2.5 bg-card border border-line rounded-lg text-sm text-ink placeholder:text-ink-3/70 focus:outline-none focus:border-mint/50"
              />
              <button
                onClick={analyze}
                disabled={!text.trim() || loading}
                className="btn-vibrant btn-vibrant-emerald disabled:opacity-40 disabled:pointer-events-none"
              >
                {loading ? 'Reading closely…' : <>Read it for me <MagnifyingGlass size={15} weight="bold" /></>}
              </button>
            </div>
            {error && <p className="mt-4 text-sm text-rose">{error}</p>}
            <p className="mt-6 text-xs text-ink-3 max-w-lg">
              This is a plain-English reading, not legal advice. For anything high-stakes,
              bring the flagged questions to a qualified lawyer — you'll get more out of the hour.
            </p>
          </motion.section>
        ) : (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-10"
          >
            {/* Verdict line */}
            <div className="flex flex-wrap items-start justify-between gap-6 pb-8 border-b border-line">
              <div className="max-w-2xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">
                  {analysis.contractType || 'Agreement'}
                  {analysis.parties?.length ? ` · ${analysis.parties.join(' ⇌ ')}` : ''}
                </p>
                <p className="mt-3 font-display text-2xl leading-relaxed text-ink">{analysis.summary}</p>
              </div>
              <div className="text-center border border-line-strong rounded-md px-6 py-4 rotate-[1.5deg] bg-card shadow-[var(--shadow-sheet)]">
                <p className="heading-display text-5xl">{analysis.grade}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-3">{analysis.overallScore}/100</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_300px] gap-12 pt-10">
              <div className="space-y-12">
                {/* Red flags */}
                <section>
                  <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3 pb-3 border-b border-line-strong">
                    <Warning size={14} className="text-rose" weight="duotone" /> Before you sign, ask about
                  </h2>
                  {analysis.redFlags.length === 0 ? (
                    <p className="pt-5 font-display italic text-ink-3">No red flags worth raising. Rare — nicely done, whoever wrote this.</p>
                  ) : (
                    <ol className="divide-y divide-line">
                      {analysis.redFlags.map((f, i) => (
                        <li key={i} className="py-5 grid grid-cols-[32px_1fr_auto] gap-4 items-baseline">
                          <span className="font-mono text-sm text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                          <span>
                            <span className="block font-semibold text-ink">{f.title}</span>
                            <span className="block mt-1 text-sm leading-relaxed text-ink-2">{f.description}</span>
                          </span>
                          <span className={cn(
                            'font-mono text-[9px] uppercase tracking-[0.15em] border rounded-[3px] px-1.5 py-[3px] rotate-[-2deg]',
                            SEVERITY[f.severity].cls
                          )}>
                            {SEVERITY[f.severity].label}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>

                {/* Missing pieces */}
                {analysis.missingClauses.length > 0 && (
                  <section>
                    <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3 pb-3 border-b border-line-strong">
                      <ListChecks size={14} className="text-amber" weight="duotone" /> What the document forgot
                    </h2>
                    <ul className="pt-4 space-y-2.5">
                      {analysis.missingClauses.map((m, i) => (
                        <li key={i} className="flex gap-3 text-sm text-ink-2 leading-relaxed">
                          <span className="text-amber font-mono">·</span>{m}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Strengths */}
                {analysis.strengths.length > 0 && (
                  <section>
                    <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3 pb-3 border-b border-line-strong">
                      <CheckCircle size={14} className="text-mint" weight="duotone" /> What it gets right
                    </h2>
                    <ul className="pt-4 space-y-2.5">
                      {analysis.strengths.map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm text-ink-2 leading-relaxed">
                          <span className="text-mint font-mono">·</span>{s}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Score marginalia */}
              <aside className="space-y-8">
                <div className="border border-line rounded-lg bg-card p-6 shadow-[var(--shadow-sheet)]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">Close reading</p>
                  <dl className="mt-4 space-y-4">
                    {Object.entries(analysis.scores).map(([k, v]) => (
                      <div key={k}>
                        <div className="flex items-baseline justify-between text-sm">
                          <dt className="capitalize text-ink-2">{k}</dt>
                          <dd className="font-mono tabular-nums text-ink">{v}</dd>
                        </div>
                        <div className="mt-1.5 h-1 bg-ink/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${v}%` }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className={cn('h-full rounded-full', v >= 70 ? 'bg-mint' : v >= 45 ? 'bg-amber' : 'bg-rose')}
                          />
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>

                {analysis.recommendations.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3 pb-3 border-b border-line-strong">
                      If it were ours
                    </p>
                    <ul className="pt-4 space-y-3">
                      {analysis.recommendations.slice(0, 5).map((r, i) => (
                        <li key={i} className="text-[13px] leading-relaxed text-ink-2">{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => { setAnalysis(null); setText(''); }}
                  className="btn-secondary w-full px-4 py-2.5 text-sm"
                >
                  <ArrowCounterClockwise size={14} className="mr-2" /> Read another
                </button>
              </aside>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
