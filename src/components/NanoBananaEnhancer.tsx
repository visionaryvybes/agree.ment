"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagicWand, 
  SpinnerGap, 
  Check, 
  Palette, 
  TextT, 
  Layout,
  Image as ImageIcon,
  Sparkle,
  ArrowRight
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface NanoBananaEnhancerProps {
  contractTitle: string;
  contractContent: string;
  onEnhance: (style: string) => void;
}

const STYLES = [
  { id: 'professional', label: 'Professional', desc: 'Clean corporate look', icon: Layout, color: 'emerald' },
  { id: 'modern', label: 'Modern', desc: 'Bold and vibrant', icon: Palette, color: 'blue' },
  { id: 'classic', label: 'Classic', desc: 'Traditional legal style', icon: TextT, color: 'amber' },
  { id: 'creative', label: 'Creative', desc: 'Visual and artistic', icon: ImageIcon, color: 'rose' },
];

export default function NanoBananaEnhancer({ contractTitle, contractContent, onEnhance }: NanoBananaEnhancerProps) {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [enhancing, setEnhancing] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleEnhance = async () => {
    if (!selectedStyle) return;
    setEnhancing(true);
    setProgress(0);

    // Simulate progressive enhancement
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 100));
      setProgress(i);
    }

    setEnhancing(false);
    setEnhanced(true);
    onEnhance(selectedStyle);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#080808] border border-white/10 rounded-[40px] p-10 space-y-8 max-w-lg w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald to-blue rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,255,209,0.2)]">
          <Sparkle size={28} className="text-white" weight="fill" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Nano Banana Pro 2</h3>
          <p className="text-[9px] font-black text-emerald uppercase tracking-[0.3em]">Visual Enhancement Engine</p>
        </div>
      </div>

      {/* Contract Preview */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
        <p className="text-[9px] font-black text-text-3 uppercase tracking-widest mb-2">Enhancing</p>
        <p className="text-sm font-black text-white">{contractTitle}</p>
        <p className="text-[10px] text-text-3 mt-1 line-clamp-2">{contractContent || 'Contract content will be analyzed and visually enhanced.'}</p>
      </div>

      {/* Style Selection */}
      <div className="space-y-3">
        <p className="text-[10px] font-black text-text-3 uppercase tracking-[0.3em]">Choose a Visual Style</p>
        <div className="grid grid-cols-2 gap-3">
          {STYLES.map(style => {
            const Icon = style.icon;
            return (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={cn(
                  "p-5 rounded-2xl border transition-all text-left group",
                  selectedStyle === style.id
                    ? "bg-emerald/10 border-emerald/30"
                    : "bg-white/[0.03] border-white/10 hover:border-white/20"
                )}
              >
                <Icon size={24} className={cn(
                  "mb-3 transition-colors",
                  style.color === 'emerald' ? 'text-emerald' :
                  style.color === 'blue' ? 'text-blue' :
                  style.color === 'amber' ? 'text-amber' : 'text-rose'
                )} weight="bold" />
                <p className="text-[11px] font-black text-white uppercase tracking-widest">{style.label}</p>
                <p className="text-[8px] text-text-3 uppercase tracking-wider mt-1">{style.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate / Progress */}
      <AnimatePresence mode="wait">
        {enhancing ? (
          <motion.div key="enhancing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-emerald via-blue to-emerald rounded-full shadow-[0_0_15px_rgba(0,255,209,0.3)]"
              />
            </div>
            <div className="flex items-center justify-center gap-3">
              <SpinnerGap size={18} className="animate-spin text-emerald" weight="bold" />
              <p className="text-[10px] font-black text-text-3 uppercase tracking-widest">
                {progress < 30 ? 'Reading contract...' :
                 progress < 60 ? 'Generating visuals...' :
                 progress < 90 ? 'Applying style...' : 'Finalizing...'}
              </p>
            </div>
          </motion.div>
        ) : enhanced ? (
          <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="p-5 rounded-xl bg-emerald/10 border border-emerald/20 flex items-center gap-3">
              <Check size={20} className="text-emerald" weight="bold" />
              <div>
                <p className="text-[10px] font-black text-emerald uppercase tracking-widest">Enhancement Complete!</p>
                <p className="text-[8px] text-text-3 uppercase tracking-wider mt-0.5">Your agreement now has a {selectedStyle} visual style.</p>
              </div>
            </div>
            <button
              onClick={() => { setEnhanced(false); setSelectedStyle(''); }}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-text-3 uppercase tracking-widest hover:text-white transition-colors"
            >
              Try Another Style
            </button>
          </motion.div>
        ) : (
          <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={handleEnhance}
              disabled={!selectedStyle}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald to-blue text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-30 shadow-[0_0_30px_rgba(0,255,209,0.2)] hover:shadow-[0_0_40px_rgba(0,255,209,0.4)] transition-all"
            >
              <MagicWand size={20} weight="bold" /> Enhance with Nano Banana <ArrowRight size={16} weight="bold" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
