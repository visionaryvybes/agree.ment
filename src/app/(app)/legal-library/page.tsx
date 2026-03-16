'use client';

import { useState } from 'react';
import { countries, Country } from '@/data/countries';
import {
  MagnifyingGlass,
  Globe,
  Scales,
  ShieldCheck,
  CaretDown,
  FileText,
  Warning,
  ArrowRight
} from "@phosphor-icons/react";
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/empty-state';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function LegalLibraryPage() {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selected, setSelected] = useState<string | null>(null); // Renamed from expandedId

  const regions = [...new Set(countries.map(c => c.region))].sort();

  const filtered = countries.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || c.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="p-12 lg:p-16 bg-[var(--bg)] min-h-full selection:bg-[var(--text-1)] selection:text-white">
      {/* ─── Header: The Registry Ledger ────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-16 border-b-4 border-[var(--text-1)] mb-16">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--blue)] mb-6">
            Global Jurisdictional Ledger &middot; Verified v4.0
          </p>
          <h1 className="heading-display mb-6"> Registry Ledger.</h1>
          <p className="text-2xl text-[var(--text-2)] font-bold tracking-tight">
            Real-time legal framework analysis for <span className="text-[var(--text-1)]">195 Sovereign Jurisdictions</span>.
          </p>
        </div>

        <div className="w-full md:w-96">
          <div className="relative group brutalist-card border-4">
            <MagnifyingGlass
              className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-1)]"
              size={24}
              weight="bold"
            />
            <input
              type="text"
              placeholder="Search Jurisdiction..."
              className="w-full bg-transparent p-6 pl-16 text-sm font-black uppercase tracking-tight outline-none placeholder:text-[var(--text-3)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ─── Content Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
        <div className="brutalist-card bg-white overflow-hidden border-4">
          <div className="p-8 border-b-4 border-[var(--text-1)] bg-[var(--bg)] flex items-center justify-between">
            <h2 className="heading-section text-2xl uppercase font-black">Active Frameworks</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-[9px] font-black uppercase tracking-widest">Logic Verified</span>
              </div>
            </div>
          </div>

          <div className="divide-y-4 divide-[var(--text-1)]">
            {filtered.length === 0 ? (
              <div className="p-32 text-center bg-white">
                <Warning size={64} weight="bold" className="mx-auto mb-8 opacity-20" />
                <h3 className="heading-section text-2xl uppercase font-black mb-4">No Records Found</h3>
                <p className="text-[var(--text-3)] font-black uppercase tracking-[0.2em]">Framework mismatch for query: "{search}"</p>
              </div>
            ) : (
              filtered.map((country) => (
                <div key={country.code} className="group transition-all">
                  <div
                    className={cn(
                      "flex items-center justify-between p-10 cursor-pointer hover:bg-[var(--bg)] transition-colors",
                      selected === country.code && "bg-[var(--bg)]"
                    )}
                    onClick={() => setSelected(selected === country.code ? null : country.code)}
                  >
                    <div className="flex items-center gap-10">
                      <div className="text-5xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                        {country.flag}
                      </div>
                      <div>
                        <h3 className="font-black text-2xl text-[var(--text-1)] uppercase tracking-tighter leading-none mb-2">{country.name}</h3>
                        <div className="flex items-center gap-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] flex items-center gap-2">
                            <FileText weight="bold" /> {country.code}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                            <ShieldCheck weight="bold" /> Enforceable
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="hidden md:flex gap-4">
                        {['Civil Law', 'B2B Ready', 'AI Compliant'].map((tag, i) => (
                          <span key={i} className="px-4 py-1.5 border-2 border-[var(--text-1)] text-[9px] font-black uppercase tracking-widest bg-white">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className={cn(
                        "w-12 h-12 border-2 border-[var(--text-1)] flex items-center justify-center transition-transform",
                        selected === country.code && "rotate-180 bg-[var(--text-1)] text-white"
                      )}>
                        <CaretDown size={20} weight="bold" />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selected === country.code && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[var(--bg-subtle)] border-t-2 border-[var(--text-1)]"
                      >
                        <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                          <div className="brutalist-card bg-white p-8 border-2 shadow-[4px_4px_0_0_black]">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--blue)] mb-6 flex items-center gap-2">
                              <Scales weight="bold" /> Legal Framework
                            </h4>
                            <p className="text-sm font-bold text-[var(--text-1)] leading-relaxed mb-6">
                              Standardized contractual logic implementation for the {country.name} region, covering commercial transactions and digital enforcement.
                            </p>
                            <button className="w-full brutalist-button py-3 text-[9px] bg-[var(--text-1)]">
                              Download Protocol
                            </button>
                          </div>

                          <div className="brutalist-card bg-white p-8 border-2 shadow-[4px_4px_0_0_black]">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                              <ShieldCheck weight="bold" /> Enforceability
                            </h4>
                            <ul className="space-y-4">
                              {[
                                'Smart Contract Recognition',
                                'E-Signature Validation',
                                'Dispute Resolution Ready'
                              ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-[var(--text-2)] uppercase tracking-tight">
                                  <div className="w-2 h-2 bg-emerald-500 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="brutalist-card bg-[var(--text-1)] p-8 border-2 shadow-[4px_4px_0_0_#1447E6]">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-6 flex items-center gap-2">
                              <Globe weight="bold" /> Network Stats
                            </h4>
                            <div className="space-y-6">
                              <div>
                                <div className="text-3xl font-serif text-white leading-none mb-1">98.4%</div>
                                <div className="text-[8px] font-black uppercase tracking-widest text-white/40">Reliability Index</div>
                              </div>
                              <div className="h-px bg-white/10" />
                              <div>
                                <div className="text-3xl font-serif text-white leading-none mb-1">~2.4s</div>
                                <div className="text-[8px] font-black uppercase tracking-widest text-white/40">Latency to Enforcement</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
