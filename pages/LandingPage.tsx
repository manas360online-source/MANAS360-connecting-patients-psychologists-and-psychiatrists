import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowRight, Activity, ShieldCheck, Users } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-brand-blue">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-serif font-bold">M</div>
          <span className="font-serif font-bold text-xl tracking-tight">MANAS360</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/psychologist')} className="text-sm font-medium text-slate-600 hover:text-brand-blue">Provider Login</button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12 md:py-24 max-w-4xl mx-auto">
        
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Foundation Therapy meets <br/>
          <span className="text-brand-blue">Advanced Clinical Care</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
          The gap-bridging platform where Psychologists build the foundation and Psychiatrists handle the complexity. Integrated, ego-free, and patient-centered.
        </p>

        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          <Button onClick={() => navigate('/assessment/start')} className="text-lg px-10 py-4 shadow-xl shadow-blue-200">
            Get Started
          </Button>
          <Button variant="secondary" onClick={() => navigate('/psychologist')}>
            I am a Clinician
          </Button>
        </div>

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left w-full">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">Psychologists</h3>
            <p className="text-slate-500 text-sm">The "Foundation Builders". First responders and gateway to care. Earn competitive income plus referral bonuses.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">Psychiatrists</h3>
            <p className="text-slate-500 text-sm">The "Advanced Specialists". Handling complex cases and medication management. No time wasted on basic intake.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
              <Activity size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">Patients</h3>
            <p className="text-slate-500 text-sm">Get the best of both worlds. Seamless transition between therapy and medical care without repeating your story.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>Aham Brahmasmi 🕉️ 💚</p>
      </footer>
    </div>
  );
};