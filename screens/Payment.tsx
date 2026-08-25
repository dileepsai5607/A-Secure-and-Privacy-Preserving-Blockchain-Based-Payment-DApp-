import React, { useState } from 'react';
import { User, Transaction, SettlementLayer } from '../types';
import { paymentService } from '../services/paymentService';
import { apiService } from '../services/apiService';
import { ArrowLeft, Scan, CheckCircle, ShieldCheck, Bitcoin, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import LatticeVisualizer from '../components/LatticeVisualizer';

interface PaymentProps {
  user: User;
  onComplete: (tx: Transaction) => void;
}

const Payment: React.FC<PaymentProps> = ({ user, onComplete }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [showScanner, setShowScanner] = useState(false);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(''); // keep as string for input safety
  const [layer, setLayer] = useState<SettlementLayer>(SettlementLayer.INSTITUTIONAL);

  const [processingStatus, setProcessingStatus] = useState('');
  const [processingPercent, setProcessingPercent] = useState(0);

  const handleScanSuccess = (data: string) => {
    setRecipient(data);
    setShowScanner(false);
  };

  const handleConfirmPay = async () => {
    // 🔒 VALIDATION (CRITICAL FIX)
    if (!amount || Number(amount) <= 0) {
      alert('Amount must be greater than zero');
      return;
    }

    if (!recipient.trim()) {
      alert('Recipient is required');
      return;
    }

    setStep('processing');

    try {
      const finalTx = await paymentService.processShieldedPayment(
        parseFloat(amount),
        recipient,
        user.id,
        layer,
        (update) => {
          setProcessingStatus(update.status);
          setProcessingPercent(update.progress);
        }
      );

      const savedTx = await apiService.recordTransaction(finalTx, user.id);
      onComplete(savedTx);
      setStep('success');
    } catch (error) {
      console.error(error);
      alert('Payment failed. Please try again.');
      setStep('input');
    }
  };

  // Enhanced processing status with layer info
  const getLayerInfo = () => {
    if (layer === SettlementLayer.DECENTRALIZED) {
      return {
        title: 'Decentralized Transfer',
        subtitle: 'No banks. No middlemen. Pure cryptography.',
        icon: <Bitcoin size={24} />,
        color: 'text-orange-600'
      };
    }
    return {
      title: 'Institutional Transfer',
      subtitle: 'QLDB-backed audit trail with zkEVM verification.',
      icon: <Database size={24} />,
      color: 'text-slate-600'
    };
  };

  if (showScanner) {
    return <QRScanner onScan={handleScanSuccess} onClose={() => setShowScanner(false)} />;
  }

  if (step === 'processing') {
    const layerInfo = getLayerInfo();
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center space-y-8">
        <LatticeVisualizer isAnimating />
        <div className="w-full space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={layerInfo.color}>{layerInfo.icon}</span>
            <h2 className="text-2xl font-black uppercase">{layerInfo.title}</h2>
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest">{processingStatus}</p>
          <p className="text-xs text-slate-400">{layerInfo.subtitle}</p>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-orange-600 h-full transition-all"
              style={{ width: `${processingPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    const layerInfo = getLayerInfo();
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <div className="w-24 h-24 bg-teal-500 text-white rounded-3xl flex items-center justify-center mb-8">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black mb-3">Payment Successful</h2>
        <p className="text-xs text-slate-500 mb-6">
          {layer === SettlementLayer.DECENTRALIZED
            ? 'Transaction broadcast to decentralized network.'
            : 'Transaction recorded in institutional ledger.'}
        </p>
        
        {/* Decentralized Info Card */}
        <div className="w-full bg-slate-50 border rounded-xl p-4 mb-6 text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className={layerInfo.color}>{layerInfo.icon}</span>
            <span className="text-xs font-black uppercase text-slate-500">Transaction Details</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Amount:</span>
              <span className="font-mono text-slate-600">₹{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">To:</span>
              <span className="font-mono text-slate-600">{recipient}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Network:</span>
              <span className="font-mono text-slate-600">
                {layer === SettlementLayer.DECENTRALIZED ? 'Decentralized (P2P)' : 'Institutional (QLDB)'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl uppercase"
        >
          Hub Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black italic">
          Initiate <span className="text-orange-600">Transfer</span>
        </h1>
      </div>

      {/* Layer Selector */}
      <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl mb-6">
        <button
          onClick={() => setLayer(SettlementLayer.INSTITUTIONAL)}
          className={`py-3 rounded-xl flex items-center justify-center gap-2 ${
            layer === SettlementLayer.INSTITUTIONAL
              ? 'bg-white shadow text-slate-900'
              : 'text-slate-400'
          }`}
        >
          <Database size={14} />
          <span className="text-xs font-black uppercase">Institutional</span>
        </button>

        <button
          onClick={() => setLayer(SettlementLayer.DECENTRALIZED)}
          className={`py-3 rounded-xl flex items-center justify-center gap-2 ${
            layer === SettlementLayer.DECENTRALIZED
              ? 'bg-orange-600 text-white'
              : 'text-slate-400'
          }`}
        >
          <Bitcoin size={14} />
          <span className="text-xs font-black uppercase">Decentralized</span>
        </button>
      </div>

      {/* Recipient */}
      <div className="mb-6">
        <label className="text-xs font-black uppercase text-slate-400">Recipient</label>
        <div className="relative">
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={layer === SettlementLayer.DECENTRALIZED ? 'sur1...' : 'VPA or ID'}
            className="w-full p-4 border rounded-xl font-bold"
          />
          <button
            onClick={() => setShowScanner(true)}
            className="absolute right-3 top-3 bg-slate-900 text-white p-2 rounded-lg"
          >
            <Scan size={18} />
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-8 text-center">
        <label className="text-xs font-black uppercase text-slate-400">Amount</label>
        <div className="py-6 bg-white border rounded-3xl">
          <span className="text-4xl font-black">
            {layer === SettlementLayer.DECENTRALIZED ? '' : '₹'}
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || Number(val) >= 0) {
                  setAmount(val);
                }
              }}
              placeholder="0"
              className="bg-transparent text-center w-32 focus:outline-none"
            />
            <span className="text-xs text-slate-400 ml-1">
              {layer === SettlementLayer.DECENTRALIZED ? 'SATS' : ''}
            </span>
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleConfirmPay}
        disabled={!recipient || !amount}
        className={`w-full py-5 text-white font-black rounded-3xl flex items-center justify-center gap-3 ${
          layer === SettlementLayer.DECENTRALIZED
            ? 'bg-orange-600'
            : 'bg-slate-900'
        }`}
      >
        <ShieldCheck size={24} />
        {layer === SettlementLayer.DECENTRALIZED ? 'BROADCAST UTXO' : 'AUTHORIZE FIAT'}
      </button>
    </div>
  );
};

export default Payment;
