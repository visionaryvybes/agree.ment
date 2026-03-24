'use client';

import { useTemplates } from '@/store/contracts';
import { 
  PlusCircle, 
  Books, 
  MagnifyingGlass, 
  ArrowRight,
  FileText,
  Star,
  Tag,
  Rocket,
  Shield,
  Briefcase,
  PaintBrush,
  User as UserIcon,
  Handshake
} from "@phosphor-icons/react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/ui/magnetic';

const CATEGORIES = [
  { id: 'all', label: 'ALL DESIGNS', icon: Books },
  { id: 'personal', label: 'PERSONAL', icon: UserIcon },
  { id: 'business', label: 'BUSINESS', icon: Briefcase },
  { id: 'creative', label: 'CREATIVE', icon: PaintBrush },
  { id: 'nda', label: 'SECURITY', icon: Shield },
  { id: 'loan', label: 'FINANCIAL', icon: Handshake },
  { id: 'partnership', label: 'COLLABS', icon: Rocket },
];

export default function TemplatesPage() {
  const { templates = [] } = useTemplates();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTemplates = (templates || []).filter((t: any) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                         t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (!mounted) return <div className="min-h-screen bg-[#010101]" />;

  return (
    <div className="space-y-12 pb-32 max-w-7xl mx-auto px-4 relative">
      
      {/* Background Glows */}
      <div className="vibrant-glow top-0 left-1/4 w-[600px] h-[600px] bg-emerald/15 animate-glow-pulse" />
      <div className="vibrant-glow bottom-0 right-1/4 w-[500px] h-[500px] bg-blue/10" />

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-12 border-b border-white/10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[11px] font-black text-emerald uppercase tracking-[0.5em] mb-4 block">Your Templates</span>
          <h1 className="heading-display text-7xl md:text-8xl text-white tracking-tighter italic uppercase leading-none">Styles.</h1>
        </motion.div>
        
        <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <MagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-text-3 group-focus-within:text-emerald transition-colors" weight="bold" />
            <input 
              type="text" 
              placeholder="Search templates..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-black tracking-[0.2em] uppercase focus:outline-none focus:border-emerald/50 focus:bg-white/[0.07] transition-all backdrop-blur-3xl shadow-2xl"
            />
          </div>
          <Magnetic>
            <Link href="/templates/new" className="btn-vibrant btn-vibrant-emerald !px-10 h-16">
              <PlusCircle size={24} weight="bold" />
              <span>Create New</span>
            </Link>
          </Magnetic>
        </div>
      </header>

      {/* ── CATEGORY FILTERS ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 py-4 relative z-10 custom-scrollbar-hide overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-4 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 whitespace-nowrap",
              activeCategory === cat.id 
                ? "bg-emerald text-[#010101] border-emerald shadow-[0_10px_30px_rgba(0,255,209,0.3)] scale-105" 
                : "bg-white/5 text-text-3 border-white/10 hover:border-white/30 hover:bg-white/10"
            )}
          >
            <cat.icon size={18} weight={activeCategory === cat.id ? "fill" : "bold"} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── GRID ──────────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template: any, i: number) => (
            <motion.div
              key={template.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ delay: i * 0.03, duration: 0.5 }}
            >
              <Link 
                href={`/templates/${template.id}`}
                className="group h-full p-10 bg-[#0A0A0B] border border-white/5 rounded-[50px] flex flex-col transition-all duration-700 backdrop-blur-3xl relative overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] hover:border-emerald/30 hover:-translate-y-2"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="flex-1 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald text-3xl group-hover:bg-emerald group-hover:text-[#010101] transition-all duration-700 shadow-2xl group-hover:rotate-6 group-hover:scale-110">
                       {template.icon || '📜'}
                    </div>
                    <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-text-3 uppercase tracking-widest group-hover:border-emerald/40 transition-colors">
                      {template.category}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-black text-white transition-colors mb-4 tracking-tighter italic uppercase group-hover:text-emerald leading-tight">
                      {template.name}
                    </h3>
                    <p className="text-[11px] text-text-3 font-black leading-relaxed line-clamp-3 mb-10 uppercase tracking-widest opacity-40 group-hover:opacity-60 transition-opacity">
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-auto">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald animate-pulse shadow-[0_0_10px_#00FFD1]" />
                      <span className="text-[10px] font-black text-text-3 uppercase tracking-widest">VERIFIED</span>
                   </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-3 group-hover:bg-emerald group-hover:text-[#010101] group-hover:translate-x-2 transition-all duration-500 shadow-2xl">
                     <ArrowRight size={28} weight="bold" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTemplates.length === 0 && (
         <div className="py-60 text-center flex flex-col items-center space-y-10">
            <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center text-text-3 mb-6 border border-white/10 shadow-2xl relative">
               <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
               <Books size={56} weight="bold" className="opacity-40" />
            </div>
            <h3 className="heading-display text-5xl text-white italic opacity-40 uppercase">No Templates Found.</h3>
            <p className="text-text-3 font-black text-[12px] uppercase tracking-[0.5em] max-w-md leading-relaxed">Your design library is currently empty. Try creating a new template to get started.</p>
         </div>
      )}
    </div>
  );
}
