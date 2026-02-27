import { LegalReference } from '@/lib/types';

export const legalReferences: LegalReference[] = [
  // KENYA
  { id: 'ke-1', country: 'Kenya', countryCode: 'KE', category: 'Contract Law', title: 'Law of Contract Act (Cap 23)', content: 'Governs the formation, interpretation, and enforcement of contracts in Kenya. A contract requires offer, acceptance, consideration, and intention to create legal relations. Contracts can be oral or written; however, certain contracts must be in writing (e.g., sale of land under the Law of Contract Act Section 3).', source: 'Kenya Law Reports', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Section 2 - Definitions', 'Section 3 - Contracts required to be in writing', 'Section 4 - Capacity to contract'] },
  { id: 'ke-2', country: 'Kenya', countryCode: 'KE', category: 'Consumer Protection', title: 'Consumer Protection Act, 2012', content: 'Provides for the protection of consumers, prevents unfair trade practices, and establishes consumer rights. Relevant to sale of goods agreements, warranties, and return policies.', source: 'Kenya Law Reports', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Part II - Consumer Rights', 'Part III - Unfair Practices'] },
  { id: 'ke-3', country: 'Kenya', countryCode: 'KE', category: 'Lending', title: 'Central Bank of Kenya Act - Lending Regulations', content: 'Personal loans between individuals are generally not regulated by CBK, but usury and unconscionable interest rates may be challenged in court. The Interest Rate Cap was repealed in 2019, but fairness principles still apply.', source: 'Central Bank of Kenya', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Interest Rate Guidelines', 'Consumer Lending Practices'] },

  // NIGERIA
  { id: 'ng-1', country: 'Nigeria', countryCode: 'NG', category: 'Contract Law', title: 'Nigerian Contract Law', content: 'Based on English Common Law. Contracts require offer, acceptance, consideration, intention, and capacity. The Sale of Goods Act (applicable in Lagos and other states) governs sale transactions. Oral agreements are enforceable but harder to prove.', source: 'Nigerian Law Publications', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Sale of Goods Act', 'Contract Law Principles'] },
  { id: 'ng-2', country: 'Nigeria', countryCode: 'NG', category: 'Dispute Resolution', title: 'Arbitration and Conciliation Act', content: 'Provides a framework for resolving commercial disputes through arbitration. Parties can agree to resolve disputes through arbitration rather than litigation.', source: 'Nigerian Law Publications', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Section 1 - Arbitration Agreement', 'Section 4 - Appointment of Arbitrators'] },

  // SOUTH AFRICA
  { id: 'za-1', country: 'South Africa', countryCode: 'ZA', category: 'Contract Law', title: 'South African Common Law of Contract', content: 'Based on Roman-Dutch law. A valid contract requires consensus (agreement), capacity, legality, possibility of performance, and formalities where prescribed. The Consumer Protection Act (CPA) provides additional protections for consumer contracts.', source: 'South African Law Reports', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Consumer Protection Act No. 68 of 2008', 'National Credit Act No. 34 of 2005'] },

  // GHANA
  { id: 'gh-1', country: 'Ghana', countryCode: 'GH', category: 'Contract Law', title: 'Contracts Act, 1960 (Act 25)', content: 'Governs contracts in Ghana. Contracts may be made in writing, orally, or by conduct. A contract requires offer, acceptance, and consideration. Minors (under 18) have limited contractual capacity.', source: 'Ghana Law Reports', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Section 1 - Formation of Contracts', 'Section 10 - Capacity', 'Section 15 - Void Contracts'] },

  // UNITED STATES
  { id: 'us-1', country: 'United States', countryCode: 'US', category: 'Contract Law', title: 'UCC - Uniform Commercial Code', content: 'Governs commercial transactions in the US, including the sale of goods (Article 2). Adopted in all 50 states with variations. Requires contracts for goods over $500 to be in writing (Statute of Frauds).', source: 'Legal Information Institute', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Article 2 - Sale of Goods', 'Section 2-201 - Statute of Frauds', 'Section 2-302 - Unconscionability'] },
  { id: 'us-2', country: 'United States', countryCode: 'US', category: 'Lending', title: 'Usury Laws by State', content: 'Each US state sets maximum interest rates for personal loans. Charging above these rates may void the interest or the entire agreement. Federal law also applies to certain lending scenarios. Common ranges: 5-25% depending on state.', source: 'Legal Information Institute', lastUpdated: new Date('2024-01-01'), relevantArticles: ['State Usury Statutes', 'Truth in Lending Act (TILA)'] },
  { id: 'us-3', country: 'United States', countryCode: 'US', category: 'Small Claims', title: 'Small Claims Court Guide', content: 'Small claims courts handle disputes under a monetary threshold (typically $5,000-$25,000 depending on state). No lawyer required. File a claim, serve the other party, and present evidence at a hearing. Common for loan defaults, service disputes, and property damage.', source: 'US Courts', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Filing Procedures', 'Monetary Limits by State', 'Evidence Requirements'] },

  // UNITED KINGDOM
  { id: 'uk-1', country: 'United Kingdom', countryCode: 'GB', category: 'Contract Law', title: 'English Contract Law', content: 'Based on common law. Requires offer, acceptance, consideration, intention to create legal relations, and capacity. The Consumer Rights Act 2015 provides protections for consumer contracts. The Sale of Goods Act 1979 (as amended) governs sale of goods.', source: 'UK Legislation', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Consumer Rights Act 2015', 'Sale of Goods Act 1979', 'Unfair Contract Terms Act 1977'] },

  // INDIA
  { id: 'in-1', country: 'India', countryCode: 'IN', category: 'Contract Law', title: 'Indian Contract Act, 1872', content: 'Comprehensive legislation governing contracts in India. Defines essential elements: free consent, competent parties, lawful consideration, and lawful object. Section 10 states all agreements are contracts if made by free consent of parties competent to contract.', source: 'India Code', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Section 2 - Definitions', 'Section 10 - What agreements are contracts', 'Section 23 - Unlawful consideration', 'Section 73 - Compensation for breach'] },

  // UAE
  { id: 'ae-1', country: 'United Arab Emirates', countryCode: 'AE', category: 'Contract Law', title: 'UAE Civil Transactions Law', content: 'Federal Law No. 5 of 1985 governs civil transactions including contracts. Based on Islamic Sharia principles combined with civil law. Contracts require mutual consent, a defined subject matter, and a lawful purpose. Arabic is the official legal language for contracts.', source: 'UAE Official Gazette', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Article 125 - Formation of Contract', 'Article 129 - Consent', 'Article 209 - Performance'] },

  // BRAZIL
  { id: 'br-1', country: 'Brazil', countryCode: 'BR', category: 'Contract Law', title: 'Brazilian Civil Code - Contracts', content: 'The Civil Code (Law No. 10.406/2002) governs contracts. Requires capable parties, lawful object, and prescribed form. The Consumer Protection Code (CDC) provides additional protections. Digital contracts and e-signatures are recognized under Law No. 14.063/2020.', source: 'Brazil Official Gazette', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Article 421 - Freedom to Contract', 'Article 422 - Good Faith', 'CDC - Consumer Protection'] },

  // CONSTITUTION REFERENCES
  { id: 'const-ke', country: 'Kenya', countryCode: 'KE', category: 'Constitution', title: 'Constitution of Kenya, 2010 - Property & Contract Rights', content: 'Article 40 protects the right to property. Article 46 provides consumer rights. Article 47 guarantees fair administrative action. Article 48 ensures access to justice. The Bill of Rights (Chapter 4) is relevant to contractual disputes involving fundamental rights.', source: 'Constitute Project', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Article 40 - Protection of right to property', 'Article 46 - Consumer rights', 'Article 48 - Access to justice'] },
  { id: 'const-ng', country: 'Nigeria', countryCode: 'NG', category: 'Constitution', title: 'Constitution of Nigeria, 1999 - Fundamental Rights', content: 'Chapter IV protects fundamental rights including right to property (Section 44), right to fair hearing (Section 36), and right to freedom of movement. These rights are relevant when contractual disputes involve constitutional issues.', source: 'Constitute Project', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Section 36 - Right to fair hearing', 'Section 44 - Compulsory acquisition of property'] },
  { id: 'const-us', country: 'United States', countryCode: 'US', category: 'Constitution', title: 'US Constitution - Contract Clause', content: 'Article I, Section 10 prohibits states from passing laws "impairing the Obligation of Contracts." The 14th Amendment Due Process Clause protects property rights and contract rights from arbitrary government action.', source: 'US Constitution', lastUpdated: new Date('2024-01-01'), relevantArticles: ['Article I Section 10 - Contract Clause', '14th Amendment - Due Process'] },
];

// Country list for jurisdiction selection
export const supportedCountries = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
];
