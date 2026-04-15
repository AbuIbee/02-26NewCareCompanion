// App Component - Main Entry Point
import { AppProvider, useApp, initializeMockData } from '@/store/AppContext';
import LandingPage from '@/pages/common/LandingPage';
import LoginPage from '@/pages/common/LoginPage';
import PatientLayout from '@/pages/patient/PatientLayout';
import PatientCareCoordinatorLayout from '@/pages/caregiver/PatientCareCoordinatorLayout';
import TherapistLayout from '@/pages/therapist/TherapistLayout';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import './App.css';

function AppContent() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    if (state.isAuthenticated && !state.patient) {
      initializeMockData(dispatch);
    }
  }, [state.isAuthenticated, state.patient, dispatch]);

  // Render appropriate view based on auth state and role
  const renderContent = () => {
    if (!state.isAuthenticated) {
      return state.currentView === 'login' ? <LoginPage /> : <LandingPage />;
    }

    switch (state.selectedRole) {
      case 'patient':
        return <PatientLayout />;
      case 'patient_care_coordinator':
        return <PatientCareCoordinatorLayout />;
      case 'therapist':
        return <TherapistLayout />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory">
      {renderContent()}
      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
