'use client';

import { useParams, useRouter } from 'next/navigation';
import { useContracts } from '@/store/contracts';
import { ArrowLeft, Download, Send, AlertTriangle, CheckCircle, Clock, DollarSign, Scale, FileText, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const escalationLabels = {
  friendly_reminder: { label: 'Friendly Reminder', class: 'esc-amber', iconColor: 'text-amber-500', desc: 'A polite message reminding the party of their obligation.' },
  formal_notice: { label: 'Formal Notice', class: 'esc-orange', iconColor: 'text-orange-500', desc: 'An official written notice citing the specific clause breached.' },
  demand_letter: { label: 'Demand Letter', class: 'esc-red', iconColor: 'text-red-500', desc: 'A legal demand letter requesting immediate action or payment.' },
  legal_action: { label: 'Legal Action', class: 'esc-critical', iconColor: 'text-rose-600', desc: 'Step-by-step guide to filing in small claims court or arbitration.' },
};

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getContract, updatePaymentStatus, triggerEscalation } = useContracts();
  const contract = getContract(params.id as string);

  if (!contract) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Contract not found</h1>
        <Link href="/contracts" className="text-teal-600">Back to contracts</Link>
      </div>
    );
  }

  const totalPaid = contract.paymentSchedule.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.paidAmount || p.amount), 0);
  const totalRemaining = (contract.totalAmount || 0) - totalPaid;
  const progressPct = contract.totalAmount ? (totalPaid / contract.totalAmount) * 100 : 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="serif" style={{ fontSize: '2rem', color: 'var(--text-1)' }}>{contract.title}</h1>
            <span className={`badge text-xs ${contract.status === 'active' ? 'badge-success' : contract.status === 'pending_signature' ? 'badge-warning' : 'badge-primary'}`}>
              {contract.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-slate-500 text-sm">{contract.category} &middot; {contract.jurisdiction}</p>
        </div>
        <button className="btn-ghost flex items-center gap-2"><Download className="w-4 h-4" /> Download PDF</button>
        <button className="btn-primary flex items-center gap-2"><Send className="w-4 h-4" /> Share</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Parties */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4"><Users className="w-5 h-5 text-teal-600" /><h2 className="text-lg font-semibold">Parties</h2></div>
            <div className="grid grid-cols-2 gap-4">
              {contract.parties.map(party => (
                <div key={party.id} className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-semibold text-slate-900 text-sm">{party.name}</p>
                  <p className="text-xs text-slate-500">{party.role === 'creator' ? 'Creator' : 'Counterparty'}</p>
                  {party.email && <p className="text-xs text-slate-500">{party.email}</p>}
                  <div className="mt-2">
                    {party.signedAt ? (
                      <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle className="w-3 h-3" /> Signed {new Date(party.signedAt).toLocaleDateString()}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600"><Clock className="w-3 h-3" /> Awaiting signature</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clauses */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-teal-600" /><h2 className="text-lg font-semibold">Contract Clauses</h2></div>
            <div className="space-y-4">
              {contract.clauses.map((clause, i) => (
                <div key={clause.id} className="p-4 border border-slate-100 rounded-lg">
                  <h4 className="font-semibold text-sm text-slate-800">{i + 1}. {clause.title}</h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{clause.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Governing Law */}
          <div className="card p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2"><Scale className="w-5 h-5 text-blue-600" /><h2 className="text-lg font-semibold text-blue-900">Governing Law</h2></div>
            <p className="text-sm text-blue-700">{contract.governingLaw}</p>
            <p className="text-xs text-blue-500 mt-1">Jurisdiction: {contract.jurisdiction}</p>
          </div>
        </div>

        {/* Sidebar: Payments + Escalation */}
        <div className="space-y-6">
          {/* Payment Overview */}
          {contract.totalAmount && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4"><DollarSign className="w-5 h-5 text-teal-600" /><h2 className="text-lg font-semibold">Payments</h2></div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-semibold">{progressPct.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Paid: ${totalPaid.toLocaleString()}</span>
                  <span>Remaining: ${totalRemaining.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                {contract.paymentSchedule.map(payment => (
                  <div key={payment.id} className={`p-3 rounded-lg border ${payment.status === 'paid' ? 'bg-green-50 border-green-100' : payment.status === 'overdue' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">${payment.amount}</p>
                        <p className="text-xs text-slate-500">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                      </div>
                      {payment.status === 'paid' ? (
                        <span className="badge badge-success text-xs">Paid</span>
                      ) : payment.status === 'overdue' ? (
                        <button onClick={() => updatePaymentStatus(contract.id, payment.id, 'paid', payment.amount)} className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">Mark Paid</button>
                      ) : (
                        <button onClick={() => updatePaymentStatus(contract.id, payment.id, 'paid', payment.amount)} className="text-xs px-2 py-1 bg-teal-600 text-white rounded hover:bg-teal-700">Mark Paid</button>
                      )}
                    </div>
                    {payment.note && <p className="text-xs text-slate-500 mt-1">{payment.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Escalation Engine */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5 text-amber-600" /><h2 className="text-lg font-semibold">Smart Escalation</h2></div>
            <p className="text-xs text-slate-500 mb-4">AI-guided steps if the other party defaults or breaches terms.</p>

            {contract.escalation.length > 0 && (
              <div className="space-y-2 mb-4">
                {contract.escalation.map((esc, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${escalationLabels[esc.level].class}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className={`w-4 h-4 ${escalationLabels[esc.level].iconColor}`} />
                      <p className="font-semibold text-sm">{escalationLabels[esc.level].label}</p>
                    </div>
                    <p className="text-xs opacity-90 mt-1">{esc.message}</p>
                    {esc.triggeredAt && <p className="text-[10px] opacity-70 mt-3 uppercase tracking-wider font-bold">Sent: {new Date(esc.triggeredAt).toLocaleDateString()}</p>}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {Object.entries(escalationLabels).map(([key, val]) => {
                const alreadyTriggered = contract.escalation.some(e => e.level === key);
                return (
                  <button
                    key={key}
                    disabled={alreadyTriggered}
                    onClick={() => triggerEscalation(contract.id, key as keyof typeof escalationLabels, `Auto-generated ${val.label.toLowerCase()} for contract: ${contract.title}`)}
                    className={`w-full text-left p-4 rounded-xl border transition-all 
                      ${alreadyTriggered
                        ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-100'
                        : `${val.class} cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-md`
                      }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-current opacity-40`} />
                        <span className="font-bold text-sm tracking-tight">{val.label}</span>
                      </div>
                      <ChevronRight size={14} className="opacity-50" />
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-80 mt-2">{val.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
