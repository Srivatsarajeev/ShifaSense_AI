import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ShieldCheck, 
  Brain, 
  ArrowRight, 
  Download, 
  Share2, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Moon,
  Droplets,
  Plus
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

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const hist = JSON.parse(localStorage.getItem('shifasense_history') || '[]');
    setHistory(hist);
    if (hist.length > 0) {
      setLatest(hist[0]);
    }
  }, []);

  const score = latest?.prediction?.score || 0;
  
  // Generate real graph data from history
  const chartData = history.slice(0, 7).reverse().map((item) => {
    const d = new Date(item.date);
    return { name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()], val: item.prediction.score };
  });
  while (chartData.length < 7) {
    chartData.unshift({ name: '-', val: 0 });
  }

  const metabolicData = chartData;
  const riskLevel = latest?.prediction?.riskLevel || "N/A";
  const recentSummary = latest?.prediction?.summary || "No recent AI analysis available. Please complete an assessment.";
  const lastUpdated = latest ? new Date(latest.date).toLocaleDateString() + ' ' + new Date(latest.date).toLocaleTimeString() : "Never";

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Health Dashboard</h1>
          <p className="text-slate-500 font-medium">Last updated {lastUpdated}.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary !py-2.5 !px-6 !text-xs !bg-white">
            <Download size={16} /> Export PDF
          </button>
          <button className="btn-secondary !py-2.5 !px-6 !text-xs !bg-white">
            <Share2 size={16} /> Share Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Score Card */}
        <div className="lg:col-span-8 glass-card !p-12">
          <div className="flex justify-between items-start mb-12">
             <h3 className="text-xl font-bold text-slate-900">Health Intelligence Score</h3>
             <div className="px-3 py-1 rounded-full bg-blue-50 text-primary text-[10px] font-bold uppercase tracking-widest border border-blue-100 flex items-center gap-1.5">
                <ShieldCheck size={12} /> High Precision AI
             </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-around gap-12">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="128" cy="128" r="110" className="stroke-slate-100 fill-none" strokeWidth="15" />
                <motion.circle 
                  cx="128" cy="128" r="110" 
                  className="stroke-primary fill-none"
                  strokeWidth="15" 
                  strokeDasharray="691"
                  initial={{ strokeDashoffset: 691 }}
                  animate={{ strokeDashoffset: 691 - (691 * score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-8xl font-bold text-slate-900 tracking-tighter">{score}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{riskLevel}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 min-w-[200px]">
               {[
                 { label: 'Consistency', val: history.length > 3 ? 'High' : 'Learning', icon: CheckCircle2, color: 'text-emerald-500' },
                 { label: 'Bio-Sync', val: latest ? 'Synced' : 'N/A', icon: Activity, color: 'text-blue-500' },
                 { label: 'Total Assessments', val: history.length, icon: Brain, color: 'text-indigo-500' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between gap-10">
                    <div className="flex items-center gap-3">
                       <item.icon size={18} className={item.color} />
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">{item.val}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Risk Assessment Card */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="glass-card flex-1 !p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-8">Risk Assessment</h3>
              <div className="space-y-8">
                 <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                       <ShieldCheck size={24} />
                    </div>
                    <div>
                       <div className="text-lg font-bold text-emerald-600">{riskLevel}</div>
                       <div className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest">Current AI Evaluation</div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                          <span className="text-slate-400">Analysis Confidence</span>
                          <span className="text-emerald-500">High</span>
                       </div>
                       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                          <span className="text-slate-400">Dataset Match</span>
                          <span className="text-blue-500">Strong</span>
                       </div>
                       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: '92%' }} />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-card !p-8">
              <div className="flex justify-between items-center mb-6">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Score History</h4>
                 <div className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <TrendingUp size={14} /> Tracking
                 </div>
              </div>
              <div className="h-20">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metabolicData}>
                       <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                          {metabolicData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === metabolicData.length - 1 ? '#2563EB' : '#DBEAFE'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* AI Insights Card */}
        <div className="lg:col-span-12 glass-card !p-12 flex flex-col md:flex-row gap-16">
           <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest">
                 <Brain size={20} /> Advanced AI Insights
              </div>
              <h3 className="text-2xl font-bold text-slate-900 leading-relaxed">
                {recentSummary}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                This insight is dynamically generated based on your latest assessment. Regular check-ins will improve accuracy and provide longitudinal health tracking.
              </p>
           </div>
           
           <div className="w-full md:w-80 bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Core Metrics</div>
              <div className="space-y-8">
                 {[
                   { label: 'Sleep Reported', strength: latest?.formData?.sleep ? `${latest.formData.sleep} hours` : 'N/A', val: latest?.formData?.sleep ? Math.min(latest.formData.sleep * 10, 100) : 0 },
                   { label: 'Stress Level', strength: latest?.formData?.stress ? `${latest.formData.stress}/10` : 'N/A', val: latest?.formData?.stress ? (10 - latest.formData.stress) * 10 : 0 }
                 ].map((c, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                         <span className="text-slate-500">{c.label}</span>
                         <span className="text-slate-400">{c.strength}</span>
                      </div>
                      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                         <div className="h-full bg-primary" style={{ width: `${c.val}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
