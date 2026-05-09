import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Food_Habits' || name === 'Smoking_Habit' ? value : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // If deployed to Vercel, use the relative /api path for the serverless function.
      // Otherwise, fallback to the local API endpoint.
      // Use a more robust production check to handle Vercel and Capacitor environments
      const isProduction = import.meta.env.MODE === 'production' || window.location.hostname !== 'localhost' || (window.location.protocol === 'https:' && !window.location.hostname.includes('127.0.0.1'));
      const apiUrl = isProduction ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:8000');
      
      const response = await axios.post(`${apiUrl}/predict-risk`, formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to connect to the insight core.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score < 40) return 'text-emerald-400';
    if (score <= 70) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 lg:p-12 rounded-[2.5rem] border border-gray-800 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Age */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Age</label>
            <input 
              type="number" name="Age" value={formData.Age} onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-500/50 transition-all"
            />
          </div>

          {/* BMI */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">BMI</label>
            <input 
              type="number" step="0.1" name="BMI" value={formData.BMI} onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-500/50 transition-all"
            />
          </div>

          {/* Sleep Hours */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Sleep Hours</label>
            <input 
              type="number" step="0.5" name="Sleep_Hours" value={formData.Sleep_Hours} onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-500/50 transition-all"
            />
          </div>

          {/* Water Liters */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Water (Liters)</label>
            <input 
              type="number" step="0.1" name="Water_Liters" value={formData.Water_Liters} onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-500/50 transition-all"
            />
          </div>

          {/* Activity Mins */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Activity (Mins)</label>
            <input 
              type="number" name="Activity_Mins" value={formData.Activity_Mins} onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-500/50 transition-all"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Stress Level (1-10)</label>
              <span className="text-teal-400 font-bold">{formData.Stress_Level}/10</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button 
                  key={num}
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'Stress_Level', value: num } })}
                  className={`h-10 rounded-xl text-xs font-bold transition-all border ${formData.Stress_Level === num ? 'bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-500/20' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-teal-500/50'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Food Habits Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Food Habits</label>
            <select 
              name="Food_Habits" value={formData.Food_Habits} onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-500/50 transition-all"
            >
              <option value="Mostly Home Cooked">Mostly Home Cooked</option>
              <option value="Mostly Junk Food">Mostly Junk Food</option>
            </select>
          </div>

          {/* Smoking Habit Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Smoking Habit</label>
            <select 
              name="Smoking_Habit" value={formData.Smoking_Habit} onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-teal-500/50 transition-all"
            >
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
          type="submit" disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-teal-900/20 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Analyzing...
            </>
          ) : (
            'Analyze My Health'
          )}
        </button>
      </form>

      {/* Task 3 - Results Card */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-4 text-teal-400 font-bold text-[10px] uppercase tracking-[0.2em]">
               <CheckCircle2 size={16} /> Analysis Result
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">Predicted Health Risk</div>
              <div className={`text-6xl font-bold tracking-tighter ${getRiskColor(result.predicted_risk_percentage)}`}>
                {result.predicted_risk_percentage}%
              </div>
            </div>
            <div className="pt-6 border-t border-gray-800">
               <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">AI Intelligence Coaching</div>
               <p className="text-gray-300 leading-relaxed font-medium">
                 {result.ai_coaching}
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiskForm;
