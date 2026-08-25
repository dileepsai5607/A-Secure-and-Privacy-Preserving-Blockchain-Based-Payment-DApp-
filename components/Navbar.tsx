
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Send, Clock, Shield, LogOut } from 'lucide-react';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/pay', icon: Send, label: 'Pay' },
    { to: '/history', icon: Clock, label: 'History' },
    { to: '/security', icon: Shield, label: 'Security' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center max-w-md mx-auto z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {/* Fix: use a render function to access isActive state in NavLink children */}
          {({ isActive }) => (
            <>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
      <button 
        onClick={onLogout}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-500 transition-colors"
      >
        <LogOut size={22} />
        <span className="text-[10px] font-medium uppercase tracking-wider">Exit</span>
      </button>
    </nav>
  );
};

export default Navbar;
