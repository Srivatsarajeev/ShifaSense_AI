import React from 'react';
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
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('shifasense_history') || '[]');
    if (history.length > 0) {
      setLatest(history[0]);
    }
  }, []);

  const score = latest?.prediction?.score || 85;
  const metabolicData = [
    { name: 'Mon', val: 45 },
    { name: 'Tue', val: 52 },
    { name: 'Wed', val: 48 },
    { name: 'Thu', val: 65 },
    { name: 'Fri', val: 78 },
    { name: 'Sat', val: 75 },
    { name: 'Sun', val: score },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Health Dashboard</h1>
          <p className="text-slate-500 font-medium">Last updated today at 08:45 AM. Clinical AI analysis complete.</p>
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Optimal</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 min-w-[200px]">
               {[
                 { label: 'Consistency', val: '92%', icon: CheckCircle2, color: 'text-emerald-500' },
                 { label: 'Bio-Sync', val: '88%', icon: Activity, color: 'text-blue-500' },
                 { label: 'Mental Clarity', val: '74%', icon: Brain, color: 'text-indigo-500' }
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
                       <div className="text-lg font-bold text-emerald-600">Healthy</div>
                       <div className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest">Low immediate risks</div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                          <span className="text-slate-400">Cardiovascular Risk</span>
                          <span className="text-emerald-500">Minimal</span>
                       </div>
                       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '15%' }} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                          <span className="text-slate-400">Metabolic Stress</span>
                          <span className="text-amber-500">Moderate</span>
                       </div>
                       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: '45%' }} />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-card !p-8">
              <div className="flex justify-between items-center mb-6">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Metabolic Trend</h4>
                 <div className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <TrendingUp size={14} /> +4.2%
                 </div>
              </div>
              <div className="h-20">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metabolicData}>
                       <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                          {metabolicData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === 6 ? '#2563EB' : '#DBEAFE'} />
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
                Your biomarkers suggest a <span className="text-primary underline decoration-2 underline-offset-4">consistent recovery pattern</span> over the last 14 days. However, there is a noted correlation between late-evening blue light exposure and a 12% dip in deep sleep efficiency.
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Clinical interpretation indicates that metabolic stress levels remain within the 40th percentile, which is optimal for your age group and physical activity profile.
              </p>
           </div>
           
           <div className="w-full md:w-80 bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Core Correlations</div>
              <div className="space-y-8">
                 {[
                   { label: 'Sleep Quality vs Energy', strength: 'High Link', val: 90 },
                   { label: 'Nutrient Density vs Mood', strength: 'Med Link', val: 65 }
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

      {/* Actionable Recommendations */}
      <div className="space-y-8">
         <h3 className="text-2xl font-bold text-slate-900">Actionable Recommendations</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                tag: 'High Impact', 
                cat: 'Physical', 
                title: 'Evening Circadian Sync', 
                desc: 'Implement a 30-minute digital detox before sleep to increase natural melatonin production.',
                img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2070',
                btn: 'Read Guide'
              },
              { 
                tag: 'Medium Impact', 
                cat: 'Nutrition', 
                title: 'Magnesium Optimization', 
                desc: 'Increase intake of leafy greens and nuts to address the slight dip in intracellular magnesium levels.',
                img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=2070',
                btn: 'View Plan'
              },
              { 
                tag: 'Maintenance', 
                cat: 'Mental', 
                title: 'Breath-to-Heart Rate Coherence', 
                desc: 'Perform 5 minutes of box breathing to stabilize Heart Rate Variability (HRV) during work peaks.',
                img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2070',
                btn: 'Start Session'
              }
            ].map((rec, i) => (
              <div key={i} className="glass-card !p-0 flex flex-col group cursor-pointer">
                 <div className="h-48 overflow-hidden relative">
                    <img src={rec.img} alt={rec.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[8px] font-bold uppercase tracking-widest text-slate-900">{rec.tag}</span>
                    </div>
                 </div>
                 <div className="p-8 space-y-4 flex-1 flex flex-col">
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest">{rec.cat}</div>
                    <h4 className="text-xl font-bold text-slate-900">{rec.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-3">{rec.desc}</p>
                    <button className="mt-auto pt-6 text-primary font-bold text-xs flex items-center gap-2 group-hover:gap-3 transition-all uppercase tracking-[0.2em]">
                       {rec.btn} <ArrowRight size={14} />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
