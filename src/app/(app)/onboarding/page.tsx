'use client';

import { useUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  User, 
  CaretRight, 
  PlusCircle, 
  ArrowRight,
  SealCheck,
  Fingerprint,
} from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/ui/magnetic';
import dynamic from 'next/dynamic';

const Vault3D = dynamic(() => import('@/components/ui/vault-3d'), { ssr: false });

export default function OnboardingPage() {
  const router = useRouter();
  const clerk = useUser();
  const isLoaded = clerk?.isLoaded ?? true;
  const user = clerk?.user;
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    await new Promise(r => setTimeout(r, 2000));
    setStep(2);
    setVerifying(false);
  };

  if (!mounted || !isLoaded) return <div className="min-h-screen bg-[#010101]" />;

  return (
    <div className="max-w-2xl mx-auto pb-20 pt-12 min-h-[80vh] flex flex-col justify-center relative">
      
      {/* ── BACKGROUND GLOWS ─────────────────────────────────────── */}
      <div className="vibrant-glow top-0 left-1/4 w-[600px] h-[600px] bg-emerald/15 animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 right-1/4 w-[500px] h-[500px] bg-blue/10" />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-16 relative z-10"
          >
             <div className="w-48 h-48 mx-auto">
                <Vault3D />
             </div>
             
             <div className="space-y-8">
                 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight italic uppercase leading-tight">
                    Your <span className="text-emerald not-italic">Account</span>.
                 </h1>
                 <p className="text-white/50 text-base font-medium max-w-md mx-auto leading-relaxed">
                    Welcome, <span className="text-white font-black">{user?.firstName || 'there'}</span>. Let's secure your workspace.
                 </p>
             </div>

             <div className="flex flex-col items-center gap-10 pt-10">
                <Magnetic>
                    <button 
                      onClick={handleVerify}
                      disabled={verifying}
                      className="px-8 py-3.5 rounded-2xl bg-emerald text-[#010101] text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_rgba(0,255,209,0.25)] flex items-center gap-3"
                    >
                      {verifying ? (
                         <>
                           <div className="w-4 h-4 border-2 border-[#010101]/20 border-t-[#010101] rounded-full animate-spin" />
                           Processing...
                         </>
                      ) : (
                         <>
                            Get Started
                            <ArrowRight size={16} weight="bold" />
                         </>
                      )}
                    </button>
                </Magnetic>
                <div className="flex items-center gap-6">
                   <div className="h-px w-10 bg-emerald/30" />
                   <p className="text-[12px] font-black text-emerald uppercase tracking-[0.4em]">SECURE • PROFESSIONAL • AGREEMINT</p>
                   <div className="h-px w-10 bg-emerald/30" />
                </div>
             </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-16 relative z-10"
          >
             <div className="text-center space-y-8">
                <div className="w-24 h-24 bg-emerald rounded-3xl flex items-center justify-center mx-auto text-[#010101] shadow-[0_0_80px_rgba(0,255,209,0.4)] mb-12 border-8 border-[#010101]">
                   <SealCheck size={48} weight="bold" />
                </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-emerald italic uppercase tracking-tight">Ready.</h2>
                  <p className="text-emerald font-black text-[14px] uppercase tracking-[0.6em] bg-emerald/10 px-8 py-2 rounded-full inline-block">ACCOUNT FULLY AUTHENTICATED</p>
             </div>

             <div className="grid md:grid-cols-2 gap-10">
                 <Link
                   href="/dashboard"
                   className="group p-6 sm:p-8 bg-white/[0.03] border border-white/10 hover:border-emerald/40 rounded-3xl transition-all duration-500 flex flex-col gap-6 relative overflow-hidden hover:-translate-y-1"
                 >
                    <div className="w-14 h-14 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                       <img src="/assets/3d/lock_simple.png" className="w-full h-full object-contain" alt="Lock" />
                    </div>
                    <div className="flex-1">
                       <h3 className="text-lg font-black text-white group-hover:text-emerald transition-colors uppercase italic tracking-tight">View Deals</h3>
                       <p className="text-sm text-white/40 mt-1">Manage your secured files.</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:bg-emerald group-hover:text-[#010101] transition-all duration-400">
                       <ArrowRight size={16} weight="bold" className="text-white/30 group-hover:text-[#010101]" />
                    </div>
                 </Link>

                 <Link
                   href="/contracts/new"
                   className="group p-6 sm:p-8 bg-emerald text-[#010101] rounded-3xl transition-all duration-400 shadow-[0_0_40px_rgba(0,255,209,0.2)] flex flex-col gap-6 hover:scale-[1.02] active:scale-[0.98]"
                   style={{ border: '3px solid #010101' }}
                 >
                    <div className="w-14 h-14 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                       <img src="/assets/3d/document_simple.png" className="w-full h-full object-contain" alt="Document" />
                    </div>
                    <div className="flex-1">
                       <h3 className="text-lg font-black uppercase italic tracking-tight">New Agreement</h3>
                       <p className="text-sm font-medium opacity-60 mt-1">Protect a new deal now.</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-[#010101] text-emerald flex items-center justify-center">
                       <ArrowRight size={16} weight="bold" />
                    </div>
                 </Link>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
