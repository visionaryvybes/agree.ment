'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Sparkle,
    Chats,
    Globe as PhosphorGlobe,
    Files,
    Scales,
    Stack,
    ArrowRight,
    CheckCircle,
    ShieldCheck
} from "@phosphor-icons/react";
import { cn } from '@/lib/utils';
import { RadialProgress } from '@/components/ui/radial-progress';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <div className="bg-[var(--bg)] min-h-screen selection:bg-[var(--blue)] selection:text-[var(--bg)] overflow-x-hidden">
            {/* ─── Brutalist Nav ─────────────────────────────── */}
            <nav className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-4 border-[var(--text-1)]",
                scrolled ? "bg-[var(--color-white)] py-4 shadow-[0_8px_0_0_var(--text-1)]" : "bg-[var(--bg)]/80 backdrop-blur-md py-6"
            )}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-3 no-underline group shrink-0">
                        <div className="w-10 h-10 bg-[var(--blue)] flex items-center justify-center shrink-0 border-2 border-[var(--text-1)] shadow-[2px_2px_0_0_var(--text-1)] group-hover:bg-[var(--secondary)] transition-colors">
                            <Scales weight="bold" size={24} className="text-[var(--bg)]" />
                        </div>
                        <span className="text-2xl tracking-tighter text-[var(--text-1)] uppercase font-black">Agree<span className="text-[var(--blue)]">Mint</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-[var(--text-1)]">
                        <a href="#how-it-works" className="hover:text-[var(--blue)] transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-[var(--blue)] transition-colors">Platform</a>
                        <a href="#pricing" className="hover:text-[var(--blue)] transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <Link href="/dashboard" className="hidden sm:block text-xs font-black uppercase tracking-widest text-[var(--text-1)] hover:text-[var(--blue)]">Sign In</Link>
                        <Link href="/dashboard">
                            <button className="brutalist-button py-3 px-6 text-[12px] bg-[var(--text-1)] hover:bg-[var(--blue)] text-[var(--bg)] border-[var(--text-1)] shadow-[4px_4px_0_0_var(--blue)] hover:shadow-[4px_4px_0_0_var(--text-1)]">
                                Start Drafting →
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ─── HERO ─────────────────────────────── */}
            <section className="pt-48 pb-32 px-6 relative overflow-hidden">
                 {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--blue)]/10 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--secondary)]/10 rounded-full blur-[150px] -z-10 -translate-x-1/4 translate-y-1/4" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        variants={staggerContainer} 
                        initial="hidden" 
                        animate="show"
                        className="text-left"
                    >
                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-[var(--color-white)] border-2 border-[var(--text-1)] px-4 py-2 shadow-[2px_2px_0_0_var(--text-1)] mb-8">
                            <Sparkle size={16} weight="fill" className="text-[var(--blue)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-1)]">Gemini 3.1 Pro Powered</span>
                        </motion.div>
                        
                        <motion.h1 variants={fadeUp} className="text-6xl md:text-7xl lg:text-[5.5rem] font-black uppercase tracking-tighter leading-[0.85] text-[var(--text-1)] mb-8">
                            Words into <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--blue)] to-[var(--secondary)]">Contracts</span>
                        </motion.h1>
                        
                        <motion.p variants={fadeUp} className="text-xl md:text-2xl font-bold text-[var(--text-2)] mb-12 max-w-xl leading-relaxed">
                            Stop paying for rigid templates. Describe your agreement, and let our AI structure it into a professional, legally sound document in 30 seconds.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <Link href="/dashboard" className="w-full sm:w-auto">
                                <button className="w-full brutalist-button bg-[var(--blue)] text-[var(--bg)] border-[var(--text-1)] shadow-[6px_6px_0_0_var(--text-1)] px-10 py-5 text-sm flex items-center justify-center gap-3 group">
                                    Generate Agreement
                                    <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--text-1)] bg-gray-200" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`, backgroundSize: 'cover' }} />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-[var(--text-1)] bg-[var(--color-white)] flex items-center justify-center text-[10px] font-black">+10k</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Animated Mock UI */}
                    <motion.div style={{ y: yHero }} className="hidden lg:block relative z-10 perspective-[1000px]">
                        <motion.div 
                            initial={{ rotateY: 15, rotateX: 5, opacity: 0, x: 50 }}
                            animate={{ rotateY: -5, rotateX: 2, opacity: 1, x: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="w-full aspect-[4/5] bg-[var(--color-white)] border-4 border-[var(--text-1)] shadow-[16px_16px_0_0_var(--text-1)] flex flex-col overflow-hidden relative"
                        >
                            {/* Browser bar */}
                            <div className="h-12 border-b-4 border-[var(--text-1)] bg-[var(--bg)] flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full border-2 border-[var(--text-1)] bg-[#FF5F56]"></div>
                                <div className="w-3 h-3 rounded-full border-2 border-[var(--text-1)] bg-[#FFBD2E]"></div>
                                <div className="w-3 h-3 rounded-full border-2 border-[var(--text-1)] bg-[#27C93F]"></div>
                            </div>
                            {/* Editor Body */}
                            <div className="p-8 flex-1 flex flex-col gap-6 relative">
                                <div className="w-2/3 h-8 bg-gray-200 mb-4 animate-pulse"></div>
                                <div className="space-y-3">
                                    <div className="w-full h-4 bg-gray-100"></div>
                                    <div className="w-full h-4 bg-gray-100"></div>
                                    <div className="w-5/6 h-4 bg-gray-100"></div>
                                </div>
                                <div className="mt-8 border-4 border-[var(--text-1)] p-4 bg-[var(--blue)]/5 relative overflow-hidden">
                                     <div className="absolute top-0 left-0 w-1 h-full bg-[var(--blue)] pointer-events-none"></div>
                                     <div className="flex items-center gap-3">
                                         <Sparkle size={20} className="text-[var(--blue)] animate-spin-slow" />
                                         <span className="text-xs font-black uppercase tracking-widest text-[var(--blue)]">AI Rewriting Clause 4.2...</span>
                                     </div>
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex items-center gap-2">
                                        <RadialProgress pct={100} size={30} stroke={4} className="drop-shadow-none" />
                                        <span className="text-[10px] font-black">100% READY</span>
                                    </div>
                                    <div className="w-24 h-8 bg-[var(--text-1)]"></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

             {/* ─── GEO / TRUST SECTION ─────────────────────────────── */}
            <section className="py-12 bg-[var(--color-white)] border-y-4 border-[var(--text-1)] overflow-hidden flex whitespace-nowrap">
                <div className="animate-[scroll_20s_linear_infinite] flex items-center gap-16 px-8 text-xl md:text-3xl font-black uppercase tracking-tighter text-[var(--text-1)]/30">
                    <span className="flex items-center gap-4"><ShieldCheck size={40} weight="fill"/> 195 Jurisdictions</span>
                    <span>•</span>
                    <span className="flex items-center gap-4"><Stack size={40} weight="fill"/> Compliant</span>
                    <span>•</span>
                    <span className="flex items-center gap-4"><Files size={40} weight="fill"/> Export to PDF</span>
                    <span>•</span>
                    <span className="flex items-center gap-4"><ShieldCheck size={40} weight="fill"/> 195 Jurisdictions</span>
                    <span>•</span>
                    <span className="flex items-center gap-4"><Stack size={40} weight="fill"/> Compliant</span>
                    <span>•</span>
                    <span className="flex items-center gap-4"><Files size={40} weight="fill"/> Export to PDF</span>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─────────────────────────────── */}
            <section id="how-it-works" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <span className="eyebrow inline-block bg-[var(--text-1)] text-[var(--bg)] px-4 py-2 mb-6">The Workflow</span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--text-1)]">Three steps. Zero jargon.</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[4.5rem] left-[20%] right-[20%] h-1 border-t-4 border-dashed border-[var(--text-1)]/20 z-0" />

                        {[
                            { step: "01", title: "Describe", desc: "Explain the deal in plain English. No legal padding required. Just tell us who does what, when, and how much.", icon: <Chats size={40} className="text-[var(--blue)]" weight="duotone" /> },
                            { step: "02", title: "Generate", desc: "Our AI structures your input into a professional, jurisdiction-aware agreement holding up to standard scrutiny.", icon: <Sparkle size={40} className="text-[var(--secondary)]" weight="duotone" /> },
                            { step: "03", title: "Sign & Export", desc: "Review the clauses, make any final interactive tweaks, and export directly to a print-ready PDF.", icon: <Files size={40} className="text-[var(--text-1)]" weight="duotone" /> }
                        ].map((s, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                key={i} 
                                className="brutalist-card p-10 relative z-10 bg-[var(--color-white)] group hover:bg-[var(--text-1)] hover:text-[var(--bg)] transition-colors duration-300"
                            >
                                <div className="w-24 h-24 bg-[var(--bg)] border-4 border-[var(--text-1)] flex items-center justify-center font-black mb-10 shadow-[8px_8px_0_0_var(--blue)] group-hover:shadow-[8px_8px_0_0_var(--secondary)] transition-all">
                                    {s.icon}
                                </div>
                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[var(--text-1)]/10 to-[var(--text-1)]/5 -ml-2 mb-4 group-hover:from-white/20 group-hover:to-white/5">{s.step}</div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{s.title}</h3>
                                <p className="text-sm font-bold text-[var(--text-2)] group-hover:text-[var(--text-3)] leading-relaxed">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── BENTO GRID CAPABILITIES ─────────────────────────────── */}
            <section id="features" className="py-32 bg-[var(--text-1)] text-[var(--bg)] px-6 border-y-4 border-[var(--text-1)]">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20">
                        <span className="eyebrow inline-block bg-[var(--color-white)] text-[var(--text-1)] px-4 py-2 mb-6">Capabilities</span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--bg)] max-w-2xl">Everything you need. Nothing you don&apos;t.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
                        <div className="md:col-span-2 brutalist-card bg-[var(--blue)] border-[var(--bg)] p-10 shadow-[8px_8px_0_0_#00BA95] flex flex-col justify-end overflow-hidden relative group">
                            <Sparkle size={120} className="absolute -top-10 -right-10 text-[var(--bg)]/20 group-hover:scale-110 transition-transform duration-700" weight="fill" />
                            <h3 className="text-3xl font-black uppercase mb-2 text-[var(--text-1)]">Smart AI Drafting</h3>
                            <p className="text-[var(--text-1)]/80 font-bold max-w-md">Easily rewrite terms, summarize risks, and manage clauses with AI.</p>
                        </div>
                        <div className="brutalist-card bg-[var(--color-white)] border-0 p-8 shadow-[8px_8px_0_0_var(--secondary)] flex flex-col justify-between group">
                            <div className="w-12 h-12 bg-[var(--text-1)] flex items-center justify-center text-[var(--bg)]"><PhosphorGlobe size={24} /></div>
                            <div>
                                <h3 className="text-[var(--text-1)] text-xl font-black uppercase mb-1">Global Scale</h3>
                                <p className="text-[var(--text-2)] text-xs font-bold">195 localized formats.</p>
                            </div>
                        </div>
                        <div className="brutalist-card bg-[var(--bg)] border-0 p-8 shadow-[8px_8px_0_0_var(--blue)] flex flex-col justify-between group">
                            <div className="w-12 h-12 bg-[var(--text-1)] flex items-center justify-center text-[var(--bg)]"><Stack size={24} /></div>
                            <div>
                                <h3 className="text-[var(--text-1)] text-xl font-black uppercase mb-1">Library</h3>
                                <p className="text-[var(--text-2)] text-xs font-bold">Store and reuse templates.</p>
                            </div>
                        </div>
                        <div className="md:col-span-4 brutalist-card bg-[var(--secondary)] border-[var(--bg)] p-10 shadow-[8px_8px_0_0_#5B52ED] flex sm:flex-row flex-col items-center justify-between overflow-hidden relative">
                             <div className="max-w-xl z-10">
                                <h3 className="text-3xl font-black uppercase mb-2 text-[var(--text-1)]">Secure Cloud Storage</h3>
                                <p className="text-[var(--text-1)]/80 font-bold">Your agreements are securely stored, backed up, and ready to export instantly. Fast and reliable.</p>
                             </div>
                             <div className="relative z-10 mt-8 sm:mt-0 flex gap-4">
                                <RadialProgress pct={100} size={100} stroke={8} color="var(--text-1)" className="drop-shadow-none" />
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PRICING ─────────────────────────────── */}
            <section id="pricing" className="py-32 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <span className="eyebrow inline-block bg-[var(--text-1)] text-[var(--bg)] px-4 py-2 mb-6">Open Access</span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[var(--text-1)] mb-16">Free to start.<br/>Seriously.</h2>
                    
                    <div className="max-w-lg mx-auto brutalist-card bg-[var(--color-white)] p-12 shadow-[16px_16px_0_0_var(--blue)] hover:shadow-[24px_24px_0_0_var(--text-1)] transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--blue)] opacity-10 rounded-full blur-[40px] pointer-events-none"></div>

                        <div className="text-6xl md:text-[5rem] font-black mb-2 flex justify-center items-end gap-2">$0 <span className="text-xl text-[var(--text-3)] mb-4">/forever</span></div>
                        <p className="text-sm font-black uppercase tracking-widest text-[var(--blue)] mb-10 pb-10 border-b-4 border-[var(--text-1)]">Early Adopter Plan</p>
                        
                        <div className="space-y-6 mb-12 text-left">
                            {[
                                'Generative AI Drafting', 
                                'Unlimited PDF Exports', 
                                '10 AI Queries per hour', 
                                '195 Jurisdictions Global Coverage'
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-row items-center gap-4">
                                    <div className="w-6 h-6 bg-[var(--blue)]/20 rounded-full flex items-center justify-center shrink-0">
                                        <CheckCircle size={16} weight="bold" className="text-[var(--blue)]" />
                                    </div>
                                    <span className="font-bold text-base">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/dashboard" className="block w-full">
                            <button className="brutalist-button w-full bg-[var(--text-1)] text-[var(--bg)] shadow-[6px_6px_0_0_var(--secondary)] border-2 border-[var(--text-1)] text-lg py-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                                Sign Up Free &rarr;
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── FINAL CTA ─────────────────────────────── */}
            <section className="py-40 bg-[var(--text-1)] px-6 border-y-4 border-[var(--text-1)] overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-gradient-radial from-[var(--blue)]/20 to-transparent pointer-events-none"></div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h2 className="text-6xl md:text-[6rem] font-black uppercase tracking-tighter leading-[0.8] mb-12 text-[var(--bg)]">Your contract is <br/><span className="text-[var(--secondary)]">30 seconds</span> away.</h2>
                    <Link href="/dashboard">
                        <button className="brutalist-button bg-[var(--color-white)] text-[var(--text-1)] border-4 border-[var(--bg)] shadow-[8px_8px_0_0_var(--blue)] px-16 py-8 text-xl tracking-widest hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            Start Drafting Now
                        </button>
                    </Link>
                </div>
            </section>

            {/* ─── FOOTER ─────────────────────────────── */}
            <footer className="py-16 bg-[var(--bg)] px-6 border-t-4 border-[var(--text-1)]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-[var(--text-1)] flex items-center justify-center shrink-0 border-2 border-[var(--text-1)] group-hover:bg-[var(--blue)] transition-colors">
                            <Scales weight="fill" size={20} className="text-[var(--bg)]" />
                        </div>
                        <span className="text-2xl tracking-tighter text-[var(--text-1)] uppercase font-black">Agree<span className="text-[var(--blue)]">Mint</span></span>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-8 text-xs font-black uppercase tracking-widest text-[var(--text-3)]">
                        <Link href="/privacy" className="hover:text-[var(--text-1)] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[var(--text-1)] transition-colors">Terms of Service</Link>
                        <a href="mailto:hello@agreemint.com" className="hover:text-[var(--text-1)] transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
