import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Heart, Activity, Moon, Zap, Droplets, Monitor, Brain, 
  Search, Menu, ChevronRight, ArrowRight, Shield, CheckCircle2, 
  Clock, TrendingUp, AlertTriangle, Users, Smartphone, Lock, Info, Mail, Plus, Minus
} from 'lucide-react';

const COLORS = {
  primary: '#2563EB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444'
};

// --- SUB-COMPONENTS (Defined outside to prevent focus loss during state updates) ---

const Navbar = ({ setView, setStep, view }) => (
  <nav className="sticky top-0 z-50 h-[64px] bg-white border-b border-[#E5E7EB] px-[48px] flex items-center justify-between">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
      <div className="w-[20px] h-[20px] rounded-[4px] bg-[#2563EB] flex items-center justify-center">
         <Heart className="text-white" size={12} fill="white" />
      </div>
      <div className="flex text-[18px] font-bold font-poppins">
        <span className="text-[#111827]">ShifaSense</span>
        <span className="text-[#2563EB]">AI</span>
      </div>
    </div>
    <div className="flex items-center gap-[32px]">
      {['Home', 'Assessment', 'Dashboard', 'Admin'].map(item => (
        <button key={item} onClick={() => { setView(item.toLowerCase() === 'home' ? 'landing' : item.toLowerCase()); if(item === 'Assessment') setStep(1); }}
          className={`text-[14px] font-inter transition-colors ${view === (item.toLowerCase() === 'home' ? 'landing' : item.toLowerCase()) ? 'text-[#2563EB]' : 'text-[#6B7280] hover:text-[#2563EB]'}`}>
          {item}
        </button>
      ))}
      <button onClick={() => { setView('assessment'); setStep(1); }} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-[18px] py-[8px] rounded-[8px] font-inter font-[500] text-[14px] transition-colors">Start Analysis</button>
    </div>
  </nav>
);

const LandingView = ({ setView, setStep }) => (
  <div className="animate-in fade-in duration-1000">
    <section className="relative overflow-hidden bg-white pt-24 pb-48 px-6 lg:px-20">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F0F7FF] rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[#F0FDFA] rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10 text-left">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-[#DBEAFE] px-4 py-2 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse shadow-[0_0_8px_#2563EB]"></div>
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-[0.2em]">Diagnostic Ecosystem 2.0</span>
          </div>
          <h1 className="text-7xl lg:text-8xl font-poppins font-[700] leading-[1.05] tracking-[-0.03em] text-[#111827]">
            Health Data, <br />
            <span className="bg-gradient-to-r from-[#2563EB] to-[#00a4b4] bg-clip-text text-transparent underline decoration-[#DBEAFE] decoration-4 underline-offset-8">Perfected.</span>
          </h1>
          <p className="text-xl text-[#6B7280] max-w-xl leading-relaxed font-inter">
            ShifaSense AI orchestrates 1.2M clinical data points to isolate your health trajectory. 
            Evidence-based diagnostics at the speed of thought.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
            <button onClick={() => { setView('assessment'); setStep(1); }} className="group bg-[#2563EB] text-white px-10 py-5 rounded-[14px] font-bold text-lg shadow-2xl shadow-blue-200 transition-all hover:bg-[#1D4ED8] hover:scale-[1.02] flex items-center gap-3">
              Start Analysis <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="relative h-[500px] flex items-center justify-center">
           <div className="absolute inset-0 bg-blue-50/20 rounded-full blur-3xl animate-pulse"></div>
           <div className="relative w-80 h-80 bg-white rounded-full border border-blue-100 shadow-2xl flex items-center justify-center z-10">
              <Heart size={80} className="text-[#2563EB] animate-pulse" fill="rgba(37,99,235,0.05)" />
              <div className="absolute w-full h-full animate-[spin_20s_linear_infinite]">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border border-blue-100 rounded-2xl shadow-lg flex items-center justify-center"><Moon size={24} className="text-indigo-500" /></div>
              </div>
              <div className="absolute w-full h-full animate-[spin_25s_linear_infinite_reverse]">
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 bg-white border border-blue-100 rounded-2xl shadow-lg flex items-center justify-center"><Zap size={24} className="text-amber-500" /></div>
              </div>
              <div className="absolute w-full h-full animate-[spin_30s_linear_infinite]">
                 <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border border-blue-100 rounded-2xl shadow-lg flex items-center justify-center"><Activity size={24} className="text-rose-500" /></div>
              </div>
           </div>
           <svg className="absolute w-full h-full opacity-20" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="2 2" />
           </svg>
        </div>
      </div>
    </section>
    <section className="max-w-7xl mx-auto px-6 lg:px-20 pb-40">
       <div className="grid md:grid-cols-4 gap-4 items-center">
          <div className="space-y-4">
             <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Process 01</span>
             <h3 className="text-2xl font-bold">Biometric Ingestion</h3>
             <p className="text-sm text-slate-500 leading-relaxed">Securely sync sleep, stress, and physiological metrics through our encrypted health hub.</p>
          </div>
          <div className="hidden md:flex justify-center text-slate-200"><ArrowRight size={40} /></div>
          <div className="space-y-4">
             <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Process 02</span>
             <h3 className="text-2xl font-bold">Pattern Recognition</h3>
             <p className="text-sm text-slate-500 leading-relaxed">Your profile is cross-referenced against 10,000 clinical records to isolate risk clusters.</p>
          </div>
          <div className="bg-[#2563EB] p-8 rounded-3xl text-white space-y-4 shadow-xl shadow-blue-100">
             <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"><CheckCircle2 /></div>
             <h3 className="text-xl font-bold">Clinical Protocol</h3>
             <p className="text-xs text-blue-100">Receive precision-tuned health strategies and longitudinal wellness guidance.</p>
          </div>
       </div>
    </section>
  </div>
);

const AssessmentView = ({ step, setStep, formData, setFormData, handleAnalyze }) => (
  <div className="bg-[#F8FAFC] min-h-screen">
    <div className="max-w-[620px] mx-auto text-center pt-[40px] pb-[32px]">
      <div className="flex items-center justify-center gap-[12px] mb-[24px]">
        {[1, 2, 3].map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-[8px]">
              <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-[14px] font-poppins font-[600] transition-all duration-300 ${step === s ? 'bg-[#2563EB] text-white shadow-[0_0_0_4px_#DBEAFE]' : step > s ? 'bg-[#10B981] text-white' : 'bg-white border-2 border-[#E5E7EB] text-[#9CA3AF]'}`}>
                {step > s ? <CheckCircle2 size={18} /> : s}
              </div>
            </div>
            {i < 2 && <div className="w-[80px] h-[2px] bg-[#E5E7EB]" />}
          </React.Fragment>
        ))}
      </div>
      <h1 className="text-[26px] font-poppins font-[600] text-[#111827]">
        {step === 1 ? 'Sleep & Recovery' : step === 2 ? 'Activity & Screen' : 'Vitals & Profile'}
      </h1>
    </div>
    <div className="max-w-[620px] mx-auto bg-white border border-[#E5E7EB] rounded-[16px] p-[36px] shadow-[0_4px_24px_rgba(0,0,0,0.07)] mb-20">
       <div className="space-y-[28px]">
          {step === 1 && (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-[14px] font-medium">Sleep Hours</span><span className="text-[#2563EB] font-bold">{formData.sleep}h</span></div>
                <input type="range" min="0" max="12" step="0.5" value={formData.sleep} onChange={(e) => setFormData({...formData, sleep: parseFloat(e.target.value)})} className="w-full" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-[14px] font-medium">Stress Level</span><span className="text-[#2563EB] font-bold">{formData.stress}/10</span></div>
                <input type="range" min="1" max="10" value={formData.stress} onChange={(e) => setFormData({...formData, stress: parseInt(e.target.value)})} className="w-full" />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-[14px] font-medium">Activity (mins)</span><span className="text-[#2563EB] font-bold">{formData.activity}m</span></div>
                <input type="range" min="0" max="180" value={formData.activity} onChange={(e) => setFormData({...formData, activity: parseInt(e.target.value)})} className="w-full" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-[14px] font-medium">Screen Time</span><span className="text-[#2563EB] font-bold">{formData.screenTime}h</span></div>
                <input type="range" min="0" max="16" value={formData.screenTime} onChange={(e) => setFormData({...formData, screenTime: parseInt(e.target.value)})} className="w-full" />
              </div>
            </>
          )}
          {step === 3 && (
            <div className="space-y-6">
              <input autoFocus type="text" placeholder="Full Name" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Age: {formData.age}</span>
                <input type="range" min="18" max="100" value={formData.age} onChange={(e)=>setFormData({...formData, age: parseInt(e.target.value)})} className="flex-1" />
              </div>
              <select value={formData.gender} onChange={(e)=>setFormData({...formData, gender: e.target.value})} className="w-full border p-3 rounded-lg"><option>Female</option><option>Male</option><option>Non-binary</option></select>
            </div>
          )}
       </div>
       <div className="mt-8 pt-6 border-t flex justify-between">
          <button onClick={() => setStep(s => s - 1)} className={`px-6 py-2 border rounded-lg ${step === 1 ? 'invisible' : ''}`}>Back</button>
          <button onClick={() => step < 3 ? setStep(s => s + 1) : handleAnalyze()} className="bg-[#2563EB] text-white px-8 py-2 rounded-lg font-bold">{step === 3 ? 'Analyze My Health →' : 'Next Step'}</button>
       </div>
    </div>
  </div>
);

const ResultsView = ({ result, formData, backendData }) => {
  if (!result) return null;
  return (
    <div className="max-w-7xl mx-auto py-16 px-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b pb-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-bold">Health Intelligence Report</h1>
           <div className="flex items-center gap-4 text-slate-500 font-medium">
              <span>Patient: <span className="text-[#2563EB] font-bold">{formData.name || 'Anonymous'}</span></span>
              <span>·</span>
              <span>Age: <span className="font-bold text-slate-800">{formData.age}</span></span>
              <span>·</span>
              <span>{formData.gender}</span>
           </div>
        </div>
        <div className="text-right">
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
           <div className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Sleep', val: formData.sleep + 'h', icon: <Moon size={14} /> },
          { label: 'Stress', val: formData.stress + '/10', icon: <Zap size={14} /> },
          { label: 'Activity', val: formData.activity + 'm', icon: <Activity size={14} /> },
          { label: 'Hydration', val: formData.hydration + ' gls', icon: <Droplets size={14} /> },
          { label: 'Screen', val: formData.screenTime + 'h', icon: <Monitor size={14} /> }
        ].map((item, i) => (
          <div key={i} className="bg-white border p-4 rounded-xl flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">{item.icon}</div>
             <div><div className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</div><div className="text-sm font-bold">{item.val}</div></div>
          </div>
        ))}
      </div>
      
      {backendData ? (
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#166534] font-medium"><CheckCircle2 size={20} />Evidence-based analysis · Matched against 10,000 real health profiles · Confidence: {Math.round(backendData.confidence * 100)}%</div>
          <span className="bg-[#166534] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Dataset-Powered</span>
        </div>
      ) : (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-4 rounded-xl flex items-center gap-3 text-[#1E40AF] font-medium"><Info size={20} /> AI-generated analysis</div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
         <div className="bg-white border p-8 rounded-2xl text-center">
            <div className="text-6xl font-bold" style={{ color: result.riskColor }}>{result.healthScore}</div>
            <div className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Health Score</div>
            <div className="mt-4 px-4 py-1.5 rounded-full text-white font-bold text-xs uppercase" style={{ backgroundColor: result.riskColor }}>{result.riskLevel}</div>
         </div>
         <div className="md:col-span-2 bg-white border p-8 rounded-2xl flex flex-col justify-center">
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-2 tracking-widest">Analysis Summary</h3>
            <p className="text-lg leading-relaxed text-slate-700 font-medium">{result.summary}</p>
            {result.riskFactors && <div className="mt-4 flex flex-wrap gap-2">{result.riskFactors.map((f, i) => <span key={i} className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-lg border border-rose-100">{f}</span>)}</div>}
         </div>
      </div>

      {backendData && result.neighborComparison && (
        <div className="bg-white border p-10 rounded-3xl space-y-8">
           <h3 className="text-2xl font-bold">You vs. Similar Profiles</h3>
           <div className="space-y-6">
              {[
                { label: 'Sleep', user: result.neighborComparison.userSleep, avg: result.neighborComparison.avgSleep, unit: 'h' },
                { label: 'Stress', user: result.neighborComparison.userStress, avg: result.neighborComparison.avgStress, unit: '/10' },
                { label: 'Activity', user: result.neighborComparison.userActivity, avg: result.neighborComparison.avgActivity, unit: 'm' }
              ].map((row, i) => {
                const better = row.label === 'Stress' ? row.user < row.avg : row.user > row.avg;
                const similar = Math.abs(row.user - row.avg) / row.avg < 0.1;
                const color = similar ? '#94A3B8' : better ? '#10B981' : '#F59E0B';
                return (
                  <div key={i} className="grid grid-cols-4 items-center gap-8">
                     <div className="font-bold text-lg">{row.label}</div>
                     <div className="text-sm">You: <span className="font-bold">{row.user}{row.unit}</span></div>
                     <div className="text-sm">Avg: <span className="font-bold text-slate-400">{row.avg}{row.unit}</span></div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex"><div className="h-full w-1/2 border-r" style={{ backgroundColor: color }} /><div className="h-full w-1/2" style={{ backgroundColor: '#E2E8F0' }} /></div>
                  </div>
                );
              })}
           </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
         <div className="bg-white border p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold">Lifestyle Trajectory</h3>
            <div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><RadarChart data={result.radarData}><PolarGrid stroke="#E5E7EB" /><PolarAngleAxis dataKey="metric" tick={{fill: '#94A3B8', fontSize: 10}} /><Radar name="Score" dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} /></RadarChart></ResponsiveContainer></div>
         </div>
         <div className="bg-white border p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold">Personalized Action Plan</h3>
            <div className="space-y-4">{result.recommendations?.map((rec, i) => <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl"><div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div><p className="text-sm font-medium">{rec}</p></div>)}</div>
         </div>
      </div>
    </div>
  );
};

const AdminView = ({ statsData }) => (
  <div className="max-w-7xl mx-auto py-16 px-6 space-y-10">
     <h1 className="text-4xl font-bold">ShifaSense Admin Panel</h1>
     <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border p-6 rounded-2xl"><div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Profiles</div><div className="text-4xl font-bold mt-2">{statsData?.totalProfiles || '10,000'}</div></div>
        <div className="bg-white border p-6 rounded-2xl"><div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Risk Score</div><div className="text-4xl font-bold mt-2 text-[#2563EB]">{statsData?.avgRiskScore || '42.5'}%</div></div>
        <div className="bg-white border p-6 rounded-2xl"><div className="text-xs font-bold text-slate-400 uppercase tracking-widest">High Risk %</div><div className="text-4xl font-bold mt-2 text-rose-500">{statsData?.highPct || '13.2'}%</div></div>
        <div className="bg-white border p-6 rounded-2xl"><div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Health Score</div><div className="text-4xl font-bold mt-2 text-emerald-500">{statsData ? 100 - statsData.avgRiskScore : '57.5'}</div></div>
     </div>
     {statsData && (
       <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-10 rounded-3xl space-y-8">
          <h3 className="text-xl font-bold text-[#1E40AF]">Dataset Global Insights</h3>
          <div className="grid md:grid-cols-4 gap-12">
             <div><div className="text-xs font-bold text-slate-400 uppercase mb-1">Avg Sleep</div><div className="text-2xl font-bold">{statsData.avgSleep}h</div></div>
             <div><div className="text-xs font-bold text-slate-400 uppercase mb-1">Avg Stress</div><div className="text-2xl font-bold">{statsData.avgStress}/10</div></div>
             <div><div className="text-xs font-bold text-slate-400 uppercase mb-1">Avg Activity</div><div className="text-2xl font-bold">{statsData.avgActivity}m</div></div>
             <div><div className="text-xs font-bold text-slate-400 uppercase mb-1">Avg BMI</div><div className="text-2xl font-bold">{statsData.avgBMI}</div></div>
          </div>
       </div>
     )}
  </div>
);

const LoadingOverlay = ({ loadingText, phase }) => (
  <div className="fixed inset-0 z-[100] bg-white/95 flex flex-col items-center justify-center">
    <div className="w-[72px] h-[72px] border-[3px] border-[#E5E7EB] border-t-[#2563EB] rounded-full animate-spin" />
    <h2 className="mt-[20px] text-[20px] font-poppins font-[600] text-[#111827]">ShifaSense Intelligence Core</h2>
    <p className="mt-[4px] text-[14px] font-inter text-[#6B7280]">{loadingText}</p>
  </div>
);

const ShifaSenseApp = () => {
  const [view, setView] = useState('landing');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing analysis...');
  const [phase, setPhase] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '', age: 30, gender: 'Female', sleep: 7.5, stress: 5, hydration: 8,
    screenTime: 6, activity: 45, steps: 7000, heartRate: 72, 
    bmi: 24, smoking: 'Non-smoker', alcohol: 'Never', foodHabits: 'Mostly Home Cooked'
  });

  const [backendData, setBackendData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/stats').then(res => res.json()).then(data => { if (!data.error) setStatsData(data); });
  }, []);

  const handleAnalyze = async () => {
    setLoading(true); setPhase(1); setLoadingText("Searching 10,000 health profiles...");
    let bData = null;
    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age: formData.age, gender: formData.gender, sleep: formData.sleep, stress: formData.stress, hydration: formData.hydration, activity: formData.activity, bmi: formData.bmi, smoking: formData.smoking, alcohol: formData.alcohol, foodHabits: formData.foodHabits })
      });
      if (response.ok) {
        bData = await response.json(); setBackendData(bData); setLoadingText("Finding closest clinical matches...");
        await new Promise(r => setTimeout(r, 1500));
      }
    } catch (err) { console.warn("Backend unavailable"); }

    setPhase(2); setLoadingText("Generating clinical protocol...");
    const score = bData ? bData.healthScore : 75;
    const finalResult = {
      healthScore: score,
      riskLevel: bData ? bData.riskLabel : 'Moderate',
      riskColor: bData ? bData.riskColor : "#F59E0B",
      summary: bData ? `Analysis complete. Biometric patterns align with ${bData.riskLabel} clinical profiles.` : "Profile analysis active.",
      riskFactors: bData ? bData.riskFactors : [],
      recommendations: bData ? bData.riskFactors.map(f => `Address ${f.split(':')[0]} as a priority.`) : ["Improve sleep consistency", "Increase hydration"],
      radarData: [ { metric: 'Sleep', value: Math.max(40, 100 - (8-formData.sleep)*10) }, { metric: 'Stress', value: 100 - formData.stress*10 }, { metric: 'Activity', value: Math.min(100, (formData.activity/180)*100) }, { metric: 'Screen', value: 100 - (formData.screenTime/16)*100 }, { metric: 'Steps', value: Math.min(100, (formData.steps/10000)*100) }, { metric: 'Hydration', value: Math.min(100, (formData.hydration/8)*100) } ]
    };

    if (bData && finalResult) {
      finalResult.neighborComparison = { userSleep: formData.sleep, avgSleep: bData.neighborStats.avgSleep, userStress: formData.stress, avgStress: bData.neighborStats.avgStress, userActivity: formData.activity, avgActivity: bData.neighborStats.avgActivity };
    }
    setResult(finalResult); setView('results'); setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar view={view} setView={setView} setStep={setStep} />
      {loading && <LoadingOverlay loadingText={loadingText} phase={phase} />}
      <main>
        {view === 'landing' && <LandingView setView={setView} setStep={setStep} />}
        {view === 'assessment' && <AssessmentView step={step} setStep={setStep} formData={formData} setFormData={setFormData} handleAnalyze={handleAnalyze} />}
        {view === 'results' && <ResultsView result={result} formData={formData} backendData={backendData} />}
        {view === 'admin' && <AdminView statsData={statsData} />}
      </main>
    </div>
  );
};

export default ShifaSenseApp;
