'use client';

import { useParams, useRouter } from 'next/navigation';
import { useContracts } from '@/store/contracts';
import { useState, useEffect } from 'react';
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
  Gavel,
  Envelope,
  Phone,
  MapPin,
  CalendarBlank,
  ArrowRight,
  SealCheck,
  Copy,
} from "@phosphor-icons/react";
import Link from 'next/link';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { RadialProgress } from '@/components/ui/radial-progress';

/* ─── Escalation config ──────────────────────────────────── */
const ESC_CONFIG = {
  friendly_reminder: {
    label: 'Friendly Reminder', color: 'var(--blue)', bg: 'bg-[var(--color-white)]', border: 'border-[var(--text-1)]',
    text: 'text-[var(--text-1)]', icon: <Envelope size={18} weight="bold" />,
    desc: 'Send a friendly note reminding the other person about the agreement.',
    step: 1,
  },
  formal_notice: {
    label: 'Official Notice', color: '#F97316', bg: 'bg-[var(--color-white)]', border: 'border-[var(--text-1)]',
    text: 'text-[var(--text-1)]', icon: <FileText size={18} weight="bold" />,
    desc: 'Send a formal notice pointing out which part was missed.',
    step: 2,
  },
  demand_letter: {
    label: 'Demand Letter', color: 'white', bg: 'bg-[#FF5F56]', border: 'border-[var(--text-1)]',
    text: 'text-[var(--bg)]', icon: <Warning size={18} weight="bold" />,
    desc: 'Send an official letter requesting payment or action immediately.',
    step: 3,
  },
  legal_action: {
    label: 'Legal Action', color: 'white', bg: 'bg-[#FF5F56]', border: 'border-[var(--text-1)]',
    text: 'text-[var(--bg)]', icon: <Gavel size={18} weight="bold" />,
    desc: 'Get help with filing a small claim or starting arbitration.',
    step: 4,
  },
} as const;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  active: { label: 'Active', color: 'text-[var(--text-1)]', bg: 'bg-[var(--secondary)] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)]', dot: 'bg-[var(--text-1)]' },
  pending_signature: { label: 'Pending', color: 'text-[var(--text-1)]', bg: 'bg-amber-400 border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)]', dot: 'bg-[var(--text-1)]' },
  completed: { label: 'Completed', color: 'text-[var(--bg)]', bg: 'bg-[var(--blue)] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)]', dot: 'bg-[var(--color-white)]' },
  disputed: { label: 'Disputed', color: 'text-[var(--bg)]', bg: 'bg-[#FF5F56] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)]', dot: 'bg-[var(--color-white)]' },
  draft: { label: 'Draft', color: 'text-[var(--text-1)]', bg: 'bg-[var(--color-white)] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)]', dot: 'bg-[var(--text-3)]' },
  expired: { label: 'Expired', color: 'text-[var(--text-1)]', bg: 'bg-gray-200 border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)]', dot: 'bg-[var(--text-1)]' },
};



export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getContract, updatePaymentStatus, triggerEscalation } = useContracts();
  const contract = getContract(params.id as string);
  const [openClause, setOpenClause] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--text-1)]"></div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-12">
        <EmptyState
          title="Contract not found"
          description="This contract does not exist or has been removed."
          actionLabel="Back to Portfolio"
          actionHref="/contracts"
          icon={<FileX size={64} weight="duotone" className="mx-auto mb-8 text-[var(--text-3)]" />}
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

  const handleMarkPaid = (paymentId: string, amount: number) => {
    updatePaymentStatus(contract.id, paymentId, 'paid', amount);
    toast({ title: 'Payment marked paid', description: `$${amount.toLocaleString()} recorded.` });
  };

  const handleEscalation = (key: keyof typeof ESC_CONFIG, label: string) => {
    triggerEscalation(contract.id, key, `${label} triggered for contract "${contract.title}".`);
    toast({ title: `${label} activated`, description: 'Enforcement step has been initiated.' });
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `AgreeMint: ${contract.title}`,
      text: `Review this contract: ${contract.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: 'Link copied', description: 'Share link in your clipboard.' });
      }
    } catch (err) {
      if (err instanceof Error && (err as { name?: string }).name !== 'AbortError') {
        console.error('Share error:', err);
      }
    }
  };

  return (
    <div className="min-h-full bg-[var(--bg)]">

      {/* ─── TOP HERO STRIP ──────────────────────────────────────── */}
      <div className="border-b-4 border-[var(--text-1)] bg-[var(--bg)] print:hidden">
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
                className="mt-1 w-12 h-12 bg-[var(--color-white)] border-2 border-[var(--text-1)] flex items-center justify-center hover:bg-[#F0F0F2] transition-all shadow-[4px_4px_0_0_var(--text-1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex-shrink-0 group/back"
              >
                <ArrowLeft size={20} weight="bold" />
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text-1)]">{contract.title}</h1>
                  <span className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest', st.bg, st.color)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', st.dot)} />
                    {st.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-6 mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)] flex items-center gap-2">
                    <FileText size={12} weight="bold" />{contract.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)] flex items-center gap-2">
                    <MapPin size={12} weight="bold" />{contract.jurisdiction}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)] flex items-center gap-2">
                    <CalendarBlank size={12} weight="bold" />{createdDate}
                  </span>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(contract.id); toast({ title: 'ID copied' }); }}
                    className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)] flex items-center gap-1.5 hover:text-[var(--text-1)] transition-colors"
                  >
                    <Copy size={12} weight="bold" />ID: {contract.id.slice(0, 8).toUpperCase()}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-4 lg:flex-shrink-0">
              <button 
                onClick={handleExportPDF}
                className="h-12 px-6 bg-[var(--color-white)] text-[10px] font-black uppercase tracking-[0.2em] border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] hover:-translate-y-1 transition-all flex items-center gap-3 print:hidden"
              >
                <DownloadSimple size={16} weight="bold" />Export PDF
              </button>
              <button 
                onClick={handleShare}
                className="h-12 px-6 bg-[var(--blue)] text-[var(--bg)] text-[10px] font-black uppercase border-2 border-[var(--text-1)] tracking-[0.2em] shadow-[4px_4px_0_0_var(--text-1)] hover:-translate-y-1 transition-all flex items-center gap-3 print:hidden"
              >
                <ShareNetwork size={16} weight="bold" />Share
              </button>
            </div>
          </div>
        </div>

        {/* ─── BENTO STAT STRIP ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 border-t-4 border-[var(--text-1)] bg-[var(--text-1)]">
          {[
            {
              label: 'Total Value', value: contract.totalAmount ? `$${contract.totalAmount.toLocaleString()}` : '—',
              sub: contract.currency, icon: <CurrencyDollar size={24} weight="bold" />, accent: 'var(--blue)', border: 'border-[var(--blue)]'
            },
            {
              label: 'Amount Paid', value: totalPaid > 0 ? `$${totalPaid.toLocaleString()}` : '$0',
              sub: `${paidCount} payments`, icon: <CheckCircle size={24} weight="bold" />, accent: 'var(--secondary)', border: 'border-[var(--secondary)]'
            },
            {
              label: 'Remaining', value: totalRemaining > 0 ? `$${totalRemaining.toLocaleString()}` : '$0',
              sub: overdueCount > 0 ? `${overdueCount} overdue` : 'On track', icon: <Clock size={24} weight="bold" />,
              accent: overdueCount > 0 ? '#EF4444' : '#F59E0B', border: overdueCount > 0 ? 'border-[#EF4444]' : 'border-[#F59E0B]'
            },
            {
              label: 'Parties', value: contract.parties.length.toString(),
              sub: contract.parties.every(p => p.signedAt) ? 'All signed' : 'Pending',
              icon: <Users size={24} weight="bold" />, accent: '#8B5CF6', border: 'border-[#8B5CF6]'
            },
          ].map((s, i) => (
            <div key={i} className="px-6 py-8 bg-[var(--color-white)] group hover:bg-[var(--text-1)] hover:text-[var(--bg)] transition-colors relative overflow-hidden h-36 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-3 relative z-10 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-3)]">{s.label}</span>
                <div style={{ color: s.accent }} className="transition-opacity">{s.icon}</div>
              </div>
              <div className="text-xl lg:text-3xl font-black text-[var(--text-1)] tracking-tighter leading-none mb-2 relative z-10 break-all">{s.value}</div>
              <div className="text-[9px] font-black uppercase tracking-widest relative z-10 whitespace-nowrap overflow-hidden text-ellipsis px-2 py-1 bg-[var(--color-white)] border-2 inline-block self-start shadow-[2px_2px_0_0_var(--text-1)]" style={{ color: s.accent, borderColor: s.accent }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MAIN CONTENT (HIDDEN ON PRINT) ────────────────────────── */}
      <div className="p-10 lg:p-14 grid lg:grid-cols-5 gap-10 mt-6 relative z-10 bg-[var(--bg)] print:hidden">

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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="brutalist-card bg-[var(--color-white)] p-8 relative overflow-hidden group shadow-[8px_8px_0_0_var(--text-1)] hover:-translate-y-1 hover:shadow-[12px_12px_0_0_var(--blue)] transition-all duration-300 border-2 border-[var(--text-1)]"
                >
                  <div className={cn(
                    'absolute top-0 right-0 px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] border-b-2 border-l-2 border-[var(--text-1)]',
                    party.role === 'creator' ? 'bg-[var(--blue)] text-[var(--bg)]' : 'bg-[var(--secondary)] text-[var(--text-1)]'
                  )}>
                    {party.role === 'creator' ? 'Primary' : 'Counterparty'}
                  </div>

                  <div className="flex items-center gap-5 mb-6 mt-2">
                    <div className="w-14 h-14 bg-[var(--bg)] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] text-[var(--text-1)] flex items-center justify-center font-bold text-xl">
                      {party.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[var(--text-1)] tracking-tight leading-none mb-1.5">
                        {party.name}
                      </h3>
                      {party.signedAt ? (
                        <div className="flex items-center gap-2 text-[var(--secondary)]">
                          <SealCheck size={14} weight="bold" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            Signed {new Date(party.signedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-500">
                          <Clock size={14} weight="bold" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting signature</span>
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
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-1)]">Agreement Rules</h2>
              <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-[var(--text-3)]">
                {contract.clauses.length} sections
              </span>
            </div>
            <div className="brutalist-card bg-[var(--color-white)] border-2 border-[var(--text-1)] shadow-[8px_8px_0_0_var(--text-1)] overflow-hidden">
              {contract.clauses.map((clause, i) => (
                <div key={clause.id} className={cn('border-b-2 border-[var(--text-1)] last:border-0 hover:bg-[#F0F0F2] transition-colors', openClause === clause.id && 'bg-[#F0F0F2]')}>
                  <button
                    onClick={() => setOpenClause(openClause === clause.id ? null : clause.id)}
                    className="w-full flex items-center gap-6 px-8 py-6 text-left group"
                  >
                    <span className="text-[11px] font-black text-[var(--blue)] tabular-nums w-8 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-black uppercase text-sm tracking-tight text-[var(--text-1)] group-hover:text-[var(--blue)] transition-colors">
                      {clause.title}
                    </span>
                    {clause.isRequired && (
                      <span className="text-[9px] font-black uppercase tracking-widest bg-[var(--blue)] text-[var(--bg)] px-3 py-1 border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)]">
                        Essential
                      </span>
                    )}
                    <CaretRight
                      size={18} weight="bold"
                      className={cn('text-[var(--text-1)] transition-transform flex-shrink-0', openClause === clause.id && 'rotate-90')}
                    />
                  </button>
                  <AnimatePresence>
                    {openClause === clause.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[var(--bg)] border-t-2 border-[var(--text-1)]"
                      >
                        <div className="px-10 pb-10 pt-8">
                          <p className="text-sm font-bold text-[var(--text-1)] leading-relaxed border-l-4 border-[var(--blue)] pl-6">
                            {clause.content}
                          </p>
                          {clause.legalBasis && (
                            <div className="mt-6 flex items-start gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--text-2)] bg-[var(--color-white)] p-4 border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] w-fit">
                              <Scales size={16} weight="bold" className="flex-shrink-0 text-[var(--blue)]" />
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
            <div className="brutalist-card bg-[var(--color-white)] p-10 flex items-center justify-between group relative overflow-hidden shadow-[8px_8px_0_0_var(--text-1)] border-2 border-[var(--text-1)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--blue)] opacity-20 blur-[50px] pointer-events-none" />
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-16 h-16 bg-[var(--bg)] border-2 border-[var(--text-1)] flex items-center justify-center text-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)]">
                  <Scales size={32} weight="bold" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-3)] mb-2">Legal Region</div>
                  <div className="font-black text-xl tracking-tight text-[var(--text-1)] uppercase">{contract.governingLaw}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] mt-2 flex items-center gap-2">
                    <MapPin size={14} weight="bold" />{contract.jurisdiction}
                  </div>
                </div>
              </div>
              <ShieldCheck size={56} weight="bold" className="opacity-10 flex-shrink-0 text-[var(--text-1)]" />
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
              <div className="brutalist-card bg-[var(--color-white)] border-2 border-[var(--text-1)] shadow-[8px_8px_0_0_var(--text-1)] p-8 mb-6">
                <div className="flex items-center gap-8">
                  {/* Radial ring */}
                  <div className="relative flex-shrink-0">
                    <RadialProgress pct={progressPct} size={110} stroke={10} color="var(--text-1)" className="drop-shadow-none" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-[var(--text-1)] tracking-tighter leading-none">
                        {progressPct.toFixed(0)}%
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-3)]">Paid</span>
                    </div>
                  </div>
                  {/* Breakdown */}
                  <div className="flex-1 space-y-5">
                    <div>
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">Invoiced</span>
                        <span className="font-black text-xl text-[var(--text-1)] tabular-nums tracking-tighter">${totalPaid.toLocaleString()}</span>
                      </div>
                      <div className="h-4 border-2 border-[var(--text-1)] bg-[var(--bg)] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                        <div className="h-full bg-[var(--secondary)] transition-all duration-1000 border-r-2 border-[var(--text-1)]" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">Remaining</span>
                        <span className="font-black text-xl text-[var(--text-1)] tabular-nums tracking-tighter">${totalRemaining.toLocaleString()}</span>
                      </div>
                      <div className="h-4 border-2 border-[var(--text-1)] bg-[var(--bg)] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                        <div className="h-full bg-[var(--text-1)]/10 transition-all duration-1000" style={{ width: `${100 - progressPct}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-[#FF5F56] border-2 border-[var(--text-1)] px-4 py-3 shadow-[4px_4px_0_0_var(--text-1)]">
                      <Warning size={16} weight="bold" className="text-[var(--bg)]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--bg)]">{overdueCount} Breach Alert{overdueCount > 1 ? 's' : ''}</span>
                    </div>
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
                        'flex items-center gap-6 p-6 border-2 border-[var(--text-1)] transition-all duration-300 shadow-[4px_4px_0_0_var(--text-1)]',
                        isPaid ? 'bg-[var(--secondary)]' :
                          isOverdue ? 'bg-[#FF5F56] text-[var(--bg)]' :
                            'bg-[var(--color-white)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--text-1)]'
                      )}
                    >
                      {/* Index bubble */}
                      <div className={cn(
                        'w-12 h-12 border-2 border-[var(--text-1)] flex items-center justify-center font-black text-sm flex-shrink-0 shadow-[2px_2px_0_0_var(--text-1)]',
                        isPaid ? 'bg-[var(--color-white)] text-[var(--text-1)]' :
                          isOverdue ? 'bg-[var(--text-1)] text-[var(--bg)]' :
                            'bg-[var(--bg)] text-[var(--text-1)]'
                      )}>
                        {isPaid ? <Check size={20} weight="bold" /> : String(i + 1)}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className={cn("font-black text-xl tabular-nums leading-none tracking-tighter mb-2", isOverdue ? "text-[var(--bg)]" : "text-[var(--text-1)]")}>
                          ${payment.amount.toLocaleString()}
                        </div>
                        <div className={cn('text-[9px] font-black uppercase tracking-[0.2em]',
                          isOverdue ? 'text-[var(--bg)]' : 'text-[var(--text-3)]'
                        )}>
                          Due By: {dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>

                      {/* Status / action */}
                      {isPaid ? (
                        <div className="bg-[var(--color-white)] text-[var(--text-1)] text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] flex items-center gap-2">
                          <SealCheck size={16} weight="bold" />Verified
                        </div>
                      ) : (
                        <button
                          onClick={() => handleMarkPaid(payment.id, payment.amount)}
                          className={cn(
                            'px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] hover:-translate-y-[1px]',
                            isOverdue ? 'bg-[var(--text-1)] text-[var(--bg)]' : 'bg-[var(--blue)] text-[var(--bg)] hover:shadow-[4px_4px_0_0_var(--text-1)]'
                          )}
                        >
                          Settle Now
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
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-1)]">Problem Resolution</h2>
              <div className="ml-auto flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-600">
                Contextual Help
              </div>
            </div>

            <div className="brutalist-card bg-[var(--color-white)] border-2 border-[var(--text-1)] overflow-hidden shadow-[8px_8px_0_0_var(--text-1)]">
              {/* Header */}
              <div className="px-10 py-6 bg-[var(--bg)] border-b-2 border-[var(--text-1)]">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-3)]">
                  Progress: <span className="text-[var(--blue)]">Step {contract.escalation.length}</span> of 4
                </p>
              </div>

              {/* Steps */}
              <div className="divide-y-2 divide-[var(--text-1)]">
                {(Object.entries(ESC_CONFIG) as [keyof typeof ESC_CONFIG, typeof ESC_CONFIG[keyof typeof ESC_CONFIG]][]).map(([key, cfg]) => {
                  const triggered = contract.escalation.some(e => e.level === key);
                  return (
                    <Dialog key={key}>
                      <DialogTrigger asChild>
                        <button
                          disabled={triggered}
                          className={cn(
                            'w-full text-left flex items-start gap-5 px-8 py-6 transition-all group',
                            triggered
                              ? 'opacity-50 cursor-default bg-[#F0F0F2]'
                              : 'hover:bg-[#F0F0F2] cursor-pointer bg-[var(--color-white)]'
                          )}
                        >
                          {/* Step indicator */}
                          <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                            <div className={cn(
                              'w-8 h-8 border-2 flex items-center justify-center text-[10px] font-black flex-shrink-0 shadow-[2px_2px_0_0_var(--text-1)]',
                              triggered
                                ? 'bg-[var(--text-1)] border-[var(--text-1)] text-[var(--bg)] shadow-none'
                                : 'bg-[var(--bg)] border-[var(--text-1)] text-[var(--text-1)] group-hover:bg-[var(--text-1)] group-hover:text-[var(--bg)]'
                            )}>
                              {triggered ? <Check size={14} weight="bold" /> : cfg.step}
                            </div>
                            {cfg.step < 4 && <div className="w-0.5 flex-1 bg-[var(--text-1)] mt-2 min-h-[20px]" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1.5">
                              <div style={{ color: cfg.color }} className={cfg.text}>{cfg.icon}</div>
                              <span className={cn(
                                'font-black text-sm uppercase tracking-tight',
                                triggered ? 'text-[var(--text-3)] line-through' : 'text-[var(--text-1)]'
                              )}>{cfg.label}</span>
                              {triggered && (
                                <span className="text-[8px] font-black uppercase tracking-widest bg-[var(--text-1)] text-[var(--bg)] px-3 py-1 border-2 border-[var(--text-1)]">Done</span>
                              )}
                            </div>
                            <p className="text-[10px] font-bold text-[var(--text-2)] leading-relaxed">{cfg.desc}</p>
                          </div>

                          {!triggered && (
                            <ArrowRight size={18} weight="bold" className="text-[var(--text-1)] mt-1 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                          )}
                        </button>
                      </DialogTrigger>

                      <DialogContent className="bg-[var(--color-white)] border-4 border-[var(--text-1)] shadow-[12px_12px_0_0_var(--text-1)] rounded-none overflow-hidden max-w-xl p-16">
                        <DialogHeader className="space-y-10 relative z-10">
                          <div className={cn('inline-flex items-center gap-4 px-5 py-3 border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] bg-[var(--bg)] self-start')}>
                            <div style={{ color: cfg.color }} className={cfg.text}>{cfg.icon}</div>
                            <span className={cn('text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-1)]')}>{cfg.label}</span>
                          </div>
                          <DialogTitle className="text-3xl md:text-5xl font-black tracking-tighter text-[var(--text-1)] uppercase leading-none">
                            Take this step?
                          </DialogTitle>
                          <DialogDescription className="text-lg font-bold text-[var(--text-2)] leading-relaxed tracking-tight">
                            {cfg.desc} This action will be recorded in the agreement history.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-12 flex gap-6 relative z-10">
                          <DialogClose asChild>
                            <button className="flex-1 py-5 bg-[var(--bg)] text-[var(--text-1)] text-[11px] font-black uppercase tracking-widest border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_var(--text-1)] transition-all">Cancel</button>
                          </DialogClose>
                          <DialogClose asChild>
                            <button
                              onClick={() => handleEscalation(key, cfg.label)}
                              className={cn(
                                'flex-1 py-5 text-[11px] font-black uppercase tracking-widest transition-all border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_var(--text-1)]',
                                key === 'legal_action' ? 'bg-[#FF5F56] text-[var(--bg)]' : 'bg-[var(--blue)] text-[var(--bg)]'
                              )}
                            >
                              Execute
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
                <div className="w-1 h-6 bg-red-500" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-1)]">Resolution Log</h2>
              </div>
              <div className="space-y-4">
                {contract.escalation.map((esc, i) => {
                  const cfg = ESC_CONFIG[esc.level as keyof typeof ESC_CONFIG];
                  return (
                      <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'brutalist-card p-8 border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] flex gap-6 relative overflow-hidden',
                        esc.level === 'legal_action' ? 'bg-[#FF5F56] text-[var(--bg)]' : 'bg-[var(--color-white)]'
                      )}
                    >
                      <div className="w-14 h-14 bg-[var(--bg)] border-2 border-[var(--text-1)] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_0_var(--text-1)]" style={{ color: cfg?.color }}>
                        {cfg?.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className={cn("font-black text-sm uppercase tracking-tight", cfg?.text)}>{cfg?.label}</div>
                          {esc.triggeredAt && (
                            <div className={cn("text-[9px] font-black uppercase tracking-widest", esc.level === 'legal_action' ? "text-[var(--bg)]" : "text-[var(--text-3)]")}>
                              {new Date(esc.triggeredAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <p className={cn("text-sm font-bold leading-relaxed", esc.level === 'legal_action' ? "text-[var(--bg)]" : "text-[var(--text-2)]")}>{esc.message}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ─── DEDICATED PRINT DOCUMENT ──────────────────────────── */}
      <div className="hidden print:block p-12 text-[var(--text-1)] font-serif leading-relaxed w-full min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="border-b-2 border-[var(--text-1)] pb-8 mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">{contract.title}</h1>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-600">Agreement Reference: {contract.id.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold uppercase mb-1">Signing Date</p>
              <p className="text-xl font-bold">{createdDate}</p>
            </div>
          </div>

          {/* Parties Section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold uppercase border-b border-[var(--text-1)] pb-2 mb-6">1. The Parties</h2>
            <div className="space-y-6">
              {contract.parties.map(p => (
                <div key={p.id} className="grid grid-cols-3 gap-8">
                  <div className="font-bold uppercase text-xs">{p.role === 'creator' ? 'Primary Party' : 'Counterparty'}</div>
                  <div className="col-span-2">
                    <p className="text-lg font-bold">{p.name}</p>
                    <p className="text-sm">{p.email}</p>
                    <p className="text-sm italic">{p.signedAt ? `Verified on ${new Date(p.signedAt).toLocaleDateString()}` : 'Awaiting Final Signature'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Details */}
          <div className="mb-12 grid grid-cols-3 gap-12 border-y border-gray-200 py-8 text-[var(--text-1)]">
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Total Amount</p>
              <p className="text-2xl font-bold">${contract.totalAmount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Region</p>
              <p className="text-lg font-bold uppercase">{contract.jurisdiction}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Agreement Type</p>
              <p className="text-lg font-bold uppercase">{contract.category}</p>
            </div>
          </div>

          {/* Sections Section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold uppercase border-b border-[var(--text-1)] pb-2 mb-8">2. Agreement Rules</h2>
            <div className="space-y-10">
              {contract.clauses.map((c, i) => (
                <div key={c.id} className="break-inside-avoid">
                  <h3 className="text-lg font-bold mb-3 flex gap-4">
                    <span className="opacity-40">{String(i+1).padStart(2, '0')}</span>
                    {c.title.toUpperCase()}
                  </h3>
                  <div className="pl-10 space-y-4">
                    <p className="text-base leading-relaxed text-gray-800">{c.content}</p>
                    {c.legalBasis && (
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 p-2 border-l-2 border-gray-300">
                        Legal Protocol: {c.legalBasis}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governing Law */}
          <div className="mb-12 p-8 bg-gray-50 border border-gray-200 break-inside-avoid">
            <h2 className="text-xl font-bold uppercase mb-4">3. Legal Region</h2>
            <p className="text-base text-gray-800 mb-2">This agreement is governed by the laws and regulations of <span className="font-bold underline">{contract.governingLaw}</span>.</p>
            <p className="text-sm text-gray-600 italic">This document is compliant within this region.</p>
          </div>

          {/* Payment Schedule (If exists) */}
          {contract.paymentSchedule.length > 0 && (
            <div className="mb-12 break-inside-avoid">
              <h2 className="text-xl font-bold uppercase border-b border-[var(--text-1)] pb-2 mb-6">4. Payment Schedule</h2>
              <table className="w-full text-left font-sans">
                <thead className="text-[10px] uppercase text-gray-400 border-b">
                  <tr>
                    <th className="py-2">Step</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Due Date</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contract.paymentSchedule.map((p, i) => (
                    <tr key={p.id} className="text-sm text-[var(--text-1)]">
                      <td className="py-4 font-bold">Step {i+1}</td>
                      <td className="py-4 font-bold">${p.amount.toLocaleString()}</td>
                      <td className="py-4">{new Date(p.dueDate).toLocaleDateString()}</td>
                      <td className="py-4 uppercase font-black text-[9px]">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Signatures */}
          <div className="mt-24 grid grid-cols-2 gap-24 pt-12 border-t-2 border-[var(--text-1)]/10">
            {contract.parties.map(p => (
              <div key={p.id}>
                <div className="h-20 border-b border-[var(--text-1)] flex items-end pb-4">
                  {p.signedAt ? (
                    <p className="text-sm font-bold italic opacity-40 text-[var(--text-1)]">Digital Signature Verified: {p.id.slice(0, 12)}</p>
                  ) : (
                    <div />
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase font-bold text-gray-400">Authorized Signature</p>
                  <p className="text-sm font-bold text-[var(--text-1)]">{p.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
