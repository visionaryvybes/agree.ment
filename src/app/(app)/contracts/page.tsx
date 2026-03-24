'use client';

import { useContracts } from '@/store/contracts';
import { 
  PlusCircle, 
  Files, 
  MagnifyingGlass, 
  Funnel,
  CaretRight,
  ShieldCheck,
  Clock,
  Warning,
  ArrowRight
} from "@phosphor-icons/react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/ui/magnetic';

export default function ContractsPage() {
  const { contracts = [] } = useContracts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'disputed'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && c.status === 'active') ||
      (filter === 'pending' && c.status === 'pending_signature') ||
      (filter === 'disputed' && c.status === 'disputed');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={cn("space-y-12 pb-32 max-w-7xl mx-auto px-4 relative transition-opacity duration-1000", !mounted ? "opacity-0" : "opacity-100")}>
      <div className="vibrant-glow top-0 right-1/4 w-[600px] h-[600px] bg-emerald/10 animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 left-1/4 w-[500px] h-[500px] bg-blue/10" />

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[12px] font-black text-emerald uppercase tracking-[0.5em] mb-4 block">ALL YOUR DEALS</span>
          <h1 className="heading-display text-6xl md:text-9xl text-white tracking-tighter italic uppercase">All Deals.</h1>
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Magnetic>
            <Link href="/contracts/new" className="btn-vibrant btn-vibrant-emerald px-12">
              <PlusCircle size={24} weight="bold" />
              <span>NEW AGREEMENT</span>
            </Link>
          </Magnetic>
        </div>
      </header>

      {/* ── FILTERS & TABS ─────────────────────────────────────────── */}
      <div className="space-y-12 relative z-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-10">
          <div className="flex items-center gap-12">
            {['Active', 'Pending', 'Past'].map((tab) => (
              <button 
                key={tab}
                className={`text-[12px] font-black uppercase tracking-[0.4em] transition-all relative px-2 ${
                  tab === 'Active' ? 'text-emerald' : 'text-text-3 hover:text-white'
                }`}
              >
                {tab}
                {tab === 'Active' && (
                  <motion.div layoutId="tab" className="absolute -bottom-10 left-0 right-0 h-1.5 bg-emerald shadow-[0_0_20px_rgba(0,255,209,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
          {['all', 'active', 'pending', 'disputed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] border transition-all duration-700 whitespace-nowrap",
                filter === f 
                  ? "bg-emerald text-[#010101] border-emerald shadow-[0_0_40px_rgba(0,255,209,0.3)] scale-105" 
                  : "bg-white/5 border-white/5 text-text-3 hover:text-white hover:border-white/15"
              )}
            >
              {f === 'all' ? 'All Files' : f}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULTS ───────────────────────────────────────────────── */}
      <div className="grid gap-8 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredContracts.length > 0 ? (
            filteredContracts.map((contract, i) => (
              <motion.div
                key={contract.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
              >
                <Link 
                  href={`/contracts/${contract.id}`}
                  className={cn(
                    "group p-10 bg-white/[0.03] border border-white/5 rounded-[40px] flex flex-col md:flex-row md:items-center justify-between gap-10 transition-all duration-700 backdrop-blur-3xl relative overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]",
                    contract.category?.toLowerCase().includes('service') ? "hover:border-emerald/40" :
                    contract.category?.toLowerCase().includes('loan') || contract.category?.toLowerCase().includes('financial') ? "hover:border-amber/40" :
                    contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') ? "hover:border-blue/40" :
                    "hover:border-rose/40"
                  )}
                >
                  <div className={cn(
                    "absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity",
                    contract.category?.toLowerCase().includes('service') ? "bg-emerald" :
                    contract.category?.toLowerCase().includes('loan') || contract.category?.toLowerCase().includes('financial') ? "bg-amber" :
                    contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') ? "bg-blue" :
                    "bg-rose"
                  )} />
                  
                  <div className="flex items-center gap-10 relative z-10">
                    <div className={cn(
                      "w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-text-3 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-2xl border border-white/5",
                      contract.category?.toLowerCase().includes('service') ? "group-hover:bg-emerald group-hover:text-[#010101]" :
                      contract.category?.toLowerCase().includes('loan') || contract.category?.toLowerCase().includes('financial') ? "group-hover:bg-amber group-hover:text-[#010101]" :
                      contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') ? "group-hover:bg-blue group-hover:text-white" :
                      "group-hover:bg-rose group-hover:text-white"
                    )}>
                      <Files size={36} weight="bold" />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-white group-hover:text-emerald transition-colors uppercase italic tracking-tighter leading-none">{contract.title}</h3>
                      <div className="flex items-center gap-6 mt-3">
                        <span className={cn(
                          "text-[12px] font-black uppercase tracking-[0.2em] transition-colors",
                          contract.category?.toLowerCase().includes('service') ? "text-emerald/60" :
                          contract.category?.toLowerCase().includes('loan') || contract.category?.toLowerCase().includes('financial') ? "text-amber/60" :
                          contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') ? "text-blue/60" :
                          "text-rose/60"
                        )}>{contract.category}</span>
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <span className="text-[11px] text-text-3 font-black uppercase tracking-[0.2em] opacity-40"># {contract.id.slice(0, 12).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-12 relative z-10">
                    <div className="text-right hidden lg:block border-r border-white/10 pr-12">
                       <p className="text-[10px] font-black text-text-3 uppercase tracking-[0.4em] mb-2 opacity-50">DATE</p>
                       <p className="text-lg font-black text-white tracking-tighter">{new Date(contract.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    
                    <div className={cn(
                      "badge-vibrant px-8 py-2.5 transition-all duration-700 group-hover:scale-110",
                      contract.status === 'active' ? "badge-active text-[11px]" :
                      contract.status === 'pending_signature' ? "badge-pending text-[11px]" :
                      "badge-disputed text-[11px]"
                    )}>
                      {contract.status.replace('_', ' ')}
                    </div>

                    <div className={cn(
                      "w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-transparent group-hover:translate-x-3 transition-all duration-500 shadow-2xl",
                      contract.category?.toLowerCase().includes('service') ? "group-hover:bg-emerald" :
                      contract.category?.toLowerCase().includes('loan') || contract.category?.toLowerCase().includes('financial') ? "group-hover:bg-amber" :
                      contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') ? "group-hover:bg-blue" :
                      "group-hover:bg-rose"
                    )}>
                       <CaretRight size={32} weight="bold" className={cn(
                         "text-text-3 transition-colors",
                         (contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') || contract.category?.toLowerCase().includes('real estate')) ? "group-hover:text-white" : "group-hover:text-[#010101]"
                       )} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="py-60 text-center space-y-10 flex flex-col items-center">
               <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center text-text-3 mb-6 border border-white/10 shadow-2xl relative">
                  <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
                  <MagnifyingGlass size={48} weight="bold" />
               </div>
               <h3 className="heading-display text-5xl text-white italic opacity-40 uppercase">Archive Empty.</h3>
               <p className="text-text-3 font-black text-[12px] uppercase tracking-[0.5em] max-w-md leading-relaxed">No matching entries found in your library. Try adjusting your filters.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
