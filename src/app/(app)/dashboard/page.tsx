'use client';

import { useContracts } from '@/store/contracts';
import Link from 'next/link';
import {
  ArrowUpRight, PenNib, Warning, HourglassMedium, Plus,
  ChatCircleText, Stack, FolderOpen, CurrencyCircleDollar,
  Signature, CalendarBlank,
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

function daysUntil(date: string | Date) {
  const d = Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
  if (d < 0) return `${Math.abs(d)}d overdue`;
  if (d === 0) return 'today';
  return `in ${d}d`;
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
  const upcoming = contracts.flatMap(c =>
    (c.paymentSchedule ?? [])
      .filter(p => p.status === 'pending' && p.dueDate)
      .map(p => ({ contract: c, payment: p }))
  ).sort((a, b) => new Date(a.payment.dueDate!).getTime() - new Date(b.payment.dueDate!).getTime())
   .slice(0, 4);
  const atStake = open.reduce((sum, c) => sum + (c.totalAmount ?? 0), 0);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const attention = [
    ...unsigned.map(c => ({
      key: `sign-${c.id}`, icon: PenNib, tone: 'text-blue',
      text: `“${c.title}” is waiting for a signature.`,
      href: `/contracts/${c.id}`, action: 'Nudge or sign',
    })),
    ...overdue.map(({ contract, payment }) => ({
      key: `pay-${contract.id}-${payment.id}`, icon: HourglassMedium, tone: 'text-amber',
      text: `${money(payment.amount, payment.currency)} overdue on “${contract.title}.”`,
      href: `/contracts/${contract.id}`, action: 'Review payment',
    })),
    ...disputed.map(c => ({
      key: `disp-${c.id}`, icon: Warning, tone: 'text-rose',
      text: `“${c.title}” is in dispute.`,
      href: `/contracts/${c.id}`, action: 'Open resolution',
    })),
  ];

  const recent = [...contracts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 7);

  const figures = [
    { icon: FolderOpen,           label: 'Open files',      value: String(open.length),           tone: 'text-mint' },
    { icon: CurrencyCircleDollar, label: 'On paper',        value: money(atStake),                tone: 'text-ink' },
    { icon: Signature,            label: 'Await signature', value: String(unsigned.length),       tone: 'text-blue' },
    { icon: HourglassMedium,      label: 'Overdue',         value: String(overdue.length),        tone: overdue.length ? 'text-amber' : 'text-ink-3' },
  ];

  const quick = [
    { icon: Plus,           title: 'New agreement',   desc: 'Describe the deal in plain words', href: '/contracts/new', primary: true },
    { icon: ChatCircleText, title: 'Paste a chat',    desc: 'Turn a conversation into terms',   href: '/contracts/new?mode=chat', primary: false },
    { icon: Stack,          title: 'Use a template', desc: 'Start from a ready-made form',      href: '/templates', primary: false },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

      {/* ── Masthead ── */}
      <header className="pb-8 border-b-2 border-line-strong">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">{today}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h1 className="heading-display text-5xl sm:text-6xl">Your agreements.</h1>
          <p className="font-display italic text-lg text-ink-2 pb-1.5">
            {open.length} open {open.length === 1 ? 'file' : 'files'} · {money(atStake)} on paper
          </p>
        </div>
      </header>

      {/* ── Standing figures: four dockets ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-x border-b border-line-strong bg-card divide-x divide-y lg:divide-y-0 divide-line-strong">
        {figures.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className="p-5"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink-3">{f.label}</p>
              <f.icon size={15} weight="duotone" className={f.tone} />
            </div>
            <p className={cn('heading-display text-3xl mt-2 tabular-nums', f.tone)}>{f.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Quick actions: the counter window ── */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {quick.map((q, i) => (
          <motion.div
            key={q.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.35 }}
          >
            <Link
              href={q.href}
              className={cn(
                'group flex items-start gap-4 p-5 border-[1.5px] border-line-strong shadow-[var(--shadow-sheet)]',
                'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]',
                'active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
                'transition-[transform,box-shadow] duration-150',
                q.primary ? 'bg-mint text-paper' : 'bg-card text-ink'
              )}
            >
              <span className={cn(
                'w-9 h-9 flex-shrink-0 flex items-center justify-center border-[1.5px] rotate-[-2deg]',
                q.primary ? 'border-paper/60' : 'border-line-strong text-mint'
              )}>
                <q.icon size={18} weight="bold" />
              </span>
              <span>
                <span className="block font-bold uppercase tracking-wide text-sm">{q.title}</span>
                <span className={cn('block mt-0.5 text-xs', q.primary ? 'text-paper/80' : 'text-ink-3')}>
                  {q.desc}
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12 pt-12">

        {/* ── The ledger itself ── */}
        <section>
          <div className="flex items-baseline justify-between pb-3 border-b border-line-strong">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">Recent agreements</h2>
            <Link href="/contracts" className="text-xs text-ink-2 hover:text-mint transition-colors inline-flex items-center gap-1">
              View all <ArrowUpRight size={12} weight="bold" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="py-24 text-center">
              <p className="heading-display text-3xl text-ink-3">Nothing here yet.</p>
              <p className="mt-3 text-sm text-ink-2">Your first agreement will be № 001.</p>
              <Link href="/contracts/new" className="mt-8 inline-flex items-center gap-2 btn-vibrant btn-vibrant-emerald">
                <Plus size={15} weight="bold" /> Create your first agreement
              </Link>
            </div>
          ) : (
            <ol>
              {recent.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={`/contracts/${c.id}`}
                    className="group grid grid-cols-[44px_1fr_auto] sm:grid-cols-[44px_1fr_120px_100px] gap-x-4 items-baseline py-4 border-b border-line hover:bg-card transition-colors px-2 -mx-2"
                  >
                    <span className="font-mono text-[11px] text-ink-3 tabular-nums">
                      № {String(contracts.length - contracts.indexOf(c)).padStart(3, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-lg leading-snug text-ink truncate">
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

          {/* Coming due */}
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3 pb-3 border-b border-line-strong">
              Coming due
            </h2>
            {upcoming.length === 0 ? (
              <p className="pt-5 text-sm text-ink-3">
                No payments scheduled. When an agreement has milestones, they line up here.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {upcoming.map(({ contract, payment }) => (
                  <li key={`${contract.id}-${payment.id}`}>
                    <Link href={`/contracts/${contract.id}`} className="group flex items-center gap-3 py-3.5">
                      <CalendarBlank size={16} weight="duotone" className="flex-shrink-0 text-ink-3" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] leading-snug text-ink-2 truncate">{contract.title}</span>
                        <span className="block mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                          {daysUntil(payment.dueDate!)}
                        </span>
                      </span>
                      <span className="font-mono text-sm tabular-nums text-ink group-hover:text-mint transition-colors">
                        {money(payment.amount, payment.currency)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Standing figures */}
          <div className="border-[1.5px] border-line-strong bg-card p-6 shadow-[var(--shadow-sheet)]">
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
