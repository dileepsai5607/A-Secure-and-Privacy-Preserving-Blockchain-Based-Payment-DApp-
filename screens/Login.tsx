
import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, Fingerprint, Lock, CheckCircle, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleAuth = async () => {
    setIsAuthenticating(true);
    if ('vibrate' in navigator) navigator.vibrate([30, 10, 30]);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAuthSuccess(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    onLogin({
      id: 'usr_7721',
      name: 'Chetana Sree',
      upiId: 'chetana@suraksha',
      btcAddress: 'sur1qw508d6qejxtdg4y5r3zarvary0c5xw7k3lnqah',
      balance: 45250.75,
      btcBalance: 840500, // 0.008 BTC approx
      isPrivacyMode: true
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col justify-between overflow-hidden">
      <div className="pt-20 text-center">
        <div className="inline-block p-4 bg-orange-600 rounded-3xl shadow-2xl shadow-orange-600/30 mb-8 transform hover:scale-105 transition-transform duration-500">
          <ShieldCheck size={48} />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter mb-2">
          SURAKSHA <span className="text-orange-500">PAY</span>
        </h1>
        <h2 className="devanagari text-2xl opacity-80 mb-6 font-bold">सुरक्षा पे</h2>
        <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed font-medium">
          Hybrid mobile vault featuring <span className="text-white">Bitcoin-type</span> decentralized assets and <span className="text-white">Institution-backed</span> fiat.
        </p>
      </div>

      <div className="space-y-4 pb-12 relative z-10">
        <button 
          onClick={handleAuth}
          className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xl rounded-3xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Fingerprint size={24} />
          SECURE LOGIN
        </button>
        <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
          Multi-Layer Identity Scan
        </p>
      </div>

      {isAuthenticating && (
        <div className="fixed inset-0 z-[200] flex items-end animate-in slide-in-from-bottom duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full bg-slate-800 rounded-t-[3rem] p-10 flex flex-col items-center gap-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
            <div className="relative">
              <div className={`p-8 rounded-full border-2 transition-all duration-500 ${authSuccess ? 'border-teal-500 bg-teal-500/10' : 'border-orange-500 bg-orange-500/5 animate-pulse'}`}>
                {authSuccess ? <CheckCircle size={48} className="text-teal-500" /> : <Fingerprint size={48} className="text-orange-500" />}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-1">{authSuccess ? 'Authenticated' : 'Verifying Identity'}</h3>
              <p className="text-slate-400 text-sm font-medium">Deriving Lattice Keys...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
