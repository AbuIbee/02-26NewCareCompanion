/**
 * SuperAdminLayout
 *
 * Used by: superadmin, admin
 *
 * superadmin — Full platform control. Can create/delete admin accounts, manage billing,
 *              view all orgs, system settings. Super Fantastic Enterprises owner only.
 *
 * admin — Full access across all organizations. Can create master accounts,
 *         view audit logs, manage all users. Cannot create/delete superadmin accounts.
 *
 * No locked screens. No lock icons. Both roles see and use everything available to them.
 */

import { useState, useEffect } from 'react';
import { useApp } from '@/store/AppContext';
import { usePermissions } from '@/hooks/usePermissions';
import { supabase } from '@/lib/supabase';
import {
  Crown, Shield, Users, UserCheck, Stethoscope, LogOut,
  Plus, Trash2, Loader2, LayoutDashboard, Settings, FileText,
  Eye, EyeOff, AlertTriangle, Building2,
} from 'lucide-react';
import HIPAACompliancePage from '@/components/Hipaacompliancepage';
import MFASettings from '@/components/MFASettings';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SystemStats {
  total_users:             number;
  patientCareCoordinators: number;
  therapists:              number;
  patients:                number;
  admins:                  number;
  masters:                 number;
  superadmins:             number;
  pending:                 number;
}

type SAView = 'dashboard' | 'admins' | 'masters' | 'all_users' | 'hipaa' | 'settings';

// ─── Add Admin Modal — superadmin only ────────────────────────────────────────
function AddAdminModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [form, setForm]     = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));

  const inp = 'w-full px-3 py-2.5 border border-soft-taupe rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-warm-bronze bg-white';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast.error('All fields are required'); return;
    }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setSaving(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: { data: { first_name: form.firstName, last_name: form.lastName, role: 'admin' } },
      });
      if (error) throw error;
      if (!data.user) throw new Error('No user returned');
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: form.email.trim().toLowerCase(),
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        role: 'admin',
        must_change_password: true,
      });
      toast.success(`Admin account created for ${form.firstName} ${form.lastName}`);
      onAdded(); onClose();
    } catch (err: any) {
      toast.error('Failed: ' + err.message);
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
            <Shield className="w-5 h-5 text-deep-bronze" />Create Admin Account
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-soft-taupe text-medium-gray text-xl">×</button>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          Admin accounts have full access across all organizations. Only create for trusted internal staff.
        </div>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-charcoal mb-1 block">First Name *</label>
              <input value={form.firstName} onChange={set('firstName')} placeholder="Jane" className={inp} />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal mb-1 block">Last Name *</label>
              <input value={form.lastName} onChange={set('lastName')} placeholder="Smith" className={inp} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-charcoal mb-1 block">Email *</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="jane@memoriaally.com" className={inp} />
          </div>
          <div>
            <label className="text-xs font-medium text-charcoal mb-1 block">Temporary Password *</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')}
                placeholder="Min 8 characters" className={inp + ' pr-10'} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-medium-gray">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-medium-gray mt-1">User will be forced to change on first login.</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-soft-taupe rounded-xl text-sm font-medium text-charcoal hover:bg-soft-taupe/30">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-deep-bronze hover:bg-warm-bronze text-white rounded-xl text-sm font-medium disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function SuperAdminLayout() {
  const { state, dispatch } = useApp();
  const perms = usePermissions();

  const [view,         setView]         = useState<SAView>('dashboard');
  const [stats,        setStats]        = useState<SystemStats | null>(null);
  const [admins,       setAdmins]       = useState<any[]>([]);
  const [masters,      setMasters]      = useState<any[]>([]);
  const [allUsers,     setAllUsers]     = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role, phone, created_at')
        .order('created_at', { ascending: false });

      if (profiles) {
        const count = (r: string) => profiles.filter((p: any) => p.role === r).length;
        setStats({
          total_users:             profiles.length,
          patientCareCoordinators: count('caregiver') + count('patient_care_coordinator'),
          therapists:              count('therapist'),
          patients:                count('patient'),
          admins:                  count('admin'),
          masters:                 count('master'),
          superadmins:             count('superadmin'),
          pending:                 count('pending'),
        });
        setAdmins(profiles.filter((p: any) => p.role === 'admin'));
        setMasters(profiles.filter((p: any) => p.role === 'master'));
        setAllUsers(profiles);
      }
    } catch (err: any) {
      toast.error('Failed to load data: ' + err.message);
    } finally { setLoading(false); }
  };

  const handleRevokeAdmin = async (userId: string, name: string) => {
    if (!confirm(`Remove admin access for ${name}?`)) return;
    try {
      await supabase.from('profiles').update({ role: 'patient_care_coordinator' }).eq('id', userId);
      toast.success(`${name}'s admin access revoked`);
      loadAll();
    } catch (err: any) {
      toast.error('Failed: ' + err.message);
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); dispatch({ type: 'LOGOUT' }); };

  // Nav — superadmin sees all sections; admin sees all except billing (not yet built) and superadmin mgmt
  const navItems: { id: SAView; label: string; icon: any; superAdminOnly?: boolean }[] = [
    { id: 'dashboard',  label: 'Dashboard',        icon: LayoutDashboard },
    { id: 'admins',     label: 'Manage Admins',    icon: Shield,     superAdminOnly: true },
    { id: 'masters',    label: 'Master Accounts',  icon: Building2 },
    { id: 'all_users',  label: 'All Users',        icon: Users },
    { id: 'hipaa',      label: 'HIPAA & BAA',      icon: FileText },
    { id: 'settings',   label: 'Settings',         icon: Settings,   superAdminOnly: true },
  ];

  // Admin sees all nav items except superadmin-only ones
  const visibleNav = navItems.filter(n => !n.superAdminOnly || perms.isSuperAdmin);

  const roleColors: Record<string, string> = {
    superadmin:               'bg-purple-100 text-purple-700',
    admin:                    'bg-deep-bronze/10 text-deep-bronze',
    master:                   'bg-warm-bronze/10 text-warm-bronze',
    therapist:                'bg-calm-blue/10 text-blue-700',
    patient:                  'bg-soft-sage/20 text-green-700',
    patient_care_coordinator: 'bg-amber-100 text-amber-700',
    caregiver:                'bg-amber-100 text-amber-700',
    pending:                  'bg-gray-100 text-gray-500',
  };

  const renderView = () => {
    switch (view) {

      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className={`bg-gradient-to-r ${perms.display.headerGradient} rounded-2xl p-6 text-white`}>
              <div className="flex items-center gap-3 mb-1">
                {perms.isSuperAdmin
                  ? <Crown className="w-6 h-6 text-white/80" />
                  : <Shield className="w-6 h-6 text-white/80" />}
                <span className="text-white/70 text-sm font-medium uppercase tracking-wider">
                  {perms.display.label}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Platform Dashboard</h1>
              <p className="text-white/70 mt-1 text-sm">
                {perms.isSuperAdmin
                  ? 'Full platform control — Super Fantastic Enterprises'
                  : 'Full access across all organizations'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats && [
                { label: 'Total Users',       value: stats.total_users,             color: 'text-charcoal' },
                { label: 'Care Coordinators', value: stats.patientCareCoordinators, color: 'text-amber-700' },
                { label: 'Patients',          value: stats.patients,                color: 'text-green-700' },
                { label: 'Therapists',        value: stats.therapists,              color: 'text-blue-700' },
                { label: 'Admins',            value: stats.admins,                  color: 'text-deep-bronze' },
                { label: 'Master Accounts',   value: stats.masters,                 color: 'text-warm-bronze' },
                { label: 'Pending',           value: stats.pending,                 color: 'text-gentle-coral' },
                ...(perms.isSuperAdmin ? [{ label: 'SuperAdmins', value: stats.superadmins, color: 'text-purple-700' }] : []),
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 border border-soft-taupe shadow-sm">
                  <p className="text-medium-gray text-xs">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'admins':
        return (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-charcoal">Admin Accounts</h2>
                <p className="text-medium-gray text-sm mt-1">
                  Create and manage platform Admin accounts.
                </p>
              </div>
              <button onClick={() => setShowAddAdmin(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-deep-bronze hover:bg-warm-bronze text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0">
                <Plus className="w-4 h-4" />Add Admin
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-soft-taupe shadow-sm overflow-hidden">
              {admins.length === 0 ? (
                <p className="text-center text-medium-gray py-12 text-sm">No admin accounts yet</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-soft-taupe/20">
                    <tr>
                      {['Name', 'Email', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-medium-gray uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soft-taupe/30">
                    {admins.map(a => (
                      <tr key={a.id} className="hover:bg-soft-taupe/10 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-deep-bronze/10 rounded-full flex items-center justify-center">
                              <span className="text-deep-bronze font-semibold text-sm">{a.first_name?.[0]}{a.last_name?.[0]}</span>
                            </div>
                            <span className="font-medium text-charcoal text-sm">{a.first_name} {a.last_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-medium-gray text-sm">{a.email}</td>
                        <td className="px-5 py-3 text-medium-gray text-sm">
                          {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => handleRevokeAdmin(a.id, `${a.first_name} ${a.last_name}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gentle-coral/10 text-gentle-coral rounded-lg hover:bg-gentle-coral/20 transition-colors text-xs font-medium">
                            <Trash2 className="w-3.5 h-3.5" />Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {showAddAdmin && <AddAdminModal onClose={() => setShowAddAdmin(false)} onAdded={loadAll} />}
          </div>
        );

      case 'masters':
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-charcoal">Master Accounts</h2>
              <p className="text-medium-gray text-sm mt-1">Facility-level managers. Each master account manages one organization.</p>
            </div>
            <div className="bg-white rounded-2xl border border-soft-taupe shadow-sm overflow-hidden">
              {masters.length === 0 ? (
                <p className="text-center text-medium-gray py-12 text-sm">No master accounts yet</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-soft-taupe/20">
                    <tr>
                      {['Name', 'Email', 'Role', 'Joined'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-medium-gray uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soft-taupe/30">
                    {masters.map(m => (
                      <tr key={m.id} className="hover:bg-soft-taupe/10 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-warm-bronze/10 rounded-full flex items-center justify-center">
                              <span className="text-warm-bronze font-semibold text-sm">{m.first_name?.[0]}{m.last_name?.[0]}</span>
                            </div>
                            <span className="font-medium text-charcoal text-sm">{m.first_name} {m.last_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-medium-gray text-sm">{m.email}</td>
                        <td className="px-5 py-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-warm-bronze/10 text-warm-bronze">Master Admin</span>
                        </td>
                        <td className="px-5 py-3 text-medium-gray text-sm whitespace-nowrap">
                          {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );

      case 'all_users':
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-charcoal">All Users</h2>
              <p className="text-medium-gray text-sm mt-1">Complete user list across all organizations.</p>
            </div>
            <div className="bg-white rounded-2xl border border-soft-taupe shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-soft-taupe/20">
                  <tr>
                    {['Name', 'Email', 'Role', 'Joined'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-medium-gray uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-taupe/30">
                  {allUsers.map(u => (
                    <tr key={u.id} className="hover:bg-soft-taupe/10 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-warm-bronze/10 rounded-full flex items-center justify-center">
                            <span className="text-warm-bronze font-semibold text-sm">{u.first_name?.[0]}{u.last_name?.[0]}</span>
                          </div>
                          <span className="font-medium text-charcoal text-sm">{u.first_name} {u.last_name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-medium-gray text-sm">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[u.role] ?? 'bg-soft-taupe text-medium-gray'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-medium-gray text-xs whitespace-nowrap">
                        {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'hipaa':
        return <HIPAACompliancePage />;

      case 'settings':
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-charcoal">System Settings</h2>
            <div className="bg-white rounded-2xl border border-soft-taupe p-6 space-y-5">
              <MFASettings />
              <div className="border-t border-soft-taupe pt-5 space-y-3">
                <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <Crown className="w-6 h-6 text-purple-700 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-charcoal">
                      SuperAdmin: {state.currentUser?.firstName} {state.currentUser?.lastName}
                    </p>
                    <p className="text-sm text-medium-gray">Enterprise owner · Super Fantastic Enterprises, LLC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-warm-ivory flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-deep-bronze border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-screen bg-warm-ivory flex overflow-hidden">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-soft-taupe z-40 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-soft-taupe gap-3 flex-shrink-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${perms.isSuperAdmin ? 'bg-purple-700' : 'bg-deep-bronze'}`}>
            {perms.isSuperAdmin ? <Crown className="w-5 h-5 text-white" /> : <Shield className="w-5 h-5 text-white" />}
          </div>
          <div>
            <p className="font-semibold text-charcoal text-sm">Memoria Ally</p>
            <p className="text-xs text-medium-gray">{perms.display.label}</p>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-soft-taupe flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${perms.isSuperAdmin ? 'bg-purple-100' : 'bg-deep-bronze/10'}`}>
              {perms.isSuperAdmin ? <Crown className="w-4 h-4 text-purple-700" /> : <Shield className="w-4 h-4 text-deep-bronze" />}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-charcoal text-sm truncate">{state.currentUser?.firstName} {state.currentUser?.lastName}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${perms.display.color}`}>{perms.display.label}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleNav.map(item => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button key={item.id} onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? perms.isSuperAdmin ? 'bg-purple-700 text-white' : 'bg-deep-bronze text-white'
                    : 'text-medium-gray hover:bg-soft-taupe hover:text-charcoal'
                }`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-soft-taupe flex-shrink-0">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-medium-gray hover:bg-gentle-coral/10 hover:text-gentle-coral transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto ml-0 md:ml-64">
        <header className="h-16 bg-white border-b border-soft-taupe flex items-center px-4 sm:px-8 sticky top-0 z-30">
          <h1 className="text-lg sm:text-xl font-semibold text-charcoal">
            {visibleNav.find(n => n.id === view)?.label}
          </h1>
        </header>
        <div className="p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
