import { useParams, useRouter } from 'next/navigation';
import { useContracts } from '@/store/contracts';
import {
  ArrowLeft,
  DownloadSimple,
  PaperPlaneTilt,
  Warning,
  CheckCircle,
  Clock,
  CurrencyDollar,
  Scales,
  FileText,
  Users,
  CaretRight,
  ShieldCheck,
  Signature as PhosphorSignature,
  FileX,
  Check,
  ShareNetwork,
  Download
} from "@phosphor-icons/react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/empty-state';
import { cn } from '@/lib/utils';

const escalationLabels = {
  friendly_reminder: { label: 'Friendly Reminder', class: 'bg-amber-50 border-amber-200 text-amber-900', iconColor: 'text-amber-500', desc: 'A polite message reminding the party of their obligation.' },
  formal_notice: { label: 'Formal Notice', class: 'bg-orange-50 border-orange-200 text-orange-900', iconColor: 'text-orange-500', desc: 'An official written notice citing the specific clause breached.' },
  demand_letter: { label: 'Demand Letter', class: 'bg-red-50 border-red-200 text-red-900', iconColor: 'text-red-500', desc: 'A legal demand letter requesting immediate action or payment.' },
  legal_action: { label: 'Legal Action', class: 'bg-black text-white border-black', iconColor: 'text-white', desc: 'Step-by-step guide to filing in small claims court or arbitration.' },
};

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'secondary'> = {
  active: 'success',
  pending_signature: 'warning',
  completed: 'info',
  disputed: 'danger',
  draft: 'secondary',
  expired: 'secondary',
};

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getContract, updatePaymentStatus, triggerEscalation } = useContracts();
  const contract = getContract(params.id as string);

  if (!contract) {
    return (
      <div className="p-12">
        <EmptyState
          icon={<FileX size={48} weight="duotone" className="text-[var(--text-3)]" />}
          title="Contract not found"
          description="This record does not exist or has been retracted from the jurisdiction."
          actionLabel="Return to Portfolio"
          actionHref="/contracts"
        />
      </div>
    );
  }

  const totalPaid = contract.paymentSchedule.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.paidAmount || p.amount), 0);
  const totalRemaining = (contract.totalAmount || 0) - totalPaid;
  const progressPct = contract.totalAmount ? (totalPaid / contract.totalAmount) * 100 : 0;

  const handleMarkPaid = (paymentId: string, amount: number) => {
    updatePaymentStatus(contract.id, paymentId, 'paid', amount);
    toast({
      title: "Transaction Verified",
      description: `$${amount.toLocaleString()} has been logged in the audit trail.`,
    });
  };

  const handleEscalation = (key: string, label: string) => {
    triggerEscalation(contract.id, key as keyof typeof escalationLabels, `Enforcement sequence: ${label} initialized for record ${contract.title}.`);
    toast({
      title: "Enforcement Initialized",
      description: `${label} sequence is now active.`,
    });
  };

  return (
    <div className="p-12 lg:p-16 bg-[var(--bg)] min-h-full">
      {/* ─── Header: Protocol Command ────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-16 border-b-4 border-[var(--text-1)] mb-16">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--blue)] mb-6">
            Operational Record &middot; UUID_{contract.id.slice(0, 8).toUpperCase()}
          </p>
          <div className="flex items-center gap-8 mb-6">
            <h1 className="heading-display">{contract.title}.</h1>
            <div className={cn(
              "px-4 py-2 border-4 font-black text-[10px] uppercase tracking-widest bg-white shadow-[4px_4px_0_0_black]",
              contract.status === 'active' ? "border-emerald-600 text-emerald-600" :
                contract.status === 'disputed' ? "border-red-600 text-red-600" :
                  "border-[var(--text-1)] text-[var(--text-1)]"
            )}>
              {contract.status.replace('_', ' ')}
            </div>
          </div>
          <p className="text-2xl text-[var(--text-2)] font-bold tracking-tight">
            {contract.category} &middot; <span className="text-[var(--text-1)]">{contract.jurisdiction} Framework</span>
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button className="brutalist-button h-16 px-8 text-[10px] bg-white border-4 shadow-[4px_4px_0_0_black]">
            <DownloadSimple size={20} weight="bold" />
            Export Protocol
          </button>
          <button className="brutalist-button h-16 px-8 text-[10px] bg-[var(--text-1)] text-white border-4 shadow-[4px_4px_0_0_black] hover:shadow-[6px_6px_0_0_black]">
            <ShareNetwork size={20} weight="bold" />
            Broadcast Link
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        {/* ─── Main Enforcement Center ────────────────────────── */}
        <div className="lg:col-span-2 space-y-16">

          {/* Action Block: Parties */}
          <section className="brutalist-card bg-white border-4 overflow-hidden">
            <div className="p-8 border-b-4 border-[var(--text-1)] bg-[var(--bg)] flex items-center justify-between">
              <h2 className="heading-section text-2xl uppercase font-black">Entity Verification</h2>
              <Users size={28} weight="bold" className="text-[var(--text-1)]" />
            </div>
            <div className="p-10 grid md:grid-cols-2 gap-10">
              {contract.parties.map(party => (
                <div key={party.id} className="p-8 border-4 border-[var(--text-1)] bg-white group hover:bg-[var(--bg)] transition-colors relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 border-4 border-[var(--text-1)] bg-[var(--bg)] flex items-center justify-center font-black text-2xl text-[var(--text-1)]">
                      {party.name.charAt(0)}
                    </div>
                    {party.signedAt ? (
                      <div className="flex items-center gap-3 px-4 py-2 bg-emerald-100 border-2 border-emerald-600 text-emerald-600 font-black text-[9px] uppercase tracking-widest">
                        <Check size={14} weight="bold" />
                        Verified
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-2 bg-amber-100 border-2 border-amber-600 text-amber-600 font-black text-[9px] uppercase tracking-widest">
                        <Clock size={14} weight="bold" />
                        Awaiting
                      </div>
                    )}
                  </div>
                  <h3 className="font-black text-[var(--text-1)] text-2xl mb-2 uppercase tracking-tight leading-none">{party.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--blue)] mb-10">{party.role === 'creator' ? 'Architect (Origin)' : 'Target Node'}</p>

                  <div className="pt-6 border-t-2 border-[var(--text-1)] opacity-40">
                    <p className="text-[9px] font-black uppercase tracking-widest m-0">
                      {party.signedAt
                        ? `Captured: ${new Date(party.signedAt).toLocaleString().toUpperCase()}`
                        : "Verification String Pending."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Action Block: Clauses */}
          <section className="brutalist-card bg-white border-4 overflow-hidden">
            <div className="p-8 border-b-4 border-[var(--text-1)] bg-[var(--bg)] flex items-center justify-between">
              <h2 className="heading-section text-2xl uppercase font-black">Structural Fragments</h2>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{contract.clauses.length} Active Nodes</span>
                <FileText size={28} weight="bold" className="text-[var(--text-1)]" />
              </div>
            </div>
            <div className="divide-y-4 divide-[var(--text-1)]">
              {contract.clauses.map((clause, i) => (
                <div key={clause.id} className="p-12 hover:bg-[var(--bg)] transition-colors">
                  <div className="flex gap-10">
                    <span className="text-sm font-black text-[var(--blue)] tabular-nums mt-1">PROTO_0{i + 1}</span>
                    <div className="space-y-6 flex-1">
                      <h4 className="heading-section text-2xl uppercase font-black leading-none">{clause.title}</h4>
                      <p className="text-lg font-bold text-[var(--text-1)] leading-relaxed tracking-tight border-l-4 border-[var(--text-1)] pl-8">{clause.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Governing Law Context */}
          <section className="bg-[var(--text-1)] text-white border-4 p-12 relative overflow-hidden shadow-[12px_12px_0_0_#1447E6]">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Scales size={160} weight="bold" />
            </div>
            <div className="relative z-10 max-w-2xl space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Binding Jurisdictional Shell</p>
              <h3 className="heading-section text-5xl text-white uppercase">{contract.governingLaw}</h3>
              <div className="flex items-center gap-6">
                <span className="px-6 py-2 bg-white/10 border-4 border-white/20 text-[11px] font-black uppercase tracking-[0.2em]">{contract.jurisdiction} Deployment</span>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Verified Logic &middot; Ver 4.2RC</span>
              </div>
            </div>
          </section>
        </div>

        {/* ─── Sidebar: Records & Enforcement ───────────────────── */}
        <div className="space-y-16">

          {/* Financial Ledger Block */}
          {contract.totalAmount && (
            <section className="brutalist-card bg-white border-4 overflow-hidden">
              <div className="p-8 border-b-4 border-[var(--text-1)] bg-[var(--bg)] flex items-center justify-between">
                <h2 className="heading-section text-2xl uppercase font-black leading-none">Financial Ledger</h2>
                <CurrencyDollar size={28} weight="bold" className="text-[var(--text-1)]" />
              </div>
              <div className="p-10 space-y-10">
                <div className="p-8 border-4 border-[var(--text-1)] bg-[var(--bg)] space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">Audit Progress</div>
                      <div className="text-5xl font-black text-[var(--text-1)] tabular-nums">{progressPct.toFixed(0)}%</div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">Settled Liquidity</div>
                      <div className="text-2xl font-black text-[var(--text-1)] tabular-nums">${totalPaid.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="w-full h-8 bg-white border-4 border-[var(--text-1)] p-1">
                    <div className="h-full bg-[var(--blue)] border-r-4 border-[var(--text-1)] transition-all duration-1000" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                <div className="space-y-6">
                  {contract.paymentSchedule.map(payment => (
                    <div key={payment.id} className={cn(
                      "p-6 border-4 transition-all",
                      payment.status === 'paid' ? "bg-emerald-50 border-emerald-600" :
                        payment.status === 'overdue' ? "bg-red-50 border-red-600 animate-pulse" :
                          "bg-white border-[var(--text-1)] shadow-[4px_4px_0_0_black]"
                    )}>
                      <div className="flex justify-between items-center mb-0">
                        <div className="space-y-1">
                          <div className="font-black text-[var(--text-1)] text-2xl tabular-nums leading-none tracking-tighter">${payment.amount.toLocaleString()}</div>
                          <p className="text-[9px] font-black text-[var(--text-3)] uppercase tracking-widest">ENFORCEMENT: {new Date(payment.dueDate).toLocaleDateString().toUpperCase()}</p>
                        </div>
                        {payment.status === 'paid' ? (
                          <div className="bg-emerald-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 border-2 border-black">Verified</div>
                        ) : (
                          <button
                            onClick={() => handleMarkPaid(payment.id, payment.amount)}
                            className={cn(
                              "brutalist-button h-12 px-6 text-[9px]",
                              payment.status === 'overdue' ? "bg-red-600 text-white" : "bg-[var(--text-1)] text-white"
                            )}
                          >
                            Execute
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Smart Enforcement Engine */}
          <section className="brutalist-card bg-white border-4 overflow-hidden shadow-[16px_16px_0_0_rgba(0,0,0,0.05)]">
            <div className="p-8 border-b-4 border-[var(--text-1)] flex items-center justify-between bg-[var(--bg)]">
              <h2 className="heading-section text-2xl uppercase font-black">Enforcement Protocols</h2>
              <Warning size={28} weight="bold" className="text-red-600" />
            </div>
            <div className="p-10 space-y-10">
              <p className="text-[13px] font-bold text-[var(--text-1)] uppercase leading-relaxed tracking-tight border-b-4 border-[var(--bg)] pb-8">Active breach resolution vectors based on international arbitration standards.</p>

              {contract.escalation.length > 0 && (
                <div className="space-y-6">
                  {contract.escalation.map((esc, i) => (
                    <div key={i} className={cn("p-8 border-4 bg-white", escalationLabels[esc.level].class.replace('bg-', 'bg-transparent border-'))}>
                      <div className="flex items-center gap-4 mb-4">
                        <CheckCircle size={24} weight="bold" className={escalationLabels[esc.level].iconColor} />
                        <span className="font-black text-sm uppercase tracking-[0.2em]">Sequence Triggered</span>
                      </div>
                      <p className="text-sm font-black leading-relaxed mb-6 uppercase tracking-tight">{esc.message}</p>
                      <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">TIMESTAMP: {new Date(esc.triggeredAt || '').toLocaleString().toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4 pt-4">
                {Object.entries(escalationLabels).map(([key, val]) => {
                  const alreadyTriggered = contract.escalation.some(e => e.level === key);
                  return (
                    <Dialog key={key}>
                      <DialogTrigger asChild>
                        <button
                          disabled={alreadyTriggered}
                          className={cn(
                            "w-full text-left p-8 border-4 transition-all flex items-center justify-between group",
                            alreadyTriggered
                              ? "bg-[var(--bg)] border-[var(--text-3)] opacity-20 cursor-not-allowed"
                              : "bg-white border-[var(--text-1)] hover:bg-[var(--text-1)] hover:text-white shadow-[4px_4px_0_0_black]"
                          )}
                        >
                          <div className="space-y-2">
                            <h4 className="font-black text-lg uppercase tracking-tight leading-none transition-colors">{val.label}</h4>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 leading-none group-hover:text-white/60 transition-colors">Invoke Resolution Vector</p>
                          </div>
                          <CaretRight size={20} weight="bold" className="transition-all group-hover:translate-x-2" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="brutalist-card-flat border-8 max-w-2xl p-16">
                        <DialogHeader className="space-y-8">
                          <DialogTitle className="heading-section text-5xl uppercase font-black text-[var(--text-1)] tracking-[0.1em]">Confirm Protocol.</DialogTitle>
                          <DialogDescription className="text-xl text-[var(--text-2)] font-bold tracking-tight leading-relaxed">
                            Initialize the <span className="text-[var(--text-1)] font-black uppercase tracking-widest">{val.label}</span> sequence for protocol <span className="text-[var(--text-1)] font-black uppercase">"{contract.id.slice(0, 8)}"</span>. This action creates a permanent jurisdictional artifact.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-16 flex gap-8">
                          <DialogClose asChild>
                            <button className="brutalist-button h-20 flex-1 bg-white text-[var(--text-1)] text-[12px] border-4">DISCARD</button>
                          </DialogClose>
                          <button
                            onClick={() => handleEscalation(key, val.label)}
                            className={cn(
                              "brutalist-button h-20 flex-1 text-white text-[12px] border-4",
                              key === 'legal_action' ? "bg-red-600" : "bg-[var(--text-1)]"
                            )}
                          >
                            EXECUTE GENESIS
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
