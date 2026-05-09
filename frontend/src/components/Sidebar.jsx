import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  History, 
  Settings, 
  HelpCircle, 
  LogOut,
  PlusCircle,
  Activity,
  ShieldPlus
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Assessments', path: '/assessment', icon: ClipboardCheck },
    { name: 'History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-40 hidden lg:flex flex-col">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldPlus className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 leading-tight">ShifaSense</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinical Assistant</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 pt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-2 border-t border-slate-100">
        <Link to="/assessment" className="btn-primary !py-3 !px-4 w-full text-sm mb-6">
          <PlusCircle size={18} /> New Assessment
        </Link>
        <Link to="/help" className="sidebar-link">
          <HelpCircle size={20} /> Help Center
        </Link>
        <button className="sidebar-link w-full text-left">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
