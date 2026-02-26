import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { DBPatient, DBCaregiver } from '@/types/supabase-tables';

interface Patient extends DBPatient {
  caregiver?: { full_name: string; email: string };
}

export function AdminPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [caregivers, setCaregivers] = useState<DBCaregiver[]>([]);
  const [loading, setLoading] = useState(true);

  // ... rest of your component

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load all patients with their caregivers
    const { data: patientsData } = await supabase
      .from('patients')
      .select('*, caregiver:caregiver_id(full_name, email)')
      .order('created_at', { ascending: false });

    // Load all caregivers for assignment
    const { data: caregiversData } = await supabase
      .from('caregivers')
      .select('*')
      .order('full_name');

    setPatients(patientsData || []);
    setCaregivers(caregiversData || []);
    setLoading(false);
  };

  const reassignPatient = async (patientId, newCaregiverId) => {
    const { error } = await supabase
      .from('patients')
      .update({ caregiver_id: newCaregiverId })
      .eq('id', patientId);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      loadData();
    }
  };

  const deletePatient = async (patientId) => {
    if (!confirm('Permanently delete this patient and all their data?')) return;

    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', patientId);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      loadData();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>All Patients (System Wide)</h2>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Assigned Caregiver</th>
            <th>Created</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>
                <select
                  value={patient.caregiver_id || ''}
                  onChange={(e) => reassignPatient(patient.id, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {caregivers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.email})
                    </option>
                  ))}
                </select>
              </td>
              <td>{new Date(patient.created_at).toLocaleDateString()}</td>
              <td>{patient.status || 'Active'}</td>
              <td>
                <button 
                  onClick={() => deletePatient(patient.id)}
                  className="danger-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}