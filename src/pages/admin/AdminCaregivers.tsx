import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface CaregiverProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  created_at: string;
  patients_count: number;
}

interface ProfileUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  created_at: string;
}

export function AdminCaregivers() {
  const [caregivers, setCaregivers] = useState<CaregiverProfile[]>([]);
  const [allUsers, setAllUsers] = useState<ProfileUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load current caregivers (profiles with role = 'caregiver')
      const { data: caregiversData, error: caregiversError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          created_at,
          patients_count:caregiver_patients(count)
        `)
        .eq('role', 'caregiver')
        .order('created_at', { ascending: false });

      if (caregiversError) throw caregiversError;

      // Format caregivers with full_name and patient count
      const formattedCaregivers = (caregiversData || []).map(c => ({
        ...c,
        full_name: `${c.first_name} ${c.last_name}`,
        patients_count: c.patients_count?.[0]?.count || 0
      }));

      // Load all non-caregiver users for granting access
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role, created_at')
        .neq('role', 'caregiver')
        .order('email');

      if (usersError) throw usersError;

      const formattedUsers = (usersData || []).map(u => ({
        ...u,
        full_name: `${u.first_name} ${u.last_name}`
      }));

      setCaregivers(formattedCaregivers);
      setAllUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const grantCaregiverAccess = async (userId: string, email: string, fullName: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'caregiver' })
        .eq('id', userId);

      if (error) throw error;
      
      // Reload data
      await loadData();
    } catch (error: any) {
      alert('Error granting caregiver access: ' + error.message);
    }
  };

  const revokeCaregiverAccess = async (userId: string) => {
    if (!confirm('Remove caregiver access? This will change their role to patient.')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'patient' })
        .eq('id', userId);

      if (error) throw error;
      
      // Reload data
      await loadData();
    } catch (error: any) {
      alert('Error revoking caregiver access: ' + error.message);
    }
  };

  const filteredUsers = allUsers.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-4">Manage Caregiver Access</h2>
      </div>
      
      {/* Current Caregivers Section */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h3 className="text-lg font-semibold text-charcoal mb-4">Current Caregivers</h3>
        
        {caregivers.length === 0 ? (
          <p className="text-medium-gray text-center py-8">No caregivers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-soft-taupe/20">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Added On</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Patients</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-taupe/30">
                {caregivers.map(c => (
                  <tr key={c.id} className="hover:bg-soft-taupe/10">
                    <td className="px-4 py-3 text-charcoal">{c.full_name}</td>
                    <td className="px-4 py-3 text-medium-gray">{c.email}</td>
                    <td className="px-4 py-3 text-medium-gray">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-medium-gray">{c.patients_count}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => revokeCaregiverAccess(c.id)}
                        className="px-3 py-1 bg-gentle-coral/10 text-gentle-coral rounded-lg hover:bg-gentle-coral/20 transition-colors text-sm"
                      >
                        Revoke Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grant New Caregiver Access Section */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <h3 className="text-lg font-semibold text-charcoal mb-4">Grant New Caregiver Access</h3>
        
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-soft-taupe rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-warm-bronze"
        />

        {filteredUsers.length === 0 ? (
          <p className="text-medium-gray text-center py-8">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-soft-taupe/20">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Current Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Joined</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-taupe/30">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-soft-taupe/10">
                    <td className="px-4 py-3 text-charcoal">{user.full_name}</td>
                    <td className="px-4 py-3 text-medium-gray">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-soft-taupe/20 rounded-full text-xs capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-medium-gray">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => grantCaregiverAccess(
                          user.id, 
                          user.email, 
                          user.full_name
                        )}
                        className="px-3 py-1 bg-soft-sage/20 text-soft-sage rounded-lg hover:bg-soft-sage/30 transition-colors text-sm"
                      >
                        Grant Caregiver Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}