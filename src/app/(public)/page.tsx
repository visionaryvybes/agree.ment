'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import {
  ArrowRight, ShieldCheck, Clock, Globe, FileText,
  Lock, CaretRight, CheckCircle, Lightning, Handshake,
  Scales, CurrencyDollar, Briefcase, ArrowUpRight,
  Sparkle, Seal, GlobeHemisphereWest, UserCheck,
} from "@phosphor-icons/react";
import HandSigningScene from '@/components/ui/hand-signing-scene';

// ── Data ──────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Lightning,     color: 'emerald', title: 'Draft in 60 Seconds',     desc: 'Describe your deal in plain language. AI builds the full legal contract instantly.' },
  { icon: ShieldCheck,   color: 'blue',    title: 'Legally Admissible',       desc: 'Contracts reference real jurisdiction frameworks. Court-ready from day one.' },
  { icon: UserCheck,     color: 'amber',   title: 'One-Click Digital Sign',   desc: 'Both parties sign securely from any device via a shared link.' },
  { icon: Lock,          color: 'emerald', title: '256-Bit Encrypted',        desc: 'End-to-end encryption. Your documents stay private and tamper-proof.' },
  { icon: GlobeHemisphereWest, color: 'blue', title: '180+ Jurisdictions',   desc: 'Auto-selects the right legal framework for your location every time.' },
  { icon: Scales,        color: 'amber',   title: 'Built-In Dispute Path',    desc: 'Escalation tools from friendly reminders to formal legal guidance.' },
];

const USE_CASES = [
  { icon: CurrencyDollar, title: 'Personal Loans',    desc: 'Lent money to a friend? Document it so nobody\'s feelings — or finances — get hurt.',  tag: 'PERSONAL', color: 'emerald' },
  { icon: Briefcase,      title: 'Freelance Work',    desc: 'Lock in scope, rate, and deadlines before you start. Get paid what you agreed.',        tag: 'BUSINESS', color: 'blue' },
  { icon: Handshake,      title: 'Private Sales',     desc: 'Selling your car or electronics? A proper bill of sale protects both buyer and seller.', tag: 'SALES',    color: 'amber' },
];

const STATS = [
  { value: '50K+',  label: 'Agreements Created' },
  { value: '180+',  label: 'Countries Supported' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '< 60s', label: 'Time to Contract' },
];

// ── Shared animation helper ───────────────────────────────────────────────

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as any },
  };
}

// ── Inline accent helpers ─────────────────────────────────────────────────

const accentMap: Record<string, { text: string; border: string; bg: string }> = {
  emerald: { text: 'text-emerald', border: 'border-emerald/20',  bg: 'bg-emerald/[0.08]' },
  blue:    { text: 'text-blue',    border: 'border-blue/20',     bg: 'bg-blue/[0.08]' },
  amber:   { text: 'text-amber',   border: 'border-amber/20',    bg: 'bg-amber/[0.08]' },
};

// ── Component ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="bg-[#010101] text-white min-h-screen font-sans overflow-x-hidden">

      {/* SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'AgreeMint', operatingSystem: 'Web', applicationCategory: 'LegalApplication',
        description: 'Create legally-binding agreements in under 60 seconds.',
      })}} />

      {/* ─── NAV ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
        <nav className="max-w-5xl mx-auto flex items-center justify-between bg-white/[0.03] backdrop-blur-2xl border border-white/[0.07] rounded-2xl px-5 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo_verified.png" className="w-7 h-7 object-contain" alt="AgreeMint" />
            <span className="text-sm font-black italic uppercase tracking-tight">
              <span className="brand-agree">Agree</span><span className="brand-mint">Mint</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {[['Features', '#features'], ['Use Cases', '#usecases'], ['Map', '#global']].map(([l, h]) => (
              <a key={l} href={h} className="text-[11px] font-bold uppercase tracking-widest text-white/35 hover:text-white transition-colors">{l}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden md:block text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors px-3">
              Sign In
            </Link>
            <Link href="/onboarding" className="btn-vibrant btn-vibrant-emerald !text-[10px] !py-2 !px-5 !rounded-xl">
              Get Started <ArrowRight size={12} weight="bold" />
            </Link>
          </div>
        </nav>
      </header>

      {/* ─── HERO ────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 px-4 min-h-[100svh] flex flex-col justify-center overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald/[0.07] blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue/[0.05] blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 items-center gap-10 lg:gap-14">
          {/* Copy */}
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald/25 bg-emerald/[0.07] text-emerald text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              Professional Agreements Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.03em] leading-[1.0] italic uppercase"
            >
              Handshake<br />
              <span className="text-emerald not-italic">to Handled.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[15px] text-white/45 leading-relaxed max-w-sm font-medium"
            >
              Turn any informal deal into a documented, signed, legally-binding contract in under 60 seconds. No lawyers needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link href="/onboarding" className="btn-vibrant btn-vibrant-emerald group !px-7 !py-3.5 !text-xs !rounded-xl">
                Start for Free
                <ArrowRight size={14} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-bold text-white/40 hover:text-white transition-colors group">
                Open Dashboard
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex items-center gap-5 pt-1"
            >
              {['No credit card', 'Cancel anytime', 'GDPR compliant'].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-white/25 font-medium">
                  <CheckCircle size={11} weight="fill" className="text-emerald/50 flex-shrink-0" />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="h-[380px] sm:h-[460px] lg:h-[520px] w-full"
          >
            <Suspense fallback={<div className="w-full h-full bg-white/[0.03] rounded-3xl animate-pulse" />}>
              <HandSigningScene />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAR ───────────────────────────────────────────────── */}
      <section className="py-10 px-4 border-y border-white/[0.05] bg-white/[0.012]">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={i} {...fadeUp(i * 0.07)} className="text-center">
              <p className="text-xl sm:text-2xl font-black text-white tracking-tight">{s.value}</p>
              <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="text-[10px] font-black text-emerald uppercase tracking-[0.4em] block mb-3">The Process</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase italic">Three Simple Steps</h2>
            <p className="text-white/35 mt-3 text-sm max-w-md mx-auto leading-relaxed">From conversation to fully-signed contract.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-14 left-[24%] right-[24%] h-px bg-gradient-to-r from-emerald/20 via-blue/20 to-amber/20" />

            {[
              { img: 'document_simple.png', num: '01', title: 'Capture', desc: 'Describe your deal or paste a chat — AI extracts all terms automatically.', accent: 'emerald' },
              { img: 'lock_simple.png',     num: '02', title: 'Mint',    desc: 'Review, customize, then get both parties to sign digitally in seconds.',  accent: 'blue' },
              { img: 'help_simple.png',     num: '03', title: 'Enforce', desc: 'Track compliance and access escalation tools if things go sideways.',      accent: 'amber' },
            ].map((step, i) => {
              const a = accentMap[step.accent];
              return (
                <motion.div key={i} {...fadeUp(i * 0.12)} className="flex flex-col items-center text-center gap-5 group">
                  <div className={`relative w-24 h-24 rounded-2xl ${a.bg} border ${a.border} flex items-center justify-center transition-all duration-500 group-hover:scale-105`}>
                    <img src={`/assets/3d/${step.img}`} className="w-16 h-16 object-contain" alt={step.title} />
                    <span className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-lg bg-[#010101] border border-white/10 flex items-center justify-center text-[8px] font-black ${a.text}`}>{step.num}</span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-black uppercase italic tracking-tight ${a.text}`}>{step.title}</h3>
                    <p className="text-[13px] text-white/35 leading-relaxed mt-1.5 max-w-[220px] mx-auto">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28 px-4 bg-white/[0.012] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="text-[10px] font-black text-blue uppercase tracking-[0.4em] block mb-3">Why AgreeMint</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase italic">Built for the Real World</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const a = accentMap[f.color];
              return (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.07)}
                  className={`p-5 rounded-2xl border ${a.border} ${a.bg} group hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className={`w-9 h-9 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center mb-3 ${a.text} flex-shrink-0`}>
                    <f.icon size={17} weight="bold" />
                  </div>
                  <h3 className={`text-[13px] font-black uppercase tracking-wide ${a.text} mb-1.5`}>{f.title}</h3>
                  <p className="text-xs text-white/35 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── USE CASES ───────────────────────────────────────────────── */}
      <section id="usecases" className="py-20 sm:py-28 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue/[0.04] blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Image card */}
          <motion.div {...fadeUp()} className="order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue/[0.04] to-transparent pointer-events-none rounded-3xl" />
              <img
                src="/assets/3d/vault_blue.png"
                className="w-full max-h-60 sm:max-h-72 object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                alt="Secure document vault"
              />
            </div>
          </motion.div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <motion.div {...fadeUp()}>
              <span className="text-[10px] font-black text-blue uppercase tracking-[0.4em] block mb-3">Real Use Cases</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-tight">
                Made for<br />Real Life.
              </h2>
              <p className="text-white/35 mt-3 text-sm leading-relaxed max-w-sm">
                Don't let a lost friendship or a missed payment be the price of an informal deal.
              </p>
            </motion.div>

            <div className="space-y-4">
              {USE_CASES.map((uc, i) => {
                const a = accentMap[uc.color];
                return (
                  <motion.div key={i} {...fadeUp(i * 0.1 + 0.1)} className="flex items-start gap-4 group">
                    <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center ${a.text} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <uc.icon size={18} weight="bold" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-[13px] font-black uppercase tracking-wide text-white">{uc.title}</h4>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-white/[0.05] border ${a.border} ${a.text}`}>{uc.tag}</span>
                      </div>
                      <p className="text-xs text-white/35 leading-relaxed">{uc.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── GLOBAL REACH ────────────────────────────────────────────── */}
      <section id="global" className="py-20 sm:py-28 px-4 bg-white/[0.01] border-y border-white/[0.05] relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber/[0.04] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto flex flex-col items-center gap-10 text-center">
          <motion.div {...fadeUp()} className="max-w-xl">
            <span className="text-[10px] font-black text-amber uppercase tracking-[0.4em] block mb-3">Global Network</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase italic">Agreements Everywhere.</h2>
            <p className="text-white/35 mt-3 text-sm leading-relaxed">
              Jurisdiction-aware contracts recognized across 180+ countries. We handle the legal nuance so you don't have to.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.15)} className="w-full max-w-3xl relative">
            <div className="absolute inset-0 bg-amber/[0.05] blur-[50px] rounded-full pointer-events-none" />
            <img
              src="/assets/3d/map_gold.png"
              className="w-full max-h-[320px] sm:max-h-[380px] object-contain relative z-10"
              alt="Global coverage map"
            />
          </motion.div>

          <motion.div {...fadeUp(0.25)} className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {['New York', 'London', 'Lagos', 'Dubai', 'Singapore', 'Nairobi'].map(city => (
              <span key={city} className="text-[10px] font-black uppercase tracking-[0.3em] text-amber/40 hover:text-amber transition-colors cursor-default">{city}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TRUST STRIP ─────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white/[0.012] border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, color: 'emerald', title: 'Court Admissible', desc: 'Every document meets evidentiary standards in 50+ legal systems.' },
              { icon: Lock,        color: 'blue',    title: 'Bank-Grade Security', desc: 'AES-256 encryption. Zero-knowledge architecture. Your data is yours.' },
              { icon: Seal,        color: 'amber',   title: 'Tamper-Proof',     desc: 'Blockchain-anchored audit trail. Every signature is verifiable forever.' },
            ].map((item, i) => {
              const a = accentMap[item.color];
              return (
                <motion.div key={i} {...fadeUp(i * 0.1)} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center flex-shrink-0 ${a.text}`}>
                    <item.icon size={18} weight="bold" />
                  </div>
                  <div>
                    <h4 className={`text-[13px] font-black uppercase ${a.text} mb-1`}>{item.title}</h4>
                    <p className="text-xs text-white/30 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <motion.div
          {...fadeUp()}
          className="max-w-2xl mx-auto rounded-3xl bg-emerald px-8 py-14 sm:py-16 text-[#010101] flex flex-col items-center text-center gap-7 relative overflow-hidden"
          style={{ boxShadow: '0 0 60px rgba(0,255,209,0.2)' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
          <Sparkle size={28} weight="fill" className="text-[#010101]/40" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase italic">Ready to Start?</h2>
            <p className="text-[#010101]/50 mt-2 text-sm font-medium">Create your first agreement free. No credit card needed.</p>
          </div>
          <Link href="/onboarding" className="bg-[#010101] text-emerald px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,0,0,0.4)] relative z-10">
            Get Started Free →
          </Link>
        </motion.div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="py-12 px-4 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-white/25">
          <div className="flex items-center gap-2.5">
            <img src="/logo_verified.png" className="w-6 h-6 object-contain opacity-60" alt="Logo" />
            <span className="text-xs font-black italic uppercase tracking-tight text-white/50">
              <span className="brand-agree">Agree</span><span className="brand-mint">Mint</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
            <Link href="/terms"   className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">App</Link>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest">© 2026 AgreeMint Inc.</p>
        </div>
      </footer>
    </div>
  );
}
