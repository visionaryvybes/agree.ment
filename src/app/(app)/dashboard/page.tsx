'use client';

import { useContracts } from '@/store/contracts';
import Link from 'next/link';
import {
  ArrowUpRight, PenNib, Warning, HourglassMedium, Plus,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import type { Contract, ContractStatus } from '@/lib/types';

// ── Status ink ────────────────────────────────────────────────────────────

const STATUS: Record<ContractStatus, { label: string; cls: string }> = {
  draft:             { label: 'Draft',     cls: 'text-ink-3 border-line-strong' },
  pending_signature: { label: 'Unsigned',  cls: 'text-blue border-blue/40' },
  active:            { label: 'In force',  cls: 'text-mint border-mint/40' },
  completed:         { label: 'Settled',   cls: 'text-ink-3 border-line-strong' },
  disputed:          { label: 'Disputed',  cls: 'text-rose border-rose/40' },
  expired:           { label: 'Expired',   cls: 'text-amber border-amber/40' },
};

function Stamp({ status }: { status: ContractStatus }) {
  const s = STATUS[status] ?? STATUS.draft;
  return (
    <span className={cn(
      'inline-block font-mono text-[9px] uppercase tracking-[0.18em] border rounded-[3px] px-1.5 py-[3px] rotate-[-2deg]',
      s.cls
    )}>
      {s.label}
    </span>
  );
}

function money(n: number | undefined, currency = 'USD') {
  if (!n) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

function partiesLine(c: Contract) {
  const names = c.parties?.map(p => p.name.split(' ')[0]).filter(Boolean) ?? [];
  return names.length >= 2 ? `${names[0]} ⇌ ${names[1]}` : names[0] || '—';
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { contracts, fetchContracts } = useContracts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchContracts();
  }, [fetchContracts]);

  if (!mounted) return null;

  const open = contracts.filter(c => ['active', 'pending_signature', 'disputed'].includes(c.status));
  const unsigned = contracts.filter(c => c.status === 'pending_signature');
  const disputed = contracts.filter(c => c.status === 'disputed');
  const overdue = contracts.flatMap(c =>
    (c.paymentSchedule ?? [])
      .filter(p => p.status === 'overdue')
      .map(p => ({ contract: c, payment: p }))
  );
  const atStake = open.reduce((sum, c) => sum + (c.totalAmount ?? 0), 0);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const attention = [
    ...unsigned.map(c => ({
      key: `sign-${c.id}`,
      icon: PenNib,
      tone: 'text-blue',
      text: `“${c.title}” is waiting for a signature.`,
      href: `/contracts/${c.id}`,
      action: 'Nudge or sign',
    })),
    ...overdue.map(({ contract, payment }) => ({
      key: `pay-${contract.id}-${payment.id}`,
      icon: HourglassMedium,
      tone: 'text-amber',
      text: `${money(payment.amount, payment.currency)} overdue on “${contract.title}.”`,
      href: `/contracts/${contract.id}`,
      action: 'Review payment',
    })),
    ...disputed.map(c => ({
      key: `disp-${c.id}`,
      icon: Warning,
      tone: 'text-rose',
      text: `“${c.title}” is in dispute.`,
      href: `/contracts/${c.id}`,
      action: 'Open resolution',
    })),
  ];

  const recent = [...contracts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 7);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Masthead ── */}
      <header className="pb-8 border-b-2 border-ink/80">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">{today}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h1 className="heading-display text-5xl sm:text-6xl">The Ledger.</h1>
          <p className="font-display italic text-lg text-ink-2 pb-1.5">
            {open.length} open {open.length === 1 ? 'file' : 'files'} · {money(atStake)} on paper
            {unsigned.length > 0 && <> · <span className="text-blue not-italic font-sans text-sm font-medium">{unsigned.length} awaiting signature</span></>}
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12 pt-10">

        {/* ── The ledger itself ── */}
        <section>
          <div className="flex items-baseline justify-between pb-3 border-b border-line-strong">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">Recent entries</h2>
            <Link href="/contracts" className="text-xs text-ink-2 hover:text-mint transition-colors inline-flex items-center gap-1">
              Full registry <ArrowUpRight size={12} weight="bold" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="py-24 text-center">
              <p className="heading-display text-3xl text-ink-3">The ledger is empty.</p>
              <p className="mt-3 text-sm text-ink-2">Your first agreement will be entry № 001.</p>
              <Link href="/contracts/new" className="mt-8 inline-flex items-center gap-2 btn-vibrant btn-vibrant-emerald">
                <Plus size={15} weight="bold" /> Open the first file
              </Link>
            </div>
          ) : (
            <ol>
              {recent.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={`/contracts/${c.id}`}
                    className="group grid grid-cols-[44px_1fr_auto] sm:grid-cols-[44px_1fr_120px_100px] gap-x-4 items-baseline py-4 border-b border-line hover:bg-card transition-colors px-2 -mx-2"
                  >
                    <span className="font-mono text-[11px] text-ink-3 tabular-nums">
                      № {String(contracts.length - contracts.indexOf(c)).padStart(3, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-lg leading-snug text-ink group-hover:italic truncate">
                        {c.title}
                      </span>
                      <span className="block mt-0.5 text-xs text-ink-3">{partiesLine(c)}</span>
                    </span>
                    <span className="hidden sm:block font-mono text-sm text-ink-2 text-right tabular-nums">
                      {money(c.totalAmount, c.currency)}
                    </span>
                    <span className="justify-self-end"><Stamp status={c.status} /></span>
                  </Link>
                </motion.li>
              ))}
            </ol>
          )}
        </section>

        {/* ── Marginalia ── */}
        <aside className="space-y-10">

          {/* Needs attention */}
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3 pb-3 border-b border-line-strong">
              Needs your attention
            </h2>
            {attention.length === 0 ? (
              <p className="pt-5 font-display italic text-ink-3">
                Nothing. Every promise is keeping itself today.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {attention.slice(0, 5).map(item => (
                  <li key={item.key}>
                    <Link href={item.href} className="group flex gap-3 py-4">
                      <item.icon size={18} weight="duotone" className={cn('flex-shrink-0 mt-0.5', item.tone)} />
                      <span className="min-w-0">
                        <span className="block text-[13px] leading-snug text-ink-2">{item.text}</span>
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-ink group-hover:text-mint transition-colors">
                          {item.action} <ArrowUpRight size={11} weight="bold" />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Standing figures */}
          <div className="border border-line rounded-lg bg-card p-6 shadow-[var(--shadow-sheet)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">Total at stake</p>
            <p className="heading-display text-[44px] mt-2 leading-none">{money(atStake)}</p>
            <dl className="mt-6 space-y-2 border-t border-dashed border-line pt-4">
              {(['active', 'pending_signature', 'disputed', 'completed'] as ContractStatus[]).map(s => {
                const n = contracts.filter(c => c.status === s).length;
                if (!n) return null;
                return (
                  <div key={s} className="flex items-baseline justify-between text-sm">
                    <dt className="text-ink-2">{STATUS[s].label}</dt>
                    <dd className="font-mono tabular-nums text-ink">{n}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
