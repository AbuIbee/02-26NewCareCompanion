import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Tools page
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, Brain, MessageCircle, Sparkles, Play, BookOpen, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const therapyTools = [
  {
    id: 'validation',
    title: 'Validation Therapy',
    description: 'Acknowledge and validate the patient\'s feelings and reality.',
    icon: Heart,
    color: 'bg-gentle-coral/20 text-gentle-coral',
    steps: [
      'Listen with empathy and without judgment',
      'Acknowledge the emotion behind the statement',
      'Validate their feelings as real and important',
      'Redirect gently if needed',
    ],
  },
  {
    id: 'reminiscence',
    title: 'Reminiscence Therapy',
    description: 'Use photos, music, and objects to trigger positive memories.',
    icon: BookOpen,
    color: 'bg-warm-bronze/20 text-warm-bronze',
    steps: [
      'Choose a meaningful topic or time period',
      'Use photos, music, or familiar objects',
      'Ask open-ended questions',
      'Listen and engage with their stories',
    ],
  },
  {
    id: 'path',
    title: 'PATH Framework',
    description: 'Pause, Acknowledge, Talk, Help - for managing distress.',
    icon: MessageCircle,
    color: 'bg-calm-blue/20 text-blue-600',
    steps: [
      'PAUSE - Take a breath and stay calm',
      'ACKNOWLEDGE - Validate their feelings',
      'TALK - Use simple, reassuring language',
      'HELP - Offer comfort and distraction',
    ],
  },
  {
    id: 'cognitive',
    title: 'Cognitive Stimulation',
    description: 'Engage in activities that stimulate thinking and memory.',
    icon: Brain,
    color: 'bg-soft-sage/20 text-green-600',
    steps: [
      'Choose appropriate difficulty level',
      'Focus on enjoyment, not correctness',
      'Offer encouragement and support',
      'Keep sessions short and positive',
    ],
  },
];

export default function TherapistTools() {
  const [selectedTool, setSelectedTool] = useState<typeof therapyTools[0] | null>(null);
  const [showSessionNotes, setShowSessionNotes] = useState(false);
  const [notes, setNotes] = useState('');

  const startSession = (tool: typeof therapyTools[0]) => {
    toast.success(`Starting ${tool.title} session`);
    setSelectedTool(null);
  };

  const saveNotes = () => {
    toast.success('Session notes saved');
    setShowSessionNotes(false);
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
        <h2 className="text-2xl font-bold text-charcoal mb-1">Therapy Tools</h2>
        <p className="text-medium-gray">Evidence-based interventions for dementia care</p>
      </motion.div>

      {/* Tools Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        {therapyTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              onClick={() => setSelectedTool(tool)}
              className="cursor-pointer"
            >
              <Card className="border-0 shadow-soft hover:shadow-card transition-shadow h-full">
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tool.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-charcoal mb-2">{tool.title}</h3>
                  <p className="text-sm text-medium-gray">{tool.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Session Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-0 shadow-soft bg-gradient-to-r from-calm-blue/10 to-soft-sage/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-charcoal mb-1">Session Notes</h3>
                <p className="text-sm text-medium-gray">Record observations from your last session</p>
              </div>
              <Button
                onClick={() => setShowSessionNotes(true)}
                className="bg-calm-blue hover:bg-blue-600 text-white rounded-xl"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Add Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tool Detail Dialog */}
      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-lg">
          {selectedTool && (
            <>
              <DialogHeader>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${selectedTool.color}`}>
                  <selectedTool.icon className="w-8 h-8" />
                </div>
                <DialogTitle className="text-xl font-bold text-charcoal">
                  {selectedTool.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-charcoal">{selectedTool.description}</p>
                <div>
                  <p className="font-medium text-charcoal mb-2">Key Steps:</p>
                  <div className="space-y-2">
                    {selectedTool.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-soft-taupe/30 rounded-xl">
                        <div className="w-6 h-6 bg-calm-blue rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-charcoal">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => startSession(selectedTool)}
                  className="w-full bg-calm-blue hover:bg-blue-600 text-white rounded-xl"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Session Notes Dialog */}
      <Dialog open={showSessionNotes} onOpenChange={setShowSessionNotes}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-charcoal">Session Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-charcoal">Session Type</Label>
              <select className="w-full px-4 py-2 rounded-xl border border-soft-taupe mt-2">
                <option>Validation Therapy</option>
                <option>Reminiscence Therapy</option>
                <option>Cognitive Stimulation</option>
                <option>General Assessment</option>
              </select>
            </div>
            <div>
              <Label className="text-charcoal">Observations & Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document patient responses, behaviors, and progress..."
                className="rounded-xl mt-2 min-h-[150px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-soft-sage" />
              <span className="text-sm text-medium-gray">Will be saved to patient record</span>
            </div>
            <Button
              onClick={saveNotes}
              className="w-full bg-calm-blue hover:bg-blue-600 text-white rounded-xl"
            >
              Save Notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
