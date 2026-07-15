'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowDownRight, ChatCircleText, PenNib, Seal, CurrencyDollar,
  Briefcase, Handshake, House, PawPrint, Wrench,
} from '@phosphor-icons/react';

// ── Content ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: 'STEP 1',
    icon: ChatCircleText,
    title: 'Say what you agreed',
    desc: 'Type it in plain words — or paste the WhatsApp chat where you hashed it out. No legal vocabulary required.',
  },
  {
    n: 'STEP 2',
    icon: PenNib,
    title: 'Get your document',
    desc: 'AgreeMint drafts clear, complete terms: who, what, how much, by when, and what happens if things go sideways.',
  },
  {
    n: 'STEP 3',
    icon: Seal,
    title: 'Both of you sign',
    desc: 'Share a link. Each party reviews and signs from any device. Everyone keeps a copy, nobody "remembers it differently."',
  },
];

const CLAUSES = [
  { n: '01', title: 'Plain language first', desc: 'Every agreement reads like a human wrote it. The legal structure is there; the jargon is not.' },
  { n: '02', title: 'Chat-to-contract', desc: 'Paste the conversation where you made the deal. We pull out the terms and quote the source messages.' },
  { n: '03', title: 'Knows your local rules', desc: "Tell us where you are and the draft follows your country's rules, with warnings where they differ." },
  { n: '04', title: 'Signatures that stick', desc: 'Draw or type a signature, timestamped, with both parties on record. Export the signed PDF anytime.' },
  { n: '05', title: 'Payment tracking', desc: 'Milestones, due dates, and amounts live inside the agreement — so "did they pay yet?" has an answer.' },
  { n: '06', title: 'If things go wrong', desc: 'A step-by-step path from friendly reminder to formal demand letter, so a bad deal never catches you unprepared.' },
];

const USE_CASES = [
  { icon: CurrencyDollar, file: '01', title: 'The loan to a friend', desc: '"I\'ll pay you back next month." Get it on paper before it costs you a friendship.' },
  { icon: Briefcase, file: '02', title: 'The freelance gig', desc: 'Scope, rate, deadline, revisions. Agreed before the work starts — paid after it ends.' },
  { icon: Handshake, file: '03', title: 'The private sale', desc: 'Car, laptop, camera. A bill of sale that protects both sides of the handshake.' },
  { icon: House, file: '04', title: 'The roommate deal', desc: 'Rent split, bills, guests, moving out. The talk everyone avoids, written down once.' },
  { icon: Wrench, file: '05', title: 'The borrowed gear', desc: 'Lending tools, cameras, or your car? Say what happens if it comes back broken.' },
  { icon: PawPrint, file: '06', title: 'The pet sitter', desc: 'Feeding, vet emergencies, house keys. Everything the group chat forgot to cover.' },
];

// ── Motion helper ─────────────────────────────────────────────────────────

function rise(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ground text-ink">

      {/* ── Nav: a filed strip, pinned hard to the top ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-ground/95 border-b-2 border-line-strong">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="text-lg leading-none">
            <span className="brand-agree">Agree</span>
            <span className="brand-mint">Mint</span>
          </Link>
          <div className="hidden sm:flex items-center gap-7 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-2">
            <a href="#how" className="hover:text-mint transition-colors">How it works</a>
            <a href="#terms-of-us" className="hover:text-mint transition-colors">What you get</a>
            <a href="#uses" className="hover:text-mint transition-colors">Use cases</a>
          </div>
          <Link href="/dashboard" className="btn-vibrant btn-vibrant-emerald">
            Open the app <ArrowRight size={15} weight="bold" />
          </Link>
        </nav>
      </header>

      {/* ── Hero: the registry counter ── */}
      <section className="relative pt-32 sm:pt-36 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="vibrant-glow text-mint inset-x-0 top-0 h-72" />
        <div className="max-w-6xl mx-auto">
          <motion.p {...rise(0)} className="font-mono text-[11px] tracking-[0.3em] uppercase text-mint">
            Clear agreements for everyday deals
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="heading-display uppercase text-[clamp(2.8rem,9vw,7rem)] mt-5"
          >
            A handshake
            <br />
            is a memory.
            <br />
            <span className="inline-block bg-mint text-paper px-3 sm:px-5 -rotate-1 shadow-[5px_5px_0_var(--shadow-ink)]">
              Paper is a fact.
            </span>
          </motion.h1>

          <div className="mt-12 grid lg:grid-cols-[1fr_auto] gap-12 items-end">
            <div>
              <motion.p {...rise(0.16)} className="text-lg text-ink-2 leading-relaxed max-w-md border-l-2 border-line-strong pl-5">
                Describe the deal in your own words — or paste the chat where you
                made it — and get a clear, signable agreement both of you can
                live with. Minutes, not lawyers.
              </motion.p>
              <motion.div {...rise(0.24)} className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/contracts/new" className="btn-vibrant btn-vibrant-emerald !px-7 !py-4 !text-sm">
                  Draft your first agreement
                </Link>
                <a href="#how" className="btn-secondary px-6 py-4 text-xs">
                  See how it works <ArrowDownRight size={14} weight="bold" className="ml-2" />
                </a>
              </motion.div>
              <motion.p {...rise(0.3)} className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                Free to start · No card required · Not a law firm — fine print below, worth reading
              </motion.p>
            </div>

            {/* Specimen instrument, filed at an angle */}
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: 2.5 }}
              animate={{ opacity: 1, y: 0, rotate: 1.5 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden md:block w-[380px]"
            >
              <div className="relative bg-card border-2 border-line-strong p-7 shadow-[6px_6px_0_var(--shadow-ink)]">
                <div className="flex items-center justify-between border-b-2 border-line-strong pb-3">
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase">Loan agreement</p>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-mint">No. 0001</p>
                </div>
                <h3 className="heading-display text-2xl mt-4 uppercase">Maya lends Jonas $600</h3>
                <div className="mt-4 space-y-3 text-[13px] leading-relaxed text-ink-2">
                  <p><span className="font-mono text-mint mr-2">1.</span>Jonas repays $200 on the first of each month, starting August 1st.</p>
                  <p><span className="font-mono text-mint mr-2">2.</span>No interest — this is between friends. Late by 14 days? They talk first.</p>
                  <p><span className="font-mono text-mint mr-2">3.</span>Fully repaid by October 1st, and this agreement ends with dinner on Jonas.</p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-dashed border-line grid grid-cols-2 gap-6">
                  <div>
                    <p className="font-display text-lg">Maya K.</p>
                    <p className="mt-1 h-[2px] bg-line-strong" />
                    <p className="mt-1.5 font-mono text-[9px] uppercase tracking-widest text-ink-3">Lender</p>
                  </div>
                  <div>
                    <p className="font-display text-lg">Jonas T.</p>
                    <p className="mt-1 h-[2px] bg-line-strong" />
                    <p className="mt-1.5 font-mono text-[9px] uppercase tracking-widest text-ink-3">Borrower</p>
                  </div>
                </div>
                {/* Stamp */}
                <div className="absolute -right-6 -bottom-6 w-[86px] h-[86px] rounded-full border-[3px] border-mint text-mint bg-card flex items-center justify-center rotate-[-14deg] shadow-[4px_4px_0_var(--shadow-ink)]">
                  <div className="text-center leading-tight">
                    <Seal size={22} weight="fill" className="mx-auto" />
                    <p className="font-mono text-[9px] font-bold tracking-[0.2em] mt-1">AGREED</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Procedure ── */}
      <section id="how" className="py-20 px-4 sm:px-6 border-t-2 border-line-strong bg-wash">
        <div className="max-w-6xl mx-auto">
          <motion.div {...rise()} className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="heading-display uppercase text-3xl sm:text-5xl">How it works</h2>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">Three steps · No homework</p>
          </motion.div>
          <div className="mt-12 grid md:grid-cols-3 border-2 border-line-strong bg-card divide-y-2 md:divide-y-0 md:divide-x-2 divide-line-strong shadow-[5px_5px_0_var(--shadow-ink)]">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...rise(i * 0.08)} className="p-7">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] tracking-[0.25em] text-mint">{s.n}</p>
                  <s.icon size={24} className="text-ink" weight="duotone" />
                </div>
                <h3 className="heading-display uppercase text-xl mt-6">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get ── */}
      <section id="terms-of-us" className="py-20 px-4 sm:px-6 border-t-2 border-line-strong">
        <div className="max-w-6xl mx-auto">
          <motion.div {...rise()}>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-mint">What you get</p>
            <h2 className="heading-display uppercase text-3xl sm:text-5xl mt-3">
              What AgreeMint<br />agrees to do
            </h2>
          </motion.div>
          <div className="mt-12 grid sm:grid-cols-2 gap-x-14 gap-y-8">
            {CLAUSES.map((c, i) => (
              <motion.div key={c.n} {...rise(i * 0.05)} className="flex gap-5 border-b-2 border-dashed border-line pb-7">
                <span className="font-mono text-sm font-bold text-mint pt-0.5">{c.n}</span>
                <div>
                  <h3 className="font-bold uppercase tracking-wide text-sm">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case files ── */}
      <section id="uses" className="py-20 px-4 sm:px-6 border-t-2 border-line-strong bg-wash">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...rise()} className="heading-display uppercase text-3xl sm:text-5xl">
            Deals people<br />actually make
          </motion.h2>
          <motion.p {...rise(0.06)} className="mt-5 text-ink-2 max-w-lg border-l-2 border-line-strong pl-5">
            Not mergers. Not IPOs. The everyday promises between real people that
            deserve more protection than a text message.
          </motion.p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {USE_CASES.map((u, i) => (
              <motion.div
                key={u.title}
                {...rise(i * 0.05)}
                className="group bg-card border-2 border-line-strong p-6 shadow-[4px_4px_0_var(--shadow-ink)] hover:shadow-[6px_6px_0_var(--shadow-ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <u.icon size={24} weight="duotone" className="text-mint" />
                  <span className="font-mono text-[9px] tracking-[0.25em] text-ink-3">{u.file}</span>
                </div>
                <h3 className="mt-5 font-bold uppercase tracking-wide text-sm">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-4 sm:px-6 border-t-2 border-line-strong relative overflow-hidden">
        <div className="vibrant-glow text-mint inset-x-0 bottom-0 h-56" />
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 {...rise()} className="heading-display uppercase text-4xl sm:text-6xl">
            Shake on it.
            <br />
            <span className="inline-block bg-mint text-paper px-3 sm:px-4 rotate-1 shadow-[4px_4px_0_var(--shadow-ink)] mt-2">
              Then sign it.
            </span>
          </motion.h2>
          <motion.div {...rise(0.1)} className="mt-10">
            <Link href="/contracts/new" className="btn-vibrant btn-vibrant-emerald !px-9 !py-4 !text-sm">
              Start your agreement <ArrowRight size={16} weight="bold" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-4 sm:px-6 border-t-2 border-line-strong bg-wash">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Link href="/" className="text-lg leading-none">
              <span className="brand-agree">Agree</span>
              <span className="brand-mint">Mint</span>
            </Link>
            <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-2">
              <Link href="/terms" className="hover:text-mint transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-mint transition-colors">Privacy</Link>
            </div>
          </div>
          <p className="mt-8 text-xs leading-relaxed text-ink-3 max-w-2xl border-t-2 border-dashed border-line pt-6">
            THE FINE PRINT, IN PLAIN SIGHT — AgreeMint is a self-help document tool,
            not a law firm, and nothing here is legal advice. Drafts are AI-assisted:
            read every agreement before you sign it, and talk to a qualified lawyer
            for anything high-stakes. © {new Date().getFullYear()} AgreeMint.
          </p>
        </div>
      </footer>
    </main>
  );
}
