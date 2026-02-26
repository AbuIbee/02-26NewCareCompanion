import { useApp } from '@/store/AppContext';
import { Card } from '@/components/ui/card';
import { Bell, Clock, Calendar, Pill, Stethoscope, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientReminders() {
  const { state } = useApp();
  const reminders = state.reminders.filter(r => r.isActive);

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="w-6 h-6 text-warm-bronze" />;
      case 'appointment':
        return <Stethoscope className="w-6 h-6 text-gentle-coral" />;
      case 'task':
        return <CheckCircle2 className="w-6 h-6 text-soft-sage" />;
      default:
        return <Bell className="w-6 h-6 text-deep-slate" />;
    }
  };

  const getReminderColor = (type: string) => {
    switch (type) {
      case 'medication':
        return 'bg-warm-bronze/10';
      case 'appointment':
        return 'bg-gentle-coral/10';
      case 'task':
        return 'bg-soft-sage/20';
      default:
        return 'bg-soft-taupe/30';
    }
  };

  const getDaysLabel = (daysOfWeek: number[]) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (daysOfWeek.length === 7) return 'Every day';
    if (daysOfWeek.length === 0) return 'One time';
    return daysOfWeek.map(d => dayNames[d]).join(', ');
  };

  const today = new Date().getDay();
  const todaysReminders = reminders.filter(r => r.daysOfWeek.includes(today) || r.daysOfWeek.length === 0);
  const upcomingReminders = reminders.filter(r => !r.daysOfWeek.includes(today) && r.daysOfWeek.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-charcoal mb-2">My Reminders</h2>
        <p className="text-medium-gray">Things to remember today</p>
      </div>

      {/* Today's Reminders */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-warm-bronze" />
          <h3 className="text-lg font-semibold text-charcoal">Today</h3>
        </div>

        {todaysReminders.length === 0 ? (
          <Card className="p-6 text-center border-dashed border-2 border-soft-taupe bg-soft-sage/10">
            <CheckCircle2 className="w-12 h-12 text-soft-sage mx-auto mb-3" />
            <p className="text-charcoal font-medium">All done for today!</p>
            <p className="text-sm text-medium-gray">No reminders scheduled</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {todaysReminders
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 bg-white border-0 shadow-soft">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getReminderColor(reminder.type)}`}>
                        {getReminderIcon(reminder.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-charcoal">{reminder.title}</h4>
                        <p className="text-sm text-medium-gray">{reminder.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-medium-gray" />
                          <span className="text-xs text-medium-gray">{reminder.time}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-deep-slate" />
            <h3 className="text-lg font-semibold text-charcoal">Other Days</h3>
          </div>

          <div className="space-y-3">
            {upcomingReminders
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 bg-soft-taupe/20 border-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getReminderColor(reminder.type)}`}>
                        {getReminderIcon(reminder.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-charcoal">{reminder.title}</h4>
                        <p className="text-sm text-medium-gray">{reminder.message}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-medium-gray flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {reminder.time}
                          </span>
                          <span className="text-xs text-medium-gray flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {getDaysLabel(reminder.daysOfWeek)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Info Card */}
      <Card className="p-4 bg-warm-bronze/10 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-warm-bronze/20 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-warm-bronze" />
          </div>
          <div>
            <h4 className="font-semibold text-charcoal mb-1">How Reminders Work</h4>
            <p className="text-sm text-medium-gray">
              Your caregiver sets up reminders to help you remember important things. You'll see notifications at the scheduled times.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
