"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatTeardropText, 
  WhatsappLogo, 
  EnvelopeSimple, 
  AppWindow, 
  ArrowRight,
  CheckCircle,
  X,
  MagnifyingGlass,
  Sparkle,
  ClipboardText
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/ui/magnetic";

interface ChatImportProps {
  onImport: (text: string, source: string) => void;
  onCancel: () => void;
}

const SOURCES = [
  { id: 'whatsapp', label: 'WhatsApp', icon: WhatsappLogo, color: 'text-emerald' },
  { id: 'sms', label: 'SMS/iMessage', icon: ChatTeardropText, color: 'text-blue' },
  { id: 'email', label: 'Email', icon: EnvelopeSimple, color: 'text-amber' },
  { id: 'other', label: 'Other Chat', icon: AppWindow, color: 'text-rose' },
];

export default function ChatImport({ onImport, onCancel }: ChatImportProps) {
  const [step, setStep] = useState(1);
  const [source, setSource] = useState('');
  const [text, setText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleParse = async () => {
    setIsParsing(true);
    // Reviewing conversation delay
    await new Promise(r => setTimeout(r, 2000));
    setStep(3);
    setIsParsing(false);
  };

  const handleConfirm = () => {
    onImport(text, source);
  };

  return (
    <div className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald/10 rounded-xl flex items-center justify-center text-emerald">
            <MagnifyingGlass size={24} weight="bold" />
          </div>
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Review Chat</h3>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <X size={20} className="text-text-3" />
        </button>
      </div>

      <div className="p-10">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <p className="text-[11px] font-black text-text-3 uppercase tracking-[0.4em]">Where is the conversation?</p>
                <div className="grid grid-cols-2 gap-4">
                  {SOURCES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSource(s.id); setStep(2); }}
                      className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-emerald/30 transition-all flex flex-col items-center gap-4 group"
                    >
                      <s.icon size={32} weight="bold" className={cn("transition-transform group-hover:scale-110", s.color)} />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : step === 2 ? (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4 text-left">
                <p className="text-[11px] font-black text-text-3 uppercase tracking-[0.4em]">Paste the text or details here</p>
                <textarea
                  autoFocus
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the agreement details or specific terms from your chat..."
                  className="w-full h-48 p-8 bg-white/[0.02] border border-white/10 rounded-[32px] text-white text-lg font-medium placeholder:text-text-3/20 focus:border-emerald transition-all outline-none"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(1)} className="text-[10px] font-black text-text-3 uppercase tracking-widest hover:text-white transition-colors">Back</button>
                <Magnetic>
                  <button
                    disabled={!text || isParsing}
                    onClick={handleParse}
                    className="btn-vibrant btn-vibrant-emerald px-10 py-4 flex items-center gap-3"
                  >
                    {isParsing ? (
                      <span className="flex items-center gap-2 italic">Scanning...</span>
                    ) : (
                      <>Review Terms <ArrowRight size={18} weight="bold" /></>
                    )}
                  </button>
                </Magnetic>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="p-8 rounded-[32px] bg-emerald/5 border border-emerald/20 space-y-6">
                <div className="flex items-center gap-4">
                  <CheckCircle size={28} weight="bold" className="text-emerald" />
                  <p className="text-[11px] font-black text-emerald uppercase tracking-widest">Details Ready</p>
                </div>
                <div className="space-y-4 text-left">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-text-3 uppercase">Detected Summary</p>
                      <p className="text-white font-bold leading-relaxed">{text.slice(0, 100)}...</p>
                   </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Magnetic>
                  <button
                    onClick={handleConfirm}
                    className="btn-vibrant btn-vibrant-emerald w-full py-5 text-lg"
                  >
                    Create Agreement
                  </button>
                </Magnetic>
                <button onClick={() => setStep(2)} className="text-[10px] font-black text-text-3 uppercase tracking-widest hover:text-white transition-colors">Edit Text</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
