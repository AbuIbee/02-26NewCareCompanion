import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { DBCaregiver } from '@/types/supabase-tables';

interface Caregiver extends DBCaregiver {
  patients_count?: number;
  user?: { email: string };
}

interface ProfileUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export function AdminCaregivers() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [allUsers, setAllUsers] = useState<ProfileUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ... rest of your component with proper types

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load current caregivers
    const { data: caregiversData } = await supabase
      .from('caregivers')
      .select('*, user:user_id(email)')
      .order('created_at', { ascending: false });

    // Load all auth users (you'll need a custom function for this)
    const { data: usersData } = await supabase
      .from('profiles') // Assuming you have a profiles table
      .select('*')
      .order('email');

    setCaregivers(caregiversData || []);
    setAllUsers(usersData || []);
    setLoading(false);
  };

  const grantCaregiverAccess = async (userId, email, fullName) => {
    const { error } = await supabase
      .from('caregivers')
      .insert([{
        user_id: userId,
        email: email,
        full_name: fullName
      }]);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      loadData();
    }
  };

  const revokeCaregiverAccess = async (caregiverId) => {
    if (!confirm('Remove caregiver access? This will prevent them from managing patients.')) return;

    const { error } = await supabase
      .from('caregivers')
      .delete()
      .eq('id', caregiverId);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      loadData();
    }
  };

  const filteredUsers = allUsers.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Manage Caregiver Access</h2>
      
      <div className="caregiver-section">
        <h3>Current Caregivers</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Added On</th>
              <th>Patients Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {caregivers.map(c => (
              <tr key={c.id}>
                <td>{c.full_name}</td>
                <td>{c.email}</td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td>{c.patients_count || 0}</td>
                <td>
                  <button 
                    onClick={() => revokeCaregiverAccess(c.id)}
                    className="danger-btn"
                  >
                    Revoke Access
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="user-section">
        <h3>Grant New Caregiver Access</h3>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const isAlreadyCaregiver = caregivers.some(c => c.user_id === user.id);
              return (
                <tr key={user.id}>
                  <td>{user.full_name || 'Not set'}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    {isAlreadyCaregiver ? (
                      <span className="badge success">Caregiver</span>
                    ) : (
                      <span className="badge">User</span>
                    )}
                  </td>
                  <td>
                    {!isAlreadyCaregiver && (
                      <button
                        onClick={() => grantCaregiverAccess(
                          user.id, 
                          user.email, 
                          user.full_name || user.email.split('@')[0]
                        )}
                        className="success-btn"
                      >
                        Grant Caregiver Access
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}