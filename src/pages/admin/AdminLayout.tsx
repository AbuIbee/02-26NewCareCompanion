import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminCaregivers } from './AdminCaregivers';
import { AdminPatients } from './AdminPatients';
import { AdminAudit } from './AdminAudit';

export default function AdminLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentAdminView, setCurrentAdminView] = useState('caregivers');

  useEffect(() => {
    checkAdminStatus();
  }, []);

  // Check URL on load for direct navigation
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/admin/caregivers')) setCurrentAdminView('caregivers');
    else if (path.includes('/admin/patients')) setCurrentAdminView('patients');
    else if (path.includes('/admin/audit')) setCurrentAdminView('audit');
    else setCurrentAdminView('caregivers');
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/admin/caregivers')) setCurrentAdminView('caregivers');
      else if (path.includes('/admin/patients')) setCurrentAdminView('patients');
      else if (path.includes('/admin/audit')) setCurrentAdminView('audit');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/login';
        return;
      }

      // Check if user has admin role in profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile?.role === 'admin') {
        setIsAdmin(true);
      } else {
        window.location.href = '/unauthorized';
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  // Simple navigation without router
  const navigateTo = (view: string) => {
    setCurrentAdminView(view);
    window.history.pushState({}, '', `/admin/${view}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Unauthorized - Admin access only</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-warm-bronze">CareCompanion Admin</h1>
            
            <div className="flex space-x-2">
              <button
                onClick={() => navigateTo('caregivers')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentAdminView === 'caregivers'
                    ? 'bg-warm-bronze text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Manage Caregivers
              </button>
              
              <button
                onClick={() => navigateTo('patients')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentAdminView === 'patients'
                    ? 'bg-warm-bronze text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Patients
              </button>
              
              <button
                onClick={() => navigateTo('audit')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentAdminView === 'audit'
                    ? 'bg-warm-bronze text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Audit Log
              </button>
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                supabase.auth.signOut();
                window.location.href = '/';
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentAdminView === 'caregivers' && <AdminCaregivers />}
        {currentAdminView === 'patients' && <AdminPatients />}
        {currentAdminView === 'audit' && <AdminAudit />}
      </main>
    </div>
  );
}