'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkle,
    Chats,
    Globe as PhosphorGlobe,
    Files,
    Scales,
    Stack,
    ArrowRight
} from "@phosphor-icons/react";
import { cn } from '@/lib/utils';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <div className="bg-[var(--bg)] min-h-screen selection:bg-[var(--blue)] selection:text-white overflow-x-hidden">
            {/* ─── Brutalist Nav ─────────────────────────────── */}
            <nav className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-100 border-b-4 border-[var(--text-1)]",
                scrolled ? "bg-white py-3 shadow-[0_8px_0_0_black]" : "bg-[var(--bg)] py-6"
            )}>
                <div className="max-w-5xl mx-auto px-6 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-3 no-underline group shrink-0">
                        <div className="w-10 h-10 bg-[var(--blue)] flex items-center justify-center shrink-0 border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_black]">
                            <Scales weight="bold" size={24} className="text-white" />
                        </div>
                        <span className="text-2xl tracking-tighter text-[var(--text-1)] uppercase font-black">Agree<span className="text-[var(--blue)]">Mint</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-[var(--text-1)]">
                        <a href="#how-it-works" className="hover:text-[var(--blue)] transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-[var(--blue)] transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-[var(--blue)] transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <Link href="/dashboard" className="hidden sm:block text-xs font-black uppercase tracking-widest text-[var(--text-1)] hover:text-[var(--blue)]">Sign In</Link>
                        <Link href="/dashboard">
                            <button className="brutalist-button py-2 px-6 text-[11px] bg-[var(--blue)] text-white border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)]">
                                Generate My Contract →
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ─── HERO ─────────────────────────────── */}
            <section className="pt-48 pb-32 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="heading-display mb-8 mx-auto" style={{ maxWidth: "800px" }}>
                        Turn any conversation into a contract.
                    </h1>
                    <p className="text-xl font-bold text-[var(--text-2)] mb-12 max-w-2xl mx-auto leading-relaxed">
                        Describe your agreement in plain language. Gemini 3.1 Pro structures it into a professional, jurisdiction-aware contract in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link href="/dashboard">
                            <button className="brutalist-button bg-[var(--blue)] text-white border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] px-10 py-5 text-sm">
                                Generate My Contract →
                            </button>
                        </Link>
                        <button className="brutalist-button-outline bg-white border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)] px-10 py-5 text-sm">
                            Watch Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─────────────────────────────── */}
            <section id="how-it-works" className="py-32 bg-white border-y-4 border-[var(--text-1)] px-6 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--secondary)] opacity-10 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="eyebrow inline-block bg-[var(--secondary)]/20 text-[var(--secondary)] px-3 py-1 mb-4">The Process</span>
                        <h2 className="heading-section">Three steps. Zero jargon.</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-dashed border-t-2 border-dashed border-[var(--text-3)] z-0" />

                        <div className="brutalist-card p-10 relative z-10 bg-[var(--bg)] border-2">
                            <div className="w-16 h-16 bg-white border-4 border-[var(--text-1)] rounded-full flex items-center justify-center text-2xl font-black mb-8 shadow-[4px_4px_0_0_var(--blue)]">
                                1
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight mb-4">Describe your agreement</h3>
                            <p className="text-sm font-bold text-[var(--text-2)]">Explain the deal in your own words, or just paste a WhatsApp chat.</p>
                        </div>

                        <div className="brutalist-card p-10 relative z-10 bg-[var(--bg)] border-2">
                            <div className="w-16 h-16 bg-white border-4 border-[var(--text-1)] rounded-full flex items-center justify-center text-2xl font-black mb-8 shadow-[4px_4px_0_0_var(--blue)]">
                                2
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight mb-4">AI generates your contract</h3>
                            <p className="text-sm font-bold text-[var(--text-2)]">Gemini 3.1 Pro extracts the terms and formats it cleanly.</p>
                        </div>

                        <div className="brutalist-card p-10 relative z-10 bg-[var(--bg)] border-2">
                            <div className="w-16 h-16 bg-white border-4 border-[var(--text-1)] rounded-full flex items-center justify-center text-2xl font-black mb-8 shadow-[4px_4px_0_0_var(--blue)]">
                                3
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight mb-4">Download as PDF</h3>
                            <p className="text-sm font-bold text-[var(--text-2)]">Review, make adjustments, and export your professional agreement.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ─────────────────────────────── */}
            <section id="features" className="py-32 bg-[var(--bg)] px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-20">
                        <span className="eyebrow inline-block bg-[var(--blue)]/10 text-[var(--blue)] px-3 py-1 mb-4">Capabilities</span>
                        <h2 className="heading-section max-w-2xl">Everything you need.<br/>Nothing you don't.</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: <Sparkle size={32} weight="duotone" className="text-[var(--blue)]" />, t: "AI Contract Generator" },
                            { icon: <Chats size={32} weight="duotone" className="text-[var(--secondary)]" />, t: "WhatsApp-to-Contract" },
                            { icon: <Scales size={32} weight="duotone" className="text-[var(--blue)]" />, t: "AI Legal Advisor" },
                            { icon: <PhosphorGlobe size={32} weight="duotone" className="text-[var(--secondary)]" />, t: "195 Jurisdictions" },
                            { icon: <Files size={32} weight="duotone" className="text-[var(--blue)]" />, t: "PDF Export" },
                            { icon: <Stack size={32} weight="duotone" className="text-[var(--secondary)]" />, t: "Templates Library" }
                        ].map((feat, i) => (
                            <div key={i} className="brutalist-card p-8 bg-white border-2 flex flex-col gap-6">
                                <div className="w-14 h-14 bg-[var(--bg)] border-2 border-[var(--text-1)] flex items-center justify-center rounded-none shadow-[2px_2px_0_0_black]">
                                    {feat.icon}
                                </div>
                                <h3 className="text-base font-black uppercase tracking-widest">{feat.t}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── PRICING ─────────────────────────────── */}
            <section id="pricing" className="py-32 bg-[var(--text-1)] text-white px-6 border-t-4 border-[var(--text-1)]">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="heading-display text-white mb-6">Free to start. Seriously.</h2>
                    <p className="text-xl text-[var(--text-3)] font-bold mb-16">
                        Free plan: unlimited contracts, 10 AI calls/hr. No credit card required.
                    </p>
                    
                    <div className="max-w-md mx-auto brutalist-card bg-white text-[var(--text-1)] p-12 shadow-[12px_12px_0_0_var(--blue)]">
                        <div className="text-5xl font-black mb-2">$0 <span className="text-xl text-[var(--text-3)]">/mo</span></div>
                        <p className="text-sm font-bold uppercase tracking-widest text-[var(--blue)] mb-8">Early Adopter Plan</p>
                        
                        <div className="space-y-4 mb-10 text-left">
                            {['Unlimited PDF Exports', '10 AI Queries per hour', '195 Jurisdictions Available', 'Live AI Legal Assistant'].map((item, idx) => (
                                <div key={idx} className="flex flex-row items-center gap-4">
                                    <div className="w-5 h-5 bg-[var(--secondary)] rounded-full flex items-center justify-center shrink-0 border border-black text-black font-black text-[10px]">✓</div>
                                    <span className="font-bold text-sm">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/dashboard">
                            <button className="brutalist-button w-full bg-[var(--text-1)] text-white shadow-[4px_4px_0_0_var(--secondary)] border-2 border-[var(--text-1)] font-black text-sm py-4">
                                Start for Free
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── FINAL CTA ─────────────────────────────── */}
            <section className="py-40 bg-[var(--blue)] px-6 border-y-4 border-[var(--text-1)]">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="heading-display mb-12 text-white">Your first contract is 30 seconds away.</h2>
                    <Link href="/dashboard">
                        <button className="brutalist-button bg-white text-[var(--text-1)] border-4 border-[var(--text-1)] shadow-[6px_6px_0_0_var(--text-1)] px-12 py-6 text-base tracking-widest hover:translate-x-1 hover:translate-y-1">
                            Get Started Free →
                        </button>
                    </Link>
                </div>
            </section>

            {/* ─── FOOTER ─────────────────────────────── */}
            <footer className="py-16 bg-[var(--bg)] px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--text-1)] flex items-center justify-center shrink-0">
                            <Scales weight="fill" size={16} className="text-white" />
                        </div>
                        <span className="text-xl tracking-tighter text-[var(--text-1)] uppercase font-black">AgreeMint</span>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">
                        <Link href="/privacy" className="hover:text-[var(--blue)] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[var(--blue)] transition-colors">Terms of Protocol</Link>
                        <a href="mailto:hello@agreemint.com" className="hover:text-[var(--blue)] transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
