'use client';

import { useState } from 'react';
import { contractTemplates } from '@/data/templates';
import { ContractCategory } from '@/lib/types';
import Link from 'next/link';
import { Search, Star, Layers, ChevronRight, Gavel, Briefcase, Home, Shield, Zap, Info, Compass, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ContractCategory | 'all'>('all');

  const CATEGORY_ICONS: Record<string, any> = {
    loan: Gavel,
    sale: Zap,
    service: Briefcase,
    rental: Home,
    nda: Shield,
    freelance: Compass,
    roommate: Info,
    employment: Briefcase,
    partnership: Layers,
    custom: Sparkles,
  };

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
      className="templates-container"
    >
      {/* ─── Header ─────────────────────────────────────── */}
      <motion.div variants={item} className="templates-header">
        <div className="templates-header-badge-row">
          <div className="framework-badge">
            Legal Frameworks
          </div>
        </div>
        <h1 className="heading-1 templates-title">
          Contract Templates.
        </h1>
        <p className="templates-subtitle">
          High-end, jurisdiction-aware frameworks designed for every personal and professional agreement.
        </p>
      </motion.div>

      {/* ─── Search & Filters ───────────────────────────── */}
      <motion.div variants={item} className="templates-filter-bar">
        <div className="templates-search-container">
          <Search size={18} className="templates-search-icon" />
          <input
            className="field templates-search-field"
            placeholder="Search the legal library..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="templates-categories-scroll">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`template-cat-btn ${category === cat.value ? 'template-cat-btn-active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── Grid ────────────────────────────────────────── */}
      <div className="templates-grid">
        {filtered.map(template => (
          <motion.div key={template.id} variants={item}>
            <Link
              href={`/contracts/new?template=${template.id}`}
              className="card-premium no-underline template-card-link"
            >
              <div className="template-card-image-container relative">
                {/* Fallback Icon Container - Base Layer */}
                <div className="template-card-icon-fallback absolute inset-0 -z-10 flex flex-col items-center justify-center">
                  {(() => {
                    const Icon = CATEGORY_ICONS[template.category] || Layers;
                    return <Icon size={32} strokeWidth={1.5} className="template-card-image-icon" />;
                  })()}
                </div>

                {/* Primary Image - Top Layer */}
                {template.image && (
                  <img
                    src={template.image}
                    className="template-card-image absolute inset-0 z-10 bg-surface-solid"
                    alt={template.name}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = '0'; // Reveal the fallback underneath
                    }}
                  />
                )}
                {template.popular && (
                  <div className="template-popular-badge">
                    <Star size={10} fill="#000" /> POPULAR
                  </div>
                )}
              </div>

              <div className="template-card-content">
                <div className="template-card-badge-row">
                  <div className="badge badge-blue">{template.category}</div>
                </div>
                <h3 className="serif template-card-title">{template.name}</h3>
                <p className="template-card-desc">
                  {template.description}
                </p>

                <div className="template-card-footer">
                  <div className="template-card-meta">
                    <div className="template-meta-text">
                      {template.fields.length} Inputs
                    </div>
                    <div className="dot-separator" />
                    <div className="template-meta-text">
                      {template.clauses.length} Clauses
                    </div>
                  </div>
                  <div className="template-cta-text">
                    Use Template <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <motion.div variants={item} style={{ padding: '120px 0', textAlign: 'center' }}>
          <Layers size={48} strokeWidth={1} style={{ color: 'var(--text-3)', opacity: 0.3, marginBottom: 24 }} />
          <h3 className="serif" style={{ fontSize: '1.75rem', marginBottom: 8 }}>No frameworks found</h3>
          <p style={{ color: 'var(--text-3)' }}>Try adjusting your search criteria or browse all library items.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
