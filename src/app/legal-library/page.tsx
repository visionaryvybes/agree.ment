'use client';

import { useState } from 'react';
import { legalReferences, supportedCountries } from '@/data/legal-library';
import { Search, Globe, BookOpen, ChevronDown, ExternalLink, Scale } from 'lucide-react';

export default function LegalLibraryPage() {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [...new Set(legalReferences.map(r => r.category))];

  const filtered = legalReferences.filter(ref => {
    const matchesSearch = ref.title.toLowerCase().includes(search.toLowerCase()) || ref.content.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || ref.countryCode === selectedCountry;
    const matchesCategory = selectedCategory === 'all' || ref.category === selectedCategory;
    return matchesSearch && matchesCountry && matchesCategory;
  });

  const countryFlag = (code: string) => supportedCountries.find(c => c.code === code)?.flag || '';

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Legal Library</h1>
        <p className="text-slate-500 mt-1">Browse laws, constitutions, and legal frameworks by country. Used by AI to craft jurisdiction-specific agreements.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-4 flex items-center gap-3">
          <Globe className="w-8 h-8 text-teal-600" />
          <div>
            <p className="text-2xl font-bold text-slate-900">{supportedCountries.length}</p>
            <p className="text-xs text-slate-500">Countries</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-2xl font-bold text-slate-900">{legalReferences.length}</p>
            <p className="text-xs text-slate-500">Legal References</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <Scale className="w-8 h-8 text-purple-600" />
          <div>
            <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
            <p className="text-xs text-slate-500">Categories</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input className="input pl-10" placeholder="Search laws, acts, constitutions..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto min-w-[200px]" value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
          <option value="all">All Countries</option>
          {supportedCountries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
        </select>
        <select className="input w-auto min-w-[200px]" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Country Quick Select */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setSelectedCountry('all')} className={`px-3 py-1.5 rounded-lg text-sm ${selectedCountry === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>
          All
        </button>
        {supportedCountries.slice(0, 10).map(c => (
          <button key={c.code} onClick={() => setSelectedCountry(c.code)} className={`px-3 py-1.5 rounded-lg text-sm ${selectedCountry === c.code ? 'bg-teal-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>
            {c.flag} {c.name}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtered.map(ref => (
          <div key={ref.id} className="card overflow-hidden">
            <button onClick={() => setExpandedId(expandedId === ref.id ? null : ref.id)} className="w-full p-5 flex items-center gap-4 text-left hover:bg-slate-50">
              <span className="text-2xl">{countryFlag(ref.countryCode)}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 text-sm">{ref.title}</h3>
                <p className="text-xs text-slate-500">{ref.country} &middot; {ref.category}</p>
              </div>
              <span className="badge badge-primary text-xs">{ref.category}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === ref.id ? 'rotate-180' : ''}`} />
            </button>

            {expandedId === ref.id && (
              <div className="px-5 pb-5 border-t border-slate-100 fade-in">
                <div className="pt-4">
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">{ref.content}</p>

                  {ref.relevantArticles.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Relevant Articles & Sections</h4>
                      <div className="flex flex-wrap gap-2">
                        {ref.relevantArticles.map((article, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">{article}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-400">Source: {ref.source} &middot; Updated: {new Date(ref.lastUpdated).toLocaleDateString()}</p>
                    <button className="text-xs text-teal-600 flex items-center gap-1 hover:text-teal-700">
                      <ExternalLink className="w-3 h-3" /> View Full Text
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg">No legal references found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
