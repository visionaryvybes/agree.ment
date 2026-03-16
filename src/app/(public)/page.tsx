'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Files,
    Stack,
    BookOpen,
    Sparkle,
    Gear,
    House,
    MagnifyingGlass,
    ArrowRight,
    Lightning,
    Chats,
    Globe as PhosphorGlobe,
    Wallet as PhosphorWallet,
    ShieldCheck,
    Check,
    Handshake,
    Lock,
    CaretRight,
    Scales
} from "@phosphor-icons/react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const FEATURES = [
    {
        icon: <Sparkle size={32} weight="duotone" className="text-[var(--blue)]" />,
        title: 'AI Contract Generation',
        desc: 'Describe your deal in plain language. AI generates a jurisdiction-aware, legally structured agreement in seconds.',
    },
    {
        icon: <Chats size={32} weight="duotone" className="text-[var(--blue)]" />,
        title: 'WhatsApp Import',
        desc: 'Paste your WhatsApp, SMS, or email conversation. AI extracts terms and turns informal agreements into formal contracts.',
    },
    {
        icon: <Lightning size={32} weight="duotone" className="text-[var(--blue)]" />,
        title: 'Smart Escalation',
        desc: 'Automated progression from friendly reminder to formal notice to demand letter to legal action guidance.',
    },
    {
        icon: <PhosphorGlobe size={32} weight="duotone" className="text-[var(--blue)]" />,
        title: 'Legal Library — 195 Countries',
        desc: 'Contract law, lending rules, constitution references, and dispute resolution frameworks for every jurisdiction.',
    },
    {
        icon: <Stack size={32} weight="duotone" className="text-[var(--blue)]" />,
        title: '20+ Contract Templates',
        desc: 'Loans, sales, rentals, freelance, NDAs, roommate agreements, family arrangements — all pre-built and customizable.',
    },
    {
        icon: <PhosphorWallet size={32} weight="duotone" className="text-[var(--blue)]" />,
        title: 'Payment Tracking',
        desc: 'Log payments with timestamps and receipts. Both parties see real-time status. Built-in evidence for disputes.',
    },
];

const STEPS = [
    {
        num: '01',
        title: 'Describe or paste',
        desc: 'Tell the AI about your deal in plain language, paste a WhatsApp conversation, or pick a template.',
    },
    {
        num: '02',
        title: 'Review & customize',
        desc: 'AI generates jurisdiction-aware clauses. Edit any clause, add or remove terms, set payment schedules.',
    },
    {
        num: '03',
        title: 'Sign & enforce',
        desc: 'Both parties sign digitally. Payment tracking starts automatically. Smart escalation kicks in if needed.',
    },
];

const STATS = [
    { value: '195', label: 'Countries covered' },
    { value: '37%', label: 'Of personal loans go unpaid' },
    { value: '20+', label: 'Ready-to-use templates' },
    { value: '<60s', label: 'To generate a contract' },
];

const COUNTRIES_MARQUEE = [
    '🇰🇪 Kenya', '🇳🇬 Nigeria', '🇿🇦 South Africa', '🇺🇸 United States', '🇬🇧 United Kingdom',
    '🇮🇳 India', '🇦🇪 UAE', '🇧🇷 Brazil', '🇩🇪 Germany', '🇫🇷 France',
    '🇯🇵 Japan', '🇦🇺 Australia', '🇨🇦 Canada', '🇲🇽 Mexico', '🇪🇬 Egypt',
    '🇸🇬 Singapore', '🇵🇭 Philippines', '🇸🇦 Saudi Arabia', '🇮🇩 Indonesia', '🇹🇷 Turkey',
    '🇬🇭 Ghana', '🇹🇿 Tanzania', '🇺🇬 Uganda', '🇷🇼 Rwanda', '🇪🇹 Ethiopia',
    '🇹🇭 Thailand', '🇻🇳 Vietnam', '🇰🇷 South Korea', '🇳🇱 Netherlands', '🇨🇭 Switzerland',
];

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <div className="bg-[var(--bg)] min-h-screen selection:bg-[var(--text-1)] selection:text-white overflow-x-hidden">

            {/* ─── Brutalist Nav ─────────────────────────────── */}
            <nav className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-100 border-b-2 border-[var(--text-1)]",
                scrolled ? "bg-white py-3" : "bg-transparent py-6"
            )}>
                <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-4 no-underline group">
                        <div className="w-10 h-10 bg-[var(--text-1)] flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_black]">
                            <Scales weight="fill" size={24} className="text-white" />
                        </div>
                        <span className="heading-section text-2xl tracking-tighter text-[var(--text-1)] uppercase font-black">AgreeMint</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-3)]">
                        <a href="#protocol" className="hover:text-[var(--text-1)] hover:underline underline-offset-8 transition-all">Protocol</a>
                        <Link href="/dashboard" className="hover:text-[var(--text-1)] hover:underline underline-offset-8 transition-all">Interface</Link>
                        <Link href="/templates" className="hover:text-[var(--text-1)] hover:underline underline-offset-8 transition-all">Frameworks</Link>
                        <a href="#jurisdictions" className="hover:text-[var(--text-1)] hover:underline underline-offset-8 transition-all">Global State</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-[var(--text-1)] hover:underline underline-offset-4">Sign In</Link>
                        <button className="brutalist-button px-8 py-3 text-[10px]">
                            Launch App
                        </button>
                    </div>
                </div>
            </nav>

            {/* ─── Hero: The Infrastructure of Intent ──────────── */}
            <section className="pt-60 pb-40 px-8 relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(var(--text-1) 1px, transparent 1px), linear-gradient(90deg, var(--text-1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="mb-12 inline-block bg-[var(--text-1)] text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.4em]"
                    >
                        Legal Engineering Protocol v4.2
                    </motion.div>

                    <h1 className="heading-display mb-16 max-w-5xl">
                        Architect Private <br /> Agreements <span className="italic text-[var(--blue)]">with Finality.</span>
                    </h1>

                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="max-w-xl">
                            <p className="text-2xl font-bold leading-tight text-[var(--text-2)] mb-12 tracking-tight">
                                Stop documenting handshakes. Start architecting intent.
                                AgreeMint is a deterministic legal framework for 195 jurisdictions.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button className="brutalist-button h-16 px-12 text-xs">
                                    Initialize New Agreement
                                </button>
                                <button className="brutalist-button-outline brutalist-button h-16 px-12 text-xs">
                                    Browse Frameworks
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                            {[
                                { label: 'Settlement Speed', val: '<60s' },
                                { label: 'Node Distribution', val: '195 Regions' },
                                { label: 'Active Enforcements', val: '12.4k' },
                                { label: 'Protocol Stability', val: '99.9%' }
                            ].map((s, i) => (
                                <div key={i} className="brutalist-card p-6 border-2">
                                    <div className="text-3xl font-serif mb-2">{s.val}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-3)]">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Technical Core ─────────────────────────────── */}
            <section id="protocol" className="py-40 bg-white border-y-[3px] border-[var(--text-1)] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div>
                            <span className="eyebrow">Deterministic Logic</span>
                            <h2 className="heading-section mb-8">AI-Synthesized <br />Legal Architecture.</h2>
                            <p className="text-lg text-[var(--text-2)] font-bold leading-relaxed mb-12">
                                Our protocol converts natural language intent into structured legal data.
                                Verified against jurisdictional statutes across 195 countries in real-time.
                            </p>

                            <div className="space-y-6">
                                {[
                                    'Multi-Jurisdictional Conflict Resolution',
                                    'Deterministic Smart-Escalation Loops',
                                    'Immutable Audit Trails for Dispute Evidence'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-6 h-6 border-2 border-[var(--text-1)] flex items-center justify-center">
                                            <Check weight="bold" size={14} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-[var(--text-1)]">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="brutalist-card aspect-square bg-[var(--bg)] p-12 overflow-hidden relative">
                                <div className="absolute inset-0 opacity-[0.08]"
                                    style={{ backgroundImage: 'radial-gradient(circle, var(--text-1) 2px, transparent 2px)', backgroundSize: '24px 24px' }} />

                                <div className="relative z-10 font-mono text-[10px] leading-relaxed text-[var(--text-2)] space-y-2">
                                    <div className="text-[var(--blue)] font-bold">// Protocol Initialization</div>
                                    <div className="text-[var(--text-1)]">CONST agreement = AgreeMint.architect({`{`}</div>
                                    <div className="pl-4">jurisdiction: "United Kingdom",</div>
                                    <div className="pl-4">clauses: ["Repayment", "Interest_Cap", "Dispute_ADR"],</div>
                                    <div className="pl-4">enforcement: "Smart_Escalation_v4"</div>
                                    <div>{`}`});</div>
                                    <br />
                                    <div className="text-emerald-600 font-bold">{" >> STATE: VALIDATED_LEGAL_FRAMEWORK"}</div>
                                    <div className="text-[var(--text-3)]">{" >> HASH: 0x1A4F...B2E9"}</div>
                                </div>

                                <div className="absolute bottom-8 right-8 w-32 h-32 bg-[var(--text-1)] text-white p-6 rotate-12 shadow-2xl flex flex-col justify-between">
                                    <Sparkle size={24} weight="fill" />
                                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">AI Verified State</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Grid: Core Capabilities ─────────────────────── */}
            <section className="bg-[var(--bg)]">
                <div className="grid-brutalist grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t-0">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="group hover:bg-white transition-all cursor-crosshair">
                            <div className="mb-12">
                                <div className="w-14 h-14 border-2 border-[var(--text-1)] flex items-center justify-center mb-1 group-hover:bg-[var(--text-1)] group-hover:text-white transition-all">
                                    {f.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-4">{f.title}</h3>
                            <p className="text-sm font-bold text-[var(--text-2)] leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Coverage: The Global State ───────────────────── */}
            <section id="jurisdictions" className="py-40 bg-[var(--text-1)] text-white border-y-[3px] border-[var(--text-1)]">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-16 mb-24">
                        <div className="max-w-2xl">
                            <span className="eyebrow text-white/40">Global State</span>
                            <h2 className="heading-section text-white mb-8">Unified Framework for a Fragmented World.</h2>
                            <p className="text-xl text-white/60 font-medium">Agreement models for 195 separate jurisdictions, synchronized daily with legislative shifts.</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="brutalist-button bg-white text-[var(--text-1)] px-8 py-3">View Registry</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {COUNTRIES_MARQUEE.slice(0, 12).map((c, i) => (
                            <div key={i} className="border border-white/20 p-6 hover:bg-white/5 transition-all text-center">
                                <div className="text-2xl mb-2">{c.split(' ')[0]}</div>
                                <div className="text-[9px] font-black uppercase tracking-widest opacity-60">{c.split(' ')[1]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Final Protocol Initialization ────────────────── */}
            <section className="py-60 bg-[var(--bg)] text-center px-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="heading-display mb-12">Total <br /> Enforcement <span className="italic text-[var(--blue)]">Control.</span></h2>
                    <p className="text-2xl font-bold text-[var(--text-2)] mb-16 max-w-2xl mx-auto leading-tight">
                        37% of informal agreements collapse. <br /> Fix the failure rate with deterministic architecture.
                    </p>
                    <button className="brutalist-button h-24 px-20 text-sm">
                        Initialize First Agreement Layer &rarr;
                    </button>
                </div>
            </section>

            {/* ─── Footer ─────────────────────────────────────── */}
            <footer className="py-24 border-t-[3px] border-[var(--text-1)] bg-white px-8">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-24">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-[var(--text-1)] flex items-center justify-center shrink-0">
                                <Scales weight="fill" size={24} className="text-white" />
                            </div>
                            <span className="heading-section text-2xl tracking-tighter text-[var(--text-1)] uppercase font-black">AgreeMint</span>
                        </div>
                        <p className="text-sm font-bold text-[var(--text-2)] leading-relaxed">The global protocol for private agreement architecture. Built for deterministic finality.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-12 col-span-2">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-8 text-[var(--text-3)]">Infrastructure</p>
                            <div className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-widest text-[var(--text-1)]">
                                <Link href="/dashboard" className="hover:underline">Interface</Link>
                                <Link href="/templates" className="hover:underline">Frameworks</Link>
                                <Link href="/legal-library" className="hover:underline">Registry</Link>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-8 text-[var(--text-3)]">Safety</p>
                            <div className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-widest text-[var(--text-1)]">
                                <a href="#" className="hover:underline">Privacy Policy</a>
                                <a href="#" className="hover:underline">Terms of Protocol</a>
                                <a href="#" className="hover:underline">Security State</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Utility function for conditional classNames

