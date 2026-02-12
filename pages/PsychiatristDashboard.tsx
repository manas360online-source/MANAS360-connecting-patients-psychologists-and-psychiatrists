import React from 'react';
import { Button } from '../components/Button';
import { IndianRupee, Activity, Calendar, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PsychiatristDashboard: React.FC = () => {
  const { patients, psychiatristWallet, acceptReferral, setCurrentUser } = useApp();
  
  // Filter: Direct bookings to Psych OR Referred patients
  const myPatients = patients.filter(p => 
      (p.bookedDoctorRole === 'Psychiatrist' && p.isBooked) || 
      (p.referralStatus !== 'None')
  );

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-end">
             <div>
                <h1 className="font-serif text-3xl font-bold text-slate-800">Dr. Mahantesh Patil</h1>
                <p className="text-slate-500 mt-2">Psychiatrist • Advanced Clinical Specialist</p>
             </div>
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
                title="Total Income" 
                value={`₹${psychiatristWallet.toLocaleString()}`} 
                subtext="From Sessions" 
                icon={<IndianRupee className="text-green-600" />} 
                color="bg-green-50" 
            />
            <StatCard 
                title="Active Patients" 
                value={myPatients.length} 
                subtext="Total Case Load" 
                icon={<Activity className="text-blue-600" />} 
                color="bg-blue-50" 
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Incoming Cases */}
            <div className="col-span-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-serif font-bold text-xl text-slate-800 mb-6">Incoming Cases</h3>
                
                <div className="space-y-5">
                    {myPatients.length === 0 && (
                        <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                            No pending referrals or direct bookings.
                        </div>
                    )}

                    {myPatients.map(patient => {
                        // Determine State
                        const isPsychiatristBooked = patient.bookedDoctorRole === 'Psychiatrist' && patient.isBooked;
                        const isReferral = patient.referralStatus !== 'None';
                        const isReferralAccepted = patient.referralStatus === 'Accepted';
                        
                        return (
                            <div key={patient.id} className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                                {/* Status Line */}
                                <div className={`absolute left-0 top-6 bottom-6 w-1.5 rounded-r-full ${patient.phq9Score >= 15 ? 'bg-red-500' : 'bg-brand-blue'}`}></div>
                                
                                <div className="pl-5 flex flex-col gap-6">
                                    {/* Top Section: Name, Number, Source */}
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

                                        <div className="flex items-center gap-12 px-2">
                                             <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Patient Number</p>
                                                <p className="font-mono font-bold text-slate-900 text-lg">{patient.phoneNumber || 'N/A'}</p>
                                             </div>
                                             <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Source</p>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 text-lg">
                                                        {isReferral ? 'Dr. Sanky' : 'Direct Booking'}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-500">
                                                        {isReferral ? 'Referred by Psychologist' : 'Patient Portal'}
                                                    </span>
                                                </div>
                                             </div>
                                        </div>
                                    </div>

                                    {/* Bottom Section: Schedule & Actions */}
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                         {/* Date Pill - ONLY shows date if booked */}
                                         <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-slate-200 w-full md:w-auto">
                                             <Calendar size={20} className={isPsychiatristBooked ? "text-brand-blue" : "text-slate-400"} />
                                             <div className="flex flex-col">
                                                 <span className="text-xs font-bold text-slate-500 uppercase leading-none mb-1">
                                                    {isPsychiatristBooked ? 'Appointment' : 'Status'}
                                                 </span>
                                                 <span className="text-base font-bold text-slate-800 leading-none">
                                                    {isPsychiatristBooked 
                                                        ? `${patient.bookingDate}, ${patient.bookingTime}` 
                                                        : (isReferralAccepted ? 'Request Sent' : 'Pending Schedule')
                                                    }
                                                 </span>
                                             </div>
                                         </div>

                                         <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                                             <div className="text-right mr-2">
                                                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">PHQ-9 Score</p>
                                                 <p className={`text-xl font-bold ${patient.phq9Score >= 15 ? 'text-red-600' : 'text-blue-700'}`}>{patient.phq9Score}</p>
                                             </div>

                                             <Button 
                                                variant={isPsychiatristBooked ? "outline" : (isReferralAccepted ? "secondary" : "primary")}
                                                className={`px-8 py-3 h-auto text-base font-bold ${isPsychiatristBooked ? "bg-white border-blue-200" : (isReferralAccepted ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed" : "bg-brand-blue text-white")}`}
                                                onClick={() => {
                                                    // ONE-TIME ACTION: Only if not booked and not already accepted
                                                    if (!isPsychiatristBooked && !isReferralAccepted) {
                                                        acceptReferral(patient.id);
                                                        // Sets the active user so the Patient Dashboard shows this specific patient when visited manually.
                                                        setCurrentUser(patient.id); 
                                                    }
                                                }}
                                                disabled={isReferralAccepted && !isPsychiatristBooked} // Disable if accepted but not booked yet (waiting for patient)
                                             >
                                                 {isPsychiatristBooked ? 'View Session' : (isReferralAccepted ? 'Request Sent' : 'Accept & Request')}
                                             </Button>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
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