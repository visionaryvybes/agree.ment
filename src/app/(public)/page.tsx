'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, ChatCircleText, PenNib, Seal, CurrencyDollar,
  Briefcase, Handshake, House, PawPrint, Wrench,
} from '@phosphor-icons/react';

// ── Content ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: '01',
    icon: ChatCircleText,
    title: 'Say what you agreed',
    desc: 'Type it in plain words — or paste the WhatsApp chat where you hashed it out. No legal vocabulary required.',
  },
  {
    n: '02',
    icon: PenNib,
    title: 'Get a proper document',
    desc: 'AgreeMint drafts clear, complete terms: who, what, how much, by when, and what happens if things go sideways.',
  },
  {
    n: '03',
    icon: Seal,
    title: 'Both of you sign',
    desc: 'Share a link. Each party reviews and signs from any device. Everyone keeps a copy, nobody "remembers it differently."',
  },
];

const CLAUSES = [
  { n: '1.1', title: 'Plain language first', desc: 'Every agreement reads like a human wrote it. The legal structure is there; the jargon is not.' },
  { n: '1.2', title: 'Chat-to-contract', desc: 'Paste the conversation where you made the deal. We pull out the terms and quote the source messages.' },
  { n: '1.3', title: 'Jurisdiction aware', desc: 'Tell us where you are and the draft references your local legal framework, with warnings where rules differ.' },
  { n: '2.1', title: 'Signatures that stick', desc: 'Draw or type a signature, timestamped, with both parties on record. Export the signed PDF anytime.' },
  { n: '2.2', title: 'Payment tracking', desc: 'Milestones, due dates, and amounts live inside the agreement — so "did they pay yet?" has an answer.' },
  { n: '2.3', title: 'If things go wrong', desc: 'A step-by-step path from friendly reminder to formal demand letter, so a bad deal never catches you unprepared.' },
];

const USE_CASES = [
  { icon: CurrencyDollar, title: 'The loan to a friend', desc: '"I\'ll pay you back next month." Get it on paper before it costs you a friendship.' },
  { icon: Briefcase, title: 'The freelance gig', desc: 'Scope, rate, deadline, revisions. Agreed before the work starts — paid after it ends.' },
  { icon: Handshake, title: 'The private sale', desc: 'Car, laptop, camera. A bill of sale that protects both sides of the handshake.' },
  { icon: House, title: 'The roommate deal', desc: 'Rent split, bills, guests, moving out. The talk everyone avoids, written down once.' },
  { icon: Wrench, title: 'The borrowed gear', desc: 'Lending tools, cameras, or your car? Say what happens if it comes back broken.' },
  { icon: PawPrint, title: 'The pet sitter', desc: 'Feeding, vet emergencies, house keys. Everything the group chat forgot to cover.' },
];

// ── Motion helper ─────────────────────────────────────────────────────────

function rise(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ground text-ink">

      {/* ── Nav ── */}
      <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
        <nav className="max-w-5xl mx-auto flex items-center justify-between liquid-gloss rounded-2xl px-5 py-3 shadow-[var(--shadow-sheet)]">
          <Link href="/" className="text-xl">
            <span className="brand-agree">Agree</span>
            <span className="brand-mint">Mint</span>
          </Link>
          <div className="hidden sm:flex items-center gap-7 text-sm text-ink-2">
            <a href="#how" className="hover:text-ink transition-colors">How it works</a>
            <a href="#terms-of-us" className="hover:text-ink transition-colors">What you get</a>
            <a href="#uses" className="hover:text-ink transition-colors">Use cases</a>
          </div>
          <Link href="/dashboard" className="btn-vibrant btn-vibrant-emerald">
            Open the app <ArrowRight size={15} weight="bold" />
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-24 px-4 overflow-hidden">
        <div className="vibrant-glow w-[600px] h-[400px] bg-mint top-0 left-1/2 -translate-x-1/2" />
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">

          <div>
            <motion.p {...rise(0)} className="font-mono text-[11px] tracking-[0.25em] uppercase text-mint mb-6">
              Agreements for everyday deals
            </motion.p>
            <motion.h1 {...rise(0.08)} className="heading-display text-[clamp(2.6rem,6vw,4.3rem)] text-ink">
              A handshake is a memory.
              <br />
              <em className="text-mint">Paper is a fact.</em>
            </motion.h1>
            <motion.p {...rise(0.16)} className="mt-6 text-lg text-ink-2 leading-relaxed max-w-md">
              Describe the deal in your own words — or paste the chat where you
              made it — and get a clear, signable agreement both of you can
              live with. Minutes, not lawyers.
            </motion.p>
            <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/contracts/new" className="btn-vibrant btn-vibrant-emerald !px-6 !py-3.5 !text-base">
                Draft your first agreement
              </Link>
              <a href="#how" className="btn-secondary px-6 py-3.5 text-base">
                See how it works
              </a>
            </motion.div>
            <motion.p {...rise(0.3)} className="mt-5 text-xs text-ink-3">
              Free to start. No card required. Not a law firm — see the fine print below (we actually want you to read it).
            </motion.p>
          </div>

          {/* Typeset contract sheet */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 1.2 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden md:block"
          >
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-md bg-ink/[0.06]" />
            <div className="relative bg-card border border-line rounded-md p-8 shadow-[var(--shadow-lift)]">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-3">Loan Agreement · No. 0001</p>
              <h3 className="heading-display text-2xl mt-3">Maya lends Jonas $600</h3>
              <div className="mt-5 space-y-4 text-[13px] leading-relaxed text-ink-2">
                <p><span className="font-mono text-mint mr-2">1.</span>Jonas repays $200 on the first of each month, starting August 1st.</p>
                <p><span className="font-mono text-mint mr-2">2.</span>No interest — this is between friends. Late by 14 days? They talk first.</p>
                <p><span className="font-mono text-mint mr-2">3.</span>Fully repaid by October 1st, and this agreement ends with dinner on Jonas.</p>
              </div>
              <div className="mt-7 pt-5 border-t border-dashed border-line-strong grid grid-cols-2 gap-6">
                <div>
                  <p className="font-display italic text-xl text-ink">Maya K.</p>
                  <p className="mt-1 h-px bg-line-strong" />
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-widest text-ink-3">Lender</p>
                </div>
                <div>
                  <p className="font-display italic text-xl text-ink">Jonas T.</p>
                  <p className="mt-1 h-px bg-line-strong" />
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-widest text-ink-3">Borrower</p>
                </div>
              </div>
              {/* Mint seal */}
              <div className="absolute -right-5 -bottom-5 w-20 h-20 rounded-full bg-mint text-paper flex items-center justify-center rotate-[-12deg] shadow-[var(--shadow-lift)]">
                <div className="text-center leading-tight">
                  <Seal size={22} weight="fill" className="mx-auto" />
                  <p className="font-mono text-[8px] tracking-[0.15em] mt-0.5">AGREED</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-24 px-4 border-t border-line bg-wash/60">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...rise()} className="heading-display text-3xl sm:text-4xl">
            Three steps. <em className="text-mint">No homework.</em>
          </motion.h2>
          <div className="mt-14 grid md:grid-cols-3 gap-10">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...rise(i * 0.1)} className="relative">
                <p className="font-display italic text-[64px] leading-none text-ink/[0.08] select-none">{s.n}</p>
                <s.icon size={26} className="text-mint -mt-6" weight="duotone" />
                <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get, written as clauses ── */}
      <section id="terms-of-us" className="py-24 px-4 border-t border-line">
        <div className="max-w-5xl mx-auto">
          <motion.div {...rise()}>
            <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-mint">Our terms, to you</p>
            <h2 className="heading-display text-3xl sm:text-4xl mt-3">
              What AgreeMint agrees to do
            </h2>
          </motion.div>
          <div className="mt-12 grid sm:grid-cols-2 gap-x-14 gap-y-9">
            {CLAUSES.map((c, i) => (
              <motion.div key={c.n} {...rise(i * 0.06)} className="flex gap-4 border-b border-dashed border-line pb-7">
                <span className="font-mono text-sm text-mint pt-0.5">{c.n}</span>
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section id="uses" className="py-24 px-4 border-t border-line bg-wash/60">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...rise()} className="heading-display text-3xl sm:text-4xl">
            Deals people <em className="text-mint">actually make</em>
          </motion.h2>
          <p className="mt-4 text-ink-2 max-w-lg">
            Not mergers. Not IPOs. The everyday promises between real people that
            deserve more protection than a text message.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {USE_CASES.map((u, i) => (
              <motion.div
                key={u.title}
                {...rise(i * 0.06)}
                className="group bg-card border border-line rounded-lg p-6 shadow-[var(--shadow-sheet)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-1 transition-all duration-300"
              >
                <u.icon size={24} weight="duotone" className="text-mint" />
                <h3 className="mt-4 font-semibold">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 px-4 border-t border-line relative overflow-hidden">
        <div className="vibrant-glow w-[500px] h-[300px] bg-mint bottom-0 left-1/2 -translate-x-1/2" />
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 {...rise()} className="heading-display text-4xl sm:text-5xl">
            Shake on it.
            <br />
            <em className="text-mint">Then sign it.</em>
          </motion.h2>
          <motion.div {...rise(0.12)} className="mt-9">
            <Link href="/contracts/new" className="btn-vibrant btn-vibrant-emerald !px-8 !py-4 !text-base">
              Start your agreement <ArrowRight size={17} weight="bold" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-4 border-t border-line bg-wash/60">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Link href="/" className="text-lg">
              <span className="brand-agree">Agree</span>
              <span className="brand-mint">Mint</span>
            </Link>
            <div className="flex gap-6 text-sm text-ink-2">
              <Link href="/terms" className="hover:text-ink transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
            </div>
          </div>
          <p className="mt-8 text-xs leading-relaxed text-ink-3 max-w-2xl">
            The fine print, in plain sight: AgreeMint is a self-help document tool,
            not a law firm, and nothing here is legal advice. Drafts are AI-assisted —
            read every agreement before you sign it, and talk to a qualified lawyer
            for anything high-stakes. © {new Date().getFullYear()} AgreeMint.
          </p>
        </div>
      </footer>
    </main>
  );
}
