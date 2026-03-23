'use client';

import { useContracts } from '@/store/contracts';
import Link from 'next/link';
import {
  PlusCircle,
  Files,
  BookOpen,
  Wallet as PhosphorWallet,
  ShieldCheck,
  ArrowUpRight,
  Stack,
  ArrowRight,
  Lightning,
  Warning,
  Scales,
  Plus,
  Gear,
  Globe as PhosphorGlobe
} from "@phosphor-icons/react";
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { RadialProgress } from '@/components/ui/radial-progress';
import { cn } from '@/lib/utils';
import { useState, useEffect, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid
} from 'recharts';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8 } },
};

const STATUS_LABEL_TEXT: Record<string, string> = {
  active: 'Active',
  pending_signature: 'Pending',
  completed: 'Completed',
  disputed: 'Disputed',
  draft: 'Draft',
  expired: 'Expired',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'var(--blue)',
  pending_signature: '#f59e0b', // amber
  completed: '#10b981', // emerald
  disputed: '#ef4444', // red
  draft: '#6b7280', // gray
  expired: '#374151', // slate
};

export default function Dashboard() {
  // No-op for now
  const { contracts, getStats } = useContracts();
  const s = getStats();
  
  // Fix Hydration Issue: Only render time after client mount
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const distributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    contracts.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, value]) => ({
      name: STATUS_LABEL_TEXT[status] || status,
      value,
      color: STATUS_COLORS[status] || '#000'
    }));
  }, [contracts]);

  const financialData = useMemo(() => [
    { name: 'Paid', amount: s.totalReceivable, color: '#10b981' },
    { name: 'Owed', amount: s.totalOwed, color: '#f59e0b' },
  ], [s.totalReceivable, s.totalOwed]);

  const recent = contracts.slice(0, 5);
  const overdue = contracts
    .flatMap(c => c.paymentSchedule.map(p => ({ ...p, contractTitle: c.title, contractId: c.id })))
    .filter(p => p.status === 'overdue');

  const greeting =
    (currentTime || new Date()).getHours() < 12 ? 'GOOD MORNING.' :
    (currentTime || new Date()).getHours() < 17 ? 'GOOD AFTERNOON.' :
    'GOOD EVENING.';

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-8 py-12 md:px-16 md:py-16 bg-[var(--bg)] min-h-full selection:bg-[var(--text-1)] selection:text-[var(--bg)] overflow-x-hidden space-y-16"
    >
      {/* ─── Header: The Current State ────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-16 border-b-4 border-[var(--text-1)] relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 overflow-hidden pointer-events-none">
            <Scales size={200} weight="fill" className="text-[var(--text-1)]" />
        </div>
        
        <div className="max-w-3xl relative z-10">
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <div className="px-4 py-1 brutalist-card font-black uppercase tracking-[0.4em] text-xs flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--blue)] animate-pulse border border-[var(--text-1)]" />
              <span className="text-[var(--text-2)]">
                Status: <span className="text-[var(--blue)]">SYNCED</span> &middot; {mounted && currentTime ? currentTime.toLocaleTimeString() : '...'}
              </span>
            </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-[6rem] lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.85] text-[var(--text-1)] mb-10 break-words hyphens-auto w-full max-w-full">
            {greeting}
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-[var(--text-2)] font-bold tracking-tight max-w-2xl">
            You have <span className="text-[var(--text-1)]">{s.activeContracts} active agreements</span> being monitored today.
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className="flex items-center gap-6 relative z-10">
          <div className="relative group">
            <div className="absolute inset-x-0 -bottom-1 h-full bg-[var(--blue)] rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
            <Link href="/contracts/new" className="no-underline relative block">
              <button 
                className="bg-[var(--color-white)]/80 backdrop-blur-md border border-[var(--bg)]/50 text-[var(--text-1)] px-8 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 transition-all"
              >
                <PlusCircle size={20} weight="bold" className="text-[var(--blue)] group-hover:rotate-180 transition-transform duration-500" /> 
                New Agreement
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ─── Analytic Widgets ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        
        {/* Widget 1: Agreement Builder */}
        <Link href="/contracts/new" className="brutalist-card p-8 flex flex-col justify-between h-48 group no-underline relative overflow-hidden bg-[var(--color-white)]">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-[var(--blue)] opacity-5 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 border-2 border-[var(--text-1)] bg-[var(--bg)] flex items-center justify-center shadow-[2px_2px_0_0_var(--text-1)] group-hover:bg-[var(--blue)] group-hover:text-[var(--bg)] transition-colors">
              <Files size={24} weight="bold" />
            </div>
            <ArrowUpRight size={16} className="text-[var(--text-3)] group-hover:text-[var(--blue)] transition-all" weight="bold" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-2)] mb-2">Agreement Builder</p>
            <h3 className="text-xl lg:text-2xl font-black tracking-tighter text-[var(--text-1)] uppercase leading-none">START DRAFTING</h3>
          </div>
          <div className="absolute right-6 bottom-6 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 border-2 border-dashed border-[var(--blue)] rounded-full animate-[spin_4s_linear_infinite] absolute"></div>
            <div className="w-8 h-8 bg-[var(--blue)]/10 rounded-full flex items-center justify-center animate-pulse">
              <Plus size={16} weight="bold" className="text-[var(--blue)]" />
            </div>
          </div>
        </Link>
        
        {/* Widget 2: Global Library */}
        <Link href="/legal-library" className="brutalist-card p-8 flex flex-col justify-between h-48 group no-underline relative overflow-hidden bg-[var(--color-white)]">
          <div className="absolute inset-0 opacity-10 flex items-end justify-end p-4 pointer-events-none group-hover:opacity-30 transition-opacity">
            <PhosphorGlobe size={140} weight="duotone" className="text-[var(--secondary)] translate-x-8 translate-y-8" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 border-2 border-[var(--text-1)] bg-[var(--bg)] flex items-center justify-center shadow-[2px_2px_0_0_var(--text-1)] group-hover:bg-[var(--secondary)] group-hover:text-[var(--bg)] transition-colors">
              <BookOpen size={24} weight="bold" />
            </div>
            <ArrowUpRight size={16} className="text-[var(--text-3)] group-hover:text-[var(--secondary)] transition-all" weight="bold" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-2)] mb-2">Global Library</p>
            <h3 className="text-xl lg:text-2xl font-black tracking-tighter text-[var(--text-1)] uppercase leading-none">195 NATIONS</h3>
          </div>
        </Link>

        {/* Widget 3: Total Protected */}
        <Link href="/contracts" className="brutalist-card p-8 flex flex-col justify-between h-48 group no-underline relative overflow-hidden bg-[var(--color-white)]">
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 border-2 border-[var(--text-1)] bg-[var(--bg)] flex items-center justify-center shadow-[2px_2px_0_0_var(--text-1)] group-hover:bg-[var(--text-1)] group-hover:text-[var(--bg)] transition-colors">
              <PhosphorWallet size={24} weight="bold" />
            </div>
            <ArrowUpRight size={16} className="text-[var(--text-3)] group-hover:text-[var(--text-1)] transition-all" weight="bold" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-2)] mb-2">Total Protected</p>
            <h3 className="text-xl lg:text-2xl font-black tracking-tighter text-[var(--text-1)] uppercase leading-none">${s.totalValue.toLocaleString()}</h3>
          </div>
          {mounted && (
            <div className="absolute bottom-0 right-0 left-0 h-16 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity flex items-end justify-between px-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{v:2},{v:4},{v:3},{v:7},{v:5},{v:8},{v:10}]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Bar dataKey="v" fill="var(--text-1)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Link>

        {/* Widget 4: System Status */}
        <Link href="/settings" className="brutalist-card p-8 flex flex-col justify-between h-48 group no-underline relative overflow-hidden bg-[var(--color-white)]">
          <div className="absolute right-0 top-0 opacity-50 group-hover:opacity-100 transition-opacity translate-x-4 -translate-y-4">
            <RadialProgress pct={100} size={150} stroke={6} color="var(--secondary)" className="drop-shadow-none" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 border-2 border-[var(--text-1)] bg-[var(--bg)] flex items-center justify-center shadow-[2px_2px_0_0_var(--text-1)] group-hover:bg-[#10b981] group-hover:text-[var(--bg)] transition-colors">
              <ShieldCheck size={24} weight="bold" />
            </div>
            <div className="bg-[var(--secondary)]/10 text-[var(--secondary)] px-3 py-1 text-[8px] font-black uppercase tracking-widest border border-[var(--secondary)]/20 animate-pulse">Online</div>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-2)] mb-2">System Status</p>
            <h3 className="text-xl lg:text-2xl font-black tracking-tighter text-[var(--text-1)] uppercase leading-none">PROTECTED</h3>
          </div>
        </Link>
      </div>

      {/* ─── Visual Insights ────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-12">
        <section className="brutalist-card p-8 sm:p-12 space-y-8 min-h-[400px] flex flex-col relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--blue)] opacity-5 rounded-full blur-[80px] pointer-events-none group-hover:opacity-10 transition-duration-500"></div>
          <div className="flex items-center gap-4 border-b-4 border-[var(--text-1)] pb-6 relative z-10">
            <Lightning size={32} weight="fill" className="text-[var(--blue)]" />
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-[var(--text-1)]">Agreement Distribution</h2>
          </div>
          <div className="flex-1 w-full min-h-[300px] relative z-10">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="var(--text-1)"
                    strokeWidth={4}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                     contentStyle={{ 
                        backgroundColor: 'var(--bg)', 
                        border: '4px solid var(--text-1)', 
                        borderRadius: '0', 
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        boxShadow: '4px 4px 0 0 var(--text-1)'
                     }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-4 pt-6 border-t-4 border-[var(--text-1)] relative z-10">
            {distributionData.map((d, i) => (
              <div key={i} className="flex items-center gap-3 bg-[var(--color-white)] border-2 border-[var(--text-1)] px-4 py-2 shadow-[2px_2px_0_0_var(--text-1)]">
                <div className="w-4 h-4 border-2 border-[var(--text-1)]" style={{ backgroundColor: d.color }} />
                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--text-1)]">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="brutalist-card p-8 sm:p-12 space-y-8 min-h-[400px] flex flex-col relative overflow-hidden group">
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[var(--secondary)] opacity-5 rounded-full blur-[100px] pointer-events-none group-hover:opacity-10 transition-duration-500"></div>
          <div className="flex items-center gap-4 border-b-4 border-[var(--text-1)] pb-6 relative z-10">
            <PhosphorWallet size={32} weight="fill" className="text-[var(--secondary)]" />
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-[var(--text-1)]">Financial Health</h2>
          </div>
          <div className="flex-1 w-full min-h-[300px] relative z-10">
             {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={{ stroke: 'var(--text-1)', strokeWidth: 4 }} 
                    tickLine={{ stroke: 'var(--text-1)', strokeWidth: 4 }}
                    tick={{ fill: 'var(--text-1)', fontWeight: '900', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={{ stroke: 'var(--text-1)', strokeWidth: 4 }}
                    tickLine={{ stroke: 'var(--text-1)', strokeWidth: 4 }}
                    tick={{ fill: 'var(--text-1)', fontWeight: '900', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                    width={80}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                    contentStyle={{ 
                        backgroundColor: 'var(--bg)', 
                        border: '4px solid var(--text-1)', 
                        borderRadius: '0', 
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        boxShadow: '4px 4px 0 0 var(--text-1)'
                     }} 
                  />
                  <Bar dataKey="amount" radius={[0, 0, 0, 0]} stroke="var(--text-1)" strokeWidth={4} activeBar={{ stroke: 'var(--blue)', strokeWidth: 4 }}>
                    {financialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
             ) : null}
          </div>
          <div className="pt-6 border-t-4 border-[var(--text-1)] relative z-10">
             <p className="text-[11px] font-black uppercase tracking-widest text-[var(--text-2)] flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-[var(--text-1)]"></span>
               Capital Status Overview
             </p>
          </div>
        </section>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main List Feed */}
        <div className="lg:col-span-2 space-y-12">
          <section className="brutalist-card p-0 overflow-hidden">
            <div className="p-8 border-b-4 border-[var(--text-1)] flex items-center justify-between bg-[var(--bg)]">
              <div className="flex items-center gap-4">
                <Stack size={20} weight="bold" className="text-[var(--blue)]" />
                <h2 className="text-xl font-black uppercase tracking-tighter text-[var(--text-1)]">Recent Agreements</h2>
              </div>
              <Link href="/contracts" className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--blue)] hover:text-[var(--text-1)] flex items-center gap-3 no-underline transition-all">
                View All <ArrowRight size={14} weight="bold" />
              </Link>
            </div>

            <div className="divide-y-2 divide-[var(--text-1)]">
              {recent.length === 0 ? (
                <EmptyState 
                  title="No Agreements Found" 
                  description="Start a new drafting session to populate your list." 
                  actionLabel="Create Agreement" 
                  actionHref="/contracts/new" 
                  icon={<Files size={48} className="text-[var(--blue)] mx-auto mb-6" />} 
                  className="border-none bg-transparent shadow-none p-24"
                />
              ) : (
                recent.map((c) => (
                  <Link
                    key={c.id}
                    href={`/contracts/${c.id}`}
                    className="flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-[var(--bg)] transition-all group no-underline gap-6"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-14 h-14 border-4 border-[var(--text-1)] bg-[var(--color-white)] text-[var(--text-1)] flex items-center justify-center font-black text-xl shadow-[4px_4px_0_0_var(--text-1)] group-hover:shadow-[2px_2px_0_0_var(--text-1)] group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                        {c.title.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-[var(--text-1)] uppercase tracking-tighter mb-2 group-hover:text-[var(--blue)] transition-colors">{c.title}</h4>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-[var(--text-2)] uppercase tracking-widest">{c.category}</span>
                            <div className="w-1 h-1 rounded-full bg-[var(--text-1)]" />
                            <span className="text-[10px] font-black text-[var(--text-2)] uppercase tracking-widest">{c.jurisdiction}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-10">
                      <div className="text-right hidden md:block">
                        <div className="font-black text-xl text-[var(--text-1)] tracking-tighter tabular-nums mb-1">
                          {c.totalAmount ? `$${c.totalAmount.toLocaleString()}` : "IN-KIND"}
                        </div>
                        <div className="text-[8px] font-black text-[var(--text-3)] uppercase tracking-[0.3em]">
                          Value
                        </div>
                      </div>
                      <div className={cn(
                        "px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] border-2 border-[var(--text-1)] bg-[var(--color-white)] shadow-[2px_2px_0_0_var(--text-1)]"
                      )}>
                        {STATUS_LABEL_TEXT[c.status] || c.status}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Activity Logs */}
          <section className="brutalist-card p-10 bg-[var(--color-white)] text-[var(--text-1)] overflow-hidden relative">
             <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <Lightning weight="fill" className="text-[var(--secondary)]" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-[var(--text-1)]">Recent Activity</h3>
              </div>
              <div className="px-3 py-1 border-2 border-[var(--secondary)] bg-transparent">
                <span className="text-[8px] font-black text-[var(--secondary)] uppercase tracking-widest animate-pulse">Live</span>
              </div>
            </div>

            <div className="font-mono text-xs space-y-4">
                {[
                 { time: 'Just Now', msg: 'Ready to draft new agreements.', col: 'text-[var(--secondary)]' },
                 { time: '1m ago', msg: 'Library synced.', col: 'text-[var(--blue)]' },
                 { time: '5m ago', msg: 'All agreements verified.', col: 'text-[var(--text-1)]' },
                 { time: '1h ago', msg: 'Pending signature detected.', col: 'text-amber-400' },
                 { time: '2h ago', msg: 'System checks passed.', col: 'text-[var(--text-2)]' }
                ].map((log, i) => (
                <div key={i} className="flex gap-6 opacity-80 hover:opacity-100 transition-opacity">
                    <span className="text-[var(--text-3)] shrink-0 w-16">{log.time}</span>
                    <span className={cn("font-bold tracking-tight uppercase", log.col)}>{log.msg}</span>
                </div>
               ))}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-12">
          {/* Risk Monitoring Dashboard */}
          <section className={cn(
            "brutalist-card p-8 relative overflow-hidden",
            overdue.length > 0 ? "border-red-500 shadow-[4px_4px_0_0_#ef4444]" : ""
          )}>
            {overdue.length > 0 && (
                <div className="absolute top-0 right-0 p-4 animate-pulse">
                    <Warning size={24} weight="fill" className="text-red-500" />
                </div>
            )}
            
            <div className="flex items-center gap-4 mb-8">
              <div className={cn("w-12 h-12 border-2 border-[var(--text-1)] flex items-center justify-center shadow-[2px_2px_0_0_var(--text-1)]", overdue.length > 0 ? "bg-red-500 text-[var(--bg)]" : "bg-[var(--color-white)]")}>
                <Warning size={24} weight="bold" className={overdue.length > 0 ? "text-[var(--bg)]" : "text-[var(--text-1)]"} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tighter text-[var(--text-1)]">Action Required</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] mt-1">Outstanding Issues</p>
              </div>
            </div>

            {overdue.length === 0 ? (
              <div className="text-center py-12">
                <ShieldCheck size={64} className="mx-auto mb-6 text-[var(--secondary)] transition-all" weight="duotone" />
                <p className="text-xs font-black uppercase tracking-[0.4em] text-[var(--text-1)]">All Clear</p>
              </div>
            ) : (
              <div className="space-y-6">
                {overdue.map(p => (
                  <Link key={p.id} href={`/contracts/${p.contractId}`} className="block p-8 brutalist-card border-red-500 bg-[var(--color-white)] no-underline shadow-[4px_4px_0_0_#ef4444]">
                    <div className="flex justify-between items-start mb-6">
                      <span className="font-black text-sm uppercase tracking-tighter text-[var(--text-1)]">{p.contractTitle}</span>
                      <Badge className="bg-red-500 text-[var(--bg)] border-2 border-[var(--text-1)] text-[10px] font-black px-3 py-1 shadow-[2px_2px_0_0_var(--text-1)]">ACTION</Badge>
                    </div>
                    <div className="flex justify-between items-end pt-4 border-t-2 border-[var(--text-1)]">
                      <span className="text-[10px] font-black text-[var(--text-3)] uppercase tracking-[0.2em]">{mounted ? new Date(p.dueDate).toLocaleDateString() : ''}</span>
                      <span className="text-2xl font-black text-[var(--text-1)] tracking-tighter tabular-nums">${p.amount.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Quick Registry Link */}
          <section className="brutalist-card bg-[var(--blue)] text-[var(--bg)] p-10 group overflow-hidden relative">
            <div className="relative z-10 space-y-10">
              <div className="flex justify-between items-start">
                <PhosphorGlobe size={40} weight="bold" className="text-[var(--text-1)] group-hover:rotate-180 transition-transform duration-[2s]" />
                <ArrowUpRight size={20} weight="bold" className="text-[var(--text-1)]" />
              </div>

              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-3 text-[var(--bg)]">Legal Library</h3>
                <p className="text-xs font-bold text-[var(--bg)]/80 leading-relaxed uppercase tracking-tight">Access global legal rules for 195+ nations.</p>
              </div>

              <Link href="/legal-library" className="block no-underline">
                <button 
                    className="brutalist-button w-full bg-[var(--color-white)] text-[var(--text-1)] hover:bg-[var(--bg)] shadow-[4px_4px_0_0_var(--text-1)]"
                >
                  Enter Library
                </button>
              </Link>
            </div>
          </section>

          {/* Settings / Gear */}
          <Link href="/settings" className="block brutalist-card bg-[var(--color-white)] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] p-6 no-underline hover:bg-[var(--bg)] group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 border-2 border-[var(--text-1)] bg-[var(--bg)] flex items-center justify-center group-hover:rotate-90 transition-transform duration-700">
                    <Gear size={20} className="text-[var(--text-1)]" weight="bold" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--text-1)]">Settings</span>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
