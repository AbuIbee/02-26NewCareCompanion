import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { useSelectedPatient } from '@/hooks/useSelectedPatient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, AlertCircle, TrendingUp, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MoodType } from '@/types';

export default function CaregiverMood() {
  const { state, dispatch } = useApp();
  const selectedPatient = useSelectedPatient();
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [triggers, setTriggers] = useState('');

  // Use selected patient data or fallback to legacy state
  const moodEntries = selectedPatient?.moodEntries || state.moodEntries;
  const behaviorLogs = selectedPatient?.behaviorLogs || state.behaviorLogs;
  const patient = selectedPatient?.patient || state.patient;

  const moods = [
    { type: 'happy' as MoodType, emoji: '😊', label: 'Happy', color: 'bg-soft-sage/30' },
    { type: 'calm' as MoodType, emoji: '😌', label: 'Calm', color: 'bg-calm-blue/30' },
    { type: 'sad' as MoodType, emoji: '😢', label: 'Sad', color: 'bg-gray-200' },
    { type: 'anxious' as MoodType, emoji: '😰', label: 'Anxious', color: 'bg-gentle-coral/30' },
    { type: 'angry' as MoodType, emoji: '😠', label: 'Angry', color: 'bg-red-100' },
    { type: 'confused' as MoodType, emoji: '😕', label: 'Confused', color: 'bg-yellow-100' },
  ];

  const mockMoodData = [
    { date: 'Mon', mood: 7 },
    { date: 'Tue', mood: 6 },
    { date: 'Wed', mood: 8 },
    { date: 'Thu', mood: 5 },
    { date: 'Fri', mood: 7 },
    { date: 'Sat', mood: 8 },
    { date: 'Sun', mood: 7 },
  ];

  const handleLogMood = () => {
    if (!selectedMood || !patient) return;

    const newEntry = {
      id: `me${Date.now()}`,
      patientId: patient.id,
      mood: selectedMood,
      intensity: 7,
      note: moodNote,
      triggers: triggers.split(',').map(t => t.trim()).filter(Boolean),
      timeOfDay: (format(new Date(), 'a').toLowerCase().includes('am') ? 'morning' : 'afternoon') as 'morning' | 'afternoon' | 'evening' | 'night',
      timestamp: new Date().toISOString(),
      recordedBy: state.currentUser?.firstName || 'Caregiver',
    };

    dispatch({ type: 'ADD_MOOD_ENTRY', payload: newEntry });
    toast.success('Mood logged successfully');
    setShowLogDialog(false);
    setSelectedMood(null);
    setMoodNote('');
    setTriggers('');
  };

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-soft-taupe/30 rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-medium-gray" />
        </div>
        <h2 className="text-xl font-semibold text-charcoal mb-2">No Patient Selected</h2>
        <p className="text-medium-gray text-center max-w-md">
          Please select a patient from the dropdown above to view their mood tracker.
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
          <h2 className="text-2xl font-bold text-charcoal mb-1">Mood & Behavior</h2>
          <p className="text-medium-gray">Track emotional wellbeing and behavioral patterns</p>
        </div>
        <Button
          onClick={() => setShowLogDialog(true)}
          className="bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Entry
        </Button>
      </motion.div>

      {/* Mood Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-charcoal flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-warm-bronze" />
              Mood Trend (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockMoodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE5" />
                  <XAxis dataKey="date" stroke="#6B6B6B" />
                  <YAxis domain={[0, 10]} stroke="#6B6B6B" />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood" stroke="#C9A87C" strokeWidth={3} dot={{ fill: '#C9A87C' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Mood Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-charcoal mb-3">Recent Mood Entries</h3>
        <div className="space-y-3">
          {moodEntries.map((entry, index) => {
            const moodInfo = moods.find(m => m.type === entry.mood);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${moodInfo?.color || 'bg-soft-taupe'} rounded-xl flex items-center justify-center text-2xl`}>
                        {moodInfo?.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-charcoal capitalize">{entry.mood}</p>
                          <span className="text-sm text-medium-gray">
                            {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-medium-gray mt-1">{entry.note}</p>
                        )}
                        {entry.triggers && entry.triggers.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {entry.triggers.map((trigger) => (
                              <Badge key={trigger} variant="secondary" className="bg-gentle-coral/10 text-gentle-coral">
                                {trigger}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Behavior Logs */}
      {behaviorLogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-charcoal mb-3">Behavior Incidents</h3>
          <div className="space-y-3">
            {behaviorLogs.map((log) => (
              <Card key={log.id} className="border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      log.severity === 'severe' ? 'bg-gentle-coral/20' :
                      log.severity === 'moderate' ? 'bg-warm-amber/20' : 'bg-calm-blue/20'
                    }`}>
                      <AlertCircle className={`w-6 h-6 ${
                        log.severity === 'severe' ? 'text-gentle-coral' :
                        log.severity === 'moderate' ? 'text-warm-amber' : 'text-calm-blue'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-charcoal">{log.behavior}</p>
                        <Badge className={
                          log.severity === 'severe' ? 'bg-gentle-coral' :
                          log.severity === 'moderate' ? 'bg-warm-amber' : 'bg-calm-blue'
                        }>
                          {log.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-medium-gray mt-1">{log.description}</p>
                      {log.interventions && (
                        <p className="text-sm text-soft-sage mt-2">
                          Interventions: {log.interventions.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Log Dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-charcoal">Log Mood</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>How is {patient?.preferredName || patient?.firstName} feeling?</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {moods.map((mood) => (
                  <button
                    key={mood.type}
                    onClick={() => setSelectedMood(mood.type)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                      selectedMood === mood.type
                        ? 'ring-2 ring-warm-bronze bg-warm-bronze/10'
                        : 'hover:bg-soft-taupe'
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="Any observations..."
                className="rounded-xl"
              />
            </div>
            <div>
              <Label>Triggers (comma separated)</Label>
              <Input
                value={triggers}
                onChange={(e) => setTriggers(e.target.value)}
                placeholder="e.g., loud noise, change in routine"
                className="rounded-xl"
              />
            </div>
            <Button
              onClick={handleLogMood}
              disabled={!selectedMood}
              className="w-full bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
            >
              Save Entry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
