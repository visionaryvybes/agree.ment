'use client';

import { useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Globe, 
  Plus,
  Play,
  CheckCircle,
  FileText,
  Lock,
  CaretRight,
  ShieldChevron,
  Browsers
} from "@phosphor-icons/react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from '@/components/ui/magnetic';
import HandSigningScene from '@/components/ui/hand-signing-scene';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const heroRef = useRef(null);
  const vaultRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Elements
      gsap.from(".hero-reveal", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.1
      });

      // 3D Sections
      gsap.from(".vault-feature", {
        scrollTrigger: {
          trigger: ".vault-section",
          start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
      });

      gsap.from(".map-reveal", {
        scrollTrigger: {
          trigger: ".map-section",
          start: "top 70%",
        },
        scale: 0.8,
        opacity: 0,
        duration: 2,
        ease: "power2.out"
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#010101] text-white selection:bg-emerald selection:text-[#010101] min-h-screen font-sans overflow-x-hidden">
      
      {/* ── METADATA ────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AgreeMint",
            "operatingSystem": "Web",
            "applicationCategory": "LegalApplication",
            "description": "Premium system for creating, signing, and managing legally binding contracts.",
          })
        }}
      />

      {/* ── NAVIGATION ────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/[0.03] backdrop-blur-3xl px-8 py-5 rounded-[32px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <Link href="/" className="flex items-center gap-4 group">
            <img src="/logo_verified.png" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-500" alt="Logo" />
            <h1 className="flex items-center text-3xl font-black italic uppercase tracking-tighter">
               <span className="brand-agree">AGREE</span>
               <span className="brand-mint">MINT</span>
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            {['History', 'Deals', 'Templates'].map(item => (
              <Link key={item} href="/dashboard" className="text-[12px] font-black uppercase tracking-[0.3em] text-text-3 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Magnetic>
              <Link href="/dashboard" className="btn-vibrant btn-vibrant-emerald !py-3 !px-8 !text-[12px]">
                <span>ENTER APP</span>
                <CaretRight size={16} weight="bold" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-40 pb-20 px-6 min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Massive Background Glows */}
        <div className="vibrant-glow top-0 left-[-10%] w-[1000px] h-[1000px] bg-emerald/20 animate-glow-pulse" />
        <div className="vibrant-glow bottom-0 right-[-10%] w-[800px] h-[800px] bg-blue/10" />
        <div className="vibrant-glow middle-center w-[1200px] h-[1200px] bg-emerald/5 opacity-50" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-24 relative z-10">
          <motion.div 
            className="space-y-12"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="hero-reveal inline-flex items-center gap-4 px-6 py-3 rounded-full border border-emerald/30 bg-emerald/10 backdrop-blur-md text-emerald text-[12px] font-black uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(0,255,209,0.2)]">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald animate-pulse" />
              AgreeMint — Professional Agreements
            </div>
            
            <h1 className="hero-reveal heading-display text-8xl md:text-9xl lg:text-[150px] tracking-[-0.08em] leading-[0.8] text-white italic uppercase">
              Handshake <br />
              <span className="text-emerald not-italic">to Handled.</span>
            </h1>
            
            <p className="hero-reveal text-2xl md:text-3xl text-text-2 font-medium leading-[1.6] max-w-xl">
              The one-stop shop for personal deals. Document WhatsApp chats, private sales, and loans in seconds. No lawyers needed.
            </p>
            
            <div className="hero-reveal flex flex-wrap items-center gap-8 pt-10">
               <Magnetic>
                 <Link href="/onboarding" className="btn-vibrant btn-vibrant-emerald !px-16 !py-8 !text-2xl h-auto group">
                   START FOR FREE
                   <ArrowRight size={32} weight="bold" className="group-hover:translate-x-2 transition-transform" />
                 </Link>
               </Magnetic>
               <Magnetic>
                  <Link href="/login" className="btn-vibrant btn-vibrant-blue !px-12 !py-8 !text-2xl h-auto">
                    SIGN IN
                  </Link>
               </Magnetic>
            </div>
          </motion.div> 

          {/* 3D Scene Container — Optimized for Visibility */}
          <motion.div 
            className="scene-reveal h-[600px] lg:h-[900px] w-full relative z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,209,0.15),transparent_70%)] blur-3xl opacity-50" />
             <div className="w-full h-full transform hover:scale-105 transition-transform duration-1000">
                <Suspense fallback={<div className="w-full h-full bg-white/5 rounded-[60px] animate-pulse" />}>
                   <HandSigningScene />
                </Suspense>
             </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS: BESPOKE TIMELINE ─────────────────────── */}
      <section className="py-40 px-6 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
         <div className="max-w-7xl mx-auto space-y-32">
            <motion.div 
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
               <span className="text-[14px] font-black text-emerald uppercase tracking-[0.5em] block">THE PROCESS</span>
               <h2 className="heading-display text-7xl md:text-[120px] tracking-tighter uppercase italic text-white leading-none">Simple Steps.</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-16 relative">
                {[
                   { 
                     img: 'document_simple.png', title: 'CAPTURE', 
                     desc: 'Turn a WhatsApp chat or a handshake into a formal agreement in seconds.',
                     color: 'text-emerald',
                     glow: 'bg-emerald'
                   },
                   { 
                     img: 'lock_simple.png', title: 'MINT', 
                     desc: 'Sign and secure your contract with global jurisdiction support and AI guidance.',
                     color: 'text-blue',
                     glow: 'bg-blue'
                   },
                   { 
                     img: 'help_simple.png', title: 'ENFORCE', 
                     desc: 'Built-in escalation paths from friendly reminders to legal action guidance.',
                     color: 'text-amber',
                     glow: 'bg-amber'
                   }
                 ].map((step, i) => (
                  <motion.div 
                    key={i} 
                    className="flex flex-col items-center text-center gap-12 group relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.2 }}
                  >
                     <div className="w-64 h-64 relative">
                        <div className={`absolute inset-0 ${step.glow}/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                        <img src={`/assets/3d/${step.img}`} className="w-full h-full object-contain relative z-10 transition-transform duration-1000 group-hover:scale-110 group-hover:-rotate-3" alt={step.title} />
                     </div>
                     <div className="space-y-6">
                        <h3 className={`text-4xl font-black italic uppercase tracking-tighter ${step.color}`}>{step.title}</h3>
                        <p className="text-text-3 font-bold leading-relaxed max-w-xs mx-auto uppercase text-[12px] tracking-widest">{step.desc}</p>
                     </div>
                  </motion.div>
                ))}
            </div>
         </div>
      </section>

      {/* ── THE INFORMAL GAP: RELATABLE USE CASES ───────────────────── */}
      <section className="vault-section py-48 px-6 relative overflow-hidden">
         <div className="vibrant-glow top-[20%] left-[-10%] w-[800px] h-[800px] bg-blue/10 animate-glow-pulse" />
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
            <motion.div 
              className="vault-feature space-y-10 group"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
               <div className="p-16 rounded-[80px] bg-white/[0.02] border border-white/5 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-80 h-80 bg-blue/10 blur-[120px]" />
                  <img src="/assets/3d/vault_blue.png" className="w-full h-[500px] object-contain mb-16 transform group-hover:scale-105 transition-transform duration-1000" alt="Secure Storage" />
                  <div className="space-y-8 relative z-10">
                     <h3 className="text-5xl font-black text-blue italic uppercase tracking-tighter">STOP GUESSING.</h3>
                     <p className="text-text-2 text-xl font-medium leading-relaxed">Don't lose a friend over a loan or get ghosted by a freelancer. We provide the documentation you need for all life's informal moments.</p>
                  </div>
               </div>
            </motion.div>

            <div className="space-y-20">
               <motion.div 
                 className="space-y-8"
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
               >
                  <span className="text-[14px] font-black text-blue uppercase tracking-[0.5em] block">REAL USE CASES</span>
                  <h2 className="heading-display text-7xl md:text-[100px] tracking-tighter uppercase italic text-white leading-none">Made for <br /> Real Life.</h2>
               </motion.div>
               
               <div className="space-y-16">
                  {[
                    { icon: Lock, title: 'LENDING MONEY', desc: 'Lent a friend $500? Make it official so there are no hard feelings later.', color: 'text-blue' },
                    { icon: ShieldChevron, title: 'SELLING A CAR', desc: 'Selling your old ride? Get a bill of sale signed in 60 seconds.', color: 'text-blue' },
                    { icon: Browsers, title: 'FREELANCE WORK', desc: 'Starting a project? Protect your time and make sure you get paid.', color: 'text-blue' }
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-start gap-10 group"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    >
                       <div className={`w-20 h-20 bg-white/[0.05] border border-white/10 rounded-3xl flex items-center justify-center ${item.color} group-hover:scale-110 group-hover:bg-blue group-hover:text-white transition-all shadow-2xl`}>
                          <item.icon size={40} weight="bold" />
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{item.title}</h4>
                          <p className="text-text-3 text-lg font-medium">{item.desc}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ── GLOBAL NETWORK: HOLOGRAPHIC MAP ─────────────────────── */}
      <section className="map-section py-48 px-6 relative bg-white/[0.01] border-t border-white/5 overflow-hidden">
         <div className="vibrant-glow bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-amber/10 animate-glow-pulse" />
         <div className="max-w-7xl mx-auto flex flex-col items-center gap-32 text-center">
            <motion.div 
              className="space-y-8 max-w-4xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
               <span className="text-[14px] font-black text-amber uppercase tracking-[0.5em] block">LOCATIONS</span>
               <h2 className="heading-display text-7xl md:text-[120px] tracking-tighter uppercase italic text-white leading-none">Global Reach.</h2>
               <p className="text-text-2 text-2xl font-medium leading-relaxed">We operate in every major city to ensure your agreements are valid and respected worldwide.</p>
            </motion.div>

            <motion.div 
              className="map-reveal w-full max-w-6xl h-[700px] relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            >
               <div className="absolute inset-0 bg-amber/10 blur-[200px] rounded-full" />
               <img src="/assets/3d/map_gold.png" className="w-full h-full object-contain relative z-10" alt="Global Map" />
            </motion.div>

            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-40">
               {['NEW YORK', 'LONDON', 'LAGOS', 'DUBAI', 'SINGAPORE', 'JAKARTA', 'NAIROBI'].map(city => (
                  <span key={city} className="text-[14px] md:text-[18px] font-black uppercase tracking-[0.4em] text-amber">{city}</span>
               ))}
            </div>
         </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section className="py-48 px-6">
         <motion.div 
           className="max-w-6xl mx-auto rounded-[80px] bg-emerald px-10 py-40 text-[#010101] flex flex-col items-center text-center gap-16 shadow-[0_0_150px_rgba(0,255,209,0.3)] overflow-hidden relative group cursor-pointer border-8 border-[#010101]"
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
         >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <h2 className="heading-display text-8xl md:text-[180px] tracking-[-0.08em] leading-[0.8] italic uppercase relative z-10">Start <br /> <span className="underline decoration-8 underline-offset-10">Now</span>.</h2>
            <Magnetic>
               <Link href="/onboarding" className="bg-[#010101] text-emerald px-24 py-10 rounded-3xl text-4xl font-black uppercase tracking-widest hover:scale-110 transition-all shadow-[0_0_100px_rgba(0,0,0,0.6)] relative z-10">
                  GET STARTED
               </Link>
            </Magnetic>
         </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="py-48 border-t border-white/5 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-24 text-text-3">
          <div className="flex items-center gap-6 group cursor-pointer">
            <img src="/logo_verified.png" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(0,255,209,0.3)]" alt="Logo" />
            <h1 className="flex items-center text-4xl font-black italic uppercase tracking-tighter">
               <span className="brand-agree">AGREE</span>
               <span className="brand-mint">MINT</span>
            </h1>
          </div>
          <div className="text-center md:text-right space-y-6">
            <p className="text-[14px] font-black text-white uppercase tracking-[0.5em]">Simple Agreements v3.0</p>
            <p className="text-[12px] font-bold uppercase tracking-widest opacity-40">© 2026 AGREEMINT Inc. — All Data Private.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
