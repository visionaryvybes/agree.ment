'use client';

import { useParams, useRouter } from 'next/navigation';
import { useContracts, useProtocolActions } from '@/store/contracts';
import { 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  FileText, 
  CurrencyDollar,
  User,
  CaretRight,
  Warning,
  MagicWand,
  Sparkle,
  Image as ImageIcon,
  PenNib,
  Users as UsersIcon,
  Gavel,
  FilePdf,
  CurrencyCircleDollar,
  SealCheck,
} from "@phosphor-icons/react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/ui/magnetic';
import DigitalSeal from '@/components/ui/digital-seal';
import SignaturePad from '@/components/SignaturePad';
import PaymentTracker from '@/components/PaymentTracker';
import MultiPartySigning from '@/components/MultiPartySigning';
import DisputeResolution from '@/components/DisputeResolution';
import PdfExport from '@/components/PdfExport';
import AgreementEnhancer from '@/components/AgreementEnhancer';
import ContractHealthScore from '@/components/ContractHealthScore';


type TabId = 'overview' | 'sign' | 'payments' | 'parties' | 'dispute' | 'export' | 'visuals';

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: 'overview', label: 'Summary', icon: FileText },
  { id: 'sign', label: 'Sign', icon: PenNib },
  { id: 'payments', label: 'Payments', icon: CurrencyCircleDollar },
  { id: 'parties', label: 'Parties', icon: UsersIcon },
  { id: 'dispute', label: 'Resolve', icon: Gavel },
  { id: 'export', label: 'PDF', icon: FilePdf },
  { id: 'visuals', label: 'Visuals', icon: Sparkle },
];

export default function ContractDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getContract } = useContracts();
  const { updateContract } = useProtocolActions();
  const contract: any = getContract(id as string);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-ground" />;
  if (!contract) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
       <Warning size={64} className="text-text-3 opacity-20" />
       <h1 className="heading-display text-4xl text-ink opacity-40 ">Deal Not Found.</h1>
       <Link href="/dashboard" className="btn-titanium px-10 py-4 text-[11px] font-black uppercase tracking-widest">Return to Deals</Link>
    </div>
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': return { label: 'ACTIVE DEAL', color: 'text-emerald', icon: ShieldCheck };
      case 'pending_signature': return { label: 'PENDING SIGNATURE', color: 'text-text-3', icon: Clock };
      case 'disputed': return { label: 'PROBLEM FOUND', color: 'text-red-500', icon: Warning };
      default: return { label: 'UNKNOWN', color: 'text-text-3', icon: Clock };
    }
  };

  const status = getStatusConfig(contract.status);

  const handleSign = (signatureData: string) => {
    const updatedParties = [...(contract.parties || [])];
    if (updatedParties[0]) {
      updatedParties[0] = { ...updatedParties[0], signedAt: new Date(), signatureData };
    }
    updateContract(contract.id, { parties: updatedParties, status: 'active' });
    setActiveTab('overview');
  };

  const handleMarkPaid = (paymentId: string) => {
    const updatedPayments = contract.paymentSchedule.map((p: any) =>
      p.id === paymentId ? { ...p, status: 'paid', paidDate: new Date(), paidAmount: p.amount } : p
    );
    updateContract(contract.id, { paymentSchedule: updatedPayments });
  };

  const handleInvite = (email: string, name: string) => {
    const newParty = { id: Date.now().toString(), name, email, role: 'counterparty' as const };
    updateContract(contract.id, { parties: [...(contract.parties || []), newParty] });
  };

  const handleEscalate = (level: any, message: string) => {
    const newStep = { level, triggeredAt: new Date(), message, resolved: false };
    updateContract(contract.id, { escalation: [...(contract.escalation || []), newStep], status: 'disputed' });
  };

  return (
    <div className="space-y-8 pb-32 max-w-7xl mx-auto px-4 relative">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-line-strong relative z-10">
        <div className="flex items-start gap-5">
           <Link href="/dashboard" prefetch={true} className="w-11 h-11 flex-shrink-0 border-[1.5px] border-line-strong bg-card flex items-center justify-center text-ink-2 shadow-[var(--shadow-sheet)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] hover:text-ink active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-[transform,box-shadow,color] duration-150">
              <ArrowLeft size={20} weight="bold" />
           </Link>
           <div>
              <div className={cn("badge-vibrant mb-3 inline-flex items-center gap-2 rotate-[-1.5deg]",
                contract.status === 'active' ? 'badge-active' :
                contract.status === 'pending_signature' ? 'badge-pending' :
                'badge-disputed'
              )}>
                 <status.icon size={14} weight="bold" />
                 {status.label}
              </div>
              <h1 className="heading-display uppercase text-4xl md:text-6xl text-ink">{contract.title}</h1>
           </div>
        </div>
      </header>

      {/* TAB NAV — an index-card divider row */}
      <div className="flex flex-wrap gap-2 relative z-10">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={cn(
                "px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-[0.15em] border-[1.5px] flex items-center gap-2",
                "transition-[transform,box-shadow,background,color] duration-150",
                activeTab === tab.id
                  ? "bg-mint text-paper border-line-strong shadow-[var(--shadow-sheet)]"
                  : "bg-card text-ink-3 border-line hover:text-ink hover:border-line-strong hover:-translate-y-0.5 hover:shadow-[var(--shadow-sheet)] active:translate-y-0 active:shadow-none"
              )}
            >
              <Icon size={15} weight="bold" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                {/* Summary: three dockets in one filed strip */}
                <div className="grid sm:grid-cols-3 border-[1.5px] border-line-strong bg-card divide-y sm:divide-y-0 sm:divide-x divide-line-strong shadow-[var(--shadow-sheet)]">
                  {[
                    { label: 'Value', val: `$${(contract.totalAmount || 0).toLocaleString()}`, icon: CurrencyDollar, color: 'text-mint' },
                    { label: 'Created', val: new Date(contract.createdAt).toLocaleDateString(), icon: Clock, color: 'text-blue' },
                    { label: 'Category', val: contract.category, icon: FileText, color: 'text-amber' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-5">
                       <div className="flex items-center justify-between">
                          <p className={cn("font-mono text-[9px] font-bold uppercase tracking-[0.25em]", stat.color)}>{stat.label}</p>
                          <stat.icon size={15} weight="duotone" className="text-ink-3" />
                       </div>
                       <h4 className="heading-display text-2xl mt-2 text-ink capitalize">{stat.val}</h4>
                    </div>
                  ))}
                </div>

                {/* Parties */}
                <div className="space-y-4">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3 pb-3 border-b border-line-strong">Parties</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(contract.parties || []).map((party: any, i: number) => (
                      <div key={i} className="p-5 bg-card border-[1.5px] border-line-strong flex items-center gap-4 shadow-[var(--shadow-sheet)]">
                         <div className="w-11 h-11 flex-shrink-0 border-[1.5px] border-line-strong bg-wash flex items-center justify-center text-mint rotate-[-2deg]">
                            <User size={22} weight="duotone" />
                         </div>
                         <div className="min-w-0">
                            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-3">{party.role}</p>
                            <h4 className="font-bold text-ink truncate">{party.name || 'Unnamed'}</h4>
                            {party.signedAt && (
                              <span className="font-mono text-[9px] font-bold text-mint uppercase tracking-[0.15em]">Signed</span>
                            )}
                         </div>
                         {party.signedAt && (
                           <SealCheck size={20} weight="fill" className="ml-auto text-mint flex-shrink-0" />
                         )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clauses — a numbered terms ledger */}
                <div className="border-[1.5px] border-line-strong bg-card shadow-[var(--shadow-sheet)]">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3 px-5 py-3.5 border-b-[1.5px] border-line-strong">Agreement terms</h3>
                  <ol>
                    {(contract.clauses?.length > 0
                      ? contract.clauses.map((c: any, i: number) => ({ key: c.id, title: c.title, n: i }))
                      : [0, 1, 2].map(i => ({ key: i, title: `Term ${i + 1}`, n: i }))
                    ).map(({ key, title, n }: any) => (
                      <li key={key} className="group flex items-center gap-4 px-5 py-3.5 border-b border-dashed border-line last:border-b-0 hover:bg-wash transition-colors cursor-pointer">
                         <span className="font-mono text-[11px] font-bold text-mint">{n + 1}.</span>
                         <span className="text-sm font-bold uppercase tracking-wide text-ink">{title}</span>
                         <CaretRight size={15} weight="bold" className="ml-auto text-ink-3 group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Sidebar: seal of record + status */}
              <div className="lg:col-span-1 space-y-8">
                <div className="p-8 bg-card border-[1.5px] border-line-strong text-center shadow-[var(--shadow-lift)] relative">
                  <div className="mx-auto w-24 h-24 rounded-full border-[3px] border-mint text-mint bg-card flex items-center justify-center rotate-[-10deg] shadow-[3px_3px_0_var(--shadow-ink)]">
                    <div className="leading-tight">
                      <SealCheck size={32} weight="duotone" className="mx-auto" />
                      <p className="font-mono text-[8px] font-bold tracking-[0.2em] mt-0.5">SAVED</p>
                    </div>
                  </div>
                  <h3 className="heading-display uppercase text-3xl mt-5">On record.</h3>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-3 break-all">№ {contract.id?.slice(0, 16).toUpperCase()}</p>
                  <dl className="mt-6 pt-4 border-t-2 border-dashed border-line space-y-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-left">
                    <div className="flex justify-between"><dt className="text-ink-3">Status</dt><dd className="font-bold text-ink">{status.label.split(' ')[0]}</dd></div>
                    <div className="flex justify-between items-center"><dt className="text-ink-3">Integrity</dt><dd className="font-bold text-mint border-[1.5px] border-mint px-1.5 py-[1px] rotate-[-2deg]">Solid</dd></div>
                  </dl>
                </div>

                {/* Health Score */}
                <ContractHealthScore contract={contract} />

                {/* History Log */}
                <div className="border-[1.5px] border-line-strong bg-card shadow-[var(--shadow-sheet)]">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3 px-5 py-3.5 border-b-[1.5px] border-line-strong">History</h4>
                  <ol>
                    {[
                      { t: '11:04', msg: 'Both parties notified' },
                      { t: '10:42', msg: 'Signature link created' },
                      { t: '09:12', msg: 'Agreement created' }
                    ].map((log, i) => (
                      <li key={i} className="flex gap-4 items-baseline px-5 py-3 border-b border-dashed border-line last:border-b-0">
                        <span className="font-mono text-[10px] text-mint tabular-nums">{log.t}</span>
                        <p className="text-[13px] text-ink-2">{log.msg}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* SIGN TAB */}
          {activeTab === 'sign' && (
            <div className="flex justify-center py-10">
              <SignaturePad 
                onSign={handleSign} 
                onCancel={() => setActiveTab('overview')} 
                signerName={contract.parties?.[0]?.name}
              />
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="max-w-2xl mx-auto">
              <PaymentTracker 
                payments={contract.paymentSchedule || []}
                totalAmount={contract.totalAmount || 0}
                currency={contract.currency}
                onMarkPaid={handleMarkPaid}
              />
              {(!contract.paymentSchedule || contract.paymentSchedule.length === 0) && (
                <div className="text-center py-16 space-y-4">
                  <CurrencyCircleDollar size={48} className="text-text-3 mx-auto opacity-20" weight="thin" />
                  <p className="text-[11px] font-black text-text-3 uppercase tracking-widest">No payments set up yet</p>
                </div>
              )}
            </div>
          )}

          {/* PARTIES TAB */}
          {activeTab === 'parties' && (
            <div className="max-w-2xl mx-auto">
              <MultiPartySigning
                parties={contract.parties || []}
                onInvite={handleInvite}
                contractTitle={contract.title}
              />
            </div>
          )}

          {/* DISPUTE TAB */}
          {activeTab === 'dispute' && (
            <div className="max-w-2xl mx-auto">
              <DisputeResolution
                steps={contract.escalation || []}
                currentLevel={contract.escalation?.length > 0 ? contract.escalation[contract.escalation.length - 1].level : undefined}
                onEscalate={handleEscalate}
                contractTitle={contract.title}
              />
            </div>
          )}

          {/* EXPORT TAB */}
          {activeTab === 'export' && (
            <div className="max-w-md mx-auto">
              <PdfExport contract={contract} />
            </div>
          )}

          {/* VISUALS TAB */}
          {activeTab === 'visuals' && (
            <div className="flex justify-center py-10">
              <AgreementEnhancer
                contractTitle={contract.title}
                contractContent={contract.description || ''}
                onEnhance={(style) => {
                  updateContract(contract.id, { metadata: { ...contract.metadata, enhancedStyle: style } });
                }}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
