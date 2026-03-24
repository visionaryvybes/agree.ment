import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="bg-[var(--bg)] min-h-screen selection:bg-[var(--text-1)] selection:text-[var(--bg)] pt-32 pb-40 px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-block btn-secondary px-6 py-2 text-[10px] mb-12 no-underline text-[var(--text-1)] font-black uppercase tracking-widest">
          &larr; Return Home
        </Link>
        <h1 className="heading-display mb-12">Terms of Service.</h1>
        <div className="glass-card bg-transparent p-12 border space-y-8">
          <p className="text-xl font-bold leading-relaxed text-[var(--text-2)]">
            Standard Operating Procedures and liability contracts for nodes connected to the AgreeMint architecture.
          </p>
          <div className="w-full h-1 bg-[var(--text-1)] my-8" />
          {/* Termly Placeholder */}
          <div className="bg-[var(--bg)] p-12 border border-dashed border-[var(--text-3)] text-center text-[var(--text-3)] font-black uppercase tracking-widest text-xs">
            [ Termly Integration Header ]
            <br /><br />
            Terms of Service provisioned via Termly framework.
          </div>
        </div>
      </div>
    </div>
  );
}
