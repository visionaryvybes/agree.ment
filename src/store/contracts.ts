import { create } from 'zustand';
import { Contract, ContractTemplate, DashboardStats, PaymentStatus, EscalationLevel } from '@/lib/types';
import { v4 as uuid } from 'uuid';
import { sampleContracts } from '@/data/sample-contracts';
import { contractTemplates } from '@/data/templates';

interface ContractsState {
  contracts: Contract[];
  templates: ContractTemplate[];
  selectedContract: Contract | null;

  // Actions
  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  selectContract: (id: string | null) => void;
  getContract: (id: string) => Contract | undefined;

  // Payment
  updatePaymentStatus: (contractId: string, paymentId: string, status: PaymentStatus, paidAmount?: number) => void;

  // Escalation
  triggerEscalation: (contractId: string, level: EscalationLevel, message: string) => void;

  // Stats
  getStats: () => DashboardStats;
  // Async Loader
  fetchContracts: () => Promise<void>;
}

export const useContracts = create<ContractsState>((set, get) => ({
  contracts: sampleContracts,
  templates: contractTemplates,
  selectedContract: null,

  fetchContracts: async () => {
    try {
      const res = await fetch('/api/contracts');
      if (res.ok) {
        const data = await res.json();
        if (data.contracts) set({ contracts: data.contracts });
      }
    } catch (e) {
      console.error('Failed to sync contracts from Redis', e);
    }
  },

  addContract: (contractData) => {
    const id = uuid();
    const now = new Date();
    const contract: Contract = {
      ...contractData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ contracts: [contract, ...state.contracts] }));
    
    // Background sync to Redis
    fetch('/api/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contract)
    }).catch(console.error);

    return id;
  },

  updateContract: (id, updates) => {
    set((state) => ({
      contracts: state.contracts.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
      ),
    }));

    // Background sync to Redis
    fetch(`/api/contracts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(console.error);
  },

  deleteContract: (id) => {
    set((state) => ({
      contracts: state.contracts.filter((c) => c.id !== id),
    }));

    // Background delete from Redis
    fetch(`/api/contracts/${id}`, {
      method: 'DELETE'
    }).catch(console.error);
  },

  selectContract: (id) => {
    if (!id) {
      set({ selectedContract: null });
      return;
    }
    const contract = get().contracts.find((c) => c.id === id);
    set({ selectedContract: contract || null });
  },

  getContract: (id) => {
    return get().contracts.find((c) => c.id === id);
  },

  updatePaymentStatus: (contractId, paymentId, status, paidAmount) => {
    set((state) => ({
      contracts: state.contracts.map((c) =>
        c.id === contractId
          ? {
              ...c,
              updatedAt: new Date(),
              paymentSchedule: c.paymentSchedule.map((p) =>
                p.id === paymentId
                  ? {
                      ...p,
                      status,
                      paidAmount: paidAmount ?? p.paidAmount,
                      paidDate: status === 'paid' ? new Date() : p.paidDate,
                    }
                  : p
              ),
            }
          : c
      ),
    }));

    // Trigger full contract update loop to sync subset
    const contract = get().getContract(contractId);
    if (contract) {
      fetch(`/api/contracts/${contractId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentSchedule: contract.paymentSchedule, updatedAt: contract.updatedAt })
      }).catch(console.error);
    }
  },

  triggerEscalation: (contractId, level, message) => {
    set((state) => ({
      contracts: state.contracts.map((c) =>
        c.id === contractId
          ? {
              ...c,
              updatedAt: new Date(),
              escalation: [
                ...c.escalation,
                { level, triggeredAt: new Date(), message, resolved: false },
              ],
            }
          : c
      ),
    }));

    // Trigger full contract update loop to sync subset
    const contract = get().getContract(contractId);
    if (contract) {
      fetch(`/api/contracts/${contractId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escalation: contract.escalation, updatedAt: contract.updatedAt })
      }).catch(console.error);
    }
  },

  getStats: () => {
    const contracts = get().contracts;
    const active = contracts.filter((c) => c.status === 'active');
    const allPayments = contracts.flatMap((c) => c.paymentSchedule);
    const pending = allPayments.filter((p) => p.status === 'pending');
    const overdue = allPayments.filter((p) => p.status === 'overdue');

    return {
      totalContracts: contracts.length,
      activeContracts: active.length,
      pendingPayments: pending.length,
      totalOwed: allPayments
        .filter((p) => ['pending', 'overdue'].includes(p.status))
        .reduce((sum, p) => sum + p.amount, 0),
      totalReceivable: allPayments
        .filter((p) => p.status === 'paid')
        .reduce((sum, p) => sum + (p.paidAmount || p.amount), 0),
      overduePayments: overdue.length,
    };
  },
}));
