import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, Brain, Stethoscope, User, LogOut } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === '/';
  const isAssessment = location.pathname.includes('/assessment');
  // Hiding sidebar for booking flows and crisis support as requested
  const isBooking = location.pathname.includes('/select-');
  const isCrisis = location.pathname.includes('/crisis-support');

  if (isLanding || isAssessment || isBooking || isCrisis) {
    return <main className="min-h-screen bg-brand-light font-sans text-brand-text">{children}</main>;
  }

  // Dashboard Navigation
  return (
    <div className="min-h-screen bg-brand-light flex font-sans text-brand-text">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-blue-100 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-blue-50">
          <div className="flex items-center gap-2 text-brand-blue">
            <Heart className="fill-current" />
            <span className="font-serif font-bold text-xl tracking-tight">MANAS360</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            to="/psychologist" 
            icon={<Brain size={20} />} 
            label="Psychologist View" 
            active={location.pathname.startsWith('/psychologist')}
            onClick={() => navigate('/psychologist')}
          />
          <NavItem 
            to="/psychiatrist" 
            icon={<Stethoscope size={20} />} 
            label="Psychiatrist View" 
            active={location.pathname.startsWith('/psychiatrist')}
            onClick={() => navigate('/psychiatrist')}
          />
          <NavItem 
            to="/patient" 
            icon={<User size={20} />} 
            label="Patient View" 
            active={location.pathname.startsWith('/patient')}
            onClick={() => navigate('/patient')}
          />
        </nav>

        <div className="p-4 border-t border-blue-50">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-brand-blue text-white shadow-md' 
        : 'text-slate-600 hover:bg-blue-50'
    }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);