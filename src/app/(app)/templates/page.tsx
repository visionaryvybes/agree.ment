'use client';

import { useState } from 'react';
import { contractTemplates } from '@/data/templates';
import { useContracts } from '@/store/contracts';
import { ContractCategory, ContractTemplate } from '@/lib/types';
import Link from 'next/link';
import {
  MagnifyingGlass,
  SquaresFour,
  Gavel,
  Briefcase,
  House,
  Shield,
  Lightning,
  Info,
  Compass,
  Sparkle,
  FileText,
  BookOpen,
  ArrowRight
} from "@phosphor-icons/react";
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const categories: { value: ContractCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Templates' },
  { value: 'loan', label: 'Lending' },
  { value: 'sale', label: 'Asset Sales' },
  { value: 'service', label: 'Professional' },
  { value: 'rental', label: 'Rental' },
  { value: 'nda', label: 'NDA & Privacy' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'roommate', label: 'Living' },
  { value: 'custom', label: 'My Custom Templates' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CATEGORY_ICONS: Record<string, typeof Gavel> = {
  loan: Gavel,
  sale: Lightning,
  service: Briefcase,
  rental: House,
  nda: Shield,
  freelance: Compass,
  roommate: Info,
  employment: Briefcase,
  partnership: SquaresFour,
  custom: Sparkle,
};

export default function TemplatesPage() {
  const { contracts } = useContracts();
  const [search, setSearch] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [category, setCategory] = useState<ContractCategory | 'all'>('all');

  const customTemplates: ContractTemplate[] = contracts.map(c => ({
    id: c.id,
    name: c.title,
    description: c.description || 'Agreement created in your workspace.',
    category: c.category as ContractCategory || 'custom',
    popular: false,
    image: '/placeholder-contract.png',
    icon: 'FileText',
    isCustom: true,
    fields: [
      { id: 'party1_name', label: 'Primary Party', type: 'text', required: true, placeholder: 'Enter name' },
      { id: 'party2_name', label: 'Counterparty', type: 'text', required: true, placeholder: 'Enter name' },
      { id: 'jurisdiction', label: 'Jurisdiction', type: 'text', required: true, placeholder: 'State/Country' }
    ],
    clauses: c.clauses,
    preview: c.clauses.map(cl => cl.content).join(' ').substring(0, 200) + '...'
  }));

  const allTemplates = [...customTemplates, ...contractTemplates.map(t => ({ ...t, isCustom: false }))];

  const filtered = allTemplates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                         t.description.toLowerCase().includes(search.toLowerCase());
    
    if (category === 'all') return matchesSearch;
    if (category === 'custom') return matchesSearch && (t as ContractTemplate & { isCustom?: boolean }).isCustom;
    
    return matchesSearch && t.category === category && !(t as ContractTemplate & { isCustom?: boolean }).isCustom;
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-8 py-12 md:px-16 md:py-16 bg-[var(--bg)] min-h-full selection:bg-[var(--text-1)] selection:text-[var(--bg)] overflow-x-hidden space-y-16"
    >
      {/* ─── Header ─────────────────────────────────────── */}
      <motion.div variants={item} className="max-w-4xl">
        <div className="mb-8">
          <span className="px-5 py-2 brutalist-card font-black uppercase tracking-[0.4em] text-[11px] text-[var(--blue)]">Agreement Library</span>
        </div>
        <h1 className="text-6xl md:text-[6rem] lg:text-[7rem] font-black uppercase tracking-tighter text-[var(--text-1)] mb-10 leading-[0.85]">
          Start With<br/>A Template.
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text-2)] font-bold tracking-tight mb-8 max-w-3xl leading-relaxed">
          Select a verified official template or reuse one of your custom-built agreements.
        </p>
      </motion.div>

      {/* ─── Search & Filters ───────────────────────────── */}
      <motion.div variants={item} className="flex flex-col lg:flex-row gap-8 items-center justify-between border-b-4 border-[var(--text-1)] pb-12">
        <div className="relative flex-1 w-full lg:max-w-xl group bg-[var(--color-white)] border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] focus-within:shadow-[2px_2px_0_0_var(--text-1)] transition-all">
          <MagnifyingGlass
            size={24}
            weight="bold"
            className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-1)] group-focus-within:text-[var(--blue)] transition-colors"
          />
          <input
            className="w-full bg-transparent p-5 pl-16 text-sm font-black uppercase tracking-tight outline-none placeholder:text-[var(--text-3)] text-[var(--text-1)]"
            placeholder="Search all templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Brutalist Category Filters */}
        <div className="flex flex-wrap items-center gap-2 bg-[var(--bg)] p-2 border-4 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] w-full lg:w-auto">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "h-12 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 border-transparent",
                category === cat.value
                  ? "bg-[var(--text-1)] text-[var(--bg)] shadow-none"
                  : "bg-transparent text-[var(--text-2)] hover:border-[var(--text-1)] hover:bg-[var(--color-white)]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── Grid ────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map(template => (
          <motion.div key={template.id} variants={item} className="h-full">
            <Dialog onOpenChange={(open) => { if (!open) setSelectedVariant(null); }}>
              <DialogTrigger asChild>
                <button
                  className="w-full text-left group flex flex-col h-full brutalist-card bg-[var(--color-white)] p-10 hover:bg-[var(--bg)] transition-colors focus:outline-none relative"
                >
                  <div className="mb-8 relative">
                    <div className="w-16 h-16 border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] bg-[var(--bg)] flex items-center justify-center group-hover:bg-[var(--color-white)] transition-colors duration-500">
                      {(() => {
                        const Icon = CATEGORY_ICONS[template.category] || BookOpen;
                        return <Icon size={32} weight="bold" className="text-[var(--text-1)] group-hover:text-[var(--blue)] transition-colors" />;
                      })()}
                    </div>

                    {template.popular && (
                      <div className="absolute top-0 right-0 px-4 py-1 bg-[var(--secondary)] text-[var(--bg)] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] text-[9px] font-black uppercase tracking-widest">
                        POPULAR
                      </div>
                    )}
                  </div>

                  <div className="flex-1 mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--blue)]">{template.category}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-1)]" />
                      <span className="text-[10px] font-black text-[var(--text-2)] uppercase tracking-widest">{template.fields.length} Fields</span>
                    </div>
                    <h3 className="text-2xl font-black text-[var(--text-1)] tracking-tighter uppercase leading-tight mb-4 group-hover:text-[var(--blue)] transition-all duration-300">
                      {template.name}
                    </h3>
                    <p className="text-sm font-bold text-[var(--text-2)] leading-relaxed group-hover:text-[var(--text-1)] transition-colors duration-300">
                      {template.description}
                    </p>
                  </div>

                  <div className="pt-8 border-t-2 border-[var(--text-1)] flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-2)]">
                      <FileText size={16} weight="bold" />
                      {template.clauses.length} Clauses
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--blue)] group-hover:translate-x-2 transition-transform duration-300">
                      PREVIEW <ArrowRight size={14} weight="bold" />
                    </div>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-5xl p-0 bg-[var(--color-white)] border-4 border-[var(--text-1)] shadow-[8px_8px_0_0_var(--text-1)] rounded-none overflow-hidden flex flex-col lg:flex-row h-[85vh] max-h-[800px]">
                {/* Left Side: Mockup Preview */}
                <div className="w-full lg:w-3/5 bg-[var(--bg)] relative overflow-hidden group/preview border-r-4 border-[var(--text-1)]">
                  
                  {/* Variant Switcher Overlay */}
                  {template.variants && template.variants.length > 0 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 bg-[var(--color-white)] border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] z-20">
                      {template.variants.map((v: { image: string; label: string }, i: number) => (
                        <button
                          key={i}
                          onClick={() => setSelectedVariant(v.image)}
                          className={cn(
                            "px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-2 border-[var(--text-1)]",
                            (selectedVariant === v.image || (!selectedVariant && i === 0))
                              ? "bg-[var(--blue)] text-[var(--bg)] shadow-[2px_2px_0_0_var(--text-1)]"
                              : "text-[var(--text-1)] hover:bg-[var(--bg)]"
                          )}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="w-full h-full flex items-center justify-center p-12">
                    <motion.img
                      key={selectedVariant || template.image}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={selectedVariant || template.image || '/placeholder-contract.png'}
                      alt={template.name}
                      className="max-w-full max-h-full object-contain border-2 border-[var(--text-1)] shadow-[8px_8px_0_0_var(--text-1)] bg-[var(--color-white)]"
                    />
                  </div>
                </div>

                {/* Right Side: Details & Actions */}
                <div className="w-full lg:w-2/5 p-12 flex flex-col h-full bg-[var(--color-white)]">
                  
                  <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                    <DialogHeader className="mb-12 relative z-10 text-left">
                      <div className="flex items-center gap-6 mb-6">
                        <div className="w-16 h-16 bg-[var(--bg)] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] flex items-center justify-center text-[var(--blue)]">
                          {(() => {
                            const Icon = CATEGORY_ICONS[template.category] || BookOpen;
                            return <Icon size={32} weight="bold" />;
                          })()}
                        </div>
                        <div>
                          <Badge className="bg-[var(--blue)] text-[var(--bg)] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] text-[9px] font-black uppercase tracking-widest mb-2 px-3 py-1">
                            {template.category}
                          </Badge>
                          <DialogTitle className="text-3xl font-black tracking-tighter uppercase text-[var(--text-1)] leading-none">{template.name}</DialogTitle>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-[var(--text-2)] leading-relaxed">{template.description}</p>
                    </DialogHeader>

                    <div className="space-y-10 relative z-10">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-1)] mb-6 flex items-center gap-3">
                          <Sparkle size={18} weight="bold" className="text-[var(--blue)]" /> Technical Fields
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {template.fields.slice(0, 6).map(f => (
                            <div key={f.id} className="p-4 bg-[var(--bg)] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)]">
                              <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-2)] mb-1">{f.label}</div>
                              <div className="text-[11px] font-black text-[var(--text-1)] uppercase">{f.type}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-1)] mb-6 flex items-center gap-3">
                          <FileText size={18} weight="bold" className="text-[var(--blue)]" /> Schema Preview
                        </div>
                        <div className="p-6 bg-[var(--bg)] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] font-mono text-[11px] font-bold leading-relaxed text-[var(--text-1)] relative group/schema overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-50" />
                          <div className="relative z-10 line-clamp-5 italic">
                            &ldquo;{template.preview}&rdquo;
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="mt-10 sm:justify-start relative z-10 border-t-4 border-[var(--text-1)] pt-10">
                    <div className="w-full space-y-4">
                      <Link href={`/contracts/new?template=${template.id}`} className="w-full no-underline block">
                        <button 
                          className="brutalist-button w-full h-16 bg-[var(--blue)] text-[var(--bg)] text-[12px] font-black uppercase tracking-[0.2em] shadow-[4px_4px_0_0_var(--text-1)] flex flex-row items-center justify-center"
                        >
                          Use Template
                        </button>
                      </Link>
                      <p className="text-[9px] font-black text-[var(--text-2)] text-center uppercase tracking-widest">
                        Governing Jurisdiction: Automated Detection
                      </p>
                    </div>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <motion.div variants={item} className="brutalist-card bg-[var(--color-white)] p-24 text-center">
          <BookOpen size={64} weight="bold" className="mx-auto mb-8 text-[var(--text-1)]" />
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-[var(--text-1)]">Template not found</h3>
          <p className="text-sm text-[var(--text-2)] font-bold mb-10 max-w-md mx-auto">Try adjusting your search filters or create a custom agreement.</p>
          <button
            onClick={() => { setSearch(''); setCategory('all'); }}
            className="brutalist-button bg-[var(--color-white)] text-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)]"
          >
            Reset All Filters
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
