'use client';

import { useContracts } from '@/store/contracts';
import Link from 'next/link';
import { 
  PlusCircle, 
  Files, 
  CurrencyDollar, 
  Warning, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  CaretRight,
  TrendUp,
  Signature
} from "@phosphor-icons/react";
import { 
  RadialBarChart, RadialBar, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import Magnetic from '@/components/ui/magnetic';

export default function DashboardPage() {
  const { contracts = [] } = useContracts();
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState('30D');

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeCount = (contracts || []).filter(c => c.status === 'active').length;
  const pendingCount = (contracts || []).filter(c => c.status === 'pending_signature').length;
  const totalValue = (contracts || []).reduce((sum, c) => sum + (c.totalAmount || 0), 0);
  const disputedCount = (contracts || []).filter(c => c.status === 'disputed').length;

  const areaData = [
    { date: 'Feb 01', volume: 12000 },
    { date: 'Feb 08', volume: 19000 },
    { date: 'Feb 15', volume: 15000 },
    { date: 'Feb 22', volume: 24000 },
    { date: 'Mar 01', volume: 32000 },
    { date: 'Mar 08', volume: 28000 },
    { date: 'Mar 15', volume: 45000 },
  ];

  const healthData = [
    { name: 'Stability', value: 92, fill: '#00FFD1' },
    { name: 'Usage', value: 85, fill: '#0070FF' },
    { name: 'Protection', value: 78, fill: '#FFB800' },
  ];

   const stats = [
     { label: 'All Deals', value: activeCount, icon: ShieldCheck, color: 'text-emerald', glow: 'bg-emerald/10' },
     { label: 'To Sign', value: pendingCount, icon: Clock, color: 'text-blue', glow: 'bg-blue/10' },
     { label: 'Value', value: `$${((totalValue || 0) / 1000).toFixed(1)}k`, icon: CurrencyDollar, color: 'text-amber', glow: 'bg-amber/10' },
     { label: 'Help', value: disputedCount, icon: Warning, color: 'text-rose', glow: 'bg-rose/10' },
   ];

   const popularTemplates = [
     { title: 'Service Agreement', category: 'Commercial', time: 'Instant', grade: 'A+' },
     { title: 'Privacy Agreement', category: 'General', time: '30s', grade: 'A' },
     { title: 'Work Contract', category: 'Employment', time: '1m', grade: 'A' },
   ];


  return (
    <div className={cn("space-y-12 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative transition-opacity duration-1000", !mounted ? "opacity-0" : "opacity-100")}>
      
      {/* Background Glows — More Vivid */}
      <div className="vibrant-glow top-0 left-[-10%] w-[800px] h-[800px] bg-emerald/10 animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 right-[-10%] w-[700px] h-[700px] bg-blue/10 shadow-[0_0_100px_rgba(0,112,255,0.15)]" />

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[11px] font-black text-emerald uppercase tracking-[0.5em] block mb-4">Overview</span>
          <h1 className="heading-display text-7xl md:text-9xl text-white tracking-tighter italic uppercase leading-none">
            Summary.
          </h1>
        </motion.div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-3xl">
            {['7D', '30D', 'ALL'].map((p) => (
              <button 
                key={p} onClick={() => setPeriod(p)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[11px] font-black tracking-[0.2em] transition-all duration-500",
                  period === p ? "bg-emerald text-[#010101] shadow-[0_0_30px_rgba(0,255,209,0.4)]" : "text-text-3 hover:text-white"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <Magnetic>
            <Link href="/contracts/new?type=formalize" className="btn-vibrant btn-vibrant-blue px-10 h-14">
              <span>Formalize Chat</span>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/contracts/new" className="btn-vibrant btn-vibrant-emerald px-10 h-14">
              <PlusCircle size={22} weight="bold" />
              <span>Create New</span>
            </Link>
          </Magnetic>
        </div>
      </header>

      {/* ── STATS ROW ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className={cn(
              "p-8 rounded-[40px] bg-white/[0.03] border transition-all duration-700 relative overflow-hidden group backdrop-blur-3xl",
              stat.color === 'text-emerald' ? "border-emerald/20 hover:border-emerald/60 hover:shadow-[0_0_50px_rgba(0,255,209,0.2)]" :
              stat.color === 'text-blue' ? "border-blue/20 hover:border-blue/60 hover:shadow-[0_0_50px_rgba(0,112,255,0.2)]" :
              stat.color === 'text-amber' ? "border-amber/20 hover:border-amber/60 hover:shadow-[0_0_50px_rgba(255,184,0,0.2)]" :
              "border-rose/20 hover:border-rose/60 hover:shadow-[0_0_50px_rgba(255,0,110,0.2)]"
            )}
          >
            <div className={cn(
               "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
               stat.color === 'text-emerald' ? "bg-emerald" : stat.color === 'text-blue' ? "bg-blue" : stat.color === 'text-amber' ? "bg-amber" : "bg-rose"
            )} />
            
            <div className="flex items-center justify-between mb-8">
               <p className={cn("text-[10px] font-black uppercase tracking-[0.3em] transition-colors", stat.color)}>{stat.label}</p>
               <div className="w-14 h-14 relative flex-shrink-0 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700">
                  <img 
                    src={
                      stat.label === 'All Deals' ? '/assets/3d/document_simple.png' :
                      stat.label === 'To Sign' ? '/assets/3d/lock_simple.png' :
                      stat.label === 'Value' ? '/assets/3d/document_simple.png' :
                      '/assets/3d/help_simple.png'
                    } 
                    className="w-full h-full object-contain" 
                    alt={stat.label} 
                  />
               </div>
            </div>
            <h3 className="heading-display text-6xl text-white group-hover:translate-x-2 transition-transform">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* ── ANALYTICS CORE ────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Main Volume Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="lg:col-span-2 p-12 rounded-[50px] bg-white/[0.03] border border-white/10 relative overflow-hidden backdrop-blur-3xl group"
        >
          <div className="flex items-center justify-between mb-16">
             <p className="text-4xl font-black text-white italic uppercase tracking-tighter group-hover:text-emerald transition-colors">Activity.</p>
             <div className="flex items-center gap-4 px-6 py-4 bg-emerald shadow-[0_0_50px_rgba(0,255,209,0.3)] rounded-2xl border-4 border-[#010101]">
               <TrendUp size={24} weight="bold" className="text-[#010101]" />
               <span className="text-[12px] font-black text-[#010101] tracking-[0.2em] uppercase">Activity +24%</span>
             </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FFD1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00FFD1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11, fontWeight: 800 }} dy={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11, fontWeight: 800 }} />
                <Tooltip 
                  contentStyle={{ background: '#000000', border: '1px solid #00FFD130', borderRadius: '20px', backdropFilter: 'blur(30px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#00FFD1', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
                  labelStyle={{ color: '#71717A', marginBottom: '8px', fontWeight: 900, fontSize: '10px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#00FFD1" 
                  strokeWidth={6} 
                  fill="url(#colorEmerald)" 
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Widget */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="lg:col-span-1 p-12 rounded-[50px] bg-[#0A0A0A] border border-white/10 flex flex-col justify-between relative overflow-hidden shadow-2xl group"
        >
           <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue/15 blur-[120px] rounded-full group-hover:bg-blue/30 transition-all duration-1000" />
           
           <div>
              <p className="text-[12px] font-black uppercase tracking-[0.5em] text-blue mb-12">Protection Grade</p>
              <div className="h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                   <RadialBarChart innerRadius="40%" outerRadius="110%" data={healthData} startAngle={180} endAngle={-180}>
                      <RadialBar 
                        background 
                        dataKey="value" 
                        cornerRadius={30}
                        fill="#0070FF" 
                      />
                   </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                   <p className="text-6xl font-black text-white italic uppercase tracking-tighter shadow-blue/20">A+</p>
                   <p className="text-[11px] font-black text-blue uppercase tracking-[0.3em] mt-3">EXCEPTIONAL</p>
                </div>
              </div>
           </div>
           
           <div className="space-y-6 pt-12">
              {healthData.map(item => (
                <div key={item.name} className="flex items-center justify-between group/row p-3 rounded-2xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5">
                   <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ background: item.fill }} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-2 group-hover/row:text-white transition-colors">{item.name}</span>
                   </div>
                   <span className={cn("text-lg font-black", item.name === 'Stability' ? 'text-emerald' : item.name === 'Usage' ? 'text-blue' : 'text-amber')}>{item.value}%</span>
                </div>
              ))}
           </div>
        </motion.div>
      </div>

      {/* ── POPULAR TEMPLATES SECTION (The "Cool" Layout) ────────────────── */}
      <section className="space-y-10 relative z-10">
         <div className="flex items-center justify-between px-2">
            <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white">Popular Styles</h2>
            <Link href="/templates" className="text-[10px] font-black text-emerald uppercase tracking-widest flex items-center gap-3 group">
               BROWSE ALL <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularTemplates.map((item, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.7 + (i * 0.1) }}
               >
                 <Link 
                   href="/contracts/new"
                   className="p-10 rounded-[48px] bg-white/[0.03] border border-white/5 relative group overflow-hidden hover:border-emerald/40 transition-all duration-700 backdrop-blur-3xl flex flex-col h-full hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                 >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-40 group-hover:rotate-12 transition-all duration-700">
                       <Signature size={80} weight="thin" className="text-emerald" />
                    </div>

                    <div className="space-y-8 relative z-10 flex-1">
                       <span className="text-[9px] font-black text-emerald uppercase tracking-[0.4em] bg-emerald/10 px-4 py-2 rounded-full border border-emerald/20 inline-block">{item.category}</span>
                       <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight group-hover:text-emerald transition-colors">{item.title}</h3>

                       <div className="flex items-center justify-between pt-8 border-t border-white/5">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-text-3 uppercase">Ready In</p>
                             <p className="text-sm font-black text-white">{item.time}</p>
                          </div>
                          <div className="space-y-1 text-right">
                             <p className="text-[9px] font-black text-text-3 uppercase">Match Grade</p>
                             <p className="text-sm font-black text-emerald">{item.grade}</p>
                          </div>
                       </div>
                    </div>

                    <div className="mt-10 flex justify-center relative z-10">
                       <Magnetic>
                          <div className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-3 group-hover:bg-emerald group-hover:text-[#010101] group-hover:border-emerald transition-all duration-500 shadow-xl">
                            USE THIS STYLE
                          </div>
                       </Magnetic>
                    </div>
                 </Link>
               </motion.div>
            ))}
         </div>
      </section>

      {/* ── RECENT ACTIVITY ────────────────────────────────────────── */}
      <section className="space-y-10 relative z-10">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white">Recent Deals</h2>
          <Link href="/contracts" className="text-[11px] font-black text-amber uppercase tracking-[0.3em] flex items-center gap-4 group hover:scale-105 transition-all">
             SEE HISTORY <ArrowRight size={18} weight="bold" className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid gap-6">
          <AnimatePresence>
            {(contracts || []).slice(0, 5).map((contract, i) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + (i * 0.1) }}
              >
                <Link 
                  href={`/contracts/${contract.id}`}
                  className={cn(
                    "group p-8 bg-white/[0.03] border border-white/5 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-700 backdrop-blur-3xl relative overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]",
                    contract.category?.toLowerCase().includes('service') ? "hover:border-emerald/40" :
                    contract.category?.toLowerCase().includes('loan') || contract.category?.toLowerCase().includes('financial') ? "hover:border-amber/40" :
                    contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') ? "hover:border-blue/40" :
                    "hover:border-rose/40"
                  )}
                >
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
                    contract.category?.toLowerCase().includes('service') ? "bg-emerald" :
                    contract.category?.toLowerCase().includes('loan') || contract.category?.toLowerCase().includes('financial') ? "bg-amber" :
                    contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') ? "bg-blue" :
                    "bg-rose"
                  )} />
                  
                  <div className="flex items-center gap-8 relative z-10">
                    <div className={cn(
                      "w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-text-3 shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110",
                      contract.category?.toLowerCase().includes('service') ? "group-hover:bg-emerald group-hover:text-[#010101]" :
                      contract.category?.toLowerCase().includes('loan') || contract.category?.toLowerCase().includes('financial') ? "group-hover:bg-amber group-hover:text-[#010101]" :
                      contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') ? "group-hover:bg-blue group-hover:text-white" :
                      "group-hover:bg-rose group-hover:text-white"
                    )}>
                      <Files size={32} weight="bold" />
                    </div>
                    <div className="space-y-1">
                      <h4 className={cn(
                        "text-2xl font-black text-white transition-colors tracking-tighter lowercase first-letter:uppercase",
                        contract.category?.toLowerCase().includes('service') ? "group-hover:text-emerald" :
                        contract.category?.toLowerCase().includes('loan') || contract.category?.toLowerCase().includes('financial') ? "group-hover:text-amber" :
                        contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') ? "group-hover:text-blue" :
                        "group-hover:text-rose"
                      )}>{contract.title}</h4>
                      <div className="flex items-center gap-4">
                        <p className={cn(
                          "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                          contract.category?.toLowerCase().includes('service') ? "text-emerald/60" :
                          contract.category?.toLowerCase().includes('loan') || contract.category?.toLowerCase().includes('financial') ? "text-amber/60" :
                          contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') ? "text-blue/60" :
                          "text-rose/60"
                        )}>{contract.category}</p>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <span className="text-[10px] text-text-3 font-black uppercase tracking-[0.2em] opacity-40"># {contract.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-10 relative z-10 h-full">
                    <div className="flex items-center gap-10">
                      <div className={cn(
                        "badge-vibrant px-6 py-2 transition-all duration-700 group-hover:scale-110",
                        contract.status === 'active' ? "badge-active" :
                        contract.status === 'pending_signature' ? "badge-pending" :
                        "badge-disputed"
                      )}>
                        {contract.status.replace('_', ' ')}
                      </div>
                      <div className={cn(
                        "w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-transparent group-hover:translate-x-3 transition-all duration-500 shadow-xl",
                        contract.category?.toLowerCase().includes('service') ? "group-hover:bg-emerald" :
                        contract.category?.toLowerCase().includes('loan') || contract.category?.toLowerCase().includes('financial') ? "group-hover:bg-amber" :
                        contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') ? "group-hover:bg-blue" :
                        "group-hover:bg-rose"
                      )}>
                         <CaretRight size={28} weight="bold" className={cn(
                           "text-text-3 transition-colors",
                           (contract.category?.toLowerCase().includes('sale') || contract.category?.toLowerCase().includes('tech') || contract.category?.toLowerCase().includes('real estate')) ? "group-hover:text-white" : "group-hover:text-[#010101]"
                         )} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

    </div>
  );
}
