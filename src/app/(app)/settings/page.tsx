'use client';

import { useUser, UserProfile } from '@clerk/nextjs';
import { 
  Gear, 
  ShieldCheck, 
  Bell, 
  User, 
  CreditCard, 
  ShieldSlash,
  CaretRight,
  Plus
} from "@phosphor-icons/react";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { isLoaded, user } = useUser();
  const [activeTab, setActiveTab] = useState('Profile');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) return <div className="min-h-screen bg-[#010101]" />;

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Security', icon: ShieldCheck },
    { name: 'Billing', icon: CreditCard },
    { name: 'Alerts', icon: Bell },
  ];

  return (
    <div className="space-y-12 pb-32 max-w-5xl mx-auto">
      
      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[11px] font-black text-emerald uppercase tracking-[0.4em] mb-3 block">Your Private Space</span>
          <h1 className="heading-display text-5xl md:text-8xl text-white tracking-tighter italic uppercase">Settings.</h1>
        </motion.div>
      </header>

      <div className="grid lg:grid-cols-4 gap-12">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-4">
           {tabs.map((tab) => (
             <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={cn(
                  "w-full p-5 rounded-2xl flex items-center justify-between transition-all duration-500 border",
                  activeTab === tab.name 
                    ? "bg-emerald/10 border-emerald/30 text-emerald shadow-[inset_0_0_15px_rgba(0,255,209,0.05)]" 
                    : "bg-white/5 border-white/5 text-text-3 hover:bg-white/10 hover:text-white"
                )}
             >
                <div className="flex items-center gap-4">
                   <tab.icon size={22} weight={activeTab === tab.name ? 'fill' : 'bold'} />
                   <span className="text-[11px] font-black uppercase tracking-widest">{tab.name}</span>
                </div>
                {activeTab === tab.name && <CaretRight size={16} weight="bold" />}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
           <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-10 rounded-[40px] bg-[#080808] border border-white/5 liquid-gloss min-h-[500px] relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald/5 blur-3xl opacity-50" />
              
              <div className="relative z-10">
                 <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4 italic italic uppercase tracking-tighter">
                    {activeTab} <span className="text-emerald not-italic text-sm">Settings</span>
                 </h2>
                 
                 {activeTab === 'Profile' && (
                    <div className="space-y-10">
                       <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl bg-white/5 border border-white/5">
                          <div className="w-24 h-24 rounded-2xl border-2 border-emerald p-1 shadow-[0_0_20px_rgba(0,255,209,0.2)]">
                             <img src={user?.imageUrl} alt="Avatar" className="w-full h-full rounded-xl object-cover" />
                          </div>
                          <div className="text-center md:text-left">
                             <h4 className="text-xl font-black text-white">{user?.fullName}</h4>
                             <p className="text-[10px] text-text-3 font-black uppercase tracking-widest mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
                          </div>
                       </div>
                       
                       <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                          {[
                            { label: 'Trust Rating', val: 'Excellent (98%)' },
                            { label: 'Data Region', val: 'US-East (Active)' }
                          ].map(stat => (
                            <div key={stat.label} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                               <p className="text-[9px] font-black text-text-3 uppercase tracking-widest mb-1">{stat.label}</p>
                               <p className="text-lg font-black text-white italic">{stat.val}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                 )}
                 
                 {activeTab !== 'Profile' && (
                    <div className="py-20 text-center flex flex-col items-center gap-8">
                       <ShieldSlash size={64} className="text-text-3 opacity-20" />
                       <p className="text-text-3 font-black text-[10px] uppercase tracking-[0.4em]">Section under maintenance... sync in progress.</p>
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-glow-pulse" />
                    </div>
                 )}
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
