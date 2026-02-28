'use client';

import { useState } from 'react';
import { useContracts } from '@/store/contracts';
import { ContractStatus } from '@/lib/types';
import Link from 'next/link';
import { Search, Plus, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/empty-state';

const STATUS_VARIANT: Record<ContractStatus, 'success' | 'warning' | 'secondary' | 'info' | 'danger'> = {
  active: 'success',
  pending_signature: 'warning',
  draft: 'secondary',
  completed: 'info',
  disputed: 'danger',
  expired: 'secondary',
};

const STATUS_LABEL: Record<ContractStatus, string> = {
  active: 'Active',
  pending_signature: 'Pending',
  draft: 'Draft',
  completed: 'Completed',
  disputed: 'Disputed',
  expired: 'Expired',
};

const STATUS_DOT: Record<ContractStatus, string> = {
  active: 'dot-green',
  pending_signature: 'dot-amber',
  draft: 'dot-gray',
  completed: 'dot-blue',
  disputed: 'dot-red',
  expired: 'dot-gray',
};

const FILTERS: Array<{ value: ContractStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending_signature', label: 'Pending' },
  { value: 'draft', label: 'Draft' },
  { value: 'completed', label: 'Completed' },
  { value: 'disputed', label: 'Disputed' },
];

export default function ContractsPage() {
  const { contracts } = useContracts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ContractStatus | 'all'>('all');

  const filtered = contracts.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      c.title.toLowerCase().includes(q) ||
      c.parties.some(p => p.name.toLowerCase().includes(q)) ||
      c.jurisdiction.toLowerCase().includes(q);
    const matchStatus = filter === 'all' || c.status === filter;
    return matchSearch && matchStatus;
  });

  const totalOwed = filtered.reduce((sum, c) => {
    const outstanding = c.paymentSchedule.filter(p => ['pending', 'overdue'].includes(p.status)).reduce((s, p) => s + p.amount, 0);
    return sum + outstanding;
  }, 0);

  return (
    <div style={{ padding: '28px 40px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div className="heading-1">My Agreements</div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
            {contracts.length} total · {contracts.filter(c => c.status === 'active').length} active
            {totalOwed > 0 && ` · $${totalOwed.toLocaleString()} outstanding`}
          </div>
        </div>
        <Button variant="premium" asChild>
          <Link href="/contracts/new" className="no-underline">
            <Plus size={14} /> New Agreement
          </Link>
        </Button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', zIndex: 1 }} />
          <Input
            className="pl-8 border-slate-200"
            placeholder="Search by title, party, or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 3 }}>
          {FILTERS.map(f => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="icon" aria-label="Filter options">
          <SlidersHorizontal size={13} />
        </Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title={search ? 'No agreements match your search' : 'No agreements yet'}
          description={search ? 'Try a different search term' : 'Create your first agreement to get started'}
          actionLabel={search ? undefined : 'Create Agreement'}
          actionHref={search ? undefined : '/contracts/new'}
        />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>Status</th>
                <th>Agreement</th>
                <th>Parties</th>
                <th>Jurisdiction</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th>Payments</th>
                <th>Created</th>
                <th style={{ width: 32 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const paid = c.paymentSchedule.filter(p => p.status === 'paid').length;
                const total = c.paymentSchedule.length;
                return (
                  <tr key={c.id} onClick={() => window.location.href = `/contracts/${c.id}`}>
                    <td>
                      <span className={`dot ${STATUS_DOT[c.status]}`} title={STATUS_LABEL[c.status]} />
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{c.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, textTransform: 'capitalize' }}>{c.category}</div>
                    </td>
                    <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{c.parties.map(p => p.name).join(' · ')}</td>
                    <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{c.jurisdiction || '—'}</td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                      {c.totalAmount ? `$${c.totalAmount.toLocaleString()}` : <span style={{ color: 'var(--text-3)' }}>—</span>}
                    </td>
                    <td>
                      {total > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-track" style={{ width: 60 }}>
                            <div className="progress-fill" style={{ width: `${(paid / total) * 100}%` }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{paid}/{total}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-3)', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ color: 'var(--text-3)' }}>
                      <ArrowUpRight size={14} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
