
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency } from '../components/CryptoUtils';
import { apiService } from '../services/apiService';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, ChevronRight, ShieldCheck, Loader2, Database, ShieldAlert, CheckCircle, Info, X, Cpu, Globe, Lock, Share2 } from 'lucide-react';
import LatticeVisualizer from '../components/LatticeVisualizer';

interface HistoryProps {
  transactions: Transaction[];
}

const History: React.FC<HistoryProps> = ({ transactions: initialTransactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ isValid: boolean; count: number } | null>(null);
  const [localTransactions, setLocalTransactions] = useState(initialTransactions);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const loadLedger = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.fetchTransactions('any');
        setLocalTransactions(data);
      } finally {
        setIsLoading(false);
      }
    };
    loadLedger();
  }, []);

  const handleVerifyLedger = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const result = await apiService.verifyLedgerIntegrity();
      setVerificationResult({ isValid: result.isValid, count: result.auditCount });
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredTransactions = localTransactions.filter(tx => 
    tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.amount.toString().includes(searchTerm)
  );

  return (
    <div className="p-6 pb-20">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black italic tracking-tight uppercase">Audit <span className="text-orange-600">Journal</span></h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Immutable Ledger (QLDB Model)</p>
        </div>
        <button 
          onClick={handleVerifyLedger}
          disabled={isVerifying}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
            isVerifying ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white'
          }`}
        >
          {isVerifying ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
          Verify Chain
        </button>
      </div>

      {verificationResult && (
        <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-top-4 ${
          verificationResult.isValid ? 'bg-teal-50 border-teal-100 text-teal-700' : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          <div className={`shrink-0 p-2 rounded-lg ${verificationResult.isValid ? 'bg-teal-500 text-white' : 'bg-red-500 text-white'}`}>
            {verificationResult.isValid ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest">
              {verificationResult.isValid ? 'Audit Complete' : 'Ledger Corrupted'}
            </p>
            <p className="text-[10px] opacity-70 font-semibold">{verificationResult.count} blocks verified in cryptographic chain.</p>
          </div>
          <button onClick={() => setVerificationResult(null)} className="ml-auto text-[10px] font-bold opacity-40">X</button>
        </div>
      )}

      <div className="space-y-4">
        {filteredTransactions.map((tx) => (
          <div 
            key={tx.id} 
            onClick={() => setSelectedTx(tx)}
            className="group p-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:border-orange-200 transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === TransactionType.SENT ? 'bg-orange-50 text-orange-600' : 'bg-teal-50 text-teal-600'}`}>
                {tx.type === TransactionType.SENT ? <ArrowUpRight size={22} /> : <ArrowDownLeft size={22} />}
              </div>
              <div>
                <h4 className="font-black text-slate-900 tracking-tight text-sm uppercase">{tx.recipient}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-md">
                    <Globe size={8} />
                    <span className="text-[7px] font-black uppercase">zkEVM</span>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded-md">
                    <Database size={8} />
                    <span className="text-[7px] font-black uppercase">QLDB</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-black text-sm tracking-tight ${tx.type === TransactionType.SENT ? 'text-slate-900' : 'text-teal-600'}`}>
                {tx.type === TransactionType.SENT ? '-' : '+'}{formatCurrency(tx.amount)}
              </p>
              <div className="flex justify-end gap-1 mt-1 opacity-40">
                 <ShieldCheck size={10} className="text-teal-500" />
                 <span className="text-[7px] font-black">Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4-Layer Hybrid Inspector Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-t-[3rem] p-8 pb-10 space-y-6 shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center sticky top-0 bg-white pb-4 z-10">
              <h3 className="text-xl font-black italic tracking-tight uppercase tracking-tighter">Information <span className="text-orange-600">Flow</span></h3>
              <button onClick={() => setSelectedTx(null)} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
            </div>

            <div className="relative py-4">
               <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100 ml-[1px]"></div>
               
               <div className="space-y-6 relative">
                 <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center z-10 shrink-0 border-4 border-white shadow-sm">
                      <span className="text-[10px] font-black">L1</span>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase">Lattice Proof Generated</h4>
                      <p className="text-[9px] text-slate-400 font-medium">Biometric Authorized • PQ-Signed</p>
                    </div>
                 </div>

                 <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center z-10 shrink-0 border-4 border-white shadow-sm">
                      <Share2 size={12} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-purple-600 uppercase">Layer 3B: IPFS Metadata</h4>
                      <p className="text-[9px] font-mono text-slate-500 break-all bg-slate-50 p-2 rounded-xl mt-1">{selectedTx.ipfsCid}</p>
                    </div>
                 </div>

                 <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center z-10 shrink-0 border-4 border-white shadow-sm">
                      <Globe size={12} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-blue-600 uppercase">Layer 2: Polygon zkEVM</h4>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">TX HASH ANCHOR</p>
                      <p className="text-[9px] font-mono text-blue-500 break-all bg-blue-50 p-2 rounded-xl">{selectedTx.blockchainHash}</p>
                    </div>
                 </div>

                 <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center z-10 shrink-0 border-4 border-white shadow-sm">
                      <Database size={12} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-orange-600 uppercase">Layer 3A: Immutable Ledger</h4>
                      <p className="text-[9px] font-mono text-orange-500 bg-orange-50 p-2 rounded-xl mt-1">BLOCK_INDEX_{selectedTx.id.substring(3, 7).toUpperCase()}</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Anchored to Genesis Root</p>
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-teal-500/20 text-teal-400 rounded-xl">
                     <ShieldCheck size={18} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Defense in Depth</h4>
               </div>
               <p className="text-[10px] text-slate-400 leading-relaxed">
                 Every record is hashed against the previous state. Tampering with a single byte in the local database will break the entire cryptographic chain, visible instantly during a 'Verify Chain' audit.
               </p>
            </div>
            
            <button 
              onClick={() => setSelectedTx(null)}
              className="w-full py-4 bg-slate-100 text-slate-900 font-black rounded-3xl text-xs uppercase tracking-widest active:scale-95 transition-all"
            >
              Close Auditor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
