'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { contractTemplates } from '@/data/templates';
import { useContracts } from '@/store/contracts';
import { ContractTemplate, ContractClause } from '@/lib/types';
import { v4 as uuid } from 'uuid';
import { Sparkles, FileText, GripVertical, Plus, Trash2, ChevronDown, ChevronUp, Send, Download, Save, ArrowLeft, MessageSquare, Upload } from 'lucide-react';

type CreationMethod = 'template' | 'ai' | 'whatsapp' | null;

export default function NewContractPage() {
  const router = useRouter();
  const { addContract } = useContracts();
  const [method, setMethod] = useState<CreationMethod>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [aiPrompt, setAiPrompt] = useState('');
  const [whatsappText, setWhatsappText] = useState('');
  const [clauses, setClauses] = useState<ContractClause[]>([]);
  const [contractTitle, setContractTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);

  const handleSelectTemplate = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    setClauses(template.clauses.map(c => ({ ...c, id: uuid() })));
    setContractTitle(template.name);
    setStep(2);
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    const generatedClauses: ContractClause[] = [
      { id: uuid(), title: 'Agreement Overview', content: `This agreement is based on the following arrangement: ${aiPrompt}`, isRequired: true },
      { id: uuid(), title: 'Terms and Conditions', content: 'Both parties agree to the terms set forth in this agreement, including all schedules and appendices.', isRequired: true },
      { id: uuid(), title: 'Payment Terms', content: 'Payment shall be made according to the schedule agreed upon by both parties.', isRequired: true },
      { id: uuid(), title: 'Default and Remedies', content: 'In the event of default, the non-defaulting party shall have the right to pursue all available legal remedies.', isRequired: true },
      { id: uuid(), title: 'Governing Law', content: 'This agreement shall be governed by the laws of the jurisdiction specified by the parties.', isRequired: true },
      { id: uuid(), title: 'Dispute Resolution', content: 'Any disputes shall first be resolved through mediation, then arbitration if mediation fails.', isRequired: true },
      { id: uuid(), title: 'Entire Agreement', content: 'This document constitutes the entire agreement between the parties and supersedes all prior discussions.', isRequired: true },
    ];
    setClauses(generatedClauses);
    setContractTitle('AI-Generated Agreement');
    setIsGenerating(false);
    setStep(3);
  };

  const handleWhatsAppParse = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    const parsedClauses: ContractClause[] = [
      { id: uuid(), title: 'Extracted Agreement Terms', content: `Based on the conversation provided, the following terms were identified: ${whatsappText.slice(0, 200)}...`, isRequired: true },
      { id: uuid(), title: 'Parties', content: 'The parties to this agreement are as identified in the original conversation.', isRequired: true },
      { id: uuid(), title: 'Agreed Terms', content: 'The specific terms, amounts, and conditions discussed are hereby formalized.', isRequired: true },
      { id: uuid(), title: 'Payment Schedule', content: 'Payment shall follow the schedule discussed and agreed upon in the original conversation.', isRequired: true },
      { id: uuid(), title: 'Acknowledgment', content: 'Both parties acknowledge that this written agreement formalizes the terms previously agreed upon via messaging.', isRequired: true },
    ];
    setClauses(parsedClauses);
    setContractTitle('Agreement (from WhatsApp)');
    setIsGenerating(false);
    setStep(3);
  };

  const updateClause = (id: string, field: 'title' | 'content', value: string) => {
    setClauses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeClause = (id: string) => {
    setClauses(prev => prev.filter(c => c.id !== id));
  };

  const addClause = () => {
    setClauses(prev => [...prev, { id: uuid(), title: 'New Clause', content: 'Enter clause content here...', isRequired: false }]);
  };

  const moveClause = (index: number, direction: 'up' | 'down') => {
    const newClauses = [...clauses];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newClauses.length) return;
    [newClauses[index], newClauses[newIndex]] = [newClauses[newIndex], newClauses[index]];
    setClauses(newClauses);
  };

  const handleSave = (status: 'draft' | 'pending_signature') => {
    const id = addContract({
      title: contractTitle || 'Untitled Agreement',
      category: selectedTemplate?.category || 'custom',
      description: aiPrompt || whatsappText || `Created from ${selectedTemplate?.name || 'custom'} template`,
      status,
      parties: [
        { id: uuid(), name: formData.lender_name || formData.seller_name || formData.client_name || formData.owner_name || formData.party1_name || 'Party A', email: '', role: 'creator', signedAt: new Date() },
        { id: uuid(), name: formData.borrower_name || formData.buyer_name || formData.provider_name || formData.renter_name || formData.party2_name || 'Party B', email: '', role: 'counterparty' },
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => step > 1 ? setStep(step - 1) : router.back()} className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Agreement</h1>
          <p className="text-slate-500 text-sm">Step {step} of 3</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-teal-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      {/* Step 1: Choose Method */}
      {step === 1 && (
        <div className="fade-in">
          <h2 className="text-xl font-semibold mb-6">How would you like to create your agreement?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button onClick={() => setMethod('template')} className={`card p-6 text-left hover:border-teal-300 ${method === 'template' ? 'border-teal-500 ring-2 ring-teal-100' : ''}`}>
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Use a Template</h3>
              <p className="text-sm text-slate-500">Choose from pre-built templates for loans, sales, services, rentals, NDAs, and more.</p>
            </button>
            <button onClick={() => { setMethod('ai'); setStep(2); }} className={`card p-6 text-left hover:border-purple-300 ${method === 'ai' ? 'border-purple-500 ring-2 ring-purple-100' : ''}`}>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Describe with AI</h3>
              <p className="text-sm text-slate-500">Tell AI your situation in plain language and get a custom, legally-informed agreement.</p>
            </button>
            <button onClick={() => { setMethod('whatsapp'); setStep(2); }} className={`card p-6 text-left hover:border-green-300 ${method === 'whatsapp' ? 'border-green-500 ring-2 ring-green-100' : ''}`}>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Import from WhatsApp</h3>
              <p className="text-sm text-slate-500">Paste your conversation and AI will extract terms into a formal agreement.</p>
            </button>
          </div>

          {method === 'template' && (
            <div className="fade-in">
              <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractTemplates.map(template => (
                  <button key={template.id} onClick={() => handleSelectTemplate(template)} className="card p-5 text-left hover:border-teal-300 group">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{template.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 text-sm">{template.name}</h4>
                          {template.popular && <span className="badge badge-primary text-xs">Popular</span>}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Fill Details */}
      {step === 2 && (
        <div className="fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {method === 'template' && selectedTemplate && (
              <>
                <h2 className="text-xl font-semibold mb-1">{selectedTemplate.icon} {selectedTemplate.name}</h2>
                <p className="text-slate-500 text-sm mb-6">{selectedTemplate.description}</p>
                <div className="space-y-4">
                  {selectedTemplate.fields.map(field => (
                    <div key={field.id}>
                      <label className="label">{field.label} {field.required && <span className="text-red-500">*</span>}</label>
                      {field.type === 'textarea' ? (
                        <textarea className="input min-h-[100px]" placeholder={field.placeholder} value={formData[field.id] || ''} onChange={e => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))} />
                      ) : field.type === 'select' ? (
                        <select className="input" value={formData[field.id] || ''} onChange={e => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}>
                          <option value="">Select...</option>
                          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input type={field.type === 'currency' ? 'number' : field.type} className="input" placeholder={field.placeholder} value={formData[field.id] || ''} onChange={e => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))} />
                      )}
                    </div>
                  ))}
                  <button onClick={() => setStep(3)} className="btn-primary w-full mt-4">Preview Contract</button>
                </div>
              </>
            )}

            {method === 'ai' && (
              <>
                <h2 className="text-xl font-semibold mb-1">Describe Your Agreement</h2>
                <p className="text-slate-500 text-sm mb-6">Tell us about your deal in plain language. AI will generate a legally-informed agreement.</p>
                <textarea className="input min-h-[200px] mb-4" placeholder={'E.g., I\'m lending my friend James $5,000 for car repairs. He\'ll pay me back $500 per month starting next month for 10 months. No interest. We\'re both in Nairobi, Kenya.'} value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
                <div className="space-y-3">
                  <input className="input" placeholder="Your name" value={formData.party1_name || ''} onChange={e => setFormData(prev => ({ ...prev, party1_name: e.target.value }))} />
                  <input className="input" placeholder="Other party's name" value={formData.party2_name || ''} onChange={e => setFormData(prev => ({ ...prev, party2_name: e.target.value }))} />
                  <input className="input" placeholder="Jurisdiction (e.g., Nairobi, Kenya)" value={formData.jurisdiction || ''} onChange={e => setFormData(prev => ({ ...prev, jurisdiction: e.target.value }))} />
                </div>
                <button onClick={handleAIGenerate} disabled={!aiPrompt || isGenerating} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                  {isGenerating ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</>) : (<><Sparkles className="w-4 h-4" />Generate Agreement</>)}
                </button>
              </>
            )}

            {method === 'whatsapp' && (
              <>
                <h2 className="text-xl font-semibold mb-1">Import from Conversation</h2>
                <p className="text-slate-500 text-sm mb-6">Paste your WhatsApp, SMS, or text conversation where you agreed on terms.</p>
                <textarea className="input min-h-[250px] mb-4 font-mono text-sm" placeholder={'Paste conversation here...\n\nExample:\nJohn: Hey, can I borrow $2000?\nYou: Sure, when can you pay back?\nJohn: $400/month for 5 months\nYou: Deal, starting February?'} value={whatsappText} onChange={e => setWhatsappText(e.target.value)} />
                <div className="space-y-3">
                  <input className="input" placeholder="Your name" value={formData.party1_name || ''} onChange={e => setFormData(prev => ({ ...prev, party1_name: e.target.value }))} />
                  <input className="input" placeholder="Other party's name" value={formData.party2_name || ''} onChange={e => setFormData(prev => ({ ...prev, party2_name: e.target.value }))} />
                  <input className="input" placeholder="Jurisdiction" value={formData.jurisdiction || ''} onChange={e => setFormData(prev => ({ ...prev, jurisdiction: e.target.value }))} />
                </div>
                <button onClick={handleWhatsAppParse} disabled={!whatsappText || isGenerating} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                  {isGenerating ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Parsing...</>) : (<><Upload className="w-4 h-4" />Extract & Generate</>)}
                </button>
              </>
            )}
          </div>

          <div className="card p-6 bg-slate-50 border-dashed border-2 border-slate-300 flex items-center justify-center min-h-[400px]">
            <div className="text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Contract Preview</p>
              <p className="text-sm">Fill in details to see a live preview</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Visual Contract Editor */}
      {step === 3 && (
        <div className="fade-in grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Edit Clauses</h2>
              <button onClick={addClause} className="btn-ghost text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Clause</button>
            </div>
            {clauses.map((clause, index) => (
              <div key={clause.id} className="card p-4 group">
                <div className="flex items-start gap-2 mb-2">
                  <GripVertical className="w-4 h-4 text-slate-300 mt-1 cursor-grab" />
                  <input className="font-semibold text-sm text-slate-900 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:outline-none pb-1 flex-1" value={clause.title} onChange={e => updateClause(clause.id, 'title', e.target.value)} />
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                    <button onClick={() => moveClause(index, 'up')} className="p-1 hover:bg-slate-100 rounded" disabled={index === 0}><ChevronUp className="w-3 h-3" /></button>
                    <button onClick={() => moveClause(index, 'down')} className="p-1 hover:bg-slate-100 rounded" disabled={index === clauses.length - 1}><ChevronDown className="w-3 h-3" /></button>
                    <button onClick={() => removeClause(clause.id)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
                <textarea className="w-full text-sm text-slate-600 bg-transparent border border-transparent hover:border-slate-200 focus:border-teal-500 focus:outline-none rounded p-2 min-h-[60px] resize-none" value={clause.content} onChange={e => updateClause(clause.id, 'content', e.target.value)} />
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="card p-8 bg-white shadow-lg">
              <div className="border-b-2 border-slate-900 pb-4 mb-6">
                <input className="text-2xl font-bold text-slate-900 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:outline-none" value={contractTitle} onChange={e => setContractTitle(e.target.value)} />
                <p className="text-sm text-slate-500 mt-2">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">PARTIES</h3>
                <p className="text-sm text-slate-600"><strong>Party A:</strong> {formData.lender_name || formData.seller_name || formData.client_name || formData.party1_name || '[Your Name]'}</p>
                <p className="text-sm text-slate-600"><strong>Party B:</strong> {formData.borrower_name || formData.buyer_name || formData.provider_name || formData.party2_name || '[Other Party]'}</p>
              </div>
              <div className="space-y-4 mb-8">
                {clauses.map((clause, index) => (
                  <div key={clause.id}>
                    <h4 className="text-sm font-semibold text-slate-800">{index + 1}. {clause.title}</h4>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{clause.content}</p>
                  </div>
                ))}
              </div>
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-800">GOVERNING LAW</h3>
                <p className="text-sm text-blue-700">This agreement is governed by the laws of {formData.jurisdiction || '[Jurisdiction]'}.</p>
              </div>
              <div className="border-t-2 border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">SIGNATURES</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="border-b border-slate-400 mb-2 h-12" />
                    <p className="text-xs text-slate-500">Party A Signature</p>
                    <p className="text-sm font-medium">{formData.lender_name || formData.seller_name || formData.party1_name || '_______________'}</p>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 mb-2 h-12" />
                    <p className="text-xs text-slate-500">Party B Signature</p>
                    <p className="text-sm font-medium">{formData.borrower_name || formData.buyer_name || formData.party2_name || '_______________'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => handleSave('draft')} className="btn-secondary flex items-center gap-2 flex-1"><Save className="w-4 h-4" /> Save Draft</button>
              <button onClick={() => handleSave('pending_signature')} className="btn-primary flex items-center gap-2 flex-1"><Send className="w-4 h-4" /> Send for Signature</button>
              <button className="btn-ghost flex items-center gap-2"><Download className="w-4 h-4" /> PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
