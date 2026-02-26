import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { useSelectedPatient } from '@/hooks/useSelectedPatient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pill, Clock, CheckCircle2, XCircle, Upload, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { Medication } from '@/types';

export default function CaregiverMedications() {
  const { state, dispatch } = useApp();
  const selectedPatient = useSelectedPatient();
  
  // Use selected patient data or fallback to legacy state
  const medications = selectedPatient?.medications || state.medications;
  const medicationLogs = selectedPatient?.medicationLogs || state.medicationLogs;
  const patient = selectedPatient?.patient || state.patient;
  const dashboardStats = selectedPatient?.dashboardStats || state.dashboardStats;
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleLogMedication = (medicationId: string, status: 'taken' | 'missed') => {
    const medication = medications.find(m => m.id === medicationId);
    if (medication && patient) {
      const newLog = {
        id: `ml${Date.now()}`,
        medicationId,
        patientId: patient.id,
        medicationName: `${medication.name} ${medication.dosage}`,
        scheduledTime: medication.schedule[0]?.time || '',
        takenTime: status === 'taken' ? new Date().toISOString() : undefined,
        status,
        recordedBy: state.currentUser?.firstName || 'Caregiver',
        date: new Date().toISOString().split('T')[0],
      };
      dispatch({ type: 'ADD_MEDICATION_LOG', payload: newLog });
      toast.success(`Medication marked as ${status}`);
    }
  };

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-soft-taupe/30 rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-medium-gray" />
        </div>
        <h2 className="text-xl font-semibold text-charcoal mb-2">No Patient Selected</h2>
        <p className="text-medium-gray text-center max-w-md">
          Please select a patient from the dropdown above to view their medications.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-1">Medications</h2>
          <p className="text-medium-gray">Manage medications and track adherence</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </motion.div>

      {/* Today's Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-0 shadow-soft bg-gradient-to-r from-warm-bronze/10 to-calm-blue/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-gray mb-1">Today&apos;s Adherence</p>
                <p className="text-3xl font-bold text-charcoal">
                  {dashboardStats?.medicationsAdherenceRate || 0}%
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-soft-sage">
                    {medicationLogs.filter(l => l.status === 'taken' && l.date === new Date().toISOString().split('T')[0]).length}
                  </p>
                  <p className="text-xs text-medium-gray">Taken</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gentle-coral">
                    {medicationLogs.filter(l => l.status === 'missed' && l.date === new Date().toISOString().split('T')[0]).length}
                  </p>
                  <p className="text-xs text-medium-gray">Missed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warm-amber">
                    {medicationLogs.filter(l => l.status === 'pending').length}
                  </p>
                  <p className="text-xs text-medium-gray">Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Medication List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid gap-4"
      >
        {medications.map((medication, index) => (
          <motion.div
            key={medication.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="border-0 shadow-soft hover:shadow-card transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-calm-blue/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Pill className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-charcoal text-lg">{medication.name}</h3>
                        <p className="text-sm text-medium-gray">{medication.dosage} • {medication.form}</p>
                      </div>
                      <Badge variant={medication.isActive ? 'default' : 'secondary'} className={medication.isActive ? 'bg-soft-sage' : ''}>
                        {medication.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-charcoal mt-2">{medication.instructions}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-medium-gray">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{medication.schedule.map(s => s.time).join(', ')}</span>
                      </div>
                      <span>Prescribed by {medication.prescribedBy}</span>
                    </div>
                    {medication.sideEffects.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {medication.sideEffects.map((effect) => (
                          <span key={effect} className="text-xs bg-gentle-coral/10 text-gentle-coral px-2 py-1 rounded-full">
                            {effect}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-soft-taupe">
                  <Button
                    size="sm"
                    onClick={() => handleLogMedication(medication.id, 'taken')}
                    className="bg-soft-sage hover:bg-green-600 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Mark Taken
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLogMedication(medication.id, 'missed')}
                    className="border-gentle-coral text-gentle-coral hover:bg-gentle-coral hover:text-white"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Mark Missed
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedMedication(medication);
                      setShowDetailsDialog(true);
                    }}
                    className="ml-auto"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Medication Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-charcoal">
              {selectedMedication?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedMedication && (
            <div className="space-y-4">
              <div>
                <Label className="text-medium-gray">Dosage</Label>
                <p className="text-charcoal font-medium">{selectedMedication.dosage}</p>
              </div>
              <div>
                <Label className="text-medium-gray">Form</Label>
                <p className="text-charcoal font-medium capitalize">{selectedMedication.form}</p>
              </div>
              <div>
                <Label className="text-medium-gray">Instructions</Label>
                <p className="text-charcoal">{selectedMedication.instructions}</p>
              </div>
              <div>
                <Label className="text-medium-gray">Prescribed By</Label>
                <p className="text-charcoal">{selectedMedication.prescribedBy}</p>
              </div>
              <div>
                <Label className="text-medium-gray">Schedule</Label>
                <p className="text-charcoal">{selectedMedication.schedule.map(s => s.time).join(', ')}</p>
              </div>
              {selectedMedication.sideEffects.length > 0 && (
                <div>
                  <Label className="text-medium-gray">Side Effects</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedMedication.sideEffects.map((effect) => (
                      <span key={effect} className="text-xs bg-gentle-coral/10 text-gentle-coral px-2 py-1 rounded-full">
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Medication Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-charcoal">Add New Medication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Medication Name</Label>
              <Input placeholder="e.g., Donepezil" className="rounded-xl" />
            </div>
            <div>
              <Label>Dosage</Label>
              <Input placeholder="e.g., 5mg" className="rounded-xl" />
            </div>
            <div>
              <Label>Instructions</Label>
              <Input placeholder="e.g., Take with food" className="rounded-xl" />
            </div>
            <div>
              <Label>Prescription (optional)</Label>
              <div className="border-2 border-dashed border-soft-taupe rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 text-medium-gray mx-auto mb-2" />
                <p className="text-sm text-medium-gray">Upload prescription photo</p>
              </div>
            </div>
            <Button
              onClick={() => {
                setShowAddDialog(false);
                toast.success('Medication added successfully');
              }}
              className="w-full bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
            >
              Add Medication
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
