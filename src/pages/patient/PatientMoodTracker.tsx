import { useApp } from '@/store/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Meh, AlertCircle, Sun, Cloud, Wind, Heart, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type MoodType = 'happy' | 'calm' | 'sad' | 'anxious' | 'angry' | 'confused';

interface MoodOption {
  type: MoodType;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const moodOptions: MoodOption[] = [
  { type: 'happy', label: 'Happy', icon: Smile, color: 'text-soft-sage', bgColor: 'bg-soft-sage/20' },
  { type: 'calm', label: 'Calm', icon: Sun, color: 'text-warm-bronze', bgColor: 'bg-warm-bronze/10' },
  { type: 'sad', label: 'Sad', icon: Cloud, color: 'text-deep-slate', bgColor: 'bg-deep-slate/10' },
  { type: 'anxious', label: 'Anxious', icon: Wind, color: 'text-gentle-coral', bgColor: 'bg-gentle-coral/10' },
  { type: 'angry', label: 'Angry', icon: AlertCircle, color: 'text-gentle-coral', bgColor: 'bg-gentle-coral/20' },
  { type: 'confused', label: 'Confused', icon: Meh, color: 'text-medium-gray', bgColor: 'bg-soft-taupe/30' },
];

const calmingActivities = [
  { title: 'Deep Breathing', description: 'Take 5 slow, deep breaths', icon: Wind },
  { title: 'Look at Photos', description: 'View your favorite memories', icon: Heart },
  { title: 'Listen to Music', description: 'Play calming songs', icon: Sun },
  { title: 'Gentle Stretch', description: 'Slow, easy movements', icon: Smile },
];

export default function PatientMoodTracker() {
  const { state, dispatch } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showCalming, setShowCalming] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const moodEntries = state.moodEntries;
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = moodEntries.find(e => e.timestamp.startsWith(today));

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setShowDialog(true);
  };

  const handleSubmit = () => {
    if (!selectedMood || !state.patient) return;

    const newEntry = {
      id: `mood-${Date.now()}`,
      patientId: state.patient.id,
      mood: selectedMood,
      intensity: 5,
      note: note || undefined,
      timeOfDay: (() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning' as const;
        if (hour < 17) return 'afternoon' as const;
        if (hour < 21) return 'evening' as const;
        return 'night' as const;
      })(),
      timestamp: new Date().toISOString(),
      recordedBy: state.patient.id,
    };

    dispatch({ type: 'ADD_MOOD_ENTRY', payload: newEntry });
    setShowDialog(false);
    setSubmitted(true);
    setNote('');

    // Show calming activities for negative moods
    if (['sad', 'anxious', 'angry', 'confused'].includes(selectedMood)) {
      setTimeout(() => setShowCalming(true), 500);
    }

    setTimeout(() => setSubmitted(false), 3000);
  };

  const getMoodIcon = (mood: string) => {
    const option = moodOptions.find(m => m.type === mood);
    return option?.icon || Smile;
  };

  const getMoodColor = (mood: string) => {
    const option = moodOptions.find(m => m.type === mood);
    return option?.color || 'text-medium-gray';
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-charcoal mb-2">How Are You Feeling?</h2>
        <p className="text-medium-gray">Tap on a face to share your mood</p>
      </div>

      {/* Today's Mood */}
      {todayEntry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 bg-soft-sage/20 border-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                {(() => {
                  const Icon = getMoodIcon(todayEntry.mood);
                  return <Icon className={`w-8 h-8 ${getMoodColor(todayEntry.mood)}`} />;
                })()}
              </div>
              <div>
                <p className="text-sm text-medium-gray">Today you felt</p>
                <p className="text-lg font-semibold text-char capitalize">{todayEntry.mood}</p>
                {todayEntry.note && (
                  <p className="text-sm text-medium-gray mt-1">"{todayEntry.note}"</p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Mood Selection Grid */}
      <div className="grid grid-cols-2 gap-4">
        {moodOptions.map((mood, index) => {
          const Icon = mood.icon;
          return (
            <motion.button
              key={mood.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleMoodSelect(mood.type)}
              className={`p-6 rounded-2xl ${mood.bgColor} hover:shadow-card transition-all text-center`}
            >
              <Icon className={`w-12 h-12 ${mood.color} mx-auto mb-3`} />
              <p className={`font-semibold ${mood.color}`}>{mood.label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Mood History */}
      {moodEntries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-charcoal mb-4">Your Mood History</h3>
          <div className="space-y-3">
            {moodEntries
              .slice()
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 5)
              .map((entry, index) => {
                const moodOption = moodOptions.find(m => m.type === entry.mood);
                const Icon = moodOption?.icon || Smile;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 bg-white border-0 shadow-soft">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${moodOption?.bgColor || 'bg-soft-taupe/30'}`}>
                          <Icon className={`w-6 h-6 ${moodOption?.color || 'text-medium-gray'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-charcoal capitalize">{entry.mood}</p>
                          <p className="text-sm text-medium-gray">
                            {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
          </div>
        </div>
      )}

      {/* Mood Entry Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              You feel {selectedMood && moodOptions.find(m => m.type === selectedMood)?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-medium-gray mb-3">Would you like to add a note? (optional)</p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How are you feeling? What's on your mind?"
              className="min-h-[100px] rounded-xl"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-warm-bronze hover:bg-warm-bronze/90 text-white rounded-xl"
            >
              Save Mood
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calming Activities Dialog */}
      <Dialog open={showCalming} onOpenChange={setShowCalming}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Let's Help You Feel Better</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-medium-gray text-center mb-4">
              Try one of these calming activities
            </p>
            <div className="grid grid-cols-2 gap-3">
              {calmingActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setShowCalming(false)}
                    className="p-4 bg-soft-sage/20 rounded-xl hover:bg-soft-sage/30 transition-colors text-center"
                  >
                    <Icon className="w-8 h-8 text-soft-sage mx-auto mb-2" />
                    <p className="font-medium text-charcoal text-sm">{activity.title}</p>
                    <p className="text-xs text-medium-gray">{activity.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <Button
            onClick={() => setShowCalming(false)}
            className="w-full bg-warm-bronze hover:bg-warm-bronze/90 text-white rounded-xl"
          >
            I'm Okay Now
          </Button>
        </DialogContent>
      </Dialog>

      {/* Success Message */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-soft-sage text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg z-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Mood saved!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
