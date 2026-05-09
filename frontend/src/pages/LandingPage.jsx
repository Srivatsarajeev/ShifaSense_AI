import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Brain, 
  FileText, 
  Lock, 
  CheckCircle2,
  Users
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen selection:bg-primary/10">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-8 lg:px-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-[10px] font-bold uppercase tracking-widest">
              Next Generation Clinical Intelligence
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Clinical Precision Meets <br />
              <span className="text-primary italic">Empathetic</span> AI
            </h1>
            
            <p className="text-slate-500 text-lg lg:text-xl max-w-xl leading-relaxed">
              ShifaSense AI provides real-time health analysis and clinical-grade intelligence to assist healthcare professionals in delivering faster, more accurate patient care.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link to="/assessment" className="w-full sm:w-auto">
                <button className="btn-primary w-full">
                  Start Health Analysis
                </button>
              </Link>
              <button className="btn-secondary w-full sm:w-auto">
                View Demo
              </button>
            </div>

            <div className="flex items-center gap-6 pt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=shifa${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-400">
                Trusted by <span className="text-slate-900">2,000+ clinicians</span> worldwide
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 p-3 bg-white">
               <img 
                 src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070" 
                 alt="Clinical AI Interface" 
                 className="w-full h-auto rounded-[1.5rem]"
               />
               <div className="absolute bottom-10 left-10 right-10 glass p-6 rounded-2xl border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Activity size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analysis Complete</div>
                      <div className="text-sm font-bold text-slate-900">98.4% Confidence Score • Real-time Monitoring</div>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { val: '1M+', label: 'Analysis Completed' },
            { val: '99.9%', label: 'Clinical Accuracy' },
            { val: '2k+', label: 'Medical Institutions' },
            { val: '24/7', label: 'Real-time Support' }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-4xl font-bold text-primary">{stat.val}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-32 px-8 lg:px-20">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Capabilities Engineered for Excellence</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Precision diagnostic tools powered by HIPAA-compliant artificial intelligence.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-card !p-0 overflow-hidden flex flex-col">
               <div className="p-10 space-y-4">
                 <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                   <Activity size={24} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900">Predictive Patient Monitoring</h3>
                 <p className="text-slate-500 leading-relaxed max-w-md">Our AI analyzes continuous vital data to predict potential adverse events up to 8 hours before they occur.</p>
               </div>
               <div className="mt-auto h-64 bg-slate-50 border-t border-slate-100 flex items-center justify-center p-12 overflow-hidden">
                  <div className="w-full h-full relative opacity-40">
                     <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                        <path d="M0,50 L50,50 L60,20 L70,80 L80,50 L130,50 L140,0 L150,100 L160,50 L210,50" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary animate-pulse" />
                        <path d="M210,50 L260,50 L270,20 L280,80 L290,50 L340,50 L350,0 L360,100 L370,50 L420,50" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary animate-pulse" style={{ animationDelay: '1s' }} />
                        <path d="M420,50 L470,50 L480,20 L490,80 L500,50 L550,50 L560,0 L570,100 L580,50 L630,50" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary animate-pulse" style={{ animationDelay: '2s' }} />
                     </svg>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="glass-card flex flex-col items-center text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-6">
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">HIPAA Secure</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Enterprise-grade encryption and compliance standards.</p>
               </div>
               <div className="glass-card flex flex-col items-center text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                    <FileText size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Smart Reports</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Automated clinical summaries for faster decision making.</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="glass-card">
               <h4 className="text-xl font-bold text-slate-900 mb-4">Radiology Assist</h4>
               <p className="text-slate-500 text-sm leading-relaxed mb-6">AI-enhanced image processing for rapid anomaly detection in X-rays and MRI scans.</p>
               <button className="text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                 Learn more <ArrowRight size={16} />
               </button>
            </div>
            <div className="lg:col-span-2 glass-card flex items-center justify-between">
               <div className="space-y-3">
                 <h4 className="text-xl font-bold text-slate-900">Integrated Ecosystem</h4>
                 <p className="text-slate-500 text-sm leading-relaxed max-w-sm">Seamlessly connects with existing EMR/EHR systems including Epic, Cerner, and Allscripts.</p>
               </div>
               <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Activity size={24} />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Users size={24} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 lg:px-20">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-primary p-20 text-center space-y-10 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
           <h2 className="text-5xl font-bold text-white max-w-2xl mx-auto leading-tight">Ready to enhance your clinical workflow?</h2>
           <p className="text-blue-100 text-xl max-w-xl mx-auto font-medium">Join thousands of healthcare professionals who trust ShifaSense AI for precision insights.</p>
           <div className="flex flex-wrap justify-center gap-4 pt-6">
              <button className="bg-white text-primary font-bold py-4 px-10 rounded-2xl shadow-xl hover:bg-blue-50 transition-all">
                Request a Demo
              </button>
              <button className="bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl border border-blue-600 hover:bg-blue-800 transition-all">
                Get Started Free
              </button>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 lg:px-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
               <ShieldCheck className="text-white" size={18} />
             </div>
             <span className="text-lg font-bold text-slate-900 tracking-tighter">ShifaSense <span className="text-primary">AI</span></span>
           </div>
           <div className="flex gap-10 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">HIPAA Compliance</a>
           </div>
           <p className="text-[10px] text-slate-400 font-medium">© 2026 ShifaSense AI. Clinical Grade Intelligence.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
