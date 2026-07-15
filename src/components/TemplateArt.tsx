"use client";

/**
 * TemplateArt — the visual identity of the card catalog.
 *
 * templateIcon()     phosphor icon for a template (no emoji in this office).
 * TemplateDocument   the REAL document, rendered in full: actual title,
 *                    actual clause text, the fields as fill-in blanks, and
 *                    a signature block. What you see is what you sign.
 * TemplateThumb      the same document, scaled down for the catalog —
 *                    like a template gallery, the picture IS the template.
 */

import type { Icon } from "@phosphor-icons/react";
import {
  ChatCircleText, FileLock, Car, VideoCamera, Champagne, PaintBrush,
  HandCoins, Handshake, HouseLine, Package, Receipt, Scales,
  Wrench, PawPrint, Lightning, Camera, GasPump, Storefront, FileText,
  Bed, ChalkboardTeacher, Hammer, Confetti, DeviceMobile, ImageSquare,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ── Icon assignment ────────────────────────────────────────────────────────

const ICON_BY_ID: Record<string, Icon> = {
  "tpl-conversation": ChatCircleText,
  "tpl-nda-formal": FileLock,
  "tpl-car-sale": Car,
  "tpl-social-media": VideoCamera,
  "tpl-wedding-vendor": Champagne,
  "tpl-art-commission": PaintBrush,
  "tpl-loan-personal": HandCoins,
  "tpl-partnership-simple": Handshake,
  "tpl-house-sitting": HouseLine,
  "tpl-equipment-rental": Package,
  "tpl-invoice-formal": Receipt,
  "tpl-legal-demand": Scales,
  "tpl-tool-loan": Wrench,
  "tpl-pet-care": PawPrint,
  "tpl-freelance-help": Lightning,
  "tpl-borrow-gear": Camera,
  "tpl-ride-share": GasPump,
  "tpl-side-hustle": Storefront,
  "tpl-room-rental": Bed,
  "tpl-tutoring": ChalkboardTeacher,
  "tpl-home-repair": Hammer,
  "tpl-event-split": Confetti,
  "tpl-crypto-goods": DeviceMobile,
  "tpl-content-license": ImageSquare,
};

const ICON_BY_CATEGORY: Record<string, Icon> = {
  personal: Handshake, business: Receipt, creative: PaintBrush,
  nda: FileLock, loan: HandCoins, partnership: Handshake,
  sale: Storefront, rental: Package, event: Champagne, legal: Scales,
};

export function templateIcon(t: { id?: string; category?: string }): Icon {
  return ICON_BY_ID[t.id ?? ""] ?? ICON_BY_CATEGORY[t.category ?? ""] ?? FileText;
}

// Accent per category — one hue owns each drawer of the catalog
const TONE: Record<string, { text: string; border: string }> = {
  personal:    { text: "text-mint",  border: "border-mint" },
  business:    { text: "text-blue",  border: "border-blue" },
  creative:    { text: "text-rose",  border: "border-rose" },
  nda:         { text: "text-amber", border: "border-amber" },
  loan:        { text: "text-amber", border: "border-amber" },
  partnership: { text: "text-blue",  border: "border-blue" },
  sale:        { text: "text-mint",  border: "border-mint" },
  rental:      { text: "text-rose",  border: "border-rose" },
  event:       { text: "text-rose",  border: "border-rose" },
  legal:       { text: "text-amber", border: "border-amber" },
};

export function templateTone(category?: string) {
  return TONE[category ?? ""] ?? { text: "text-ink-3", border: "border-line-strong" };
}

// ── The document itself, rendered honestly ────────────────────────────────

/**
 * The full document at natural size (600px wide). Everything on it is the
 * template's real content — actual clauses, actual field labels.
 */
export function TemplateDocument({ t, className }: { t: any; className?: string }) {
  const tone = templateTone(t.category);
  const ref = (t.id ?? "custom").replace("tpl-", "").slice(0, 14).toUpperCase();
  const clauses: any[] = t.clauses ?? [];
  const fields: any[] = t.fields ?? [];
  const parties = fields.filter((f) =>
    /name|party|sender|receiver|artist|client|brand|creator|seller|buyer|vendor|lender|borrower|owner|sitter|partner/i.test(f.id + f.label)
  ).slice(0, 2);
  const sigA = parties[0]?.label ?? "First party";
  const sigB = parties[1]?.label ?? "Second party";

  return (
    <article
      className={cn(
        "bg-elevated text-ink border border-line-strong w-[600px] px-12 py-10",
        "font-sans leading-relaxed select-none",
        className
      )}
      style={{ fontSize: 13 }}
      aria-label={`Preview of the ${t.name} template`}
    >
      {/* Letterhead */}
      <header className="flex items-start justify-between pb-4 border-b-2 border-ink/70">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-3">
            AgreeMint · Everyday agreements, in writing
          </p>
          <h1 className="heading-display uppercase text-[26px] leading-[1.02] mt-2 max-w-[380px]">
            {t.name}
          </h1>
        </div>
        <div className={cn("text-right font-mono text-[9px] uppercase tracking-[0.2em] leading-relaxed", tone.text)}>
          <p>Template {ref}</p>
          
        </div>
      </header>

      {/* Recital — the template's real preview text */}
      {t.preview && (
        <p className="mt-5 text-[12.5px] text-ink-2 italic border-l-2 border-line-strong pl-4">
          {t.preview}
        </p>
      )}

      {/* Particulars — the real fields as a fill-in box */}
      {fields.length > 0 && (
        <section className="mt-6">
          <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-ink-3">
            Your details
          </h2>
          <div className="mt-2 border border-ink/25 divide-y divide-ink/15">
            {fields.map((f) => (
              <div key={f.id} className="grid grid-cols-[160px_1fr] items-baseline gap-4 px-3 py-2">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.15em] text-ink-2">
                  {f.label}
                  {f.required && <span className={tone.text}> *</span>}
                </span>
                <span className="border-b border-dashed border-ink/30 text-[11px] text-ink-3 pb-0.5 min-h-[1.2em]">
                  {f.type === "select" && f.options ? `☐ ${f.options.slice(0, 3).join("   ☐ ")}` : " "}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Terms — the real clauses, in full */}
      {clauses.length > 0 && (
        <section className="mt-6">
          <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-ink-3">
            Terms
          </h2>
          <ol className="mt-2 space-y-3">
            {clauses.map((c, i) => (
              <li key={c.id ?? i} className="grid grid-cols-[34px_1fr] gap-2">
                <span className={cn("font-mono text-[11px] font-bold pt-[1px]", tone.text)}>
                  {i + 1}.
                </span>
                <div>
                  <h3 className="font-bold text-[12.5px] uppercase tracking-wide">
                    {c.title}
                    {c.isRequired === false && (
                      <span className="ml-2 font-mono text-[8px] font-medium text-ink-3 tracking-[0.15em]">OPTIONAL</span>
                    )}
                  </h3>
                  <p className="text-[12px] text-ink-2 mt-0.5">{c.content}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Execution block */}
      <footer className="mt-8 pt-5 border-t-2 border-dashed border-ink/30">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-3">
          Agreed and signed
        </p>
        <div className="mt-5 grid grid-cols-2 gap-10">
          {[sigA, sigB].map((n) => (
            <div key={n}>
              <div className="h-8" />
              <div className="border-t border-ink/60" />
              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-2">{n}</span>
                <span className="font-mono text-[9px] text-ink-3">Date</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[9px] text-ink-3 leading-relaxed">
          Drafted with AgreeMint. This template is a starting point, not legal advice —
          read every term before signing, and consult a qualified lawyer for anything high-stakes.
        </p>
      </footer>
    </article>
  );
}

// ── Catalog thumbnail: the same document, scaled down ─────────────────────

export function TemplateThumb({ t, className }: { t: any; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden bg-wash border-b border-line-strong h-[210px]",
        className
      )}
    >
      {/* desk surface */}
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:12px_12px] text-ink" />
      {/* the actual document, scaled — top of page visible, like a gallery */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 shadow-[var(--shadow-sheet)] transition-transform duration-300 group-hover:-translate-y-1.5">
        <div className="origin-top scale-[0.44]" style={{ width: 600, height: 470 }}>
          <TemplateDocument t={t} />
        </div>
      </div>
      {/* bottom fade into the card, so the crop reads as intentional */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--bg-subtle)] to-transparent pointer-events-none" />
    </div>
  );
}
