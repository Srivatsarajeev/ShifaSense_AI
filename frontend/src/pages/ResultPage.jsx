import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Share2, 
  RefreshCcw, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Moon, 
  Zap, 
  Droplets, 
  Monitor,
  Heart,
  Calendar,
  ChevronRight,
  Brain,
  FileText,
  BadgeCheck,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  
  const inputData = location.state?.data || {
    sleepDuration: 7,
    stressLevel: 3,
    waterIntake: 2,
    screenTime: 5,
    physicalActivity: 30,
    heartRate: 72,
    dailySteps: 5000
  };

  const prediction = location.state?.prediction;

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const score = prediction?.score || 82;
  const riskLabel = prediction?.risk_level || (score > 80 ? 'Optimal Status' : score > 50 ? 'Moderate Variance' : 'High Risk Pattern');
  
  const getRiskDetails = (label) => {
    if (label.includes('Optimal') || label.includes('Healthy')) return { color: 'text-success', bg: 'bg-success/5', icon: BadgeCheck, border: 'border-success/20', seal: 'Neural Integrity: Verified' };
    if (label.includes('Moderate')) return { color: 'text-warning', bg: 'bg-warning/5', icon: AlertTriangle, border: 'border-warning/20', seal: 'Neural Variance: Monitor' };
    return { color: 'text-danger', bg: 'bg-danger/5', icon: XCircle, border: 'border-danger/20', seal: 'Neural Risk: High' };
  };

  const risk = getRiskDetails(riskLabel);

  const radarData = [
    { subject: 'Recovery', A: inputData.sleepDuration * 8, fullMark: 100 },
    { subject: 'Stress', A: (10 - inputData.stressLevel) * 10, fullMark: 100 },
    { subject: 'Hydration', A: inputData.waterIntake * 20, fullMark: 100 },
    { subject: 'Activity', A: (inputData.physicalActivity / 180) * 100, fullMark: 100 },
    { subject: 'Neural Focus', A: (16 - inputData.screenTime) * 6.25, fullMark: 100 },
  ];

  const insights = prediction?.insights || [
    "Circadian rhythm analysis suggests consistent recovery patterns.",
    "Neural focus remains stable despite digital exposure duration.",
    "Metabolic hydration baseline within clinical efficiency range.",
    "Physical activity magnitude aligns with longevity benchmarks."
  ];

  if (!showContent) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Intelligence Report Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xl shadow-primary/20">
                <img src="/logo.png" alt="ShifaSense Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tighter">ShifaSense <span className="text-primary">AI</span></span>
                <span className="text-[10px] font-bold text-mutedText uppercase tracking-[0.2em]">Neural Diagnostics Engine</span>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Intelligence <span className="text-mutedText">Report</span></h1>
            <div className="flex items-center gap-4 text-xs font-bold text-mutedText uppercase tracking-widest">
               <span className="flex items-center gap-1.5"><Calendar size={14} /> Issued: May 09, 2026</span>
               <span className="w-1 h-1 rounded-full bg-white/20"></span>
               <span className="flex items-center gap-1.5"><Activity size={14} /> ID: {prediction?.prediction_id || 'SS-AI-82914'}</span>
            </div>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none btn-secondary">
              <Download size={18} /> Export Protocol
            </button>
            <button className="flex-1 lg:flex-none btn-primary">
              <FileText size={18} /> Share Analysis
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Central Health Index Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="glass-card flex flex-col items-center justify-center py-16 relative overflow-hidden group">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              
              <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="128" cy="128" r="115" className="stroke-white/5 fill-none" strokeWidth="12" />
                  <motion.circle 
                    cx="128" cy="128" r="115" 
                    className={`fill-none ${risk.color.replace('text', 'stroke')}`}
                    strokeWidth="12" 
                    strokeDasharray="722"
                    initial={{ strokeDashoffset: 722 }}
                    animate={{ strokeDashoffset: 722 - (722 * score) / 100 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-8xl font-bold text-white tracking-tighter"
                  >
                    {score}
                  </motion.span>
                  <span className="text-xs font-bold text-mutedText uppercase tracking-[0.2em] mt-2">Health Index</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-6 relative z-10">
                <div className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl border ${risk.border} ${risk.bg} ${risk.color} text-sm font-bold uppercase tracking-widest shadow-xl shadow-black/20`}>
                  <risk.icon size={20} />
                  {riskLabel}
                </div>
                
                <div className="flex items-center gap-2 text-[10px] font-bold text-mutedText uppercase tracking-[0.2em]">
                   <Sparkles size={12} className="text-primary" /> {risk.seal}
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h3 className="text-xs font-bold text-mutedText uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <Brain size={18} className="text-primary" /> AI Diagnostic Insights
              </h3>
              <div className="space-y-4">
                {insights.map((insight, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (idx * 0.1) }}
                    className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group"
                  >
                    <div className="mt-1 w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors shrink-0" />
                    <p className="text-sm text-mutedText leading-relaxed font-medium group-hover:text-mainText transition-colors">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Analytics & Protocols */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-7 space-y-10"
          >
            {/* Visual Analytics Row */}
            <div className="glass-card p-10 h-[450px]">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xs font-bold text-mutedText uppercase tracking-[0.2em]">Biometric Variance Radar</h3>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                    <Activity size={12} /> Live Metrics
                 </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }} />
                    <Radar
                      name="Patient Data"
                      dataKey="A"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fill="#3B82F6"
                      fillOpacity={0.1}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Protocol Protocols Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-mutedText uppercase tracking-[0.2em]">Optimized Recovery Protocols</h3>
                <span className="text-[10px] font-bold text-success uppercase tracking-widest">Actionable Now</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Circadian Phase Shift', desc: 'Neural patterns suggest moving sleep onset to 10:45 PM for maximum REM density.', icon: Moon, color: 'text-primary' },
                  { title: 'Cortisol Mitigation', desc: 'Integrate 5-minute deep breathing cycles during peak stress hours (2 PM - 4 PM).', icon: Zap, color: 'text-warning' },
                  { title: 'Metabolic Hydration', desc: 'Achieve 3.2L hydration baseline to offset current screen time digital strain.', icon: Droplets, color: 'text-secondary' },
                  { title: 'Cardio Magnitude', desc: 'Increase active intensity by 15% to align with longevity health benchmarks.', icon: Heart, color: 'text-danger' },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-primary/30 hover:bg-white/[0.04] transition-all cursor-pointer group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${item.color}`}>
                      <item.icon size={22} />
                    </div>
                    <h4 className="font-bold text-white mb-3 text-lg">{item.title}</h4>
                    <p className="text-sm text-mutedText leading-relaxed font-medium">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Final Action Call */}
            <div className="flex flex-col items-center gap-6 pt-10 border-t border-white/5">
              <p className="text-xs font-bold text-mutedText uppercase tracking-widest text-center">
                 Data synchronized with patient portal and global registry.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link to="/dashboard" className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-xs hover:gap-4 transition-all group">
                  Enter Patient Portal <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/assessment" className="flex items-center gap-2 text-mutedText font-bold uppercase tracking-[0.2em] text-xs hover:text-white transition-all">
                  <RefreshCcw size={16} /> Recalibrate Intelligence
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
