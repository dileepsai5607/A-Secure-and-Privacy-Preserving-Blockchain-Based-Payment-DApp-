
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';
import { getSecurityAdvise } from '../services/geminiService';
import { ShieldCheck, Lock, Fingerprint, Send, Sparkles, Info, ChevronRight, Activity, Cpu, User as UserIcon, Check, Edit2 } from 'lucide-react';

interface SecurityCenterProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const SecurityCenter: React.FC<SecurityCenterProps> = ({ user, onUpdateUser }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Namaste! I'm Suraksha AI. Ask me anything about your account's cryptographic status or general security tips.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await getSecurityAdvise(input);
    const aiMsg: ChatMessage = { role: 'assistant', content: response, timestamp: new Date() };
    
    setChatMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleSaveName = () => {
    if (tempName.trim() && tempName !== user.name) {
      onUpdateUser({ ...user, name: tempName });
      if ('vibrate' in navigator) navigator.vibrate(20);
    }
    setIsEditingName(false);
  };

  return (
    <div className="p-6 space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-black italic tracking-tight">SECURITY <span className="text-orange-600">HUB</span></h1>
        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest opacity-70">Defense Protocol v4.0.1</p>
      </div>

      {/* Account Identity Card (Name Change) */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
              <UserIcon size={20} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Account Identity</h3>
          </div>
          {!isEditingName ? (
            <button 
              onClick={() => setIsEditingName(true)}
              className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-lg active:scale-90 transition-transform flex items-center gap-1.5"
            >
              <Edit2 size={12} /> Edit
            </button>
          ) : (
            <button 
              onClick={handleSaveName}
              className="text-[10px] font-black text-white uppercase tracking-widest bg-teal-500 px-3 py-1.5 rounded-lg active:scale-90 transition-transform flex items-center gap-1.5"
            >
              <Check size={12} /> Save
            </button>
          )}
        </div>

        {isEditingName ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <input 
              autoFocus
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none font-bold text-lg transition-all"
              placeholder="Enter your name"
            />
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 tracking-tight italic">{user.name}</span>
            <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tighter">UID: {user.id}</span>
          </div>
        )}
      </div>

      {/* Network Health */}
      <div className="bg-slate-900 rounded-[2rem] p-5 flex items-center justify-between text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400">
            <Activity size={24} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest">Network Health</h3>
            <p className="text-[10px] text-slate-400 font-bold">Lattice verification active</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-teal-400 text-xs font-black">EXCELLENT</p>
          <p className="text-[9px] text-slate-500 font-mono">ms: 1.12</p>
        </div>
      </div>

      {/* Decentralized Network Status */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-[2rem] p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
            <Cpu size={20} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Decentralized Network</h3>
            <p className="text-[9px] text-slate-500 font-bold">No central control • P2P Verification</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-white rounded-xl border border-orange-100">
            <p className="text-lg font-black text-orange-600">1024+</p>
            <p className="text-[8px] text-slate-400 font-bold uppercase">Validators</p>
          </div>
          <div className="text-center p-3 bg-white rounded-xl border border-orange-100">
            <p className="text-lg font-black text-orange-600">IPFS</p>
            <p className="text-[8px] text-slate-400 font-bold uppercase">Storage</p>
          </div>
          <div className="text-center p-3 bg-white rounded-xl border border-orange-100">
            <p className="text-lg font-black text-orange-600">ZK</p>
            <p className="text-[8px] text-slate-400 font-bold uppercase">Privacy</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-[9px] text-slate-500">
          <div className="h-1.5 w-1.5 bg-teal-500 rounded-full animate-pulse"></div>
          <span className="font-bold">Connected to decentralized network</span>
        </div>
      </div>

      {/* Security Features Toggles */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Lock, title: 'ZKP Tunnel', status: 'Enabled', color: 'text-teal-600', bg: 'bg-teal-50' },
          { icon: Fingerprint, title: 'Bio-Auth', status: 'Active', color: 'text-orange-600', bg: 'bg-orange-50' },
          { icon: Cpu, title: 'Quantum PQC', status: 'Secure', color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: ShieldCheck, title: 'E2EE Voice', status: 'Standby', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((feat, i) => (
          <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-transform cursor-pointer">
            <div className={`w-10 h-10 ${feat.bg} ${feat.color} rounded-xl flex items-center justify-center mb-3`}>
              <feat.icon size={20} />
            </div>
            <h3 className="font-bold text-xs mb-0.5">{feat.title}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className={`text-[9px] font-black uppercase tracking-widest ${feat.color}`}>{feat.status}</span>
              <ChevronRight size={12} className="text-slate-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Suraksha AI Assistant */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[400px] relative">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 flex items-center gap-4 text-white">
          <div className="p-2 bg-orange-600 rounded-xl shadow-lg shadow-orange-900/40">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-black italic text-sm tracking-tight">SURAKSHA <span className="text-orange-500">AI</span></h3>
            <p className="text-[9px] font-bold opacity-60 uppercase tracking-[0.2em]">Neural Security Layer</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-[11px] leading-relaxed font-semibold ${
                msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-3xl flex gap-1.5 shadow-sm border border-slate-200">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about ZKP, Lattice Cryptography..."
            className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-orange-100 transition-all"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="p-3 bg-orange-600 text-white rounded-2xl active:scale-90 transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] justify-center pt-2">
        <Info size={14} className="text-orange-500" />
        <span>Hardware Security Module Bound</span>
      </div>
    </div>
  );
};

export default SecurityCenter;
