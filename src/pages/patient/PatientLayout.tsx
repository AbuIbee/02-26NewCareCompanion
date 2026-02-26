import { useState, useEffect } from 'react';
import { useApp } from '@/store/AppContext';
import PatientHome from './PatientHome';
import PatientRoutine from './PatientRoutine';
import PatientMemories from './PatientMemories';
import PatientMedications from './PatientMedications';
import PatientDocuments from './PatientDocuments';
import PatientReminders from './PatientReminders';
import PatientMoodTracker from './PatientMoodTracker';
import {
  LayoutDashboard,
  Calendar,
  Pill,
  FileText,
  Bell,
  Heart,
  Smile,
  Users,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Sun,
  Moon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PatientView = 'dashboard' | 'medications' | 'routines' | 'memories' | 'mood' | 'documents' | 'reminders';

export default function PatientLayout() {
  const [currentView, setCurrentView] = useState<PatientView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { state } = useApp();
  const patient = state.patient;

  // Time-based adaptations
  const hour = new Date().getHours();
  const isSundowningTime = hour >= 16 && hour <= 19;
  const isEvening = hour >= 19;

  // Auto-simplify during sundowning
  const [simplifiedMode, setSimplifiedMode] = useState(isSundowningTime);

  useEffect(() => {
    setSimplifiedMode(isSundowningTime);
  }, [hour]);

  const navItems = [
    { id: 'dashboard' as PatientView, label: 'Home', icon: LayoutDashboard },
    { id: 'memories' as PatientView, label: 'Family', icon: Users },
    { id: 'mood' as PatientView, label: 'How I Feel', icon: Smile },
    { id: 'reminders' as PatientView, label: 'Reminders', icon: Bell },
  ];

  const moreNavItems = [
    { id: 'medications' as PatientView, label: 'Medications', icon: Pill },
    { id: 'routines' as PatientView, label: 'My Day', icon: Calendar },
    { id: 'documents' as PatientView, label: 'Papers', icon: FileText },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <PatientHome />;
      case 'medications':
        return <PatientMedications />;
      case 'routines':
        return <PatientRoutine />;
      case 'memories':
        return <PatientMemories />;
      case 'mood':
        return <PatientMoodTracker />;
      case 'documents':
        return <PatientDocuments />;
      case 'reminders':
        return <PatientReminders />;
      default:
        return <PatientHome />;
    }
  };

  const playSafetyMessage = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 5000);
  };

  // Get background based on time
  const getSidebarBg = () => {
    if (isSundowningTime) return 'bg-gradient-to-b from-warm-amber/20 to-white';
    if (isEvening) return 'bg-gradient-to-b from-deep-slate/10 to-white';
    return 'bg-white';
  };

  return (
    <div className="min-h-screen bg-warm-ivory flex">
      {/* Sidebar - Hidden during sundowning if simplified mode */}
      {!simplifiedMode && (
        <aside
          className={`fixed left-0 top-0 bottom-0 ${getSidebarBg()} border-r border-soft-taupe z-40 transition-all duration-300 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-soft-taupe">
            <div className="w-10 h-10 bg-warm-bronze rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="ml-3 font-semibold text-charcoal">CareCompanion</span>
            )}
          </div>

          {/* Patient Info */}
          {!sidebarCollapsed && (
            <div className="p-4 border-b border-soft-taupe">
              <div className="flex items-center gap-3">
                {patient?.photoUrl ? (
                  <img
                    src={patient.photoUrl}
                    alt={patient.preferredName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-warm-bronze"
                  />
                ) : (
                  <div className="w-12 h-12 bg-warm-bronze rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {patient?.preferredName?.[0] || 'E'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-charcoal">{patient?.preferredName || 'Ellie'}</p>
                  <p className="text-xs text-medium-gray">
                    {isEvening ? 'Good Evening' : hour < 12 ? 'Good Morning' : 'Good Afternoon'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="p-3 space-y-2" style={{ height: sidebarCollapsed ? 'auto' : 'calc(100vh - 280px)' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-4 rounded-xl transition-all ${
                    isActive
                      ? 'bg-warm-bronze text-white shadow-soft'
                      : 'text-medium-gray hover:bg-soft-taupe hover:text-charcoal'
                  }`}
                >
                  <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                  {!sidebarCollapsed && (
                    <span className="font-semibold text-base">{item.label}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </button>
              );
            })}

            {/* More Menu */}
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`w-full flex items-center gap-3 px-3 py-4 rounded-xl transition-all ${
                showMoreMenu
                  ? 'bg-calm-blue/20 text-calm-blue'
                  : 'text-medium-gray hover:bg-soft-taupe hover:text-charcoal'
              }`}
            >
              <MoreHorizontal className="w-6 h-6 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-semibold text-base">More</span>
              )}
              {!sidebarCollapsed && (
                <motion.div
                  animate={{ rotate: showMoreMenu ? 180 : 0 }}
                  className="ml-auto"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </button>

            {/* More Items */}
            <AnimatePresence>
              {showMoreMenu && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 space-y-1 border-l-2 border-soft-taupe ml-4">
                    {moreNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => setCurrentView(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                            isActive
                              ? 'bg-warm-bronze/80 text-white'
                              : 'text-medium-gray hover:bg-soft-taupe hover:text-charcoal'
                          }`}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          {!sidebarCollapsed && (
                            <span className="font-medium text-sm">{item.label}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-soft-taupe space-y-2">
            <button
              onClick={playSafetyMessage}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-soft-sage/10 text-soft-sage hover:bg-soft-sage/20 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-5 h-5 flex-shrink-0 animate-pulse" />
                  {!sidebarCollapsed && <span className="font-medium text-sm">Playing...</span>}
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium text-sm">Hear "You're Safe"</span>}
                </>
              )}
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-medium-gray hover:bg-soft-taupe transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Collapse</span>
                </>
              )}
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          simplifiedMode ? '' : sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Header */}
        <header className={`bg-white border-b border-soft-taupe flex items-center justify-between px-6 sticky top-0 z-30 transition-all ${
          simplifiedMode ? 'h-14' : 'h-16'
        }`}>
          <div className="flex items-center gap-4">
            {simplifiedMode && (
              <div className="flex gap-2">
                {navItems.slice(0, 3).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`p-2 rounded-xl transition-all ${
                        isActive ? 'bg-warm-bronze text-white' : 'bg-soft-taupe/30 text-medium-gray'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            )}
            {!simplifiedMode && (
              <h1 className="text-xl font-semibold text-charcoal">
                {[...navItems, ...moreNavItems].find(n => n.id === currentView)?.label || 'Home'}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg font-bold text-charcoal">
                {new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
            {!simplifiedMode && (
              <button 
                onClick={playSafetyMessage}
                className="w-10 h-10 bg-soft-sage/10 rounded-full flex items-center justify-center text-soft-sage hover:bg-soft-sage hover:text-white transition-colors"
              >
                {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className={simplifiedMode ? 'p-4' : 'p-6'}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Sundowning Mode Indicator */}
      {isSundowningTime && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-warm-amber/90 text-white px-6 py-3 rounded-full shadow-elevated flex items-center gap-3">
            <Sun className="w-5 h-5" />
            <span className="font-medium">Evening Mode - Extra Calm</span>
            <button 
              onClick={() => setSimplifiedMode(!simplifiedMode)}
              className="ml-2 text-sm underline"
            >
              {simplifiedMode ? 'Show More' : 'Simplify'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Evening Mode Indicator */}
      {isEvening && !isSundowningTime && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-deep-slate/80 text-white px-6 py-3 rounded-full shadow-elevated flex items-center gap-3">
            <Moon className="w-5 h-5" />
            <span className="font-medium">Good Evening - Time to Relax</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
