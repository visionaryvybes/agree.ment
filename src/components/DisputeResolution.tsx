"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HandWaving, 
  EnvelopeSimple, 
  Gavel, 
  Scales,
  Check,
  CaretRight,
  Warning,
  ArrowRight
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { EscalationStep, EscalationLevel } from '@/lib/types';

interface DisputeResolutionProps {
  steps: EscalationStep[];
  currentLevel?: EscalationLevel;
  onEscalate: (level: EscalationLevel, message: string) => void;
  contractTitle: string;
}

const ESCALATION_CONFIG: { level: EscalationLevel; label: string; icon: any; color: string; description: string }[] = [
  { level: 'friendly_reminder', label: 'Friendly Reminder', icon: HandWaving, color: 'emerald', description: 'A gentle nudge sent through the app. No pressure, just a reminder.' },
  { level: 'formal_notice', label: 'Formal Notice', icon: EnvelopeSimple, color: 'blue', description: 'An official, timestamped message acknowledging the issue.' },
  { level: 'demand_letter', label: 'Demand Letter', icon: Gavel, color: 'amber', description: 'A structured legal warning with a deadline to respond.' },
  { level: 'legal_action', label: 'Legal Action', icon: Scales, color: 'rose', description: 'Guidance on small claims court or mediation in your area.' },
];

export default function DisputeResolution({ steps, currentLevel, onEscalate, contractTitle }: DisputeResolutionProps) {
  const [selectedLevel, setSelectedLevel] = useState<EscalationLevel | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const currentIndex = currentLevel ? ESCALATION_CONFIG.findIndex(e => e.level === currentLevel) : -1;

  const handleSend = async () => {
    if (!selectedLevel || !message.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    onEscalate(selectedLevel, message);
    setMessage('');
    setSelectedLevel(null);
    setSending(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 space-y-4">
        <div className="flex items-center gap-3">
          <Warning size={24} className="text-amber" weight="bold" />
          <h3 className="text-xl font-black text-white tracking-tighter">Resolve a Dispute</h3>
        </div>
        <p className="text-[10px] font-black text-text-3 uppercase tracking-widest leading-relaxed">
          Follow the steps below to resolve your dispute. Start with a friendly approach and only escalate when needed.
        </p>
      </div>

      {/* Escalation Ladder */}
      <div className="space-y-4">
        {ESCALATION_CONFIG.map((config, i) => {
          const Icon = config.icon;
          const isCompleted = steps.some(s => s.level === config.level);
          const isCurrent = currentLevel === config.level;
          const isNext = i === currentIndex + 1;
          const isLocked = i > currentIndex + 1 && !isCompleted;
          const stepData = steps.find(s => s.level === config.level);

          return (
            <motion.div
              key={config.level}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <button
                onClick={() => !isLocked && setSelectedLevel(config.level)}
                disabled={isLocked}
                className={cn(
                  "w-full p-6 rounded-2xl border flex items-center gap-6 transition-all text-left group",
                  isCompleted ? `bg-${config.color}/5 border-${config.color}/20` :
                  isCurrent ? `bg-${config.color}/10 border-${config.color}/40 shadow-[0_0_30px_rgba(0,255,209,0.05)]` :
                  isNext ? "bg-white/[0.03] border-white/10 hover:border-white/20" :
                  "bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed",
                  selectedLevel === config.level && "ring-2 ring-emerald/40"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                  isCompleted ? `bg-${config.color}/20 text-${config.color}` :
                  config.color === 'emerald' ? "bg-emerald/10 text-emerald" :
                  config.color === 'blue' ? "bg-blue/10 text-blue" :
                  config.color === 'amber' ? "bg-amber/10 text-amber" :
                  "bg-rose/10 text-rose"
                )}>
                  {isCompleted ? <Check size={24} weight="bold" /> : <Icon size={24} weight="bold" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-3">Step {i + 1}</span>
                    {isCompleted && <span className="text-[8px] font-black text-emerald uppercase tracking-widest bg-emerald/10 px-2 py-0.5 rounded-full">Done</span>}
                  </div>
                  <p className="text-sm font-black text-white mt-1">{config.label}</p>
                  <p className="text-[9px] text-text-3 uppercase tracking-widest opacity-60 mt-1">{config.description}</p>
                  {stepData?.triggeredAt && (
                    <p className="text-[8px] text-text-3 uppercase tracking-widest opacity-40 mt-2">
                      Sent {new Date(stepData.triggeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                {!isLocked && !isCompleted && (
                  <CaretRight size={20} className="text-text-3 group-hover:text-white transition-colors flex-shrink-0" weight="bold" />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Action Panel */}
      {selectedLevel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 space-y-6"
        >
          <h4 className="text-sm font-black text-white uppercase tracking-widest">
            Send {ESCALATION_CONFIG.find(e => e.level === selectedLevel)?.label}
          </h4>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue and what you'd like resolved..."
            className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-emerald/50 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="w-full py-4 rounded-2xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 shadow-[0_0_30px_rgba(0,255,209,0.2)]"
          >
            {sending ? 'Sending...' : <><ArrowRight size={18} weight="bold" /> Send</>}
          </button>
        </motion.div>
      )}
    </div>
  );
}
