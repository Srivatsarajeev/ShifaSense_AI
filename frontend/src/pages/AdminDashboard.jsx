import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  AlertCircle, 
  Activity, 
  TrendingUp, 
  Search, 
  Bell, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  PlusCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';

const AdminDashboard = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('shifasense_history') || '[]');
    setHistory(saved);
  }, []);

  const stats = [
    { label: 'Total Assessments', val: history.length || '12,482', change: '+12.5% vs last month', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'High-Risk Cases', val: '148', change: 'Requires immediate attention', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Daily Active Users', val: '3,240', change: 'High engagement today', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' }
  ];

  const growthData = [
    { month: 'May', val: 30 },
    { month: 'Jun', val: 45 },
    { month: 'Jul', val: 40 },
    { month: 'Aug', val: 65 },
    { month: 'Sep', val: 80 },
    { month: 'Oct', val: 95 },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium">System oversight and patient registry management.</p>
        </div>
        <div className="flex gap-4">
           <button className="btn-secondary !py-2.5 !px-6 !text-xs !bg-white">
             <Filter size={16} /> Filters
           </button>
           <button className="btn-primary !py-2.5 !px-6 !text-xs">
             <PlusCircle size={16} /> Add User
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {stats.map((stat, i) => (
           <div key={i} className="glass-card !p-8 flex items-start justify-between">
              <div className="space-y-4">
                 <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                 <div className="text-4xl font-bold text-slate-900">{stat.val}</div>
                 <div className={`text-[10px] font-bold flex items-center gap-1.5 ${stat.color}`}>
                    {stat.icon === AlertCircle ? <AlertCircle size={12} /> : <TrendingUp size={12} />} {stat.change}
                 </div>
              </div>
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                 <stat.icon size={28} />
              </div>
           </div>
         ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 glass-card !p-10">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-xl font-bold text-slate-900">User Growth Trends</h3>
               <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-full bg-blue-50 text-primary text-[10px] font-bold uppercase tracking-widest border border-blue-100">Monthly</button>
                  <button className="px-3 py-1 rounded-full text-slate-400 text-[10px] font-bold uppercase tracking-widest">Weekly</button>
               </div>
            </div>
            <div className="h-[280px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growthData}>
                     <Bar dataKey="val" radius={[6, 6, 0, 0]}>
                        {growthData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === 5 ? '#2563EB' : '#DBEAFE'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="lg:col-span-4 glass-card !p-10 space-y-8">
            <div className="flex items-center gap-3 text-indigo-600 font-bold text-sm uppercase tracking-widest">
               <Activity size={20} /> AI Insights
            </div>
            
            <div className="space-y-6">
               <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-3">
                  <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Anomaly Detected</div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">7% increase in sleep-related concerns among high-risk groups in the last 48 hours.</p>
               </div>

               <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Action</div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">Prioritize review for patient IDs: #842, #109, and #331 based on recent assessment scores.</p>
               </div>

               <button className="w-full pt-4 text-primary font-bold text-xs flex items-center justify-center gap-2 uppercase tracking-[0.2em] hover:gap-3 transition-all">
                  View Full Report <ExternalLink size={14} />
               </button>
            </div>
         </div>
      </div>

      {/* User Registry Table */}
      <div className="glass-card !p-0 overflow-hidden">
         <div className="p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h3 className="text-xl font-bold text-slate-900">User Registry</h3>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Filter size={16} /> Status: All
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Download size={16} /> Export
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 border-y border-slate-100">
                  <tr>
                     <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                     <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                     <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Assessment</th>
                     <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Score</th>
                     <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {history.length > 0 ? history.map((entry) => (
                     <tr key={entry.id} className="hover:bg-slate-50 transition-all group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-xs">
                                 PA
                              </div>
                              <div>
                                 <div className="text-sm font-bold text-slate-900">Patient Assessment</div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {entry.id}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                              entry.prediction?.risk_level === 'Healthy' ? 'bg-emerald-50 text-emerald-600' :
                              'bg-amber-50 text-amber-600'
                           }`}>
                              {entry.prediction?.risk_level || 'Processing'}
                           </span>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                              <Clock size={14} className="text-slate-300" /> {entry.date}
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="flex-1 min-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-primary" style={{ width: `${entry.prediction?.score || 85}%` }} />
                              </div>
                              <span className="text-xs font-bold text-slate-700">{entry.prediction?.score || 85}%</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <button className="p-2 rounded-lg hover:bg-white transition-all text-slate-400 hover:text-slate-700">
                              <MoreVertical size={18} />
                           </button>
                        </td>
                     </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-10 py-10 text-center text-slate-400 text-sm font-medium italic">No assessment records found. Start a new assessment to see data here.</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>

         <div className="p-10 bg-slate-50 flex justify-between items-center border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 3 of 12,482 users</span>
            <div className="flex gap-2">
               <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white transition-all shadow-sm"><ChevronLeft size={18} /></button>
               <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white transition-all shadow-sm"><ChevronRight size={18} /></button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
