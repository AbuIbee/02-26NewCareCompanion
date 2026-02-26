  import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { useSelectedPatient } from '@/hooks/useSelectedPatient';
import {
  AlertTriangle,
  Phone,
  Shield,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  User,
  Heart,
  Brain,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CrisisTool {
  id: string;
  title: string;
  description: string;
  steps: string[];
  icon: React.ElementType;
}

const crisisTools: CrisisTool[] = [
  {
    id: 'agitation',
    title: 'Agitation & Restlessness',
    description: 'When patient becomes agitated, restless, or aggressive',
    icon: Activity,
    steps: [
      'Stay calm and speak in a soft, reassuring voice',
      'Identify and remove triggers (noise, crowds, unfamiliar people)',
      'Validate their feelings: "I can see you\'re upset"',
      'Offer a distraction: music, photos, or a familiar activity',
      'Ensure safety - remove objects that could cause harm',
      'If escalation continues, call for backup support',
    ],
  },
  {
    id: 'wandering',
    title: 'Wandering & Elopement',
    description: 'When patient tries to leave or wanders unsafely',
    icon: Shield,
    steps: [
      'Stay with the patient - do not leave them unattended',
      'Gently redirect: "Let\'s go this way together"',
      'Identify the underlying need (bathroom, hungry, bored)',
      'Use visual barriers on doors (curtains, stop signs)',
      'Ensure ID bracelet is worn at all times',
      'If missing, check common places first (car, previous home)',
    ],
  },
  {
    id: 'sundowning',
    title: 'Sundowning',
    description: 'Increased confusion and agitation in late afternoon/evening',
    icon: Clock,
    steps: [
      'Close curtains and turn on lights before sunset',
      'Maintain a consistent evening routine',
      'Reduce noise and stimulation (TV, visitors)',
      'Offer a comforting activity: music, hand massage',
      'Avoid caffeine and heavy meals in the evening',
      'Consider melatonin (consult doctor first)',
    ],
  },
  {
    id: 'hallucinations',
    title: 'Hallucinations & Delusions',
    description: 'When patient sees or believes things that aren\'t real',
    icon: Brain,
    steps: [
      'Do not argue or try to convince them it\'s not real',
      'Validate the emotion: "That sounds frightening"',
      'Redirect to a pleasant activity or environment',
      'Check for physical causes (UTI, medication side effects)',
      'Ensure good lighting to reduce shadows',
      'Document frequency and content for doctor review',
    ],
  },
  {
    id: 'refusal',
    title: 'Care Refusal',
    description: 'When patient refuses medication, bathing, or care',
    icon: User,
    steps: [
      'Do not force - this can escalate to aggression',
      'Try again later when they may be more receptive',
      'Simplify the task or break it into smaller steps',
      'Use distraction: "Let\'s have a snack first"',
      'Offer choices: "Shower now or after lunch?"',
      'Consider if timing, environment, or approach needs change',
    ],
  },
  {
    id: 'repetition',
    title: 'Repetitive Behaviors',
    description: 'Repeated questions, phrases, or actions',
    icon: Heart,
    steps: [
      'Answer calmly each time - they truly don\'t remember',
      'Use written cues or memory aids if helpful',
      'Distract with an engaging activity',
      'Identify triggers (boredom, anxiety, unmet need)',
      'Take breaks - this behavior is exhausting for caregivers',
      'Join a support group to share coping strategies',
    ],
  },
];

const emergencyContacts = [
  { name: '911', number: '911', type: 'emergency', description: 'For immediate medical emergencies' },
  { name: 'Poison Control', number: '1-800-222-1222', type: 'emergency', description: '24/7 poison helpline' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', type: 'support', description: 'Mental health support' },
  { name: 'Alzheimer\'s Helpline', number: '1-800-272-3900', type: 'support', description: '24/7 dementia support' },
];

export default function CaregiverCrisisPrevention() {
  const { state } = useApp();
  const selectedPatient = useSelectedPatient();
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);

  const toggleTool = (id: string) => {
    setExpandedTool(expandedTool === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gentle-coral to-gentle-coral/80 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Crisis Prevention & Response</h1>
            <p className="text-white/80">
              {selectedPatient 
                ? `Managing care for ${selectedPatient.patient.firstName} ${selectedPatient.patient.lastName}`
                : 'Quick reference guides for challenging situations'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowEmergencyContacts(!showEmergencyContacts)}
        className="w-full bg-gentle-coral text-white rounded-xl p-4 flex items-center justify-between shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Emergency Contacts</p>
            <p className="text-sm text-white/80">One-tap access to crisis support</p>
          </div>
        </div>
        {showEmergencyContacts ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </motion.button>

      {/* Emergency Contacts Panel */}
      <AnimatePresence>
        {showEmergencyContacts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {emergencyContacts.map((contact) => (
              <a
                key={contact.name}
                href={contact.type === 'emergency' ? `tel:${contact.number.replace(/\D/g, '')}` : undefined}
                className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                  contact.type === 'emergency'
                    ? 'bg-gentle-coral/10 border-gentle-coral hover:bg-gentle-coral/20'
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  contact.type === 'emergency' ? 'bg-gentle-coral' : 'bg-blue-500'
                }`}>
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-charcoal">{contact.name}</p>
                  <p className={`text-lg font-bold ${contact.type === 'emergency' ? 'text-gentle-coral' : 'text-blue-600'}`}>
                    {contact.number}
                  </p>
                  <p className="text-sm text-medium-gray">{contact.description}</p>
                </div>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crisis Prevention Tools */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-5 h-5 text-warm-bronze" />
          <h2 className="text-xl font-semibold text-charcoal">Crisis Prevention Guides</h2>
        </div>

        <div className="space-y-3">
          {crisisTools.map((tool) => {
            const Icon = tool.icon;
            const isExpanded = expandedTool === tool.id;

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-soft-taupe overflow-hidden"
              >
                <button
                  onClick={() => toggleTool(tool.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-soft-taupe/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-warm-bronze/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-warm-bronze" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-charcoal">{tool.title}</p>
                      <p className="text-sm text-medium-gray">{tool.description}</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-medium-gray" /> : <ChevronDown className="w-5 h-5 text-medium-gray" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-soft-taupe"
                    >
                      <div className="p-4 space-y-3">
                        <p className="font-medium text-charcoal mb-3">Response Steps:</p>
                        {tool.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-warm-bronze/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-warm-bronze">{index + 1}</span>
                            </div>
                            <p className="text-charcoal">{step}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
{/* Risk Profile (if patient selected) */}
{selectedPatient && (
  <div className="space-y-6">
    {/* System Alerts */}
    <div className="bg-white rounded-xl p-6 border border-soft-taupe">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-gentle-coral" />
          <h2 className="text-xl font-semibold text-charcoal">System Alerts</h2>
        </div>
        {state.alerts.length > 0 && (
          <span className="px-3 py-1 bg-gentle-coral/10 text-gentle-coral text-sm rounded-full">
            {state.alerts.length} alert{state.alerts.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {state.alerts.length === 0 ? (
      <p className="text-xs text-medium-gray mt-1">No active system alerts</p>
      ) : (
        <div className="space-y-3">
          {state.alerts.slice(0, 3).map(item => (
            <div key={item.id} className="flex items-start gap-3 p-3 bg-soft-taupe/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-gentle-coral flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-charcoal">{item.title}</p>
                <p className="text-sm text-medium-gray">{item.message}</p>
               {/*<p className="text-xs text-medium-gray mt-1"></p>*/}
              </div>
            </div>
          ))}
          {state.alerts.length > 3 && (
            <p className="text-sm text-medium-gray text-center">
              +{state.alerts.length - 3} more alert{state.alerts.length - 3 !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>

    {/* Patient Risk Profile */}
    <div className="bg-white rounded-xl p-6 border border-soft-taupe">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-warm-bronze" />
        <h2 className="text-xl font-semibold text-charcoal">
          {selectedPatient.patient.firstName}&apos;s Risk Profile
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Red Flags */}
        <div className="p-4 bg-gentle-coral/10 rounded-xl border border-gentle-coral/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-gentle-coral" />
            <p className="font-semibold text-gentle-coral">High Risk</p>
          </div>
          <ul className="space-y-2">
            {selectedPatient.safetyAlerts
              .filter(a => a.category === 'red' && !a.isResolved)
              .slice(0, 3)
              .map(alert => (
                <li key={alert.id} className="flex items-start gap-2 text-sm text-charcoal">
                  <span className="w-1.5 h-1.5 bg-gentle-coral rounded-full mt-1.5 flex-shrink-0" />
                  {alert.title}
                </li>
              ))}
            {selectedPatient.safetyAlerts.filter(a => a.category === 'red' && !a.isResolved).length === 0 && (
              <li className="text-sm text-medium-gray italic">No active high-risk alerts</li>
            )}
          </ul>
        </div>

        {/* Yellow Flags */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <p className="font-semibold text-amber-700">Monitor</p>
          </div>
          <ul className="space-y-2">
            {selectedPatient.safetyAlerts
              .filter(a => a.category === 'yellow' && !a.isResolved)
              .slice(0, 3)
              .map(alert => (
                <li key={alert.id} className="flex items-start gap-2 text-sm text-charcoal">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                  {alert.title}
                </li>
              ))}
            {selectedPatient.safetyAlerts.filter(a => a.category === 'yellow' && !a.isResolved).length === 0 && (
              <li className="text-sm text-medium-gray italic">No monitoring alerts</li>
            )}
          </ul>
        </div>

        {/* Green Indicators */}
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-semibold text-green-700">Stable</p>
          </div>
          <ul className="space-y-2">
            {selectedPatient.safetyAlerts
              .filter(a => a.category === 'green' || a.isResolved)
              .slice(0, 3)
              .map(alert => (
                <li key={alert.id} className="flex items-start gap-2 text-sm text-charcoal">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  {alert.title}
                </li>
              ))}
            {selectedPatient.safetyAlerts.filter(a => a.category === 'green' || a.isResolved).length === 0 && (
              <li className="text-sm text-medium-gray italic">No positive indicators yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Caregiver Self-Care Reminder */}
      <div className="bg-gradient-to-r from-warm-bronze/10 to-warm-bronze/5 rounded-xl p-6 border border-warm-bronze/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-warm-bronze/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-warm-bronze" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal mb-2">Remember to Care for Yourself</h3>
            <p className="text-medium-gray mb-4">
              Crisis situations are stressful. You cannot pour from an empty cup. 
              Take breaks, ask for help, and prioritize your own wellbeing.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white rounded-full text-sm text-charcoal border border-soft-taupe">
                Take 5 deep breaths
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-sm text-charcoal border border-soft-taupe">
                Step outside for fresh air
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-sm text-charcoal border border-soft-taupe">
                Call a friend
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-sm text-charcoal border border-soft-taupe">
                Use respite care
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
