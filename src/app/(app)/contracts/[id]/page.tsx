'use client';

import { useParams, useRouter } from 'next/navigation';
import { useContracts } from '@/store/contracts';
import { useState } from 'react';
import {
  ArrowLeft,
  DownloadSimple,
  ShareNetwork,
  Warning,
  CheckCircle,
  Clock,
  CurrencyDollar,
  Scales,
  FileText,
  Users,
  CaretRight,
  ShieldCheck,
  FileX,
  Check,
  Sparkle,
  Gavel,
  Envelope,
  Phone,
  MapPin,
  CalendarBlank,
  ArrowRight,
  SealCheck,
  Lightning,
  Copy,
} from "@phosphor-icons/react";
import Link from 'next/link';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/empty-state';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Escalation config ──────────────────────────────────── */
const ESC_CONFIG = {
  friendly_reminder: {
    label: 'Friendly Reminder', color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-400',
    text: 'text-amber-700', icon: <Envelope size={18} weight="bold" />,
    desc: 'A polite message reminding the party of their obligation.',
    step: 1,
  },
  formal_notice: {
    label: 'Formal Notice', color: '#F97316', bg: 'bg-orange-50', border: 'border-orange-400',
    text: 'text-orange-700', icon: <FileText size={18} weight="bold" />,
    desc: 'An official written notice citing the specific clause breached.',
    step: 2,
  },
  demand_letter: {
    label: 'Demand Letter', color: '#EF4444', bg: 'bg-red-50', border: 'border-red-400',
    text: 'text-red-700', icon: <Warning size={18} weight="bold" />,
    desc: 'A legal demand letter requesting immediate action or payment.',
    step: 3,
  },
  legal_action: {
    label: 'Legal Action', color: '#1A1A18', bg: 'bg-neutral-900', border: 'border-neutral-900',
    text: 'text-white', icon: <Gavel size={18} weight="bold" />,
    desc: 'Step-by-step guide to filing in small claims court or arbitration.',
    step: 4,
  },
} as const;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  active: { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-400', dot: 'bg-emerald-500' },
  pending_signature: { label: 'Pending Signature', color: 'text-amber-700', bg: 'bg-amber-100 border-amber-400', dot: 'bg-amber-500' },
  completed: { label: 'Completed', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-400', dot: 'bg-blue-500' },
  disputed: { label: 'Disputed', color: 'text-red-700', bg: 'bg-red-100 border-red-400', dot: 'bg-red-500' },
  draft: { label: 'Draft', color: 'text-slate-600', bg: 'bg-slate-100 border-slate-300', dot: 'bg-slate-400' },
  expired: { label: 'Expired', color: 'text-slate-600', bg: 'bg-slate-100 border-slate-300', dot: 'bg-slate-400' },
};

/* ─── SVG Radial Progress ─────────────────────────────────── */
function RadialProgress({ pct, size = 120, stroke = 10 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#1447E6" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="square"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getContract, updatePaymentStatus, triggerEscalation } = useContracts();
  const contract = getContract(params.id as string);
  const [openClause, setOpenClause] = useState<string | null>(null);

  if (!contract) {
    return (
      <div className="p-12">
        <EmptyState
          icon={<FileX size={48} weight="duotone" className="text-[var(--text-3)]" />}
          title="Contract not found"
          description="This contract does not exist or has been removed."
          actionLabel="Back to Portfolio"
          actionHref="/contracts"
        />
      </div>
    );
  }

  const totalPaid = contract.paymentSchedule
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + (p.paidAmount || p.amount), 0);
  const totalRemaining = (contract.totalAmount || 0) - totalPaid;
  const progressPct = contract.totalAmount ? Math.min((totalPaid / contract.totalAmount) * 100, 100) : 0;
  const paidCount = contract.paymentSchedule.filter(p => p.status === 'paid').length;
  const overdueCount = contract.paymentSchedule.filter(p => p.status === 'overdue').length;
  const st = STATUS_CONFIG[contract.status] || STATUS_CONFIG.draft;
  const createdDate = new Date(contract.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const highestEscLevel = contract.escalation.length > 0
    ? contract.escalation[contract.escalation.length - 1].level : null;

  const handleMarkPaid = (paymentId: string, amount: number) => {
    updatePaymentStatus(contract.id, paymentId, 'paid', amount);
    toast({ title: 'Payment marked paid', description: `$${amount.toLocaleString()} recorded.` });
  };

  const handleEscalation = (key: keyof typeof ESC_CONFIG, label: string) => {
    triggerEscalation(contract.id, key, `${label} triggered for contract "${contract.title}".`);
    toast({ title: `${label} activated`, description: 'Enforcement step has been initiated.' });
  };

  return (
    <div className="min-h-full bg-[var(--bg)]">

      {/* ─── TOP HERO STRIP ──────────────────────────────────────── */}
      <div className="border-b-4 border-[var(--text-1)] bg-white">
        <div className="px-10 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-3)] mb-6">
            <Link href="/dashboard" className="hover:text-[var(--text-1)] transition-colors">Dashboard</Link>
            <CaretRight size={10} weight="bold" />
            <Link href="/contracts" className="hover:text-[var(--text-1)] transition-colors">Contracts</Link>
            <CaretRight size={10} weight="bold" />
            <span className="text-[var(--text-1)]">{contract.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            {/* Left: identity */}
            <div className="flex items-start gap-6">
              <button
                onClick={() => router.back()}
                className="mt-1 w-10 h-10 border-4 border-[var(--text-1)] flex items-center justify-center hover:bg-[var(--text-1)] hover:text-white transition-all shadow-[3px_3px_0_0_black] flex-shrink-0"
              >
                <ArrowLeft size={18} weight="bold" />
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-4 mb-1">
                  <h1 className="heading-section text-4xl uppercase font-black leading-none">{contract.title}</h1>
                  <span className={cn('inline-flex items-center gap-2 px-4 py-1.5 border-2 text-[10px] font-black uppercase tracking-widest', st.bg, st.color)}>
                    <span className={cn('w-2 h-2 rounded-none', st.dot)} style={{ display: 'inline-block' }} />
                    {st.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-6 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] flex items-center gap-2">
                    <FileText size={12} weight="bold" />{contract.category}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] flex items-center gap-2">
                    <MapPin size={12} weight="bold" />{contract.jurisdiction}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] flex items-center gap-2">
                    <CalendarBlank size={12} weight="bold" />Created {createdDate}
                  </span>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(contract.id); toast({ title: 'ID copied' }); }}
                    className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] flex items-center gap-1.5 hover:text-[var(--text-1)] transition-colors"
                  >
                    <Copy size={12} weight="bold" />ID: {contract.id.slice(0, 8).toUpperCase()}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-4 lg:flex-shrink-0">
              <button className="brutalist-button px-6 py-3 text-[10px] bg-white text-[var(--text-1)] border-4 shadow-[4px_4px_0_0_black] flex items-center gap-2">
                <DownloadSimple size={18} weight="bold" />Export PDF
              </button>
              <button className="brutalist-button px-6 py-3 text-[10px] bg-[var(--text-1)] text-white border-4 shadow-[4px_4px_0_0_black] flex items-center gap-2">
                <ShareNetwork size={18} weight="bold" />Share
              </button>
            </div>
          </div>
        </div>

        {/* ─── BENTO STAT STRIP ──────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t-4 border-[var(--text-1)] divide-x-4 divide-[var(--text-1)]">
          {[
            {
              label: 'Total Value', value: contract.totalAmount ? `$${contract.totalAmount.toLocaleString()}` : '—',
              sub: contract.currency, icon: <CurrencyDollar size={20} weight="bold" />, accent: '#1447E6',
            },
            {
              label: 'Amount Paid', value: totalPaid > 0 ? `$${totalPaid.toLocaleString()}` : '$0',
              sub: `${paidCount} of ${contract.paymentSchedule.length} payments`, icon: <CheckCircle size={20} weight="bold" />, accent: '#10B981',
            },
            {
              label: 'Remaining', value: totalRemaining > 0 ? `$${totalRemaining.toLocaleString()}` : '$0',
              sub: overdueCount > 0 ? `${overdueCount} overdue` : 'On track', icon: <Clock size={20} weight="bold" />,
              accent: overdueCount > 0 ? '#EF4444' : '#F59E0B',
            },
            {
              label: 'Parties', value: contract.parties.length.toString(),
              sub: contract.parties.every(p => p.signedAt) ? 'All signed' : 'Pending signatures',
              icon: <Users size={20} weight="bold" />, accent: '#8B5CF6',
            },
          ].map((s, i) => (
            <div key={i} className="px-8 py-6 bg-white group hover:bg-[var(--bg)] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-3)]">{s.label}</span>
                <div style={{ color: s.accent }}>{s.icon}</div>
              </div>
              <div className="font-serif text-3xl text-[var(--text-1)] leading-none mb-1">{s.value}</div>
              <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: s.accent }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MAIN CONTENT ────────────────────────────────────────── */}
      <div className="p-10 grid lg:grid-cols-5 gap-10">

        {/* LEFT COLUMN (3/5) */}
        <div className="lg:col-span-3 space-y-10">

          {/* ── PARTIES ─────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[var(--blue)]" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-1)]">Parties</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {contract.parties.map((party, i) => (
                <motion.div
                  key={party.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="brutalist-card bg-white border-4 p-8 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[8px_8px_0_0_black] transition-all"
                >
                  {/* Role chip */}
                  <div className={cn(
                    'absolute top-0 right-0 px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.25em]',
                    party.role === 'creator' ? 'bg-[var(--text-1)] text-white' : 'bg-[var(--blue)] text-white'
                  )}>
                    {party.role === 'creator' ? 'Creator' : 'Counterparty'}
                  </div>

                  <div className="flex items-center gap-5 mb-6 mt-2">
                    <div className="w-14 h-14 bg-[var(--text-1)] text-white flex items-center justify-center font-black text-2xl border-4 border-[var(--text-1)] shadow-[3px_3px_0_0_black]">
                      {party.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-[var(--text-1)] uppercase tracking-tight leading-none mb-1">
                        {party.name}
                      </h3>
                      {party.signedAt ? (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <SealCheck size={14} weight="fill" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Signed {new Date(party.signedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Clock size={14} weight="bold" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Awaiting signature</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {party.email && (
                    <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--text-2)] mb-2">
                      <Envelope size={12} weight="bold" className="text-[var(--text-3)]" />
                      {party.email}
                    </div>
                  )}
                  {party.phone && (
                    <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--text-2)]">
                      <Phone size={12} weight="bold" className="text-[var(--text-3)]" />
                      {party.phone}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── CONTRACT CLAUSES ─────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[var(--blue)]" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-1)]">Contract Clauses</h2>
              <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-[var(--text-3)]">
                {contract.clauses.length} clauses
              </span>
            </div>
            <div className="brutalist-card bg-white border-4 overflow-hidden">
              {contract.clauses.map((clause, i) => (
                <div key={clause.id} className={cn('border-b-2 border-[var(--text-1)] last:border-0', openClause === clause.id && 'bg-[var(--bg)]')}>
                  <button
                    onClick={() => setOpenClause(openClause === clause.id ? null : clause.id)}
                    className="w-full flex items-center gap-6 px-8 py-6 text-left group hover:bg-[var(--bg)] transition-colors"
                  >
                    <span className="text-[10px] font-black text-[var(--blue)] tabular-nums w-6 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-black text-sm uppercase tracking-tight text-[var(--text-1)]">
                      {clause.title}
                    </span>
                    {clause.isRequired && (
                      <span className="text-[8px] font-black uppercase tracking-widest bg-[var(--text-1)] text-white px-2.5 py-1">
                        Required
                      </span>
                    )}
                    <CaretRight
                      size={16} weight="bold"
                      className={cn('text-[var(--text-3)] transition-transform flex-shrink-0', openClause === clause.id && 'rotate-90')}
                    />
                  </button>
                  <AnimatePresence>
                    {openClause === clause.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-8 pt-2 border-t-2 border-dashed border-[var(--text-1)]/20">
                          <p className="text-sm font-bold text-[var(--text-2)] leading-relaxed border-l-4 border-[var(--blue)] pl-6">
                            {clause.content}
                          </p>
                          {clause.legalBasis && (
                            <div className="mt-4 flex items-start gap-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-3)]">
                              <Scales size={14} weight="bold" className="mt-0.5 flex-shrink-0" />
                              {clause.legalBasis}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>

          {/* ── GOVERNING LAW ───────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[var(--blue)]" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-1)]">Governing Law</h2>
            </div>
            <div className="brutalist-card bg-[var(--text-1)] text-white border-4 p-8 flex items-center justify-between group hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#1447E6] transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[var(--blue)] border-4 border-white/20 flex items-center justify-center flex-shrink-0">
                  <Scales size={28} weight="fill" />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Governing Framework</div>
                  <div className="font-black text-xl uppercase tracking-tight">{contract.governingLaw}</div>
                  <div className="text-[10px] font-bold text-white/60 mt-1 flex items-center gap-2">
                    <MapPin size={12} weight="bold" />{contract.jurisdiction}
                  </div>
                </div>
              </div>
              <ShieldCheck size={48} weight="fill" className="opacity-10 flex-shrink-0" />
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (2/5) */}
        <div className="lg:col-span-2 space-y-10">

          {/* ── PAYMENT PROGRESS ─────────────────────────────────── */}
          {contract.paymentSchedule.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-[var(--blue)]" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-1)]">Payments</h2>
              </div>

              {/* Ring + stats card */}
              <div className="brutalist-card bg-white border-4 p-8 mb-6">
                <div className="flex items-center gap-8">
                  {/* Radial ring */}
                  <div className="relative flex-shrink-0">
                    <RadialProgress pct={progressPct} size={110} stroke={10} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-serif text-2xl text-[var(--text-1)] leading-none">
                        {progressPct.toFixed(0)}%
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-3)]">Progress</span>
                    </div>
                  </div>
                  {/* Breakdown */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Paid</span>
                        <span className="font-black text-lg text-[var(--text-1)] tabular-nums">${totalPaid.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-[var(--bg)] border-2 border-[var(--text-1)]">
                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-3)]">Remaining</span>
                        <span className="font-black text-lg text-[var(--text-1)] tabular-nums">${totalRemaining.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-[var(--bg)] border-2 border-[var(--text-1)]">
                        <div className="h-full bg-slate-300 transition-all duration-1000" style={{ width: `${100 - progressPct}%` }} />
                      </div>
                    </div>
                    {overdueCount > 0 && (
                      <div className="flex items-center gap-2 bg-red-50 border-2 border-red-400 px-4 py-2">
                        <Warning size={14} weight="fill" className="text-red-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-red-600">{overdueCount} overdue payment{overdueCount > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment timeline */}
              <div className="space-y-3">
                {contract.paymentSchedule.map((payment, i) => {
                  const isPaid = payment.status === 'paid';
                  const isOverdue = payment.status === 'overdue';
                  const dueDate = new Date(payment.dueDate);
                  return (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={cn(
                        'flex items-center gap-5 p-5 border-4 transition-all',
                        isPaid ? 'bg-emerald-50 border-emerald-400' :
                          isOverdue ? 'bg-red-50 border-red-400 animate-[pulse_2s_ease-in-out_infinite]' :
                            'bg-white border-[var(--text-1)] shadow-[4px_4px_0_0_black]'
                      )}
                    >
                      {/* Index bubble */}
                      <div className={cn(
                        'w-9 h-9 border-4 flex items-center justify-center font-black text-xs flex-shrink-0',
                        isPaid ? 'bg-emerald-500 border-emerald-700 text-white' :
                          isOverdue ? 'bg-red-500 border-red-700 text-white' :
                            'bg-[var(--text-1)] border-[var(--text-1)] text-white'
                      )}>
                        {isPaid ? <Check size={14} weight="bold" /> : String(i + 1)}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="font-black text-lg text-[var(--text-1)] tabular-nums leading-none">
                          ${payment.amount.toLocaleString()}
                        </div>
                        <div className={cn('text-[9px] font-black uppercase tracking-widest mt-1',
                          isOverdue ? 'text-red-600' : 'text-[var(--text-3)]'
                        )}>
                          Due: {dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>

                      {/* Status / action */}
                      {isPaid ? (
                        <div className="bg-emerald-500 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border-2 border-emerald-700 flex items-center gap-1.5">
                          <Check size={10} weight="bold" />Paid
                        </div>
                      ) : (
                        <button
                          onClick={() => handleMarkPaid(payment.id, payment.amount)}
                          className={cn(
                            'brutalist-button px-4 py-2 text-[9px] flex items-center gap-1.5 border-2',
                            isOverdue ? 'bg-red-600 text-white' : 'bg-[var(--text-1)] text-white'
                          )}
                        >
                          Mark Paid
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── SMART ESCALATION ─────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-red-500" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-1)]">Smart Escalation</h2>
              <div className="ml-auto flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-600">
                <Lightning size={12} weight="fill" />AI-Guided
              </div>
            </div>

            <div className="brutalist-card bg-white border-4 overflow-hidden">
              {/* Header */}
              <div className="px-8 py-4 bg-[var(--text-1)] text-white border-b-4 border-[var(--text-1)]">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/60">
                  Automated resolution sequence — step {contract.escalation.length} of 4 triggered
                </p>
              </div>

              {/* Steps */}
              <div className="divide-y-2 divide-[var(--text-1)]/10">
                {(Object.entries(ESC_CONFIG) as [keyof typeof ESC_CONFIG, typeof ESC_CONFIG[keyof typeof ESC_CONFIG]][]).map(([key, cfg]) => {
                  const triggered = contract.escalation.some(e => e.level === key);
                  const isActive = !triggered;
                  return (
                    <Dialog key={key}>
                      <DialogTrigger asChild>
                        <button
                          disabled={triggered}
                          className={cn(
                            'w-full text-left flex items-start gap-5 px-8 py-6 transition-all group',
                            triggered
                              ? 'opacity-50 cursor-default'
                              : 'hover:bg-[var(--bg)] cursor-pointer'
                          )}
                        >
                          {/* Step indicator */}
                          <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                            <div className={cn(
                              'w-8 h-8 border-4 flex items-center justify-center text-[10px] font-black flex-shrink-0',
                              triggered
                                ? 'bg-[var(--text-1)] border-[var(--text-1)] text-white'
                                : 'bg-white border-[var(--text-1)] text-[var(--text-1)] group-hover:bg-[var(--text-1)] group-hover:text-white'
                            )}>
                              {triggered ? <Check size={14} weight="bold" /> : cfg.step}
                            </div>
                            {cfg.step < 4 && <div className="w-px flex-1 bg-[var(--text-1)]/10 mt-2 min-h-[20px]" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1.5">
                              <div style={{ color: cfg.color }}>{cfg.icon}</div>
                              <span className={cn(
                                'font-black text-sm uppercase tracking-tight',
                                triggered ? 'text-[var(--text-3)] line-through' : 'text-[var(--text-1)]'
                              )}>{cfg.label}</span>
                              {triggered && (
                                <span className="text-[8px] font-black uppercase tracking-widest bg-[var(--text-1)] text-white px-2 py-0.5">Done</span>
                              )}
                            </div>
                            <p className="text-[10px] font-bold text-[var(--text-3)] leading-relaxed">{cfg.desc}</p>
                          </div>

                          {!triggered && (
                            <ArrowRight size={16} weight="bold" className="text-[var(--text-3)] mt-1 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                          )}
                        </button>
                      </DialogTrigger>

                      <DialogContent className="bg-white border-8 border-[var(--text-1)] shadow-[16px_16px_0_0_black] max-w-lg p-10">
                        <DialogHeader className="space-y-4">
                          <div className={cn('inline-flex items-center gap-3 px-5 py-2.5 self-start border-2', cfg.bg, cfg.border)}>
                            <div style={{ color: cfg.color }}>{cfg.icon}</div>
                            <span className={cn('text-[10px] font-black uppercase tracking-widest', cfg.text)}>{cfg.label}</span>
                          </div>
                          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-[var(--text-1)]">
                            Trigger enforcement step?
                          </DialogTitle>
                          <DialogDescription className="text-base font-bold text-[var(--text-2)] leading-relaxed">
                            {cfg.desc} This action will be logged and cannot be reversed.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-8 flex gap-4">
                          <DialogClose asChild>
                            <button className="brutalist-button flex-1 py-4 bg-white text-[var(--text-1)] text-[11px] border-4">Cancel</button>
                          </DialogClose>
                          <DialogClose asChild>
                            <button
                              onClick={() => handleEscalation(key, cfg.label)}
                              className={cn(
                                'brutalist-button flex-1 py-4 text-white text-[11px] border-4',
                                key === 'legal_action' ? 'bg-red-600' : 'bg-[var(--text-1)]'
                              )}
                            >
                              Confirm
                            </button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── ESCALATION HISTORY ───────────────────────────────── */}
          {contract.escalation.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-[var(--text-1)]" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-1)]">Enforcement Log</h2>
              </div>
              <div className="space-y-4">
                {contract.escalation.map((esc, i) => {
                  const cfg = ESC_CONFIG[esc.level];
                  return (
                    <div key={i} className={cn('brutalist-card p-6 border-4 flex gap-5', cfg?.bg, cfg?.border)}>
                      <div style={{ color: cfg?.color }}>{cfg?.icon}</div>
                      <div className="flex-1">
                        <div className="font-black text-sm uppercase tracking-tight mb-1" style={{ color: cfg?.color }}>{cfg?.label}</div>
                        <p className="text-[10px] font-bold leading-relaxed text-[var(--text-2)]">{esc.message}</p>
                        {esc.triggeredAt && (
                          <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-3)] mt-2">
                            {new Date(esc.triggeredAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
