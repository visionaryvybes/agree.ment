'use client';

import { useParams, useRouter } from 'next/navigation';
import { useContracts, useProtocolActions } from '@/store/contracts';
import {
  ArrowLeft, ArrowRight, Sparkle, ShieldCheck, FileText, Warning,
} from "@phosphor-icons/react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { v4 as uuid } from 'uuid';
import { templateIcon, TemplateDocument } from '@/components/TemplateArt';

export default function TemplateDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addContract } = useProtocolActions();
  const templates = useContracts(s => s.templates);
  const template = templates.find((t: any) => t.id === id);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    if (template?.fields) {
      const defaults: Record<string, string> = {};
      template.fields.forEach((f: any) => {
        if (f.defaultValue) defaults[f.id] = f.defaultValue;
      });
      setFields(defaults);
    }
  }, [template]);

  if (!mounted) return <div className="min-h-screen bg-ground" />;

  if (!template) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <Warning size={48} className="text-ink/20" />
      <p className="text-sm font-black text-ink/20 uppercase tracking-widest">Template not found</p>
      <Link href="/templates" className="px-6 py-3 rounded-[3px] bg-ink/[0.03] border border-line text-[11px] font-black text-ink uppercase tracking-widest hover:border-emerald/30 transition-colors">
        Back to Library
      </Link>
    </div>
  );

  const handleUseTemplate = async () => {
    setLoading(true);
    setError('');

    try {
      const partyA = fields['party_a'] || fields['party1_name'] || fields['seller_name'] || 'Party A';
      const partyB = fields['party_b'] || fields['party2_name'] || fields['buyer_name'] || 'Party B';
      const location = fields['location'] || fields['governing_law'] || 'General';

      // Build the prompt from template fields
      const promptParts = Object.entries(fields)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
        .join(', ');

      const res = await fetch('/api/system/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${template.name}. ${promptParts || template.description}`,
          party1: partyA,
          party2: partyB,
          jurisdiction: location,
          category: template.category,
        }),
      });

      let clauses: any[] = template.clauses?.map((c: any) => ({
        ...c,
        id: c.id || uuid(),
      })) || [];

      if (res.ok) {
        const data = await res.json();
        if (data.contract?.clauses?.length > 0) {
          clauses = data.contract.clauses.map((c: any) => ({
            id: uuid(),
            title: c.title,
            content: c.content,
            isRequired: c.isRequired ?? true,
            legalBasis: c.legalBasis,
          }));
        }
      }

      const newContract: any = {
        title: template.name,
        category: (template.category as any) || 'custom',
        description: template.description,
        parties: [
          { id: uuid(), name: partyA, email: '', role: 'creator' as const },
          { id: uuid(), name: partyB, email: '', role: 'counterparty' as const },
        ],
        totalAmount: Number(fields['amount'] || fields['loan_amount'] || fields['sale_price'] || 0),
        currency: 'USD',
        clauses,
        paymentSchedule: [],
        escalation: [],
        jurisdiction: location,
        governingLaw: location ? `Laws of ${location}` : 'General Contract Law',
        status: 'pending_signature' as const,
        metadata: { templateId: template.id },
      };

      const contractId = addContract(newContract);
      router.push(`/contracts/${contractId}`);
    } catch (err) {
      console.error('Template use error:', err);
      setError('Failed to create agreement. Please try again.');
      setLoading(false);
    }
  };

  const fieldValue = (id: string) => fields[id] || '';
  const setField = (id: string, val: string) => setFields(prev => ({ ...prev, [id]: val }));

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 relative">
      <div className="vibrant-glow top-0 left-1/4 w-[400px] h-[400px] bg-emerald/8 animate-glow-pulse" />

      {/* Header */}
      <header className="mb-8 flex items-center gap-4 pt-6 relative z-10">
        <Link href="/templates" className="w-10 h-10 border-[1.5px] border-line-strong bg-card flex items-center justify-center text-ink-2 shadow-[var(--shadow-sheet)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] hover:text-ink active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-[transform,box-shadow,color] duration-150">
          <ArrowLeft size={18} weight="bold" />
        </Link>
        <div>
          <span className="text-[10px] font-black text-emerald uppercase tracking-[0.4em]">Template</span>
          <h1 className="text-xl font-semibold text-ink tracking-tight ">{template.name}</h1>
        </div>
      </header>

      <div className="space-y-6 relative z-10">
        {/* Template Info */}
        <div className="p-5 bg-card border-[1.5px] border-line-strong shadow-[var(--shadow-sheet)] flex items-start gap-4">
          {(() => {
            const TIcon = templateIcon(template);
            return (
              <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center border-[1.5px] border-line-strong bg-wash rotate-[-2deg]">
                <TIcon size={22} weight="duotone" className="text-mint" />
              </div>
            );
          })()}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[8px] font-black text-ink/25 uppercase tracking-widest px-2 py-0.5 rounded-full bg-ink/[0.04] border border-line">
                {template.category}
              </span>
              {template.popular && (
                <span className="text-[8px] font-black text-emerald uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald/10 border border-emerald/20">
                  Popular
                </span>
              )}
            </div>
            <p className="text-sm text-ink/50 leading-relaxed">{template.description}</p>
          </div>
        </div>

        {/* The document itself — full form, exactly as it will read */}
        <section>
          <div className="flex items-baseline justify-between pb-2">
            <p className="text-[10px] font-black text-ink/30 uppercase tracking-[0.4em]">The document</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-3">
              Your details drop into the blanks below
            </p>
          </div>
          <div className="bg-wash border-[1.5px] border-line-strong p-4 sm:p-8 flex justify-center overflow-x-auto">
            <TemplateDocument
              t={template}
              className="max-w-full shadow-[var(--shadow-lift)] !w-[600px] shrink-0"
            />
          </div>
        </section>

        {/* Fields */}
        {template.fields && template.fields.length > 0 && (
          <div className="space-y-4">
            <p className="text-[10px] font-black text-ink/30 uppercase tracking-[0.4em]">Fill in Details</p>
            {template.fields.map((field: any) => (
              <div key={field.id} className="space-y-1.5">
                <label className="text-[10px] font-black text-ink/40 uppercase tracking-widest flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-rose">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    placeholder={field.placeholder}
                    value={fieldValue(field.id)}
                    onChange={e => setField(field.id, e.target.value)}
                    className="w-full bg-card border-[1.5px] border-line py-3 px-4 text-sm text-ink placeholder:text-ink-3/60 focus:outline-none focus:border-mint transition-colors resize-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={fieldValue(field.id)}
                    onChange={e => setField(field.id, e.target.value)}
                    className="w-full bg-card border-[1.5px] border-line py-3 px-4 text-sm text-ink focus:outline-none focus:border-mint transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    value={fieldValue(field.id)}
                    onChange={e => setField(field.id, e.target.value)}
                    className="w-full bg-card border-[1.5px] border-line py-3 px-4 text-sm text-ink placeholder:text-ink-3/60 focus:outline-none focus:border-mint transition-colors"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Clauses preview */}
        {template.clauses && template.clauses.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-ink/30 uppercase tracking-[0.4em]">Included Clauses</p>
            <div className="border-[1.5px] border-line-strong bg-card shadow-[var(--shadow-sheet)]">
              {template.clauses.map((clause: any, i: number) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-dashed border-line last:border-b-0">
                  <span className="font-mono text-[11px] font-bold text-mint">§{i + 1}</span>
                  <span className="text-sm font-bold uppercase tracking-wide text-ink">{clause.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="text-rose text-[11px] font-black uppercase tracking-widest text-center">{error}</p>
        )}

        {/* CTA */}
        <div className="pt-4">
          <button
            onClick={handleUseTemplate}
            disabled={loading}
            className="btn-vibrant btn-vibrant-emerald w-full !py-4 !text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                Creating your agreement…
              </>
            ) : (
              <>
                <Sparkle size={17} weight="bold" />
                Use this template
                <ArrowRight size={17} weight="bold" />
              </>
            )}
          </button>
          <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-ink-3 mt-3">
            Your details drop into the blanks · full clauses drafted for you
          </p>
        </div>
      </div>
    </div>
  );
}
