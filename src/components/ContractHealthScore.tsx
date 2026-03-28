"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldSlash, CircleNotch, TrendUp } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface Props {
  contract: any;
}

interface Health {
  score: number;
  grade: string;
  breakdown: { clarity: number; enforceability: number; completeness: number };
  topIssue?: string;
  recommendation: string;
}

const gradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-emerald';
  if (grade.startsWith('B')) return 'text-blue';
  if (grade.startsWith('C')) return 'text-amber';
  return 'text-rose';
};

export default function ContractHealthScore({ contract }: Props) {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHealth = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/system/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setHealth(data.health);
    } catch {
      setError('Health check unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-fetch if contract has clauses
    if (contract?.clauses?.length > 0) {
      fetchHealth();
    }
  }, [contract?.id]);

  if (loading) return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07] flex items-center gap-4">
      <CircleNotch size={20} weight="bold" className="text-emerald animate-spin" />
      <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">Analyzing contract health...</p>
    </div>
  );

  if (error || !health) return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ShieldSlash size={18} weight="bold" className="text-white/20" />
        <p className="text-[11px] font-black text-white/25 uppercase tracking-widest">Health Score</p>
      </div>
      <button
        onClick={fetchHealth}
        className="text-[10px] font-black text-emerald uppercase tracking-widest hover:opacity-70 transition-opacity"
      >
        Check
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-4"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck size={18} weight="bold" className="text-emerald" />
          <span className="text-[11px] font-black text-white uppercase tracking-widest">Health Score</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-2xl font-black leading-none', gradeColor(health.grade))}>{health.grade}</span>
          <span className="text-[10px] font-black text-white/30">({health.score}/100)</span>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-2">
        {Object.entries(health.breakdown).map(([key, val]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-[9px] font-black text-white/25 uppercase tracking-widest w-20 flex-shrink-0">{key}</span>
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${val}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className={cn('h-full rounded-full', val >= 80 ? 'bg-emerald' : val >= 60 ? 'bg-blue' : val >= 40 ? 'bg-amber' : 'bg-rose')}
              />
            </div>
            <span className="text-[9px] font-black text-white/30 w-6 text-right">{val}</span>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="flex items-start gap-2 pt-1 border-t border-white/[0.05]">
        <TrendUp size={13} weight="bold" className="text-emerald flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-white/40 leading-relaxed">{health.recommendation}</p>
      </div>
    </motion.div>
  );
}
