import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { useSelectedPatient } from '@/hooks/useSelectedPatient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Bell, Clock, Pill, Calendar, Check, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function CaregiverReminders() {
  const { state } = useApp();
  const selectedPatient = useSelectedPatient();
  const reminders = selectedPatient?.reminders || state.reminders;
  const patient = selectedPatient?.patient || state.patient;
  const [showAddDialog, setShowAddDialog] = useState(false);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      medication: Pill,
      appointment: Calendar,
      task: Check,
      custom: Bell,
    };
    return icons[type] || Bell;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      medication: 'bg-calm-blue/20 text-blue-600',
      appointment: 'bg-warm-bronze/20 text-warm-bronze',
      task: 'bg-soft-sage/20 text-green-600',
      custom: 'bg-gentle-coral/20 text-gentle-coral',
    };
    return colors[type] || 'bg-gray-200';
  };

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-soft-taupe/30 rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-medium-gray" />
        </div>
        <h2 className="text-xl font-semibold text-charcoal mb-2">No Patient Selected</h2>
        <p className="text-medium-gray text-center max-w-md">
          Please select a patient from the dropdown above to view their reminders.
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
          <h2 className="text-2xl font-bold text-charcoal mb-1">Reminders</h2>
          <p className="text-medium-gray">Manage alerts and notifications for {patient.firstName}</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </Button>
      </motion.div>

      {/* Active Reminders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-3"
      >
        {reminders.map((reminder, index) => {
          const Icon = getTypeIcon(reminder.type);
          return (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className="border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(reminder.type)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-charcoal">{reminder.title}</p>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {reminder.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-medium-gray">{reminder.message}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-medium-gray">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {reminder.time}
                        </span>
                        <span>
                          {reminder.daysOfWeek.length === 7 ? 'Daily' : 
                           reminder.daysOfWeek.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}
                        </span>
                      </div>
                    </div>
                    <Switch checked={reminder.isActive} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-charcoal">Add Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input placeholder="e.g., Morning Medication" className="rounded-xl" />
            </div>
            <div>
              <Label>Message</Label>
              <Input placeholder="Reminder message" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <select className="w-full px-4 py-2 rounded-xl border border-soft-taupe">
                  <option>Medication</option>
                  <option>Appointment</option>
                  <option>Task</option>
                  <option>Custom</option>
                </select>
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" className="rounded-xl" />
              </div>
            </div>
            <Button
              onClick={() => {
                setShowAddDialog(false);
                toast.success('Reminder added');
              }}
              className="w-full bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
            >
              Save Reminder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
