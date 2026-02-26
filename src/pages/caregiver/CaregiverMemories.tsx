import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { useSelectedPatient } from '@/hooks/useSelectedPatient';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Heart, Upload, Calendar, MapPin, Users, X, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { Memory } from '@/types';

export default function CaregiverMemories() {
  const { state, dispatch } = useApp();
  const selectedPatient = useSelectedPatient();
  const memories = selectedPatient?.memories || state.memories;
  const patient = selectedPatient?.patient || state.patient;
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [newMemory, setNewMemory] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    people: '',
  });

  const handleAddMemory = () => {
    if (!patient) return;
    
    const memory: Memory = {
      id: `mem${Date.now()}`,
      patientId: patient.id,
      title: newMemory.title,
      description: newMemory.description,
      date: newMemory.date,
      location: newMemory.location,
      people: newMemory.people.split(',').map(p => p.trim()).filter(Boolean),
      category: 'photo',
      isFavorite: false,
      createdAt: new Date().toISOString(),
      createdBy: state.currentUser?.firstName || 'Caregiver',
    };

    dispatch({ type: 'ADD_MEMORY', payload: memory });
    toast.success('Memory added successfully');
    setShowAddDialog(false);
    setNewMemory({ title: '', description: '', date: '', location: '', people: '' });
  };

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-soft-taupe/30 rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-medium-gray" />
        </div>
        <h2 className="text-xl font-semibold text-charcoal mb-2">No Patient Selected</h2>
        <p className="text-medium-gray text-center max-w-md">
          Please select a patient from the dropdown above to view their memories.
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
          <h2 className="text-2xl font-bold text-charcoal mb-1">Memory Book</h2>
          <p className="text-medium-gray">Preserve precious moments and stories</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Memory
        </Button>
      </motion.div>

      {/* Memory Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {memories.map((memory, index) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            onClick={() => setSelectedMemory(memory)}
            className="cursor-pointer"
          >
            <Card className="border-0 shadow-soft overflow-hidden hover:shadow-card transition-shadow">
              <div className="relative aspect-square">
                {memory.photoUrl ? (
                  <img
                    src={memory.photoUrl}
                    alt={memory.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-warm-bronze/20 to-calm-blue/20 flex items-center justify-center">
                    <span className="text-6xl">📷</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium">{memory.title}</p>
                  {memory.date && (
                    <p className="text-white/70 text-sm">{memory.date}</p>
                  )}
                </div>
                {memory.isFavorite && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-gentle-coral fill-gentle-coral" />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Memory Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-charcoal">Add New Memory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-soft-taupe rounded-xl p-8 text-center">
              <Upload className="w-8 h-8 text-medium-gray mx-auto mb-2" />
              <p className="text-sm text-medium-gray">Upload a photo</p>
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={newMemory.title}
                onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                placeholder="e.g., Family Vacation 1978"
                className="rounded-xl"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newMemory.description}
                onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                placeholder="Tell the story..."
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newMemory.date}
                  onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={newMemory.location}
                  onChange={(e) => setNewMemory({ ...newMemory, location: e.target.value })}
                  placeholder="e.g., Lake Tahoe"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div>
              <Label>People (comma separated)</Label>
              <Input
                value={newMemory.people}
                onChange={(e) => setNewMemory({ ...newMemory, people: e.target.value })}
                placeholder="e.g., Mary, David, Robert"
                className="rounded-xl"
              />
            </div>
            <Button
              onClick={handleAddMemory}
              disabled={!newMemory.title}
              className="w-full bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
            >
              Save Memory
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Memory Dialog */}
      <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {selectedMemory && (
            <>
              <div className="relative aspect-video">
                {selectedMemory.photoUrl ? (
                  <img
                    src={selectedMemory.photoUrl}
                    alt={selectedMemory.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-warm-bronze/20 to-calm-blue/20 flex items-center justify-center">
                    <span className="text-6xl">📷</span>
                  </div>
                )}
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-charcoal mb-2">{selectedMemory.title}</h3>
                {selectedMemory.description && (
                  <p className="text-charcoal mb-4">{selectedMemory.description}</p>
                )}
                <div className="space-y-2 text-sm text-medium-gray">
                  {selectedMemory.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedMemory.date}</span>
                    </div>
                  )}
                  {selectedMemory.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedMemory.location}</span>
                    </div>
                  )}
                  {selectedMemory.people && selectedMemory.people.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{selectedMemory.people.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
