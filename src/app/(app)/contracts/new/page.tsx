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
  ChatTeardropText,
  Sparkle,
} from "@phosphor-icons/react";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/ui/magnetic';
import DigitalSeal from '@/components/ui/digital-seal';
import ChatImport from '@/components/ChatImport';
import { v4 as uuid } from 'uuid';

export default function NewContractPage() {
  const router = useRouter();
  const { addContract } = useProtocolActions();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Generating agreement...');
  const [showChatImport, setShowChatImport] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Service Contract',
    partyA: '',
    partyB: '',
    totalAmount: 0,
    jurisdiction: '',
    description: '',
  });

  useEffect(() => { setMounted(true); }, []);

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    setLoadingMsg('Generating agreement with AI...');

    try {
      const res = await fetch('/api/system/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: formData.description || `A ${formData.category} agreement between two parties.`,
          party1: formData.partyA,
          party2: formData.partyB,
          jurisdiction: formData.jurisdiction || 'General',
          category: formData.category,
        }),
      });

      setLoadingMsg('Securing your agreement...');

      let clauses: any[] = [];
      let summary = '';
      let generatedTitle = formData.title;

      if (res.ok) {
        const data = await res.json();
        const generated = data.contract;
        if (generated?.clauses) {
          clauses = generated.clauses.map((c: any) => ({
            id: uuid(),
            title: c.title,
            content: c.content,
            isRequired: c.isRequired ?? true,
            legalBasis: c.legalBasis,
          }));
        }
        if (generated?.summary) summary = generated.summary;
        if (generated?.title && !formData.title) generatedTitle = generated.title;
      }

      const newContract: any = {
        title: generatedTitle || formData.title,
        category: formData.category.toLowerCase().replace(/\s+/g, '_') as any,
        description: summary || formData.description || `Agreement for ${formData.title}`,
        parties: [
          { id: uuid(), name: formData.partyA, email: '', role: 'creator' as const },
          { id: uuid(), name: formData.partyB, email: '', role: 'counterparty' as const },
        ],
        totalAmount: formData.totalAmount,
        currency: 'USD',
        clauses,
        paymentSchedule: [],
        escalation: [],
        jurisdiction: formData.jurisdiction || 'General',
        governingLaw: formData.jurisdiction ? `Laws of ${formData.jurisdiction}` : 'General Contract Law',
        status: 'pending_signature' as const,
        metadata: {},
      };

      const id = addContract(newContract);
      router.push(`/contracts/${id}`);
    } catch (err) {
      console.error('Contract creation error:', err);
      setError('Failed to generate. Please try again.');
      setLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#010101]" />;

  return (
    <div className="max-w-3xl mx-auto pb-24 px-4 relative">
      <div className="vibrant-glow top-0 left-1/4 w-[500px] h-[500px] bg-emerald/10 animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 right-1/4 w-[400px] h-[400px] bg-blue/10" />

      {/* HEADER */}
      <header className="mb-10 flex items-center justify-between relative z-10 pt-6">
        <Link href="/dashboard" prefetch={true} className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-emerald/50 transition-all group">
          <ArrowLeft size={20} weight="bold" className="group-hover:-translate-x-0.5 transition-transform" />
        </Link>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s: number) => (
            <div key={s} className={cn(
              "transition-all duration-500 rounded-full",
              step >= s
                ? "w-8 h-2 bg-emerald shadow-[0_0_12px_#00FFD1]"
                : "w-2 h-2 bg-white/10"
            )} />
          ))}
        </div>
      </header>

      {/* Chat Import Wizard */}
      {showChatImport && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center py-8 relative z-10">
          <ChatImport
            onImport={(text, source) => {
              setFormData({ ...formData, title: `Chat Agreement (${source})`, description: text });
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
            className="space-y-8 relative z-10"
          >
            <div className="space-y-2">
              <span className="text-[11px] font-black text-emerald uppercase tracking-[0.5em] block">Step 01</span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight italic uppercase">Agreement Details.</h1>
            </div>

            {/* Import from Chat */}
            <button
              onClick={() => setShowChatImport(true)}
              className="w-full p-4 rounded-2xl bg-white/[0.03] border border-dashed border-white/10 flex items-center justify-center gap-3 text-[11px] font-black text-white/40 uppercase tracking-widest hover:border-emerald/40 hover:text-emerald transition-all group"
            >
              <ChatTeardropText size={18} weight="bold" className="group-hover:text-emerald" />
              Import from Chat (WhatsApp, SMS, Email)
            </button>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Agreement Title</p>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Alpha Settlement"
                  className="w-full p-4 text-lg font-black bg-white/[0.03] border border-white/10 focus:border-emerald/50 rounded-2xl transition-all text-white placeholder:text-white/20 uppercase tracking-tight"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Describe the Agreement (optional)</p>
                <textarea
                  placeholder="What is this agreement about? Any specific terms you need..."
                  rows={3}
                  className="w-full p-4 text-sm font-medium bg-white/[0.03] border border-white/10 focus:border-emerald/50 rounded-2xl transition-all text-white placeholder:text-white/20 resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Category</p>
                  <select
                    className="w-full p-4 font-black bg-white/[0.03] border border-white/10 focus:border-emerald/50 rounded-2xl transition-all text-white text-sm appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Service Contract</option>
                    <option>Loan Agreement</option>
                    <option>NDA</option>
                    <option>Freelance</option>
                    <option>Partnership</option>
                    <option>Licensing</option>
                    <option>Settlement</option>
                    <option>Escrow</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Total Value (USD)</p>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-4 font-black bg-white/[0.03] border border-white/10 focus:border-emerald/50 rounded-2xl transition-all text-white text-sm placeholder:text-white/20"
                    value={formData.totalAmount || ''}
                    onChange={e => setFormData({...formData, totalAmount: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Jurisdiction (optional)</p>
                <input
                  type="text"
                  placeholder="e.g. Lagos Nigeria, California USA, London UK"
                  className="w-full p-4 text-sm font-medium bg-white/[0.03] border border-white/10 focus:border-emerald/50 rounded-2xl transition-all text-white placeholder:text-white/20"
                  value={formData.jurisdiction}
                  onChange={e => setFormData({...formData, jurisdiction: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.title}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_rgba(0,255,209,0.25)] disabled:opacity-40 disabled:scale-100"
              >
                Next Step
                <ArrowRight size={18} weight="bold" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 relative z-10"
          >
            <div className="space-y-2">
              <span className="text-[11px] font-black text-emerald uppercase tracking-[0.5em] block">Step 02</span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight italic uppercase">Stakeholders.</h1>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5 relative overflow-hidden group hover:border-emerald/40 transition-all duration-500">
                <div className="w-12 h-12 bg-emerald/10 rounded-2xl flex items-center justify-center text-emerald border border-emerald/20">
                  <User size={24} weight="bold" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Primary Party (You)</p>
                  <input
                    type="text"
                    placeholder="Your name or entity"
                    className="w-full bg-transparent border-b-2 border-white/10 pb-2 text-lg font-black text-white uppercase tracking-tight focus:border-emerald transition-all outline-none placeholder:text-white/15"
                    value={formData.partyA}
                    onChange={e => setFormData({...formData, partyA: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5 relative overflow-hidden group hover:border-blue/40 transition-all duration-500">
                <div className="w-12 h-12 bg-blue/10 rounded-2xl flex items-center justify-center text-blue border border-blue/20">
                  <Users size={24} weight="bold" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Counter Party</p>
                  <input
                    type="text"
                    placeholder="Their name or entity"
                    className="w-full bg-transparent border-b-2 border-white/10 pb-2 text-lg font-black text-white uppercase tracking-tight focus:border-blue transition-all outline-none placeholder:text-white/15"
                    value={formData.partyB}
                    onChange={e => setFormData({...formData, partyB: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <button onClick={() => setStep(1)} className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] hover:text-white transition-all flex items-center gap-2">
                <ArrowLeft size={16} weight="bold" />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.partyA || !formData.partyB}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_rgba(0,255,209,0.25)] disabled:opacity-40 disabled:scale-100"
              >
                Review Intent
                <ArrowRight size={18} weight="bold" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white/[0.03] border border-white/10 rounded-3xl relative overflow-hidden backdrop-blur-sm shadow-2xl z-10"
          >
            <div className="vibrant-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald/5 blur-[100px] rounded-full" />

            {loading ? (
              <div className="space-y-8 relative z-10 flex flex-col items-center px-8">
                <div className="w-16 h-16 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin" />
                <div className="space-y-3">
                  <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">{loadingMsg}</h4>
                  <p className="text-[11px] font-black text-emerald uppercase tracking-[0.6em] animate-pulse flex items-center justify-center gap-2">
                    <Sparkle size={12} weight="bold" />
                    AI Drafting Clauses
                    <Sparkle size={12} weight="bold" />
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-10 relative z-10 px-8">
                <div className="w-20 h-20 bg-emerald rounded-3xl flex items-center justify-center mx-auto text-[#010101] shadow-[0_0_60px_rgba(0,255,209,0.4)] border-4 border-[#010101]">
                  <ShieldCheck size={40} weight="bold" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">Ready to <span className="text-emerald">Finalize</span>.</h2>
                  <p className="text-emerald font-black text-[12px] uppercase tracking-[0.5em] bg-emerald/10 px-6 py-2 rounded-full inline-block">AI will generate your clauses</p>
                </div>

                {/* Summary */}
                <div className="text-left bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3 max-w-md mx-auto">
                  {[
                    { label: 'Title', val: formData.title },
                    { label: 'Category', val: formData.category },
                    { label: 'Party A', val: formData.partyA },
                    { label: 'Party B', val: formData.partyB },
                    { label: 'Value', val: formData.totalAmount ? `$${formData.totalAmount.toLocaleString()}` : 'N/A' },
                    { label: 'Jurisdiction', val: formData.jurisdiction || 'General' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center gap-4">
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{row.label}</span>
                      <span className="text-[11px] font-black text-white truncate">{row.val}</span>
                    </div>
                  ))}
                </div>

                {error && (
                  <p className="text-rose text-[11px] font-black uppercase tracking-widest">{error}</p>
                )}

                <div className="flex flex-col items-center gap-4">
                  <Magnetic>
                    <button
                      onClick={handleCreate}
                      className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-emerald text-[#010101] text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,255,209,0.3)]"
                    >
                      <Sparkle size={18} weight="bold" />
                      Generate Agreement
                    </button>
                  </Magnetic>
                  <button onClick={() => setStep(2)} className="text-[11px] font-black text-white/25 uppercase tracking-[0.3em] hover:text-white transition-all flex items-center gap-2">
                    <ArrowLeft size={14} weight="bold" />
                    Back to Parties
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
