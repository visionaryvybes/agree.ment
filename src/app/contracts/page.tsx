'use client';

import { useState } from 'react';
import { useContracts } from '@/store/contracts';
import { ContractStatus } from '@/lib/types';
import Link from 'next/link';
import { Search, Filter, Plus } from 'lucide-react';

const statusColors: Record<ContractStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  pending_signature: 'bg-amber-100 text-amber-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  disputed: 'bg-red-100 text-red-700',
  expired: 'bg-slate-100 text-slate-500',
};

export default function ContractsPage() {
  const { contracts } = useContracts();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');

  const filtered = contracts.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.parties.some(p => p.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Contracts</h1>
          <p className="text-slate-500 mt-1">{contracts.length} total agreements</p>
        </div>
        <Link href="/contracts/new" className="btn-primary flex items-center gap-2 no-underline"><Plus className="w-4 h-4" /> New Agreement</Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input className="input pl-10" placeholder="Search by title or party name..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'active', 'pending_signature', 'draft', 'completed', 'disputed'] as const).map(status => (
            <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-2 rounded-lg text-xs font-medium ${statusFilter === status ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(contract => {
          const paidCount = contract.paymentSchedule.filter(p => p.status === 'paid').length;
          const totalPayments = contract.paymentSchedule.length;
          return (
            <Link key={contract.id} href={`/contracts/${contract.id}`} className="card p-5 flex items-center gap-5 hover:border-teal-300 no-underline group">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${contract.status === 'active' ? 'bg-green-500' : contract.status === 'pending_signature' ? 'bg-amber-500' : contract.status === 'disputed' ? 'bg-red-500' : 'bg-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 text-sm group-hover:text-teal-600">{contract.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{contract.parties.map(p => p.name).join(' & ')} &middot; {contract.jurisdiction}</p>
              </div>
              <div className="hidden md:block text-right">
                {contract.totalAmount && <p className="font-semibold text-slate-900 text-sm">${contract.totalAmount.toLocaleString()}</p>}
                {totalPayments > 0 && <p className="text-xs text-slate-500">{paidCount}/{totalPayments} payments</p>}
              </div>
              <span className={`badge text-xs ${statusColors[contract.status]}`}>{contract.status.replace('_', ' ')}</span>
              <span className="badge badge-primary text-xs">{contract.category}</span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Filter className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500">No contracts found</p>
          <Link href="/contracts/new" className="text-teal-600 text-sm">Create your first agreement</Link>
        </div>
      )}
    </div>
  );
}
