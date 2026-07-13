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
        <Link href="/templates" className="w-10 h-10 rounded-xl bg-ink/[0.03] border border-line flex items-center justify-center text-ink/40 hover:text-ink hover:border-emerald/50 transition-all">
          <ArrowLeft size={18} weight="bold" />
        </Link>
        <div>
          <span className="text-[10px] font-black text-emerald uppercase tracking-[0.4em]">New Template</span>
          <h1 className="text-xl font-semibold text-ink tracking-tight ">Create Template.</h1>
        </div>
      </header>

      <div className="space-y-5">
        {/* Icon picker */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-ink/30 uppercase tracking-[0.4em]">Icon</p>
          <div className="flex flex-wrap gap-2">
            {ICONS.map(ic => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xl transition-all ${
                  icon === ic
                    ? 'bg-emerald/10 border-emerald/30'
                    : 'bg-ink/[0.03] border-line hover:border-line-strong'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-ink/30 uppercase tracking-[0.4em]">Template Name *</p>
          <input
            autoFocus
            type="text"
            placeholder="e.g. Freelance Design Agreement"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-ink/[0.03] border border-line rounded-xl py-3 px-4 text-sm font-black text-ink placeholder:text-ink/15 focus:outline-none focus:border-emerald/40 transition-all uppercase tracking-tight"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-ink/30 uppercase tracking-[0.4em]">Description</p>
          <textarea
            rows={3}
            placeholder="What is this template for?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-ink/[0.03] border border-line rounded-xl py-3 px-4 text-sm text-ink placeholder:text-ink/15 focus:outline-none focus:border-emerald/40 transition-all resize-none"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-ink/30 uppercase tracking-[0.4em]">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  category === cat
                    ? 'bg-emerald text-paper border-emerald'
                    : 'bg-ink/[0.03] text-ink/35 border-line hover:text-ink hover:border-line-strong'
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
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald text-paper text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_24px_rgba(16,119,94,0.2)] disabled:opacity-40 disabled:scale-100"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-paper/20 border-t-[#010101] rounded-full animate-spin" /> Saving...</>
            ) : (
              <><Plus size={16} weight="bold" /> Create Template</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
