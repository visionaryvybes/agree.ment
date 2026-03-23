'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  FloppyDisk,
  PaperPlaneTilt,
  CircleNotch,
  WarningCircle,
  ArrowRight,
  MagnifyingGlass,
  IdentificationCard
} from "@phosphor-icons/react";
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Method = 'template' | 'ai' | 'whatsapp' | null;

function NewContractContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('template');

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
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (templateIdParam) {
      const tpl = contractTemplates.find(t => t.id === templateIdParam);
      if (tpl) {
        setMethod('template');
        setSelectedTemplate(tpl);
        setClauses(tpl.clauses.map(c => ({ ...c, id: uuid() })));
        setTitle(tpl.name);
        setStep(2);
      }
    }
  }, [templateIdParam]);

  const set = (id: string, val: string) => setFormData((p: Record<string, string>) => ({ ...p, [id]: val }));

  /* ─── AI generate ─────────────────────────────────────────────── */
  const generateAI = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true); setError(''); setLoadingStep(1);
    const interval = setInterval(() => {
      setLoadingStep((s: number) => s < 3 ? s + 1 : 3);
    }, 2500);
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
      clearInterval(interval);
      setLoading(false);
    }
  };

  /* ─── Parse conversation ──────────────────────────────────────── */
  const parseConversation = async () => {
    if (!conversation.trim()) return;
    setLoading(true); setError(''); setLoadingStep(1);
    const interval = setInterval(() => {
      setLoadingStep((s: number) => s < 3 ? s + 1 : 3);
    }, 2500);
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
      })));
      // setParsedInfo({ confidence: p.confidence, missingInfo: p.missingInfo });
      setStep(3);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Parse failed. Please try again.');
    } finally {
      clearInterval(interval);
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
    setClauses((p: ContractClause[]) => p.map((c: ContractClause) => c.id === id ? { ...c, [field]: val } : c));
  const removeClause = (id: string) => setClauses((p: ContractClause[]) => p.filter((c: ContractClause) => c.id !== id));
  const addClause = () => setClauses((p: ContractClause[]) => [...p, { id: uuid(), title: 'New Clause', content: '', isRequired: false }]);

  /* ─── Save ────────────────────────────────────────────────────── */
  const save = (status: 'draft' | 'pending_signature') => {
    const p1 = formData.party1_name || formData.lender_name || formData.seller_name || formData.client_name || 'Party A';
    const p2 = formData.party2_name || formData.borrower_name || formData.buyer_name || formData.provider_name || 'Party B';
    const id = addContract({
      title: title || 'Untitled Agreement',
      category: selectedTemplate?.category || 'custom',
      description: aiPrompt || conversation || `${selectedTemplate?.name || 'Custom'} agreement`,
      status,
      parties: [
        { id: uuid(), name: p1, email: '', role: 'creator', signedAt: new Date() },
        { id: uuid(), name: p2, email: '', role: 'counterparty' },
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

  return (
    <div className="px-5 py-8 sm:px-8 md:px-12 lg:px-16 md:py-16 bg-[var(--bg)] min-h-full selection:bg-[var(--text-1)] selection:text-[var(--bg)]">
      {/* ─── Header Elements (Always consistent with the mockup) ──────── */}
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
        
        {/* Top Eyebrow */}
        <div className="flex items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--blue)]">
            DRAFTING PHASE &middot; PHASE {step}/3
          </p>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={cn("h-2 w-10 transition-all duration-500", step >= i ? "bg-[var(--blue)] shadow-[0_0_10px_rgba(108,99,255,0.4)]" : "bg-[var(--text-1)]/10")} />
            ))}
          </div>
        </div>

        {/* Massive Title Block */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.9] text-[var(--text-1)] mt-4 max-w-full break-words">
          AGREEMENT<br />BUILDER.
        </h1>

        {/* Subtitle & Back Button Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-12 border-b border-[var(--text-1)] border-opacity-30 gap-8">
          <p className="text-xl md:text-2xl text-[var(--text-2)] font-bold tracking-tight shrink-0">
            Design a binding legal framework for{" "}
            <span className="text-[var(--text-1)] relative inline-block">
              <span className="relative z-10">Immediate Signing</span>
              <span className="absolute bottom-0 left-0 w-full h-4 bg-[var(--secondary)]/40 -z-10 -rotate-2 rounded-sm blur-[1px]"></span>
            </span>.
          </p>

          <button
            onClick={() => step > 1 ? setStep((step - 1) as 1 | 2 | 3) : router.back()}
            className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-1)] hover:text-[var(--blue)] transition-colors no-underline group"
          >
            <ArrowLeft size={16} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
            BACK
          </button>
        </div>

        {/* ─── Step 1: Logic Selection (Matching Mockup) ─────────────────── */}
        {step === 1 && (
          <div className="space-y-16 animate-slide-up pt-4 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-[var(--text-1)] pb-8 relative z-10 gap-6">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-[5rem] font-black uppercase tracking-tighter text-[var(--text-1)] flex items-center gap-6 leading-[0.9]">
                  SELECT STARTING<br className="md:hidden" /> POINT
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl text-[var(--text-2)] font-bold tracking-tight">
                  Choose how you want to start building your agreement.
                </p>
              </div>
              <div className="hidden lg:flex w-20 h-20 border-4 border-[var(--text-1)] bg-[var(--blue)] shadow-[6px_6px_0_0_var(--text-1)] flex-shrink-0 items-center justify-center">
                 <ArrowRight size={40} weight="bold" className="text-[var(--bg)] animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 pt-8 relative z-10">
              {[
                { 
                  id: 'ai', 
                  Icon: Sparkle, 
                  label1: 'DESCRIBE', 
                  label2: 'PLAN', 
                  desc: 'Generate a custom agreement in seconds using AI to map out your requirements.',
                  badge: 'BEST FOR NEW IDEAS',
                  glow: 'bg-[var(--blue)]'
                },
                { 
                  id: 'whatsapp', 
                  Icon: ChatCenteredDots, 
                  label1: 'IMPORT', 
                  label2: 'DRAFT', 
                  desc: 'Turn chat messages or informal conversations into clear, binding legal terms.',
                  badge: 'BETA',
                  glow: 'bg-[#00E6A8]' 
                },
                { 
                  id: 'template', 
                  Icon: FileText, 
                  label1: 'OFFICIAL', 
                  label2: 'TEMPLATES', 
                  desc: 'Use pre-verified, standard agreements from our official library.',
                  badge: null,
                  glow: 'bg-[var(--text-1)]'
                },
              ].map(({ id, Icon, label1, label2, desc, badge, glow }) => (
                <button
                  key={id}
                  onClick={() => {
                    setMethod(id as Method);
                    if (id !== 'template') setStep(2);
                  }}
                  className="group flex flex-col transition-all bg-transparent focus:outline-none relative w-full text-left"
                >
                  {/* Glowing background blob */}
                  <div className={cn("absolute -inset-4 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-700", glow)}></div>
                  
                  {/* Cyber-Brutalist Card */}
                  <div className="relative w-full border-4 border-[var(--text-1)] bg-[var(--card)] p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col gap-8 lg:gap-12 shadow-[8px_8px_0_0_var(--text-1)] hover:-translate-y-3 hover:-translate-x-3 hover:shadow-[20px_20px_0_0_var(--text-1)] transition-all duration-300 min-h-[400px] sm:min-h-[460px] justify-between z-10">
                    
                    {/* Top Row: Icon & Badge */}
                    <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-4">
                      <div className="w-20 h-20 lg:w-24 lg:h-24 shrink-0 bg-[var(--bg)] border-4 border-[var(--text-1)] flex items-center justify-center shadow-[4px_4px_0_0_var(--text-1)] group-hover:bg-[var(--text-1)] group-hover:text-[var(--bg)] transition-colors duration-300">
                        <Icon size={32} className="text-[var(--text-1)] group-hover:text-[var(--bg)] transition-colors lg:w-10 lg:h-10" weight="fill" />
                      </div>
                      
                      {badge && (
                        <div className={cn("text-[var(--bg)] text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2 lg:px-5 lg:py-2.5 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-2 border-[var(--text-1)] animate-pulse shrink-0 text-center", glow === 'bg-[var(--blue)]' ? 'bg-[var(--blue)]' : 'bg-[#00BA95]')}>
                          {badge}
                        </div>
                      )}
                    </div>
                    
                    {/* Bottom Row: Text */}
                    <div className="space-y-4 lg:space-y-5">
                      <h3 className="text-3xl md:text-3xl xl:text-4xl 2xl:text-[2.75rem] font-black uppercase tracking-tighter text-[var(--text-1)] leading-[0.9] group-hover:text-[var(--blue)] transition-colors break-words hyphens-auto">
                        {label1}<br/>{label2}
                      </h3>
                      <p className="text-sm font-bold text-[var(--text-2)] leading-relaxed pr-2 lg:pr-6">
                        {desc}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {method === 'template' && (
              <div className="pt-24 border-t border-[var(--glass-border)] space-y-12 animate-slide-up mt-24">
                <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--text-3)]">Official Templates</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {contractTemplates.map(t => (
                    <button
                      key={t.id}
                      onClick={() => selectTemplate(t)}
                      className="group border-2 border-[var(--text-1)] bg-[var(--color-white)] p-6 lg:p-10 text-left transition-all hover:bg-[var(--bg)] shadow-[4px_4px_0_0_var(--text-1)]"
                    >
                       <h4 className="font-black text-[var(--text-1)] text-xl lg:text-2xl mb-4 uppercase tracking-tighter transition-colors group-hover:text-[var(--blue)] leading-tight">{t.name}</h4>
                      <p className="text-[9px] lg:text-[10px] text-[var(--text-2)] font-black uppercase tracking-[0.15em] mb-6 leading-relaxed line-clamp-3">{t.description}</p>
                      {t.popular && <span className="bg-[var(--text-1)] text-[var(--bg)] text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5">POPULAR</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 2 & 3: Remaining brutalist styles ────────────────────── */}
        {/* Due to brevity, applying exact brutalist UI to forms as well! F5F5F7 background, black borders. */}
        {step === 2 && (
          <div className="grid lg:grid-cols-3 gap-16 animate-slide-up">
            <div className="lg:col-span-2 space-y-16">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[var(--text-1)]">
                {method === 'ai' ? 'DESCRIBE YOUR TERMS.' :
                  method === 'whatsapp' ? 'IMPORT MESSAGES.' :
                    `TEMPLATE: ${selectedTemplate?.name}`}
              </h2>

              {(method === 'ai' || method === 'whatsapp') && (
                <div className="grid md:grid-cols-3 gap-8 bg-[var(--color-white)] border-4 border-[var(--text-1)] p-8 shadow-[8px_8px_0_0_var(--text-1)]">
                  {[
                    { id: 'party1_name', label: 'Primary Party', icon: <IdentificationCard size={18} weight="bold" /> },
                    { id: 'party2_name', label: 'Other Party', icon: <IdentificationCard size={18} weight="bold" /> },
                    { id: 'jurisdiction', label: 'Jurisdiction', icon: <MagnifyingGlass size={18} weight="bold" /> }
                  ].map((f) => (
                    <div key={f.id} className="space-y-4">
                      <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--text-2)] flex items-center gap-2">
                        {f.icon} {f.label}
                      </label>
                      <input
                        className="w-full h-14 bg-[var(--bg)] border-2 border-[var(--text-1)] px-4 text-sm font-black uppercase tracking-tight focus:outline-none focus:bg-[var(--color-white)] focus:shadow-[2px_2px_0_0_var(--text-1)] transition-all"
                        placeholder="REQUIRED"
                        value={formData[f.id] || ''}
                        onChange={e => set(f.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-[var(--color-white)] border-4 border-[var(--text-1)] p-10 shadow-[8px_8px_0_0_var(--text-1)] space-y-12">
                {method === 'ai' && (
                  <div className="space-y-6">
                    <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--text-2)]">Explain what you need (Plain English)</label>
                    <textarea
                      className="w-full bg-[var(--bg)] border-2 border-[var(--text-1)] p-8 text-lg font-bold focus:outline-none focus:bg-[var(--color-white)] focus:shadow-[4px_4px_0_0_var(--text-1)] transition-all min-h-[350px] custom-scrollbar text-[var(--text-1)]"
                      placeholder="E.g., I'm lending $4,000 to James. Monthly payments of $500 starting next month..."
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                    />
                  </div>
                )}

                {method === 'whatsapp' && (
                  <div className="space-y-6">
                    <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--text-2)]">Paste Conversation</label>
                    <textarea
                      className="w-full bg-[var(--bg)] border-2 border-[var(--text-1)] p-8 text-sm font-bold focus:outline-none focus:bg-[var(--color-white)] focus:shadow-[4px_4px_0_0_var(--text-1)] transition-all min-h-[350px] custom-scrollbar text-[var(--text-1)]"
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
                        <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--text-2)] flex items-center gap-2">
                          {field.label} {field.required && <span className="text-[var(--blue)] font-black">*</span>}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea className="w-full bg-[var(--bg)] border-2 border-[var(--text-1)] p-6 text-sm font-black focus:outline-none focus:bg-[var(--color-white)] transition-all focus:shadow-[2px_2px_0_0_var(--text-1)]" rows={4} placeholder={field.placeholder} value={formData[field.id] || ''} onChange={e => set(field.id, e.target.value)} />
                        ) : field.type === 'select' ? (
                          <select className="w-full h-14 bg-[var(--bg)] border-2 border-[var(--text-1)] px-6 text-sm font-black uppercase appearance-none cursor-pointer focus:bg-[var(--color-white)] transition-all focus:shadow-[2px_2px_0_0_var(--text-1)]" value={formData[field.id] || ''} onChange={e => set(field.id, e.target.value)}>
                            <option value="">SELECT OPTION...</option>
                            {field.options?.map((o: string) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input type={field.type === 'currency' ? 'number' : field.type} className="w-full h-14 bg-[var(--bg)] border-2 border-[var(--text-1)] px-6 text-sm font-black focus:outline-none focus:bg-[var(--color-white)] transition-all focus:shadow-[2px_2px_0_0_var(--text-1)]" placeholder={field.placeholder} value={formData[field.id] || ''} onChange={e => set(field.id, e.target.value)} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-2 border-red-500 p-6 flex gap-4 items-center">
                    <WarningCircle size={24} weight="bold" className="text-red-600" />
                    <span className="text-xs font-black uppercase tracking-widest text-red-600">{error}</span>
                  </div>
                )}

                <button
                  disabled={loading || (method === 'ai' ? !aiPrompt.trim() : method === 'whatsapp' ? !conversation.trim() : false)}
                  onClick={method === 'ai' ? generateAI : method === 'whatsapp' ? parseConversation : () => setStep(3)}
                  className="w-full h-20 bg-[var(--blue)] text-[var(--bg)] text-[13px] font-black uppercase tracking-[0.3em] shadow-[4px_4px_0_0_var(--text-1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_var(--text-1)] transition-all disabled:opacity-50 flex items-center justify-center border-4 border-[var(--text-1)]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-4">
                      <CircleNotch size={24} className="animate-spin text-[var(--bg)]" />
                      <span>{loadingStep === 1 ? 'ANALYZING TERMS...' : loadingStep === 2 ? 'WRITING AGREEMENT...' : 'FINALIZING DETAILS...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Sparkle size={24} weight="fill" className="mr-3" />
                      {method === 'ai' ? 'Generate Agreement' : method === 'whatsapp' ? 'Create From Chat' : 'Review Agreement'}
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Side Feedback */}
            <div className="space-y-12">
              <div className="bg-[var(--color-white)] border-4 border-[var(--text-1)] p-10 space-y-10 shadow-[4px_4px_0_0_var(--text-1)]">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-1)]">How it works</h3>
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
                    <div key={i} className="flex gap-6 group items-center">
                      <div className="w-10 h-10 border-2 border-[var(--text-1)] flex items-center justify-center text-[12px] font-black transition-colors group-hover:bg-[var(--blue)] group-hover:text-[var(--bg)] group-hover:border-[var(--blue)]">
                        {i + 1}
                      </div>
                      <span className="text-xs font-black uppercase tracking-tight text-[var(--text-2)] group-hover:text-[var(--text-1)] leading-none">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 3: Refinement Phase ─────────────────────────────────── */}
        {step === 3 && (
          <div className="grid lg:grid-cols-3 gap-16 animate-slide-up">

            {/* Logic Control Panel */}
            <div className="space-y-12 lg:col-span-1">
              <div className="flex items-center justify-between pb-6 border-b-4 border-[var(--text-1)]">
                <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-[var(--text-1)]">Agreement Sections ({clauses.length})</h3>
                <button onClick={addClause} className="w-10 h-10 border-2 border-[var(--text-1)] flex items-center justify-center hover:bg-[var(--text-1)] hover:text-[var(--bg)] transition-all shadow-[2px_2px_0_0_var(--text-1)]">
                  <Plus size={20} weight="bold" />
                </button>
              </div>

              <div className="space-y-8">
                {aiMeta?.summary && (
                  <div className="bg-[var(--blue)] text-[var(--bg)] border-4 border-[var(--text-1)] p-8 shadow-[4px_4px_0_0_var(--text-1)]">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--bg)]/80 mb-4 border-b-2 border-[var(--bg)]/20 pb-3">Logic Summary</div>
                    <p className="text-sm font-bold leading-relaxed m-0 uppercase tracking-tight">{aiMeta.summary}</p>
                  </div>
                )}

                {clauses.map((clause: ContractClause, i: number) => (
                  <div key={clause.id} className="bg-[var(--color-white)] p-8 border-4 border-[var(--text-1)] space-y-6 shadow-[4px_4px_0_0_var(--text-1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--text-1)] transition-all">
                    <div className="flex items-center gap-6 border-b-2 border-gray-100 pb-4">
                      <span className="text-[12px] font-black text-[var(--text-2)]">FRAG_{i + 1}</span>
                      <input
                        className="flex-1 text-sm font-black uppercase bg-transparent border-none outline-none text-[var(--text-1)] w-full"
                        value={clause.title}
                        onChange={e => updateClause(clause.id, 'title', e.target.value)}
                      />
                      <button onClick={() => removeClause(clause.id)} className="text-red-600 hover:scale-110 transition-transform"><Trash size={22} weight="bold" /></button>
                    </div>
                    <textarea
                      className="w-full text-xs font-bold text-[var(--text-2)] bg-[var(--bg)] p-4 border-2 border-[var(--text-1)] outline-none resize-none leading-relaxed min-h-[120px]"
                      value={clause.content}
                      onChange={e => updateClause(clause.id, 'content', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Instrument Preview */}
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-[var(--color-white)] border-4 border-[var(--text-1)] p-12 md:p-24 shadow-[8px_8px_0_0_var(--text-1)] min-h-[1100px]">

                <div className="space-y-24">
                  <div className="border-b-4 border-[var(--text-1)] pb-12 flex flex-col justify-between items-start gap-8">
                    <div className="space-y-6 w-full">
                      <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--blue)]">
                          Formal Agreement
                      </div>
                      <textarea
                        className="text-3xl md:text-5xl lg:text-6xl font-black text-[var(--text-1)] bg-transparent border-none outline-none w-full uppercase tracking-tighter leading-none resize-none overflow-hidden"
                        rows={3}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-20">
                    {clauses.map((clause: ContractClause, i: number) => (
                      <div key={clause.id} className="space-y-6">
                        <h4 className="text-2xl md:text-3xl font-black text-[var(--text-1)] flex items-start gap-6 uppercase tracking-tighter">
                          <span className="text-sm font-black text-[var(--blue)] pt-2">0{i + 1}</span>
                          {clause.title}
                        </h4>
                        <p className="text-lg md:text-xl font-bold text-[var(--text-2)] leading-relaxed border-l-4 border-[var(--text-1)] pl-8 ml-10">
                          {clause.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  {formData.jurisdiction && (
                    <div className="pt-24 border-t-4 border-[var(--text-1)]">
                      <div className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--text-3)] mb-6">Jurisdiction Shell</div>
                      <p className="text-2xl font-black uppercase text-[var(--text-1)] leading-tight tracking-tighter">Governed by: {formData.jurisdiction}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Global Actions */}
              <div className="flex flex-col md:flex-row gap-8">
                <button
                  className="flex-1 py-8 bg-[var(--color-white)] text-[var(--text-1)] text-[14px] font-black uppercase tracking-[0.2em] border-4 border-[var(--text-1)] shadow-[6px_6px_0_0_var(--text-1)] flex items-center justify-center hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_var(--text-1)] transition-all"
                  onClick={() => { save('draft'); toast({ title: 'Draft saved' }); }}
                >
                  <FloppyDisk size={24} weight="bold" className="mr-4" />
                  Save Draft
                </button>
                <button
                  className="flex-1 py-8 bg-[var(--blue)] text-[var(--bg)] text-[14px] font-black uppercase tracking-[0.2em] border-4 border-[var(--text-1)] shadow-[6px_6px_0_0_var(--text-1)] flex items-center justify-center hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_var(--text-1)] transition-all"
                  onClick={() => { save('pending_signature'); toast({ title: 'Agreement Created' }); }}
                >
                  <PaperPlaneTilt size={24} weight="bold" className="mr-4" />
                  Sign Protocol
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewContractPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[var(--text-1)] bg-[var(--bg)] min-h-screen">Loading Agreement Builder...</div>}>
      <NewContractContent />
    </Suspense>
  );
}
