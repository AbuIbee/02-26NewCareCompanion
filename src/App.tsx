// App Component - Main Entry Point
import { AppProvider, useApp, initializeMockData } from '@/store/AppContext';
import LandingPage from '@/pages/common/LandingPage';
import LoginPage from '@/pages/common/LoginPage';
import PatientLayout from '@/pages/patient/PatientLayout';
import CaregiverLayout from '@/pages/caregiver/CaregiverLayout';
import TherapistLayout from '@/pages/therapist/TherapistLayout';
import AdminLayout from '@/pages/admin/AdminLayout';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import './App.css';

function AppContent() {
  const { state, dispatch } = useApp();
  // 👇 ADD THIS LINE - Loading state for auth initialization
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Add a helper to check if current user is admin
  const isAdmin = () => {
    const adminEmails = ['msolodeen@gmail.com'];
    return state.currentUser?.email && adminEmails.includes(state.currentUser.email);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 1️⃣ Restore existing session from localStorage
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          dispatch({ type: 'SET_USER', payload: session.user });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        }

        // 2️⃣ Listen for login/logout changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            dispatch({ type: 'SET_USER', payload: session.user });
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
          } else {
            dispatch({ type: 'SET_USER', payload: null });
            dispatch({ type: 'SET_AUTHENTICATED', payload: false });
          }
        });

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe();
      } finally {
        // 👇 ADD THIS LINE - Auth initialization complete
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (state.isAuthenticated && !state.patient) {
      initializeMockData(dispatch);
    }
  }, [state.isAuthenticated, state.patient, dispatch]);

  // 👇 ADD THIS SECTION - Show loading spinner while auth initializes
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-warm-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-warm-bronze border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal text-lg">Loading CareCompanion...</p>
          <p className="text-medium-gray text-sm mt-2">Preparing your care dashboard</p>
        </div>
      </div>
    );
  }

  // Render appropriate view based on auth state and role
  const renderContent = () => {
    if (!state.isAuthenticated) {
      return state.currentView === 'login' ? <LoginPage /> : <LandingPage />;
    }

    // Admin check - this overrides other roles for admins
    if (isAdmin() && window.location.pathname.startsWith('/admin')) {
      return <AdminLayout />;
    }

    switch (state.selectedRole) {
      case 'patient':
        return <PatientLayout />;
      case 'caregiver':
        return <CaregiverLayout />;
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