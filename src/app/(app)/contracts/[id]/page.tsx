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
  CurrencyCircleDollar
} from "@phosphor-icons/react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/ui/magnetic';
import DigitalSeal from '@/components/ui/digital-seal';
import dynamic from 'next/dynamic';
import SignaturePad from '@/components/SignaturePad';
import PaymentTracker from '@/components/PaymentTracker';
import MultiPartySigning from '@/components/MultiPartySigning';
import DisputeResolution from '@/components/DisputeResolution';
import PdfExport from '@/components/PdfExport';
import AgreementEnhancer from '@/components/AgreementEnhancer';
import ContractHealthScore from '@/components/ContractHealthScore';

const Seal3D = dynamic(() => import('@/components/ui/seal-3d'), { ssr: false });

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

  if (!mounted) return <div className="min-h-screen bg-[#010101]" />;
  if (!contract) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
       <Warning size={64} className="text-text-3 opacity-20" />
       <h1 className="heading-display text-4xl text-white opacity-40 uppercase italic">Deal Not Found.</h1>
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
      <div className="vibrant-glow top-0 right-1/4 w-[600px] h-[600px] bg-emerald/10 animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 left-1/4 w-[500px] h-[500px] bg-blue/10" />

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-6">
           <Link href="/dashboard" prefetch={true} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-3 hover:bg-emerald hover:text-[#010101] shadow-xl transition-all duration-500">
              <ArrowLeft size={24} weight="bold" />
           </Link>
           <div>
              <div className={cn("badge-vibrant mb-3 inline-flex items-center gap-2", 
                contract.status === 'active' ? 'badge-active' : 
                contract.status === 'pending_signature' ? 'badge-pending' : 
                'badge-disputed'
              )}>
                 <status.icon size={14} weight="bold" />
                 {status.label}
              </div>
              <h1 className="heading-display text-4xl md:text-6xl text-white tracking-tighter italic uppercase">{contract.title}</h1>
           </div>
        </div>
      </header>

      {/* TAB NAV */}
      <div className="flex flex-wrap gap-2 relative z-10">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 transition-all",
                activeTab === tab.id
                  ? "bg-emerald text-[#010101] border-emerald shadow-[0_0_20px_rgba(0,255,209,0.2)]"
                  : "bg-white/[0.03] text-text-3 border-white/10 hover:text-white hover:border-white/20"
              )}
            >
              <Icon size={16} weight="bold" /> {tab.label}
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
                {/* Summary Grid */}
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { label: 'Value', val: `$${(contract.totalAmount || 0).toLocaleString()}`, icon: CurrencyDollar, color: 'text-emerald' },
                    { label: 'Created', val: new Date(contract.createdAt).toLocaleDateString(), icon: Clock, color: 'text-blue' },
                    { label: 'Category', val: contract.category, icon: FileText, color: 'text-amber' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 backdrop-blur-3xl space-y-6 group hover:border-emerald/30 transition-all duration-500">
                       <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-text-3 group-hover:bg-white group-hover:text-[#010101] transition-all">
                          <stat.icon size={24} weight="bold" />
                       </div>
                       <div>
                          <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] mb-1", stat.color)}>{stat.label}</p>
                          <h4 className="text-2xl font-black text-white italic tracking-tighter">{stat.val}</h4>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Parties */}
                <div className="space-y-6">
                  <h3 className="text-[12px] font-black text-text-3 uppercase tracking-[0.4em] px-2">Parties</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {(contract.parties || []).map((party: any, i: number) => (
                      <div key={i} className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 flex items-center gap-6 group hover:border-emerald/30 transition-all">
                         <div className="w-14 h-14 rounded-2xl bg-[#080808] border border-white/10 flex items-center justify-center text-emerald">
                            <User size={28} weight="bold" />
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-text-3 uppercase tracking-widest">{party.role}</p>
                            <h4 className="text-lg font-black text-white tracking-tighter">{party.name || 'Anonymous'}</h4>
                            {party.signedAt && <span className="text-[8px] font-black text-emerald uppercase tracking-widest">Signed ✓</span>}
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clauses */}
                <div className="p-10 rounded-[40px] bg-[#0A0A0A] border border-white/10 space-y-6">
                  <h3 className="text-[12px] font-black text-text-3 uppercase tracking-[0.4em]">Agreement Terms</h3>
                  <div className="space-y-4">
                    {contract.clauses?.length > 0 ? contract.clauses.map((clause: any) => (
                      <div key={clause.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-emerald hover:border-transparent transition-all cursor-pointer">
                         <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_10px_#00FFD1] group-hover:bg-[#010101] transition-colors" />
                            <span className="text-[11px] font-black text-white uppercase tracking-widest group-hover:text-[#010101]">{clause.title}</span>
                         </div>
                         <CaretRight size={20} weight="bold" className="text-text-3 group-hover:text-[#010101] transition-all" />
                      </div>
                    )) : [1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-emerald hover:border-transparent transition-all cursor-pointer">
                         <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_10px_#00FFD1] group-hover:bg-[#010101] transition-colors" />
                            <span className="text-[11px] font-black text-white uppercase tracking-widest group-hover:text-[#010101]">Point 0{i}</span>
                         </div>
                         <CaretRight size={20} weight="bold" className="text-text-3 group-hover:text-[#010101] transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar: 3D Seal + Status */}
              <div className="lg:col-span-1 space-y-8">
                <div className="p-10 rounded-[40px] bg-emerald text-[#010101] flex flex-col items-center text-center gap-8 shadow-[0_0_80px_rgba(0,255,209,0.2)] border-4 border-[#010101] relative overflow-hidden">
                  <div className="w-full h-48 relative">
                    <Seal3D className="absolute inset-0" />
                  </div>
                  <div className="space-y-4 relative z-10">
                    <h3 className="heading-display text-4xl italic uppercase">Secured</h3>
                    <p className="text-[9px] font-black opacity-60 uppercase tracking-[0.2em] break-all">ID: {contract.id?.slice(0, 16).toUpperCase()}</p>
                  </div>
                  <div className="w-full space-y-4 pt-6 border-t border-[#010101]/15 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex justify-between px-4"><span className="opacity-50">Status</span><span>{status.label.split(' ')[0]}</span></div>
                    <div className="flex justify-between px-4"><span className="opacity-50">Integrity</span><span className="bg-[#010101] text-emerald px-3 py-0.5 rounded-full">Solid</span></div>
                  </div>
                </div>

                {/* Health Score */}
                <ContractHealthScore contract={contract} />

                {/* History Log */}
                <div className="p-8 rounded-[32px] bg-[#0A0A0A] border border-white/10 space-y-6">
                  <h4 className="text-[10px] font-black text-text-3 uppercase tracking-[0.4em] text-center">History</h4>
                  <div className="space-y-6">
                    {[
                      { t: '11:04', msg: 'Verified by Network' },
                      { t: '10:42', msg: 'Digital Seal Applied' },
                      { t: '09:12', msg: 'Agreement Created' }
                    ].map((log, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="text-[9px] font-black text-emerald opacity-50 whitespace-nowrap mt-0.5">{log.t}</div>
                        <p className="text-[10px] font-black text-text-3 uppercase tracking-widest group-hover:text-white transition-colors">{log.msg}</p>
                      </div>
                    ))}
                  </div>
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
