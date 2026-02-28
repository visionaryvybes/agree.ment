'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Globe, Wallet, CheckCircle2, ArrowRight, Zap, Scale, Gavel, Handshake, Users2, Search, FileText, Lock, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const FEATURES = [
    {
        icon: (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500 ease-out">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Sparkles className="text-blue-600 relative z-10" size={28} />
            </div>
        ),
        title: 'AI Contract Generation',
        desc: 'Describe your deal in plain language. AI generates a jurisdiction-aware, legally structured agreement in seconds.',
    },
    {
        icon: (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500 ease-out">
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-600 relative z-10">
                    <path d="M12 3V21M3 12H21" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="5" y="5" width="14" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
            </div>
        ),
        title: 'WhatsApp Import',
        desc: 'Paste your WhatsApp, SMS, or email conversation. AI extracts terms and turns informal agreements into formal contracts.',
    },
    {
        icon: (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500 ease-out">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Zap className="text-amber-600 relative z-10" size={28} />
            </div>
        ),
        title: 'Smart Escalation',
        desc: 'Automated progression from friendly reminder to formal notice to demand letter to legal action guidance.',
    },
    {
        icon: (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500 ease-out">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Scale className="text-emerald-600 relative z-10" size={28} />
            </div>
        ),
        title: 'Legal Library — 195 Countries',
        desc: 'Contract law, lending rules, constitution references, and dispute resolution frameworks for every jurisdiction.',
    },
    {
        icon: (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500 ease-out">
                <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <LayoutGrid className="text-rose-600 relative z-10" size={28} />
            </div>
        ),
        title: '20+ Contract Templates',
        desc: 'Loans, sales, rentals, freelance, NDAs, roommate agreements, family arrangements — all pre-built and customizable.',
    },
    {
        icon: (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500 ease-out">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Wallet className="text-cyan-600 relative z-10" size={28} />
            </div>
        ),
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
        <div className="landing">
            {/* ─── Sticky Nav ───────────────────────────────── */}
            <nav className={`landing-nav ${scrolled ? 'landing-nav-scrolled' : ''}`}>
                <div className="landing-nav-inner">
                    <Link href="/" className="landing-logo no-underline">
                        <div className="landing-logo-icon">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 3h10M2 7h7M2 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="11" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                            </svg>
                        </div>
                        <span className="landing-logo-text">AgreeMint</span>
                    </Link>
                    <div className="landing-nav-links">
                        <a href="#features">Features</a>
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/templates">Templates</Link>
                        <a href="#coverage">Coverage</a>
                    </div>
                    <Button size="sm" asChild>
                        <Link href="/dashboard" className="no-underline">
                            Open App →
                        </Link>
                    </Button>
                </div>
            </nav>

            {/* ─── Hero ─────────────────────────────────────── */}
            <section className="landing-hero" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(20, 71, 230, 0.04) 0%, transparent 70%)', zIndex: 0 }} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    className="landing-hero-inner"
                    style={{ position: 'relative', zIndex: 1 }}
                >
                    <div className="landing-hero-badge">
                        <span className="landing-badge-dot" />
                        Next-Gen Legal Architecture · 195 Jurisdictions
                    </div>

                    <h1 className="landing-hero-title">
                        Personal agreements,<br />
                        <em style={{ position: 'relative' }}>
                            legally grounded.
                            <motion.svg
                                width="320" height="20" viewBox="0 0 320 20"
                                style={{ position: 'absolute', bottom: -15, left: 0, overflow: 'visible' }}
                            >
                                <motion.path
                                    d="M 5 10 Q 80 5 160 10 Q 240 15 315 10"
                                    fill="none"
                                    stroke="var(--blue)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 1, duration: 1.2 }}
                                />
                            </motion.svg>
                        </em>
                    </h1>

                    <p className="landing-hero-sub">
                        The definitive platform to architect, sign, track, and enforce
                        private agreements. Powered by jurisdiction-aware AI models.
                    </p>

                    <div className="landing-hero-cta">
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                            <Button size="xl" asChild>
                                <Link href="/dashboard" className="no-underline">
                                    Initialize Workspace
                                </Link>
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                            <Button variant="outline" size="xl" asChild>
                                <Link href="/templates" className="no-underline">
                                    Browse Library <ArrowRight size={16} />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Floating Aesthetic Bits */}
                    <div className="hero-floating-elements">
                        <motion.div
                            className="floating-bit"
                            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            style={{ top: '20%', left: '10%' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeOpacity="0.1">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v8M8 12h8" />
                            </svg>
                        </motion.div>
                        <motion.div
                            className="floating-bit"
                            animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            style={{ top: '60%', right: '5%' }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeOpacity="0.1">
                                <path d="M3 3h18v18H3z" />
                                <path d="M12 3v18M3 12h18" />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>

                {/* ─── Holographic 3D Card Stack ──────────────────────────────── */}
                <motion.div
                    className="hero-3d-container relative w-full h-[500px] flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    <div className="relative w-full max-w-[400px] h-[350px]">
                        {/* Deep Holographic Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/30 blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />

                        {/* Card 3 (Bottom) */}
                        <motion.div
                            className="absolute top-[40px] left-[20px] w-[320px] bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-xl"
                            animate={{ y: [0, -10, 0], rotateZ: -12 }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            style={{ transformOrigin: "bottom left" }}
                        >
                            <div className="flex items-center gap-2 mb-4 text-slate-400">
                                <Lock size={16} /> <span className="text-xs font-bold tracking-widest uppercase">NDA</span>
                            </div>
                            <div className="w-full h-3 bg-slate-200/50 rounded-full mb-3" />
                            <div className="w-2/3 h-3 bg-slate-200/50 rounded-full mb-3" />
                            <div className="w-4/5 h-3 bg-slate-200/50 rounded-full" />
                        </motion.div>

                        {/* Card 2 (Middle) */}
                        <motion.div
                            className="absolute top-[60px] left-[50px] w-[320px] bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-2xl"
                            animate={{ y: [0, -15, 0], rotateZ: -5 }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            style={{ transformOrigin: "bottom center" }}
                        >
                            <div className="flex items-center gap-2 mb-4 text-slate-500">
                                <Handshake size={16} /> <span className="text-xs font-bold tracking-widest uppercase">Service Agreement</span>
                            </div>
                            <div className="w-full h-3 bg-slate-300/50 rounded-full mb-3" />
                            <div className="w-3/4 h-3 bg-slate-300/50 rounded-full" />
                        </motion.div>

                        {/* Card 1 (Top Hero) */}
                        <motion.div
                            className="absolute top-[80px] left-[80px] w-[340px] bg-white/90 backdrop-blur-2xl border border-white rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(20,71,230,0.3)]"
                            animate={{ y: [0, -20, 0], rotateZ: 3 }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            style={{ transformOrigin: "bottom right" }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <Badge variant="success">ACTIVE</Badge>
                                <Shield size={18} className="text-blue-600" />
                            </div>

                            <h3 className="serif text-2xl text-slate-900 mb-1">Personal Loan</h3>
                            <div className="text-sm text-slate-500 mb-6">James Okonkwo &middot; London, UK</div>

                            <div className="text-4xl font-light tracking-tight text-slate-900 mb-6 font-variant-numeric tabular-nums">
                                $25,000 <span className="text-lg text-slate-400 font-normal">USD</span>
                            </div>

                            <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">Signatures Verified</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Legally Binding</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* ─── Stats Bar ────────────────────────────────── */}
            <section className="landing-stats">
                <div className="landing-stats-inner">
                    {STATS.map((s) => (
                        <div key={s.label} className="landing-stat">
                            <div className="landing-stat-value">{s.value}</div>
                            <div className="landing-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Features ─────────────────────────────────── */}
            <section id="features" className="landing-features">
                <div className="landing-section-inner">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={item}
                        className="landing-section-header"
                    >
                        <div className="landing-eyebrow">Capabilities</div>
                        <h2 className="landing-section-title">
                            Everything informal agreements need.<br />
                            Nothing they don&apos;t.
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="landing-features-grid"
                    >
                        {FEATURES.map((f) => (
                            <motion.div key={f.title} variants={item} className="landing-feature-card group cursor-default">
                                <div className="landing-feature-icon">{f.icon}</div>
                                <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: 12 }}>{f.title}</h3>
                                <p className="landing-feature-desc">{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── How it Works ─────────────────────────────── */}
            <section id="how-it-works" className="landing-steps">
                <div className="landing-section-inner">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={item}
                        className="landing-section-header"
                    >
                        <div className="landing-eyebrow">Process</div>
                        <h2 className="landing-section-title">
                            From handshake to<br />
                            signed agreement in minutes.
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="landing-steps-grid"
                    >
                        {STEPS.map((s) => (
                            <motion.div key={s.num} variants={item} className="landing-step-card">
                                <div className="landing-step-num">{s.num}</div>
                                <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: 12 }}>{s.title}</h3>
                                <p className="landing-step-desc">{s.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── Country Coverage Marquee ─────────────────── */}
            <section id="coverage" className="landing-coverage">
                <div className="landing-section-inner">
                    <div className="landing-section-header">
                        <div className="landing-eyebrow">Global Coverage</div>
                        <h2 className="landing-section-title">
                            Jurisdiction-aware intelligence<br />
                            for every country on earth.
                        </h2>
                        <p className="landing-section-sub">
                            Contract law, lending regulations, constitutional references, and dispute
                            resolution guidance — localized to 195 countries across all continents.
                        </p>
                    </div>
                </div>

                <div className="landing-marquee-wrap">
                    <div className="landing-marquee">
                        {[...COUNTRIES_MARQUEE, ...COUNTRIES_MARQUEE].map((c, i) => (
                            <span key={i} className="landing-marquee-item">{c}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Use Cases ────────────────────────────────── */}
            <section className="landing-usecases">
                <div className="landing-section-inner">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={item}
                        className="landing-section-header"
                    >
                        <div className="landing-eyebrow">Use Cases</div>
                        <h2 className="landing-section-title">
                            Built for how people actually<br />
                            make agreements.
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="landing-usecases-grid"
                    >
                        {[
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--blue)" fillOpacity="0.1" />
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                        <path d="M2 17L12 22L22 17" />
                                        <path d="M2 12L12 17L22 12" />
                                    </svg>
                                ),
                                title: 'Personal Loans',
                                desc: 'Lending money to friends, family, or colleagues with proper repayment schedules and enforcement.'
                            },
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: 'Private Sales',
                                desc: 'Selling a car, electronics, furniture — anything sold privately deserves a written agreement.'
                            },
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                ),
                                title: 'Rental Agreements',
                                desc: 'Renting out property, equipment, or vehicles with clear terms and payment tracking.'
                            },
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                    </svg>
                                ),
                                title: 'Service Agreements',
                                desc: 'Hiring someone for home repairs, tutoring, consulting, or any personal service.'
                            },
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M16 8l-8 8" />
                                        <path d="M8 8l8 8" />
                                    </svg>
                                ),
                                title: 'Freelance Contracts',
                                desc: 'Project scope, deliverables, payment milestones — all structured and enforceable.'
                            },
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                ),
                                title: 'Roommate & Family',
                                desc: 'Shared living expenses, inheritance arrangements, caregiving responsibilities.'
                            },
                        ].map((u) => (
                            <motion.div key={u.title} variants={item} className="landing-usecase-card">
                                <div className="landing-usecase-icon">{u.icon}</div>
                                <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: 12 }}>{u.title}</h3>
                                <p className="landing-usecase-desc">{u.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── Final CTA ────────────────────────────────── */}
            <section className="landing-cta">
                <div className="landing-cta-inner">
                    <h2 className="landing-cta-title">
                        Stop trusting handshakes.<br />
                        Start protecting agreements.
                    </h2>
                    <p className="landing-cta-sub">
                        37% of personal loans never get paid back. AgreeMint fixes that — with
                        AI-generated contracts, payment tracking, and smart escalation. Free to start.
                    </p>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                        <Button size="xl" asChild>
                            <Link href="/dashboard" className="no-underline">
                                Create Your First Agreement →
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* ─── Footer ───────────────────────────────────── */}
            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="landing-footer-brand">
                        <div className="landing-logo" style={{ color: 'var(--text-2)' }}>
                            <div className="landing-logo-icon" style={{ background: 'var(--bg-subtle)', color: 'var(--text-1)' }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 3h10M2 7h7M2 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span>AgreeMint</span>
                        </div>
                        <p className="landing-footer-copy">
                            Personal agreements, legally grounded.<br />
                            © {new Date().getFullYear()} AgreeMint. All rights reserved.
                        </p>
                    </div>
                    <div className="landing-footer-links">
                        <div>
                            <div className="landing-footer-heading">Product</div>
                            <Link href="/dashboard">Dashboard</Link>
                            <Link href="/templates">Templates</Link>
                            <Link href="/legal-library">Legal Library</Link>
                            <Link href="/ai">AI Advisor</Link>
                        </div>
                        <div>
                            <div className="landing-footer-heading">Legal</div>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
