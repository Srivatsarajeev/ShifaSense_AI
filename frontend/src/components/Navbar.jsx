import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldPlus, Bell, User, Search } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(false);
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        await axios.get(apiUrl);
        setIsOnline(true);
      } catch (err) {
        setIsOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isLanding) {
    return (
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-30">
        <div className="flex-1 max-w-md hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-400">
          <Search size={18} />
          <input type="text" placeholder="Search records, insights..." className="bg-transparent border-none outline-none text-sm w-full text-slate-700" />
        </div>

        <div className="flex items-center gap-6 ml-auto">
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${isOnline ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {isOnline ? 'Core Online' : 'Connecting...'}
          </div>
          
          <button className="relative p-2 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-700">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-all">
              <User size={20} className="text-slate-400 group-hover:text-slate-700" />
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">Supritha S.</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Officer</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-20 py-6 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <ShieldPlus className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tighter">
          ShifaSense <span className="text-primary">AI</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        {[
          { name: 'Assessment', path: '/assessment' },
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Reports', path: '/reports' },
          { name: 'History', path: '/history' }
        ].map((item) => (
          <Link 
            key={item.name}
            to={item.path} 
            className={`text-sm font-semibold tracking-tight transition-all hover:text-primary ${location.pathname === item.path ? 'text-primary' : 'text-slate-500'}`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="text-sm font-bold text-slate-700 px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
          Login
        </button>
        <button className="btn-primary !py-2.5 !px-6 !text-sm">
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
