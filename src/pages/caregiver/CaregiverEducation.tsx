import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, CheckCircle2, Play, Brain, Heart, MessageCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const educationModules = [
  {
    id: '1',
    title: 'Understanding Dementia',
    description: 'Learn about the different types of dementia and how they affect the brain.',
    category: 'dementia_basics',
    duration: 15,
    progress: 100,
    icon: Brain,
    color: 'bg-calm-blue/20 text-blue-600',
  },
  {
    id: '2',
    title: 'Effective Communication',
    description: 'Techniques for communicating with someone who has dementia.',
    category: 'communication',
    duration: 20,
    progress: 60,
    icon: MessageCircle,
    color: 'bg-warm-bronze/20 text-warm-bronze',
  },
  {
    id: '3',
    title: 'Managing Challenging Behaviors',
    description: 'Strategies for handling difficult behaviors with compassion.',
    category: 'behavior_management',
    duration: 25,
    progress: 0,
    icon: Heart,
    color: 'bg-gentle-coral/20 text-gentle-coral',
  },
  {
    id: '4',
    title: 'Caregiver Self-Care',
    description: 'Importance of taking care of yourself while caring for others.',
    category: 'self_care',
    duration: 10,
    progress: 0,
    icon: Shield,
    color: 'bg-soft-sage/20 text-green-600',
  },
];

export default function CaregiverEducation() {
  const [selectedModule, setSelectedModule] = useState<typeof educationModules[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'dementia_basics', label: 'Dementia Basics' },
    { id: 'communication', label: 'Communication' },
    { id: 'behavior_management', label: 'Behavior' },
    { id: 'self_care', label: 'Self-Care' },
  ];

  const filteredModules = activeCategory === 'all' 
    ? educationModules 
    : educationModules.filter(m => m.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-charcoal mb-1">Education</h2>
        <p className="text-medium-gray">Learn and grow as a caregiver</p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-0 shadow-soft bg-gradient-to-r from-warm-bronze/10 to-soft-sage/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-gray mb-1">Your Progress</p>
                <p className="text-3xl font-bold text-charcoal">1 of 4 completed</p>
              </div>
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-soft">
                <span className="text-xl font-bold text-warm-bronze">25%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat.id)}
            className={activeCategory === cat.id ? 'bg-warm-bronze' : 'border-soft-taupe'}
          >
            {cat.label}
          </Button>
        ))}
      </motion.div>

      {/* Module List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid gap-4"
      >
        {filteredModules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => setSelectedModule(module)}
              className="cursor-pointer"
            >
              <Card className="border-0 shadow-soft hover:shadow-card transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${module.color}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-charcoal">{module.title}</h3>
                          <p className="text-sm text-medium-gray mt-1">{module.description}</p>
                        </div>
                        {module.progress === 100 && (
                          <CheckCircle2 className="w-6 h-6 text-soft-sage" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-sm text-medium-gray">
                          <Clock className="w-4 h-4" />
                          {module.duration} min
                        </div>
                        <div className="flex-1">
                          <Progress value={module.progress} className="h-2" />
                        </div>
                        <span className="text-sm text-medium-gray">{module.progress}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Module Dialog */}
      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-lg">
          {selectedModule && (
            <>
              <DialogHeader>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${selectedModule.color}`}>
                  <selectedModule.icon className="w-8 h-8" />
                </div>
                <DialogTitle className="text-xl font-bold text-charcoal">
                  {selectedModule.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-charcoal">{selectedModule.description}</p>
                <div className="flex items-center gap-4 text-sm text-medium-gray">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedModule.duration} minutes
                  </span>
                  <Badge variant="secondary" className="capitalize">
                    {selectedModule.category.replace('_', ' ')}
                  </Badge>
                </div>
                <Progress value={selectedModule.progress} className="h-2" />
                <p className="text-sm text-medium-gray">{selectedModule.progress}% complete</p>
                <Button
                  onClick={() => {
                    toast.success('Starting module...');
                    setSelectedModule(null);
                  }}
                  className="w-full bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {selectedModule.progress > 0 ? 'Continue' : 'Start'} Module
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
