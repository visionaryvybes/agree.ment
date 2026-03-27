'use client';

import { useContracts } from '@/store/contracts';
import Link from 'next/link';
import {
  PlusCircle, Files, CurrencyDollar, Warning, ArrowRight,
  Clock, ShieldCheck, CaretRight, TrendUp, Signature,
} from "@phosphor-icons/react";
import {
  RadialBarChart, RadialBar,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

// ── Static data ────────────────────────────────────────────────────────────

const AREA_DATA = [
  { date: 'Feb 1',  volume: 12000 },
  { date: 'Feb 8',  volume: 19000 },
  { date: 'Feb 15', volume: 15000 },
  { date: 'Feb 22', volume: 24000 },
  { date: 'Mar 1',  volume: 32000 },
  { date: 'Mar 8',  volume: 28000 },
  { date: 'Mar 15', volume: 45000 },
];

const HEALTH_DATA = [
  { name: 'Stability',  value: 92, fill: '#00FFD1' },
  { name: 'Usage',      value: 85, fill: '#0070FF' },
  { name: 'Protection', value: 78, fill: '#FFB800' },
];

const POPULAR_TEMPLATES = [
  { title: 'Service Agreement', category: 'Commercial',  time: 'Instant', grade: 'A+' },
  { title: 'Privacy Agreement', category: 'General',     time: '30 sec',  grade: 'A'  },
  { title: 'Work Contract',     category: 'Employment',  time: '1 min',   grade: 'A'  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function categoryColor(category = '') {
  const c = category.toLowerCase();
  if (c.includes('service'))                             return 'emerald';
  if (c.includes('loan') || c.includes('financial'))    return 'amber';
  if (c.includes('sale') || c.includes('tech'))         return 'blue';
  return 'rose';
}

const colorMap: Record<string, { text: string; border: string; bg: string; arrowLight: boolean }> = {
  emerald: { text: 'text-emerald', border: 'group-hover:border-emerald/40', bg: 'group-hover:bg-emerald', arrowLight: false },
  amber:   { text: 'text-amber',   border: 'group-hover:border-amber/40',   bg: 'group-hover:bg-amber',   arrowLight: false },
  blue:    { text: 'text-blue',    border: 'group-hover:border-blue/40',    bg: 'group-hover:bg-blue',    arrowLight: true  },
  rose:    { text: 'text-rose',    border: 'group-hover:border-rose/40',    bg: 'group-hover:bg-rose',    arrowLight: true  },
};

// ── Component ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { contracts = [] } = useContracts();
  const [mounted, setMounted]   = useState(false);
  const [period,  setPeriod]    = useState('30D');

  useEffect(() => { setMounted(true); }, []);

  const activeCount  = contracts.filter(c => c.status === 'active').length;
  const pendingCount = contracts.filter(c => c.status === 'pending_signature').length;
  const totalValue   = contracts.reduce((s, c) => s + (c.totalAmount || 0), 0);
  const disputedCount= contracts.filter(c => c.status === 'disputed').length;

  const STATS = [
    { label: 'Active Deals', value: String(activeCount),                             icon: ShieldCheck,    color: 'emerald' },
    { label: 'Awaiting Sign', value: String(pendingCount),                            icon: Clock,          color: 'blue'    },
    { label: 'Total Value',   value: `$${((totalValue || 0) / 1000).toFixed(1)}k`,   icon: CurrencyDollar, color: 'amber'   },
    { label: 'Disputes',      value: String(disputedCount),                           icon: Warning,        color: 'rose'    },
  ];

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald/20 border-t-emerald rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 pb-24 max-w-6xl mx-auto relative">

      {/* Background glows */}
      <div className="vibrant-glow top-0 -left-24 w-[500px] h-[500px] bg-emerald/[0.07] animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 -right-24 w-[400px] h-[400px] bg-blue/[0.06]" />

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-white/[0.07] relative z-10">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-[10px] font-black text-emerald uppercase tracking-[0.4em] block mb-1">Overview</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight italic uppercase">Summary.</h1>
        </motion.div>

        <div className="flex items-center gap-3">
          {/* Period toggle */}
          <div className="flex bg-white/[0.04] p-1 rounded-xl border border-white/[0.07]">
            {['7D', '30D', 'ALL'].map(p => (
              <button
                key={p} onClick={() => setPeriod(p)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all duration-300',
                  period === p ? 'bg-emerald text-[#010101] shadow-[0_0_20px_rgba(0,255,209,0.3)]' : 'text-white/40 hover:text-white',
                )}
              >{p}</button>
            ))}
          </div>

          <Link
            href="/contracts/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_16px_rgba(0,255,209,0.25)]"
          >
            <PlusCircle size={15} weight="bold" />
            New
          </Link>
        </div>
      </header>

      {/* ── STAT CARDS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {STATS.map((stat, i) => {
          const cm = colorMap[stat.color];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className={cn(
                'p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-opacity-60 transition-all duration-500 relative overflow-hidden group',
                `hover:${cm.border.replace('group-hover:', '')}`,
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <p className={cn('text-[10px] font-black uppercase tracking-[0.25em]', cm.text)}>{stat.label}</p>
                <div className="w-9 h-9 flex-shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <img
                    src={
                      stat.label === 'Active Deals'  ? '/assets/3d/document_simple.png' :
                      stat.label === 'Awaiting Sign' ? '/assets/3d/lock_simple.png' :
                      stat.label === 'Total Value'   ? '/assets/3d/document_simple.png' :
                      '/assets/3d/help_simple.png'
                    }
                    className="w-full h-full object-contain"
                    alt={stat.label}
                  />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── ANALYTICS ──────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5 relative z-10">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/[0.07] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-black text-white italic uppercase tracking-tight">Activity</p>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald/10 rounded-xl border border-emerald/20">
              <TrendUp size={13} weight="bold" className="text-emerald" />
              <span className="text-[10px] font-black text-emerald tracking-wider">+24% Volume</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220} minWidth={0}>
            <AreaChart data={AREA_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00FFD1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00FFD1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 10, fontWeight: 700 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 10, fontWeight: 700 }} />
              <Tooltip
                contentStyle={{ background: '#080808', border: '1px solid #00FFD120', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
                itemStyle={{ color: '#00FFD1', fontWeight: 700, fontSize: 11 }}
                labelStyle={{ color: '#666', fontSize: 10 }}
              />
              <Area type="monotone" dataKey="volume" stroke="#00FFD1" strokeWidth={2.5} fill="url(#chartGrad)" animationDuration={1800} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radial status */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="p-5 sm:p-6 rounded-3xl bg-[#080808] border border-white/[0.07] flex flex-col relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue/[0.1] blur-[80px] rounded-full" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue mb-4">Protection Grade</p>

          <div className="relative h-[180px]">
            <ResponsiveContainer width="100%" height={180} minWidth={0}>
              <RadialBarChart innerRadius="38%" outerRadius="100%" data={HEALTH_DATA} startAngle={180} endAngle={-180}>
                <RadialBar background dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-black text-white italic tracking-tight">A+</p>
              <p className="text-[9px] font-black text-blue uppercase tracking-[0.25em] mt-0.5">Exceptional</p>
            </div>
          </div>

          <div className="space-y-2.5 mt-auto pt-3 border-t border-white/[0.05]">
            {HEALTH_DATA.map(item => (
              <div key={item.name} className="flex items-center justify-between py-1 px-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.fill }} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.name}</span>
                </div>
                <span className={cn('text-sm font-black',
                  item.name === 'Stability' ? 'text-emerald' :
                  item.name === 'Usage'     ? 'text-blue'    : 'text-amber',
                )}>{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── POPULAR TEMPLATES ──────────────────────────────────────── */}
      <section className="space-y-5 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Quick Templates</h2>
          <Link href="/templates" className="text-[10px] font-black text-emerald uppercase tracking-widest flex items-center gap-1.5 group hover:opacity-80 transition-opacity">
            View All <ArrowRight size={12} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {POPULAR_TEMPLATES.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
            >
              <Link
                href="/contracts/new"
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col h-full group hover:border-emerald/30 hover:-translate-y-1 transition-all duration-400 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.04] group-hover:opacity-20 group-hover:rotate-6 transition-all duration-500">
                  <Signature size={48} weight="thin" className="text-emerald" />
                </div>
                <span className="text-[9px] font-black text-emerald uppercase tracking-[0.3em] bg-emerald/10 px-2.5 py-1 rounded-full border border-emerald/20 inline-block mb-4 self-start">{item.category}</span>
                <h3 className="text-sm font-black text-white italic tracking-tight uppercase group-hover:text-emerald transition-colors flex-1">{item.title}</h3>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.05] text-[9px] font-black uppercase tracking-widest">
                  <span className="text-white/30">Ready in <span className="text-white/60">{item.time}</span></span>
                  <span className="text-emerald">{item.grade}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── RECENT DEALS ───────────────────────────────────────────── */}
      <section className="space-y-5 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Recent Deals</h2>
          <Link href="/contracts" className="text-[10px] font-black text-amber uppercase tracking-widest flex items-center gap-1.5 group hover:opacity-80 transition-opacity">
            See All <ArrowRight size={12} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {contracts.slice(0, 5).map((contract, i) => {
              const col = categoryColor(contract.category);
              const cm  = colorMap[col];
              return (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.07 }}
                >
                  <Link
                    href={`/contracts/${contract.id}`}
                    className={cn(
                      'group flex items-center justify-between gap-4 p-4 sm:p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl transition-all duration-400 relative overflow-hidden',
                      cm.border,
                    )}
                  >
                    {/* Icon */}
                    <div className={cn('w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/30 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-400', cm.bg, 'group-hover:text-[#010101]')}>
                      <Files size={16} weight="bold" />
                    </div>

                    {/* Title + meta */}
                    <div className="flex-1 min-w-0">
                      <h4 className={cn('text-sm font-black text-white truncate tracking-tight transition-colors', cm.text.replace('text-', 'group-hover:text-'))}>{contract.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn('text-[9px] font-black uppercase tracking-[0.2em]', cm.text, 'opacity-60')}>{contract.category}</span>
                        <span className="text-white/10 text-xs">·</span>
                        <span className="text-[9px] text-white/20 font-mono">{contract.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Status badge + arrow */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={cn('badge-vibrant hidden sm:inline-flex',
                        contract.status === 'active'             ? 'badge-active' :
                        contract.status === 'pending_signature'  ? 'badge-pending' : 'badge-disputed',
                      )}>
                        {contract.status.replace('_', ' ')}
                      </span>
                      <div className={cn('w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center group-hover:translate-x-1 transition-all duration-400', cm.bg, 'group-hover:border-transparent')}>
                        <CaretRight size={14} weight="bold" className={cn('text-white/30 transition-colors', cm.arrowLight ? 'group-hover:text-white' : 'group-hover:text-[#010101]')} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {contracts.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm font-black text-white/20 uppercase tracking-widest">No deals yet.</p>
              <Link href="/contracts/new" className="mt-4 inline-flex items-center gap-2 text-emerald text-xs font-black uppercase tracking-widest hover:opacity-75 transition-opacity">
                Create your first deal <ArrowRight size={12} weight="bold" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
