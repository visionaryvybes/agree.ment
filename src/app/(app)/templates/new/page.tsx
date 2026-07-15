'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, FileText, Handshake, Briefcase, FileLock,
  HandCoins, PaintBrush, HouseLine, Car, PenNib, Scales,
} from "@phosphor-icons/react";
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
  const [icon, setIcon] = useState('document');
  const [saving, setSaving] = useState(false);

  const ICONS = [
    { id: 'document',    Icon: FileText },
    { id: 'handshake',   Icon: Handshake },
    { id: 'business',    Icon: Briefcase },
    { id: 'confidential',Icon: FileLock },
    { id: 'money',       Icon: HandCoins },
    { id: 'creative',    Icon: PaintBrush },
    { id: 'home',        Icon: HouseLine },
    { id: 'vehicle',     Icon: Car },
    { id: 'signature',   Icon: PenNib },
    { id: 'legal',       Icon: Scales },
  ];

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
        <Link href="/templates" className="w-10 h-10 rounded-[3px] bg-ink/[0.03] border border-line flex items-center justify-center text-ink/40 hover:text-ink hover:border-emerald/50 transition-all">
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
            {ICONS.map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => setIcon(id)}
                aria-label={id}
                aria-pressed={icon === id}
                className={`w-10 h-10 border-[1.5px] flex items-center justify-center transition-all ${
                  icon === id
                    ? 'bg-emerald/10 border-emerald text-emerald shadow-[2px_2px_0_var(--shadow-ink)]'
                    : 'bg-ink/[0.03] border-line text-ink-3 hover:border-line-strong hover:text-ink'
                }`}
              >
                <Icon size={18} weight="duotone" />
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
            className="w-full bg-ink/[0.03] border border-line rounded-[3px] py-3 px-4 text-sm font-black text-ink placeholder:text-ink/15 focus:outline-none focus:border-emerald/40 transition-all uppercase tracking-tight"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-ink/30 uppercase tracking-[0.4em]">Description</p>
          <textarea
            rows={3}
            placeholder="What is this template for?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-ink/[0.03] border border-line rounded-[3px] py-3 px-4 text-sm text-ink placeholder:text-ink/15 focus:outline-none focus:border-emerald/40 transition-all resize-none"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-ink/30 uppercase tracking-[0.4em]">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-[3px] text-[10px] font-black uppercase tracking-widest border transition-all ${
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
            className="w-full flex items-center justify-center gap-3 py-4 rounded-[3px] bg-emerald text-paper text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[var(--shadow-sheet)] disabled:opacity-40 disabled:scale-100"
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
