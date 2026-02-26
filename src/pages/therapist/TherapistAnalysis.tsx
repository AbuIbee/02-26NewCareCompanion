import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Analysis page
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, AlertCircle, Clock, MapPin, Activity, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockMoodTrend = [
  { day: 'Mon', score: 7 },
  { day: 'Tue', score: 6 },
  { day: 'Wed', score: 8 },
  { day: 'Thu', score: 5 },
  { day: 'Fri', score: 7 },
  { day: 'Sat', score: 8 },
  { day: 'Sun', score: 7 },
];

const mockBehaviorFrequency = [
  { behavior: 'Repetitive Q', count: 5 },
  { behavior: 'Agitation', count: 3 },
  { behavior: 'Wandering', count: 2 },
  { behavior: 'Sundowning', count: 4 },
];

const mockTimeOfDay = [
  { time: 'Morning', incidents: 2 },
  { time: 'Afternoon', incidents: 1 },
  { time: 'Evening', incidents: 5 },
  { time: 'Night', incidents: 3 },
];

export default function TherapistAnalysis() {
  const { state } = useApp();
  const [timeRange, setTimeRange] = useState('7days');
  const behaviorLogs = state.behaviorLogs;

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
          <h2 className="text-2xl font-bold text-charcoal mb-1">Behavioral Analysis</h2>
          <p className="text-medium-gray">Pattern recognition and trend analysis</p>
        </div>
        <div className="flex gap-2">
          {['7 days', '30 days', '90 days'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range.replace(' ', '') ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range.replace(' ', ''))}
              className={timeRange === range.replace(' ', '') ? 'bg-calm-blue' : 'border-soft-taupe'}
            >
              {range}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gentle-coral/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-gentle-coral" />
              </div>
              <div>
                <p className="text-sm text-medium-gray">Total Incidents</p>
                <p className="text-xl font-bold text-charcoal">{behaviorLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warm-amber/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-warm-amber" />
              </div>
              <div>
                <p className="text-sm text-medium-gray">Peak Time</p>
                <p className="text-xl font-bold text-charcoal">Evening</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-calm-blue/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-medium-gray">Trend</p>
                <p className="text-xl font-bold text-charcoal">Stable</p>
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
              <div>
                <p className="text-sm text-medium-gray">Avg Duration</p>
                <p className="text-xl font-bold text-charcoal">12 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Tabs defaultValue="mood">
          <TabsList className="bg-soft-taupe/50 p-1 rounded-xl">
            <TabsTrigger value="mood" className="rounded-lg data-[state=active]:bg-white">Mood Trend</TabsTrigger>
            <TabsTrigger value="behavior" className="rounded-lg data-[state=active]:bg-white">Behavior Frequency</TabsTrigger>
            <TabsTrigger value="time" className="rounded-lg data-[state=active]:bg-white">Time of Day</TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="mt-4">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-charcoal">Mood Score Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockMoodTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE5" />
                      <XAxis dataKey="day" stroke="#6B6B6B" />
                      <YAxis domain={[0, 10]} stroke="#6B6B6B" />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#C9A87C" strokeWidth={3} dot={{ fill: '#C9A87C' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="mt-4">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-charcoal">Behavior Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockBehaviorFrequency}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE5" />
                      <XAxis dataKey="behavior" stroke="#6B6B6B" />
                      <YAxis stroke="#6B6B6B" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#C9A87C" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time" className="mt-4">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-charcoal">Incidents by Time of Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockTimeOfDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE5" />
                      <XAxis dataKey="time" stroke="#6B6B6B" />
                      <YAxis stroke="#6B6B6B" />
                      <Tooltip />
                      <Bar dataKey="incidents" fill="#98B4C5" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Pattern Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-charcoal mb-3">Pattern Insights</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-warm-amber/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-warm-amber" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">Sundowning Pattern</h4>
                  <p className="text-sm text-medium-gray mt-1">
                    Increased confusion and agitation observed consistently between 4-6 PM. 
                    Recommend establishing calming routine during this time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-calm-blue/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">Environmental Triggers</h4>
                  <p className="text-sm text-medium-gray mt-1">
                    Loud noises and unfamiliar environments correlate with increased anxiety. 
                    Consider noise reduction strategies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-charcoal mb-3">Recommendations</h3>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-soft-sage/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-soft-sage flex-shrink-0" />
              <span className="text-charcoal">Implement structured evening routine to reduce sundowning</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-soft-sage/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-soft-sage flex-shrink-0" />
              <span className="text-charcoal">Increase validation therapy sessions during peak anxiety times</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-soft-sage/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-soft-sage flex-shrink-0" />
              <span className="text-charcoal">Consider music therapy to improve mood stability</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
