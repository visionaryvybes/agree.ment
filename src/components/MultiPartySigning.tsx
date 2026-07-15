"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  EnvelopeSimple, 
  Check, 
  Clock, 
  Copy, 
  Share,
  X,
  Users
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { ContractParty } from '@/lib/types';

interface MultiPartySigningProps {
  parties: ContractParty[];
  onInvite: (email: string, name: string) => void;
  contractTitle: string;
}

export default function MultiPartySigning({ parties, onInvite, contractTitle }: MultiPartySigningProps) {
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);

  const signedCount = parties.filter(p => p.signedAt).length;
  const allSigned = signedCount === parties.length && parties.length > 0;

  const handleInvite = () => {
    if (!email.trim() || !name.trim()) return;
    onInvite(email, name);
    setEmail('');
    setName('');
    setShowInvite(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/sign/invite-link`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-emerald" weight="bold" />
          <div>
            <h4 className="text-lg font-semibold text-ink tracking-tighter">All Parties</h4>
            <p className="text-[9px] font-black text-text-3 uppercase tracking-widest">{signedCount}/{parties.length} Signed</p>
          </div>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="px-5 py-3 rounded-[3px] bg-emerald/10 border border-emerald/20 text-[10px] font-black text-emerald uppercase tracking-widest flex items-center gap-2 hover:bg-emerald hover:text-paper transition-all"
        >
          <UserPlus size={16} weight="bold" /> Invite
        </button>
      </div>

      {/* Progress */}
      <div className="h-2 bg-ink/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${parties.length > 0 ? (signedCount / parties.length) * 100 : 0}%` }}
          className={cn(
            "h-full rounded-full",
            allSigned ? "bg-emerald shadow-[var(--shadow-sheet)]" : "bg-blue"
          )}
        />
      </div>

      {/* Party List */}
      <div className="space-y-3">
        {parties.map((party, i) => (
          <motion.div
            key={party.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "p-5 rounded-[3px] border flex items-center justify-between transition-all",
              party.signedAt ? "bg-emerald/5 border-emerald/20" : "bg-ink/[0.03] border-line"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-[3px] flex items-center justify-center text-xs font-black",
                party.signedAt ? "bg-emerald text-paper" : "bg-ink/10 text-text-3"
              )}>
                {party.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-black text-ink">{party.name}</p>
                <p className="text-[9px] font-black text-text-3 uppercase tracking-widest">
                  {party.role === 'creator' ? 'Creator' : 'Signer'} • {party.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {party.signedAt ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-[3px] bg-emerald/10">
                  <Check size={14} className="text-emerald" weight="bold" />
                  <span className="text-[9px] font-black text-emerald uppercase tracking-widest">
                    Signed {new Date(party.signedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-[3px] bg-amber/10">
                  <Clock size={14} className="text-amber" weight="bold" />
                  <span className="text-[9px] font-black text-amber uppercase tracking-widest">Waiting</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Share Link */}
      <div className="p-5 rounded-[3px] bg-ink/[0.03] border border-line flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Share size={18} className="text-text-3" weight="bold" />
          <p className="text-[10px] font-black text-text-3 uppercase tracking-widest">Share signing link</p>
        </div>
        <button
          onClick={handleCopyLink}
          className="px-5 py-2 rounded-[3px] bg-ink/5 border border-line text-[9px] font-black text-ink uppercase tracking-widest flex items-center gap-2 hover:bg-emerald/10 hover:border-emerald/20 transition-all"
        >
          {copied ? <><Check size={12} weight="bold" /> Copied!</> : <><Copy size={12} weight="bold" /> Copy Link</>}
        </button>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/60 backdrop-blur-md p-6"
            onClick={() => setShowInvite(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-line rounded-[3px] p-10 max-w-md w-full space-y-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-ink tracking-tighter">Invite to Sign</h4>
                <button onClick={() => setShowInvite(false)} className="p-2 rounded-[3px] bg-ink/5 text-text-3 hover:text-ink transition-colors">
                  <X size={18} weight="bold" />
                </button>
              </div>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full bg-ink/[0.03] border border-line rounded-[3px] py-4 px-5 text-sm text-ink placeholder:text-ink/20 focus:outline-none focus:border-emerald/50"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-ink/[0.03] border border-line rounded-[3px] py-4 px-5 text-sm text-ink placeholder:text-ink/20 focus:outline-none focus:border-emerald/50"
              />

              <button
                onClick={handleInvite}
                disabled={!email.trim() || !name.trim()}
                className="w-full py-4 rounded-[3px] bg-emerald text-paper text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 shadow-[var(--shadow-sheet)]"
              >
                <EnvelopeSimple size={18} weight="bold" /> Send Invite
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
