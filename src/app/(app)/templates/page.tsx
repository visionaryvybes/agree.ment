'use client';

import { useState } from 'react';
import { contractTemplates } from '@/data/templates';
import { ContractCategory } from '@/lib/types';
import Link from 'next/link';
import {
  MagnifyingGlass,
  Star,
  SquaresFour,
  CaretRight,
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories: { value: ContractCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Library' },
  { value: 'loan', label: 'Lending' },
  { value: 'sale', label: 'Asset Sales' },
  { value: 'service', label: 'Professional' },
  { value: 'rental', label: 'Property & Rental' },
  { value: 'nda', label: 'NDA & Privacy' },
  { value: 'freelance', label: 'Gig Economy' },
  { value: 'roommate', label: 'Living' },
  { value: 'custom', label: 'AI Custom' },
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

const CATEGORY_ICONS: Record<string, any> = {
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
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ContractCategory | 'all'>('all');

  const filtered = contractTemplates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || t.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 lg:p-12 max-w-7xl mx-auto space-y-16 bg-[var(--bg)] min-h-full"
    >
      {/* ─── Header ─────────────────────────────────────── */}
      <motion.div variants={item} className="max-w-3xl">
        <div className="mb-6">
          <Badge variant="premium" className="text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 bg-white border border-[var(--border-strong)] text-[var(--blue)]">
            Legal Frameworks
          </Badge>
        </div>
        <h1 className="font-serif text-6xl text-[var(--text-1)] tracking-tighter leading-none mb-6">
          Global Law Library.
        </h1>
        <p className="text-xl text-[var(--text-2)] font-medium tracking-tight leading-relaxed opacity-70">
          State-of-the-art legal architecture for every personal and professional engagement. Fully customizable and jurisdiction-aware.
        </p>
      </motion.div>

      {/* ─── Search & Filters ───────────────────────────── */}
      <motion.div variants={item} className="flex flex-col lg:flex-row gap-8 items-center justify-between border-b border-[var(--border-strong)] pb-12">
        <div className="relative flex-1 w-full lg:max-w-xl group">
          <MagnifyingGlass
            size={20}
            weight="bold"
            className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--text-3)] group-focus-within:text-[var(--text-1)] transition-colors"
          />
          <Input
            className="h-14 pl-10 border-0 bg-transparent focus-visible:ring-0 text-lg font-medium placeholder:text-[var(--text-3)] placeholder:font-bold placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-xs"
            placeholder="Search the legal architecture..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "h-10 px-5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                category === cat.value
                  ? "bg-[var(--text-1)] text-white shadow-xl shadow-black/10"
                  : "text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-subtle)]"
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
          <motion.div key={template.id} variants={item}>
            <Link
              href={`/contracts/new?template=${template.id}`}
              className="group block h-full bg-white border border-[var(--border-strong)] rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 transition-all duration-500 no-underline"
            >
              <div className="mb-10 relative">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center group-hover:bg-[var(--blue-subtle)] transition-colors duration-500">
                  {(() => {
                    const Icon = CATEGORY_ICONS[template.category] || BookOpen;
                    return <Icon size={32} weight="duotone" className="text-[var(--text-1)] group-hover:text-[var(--blue)] transition-colors" />;
                  })()}
                </div>

                {template.popular && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-[0.2em]">
                    POPULAR
                  </div>
                )}
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--blue)]">{template.category}</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
                  <span className="text-[9px] font-medium text-[var(--text-3)] uppercase tracking-widest">{template.fields.length} Control Points</span>
                </div>
                <h3 className="font-serif text-3xl text-[var(--text-1)] tracking-tight leading-tight mb-4 group-hover:text-[var(--blue)] transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-[var(--text-2)] leading-relaxed tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">
                  {template.description}
                </p>
              </div>

              <div className="pt-8 border-t border-[var(--border-strong)] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">
                  <FileText size={16} weight="duotone" />
                  {template.clauses.length} Clauses
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-1)] group-hover:translate-x-2 transition-transform">
                  INITIALIZE <ArrowRight size={14} weight="bold" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <motion.div variants={item} className="bg-white border border-[var(--border-strong)] rounded-3xl overflow-hidden shadow-sm p-20">
          <EmptyState
            icon={<BookOpen size={48} weight="duotone" className="text-[var(--text-3)] opacity-20" />}
            title="Framework not found"
            description="Our legal engineers are constantly adding new frameworks. Try adjusting your search criteria."
            actionLabel="View Holistic Library"
            onAction={() => { setSearch(''); setCategory('all'); }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
