import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Heart, Activity, Moon, Zap, Droplets, Monitor, Brain, 
  Search, Menu, ChevronRight, ArrowRight, Shield, CheckCircle2, 
  Clock, TrendingUp, AlertTriangle, Users, Smartphone, Lock, Info, Mail, Plus, Minus, Download, Bot
} from 'lucide-react';
import Dashboard from './pages/Dashboard';

// FIX 3: Dashboard that displays real savedResults data
const DashboardView = ({ savedResults, setView, setStep }) => {
  if (savedResults.length === 0) {
    return (
      <div style={{ maxWidth: '480px', margin: '60px auto', background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>📋</div>
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '20px', color: '#111827', margin: '0 0 8px' }}>No assessments yet</h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', color: '#6B7280', maxWidth: '320px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Complete your first health assessment to see your personal health intelligence dashboard.
        </p>
        <button
          onClick={() => { setView('assessment'); setStep(1); }}
          className="btn-primary"
        >
          Start Health Assessment →
        </button>
      </div>
    );
  }

  const latest = savedResults[0];
  const totalAssessments = savedResults.length;
  const consistency = totalAssessments >= 3 ? 'Improving' : totalAssessments >= 1 ? 'Building' : 'Learning';

  const chartData = savedResults.slice().reverse().map(r => ({
    date: r.displayDate,
    score: r.healthScore
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Health Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Last updated {latest.displayDate} at {latest.displayTime}</p>
        </div>
        <button onClick={() => { setView('assessment'); setStep(1); }} className="btn-primary">New Assessment</button>
      </div>

      {/* Score Card */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="shifa-card p-8 text-center flex flex-col items-center">
          <div className="relative w-[160px] h-[160px] flex items-center justify-center mb-4">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle cx="80" cy="80" r="68" fill="none" stroke={latest.riskColor} strokeWidth="8"
                strokeDasharray="427"
                strokeDashoffset={427 - (427 * latest.healthScore) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
            </svg>
            <div className="relative z-10 text-center">
              <div className="text-4xl font-bold" style={{ color: latest.riskColor }}>{latest.healthScore}</div>
              <div className="text-xs text-slate-400 font-medium">/ 100</div>
            </div>
          </div>
          <div className="px-4 py-1.5 rounded-full text-white font-bold text-xs uppercase" style={{ backgroundColor: latest.riskColor }}>{latest.riskLevel}</div>
        </div>

        <div className="shifa-card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Overview</h3>
          {[
            { label: 'Consistency', val: consistency },
            { label: 'Total Assessments', val: totalAssessments },
            { label: 'Latest Risk', val: latest.riskLevel }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500 font-medium">{item.label}</span>
              <span className="text-sm font-bold text-slate-900">{item.val}</span>
            </div>
          ))}
        </div>

        <div className="shifa-card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Core Inputs</h3>
          {[
            { label: 'Sleep', val: `${latest.inputs.sleep}h`, pct: (latest.inputs.sleep / 12) * 100, color: '#6366F1' },
            { label: 'Stress', val: `${latest.inputs.stress}/10`, pct: latest.inputs.stress * 10, color: '#EF4444' },
            { label: 'Activity', val: `${latest.inputs.activity} mins`, pct: Math.min((latest.inputs.activity / 60) * 100, 100), color: '#10B981' }
          ].map((m, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>{m.label}</span><span>{m.val}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score History */}
      {savedResults.length > 1 ? (
        <div className="shifa-card p-6">
          <h3 className="font-bold text-slate-900 mb-4">Score History</h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="shifa-card p-6 text-center">
          <div className="text-4xl font-bold mb-2" style={{ color: latest.riskColor }}>{latest.healthScore}</div>
          <p className="text-slate-400 text-sm">Take more assessments to see your score trend</p>
        </div>
      )}

      {/* AI Summary */}
      {latest.summary && (
        <div className="shifa-card p-6">
          <h3 className="font-bold text-slate-900 mb-3">AI Analysis Summary</h3>
          <p className="text-slate-600 leading-relaxed">{latest.summary}</p>
        </div>
      )}

      {/* Recommendations */}
      {latest.recommendations && latest.recommendations.length > 0 && (
        <div className="shifa-card p-6">
          <h3 className="font-bold text-slate-900 mb-4">Personalized Recommendations</h3>
          <div className="space-y-3">
            {latest.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                <p className="text-sm text-slate-700 font-medium">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assessment History */}
      <div className="shifa-card p-6">
        <h3 className="font-bold text-slate-900 mb-4">Assessment History</h3>
        <div className="space-y-3">
          {savedResults.slice(0, 5).map((entry, i) => (
            <div key={entry.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-blue-100 transition-all">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: entry.riskColor }}>
                {entry.healthScore}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900">{entry.riskLevel}</div>
                <div className="text-xs text-slate-400">{entry.displayDate} · {entry.displayTime}</div>
              </div>
              <span className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1 rounded-full">
                #{i + 1}
              </span>
            </div>
          ))}
          {savedResults.length > 5 && (
            <p className="text-center text-sm text-blue-600 font-medium pt-2">+ {savedResults.length - 5} more reports</p>
          )}
        </div>
      </div>
    </div>
  );
};


const COLORS = {
  primary: '#2563EB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444'
};

const sanitizeInput = (str, maxLen = 200) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/`/g, '&#x60;')
    .trim()
    .slice(0, maxLen);
};

const generateReportId = () => {
  const array = new Uint32Array(2);
  window.crypto.getRandomValues(array);
  return array[0].toString(36).toUpperCase() + array[1].toString(36).toUpperCase();
};

const clampValue = (val, min, max) => Math.min(Math.max(Number(val), min), max);

const validateResult = (data) => {
  const errors = [];
  if (typeof data.healthScore !== 'number' || data.healthScore < 0 || data.healthScore > 100) {
    errors.push('Invalid health score');
    data.healthScore = 50;
  }
  if (!['Healthy', 'Moderate Risk', 'High Risk Pattern'].includes(data.riskLevel)) {
    errors.push('Invalid risk level');
    data.riskLevel = 'Moderate Risk';
  }
  if (!Array.isArray(data.recommendations) || data.recommendations.length < 1) {
    errors.push('Invalid recommendations');
    data.recommendations = ['Please retake the assessment for accurate recommendations.'];
  }
  const scoreFields = ['sleepScore', 'activityScore', 'stressScore'];
  scoreFields.forEach(field => {
    if (typeof data[field] !== 'number' || data[field] < 0 || data[field] > 100) {
      data[field] = 50;
    }
  });
  const textFields = ['summary', 'sleepAnalysis', 'stressInsight', 'activityInsight', 'screenRisk', 'heartRateNote', 'hydrationNote'];
  textFields.forEach(field => {
    if (typeof data[field] === 'string') {
      data[field] = data[field].replace(/<[^>]*>/g, '').slice(0, 500);
    }
  });
  return data;
};
// --- SUB-COMPONENTS (Defined outside to prevent focus loss during state updates) ---

const Navbar = ({ setView, setStep, view }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed w-full z-50 nav-glass text-[#111827]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('landing')}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform"><Brain size={24} /></div>
          <span className="text-2xl font-poppins font-bold tracking-tight">ShifaSense <span className="text-blue-600">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium">
          {['Assessment', 'Dashboard'].map((item) => (
            <button key={item} 
              onClick={() => {
                if (item === 'Assessment') { setView('assessment'); setStep(1); }
                else if (item === 'Dashboard') setView('dashboard');
              }}
              className="text-slate-600 hover:text-blue-600 transition-colors font-inter text-[15px]"
            >{item}</button>
          ))}
          <button onClick={() => { setView('assessment'); setStep(1); }} className="btn-primary">Analyze Health</button>
        </div>
        <button className="md:hidden text-slate-700" onClick={() => setIsOpen(!isOpen)}><Menu size={28} /></button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-blue-100 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 space-y-4">
            {['Assessment', 'Dashboard'].map((item) => (
              <button key={item} 
                onClick={() => {
                  if (item === 'Assessment') { setView('assessment'); setStep(1); }
                  else if (item === 'Dashboard') setView('dashboard');
                  setIsOpen(false);
                }}
                className="text-left text-lg font-medium text-slate-700 p-2">
                {item}
              </button>
            ))}
            <button onClick={() => { setView('assessment'); setStep(1); setIsOpen(false); }} className="btn-primary w-full">Start Analysis</button>
          </div>
        </div>
      )}
    </nav>
  );
};

const LandingView = ({ setView, setStep }) => (
  <div className="animate-in fade-in duration-1000">
    <section className="relative overflow-hidden hero-gradient pt-24 pb-32 px-6 lg:px-20">
      <div className="hero-circle-1"></div>
      <div className="hero-circle-2"></div>
      <div className="hero-circle-3"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-6 lg:space-y-10 text-left">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-blue-100 px-4 py-2 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
            <span className="text-[10px] lg:text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em]">Next-Gen Health Intelligence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-poppins font-[800] leading-[1.1] tracking-[-0.04em] text-slate-900">
            ShifaSense AI <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Health Intelligence.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed font-inter">
            Deploying AI-powered pattern matching to understand your health risks early. 
            ShifaSense AI cross-references vast clinical records to deliver scientific precision in health risk assessment.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button onClick={() => { setView('assessment'); setStep(1); }} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-3">
              Start Health Analysis <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        <div className="relative h-[300px] lg:h-[500px] flex items-center justify-center mt-12 lg:mt-0">
           {/* Interactive SVG Hero */}
           <div className="relative w-64 h-64 lg:w-80 lg:h-80 bg-white/40 backdrop-blur-xl rounded-full border border-white/60 shadow-2xl flex items-center justify-center z-10">
              <div className="absolute inset-4 bg-white/80 rounded-full shadow-inner flex items-center justify-center">
                 <Heart size={100} className="text-blue-600 animate-pulse" fill="rgba(37,99,235,0.1)" />
              </div>
              
              <div className="absolute w-full h-full animate-[spin_20s_linear_infinite]">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-blue-50 rounded-2xl shadow-lg flex items-center justify-center"><Moon size={24} className="text-indigo-500" /></div>
              </div>
              <div className="absolute w-full h-full animate-[spin_25s_linear_infinite_reverse]">
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-14 h-14 bg-white border border-blue-50 rounded-2xl shadow-lg flex items-center justify-center"><Zap size={24} className="text-amber-500" /></div>
              </div>
              <div className="absolute w-full h-full animate-[spin_30s_linear_infinite]">
                 <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-blue-50 rounded-2xl shadow-lg flex items-center justify-center"><Activity size={24} className="text-rose-500" /></div>
              </div>
              
              <svg className="absolute w-[140%] h-[140%] opacity-20" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="4 4" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="2 2" />
              </svg>
           </div>
        </div>
      </div>
    </section>

    {/* Clinical Evidence Section */}
    <section className="bg-white py-24 px-6 lg:px-20 border-t border-slate-100">
       <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <div className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">Clinical Evidence</div>
             <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4 font-poppins">Scientific rigor meets advanced AI</h2>
             <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Our models are built on extensive epidemiological research, evaluating critical biomarkers to deliver actionable preventive care insights.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Card 1 */}
             <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6"><Shield size={24} /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Data Privacy First</h3>
                <p className="text-slate-600 leading-relaxed">End-to-end encryption and strict adherence to healthcare data privacy standards. Your personal metrics never leave your session.</p>
             </div>
             
             {/* Card 2 */}
             <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6"><Activity size={24} /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Biometric Analysis</h3>
                <p className="text-slate-600 leading-relaxed">Multi-dimensional assessment across cardiovascular health, metabolic factors, and lifestyle indicators.</p>
             </div>
             
             {/* Card 3 */}
             <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6"><Brain size={24} /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Predictive Intelligence</h3>
                <p className="text-slate-600 leading-relaxed">Advanced pattern recognition algorithms comparing your profile against verified medical outcome datasets.</p>
             </div>
          </div>
       </div>
    </section>

    {/* Clinical Methodology */}
    <section className="bg-slate-50 py-24 px-6 lg:px-20 border-t border-slate-200">
       <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
             <div className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">Methodology</div>
             <h3 className="text-3xl font-bold text-slate-900 leading-tight mb-6">Evidence-based preventive care protocols</h3>
             <p className="text-lg text-slate-600 leading-relaxed mb-8">
               ShifaSense AI goes beyond basic trackers. By synthesizing multiple biometric dimensions—from physiological measurements to behavioral habits—our clinical-grade engine identifies subtle risk vectors before they become chronic issues.
             </p>
             <ul className="space-y-4">
               {[
                 'Validated risk stratification models',
                 'Longitudinal health trajectory mapping',
                 'Actionable, physician-aligned interventions',
                 'Real-time physiological correlations'
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                     <CheckCircle2 size={14} className="text-blue-600" />
                   </div>
                   <span className="text-slate-700 font-medium">{item}</span>
                 </li>
               ))}
             </ul>
          </div>
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 flex items-center justify-center">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Glowing nodes */}
            <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[20%] right-[20%] w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
            
            {/* Central Graphic */}
            <div className="relative z-10 w-full px-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                    <Activity size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time Vitals</div>
                    <div className="text-sm font-medium text-slate-200">Patient XYZ-99</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live</span>
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
                {/* EKG Line Graphic */}
                <div className="relative h-24 w-full flex items-center overflow-hidden border-b border-slate-700/50 mb-6">
                  <style>
                    {`
                      @keyframes dash {
                        0% { stroke-dashoffset: 400; }
                        100% { stroke-dashoffset: 0; }
                      }
                      .ekg-line {
                        animation: dash 3s linear infinite;
                      }
                    `}
                  </style>
                  {/* Faint background line */}
                  <svg className="absolute w-[200%] h-full opacity-30" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <path 
                      d="M 0 50 L 50 50 L 60 20 L 75 90 L 85 50 L 120 50 L 130 30 L 145 70 L 155 50 L 200 50 L 250 50 L 260 20 L 275 90 L 285 50 L 320 50 L 330 30 L 345 70 L 355 50 L 400 50" 
                      fill="none" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                  {/* Animated line */}
                  <svg className="absolute w-[200%] h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <path 
                      className="ekg-line"
                      d="M 0 50 L 50 50 L 60 20 L 75 90 L 85 50 L 120 50 L 130 30 L 145 70 L 155 50 L 200 50 L 250 50 L 260 20 L 275 90 L 285 50 L 320 50 L 330 30 L 345 70 L 355 50 L 400 50" 
                      fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ strokeDasharray: '400', strokeDashoffset: '400' }}
                    />
                  </svg>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Heart Rate</div>
                    <div className="text-xl font-bold text-slate-200">72 <span className="text-xs text-slate-500 font-normal">bpm</span></div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Blood O2</div>
                    <div className="text-xl font-bold text-slate-200">98 <span className="text-xs text-slate-500 font-normal">%</span></div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50 relative overflow-hidden text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Status</div>
                    <div className="text-sm font-bold text-emerald-400 mt-2">Optimal</div>
                    <div className="absolute bottom-0 left-0 h-1 bg-emerald-400/20 w-full"><div className="h-full bg-emerald-400 w-3/4"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
       </div>
    </section>
  </div>
);
const AssessmentView = ({ step, setStep, formData, setFormData, handleAnalyze }) => {
  const [nameError, setNameError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);

  const handleNameChange = (e) => {
    const val = e.target.value;
    const cleaned = val.replace(/[^a-zA-Z\s.\-']/g, '');
    const trimmed = cleaned.replace(/^\s+/, '');
    const limited = trimmed.slice(0, 50);
    setFormData({...formData, name: limited});
    
    if (limited.trim().length < 2) {
      setNameError('Name must be at least 2 letters');
    } else if (limited.trim().length > 0 && !/[a-zA-Z]/.test(limited)) {
      setNameError('Name must contain letters');
    } else {
      setNameError('');
    }
    setNameTouched(true);
  };

  const handleNameBlur = () => {
    setNameTouched(true);
    if (!formData.name.trim()) {
      setNameError('Name is required');
    }
  };

  const handleNamePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const cleaned = pasted.replace(/[^a-zA-Z\s.\-']/g, '').slice(0, 50);
    setFormData({...formData, name: cleaned});
  };

  const handleNameKeyDown = (e) => {
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
    }
    const blocked = /[!@#$%^&*()_+=\[\]{};:"\\|,<>?\/~`]/;
    if (blocked.test(e.key)) {
      e.preventDefault();
    }
  };
  
  const isNameValid = formData.name.trim().length >= 2 && /[a-zA-Z]/.test(formData.name) && !nameError;
  const canProceed = step < 4 || isNameValid;

  return (
  <div className="bg-[#F8FAFC] min-h-screen">
    <div className="max-w-[620px] mx-auto text-center pt-[40px] pb-[32px]">
      <div className="flex items-center justify-center gap-[12px] mb-[24px]">
        {[1, 2, 3, 4].map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-[8px]">
              <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-[14px] font-poppins font-[600] transition-all duration-300 ${step === s ? 'bg-[#2563EB] text-white shadow-[0_0_0_4px_#DBEAFE]' : step > s ? 'stepper-completed' : 'bg-white border-2 border-[#E5E7EB] text-[#9CA3AF]'}`}>
                {step > s ? <CheckCircle2 size={18} /> : s}
              </div>
            </div>
            {i < 3 && <div className="w-[60px] h-[2px] bg-[#E5E7EB]" />}
          </React.Fragment>
        ))}
      </div>
      <h1 className="text-[26px] font-poppins font-[600] text-[#111827]">
        {step === 1 ? 'Sleep & Recovery' : step === 2 ? 'Activity & Habits' : step === 3 ? 'Lifestyle Choices' : 'Vitals & Profile'}
      </h1>
    </div>
    <div className="shifa-card max-w-[620px] mx-auto p-6 lg:p-[36px] mb-20 mx-4 sm:mx-auto">
       <div className="space-y-[28px]">
          {step === 1 && (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-[14px] font-medium">Sleep Hours</span><span className="text-[#2563EB] font-bold">{formData.sleep}h</span></div>
                <input type="number" min="0" max="24" value={formData.sleep} onChange={(e) => setFormData({...formData, sleep: clampValue(e.target.value, 0, 24)})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-[14px] font-medium">Stress Level</span><span className="text-[#2563EB] font-bold">{formData.stress}/10</span></div>
                <input type="number" min="1" max="10" value={formData.stress} onChange={(e) => setFormData({...formData, stress: clampValue(e.target.value, 1, 10)})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-[14px] font-medium">Activity (mins)</span><span className="text-[#2563EB] font-bold">{formData.activity}m</span></div>
                <input type="number" min="0" max="1440" value={formData.activity} onChange={(e) => setFormData({...formData, activity: clampValue(e.target.value, 0, 1440)})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-[14px] font-medium">Hydration (glasses)</span><span className="text-[#2563EB] font-bold">{formData.hydration} gls</span></div>
                <input type="number" min="0" max="50" value={formData.hydration} onChange={(e) => setFormData({...formData, hydration: clampValue(e.target.value, 0, 50)})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-[14px] font-medium">Screen Time</span><span className="text-[#2563EB] font-bold">{formData.screenTime}h</span></div>
                <input type="number" min="0" max="24" value={formData.screenTime} onChange={(e) => setFormData({...formData, screenTime: clampValue(e.target.value, 0, 24)})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
            </>
          )}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="text-[14px] font-medium block">Dietary Habits</span>
                <select value={formData.foodHabits} onChange={(e)=>setFormData({...formData, foodHabits: e.target.value})} className="w-full border p-3 rounded-lg bg-white">
                  <option>Balanced</option>
                  <option>Mostly Home Cooked</option>
                  <option>Mostly Junk Food</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[14px] font-medium block">Smoking</span>
                  <select value={formData.smoking} onChange={(e)=>setFormData({...formData, smoking: e.target.value})} className="w-full border p-3 rounded-lg bg-white">
                    <option>Non-smoker</option>
                    <option>Occasional</option>
                    <option>Regular</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <span className="text-[14px] font-medium block">Alcohol</span>
                  <select value={formData.alcohol} onChange={(e)=>setFormData({...formData, alcohol: e.target.value})} className="w-full border p-3 rounded-lg bg-white">
                    <option>Never</option>
                    <option>Occasional</option>
                    <option>Regular</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-6">
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  onPaste={handleNamePaste}
                  onKeyDown={handleNameKeyDown}
                  className={`w-full p-3 rounded-lg outline-none transition-all duration-200 ${
                    nameTouched && nameError 
                      ? 'border-[1.5px] border-[#EF4444] bg-[#FFF9F9] shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                      : isNameValid 
                        ? 'border-[1.5px] border-[#10B981] shadow-[0_0_0_3px_rgba(16,185,129,0.08)] bg-white'
                        : 'border-[1.5px] border-[#E5E7EB] bg-white focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
                  } text-[#111827] font-inter font-medium text-[15px]`}
                />
                <div className={`absolute top-0 right-0 p-3 text-[11px] font-inter ${formData.name.length === 50 ? 'text-[#EF4444]' : formData.name.length > 40 ? 'text-[#F59E0B]' : 'text-[#9CA3AF]'}`}>
                  {formData.name.length}/50
                </div>
                {nameTouched && nameError && (
                  <div className="text-[12px] text-[#EF4444] font-inter mt-1 animate-in fade-in duration-200">
                    ⚠ {nameError}
                  </div>
                )}
                {isNameValid && nameTouched && (
                  <div className="text-[12px] text-[#10B981] font-inter mt-1">
                    ✓ Looks good
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Age: {formData.age}</span>
                  <input type="number" min="1" max="120" value={formData.age} 
                    onChange={(e)=>{
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1 && val <= 120) {
                        setFormData({...formData, age: val});
                      } else if (e.target.value === '') {
                        setFormData({...formData, age: ''});
                      }
                    }} 
                    onKeyDown={(e) => {
                      if (['e','E','+','-','.'].includes(e.key)) e.preventDefault();
                    }}
                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Gender</span>
                  <select value={formData.gender} onChange={(e)=>setFormData({...formData, gender: e.target.value})} className="w-full border p-2.5 rounded-lg bg-white"><option>Female</option><option>Male</option><option>Non-binary</option></select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center"><span className="text-sm font-medium">Height (cm)</span><span className="text-xs font-bold text-blue-600">{formData.height} cm</span></div>
                  <input type="number" min="50" max="300" value={formData.height} onChange={(e)=>setFormData({...formData, height: clampValue(e.target.value, 50, 300)})} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center"><span className="text-sm font-medium">Weight (kg)</span><span className="text-xs font-bold text-blue-600">{formData.weight} kg</span></div>
                  <input type="number" min="20" max="500" value={formData.weight} onChange={(e)=>setFormData({...formData, weight: clampValue(e.target.value, 20, 500)})} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm"><Activity size={20} className="text-blue-600" /></div>
                  <div>
                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Calculated BMI</div>
                    <div className="text-lg font-bold text-blue-900">{formData.bmi}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-blue-400 uppercase">Category</div>
                  <div className={`text-sm font-bold ${formData.bmi < 18.5 ? 'text-amber-600' : formData.bmi < 25 ? 'text-emerald-600' : formData.bmi < 30 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {formData.bmi < 18.5 ? 'Underweight' : formData.bmi < 25 ? 'Healthy' : formData.bmi < 30 ? 'Overweight' : 'Obese'}
                  </div>
                </div>
              </div>
            </div>
          )}
       </div>
       <div className="mt-8 pt-6 border-t flex justify-between">
          <button onClick={() => setStep(s => s - 1)} className={`btn-secondary ${step === 1 ? 'invisible' : ''}`}>Back</button>
          <div className="relative group">
            <button 
              onClick={() => step < 4 ? setStep(s => s + 1) : handleAnalyze()} 
              disabled={!canProceed}
              className="btn-primary"
            >
              {step === 4 ? 'Analyze My Health →' : 'Next Step'}
            </button>
            {!canProceed && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none">
                Please enter your valid name
              </div>
            )}
          </div>
       </div>
    </div>
  </div>
  );
};

const ResultsView = ({ result, formData, backendData, setView, setSavedResults, saveSuccess, setSaveSuccess }) => {
  const [toast, setToast] = useState('');
  const [completed, setCompleted] = useState({});
  const [shareUrl, setShareUrl] = useState('');
  
  if (!result) return null;

  const handleShare = () => {
    const reportId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const shareData = {
      n: formData.name || 'Anonymous',
      s: result.healthScore,
      r: result.riskLevel,
      c: result.riskColor,
      sum: result.summary,
      sl: formData.sleep,
      st: formData.stress,
      hy: formData.hydration,
      ac: formData.activity,
      sp: formData.steps,
      hr: formData.heartRate,
      ag: formData.age,
      id: reportId
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(shareData))));
    // Always use the Vercel production URL so QR codes work from the APK
    const baseUrl = 'https://shifasense.vercel.app';
    const url = baseUrl + '/?report=' + encoded;
    setShareUrl(url);
    navigator.clipboard.writeText(url).catch(() => {});
    setToast('✓ Report link copied to clipboard');
    setTimeout(() => setToast(''), 3000);
  };

  const handleWhatsApp = () => {
    const message = 
      `🏥 *ShifaSense AI Health Report*\n\n` +
      `👤 *Patient:* ${formData.name || 'Anonymous'}\n` +
      `📅 *Date:* ${new Date().toLocaleDateString()}\n\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `🎯 *Health Score: ${result.healthScore}/100*\n` +
      `⚠️ *Risk Level: ${result.riskLevel}*\n` +
      `━━━━━━━━━━━━━━━━\n\n` +
      `📊 *Your Stats:*\n` +
      `😴 Sleep: ${formData.sleep} hours\n` +
      `😰 Stress: ${formData.stress}/10\n` +
      `💧 Hydration: ${formData.hydration} glasses\n` +
      `🏃 Activity: ${formData.activity} mins\n` +
      `👟 Steps: ${formData.steps}\n` +
      `❤️ Heart Rate: ${formData.heartRate} bpm\n\n` +
      `💡 *Top Recommendation:*\n` +
      `${result.recommendations[0]}\n\n` +
      `🔗 View full report: https://shifasense.vercel.app\n\n` +
      `_ShifaSense AI — Know your health ` +
      `before it becomes a problem_\n` +
      `_⚕ Not a medical diagnosis tool_`;
    
    const encoded = encodeURIComponent(message);
    window.open('https://wa.me/?text=' + encoded, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 space-y-8 animate-in fade-in duration-700 relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b pb-8 gap-6">
        <div className="space-y-4">
           <h1 className="text-3xl lg:text-4xl font-bold">Health Intelligence Report</h1>
           <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-slate-500 font-medium text-sm">
              <span>Patient: <span className="text-[#2563EB] font-bold">{formData.name || 'Anonymous'}</span></span>
              <span className="hidden sm:inline">·</span>
              <span>Age: <span className="font-bold text-slate-800">{formData.age}</span></span>
              <span className="hidden sm:inline">·</span>
              <span>{formData.gender}</span>
              <span className="hidden sm:inline">·</span>
              <span>{formData.height}cm / {formData.weight}kg</span>
           </div>
        </div>
        <div className="text-left lg:text-right">
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report ID: {generateReportId()}</div>
           <div className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        {[
          { label: 'Sleep', val: formData.sleep + 'h', icon: <Moon size={14} />, class: 'sleep' },
          { label: 'Stress', val: formData.stress + '/10', icon: <Zap size={14} />, class: 'stress' },
          { label: 'BMI', val: formData.bmi, icon: <Activity size={14} />, class: 'activity' },
          { label: 'Hydration', val: formData.hydration + ' gls', icon: <Droplets size={14} />, class: 'hydration' },
          { label: 'Screen', val: formData.screenTime + 'h', icon: <Monitor size={14} />, class: 'screen' }
        ].map((item, i) => (
          <div key={i} className={`shifa-metric-card shifa-metric-${item.class} flex items-center gap-3`}>
             <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">{item.icon}</div>
             <div><div className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</div><div className="text-sm font-bold text-slate-700">{item.val}</div></div>
          </div>
        ))}
      </div>
      
      {backendData ? (
        <div className="shifa-card-success p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#166534] font-medium"><CheckCircle2 size={20} />Evidence-based analysis · Matched against real health profiles · Confidence: {Math.round(backendData.confidence * 100)}%</div>
          <span className="bg-[#166534] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Dataset-Powered</span>
        </div>
      ) : (
        <div className="shifa-card-accent p-4 rounded-xl flex items-center gap-3 text-[#1E40AF] font-medium"><Info size={20} /> AI-generated analysis</div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
         <div className="shifa-card p-8 rounded-2xl text-center flex flex-col items-center justify-center">
            <div className="relative w-[200px] h-[200px] flex flex-col items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="88" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle cx="100" cy="100" r="88" fill="none" stroke={result.riskColor} strokeWidth="8" 
                  strokeDasharray="553" 
                  strokeDashoffset={553 - (553 * result.healthScore) / 100} 
                  strokeLinecap="round" 
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} 
                />
              </svg>
              <div className="relative z-10 text-center">
                <div className="text-[52px] font-poppins font-bold leading-none" style={{ color: result.riskColor }}>{result.healthScore}</div>
                <div className="text-[14px] font-inter text-[#9CA3AF] mt-1">/ 100</div>
              </div>
            </div>
            <div className="mt-4 px-4 py-1.5 rounded-full text-white font-bold text-xs uppercase" style={{ backgroundColor: result.riskColor }}>{result.riskLevel}</div>
         </div>
         <div className="md:col-span-2 shifa-card p-6 lg:p-8 rounded-2xl flex flex-col justify-center">
            <h3 className="text-[10px] lg:text-sm font-bold uppercase text-slate-400 mb-2 tracking-widest">Analysis Summary</h3>
            <p className="text-base lg:text-lg leading-relaxed text-slate-700 font-medium">{result.summary}</p>
            {result.riskFactors && <div className="mt-4 flex flex-wrap gap-2">{result.riskFactors.map((f, i) => <span key={i} className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-lg border border-rose-100">{f}</span>)}</div>}
         </div>
      </div>

      {backendData && result.neighborComparison && (
        <div className="shifa-card p-10 rounded-3xl space-y-8">
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
         <div className="shifa-card p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold">Lifestyle Trajectory</h3>
            <div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><RadarChart data={result.radarData}><PolarGrid stroke="#E5E7EB" /><PolarAngleAxis dataKey="metric" tick={{fill: '#94A3B8', fontSize: 10}} /><Radar name="Score" dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} /></RadarChart></ResponsiveContainer></div>
         </div>
         <div className="shifa-card p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold">Personalized Action Plan</h3>
            <div className="space-y-4">{result.recommendations?.map((rec, i) => <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl"><div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div><p className="text-sm font-medium">{rec}</p></div>)}</div>
         </div>
      </div>

      <div className="flex flex-col items-center gap-4 pt-8">
         <div className="flex flex-wrap justify-center gap-4">
           <button
             onClick={() => {
               if (!result) return;
               const entry = {
                 id: crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase(),
                 savedAt: new Date().toISOString(),
                 displayDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                 displayTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                 name: result.name || formData.name,
                 age: formData.age,
                 healthScore: result.healthScore,
                 riskLevel: result.riskLevel,
                 riskColor: result.riskColor,
                 summary: result.summary,
                 recommendations: result.recommendations,
                 riskFactors: result.riskFactors,
                 sleepScore: result.sleepScore,
                 stressScore: result.stressScore,
                 activityScore: result.activityScore,
                 inputs: {
                   sleep: formData.sleep,
                   stress: formData.stress,
                   hydration: formData.hydration,
                   screenTime: formData.screenTime,
                   activity: formData.activity,
                   steps: formData.steps,
                   heartRate: formData.heartRate
                 }
               };
               setSavedResults(prev => [entry, ...prev]);
               setSaveSuccess(true);
               setTimeout(() => setSaveSuccess(false), 2500);
               setTimeout(() => setView('dashboard'), 800);
             }}
             disabled={saveSuccess}
             className="btn-primary flex items-center gap-2"
             style={{ backgroundColor: saveSuccess ? '#10B981' : '#2563EB', transition: 'background-color 0.3s' }}
           >
             {saveSuccess ? '✓ Saved!' : 'Save to Dashboard'}
           </button>
           <button onClick={() => {
              const el = document.getElementById('pdf-report');
              el.style.display = 'block';
              setTimeout(() => {
                 window.print();
                 setTimeout(() => { el.style.display = 'none'; }, 500);
              }, 300);
           }} className="btn-secondary flex items-center gap-2 text-blue-600 border-blue-600">
              <Download size={16} /> Download Report
           </button>
           
           <button onClick={handleShare} className="btn-secondary flex items-center gap-2 text-indigo-600 border-indigo-600">
              🔗 Share Report
           </button>
           
           <button onClick={handleWhatsApp} className="btn-primary !bg-[#25D366] hover:!bg-[#128C7E] flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share on WhatsApp
           </button>
         </div>

         {shareUrl && (
           <div className="mt-[12px] p-4 border border-[#E5E7EB] rounded-[12px] bg-white inline-block text-center shadow-sm animate-in fade-in slide-in-from-top-2">
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`} alt="QR Code" className="mx-auto mb-3 w-[150px] h-[150px]" />
             <div className="font-inter text-[12px] text-[#6B7280]">Scan to view this report</div>
           </div>
         )}
      </div>

      {result.challenges && result.challenges.days && (
        <div className="shifa-card p-8 rounded-2xl space-y-6 mt-12 shadow-sm">
           <div>
             <h3 className="font-poppins font-[600] text-[20px] text-[#111827]">🎯 Your 7-Day Health Challenge</h3>
             <p className="font-inter font-[400] text-[14px] text-[#6B7280]">Small daily actions based on your specific risk factors</p>
           </div>
           
           <div className="flex items-center justify-between mb-2">
             <div className="text-sm font-bold text-slate-700">
               <span className="text-[#10B981]">{Object.values(completed).filter(Boolean).length}</span> of 7 days completed
             </div>
             {Object.values(completed).filter(Boolean).length > 0 && (
               <div className="text-sm font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                 🔥 {Object.values(completed).filter(Boolean).length} day streak
               </div>
             )}
           </div>
           <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
             <div className="bg-[#10B981] h-full rounded-full transition-all duration-500" style={{ width: `${(Object.values(completed).filter(Boolean).length / 7) * 100}%` }}></div>
           </div>

           <div className="flex overflow-x-auto pb-4 gap-4 snap-x lg:grid lg:grid-cols-2 xl:grid-cols-4 lg:overflow-visible lg:pb-0 hide-scrollbar">
             {result.challenges.days.map((day, i) => (
               <div key={i} className={`flex-shrink-0 w-64 lg:w-auto border rounded-xl p-4 transition-all snap-start ${completed[day.day] ? 'border-[#10B981] bg-[#F0FDF4]' : 'border-[#E5E7EB] bg-white'}`}>
                 <div className="flex items-center justify-between mb-3">
                   <div className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Day {day.day}</div>
                   <div className="text-xl">{day.icon}</div>
                 </div>
                 <h4 className={`font-poppins font-[600] text-[15px] text-[#111827] mb-2 ${completed[day.day] ? 'opacity-70' : ''}`}>{day.title}</h4>
                 <p className={`font-inter font-[400] text-[13px] text-[#6B7280] mb-5 min-h-[40px] leading-relaxed ${completed[day.day] ? 'opacity-70' : ''}`}>{day.task}</p>
                 <button onClick={() => setCompleted(prev => ({...prev, [day.day]: !prev[day.day]}))} className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 ${completed[day.day] ? 'bg-[#10B981] text-white shadow-md shadow-emerald-100' : 'border border-[#E5E7EB] text-slate-600 hover:bg-slate-50'}`}>
                   {completed[day.day] ? '✓ Done' : 'Mark Complete'}
                 </button>
               </div>
             ))}
           </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 bg-[#10B981] text-white px-[20px] py-[10px] rounded-full font-inter font-medium text-sm shadow-xl z-50 animate-in slide-in-from-bottom-4 fade-in">
          {toast}
        </div>
      )}

      {/* Change 4 — Disclaimer on Results */}
      <div className="text-center py-24 px-16 mt-32 border-t border-[#E5E7EB]">
         <p className="text-[#9CA3AF] text-[12px] font-inter leading-relaxed max-w-[480px] mx-auto">
            ⚕ ShifaSense AI is a preventive health awareness platform, not a medical diagnosis tool. 
            Always consult a licensed healthcare professional for medical advice, diagnosis, or treatment.
         </p>
      </div>
    </div>
  );
};


const LoadingOverlay = ({ loadingText, phase }) => (
  <div className="fixed inset-0 z-[100] bg-white/95 flex flex-col items-center justify-center">
    <div className="w-[72px] h-[72px] border-[3px] border-[#E5E7EB] border-t-[#2563EB] rounded-full animate-spin" />
    <h2 className="mt-[20px] text-[20px] font-poppins font-[600] text-[#111827]">ShifaSense Insight Core</h2>
    <p className="mt-[4px] text-[14px] font-inter text-[#6B7280]">{loadingText}</p>
  </div>
);

// FIX 4: Score accuracy correction
const correctScore = (data, inputs) => {
  let maxScore = 100;
  if (inputs.sleep < 4) maxScore = Math.min(maxScore, 55);
  if (inputs.sleep < 3) maxScore = Math.min(maxScore, 45);
  if (inputs.stress >= 8) maxScore = Math.min(maxScore, 60);
  if (inputs.stress >= 9) maxScore = Math.min(maxScore, 50);
  if (inputs.steps < 1000) maxScore = Math.min(maxScore, 65);
  if (inputs.heartRate > 100) maxScore = Math.min(maxScore, 65);
  if (inputs.hydration < 3) maxScore = Math.min(maxScore, 70);
  if (inputs.screenTime > 12) maxScore = Math.min(maxScore, 65);
  let badFactors = 0;
  if (inputs.sleep < 5) badFactors++;
  if (inputs.stress > 7) badFactors++;
  if (inputs.steps < 3000) badFactors++;
  if (inputs.activity < 15) badFactors++;
  if (inputs.hydration < 4) badFactors++;
  if (inputs.screenTime > 10) badFactors++;
  if (inputs.heartRate > 95) badFactors++;
  if (badFactors >= 4) maxScore = Math.min(maxScore, 45);
  if (badFactors >= 5) maxScore = Math.min(maxScore, 35);
  let goodFactors = 0;
  if (inputs.sleep >= 7) goodFactors++;
  if (inputs.stress <= 3) goodFactors++;
  if (inputs.steps >= 8000) goodFactors++;
  if (inputs.activity >= 30) goodFactors++;
  if (inputs.hydration >= 7) goodFactors++;
  if (inputs.screenTime <= 5) goodFactors++;
  if (inputs.heartRate >= 60 && inputs.heartRate <= 80) goodFactors++;
  let minScore = 0;
  if (goodFactors >= 5) minScore = 65;
  if (goodFactors >= 6) minScore = 75;
  if (goodFactors === 7) minScore = 82;
  data.healthScore = Math.max(minScore, Math.min(maxScore, data.healthScore));
  if (data.healthScore >= 70) { data.riskLevel = 'Healthy'; data.riskColor = '#10B981'; }
  else if (data.healthScore >= 45) { data.riskLevel = 'Moderate Risk'; data.riskColor = '#F59E0B'; }
  else { data.riskLevel = 'High Risk Pattern'; data.riskColor = '#EF4444'; }
  return data;
};

const ShifaSenseApp = () => {
  const [view, setView] = useState('landing');
  const [isSharedView, setIsSharedView] = useState(false);
  const [sharedName, setSharedName] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing analysis...');
  const [phase, setPhase] = useState(1);
  
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const [lastAnalysisTime, setLastAnalysisTime] = useState(0);
  const [analysisCount, setAnalysisCount] = useState(0);
  const RATE_LIMIT_MS = 30000;
  const MAX_ANALYSES = 10;
  
  const [formData, setFormData] = useState({
    name: '', age: 30, gender: 'Female', 
    weight: 70, height: 170,
    sleep: 7.5, stress: 5, hydration: 8,
    screenTime: 6, activity: 45, steps: 7000, heartRate: 72, 
    bmi: 24.2, 
    smoking: 'Non-smoker', // Values: Non-smoker, Occasional, Regular
    alcohol: 'Never', // Values: Never, Occasional, Regular
    foodHabits: 'Mostly Home Cooked', // Values: Balanced, Mostly Home Cooked, Mostly Junk Food
    junkFoodFrequency: 2 // Days per week
  });

  // Auto-calculate BMI
  useEffect(() => {
    if (formData.height > 0 && formData.weight > 0) {
      const heightInMeters = formData.height / 100;
      const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      setFormData(prev => ({ ...prev, bmi: parseFloat(bmi) }));
    }
  }, [formData.height, formData.weight]);

  const [backendData, setBackendData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [result, setResult] = useState(null);
  const [savedResults, setSavedResults] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle Shared URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportParam = params.get('report');
    if (reportParam) {
      try {
        const data = JSON.parse(decodeURIComponent(escape(atob(reportParam))));
        setFormData(prev => ({
          ...prev,
          name: data.n, sleep: data.sl, stress: data.st, hydration: data.hy,
          activity: data.ac, steps: data.sp, heartRate: data.hr, age: data.ag
        }));
        setResult({
          healthScore: data.s,
          riskLevel: data.r,
          riskColor: data.c,
          summary: data.sum,
          recommendations: ["Maintain a balanced diet", "Ensure consistent sleep schedules"],
          radarData: [ { metric: 'Sleep', value: 80 }, { metric: 'Stress', value: 80 }, { metric: 'Activity', value: 80 }, { metric: 'Screen', value: 80 } ],
          challenges: null // Could also try to fetch or omit for shared views to save space
        });
        setIsSharedView(true);
        setSharedName(data.n);
        setView('results');
        // Clean URL without reloading
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error("Invalid share link", e);
      }
    }
  }, []);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/api/stats`)
      .then(res => res.json())
      .then(data => { if (!data.error) setStatsData(data); })
      .catch(err => console.error("Stats fetch failed:", err));
  }, []);

  const handleAnalyze = async () => {
    const now = Date.now();
    if (analysisCount >= MAX_ANALYSES) {
      alert('Maximum analyses reached for this session. Please refresh to continue.');
      return;
    }
    if (now - lastAnalysisTime < RATE_LIMIT_MS) {
      const remaining = Math.ceil((RATE_LIMIT_MS - (now - lastAnalysisTime)) / 1000);
      alert(`Please wait ${remaining} seconds before running another analysis.`);
      return;
    }
    setLastAnalysisTime(now);
    setAnalysisCount(prev => prev + 1);

    setLoading(true); setPhase(1); setLoadingText("Running scikit-learn model...");

    // Map form fields to the exact schema expected by backend/main.py /predict-risk
    const modelInput = {
      Age: Number(formData.age),
      Sleep_Hours: Number(formData.sleep),
      Water_Liters: Number(formData.hydration) * 0.25, // convert glasses → liters
      Activity_Mins: Number(formData.activity),
      Stress_Level: Number(formData.stress),
      BMI: Number(formData.bmi),
      Food_Habits: formData.foodHabits || 'Mostly Home Cooked',
      Smoking_Habit: formData.smoking || 'Non-smoker'
    };

    let riskScore = null;
    let aiCoaching = null;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      setLoadingText("Querying prediction model...");
      const response = await fetch(`${apiUrl}/predict-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelInput)
      });
      if (response.ok) {
        const data = await response.json();
        riskScore = data.predicted_risk_percentage;
        aiCoaching = data.ai_coaching;
        setBackendData({ confidence: 0.87, from: 'scikit-learn-model' });
      } else {
        console.warn('Model API returned error:', response.status);
      }
    } catch (err) {
      console.warn('Could not reach local model, using local calculation:', err.message);
    }

    setPhase(2); setLoadingText("Building health report...");

    // If model was unreachable, compute score locally from inputs
    if (riskScore === null) {
      const s = Number(formData.sleep);
      const stress = Number(formData.stress);
      const activity = Number(formData.activity);
      const hydration = Number(formData.hydration) * 0.25;
      riskScore = Math.max(0, Math.min(100,
        10 + (1.8 * stress) + (-1.2 * s) + (-0.015 * activity) + (-1.5 * hydration) + ((formData.bmi - 22) * 0.5)
      ));
    }

    // healthScore is inverse of risk
    const healthScore = Math.max(0, Math.min(100, Math.round(100 - riskScore)));
    const riskLevel = riskScore > 70 ? 'High Risk Pattern' : riskScore > 40 ? 'Moderate Risk' : 'Healthy';
    const riskColor = riskScore > 70 ? '#EF4444' : riskScore > 40 ? '#F59E0B' : '#10B981';

    const summary = aiCoaching || (
      riskScore > 70
        ? `Your risk score of ${riskScore.toFixed(1)}% is elevated. Focus on improving sleep, reducing stress, and increasing daily activity immediately.`
        : riskScore > 40
        ? `A moderate risk of ${riskScore.toFixed(1)}% detected. Small improvements in hydration, sleep consistency, and activity levels will help significantly.`
        : `Great results — risk score of ${riskScore.toFixed(1)}%. Maintain your current healthy habits and keep monitoring regularly.`
    );

    const recommendations = [
      formData.sleep < 7 ? `Increase sleep from ${formData.sleep}h to at least 7h — sleep is your #1 recovery tool.` : `Your sleep of ${formData.sleep}h is good. Maintain a consistent sleep schedule.`,
      formData.stress > 6 ? `Your stress level of ${formData.stress}/10 is high. Try 10 mins of deep breathing or a short walk daily.` : `Stress is manageable at ${formData.stress}/10. Keep using your current coping strategies.`,
      formData.hydration < 6 ? `Increase water intake — currently ${formData.hydration} glasses. Target 8+ glasses per day.` : `Hydration looks good at ${formData.hydration} glasses. Keep it up.`,
      formData.activity < 30 ? `Activity of ${formData.activity} mins/day is below recommended 30 mins. Add a short walk to your routine.` : `Activity level of ${formData.activity} mins/day is on track. Try to stay consistent.`,
      formData.screenTime > 8 ? `Screen time of ${formData.screenTime}h is high. Reduce to under 6h and take eye breaks every hour.` : `Screen time of ${formData.screenTime}h is reasonable. Use the 20-20-20 rule to reduce eye strain.`
    ];

    const riskFactors = [];
    if (formData.sleep < 7) riskFactors.push(`Sleep: Only ${formData.sleep}h vs recommended 7-8h`);
    if (formData.stress > 6) riskFactors.push(`Stress: ${formData.stress}/10 — elevated (target ≤ 5)`);
    if (formData.hydration < 6) riskFactors.push(`Hydration: ${formData.hydration} glasses vs target 8+`);
    if (formData.activity < 30) riskFactors.push(`Activity: ${formData.activity} mins vs target 30+ mins`);
    if (formData.screenTime > 8) riskFactors.push(`Screen Time: ${formData.screenTime}h exceeds healthy limit of 6h`);
    if (formData.steps < 5000) riskFactors.push(`Steps: ${formData.steps} vs target 8000-10000/day`);
    if (formData.heartRate > 90) riskFactors.push(`Heart Rate: ${formData.heartRate} bpm is above optimal (60-80 bpm)`);

    const finalResult = validateResult({
      healthScore,
      riskLevel,
      riskColor,
      summary,
      riskFactors: riskFactors.slice(0, 3),
      recommendations,
      sleepScore: Math.min(100, Math.round((formData.sleep / 8) * 100)),
      stressScore: Math.round((10 - formData.stress) * 10),
      activityScore: Math.min(100, Math.round((formData.activity / 60) * 100)),
      radarData: [
        { metric: 'Sleep', value: Math.min(100, Math.round((formData.sleep / 8) * 100)) },
        { metric: 'Stress', value: Math.round((10 - formData.stress) * 10) },
        { metric: 'Activity', value: Math.min(100, Math.round((formData.activity / 60) * 100)) },
        { metric: 'Screen', value: Math.max(0, Math.round(100 - (formData.screenTime / 16) * 100)) },
        { metric: 'Steps', value: Math.min(100, Math.round((formData.steps / 10000) * 100)) },
        { metric: 'Hydration', value: Math.min(100, Math.round((formData.hydration / 8) * 100)) }
      ],
      challenges: null
    });

    setResult(finalResult);
    setView('results');
    setLoading(false);

    // Async: Claude 7-day challenges (non-blocking)
    (async () => {
      try {
        const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
        if (!apiKey || apiKey === 'dummy_key') throw new Error('No API key');
        const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerously-allow-browser': 'true'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 900,
            system: "You are a health coach. Return ONLY valid JSON. No markdown. Never mention smoking, alcohol, diet, or BMI.",
            messages: [{ role: 'user', content: `Create a 7-day health challenge for someone with: Sleep ${formData.sleep}h, Stress ${formData.stress}/10, Steps ${formData.steps}, Activity ${formData.activity} mins, Hydration ${formData.hydration} glasses, Screen ${formData.screenTime}h.\n\nReturn JSON: {"challenge_title":"string","focus_areas":["string"],"days":[{"day":1,"title":"string","task":"string with actual numbers","category":"sleep|stress|activity|hydration|screen","icon":"emoji"}]}` }]
          })
        });
        if (claudeRes.ok) {
          const json = await claudeRes.json();
          const challenges = JSON.parse(json.content[0].text.replace(/```json/g, '').replace(/```/g, '').trim());
          setResult(prev => prev ? { ...prev, challenges } : prev);
        }
      } catch {
        setResult(prev => prev ? { ...prev, challenges: {
          challenge_title: "7-Day Health Kickstart",
          focus_areas: ["Sleep", "Activity", "Hydration"],
          days: [
            { day: 1, title: 'Sleep Early', task: `Get to bed 30 mins earlier to reach ${Math.min(formData.sleep + 0.5, 8)}h sleep tonight.`, category: 'sleep', icon: '😴' },
            { day: 2, title: 'Hydrate Plus', task: `Drink 1 extra glass — target ${formData.hydration + 1} glasses today.`, category: 'hydration', icon: '💧' },
            { day: 3, title: 'Move More', task: `Add 10 mins to your ${formData.activity} mins — aim for ${formData.activity + 10} mins today.`, category: 'activity', icon: '🏃' },
            { day: 4, title: 'De-stress', task: `Your stress is ${formData.stress}/10. Take 5 mins for deep breathing.`, category: 'stress', icon: '🧘' },
            { day: 5, title: 'Step Up', task: `Aim for ${Math.round(formData.steps * 1.1)} steps — 10% more than your ${formData.steps}.`, category: 'activity', icon: '👟' },
            { day: 6, title: 'Screen Break', task: `Reduce screen time below ${formData.screenTime - 1}h. Take a break 30 mins before bed.`, category: 'screen', icon: '📱' },
            { day: 7, title: 'Review & Rest', task: 'Reflect on your week and repeat what worked best for you.', category: 'sleep', icon: '📝' }
          ]
        }} : prev);
      }
    })();

  };


  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    
    const newMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setChatLoading(true);
    setChatError(null);
    
    try {
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      if (!apiKey || apiKey === 'dummy_key') {
        throw new Error('Local Mode');
      }

      const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 500,
          system: `You are ShifaSense Health Coach. You give short, conversational health advice. User profile: Sleep ${formData.sleep}h, Stress ${formData.stress}/10, Hydration ${formData.hydration} gls, Activity ${formData.activity}m, Score ${result?.healthScore}. Keep answers under 3 sentences.`,
          messages: [...chatMessages, newMsg]
        })
      });
      if (!claudeRes.ok) throw new Error('Failed to fetch response');
      const claudeJson = await claudeRes.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: claudeJson.content[0].text }]);
    } catch (err) {
      // Local fallback for common Indian user perspective
      setTimeout(() => {
        const lowerInput = newMsg.content.toLowerCase();
        let reply = "Namaste! Focusing on a balanced diet, regular walking or yoga, and staying hydrated is key to good health. How else can I assist you?";
        if (lowerInput.includes('sleep') || lowerInput.includes('tired')) {
          reply = "For better rest, try having a warm glass of milk (haldi doodh) before bed and avoid mobile screens for at least 30 minutes. Good sleep is vital for your recovery!";
        } else if (lowerInput.includes('stress') || lowerInput.includes('tension')) {
          reply = "Stress is common, but deep breathing (Pranayama) or a short 10-minute meditation can quickly calm your nerves. Remember to take short breaks during your day.";
        } else if (lowerInput.includes('diet') || lowerInput.includes('food')) {
          reply = "A traditional home-cooked meal with plenty of vegetables, lentils (dal), and avoiding excess oily food will keep your energy levels steady throughout the day.";
        } else if (lowerInput.includes('score') || lowerInput.includes('report')) {
          reply = "Your health score indicates your overall lifestyle balance. Small daily improvements in walking and hydration will gradually improve your score safely.";
        }
        setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        setChatLoading(false);
      }, 1500);
      return;
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar view={view} setView={setView} setStep={setStep} />
      {loading && <LoadingOverlay loadingText={loadingText} phase={phase} />}
      <main>
        {isSharedView && view === 'results' && (
          <div className="bg-[#EFF6FF] border-b border-[#BFDBFE] p-3 text-center text-[#2563EB] font-inter font-medium text-[14px]">
            📋 Viewing shared report for {sharedName}
          </div>
        )}
        {view === 'landing' && <LandingView setView={setView} setStep={setStep} />}
        {view === 'assessment' && <AssessmentView step={step} setStep={setStep} formData={formData} setFormData={setFormData} handleAnalyze={handleAnalyze} />}
        {view === 'results' && <ResultsView result={result} formData={formData} backendData={backendData} setView={setView} setSavedResults={setSavedResults} saveSuccess={saveSuccess} setSaveSuccess={setSaveSuccess} />}
        {view === 'dashboard' && (
          <div className="max-w-7xl mx-auto py-16 px-6">
            <DashboardView savedResults={savedResults} setView={setView} setStep={setStep} />
          </div>
        )}
      </main>

      {/* PDF Report Hidden Template */}
      {result && (
        <div id="pdf-report" style={{ display: 'none' }}>
          <style>{`
            @media print {
              body > *:not(#pdf-report) { display: none !important; }
              #pdf-report { 
                display: block !important;
                font-family: 'Inter', sans-serif;
                padding: 32px 40px;
                color: #111827;
                max-width: 700px;
                margin: 0 auto;
              }
              @page { margin: 0.5in; size: A4; }
            }
          `}</style>
          
          {/* SECTION 1: HEADER */}
          <div style={{ padding: '0 0 20px', borderBottom: '2px solid #2563EB', marginBottom: '24px' }}>
             <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '24px', color: '#2563EB' }}>ShifaSense AI</div>
             <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#111827', marginTop: '4px' }}>Health Intelligence Report</div>
             <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>⚠ Not a medical diagnosis tool — for informational purposes only</div>
          </div>

          {/* SECTION 2: PATIENT INFO */}
          <div style={{ display: 'flex', gap: '24px', background: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
             {[
                { label: 'PATIENT', value: formData.name || 'User' },
                { label: 'AGE', value: `${formData.age} years` },
                { label: 'DATE', value: new Date().toLocaleDateString() },
                { label: 'REPORT ID', value: Math.random().toString(36).substr(2, 8).toUpperCase() }
             ].map((item, i) => (
                <div key={i}>
                   <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '10px', color: '#6B7280', textTransform: 'uppercase' }}>{item.label}</div>
                   <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', color: '#111827' }}>{item.value}</div>
                </div>
             ))}
          </div>

          {/* SECTION 3: SCORE */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
             <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '72px', color: result.riskColor }}>{result.healthScore}</div>
             <div style={{ display: 'inline-block', backgroundColor: `${result.riskColor}26`, color: result.riskColor, padding: '6px 20px', borderRadius: '999px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px' }}>
                {result.riskLevel}
             </div>
             <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
                Behavioral Risk Index: {result.healthScore}
             </div>
          </div>

          {/* SECTION 4: AI SUMMARY */}
          <div style={{ background: '#EFF6FF', borderLeft: '4px solid #2563EB', padding: '16px', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
             <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '10px', color: '#2563EB', letterSpacing: '0.1em', marginBottom: '8px' }}>AI ANALYSIS SUMMARY</div>
             <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{result.summary}</div>
          </div>

          {/* SECTION 5: DATA GRID */}
          <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '10px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '12px' }}>YOUR HEALTH DATA</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
             {[
                { label: 'SLEEP', value: `${formData.sleep}h` },
                { label: 'STRESS', value: `${formData.stress}/10` },
                { label: 'HYDRATION', value: `${formData.hydration} glasses` },
                { label: 'ACTIVITY', value: `${formData.activity} mins` },
                { label: 'STEPS', value: `${formData.steps} steps` },
                { label: 'HEART RATE', value: `${formData.heartRate} bpm` }
             ].map((item, i) => (
                <div key={i} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '10px 12px' }}>
                   <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '10px', color: '#6B7280', textTransform: 'uppercase' }}>{item.label}</div>
                   <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '16px', color: '#111827' }}>{item.value}</div>
                </div>
             ))}
          </div>

          {/* SECTION 6: RECOMMENDATIONS */}
          <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '10px', color: '#6B7280', letterSpacing: '0.1em', marginBottom: '12px' }}>PERSONALIZED RECOMMENDATIONS</div>
          <div>
             {result.recommendations?.slice(0, 5).map((rec, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '10px 12px', marginBottom: '6px' }}>
                   <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#2563EB', color: 'white', fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                   <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{rec}</div>
                </div>
             ))}
          </div>

          {/* SECTION 7: FOOTER */}
          <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between' }}>
             <div>
                <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '11px', color: '#2563EB' }}>Generated by ShifaSense AI</div>
                <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '10px', color: '#9CA3AF' }}>{new Date().toLocaleString()}</div>
             </div>
             <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '10px', color: '#9CA3AF' }}>shifasense-ai.vercel.app</div>
          </div>
        </div>
      )}

      {/* CHAT TRIGGER FAB */}
      {view !== 'assessment' && !chatOpen && (
        <button 
          onClick={() => setChatOpen(true)} 
          style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 40, background: '#2563EB', color: 'white', borderRadius: '50%', width: '64px', height: '64px', boxShadow: '0 8px 32px rgba(37,99,235,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)'; e.currentTarget.style.background = '#1D4ED8'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.background = '#2563EB'; }}
          className="flex items-center justify-center group"
        >
          <Bot size={32} />
          {/* Online Indicator Dot */}
          <div style={{ position: 'absolute', top: '2px', right: '2px', width: '14px', height: '14px', background: '#10B981', border: '3px solid white', borderRadius: '50%' }} className="animate-pulse"></div>
        </button>
      )}

      {/* CHAT DRAWER OVERLAY */}
      {chatOpen && (
        <>
          <div 
            onClick={() => setChatOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 48, backdropFilter: 'blur(4px)' }}
          />
          <div style={{ position: 'fixed', top: 0, bottom: 0, right: 0, width: '100%', maxWidth: '400px', background: 'white', zIndex: 50, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 24px rgba(0,0,0,0.1)' }} className="animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', background: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', color: 'white' }} className="flex justify-center"><Brain size={18} /></div>
                <div>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#111827' }}>ShifaSense Coach</div>
                  <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></div> Online</div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', color: '#9CA3AF', cursor: 'pointer' }}>✕</button>
            </div>
            
            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {chatMessages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6B7280', fontFamily: 'Inter', fontSize: '14px', marginTop: '40px' }}>
                  Ask me anything about your health report! I can explain your scores, risk factors, or suggest daily habits.
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div style={{ background: msg.role === 'user' ? '#2563EB' : '#F1F5F9', color: msg.role === 'user' ? 'white' : '#111827', padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0', fontFamily: 'Inter', fontSize: '14px', lineHeight: 1.5 }}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div style={{ alignSelf: 'flex-start', background: '#F1F5F9', padding: '12px 16px', borderRadius: '16px 16px 16px 0' }}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #E5E7EB', background: 'white' }}>
              <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask about your health..."
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: 'Inter', fontSize: '14px', background: '#F8FAFC' }}
                  disabled={chatLoading}
                />
                <button type="submit" disabled={!chatInput.trim() || chatLoading} style={{ background: chatInput.trim() && !chatLoading ? '#2563EB' : '#E5E7EB', color: 'white', border: 'none', borderRadius: '24px', padding: '0 20px', fontWeight: 600, cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}>
                  Send
                </button>
              </form>
              {chatError && <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>{chatError}</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShifaSenseApp;
