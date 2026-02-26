import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { useSelectedPatient } from '@/hooks/useSelectedPatient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Activity, Moon, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CaregiverHealth() {
  const { state } = useApp();
  const selectedPatient = useSelectedPatient();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('vitals');
  
  const patient = selectedPatient?.patient || state.patient;
  const tasks = selectedPatient?.tasks || state.tasks;

  const mockVitalsData = [
    { date: 'Mon', systolic: 120, diastolic: 80, heartRate: 72 },
    { date: 'Tue', systolic: 118, diastolic: 78, heartRate: 70 },
    { date: 'Wed', systolic: 122, diastolic: 82, heartRate: 74 },
    { date: 'Thu', systolic: 119, diastolic: 79, heartRate: 71 },
    { date: 'Fri', systolic: 121, diastolic: 81, heartRate: 73 },
    { date: 'Sat', systolic: 117, diastolic: 77, heartRate: 69 },
    { date: 'Sun', systolic: 120, diastolic: 80, heartRate: 72 },
  ];

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-soft-taupe/30 rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-medium-gray" />
        </div>
        <h2 className="text-xl font-semibold text-charcoal mb-2">No Patient Selected</h2>
        <p className="text-medium-gray text-center max-w-md">
          Please select a patient from the dropdown above to view their health monitoring.
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
          <h2 className="text-2xl font-bold text-charcoal mb-1">Health Monitoring</h2>
          <p className="text-medium-gray">Track vitals, sleep, and appointments for {patient.firstName}</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Entry
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-5 gap-4"
      >
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gentle-coral/20 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-gentle-coral" />
              </div>
              <div>
                <p className="text-sm text-medium-gray">Blood Pressure</p>
                <p className="text-lg font-bold text-charcoal">120/80</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-calm-blue/20 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-medium-gray">Heart Rate</p>
                <p className="text-lg font-bold text-charcoal">72 bpm</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-deep-bronze/20 rounded-xl flex items-center justify-center">
                <Moon className="w-5 h-5 text-deep-bronze" />
              </div>
              <div>
                <p className="text-sm text-medium-gray">Sleep</p>
                <p className="text-lg font-bold text-charcoal">7h 30m</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-soft-sage/20 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
                <Card className="border-0 shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-soft-sage/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
           <p className="text-sm text-medium-gray">Pending Tasks</p>
           <p className="text-lg font-bold text-charcoal">
           {tasks.filter(t => t.status === 'pending').length}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
              <div>
                <p className="text-sm text-medium-gray">Weight</p>
                <p className="text-lg font-bold text-charcoal">145 lbs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-soft-taupe/50 p-1 rounded-xl">
            <TabsTrigger value="vitals" className="rounded-lg data-[state=active]:bg-white">Vitals</TabsTrigger>
            <TabsTrigger value="sleep" className="rounded-lg data-[state=active]:bg-white">Sleep</TabsTrigger>
            <TabsTrigger value="appointments" className="rounded-lg data-[state=active]:bg-white">Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="mt-4">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-charcoal">Blood Pressure Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockVitalsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE5" />
                      <XAxis dataKey="date" stroke="#6B6B6B" />
                      <YAxis stroke="#6B6B6B" />
                      <Tooltip />
                      <Line type="monotone" dataKey="systolic" stroke="#C9A87C" strokeWidth={2} name="Systolic" />
                      <Line type="monotone" dataKey="diastolic" stroke="#98B4C5" strokeWidth={2} name="Diastolic" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sleep" className="mt-4">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-soft-taupe/30 rounded-xl">
                    <p className="text-3xl font-bold text-charcoal">7.5h</p>
                    <p className="text-sm text-medium-gray">Avg Duration</p>
                  </div>
                  <div className="text-center p-4 bg-soft-taupe/30 rounded-xl">
                    <p className="text-3xl font-bold text-charcoal">2</p>
                    <p className="text-sm text-medium-gray">Avg Interruptions</p>
                  </div>
                  <div className="text-center p-4 bg-soft-taupe/30 rounded-xl">
                    <p className="text-3xl font-bold text-soft-sage">Good</p>
                    <p className="text-sm text-medium-gray">Quality</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="mt-4">
            <div className="space-y-3">
              {state.appointments.map((apt) => (
                <Card key={apt.id} className="border-0 shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-warm-bronze/20 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-warm-bronze" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-charcoal">{apt.title}</p>
                        <p className="text-sm text-medium-gray">{apt.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-charcoal">{apt.date}</p>
                        <p className="text-sm text-medium-gray">{apt.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-charcoal">Log Health Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <select className="w-full px-4 py-2 rounded-xl border border-soft-taupe">
                <option>Vitals</option>
                <option>Sleep</option>
                <option>Weight</option>
              </select>
            </div>
            <div>
              <Label>Blood Pressure (Systolic)</Label>
              <Input type="number" placeholder="120" className="rounded-xl" />
            </div>
            <div>
              <Label>Blood Pressure (Diastolic)</Label>
              <Input type="number" placeholder="80" className="rounded-xl" />
            </div>
            <Button
              onClick={() => {
                setShowAddDialog(false);
                toast.success('Health entry logged');
              }}
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
