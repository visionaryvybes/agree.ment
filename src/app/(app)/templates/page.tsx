'use client';

import { useTemplates } from '@/store/contracts';
import {
  PlusCircle, Books, MagnifyingGlass, ArrowRight,
  FileText, Shield, Briefcase, PaintBrush,
  User as UserIcon, Handshake, Rocket, Sparkle,
} from "@phosphor-icons/react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all',         label: 'All',        icon: Books       },
  { id: 'personal',    label: 'Personal',   icon: UserIcon    },
  { id: 'business',    label: 'Business',   icon: Briefcase   },
  { id: 'creative',    label: 'Creative',   icon: PaintBrush  },
  { id: 'nda',         label: 'Security',   icon: Shield      },
  { id: 'loan',        label: 'Financial',  icon: Handshake   },
  { id: 'partnership', label: 'Collabs',    icon: Rocket      },
];

export default function TemplatesPage() {
  const { templates = [] } = useTemplates();
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('all');
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filtered = (templates as any[]).filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                        t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || t.category === category;
    return matchSearch && matchCat;
  });

  if (!mounted) return <div className="min-h-screen bg-[#010101]" />;

  return (
    <div className="space-y-7 pb-24 max-w-6xl mx-auto relative">

      {/* Glows */}
      <div className="vibrant-glow top-0 left-1/4 w-[380px] h-[380px] bg-emerald/[0.06] animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 right-1/4 w-[320px] h-[320px] bg-blue/[0.05]" />

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.07] relative z-10">
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-[10px] font-black text-emerald uppercase tracking-[0.4em] block mb-1">Template Library</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight italic uppercase">Styles.</h1>
        </motion.div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative group flex-1 min-w-[180px]">
            <MagnifyingGlass
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-emerald transition-colors"
              size={13} weight="bold"
            />
            <input
              type="text"
              placeholder="Search templates…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl py-2.5 pl-9 pr-4 text-[11px] font-medium tracking-wide text-white placeholder:text-white/20 focus:outline-none focus:border-emerald/40 transition-all"
            />
          </div>

          <Link
            href="/templates/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald text-[#010101] text-[11px] font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_16px_rgba(0,255,209,0.2)] flex-shrink-0"
          >
            <PlusCircle size={14} weight="bold" />
            Create
          </Link>
        </div>
      </header>

      {/* ── CATEGORY PILLS ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap relative z-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300',
              category === cat.id
                ? 'bg-emerald text-[#010101] border-emerald shadow-[0_0_14px_rgba(0,255,209,0.2)]'
                : 'bg-white/[0.03] text-white/35 border-white/[0.07] hover:border-white/20 hover:text-white',
            )}
          >
            <cat.icon size={13} weight={category === cat.id ? 'fill' : 'bold'} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── GRID ───────────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {filtered.map((template: any, i: number) => (
            <motion.div
              key={template.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
            >
              <Link
                href={`/templates/${template.id}`}
                className="group h-full p-5 bg-[#080808] border border-white/[0.06] rounded-2xl flex flex-col transition-all duration-400 relative overflow-hidden hover:border-emerald/25 hover:-translate-y-1"
              >
                {/* Hover glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald/[0.04] blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Icon + Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-white/[0.04] rounded-xl flex items-center justify-center text-emerald text-xl border border-white/[0.06] group-hover:bg-emerald group-hover:text-[#010101] transition-all duration-400 group-hover:rotate-6 group-hover:scale-110">
                    {template.icon || <FileText size={18} weight="bold" />}
                  </div>
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] group-hover:border-emerald/30 transition-colors">
                    {template.category}
                  </span>
                </div>

                {/* Name + Description */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-[13px] font-black text-white tracking-tight italic uppercase group-hover:text-emerald transition-colors leading-snug">
                    {template.name}
                  </h3>
                  <p className="text-[11px] text-white/30 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/[0.05]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Verified</span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/25 group-hover:bg-emerald group-hover:text-[#010101] group-hover:translate-x-0.5 transition-all duration-400">
                    <ArrowRight size={13} weight="bold" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center border border-white/[0.06]">
            <Books size={24} weight="bold" className="text-white/20" />
          </div>
          <div>
            <p className="text-sm font-black text-white/20 uppercase tracking-widest">
              {search ? 'No templates match' : 'Library empty'}
            </p>
            <p className="text-xs text-white/15 mt-1">
              {search ? 'Try a different search term.' : 'Create your first template to get started.'}
            </p>
          </div>
          {!search && (
            <Link href="/templates/new" className="mt-2 inline-flex items-center gap-2 text-emerald text-[11px] font-black uppercase tracking-widest hover:opacity-75 transition-opacity">
              Create Template <ArrowRight size={12} weight="bold" />
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}
