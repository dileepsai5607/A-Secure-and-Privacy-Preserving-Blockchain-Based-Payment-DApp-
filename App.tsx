
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './screens/Dashboard';
import Payment from './screens/Payment';
import History from './screens/History';
import SecurityCenter from './screens/SecurityCenter';
import Login from './screens/Login';
import { User, Transaction, TransactionType, TransactionStatus } from './types';
import { apiService } from './services/apiService';
import { ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const initApp = async () => {
      const savedUserId = localStorage.getItem('suraksha_active_session');
      if (savedUserId) {
        const [userData, txData] = await Promise.all([
          apiService.fetchUser(savedUserId),
          apiService.fetchTransactions(savedUserId)
        ]);
        if (userData) {
          setUser(userData);
          setTransactions(txData);
        }
      }
      setIsLoading(false);
    };
    initApp();
  }, []);

  const handleLogin = async (userData: User) => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    setUser(userData);
    localStorage.setItem('suraksha_active_session', userData.id);
    const txData = await apiService.fetchTransactions(userData.id);
    setTransactions(txData);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const result = await apiService.updateProfile(updatedUser);
    setUser(result);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('suraksha_active_session');
  };

  const onTransactionComplete = (newTx: Transaction) => {
    // Add locally for immediate feedback, then refresh from DB
    setTransactions(prev => [newTx, ...prev]);
    if (user) {
      const newBalance = newTx.type === TransactionType.SENT 
        ? user.balance - newTx.amount 
        : user.balance + newTx.amount;
      setUser({ ...user, balance: newBalance });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-orange-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-orange-600/30 animate-[bounce_2s_infinite]">
            <ShieldCheck size={48} strokeWidth={2.5} />
          </div>
          <div className="absolute -inset-4 bg-orange-600/20 rounded-full blur-2xl animate-pulse"></div>
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter">
          SURAKSHA <span className="text-orange-500">PAY</span>
        </h1>
        <div className="mt-20 w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-orange-600 animate-[loading_2.5s_ease-in-out]"></div>
        </div>
        <style>{`
          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <div className="h-screen bg-slate-50 text-slate-900 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
        {user ? (
          <>
            <div className="flex-1 pb-24 overflow-y-auto scroll-smooth">
              <Routes>
                <Route path="/" element={<Dashboard user={user} transactions={transactions} />} />
                <Route path="/pay" element={<Payment user={user} onComplete={onTransactionComplete} />} />
                <Route path="/history" element={<History transactions={transactions} />} />
                <Route path="/security" element={<SecurityCenter user={user} onUpdateUser={handleUpdateUser} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
            <Navbar onLogout={handleLogout} />
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
