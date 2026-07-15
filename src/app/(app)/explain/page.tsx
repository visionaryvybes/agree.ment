'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlass, Warning, CheckCircle, ListChecks, ArrowCounterClockwise,
  ClipboardText, CopySimple, Check, WifiSlash, Scales, BookOpen, ArrowUpRight,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { countries } from '@/data/countries';
import {
  legalFamily, FAMILY_INFO, esignInfo, DEAL_AREAS, DEAL_RULES,
  COUNTRY_NOTES, lawLinks,
} from '@/data/legal';

// ── Specimens: one-click documents to try the reading room on ─────────────

const SPECIMENS = [
  {
    label: 'A too-good freelance contract',
    text: `INDEPENDENT CONTRACTOR AGREEMENT

The Contractor agrees to provide design services as requested by the Client from time to time. The Client may modify the scope of work at any time. Payment shall be made within 90 days of invoice, subject to the Client's satisfaction with the deliverables, which shall be determined at the Client's sole discretion. All work product, including preliminary concepts and rejected drafts, becomes the exclusive property of the Client upon creation. The Contractor agrees not to work for any competing business for a period of 24 months following termination. Either party may terminate this agreement; the Client may do so at any time without notice or payment for work in progress.`,
  },
  {
    label: 'A friend-loan IOU',
    text: `IOU

I, Daniel M., borrowed $1,500 from Priya S. on June 3rd. I will pay it back when I can, hopefully within a few months. If I get my bonus early I will pay it back sooner.

Signed, Daniel`,
  },
  {
    label: 'A room sublet message',
    text: `Hey! So just to confirm what we talked about — you'll take the room from Aug 1, rent is $700 a month including wifi but not electricity, we split that. Deposit is one month which I'll hold onto. If you want to move out just give me a heads up a couple weeks before. My landlord doesn't technically allow sublets so let's keep this between us. Sound good?`,
  },
  {
    label: 'An everything-is-secret NDA',
    text: `MUTUAL NON-DISCLOSURE AGREEMENT

Each party agrees to keep confidential all information of any kind received from the other party, whether written, oral, visual, or inferred, whether or not marked confidential, in perpetuity. Confidential Information includes but is not limited to all business, technical, financial, and personal information, and the existence of this Agreement itself. The receiving party shall be liable for any disclosure however caused, including by third parties, and agrees to pay liquidated damages of $50,000 per disclosure without proof of loss. This Agreement survives termination indefinitely and is binding on all affiliates, heirs, and successors.`,
  },
  {
    label: 'A used-car sale text',
    text: `Yo, so we're agreed — $4,200 for the Corolla, cash. It runs fine, AC works, there's that noise from the back left but it's nothing serious, my mechanic looked at it last year. I'll sign the title over when you pay. If anything breaks after that it's on you obviously. You can pick it up Saturday. Bring the cash and we're done, no comebacks either way.`,
  },
];

const MIN_CHARS = 120;

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
  const [countryCode, setCountryCode] = useState('');
  const country = countries.find(c => c.code === countryCode);
  const jurisdiction = country?.name ?? '';
  const [lawTab, setLawTab] = useState<'essentials' | 'esign' | 'deals' | 'sources'>('essentials');
  const [openDeal, setOpenDeal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(false);
  const [copied, setCopied] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const tooShort = text.trim().length > 0 && text.trim().length < MIN_CHARS;

  async function analyze() {
    if (!text.trim() || tooShort || loading) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setOffline(true);
      return;
    }
    setLoading(true);
    setError('');
    setOffline(false);
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
      if (typeof navigator !== 'undefined' && !navigator.onLine) setOffline(true);
      else setError(e.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function pasteFromClipboard() {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) setText(clip);
    } catch {
      setError('Your browser blocked clipboard access — paste with Ctrl/Cmd+V instead.');
    }
  }

  function copyQuestions() {
    if (!analysis) return;
    const lines = [
      `Questions to raise before signing (via AgreeMint):`,
      ...analysis.redFlags.map((f, i) => `${i + 1}. ${f.title} — ${f.description}`),
      ...(analysis.missingClauses.length
        ? ['', 'Missing from the document:', ...analysis.missingClauses.map(m => `· ${m}`)]
        : []),
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="pb-24">
      {/* ── Masthead ── */}
      <header className="pb-8 border-b-2 border-ink/80">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">Check a contract</p>
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
                className="w-full bg-card border border-line rounded-[3px] pl-14 pr-6 py-5 text-[15px] leading-[1.9] text-ink placeholder:text-ink-3/60 shadow-[var(--shadow-sheet)] focus:outline-none focus:border-mint/50 resize-y font-sans"
                style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 26.5px, var(--border) 27px)' }}
              />
            </div>

            {/* Under-textarea rail: paste helper + character count */}
            <div className="mt-2 flex items-center justify-between">
              <button
                onClick={pasteFromClipboard}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-3 hover:text-mint transition-colors"
              >
                <ClipboardText size={13} weight="bold" /> Paste from clipboard
              </button>
              <p className={cn(
                'font-mono text-[10px] tabular-nums tracking-[0.12em]',
                tooShort ? 'text-amber' : 'text-ink-3'
              )}>
                {text.trim().length.toLocaleString()} chars
                {tooShort && ` · need ${MIN_CHARS}+ for a real reading`}
              </p>
            </div>

            {/* Specimens: try it without owning a bad contract */}
            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-3">
                Nothing to paste? Try an example
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {SPECIMENS.map(s => (
                  <button
                    key={s.label}
                    onClick={() => { setText(s.text); setError(''); }}
                    className="px-3 py-2 bg-card border-[1.5px] border-line text-xs text-ink-2
                               hover:border-line-strong hover:text-ink hover:shadow-[var(--shadow-sheet)]
                               hover:-translate-x-0.5 hover:-translate-y-0.5
                               active:translate-x-0 active:translate-y-0 active:shadow-none
                               transition-all duration-150"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <label className="flex-1 min-w-56">
                <span className="sr-only">Your country (optional)</span>
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-card border-[1.5px] border-line rounded-[3px] text-sm text-ink focus:outline-none focus:border-mint transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Where are you? (optional — checks against local rules)</option>
                  {['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'].map(region => (
                    <optgroup key={region} label={region}>
                      {countries.filter(c => c.region === region).map(c => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
              <button
                onClick={analyze}
                disabled={!text.trim() || tooShort || loading}
                className="btn-vibrant btn-vibrant-emerald disabled:opacity-40 disabled:pointer-events-none"
              >
                {loading ? 'Reading closely…' : <>Read it for me <MagnifyingGlass size={15} weight="bold" /></>}
              </button>
            </div>

            {/* ── The law where you are — a filed reference card ── */}
            {country && (() => {
              const family = legalFamily(country.code);
              const info = FAMILY_INFO[family];
              const esign = esignInfo(country.code);
              const notes = COUNTRY_NOTES[country.code];
              const TABS = [
                { id: 'essentials' as const, label: 'Essentials' },
                { id: 'esign' as const, label: 'E-signing' },
                { id: 'deals' as const, label: 'By deal type' },
                { id: 'sources' as const, label: 'Sources' },
              ];
              return (
                <motion.aside
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 border-[1.5px] border-line-strong bg-card shadow-[var(--shadow-sheet)]"
                >
                  {/* Header: country + legal-family stamp */}
                  <div className="px-5 py-4 border-b-[1.5px] border-line-strong flex flex-wrap items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2.5 font-bold text-ink">
                      <Scales size={18} weight="duotone" className="text-mint" />
                      The law in {country.name}
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-mint border-[1.5px] border-mint px-1.5 py-[2px] rotate-[-2deg]">
                        {info.name}
                      </span>
                    </h2>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-3">Orientation, not legal advice</span>
                  </div>

                  {/* Section tabs */}
                  <div className="flex border-b-[1.5px] border-line-strong overflow-x-auto no-scrollbar">
                    {TABS.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setLawTab(t.id)}
                        aria-pressed={lawTab === t.id}
                        className={cn(
                          'px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap',
                          'border-r border-line transition-colors',
                          lawTab === t.id
                            ? 'bg-mint text-paper'
                            : 'text-ink-3 hover:text-ink hover:bg-wash'
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Essentials: how contracts bind here */}
                  {lawTab === 'essentials' && (
                    <div className="p-5 space-y-4">
                      <p className="text-[13px] leading-relaxed text-ink-2">{info.gist}</p>
                      <ul className="space-y-2">
                        {info.contractBasics.map((b, i) => (
                          <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2">
                            <span className="font-mono text-mint">{i + 1}.</span>{b}
                          </li>
                        ))}
                      </ul>
                      {notes && (
                        <div className="mt-1 border-t-2 border-dashed border-line pt-4">
                          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink-3">
                            Specific to {country.name}
                          </p>
                          <p className="mt-1.5 text-[13px] font-bold text-ink">{notes.headline}</p>
                          <ul className="mt-2 space-y-2">
                            {notes.points.map((p, i) => (
                              <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2">
                                <span className="font-mono text-mint">·</span>{p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* E-signing: does an AgreeMint-style signature hold up? */}
                  {lawTab === 'esign' && (
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <span className={cn(
                          'font-mono text-[10px] font-bold uppercase tracking-[0.18em] border-[1.5px] px-2 py-1 rotate-[-2deg] flex-shrink-0',
                          esign.recognized ? 'text-mint border-mint' : 'text-amber border-amber'
                        )}>
                          {esign.recognized ? 'Recognized' : 'Verify locally'}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-ink">
                            {esign.recognized
                              ? 'Electronic signatures have legal standing here.'
                              : 'Electronic signature status is not confirmed here.'}
                          </p>
                          <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{esign.law}</p>
                        </div>
                      </div>
                      <p className="mt-4 pt-4 border-t-2 border-dashed border-line text-[12px] leading-relaxed text-ink-3">
                        Everywhere, some documents still demand more than an e-signature — wills,
                        real-estate transfers, and notarized deeds are the usual exceptions. For the
                        everyday deals our templates cover, a signed electronic document with a
                        timestamp is the practical standard.
                      </p>
                    </div>
                  )}

                  {/* By deal type: our template areas × this legal family */}
                  {lawTab === 'deals' && (
                    <div>
                      {DEAL_AREAS.map(d => (
                        <div key={d.id} className="border-b border-dashed border-line last:border-b-0">
                          <button
                            onClick={() => setOpenDeal(openDeal === d.id ? null : d.id)}
                            aria-expanded={openDeal === d.id}
                            className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-wash transition-colors"
                          >
                            <span className={cn(
                              'font-mono text-[11px] font-bold transition-transform',
                              openDeal === d.id ? 'text-mint rotate-90' : 'text-ink-3'
                            )}>›</span>
                            <span className="text-sm font-bold text-ink">{d.label}</span>
                            <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.12em] text-ink-3 hidden sm:block">
                              {d.templates}
                            </span>
                          </button>
                          {openDeal === d.id && (
                            <p className="px-5 pb-4 pl-11 text-[13px] leading-relaxed text-ink-2">
                              {DEAL_RULES[d.id][family]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sources: read the law yourself */}
                  {lawTab === 'sources' && (
                    <div className="p-5">
                      <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-ink-3">
                        <BookOpen size={13} weight="duotone" /> Free, public sources
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {lawLinks(country.name, country.code).map(l => (
                          <a
                            key={l.label}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-wash border-[1.5px] border-line text-xs text-ink-2
                                       hover:border-line-strong hover:text-ink hover:shadow-[var(--shadow-sheet)]
                                       hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150"
                          >
                            {l.label}
                            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-3">· {l.source}</span>
                            <ArrowUpRight size={11} weight="bold" />
                          </a>
                        ))}
                      </div>
                      <p className="mt-4 text-[12px] leading-relaxed text-ink-3">
                        These are general public references — statutes change, and local legal aid or
                        a qualified lawyer is the right check for anything high-stakes.
                      </p>
                    </div>
                  )}
                </motion.aside>
              );
            })()}

            {/* Failure paths, designed */}
            {offline && (
              <div className="mt-5 flex items-start gap-3 border-[1.5px] border-amber bg-amber/10 p-4">
                <WifiSlash size={18} weight="duotone" className="text-amber flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-ink">You're offline.</p>
                  <p className="mt-0.5 text-sm text-ink-2">
                    Check a contract needs a connection. Your pasted text is safe right here —
                    reconnect and press the button again.
                  </p>
                </div>
              </div>
            )}
            {error && (
              <div className="mt-5 flex items-start justify-between gap-4 border-[1.5px] border-rose bg-rose/10 p-4">
                <div className="flex items-start gap-3">
                  <Warning size={18} weight="duotone" className="text-rose flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-ink">The reading didn't finish.</p>
                    <p className="mt-0.5 text-sm text-ink-2">{error}</p>
                  </div>
                </div>
                <button onClick={analyze} className="btn-secondary px-3 py-1.5 text-[11px] flex-shrink-0">
                  Retry
                </button>
              </div>
            )}

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
              <div className="text-center border border-line-strong rounded-[3px] px-6 py-4 rotate-[1.5deg] bg-card shadow-[var(--shadow-sheet)]">
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
                <div className="border border-line rounded-[3px] bg-card p-6 shadow-[var(--shadow-sheet)]">
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

                <div className="space-y-3">
                  <button
                    onClick={copyQuestions}
                    className="btn-vibrant btn-vibrant-emerald w-full !px-4 !py-2.5 !text-xs"
                  >
                    {copied
                      ? <><Check size={14} weight="bold" /> Copied — send it over</>
                      : <><CopySimple size={14} weight="bold" /> Copy the questions</>}
                  </button>
                  <button
                    onClick={() => { setAnalysis(null); setText(''); }}
                    className="btn-secondary w-full px-4 py-2.5 text-sm"
                  >
                    <ArrowCounterClockwise size={14} className="mr-2" /> Read another
                  </button>
                </div>
              </aside>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
