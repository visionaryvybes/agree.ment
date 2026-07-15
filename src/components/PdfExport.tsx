"use client";

import { FilePdf, Printer } from '@phosphor-icons/react';
import type { Contract } from '@/lib/types';

interface PdfExportProps {
  contract: Contract;
}

/** Opens a typeset print view of the agreement; the system dialog saves it as a real PDF. */
function buildDocumentHtml(c: Contract) {
  const esc = (s: string) =>
    String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const date = (d: any) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${esc(c.title)}</title>
<style>
  @page { margin: 25mm 22mm; }
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    color: #1c1917; line-height: 1.75; font-size: 12.5pt;
    max-width: 660px; margin: 0 auto; padding: 24px;
  }
  .ref { font-family: 'Courier New', monospace; font-size: 8.5pt; letter-spacing: 0.18em; text-transform: uppercase; color: #7d766d; }
  h1 { font-size: 25pt; font-weight: 600; letter-spacing: -0.01em; margin: 10px 0 4px; line-height: 1.15; }
  .rule { border: none; border-top: 2px solid #1c1917; margin: 18px 0 22px; }
  h2 { font-size: 9.5pt; font-family: 'Courier New', monospace; letter-spacing: 0.22em; text-transform: uppercase; color: #7d766d; border-bottom: 1px solid #d8d2c4; padding-bottom: 5px; margin: 30px 0 12px; font-weight: 600; }
  .clause { margin-bottom: 16px; page-break-inside: avoid; }
  .clause b { display: block; margin-bottom: 2px; }
  .num { font-family: 'Courier New', monospace; color: #10775e; margin-right: 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 11.5pt; }
  td { padding: 6px 0; border-bottom: 1px dashed #d8d2c4; vertical-align: top; }
  td:last-child { text-align: right; font-family: 'Courier New', monospace; font-size: 10.5pt; }
  .sigs { display: flex; gap: 48px; margin-top: 44px; page-break-inside: avoid; }
  .sig { flex: 1; }
  .sig .name { font-style: italic; font-size: 15pt; min-height: 44px; display: flex; align-items: flex-end; }
  .sig .line { border-top: 1.5px solid #1c1917; margin-top: 4px; padding-top: 5px; }
  .sig img { max-height: 44px; }
  .foot { margin-top: 40px; font-size: 8.5pt; color: #7d766d; border-top: 1px solid #d8d2c4; padding-top: 12px; line-height: 1.6; }
</style>
</head>
<body>
  <p class="ref">${esc(c.category)} agreement · ${esc(c.jurisdiction || 'General')} · Filed ${date(c.createdAt)}</p>
  <h1>${esc(c.title)}</h1>
  ${c.description ? `<p style="color:#453f39">${esc(c.description)}</p>` : ''}
  <hr class="rule">

  <h2>Parties</h2>
  ${c.parties.map(p => `<p><b>${esc(p.name)}</b> — ${esc(p.role)}${p.email ? ` · ${esc(p.email)}` : ''}${p.signedAt ? ` · signed ${date(p.signedAt)}` : ''}</p>`).join('')}

  ${c.totalAmount ? `<h2>Value</h2><p>${esc(c.currency)} ${c.totalAmount.toLocaleString()}</p>` : ''}

  <h2>Terms</h2>
  ${c.clauses.map((cl, i) => `
    <div class="clause">
      <b><span class="num">${i + 1}.</span>${esc(cl.title)}</b>
      ${esc(cl.content)}
    </div>`).join('')}

  ${c.paymentSchedule?.length ? `
  <h2>Payment schedule</h2>
  <table>
    ${c.paymentSchedule.map(p => `<tr><td>Due ${date(p.dueDate)}${p.note ? ` — ${esc(p.note)}` : ''}</td><td>${esc(p.currency)} ${p.amount.toLocaleString()} · ${esc(p.status)}</td></tr>`).join('')}
  </table>` : ''}

  <h2>Signatures</h2>
  <div class="sigs">
    ${c.parties.map(p => `
      <div class="sig">
        <div class="name">${p.signatureData?.startsWith('data:image/') ? `<img src="${p.signatureData}" alt="signature">` : ''}</div>
        <div class="line">
          <div>${esc(p.name)}</div>
          <div class="ref">${esc(p.role)}${p.signedAt ? ` · ${date(p.signedAt)}` : ' · unsigned'}</div>
        </div>
      </div>`).join('')}
  </div>

  <div class="foot">
    Document ${esc(c.id)} · Governed by ${esc(c.governingLaw || 'general contract law')} ·
    Prepared with AgreeMint on ${new Date().toLocaleDateString()}.
    AgreeMint is a self-help document tool, not a law firm; this document is not legal advice.
  </div>
  <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
</body>
</html>`;
}

export default function PdfExport({ contract }: PdfExportProps) {
  const handleExport = () => {
    const blob = new Blob([buildDocumentHtml(contract)], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'width=800,height=1000');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <div className="space-y-6">
      {/* Document proof */}
      <div className="border border-line rounded-[3px] bg-card p-6 shadow-[var(--shadow-sheet)]">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-3">
          {contract.jurisdiction || 'General'} · {new Date(contract.createdAt).toLocaleDateString()}
        </p>
        <h3 className="mt-2 font-display text-xl text-ink leading-snug">{contract.title}</h3>
        <p className="mt-3 pt-3 border-t border-dashed border-line font-mono text-[10px] text-ink-3 tabular-nums">
          {contract.clauses.length} clauses · {contract.parties.length} parties
          {contract.totalAmount ? ` · ${contract.currency} ${contract.totalAmount.toLocaleString()}` : ''}
        </p>
      </div>

      <button
        onClick={handleExport}
        className="btn-vibrant btn-vibrant-emerald w-full !py-3.5"
      >
        <FilePdf size={18} weight="duotone" /> Open print-ready document
      </button>

      <p className="flex items-start gap-2 text-xs text-ink-3 leading-relaxed">
        <Printer size={14} className="flex-shrink-0 mt-0.5" />
        A typeset copy opens with the print dialog — choose “Save as PDF” to download it.
        Signatures already collected are included on the signature lines.
      </p>
    </div>
  );
}
