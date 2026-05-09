import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

// Determine API URL based on runtime environment
const getApiUrl = () => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  // Capacitor app uses capacitor:// — must use absolute production URL
  if (protocol === 'capacitor:' || protocol === 'file:') {
    return import.meta.env.VITE_PROD_API_URL || 'https://shifa-sense-ai.vercel.app/api';
  }
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }
  // Vercel/production web — use relative path
  return '/api';
};

const RiskForm = () => {
  const [formData, setFormData] = useState({
    Age: 25,
    Sleep_Hours: 7,
    Water_Liters: 2,
    Activity_Mins: 30,
    Stress_Level: 5,
    BMI: 22,
    Food_Habits: 'Mostly Home Cooked',
    Smoking_Habit: 'Non-smoker'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'Food_Habits' || name === 'Smoking_Habit') ? value : Number(value)
    }));
  };

  const handleInputChange = (e) => {
    handleChange(e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const apiUrl = getApiUrl();
      const response = await axios.post(`${apiUrl}/predict-risk`, formData, {
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
      });
      setResult(response.data);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || err.message || 'Failed to connect. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score < 40) return 'text-emerald-400';
    if (score <= 70) return 'text-amber-400';
    return 'text-rose-400';
  };

  const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-500 transition-all";

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 lg:p-12 rounded-[2.5rem] border border-gray-800 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Age */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Age</label>
            <input type="number" name="Age" value={formData.Age} onChange={handleInputChange} className={inputClass} />
          </div>

          {/* BMI */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">BMI</label>
            <input type="number" step="0.1" name="BMI" value={formData.BMI} onChange={handleInputChange} className={inputClass} />
          </div>

          {/* Sleep Hours */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Sleep Hours</label>
            <input type="number" step="0.5" name="Sleep_Hours" value={formData.Sleep_Hours} onChange={handleInputChange} className={inputClass} />
          </div>

          {/* Water Liters */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Water (Liters/day)</label>
            <input type="number" step="0.1" name="Water_Liters" value={formData.Water_Liters} onChange={handleInputChange} className={inputClass} />
          </div>

          {/* Activity Mins */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Activity (Mins/day)</label>
            <input type="number" name="Activity_Mins" value={formData.Activity_Mins} onChange={handleInputChange} className={inputClass} />
          </div>

          {/* Stress Level — number buttons, no slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Stress Level</label>
              <span className="text-teal-400 font-bold text-lg">{formData.Stress_Level} / 10</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleChange('Stress_Level', num)}
                  className={`h-11 rounded-xl text-sm font-bold transition-all border-2 ${
                    formData.Stress_Level === num
                      ? 'bg-teal-500 text-white border-teal-400 shadow-lg shadow-teal-500/30 scale-105'
                      : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-teal-600 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Food Habits */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Food Habits</label>
            <select name="Food_Habits" value={formData.Food_Habits} onChange={handleInputChange} className={inputClass}>
              <option value="Mostly Home Cooked">Mostly Home Cooked</option>
              <option value="Mostly Junk Food">Mostly Junk Food</option>
            </select>
          </div>

          {/* Smoking Habit */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Smoking Habit</label>
            <select name="Smoking_Habit" value={formData.Smoking_Habit} onChange={handleInputChange} className={inputClass}>
              <option value="Non-smoker">Non-smoker</option>
              <option value="Occasional">Occasional</option>
              <option value="Regular">Regular</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-teal-900/20 flex items-center justify-center gap-3 text-base"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> Analyzing your health data...</>
          ) : (
            'Analyze My Health'
          )}
        </button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-4 text-teal-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              <CheckCircle2 size={16} /> Analysis Complete
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">Predicted Health Risk</div>
              <div className={`text-7xl font-bold tracking-tighter ${getRiskColor(result.predicted_risk_percentage)}`}>
                {result.predicted_risk_percentage}%
              </div>
              <div className={`text-sm font-bold mt-2 ${getRiskColor(result.predicted_risk_percentage)}`}>
                {result.risk_level}
              </div>
            </div>
            <div className="pt-6 border-t border-gray-800">
              <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">AI Health Coaching</div>
              <p className="text-gray-300 leading-relaxed font-medium">{result.ai_coaching}</p>
            </div>
            {result.insights && result.insights.length > 0 && (
              <div className="pt-4 space-y-3">
                {result.insights.map((insight, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <p className="text-gray-400 text-sm leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiskForm;
