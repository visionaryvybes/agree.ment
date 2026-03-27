'use client';

import { useContracts } from '@/store/contracts';
import {
  PlusCircle, Files, MagnifyingGlass, CaretRight,
  ShieldCheck, Clock, Warning, ArrowRight, FunnelSimple,
} from "@phosphor-icons/react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'active' | 'pending' | 'disputed';

function categoryColor(cat = '') {
  const c = cat.toLowerCase();
  if (c.includes('service'))                           return 'emerald';
  if (c.includes('loan') || c.includes('financial'))  return 'amber';
  if (c.includes('sale') || c.includes('tech'))       return 'blue';
  return 'rose';
}

const colorMap = {
  emerald: { text: 'text-emerald', hoverBg: 'group-hover:bg-emerald', hoverBorder: 'group-hover:border-emerald/40', glow: 'group-hover:shadow-[0_0_20px_rgba(0,255,209,0.12)]', light: false },
  amber:   { text: 'text-amber',   hoverBg: 'group-hover:bg-amber',   hoverBorder: 'group-hover:border-amber/40',   glow: 'group-hover:shadow-[0_0_20px_rgba(255,184,0,0.12)]',   light: false },
  blue:    { text: 'text-blue',    hoverBg: 'group-hover:bg-blue',    hoverBorder: 'group-hover:border-blue/40',    glow: 'group-hover:shadow-[0_0_20px_rgba(0,112,255,0.12)]',    light: true  },
  rose:    { text: 'text-rose',    hoverBg: 'group-hover:bg-rose',    hoverBorder: 'group-hover:border-rose/40',    glow: 'group-hover:shadow-[0_0_20px_rgba(255,0,110,0.12)]',    light: true  },
} as const;

export default function ContractsPage() {
  const { contracts = [] } = useContracts();
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState<Filter>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filtered = contracts.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all'      ? true :
      filter === 'active'   ? c.status === 'active' :
      filter === 'pending'  ? c.status === 'pending_signature' :
                              c.status === 'disputed';
    return matchSearch && matchFilter;
  });

  if (!mounted) return <div className="min-h-screen bg-[#010101]" />;

  return (
    <div className="space-y-7 pb-24 max-w-6xl mx-auto relative">

      {/* Glows */}
      <div className="vibrant-glow top-0 right-1/4 w-[400px] h-[400px] bg-emerald/[0.06] animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 left-1/4 w-[350px] h-[350px] bg-blue/[0.05]" />

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.07] relative z-10">
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-[10px] font-black text-emerald uppercase tracking-[0.4em] block mb-1">Your Documents</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight italic uppercase">All Deals.</h1>
        </motion.div>
        <Link
          href="/contracts/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_16px_rgba(0,255,209,0.2)] self-start sm:self-auto"
        >
          <PlusCircle size={15} weight="bold" />
          New Agreement
        </Link>
      </header>

      {/* ── SEARCH + FILTERS ───────────────────────────────────────── */}
      <div className="space-y-4 relative z-10">
        {/* Search */}
        <div className="relative group">
          <MagnifyingGlass
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-emerald transition-colors"
            size={15} weight="bold"
          />
          <input
            type="text"
            placeholder="Search agreements…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl py-3 pl-10 pr-4 text-[12px] font-medium tracking-wide text-white placeholder:text-white/20 focus:outline-none focus:border-emerald/40 focus:bg-white/[0.05] transition-all"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <FunnelSimple size={13} weight="bold" className="text-white/25 flex-shrink-0" />
          {(['all', 'active', 'pending', 'disputed'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300',
                filter === f
                  ? 'bg-emerald text-[#010101] border-emerald shadow-[0_0_16px_rgba(0,255,209,0.25)]'
                  : 'bg-white/[0.03] border-white/[0.07] text-white/35 hover:text-white hover:border-white/20',
              )}
            >
              {f === 'all' ? 'All' : f === 'pending' ? 'Pending Sign' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          {search && (
            <span className="text-[10px] font-bold text-white/25 ml-auto">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* ── CONTRACT LIST ───────────────────────────────────────────── */}
      <div className="space-y-3 relative z-10">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((contract, i) => {
              const col = categoryColor(contract.category);
              const cm  = colorMap[col];
              return (
                <motion.div
                  key={contract.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                >
                  <Link
                    href={`/contracts/${contract.id}`}
                    className={cn(
                      'group flex items-center gap-4 p-4 sm:p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl transition-all duration-400 relative overflow-hidden',
                      cm.hoverBorder, cm.glow,
                    )}
                  >
                    {/* Subtle hover glow */}
                    <div className={cn('absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-15 transition-opacity pointer-events-none', cm.text.replace('text-', 'bg-'))} />

                    {/* Icon */}
                    <div className={cn('w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/25 flex-shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:rotate-6', cm.hoverBg, cm.light ? 'group-hover:text-white' : 'group-hover:text-[#010101]')}>
                      <Files size={18} weight="bold" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={cn('text-sm font-black text-white truncate tracking-tight transition-colors', cm.text.replace('text-', 'group-hover:text-'))}>{contract.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={cn('text-[9px] font-black uppercase tracking-[0.2em] opacity-60', cm.text)}>{contract.category}</span>
                        <span className="text-white/10">·</span>
                        <span className="text-[9px] text-white/20 font-mono">{contract.id.slice(0, 10).toUpperCase()}</span>
                        <span className="text-white/10 hidden sm:inline">·</span>
                        <span className="text-[9px] text-white/20 hidden sm:inline">
                          {new Date(contract.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Status + Arrow */}
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className={cn('badge-vibrant hidden sm:inline-flex',
                        contract.status === 'active'            ? 'badge-active' :
                        contract.status === 'pending_signature' ? 'badge-pending' : 'badge-disputed',
                      )}>
                        {contract.status.replace('_', ' ')}
                      </span>
                      {/* Mobile dot */}
                      <span className={cn('sm:hidden w-2 h-2 rounded-full flex-shrink-0',
                        contract.status === 'active'            ? 'bg-emerald' :
                        contract.status === 'pending_signature' ? 'bg-blue' : 'bg-rose',
                      )} />
                      <div className={cn('w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center flex-shrink-0 group-hover:translate-x-0.5 transition-all duration-400', cm.hoverBg, 'group-hover:border-transparent')}>
                        <CaretRight size={13} weight="bold" className={cn('text-white/25 transition-colors', cm.light ? 'group-hover:text-white' : 'group-hover:text-[#010101]')} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center border border-white/[0.06]">
                <MagnifyingGlass size={24} weight="bold" className="text-white/20" />
              </div>
              <div>
                <p className="text-sm font-black text-white/20 uppercase tracking-widest">
                  {search ? 'No matching deals' : 'Archive empty'}
                </p>
                <p className="text-xs text-white/15 mt-1">
                  {search ? 'Try a different search term.' : 'Create your first agreement to get started.'}
                </p>
              </div>
              {!search && (
                <Link href="/contracts/new" className="mt-2 inline-flex items-center gap-2 text-emerald text-[11px] font-black uppercase tracking-widest hover:opacity-75 transition-opacity">
                  Create Agreement <ArrowRight size={12} weight="bold" />
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
