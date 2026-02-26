import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Heart, Moon, Wind, Coffee, CheckCircle2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function CaregiverWellness() {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [stressLevel, setStressLevel] = useState(5);
  const [notes, setNotes] = useState('');

  const wellnessTips = [
    {
      icon: Wind,
      title: 'Deep Breathing',
      description: 'Take 5 minutes for deep breathing exercises',
      color: 'bg-soft-sage/20 text-green-600',
    },
    {
      icon: Coffee,
      title: 'Take a Break',
      description: 'Step away for a cup of tea or coffee',
      color: 'bg-warm-bronze/20 text-warm-bronze',
    },
    {
      icon: Moon,
      title: 'Rest When You Can',
      description: 'Prioritize sleep and rest when possible',
      color: 'bg-deep-bronze/20 text-deep-bronze',
    },
    {
      icon: Heart,
      title: 'Ask for Help',
      description: 'Reach out to your support network',
      color: 'bg-gentle-coral/20 text-gentle-coral',
    },
  ];

  const handleCheckIn = () => {
    toast.success('Check-in recorded. Remember to take care of yourself!');
    setShowCheckIn(false);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-charcoal mb-1">Caregiver Wellness</h2>
        <p className="text-medium-gray">Your wellbeing matters too</p>
      </motion.div>

      {/* Wellness Check-in */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-0 shadow-card bg-gradient-to-r from-soft-sage/20 to-calm-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-gray mb-1">Daily Check-in</p>
                <p className="text-lg font-semibold text-charcoal">How are you feeling today?</p>
              </div>
              <Button
                onClick={() => setShowCheckIn(true)}
                className="bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Check In
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stress Level Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <p className="text-sm text-medium-gray mb-3">This Week's Stress Level</p>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-charcoal">Moderate</span>
              <div className="flex-1">
                <Progress value={60} className="h-3" />
              </div>
            </div>
            <p className="text-sm text-medium-gray mt-2">
              You've checked in 3 times this week. Keep it up!
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wellness Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-charcoal mb-3">Self-Care Tips</h3>
        <div className="grid grid-cols-2 gap-4">
          {wellnessTips.map((tip, index) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="border-0 shadow-soft h-full">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tip.color}`}>
                    <tip.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-charcoal text-sm">{tip.title}</h4>
                  <p className="text-xs text-medium-gray mt-1">{tip.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-charcoal mb-3">Support Resources</h3>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-soft-taupe/30 rounded-xl">
              <div>
                <p className="font-medium text-charcoal">Caregiver Support Group</p>
                <p className="text-sm text-medium-gray">Every Tuesday at 6 PM</p>
              </div>
              <Button variant="outline" size="sm" className="border-warm-bronze text-warm-bronze">
                Join
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-soft-taupe/30 rounded-xl">
              <div>
                <p className="font-medium text-charcoal">Respite Care Services</p>
                <p className="text-sm text-medium-gray">Professional care when you need a break</p>
              </div>
              <Button variant="outline" size="sm" className="border-warm-bronze text-warm-bronze">
                Learn More
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-soft-taupe/30 rounded-xl">
              <div>
                <p className="font-medium text-charcoal">24/7 Caregiver Helpline</p>
                <p className="text-sm text-medium-gray">1-800-CAREGIVER</p>
              </div>
              <Button variant="outline" size="sm" className="border-warm-bronze text-warm-bronze">
                Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Check-in Dialog */}
      <Dialog open={showCheckIn} onOpenChange={setShowCheckIn}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-charcoal">Daily Check-in</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-charcoal">How stressed do you feel right now?</Label>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-medium-gray">Low</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-medium-gray">High</span>
              </div>
              <p className="text-center font-medium text-warm-bronze mt-1">{stressLevel}/10</p>
            </div>
            <div>
              <Label className="text-charcoal">How did you sleep last night?</Label>
              <div className="flex gap-2 mt-2">
                {['Poor', 'Fair', 'Good', 'Excellent'].map((quality) => (
                  <Button
                    key={quality}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-soft-taupe"
                  >
                    {quality}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-charcoal">Notes (optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling today?"
                className="rounded-xl mt-2"
              />
            </div>
            <Button
              onClick={handleCheckIn}
              className="w-full bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit Check-in
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
