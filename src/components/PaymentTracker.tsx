"use client";

import { motion } from 'framer-motion';
import { 
  CurrencyDollar, 
  Check, 
  Clock, 
  Warning, 
  CalendarBlank,
  ArrowRight,
  TrendUp
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { PaymentSchedule } from '@/lib/types';

interface PaymentTrackerProps {
  payments: PaymentSchedule[];
  totalAmount: number;
  currency?: string;
  onMarkPaid?: (paymentId: string) => void;
}

export default function PaymentTracker({ payments, totalAmount, currency = 'USD', onMarkPaid }: PaymentTrackerProps) {
  const paidTotal = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.paidAmount || p.amount), 0);
  const progress = totalAmount > 0 ? (paidTotal / totalAmount) * 100 : 0;
  const overdueCount = payments.filter(p => p.status === 'overdue').length;
  const nextPayment = payments.find(p => p.status === 'pending');

  const statusConfig = {
    paid: { icon: Check, color: 'text-emerald', bg: 'bg-emerald/10', border: 'border-emerald/20', label: 'Paid' },
    pending: { icon: Clock, color: 'text-blue', bg: 'bg-blue/10', border: 'border-blue/20', label: 'Due' },
    overdue: { icon: Warning, color: 'text-rose', bg: 'bg-rose/10', border: 'border-rose/20', label: 'Overdue' },
    partial: { icon: TrendUp, color: 'text-amber', bg: 'bg-amber/10', border: 'border-amber/20', label: 'Partial' },
    defaulted: { icon: Warning, color: 'text-rose', bg: 'bg-rose/10', border: 'border-rose/20', label: 'Defaulted' },
  };

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-text-3 uppercase tracking-[0.3em]">Payment Progress</p>
            <p className="text-4xl font-black text-white tracking-tighter mt-2">
              ${paidTotal.toLocaleString()} <span className="text-lg text-text-3">/ ${totalAmount.toLocaleString()}</span>
            </p>
          </div>
          <div className="w-20 h-20 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="40" fill="none" 
                stroke="#00FFD1" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${progress * 2.51} 251`}
                className="drop-shadow-[0_0_10px_rgba(0,255,209,0.5)]"
              />
            </svg>
            <p className="absolute inset-0 flex items-center justify-center text-sm font-black text-emerald">{Math.round(progress)}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald to-blue rounded-full shadow-[0_0_15px_rgba(0,255,209,0.3)]"
          />
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest">
          <span className="text-emerald">{payments.filter(p => p.status === 'paid').length} Paid</span>
          <span className="text-blue">{payments.filter(p => p.status === 'pending').length} Pending</span>
          {overdueCount > 0 && <span className="text-rose">{overdueCount} Overdue</span>}
        </div>
      </div>

      {/* Next Payment Alert */}
      {nextPayment && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <CalendarBlank size={24} className="text-blue" weight="bold" />
            <div>
              <p className="text-[9px] font-black text-blue uppercase tracking-widest">Next Payment Due</p>
              <p className="text-lg font-black text-white">${nextPayment.amount.toLocaleString()} — {new Date(nextPayment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
          {onMarkPaid && (
            <button
              onClick={() => onMarkPaid(nextPayment.id)}
              className="px-6 py-3 rounded-xl bg-blue text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue/80 transition-colors"
            >
              Mark Paid
            </button>
          )}
        </motion.div>
      )}

      {/* Payment Timeline */}
      <div className="space-y-4">
        <p className="text-[10px] font-black text-text-3 uppercase tracking-[0.3em] px-2">Timeline</p>
        {payments.map((payment, i) => {
          const config = statusConfig[payment.status];
          const Icon = config.icon;
          return (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "p-6 rounded-2xl border flex items-center justify-between transition-all group",
                config.bg, config.border
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bg)}>
                  <Icon size={20} weight="bold" className={config.color} />
                </div>
                <div>
                  <p className="text-sm font-black text-white">${payment.amount.toLocaleString()}</p>
                  <p className="text-[9px] font-black text-text-3 uppercase tracking-widest">
                    {new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {payment.note && ` • ${payment.note}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("text-[9px] font-black uppercase tracking-widest", config.color)}>{config.label}</span>
                {payment.status === 'pending' && onMarkPaid && (
                  <button
                    onClick={() => onMarkPaid(payment.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-emerald/10 text-emerald hover:bg-emerald hover:text-[#010101] transition-all"
                  >
                    <Check size={14} weight="bold" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
