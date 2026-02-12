import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowLeft, CheckCircle, PhoneCall, Stethoscope } from 'lucide-react';
import { useApp } from '../context/AppContext';

const QUESTIONS = [
  { id: 'q1', text: "Little interest or pleasure in doing things?" },
  { id: 'q2', text: "Feeling down, depressed, or hopeless?" },
  { id: 'q3', text: "Trouble falling or staying asleep, or sleeping too much?" },
  { id: 'q4', text: "Feeling tired or having little energy?" },
  { id: 'q5', text: "Feeling nervous, anxious, or on edge?" },
];

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const { createNewPatient } = useApp();
  const [step, setStep] = useState(-1); // Start at -1 for Name Input
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState('');

  const handleScore = (value: number) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[step].id]: value }));
    if (step < QUESTIONS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setStep(QUESTIONS.length); // Finish
    }
  };

  const calculateTotal = (): number => (Object.values(answers) as number[]).reduce((a: number, b: number) => a + b, 0);

  // Story 5.5 Triage Logic
  const getRecommendation = () => {
    const score = calculateTotal();
    const scaledScore = score * 1.8; // Scaling 0-15 to 0-27 approx

    if (scaledScore >= 20) {
        return { 
            type: 'CRITICAL', 
            label: 'Crisis Support & Psychiatry', 
            desc: 'Your symptoms indicate a need for immediate, integrated care.',
            isCrisis: true
        };
    }
    return { 
        type: 'MODERATE', 
        label: 'Foundation Therapy', 
        desc: 'A psychologist will work with you to build strong mental health foundations.',
        isCrisis: false
    };
  };

  const handleFinish = (target: string) => {
      const score = calculateTotal() * 1.8;
      createNewPatient(name, score, answers);
      navigate(target);
  };

  if (step === -1) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-brand-light relative">
             {/* Back Button added to top left */}
             <div className="absolute top-6 left-6 md:top-8 md:left-8">
                <button 
                  onClick={() => navigate('/')} 
                  className="flex items-center gap-2 text-slate-500 hover:text-brand-blue font-medium transition-colors p-3 rounded-xl hover:bg-blue-50 group"
                >
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> 
                    <span className="text-lg">Back</span>
                </button>
             </div>

             {/* Bigger Card */}
             <div className="bg-white p-10 md:p-20 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center border border-white/50">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-800 mb-8 leading-tight">Let's Start with Your Name</h2>
                <p className="text-slate-500 text-xl mb-12">Please share your name with us to begin.</p>
                <input 
                    type="text" 
                    placeholder="First Name"
                    className="w-full p-6 bg-blue-50 rounded-2xl border-2 border-transparent focus:border-brand-blue focus:ring-0 focus:bg-white transition-all mb-10 text-2xl outline-none placeholder:text-slate-300 font-medium text-slate-800"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
                 <Button fullWidth onClick={() => name && setStep(0)} disabled={!name} className="text-xl py-5 rounded-2xl shadow-blue-200 shadow-xl">
                    Continue
                 </Button>
             </div>
        </div>
    )
  }

  if (step === QUESTIONS.length) {
    const rec = getRecommendation();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-brand-light">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-800 mb-4">Assessment Complete</h2>
          <p className="text-slate-500 mb-8">{rec.desc}</p>
          
          <div className="bg-blue-50 p-6 rounded-2xl mb-8 border border-blue-100">
            <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-2">Recommended Care Path</p>
            <p className="text-2xl font-serif text-brand-blue font-bold">{rec.label}</p>
          </div>

          {rec.isCrisis ? (
             <div className="space-y-4">
                 <button 
                    onClick={() => handleFinish('/crisis-support')}
                    className="w-full bg-red-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-red-700 flex items-center justify-center gap-2"
                 >
                    <PhoneCall size={20} />
                    Crisis Support
                 </button>
                 <Button fullWidth variant="outline" onClick={() => handleFinish('/select-psychiatrist')}>
                    <Stethoscope size={20} />
                    Connect to Psychiatrist
                 </Button>
             </div>
          ) : (
             <Button fullWidth onClick={() => handleFinish('/select-psychologist')}>
                Meet Your Psychologist
             </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-brand-light relative">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>

      <div className="w-full max-w-2xl mb-8">
        <button onClick={() => setStep(-1)} className="text-slate-400 hover:text-brand-blue flex items-center gap-2 mb-4">
            <ArrowLeft size={16} /> Back
        </button>
        <div className="h-2 bg-white rounded-full overflow-hidden shadow-sm">
          <div 
            className="h-full bg-brand-blue transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-xl max-w-2xl w-full text-center">
        <h3 className="font-serif text-2xl md:text-3xl font-medium text-slate-800 mb-12 leading-relaxed">
          Over the last 2 weeks, how often have you been bothered by: <br/>
          <span className="text-brand-blue font-bold block mt-4">{QUESTIONS[step].text}</span>
        </h3>

        <div className="grid gap-3">
          {[
            { label: 'Not at all', val: 0 },
            { label: 'Several days', val: 1 },
            { label: 'More than half the days', val: 2 },
            { label: 'Nearly every day', val: 3 },
          ].map((opt) => (
            <button
              key={opt.val}
              onClick={() => handleScore(opt.val)}
              className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-brand-blue hover:bg-blue-50 text-slate-600 hover:text-brand-blue font-medium transition-all text-left px-6"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};