'use client';

import { useState } from 'react';
import { useContracts } from '@/store/contracts';
import { ContractStatus } from '@/lib/types';
import { EmptyState } from '@/components/EmptyState';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlass,
  Plus,
  ArrowUpRight,
  Globe as PhosphorGlobe
} from "@phosphor-icons/react";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { RadialProgress } from '@/components/ui/radial-progress';

const STATUS_LABEL: Record<ContractStatus, string> = {
  active: 'Active',
  pending_signature: 'Pending',
  draft: 'Draft',
  completed: 'Completed',
  disputed: 'Disputed',
  expired: 'Expired',
};

const STATUS_DOT: Record<ContractStatus, string> = {
  active: 'bg-emerald-500',
  pending_signature: 'bg-yellow-500',
  draft: 'bg-gray-400',
  completed: 'bg-blue-500',
  disputed: 'bg-red-500',
  expired: 'bg-gray-400',
};

// Filter logic below

export default function ContractsPage() {
  const router = useRouter();
  const { contracts } = useContracts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ContractStatus | 'all'>('all');

  const filtered = contracts.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      c.title.toLowerCase().includes(q) ||
      c.parties.some(p => p.name.toLowerCase().includes(q)) ||
      c.jurisdiction.toLowerCase().includes(q);
    const matchStatus = filter === 'all' || c.status === filter;
    return matchSearch && matchStatus;
  });

  const totalOwed = filtered.reduce((sum, c) => {
    const outstanding = c.paymentSchedule.filter(p => ['pending', 'overdue'].includes(p.status)).reduce((s, p) => s + p.amount, 0);
    return sum + outstanding;
  }, 0);

  const activeCount = contracts.filter(c => c.status === 'active').length;

  return (
    <div className="px-8 py-12 md:px-16 md:py-16 bg-[var(--bg)] min-h-full selection:bg-[var(--text-1)] selection:text-[var(--bg)] overflow-x-hidden">
      {/* ─── Header: My Contracts ────────────────── */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 pb-14 border-b border-[var(--text-1)] border-opacity-30 mb-16">
        <div className="max-w-4xl">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--blue)] mb-8">
            My Contracts &middot; {contracts.length} Total Contracts
          </p>
          <h1 className="text-6xl md:text-[6rem] lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.85] text-[var(--text-1)] mb-10">
            My<br/>Contracts.
          </h1>
          <div className="flex items-center gap-6">
            <div className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--text-1)]">
              {activeCount} Active Contract{activeCount !== 1 ? 's' : ''}
            </div>
            {totalOwed > 0 && (
              <>
                <div className="w-2.5 h-2.5 bg-gray-300" />
                <div className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--text-1)]">
                  ${totalOwed.toLocaleString()} Outstanding Amount
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-[var(--blue)] rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <Link href="/contracts/new" className="relative block">
            <button className="bg-[var(--color-white)]/80 backdrop-blur-md border border-[var(--bg)]/50 text-[var(--text-1)] px-8 py-5 font-black uppercase tracking-[0.2em] text-sm flex items-center gap-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 transition-all">
              <Plus size={20} weight="bold" className="text-[var(--blue)]" /> New Agreement
            </button>
          </Link>
        </div>
      </div>

      {/* ─── Search & Stream (Brutalist) ────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 relative z-10 p-1">
        <div className="relative w-full md:max-w-xl group">
          <MagnifyingGlass size={20} weight="bold" className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-1)] z-10" />
          <input
            type="text"
            placeholder="Search Contracts..."
            className="w-full h-16 bg-[var(--color-white)] border-4 border-[var(--text-1)] pl-16 pr-6 font-black uppercase tracking-[0.2em] text-lg text-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] focus:outline-none placeholder-[var(--text-3)] transition-all focus:shadow-[8px_8px_0_0_var(--blue)] focus:-translate-y-1 focus:-translate-x-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex overflow-x-auto no-scrollbar items-center gap-2 bg-[var(--bg)] p-2 border-4 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] w-full lg:w-auto">
          {['all', 'active', 'pending_signature', 'draft', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as ContractStatus | 'all')}
              className={cn(
                "px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 border-transparent",
                filter === f
                  ? "bg-[var(--text-1)] text-[var(--bg)] shadow-none"
                  : "text-[var(--text-2)] hover:border-[var(--text-1)] hover:bg-[var(--color-white)] bg-transparent"
              )}
            >
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Data Ledger ───────────────────────────────────── */}
      <div className="border-2 border-[var(--text-1)] bg-transparent overflow-hidden">
        <div className="p-8 md:p-12 border-b-2 border-[var(--text-1)] bg-[var(--color-white)]">
          <h2 className="text-4xl md:text-[3.5rem] uppercase font-black tracking-tighter text-[var(--text-1)] leading-none">
            Contracts List
          </h2>
        </div>

        <div className="overflow-x-auto custom-scrollbar bg-[var(--color-white)]">
          {filtered.length === 0 ? (
            <EmptyState 
              title="No Contracts Found" 
              description="No contracts match your current search." 
              actionLabel="New Agreement" 
              actionHref="/contracts/new"
              className="m-8 border-none shadow-none"
            />
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[var(--text-1)] bg-[var(--bg)]">
                  <th className="px-6 lg:px-12 py-8 text-left text-[11px] font-black uppercase tracking-[0.25em] text-[var(--text-3)] whitespace-nowrap">Status</th>
                  <th className="px-6 lg:px-12 py-8 text-left text-[11px] font-black uppercase tracking-[0.25em] text-[var(--text-3)] whitespace-nowrap">Contract Title</th>
                  <th className="px-6 lg:px-12 py-8 text-left text-[11px] font-black uppercase tracking-[0.25em] text-[var(--text-3)] hidden sm:table-cell whitespace-nowrap">Parties</th>
                  <th className="px-6 lg:px-12 py-8 text-left text-[11px] font-black uppercase tracking-[0.25em] text-[var(--text-3)] hidden xl:table-cell whitespace-nowrap">Jurisdiction</th>
                  <th className="px-6 lg:px-12 py-8 text-right text-[11px] font-black uppercase tracking-[0.25em] text-[var(--text-3)] whitespace-nowrap">Amount</th>
                  <th className="px-6 lg:px-12 py-8 text-left text-[11px] font-black uppercase tracking-[0.25em] text-[var(--text-3)] hidden md:table-cell whitespace-nowrap">Progress</th>
                  <th className="px-6 lg:px-12 py-8 text-left text-[11px] font-black uppercase tracking-[0.25em] text-[var(--text-3)] hidden lg:table-cell whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--text-1)] divide-opacity-30">
                {filtered.map(c => {
                  const paid = c.paymentSchedule.filter(p => p.status === 'paid').length;
                  const total = c.paymentSchedule.length;
                  return (
                    <motion.tr
                      key={c.id}
                      onClick={() => router.push(`/contracts/${c.id}`)}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="group cursor-pointer hover:bg-[#F0F0F2] transition-colors"
                    >
                      <td className="px-6 lg:px-12 py-8">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-3 h-3 rounded-full border border-[var(--text-1)]/10",
                            STATUS_DOT[c.status]
                          )} />
                          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-1)]">
                            {STATUS_LABEL[c.status]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 lg:px-12 py-8">
                        <div className="max-w-[150px] md:max-w-[250px] lg:max-w-none">
                          <div className="font-black text-base md:text-xl text-[var(--text-1)] uppercase tracking-tighter leading-none mb-2 group-hover:text-[var(--blue)] transition-colors truncate">
                            {c.title}
                          </div>
                          <div className="text-[9px] font-black text-[var(--text-3)] uppercase tracking-[0.25em] truncate">
                            {c.category}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 lg:px-12 py-8 hidden sm:table-cell">
                        <div className="max-w-[150px] lg:max-w-[250px] text-sm font-black text-[var(--text-2)] uppercase tracking-tight truncate">
                          {c.parties.map(p => p.name).join(' // ')}
                        </div>
                      </td>
                      <td className="px-6 lg:px-12 py-8 hidden xl:table-cell">
                        <div className="inline-flex items-center gap-3 text-[11px] font-black text-[var(--text-1)] uppercase tracking-widest">
                          <PhosphorGlobe size={16} weight="bold" className="text-[var(--text-3)]" />
                          {c.jurisdiction || 'ROOT'}
                        </div>
                      </td>
                      <td className="px-6 lg:px-12 py-8 text-right">
                        <div className="font-serif font-black text-xl md:text-2xl text-[var(--text-1)] leading-none tabular-nums">
                          {c.totalAmount ? `$${c.totalAmount.toLocaleString()}` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 lg:px-12 py-8 hidden md:table-cell">
                        {total > 0 ? (
                          <div className="flex items-center gap-4">
                            <RadialProgress pct={(paid/total)*100} size={36} stroke={4} color="var(--blue)" className="drop-shadow-none" />
                            <span className="text-[11px] font-black text-[var(--text-1)] tabular-nums tracking-widest">{paid}/{total}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-[var(--text-3)] uppercase tracking-[0.25em]">IMMUTABLE</span>
                        )}
                      </td>
                      <td className="px-6 lg:px-12 py-8 hidden lg:table-cell">
                        <div className="text-[10px] font-black text-[var(--text-3)] uppercase tracking-[0.25em] flex items-center gap-3">
                          {new Date(c.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\//g, '.')}
                          <ArrowUpRight size={16} weight="bold" className="text-[var(--text-1)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
