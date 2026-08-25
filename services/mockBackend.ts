
import { User, Transaction, TransactionType, TransactionStatus, SettlementLayer, LedgerBlock } from '../types';
import { ledgerDb } from './ledgerDatabase';

const USERS_KEY = 'suraksha_db_users';
const TXS_KEY = 'suraksha_db_transactions';

class MockDatabase {
  private users: Record<string, User> = {};
  private transactions: Transaction[] = [];

  constructor() {
    this.loadFromStorage();
    if (Object.keys(this.users).length === 0) {
      this.seedDefaultUser();
    }
  }

  private loadFromStorage() {
    const savedUsers = localStorage.getItem(USERS_KEY);
    const savedTxs = localStorage.getItem(TXS_KEY);
    
    if (savedUsers) this.users = JSON.parse(savedUsers);
    if (savedTxs) this.transactions = JSON.parse(savedTxs);
  }

  private saveToStorage() {
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
    localStorage.setItem(TXS_KEY, JSON.stringify(this.transactions));
  }

  private async seedDefaultUser() {
    const defaultId = 'usr_7721';
    const user = {
      id: defaultId,
      name: 'Chetana Sree',
      upiId: 'chetana@suraksha',
      btcAddress: 'sur1qw508d6qejxtdg4y5r3zarvary0c5xw7k3lnqah',
      balance: 45250.75,
      btcBalance: 840500,
      isPrivacyMode: true
    };
    
    this.users[defaultId] = user;
    await ledgerDb.addBlock(user, 'SYSTEM_INIT');
    this.saveToStorage();
  }

  async getUser(id: string): Promise<User | null> {
    return this.users[id] || null;
  }

  async updateUser(user: User): Promise<User> {
    this.users[user.id] = { ...user };
    await ledgerDb.addBlock(user, 'UPDATE_PROFILE');
    this.saveToStorage();
    return this.users[user.id];
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return [...this.transactions].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async addTransaction(tx: Transaction, userId: string): Promise<Transaction> {
    const user = this.users[userId];
    if (user) {
      if (tx.layer === SettlementLayer.DECENTRALIZED) {
        if (tx.type === TransactionType.SENT) user.btcBalance -= tx.amount;
        else user.btcBalance += tx.amount;
      } else {
        if (tx.type === TransactionType.SENT) user.balance -= tx.amount;
        else user.balance += tx.amount;
      }
      this.users[userId] = { ...user };
    }

    // Anchor to Immutable Ledger
    const action = tx.layer === SettlementLayer.DECENTRALIZED ? 'BTC_SETTLEMENT' : 'TRANSFER';
    const block = await ledgerDb.addBlock(tx, action, tx.blockchainHash);
    
    const newTx = { ...tx, qldbSequence: block.index };
    
    this.transactions.push(newTx);
    this.saveToStorage();
    return newTx;
  }

  async verifyIntegrity(): Promise<{ isValid: boolean; auditCount: number }> {
    const result = await ledgerDb.verifyChain();
    return { 
      isValid: result.isValid, 
      auditCount: ledgerDb.getLedger().length 
    };
  }

  // Added getJournal to MockDatabase to satisfy requirements in apiService.ts
  async getJournal(): Promise<LedgerBlock[]> {
    return ledgerDb.getLedger();
  }
}

export const db = new MockDatabase();
