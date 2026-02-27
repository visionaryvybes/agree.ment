// AgreeMint - Core Types

export type ContractStatus = 'draft' | 'pending_signature' | 'active' | 'completed' | 'disputed' | 'expired';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'partial' | 'defaulted';
export type EscalationLevel = 'friendly_reminder' | 'formal_notice' | 'demand_letter' | 'legal_action';
export type ContractCategory =
  | 'loan'
  | 'sale'
  | 'rental'
  | 'service'
  | 'nda'
  | 'employment'
  | 'freelance'
  | 'roommate'
  | 'family'
  | 'custom';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
}

export interface ContractParty {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'creator' | 'counterparty';
  signedAt?: Date;
  signatureData?: string;
}

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  isRequired: boolean;
  legalBasis?: string;
  jurisdiction?: string;
}

export interface PaymentSchedule {
  id: string;
  amount: number;
  currency: string;
  dueDate: Date;
  status: PaymentStatus;
  paidDate?: Date;
  paidAmount?: number;
  note?: string;
}

export interface EscalationStep {
  level: EscalationLevel;
  triggeredAt?: Date;
  message: string;
  resolved: boolean;
}

export interface Contract {
  id: string;
  title: string;
  category: ContractCategory;
  description: string;
  status: ContractStatus;
  parties: ContractParty[];
  clauses: ContractClause[];
  totalAmount?: number;
  currency: string;
  paymentSchedule: PaymentSchedule[];
  escalation: EscalationStep[];
  jurisdiction: string;
  governingLaw: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  pdfUrl?: string;
  blockchainHash?: string;
  metadata: Record<string, string>;
}

export interface ContractTemplate {
  id: string;
  name: string;
  category: ContractCategory;
  description: string;
  icon: string;
  clauses: ContractClause[];
  fields: TemplateField[];
  preview: string;
  popular: boolean;
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'currency';
  placeholder: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

export interface LegalReference {
  id: string;
  country: string;
  countryCode: string;
  category: string;
  title: string;
  content: string;
  source: string;
  lastUpdated: Date;
  relevantArticles: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  contractId?: string;
}

export interface DashboardStats {
  totalContracts: number;
  activeContracts: number;
  pendingPayments: number;
  totalOwed: number;
  totalReceivable: number;
  overduePayments: number;
}
