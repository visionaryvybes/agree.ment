/**
 * Deterministic fallback engine.
 * When no AI key is configured (or the provider errors), these builders
 * produce solid, lawyer-recognizable boilerplate so every flow still
 * works end-to-end. With AI_API_KEY set, routes use the model instead.
 */

export const hasAI = () => Boolean(process.env.AI_API_KEY);

// ── Contract generation ───────────────────────────────────────────────────

interface GenInput {
  prompt?: string;
  party1?: string;
  party2?: string;
  jurisdiction?: string;
  category?: string;
}

export function fallbackContract({ prompt, party1, party2, jurisdiction, category }: GenInput) {
  const a = party1?.trim() || 'Party A';
  const b = party2?.trim() || 'Party B';
  const where = jurisdiction?.trim() || 'the jurisdiction where this agreement is signed';
  const kind = (category || 'general').toLowerCase();
  const deal = prompt?.trim() || `a ${kind} arrangement between ${a} and ${b}`;

  const money = /loan|sale|service|freelance|rent|invoice|payment|\$|£|€/i.test(`${kind} ${deal}`);

  const clauses = [
    {
      title: 'What this agreement covers',
      content: `${a} and ${b} agree to the following arrangement: ${deal}. Both parties confirm they enter this agreement freely and intend it to be binding.`,
      isRequired: true,
    },
    {
      title: 'Each side’s obligations',
      content: `${a} and ${b} will each carry out their side of the arrangement described above, honestly and within any timelines stated. Neither party may transfer their obligations to someone else without the other’s written consent.`,
      isRequired: true,
    },
    ...(money
      ? [{
          title: 'Payment terms',
          content: `Any amounts owed under this agreement are to be paid in full, by the dates agreed, using a payment method both parties accept. Each payment should be acknowledged in writing (a message counts). If a payment is late by more than 14 days, the other party may send a formal reminder before taking further steps.`,
          isRequired: true,
        }]
      : []),
    {
      title: 'Changes to this agreement',
      content: 'Any change to these terms only counts if both parties agree to it in writing. A dated message or email in which both parties clearly agree is acceptable.',
      isRequired: true,
    },
    {
      title: 'If something goes wrong',
      content: `If either party fails to keep their side of the deal, the other should first raise it directly and allow 14 days to fix the issue. If it is not resolved, the parties agree to attempt good-faith negotiation or mediation before any court action.`,
      isRequired: true,
    },
    {
      title: 'Ending the agreement',
      content: 'This agreement ends when both sides have fully performed their obligations, or earlier if both parties agree in writing to end it. Obligations that have already accrued (such as unpaid amounts) survive the end of the agreement.',
      isRequired: true,
    },
    {
      title: 'Governing law',
      content: `This agreement is governed by the laws of ${where}. Any dispute that cannot be resolved between the parties will be handled in the courts of ${where}.`,
      isRequired: true,
    },
    {
      title: 'Entire agreement',
      content: 'This document is the complete agreement between the parties on this matter and replaces any earlier spoken or written arrangements about it.',
      isRequired: true,
    },
  ];

  return {
    title: `${cap(kind)} agreement — ${a} & ${b}`,
    type: kind,
    summary: `${a} and ${b} agree to: ${deal}. This document sets out the obligations, ${money ? 'payment terms, ' : ''}remedies, and governing law (${where}).`,
    jurisdiction: where,
    governingLaw: `Laws of ${where}`,
    parties: [
      { name: a, role: 'First party' },
      { name: b, role: 'Second party' },
    ],
    clauses,
    legalWarnings: [
      'This draft was assembled from standard clauses, not reviewed by a lawyer.',
      `Requirements vary by jurisdiction — confirm anything high-stakes against the rules in ${where}.`,
    ],
    recommendedSteps: [
      'Read every clause together before signing.',
      'Fill in exact amounts and dates rather than leaving them vague.',
      'Both parties keep a signed copy.',
    ],
    paymentTerms: money ? 'As set out in the Payment terms clause.' : undefined,
    duration: undefined,
  };
}

// ── Contract analysis ─────────────────────────────────────────────────────

export function fallbackAnalysis(text: string) {
  const t = text.toLowerCase();
  const has = (re: RegExp) => re.test(t);

  const checks = [
    { key: 'parties',     ok: has(/between|parties|party a|undersigned/), miss: 'Clear identification of the parties' },
    { key: 'payment',     ok: has(/pay|amount|\$|£|€|fee|price|rent/),    miss: 'Payment amount and due dates' },
    { key: 'termination', ok: has(/terminat|end of|expiry|expire|cancel/), miss: 'How and when the agreement ends' },
    { key: 'dispute',     ok: has(/dispute|mediat|arbitrat|court/),        miss: 'A dispute-resolution path' },
    { key: 'governing',   ok: has(/governing law|laws of|jurisdiction/),   miss: 'Governing law / jurisdiction clause' },
    { key: 'signature',   ok: has(/sign|signature|executed/),              miss: 'Signature blocks for both parties' },
    { key: 'dates',       ok: has(/\b(20\d{2}|january|february|march|april|may|june|july|august|september|october|november|december)\b/), miss: 'Concrete dates' },
  ];

  const present = checks.filter(c => c.ok);
  const missing = checks.filter(c => !c.ok).map(c => c.miss);
  const wordCount = text.split(/\s+/).length;

  const completeness = Math.round((present.length / checks.length) * 100);
  const clarity = Math.max(30, Math.min(90, 100 - Math.floor(wordCount / 120)));
  const enforceability = Math.min(90, completeness - 5 + (has(/governing law|laws of/) ? 10 : 0));
  const fairness = has(/sole discretion|non-negotiable|waive[sd]? all/) ? 45 : 70;
  const overallScore = Math.round((completeness + clarity + Math.max(0, enforceability) + fairness) / 4);

  const grade =
    overallScore >= 90 ? 'A' : overallScore >= 80 ? 'A-' : overallScore >= 72 ? 'B+' :
    overallScore >= 64 ? 'B' : overallScore >= 55 ? 'C+' : overallScore >= 45 ? 'C' : 'D';

  const redFlags = [
    ...(has(/sole discretion/) ? [{ severity: 'high' as const, title: 'One-sided discretion', description: 'The phrase “sole discretion” appears — one party can decide things unilaterally. Ask exactly what it covers.' }] : []),
    ...(has(/waive[sd]? (all|any)/) ? [{ severity: 'high' as const, title: 'Rights being waived', description: 'The text asks a party to waive rights. Make sure you know which ones and whether that is normal for this kind of deal.' }] : []),
    ...(has(/auto[- ]?renew/) ? [{ severity: 'medium' as const, title: 'Automatic renewal', description: 'The agreement renews automatically. Check the notice window for opting out.' }] : []),
    ...(!has(/terminat|cancel/) ? [{ severity: 'medium' as const, title: 'No exit door', description: 'There is no clear way to end the agreement. Ask how either side can walk away, and what it costs.' }] : []),
    ...(!has(/\$|£|€|amount/) ? [{ severity: 'low' as const, title: 'No concrete numbers', description: 'No amounts are stated. Vague money terms are the most common source of disputes.' }] : []),
  ];

  return {
    overallScore,
    grade,
    summary: `A ${wordCount}-word document. It covers ${present.length} of ${checks.length} fundamentals a basic agreement should have${missing.length ? `, but is missing: ${missing.slice(0, 2).join(', ').toLowerCase()}${missing.length > 2 ? ', and more' : ''}` : ''}. (Standard reading — connect an AI engine in Settings for a deeper clause-by-clause review.)`,
    scores: { clarity, enforceability: Math.max(0, enforceability), completeness, fairness },
    redFlags,
    missingClauses: missing,
    strengths: present.map(c => ({
      parties: 'The parties are identified.',
      payment: 'Money terms are mentioned.',
      termination: 'There is an ending/termination provision.',
      dispute: 'A dispute-resolution path exists.',
      governing: 'Governing law is stated.',
      signature: 'Signature blocks are present.',
      dates: 'Concrete dates appear in the text.',
    }[c.key] as string)),
    recommendations: [
      ...missing.map(m => `Add: ${m.toLowerCase()}.`),
      'Replace vague phrases (“soon”, “reasonable”) with dates and numbers.',
    ].slice(0, 5),
    contractType: undefined,
    parties: undefined,
  };
}

// ── Conversation parsing ──────────────────────────────────────────────────

export function fallbackParse(conversation: string, party1?: string, party2?: string) {
  const amountMatch = conversation.match(/(?:\$|£|€|USD|KES|NGN|GHS)\s?([\d,]+(?:\.\d{1,2})?)/i);
  const amount = amountMatch ? amountMatch[0] : null;

  return {
    title: `Agreement from conversation — ${party1 || 'Party A'} & ${party2 || 'Party B'}`,
    category: 'personal',
    extractedTerms: {
      amount,
      currency: amount?.startsWith('$') ? 'USD' : undefined,
      purpose: conversation.slice(0, 140),
      paymentSchedule: null,
      startDate: null,
      deadline: null,
      specialConditions: [],
    },
    parties: [party1 || 'Party A', party2 || 'Party B'].filter(Boolean),
    confidence: 'low',
    missingInfo: [
      'Exact amounts and dates (auto-extraction is basic without an AI engine)',
      'Each party’s precise obligations',
      'What happens if someone does not follow through',
    ],
    clauses: [
      {
        title: 'The conversation, made official',
        content: `The parties discussed and agreed to the following, reproduced from their conversation: “${conversation.slice(0, 500)}${conversation.length > 500 ? '…' : ''}”`,
        isRequired: true,
        sourceQuote: conversation.slice(0, 200),
      },
      {
        title: 'Confirmation',
        content: 'Both parties confirm the conversation above reflects what they agreed, and sign to make it binding.',
        isRequired: true,
      },
    ],
    legalNote: 'Standard extraction only — connect an AI engine for precise term extraction with quoted sources.',
  };
}

// ── Jurisdiction primer ───────────────────────────────────────────────────

export function fallbackJurisdiction(country: string) {
  return {
    country,
    legalFramework: 'Varies — most jurisdictions follow common law, civil law, or a mixed system.',
    enforceability: [
      'A written agreement signed by both parties is enforceable in nearly every jurisdiction.',
      'Clear terms (who, what, how much, by when) matter more than legal vocabulary.',
      'Some contract types (land, marriage, large sums) may require notarization or witnesses locally.',
    ],
    keyArticles: [],
    regionalInsight: `Live jurisdiction briefings for ${country} require an AI engine (add a key in your environment). The general principles above hold almost everywhere.`,
    warning: 'Confirm local formality requirements (witnesses, stamps, notarization) for high-value agreements.',
  };
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
