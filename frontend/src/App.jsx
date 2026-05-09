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

const ShifaSenseApp = () => {
  const [view, setView] = useState('landing');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing your health patterns...');
  const [formData, setFormData] = useState({
    name: '', age: 30, sleep: 7.5, stress: 5, hydration: 8,
    screenTime: 6, activity: 45, steps: 7000, heartRate: 72
  });
  const [result, setResult] = useState(null);

  // Loading text cycle
  useEffect(() => {
    if (loading) {
      const texts = [
        "Evaluating sleep quality...",
        "Assessing stress patterns...",
        "Calculating risk indicators...",
        "Generating your report..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[i % texts.length]);
        i++;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleAnalyze = async () => {
    setLoading(true);
    // Simulation logic (per previous requirement to ensure stability)
    setTimeout(() => {
      const score = Math.round(95 - (formData.stress * 4) - (formData.screenTime * 2) + (formData.sleep * 3) + (formData.activity / 10));
      const risk = score > 80 ? 'Healthy' : score > 50 ? 'Moderate Risk' : 'High Risk Pattern';
      const color = score > 80 ? COLORS.success : score > 50 ? COLORS.warning : COLORS.danger;
      
      setResult({
        name: formData.name || 'Patient',
        healthScore: score,
        riskLevel: risk,
        riskColor: color,
        bri: `${score} ± 3`,
        summary: `Analysis indicate a ${risk} status. Your metrics suggest sleep and stress management are key drivers.`,
        recommendations: [
          "Prioritize 7-9 hours of consistent sleep.",
          "Limit screen exposure to 6 hours daily.",
          "Increase hydration to 3L to offset metabolic strain.",
          "Practice 15-min mindfulness to lower neural pressure.",
          "Aim for 10k steps to optimize cardiovascular baseline."
        ],
        weeklyTrend: [{d:'Mon', s:60}, {d:'Tue', s:65}, {d:'Wed', s:63}, {d:'Thu', s:70}, {d:'Fri', s:72}, {d:'Sat', s:75}, {d:'Sun', s:score}],
        radarData: [
          { metric: 'Sleep', value: 85 }, { metric: 'Stress', value: 70 }, { metric: 'Activity', value: 90 },
          { metric: 'Diet', value: 75 }, { metric: 'Hydration', value: 80 }, { metric: 'Vitals', value: 88 }
        ],
        sleepScore: 78, activityScore: 82, stressScore: 65
      });
      setLoading(false);
      setView('results');
    }, 8000);
  };

  const Navbar = () => (
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
          <button 
            key={item} 
            onClick={() => { setView(item.toLowerCase() === 'home' ? 'landing' : item.toLowerCase()); if(item === 'Assessment') setStep(1); }}
            className={`text-[14px] font-inter transition-colors ${view === (item.toLowerCase() === 'home' ? 'landing' : item.toLowerCase()) ? 'text-[#2563EB]' : 'text-[#6B7280] hover:text-[#2563EB]'}`}
          >
            {item}
          </button>
        ))}
        <button onClick={() => { setView('assessment'); setStep(1); }} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-[18px] py-[8px] rounded-[8px] font-inter font-[500] text-[14px] transition-colors">
          Start Analysis
        </button>
      </div>
    </nav>
  );

  const AssessmentView = () => {
    const getSliderHelper = (type, val) => {
      if (type === 'sleep') {
        if (val < 6) return { color: '#EF4444', text: '⚠ Below recommended minimum' };
        if (val < 7) return { color: '#F59E0B', text: 'Getting close to target' };
        return { color: '#10B981', text: '✓ Healthy sleep range' };
      }
      if (type === 'stress') {
        if (val <= 3) return { color: '#10B981', text: 'Low stress — great' };
        if (val <= 6) return { color: '#F59E0B', text: 'Moderate — monitor this' };
        return { color: '#EF4444', text: '⚠ High stress detected' };
      }
      return null;
    };

    const steps = [
      { id: 1, title: 'Sleep & Recovery', desc: 'Tell us about your rest and stress patterns', icon: <Moon size={20} className="text-[#2563EB]" /> },
      { id: 2, title: 'Activity & Screen', desc: 'Detail your movement and digital environment', icon: <Monitor size={20} className="text-[#2563EB]" /> },
      { id: 3, title: 'Vitals & Profile', desc: 'Final biometrics for your precision analysis', icon: <Activity size={20} className="text-[#2563EB]" /> }
    ];

    const currentStep = steps[step - 1];

    return (
      <div className="bg-[#F8FAFC] min-h-screen">
        <div className="max-w-[620px] mx-auto text-center pt-[40px] pb-[32px]">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-[12px] mb-[24px]">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-[8px]">
                  <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-[14px] font-poppins font-[600] transition-all duration-300 ${
                    step === s.id ? 'bg-[#2563EB] text-white shadow-[0_0_0_4px_#DBEAFE]' : 
                    step > s.id ? 'bg-[#10B981] text-white' : 'bg-white border-2 border-[#E5E7EB] text-[#9CA3AF]'
                  }`}>
                    {step > s.id ? <CheckCircle2 size={18} /> : s.id}
                  </div>
                  <span className="text-[12px] font-inter text-[#6B7280]">{s.title}</span>
                </div>
                {i < 2 && (
                  <div className="w-[120px] h-[2px] bg-[#E5E7EB] -mt-[20px]">
                    <div className={`h-full bg-[#10B981] transition-all duration-500`} style={{ width: step > s.id ? '100%' : '0%' }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-[26px] font-poppins font-[600] text-[#111827] mb-[4px]">{currentStep.title}</h1>
          <p className="text-[15px] font-inter text-[#6B7280]">{currentStep.desc}</p>
        </div>

        <div className="max-w-[620px] mx-auto bg-white border border-[#E5E7EB] rounded-[16px] p-[36px] shadow-[0_4px_24px_rgba(0,0,0,0.07)] mb-[100px]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[32px] h-[32px] rounded-full bg-[#EFF6FF] flex items-center justify-center">
              {currentStep.icon}
            </div>
            <h2 className="text-[18px] font-poppins font-[600] text-[#111827]">{currentStep.title}</h2>
          </div>
          <div className="h-[1px] bg-[#F3F4F6] my-[16px]" />

          <div className="space-y-[28px]">
            {step === 1 && (
              <>
                <div className="space-y-[8px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-inter font-[500] text-[#374151]">Sleep Duration</span>
                    <span className="bg-[#EFF6FF] px-[10px] py-[2px] rounded-full text-[16px] font-poppins font-[600] text-[#2563EB]">{formData.sleep}h</span>
                  </div>
                  <input type="range" min="0" max="12" step="0.5" value={formData.sleep} onChange={(e) => setFormData({...formData, sleep: parseFloat(e.target.value)})} className="slider-input" style={{ '--range-progress': `${(formData.sleep/12)*100}%` }} />
                  <p className="text-[12px] font-inter font-[500]" style={{ color: getSliderHelper('sleep', formData.sleep).color }}>{getSliderHelper('sleep', formData.sleep).text}</p>
                </div>
                <div className="space-y-[8px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-inter font-[500] text-[#374151]">Stress Level</span>
                    <span className="bg-[#EFF6FF] px-[10px] py-[2px] rounded-full text-[16px] font-poppins font-[600] text-[#2563EB]">{formData.stress}/10</span>
                  </div>
                  <input type="range" min="1" max="10" value={formData.stress} onChange={(e) => setFormData({...formData, stress: parseInt(e.target.value)})} className="slider-input" style={{ '--range-progress': `${((formData.stress-1)/9)*100}%` }} />
                  <p className="text-[12px] font-inter font-[500]" style={{ color: getSliderHelper('stress', formData.stress).color }}>{getSliderHelper('stress', formData.stress).text}</p>
                </div>
                <div className="space-y-[8px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-inter font-[500] text-[#374151]">Daily Hydration</span>
                    <span className="bg-[#EFF6FF] px-[10px] py-[2px] rounded-full text-[16px] font-poppins font-[600] text-[#2563EB]">{formData.hydration} glasses</span>
                  </div>
                  <input type="range" min="0" max="15" value={formData.hydration} onChange={(e) => setFormData({...formData, hydration: parseInt(e.target.value)})} className="slider-input" style={{ '--range-progress': `${(formData.hydration/15)*100}%` }} />
                  <p className="text-[12px] font-inter text-[#9CA3AF]">Recommended: 8+ glasses/day</p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-[8px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-inter font-[500] text-[#374151]">Screen Time</span>
                    <span className="bg-[#EFF6FF] px-[10px] py-[2px] rounded-full text-[16px] font-poppins font-[600] text-[#2563EB]">{formData.screenTime}h</span>
                  </div>
                  <input type="range" min="0" max="16" value={formData.screenTime} onChange={(e) => setFormData({...formData, screenTime: parseInt(e.target.value)})} className="slider-input" style={{ '--range-progress': `${(formData.screenTime/16)*100}%` }} />
                  {formData.screenTime > 8 && <p className="text-[12px] font-inter font-[500] text-[#F59E0B]">⚠ High screen exposure</p>}
                </div>
                <div className="space-y-[8px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-inter font-[500] text-[#374151]">Physical Activity</span>
                    <span className="bg-[#EFF6FF] px-[10px] py-[2px] rounded-full text-[16px] font-poppins font-[600] text-[#2563EB]">{formData.activity}m</span>
                  </div>
                  <input type="range" min="0" max="180" value={formData.activity} onChange={(e) => setFormData({...formData, activity: parseInt(e.target.value)})} className="slider-input" style={{ '--range-progress': `${(formData.activity/180)*100}%` }} />
                  {formData.activity >= 30 && <p className="text-[12px] font-inter font-[500] text-[#10B981]">✓ Meeting WHO guidelines</p>}
                </div>
                <div className="space-y-[8px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-inter font-[500] text-[#374151]">Daily Steps</span>
                    <span className="bg-[#EFF6FF] px-[10px] py-[2px] rounded-full text-[16px] font-poppins font-[600] text-[#2563EB]">{formData.steps.toLocaleString()}</span>
                  </div>
                  <input type="range" min="0" max="20000" step="500" value={formData.steps} onChange={(e) => setFormData({...formData, steps: parseInt(e.target.value)})} className="slider-input" style={{ '--range-progress': `${(formData.steps/20000)*100}%` }} />
                  <p className="text-[12px] font-inter text-[#9CA3AF]">{formData.steps < 5000 ? 'Below recommended' : formData.steps < 10000 ? 'Getting there' : 'Excellent activity'}</p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="grid grid-cols-2 gap-[20px]">
                  <div className="space-y-[8px]">
                    <label className="text-[14px] font-inter font-[500] text-[#374151]">Your Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-[#E5E7EB] rounded-[8px] p-[10px] text-[15px] outline-none focus:border-[#2563EB]" />
                  </div>
                  <div className="space-y-[8px]">
                    <label className="text-[14px] font-inter font-[500] text-[#374151]">Age</label>
                    <div className="flex items-center gap-[12px] h-[46px]">
                       <button onClick={() => setFormData({...formData, age: Math.max(1, formData.age - 1)})} className="w-[36px] h-[36px] border border-[#E5E7EB] rounded-[8px] flex items-center justify-center hover:bg-[#F9FAFB]"><Minus size={16} /></button>
                       <span className="text-[16px] font-poppins font-[600] min-w-[2ch] text-center">{formData.age}</span>
                       <button onClick={() => setFormData({...formData, age: formData.age + 1})} className="w-[36px] h-[36px] border border-[#E5E7EB] rounded-[8px] flex items-center justify-center hover:bg-[#F9FAFB]"><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
                <div className="space-y-[8px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-inter font-[500] text-[#374151]">Resting Heart Rate</span>
                    <span className="bg-[#EFF6FF] px-[10px] py-[2px] rounded-full text-[16px] font-poppins font-[600] text-[#2563EB]">{formData.heartRate} bpm</span>
                  </div>
                  <input type="range" min="40" max="120" value={formData.heartRate} onChange={(e) => setFormData({...formData, heartRate: parseInt(e.target.value)})} className="slider-input" style={{ '--range-progress': `${((formData.heartRate-40)/80)*100}%` }} />
                  <p className="text-[12px] font-inter font-[500]" style={{ color: formData.heartRate >= 60 && formData.heartRate <= 100 ? '#10B981' : '#F59E0B' }}>
                    {formData.heartRate < 60 ? 'Athletic / Low' : formData.heartRate <= 100 ? 'Normal Range' : 'Elevated — watch closely'}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-[32px] border-t border-[#F3F4F6] pt-[24px] flex justify-between">
            <button 
              onClick={() => step > 1 && setStep(step - 1)} 
              className={`px-[24px] py-[10px] rounded-[8px] border border-[#E5E7EB] text-[#374151] text-[14px] font-inter font-[500] hover:bg-[#F9FAFB] transition-all ${step === 1 ? 'invisible' : ''}`}
            >
              Back
            </button>
            <button 
              onClick={() => step < 3 ? setStep(step + 1) : handleAnalyze()} 
              className={`bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-[28px] py-[10px] rounded-[8px] text-[14px] font-inter font-[600] flex items-center gap-[8px] transition-all ${step === 3 ? 'animate-subtle-pulse' : ''}`}
            >
              {step === 3 ? 'Analyze My Health' : 'Next Step'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 z-[100] bg-white/95 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="w-[72px] h-[72px] border-[3px] border-[#E5E7EB] border-t-[#2563EB] rounded-full animate-loading-spin" />
      <h2 className="mt-[20px] text-[20px] font-poppins font-[600] text-[#111827]">Analyzing your health patterns</h2>
      <p className="mt-[4px] text-[14px] font-inter text-[#6B7280] transition-opacity duration-500">{loadingText}</p>
      <div className="mt-[32px] w-[280px] h-[4px] bg-[#E5E7EB] rounded-full overflow-hidden">
        <div className="h-full bg-[#2563EB] rounded-full transition-all duration-[8000ms] ease-out" style={{ width: loading ? '90%' : '0%' }} />
      </div>
    </div>
  );

  const ResultsView = () => {
    if (!result) return null;
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-20 space-y-10 animate-in fade-in duration-700 pb-40">
        <div className="flex justify-between items-end">
           <div>
              <h1 className="text-4xl font-poppins font-[600]">Health Intelligence Report</h1>
              <p className="text-[#6B7280] font-medium mt-2">Generated for {result.name} · May 2025</p>
           </div>
           <button onClick={() => setView('dashboard')} className="bg-[#2563EB] text-white px-6 py-3 rounded-[10px] font-bold">Save to Dashboard</button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 flex flex-col items-center text-center">
              <div className="text-6xl font-bold font-poppins" style={{ color: result.riskColor }}>{result.healthScore}</div>
              <div className="text-[11px] font-bold text-[#6B7280] uppercase mt-2">BRI: {result.bri}</div>
              <div className="mt-4 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase" style={{ backgroundColor: result.riskColor }}>{result.riskLevel}</div>
           </div>
           <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 border-l-4" style={{ borderLeftColor: result.riskColor }}>
              <h3 className="text-sm font-bold uppercase text-[#6B7280] mb-2">Risk Summary</h3>
              <p className="text-[15px] leading-relaxed">{result.summary}</p>
           </div>
           <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-8">
              <div className="text-3xl font-bold text-rose-500">{formData.heartRate} <span className="text-sm text-slate-400">bpm</span></div>
              <p className="text-xs text-slate-500 mt-2">Resting Heart Rate Observation</p>
           </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-10 border-l-4 border-l-[#2563EB]">
           <h3 className="text-[11px] font-bold text-[#2563EB] tracking-widest uppercase mb-4">AI Intelligence Summary</h3>
           <p className="text-xl leading-relaxed text-slate-800 font-medium">{result.summary}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
           <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-3">Sleep Quality <Moon className="text-[#6366F1]" /></h3>
              <div className="text-3xl font-bold text-[#2563EB]">{formData.sleep}h</div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full" style={{ width: `${(formData.sleep/12)*100}%`, backgroundColor: result.riskColor }} />
              </div>
           </div>
           <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-3">Stress Indicator <Zap className="text-[#F59E0B]" /></h3>
              <div className="text-3xl font-bold text-amber-500">{formData.stress}/10</div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-amber-500" style={{ width: `${formData.stress*10}%` }} />
              </div>
           </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-8">
           <h3 className="text-lg font-bold mb-8">Weekly Health Trend</h3>
           <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={result.weeklyTrend}>
                    <XAxis dataKey="d" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="s" stroke="#2563EB" fill="#DBEAFE" fillOpacity={0.3} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
           {result.recommendations.map((rec, i) => (
             <div key={i} className="bg-white border border-[#E5E7EB] rounded-[16px] p-6 space-y-4">
                <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold">{i+1}</div>
                <p className="text-sm font-medium leading-relaxed">{rec}</p>
             </div>
           ))}
        </div>
        
        <p className="text-center text-[10px] text-[#6B7280] uppercase tracking-widest pt-20">
           Not a medical diagnosis tool. Consult a licensed healthcare professional.
        </p>
      </div>
    );
  };

  const LandingView = () => (
    <div className="animate-in fade-in duration-500">
      <section className="bg-white pt-24 pb-32 px-6 lg:px-20 text-center">
         <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-6xl font-poppins font-[700] leading-tight">Understand Your Health <br />Before It Becomes a Problem</h1>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
               ShifaSense AI analyzes your daily lifestyle patterns — sleep, stress, activity, and more — to give you an early picture of your health risks.
            </p>
            <div className="flex justify-center gap-4">
               <button onClick={() => { setView('assessment'); setStep(1); }} className="bg-[#2563EB] text-white px-10 py-4 rounded-[12px] font-bold text-lg shadow-xl shadow-blue-200">Start Health Analysis →</button>
            </div>
         </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      {loading && <LoadingOverlay />}
      <main>
        {view === 'landing' && <LandingView />}
        {view === 'assessment' && <AssessmentView />}
        {view === 'results' && <ResultsView />}
        {(view === 'dashboard' || view === 'admin') && (
           <div className="max-w-md mx-auto py-40 text-center space-y-6">
              <Lock size={40} className="mx-auto text-slate-300" />
              <h2 className="text-2xl font-bold">Secure Access Required</h2>
              <p className="text-[#6B7280]">This section is reserved for authenticated members.</p>
              <button onClick={() => setView('landing')} className="text-[#2563EB] font-bold underline">Return Home</button>
           </div>
        )}
      </main>
    </div>
  );
};

export default ShifaSenseApp;
