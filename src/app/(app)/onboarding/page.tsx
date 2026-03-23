'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stepper } from '@/components/ui/stepper';
import { Sparkle, ShieldCheck, UserCircle } from '@phosphor-icons/react';
import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';

const steps = [
  { label: 'Identity Node' },
  { label: 'Jurisdiction' },
  { label: 'Initialization' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ company: '', role: '', jurisdiction: 'Global (Root)' });

  const next = () => {
    if (step < 2) setStep(s => s + 1);
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col justify-center py-20 px-8">
      <div className="max-w-2xl mx-auto w-full">
        <div className="mb-12 text-center">
          <div className="inline-block p-4 bg-[var(--text-1)] text-[var(--bg)] mb-8 shadow-[4px_4px_0_0_#1447E6]">
            <Sparkle size={32} weight="bold" />
          </div>
          <h1 className="heading-display mb-4">Protocol Initialization.</h1>
          <p className="text-xl font-bold text-[var(--text-2)]">Configure your workspace before accessing the architecture.</p>
        </div>

        <Stepper steps={steps} currentStep={step} className="mb-16" />

        <div className="glass-card bg-transparent p-12 border min-h-[400px] flex flex-col justify-between shadow-2xl">
          {step === 0 && (
            <div className="space-y-8 animate-slide-up">
              <h2 className="heading-section text-2xl uppercase font-black">Verify Identity Node</h2>
              <div className="flex items-center gap-6 p-6 border-2 border-[var(--glass-border)] bg-[var(--bg)]">
                <UserCircle size={48} weight="duotone" className="text-[var(--blue)]" />
                <div>
                  <div className="font-black text-lg uppercase tracking-tight">{user?.fullName || 'Administrator'}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">{user?.primaryEmailAddress?.emailAddress}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] block mb-3">Organization (Optional)</label>
                  <Input 
                    value={formData.company} 
                    onChange={e => setFormData({ ...formData, company: e.target.value })} 
                    className="border-2 border-[var(--glass-border)] h-12 font-bold focus-visible:ring-0" 
                    placeholder="E.g., Acme Corp" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] block mb-3">Primary Role</label>
                  <select 
                    value={formData.role} 
                    onChange={e => setFormData({ ...formData, role: e.target.value })} 
                    className="w-full border-2 border-[var(--glass-border)] h-12 font-bold px-4 focus:outline-none appearance-none bg-transparent"
                  >
                    <option value="">Select Role...</option>
                    <option value="freelancer">Freelancer / Creator</option>
                    <option value="smb">Small Business Owner</option>
                    <option value="individual">Personal / Individual</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-slide-up">
              <h2 className="heading-section text-2xl uppercase font-black">Default Jurisdiction</h2>
              <p className="text-sm font-bold text-[var(--text-2)] mb-8">This determines the baseline legal framework for your generated agreements.</p>
              
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] block mb-3">Select Operating Region</label>
                <select 
                  value={formData.jurisdiction} 
                  onChange={e => setFormData({ ...formData, jurisdiction: e.target.value })} 
                  className="w-full border-2 border-[var(--glass-border)] h-14 font-black uppercase tracking-tight px-4 focus:outline-none appearance-none bg-[var(--bg)] text-lg"
                >
                  <option value="Global (Root)">Global Protocol (Root)</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="European Union">European Union</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="India">India</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-slide-up text-center py-8">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-600 shadow-[4px_4px_0_0_#059669]">
                <ShieldCheck size={48} weight="bold" />
              </div>
              <h2 className="heading-section text-3xl uppercase font-black">Node Verified</h2>
              <p className="text-sm font-bold text-[var(--text-2)] max-w-sm mx-auto">
                Your workspace is configured. You are cleared to begin architecting intent.
              </p>
            </div>
          )}

          <div className="mt-12 flex justify-between items-center border-t-2 border-dashed border-[var(--border-strong)] pt-8">
            <button 
              onClick={() => step > 0 && setStep(s => s - 1)} 
              className={`text-[10px] font-black uppercase tracking-widest hover:text-[var(--text-1)] ${step === 0 ? 'invisible' : 'text-[var(--text-3)]'}`}
            >
              &larr; Previous
            </button>
            <button 
              onClick={next} 
              className="btn-primary py-4 px-8 text-xs bg-[var(--blue)] text-[var(--bg)] border-2"
            >
              {step === 2 ? 'Enter Dashboard →' : 'Confirm & Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
