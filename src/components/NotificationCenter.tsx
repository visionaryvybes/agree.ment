"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Clock, Warning, X, ShieldCheck, EnvelopeSimple, CurrencyDollar } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  type: 'signature' | 'payment' | 'dispute' | 'reminder' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'signature', title: 'New Signature', message: 'Jane signed the Freelance Agreement.', time: '2m ago', read: false, actionUrl: '/contracts/1' },
  { id: '2', type: 'payment', title: 'Payment Due', message: '$250 due for Car Sale Agreement on Mar 30.', time: '1h ago', read: false, actionUrl: '/contracts/2' },
  { id: '3', type: 'dispute', title: 'Dispute Update', message: 'Formal notice sent for Loan #4421.', time: '3h ago', read: true },
  { id: '4', type: 'system', title: 'Welcome', message: 'AgreeMint is ready. Create your first deal!', time: '1d ago', read: true },
];

const ICON_MAP = {
  signature: ShieldCheck,
  payment: CurrencyDollar,
  dispute: Warning,
  reminder: Clock,
  system: Bell,
};

const COLOR_MAP = {
  signature: 'text-emerald',
  payment: 'text-blue',
  dispute: 'text-rose',
  reminder: 'text-amber',
  system: 'text-text-3',
};

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
}

export default function NotificationCenter({ isOpen, onClose, notifications = SAMPLE_NOTIFICATIONS }: NotificationCenterProps) {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter(n => !n.read).length;

  const markRead = (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setItems(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[200] bg-[#080808] border-l border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={24} className="text-emerald" weight="bold" />
                <h3 className="text-lg font-black text-white tracking-tighter">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald text-[#010101] text-[9px] font-black">{unreadCount}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[9px] font-black text-emerald uppercase tracking-widest hover:opacity-70 transition-opacity">
                    Mark All Read
                  </button>
                )}
                <button onClick={onClose} className="p-2 rounded-lg bg-white/5 text-text-3 hover:text-white transition-colors">
                  <X size={18} weight="bold" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {items.map((notification, i) => {
                  const Icon = ICON_MAP[notification.type];
                  const color = COLOR_MAP[notification.type];
                  return (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => markRead(notification.id)}
                      className={cn(
                        "p-5 rounded-2xl border flex gap-4 cursor-pointer transition-all group",
                        notification.read ? "bg-white/[0.02] border-white/5" : "bg-white/[0.05] border-white/10"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", notification.read ? "bg-white/5" : "bg-white/10")}>
                        <Icon size={20} weight="bold" className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn("text-sm font-black", notification.read ? "text-text-3" : "text-white")}>{notification.title}</p>
                          {!notification.read && <div className="w-2 h-2 rounded-full bg-emerald flex-shrink-0" />}
                        </div>
                        <p className="text-[10px] text-text-3 font-bold mt-1 leading-relaxed">{notification.message}</p>
                        <p className="text-[8px] font-black text-text-3 uppercase tracking-widest mt-2 opacity-40">{notification.time}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(notification.id); }}
                        className="p-1 rounded-lg text-text-3 opacity-0 group-hover:opacity-100 hover:text-white transition-all self-start"
                      >
                        <X size={14} weight="bold" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {items.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <Bell size={48} className="text-text-3 mx-auto opacity-20" weight="thin" />
                  <p className="text-[10px] font-black text-text-3 uppercase tracking-widest">All clear!</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
