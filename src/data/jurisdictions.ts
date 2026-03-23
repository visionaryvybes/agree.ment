export const prefilledJurisdictions: Record<string, {
  legalFramework: string;
  regionalInsight: string;
  enforceability: string[];
  keyArticles: string[];
  warning?: string;
}> = {
  'AF': {
    legalFramework: 'ISLAMIC LAW (SHARIA) WITH RESIDUAL ELEMENTS OF CIVIL AND CUSTOMARY LAW',
    regionalInsight: 'The Afghan business environment is highly informal, heavily constrained by international sanctions, and relies extensively on traditional trust-based networks (like Hawala) for transactions and dispute resolution.',
    enforceability: [
      'Contracts must strictly adhere to Islamic principles, including the prohibition of Riba (interest) and Gharar (excessive uncertainty).',
      'Enforcement relies heavily on Taliban-appointed clerics and religious courts, prioritizing Sharia over previous civil statutes.',
      'Informal dispute resolution mechanisms (such as Jirgas or Shuras) are frequently utilized and often preferred over formal litigation.'
    ],
    keyArticles: [
      'AFGHAN CIVIL CODE OF 1977 (Applicable only where it does not contradict Sharia principles)',
      'PRINCIPLES OF HANAFI JURISPRUDENCE (Fiqh-e-Hanafi) governing transactions (Mu\'amalat)',
      'LAW ON COMMERCIAL CONTRACTS AND OBLIGATIONS (Historical, subject to current Sharia review)'
    ],
    warning: 'DUE TO THE POLITICAL TRANSITION IN AUGUST 2021, THE LEGAL SYSTEM IS HIGHLY VOLATILE. INTERNATIONAL SANCTIONS ARE ENFORCED.'
  },
  'AL': {
    legalFramework: 'CIVIL LAW (HEAVILY INFLUENCED BY EUROPEAN CONTINENTAL SYSTEMS)',
    regionalInsight: 'Albania is actively aligning its legal framework with the European Union acquis as part of its accession process, making its contract law increasingly standardized but subject to evolving administrative practices.',
    enforceability: [
      'Written contracts are generally enforceable and strongly preferred, with notarization required for real estate and specific corporate transactions.',
      'The judicial system is undergoing vetting and reform; while improving, contract enforcement through courts can still be subject to delays.',
      'Alternative Dispute Resolution (ADR), including arbitration and mediation, is legally recognized and increasingly encouraged to bypass court backlogs.'
    ],
    keyArticles: [
      'CIVIL CODE OF THE REPUBLIC OF ALBANIA (Law No. 7850/1994, Book IV: Obligations and Contracts)',
      'LAW ON COMMERCIAL ENTREPRENEURS AND COMPANIES (Law No. 9901/2008)'
    ]
  },
  'DZ': {
    legalFramework: 'CIVIL LAW (BASED ON FRENCH CIVIL CODE WITH ISLAMIC LAW INFLUENCE)',
    regionalInsight: 'Algeria maintains a heavily state-regulated economy. Contract performance and currency transfers are subject to strict administrative oversight, particularly for foreign entities.',
    enforceability: [
      'Contracts must comply strictly with public order and morality as defined by Algerian civil and Islamic law.',
      'Language requirements are strict; contracts and official documents must often be in Arabic or accompanied by a certified Arabic translation for enforcement.',
      'Foreign arbitration clauses are recognized, but enforcement of foreign awards requires an exequatur from an Algerian judge.'
    ],
    keyArticles: [
      'ALGERIAN CIVIL CODE (Articles 53-130: Formation and Validity of Contracts)',
      'ALGERIAN COMMERCIAL CODE (Specific regulations for commercial transactions and companies)'
    ]
  },
  'US': {
    legalFramework: 'COMMON LAW (Federal and State-level variations)',
    regionalInsight: 'The US legal system is highly litigious and relies on extensive, explicit contract drafting. Each state has its own contract laws, with Delaware and New York being popular for corporate and commercial agreements.',
    enforceability: [
      'Courts strongly uphold the "freedom of contract", enforcing agreements as written unless unconscionable or illegal.',
      'The Uniform Commercial Code (UCC) governs the sale of goods across most states, standardizing commercial transactions.',
      'Arbitration clauses and class-action waivers are highly favored and routinely enforced by federal and state courts.'
    ],
    keyArticles: [
      'UNIFORM COMMERCIAL CODE (UCC) Article 2 (Sales)',
      'RESTATEMENT (SECOND) OF CONTRACTS',
      'FEDERAL ARBITRATION ACT (FAA) (9 U.S.C. §§ 1-16)'
    ]
  },
  'GB': {
    legalFramework: 'COMMON LAW (England and Wales)',
    regionalInsight: 'English law is a globally dominant choice for international commercial contracts due to its predictability, commercial pragmatism, and well-established precedent.',
    enforceability: [
      'Strict literal interpretation of contracts is preferred; courts rarely imply terms or consider pre-contractual negotiations (the parole evidence rule).',
      'A contract requires offer, acceptance, consideration, and the intention to create legal relations to be binding.',
      'The UK does not have a general doctrine of "good faith" in contract performance, unlike many civil law jurisdictions.'
    ],
    keyArticles: [
      'SALE OF GOODS ACT 1979',
      'UNFAIR CONTRACT TERMS ACT 1977 (UCTA)',
      'CONTRACTS (RIGHTS OF THIRD PARTIES) ACT 1999'
    ]
  }
};
