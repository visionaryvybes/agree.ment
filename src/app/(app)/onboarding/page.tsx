'use client';

import { useUser } from '@clerk/nextjs';
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
  const { isLoaded, user } = useUser();
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
    <div className="max-w-4xl mx-auto pb-32 pt-20 min-h-[90vh] flex flex-col justify-center relative">
      
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
                 <h1 className="heading-display text-7xl md:text-9xl text-white tracking-tighter italic uppercase leading-none">
                    Your <span className="text-emerald not-italic">Account</span>.
                 </h1>
                 <p className="text-text-2 text-2xl font-black max-w-2xl mx-auto leading-tight uppercase tracking-tight">
                    Welcome, <span className="text-white underline decoration-emerald decoration-4 underline-offset-8">{user?.firstName}</span>. Let's secure your workspace and verify your ID.
                 </p>
             </div>

             <div className="flex flex-col items-center gap-10 pt-10">
                <Magnetic>
                   <button 
                     onClick={handleVerify}
                     disabled={verifying}
                     className="btn-vibrant btn-vibrant-emerald px-20 py-8 text-2xl"
                   >
                     {verifying ? (
                        <>
                          <div className="w-8 h-8 border-4 border-[#010101]/20 border-t-[#010101] rounded-full animate-spin" />
                          VERIFYING...
                        </>
                     ) : (
                        <>
                           GET STARTED
                           <ArrowRight size={32} weight="bold" />
                        </>
                     )}
                   </button>
                </Magnetic>
                <div className="flex items-center gap-6">
                   <div className="h-px w-10 bg-emerald/30" />
                   <p className="text-[12px] font-black text-emerald uppercase tracking-[0.6em]">SIMPLE • SECURE • AGREEMINT</p>
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
                  <h2 className="heading-display text-6xl md:text-8xl text-white tracking-tighter italic uppercase text-emerald leading-none">Ready.</h2>
                  <p className="text-emerald font-black text-[14px] uppercase tracking-[0.6em] bg-emerald/10 px-8 py-2 rounded-full inline-block">ACCOUNT FULLY AUTHENTICATED</p>
             </div>

             <div className="grid md:grid-cols-2 gap-10">
                 <Link 
                   href="/dashboard"
                   className="group p-12 bg-white/[0.03] border border-white/10 hover:border-emerald/50 rounded-[50px] transition-all duration-700 backdrop-blur-3xl flex flex-col justify-between h-[450px] shadow-2xl relative overflow-hidden"
                 >
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 blur-3xl group-hover:bg-emerald/10 transition-colors" />
                    <div className="w-24 h-24 relative flex-shrink-0 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                       <img src="/assets/3d/lock_simple.png" className="w-full h-full object-contain" alt="Lock" />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white group-hover:text-emerald transition-colors uppercase italic tracking-tighter leading-none">View Deals</h3>
                       <p className="text-lg text-text-3 font-black mt-4 uppercase tracking-tight opacity-60">Manage your secured files.</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald group-hover:text-[#010101] transition-all duration-500 shadow-xl">
                       <ArrowRight size={32} weight="bold" className="group-hover:translate-x-3 transition-transform" />
                    </div>
                 </Link>

                 <Link 
                   href="/contracts/new"
                   className="group p-12 bg-emerald text-[#010101] rounded-[50px] transition-all duration-700 shadow-[0_0_100px_rgba(0,255,209,0.25)] flex flex-col justify-between h-[450px] border-8 border-[#010101] hover:scale-[1.03] active:scale-95"
                 >
                    <div className="w-24 h-24 relative flex-shrink-0 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 drop-shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                       <img src="/assets/3d/document_simple.png" className="w-full h-full object-contain" alt="Document" />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">New File</h3>
                       <p className="text-lg font-black opacity-60 mt-4 uppercase tracking-tight">Protect a new agreement.</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-[#010101] text-emerald flex items-center justify-center transition-all duration-500 shadow-2xl group-hover:bg-white group-hover:text-[#010101]">
                       <ArrowRight size={32} weight="bold" className="group-hover:translate-x-3 transition-transform" />
                    </div>
                 </Link>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
