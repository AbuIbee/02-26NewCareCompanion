import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { Card, CardContent } from '@/components/ui/card';
// Routine page
import { CheckCircle2, Sun, Cloud, Moon, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export default function PatientRoutine() {
  const { state, dispatch } = useApp();
  const [activeTimeOfDay, setActiveTimeOfDay] = useState<TimeOfDay>('morning');
  const tasks = state.tasks.filter(t => t.timeOfDay === activeTimeOfDay);

  const timeOfDayConfig = {
    morning: { label: 'Morning', icon: Sun, color: 'text-warm-amber', bgColor: 'bg-warm-amber/10' },
    afternoon: { label: 'Afternoon', icon: Cloud, color: 'text-calm-blue', bgColor: 'bg-calm-blue/10' },
    evening: { label: 'Evening', icon: Moon, color: 'text-deep-bronze', bgColor: 'bg-deep-bronze/10' },
    night: { label: 'Night', icon: Star, color: 'text-purple-500', bgColor: 'bg-purple-100' },
  };

  const handleTaskComplete = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = {
        ...task,
        status: (task.status === 'completed' ? 'pending' : 'completed') as 'pending' | 'completed' | 'skipped',
        completedAt: task.status === 'completed' ? undefined : new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      
      if (updatedTask.status === 'completed') {
        toast.success(`Great job! You completed: ${task.title}`);
      }
    }
  };

  const getTaskIcon = (iconName: string) => {
    const icons: Record<string, string> = {
      utensils: '🍽️',
      pill: '💊',
      shirt: '👕',
      sun: '☀️',
      moon: '🌙',
      bath: '🛁',
      bed: '🛏️',
      book: '📚',
      music: '🎵',
      phone: '📞',
    };
    return icons[iconName] || '✓';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-charcoal mb-2">Your Daily Routine</h1>
        <p className="text-medium-gray">Take it one step at a time</p>
      </motion.div>

      {/* Time of Day Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-4 gap-2"
      >
        {(Object.keys(timeOfDayConfig) as TimeOfDay[]).map((timeOfDay) => {
          const config = timeOfDayConfig[timeOfDay];
          const Icon = config.icon;
          const isActive = activeTimeOfDay === timeOfDay;
          
          return (
            <button
              key={timeOfDay}
              onClick={() => setActiveTimeOfDay(timeOfDay)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                isActive
                  ? `${config.bgColor} ${config.color}`
                  : 'bg-white text-medium-gray hover:bg-soft-taupe'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{config.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-medium-gray">
                {timeOfDayConfig[activeTimeOfDay].label} Progress
              </span>
              <span className="text-sm font-medium text-warm-bronze">
                {tasks.filter(t => t.status === 'completed').length} of {tasks.length}
              </span>
            </div>
            <div className="h-3 bg-soft-taupe rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-warm-bronze rounded-full"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="space-y-3"
      >
        {tasks.length === 0 ? (
          <Card className="border-0 shadow-soft">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-soft-taupe rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <p className="text-charcoal font-medium">No tasks for this time</p>
              <p className="text-sm text-medium-gray">Enjoy your free time!</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card
                className={`border-0 shadow-soft transition-all cursor-pointer ${
                  task.status === 'completed' ? 'opacity-60' : 'hover:shadow-card'
                }`}
                onClick={() => handleTaskComplete(task.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      task.status === 'completed'
                        ? 'bg-soft-sage text-green-600'
                        : 'bg-soft-taupe'
                    }`}>
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        getTaskIcon(task.icon)
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        task.status === 'completed'
                          ? 'text-charcoal line-through'
                          : 'text-charcoal'
                      }`}>
                        {task.title}
                      </p>
                      <p className="text-sm text-medium-gray">{task.scheduledTime}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      task.status === 'completed'
                        ? 'border-soft-sage bg-soft-sage'
                        : 'border-soft-taupe'
                    }`}>
                      {task.status === 'completed' && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Encouragement Message */}
      {tasks.filter(t => t.status === 'completed').length === tasks.length && tasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6"
        >
          <div className="inline-flex items-center gap-2 bg-soft-sage/30 text-green-700 px-6 py-3 rounded-full">
            <span className="text-2xl">🎉</span>
            <span className="font-medium">All done! Great job!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
