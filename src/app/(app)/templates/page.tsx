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

// Color palette per category for gradient cards
const CAT_GRADIENT: Record<string, string> = {
  personal:    'from-emerald/20 via-emerald/5 to-transparent',
  business:    'from-blue/20 via-blue/5 to-transparent',
  creative:    'from-rose/20 via-rose/5 to-transparent',
  nda:         'from-amber/20 via-amber/5 to-transparent',
  loan:        'from-amber/20 via-amber/5 to-transparent',
  partnership: 'from-blue/20 via-blue/5 to-transparent',
  sale:        'from-emerald/15 via-emerald/5 to-transparent',
  rental:      'from-rose/15 via-rose/5 to-transparent',
  event:       'from-rose/20 via-rose/5 to-transparent',
  legal:       'from-amber/15 via-amber/5 to-transparent',
  default:     'from-white/10 via-white/5 to-transparent',
};

const CAT_ACCENT: Record<string, string> = {
  personal:    'text-emerald',
  business:    'text-blue',
  creative:    'text-rose',
  nda:         'text-amber',
  loan:        'text-amber',
  partnership: 'text-blue',
  sale:        'text-emerald',
  rental:      'text-rose',
  event:       'text-rose',
  legal:       'text-amber',
  default:     'text-white/50',
};

function TemplateCard({ template, index }: { template: any; index: number }) {
  const [imgError, setImgError] = useState(false);
  const gradient = CAT_GRADIENT[template.category] || CAT_GRADIENT.default;
  const accent = CAT_ACCENT[template.category] || CAT_ACCENT.default;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
    >
      <Link
        href={`/templates/${template.id}`}
        className="group flex flex-col h-full bg-[#080808] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-400 hover:border-emerald/25 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,255,209,0.06)]"
      >
        {/* Visual Preview Area */}
        <div className="relative h-36 overflow-hidden flex-shrink-0">
          {/* Gradient background */}
          <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)} />

          {/* Try Gemini-generated image */}
          {!imgError && template.image && (
            <img
              src={`/api/images/template?id=${template.id}`}
              alt={template.name}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
              onError={() => setImgError(true)}
            />
          )}

          {/* Document mockup overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-24 bg-white/[0.04] border border-white/[0.08] rounded-lg shadow-xl flex flex-col gap-1.5 p-2.5 group-hover:scale-105 transition-transform duration-500">
              {/* Mock doc lines */}
              <div className={cn('h-0.5 rounded-full w-full', accent, 'opacity-80')} style={{ background: 'currentColor' }} />
              {[0.5, 0.7, 0.6, 0.8, 0.4, 0.7].map((w, i) => (
                <div key={i} className="h-px bg-white/15 rounded-full" style={{ width: `${w * 100}%` }} />
              ))}
              <div className="mt-1 h-px bg-white/10 rounded-full w-full" />
              {[0.6, 0.5].map((w, i) => (
                <div key={i} className="h-px bg-white/10 rounded-full" style={{ width: `${w * 100}%` }} />
              ))}
            </div>
          </div>

          {/* Icon + emoji badge */}
          <div className="absolute top-3 left-3">
            <div className="w-8 h-8 rounded-lg bg-[#010101]/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-base">
              {template.icon}
            </div>
          </div>

          {/* Popular badge */}
          {template.popular && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald/20 border border-emerald/30 backdrop-blur-sm">
              <Sparkle size={9} weight="bold" className="text-emerald" />
              <span className="text-[8px] font-black text-emerald uppercase tracking-widest">Hot</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Category badge */}
          <div className="flex items-center justify-between">
            <span className={cn('text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border', accent,
              template.category === 'personal' ? 'bg-emerald/5 border-emerald/15' :
              template.category === 'business' ? 'bg-blue/5 border-blue/15' :
              template.category === 'creative' ? 'bg-rose/5 border-rose/15' :
              'bg-white/[0.04] border-white/[0.06]'
            )}>
              {template.category}
            </span>
          </div>

          {/* Name + Description */}
          <div className="flex-1 space-y-1.5">
            <h3 className="text-[13px] font-black text-white tracking-tight italic uppercase group-hover:text-emerald transition-colors leading-snug">
              {template.name}
            </h3>
            <p className="text-[11px] text-white/30 leading-relaxed line-clamp-2">
              {template.description}
            </p>
          </div>

          {/* Preview text snippet */}
          {template.preview && (
            <p className="text-[9px] text-white/15 font-mono leading-relaxed line-clamp-2 border-t border-white/[0.05] pt-2">
              {template.preview.slice(0, 80)}...
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">AI Ready</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/25 group-hover:bg-emerald group-hover:text-[#010101] group-hover:translate-x-0.5 transition-all duration-400">
              <ArrowRight size={12} weight="bold" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

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
          <p className="text-sm text-white/30 mt-1">{templates.length} ready-to-use templates — AI generates full clauses</p>
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
            <TemplateCard key={template.id} template={template} index={i} />
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
