import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Phone, Mail, Building2, Star, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function CaregiverCareTeam() {
  const { state } = useApp();
  const careTeam = state.careTeam;
  const [showAddDialog, setShowAddDialog] = useState(false);

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
          <h2 className="text-2xl font-bold text-charcoal mb-1">Care Team</h2>
          <p className="text-medium-gray">Manage healthcare providers and contacts</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </motion.div>

      {/* Primary Care Provider */}
      {careTeam.find(m => m.isPrimary) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-charcoal mb-3">Primary Care Provider</h3>
          {careTeam.filter(m => m.isPrimary).map((member) => (
            <Card key={member.id} className="border-0 shadow-card bg-gradient-to-r from-warm-bronze/10 to-calm-blue/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-warm-bronze rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-charcoal">{member.name}</h4>
                      <Badge className="bg-warm-bronze">
                        <Star className="w-3 h-3 mr-1" />
                        Primary
                      </Badge>
                    </div>
                    <p className="text-medium-gray">{member.role}</p>
                    {member.specialty && (
                      <p className="text-sm text-warm-bronze">{member.specialty}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1 text-medium-gray">
                        <Building2 className="w-4 h-4" />
                        {member.organization}
                      </div>
                      <div className="flex items-center gap-1 text-medium-gray">
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </div>
                      {member.email && (
                        <div className="flex items-center gap-1 text-medium-gray">
                          <Mail className="w-4 h-4" />
                          {member.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Other Team Members */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-charcoal mb-3">Other Team Members</h3>
        <div className="grid gap-4">
          {careTeam.filter(m => !m.isPrimary).map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="border-0 shadow-soft">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-calm-blue/20 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-charcoal">{member.name}</h4>
                      <p className="text-sm text-medium-gray">{member.role}</p>
                      {member.specialty && (
                        <p className="text-sm text-warm-bronze">{member.specialty}</p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-medium-gray">
                        <span>{member.organization}</span>
                        <span>•</span>
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-charcoal">Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input placeholder="Full name" className="rounded-xl" />
            </div>
            <div>
              <Label>Role</Label>
              <Input placeholder="e.g., Occupational Therapist" className="rounded-xl" />
            </div>
            <div>
              <Label>Organization</Label>
              <Input placeholder="e.g., Home Health Services" className="rounded-xl" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input placeholder="(555) 123-4567" className="rounded-xl" />
            </div>
            <Button
              onClick={() => {
                setShowAddDialog(false);
                toast.success('Team member added');
              }}
              className="w-full bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
            >
              Add Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
