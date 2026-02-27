'use client';

import { useState } from 'react';
import { contractTemplates } from '@/data/templates';
import { ContractCategory } from '@/lib/types';
import Link from 'next/link';
import { Search, Star } from 'lucide-react';

const categories: { value: ContractCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Templates' },
  { value: 'loan', label: 'Loans' },
  { value: 'sale', label: 'Sales' },
  { value: 'service', label: 'Services' },
  { value: 'rental', label: 'Rental' },
  { value: 'nda', label: 'NDA' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'roommate', label: 'Roommate' },
  { value: 'custom', label: 'Custom AI' },
];

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ContractCategory | 'all'>('all');

  const filtered = contractTemplates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || t.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Contract Templates</h1>
        <p className="text-slate-500 mt-1">Professional, legally-informed templates for every situation.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input className="input pl-10" placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat.value} onClick={() => setCategory(cat.value)} className={`px-4 py-2 rounded-lg text-sm font-medium ${category === cat.value ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(template => (
          <Link key={template.id} href={`/contracts/new?template=${template.id}`} className="card p-6 hover:border-teal-300 group no-underline">
            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl">{template.icon}</span>
              {template.popular && (
                <span className="flex items-center gap-1 badge badge-primary text-xs"><Star className="w-3 h-3" /> Popular</span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-teal-600">{template.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{template.description}</p>
            <div className="flex items-center justify-between">
              <span className="badge badge-primary text-xs">{template.category}</span>
              <span className="text-xs text-slate-400">{template.fields.length} fields &middot; {template.clauses.length} clauses</span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">No templates found</p>
          <p className="text-sm">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}
