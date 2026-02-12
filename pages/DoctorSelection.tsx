import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Calendar, ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DoctorSelectionProps {
  role: 'Psychologist' | 'Psychiatrist';
}

export const DoctorSelection: React.FC<DoctorSelectionProps> = ({ role }) => {
  const navigate = useNavigate();
  const { currentUserId, patients, confirmBooking } = useApp();
  const [view, setView] = useState<'card' | 'booking' | 'confirm'>('card');
  
  // Date & Time State
  // Using a robust Date object comparison instead of strings to avoid month mismatch bugs
  const [selectedFullDate, setSelectedFullDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isManualTime, setIsManualTime] = useState(false);
  
  // Confirmation State
  const [confirmName, setConfirmName] = useState(patients.find(p => p.id === currentUserId)?.name || '');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Doctor Data Configuration
  const doctor = role === 'Psychologist' ? {
      name: 'Dr. Sanky',
      role: 'Psychologist',
      focus: 'Foundation Therapy, CBT Skills, Weekly Support',
      price: 1499,
      icon: '👩‍⚕️'
  } : {
      name: 'Dr. Mahantesh Totanagouda Patil',
      role: 'Psychiatrist',
      focus: 'Medication Management, Complex Review',
      price: 2499,
      icon: '👨‍⚕️'
  };

  // Generate next 4 days for the "Minimal" view
  // Wrapped in a helper to ensure consistent "Today" reference
  const getMockDates = () => {
    const today = new Date();
    return Array.from({ length: 4 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        return {
            day: d.toLocaleString('en-US', { weekday: 'short' }), // Mon
            date: d.getDate(), // 20
            fullDate: d,
            isToday: i === 0
        };
    });
  };

  const mockDates = getMockDates();
  const times = ['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'];

  const isSameDay = (d1: Date, d2: Date) => {
      return d1.toDateString() === d2.toDateString();
  };

  const handleDateClick = (fullDate: Date) => {
      setSelectedFullDate(fullDate);
  };

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.valueAsDate) {
          setSelectedFullDate(e.target.valueAsDate);
      }
  };

  const getMonthName = (date: Date) => {
      return date.toLocaleString('default', { month: 'long' }).toUpperCase();
  };

  const handlePayment = () => {
     setView('confirm');
  };

  const handleFinalConfirm = () => {
      if (!confirmName || !confirmPhone) return;
      
      const dateString = selectedFullDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      
      confirmBooking(
          currentUserId, 
          doctor.name, 
          role, 
          dateString, 
          selectedTime || '10:00 AM', 
          doctor.price, 
          confirmPhone
      );
      
      setShowSuccessPopup(true);
  };

  const handlePopupClose = () => {
      setShowSuccessPopup(false);
      navigate('/patient');
  };

  // Check if the currently selected date is one of the 4 mock dates
  const isCustomDate = !mockDates.some(d => isSameDay(d.fullDate, selectedFullDate));

  // Common container style for "Bigger Card Box"
  const containerClass = "w-full max-w-lg bg-white p-10 rounded-[2.5rem] shadow-2xl border border-blue-50";

  // VIEW 1: DOCTOR CARD
  if (view === 'card') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
              <div className={`${containerClass} text-center`}>
                  <div className="w-28 h-28 bg-blue-100 rounded-full mx-auto mb-8 flex items-center justify-center text-5xl shadow-inner">
                      {doctor.icon}
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-slate-800 mb-3">{doctor.name}</h2>
                  <p className="text-brand-blue font-bold uppercase tracking-wider text-sm mb-6">{doctor.role}</p>
                  <div className="bg-slate-50 p-6 rounded-2xl mb-10">
                      <p className="text-slate-600 text-base leading-relaxed">Focus: {doctor.focus}</p>
                  </div>
                  <Button fullWidth onClick={() => setView('booking')} className="text-lg py-4">
                      Book Session
                  </Button>
              </div>
          </div>
      );
  }

  // VIEW 2: BOOKING CALENDAR
  if (view === 'booking') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
              <div className={containerClass}>
                   <button onClick={() => setView('card')} className="text-slate-400 hover:text-brand-blue flex items-center gap-2 mb-6">
                        <ArrowLeft size={18} /> Back
                   </button>
                   
                   <h2 className="font-serif text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                       <Calendar className="text-brand-blue" size={28} />
                       Select Slot
                   </h2>

                   {/* Date Section */}
                   <div className="mb-8">
                       <div className="flex justify-between items-center mb-4">
                           <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                               {getMonthName(selectedFullDate)}
                           </p>
                           
                           {/* Manual Date Picker Trigger: Using Overlay for Security/Cross-Browser Compatibility */}
                           <div className="relative">
                               <div className="text-brand-blue hover:bg-blue-50 p-2 rounded-full transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer">
                                   <span>Full Month</span>
                                   <Calendar size={18} />
                               </div>
                               <input 
                                   type="date" 
                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                   onChange={handleManualDateChange}
                                   title="Select Date"
                               />
                           </div>
                       </div>

                       <div className="flex justify-between gap-3 overflow-x-auto pb-2 scrollbar-hide">
                           {mockDates.map((d, i) => {
                               const selected = isSameDay(d.fullDate, selectedFullDate);
                               return (
                                   <button 
                                    key={i}
                                    onClick={() => handleDateClick(d.fullDate)}
                                    className={`min-w-[4.5rem] flex-1 p-4 rounded-2xl flex flex-col items-center transition-all border ${
                                        selected
                                        ? 'bg-brand-blue text-white shadow-xl shadow-blue-200 scale-105 border-brand-blue' 
                                        : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:bg-blue-50'
                                    }`}
                                   >
                                       <span className={`text-xs font-medium mb-1 ${selected ? 'text-blue-100' : 'text-slate-400'}`}>{d.day}</span>
                                       <span className="text-xl font-bold">{d.date}</span>
                                       {d.isToday && !selected && (
                                           <span className="w-1.5 h-1.5 bg-brand-blue rounded-full mt-1"></span>
                                       )}
                                   </button>
                               );
                           })}
                           
                           {/* Visual cue for custom selected date */}
                           {isCustomDate && (
                               <button 
                                className="min-w-[4.5rem] flex-1 p-4 rounded-2xl flex flex-col items-center bg-brand-blue text-white shadow-xl shadow-blue-200 scale-105 border border-brand-blue"
                               >
                                    <span className="text-xs font-medium text-blue-100">{selectedFullDate.toLocaleString('en-US', { weekday: 'short' })}</span>
                                    <span className="text-xl font-bold">{selectedFullDate.getDate()}</span>
                               </button>
                           )}
                       </div>
                   </div>

                   {/* Time Section */}
                   <div className="mb-10">
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Available Times</p>
                       
                       {!isManualTime ? (
                           <div className="grid grid-cols-2 gap-4">
                               {times.map((t, i) => (
                                   <button 
                                    key={i}
                                    onClick={() => setSelectedTime(t)}
                                    className={`p-4 rounded-xl text-sm font-medium border-2 transition-all ${
                                        t === selectedTime 
                                        ? 'border-brand-blue text-brand-blue bg-blue-50' 
                                        : 'border-slate-100 text-slate-600 hover:border-blue-200'
                                    }`}
                                   >
                                       {t}
                                   </button>
                               ))}
                           </div>
                       ) : (
                           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Time</label>
                               <input 
                                   type="time" 
                                   className="w-full p-3 rounded-xl border border-slate-200 focus:border-brand-blue outline-none text-lg font-bold text-slate-800"
                                   onChange={(e) => {
                                       // Format to AM/PM for consistency
                                       if (!e.target.value) return;
                                       const [hours, minutes] = e.target.value.split(':');
                                       const h = parseInt(hours);
                                       const ampm = h >= 12 ? 'PM' : 'AM';
                                       const h12 = h % 12 || 12;
                                       setSelectedTime(`${h12}:${minutes} ${ampm}`);
                                   }}
                               />
                           </div>
                       )}

                       {/* Toggle Manual Time */}
                       <button 
                           onClick={() => { setIsManualTime(!isManualTime); setSelectedTime(null); }}
                           className="mt-4 text-sm text-brand-blue font-medium flex items-center gap-1 hover:underline"
                       >
                           {isManualTime ? 'Back to slots' : 'Set time manually'} <ChevronRight size={14} />
                       </button>
                   </div>

                   <Button fullWidth onClick={handlePayment} disabled={!selectedTime} className="text-lg py-4 shadow-xl shadow-blue-200">
                       Pay ₹{doctor.price} & Continue
                   </Button>
              </div>
          </div>
      )
  }

  // VIEW 3: CONFIRM DETAILS
  if (view === 'confirm') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center px-4 relative py-8">
              <div className={containerClass}>
                  <h2 className="font-serif text-3xl font-bold text-slate-800 mb-8">Confirm Details</h2>
                  
                  <div className="space-y-6 mb-10">
                      <div>
                          <label className="block text-sm font-bold text-slate-500 mb-2">Full Name</label>
                          <input 
                            type="text" 
                            className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-blue text-lg"
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-slate-500 mb-2">Phone Number</label>
                          <input 
                            type="tel" 
                            placeholder="+91 99999 99999"
                            className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-blue text-lg"
                            value={confirmPhone}
                            onChange={(e) => setConfirmPhone(e.target.value)}
                          />
                      </div>
                  </div>

                  <Button fullWidth onClick={handleFinalConfirm} disabled={!confirmName || !confirmPhone} className="text-lg py-4 shadow-xl shadow-blue-200">
                      Done
                  </Button>
              </div>

              {/* SUCCESS POPUP */}
              {showSuccessPopup && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                      <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl animate-in zoom-in duration-200">
                          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                              <CheckCircle size={40} />
                          </div>
                          <h3 className="font-serif text-2xl font-bold text-slate-800 mb-3">Booking Successful</h3>
                          <p className="text-slate-500 mb-8">Session confirmed with {doctor.name}.</p>
                          <Button fullWidth onClick={handlePopupClose} className="text-lg">OK</Button>
                      </div>
                  </div>
              )}
          </div>
      )
  }

  return null;
};