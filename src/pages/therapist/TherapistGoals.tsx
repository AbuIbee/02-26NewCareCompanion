import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Target, CheckCircle2, Circle, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function TherapistGoals() {
  const { state } = useApp();
  const goals = state.goals;
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<typeof goals[0] | null>(null);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      functional: 'bg-calm-blue/20 text-blue-600',
      cognitive: 'bg-warm-bronze/20 text-warm-bronze',
      emotional: 'bg-soft-sage/20 text-green-600',
      physical: 'bg-gentle-coral/20 text-gentle-coral',
    };
    return colors[category] || 'bg-gray-200';
  };

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
          <h2 className="text-2xl font-bold text-charcoal mb-1">Goal Tracking</h2>
          <p className="text-medium-gray">Monitor patient progress on therapeutic goals</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-calm-blue hover:bg-blue-600 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-charcoal">{goals.length}</p>
            <p className="text-sm text-medium-gray">Active Goals</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-soft-sage">1</p>
            <p className="text-sm text-medium-gray">Completed</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-warm-bronze">
              {Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / (goals.length || 1))}%
            </p>
            <p className="text-sm text-medium-gray">Avg Progress</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-calm-blue">2</p>
            <p className="text-sm text-medium-gray">This Month</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Goals by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-4"
      >
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            onClick={() => setSelectedGoal(goal)}
            className="cursor-pointer"
          >
            <Card className="border-0 shadow-soft hover:shadow-card transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(goal.category)}`}>
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-charcoal">{goal.title}</h3>
                        <p className="text-sm text-medium-gray">{goal.description}</p>
                      </div>
                      <Badge className={getCategoryColor(goal.category)}>
                        {goal.category}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-medium-gray">Progress</span>
                        <span className="text-sm font-medium text-charcoal">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-medium-gray">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created {new Date(goal.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{goal.milestones.filter(m => m.completed).length} of {goal.milestones.length} milestones</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Goal Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-charcoal">Add Therapeutic Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Goal Title</Label>
              <Input placeholder="e.g., Improve short-term memory" className="rounded-xl" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Describe the therapeutic goal..." className="rounded-xl" />
            </div>
            <div>
              <Label>Category</Label>
              <select className="w-full px-4 py-2 rounded-xl border border-soft-taupe">
                <option>Functional</option>
                <option>Cognitive</option>
                <option>Emotional</option>
                <option>Physical</option>
              </select>
            </div>
            <div>
              <Label>Target Date</Label>
              <Input type="date" className="rounded-xl" />
            </div>
            <Button
              onClick={() => {
                setShowAddDialog(false);
                toast.success('Therapeutic goal added');
              }}
              className="w-full bg-calm-blue hover:bg-blue-600 text-white rounded-xl"
            >
              Add Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Goal Dialog */}
      <Dialog open={!!selectedGoal} onOpenChange={() => setSelectedGoal(null)}>
        <DialogContent className="max-w-lg">
          {selectedGoal && (
            <>
              <DialogHeader>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${getCategoryColor(selectedGoal.category)}`}>
                  <Target className="w-7 h-7" />
                </div>
                <DialogTitle className="text-xl font-bold text-charcoal">
                  {selectedGoal.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-charcoal">{selectedGoal.description}</p>
                <Badge className={getCategoryColor(selectedGoal.category)}>
                  {selectedGoal.category}
                </Badge>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-medium-gray">Progress</span>
                    <span className="font-medium text-charcoal">{selectedGoal.progress}%</span>
                  </div>
                  <Progress value={selectedGoal.progress} className="h-3" />
                </div>
                <div>
                  <p className="font-medium text-charcoal mb-2">Milestones</p>
                  <div className="space-y-2">
                    {selectedGoal.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center gap-3 p-3 bg-soft-taupe/30 rounded-xl">
                        {milestone.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-soft-sage" />
                        ) : (
                          <Circle className="w-5 h-5 text-medium-gray" />
                        )}
                        <span className={milestone.completed ? 'text-soft-sage line-through' : 'text-charcoal'}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-calm-blue hover:bg-blue-600 text-white rounded-xl">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Update Progress
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
