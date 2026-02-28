'use client';

import { useContracts } from '@/store/contracts';
import Link from 'next/link';
import { FilePlus, ArrowUpRight, AlertTriangle, ChevronRight, FileText, Activity, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { EmptyState } from '@/components/empty-state';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const STATUS_DOT: Record<string, string> = {
  active: 'dot-green',
  pending_signature: 'dot-amber',
  completed: 'dot-blue',
  disputed: 'dot-red',
  draft: 'dot-gray',
  expired: 'dot-gray',
};

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'secondary'> = {
  active: 'success',
  pending_signature: 'warning',
  completed: 'info',
  disputed: 'danger',
  draft: 'secondary',
  expired: 'secondary',
};

const STATUS_LABEL_TEXT: Record<string, string> = {
  active: 'Active',
  pending_signature: 'Pending',
  completed: 'Completed',
  disputed: 'Disputed',
  draft: 'Draft',
  expired: 'Expired',
};

export default function Dashboard() {
  const { contracts, getStats } = useContracts();
  const s = getStats();

  const recent = contracts.slice(0, 6);
  const overdue = contracts
    .flatMap(c => c.paymentSchedule.map(p => ({ ...p, contractTitle: c.title, contractId: c.id })))
    .filter(p => p.status === 'overdue');

  const today = new Date();
  const greeting =
    today.getHours() < 12 ? 'Good morning' :
      today.getHours() < 17 ? 'Good afternoon' :
        'Good evening';

  // Mock data for the graph
  const graphData = [30, 45, 35, 60, 55, 80, 75];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="dashboard-container"
    >
      {/* ─── Header ─────────────────────────────────────── */}
      <motion.div variants={item} className="dashboard-header">
        <div className="dashboard-header-text">
          <h1 className="heading-1 dashboard-title">
            {greeting}.
          </h1>
          <p className="dashboard-subtitle">
            {s.activeContracts > 0
              ? `You have ${s.activeContracts} active agreement${s.activeContracts !== 1 ? 's' : ''} tracking right now.`
              : 'Welcome to AgreeMint. Your digital legal workspace.'}
          </p>
        </div>
        <div className="dashboard-actions">
          <Button variant="outline" size="lg">
            <Activity size={18} />
            <span>View Insights</span>
          </Button>
          <Button variant="premium" size="lg" asChild>
            <Link href="/contracts/new" className="no-underline">
              <FilePlus size={18} />
              <span>New Agreement</span>
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* ─── Stats & Visualization ────────────────────────── */}
      <div className="dashboard-grid-top">
        {/* Trend Graph Card */}
        <motion.div variants={item} className="card-premium dashboard-viz-card">
          <div className="card-header-compact">
            <div className="serif" style={{ fontSize: '1.25rem' }}>Agreement Velocity</div>
            <Badge variant="info">Last 7 Days</Badge>
          </div>
          <div className="card-body-viz">
            {/* Enhanced AI Visualization Chart */}
            <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="gradient-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Area Background */}
              <motion.path
                d={`M 0 100 ${graphData.map((d, i) => `L ${(i / (graphData.length - 1)) * 400} ${100 - d}`).join(' ')} L 400 100 Z`}
                fill="url(#gradient-glow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />

              {/* Secondary Path (Shadow) */}
              <motion.path
                d={`M 0 ${100 - graphData[0]} ${graphData.slice(1).map((d, i) => `L ${((i + 1) / (graphData.length - 1)) * 400} ${100 - d}`).join(' ')}`}
                fill="none"
                stroke="var(--blue)"
                strokeOpacity="0.1"
                strokeWidth="4"
                transform="translate(0, 4)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Main Primary Path */}
              <motion.path
                d={`M 0 ${100 - graphData[0]} ${graphData.slice(1).map((d, i) => `L ${((i + 1) / (graphData.length - 1)) * 400} ${100 - d}`).join(' ')}`}
                fill="none"
                stroke="var(--blue)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Data Points (Pulsing AI Nodes) */}
              {graphData.map((d, i) => (
                <g key={i}>
                  <motion.circle
                    cx={(i / (graphData.length - 1)) * 400}
                    cy={100 - d}
                    r="6"
                    fill="var(--blue)"
                    fillOpacity="0.1"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                  />
                  <motion.circle
                    cx={(i / (graphData.length - 1)) * 400}
                    cy={100 - d}
                    r="3"
                    fill="var(--surface-solid)"
                    stroke="var(--blue)"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  />
                </g>
              ))}
            </svg>
          </div>
        </motion.div>

        {/* Progress / Signature Card */}
        <motion.div variants={item} className="card-premium dashboard-viz-card progress-grid">
          <div>
            <div className="heading-2" style={{ marginBottom: 12 }}>Signature Pipeline</div>
            <div className="serif viz-main-number">
              {contracts.filter(c => c.status === 'pending_signature').length} Agreements
            </div>
            <div className="viz-sub-text">Awaiting counter-party response</div>
          </div>
          <div className="viz-radial-container">
            <svg width="100" height="100" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-subtle)" strokeWidth="10" />
              <motion.circle
                cx="60" cy="60" r="50" fill="none" stroke="var(--blue)" strokeWidth="10"
                strokeDasharray="314.159"
                initial={{ strokeDashoffset: 314.159 }}
                animate={{ strokeDashoffset: 314.159 * (1 - (s.activeContracts / Math.max(s.totalContracts, 1))) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
              <text x="60" y="65" textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: 'var(--text-1)' }}>
                {Math.round((s.activeContracts / Math.max(s.totalContracts, 1)) * 100)}%
              </text>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* ─── Stats row (Tier 2) ─────────────────────────── */}
      <motion.div variants={item} className="dashboard-stats-row">
        {[
          { label: 'Total Volume', value: s.totalContracts.toString(), sub: 'Contracts executed', icon: FileText },
          { label: 'Active Parties', value: '12', sub: 'In circulation', icon: Users },
          { label: 'Avg. Maturity', value: '14d', sub: 'Time to completion', icon: Clock },
          { label: 'Overdue Rate', value: '4.2%', sub: 'High attention', alert: s.overduePayments > 0, icon: AlertTriangle },
        ].map((stat, i) => (
          <div key={stat.label} className="dashboard-stat-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <stat.icon size={14} className="text-3" />
              <div className="heading-2" style={{ margin: 0 }}>{stat.label}</div>
            </div>
            <div className="stat-number" style={{ color: stat.alert ? 'var(--red)' : 'var(--text-1)', marginBottom: 12 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>{stat.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* ─── Main Content (Expanded) ─────────────────────────── */}
      <div className="dashboard-main-content">

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <motion.div variants={item} className="card-premium" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
              <div className="serif" style={{ fontSize: '1.5rem', color: 'var(--text-1)' }}>Active Audits</div>
              <Link href="/contracts" className="no-underline" style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                Browse All <ChevronRight size={16} />
              </Link>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '16px 32px' }} className="heading-2">Contract</th>
                  <th style={{ textAlign: 'left', padding: '16px 32px' }} className="heading-2">Entity</th>
                  <th style={{ textAlign: 'left', padding: '16px 32px' }} className="heading-2">Valuation</th>
                  <th style={{ textAlign: 'left', padding: '16px 32px' }} className="heading-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 64, textAlign: 'center', color: 'var(--text-3)' }}>
                      <FileText size={40} strokeWidth={1} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                      <div style={{ fontSize: 15, fontWeight: 500 }}>No active audit records</div>
                    </td>
                  </tr>
                ) : (
                  recent.map((c, i) => (
                    <tr key={c.id} style={{ borderBottom: i === recent.length - 1 ? 'none' : '1px solid var(--border)' }} className="table-row-hover">
                      <td style={{ padding: '24px 32px' }}>
                        <Link href={`/contracts/${c.id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                          <div className={`dot ${STATUS_DOT[c.status] || 'dot-gray'}`} style={{ marginRight: 14 }} />
                          <span style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: 15 }}>{c.title}</span>
                        </Link>
                      </td>
                      <td style={{ padding: '24px 32px', color: 'var(--text-2)', fontSize: 14, fontWeight: 450 }}>
                        {c.parties.map(p => p.name).join(' · ')}
                      </td>
                      <td style={{ padding: '24px 32px', fontWeight: 600, color: 'var(--text-1)', fontSize: 15 }}>
                        {c.totalAmount ? `$${c.totalAmount.toLocaleString()}` : '—'}
                      </td>
                      <td style={{ padding: '24px 32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Badge variant={STATUS_VARIANT[c.status] || 'secondary'}>
                            {STATUS_LABEL_TEXT[c.status] || c.status}
                          </Badge>
                          <ArrowUpRight size={16} strokeWidth={2.5} style={{ color: 'var(--text-3)', opacity: 0.8 }} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>

          {/* Recent Activity Timeline */}
          <motion.div variants={item} className="card-premium" style={{ padding: '32px' }}>
            <div className="serif" style={{ fontSize: '1.5rem', marginBottom: 24 }}>System Activity</div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '11px', top: '8px', bottom: '8px', width: '2px', background: 'var(--bg-subtle)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { type: 'signed', title: 'Agreement Signed', desc: 'Sarah Jenkins digitally signed the "Freelance Design" contract.', time: '2h ago', icon: '✍️' },
                  { type: 'payment', title: 'Payment Logged', desc: '$1,200 payment received from Michael Chen.', time: '5h ago', icon: '💰' },
                  { type: 'created', title: 'New Draft Created', desc: 'Auto-draft generated for "Consulting Agreement".', time: 'Yesterday', icon: '✨' },
                  { type: 'dispute', title: 'Escalation Triggered', desc: 'Lvl 1 Reminder sent for "Private Loan X".', time: '2 days ago', icon: '⚖️' },
                ].map((activity, i) => (
                  <div key={i} style={{ display: 'flex', gap: 20, position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#fff', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
                      {activity.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{activity.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase' }}>{activity.time}</div>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{activity.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Same actions content ... */}

          {/* Quick Actions Component */}
          <motion.div variants={item} className="card-premium" style={{ padding: 0 }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', fontSize: '1.25rem' }} className="serif">
              Smart Actions
            </div>
            <div style={{ padding: '8px 0' }}>
              {[
                { title: 'Describe with AI', desc: 'Natural language processing', icon: '✨', href: '/ai' },
                { title: 'Signature Request', desc: 'Secure remote verification', icon: '✍️', href: '/contracts' },
                { title: 'Enforcement Toolkit', desc: 'Escalation & demand letters', icon: '⚖️', href: '/legal-library' },
                { title: 'Template Marketplace', desc: 'Verified legal frameworks', icon: '🏛️', href: '/templates' },
              ].map((action, i) => (
                <Link key={i} href={action.href} className="no-underline action-hover-row" style={{ display: 'flex', alignItems: 'center', padding: '16px 32px', borderBottom: i === 3 ? 'none' : '1px solid var(--border)', transition: 'all 0.2s' }}>
                  <div style={{ width: 44, height: 44, background: 'var(--bg-subtle)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 20, fontSize: 18, border: '1px solid var(--border)' }}>
                    {action.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', marginBottom: 2 }}>{action.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 450 }}>{action.desc}</div>
                  </div>
                  <ChevronRight size={18} style={{ color: 'var(--text-3)', opacity: 0.5 }} />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Overdue Alert Component */}
          {overdue.length > 0 && (
            <motion.div variants={item} className="card-premium" style={{ borderColor: 'var(--red)', overflow: 'hidden', padding: 0 }}>
              <div style={{ background: 'var(--red-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(217, 48, 37, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 15, color: 'var(--red)', letterSpacing: '-0.01em' }}>
                  <AlertTriangle size={18} />
                  Risk Detection
                </div>
                <span style={{ background: '#fff', color: 'var(--red)', fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 20, boxShadow: '0 1px 2px rgba(217, 48, 37, 0.1)' }}>
                  {overdue.length} Alerts
                </span>
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {overdue.map(p => (
                  <Link href={`/contracts/${p.contractId}`} key={p.id} className="no-underline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, transition: 'all 0.2s' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: 14, marginBottom: 4 }}>{p.contractTitle}</div>
                      <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 500 }}>{new Date(p.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--red)', fontSize: 16 }}>
                      ${p.amount.toLocaleString()}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
