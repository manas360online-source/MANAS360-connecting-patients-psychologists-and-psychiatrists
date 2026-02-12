import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Calendar, FileText, Lock, DollarSign, ArrowLeft, Stethoscope, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Replicating Questions and Options to display report
const QUESTIONS = [
  { id: 'q1', text: "Little interest or pleasure in doing things?" },
  { id: 'q2', text: "Feeling down, depressed, or hopeless?" },
  { id: 'q3', text: "Trouble falling or staying asleep, or sleeping too much?" },
  { id: 'q4', text: "Feeling tired or having little energy?" },
  { id: 'q5', text: "Feeling nervous, anxious, or on edge?" },
];

const ANSWER_LABELS: Record<number, string> = {
    0: 'Not at all',
    1: 'Several days',
    2: 'More than half the days',
    3: 'Nearly every day'
};

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { patients, currentUserId } = useApp();
  const currentUser = patients.find(p => p.id === currentUserId);
  const [showReport, setShowReport] = useState(false);

  // Redirect if no user found
  if (!currentUser) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-4">No active session found.</h2>
              <Button onClick={() => navigate('/')}>Return Home</Button>
          </div>
      )
  }

  // View: Referral Accepted by Psychiatrist (Request Sent), Pending Patient Booking
  if (currentUser.referralStatus === 'Accepted' && !currentUser.isBooked) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="bg-white p-10 rounded-[2rem] shadow-xl max-w-lg w-full border border-blue-50">
                <div className="w-20 h-20 bg-blue-100 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
                    <Stethoscope size={36} />
                </div>
                <h2 className="font-serif text-2xl font-bold text-slate-800 mb-4 leading-snug">
                    Your psychologist has referred you to a psychiatrist
                </h2>
                
                <div className="bg-slate-50 p-6 rounded-2xl mb-8">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Referred By</p>
                    <h3 className="font-serif font-bold text-slate-800 text-xl">Dr. Sanky</h3>
                    <p className="text-slate-500 text-sm mt-4">
                        Your sessions will be forwarded to a psychiatrist. Please continue by booking a psychiatrist session.
                    </p>
                </div>

                <Button fullWidth onClick={() => navigate('/select-psychiatrist')} className="text-lg py-4">
                    Connect to Psychiatrist
                </Button>
              </div>
          </div>
      )
  }

  // Gated Access: Must be booked
  if (!currentUser.isBooked) {
       return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-md w-full border border-blue-50">
                <Lock size={48} className="text-slate-300 mx-auto mb-6" />
                <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">Dashboard Locked</h2>
                <p className="text-slate-500 mb-8">You need to book a session to access your care dashboard.</p>
                <Button onClick={() => navigate('/assessment/start')}>Take Assessment & Book</Button>
              </div>
          </div>
       )
  }

  // VIEW: FULL REPORT
  if (showReport) {
      return (
        <div className="max-w-3xl mx-auto py-8 px-4">
             <button onClick={() => setShowReport(false)} className="text-slate-400 hover:text-brand-blue flex items-center gap-2 mb-8">
                <ArrowLeft size={18} /> Back to Dashboard
             </button>
             <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <h2 className="font-serif text-2xl font-bold text-slate-800 mb-6">Full Assessment Report</h2>
                <div className="space-y-6">
                    {QUESTIONS.map((q) => {
                        const score = currentUser.answers?.[q.id];
                        return (
                            <div key={q.id} className="border-b border-slate-50 pb-4 last:border-0">
                                <p className="font-medium text-slate-700 mb-2">{q.text}</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-slate-400">Your answer:</span>
                                    <span className="font-bold text-brand-blue">
                                        {score !== undefined ? ANSWER_LABELS[score] : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
             </div>
        </div>
      )
  }

  // VIEW: DASHBOARD
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="font-serif text-3xl font-bold text-slate-800">Hello, {currentUser.name.split(' ')[0]}</h1>

      {/* Booked Session Card */}
      <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-blue-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-4 py-2 rounded-bl-xl">
              CONFIRMED
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Your Upcoming Session
          </h2>

          <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                 {currentUser.bookedDoctorRole === 'Psychologist' ? '👩‍⚕️' : '👨‍⚕️'}
             </div>
             <div className="flex-1">
                 <h3 className="font-bold text-2xl text-slate-900">{currentUser.bookedDoctorName}</h3>
                 <p className="text-brand-blue font-bold uppercase tracking-wider text-sm mb-4">{currentUser.bookedDoctorRole}</p>
                 
                 <div className="grid md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                     <div className="flex items-center gap-3">
                         <Calendar className="text-slate-400" />
                         <div>
                             <p className="text-xs text-slate-500 uppercase font-bold">Date & Time</p>
                             <p className="font-semibold text-slate-800">{currentUser.bookingDate} • {currentUser.bookingTime}</p>
                         </div>
                     </div>
                     <div className="flex items-center gap-3">
                         <DollarSign className="text-slate-400" />
                         <div>
                             <p className="text-xs text-slate-500 uppercase font-bold">Amount Paid</p>
                             <p className="font-semibold text-slate-800">₹{currentUser.amountPaid}</p>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
      </div>

      {/* Progress & Assessment Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 text-xl">Assessment Results</h3>
              <FileText className="text-slate-400" size={20} />
          </div>
          
          <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 font-medium">PHQ-9 Score (Depression)</span>
                      <span className="font-bold text-brand-blue">{currentUser.phq9Score}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full">
                      <div className="bg-brand-blue h-full rounded-full" style={{width: `${Math.min(100, currentUser.phq9Score * 3.7)}%`}}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                      Result: {currentUser.phq9Score >= 20 ? 'Critical' : currentUser.phq9Score >= 15 ? 'Severe' : 'Moderate'}
                  </p>
              </div>

              <div className="flex gap-4">
                  <Button variant="outline" className="text-sm py-2" onClick={() => setShowReport(true)}>View Full Report</Button>
              </div>
          </div>
      </div>
    </div>
  );
};