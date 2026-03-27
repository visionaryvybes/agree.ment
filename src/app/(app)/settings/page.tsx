'use client';

import { useUser } from '@/lib/auth';
import {
  Gear, ShieldCheck, Bell, User, CreditCard,
  ShieldSlash, CaretRight, CheckCircle, Lock, Globe,
} from "@phosphor-icons/react";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const TABS = [
  { name: 'Profile',  icon: User        },
  { name: 'Security', icon: ShieldCheck },
  { name: 'Billing',  icon: CreditCard  },
  { name: 'Alerts',   icon: Bell        },
];

export default function SettingsPage() {
  const { isLoaded, user }   = useUser();
  const [activeTab, setTab]   = useState('Profile');
  const [mounted,  setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !isLoaded) return <div className="min-h-screen bg-[#010101]" />;

  return (
    <div className="space-y-7 pb-24 max-w-5xl mx-auto">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="pb-6 border-b border-white/[0.07]">
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-[10px] font-black text-emerald uppercase tracking-[0.4em] block mb-1">Account</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight italic uppercase">Settings.</h1>
        </motion.div>
      </header>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
          {TABS.map(tab => (
            <button
              key={tab.name}
              onClick={() => setTab(tab.name)}
              className={cn(
                'flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all duration-300 whitespace-nowrap flex-shrink-0 lg:w-full',
                activeTab === tab.name
                  ? 'bg-emerald/[0.08] border-emerald/25 text-emerald'
                  : 'bg-white/[0.03] border-white/[0.07] text-white/35 hover:text-white hover:border-white/15',
              )}
            >
              <tab.icon size={15} weight={activeTab === tab.name ? 'fill' : 'bold'} />
              <span className="text-[11px] font-black uppercase tracking-widest">{tab.name}</span>
              {activeTab === tab.name && <CaretRight size={12} weight="bold" className="ml-auto hidden lg:block" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="p-5 sm:p-6 rounded-3xl bg-[#080808] border border-white/[0.07] min-h-[400px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/[0.04] blur-[50px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-base font-black text-white uppercase tracking-tight">{activeTab}</h2>
                <span className="text-[9px] font-black text-emerald uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald/10 border border-emerald/20">Settings</span>
              </div>

              {/* ── Profile Tab ── */}
              {activeTab === 'Profile' && (
                <div className="space-y-5">
                  {/* Avatar + name card */}
                  <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                    <div className="w-14 h-14 rounded-xl border-2 border-emerald/40 shadow-[0_0_16px_rgba(0,255,209,0.15)] flex-shrink-0 overflow-hidden bg-gradient-to-br from-emerald/30 to-blue/30 flex items-center justify-center">
                      {user?.imageUrl
                        ? <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                        : <span className="text-xl font-black text-white">{user?.firstName?.charAt(0) ?? 'G'}</span>
                      }
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{user?.fullName || 'Guest User'}</h4>
                      <p className="text-[10px] text-white/35 font-bold mt-0.5">{user?.primaryEmailAddress?.emailAddress || 'guest@agreemint.dev'}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald/10 border border-emerald/20">
                      <CheckCircle size={12} weight="fill" className="text-emerald" />
                      <span className="text-[9px] font-black text-emerald uppercase tracking-widest">Verified</span>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { icon: CheckCircle, label: 'Trust Rating',   value: 'Excellent — 98%', color: 'text-emerald' },
                      { icon: Globe,       label: 'Data Region',    value: 'US-East  (Active)', color: 'text-blue'   },
                      { icon: Lock,        label: 'Encryption',     value: 'AES-256 End-to-End', color: 'text-amber' },
                      { icon: ShieldCheck, label: 'Plan',           value: 'AgreeMint Free',   color: 'text-white'  },
                    ].map(stat => (
                      <div key={stat.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                        <stat.icon size={16} weight="bold" className={cn(stat.color, 'flex-shrink-0 opacity-60')} />
                        <div>
                          <p className="text-[9px] font-black text-white/25 uppercase tracking-widest">{stat.label}</p>
                          <p className="text-xs font-black text-white/70 mt-0.5">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Preferences */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[10px] font-black text-white/25 uppercase tracking-widest mb-3">Preferences</p>
                    {[
                      { label: 'Email notifications for new agreements', enabled: true  },
                      { label: 'Weekly summary digest',                  enabled: true  },
                      { label: 'Marketing & product updates',            enabled: false },
                    ].map((pref, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <span className="text-xs text-white/45 font-medium">{pref.label}</span>
                        <div className={cn('w-9 h-5 rounded-full border transition-colors flex-shrink-0', pref.enabled ? 'bg-emerald/20 border-emerald/40' : 'bg-white/[0.04] border-white/10')}>
                          <div className={cn('w-3.5 h-3.5 rounded-full m-0.5 transition-all', pref.enabled ? 'bg-emerald translate-x-4' : 'bg-white/30')} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Other Tabs ── */}
              {activeTab !== 'Profile' && (
                <div className="py-16 flex flex-col items-center gap-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <ShieldSlash size={20} className="text-white/20" />
                  </div>
                  <p className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Coming Soon</p>
                  <p className="text-[11px] text-white/15 max-w-xs">This section is under development. Check back soon for {activeTab.toLowerCase()} settings.</p>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse mt-2" />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
