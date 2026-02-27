'use client';

import { useContracts } from '@/store/contracts';
import Link from 'next/link';
import { FilePlus, FileText, AlertTriangle, DollarSign, TrendingUp, Clock, ArrowRight, BookOpen, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const { contracts, getStats } = useContracts();
  const stats = getStats();

  const recentContracts = contracts.slice(0, 5);
  const overduePayments = contracts
    .flatMap(c => c.paymentSchedule.map(p => ({ ...p, contractTitle: c.title, contractId: c.id })))
    .filter(p => p.status === 'overdue');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-teal-100 mt-1 text-lg">Manage your agreements, track payments, and get AI-powered legal guidance.</p>
          <div className="flex gap-3 mt-4">
            <Link href="/contracts/new" className="no-underline px-5 py-2.5 bg-white text-teal-700 rounded-lg font-semibold text-sm hover:bg-teal-50 inline-flex items-center gap-2"><FilePlus className="w-4 h-4" /> New Agreement</Link>
            <Link href="/ai" className="no-underline px-5 py-2.5 bg-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/30 backdrop-blur inline-flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Ask AI Advisor</Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/contracts/new" className="card p-5 flex items-center gap-4 group hover:border-teal-300 no-underline">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200">
            <FilePlus className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">New Agreement</h3>
            <p className="text-sm text-slate-500">Create with AI or templates</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 ml-auto group-hover:text-teal-600" />
        </Link>

        <Link href="/legal-library" className="card p-5 flex items-center gap-4 group hover:border-blue-300 no-underline">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">Legal Library</h3>
            <p className="text-sm text-slate-500">Laws & constitutions</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 ml-auto group-hover:text-blue-600" />
        </Link>

        <Link href="/ai" className="card p-5 flex items-center gap-4 group hover:border-purple-300 no-underline">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200">
            <MessageSquare className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">AI Legal Advisor</h3>
            <p className="text-sm text-slate-500">Ask legal questions</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 ml-auto group-hover:text-purple-600" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <span className="text-sm text-slate-500">Total Contracts</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalContracts}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-slate-500">Active</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.activeContracts}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-slate-500">Total Owed</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">${stats.totalOwed.toLocaleString()}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-slate-500">Overdue</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.overduePayments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contracts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Contracts</h2>
            <Link href="/contracts" className="text-sm text-teal-600 no-underline hover:text-teal-700">View all</Link>
          </div>
          <div className="space-y-3">
            {recentContracts.map(contract => (
              <Link key={contract.id} href={`/contracts/${contract.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 no-underline group">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  contract.status === 'active' ? 'bg-green-500' :
                  contract.status === 'pending_signature' ? 'bg-amber-500' :
                  contract.status === 'completed' ? 'bg-blue-500' : 'bg-slate-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{contract.title}</p>
                  <p className="text-xs text-slate-500">{contract.category} &middot; {contract.parties.map(p => p.name).join(' & ')}</p>
                </div>
                <span className={`badge text-xs ${
                  contract.status === 'active' ? 'badge-success' :
                  contract.status === 'pending_signature' ? 'badge-warning' : 'badge-primary'
                }`}>{contract.status.replace('_', ' ')}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Overdue Payments */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Overdue Payments</h2>
            {overduePayments.length > 0 && <span className="badge badge-error text-xs">{overduePayments.length} overdue</span>}
          </div>
          {overduePayments.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No overdue payments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overduePayments.map(payment => (
                <Link key={payment.id} href={`/contracts/${payment.contractId}`} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100 no-underline">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{payment.contractTitle}</p>
                    <p className="text-xs text-red-600">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold text-red-600">${payment.amount}</p>
                </Link>
              ))}
            </div>
          )}
          {overduePayments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">Smart Escalation</p>
              <div className="flex gap-2 flex-wrap">
                <button className="text-xs px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200">Friendly Reminder</button>
                <button className="text-xs px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200">Formal Notice</button>
                <button className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">Demand Letter</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
