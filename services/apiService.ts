import { User, Transaction, LedgerBlock, TransactionStatus } from '../types';

const BASE_URL = 'http://localhost:5000';
const SIMULATED_DELAY = 400;

class ApiService {
  private delay(ms = SIMULATED_DELAY) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ---------------- USER (Persisted safely) ----------------

  async fetchUser(id: string): Promise<User> {
    await this.delay();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    const user: User = {
      id,
      name: 'Chetana Sree',
      email: 'chetana_sree@suraksha.pay',
      upiId: 'chetana@suraksha',
      btcAddress: 'bc1q' + crypto.randomUUID().slice(0, 38),
      balance: 10000,
      btcBalance: 0.025,
      isPrivacyMode: true,
    };

    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  async updateProfile(user: User): Promise<User> {
    await this.delay();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  // ---------------- TRANSACTIONS ----------------

  async fetchTransactions(userId: string): Promise<Transaction[]> {
    await this.delay();
    const stored = localStorage.getItem('transactions');
    return stored ? JSON.parse(stored) : [];
  }

  async recordTransaction(tx: Transaction, userId: string): Promise<Transaction> {
    const response = await fetch(`${BASE_URL}/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx),
    });

    if (!response.ok) {
      throw new Error('Transaction failed');
    }

    // Normalize backend response to frontend format
    const savedTx: Transaction = {
      ...tx,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: TransactionStatus.SUCCESS,
    };

    // Persist history
    const stored = localStorage.getItem('transactions');
    const list = stored ? JSON.parse(stored) : [];
    list.unshift(savedTx);
    localStorage.setItem('transactions', JSON.stringify(list));

    // 🔥 Trigger ledger refresh in Home
    localStorage.setItem('ledgerUpdated', 'true');

    return savedTx;
  }

  // ---------------- LEDGER ----------------

  async fetchAuditLogs(): Promise<LedgerBlock[]> {
    const response = await fetch(`${BASE_URL}/ledger`);
    if (!response.ok) {
      throw new Error('Failed to fetch ledger');
    }
    return response.json();
  }

  async verifyLedgerIntegrity(): Promise<{ isValid: boolean; auditCount: number }> {
    const ledger = await this.fetchAuditLogs();

    // Clear refresh flag after verification
    localStorage.removeItem('ledgerUpdated');

    return {
      isValid: ledger.length > 0,
      auditCount: ledger.length,
    };
  }
}

export const apiService = new ApiService();
