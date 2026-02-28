'use client';

import { useState } from 'react';
import { countries, Country } from '@/data/countries';
import { Search, Globe, ChevronDown, Sparkles, Loader2, BookOpen } from 'lucide-react';

export default function LegalLibraryPage() {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [aiData, setAiData] = useState<Record<string, string>>({});

  const regions = [...new Set(countries.map(c => c.region))].sort();

  const filtered = countries.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || c.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const generateLegalContext = async (country: Country) => {
    if (aiData[country.code]) return; // Already loaded

    setAiLoading(p => ({ ...p, [country.code]: true }));
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Provide a concise overview of Contract Law, Lending Rules, and Dispute Resolution in ${country.name}. Use concise paragraphs.`,
          }],
        }),
      });
      const data = await res.json();
      setAiData(p => ({ ...p, [country.code]: data.content }));
    } catch (e) {
      setAiData(p => ({ ...p, [country.code]: 'Failed to load legal context for this jurisdiction.' }));
    } finally {
      setAiLoading(p => ({ ...p, [country.code]: false }));
    }
  };

  const toggleExpand = (country: Country) => {
    const isExpanding = expandedId !== country.code;
    setExpandedId(isExpanding ? country.code : null);
    if (isExpanding) {
      generateLegalContext(country);
    }
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 className="heading-display" style={{ fontSize: '1.6rem', marginBottom: 4 }}>Legal Library</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Explore contract laws and regulations spanning 195 jurisdictions.</p>
      </div>

      {/* Stats */}
      <div className="card-flat" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        {[
          { label: 'Countries Covered', value: countries.length },
          { label: 'Regions', value: regions.length },
          { label: 'Intelligence', value: 'AI-Powered' },
        ].map((stat, i) => (
          <div key={stat.label} style={{ padding: '22px 24px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{stat.label}</div>
            <div className="stat-number" style={{ color: 'var(--text-1)', marginBottom: 4 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input
            className="field"
            style={{ paddingLeft: 40 }}
            placeholder="Search by country name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="field" style={{ width: 220 }} value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
          <option value="all">All Regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(country => (
          <div key={country.code} className="card-flat" style={{ overflow: 'hidden' }}>
            <button
              onClick={() => toggleExpand(country)}
              style={{
                width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
                background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>{country.flag}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 2 }}>{country.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{country.region}</p>
              </div>
              <ChevronDown size={16} style={{ color: 'var(--text-3)', transform: expandedId === country.code ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {expandedId === country.code && (
              <div className="fade-in" style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 16 }}>
                {aiLoading[country.code] ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-2)', fontSize: 13, padding: '20px 0' }}>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Generating legal context from AI...
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                      <span className="badge badge-blue"><Sparkles size={10} style={{ marginRight: 4 }}/> AI Summary</span>
                    </div>
                    <div className="prose-legal" style={{ whiteSpace: 'pre-wrap' }}>
                      {aiData[country.code]}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 64, textAlign: 'center', color: 'var(--text-3)' }}>
            <BookOpen size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <div style={{ fontSize: 14 }}>No countries found.</div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
