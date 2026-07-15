'use client';

import { useContracts } from '@/store/contracts';
import { MagnifyingGlass, Plus, ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Contract, ContractStatus } from '@/lib/types';

type Filter = 'all' | 'active' | 'pending_signature' | 'disputed' | 'completed' | 'draft';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',               label: 'Everything' },
  { id: 'active',            label: 'In force' },
  { id: 'pending_signature', label: 'Unsigned' },
  { id: 'draft',             label: 'Drafts' },
  { id: 'disputed',          label: 'Disputed' },
  { id: 'completed',         label: 'Settled' },
];

const STATUS: Record<ContractStatus, { label: string; cls: string }> = {
  draft:             { label: 'Draft',    cls: 'text-ink-3 border-line-strong' },
  pending_signature: { label: 'Unsigned', cls: 'text-blue border-blue/40' },
  active:            { label: 'In force', cls: 'text-mint border-mint/40' },
  completed:         { label: 'Settled',  cls: 'text-ink-3 border-line-strong' },
  disputed:          { label: 'Disputed', cls: 'text-rose border-rose/40' },
  expired:           { label: 'Expired',  cls: 'text-amber border-amber/40' },
};

function money(n: number | undefined, currency = 'USD') {
  if (!n) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

function partiesLine(c: Contract) {
  const names = c.parties?.map(p => p.name.split(' ')[0]).filter(Boolean) ?? [];
  return names.length >= 2 ? `${names[0]} ⇌ ${names[1]}` : names[0] || '—';
}

export default function ContractsPage() {
  const { contracts = [] } = useContracts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const filtered = contracts.filter(c => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.parties?.some(p => p.name.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'all' ? true : c.status === filter;
    return matchSearch && matchFilter;
  });

  const count = (f: Filter) =>
    f === 'all' ? contracts.length : contracts.filter(c => c.status === f).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pb-24">

      {/* ── Masthead ── */}
      <header className="pb-8 border-b-2 border-ink/80 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">Registry</p>
          <h1 className="heading-display text-5xl sm:text-6xl mt-3">Files.</h1>
        </div>
        <Link href="/contracts/new" className="btn-vibrant btn-vibrant-emerald mb-1">
          <Plus size={15} weight="bold" /> New agreement
        </Link>
      </header>

      {/* ── Index tabs + search ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-7 pb-5">
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {FILTERS.map(f => {
            const n = count(f.id);
            if (f.id !== 'all' && n === 0) return null;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'group pb-1 text-sm border-b-2 transition-colors',
                  filter === f.id
                    ? 'border-mint text-ink font-medium'
                    : 'border-transparent text-ink-3 hover:text-ink'
                )}
              >
                {f.label}
                <span className="ml-1.5 font-mono text-[10px] text-ink-3 tabular-nums">{n}</span>
              </button>
            );
          })}
        </nav>
        <label className="relative">
          <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search titles or people…"
            className="pl-9 pr-4 py-2 w-64 bg-card border border-line rounded-[3px] text-sm text-ink placeholder:text-ink-3/70 focus:outline-none focus:border-mint/50 transition-colors"
          />
        </label>
      </div>

      {/* ── The registry ── */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center border-t border-line">
          <p className="heading-display text-3xl text-ink-3">
            {search ? 'No file answers to that name.' : 'Nothing filed here yet.'}
          </p>
          {!search && (
            <Link href="/contracts/new" className="mt-6 inline-flex items-center gap-1.5 text-sm text-mint hover:underline">
              Draft the first one <ArrowUpRight size={13} weight="bold" />
            </Link>
          )}
        </div>
      ) : (
        <div>
          {/* Column rule */}
          <div className="hidden sm:grid grid-cols-[52px_1fr_140px_110px_90px] gap-x-4 pb-2 border-b border-line-strong font-mono text-[9px] uppercase tracking-[0.25em] text-ink-3">
            <span>№</span><span>Agreement</span><span className="text-right">Value</span><span>Filed</span><span className="text-right">Status</span>
          </div>
          <ol>
            {filtered.map((c, i) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.35 }}
              >
                <Link
                  href={`/contracts/${c.id}`}
                  className="group grid grid-cols-[52px_1fr_auto] sm:grid-cols-[52px_1fr_140px_110px_90px] gap-x-4 items-baseline py-4 border-b border-line hover:bg-card transition-colors px-2 -mx-2"
                >
                  <span className="font-mono text-[11px] text-ink-3 tabular-nums">
                    {String(contracts.length - contracts.indexOf(c)).padStart(3, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg leading-snug text-ink truncate">{c.title}</span>
                    <span className="block mt-0.5 text-xs text-ink-3">
                      {partiesLine(c)} · <span className="capitalize">{c.category}</span>
                    </span>
                  </span>
                  <span className="hidden sm:block font-mono text-sm text-ink-2 text-right tabular-nums">
                    {money(c.totalAmount, c.currency)}
                  </span>
                  <span className="hidden sm:block text-xs text-ink-3">
                    {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </span>
                  <span className="justify-self-end">
                    <span className={cn(
                      'inline-block font-mono text-[9px] uppercase tracking-[0.18em] border rounded-[3px] px-1.5 py-[3px] rotate-[-2deg]',
                      (STATUS[c.status] ?? STATUS.draft).cls
                    )}>
                      {(STATUS[c.status] ?? STATUS.draft).label}
                    </span>
                  </span>
                </Link>
              </motion.li>
            ))}
          </ol>
          <p className="pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-3 text-right">
            {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
      )}
    </motion.div>
  );
}
