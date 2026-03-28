'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, FileText, Check } from "@phosphor-icons/react";
import Link from 'next/link';
import { useState } from 'react';
import { useContracts } from '@/store/contracts';
import { v4 as uuid } from 'uuid';

const CATEGORIES = ['personal', 'business', 'creative', 'nda', 'loan', 'partnership'];

export default function NewTemplatePage() {
  const router = useRouter();
  const addTemplateToStore = useContracts(s => s);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [icon, setIcon] = useState('📄');
  const [saving, setSaving] = useState(false);

  const ICONS = ['📄', '🤝', '💼', '🔐', '💰', '🎨', '🏠', '🚗', '✍️', '⚖️'];

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    // In a real app, this would save to the store/API
    // For now, redirect to templates with a success message
    router.push('/templates');
  };

  return (
    <div className="max-w-xl mx-auto pb-24 px-4 pt-6">
      <header className="mb-8 flex items-center gap-4">
        <Link href="/templates" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-emerald/50 transition-all">
          <ArrowLeft size={18} weight="bold" />
        </Link>
        <div>
          <span className="text-[10px] font-black text-emerald uppercase tracking-[0.4em]">New Template</span>
          <h1 className="text-xl font-black text-white tracking-tight italic uppercase">Create Template.</h1>
        </div>
      </header>

      <div className="space-y-5">
        {/* Icon picker */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Icon</p>
          <div className="flex flex-wrap gap-2">
            {ICONS.map(ic => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xl transition-all ${
                  icon === ic
                    ? 'bg-emerald/10 border-emerald/30'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Template Name *</p>
          <input
            autoFocus
            type="text"
            placeholder="e.g. Freelance Design Agreement"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm font-black text-white placeholder:text-white/15 focus:outline-none focus:border-emerald/40 transition-all uppercase tracking-tight"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Description</p>
          <textarea
            rows={3}
            placeholder="What is this template for?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-emerald/40 transition-all resize-none"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  category === cat
                    ? 'bg-emerald text-[#010101] border-emerald'
                    : 'bg-white/[0.03] text-white/35 border-white/[0.07] hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_24px_rgba(0,255,209,0.2)] disabled:opacity-40 disabled:scale-100"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-[#010101]/20 border-t-[#010101] rounded-full animate-spin" /> Saving...</>
            ) : (
              <><Plus size={16} weight="bold" /> Create Template</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
