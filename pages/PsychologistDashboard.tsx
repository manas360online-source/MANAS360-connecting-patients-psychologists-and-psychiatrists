import React, { useState } from 'react';
import { Patient } from '../types';
import { Button } from '../components/Button';
import { Activity, TrendingUp, IndianRupee, Check, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';

export const PsychologistDashboard: React.FC = () => {
  const { patients, setReferral, psychologistWallet, referralWallet } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [referralSuccess, setReferralSuccess] = useState(false);

  // Filter patients assigned to Dr. Sanky (Psychologist)
  const myPatients = patients.filter(p => p.assignedPsychologistId === 'psy1');

  // Filter active patients (exclude those who have been referred)
  const activePatientsCount = myPatients.filter(p => p.referralStatus === 'None').length;

  // Sort: Referred/Critical first
  const sortedPatients = [...myPatients].sort((a, b) => b.phq9Score - a.phq9Score);

  // Chart Data
  const REVENUE_DATA = [
    { name: 'Therapy', amount: psychologistWallet },
    { name: 'Referrals', amount: referralWallet },
  ];

  const [referralReason, setReferralReason] = useState({
    medsNeeded: false,
    notImproving: false,
    biological: false,
  });

  const handleReferralSubmit = () => {
    if (selectedPatient) {
        const reasons = [
            referralReason.medsNeeded ? 'Meds Needed' : '',
            referralReason.notImproving ? 'Not Improving' : '',
            referralReason.biological ? 'Biological Factors' : ''
        ].filter(Boolean).join(', ');

        setReferral(selectedPatient.id, reasons);
        
        setReferralModalOpen(false);
        setReferralSuccess(true);
        setTimeout(() => setReferralSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
          <div>
            <h1 className="font-serif text-3xl font-bold text-slate-800">Dr. Sanky</h1>
            <p className="text-slate-500 mt-2">Psychologist</p>
          </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Total Income" 
            value={`₹${psychologistWallet.toLocaleString()}`} 
            subtext="From Sessions (₹1499/ea)" 
            icon={<IndianRupee className="text-green-600" />} 
            color="bg-green-50" 
        />
        <StatCard 
            title="Referral Wallet" 
            value={`₹${referralWallet.toLocaleString()}`} 
            subtext="Bonuses Earned" 
            icon={<TrendingUp className="text-purple-600" />} 
            color="bg-purple-50" 
        />
         <StatCard 
            title="Active Patients" 
            value={activePatientsCount} 
            subtext="Total Case Load" 
            icon={<Activity className="text-blue-600" />} 
            color="bg-blue-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-serif font-bold text-xl text-slate-800 mb-6">Patient Priority List</h2>
            <div className="space-y-5">
                {sortedPatients.length === 0 && (
                    <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                        No active patients booked yet.
                    </div>
                )}
                {sortedPatients.map(patient => (
                    <div key={patient.id} className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                        {/* Status Line */}
                        <div className={`absolute left-0 top-6 bottom-6 w-1.5 rounded-r-full ${patient.phq9Score >= 15 ? 'bg-red-500' : 'bg-brand-blue'}`}></div>
                        
                        <div className="pl-5 flex flex-col gap-6">
                            {/* Top Section: Details Side-by-Side */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md ${patient.phq9Score >= 15 ? 'bg-red-500' : 'bg-brand-blue'}`}>
                                        {patient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Patient Name</p>
                                        <h4 className="font-serif font-bold text-slate-900 text-2xl leading-tight">{patient.name}</h4>
                                    </div>
                                </div>

                                <div className="flex items-center gap-10 px-2">
                                     <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Patient Number</p>
                                        <p className="font-mono font-bold text-slate-900 text-lg">{patient.phoneNumber || 'N/A'}</p>
                                     </div>
                                </div>
                            </div>

                            {/* Bottom Section: Date & Actions */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                 {/* Date Pill */}
                                 <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-slate-200 w-full md:w-auto">
                                     <Calendar size={20} className="text-brand-blue" />
                                     <div className="flex flex-col">
                                         <span className="text-xs font-bold text-slate-500 uppercase leading-none mb-1">Appointment</span>
                                         <span className="text-base font-bold text-slate-800 leading-none">
                                            {patient.bookingDate ? `${patient.bookingDate}, ${new Date().getFullYear()}` : 'Not Scheduled'}
                                         </span>
                                     </div>
                                 </div>

                                 <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                                     <div className="text-right mr-2">
                                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">PHQ-9 Score</p>
                                         <p className={`text-xl font-bold ${patient.phq9Score >= 15 ? 'text-red-600' : 'text-blue-700'}`}>{patient.phq9Score}</p>
                                     </div>

                                     {patient.referralStatus !== 'None' ? (
                                         <span className="px-5 py-2.5 bg-purple-50 text-purple-700 text-sm font-bold rounded-xl border border-purple-100 flex items-center gap-2">
                                            <Check size={18} /> Referred
                                         </span>
                                     ) : (
                                        <Button 
                                            variant="outline" 
                                            className="px-8 py-3 h-auto text-base bg-white hover:bg-brand-blue hover:text-white border-blue-200 font-bold"
                                            onClick={() => { setSelectedPatient(patient); setReferralModalOpen(true); }}
                                        >
                                            Refer
                                        </Button>
                                     )}
                                 </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <h2 className="font-serif font-bold text-xl text-slate-800 mb-6">Income Sources</h2>
            <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REVENUE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Referral Modal */}
      {referralModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="font-serif font-bold text-2xl text-slate-800">Refer to Psychiatrist</h3>
                        <p className="text-slate-500">Patient: {selectedPatient.name}</p>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        ₹100 Bonus Eligible
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <p className="font-semibold text-slate-700 text-sm">Reason for referral:</p>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-blue-50">
                        <input type="checkbox" className="w-5 h-5 rounded text-brand-blue" checked={referralReason.medsNeeded} onChange={e => setReferralReason({...referralReason, medsNeeded: e.target.checked})} />
                        <span className="text-slate-700">Medication evaluation needed</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-blue-50">
                        <input type="checkbox" className="w-5 h-5 rounded text-brand-blue" checked={referralReason.notImproving} onChange={e => setReferralReason({...referralReason, notImproving: e.target.checked})} />
                        <span className="text-slate-700">Symptoms not improving</span>
                    </label>
                     <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-blue-50">
                        <input type="checkbox" className="w-5 h-5 rounded text-brand-blue" checked={referralReason.biological} onChange={e => setReferralReason({...referralReason, biological: e.target.checked})} />
                        <span className="text-slate-700">Biological factors suspected</span>
                    </label>
                </div>

                <div className="flex gap-3">
                    <Button variant="secondary" fullWidth onClick={() => setReferralModalOpen(false)}>Cancel</Button>
                    <Button fullWidth onClick={handleReferralSubmit}>Send Referral</Button>
                </div>
            </div>
        </div>
      )}

      {/* Success Notification */}
      {referralSuccess && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce">
              <Check className="w-6 h-6" />
              <div>
                  <p className="font-bold">Referral Sent!</p>
                  <p className="text-xs opacity-90">₹100 added to wallet.</p>
              </div>
          </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, subtext, icon, color }: any) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start justify-between">
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            <p className="text-xs text-slate-400 mt-1">{subtext}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            {icon}
        </div>
    </div>
);