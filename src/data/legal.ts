/**
 * Country legal reference for everyday agreements.
 *
 * Three layers, so every one of the 195 countries gets something useful:
 *  1. LEGAL_FAMILY  — every country classified by legal tradition; the family
 *     drives sensible defaults about what makes a contract bind.
 *  2. ESIGN_LAWS    — the named statute that recognizes electronic signatures,
 *     for ~60 countries (EU/EEA members inherit eIDAS automatically).
 *  3. COUNTRY_NOTES — hand-written notes for major countries, keyed to the
 *     kinds of deals our templates cover.
 *
 * This is orientation, not legal advice — every screen that renders it says so.
 */

export type LegalFamily = 'common' | 'civil' | 'mixed' | 'religious';

export const FAMILY_INFO: Record<LegalFamily, {
  name: string;
  gist: string;
  contractBasics: string[];
}> = {
  common: {
    name: 'Common law',
    gist: 'Judge-made law in the English tradition. Contracts need offer, acceptance, and "consideration" — each side must give something.',
    contractBasics: [
      'Most everyday contracts are valid without any special form — even oral ones. Writing is for proof, not validity.',
      'Both sides must exchange something of value ("consideration") — a one-way promise is hard to enforce.',
      'Certain deals (land, long leases, guarantees) usually must be in writing by statute.',
    ],
  },
  civil: {
    name: 'Civil law',
    gist: 'Codified law in the continental tradition. The civil code spells out how contracts form and what terms are implied.',
    contractBasics: [
      'A contract binds on consent alone — no "consideration" requirement, but the purpose must be lawful.',
      'The civil code implies many protective terms automatically; you cannot always contract out of them.',
      'Notarization or written form is mandatory for specific categories (commonly real estate and family matters).',
    ],
  },
  mixed: {
    name: 'Mixed system',
    gist: 'A blend of traditions — typically civil or customary law combined with common law or religious law.',
    contractBasics: [
      'Everyday contract rules usually follow one dominant tradition; check which one covers private agreements.',
      'Written agreements with both signatures are respected across all the blended traditions — the safest form.',
      'Local or customary rules can add requirements (witnesses, community procedures) for some deals.',
    ],
  },
  religious: {
    name: 'Religious-law system',
    gist: 'Religious law (typically Sharia) is a primary source. Commercial rules differ meaningfully from Western codes.',
    contractBasics: [
      'Interest (riba) on loans is generally prohibited — structure repayment without interest.',
      'Excessive uncertainty in terms (gharar) can void a deal — be maximally specific.',
      'Witnesses to signing carry real weight; two adult witnesses is the traditional standard.',
    ],
  },
};

// ── Legal family per country (ISO code) — default is 'civil' ──────────────

const COMMON = 'US GB IE CA AU NZ IN PK BD MM SG BN NG GH SL GM LR KE UG TZ ZM MW JM TT BS BB BZ GY GD DM LC VC KN AG FJ PG SB TO TV KI NR WS VU MH FM PW'.split(' ');
const MIXED = 'ZA ZW BW NA SZ LS LK PH MU SC CM CY MT IL AE QA KW BH OM LY SD SO MV MY TH NP ET ER DJ'.split(' ');
const RELIGIOUS = 'SA IR AF YE'.split(' ');

export function legalFamily(code: string): LegalFamily {
  if (COMMON.includes(code)) return 'common';
  if (MIXED.includes(code)) return 'mixed';
  if (RELIGIOUS.includes(code)) return 'religious';
  return 'civil';
}

// ── Electronic signature recognition ───────────────────────────────────────

/** EU + EEA: eIDAS Regulation (EU) 910/2014 applies directly. */
const EIDAS = 'AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE NO IS LI'.split(' ');

const ESIGN_LAWS: Record<string, string> = {
  US: 'ESIGN Act (2000) + UETA (state level)',
  GB: 'Electronic Communications Act 2000 + UK eIDAS',
  CA: 'PIPEDA + provincial e-commerce acts (UECA model)',
  AU: 'Electronic Transactions Act 1999',
  NZ: 'Contract and Commercial Law Act 2017',
  IN: 'Information Technology Act 2000',
  PK: 'Electronic Transactions Ordinance 2002',
  BD: 'Information & Communication Technology Act 2006',
  LK: 'Electronic Transactions Act 2006',
  SG: 'Electronic Transactions Act 2010',
  MY: 'Electronic Commerce Act 2006',
  TH: 'Electronic Transactions Act 2001',
  VN: 'Law on Electronic Transactions (2023)',
  ID: 'Law No. 11 of 2008 on Electronic Information (ITE)',
  PH: 'E-Commerce Act 2000 (RA 8792)',
  CN: 'Electronic Signature Law 2004',
  JP: 'Electronic Signature and Certification Business Act 2000',
  KR: 'Digital Signature Act',
  TW: 'Electronic Signatures Act 2001',
  NG: 'Evidence Act 2011, s.93(2)',
  GH: 'Electronic Transactions Act 2008',
  KE: 'Kenya Information and Communications Act (as amended)',
  UG: 'Electronic Transactions Act 2011',
  TZ: 'Electronic Transactions Act 2015',
  RW: 'Law N°18/2010 on Electronic Messages & Signatures',
  ZA: 'Electronic Communications and Transactions Act 2002',
  ZM: 'Electronic Communications and Transactions Act 2021',
  ET: 'Electronic Signature Proclamation No. 1072/2018',
  EG: 'E-Signature Law No. 15 of 2004',
  MA: 'Law No. 53-05 on Electronic Exchange',
  TN: 'Law No. 2000-83 on Electronic Exchanges',
  DZ: 'Law No. 15-04 on Electronic Signature',
  AE: 'Electronic Transactions and Trust Services Law 2021',
  SA: 'Electronic Transactions Law 2007',
  QA: 'E-Commerce and Transactions Law 2010',
  BH: 'Electronic Communications and Transactions Law 2018',
  KW: 'Law No. 20 of 2014 on Electronic Transactions',
  OM: 'Electronic Transactions Law 2008',
  JO: 'Electronic Transactions Law 2015',
  IL: 'Electronic Signature Law 2001',
  TR: 'Electronic Signature Law No. 5070 (2004)',
  RU: 'Federal Law No. 63-FZ on Electronic Signatures (2011)',
  UA: 'Law on Electronic Trust Services 2017',
  CH: 'Federal Act on Electronic Signatures (ZertES)',
  BR: 'MP 2.200-2/2001 + Law 14.063/2020',
  MX: 'Code of Commerce (electronic signature provisions)',
  AR: 'Digital Signature Law No. 25.506',
  CL: 'Law No. 19.799 on Electronic Documents (2002)',
  CO: 'Law 527 of 1999',
  PE: 'Law No. 27269 on Digital Signatures',
  UY: 'Law No. 18.600 on Electronic Documents',
  EC: 'E-Commerce, Signatures & Data Law 2002',
  PY: 'Law No. 4017/2010',
  CR: 'Law No. 8454 on Certificates & Digital Signatures',
  PA: 'Law 51 of 2008',
  DO: 'Law No. 126-02 on E-Commerce',
  JM: 'Electronic Transactions Act 2006',
  TT: 'Electronic Transactions Act 2011',
  RS: 'Law on Electronic Documents & Trust Services 2017',
};

export function esignInfo(code: string): { recognized: boolean; law: string } {
  if (EIDAS.includes(code)) return { recognized: true, law: 'eIDAS Regulation (EU) 910/2014' };
  const law = ESIGN_LAWS[code];
  if (law) return { recognized: true, law };
  return {
    recognized: false,
    law: 'No specific statute on record here — most countries accept signed electronic documents as evidence, but verify locally before relying on it.',
  };
}

// ── Deal-type rules by legal family (maps to our template categories) ──────

export type DealArea = 'loan' | 'rental' | 'sale' | 'work' | 'nda' | 'personal';

export const DEAL_AREAS: { id: DealArea; label: string; templates: string }[] = [
  { id: 'loan',     label: 'Loans between people',    templates: 'Family & Friend Loan · Road Trip Split' },
  { id: 'rental',   label: 'Renting rooms & things',  templates: 'Room Rental · Equipment Rental · Borrowed Gear' },
  { id: 'sale',     label: 'Private sales',           templates: 'Vehicle Bill of Sale · Marketplace Meet-up' },
  { id: 'work',     label: 'Freelance & services',    templates: 'Freelance Help · Home Repair · Creator & Commission deals' },
  { id: 'nda',      label: 'Keeping things secret',   templates: 'Standard NDA' },
  { id: 'personal', label: 'Favors & care',           templates: 'Pet Care · House Sitting · Tutoring' },
];

export const DEAL_RULES: Record<DealArea, Record<LegalFamily, string>> = {
  loan: {
    common: 'Interest caps ("usury" limits) are set by statute and often vary by state or province. Undocumented loans are enforceable but painful to prove — dates and amounts in writing win cases.',
    civil: 'The civil code usually caps interest between private parties and may require written form above a threshold amount. A written repayment schedule is strong evidence.',
    mixed: 'Interest rules can come from more than one tradition — check both the statute and, where relevant, religious rules. Written terms with witnesses travel best.',
    religious: 'Charging interest is generally prohibited. Structure the loan as principal-only repayment; profit-sharing arrangements need specific Islamic-finance forms.',
  },
  rental: {
    common: 'Residential tenancy statutes override private terms on deposits, notice periods, and eviction — you cannot sign those protections away. Equipment rental is far freer.',
    civil: 'Lease chapters of the civil code imply many tenant protections automatically. Deposit caps and notice periods are commonly fixed by law.',
    mixed: 'Formal tenancy statutes usually follow the dominant tradition; informal arrangements may fall under customary rules. Put deposits and notice in writing regardless.',
    religious: 'Leases (ijara) are well-established; rent must be certain and the thing rented clearly described. Avoid open-ended or contingent rent terms.',
  },
  sale: {
    common: '"As-is" works for private sales, but misrepresenting condition is still actionable. Title transfer rules for vehicles are statutory — the paperwork matters as much as the contract.',
    civil: 'Hidden-defect warranties are implied by the code even in private sales and are hard to fully waive. Describe condition precisely.',
    mixed: 'Sale-of-goods statutes typically apply; registration-based assets (vehicles, land) follow strict formal procedures on top of the contract.',
    religious: 'The item and price must be certain at the moment of sale. Sales of things not yet owned or existing are restricted.',
  },
  work: {
    common: 'The contractor/employee line is drawn by courts and tax rules, not by what the contract calls it. Scope, revisions, and kill-fees are freely negotiable — write them down.',
    civil: 'Service contracts get implied duties of proper performance; consumer-protection rules may apply when one side is a business. Labour law can reclassify disguised employment.',
    mixed: 'Freelance work is generally freedom-of-contract, but statutory labour protections apply if the relationship looks like employment in substance.',
    religious: 'Fee and scope must be defined up front; open-ended "pay what it is worth" arrangements risk unenforceability.',
  },
  nda: {
    common: 'Courts enforce reasonable NDAs but cut down overbroad ones — unlimited duration or "everything is confidential" clauses are vulnerable. Non-competes face rising restrictions.',
    civil: 'Confidentiality clauses are enforceable under general contract rules; penalty clauses for breach are common and, unlike common law, usually enforceable as written.',
    mixed: 'Enforceable in the commercial tradition of the system; define exactly what is secret and for how long.',
    religious: 'Promises of confidentiality bind morally and legally; specify the protected information precisely to avoid uncertainty objections.',
  },
  personal: {
    common: 'Courts presume casual/family arrangements are NOT meant to be legally binding — writing "we intend this to be binding" flips that presumption.',
    civil: 'Even small service arrangements form contracts on consent; liability for damage caused while caring for property or animals follows the code\'s general rules.',
    mixed: 'Informal favors may fall under customary expectations rather than contract law — a short written agreement moves them into enforceable territory.',
    religious: 'Trust-based arrangements (amanah) carry recognized duties of care; written terms and witnesses formalize them.',
  },
};

// ── Hand-written notes for major countries ────────────────────────────────

export const COUNTRY_NOTES: Record<string, {
  headline: string;
  points: string[];
}> = {
  US: {
    headline: 'Contract law is state law — the essentials below are near-universal, the details are not.',
    points: [
      'Usury caps on private loans vary wildly by state (e.g. strict in NY, loose in DE).',
      'Non-competes are unenforceable in California and increasingly restricted elsewhere; NDAs remain broadly enforceable.',
      'Statute of frauds: land deals, guarantees, and contracts over ~1 year must be written.',
    ],
  },
  GB: {
    headline: 'England & Wales, Scotland, and Northern Ireland differ — Scotland doesn\'t even require consideration.',
    points: [
      'Tenancy deposits must be placed in a government-approved protection scheme within 30 days.',
      'Consumer Rights Act 2015 implies quality terms whenever a business sells to an individual.',
      'Simple written agreements signed by both parties are fully enforceable; deeds need a witness.',
    ],
  },
  CA: {
    headline: 'Common law everywhere except Quebec, which follows its Civil Code.',
    points: [
      'Criminal Code caps effective annual interest at 60% (recently lowered further) — even between friends.',
      'Residential tenancies are provincially regulated with strong tenant protections.',
      'Quebec contracts may need French-language versions in some contexts.',
    ],
  },
  AU: {
    headline: 'Freedom of contract with strong consumer overlay.',
    points: [
      'Australian Consumer Law voids "unfair terms" in standard-form contracts, including many services deals.',
      'Each state caps bond/deposit amounts for residential tenancy and runs a bond-lodgement authority.',
      'Interest caps apply to consumer credit (48% comparison-rate cap in most states).',
    ],
  },
  NG: {
    headline: 'Common law + statute; written and witnessed documents carry serious evidentiary weight.',
    points: [
      'The Money Lenders Acts (state level) can require a licence for repeated lending at interest.',
      'Land transactions require Governor\'s consent under the Land Use Act — a private contract alone is not enough.',
      'Illiterate-protection laws require an explanation clause when a signer cannot read the document.',
    ],
  },
  KE: {
    headline: 'Common law tradition; the Law of Contract Act keeps essentials close to English rules.',
    points: [
      'In-duplum rule: interest stops accruing once unpaid interest equals the principal.',
      'Landlord & Tenant Acts protect residential and small-business tenants on rent raises and eviction.',
      'The Business Laws (Amendment) Act 2020 put electronic signatures on solid statutory ground.',
    ],
  },
  ZA: {
    headline: 'Mixed Roman-Dutch and common law; sophisticated consumer statutes.',
    points: [
      'National Credit Act caps interest and may require registration for repeated lending.',
      'Consumer Protection Act implies quality warranties even in many private-ish sales.',
      'The in-duplum rule caps arrear interest at the outstanding principal.',
    ],
  },
  IN: {
    headline: 'Indian Contract Act 1872 — old, clear, and still the backbone.',
    points: [
      'State Money Lending Acts cap interest and can require lender registration.',
      'Rent control statutes (state level) heavily regulate older tenancies; newer "model tenancy" rules are looser.',
      'Stamp duty: many agreements need stamping to be admissible in court — small cost, big consequence.',
    ],
  },
  DE: {
    headline: 'The BGB (Civil Code) governs — protective, precise, and hard to contract around.',
    points: [
      'Interest above ~2x the market rate risks being void as usurious (§138 BGB).',
      'Tenant protection is among the strongest anywhere: deposit max 3 months\' rent, strict termination rules.',
      'Continuing obligations (subscriptions, services) have statutory cancellation rights.',
    ],
  },
  FR: {
    headline: 'Code civil, reformed 2016 — consent-based contracts with strong implied duties.',
    points: [
      'The taux d\'usure (usury rate) is published quarterly; exceeding it is a criminal offence.',
      'Residential leases follow the Loi de 1989 — mandatory terms, capped deposits (1 month unfurnished).',
      'Good-faith negotiation is a legal duty, not a courtesy (art. 1104).',
    ],
  },
  BR: {
    headline: 'Civil Code 2002 + Consumer Defense Code; formality matters.',
    points: [
      'Private parties cannot charge interest above 1% per month (12%/yr) unless licensed.',
      'The CDC (consumer code) applies broadly and cannot be waived.',
      'Two witnesses on a private contract make it an "executive title" — directly enforceable without a full lawsuit.',
    ],
  },
  MX: {
    headline: 'Federal Civil Code + state codes; consumer law via PROFECO.',
    points: [
      'Lesión: contracts exploiting someone\'s ignorance or need can be rescinded.',
      'Interest is negotiable but courts strike "evidently excessive" rates.',
      'Real estate and high-value deals commonly require a notario público — a formal legal officer, not a notary stamp.',
    ],
  },
  AE: {
    headline: 'Civil-law codes with Sharia as a source; free zones (DIFC/ADGM) run English common law.',
    points: [
      'Interest between individuals is restricted; commercial interest is allowed within caps.',
      'Dubai and Abu Dhabi tenancy is regulated (RERA rent index, registered leases).',
      'Bounced cheques have been largely decriminalized but still carry serious consequences.',
    ],
  },
  SA: {
    headline: 'Sharia is the law of the land; the 2023 Civil Transactions Law codified contract rules for the first time.',
    points: [
      'Interest (riba) is unenforceable — courts strike interest clauses while upholding principal.',
      'The new Civil Transactions Law (2023) makes outcomes far more predictable.',
      'Ejar: residential leases must be registered on the national platform.',
    ],
  },
  JP: {
    headline: 'Civil Code (heavily revised 2020) — consensual contracts, strong good-faith doctrine.',
    points: [
      'Interest Rate Restriction Act caps private loans at 15–20% depending on amount.',
      'Renewable leases give tenants strong continuation rights; "fixed-term" leases must say so explicitly.',
      'Hanko/seal culture persists, but electronic signing is fully valid.',
    ],
  },
  CN: {
    headline: 'Civil Code 2021 unified contract law; enforcement is document-driven.',
    points: [
      'Private lending interest is capped at 4x the one-year Loan Prime Rate.',
      'Written form matters more than in most systems; chops/seals or verified e-signatures are the norm.',
      'Foreign-related contracts can choose governing law; purely domestic ones cannot.',
    ],
  },
  SG: {
    headline: 'English-derived common law, modern statutes, famously efficient courts.',
    points: [
      'Moneylenders Act: repeated lending at interest requires a licence; unlicensed loans may be unenforceable.',
      'Small Claims Tribunal handles disputes up to S$20k (S$30k by consent) cheaply and quickly.',
      'Electronic Transactions Act 2010 puts e-signing beyond doubt for everyday contracts.',
    ],
  },
  PH: {
    headline: 'Civil Code with common-law influence; family/informal deals are everywhere and enforceable.',
    points: [
      'Usury ceilings are suspended, but courts strike "unconscionable" interest (often anything above ~3%/month).',
      'The Rent Control Act caps increases on lower-rent residential units.',
      'Notarization converts a private document into a public one — much stronger in court.',
    ],
  },
  ID: {
    headline: 'Civil Code (KUHPerdata) inherited from Dutch law + strong consumer statute.',
    points: [
      'Agreements must have a lawful cause and specific object (art. 1320 essentials).',
      'Bahasa Indonesia language versions are mandatory for contracts with Indonesian parties (Law 24/2009).',
      'Stamp duty (meterai) is required for documents used as evidence.',
    ],
  },
  KR: {
    headline: 'Civil Code tradition with heavy statutory overlays.',
    points: [
      'Interest Limitation Act caps private loans at 20%/yr.',
      'Jeonse and monthly-rent housing follow the Housing Lease Protection Act — deposits get priority protection if registered.',
      'Certified date stamps (hwakjeong-ilja) on documents strengthen priority claims.',
    ],
  },
  TR: {
    headline: 'Swiss-derived Code of Obligations; formal but familiar contract rules.',
    points: [
      'Statutory default interest applies when contracts are silent; excessive rates are reduced by courts.',
      'Residential leases in TRY only; rent-increase caps tied to CPI.',
      'Notarized documents execute directly through enforcement offices.',
    ],
  },
  EG: {
    headline: 'Civil Code 1948 — the model for much of the Arab world.',
    points: [
      'Civil interest capped at 4%, commercial at 5% (higher via banks).',
      'Old-law rents are frozen; new leases are freely negotiated under the 1996 law.',
      'Date-certain (registered) documents defeat later claims — register anything valuable.',
    ],
  },
  RU: {
    headline: 'Civil Code parts I–IV; written form is expected for anything non-trivial.',
    points: [
      'Contracts between citizens above ~10x minimum wage must be in writing to be provable.',
      'Consumer-loan interest is capped daily (max 0.8%/day) and in total.',
      'Notarization is mandatory for real-estate shares and some family transactions.',
    ],
  },
};

// ── Public-domain reading links ────────────────────────────────────────────

export function lawLinks(name: string, code: string) {
  const wiki = (t: string) => `https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_'))}`;
  return [
    { label: `Constitution of ${name}`, href: wiki(`Constitution of ${name}`), source: 'Wikipedia' },
    { label: `Law of ${name}`, href: wiki(`Law of ${name}`), source: 'Wikipedia' },
    { label: 'Full constitution text', href: `https://www.constituteproject.org/search?q=${encodeURIComponent(name)}`, source: 'Constitute Project' },
    { label: 'Global-Regulation law search', href: `https://www.global-regulation.com/search.php?q=${encodeURIComponent(name + ' contract')}`, source: 'Global Regulation' },
  ];
}
