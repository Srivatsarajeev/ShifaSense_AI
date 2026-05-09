import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Footprints, 
  Moon, 
  Zap, 
  Droplets, 
  Monitor, 
  Activity,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Plus,
  Minus,
  Brain,
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  Lock
} from 'lucide-react';
import axios from 'axios';
import RiskForm from '../components/RiskForm';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    heartRate: 72,
    dailySteps: 8500,
    sleepDuration: 7.5,
    stressLevel: 5,
    waterIntake: 6,
    physicalActivity: 30,
    screenTime: 5
  });

  const steps = [
    { id: 'vitals', title: 'Core Vitals', icon: Activity },
    { id: 'activity', title: 'Activity Metrics', icon: Footprints },
    { id: 'wellness', title: 'Wellness Habits', icon: Brain },
    { id: 'review', title: 'Final Review', icon: ShieldCheck }
  ];

  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNumericChange = (id, delta, min = 0, max = 100000) => {
    setFormData(prev => {
      const newVal = Math.min(max, Math.max(min, (prev[id] || 0) + delta));
      return { ...prev, [id]: newVal };
    });
  };

  const getApiUrl = () => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    if (protocol === 'capacitor:' || protocol === 'file:') {
      return import.meta.env.VITE_PROD_API_URL || 'https://shifa-sense-ai.vercel.app/api';
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return import.meta.env.VITE_API_URL || 'http://localhost:8000';
    }
    return '/api';
  };

  const saveToHistory = (predictionData, inputData) => {
    const history = JSON.parse(localStorage.getItem('shifasense_history') || '[]');
    const newEntry = {
      id: `ASSESS-${Date.now()}`,
      date: new Date().toISOString(),
      data: inputData || formData,
      prediction: predictionData,
      status: 'Completed'
    };
    localStorage.setItem('shifasense_history', JSON.stringify([newEntry, ...history]));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const numericData = {
        Age: 30,
        Sleep_Hours: formData.sleepDuration,
        Water_Liters: formData.waterIntake * 0.25,
        Activity_Mins: formData.physicalActivity,
        Stress_Level: Number(formData.stressLevel) || 5,
        BMI: 24,
        Food_Habits: 'Mostly Home Cooked',
        Smoking_Habit: 'Non-smoker'
      };
      const response = await axios.post(`${apiUrl}/predict-risk`, numericData, {
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
      });
      saveToHistory(response.data, formData);
      setTimeout(() => {
        navigate('/result', { state: { data: formData, prediction: response.data } });
      }, 2500);
    } catch (err) {
      console.error('Analysis failed:', err);
      // Compute a simple local fallback so user sees something real
      const stress = Number(formData.stressLevel) || 5;
      const sleep = formData.sleepDuration || 7;
      const activity = formData.physicalActivity || 30;
      const localRisk = Math.max(0, Math.min(100,
        10 + (2.0 * stress) + (-0.5 * sleep) + (-0.01 * activity) + (-0.2 * (formData.waterIntake * 0.25))
      ));
      const fallbackData = {
        score: Math.round(100 - localRisk),
        predicted_risk_percentage: Math.round(localRisk * 10) / 10,
        risk_level: localRisk > 70 ? 'High Risk Pattern' : (localRisk > 40 ? 'Moderate Variance' : 'Optimal Status'),
        ai_coaching: localRisk > 70
          ? 'Your data suggests high physiological stress. Prioritize sleep, reduce stress, and consult a healthcare professional.'
          : localRisk > 40
            ? 'Moderate risk detected. Focus on improving sleep consistency and increasing daily activity.'
            : 'Your metrics indicate a healthy baseline. Keep maintaining your current routines.',
        insights: ['Based on local calculation — connect to internet for full AI analysis.']
      };
      saveToHistory(fallbackData, formData);
      setTimeout(() => {
        navigate('/result', { state: { data: formData, prediction: fallbackData } });
      }, 2500);
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="form-label">Current Heart Rate (BPM)</label>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 transition-all hover:border-primary/30">
                 <input 
                   type="number" 
                   value={formData.heartRate} 
                   onChange={(e) => handleInputChange('heartRate', parseInt(e.target.value))}
                   className="text-4xl font-bold text-slate-900 bg-transparent border-none outline-none w-full"
                 />
                 <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Normal range: 60-100 BPM</div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="form-label">Daily Steps</label>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 transition-all hover:border-primary/30">
                 <input 
                   type="number" 
                   value={formData.dailySteps} 
                   onChange={(e) => handleInputChange('dailySteps', parseInt(e.target.value))}
                   className="text-4xl font-bold text-slate-900 bg-transparent border-none outline-none w-full"
                 />
                 <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Target: 10,000 steps</div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="form-label">Physical Activity (Mins)</label>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 transition-all hover:border-primary/30">
                 <input 
                   type="number" 
                   value={formData.physicalActivity} 
                   onChange={(e) => handleInputChange('physicalActivity', parseInt(e.target.value))}
                   className="text-4xl font-bold text-slate-900 bg-transparent border-none outline-none w-full"
                 />
                 <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Recommended: 30+ mins/day</div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="form-label">Screen Time (Hours)</label>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 transition-all hover:border-primary/30">
                 <input 
                   type="number" 
                   value={formData.screenTime} 
                   onChange={(e) => handleInputChange('screenTime', parseInt(e.target.value))}
                   className="text-4xl font-bold text-slate-900 bg-transparent border-none outline-none w-full"
                 />
                 <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Limit to under 6 hrs for focus</div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="md:col-span-2 space-y-6">
              <div className="flex justify-between items-end">
                <label className="form-label">Sleep Duration (Last Night)</label>
                <div className="text-right">
                   <span className="text-3xl font-bold text-primary">{formData.sleepDuration}</span>
                   <span className="text-sm font-bold text-slate-400 ml-2 uppercase">hours</span>
                </div>
              </div>
              <input 
                type="range" min="0" max="12" step="0.5" 
                value={formData.sleepDuration} 
                onChange={(e) => handleInputChange('sleepDuration', parseFloat(e.target.value))}
                className="slider-input touch-pan-y"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="form-label">Stress Level (1-10)</label>
                <div className="text-right">
                   <span className="text-3xl font-bold text-primary">{formData.stressLevel}</span>
                   <span className="text-sm font-bold text-slate-400 ml-2 uppercase">/ 10</span>
                </div>
              </div>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button 
                    key={num}
                    type="button"
                    onClick={() => handleInputChange('stressLevel', num)}
                    className={`h-12 rounded-xl text-sm font-bold transition-all border-2 ${
                      formData.stressLevel === num
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                <span>Minimal</span>
                <span>Extreme</span>
              </div>
            </div>
            <div className="space-y-4">
              <label className="form-label">Water Intake (Glasses)</label>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                 <button onClick={() => handleNumericChange('waterIntake', -1, 0)} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-white transition-all shadow-sm"><Minus size={18} /></button>
                 <span className="text-3xl font-bold text-slate-900">{formData.waterIntake}</span>
                 <button onClick={() => handleNumericChange('waterIntake', 1, 0)} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-white transition-all shadow-sm"><Plus size={18} /></button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="p-8 bg-blue-50 border border-blue-100 rounded-[2rem] space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Summary of Intelligence Input</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(formData).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="text-lg font-bold text-slate-900">{val} {key === 'sleepDuration' ? 'hrs' : ''}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <ShieldCheck size={24} className="text-primary" />
               <p className="text-sm text-slate-500 font-medium">By proceeding, you confirm the accuracy of the provided metrics for AI analysis.</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const [showDeepRisk, setShowDeepRisk] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-slate-900">Health Assessment</h1>
          <p className="text-slate-500 font-medium">Choose between standard health metrics or Deep AI Risk Analysis.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
           <button 
             onClick={() => setShowDeepRisk(false)}
             className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${!showDeepRisk ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
           >
             Standard
           </button>
           <button 
             onClick={() => setShowDeepRisk(true)}
             className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${showDeepRisk ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
           >
             Deep Risk
           </button>
        </div>
      </div>

      {!showDeepRisk ? (
        <>
          {/* Stepper */}
          <div className="flex items-center justify-between px-8 py-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${idx <= currentStep ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                    {idx < currentStep ? <CheckCircle2 size={24} /> : idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${idx <= currentStep ? 'text-primary' : 'text-slate-400'}`}>
                    {step.id}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 transition-all duration-700 ${idx < currentStep ? 'bg-primary' : 'bg-slate-100'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Assessment Card */}
          <div className="glass-card !p-12 relative min-h-[500px] flex flex-col">
            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                <Plus className="rotate-45" size={18} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Step {currentStep + 1}: {steps[currentStep].title}</h2>
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Form Footer */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-4 w-1/3">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
              </div>
              
              <div className="flex gap-4">
                  <button 
                    onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                    className={`btn-secondary !py-3 !px-10 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => currentStep === steps.length - 1 ? handleSubmit() : setCurrentStep(currentStep + 1)}
                    className="btn-primary !py-3 !px-10"
                  >
                    {currentStep === steps.length - 1 ? 'Analyze Health' : 'Next Step'} <ArrowRight size={18} />
                  </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
           <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4 text-blue-700">
              <Lock size={20} className="shrink-0" />
              <p className="text-sm font-medium">Deep Risk Analysis uses an advanced machine learning model and Gemini-1.5-Flash for high-precision coaching.</p>
           </div>
           <RiskForm />
        </div>
      )}

      {/* Smart Tip Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-4 flex gap-8 items-center">
         <div className="w-48 h-32 rounded-[2rem] overflow-hidden shadow-lg border-2 border-white shrink-0">
           <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2040" alt="Consistency" className="w-full h-full object-cover" />
         </div>
         <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
               <Sparkles size={14} /> Smart Tip
            </div>
            <h3 className="text-xl font-bold text-slate-900">Consistency is Key</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl font-medium">Maintaining a routine helps our AI build a more accurate baseline for your health trends.</p>
         </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 mb-8 animate-float">
               <Brain size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Neural Analysis in Progress</h2>
            <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">Cross-referencing your behavioral data against 10,000+ health patterns...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    
    {/* Medical Disclaimer */}
    <div className="text-center py-24 px-16 mt-32 border-t border-white/5">
       <p className="text-[#9CA3AF] text-[12px] font-inter leading-relaxed max-w-[480px] mx-auto">
          ⚕ ShifaSense AI is a preventive health awareness platform, not a medical diagnosis tool. 
          Always consult a licensed healthcare professional for medical advice, diagnosis, or treatment.
       </p>
    </div>
  );
};

export default AssessmentPage;
