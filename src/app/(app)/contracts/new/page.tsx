'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { contractTemplates } from '@/data/templates';
import { useContracts } from '@/store/contracts';
import { ContractTemplate, ContractClause } from '@/lib/types';
import { v4 as uuid } from 'uuid';
import {
  ArrowLeft, Sparkles, FileText, MessageSquare,
  Plus, Trash2, ChevronUp, ChevronDown, Save, Send,
  Loader2, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { toast } from '@/hooks/use-toast';

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
    <div style={{ padding: '28px 40px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/contracts">Contracts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Agreement</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header + Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => step > 1 ? setStep((step - 1) as 1 | 2 | 3) : router.back()}
          aria-label="Go back"
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-1)' }}>Create Agreement</div>
        </div>
        <div style={{ marginLeft: 'auto', flex: 1, maxWidth: 420 }}>
          <Stepper
            steps={[
              { label: 'Method' },
              { label: 'Details' },
              { label: 'Review' },
            ]}
            currentStep={step - 1}
          />
        </div>
      </div>

      {/* ─── Step 1 ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="fade-in">
          <div style={{ marginBottom: 24 }}>
            <div className="heading-1" style={{ marginBottom: 6 }}>How do you want to create your agreement?</div>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>AI handles the legal structure — you just provide the context.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { id: 'ai', Icon: Sparkles, label: 'Describe with AI', sub: 'Tell us the deal in plain language. AI generates the full contract, jurisdiction-aware.', badge: 'Recommended' },
              { id: 'whatsapp', Icon: MessageSquare, label: 'Import Conversation', sub: 'Paste WhatsApp, SMS, or any chat. AI extracts terms and formalizes them.', badge: null },
              { id: 'template', Icon: FileText, label: 'Use a Template', sub: 'Choose from 20+ pre-built templates for loans, sales, freelance, rentals, and more.', badge: null },
            ].map(({ id, Icon, label, sub, badge }) => (
              <button
                key={id}
                onClick={() => {
                  setMethod(id as Method);
                  if (id !== 'template') setStep(2);
                }}
                style={{
                  background: method === id ? 'var(--blue-subtle)' : 'var(--surface)',
                  border: `1.5px solid ${method === id ? 'var(--blue)' : 'var(--border)'}`,
                  borderRadius: 12,
                  padding: '20px 20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                  position: 'relative',
                }}
              >
                {badge && (
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <Badge variant="info" className="text-[10px]">{badge}</Badge>
                  </div>
                )}
                <div style={{ width: 38, height: 38, background: method === id ? 'var(--blue)' : 'var(--surface-2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={18} style={{ color: method === id ? '#fff' : 'var(--blue)' }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{sub}</div>
              </button>
            ))}
          </div>

          {method === 'template' && (
            <div className="slide-up">
              <div style={{ marginBottom: 14, fontWeight: 600, fontSize: 13 }}>Choose a template</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {contractTemplates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => selectTemplate(t)}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      padding: '16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 10 }}>{t.icon}</div>
                    <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.4 }}>{t.description.slice(0, 70)}…</div>
                    {t.popular && <Badge variant="success" className="mt-2 text-[10px]">Popular</Badge>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Step 2 ─────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          <div>
            {/* Common party fields */}
            <div style={{ marginBottom: 20 }}>
              <div className="heading-1" style={{ marginBottom: 16 }}>
                {method === 'ai' ? 'Describe your agreement' :
                  method === 'whatsapp' ? 'Paste your conversation' :
                    `${selectedTemplate?.icon} ${selectedTemplate?.name}`}
              </div>

              {(method === 'ai' || method === 'whatsapp') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                  {['party1_name', 'party2_name', 'jurisdiction'].map((fid, i) => (
                    <div key={fid}>
                      <label className="field-label">{i === 0 ? 'Your name' : i === 1 ? "Other party's name" : 'Jurisdiction (city, country)'}</label>
                      <input className="field" placeholder={i === 0 ? 'e.g., Sarah Jenkins' : i === 1 ? 'e.g., James Miller' : 'e.g., London, UK'} value={formData[fid] || ''} onChange={e => set(fid, e.target.value)} />
                    </div>
                  ))}
                </div>
              )}

              {method === 'ai' && (
                <>
                  <label className="field-label">Describe the deal in plain language</label>
                  <textarea
                    className="field"
                    rows={7}
                    placeholder={"E.g., I'm lending my cousin James $4,000 for his business. He'll pay me back $500 per month for 8 months starting March 2026, with no interest. We're both in London, UK. If he misses 2 payments the full amount is due immediately."}
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                </>
              )}

              {method === 'whatsapp' && (
                <>
                  <label className="field-label">Paste your conversation (WhatsApp, SMS, email, etc.)</label>
                  <textarea
                    className="field"
                    rows={10}
                    placeholder={"Paste conversation here...\n\nExample:\nJohn: Hey can I borrow $2000?\nYou: Sure when can you pay back?\nJohn: I'll pay $400/month for 5 months\nYou: Deal, starting February?\nJohn: Yes, February 1st works perfect"}
                    value={conversation}
                    onChange={e => setConversation(e.target.value)}
                    style={{ fontFamily: 'monospace', fontSize: 12, marginBottom: 16 }}
                  />
                </>
              )}

              {method === 'template' && selectedTemplate && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {selectedTemplate.fields.map(field => (
                    <div key={field.id}>
                      <label className="field-label">
                        {field.label}
                        {field.required && <span style={{ color: 'var(--red)', marginLeft: 3 }}>*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea className="field" rows={3} placeholder={field.placeholder} value={formData[field.id] || ''} onChange={e => set(field.id, e.target.value)} />
                      ) : field.type === 'select' ? (
                        <select className="field" value={formData[field.id] || ''} onChange={e => set(field.id, e.target.value)}>
                          <option value="">Select…</option>
                          {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={field.type === 'currency' ? 'number' : field.type} className="field" placeholder={field.placeholder} value={formData[field.id] || ''} onChange={e => set(field.id, e.target.value)} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--red-subtle)', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginTop: 12 }}>
                  <AlertCircle size={14} style={{ color: 'var(--red)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--red)' }}>{error}</span>
                </div>
              )}

              <Button
                variant="premium"
                className="w-full mt-4"
                disabled={loading || (method === 'ai' ? !aiPrompt.trim() : method === 'whatsapp' ? !conversation.trim() : false)}
                onClick={method === 'ai' ? generateAI : method === 'whatsapp' ? parseConversation : () => setStep(3)}
              >
                {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</> :
                  method === 'ai' ? <><Sparkles size={14} /> Generate Contract</> :
                    method === 'whatsapp' ? <><Sparkles size={14} /> Extract & Generate</> :
                      'Preview Contract →'}
              </Button>
            </div>
          </div>

          {/* Side info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card-flat" style={{ padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>How it works</div>
              {(method === 'ai' ? [
                'Gemini AI reads your description',
                'Generates jurisdiction-aware clauses',
                'You review, edit, and customize',
                'Both parties sign digitally',
              ] : method === 'whatsapp' ? [
                'AI reads your conversation',
                'Extracts all agreed terms',
                'Fills in legal gaps automatically',
                'You confirm and both parties sign',
              ] : [
                'Fill in the required fields',
                'Preview the full contract',
                'Customize any clause you need',
                'Send for signatures',
              ]).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 20, height: 20, background: 'var(--blue-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, fontWeight: 700, color: 'var(--blue)' }}>{i + 1}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4, paddingTop: 2 }}>{step}</div>
                </div>
              ))}
            </div>

            <div className="card-flat" style={{ padding: 16, background: 'var(--blue-subtle)', border: '1px solid rgba(20,71,230,0.15)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Legal tip</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.5 }}>
                {method === 'whatsapp'
                  ? 'Chat-based agreements can be legally binding in many jurisdictions when offer, acceptance, and consideration are clearly present.'
                  : 'Contracts don\'t need to be on official paper. A signed agreement on AgreeMint carries the same legal weight as a traditional contract in most jurisdictions.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 3 ─────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>

          {/* Clause editor */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Clauses ({clauses.length})</div>
              <Button variant="ghost" size="sm" onClick={addClause}>
                <Plus size={12} /> Add
              </Button>
            </div>

            {aiMeta?.summary && (
              <div style={{ background: 'var(--blue-subtle)', border: '1px solid rgba(20,71,230,0.15)', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>AI Summary</div>
                <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.4 }}>{aiMeta.summary}</div>
              </div>
            )}

            {parsedInfo?.confidence && (
              <div style={{ marginBottom: 10 }}>
                <Badge variant={parsedInfo.confidence === 'high' ? 'success' : parsedInfo.confidence === 'medium' ? 'warning' : 'danger'}>
                  {parsedInfo.confidence} confidence parse
                </Badge>
              </div>
            )}

            {parsedInfo?.missingInfo && parsedInfo.missingInfo.length > 0 && (
              <div style={{ background: 'var(--amber-subtle)', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Clarify these terms</div>
                {parsedInfo.missingInfo.map((m, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 3 }}>· {m}</div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {clauses.map((clause, i) => (
                <div key={clause.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', width: 16, flexShrink: 0 }}>{i + 1}.</div>
                    <input
                      style={{ flex: 1, fontSize: 12, fontWeight: 500, color: 'var(--text-1)', background: 'transparent', border: 'none', outline: 'none' }}
                      value={clause.title}
                      onChange={e => updateClause(clause.id, 'title', e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: 2 }}>
                      <button onClick={() => moveClause(i, 'up')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-3)' }} disabled={i === 0} aria-label="Move clause up"><ChevronUp size={11} /></button>
                      <button onClick={() => moveClause(i, 'down')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-3)' }} disabled={i === clauses.length - 1} aria-label="Move clause down"><ChevronDown size={11} /></button>
                      <button onClick={() => removeClause(clause.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--red)' }} aria-label="Delete clause"><Trash2 size={11} /></button>
                    </div>
                  </div>
                  <textarea
                    style={{ width: '100%', fontSize: 11, color: 'var(--text-2)', background: 'transparent', border: 'none', outline: 'none', resize: 'none', lineHeight: 1.4 }}
                    value={clause.content}
                    onChange={e => updateClause(clause.id, 'content', e.target.value)}
                    rows={3}
                  />
                </div>
              ))}
            </div>

            {aiMeta?.legalWarnings && aiMeta.legalWarnings.length > 0 && (
              <div style={{ marginTop: 12, background: 'var(--red-subtle)', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Legal notices</div>
                {aiMeta.legalWarnings.map((w, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 3 }}>· {w}</div>
                ))}
              </div>
            )}
          </div>

          {/* Document preview */}
          <div>
            <div className="card-flat" style={{ padding: '36px 44px', fontFamily: 'Georgia, serif' }}>
              {/* Title editable */}
              <div style={{ borderBottom: '2px solid var(--text-1)', paddingBottom: 12, marginBottom: 24 }}>
                <input
                  style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-1)', background: 'transparent', border: 'none', outline: 'none', width: '100%', letterSpacing: '-0.01em' }}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 6, fontFamily: 'Inter, sans-serif' }}>
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              {/* Parties */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, background: 'var(--bg)', borderRadius: 8, padding: '14px 16px', marginBottom: 24, fontFamily: 'Inter, sans-serif' }}>
                {[{ role: 'Party A (Creator)', name: p1 }, { role: 'Party B (Counterparty)', name: p2 }].map(p => (
                  <div key={p.role}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{p.role}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)' }}>{p.name}</div>
                  </div>
                ))}
              </div>

              {/* Clauses */}
              <div style={{ marginBottom: 28 }}>
                {clauses.map((clause, i) => (
                  <div key={clause.id} style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>
                      {i + 1}. {clause.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#3A3530', lineHeight: 1.75 }}>{clause.content}</div>
                  </div>
                ))}
              </div>

              {/* Governing law */}
              {formData.jurisdiction && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 24, fontFamily: 'Inter, sans-serif' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Governing Law</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)' }}>This agreement is governed by the laws of {formData.jurisdiction}.</div>
                </div>
              )}

              {/* Signatures */}
              <div style={{ borderTop: '2px solid var(--text-1)', paddingTop: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>Signatures</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                  {[p1, p2].map((name, i) => (
                    <div key={i}>
                      <div style={{ height: 48, borderBottom: '1px solid var(--border-strong)', marginBottom: 8 }} />
                      <div style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'Inter, sans-serif' }}>{name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}>Date: ___________</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Button variant="outline" className="flex-1 justify-center" onClick={() => { save('draft'); toast({ title: 'Draft saved', description: 'Your agreement has been saved as a draft.' }); }}>
                <Save size={14} /> Save Draft
              </Button>
              <Button variant="premium" className="flex-1 justify-center" onClick={() => { save('pending_signature'); toast({ title: 'Agreement sent', description: 'Your agreement has been sent for signature.', variant: 'success' }); }}>
                <Send size={14} /> Send for Signature
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
