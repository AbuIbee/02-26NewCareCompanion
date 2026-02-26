import { useApp } from '@/store/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Volume2, Heart, Image as ImageIcon, Mic, Calendar, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function PatientMemories() {
  const { state } = useApp();
  const memories = state.memories;
  const [selectedMemory, setSelectedMemory] = useState<typeof memories[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'family', 'travel', 'milestones', 'daily'];

  const filteredMemories = activeCategory === 'all' 
    ? memories 
    : memories.filter(m => m.category === activeCategory);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-charcoal mb-2">Your Memories</h2>
        <p className="text-medium-gray">Special moments to remember</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === category
                ? 'bg-warm-bronze text-white'
                : 'bg-soft-taupe/30 text-medium-gray hover:bg-soft-taupe'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Memories Grid */}
      {filteredMemories.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-2 border-soft-taupe">
          <ImageIcon className="w-12 h-12 text-soft-taupe mx-auto mb-3" />
          <p className="text-medium-gray">No memories in this category yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredMemories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                onClick={() => setSelectedMemory(memory)}
                className="overflow-hidden border-0 shadow-soft hover:shadow-card transition-shadow cursor-pointer"
              >
                {memory.photoUrl ? (
                  <div className="relative aspect-square">
                    <img
                      src={memory.photoUrl}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                    />
                    {memory.audioUrl && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                          <Volume2 className="w-6 h-6 text-warm-bronze" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square bg-warm-ivory flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-soft-taupe" />
                  </div>
                )}
                <div className="p-3">
                  <h4 className="font-semibold text-charcoal truncate">{memory.title}</h4>
                  <p className="text-xs text-medium-gray flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(memory.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Memory Detail Dialog */}
      <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">{selectedMemory?.title}</DialogTitle>
          </DialogHeader>
          {selectedMemory && (
            <div className="space-y-4">
              {selectedMemory.photoUrl ? (
                <div className="relative">
                  <img
                    src={selectedMemory.photoUrl}
                    alt={selectedMemory.title}
                    className="w-full rounded-xl"
                  />
                </div>
              ) : selectedMemory.audioUrl ? (
                <div className="bg-warm-ivory p-8 rounded-xl text-center">
                  <Mic className="w-16 h-16 text-warm-bronze mx-auto mb-4" />
                  <Button className="bg-warm-bronze hover:bg-warm-bronze/90 text-white rounded-xl">
                    <Play className="w-5 h-5 mr-2" />
                    Play Recording
                  </Button>
                </div>
              ) : (
                <div className="bg-warm-ivory p-8 rounded-xl text-center">
                  <BookOpen className="w-16 h-16 text-warm-bronze mx-auto mb-4" />
                </div>
              )}
              <div className="bg-warm-ivory p-4 rounded-xl">
                <p className="text-charcoal">{selectedMemory.description}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-medium-gray">
                <span>{new Date(selectedMemory.createdAt).toLocaleDateString()}</span>
                <button className="flex items-center gap-1 text-gentle-coral">
                  <Heart className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
