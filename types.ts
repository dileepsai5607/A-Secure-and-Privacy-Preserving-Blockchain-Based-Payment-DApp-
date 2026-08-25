
export enum TransactionStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS', // For backward compatibility
}

export enum TransactionType {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
}

export enum SettlementLayer {
  INSTITUTIONAL = 'INSTITUTIONAL', // Fiat (QLDB + zkEVM)
  DECENTRALIZED = 'DECENTRALIZED', // Native (BTC-style zkEVM)
}

export interface LatticeProof {
  version: string;
  commitment: string; 
  challenge: string;  
  response: string;   
  parameters: {
    dimension: number;
    modulus: number;
    noise_bound: number;
  };
  geometry: {
    basis: number[][]; 
    witnessVector: number[];
    noiseOffset: number[];
  };
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  recipient: string;
  timestamp: string;
  status: TransactionStatus;
  layer: SettlementLayer;
  confirmations?: number;
  note?: string;
  zkProof?: LatticeProof;
  
  // Layer 2: Blockchain
  blockchainHash?: string; 
  nullifier?: string;      
  validatorCount?: number; 

  // Layer 3B: Off-Chain IPFS
  ipfsCid?: string;        
}

/**
 * QLDB-Like Immutable Block Structure
 */
export interface LedgerBlock {
  index: number;
  timestamp: string;
  transaction: any; // Transaction or Action Payload
  previousHash: string;
  hash: string;
  metadata?: {
    action: string;
    blockchainAnchor?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email?: string; // Optional email field
  upiId: string;
  btcAddress: string;
  balance: number;
  btcBalance: number;
  isPrivacyMode: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
