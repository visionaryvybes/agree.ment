import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ground text-ink flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-mint">
          Registry search · No result
        </p>
        <h1 className="heading-display uppercase text-6xl sm:text-7xl mt-4">
          No such
          <br />
          <span className="inline-block bg-mint text-paper px-3 -rotate-1 shadow-[4px_4px_0_var(--shadow-ink)] mt-1">
            file.
          </span>
        </h1>
        <p className="mt-6 text-ink-2 leading-relaxed">
          We checked every drawer. Whatever was filed at this address has been
          moved, settled, or never existed — which, around here, means it
          doesn&apos;t count.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href="/dashboard" className="btn-vibrant btn-vibrant-emerald">
            Back to the ledger
          </Link>
          <Link href="/" className="btn-secondary px-5 py-2.5 text-xs">
            Front desk
          </Link>
        </div>
      </div>
    </main>
  );
}
