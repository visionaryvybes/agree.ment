"use client";

import { ArrowCounterClockwise } from "@phosphor-icons/react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-ground text-ink flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-rose">
          Incident report{error.digest ? ` · Ref ${error.digest.slice(0, 8)}` : ""}
        </p>
        <h1 className="heading-display uppercase text-5xl sm:text-6xl mt-4">
          The clerk
          <br />
          dropped the file.
        </h1>
        <p className="mt-6 text-ink-2 leading-relaxed">
          Something on our side went wrong — your agreements are safe, this page
          just failed to assemble. Try again; if it keeps happening, come back
          in a few minutes.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <button onClick={reset} className="btn-vibrant btn-vibrant-emerald">
            <ArrowCounterClockwise size={15} weight="bold" /> Try again
          </button>
          <Link href="/dashboard" className="btn-secondary px-5 py-2.5 text-xs">
            Back to the ledger
          </Link>
        </div>
      </div>
    </main>
  );
}
