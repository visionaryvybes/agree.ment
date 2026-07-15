'use client';

import { useTemplates } from '@/store/contracts';
import { MagnifyingGlass, ArrowUpRight } from '@phosphor-icons/react';
import { TemplateThumb, templateIcon } from '@/components/TemplateArt';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all',         label: 'Everything' },
  { id: 'personal',    label: 'Personal' },
  { id: 'business',    label: 'Business' },
  { id: 'creative',    label: 'Creative' },
  { id: 'nda',         label: 'Confidential' },
  { id: 'loan',        label: 'Money' },
  { id: 'partnership', label: 'Together' },
];

const CAT_TONE: Record<string, string> = {
  personal: 'text-mint', business: 'text-blue', creative: 'text-rose',
  nda: 'text-amber', loan: 'text-amber', partnership: 'text-blue',
  sale: 'text-mint', rental: 'text-rose', event: 'text-rose', legal: 'text-amber',
};

export default function TemplatesPage() {
  const { templates } = useTemplates();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const filtered = (templates ?? []).filter(t => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || t.category === category;
    return matchSearch && matchCat;
  });

  const popular = filtered.filter(t => t.popular);
  const rest = filtered.filter(t => !t.popular);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pb-24">

      {/* ── Masthead ── */}
      <header className="pb-8 border-b-2 border-ink/80">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">Template library</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h1 className="heading-display text-5xl sm:text-6xl">Templates.</h1>
          <p className="font-display italic text-lg text-ink-2 pb-1.5 max-w-sm">
            Start from a form the lawyers would recognize — finished in words your friends would.
          </p>
        </div>
      </header>

      {/* ── Index tabs + search ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-7 pb-8">
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                'pb-1 text-sm border-b-2 transition-colors',
                category === c.id
                  ? 'border-mint text-ink font-medium'
                  : 'border-transparent text-ink-3 hover:text-ink'
              )}
            >
              {c.label}
            </button>
          ))}
        </nav>
        <label className="relative">
          <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search templates…"
            className="pl-9 pr-4 py-2 w-64 bg-card border border-line rounded-[3px] text-sm text-ink placeholder:text-ink-3/70 focus:outline-none focus:border-mint/50 transition-colors"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center border-t border-line">
          <p className="heading-display text-3xl text-ink-3">No template matches that.</p>
          <p className="mt-3 text-sm text-ink-2">
            Try another word — or <Link href="/contracts/new" className="text-mint hover:underline">describe your deal from scratch</Link>.
          </p>
        </div>
      ) : (
        <div className="space-y-14">
          {popular.length > 0 && (
            <section>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3 pb-3 border-b border-line-strong">
                Most used
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-6">
                {popular.map((t, i) => <IndexCard key={t.id} t={t} i={i} featured />)}
              </div>
            </section>
          )}
          {rest.length > 0 && (
            <section>
              {popular.length > 0 && (
                <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3 pb-3 border-b border-line-strong">
                  More templates
                </h2>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-6">
                {rest.map((t, i) => <IndexCard key={t.id} t={t} i={i} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Catalog card: specimen preview on top, docket details below ───────────

function IndexCard({ t, i, featured = false }: { t: any; i: number; featured?: boolean }) {
  const tone = CAT_TONE[t.category] ?? 'text-ink-3';
  const TIcon = templateIcon(t);
  const ref = t.id.replace('tpl-', '').slice(0, 12).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.4 }}
    >
      <Link
        href={`/templates/${t.id}`}
        className={cn(
          'group relative flex flex-col h-full bg-card border-[1.5px] border-line-strong shadow-[var(--shadow-sheet)]',
          'hover:shadow-[var(--shadow-lift)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200'
        )}
      >
        {/* Specimen: the document itself, in miniature */}
        <TemplateThumb t={t} />

        <div className="flex flex-col flex-1 p-5">
          <div className="flex items-center justify-between">
            <p className={cn('font-mono text-[9px] uppercase tracking-[0.22em]', tone)}>
              {String(t.category)} · {ref}
            </p>
            <TIcon size={16} weight="duotone" className={tone} />
          </div>
          <h3 className="mt-2.5 heading-display uppercase text-[17px] leading-tight text-ink">
            {t.name}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-2 flex-1">{t.description}</p>

          <div className="mt-4 pt-3 border-t-2 border-dashed border-line flex items-center justify-between">
            <span className="font-mono text-[10px] text-ink-3 tabular-nums">
              {t.clauses?.length ?? 0} clauses · {t.fields?.length ?? 0} blanks
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-ink group-hover:text-mint transition-colors">
              Use it <ArrowUpRight size={12} weight="bold" />
            </span>
          </div>
        </div>

        {featured && (
          <span className="absolute -top-2 left-4 z-10 font-mono text-[8px] font-bold uppercase tracking-[0.2em] bg-mint text-paper px-2 py-0.5 rotate-[-2deg] shadow-[2px_2px_0_var(--shadow-ink)]">
            Popular
          </span>
        )}
      </Link>
    </motion.div>
  );
}
