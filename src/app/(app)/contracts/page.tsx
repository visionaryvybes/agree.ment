'use client';

import { useState } from 'react';
import { useContracts } from '@/store/contracts';
import { ContractStatus } from '@/lib/types';
import Link from 'next/link';
import {
  MagnifyingGlass,
  Plus,
  ArrowUpRight,
  Sliders,
  CaretRight,
  FileText,
  Clock,
  CheckCircle,
  Warning,
  Files,
  Globe as PhosphorGlobe
} from "@phosphor-icons/react";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const STATUS_VARIANT: Record<ContractStatus, 'success' | 'warning' | 'secondary' | 'info' | 'danger'> = {
  active: 'success',
  pending_signature: 'warning',
  draft: 'secondary',
  completed: 'info',
  disputed: 'danger',
  expired: 'secondary',
};

const STATUS_LABEL: Record<ContractStatus, string> = {
  active: 'Active',
  pending_signature: 'Pending',
  draft: 'Draft',
  completed: 'Completed',
  disputed: 'Disputed',
  expired: 'Expired',
};

const STATUS_DOT: Record<ContractStatus, string> = {
  active: 'dot-green',
  pending_signature: 'dot-amber',
  draft: 'dot-gray',
  completed: 'dot-blue',
  disputed: 'dot-red',
  expired: 'dot-gray',
};

const FILTERS: Array<{ value: ContractStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending_signature', label: 'Pending' },
  { value: 'draft', label: 'Draft' },
  { value: 'completed', label: 'Completed' },
  { value: 'disputed', label: 'Disputed' },
];

export default function ContractsPage() {
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

  return (
    <div className="p-12 lg:p-16 bg-[var(--bg)] min-h-full selection:bg-[var(--text-1)] selection:text-white">
      {/* ─── Header: Portfolio Ledger ────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-16 border-b-4 border-[var(--text-1)] mb-16">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--blue)] mb-6">
            Operational Registry &middot; {contracts.length} Secure Fragments
          </p>
          <h1 className="heading-display mb-6"> Contract Portfolio.</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-1)]">{contracts.filter(c => c.status === 'active').length} Active Protocols</span>
            </div>
            {totalOwed > 0 && (
              <>
                <div className="w-1.5 h-1.5 bg-[var(--text-1)] opacity-20" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-1)]">${totalOwed.toLocaleString()} Liquidity Gap</span>
              </>
            )}
          </div>
        </div>

        <Link
          href="/contracts/new"
          className="brutalist-button px-10 py-4 text-[10px] bg-[var(--text-1)] no-underline flex items-center gap-3 border-4 shadow-[4px_4px_0_0_black] hover:shadow-[6px_6px_0_0_black] transition-all"
        >
          <Plus size={20} weight="bold" />
          New Agreement
        </Link>
      </div>

      {/* ─── Search & Stream ─────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="flex-1 relative brutalist-card border-4">
          <MagnifyingGlass
            size={24}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-1)]"
            weight="bold"
          />
          <input
            type="text"
            placeholder="Query Registry (Title, Party, UUID)..."
            className="w-full bg-transparent p-6 pl-16 text-sm font-black uppercase tracking-tight outline-none placeholder:text-[var(--text-3)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 bg-white border-4 border-[var(--text-1)] p-2 shadow-[4px_4px_0_0_black]">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "h-12 px-6 text-[9px] font-black uppercase tracking-widest transition-all",
                filter === f.value
                  ? "bg-[var(--text-1)] text-white"
                  : "text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg)]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Data Ledger ───────────────────────────────────── */}
      <div className="brutalist-card bg-white overflow-hidden border-4">
        <div className="p-8 border-b-4 border-[var(--text-1)] bg-[var(--bg)]">
          <h2 className="heading-section text-2xl uppercase font-black leading-none">Protocol Index</h2>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-32 text-center">
              <Warning size={64} weight="bold" className="mx-auto mb-8 opacity-20" />
              <h3 className="heading-section text-2xl uppercase font-black mb-4">Registry Null</h3>
              <p className="text-[var(--text-3)] font-black uppercase tracking-[0.2em]">No fragments match the current query parameters.</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-4 border-[var(--text-1)]">
                  <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-3)]">Status</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-3)]">Fragment Title</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-3)]">Parties</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-3)]">Network</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-3)]">Valuation</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-3)]">Enforcement</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-3)]">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-[var(--text-1)]">
                {filtered.map(c => {
                  const paid = c.paymentSchedule.filter(p => p.status === 'paid').length;
                  const total = c.paymentSchedule.length;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => window.location.href = `/contracts/${c.id}`}
                      className="group cursor-pointer hover:bg-[var(--bg)] transition-colors"
                    >
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-3 h-3 border-2 border-[var(--text-1)] shadow-[1px_1px_0_0_black]",
                            STATUS_DOT[c.status].replace('dot-green', 'bg-emerald-400').replace('dot-amber', 'bg-yellow-400').replace('dot-red', 'bg-red-400').replace('dot-blue', 'bg-blue-400').replace('dot-gray', 'bg-slate-300')
                          )} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-1)]">
                            {STATUS_LABEL[c.status]}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <div className="font-black text-lg text-[var(--text-1)] uppercase tracking-tighter leading-none mb-1 group-hover:text-[var(--blue)] transition-colors">{c.title}</div>
                        <div className="text-[9px] font-black text-[var(--text-3)] uppercase tracking-widest opacity-60">{c.category}</div>
                      </td>
                      <td className="px-10 py-10 whitespace-nowrap">
                        <div className="text-sm font-bold text-[var(--text-1)] uppercase tracking-tight">
                          {c.parties.map(p => p.name).join(' // ')}
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <div className="inline-flex items-center gap-3 text-[10px] font-black text-[var(--text-1)] uppercase tracking-widest">
                          <PhosphorGlobe size={16} weight="bold" />
                          {c.jurisdiction || 'ROOT'}
                        </div>
                      </td>
                      <td className="px-10 py-10 text-right">
                        <div className="font-serif font-black text-xl text-[var(--text-1)] leading-none">
                          {c.totalAmount ? `$${c.totalAmount.toLocaleString()}` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        {total > 0 ? (
                          <div className="flex items-center gap-6">
                            <div className="w-24 h-4 bg-[var(--bg)] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_black] overflow-hidden">
                              <div
                                className="h-full bg-[var(--text-1)] transition-all duration-1000"
                                style={{ width: `${(paid / total) * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-[var(--text-1)]">{paid}/{total}</span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-black text-[var(--text-3)] uppercase tracking-widest opacity-40">IMMUTABLE</span>
                        )}
                      </td>
                      <td className="px-10 py-10 whitespace-nowrap">
                        <div className="text-[10px] font-black text-[var(--text-3)] uppercase tracking-[0.2em] flex items-center gap-4">
                          {new Date(c.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\//g, '.')}
                          <ArrowUpRight size={16} weight="bold" className="text-[var(--text-1)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                      </td>
                    </tr>
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
