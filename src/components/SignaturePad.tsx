"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenNib, Eraser, Check, TextT, Fingerprint } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface SignaturePadProps {
  onSign: (signatureData: string) => void;
  onCancel?: () => void;
  signerName?: string;
}

export default function SignaturePad({ onSign, onCancel, signerName }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState(signerName || '');
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = '#10775e';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirm = () => {
    if (mode === 'draw') {
      const data = canvasRef.current?.toDataURL('image/png') || '';
      onSign(data);
    } else {
      onSign(`typed:${typedName}`);
    }
  };

  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-line rounded-[3px] p-10 space-y-8 max-w-lg w-full"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-ink tracking-tighter">Sign Here</h3>
          <p className="text-[9px] font-black text-text-3 uppercase tracking-[0.3em] mt-1">Legally binding • Timestamped</p>
        </div>
        <Fingerprint size={32} className="text-emerald animate-pulse" weight="bold" />
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-3">
        <button 
          onClick={() => setMode('draw')}
          className={cn(
            "flex-1 py-3 rounded-[3px] text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
            mode === 'draw' ? "bg-emerald text-paper border-emerald" : "bg-ink/5 text-text-3 border-line"
          )}
        >
          <PenNib size={16} weight="bold" /> Draw
        </button>
        <button 
          onClick={() => setMode('type')}
          className={cn(
            "flex-1 py-3 rounded-[3px] text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
            mode === 'type' ? "bg-emerald text-paper border-emerald" : "bg-ink/5 text-text-3 border-line"
          )}
        >
          <TextT size={16} weight="bold" /> Type
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'draw' ? (
          <motion.div key="draw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full h-40 bg-ink/[0.03] rounded-[3px] border border-line cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasDrawn && (
                <p className="absolute inset-0 flex items-center justify-center text-text-3/30 text-[11px] font-black uppercase tracking-widest pointer-events-none">
                  Draw your signature here
                </p>
              )}
            </div>
            <button onClick={clearCanvas} className="mt-3 flex items-center gap-2 text-[9px] font-black text-rose uppercase tracking-widest hover:text-ink transition-colors">
              <Eraser size={14} weight="bold" /> Clear
            </button>
          </motion.div>
        ) : (
          <motion.div key="type" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Type your full legal name"
              className="w-full bg-ink/[0.03] border border-line rounded-[3px] py-5 px-6 text-3xl font-black italic text-emerald placeholder:text-ink/10 focus:outline-none focus:border-emerald/50 tracking-tighter"
            />
            <p className="mt-3 text-[9px] font-black text-text-3 uppercase tracking-widest opacity-50">
              By typing your name, you agree this constitutes your electronic signature.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timestamp & Seal */}
      <div className="flex items-center gap-4 py-4 px-6 bg-emerald/5 border border-emerald/10 rounded-[3px]">
        <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
        <p className="text-[9px] font-black text-emerald uppercase tracking-widest">{timestamp}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        {onCancel && (
          <button onClick={onCancel} className="flex-1 py-4 rounded-[3px] bg-ink/5 border border-line text-[11px] font-black text-text-3 uppercase tracking-widest hover:text-ink transition-colors">
            Cancel
          </button>
        )}
        <button
          onClick={handleConfirm}
          disabled={mode === 'draw' ? !hasDrawn : !typedName.trim()}
          className="flex-1 py-4 rounded-[3px] bg-emerald text-paper text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed shadow-[var(--shadow-sheet)] hover:shadow-[var(--shadow-sheet)] transition-all"
        >
          <Check size={18} weight="bold" /> Confirm Signature
        </button>
      </div>
    </motion.div>
  );
}
