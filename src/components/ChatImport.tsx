"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WhatsappLogo, 
  ChatTeardropText, 
  ClipboardText, 
  ImageSquare, 
  ArrowRight, 
  SpinnerGap,
  Check,
  MagicWand
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface ChatImportProps {
  onImport: (text: string, source: string) => void;
  onCancel?: () => void;
}

const SOURCES = [
  { id: 'whatsapp', label: 'WhatsApp', icon: WhatsappLogo, color: 'text-green-400' },
  { id: 'sms', label: 'SMS / Text', icon: ChatTeardropText, color: 'text-blue' },
  { id: 'email', label: 'Email', icon: ClipboardText, color: 'text-amber' },
  { id: 'other', label: 'Other', icon: ImageSquare, color: 'text-rose' },
];

export default function ChatImport({ onImport, onCancel }: ChatImportProps) {
  const [step, setStep] = useState(1);
  const [source, setSource] = useState('');
  const [inputMode, setInputMode] = useState<'paste' | 'screenshot'>('paste');
  const [text, setText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(false);

  const handleParse = async () => {
    if (!text.trim()) return;
    setParsing(true);
    // Simulate AI parsing delay
    await new Promise(r => setTimeout(r, 2000));
    setParsing(false);
    setParsed(true);
  };

  const handleConfirm = () => {
    onImport(text, source);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#080808] border border-white/10 rounded-[40px] p-10 space-y-8 max-w-2xl w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Import a Chat</h3>
          <p className="text-[9px] font-black text-text-3 uppercase tracking-[0.3em] mt-1">Turn any conversation into a contract</p>
        </div>
        <MagicWand size={28} className="text-emerald" weight="bold" />
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all",
              step >= s ? "bg-emerald/20 border-emerald/40 text-emerald" : "bg-white/5 border-white/10 text-white/30"
            )}>{step > s ? <Check size={14} weight="bold" /> : s}</div>
            {s < 3 && <div className={cn("w-8 h-px", step > s ? "bg-emerald/40" : "bg-white/10")} />}
          </div>
        ))}
        <span className="text-[9px] font-black text-text-3 uppercase tracking-widest ml-2">
          {step === 1 ? 'Source' : step === 2 ? 'Content' : 'Review'}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select source */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <p className="text-[10px] font-black text-text-3 uppercase tracking-widest">Where is the conversation from?</p>
            <div className="grid grid-cols-2 gap-4">
              {SOURCES.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setSource(s.id); setStep(2); }}
                  className={cn(
                    "p-6 rounded-2xl border transition-all flex items-center gap-4 group hover:border-emerald/40",
                    source === s.id ? "bg-emerald/10 border-emerald/40" : "bg-white/[0.03] border-white/10"
                  )}
                >
                  <s.icon size={28} weight="bold" className={s.color} />
                  <span className="text-[11px] font-black text-white uppercase tracking-widest">{s.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Input content */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            {/* Input mode toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => setInputMode('paste')}
                className={cn(
                  "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
                  inputMode === 'paste' ? "bg-emerald text-[#010101] border-emerald" : "bg-white/5 text-text-3 border-white/10"
                )}
              >
                <ClipboardText size={16} weight="bold" /> Copy & Paste
              </button>
              <button
                onClick={() => setInputMode('screenshot')}
                className={cn(
                  "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
                  inputMode === 'screenshot' ? "bg-emerald text-[#010101] border-emerald" : "bg-white/5 text-text-3 border-white/10"
                )}
              >
                <ImageSquare size={16} weight="bold" /> Screenshot
              </button>
            </div>

            {inputMode === 'paste' ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={"Paste your conversation here...\n\nExample:\nJohn: Hey, can I borrow $500?\nYou: Sure, pay me back by March 30th\nJohn: Deal, I'll pay in two installments"}
                className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-emerald/50 resize-none font-mono"
              />
            ) : (
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center space-y-4 hover:border-emerald/30 transition-colors cursor-pointer">
                <ImageSquare size={48} className="text-text-3 mx-auto" weight="thin" />
                <p className="text-[11px] font-black text-text-3 uppercase tracking-widest">Drop a screenshot here</p>
                <p className="text-[9px] text-text-3/50 uppercase tracking-wider">or click to upload • PNG, JPG, WEBP</p>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setText(`[Screenshot uploaded: ${file.name}]`);
                }} />
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="py-4 px-8 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-text-3 uppercase tracking-widest">
                Back
              </button>
              <button
                onClick={handleParse}
                disabled={!text.trim() || parsing}
                className="flex-1 py-4 rounded-2xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 shadow-[0_0_30px_rgba(0,255,209,0.2)]"
              >
                {parsing ? (
                  <><SpinnerGap size={18} className="animate-spin" weight="bold" /> Analyzing...</>
                ) : (
                  <><MagicWand size={18} weight="bold" /> Parse Conversation</>
                )}
              </button>
            </div>

            {parsed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="p-6 bg-emerald/5 border border-emerald/20 rounded-2xl space-y-3">
                  <p className="text-[10px] font-black text-emerald uppercase tracking-widest">Detected Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/[0.03] rounded-xl">
                      <p className="text-[8px] text-text-3 uppercase tracking-widest">Type</p>
                      <p className="text-sm font-black text-white">Personal Loan</p>
                    </div>
                    <div className="p-3 bg-white/[0.03] rounded-xl">
                      <p className="text-[8px] text-text-3 uppercase tracking-widest">Amount</p>
                      <p className="text-sm font-black text-emerald">$500.00</p>
                    </div>
                    <div className="p-3 bg-white/[0.03] rounded-xl">
                      <p className="text-[8px] text-text-3 uppercase tracking-widest">Parties</p>
                      <p className="text-sm font-black text-white">2 People</p>
                    </div>
                    <div className="p-3 bg-white/[0.03] rounded-xl">
                      <p className="text-[8px] text-text-3 uppercase tracking-widest">Due Date</p>
                      <p className="text-sm font-black text-white">Mar 30</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="w-full py-4 rounded-2xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,255,209,0.2)]"
                >
                  Continue to Review <ArrowRight size={16} weight="bold" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            <div className="p-8 bg-white/[0.03] border border-white/10 rounded-2xl space-y-6">
              <div className="flex items-center gap-3">
                <Check size={20} className="text-emerald" weight="bold" />
                <p className="text-[11px] font-black text-emerald uppercase tracking-widest">Ready to formalize</p>
              </div>
              <div className="space-y-3 text-sm text-white/80 font-mono">
                <p className="text-white font-black">Personal Loan Agreement</p>
                <p>Between you and the other party</p>
                <p>Amount: $500.00 • Due: March 30</p>
                <p>Payment: 2 installments</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="py-4 px-8 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-text-3 uppercase tracking-widest">
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-4 rounded-2xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,255,209,0.2)]"
              >
                <Check size={18} weight="bold" /> Create Agreement
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {onCancel && (
        <button onClick={onCancel} className="w-full text-center text-[9px] font-black text-text-3 uppercase tracking-widest hover:text-white transition-colors">
          Cancel
        </button>
      )}
    </motion.div>
  );
}
