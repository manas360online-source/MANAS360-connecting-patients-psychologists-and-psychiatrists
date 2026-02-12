import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Assessment } from './pages/Assessment';
import { PsychologistDashboard } from './pages/PsychologistDashboard';
import { PsychiatristDashboard } from './pages/PsychiatristDashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorSelection } from './pages/DoctorSelection';
import { CrisisSupport } from './pages/CrisisSupport';
import { AppProvider } from './context/AppContext';

const App: React.FC = () => {
  return (
    <AppProvider>
        <Router>
        <Layout>
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/assessment/start" element={<Assessment />} />
            
            {/* Booking Flows */}
            <Route path="/select-psychologist" element={<DoctorSelection role="Psychologist" />} />
            <Route path="/select-psychiatrist" element={<DoctorSelection role="Psychiatrist" />} />
            <Route path="/crisis-support" element={<CrisisSupport />} />

            {/* Dashboards */}
            <Route path="/psychologist" element={<PsychologistDashboard />} />
            <Route path="/psychiatrist" element={<PsychiatristDashboard />} />
            <Route path="/patient" element={<PatientDashboard />} />
            </Routes>
        </Layout>
        </Router>
    </AppProvider>
  );
};

export default App;