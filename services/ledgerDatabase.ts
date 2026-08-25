
import { LedgerBlock } from '../types';

const LEDGER_STORAGE_KEY = 'suraksha_immutable_ledger';

class LedgerDatabase {
  /**
   * Browser-native SHA-256 hashing for the block chain
   */
  private async calculateHash(block: Omit<LedgerBlock, 'hash'>): Promise<string> {
    const content = block.index + block.timestamp + JSON.stringify(block.transaction) + block.previousHash;
    const msgUint8 = new TextEncoder().encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  getLedger(): LedgerBlock[] {
    const saved = localStorage.getItem(LEDGER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  private saveLedger(ledger: LedgerBlock[]) {
    localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger, null, 2));
  }

  async addBlock(transactionData: any, actionType: string, blockchainAnchor?: string): Promise<LedgerBlock> {
    const ledger = this.getLedger();
    const previousBlock = ledger[ledger.length - 1];

    const blockHeader: Omit<LedgerBlock, 'hash'> = {
      index: ledger.length,
      timestamp: new Date().toISOString(),
      transaction: transactionData,
      previousHash: previousBlock ? previousBlock.hash : "GENESIS",
      metadata: {
        action: actionType,
        blockchainAnchor
      }
    };

    const hash = await this.calculateHash(blockHeader);
    const block: LedgerBlock = { ...blockHeader, hash };

    ledger.push(block);
    this.saveLedger(ledger);
    return block;
  }

  async verifyChain(): Promise<{ isValid: boolean; errorIndex?: number }> {
    const ledger = this.getLedger();
    for (let i = 0; i < ledger.length; i++) {
      const current = ledger[i];
      const prev = i > 0 ? ledger[i - 1] : null;

      // Verify Previous Hash Link
      if (i > 0 && current.previousHash !== prev?.hash) {
        return { isValid: false, errorIndex: i };
      }

      if (i === 0 && current.previousHash !== "GENESIS") {
        return { isValid: false, errorIndex: i };
      }

      // Verify Content Integrity
      const blockHeader = {
        index: current.index,
        timestamp: current.timestamp,
        transaction: current.transaction,
        previousHash: current.previousHash,
        metadata: current.metadata
      };
      const recalculatedHash = await this.calculateHash(blockHeader);
      if (recalculatedHash !== current.hash) {
        return { isValid: false, errorIndex: i };
      }
    }
    return { isValid: true };
  }
}

export const ledgerDb = new LedgerDatabase();
