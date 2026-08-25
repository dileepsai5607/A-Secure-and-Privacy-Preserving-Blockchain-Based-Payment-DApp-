
import React, { useState } from 'react';
import { User, Transaction, TransactionType, SettlementLayer } from '../types';
import { formatCurrency } from '../components/CryptoUtils';
// Added Database and Activity to lucide-react imports
import { ShieldCheck, ArrowUpRight, ArrowDownLeft, Scan, Wallet, Eye, EyeOff, Bell, Bitcoin, Cpu, Network, Database, Activity } from 'lucide-react';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions }) => {
  const [isPrivacyOn, setIsPrivacyOn] = useState(user.isPrivacyMode);
  const [activeWallet, setActiveWallet] = useState<'fiat' | 'btc'>('fiat');

  return (
    <div className="p-6 space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-bold border border-orange-200">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Hybrid Terminal</h1>
            <h2 className="text-lg font-bold flex items-center gap-1.5 italic">
              {user.name} <ShieldCheck className="text-teal-500" size={16} />
            </h2>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="p-2 bg-white rounded-xl border border-slate-100 text-slate-400 relative">
             <Bell size={18} />
             <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
           </button>
        </div>
      </div>

      {/* Wallet Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button 
          onClick={() => setActiveWallet('fiat')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeWallet === 'fiat' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
        >
          Institutional
        </button>
        <button 
          onClick={() => setActiveWallet('btc')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeWallet === 'btc' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'text-slate-400'}`}
        >
          Decentralized
        </button>
      </div>

      {/* Balance Card */}
      {activeWallet === 'fiat' ? (
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-2">
              <p className="text-slate-400 text-xs font-semibold flex items-center gap-2">
                <Wallet size={14} className="text-orange-500" /> Fiat Balance
              </p>
              <button onClick={() => setIsPrivacyOn(!isPrivacyOn)} className="p-1.5 bg-white/5 rounded-lg">
                {isPrivacyOn ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <h3 className={`text-4xl font-bold tracking-tight mb-8 ${isPrivacyOn ? 'blur-md' : ''}`}>
              {formatCurrency(user.balance)}
            </h3>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mb-1">Encrypted VPA</p>
                <p className={`text-xs font-mono text-slate-300 bg-white/5 px-2 py-1 rounded ${isPrivacyOn ? 'blur-sm' : ''}`}>{user.upiId}</p>
              </div>
              <div className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center gap-2">
                <Database size={12} className="text-teal-400" />
                <span className="text-[10px] text-teal-400 font-bold uppercase">QLDB AUDITED</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group border border-orange-400/20">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Bitcoin size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-2">
              <p className="text-orange-100/60 text-xs font-semibold flex items-center gap-2">
                <Bitcoin size={14} className="text-white" /> Native Asset (SATS)
              </p>
              <button onClick={() => setIsPrivacyOn(!isPrivacyOn)} className="p-1.5 bg-black/10 rounded-lg">
                {isPrivacyOn ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <h3 className={`text-4xl font-black tracking-tight mb-8 ${isPrivacyOn ? 'blur-md' : ''}`}>
              {user.btcBalance.toLocaleString()} <span className="text-lg font-normal opacity-60">SATS</span>
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-orange-200/50 text-[9px] uppercase font-black tracking-widest mb-1">Lattice-Native Address</p>
                <p className={`text-[10px] font-mono text-white bg-black/20 p-2 rounded-xl truncate border border-white/10 ${isPrivacyOn ? 'blur-sm' : ''}`}>
                  {user.btcAddress}
                </p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 bg-teal-400 rounded-full animate-pulse"></div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-teal-300">UTXO Layer Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
        ].map((action, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className={`p-4 rounded-3xl ${action.color} group-active:scale-90 transition-all`}>
              <action.icon size={22} />
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{action.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-900 tracking-tight uppercase text-xs flex items-center gap-2">
          <Activity size={14} className="text-orange-600" /> Multi-Layer Ledger
        </h3>
        <div className="space-y-3">
          {transactions.slice(0, 4).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tx.layer === SettlementLayer.DECENTRALIZED ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-600'}`}>
                  {tx.layer === SettlementLayer.DECENTRALIZED ? <Bitcoin size={18} /> : <Wallet size={18} />}
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900 uppercase truncate max-w-[120px]">{tx.recipient}</h4>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                    {tx.layer === SettlementLayer.DECENTRALIZED ? 'Native Chain' : 'Inst. QLDB'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-xs text-slate-900">
                  {tx.layer === SettlementLayer.DECENTRALIZED ? `${tx.amount} SATS` : formatCurrency(tx.amount)}
                </p>
                <span className="text-[7px] font-black text-teal-600 uppercase tracking-widest">Confirmed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
