'use client';

import { useState } from 'react';
import { countries } from '@/data/countries';
import { prefilledJurisdictions } from '@/data/jurisdictions';
import {
  MagnifyingGlass,
  Globe,
  Scales,
  ShieldCheck,
  CaretDown,
  Warning,
  Sparkle
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function LegalLibraryPage() {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [insights, setInsights] = useState<Record<string, {
    legalFramework?: string;
    regionalInsight?: string;
    enforceability?: string[];
    keyArticles?: string[];
    warning?: string;
  }>>({});
  const [loadingInsights, setLoadingInsights] = useState<string | null>(null);

  const fetchInsights = async (countryName: string, code: string) => {
    if (insights[code]) return;
    
    // Check local preemptive knowledge base first
    if (prefilledJurisdictions[code]) {
      setInsights(prev => ({ ...prev, [code]: prefilledJurisdictions[code] }));
      return;
    }

    setLoadingInsights(code);
    try {
      const res = await fetch('/api/ai/jurisdiction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryName }),
      });
      const data = await res.json();
      setInsights(prev => ({ ...prev, [code]: data }));
    } catch (err) {
      console.error('Insight fetch error:', err);
    } finally {
      setLoadingInsights(null);
    }
  };

  const filtered = (countries || []).filter(c => {
    const s = search.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(s);
    const codeMatch = c.code?.toLowerCase().includes(s);
    const matchesSearch = !search || nameMatch || codeMatch;
    
    // Normalize region for robust filtering
    const countryRegion = c.region?.trim() || 'Other';
    const matchesRegion = selectedRegion === 'all' || countryRegion === selectedRegion;
    
    return matchesSearch && matchesRegion;
  });

  const regions = ['all', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania'];

  return (
    <div className="p-8 lg:p-12 bg-[var(--bg)] min-h-full selection:bg-[var(--blue)] selection:text-[var(--text-1)]">
      {/* ─── Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-[var(--glass-border)] mb-12">
        <div className="max-w-3xl">
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--blue)] mb-4">
            Global Knowledge Base &middot; Live Rules
          </p>
          <h1 className="heading-display mb-4">Legal Library.</h1>
          <p className="text-xl text-[var(--text-2)] font-semibold tracking-tight">
            Verified rules for <span className="text-[var(--text-1)]">{(countries || []).length} Countries</span>.
          </p>
          
          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-8 bg-[var(--bg)] p-2 w-max border-4 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)]">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={cn(
                  "px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 border-transparent",
                  selectedRegion === region 
                    ? "bg-[var(--text-1)] text-[var(--bg)] shadow-none"
                    : "bg-transparent text-[var(--text-2)] hover:border-[var(--text-1)] hover:bg-[var(--color-white)] text-[var(--text-1)]"
                )}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-80">
          <div className="relative group bg-[var(--color-white)] border-4 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] focus-within:shadow-[8px_8px_0_0_var(--blue)] focus-within:-translate-y-1 focus-within:-translate-x-1 transition-all">
            <MagnifyingGlass
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-1)] z-10"
              size={20}
              weight="bold"
            />
            <input
              type="text"
              placeholder="SEARCH COUNTRIES..."
              className="w-full bg-transparent p-4 pl-12 text-[10px] font-black uppercase tracking-[0.2em] outline-none placeholder:text-[var(--text-3)] text-[var(--text-1)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ─── Legal Disclaimer ─────────────────────────────── */}
      <div className="mb-12 bg-[#FF5F56] text-[var(--bg)] p-6 border-4 border-[var(--text-1)] shadow-[8px_8px_0_0_var(--text-1)] flex flex-col md:flex-row items-center md:items-start gap-6">
        <Warning size={48} weight="bold" className="shrink-0 animate-pulse" />
        <div className="space-y-2">
          <h3 className="text-xl font-black uppercase tracking-widest text-[var(--text-1)]">Liability Notice: AI-Synthesized Intelligence</h3>
          <p className="font-bold text-sm leading-relaxed">
            Legal frameworks, statutes, and articles generated on this platform are synthesized by Artificial Intelligence for structural reference only. 
            <strong> WE ARE NOT A LAW FIRM AND THIS IS NOT LEGAL ADVICE. </strong> 
            Reliance on this automated data without consulting certified local counsel in the respective jurisdiction may result in non-enforcement and strict civil penalty. We disclaim all liability.
          </p>
        </div>
      </div>

      {/* ─── Analytics Dashboard Container ────────────────── */}
      <div className="brutalist-card bg-[var(--color-white)] overflow-hidden shadow-[8px_8px_0_0_var(--text-1)]">
        <div className="p-8 border-b-4 border-[var(--text-1)] flex items-center justify-between bg-[var(--bg)]">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-[var(--text-1)]">Available Countries</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-[var(--text-1)] bg-[var(--blue)] animate-pulse shadow-[2px_2px_0_0_var(--text-1)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-1)]">Digital Knowledge Sync</span>
            </div>
          </div>
        </div>

        <div className="divide-y-2 divide-[var(--text-1)] min-h-[400px]">
          {filtered.length === 0 ? (
            <div className="p-32 text-center bg-[var(--color-white)] border-b-4 border-[var(--text-1)]">
              <Warning size={48} weight="bold" className="mx-auto mb-6 text-[var(--text-1)]" />
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-[var(--text-1)]">No Countries Found</h3>
              <p className="text-sm text-[var(--text-2)] font-bold">Try searching for a different place.</p>
            </div>
          ) : (
            filtered.map((country) => (
              <div key={country.code} className="group transition-all bg-[var(--color-white)] relative">
                <div
                  className={cn(
                    "flex items-center justify-between p-10 cursor-pointer hover:bg-[#F0F0F2] transition-colors relative",
                    selected === country.code && "bg-[#F0F0F2]"
                  )}
                  onClick={() => {
                    const isExpanding = selected !== country.code;
                    setSelected(isExpanding ? country.code : null);
                    if (isExpanding) fetchInsights(country.name, country.code);
                  }}
                >
                  <div className="flex items-center gap-10 relative z-10 w-full">
                    <div className="text-5xl transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl flex-shrink-0">
                      {country.flag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-2xl text-[var(--text-1)] tracking-tight leading-none mb-2 group-hover:text-[var(--blue)] transition-colors truncate">
                        {country.name}
                      </h3>
                      <div className="flex items-center gap-6">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">
                           {country.code}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary)] flex items-center gap-2">
                          <ShieldCheck weight="bold" /> Verified
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 flex-shrink-0">
                      <div className="hidden md:flex gap-3">
                        {['CIVIL LAW', 'B2B READY', 'ENFORCED'].map((tag, i) => (
                          <span key={i} className="px-4 py-2 border-2 border-[var(--text-1)] bg-[var(--color-white)] text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className={cn(
                        "w-12 h-12 border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] bg-[var(--bg)] flex items-center justify-center transition-all duration-300",
                        selected === country.code ? "bg-[var(--text-1)] text-[var(--bg)] rotate-180" : "text-[var(--text-1)] group-hover:bg-[var(--color-white)] hover:text-[var(--blue)]"
                      )}>
                        <CaretDown size={20} weight="bold" />
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {selected === country.code && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden bg-[var(--bg)] border-t-4 border-[var(--text-1)]"
                    >
                      <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loadingInsights === country.code ? (
                          <div className="col-span-3 p-12 bg-[var(--text-1)] border-4 border-[var(--text-1)] text-[var(--bg)] shadow-[8px_8px_0_0_var(--text-1)] flex flex-col items-center justify-center text-center space-y-6 min-h-[300px] animate-pulse">
                            <Globe size={64} className="animate-spin text-[var(--blue)]" />
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight text-[var(--bg)]">Synthesizing {country.name} Data</h3>
                            <p className="text-sm font-bold text-[var(--bg)]/80 max-w-xl mx-auto leading-relaxed">
                              Consulting active digital precedence and cross-referencing AI legal statutes to ensure maximum real-time accuracy. This complex jurisdictional scrape may take up to 10 seconds.
                            </p>
                          </div>
                        ) : insights[country.code] ? (
                          <>
                            {insights[country.code].legalFramework && (
                              <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="p-8 bg-[var(--color-white)] border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] space-y-6 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--blue)] transition-all"
                              >
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-1)] flex items-center gap-2 pb-4 border-b-2 border-[var(--text-1)]">
                                  <Scales weight="bold" className="text-[var(--blue)]" /> Framework: {insights[country.code].legalFramework}
                               </h4>
                                <p className="text-sm font-bold text-[var(--text-2)] leading-relaxed italic border-l-4 border-[var(--blue)] pl-4 py-1">
                                  &quot;{insights[country.code].regionalInsight}&quot;
                                </p>
                                <button className="brutalist-button w-full text-[10px] shadow-[2px_2px_0_0_var(--text-1)] border-2 border-[var(--text-1)] bg-[var(--text-1)] text-[var(--bg)]">
                                  Agreement Structure
                                </button>
                              </motion.div>
                            )}

                            {insights[country.code].enforceability && (
                              <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="p-8 bg-[var(--color-white)] border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] space-y-6 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--secondary)] transition-all"
                              >
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-1)] flex items-center gap-2 pb-4 border-b-2 border-[var(--text-1)]">
                                  <ShieldCheck weight="bold" className="text-[var(--secondary)]" /> Rules for Enforcing
                                </h4>
                                <ul className="space-y-4">
                                  {insights[country.code].enforceability?.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-4 text-xs font-bold text-[var(--text-2)] leading-tight">
                                      <div className="w-2 h-2 border border-[var(--text-1)] bg-[var(--secondary)] mt-1 shrink-0" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}

                            {insights[country.code].keyArticles && (
                                <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="p-8 bg-[var(--blue)] border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] space-y-6 text-[var(--bg)] hover:-translate-y-1 transition-all"
                                >
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--bg)] flex items-center gap-2 pb-4 border-b-2 border-[var(--text-1)]">
                                    <Sparkle weight="bold" className="text-yellow-300" /> Important Laws
                                </h4>
                                <div className="space-y-4">
                                    {insights[country.code].keyArticles?.map((art: string, i: number) => (
                                    <div key={i} className="text-[10px] font-black p-4 bg-[var(--color-white)] border-2 border-[var(--text-1)] text-[var(--text-1)] uppercase tracking-wide shadow-[2px_2px_0_0_var(--text-1)]">
                                        {art}
                                    </div>
                                    ))}
                                    {insights[country.code].warning && (
                                    <div className="mt-6 p-4 bg-[#FF5F56] border-2 border-[var(--text-1)] text-[var(--bg)] text-[10px] font-black uppercase tracking-widest leading-normal flex items-start gap-3 shadow-[2px_2px_0_0_var(--text-1)]">
                                        <Warning weight="bold" size={24} className="shrink-0" />
                                        <span>{insights[country.code].warning}</span>
                                    </div>
                                    )}
                                </div>
                                </motion.div>
                            )}
                          </>
                        ) : (
                          <div className="col-span-3 p-20 text-center border-4 border-dashed border-[var(--text-1)]/20">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--bg)] border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] text-[10px] font-black text-[var(--text-1)] uppercase tracking-widest">
                              <Globe size={16} className="animate-spin-slow text-[var(--blue)]" /> Loading Knowledge Graph
                            </div>
                          </div>
                        )}
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
  );
}
