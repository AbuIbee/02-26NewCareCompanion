import { useApp } from '@/store/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Clock, CheckCircle, AlertCircle, Sun, Sunset, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function PatientMedications() {
  const { state, dispatch } = useApp();
  const [selectedMed, setSelectedMed] = useState<string | null>(null);
  const medications = state.medications.filter(m => m.isActive);
  const medicationLogs = state.medicationLogs;

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = medicationLogs.filter(log => log.date === today);

  const getTimeOfDayIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning': return <Sun className="w-5 h-5 text-warm-bronze" />;
      case 'afternoon': return <Sunset className="w-5 h-5 text-gentle-coral" />;
      case 'evening': return <Moon className="w-5 h-5 text-deep-slate" />;
      default: return <Clock className="w-5 h-5 text-medium-gray" />;
    }
  };

  const getMedicationStatus = (medId: string, scheduledTime: string) => {
    const log = todayLogs.find(l => l.medicationId === medId && l.scheduledTime === scheduledTime);
    return log?.status || 'pending';
  };

  const handleMarkTaken = (medId: string, scheduledTime: string) => {
    const medication = medications.find(m => m.id === medId);
    if (!medication) return;

    const newLog = {
      id: `log-${Date.now()}`,
      medicationId: medId,
      patientId: state.patient?.id || '',
      medicationName: medication.name,
      scheduledTime,
      takenTime: new Date().toISOString(),
      status: 'taken' as const,
      recordedBy: state.patient?.id || '',
      date: today,
    };

    dispatch({ type: 'ADD_MEDICATION_LOG', payload: newLog });
    setSelectedMed(null);
  };

  const getAllScheduledDoses = () => {
    const doses: { med: typeof medications[0]; time: string; timeOfDay: string }[] = [];
    medications.forEach(med => {
      med.schedule.forEach(sched => {
        const hour = parseInt(sched.time.split(':')[0]);
        let timeOfDay = 'night';
        if (hour >= 6 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
        doses.push({ med, time: sched.time, timeOfDay });
      });
    });
    return doses.sort((a, b) => a.time.localeCompare(b.time));
  };

  const scheduledDoses = getAllScheduledDoses();
  const takenCount = todayLogs.filter(l => l.status === 'taken').length;
  const pendingCount = scheduledDoses.length - takenCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-charcoal mb-2">My Medications</h2>
        <p className="text-medium-gray">Keep track of your daily medications</p>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-soft-sage/30 border-0 text-center">
          <CheckCircle className="w-8 h-8 text-soft-sage mx-auto mb-2" />
          <p className="text-3xl font-bold text-charcoal">{takenCount}</p>
          <p className="text-sm text-medium-gray">Taken Today</p>
        </Card>
        <Card className="p-4 bg-gentle-coral/10 border-0 text-center">
          <AlertCircle className="w-8 h-8 text-gentle-coral mx-auto mb-2" />
          <p className="text-3xl font-bold text-charcoal">{pendingCount}</p>
          <p className="text-sm text-medium-gray">Remaining</p>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal mb-4">Today's Schedule</h3>
        {scheduledDoses.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-2 border-soft-taupe">
            <Pill className="w-12 h-12 text-soft-taupe mx-auto mb-3" />
            <p className="text-medium-gray">No medications scheduled for today</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {scheduledDoses.map((dose, index) => {
              const status = getMedicationStatus(dose.med.id, dose.time);
              const isTaken = status === 'taken';

              return (
                <motion.div
                  key={`${dose.med.id}-${dose.time}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`p-4 border-0 transition-all ${
                      isTaken
                        ? 'bg-soft-sage/20'
                        : 'bg-white shadow-soft hover:shadow-card'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isTaken ? 'bg-soft-sage/30' : 'bg-warm-bronze/10'
                      }`}>
                        {getTimeOfDayIcon(dose.timeOfDay)}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${isTaken ? 'text-medium-gray line-through' : 'text-charcoal'}`}>
                          {dose.med.name}
                        </h4>
                        <p className="text-sm text-medium-gray">
                          {dose.med.dosage} • {dose.time}
                        </p>
                        {dose.med.instructions && (
                          <p className="text-xs text-medium-gray mt-1">{dose.med.instructions}</p>
                        )}
                      </div>
                      {isTaken ? (
                        <div className="w-10 h-10 bg-soft-sage rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <Button
                          onClick={() => setSelectedMed(`${dose.med.id}-${dose.time}`)}
                          className="bg-warm-bronze hover:bg-warm-bronze/90 text-white rounded-xl"
                        >
                          Take
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedMed} onOpenChange={() => setSelectedMed(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Confirm Medication</DialogTitle>
            <DialogDescription className="text-center">
              Did you take this medication?
            </DialogDescription>
          </DialogHeader>
          {selectedMed && (
            <div className="py-4">
              {(() => {
                const [medId, time] = selectedMed.split('-');
                const med = medications.find(m => m.id === medId);
                if (!med) return null;
                return (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-warm-bronze/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Pill className="w-8 h-8 text-warm-bronze" />
                    </div>
                    <h3 className="text-lg font-semibold text-charcoal">{med.name}</h3>
                    <p className="text-medium-gray">{med.dosage} • {time}</p>
                  </div>
                );
              })()}
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedMed(null)}
              className="flex-1 rounded-xl"
            >
              Not Yet
            </Button>
            <Button
              onClick={() => {
                const [medId, time] = selectedMed!.split('-');
                handleMarkTaken(medId, time);
              }}
              className="flex-1 bg-soft-sage hover:bg-soft-sage/90 text-white rounded-xl"
            >
              Yes, I Took It
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
