'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProtocolActions } from '@/store/contracts';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  CurrencyDollar,
  Users,
  ChatTeardropText
} from "@phosphor-icons/react";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/ui/magnetic';
import DigitalSeal from '@/components/ui/digital-seal';
import ChatImport from '@/components/ChatImport';

export default function NewContractPage() {
  const router = useRouter();
  const { addContract } = useProtocolActions();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showChatImport, setShowChatImport] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Service Contract',
    partyA: '',
    partyB: '',
    totalAmount: 0,
  });

  useEffect(() => { setMounted(true); }, []);

  const handleCreate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    
    const newContract: any = {
      title: formData.title,
      category: formData.category as any,
      description: `Agreement for ${formData.title}`,
      parties: [
        { id: '1', name: formData.partyA, email: '', role: 'creator' as const },
        { id: '2', name: formData.partyB, email: '', role: 'counterparty' as const }
      ],
      totalAmount: formData.totalAmount,
      currency: 'USD',
      clauses: [],
      paymentSchedule: [],
      escalation: [],
      jurisdiction: 'Global',
      governingLaw: 'Digital Trade Act',
      status: 'pending_signature' as const,
      metadata: {},
    };
    
    const id = addContract(newContract);
    router.push(`/contracts/${id}`);
  };

  if (!mounted) return <div className="min-h-screen bg-[#010101]" />;

  return (
    <div className="max-w-4xl mx-auto pb-32 px-4 relative">
      <div className="vibrant-glow top-0 left-1/4 w-[600px] h-[600px] bg-emerald/10 animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 right-1/4 w-[500px] h-[500px] bg-blue/10" />

      {/* HEADER */}
      <header className="mb-20 flex items-center justify-between relative z-10">
         <Magnetic>
            <Link href="/dashboard" prefetch={true} className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-text-3 hover:text-white hover:border-emerald/50 transition-all backdrop-blur-3xl shadow-xl group">
               <ArrowLeft size={28} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
            </Link>
         </Magnetic>
         <div className="flex items-center gap-4">
            {[1, 2, 3].map((s: number) => (
              <div key={s} className={cn(
                "w-3 h-3 rounded-full transition-all duration-700",
                step >= s ? "bg-emerald shadow-[0_0_20px_#00FFD1] scale-125" : "bg-white/10"
              )} />
            ))}
         </div>
      </header>

      {/* Chat Import Wizard */}
      {showChatImport && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center py-10 relative z-10">
          <ChatImport
            onImport={(text, source) => {
              setFormData({ ...formData, title: `Chat Agreement (${source})` });
              setShowChatImport(false);
            }}
            onCancel={() => setShowChatImport(false)}
          />
        </motion.div>
      )}

      {/* STEPS */}
      <AnimatePresence mode="wait">
        {step === 1 && !showChatImport && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12 relative z-10"
          >
             <div className="space-y-6">
                <span className="text-[12px] font-black text-emerald uppercase tracking-[0.5em] block">Phase 01</span>
                <h1 className="heading-display text-6xl md:text-9xl text-white tracking-tighter italic uppercase leading-none">Agreement Details.</h1>
             </div>

             {/* Import from Chat */}
             <button
               onClick={() => setShowChatImport(true)}
               className="w-full p-6 rounded-2xl bg-white/[0.03] border border-dashed border-white/10 flex items-center justify-center gap-3 text-[11px] font-black text-text-3 uppercase tracking-widest hover:border-emerald/40 hover:text-emerald transition-all group"
             >
               <ChatTeardropText size={20} weight="bold" className="group-hover:text-emerald" />
               Import from a Chat (WhatsApp, SMS, Email)
             </button>

             <div className="space-y-10">
                <div className="space-y-6">
                   <p className="text-[11px] font-black text-text-3 uppercase tracking-[0.4em] ml-2">Agreement Title</p>
                   <input 
                      autoFocus
                      type="text" 
                      placeholder="e.g. ALPHA SETTLEMENT"
                      className="w-full p-10 text-4xl font-black bg-white/[0.03] border border-white/10 focus:border-emerald/50 rounded-[32px] transition-all backdrop-blur-3xl text-white placeholder:text-text-3/20 uppercase tracking-tighter"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                   />
                </div>
                
                <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-6 text-left">
                       <p className="text-[11px] font-black text-text-3 uppercase tracking-[0.4em] ml-2">Category</p>
                       <select 
                          className="w-full p-10 font-black bg-white/[0.03] border border-white/10 focus:border-emerald/50 rounded-[32px] transition-all backdrop-blur-3xl text-white uppercase text-lg appearance-none cursor-pointer"
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                       >
                          <option>Service Contract</option>
                          <option>Licensing</option>
                          <option>Settlement</option>
                          <option>Escrow</option>
                       </select>
                   </div>
                   <div className="space-y-6 text-left">
                       <p className="text-[11px] font-black text-text-3 uppercase tracking-[0.4em] ml-2">Total Value ($)</p>
                       <input 
                          type="number" 
                          placeholder="0.00"
                          className="w-full p-10 font-black bg-white/[0.03] border border-white/10 focus:border-emerald/50 rounded-[32px] transition-all backdrop-blur-3xl text-white text-3xl placeholder:text-text-3/20"
                          value={formData.totalAmount || ''}
                          onChange={e => setFormData({...formData, totalAmount: Number(e.target.value)})}
                       />
                   </div>
                </div>
             </div>

             <div className="pt-16 border-t border-white/10 flex justify-end">
                <Magnetic>
                   <button 
                     onClick={() => setStep(2)}
                     disabled={!formData.title}
                     className="btn-vibrant btn-vibrant-emerald px-16 py-7 text-xl"
                   >
                     NEXT STEP
                     <ArrowRight size={28} weight="bold" />
                   </button>
                </Magnetic>
             </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12 relative z-10"
          >
             <div className="space-y-6">
                <span className="text-[12px] font-black text-emerald uppercase tracking-[0.5em] block">Phase 02</span>
                <h1 className="heading-display text-6xl md:text-9xl text-white tracking-tighter italic uppercase leading-none">Stakeholders.</h1>
             </div>

             <div className="grid md:grid-cols-2 gap-10">
                <div className="p-12 rounded-[50px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl space-y-10 relative overflow-hidden group hover:border-emerald/40 transition-all duration-700">
                   <div className="vibrant-glow inset-0 bg-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative">
                      <DigitalSeal />
                      <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-[#010101] rounded-2xl flex items-center justify-center text-emerald shadow-2xl border border-emerald/20">
                         <User size={36} weight="bold" />
                      </div>
                   </div>
                   <div className="space-y-6 relative z-10">
                      <p className="text-[11px] font-black text-text-3 uppercase tracking-[0.4em] ml-2">PRIMARY PARTY (YOU)</p>
                      <input 
                        type="text" 
                        placeholder="NAME OR ENTITY"
                        className="w-full bg-transparent border-b-4 border-white/10 p-4 text-3xl font-black text-white uppercase tracking-tighter focus:border-emerald transition-all outline-none placeholder:text-text-3/20"
                        value={formData.partyA}
                        onChange={e => setFormData({...formData, partyA: e.target.value})}
                      />
                   </div>
                </div>
                
                <div className="p-12 rounded-[50px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl space-y-10 relative overflow-hidden group hover:border-blue/40 transition-all duration-700">
                   <div className="vibrant-glow inset-0 bg-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-text-3 border border-white/10 group-hover:bg-blue group-hover:text-white transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
                      <Users size={40} weight="bold" />
                   </div>
                   <div className="space-y-6 relative z-10">
                      <p className="text-[11px] font-black text-text-3 uppercase tracking-[0.4em] ml-2">COUNTER PARTY</p>
                      <input 
                        type="text" 
                        placeholder="NAME OR ENTITY"
                        className="w-full bg-transparent border-b-4 border-white/10 p-4 text-3xl font-black text-white uppercase tracking-tighter focus:border-blue transition-all outline-none placeholder:text-text-3/20"
                        value={formData.partyB}
                        onChange={e => setFormData({...formData, partyB: e.target.value})}
                      />
                   </div>
                </div>
             </div>

             <div className="pt-16 border-t border-white/10 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="text-[12px] font-black text-text-3 uppercase tracking-[0.5em] hover:text-white transition-all flex items-center gap-3">
                   <ArrowLeft weight="bold" />
                   Go Back
                </button>
                <Magnetic>
                   <button 
                     onClick={() => setStep(3)}
                     disabled={!formData.partyA || !formData.partyB}
                     className="btn-vibrant btn-vibrant-emerald px-16 py-7 text-xl"
                   >
                     REVIEW INTENT
                     <ArrowRight size={28} weight="bold" />
                   </button>
                </Magnetic>
             </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-white/[0.03] border border-white/10 rounded-[60px] relative overflow-hidden backdrop-blur-3xl shadow-[0_60px_120px_rgba(0,0,0,0.6)] z-10"
          >
             <div className="vibrant-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald/5 blur-[120px] rounded-full" />
             
             {loading ? (
                <div className="space-y-12 relative z-10 flex flex-col items-center">
                   <div className="w-24 h-24 border-8 border-emerald/20 border-t-emerald rounded-full animate-spin" />
                   <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Securing...</h4>
                   <p className="text-[12px] font-black text-emerald uppercase tracking-[0.6em] animate-pulse">AGREEMINT VERIFICATION</p>
                </div>
             ) : (
                <div className="space-y-16 relative z-10">
                   <div className="w-32 h-32 bg-emerald rounded-[40px] flex items-center justify-center mx-auto text-[#010101] shadow-[0_0_100px_rgba(0,255,209,0.4)] animate-bounce-slow border-8 border-[#010101]">
                      <ShieldCheck size={64} weight="bold" />
                   </div>
                   <div className="space-y-6">
                      <h2 className="heading-display text-7xl md:text-8xl text-white tracking-tighter uppercase italic leading-none">Ready to <span className="text-emerald not-italic underline decoration-4 underline-offset-8">Finalize</span>.</h2>
                      <p className="text-emerald font-black text-[14px] uppercase tracking-[0.6em] bg-emerald/10 px-10 py-3 rounded-full inline-block">SECURE • VERIFIED • BINDING</p>
                   </div>
                   
                   <div className="flex flex-col items-center gap-10 pt-10">
                      <Magnetic>
                         <button 
                           onClick={handleCreate}
                           className="btn-vibrant btn-vibrant-emerald px-24 py-8 text-2xl"
                         >
                           CREATE AGREEMENT
                         </button>
                      </Magnetic>
                      <button onClick={() => setStep(2)} className="text-[12px] font-black text-text-3 uppercase tracking-[0.5em] hover:text-white transition-all flex items-center gap-3">
                         <ArrowLeft weight="bold" />
                         Back to Reviews
                      </button>
                   </div>
                </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
