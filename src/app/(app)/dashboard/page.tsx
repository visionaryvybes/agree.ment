'use client';

import { useContracts } from '@/store/contracts';
import Link from 'next/link';
import {
  PlusCircle,
  Files,
  Stack,
  BookOpen,
  Sparkle,
  Gear,
  House,
  MagnifyingGlass,
  ArrowUpRight,
  Lightning,
  Chats,
  Globe as PhosphorGlobe,
  Wallet as PhosphorWallet,
  ShieldCheck,
  Check,
  Handshake,
  Lock,
  CaretRight,
  ChartLineUp,
  Users,
  Clock,
  Warning,
  Plus,
  ArrowRight,
  Scales
} from "@phosphor-icons/react";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@/lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const STATUS_DOT: Record<string, string> = {
  active: 'dot-green',
  pending_signature: 'dot-amber',
  completed: 'dot-blue',
  disputed: 'dot-red',
  draft: 'dot-gray',
  expired: 'dot-gray',
};

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'secondary'> = {
  active: 'success',
  pending_signature: 'warning',
  completed: 'info',
  disputed: 'danger',
  draft: 'secondary',
  expired: 'secondary',
};

const STATUS_LABEL_TEXT: Record<string, string> = {
  active: 'Active',
  pending_signature: 'Pending',
  completed: 'Completed',
  disputed: 'Disputed',
  draft: 'Draft',
  expired: 'Expired',
};

export default function Dashboard() {
  const { contracts, getStats } = useContracts();
  const s = getStats();

  const recent = contracts.slice(0, 5);
  const overdue = contracts
    .flatMap(c => c.paymentSchedule.map(p => ({ ...p, contractTitle: c.title, contractId: c.id })))
    .filter(p => p.status === 'overdue');

  const today = new Date();
  const greeting =
    today.getHours() < 12 ? 'Good morning' :
      today.getHours() < 17 ? 'Good afternoon' :
        'Good evening';

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-12 lg:p-16 space-y-16 bg-[var(--bg)] min-h-full selection:bg-[var(--text-1)] selection:text-white"
    >
      {/* ─── Header: The Current State ────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-16 border-b-4 border-[var(--text-1)]">
        <div className="max-w-3xl">
          <motion.p variants={item} className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--blue)] mb-6">
            Protocol Pulse &middot; {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </motion.p>
          <motion.h1 variants={item} className="heading-display mb-6">
            {greeting}, Administrator.
          </motion.h1>
          <motion.p variants={item} className="text-2xl text-[var(--text-2)] font-bold tracking-tight">
            System status: <span className="text-[var(--text-1)]">{s.activeContracts} active enforcements</span> across global nodes.
          </motion.p>
        </div>

        <motion.div variants={item} className="flex items-center gap-6">
          <button className="brutalist-button-outline brutalist-button px-8 py-4 text-[10px]">
            View Insights
          </button>
          <Link href="/contracts/new" className="no-underline">
            <button className="brutalist-button px-10 py-4 text-[10px]">
              New Agreement
            </button>
          </Link>
        </motion.div>
      </div>

      {/* ─── Grid Systems ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: 'AI Architect', desc: 'Synthesize Intent', icon: <Sparkle size={32} weight="bold" />, href: '/contracts/new', color: 'bg-blue-600' },
          { title: 'Registry', desc: '142 Frameworks', icon: <BookOpen size={32} weight="bold" />, href: '/templates', color: 'bg-emerald-600' },
          { title: 'Audit Log', desc: 'Trace History', icon: <ChartLineUp size={32} weight="bold" />, href: '/contracts', color: 'bg-orange-600' },
          { title: 'Protocol', desc: 'Jurisdictional Logic', icon: <Scales size={32} weight="bold" />, href: '/settings', color: 'bg-slate-600' },
        ].map((action, i) => (
          <Link key={i} href={action.href} className="no-underline group brutalist-card p-8 flex flex-col items-start gap-8">
            <div className={cn("p-4 text-white shadow-[2px_2px_0_0_black]", action.color)}>
              {action.icon}
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-1)] mb-1">{action.title}</h3>
              <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-3)] leading-none">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        {/* Main Enforcement Feed */}
        <div className="lg:col-span-2 space-y-16">
          <section className="brutalist-card bg-white overflow-hidden">
            <div className="p-8 border-b-2 border-[var(--text-1)] flex items-center justify-between bg-[var(--bg)]">
              <h2 className="heading-section text-2xl uppercase font-black">Active Enforcements</h2>
              <Link href="/contracts" className="text-[9px] font-black uppercase tracking-widest text-[var(--text-3)] hover:text-[var(--text-1)] flex items-center gap-2 no-underline">
                View Ledger &rarr;
              </Link>
            </div>

            <div className="divide-y-2 divide-[var(--text-1)]">
              {recent.length === 0 ? (
                <div className="p-24 text-center">
                  <EmptyState
                    title="Ledger Empty"
                    description="No active protocols detected."
                  />
                </div>
              ) : (
                recent.map((c) => (
                  <Link
                    key={c.id}
                    href={`/contracts/${c.id}`}
                    className="flex items-center justify-between p-10 hover:bg-[var(--bg)] transition-colors group no-underline"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-14 h-14 bg-[var(--text-1)] text-white flex items-center justify-center font-black text-xl shadow-[3px_3px_0_0_#1447E6]">
                        {c.title.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-[var(--text-1)] leading-none mb-2 uppercase tracking-tight">{c.title}</h4>
                        <p className="text-[10px] font-black text-[var(--text-3)] uppercase tracking-widest">
                          {c.parties.map(p => p.name).join(' & ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="text-right hidden sm:block">
                        <div className="font-black text-lg text-[var(--text-1)] tabular-nums font-mono italic">
                          {c.totalAmount ? `$${c.totalAmount.toLocaleString()}` : "IN-KIND"}
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-3)]">
                          State Valuation
                        </div>
                      </div>
                      <div className={cn(
                        "px-4 py-1.5 border-2 border-[var(--text-1)] text-[9px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_black]",
                        c.status === 'active' ? "bg-emerald-400" :
                          c.status === 'pending_signature' ? "bg-amber-400" :
                            "bg-slate-200"
                      )}>
                        {STATUS_LABEL_TEXT[c.status] || c.status}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Trace Logging */}
          <section className="brutalist-card bg-[var(--text-1)] text-white p-12">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="eyebrow text-white opacity-40">System Trace</span>
                <h2 className="heading-section text-white text-2xl uppercase font-black">Live Pulse Logs</h2>
              </div>
              <div className="p-3 border-2 border-white/20">
                <div className="w-3 h-3 bg-[var(--blue)] animate-pulse shadow-[0_0_10px_#1447E6]" />
              </div>
            </div>

            <div className="space-y-10 relative">
              {[
                { type: 'signed', title: 'State Transition', desc: 'Agreement ID_492 verified with secure signature.', time: '2h ago', icon: <Check size={14} weight="bold" /> },
                { type: 'payment', title: 'Value Transfer', desc: 'Asset injection detected from node: Sarah_Jenkins.', time: '5h ago', icon: <PhosphorWallet size={14} weight="bold" /> },
                { type: 'created', title: 'Protocol Init', desc: 'New deterministic draft prepared for global state.', time: 'Yesterday', icon: <Sparkle size={14} weight="bold" /> },
              ].map((activity, i) => (
                <div key={i} className="flex gap-10 items-start group">
                  <div className="w-10 h-10 bg-white text-[var(--text-1)] flex items-center justify-center flex-shrink-0 shadow-[3px_3px_0_0_#1447E6]">
                    {activity.icon}
                  </div>
                  <div className="flex-1 border-b border-white/10 pb-8 group-last:border-none">
                    <div className="flex items-baseline justify-between mb-2">
                      <h5 className="font-black text-sm uppercase tracking-widest">{activity.title}</h5>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{activity.time}</span>
                    </div>
                    <p className="text-xs text-white/60 font-bold leading-relaxed">{activity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-16">
          {/* Risk Monitoring */}
          <section className={cn(
            "brutalist-card p-10",
            overdue.length > 0 ? "bg-red-500 border-red-700 shadow-[6px_6px_0_0_#1A1A18]" : "bg-white"
          )}>
            <div className="flex items-center gap-4 mb-10">
              <Warning size={32} weight="fill" className={overdue.length > 0 ? "text-white" : "text-[var(--text-1)]"} />
              <h3 className={cn("heading-section text-xl uppercase font-black", overdue.length > 0 ? "text-white" : "text-[var(--text-1)]")}>Risk Alert</h3>
            </div>

            {overdue.length === 0 ? (
              <div className="text-center py-10 opacity-40">
                <ShieldCheck size={64} className="mx-auto mb-6" weight="bold" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Zero Protocol Violations</p>
              </div>
            ) : (
              <div className="space-y-6">
                {overdue.map(p => (
                  <Link key={p.id} href={`/contracts/${p.contractId}`} className="block p-6 bg-white border-2 border-black no-underline shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-black text-xs uppercase tracking-tight">{p.contractTitle}</span>
                      <Badge variant="danger" className="text-[8px]">BREACH</Badge>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">DUE {new Date(p.dueDate).toLocaleDateString()}</span>
                      <span className="font-mono font-black text-xl italic">${p.amount.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Global Network State */}
          <section className="brutalist-card bg-[var(--blue)] text-white p-10 shadow-[8px_8px_0_0_black]">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-12">Network State</p>

              <div className="space-y-12">
                <div>
                  <div className="text-5xl font-serif leading-none mb-3">195</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/50">Active Jurisdictions</div>
                </div>

                <div className="h-px bg-white/20" />

                <div>
                  <div className="text-5xl font-serif leading-none mb-3">Real-time</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/50">Enforcement Loops</div>
                </div>
              </div>

              <Link href="/legal-library" className="mt-16 block no-underline group">
                <button className="w-full bg-white text-[var(--text-1)] brutalist-button py-4 text-[9px]">
                  Access Registry Ledger
                </button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
