import { useApp } from '@/store/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  User,
  Mail,
  Phone,
  Bell,
  Moon,
  Volume2,
  Shield,
  Save,
  GraduationCap,
  Heart,
  PhoneCall,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  MapPin,
  CheckCircle2,
  Clock,
  Zap,
  Wind,
  Users,
  BookOpen,
  Calendar,
  Utensils,
  Target,
  Stethoscope,
} from 'lucide-react';
import { useState } from 'react';

// Sub-tab types
type PortalTab = 'profile' | 'education' | 'selfcare' | 'careteam' | 'goals';

// Education modules
const educationModules = [
  { id: 1, title: 'Understanding Dementia Stages', category: 'dementia_basics', duration: 15, progress: 75, icon: BookOpen },
  { id: 2, title: 'Communication Techniques', category: 'communication', duration: 20, progress: 30, icon: MessageSquare },
  { id: 3, title: 'Managing Challenging Behaviors', category: 'behavior_management', duration: 25, progress: 0, icon: AlertCircle },
  { id: 4, title: 'Caregiver Burnout Prevention', category: 'self_care', duration: 15, progress: 50, icon: Heart },
  { id: 5, title: 'Legal & Financial Planning', category: 'legal', duration: 30, progress: 0, icon: Shield },
];

// Quick status options
const quickStatusOptions = [
  { label: 'Mood Down', icon: AlertCircle, color: 'bg-gentle-coral/20 text-gentle-coral' },
  { label: 'Slept Poorly', icon: Moon, color: 'bg-deep-slate/20 text-deep-slate' },
  { label: 'Ate Well', icon: Utensils, color: 'bg-soft-sage/20 text-soft-sage' },
  { label: 'Agitated', icon: Zap, color: 'bg-warm-amber/20 text-warm-amber' },
];

// Caregiver tips from community
const communityTips = [
  { tip: 'I play the same playlist every evening - it signals bedtime.', author: 'Caregiver in NC' },
  { tip: 'Photo albums are my secret weapon for redirecting.', author: 'Caregiver in TX' },
  { tip: 'Taking 10 minutes to myself prevents burnout.', author: 'Caregiver in CA' },
];

export default function CaregiverProfile() {
  const { state } = useApp();
  const user = state.currentUser;
  const patient = state.patient;

  const [activeTab, setActiveTab] = useState<PortalTab>('profile');
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [caregiverStress] = useState<'low' | 'medium' | 'high'>('medium');
  const hoursActive = 8;
  const lastBreak = 2;

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const logQuickStatus = (status: string) => {
    // In a real app, this would dispatch an action
    alert(`Status logged: ${status}. Appropriate suggestions will be shown.`);
  };

  const handleEmergency = (type: string) => {
    if (type === 'help') {
      setShowEmergencyDialog(true);
    } else if (type === 'call') {
      alert('Calling family member...');
    } else if (type === 'text') {
      alert('Opening message to doctor...');
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="p-6 bg-white border-0 shadow-soft">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-warm-bronze rounded-full flex items-center justify-center text-white text-2xl font-semibold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-charcoal">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-medium-gray">Caregiver</p>
            <p className="text-sm text-medium-gray">Caring for: {patient?.preferredName}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medium-gray" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-warm-bronze hover:bg-warm-bronze/90 text-white rounded-xl"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-warm-ivory rounded-xl">
              <Mail className="w-5 h-5 text-medium-gray" />
              <div>
                <p className="text-sm text-medium-gray">Email</p>
                <p className="text-charcoal">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-warm-ivory rounded-xl">
              <Phone className="w-5 h-5 text-medium-gray" />
              <div>
                <p className="text-sm text-medium-gray">Phone</p>
                <p className="text-charcoal">{user?.phone || 'Not set'}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full rounded-xl"
            >
              Edit Profile
            </Button>
          </div>
        )}
      </Card>

      {/* Preferences */}
      <Card className="p-6 bg-white border-0 shadow-soft">
        <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-warm-bronze" />
          Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-warm-ivory rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-medium-gray" />
              <div>
                <p className="font-medium text-charcoal">Notifications</p>
                <p className="text-sm text-medium-gray">Receive alerts and updates</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between p-3 bg-warm-ivory rounded-xl">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-medium-gray" />
              <div>
                <p className="font-medium text-charcoal">Sound</p>
                <p className="text-sm text-medium-gray">Play sounds for alerts</p>
              </div>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          </div>
          <div className="flex items-center justify-between p-3 bg-warm-ivory rounded-xl">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-medium-gray" />
              <div>
                <p className="font-medium text-charcoal">Dark Mode</p>
                <p className="text-sm text-medium-gray">Use dark theme</p>
              </div>
            </div>
            <Switch />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderEducationTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-charcoal mb-2">Education Center</h3>
        <p className="text-medium-gray">Learn skills to provide better care</p>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 bg-soft-sage/10 border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-medium-gray">Your Progress</p>
            <p className="text-2xl font-bold text-charcoal">2 of 5 modules completed</p>
          </div>
          <div className="w-16 h-16 bg-soft-sage/20 rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-soft-sage" />
          </div>
        </div>
      </Card>

      {/* Education Modules */}
      <div className="space-y-3">
        {educationModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="p-4 bg-white border-0 shadow-soft hover:shadow-card transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warm-ivory rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-warm-bronze" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-charcoal">{module.title}</h4>
                  <p className="text-sm text-medium-gray capitalize">{module.category.replace('_', ' ')} • {module.duration} min</p>
                  <div className="mt-2 h-2 bg-soft-taupe/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-warm-bronze rounded-full transition-all"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
                <Badge className={module.progress === 100 ? 'bg-soft-sage' : module.progress > 0 ? 'bg-warm-amber' : 'bg-soft-taupe'}>
                  {module.progress === 100 ? 'Completed' : module.progress > 0 ? 'In Progress' : 'Not Started'}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderSelfCareTab = () => (
    <div className="space-y-6">
      {/* Caregiver Status Header */}
      <Card className={`p-6 border-0 shadow-soft border-l-4 ${
        caregiverStress === 'high' ? 'border-l-gentle-coral' :
        caregiverStress === 'medium' ? 'border-l-warm-amber' : 'border-l-soft-sage'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-medium-gray">Hello, {user?.firstName}</p>
            <p className="text-lg font-semibold text-charcoal">
              Your stress: <span className={
                caregiverStress === 'high' ? 'text-gentle-coral' :
                caregiverStress === 'medium' ? 'text-warm-amber' : 'text-soft-sage'
              }>{caregiverStress}</span> • Last break: {lastBreak} days ago
            </p>
          </div>
          <div className="w-14 h-14 bg-warm-ivory rounded-full flex items-center justify-center">
            <Heart className={`w-7 h-7 ${
              caregiverStress === 'high' ? 'text-gentle-coral' :
              caregiverStress === 'medium' ? 'text-warm-amber' : 'text-soft-sage'
            }`} />
          </div>
        </div>
      </Card>

      {/* Break Reminder */}
      {hoursActive >= 6 && (
        <Card className="p-4 bg-warm-amber/10 border-0">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-warm-amber" />
            <div className="flex-1">
              <p className="font-medium text-charcoal">You've been active {hoursActive} hours</p>
              <p className="text-sm text-medium-gray">Consider a 15-minute break</p>
            </div>
            <Button size="sm" className="bg-warm-amber hover:bg-warm-amber/90 text-white rounded-xl">
              Take Break
            </Button>
          </div>
        </Card>
      )}

      {/* Quick Resources */}
      <div>
        <h3 className="text-lg font-semibold text-charcoal mb-4">Quick Resources</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl border-soft-taupe">
            <Wind className="w-6 h-6 text-soft-sage" />
            <span className="text-sm">Breathing Exercise</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl border-soft-taupe">
            <Users className="w-6 h-6 text-warm-bronze" />
            <span className="text-sm">Support Group</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl border-soft-taupe">
            <Calendar className="w-6 h-6 text-calm-blue" />
            <span className="text-sm">Respite Care</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl border-soft-taupe">
            <Phone className="w-6 h-6 text-gentle-coral" />
            <span className="text-sm">Crisis Line</span>
          </Button>
        </div>
      </div>

      {/* Community Tips */}
      <Card className="p-6 bg-white border-0 shadow-soft">
        <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-warm-bronze" />
          Tips from Other Caregivers
        </h3>
        <div className="space-y-4">
          {communityTips.map((tip, index) => (
            <div key={index} className="p-4 bg-warm-ivory rounded-xl">
              <p className="text-charcoal">"{tip.tip}"</p>
              <p className="text-sm text-medium-gray mt-2">— {tip.author}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderCareTeamTab = () => {
    const careTeam = state.careTeam;
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-charcoal mb-2">Your Care Team</h3>
          <p className="text-medium-gray">People who help care for {patient?.preferredName}</p>
        </div>

        <div className="space-y-3">
          {careTeam.map((member) => (
            <Card key={member.id} className="p-4 bg-white border-0 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warm-bronze/10 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-warm-bronze" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-charcoal">{member.name}</h4>
                  <p className="text-sm text-medium-gray">{member.role}</p>
                  {member.specialty && (
                    <p className="text-xs text-medium-gray">{member.specialty}</p>
                  )}
                </div>
                {member.isPrimary && (
                  <Badge className="bg-soft-sage">Primary</Badge>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-soft-taupe flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 rounded-lg">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                {member.email && (
                  <Button size="sm" variant="outline" className="flex-1 rounded-lg">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderGoalsTab = () => {
    const goals = state.goals;
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-charcoal mb-2">Care Goals</h3>
          <p className="text-medium-gray">Tracking progress together</p>
        </div>

        <div className="space-y-3">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-4 bg-white border-0 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-charcoal">{goal.title}</h4>
                <Badge className={
                  goal.status === 'active' ? 'bg-warm-amber' :
                  goal.status === 'completed' ? 'bg-soft-sage' : 'bg-soft-taupe'
                }>
                  {goal.status}
                </Badge>
              </div>
              <p className="text-sm text-medium-gray mb-3">{goal.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-medium-gray">Progress</span>
                  <span className="font-medium text-charcoal">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-soft-taupe/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-warm-bronze rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
              {goal.milestones.length > 0 && (
                <div className="mt-3 pt-3 border-t border-soft-taupe">
                  <p className="text-sm font-medium text-charcoal mb-2">Milestones:</p>
                  <div className="space-y-1">
                    {goal.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center gap-2">
                        <CheckCircle2 className={`w-4 h-4 ${milestone.completed ? 'text-soft-sage' : 'text-soft-taupe'}`} />
                        <span className={`text-sm ${milestone.completed ? 'text-charcoal' : 'text-medium-gray'}`}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'profile' as PortalTab, label: 'Profile', icon: User },
          { id: 'education' as PortalTab, label: 'Education', icon: GraduationCap },
          { id: 'selfcare' as PortalTab, label: 'Self-Care', icon: Heart },
          { id: 'careteam' as PortalTab, label: 'Care Team', icon: Users },
          { id: 'goals' as PortalTab, label: 'Goals', icon: Target },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-warm-bronze text-white'
                  : 'bg-white text-medium-gray hover:bg-soft-taupe'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && renderProfileTab()}
      {activeTab === 'education' && renderEducationTab()}
      {activeTab === 'selfcare' && renderSelfCareTab()}
      {activeTab === 'careteam' && renderCareTeamTab()}
      {activeTab === 'goals' && renderGoalsTab()}

      {/* Fixed Bottom Toolbar - One-Tap Communication */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white rounded-2xl shadow-elevated p-2 flex items-center gap-2 border border-soft-taupe">
          <Button
            size="sm"
            className="rounded-xl bg-soft-sage hover:bg-soft-sage/90 text-white"
            onClick={() => handleEmergency('call')}
          >
            <PhoneCall className="w-4 h-4 mr-1" />
            Call Family
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl border-calm-blue text-calm-blue hover:bg-calm-blue hover:text-white"
            onClick={() => handleEmergency('text')}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Text Doctor
          </Button>
          <Button
            size="sm"
            className="rounded-xl bg-gentle-coral hover:bg-gentle-coral/90 text-white"
            onClick={() => handleEmergency('help')}
          >
            <HelpCircle className="w-4 h-4 mr-1" />
            I Need Help
          </Button>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-warm-ivory rounded-2xl p-2 flex items-center gap-1">
          <span className="text-xs text-medium-gray px-2">Quick Log:</span>
          {quickStatusOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.label}
                onClick={() => logQuickStatus(option.label)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${option.color}`}
              >
                <Icon className="w-3 h-3" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Emergency Help Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-gentle-coral flex items-center justify-center gap-2">
              <AlertCircle className="w-6 h-6" />
              I Need Help
            </DialogTitle>
            <DialogDescription className="text-center">
              What kind of help do you need right now?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button className="w-full justify-start h-auto py-4 rounded-xl bg-gentle-coral/10 text-gentle-coral hover:bg-gentle-coral/20">
              <PhoneCall className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Contact Family Members</p>
                <p className="text-xs opacity-70">Notify other caregivers</p>
              </div>
            </Button>
            <Button className="w-full justify-start h-auto py-4 rounded-xl bg-warm-amber/10 text-warm-amber hover:bg-warm-amber/20">
              <MapPin className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Find Respite Care Options</p>
                <p className="text-xs opacity-70">Local temporary relief services</p>
              </div>
            </Button>
            <Button className="w-full justify-start h-auto py-4 rounded-xl bg-soft-sage/10 text-soft-sage hover:bg-soft-sage/20">
              <Wind className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">De-escalation Scripts</p>
                <p className="text-xs opacity-70">Calming phrases and techniques</p>
              </div>
            </Button>
            <Button className="w-full justify-start h-auto py-4 rounded-xl bg-calm-blue/10 text-calm-blue hover:bg-calm-blue/20">
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Crisis Support Line</p>
                <p className="text-xs opacity-70">24/7 caregiver helpline</p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
