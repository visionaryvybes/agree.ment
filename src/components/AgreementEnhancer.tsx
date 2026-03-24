"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkle, 
  CheckCircle, 
  Selection, 
  ProjectorScreen, 
  PaintBrush, 
  ShieldCheck,
  CircleNotch
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/ui/magnetic";

interface VisualStyle {
  id: string;
  name: string;
  description: string;
  icon: any;
}

const VISUAL_STYLES: VisualStyle[] = [
  { id: 'professional', name: 'Standard', description: 'Clean, corporate, and trustworthy.', icon: ShieldCheck },
  { id: 'modern', name: 'Fresh', description: 'Bold, high-contrast, and digital-first.', icon: Selection },
  { id: 'classic', name: 'Traditional', description: 'Serif fonts and timeless structure.', icon: ProjectorScreen },
  { id: 'creative', name: 'Dynamic', description: 'Vibrant accents and fluid layouts.', icon: PaintBrush },
];

interface AgreementEnhancerProps {
  contractTitle: string;
  contractContent: string;
  onEnhance: (style: string) => void;
}

export default function AgreementEnhancer({ contractTitle, contractContent, onEnhance }: AgreementEnhancerProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>('professional');
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'refining' | 'applying' | 'complete'>('idle');

  const startEnhancement = () => {
    setPhase('scanning');
    
    setTimeout(() => setPhase('refining'), 2000);
    setTimeout(() => setPhase('applying'), 4000);
    setTimeout(() => {
      setPhase('complete');
      onEnhance(selectedStyle);
    }, 6000);
  };

  return (
    <div className="w-full max-w-2xl p-10 rounded-[48px] bg-[#0A0A0A] border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-6 mb-12">
        <div className="w-14 h-14 bg-emerald/10 rounded-2xl flex items-center justify-center text-emerald shadow-[0_0_20px_rgba(0,255,209,0.2)]">
          <Sparkle size={28} weight="bold" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Agreement Visuals</h3>
          <p className="text-[10px] font-black text-text-3 uppercase tracking-widest mt-1">Enhance readability and presentation</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'idle' ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-2 gap-4">
              {VISUAL_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={cn(
                    "p-6 rounded-3xl border text-left transition-all duration-500 group",
                    selectedStyle === style.id 
                      ? "bg-emerald text-[#010101] border-emerald" 
                      : "bg-white/[0.03] border-white/5 hover:border-white/20 text-text-3 hover:text-white"
                  )}
                >
                  <style.icon size={24} weight="bold" className="mb-4" />
                  <p className="text-[11px] font-black uppercase tracking-widest mb-1">{style.name}</p>
                  <p className="text-[9px] opacity-70 leading-relaxed">{style.description}</p>
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-center">
              <Magnetic>
                <button
                  onClick={startEnhancement}
                  className="btn-vibrant btn-vibrant-emerald px-12 py-5"
                >
                  Apply Styling
                </button>
              </Magnetic>
            </div>
          </motion.div>
        ) : phase === 'complete' ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 flex flex-col items-center text-center space-y-8"
          >
            <div className="w-24 h-24 bg-emerald rounded-full flex items-center justify-center text-[#010101] shadow-[0_0_50px_rgba(0,255,209,0.4)]">
              <CheckCircle size={48} weight="bold" />
            </div>
            <div>
              <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">Styles Applied</h4>
              <p className="text-[11px] font-black text-emerald uppercase tracking-widest mt-2">{selectedStyle} format is ready</p>
            </div>
            <button
              onClick={() => setPhase('idle')}
              className="text-[10px] font-black text-text-3 uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              Change Style
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 flex flex-col items-center space-y-10"
          >
            <div className="relative">
              <CircleNotch size={80} weight="bold" className="text-emerald animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkle size={32} weight="bold" className="text-emerald animate-pulse" />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-[14px] font-black text-white uppercase tracking-[0.4em] italic leading-none">
                {phase === 'scanning' ? 'Reviewing Context...' : 
                 phase === 'refining' ? 'Polishing Layout...' : 
                 'Applying Final Touches...'}
              </p>
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-full h-full bg-emerald shadow-[0_0_10px_#00FFD1]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
