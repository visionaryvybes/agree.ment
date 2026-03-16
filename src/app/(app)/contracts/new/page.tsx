'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { contractTemplates } from '@/data/templates';
import { useContracts } from '@/store/contracts';
import { ContractTemplate, ContractClause } from '@/lib/types';
import { v4 as uuid } from 'uuid';
import {
  ArrowLeft,
  Sparkle,
  FileText,
  ChatCenteredDots,
  Plus,
  Trash,
  CaretUp,
  CaretDown,
  FloppyDisk,
  PaperPlaneTilt,
  CircleNotch,
  WarningCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  MagnifyingGlass,
  IdentificationCard,
  Shield
} from "@phosphor-icons/react";
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Method = 'template' | 'ai' | 'whatsapp' | null;

export default function NewContractPage() {
  const router = useRouter();
  const { addContract } = useContracts();
  const [method, setMethod] = useState<Method>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [aiPrompt, setAiPrompt] = useState('');
  const [conversation, setConversation] = useState('');
  const [clauses, setClauses] = useState<ContractClause[]>([]);
  const [title, setTitle] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiMeta, setAiMeta] = useState<{ summary?: string; legalWarnings?: string[]; recommendedSteps?: string[] } | null>(null);
  const [parsedInfo, setParsedInfo] = useState<{ confidence?: string; missingInfo?: string[] } | null>(null);

  const set = (id: string, val: string) => setFormData(p => ({ ...p, [id]: val }));

  /* ─── AI generate ─────────────────────────────────────────────── */
  const generateAI = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          party1: formData.party1_name,
          party2: formData.party2_name,
          jurisdiction: formData.jurisdiction,
          category: 'auto',
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const c = data.contract;
      setTitle(c.title);
      setClauses(c.clauses.map((cl: ContractClause) => ({ ...cl, id: uuid() })));
      setAiMeta({ summary: c.summary, legalWarnings: c.legalWarnings, recommendedSteps: c.recommendedSteps });
      setStep(3);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Parse conversation ──────────────────────────────────────── */
  const parseConversation = async () => {
    if (!conversation.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation,
          party1: formData.party1_name,
          party2: formData.party2_name,
          jurisdiction: formData.jurisdiction,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const p = data.parsed;
      setTitle(p.title);
      setClauses(p.clauses.map((cl: ContractClause & { sourceQuote?: string }) => ({
        id: uuid(),
        title: cl.title,
        content: cl.content,
        isRequired: cl.isRequired ?? true,
        legalBasis: cl.sourceQuote,
      })));
      setParsedInfo({ confidence: p.confidence, missingInfo: p.missingInfo });
      setStep(3);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Parse failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Template ────────────────────────────────────────────────── */
  const selectTemplate = (t: ContractTemplate) => {
    setSelectedTemplate(t);
    setClauses(t.clauses.map(c => ({ ...c, id: uuid() })));
    setTitle(t.name);
    setStep(2);
  };

  /* ─── Clause ops ──────────────────────────────────────────────── */
  const updateClause = (id: string, field: 'title' | 'content', val: string) =>
    setClauses(p => p.map(c => c.id === id ? { ...c, [field]: val } : c));
  const removeClause = (id: string) => setClauses(p => p.filter(c => c.id !== id));
  const addClause = () => setClauses(p => [...p, { id: uuid(), title: 'New Clause', content: '', isRequired: false }]);
  const moveClause = (i: number, dir: 'up' | 'down') => {
    const n = [...clauses];
    const j = dir === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    setClauses(n);
  };

  /* ─── Save ────────────────────────────────────────────────────── */
  const save = (status: 'draft' | 'pending_signature') => {
    const id = addContract({
      title: title || 'Untitled Agreement',
      category: selectedTemplate?.category || 'custom',
      description: aiPrompt || conversation || `${selectedTemplate?.name || 'Custom'} agreement`,
      status,
      parties: [
        { id: uuid(), name: formData.party1_name || formData.lender_name || formData.seller_name || formData.client_name || 'Party A', email: '', role: 'creator', signedAt: new Date() },
        { id: uuid(), name: formData.party2_name || formData.borrower_name || formData.buyer_name || formData.provider_name || 'Party B', email: '', role: 'counterparty' },
      ],
      clauses,
      totalAmount: parseFloat(formData.loan_amount || formData.sale_price || formData.service_fee || formData.rental_amount || formData.project_fee || '0') || undefined,
      currency: 'USD',
      paymentSchedule: [],
      escalation: [],
      jurisdiction: formData.jurisdiction || 'Not specified',
      governingLaw: `Laws of ${formData.jurisdiction || 'the agreed jurisdiction'}`,
      metadata: method === 'whatsapp' ? { originatedFrom: 'WhatsApp conversation' } : {},
    });
    router.push(`/contracts/${id}`);
  };

  /* ─── Party names helper ──────────────────────────────────────── */
  const p1 = formData.party1_name || formData.lender_name || formData.seller_name || formData.client_name || 'Party A';
  const p2 = formData.party2_name || formData.borrower_name || formData.buyer_name || formData.provider_name || 'Party B';

  return (
    <div className="p-12 lg:p-16 bg-[var(--bg)] min-h-full selection:bg-[var(--text-1)] selection:text-white">
      {/* ─── Header: Protocol Genesis ────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-16 border-b-4 border-[var(--text-1)] mb-16">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--blue)] mb-6">
            Protocol Genesis &middot; Phase {step}/3
          </p>
          <h1 className="heading-display mb-6"> Protocol Architect.</h1>
          <p className="text-2xl text-[var(--text-2)] font-bold tracking-tight">
            Synthesize a binding legal framework for <span className="text-[var(--text-1)]">Immediate Enforcement</span>.
          </p>
        </div>

        <button
          onClick={() => step > 1 ? setStep((step - 1) as 1 | 2 | 3) : router.back()}
          className="brutalist-button h-16 px-10 text-[10px] bg-white text-[var(--text-1)] no-underline flex items-center gap-3 border-4 shadow-[4px_4px_0_0_black]"
        >
          <ArrowLeft size={20} weight="bold" />
          Abort/Revert
        </button>
      </div>

      {/* ─── Step 1: Logic Selection ─────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-16 animate-slide-up">
          <div className="max-w-2xl">
            <h2 className="heading-section text-4xl uppercase font-black mb-6">Select Initialization Vector</h2>
            <p className="text-xl text-[var(--text-2)] font-bold tracking-tight opacity-70">Describe the intent or select a verified structural fragment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { id: 'ai', Icon: Sparkle, label: 'Describe (AI)', sub: 'Natural language synthesis. Full logic generation.', badge: 'Verified' },
              { id: 'whatsapp', Icon: ChatCenteredDots, label: 'Import Artifact', sub: 'Extract terms from unstructured transcripts.', badge: null },
              { id: 'template', Icon: FileText, label: 'Registry Library', sub: '20+ jurisdiction-aware structural fragments.', badge: null },
            ].map(({ id, Icon, label, sub, badge }) => (
              <button
                key={id}
                onClick={() => {
                  setMethod(id as Method);
                  if (id !== 'template') setStep(2);
                }}
                className={cn(
                  "group relative p-12 brutalist-card border-4 text-left transition-all",
                  method === id ? "bg-[var(--text-1)] text-white shadow-[8px_8px_0_0_#1447E6]" : "bg-white"
                )}
              >
                {badge && (
                  <div className="absolute top-8 right-8">
                    <span className="bg-[var(--blue)] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1">
                      {badge}
                    </span>
                  </div>
                )}
                <div className={cn(
                  "w-20 h-20 border-4 border-current flex items-center justify-center mb-10 transition-colors",
                  method === id ? "bg-white text-[var(--text-1)]" : "bg-[var(--bg)]"
                )}>
                  <Icon size={40} weight="bold" />
                </div>
                <h3 className="heading-section text-2xl uppercase font-black mb-4">{label}</h3>
                <p className="text-sm font-bold leading-relaxed opacity-60 mb-10">{sub}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest leading-none">
                  Load Protocol <ArrowRight size={16} weight="bold" />
                </div>
              </button>
            ))}
          </div>

          {method === 'template' && (
            <div className="pt-16 border-t-4 border-[var(--text-1)] space-y-12 animate-slide-up">
              <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--text-3)]">Registry Fragments</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {contractTemplates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => selectTemplate(t)}
                    className="group brutalist-card p-8 text-left border-4 hover:bg-[var(--text-1)] hover:text-white transition-all"
                  >
                    <div className="text-4xl mb-8 group-hover:scale-110 transition-transform inline-block drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{t.icon}</div>
                    <h4 className="font-black text-[var(--text-1)] text-lg mb-2 uppercase tracking-tighter group-hover:text-white">{t.name}</h4>
                    <p className="text-[10px] text-[var(--text-3)] font-black uppercase tracking-widest mb-6 opacity-60 leading-relaxed group-hover:text-white/60">{t.description.slice(0, 45)}...</p>
                    {t.popular && <span className="bg-emerald-400 text-black text-[8px] font-black uppercase tracking-widest px-2 py-1 border-2 border-black">Verified</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Step 2: Input Protocol ─────────────────────────────────── */}
      {step === 2 && (
        <div className="grid lg:grid-cols-3 gap-16 animate-slide-up">
          <div className="lg:col-span-2 space-y-16">
            <h2 className="heading-section text-4xl uppercase font-black max-w-2xl">
              {method === 'ai' ? 'Declare Intent.' :
                method === 'whatsapp' ? 'Artifact Extraction.' :
                  `Protocol: ${selectedTemplate?.name}`}
            </h2>

            {(method === 'ai' || method === 'whatsapp') && (
              <div className="grid md:grid-cols-3 gap-8 brutalist-card bg-white p-10 border-4">
                {[
                  { id: 'party1_name', label: 'Primary Node', icon: <IdentificationCard size={16} weight="bold" /> },
                  { id: 'party2_name', label: 'Counterparty', icon: <IdentificationCard size={16} weight="bold" /> },
                  { id: 'jurisdiction', label: 'Network/Jurisdiction', icon: <MagnifyingGlass size={16} weight="bold" /> }
                ].map((f) => (
                  <div key={f.id} className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] flex items-center gap-2">
                      {f.icon} {f.label}
                    </label>
                    <input
                      className="w-full h-14 bg-[var(--bg)] border-4 border-[var(--text-1)] px-6 text-sm font-black uppercase tracking-tight focus:outline-none focus:bg-white"
                      placeholder="ENTRY REQUIRED"
                      value={formData[f.id] || ''}
                      onChange={e => set(f.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="brutalist-card bg-white p-12 border-4 space-y-10">
              {method === 'ai' && (
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">Intent Declaration (Plain Language)</label>
                  <textarea
                    className="w-full bg-[var(--bg)] border-4 border-[var(--text-1)] p-8 text-lg font-bold focus:outline-none focus:bg-white min-h-[350px] custom-scrollbar"
                    placeholder="E.g., I'm lending $4,000 to James. Monthly payments of $500 starting next month. No interest. If he misses 2 payments, the full balance is due."
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                  />
                </div>
              )}

              {method === 'whatsapp' && (
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">Artifact Import (Transcript/Notes)</label>
                  <textarea
                    className="w-full bg-[var(--bg)] border-4 border-[var(--text-1)] p-8 text-sm font-black focus:outline-none focus:bg-white min-h-[450px] custom-scrollbar"
                    placeholder="Paste conversation transcript here..."
                    value={conversation}
                    onChange={e => setConversation(e.target.value)}
                  />
                </div>
              )}

              {method === 'template' && selectedTemplate && (
                <div className="space-y-10">
                  {selectedTemplate?.fields.map(field => (
                    <div key={field.id} className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] flex items-center gap-2">
                        {field.label} {field.required && <span className="text-red-600 font-black">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea className="w-full bg-[var(--bg)] border-4 border-[var(--text-1)] p-6 text-sm font-black focus:outline-none focus:bg-white" rows={4} placeholder={field.placeholder} value={formData[field.id] || ''} onChange={e => set(field.id, e.target.value)} />
                      ) : field.type === 'select' ? (
                        <select className="w-full h-14 bg-[var(--bg)] border-4 border-[var(--text-1)] px-6 text-sm font-black uppercase appearance-none cursor-pointer" value={formData[field.id] || ''} onChange={e => set(field.id, e.target.value)}>
                          <option value="">Select Logic Option...</option>
                          {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={field.type === 'currency' ? 'number' : field.type} className="w-full h-14 bg-[var(--bg)] border-4 border-[var(--text-1)] px-6 text-sm font-black focus:outline-none focus:bg-white" placeholder={field.placeholder} value={formData[field.id] || ''} onChange={e => set(field.id, e.target.value)} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-4 bg-red-100 border-4 border-red-600 p-6 text-red-600">
                  <WarningCircle size={24} weight="bold" />
                  <span className="text-sm font-black uppercase">{error}</span>
                </div>
              )}

              <button
                disabled={loading || (method === 'ai' ? !aiPrompt.trim() : method === 'whatsapp' ? !conversation.trim() : false)}
                onClick={method === 'ai' ? generateAI : method === 'whatsapp' ? parseConversation : () => setStep(3)}
                className="brutalist-button w-full h-20 bg-[var(--blue)] text-white text-[12px] border-4 shadow-[6px_6px_0_0_black]"
              >
                {loading ? <CircleNotch size={24} className="animate-spin mr-3" /> : <Sparkle size={24} weight="bold" className="mr-3" />}
                {method === 'ai' ? 'Synthesize Protocol Architecture' : method === 'whatsapp' ? 'Extract Jurisdictional Logic' : 'Finalize Architecture Vector →'}
              </button>
            </div>
          </div>

          {/* Side Feedback */}
          <div className="space-y-12">
            <div className="brutalist-card bg-white border-4 p-10 space-y-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-3)]">Pipeline Logic</h3>
              <div className="space-y-8">
                {(method === 'ai' ? [
                  'Natural Language Analysis',
                  'Jurisdiction Logic Mapping',
                  'Clause Synthesis',
                  'Final Enforcement Check',
                ] : method === 'whatsapp' ? [
                  'Artifact Deconstruction',
                  'Party Recognition',
                  'Term Verification',
                  'Structural Compilation',
                ] : [
                  'Structural Parameter Check',
                  'Logic Verification',
                  'Refinement Phase',
                  'Formal Deployment',
                ]).map((s, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-8 h-8 border-4 border-[var(--text-1)] flex items-center justify-center text-[10px] font-black transition-colors group-hover:bg-[var(--text-1)] group-hover:text-white">
                      {i + 1}
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight group-hover:text-[var(--text-1)]">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--text-1)] text-white border-4 p-10 relative overflow-hidden shadow-[8px_8px_0_0_#1447E6]">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Shield size={80} weight="bold" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-6">Security Trace</p>
              <p className="text-sm font-bold leading-relaxed m-0 opacity-80 uppercase tracking-tight">
                {method === 'whatsapp'
                  ? 'Artifacts are digitally verified against international arbitration standards for binding recognition.'
                  : 'System-generated logic is optimized for immediate jurisdictional enforcement.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 3: Refinement Phase ─────────────────────────────────── */}
      {step === 3 && (
        <div className="grid lg:grid-cols-3 gap-16 animate-slide-up">

          {/* Logic Control Panel */}
          <div className="space-y-12">
            <div className="flex items-center justify-between pb-6 border-b-4 border-[var(--text-1)]">
              <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--text-3)]">Protocol Nodes ({clauses.length})</h3>
              <button onClick={addClause} className="w-10 h-10 border-4 border-[var(--text-1)] flex items-center justify-center hover:bg-[var(--text-1)] hover:text-white transition-all">
                <Plus size={18} weight="bold" />
              </button>
            </div>

            <div className="space-y-6">
              {aiMeta?.summary && (
                <div className="bg-[var(--blue)] text-white border-4 border-black p-8 shadow-[4px_4px_0_0_black]">
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 mb-3">Architectural Summary</div>
                  <p className="text-sm font-bold leading-relaxed m-0 uppercase tracking-tight">{aiMeta.summary}</p>
                </div>
              )}

              {clauses.map((clause, i) => (
                <div key={clause.id} className="brutalist-card bg-white p-8 border-4 space-y-6 hover:translate-x-1 transition-all">
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-[var(--text-3)] opacity-40">FRAGMENT_0{i + 1}</span>
                    <input
                      className="flex-1 text-sm font-black uppercase bg-transparent border-none outline-none text-[var(--text-1)]"
                      value={clause.title}
                      onChange={e => updateClause(clause.id, 'title', e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeClause(clause.id)} className="text-red-600 hover:scale-110 transition-transform"><Trash size={18} weight="bold" /></button>
                    </div>
                  </div>
                  <textarea
                    className="w-full text-xs font-bold text-[var(--text-2)] bg-[var(--bg)] p-4 border-2 border-[var(--text-1)] outline-none resize-none leading-relaxed min-h-[100px]"
                    value={clause.content}
                    onChange={e => updateClause(clause.id, 'content', e.target.value)}
                  />
                </div>
              ))}
            </div>

            {aiMeta?.legalWarnings && aiMeta.legalWarnings.length > 0 && (
              <div className="bg-red-400 text-black border-4 border-black p-8 shadow-[4px_4px_0_0_black]">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 border-b-2 border-black pb-2">Risk Detection Log</div>
                <div className="space-y-4">
                  {aiMeta.legalWarnings.map((w) => (
                    <div key={w} className="flex gap-4 text-[11px] font-black uppercase leading-tight">
                      <WarningCircle size={16} weight="bold" className="flex-shrink-0" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Legal Instrument Preview */}
          <div className="lg:col-span-2 space-y-12">
            <div className="brutalist-card bg-white border-4 p-20 relative min-h-[1100px] shadow-[12px_12px_0_0_black]">
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--text-1) 1px, transparent 1px), linear-gradient(90deg, var(--text-1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

              <div className="relative z-10 space-y-20">
                <div className="border-b-8 border-[var(--text-1)] pb-12 flex justify-between items-end">
                  <div className="space-y-6 flex-1 pr-12">
                    <div className="text-[12px] font-black uppercase tracking-[0.5em] text-[var(--blue)]">Binding Protocol</div>
                    <input
                      className="heading-display text-6xl text-[var(--text-1)] bg-transparent border-none outline-none w-full uppercase"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] mb-2">Timestamp</div>
                    <div className="font-black text-lg text-[var(--text-1)] uppercase">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).replace(/,/g, '')}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-16 border-b-4 border-[var(--text-1)] pb-20">
                  {[{ role: 'Architect (Origin)', name: p1 }, { role: 'Counterparty (Target)', name: p2 }].map((p, i) => (
                    <div key={i} className="space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-3)]">{p.role}</div>
                      <div className="font-serif text-4xl text-[var(--text-1)] leading-none">{p.name}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-20">
                  {clauses.map((clause, i) => (
                    <div key={clause.id} className="space-y-8">
                      <h4 className="heading-section text-3xl text-[var(--text-1)] flex items-baseline gap-6 uppercase">
                        <span className="text-sm font-black text-[var(--blue)]">0{i + 1}</span>
                        {clause.title}
                      </h4>
                      <p className="text-[17px] font-bold text-[var(--text-1)] leading-relaxed border-l-8 border-[var(--text-1)] pl-12">
                        {clause.content}
                      </p>
                    </div>
                  ))}
                </div>

                {formData.jurisdiction && (
                  <div className="pt-20 border-t-4 border-[var(--text-1)]">
                    <div className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--text-3)] mb-6">Jurisdiction Shell</div>
                    <p className="text-lg font-black uppercase text-[var(--text-1)] leading-tight tracking-tight">Governed by: {formData.jurisdiction} // Optimized for Instant Enforcement.</p>
                  </div>
                )}

                <div className="pt-32 grid grid-cols-2 gap-24">
                  {[p1, p2].map((name, i) => (
                    <div key={i} className="space-y-8">
                      <div className="h-2 bg-[var(--text-1)] w-full" />
                      <div className="flex justify-between items-center text-[var(--text-1)]">
                        <span className="text-[12px] font-black uppercase tracking-widest">{name}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">ID_PROTO_{Math.random().toString(16).substring(2, 6).toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Global Actions */}
            <div className="flex gap-10">
              <button
                className="brutalist-button flex-1 h-20 bg-white text-[var(--text-1)] text-[12px] border-4 shadow-[6px_6px_0_0_black]"
                onClick={() => { save('draft'); toast({ title: 'Logic Captured', description: 'Fragment stored in workspace.' }); }}
              >
                <FloppyDisk size={24} weight="bold" className="mr-3" />
                Capture Drift
              </button>
              <button
                className="brutalist-button flex-1 h-20 bg-[var(--blue)] text-white text-[12px] border-4 shadow-[8px_8px_0_0_black]"
                onClick={() => { save('pending_signature'); toast({ title: 'Protocol Genesis', description: 'Enforcement vector initialized.' }); }}
              >
                <PaperPlaneTilt size={24} weight="bold" className="mr-3" />
                Genesis Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
