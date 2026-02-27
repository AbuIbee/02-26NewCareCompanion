import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PatientWithDetails {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  preferred_name: string | null;
  email: string;
  diagnosis: string | null;
  dementia_stage: string | null;
  date_of_birth: string | null;
  created_at: string;
  caregiver?: {
    id: string;
    full_name: string;
    email: string;
  };
}

interface CaregiverOption {
  id: string;
  full_name: string;
  email: string;
}

export function AdminPatients() {
  const [patients, setPatients] = useState<PatientWithDetails[]>([]);
  const [caregivers, setCaregivers] = useState<CaregiverOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load all patients with their profile data and caregiver relationships
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select(`
          id,
          preferred_name,
          diagnosis,
          dementia_stage,
          date_of_birth,
          created_at,
          profiles!inner(
            email,
            first_name,
            last_name
          ),
          caregiver_patients(
            caregiver:profiles!caregiver_patients_caregiver_id_fkey(
              id,
              first_name,
              last_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (patientsError) throw patientsError;

      // Format patients data
      const formattedPatients = (patientsData || []).map(p => ({
        id: p.id,
        first_name: p.profiles.first_name,
        last_name: p.profiles.last_name,
        full_name: `${p.profiles.first_name} ${p.profiles.last_name}`,
        email: p.profiles.email,
        preferred_name: p.preferred_name,
        diagnosis: p.diagnosis,
        dementia_stage: p.dementia_stage,
        date_of_birth: p.date_of_birth,
        created_at: p.created_at,
        caregiver: p.caregiver_patients?.[0]?.caregiver ? {
          id: p.caregiver_patients[0].caregiver.id,
          full_name: `${p.caregiver_patients[0].caregiver.first_name} ${p.caregiver_patients[0].caregiver.last_name}`,
          email: p.caregiver_patients[0].caregiver.email
        } : undefined
      }));

      // Load all caregivers (profiles with role = 'caregiver')
      const { data: caregiversData, error: caregiversError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'caregiver')
        .order('last_name');

      if (caregiversError) throw caregiversError;

      const formattedCaregivers = (caregiversData || []).map(c => ({
        id: c.id,
        full_name: `${c.first_name} ${c.last_name}`,
        email: c.email
      }));

      setPatients(formattedPatients);
      setCaregivers(formattedCaregivers);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const reassignPatient = async (patientId: string, newCaregiverId: string) => {
    try {
      // Check if there's an existing caregiver_patients record
      const { data: existing } = await supabase
        .from('caregiver_patients')
        .select('id')
        .eq('patient_id', patientId)
        .maybeSingle();

      if (existing) {
        // Update existing relationship
        const { error } = await supabase
          .from('caregiver_patients')
          .update({ caregiver_id: newCaregiverId })
          .eq('patient_id', patientId);

        if (error) throw error;
      } else if (newCaregiverId) {
        // Create new relationship
        const { error } = await supabase
          .from('caregiver_patients')
          .insert({
            caregiver_id: newCaregiverId,
            patient_id: patientId,
            is_primary: true
          });

        if (error) throw error;
      }

      // Reload data
      await loadData();
    } catch (error: any) {
      alert('Error reassigning patient: ' + error.message);
    }
  };

  const deletePatient = async (patientId: string) => {
    if (!confirm('Permanently delete this patient and all their data? This action cannot be undone.')) return;

    try {
      // Delete profile (cascades to patients and all related tables)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', patientId);

      if (error) throw error;
      
      // Reload data
      await loadData();
    } catch (error: any) {
      alert('Error deleting patient: ' + error.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-charcoal">All Patients (System Wide)</h2>
      
      <div className="bg-white rounded-xl shadow-soft p-6 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-soft-taupe/20">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Patient</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Preferred Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Stage</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Assigned Caregiver</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Created</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-charcoal">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-soft-taupe/30">
            {patients.map(patient => (
              <tr key={patient.id} className="hover:bg-soft-taupe/10">
                <td className="px-4 py-3">
                  <div className="font-medium text-charcoal">{patient.full_name}</div>
                </td>
                <td className="px-4 py-3 text-medium-gray">{patient.email}</td>
                <td className="px-4 py-3 text-medium-gray">{patient.preferred_name || '-'}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-soft-taupe/20 rounded-full text-xs capitalize">
                    {patient.dementia_stage || 'Unknown'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={patient.caregiver?.id || ''}
                    onChange={(e) => reassignPatient(patient.id, e.target.value)}
                    className="px-2 py-1 border border-soft-taupe rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warm-bronze"
                  >
                    <option value="">Unassigned</option>
                    {caregivers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.full_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-medium-gray text-sm">
                  {new Date(patient.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => deletePatient(patient.id)}
                    className="px-3 py-1 bg-gentle-coral/10 text-gentle-coral rounded-lg hover:bg-gentle-coral/20 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {patients.length === 0 && (
          <p className="text-center text-medium-gray py-8">No patients found</p>
        )}
      </div>
    </div>
  );
}