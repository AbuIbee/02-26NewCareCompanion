/**
 * usePermissions — Role capability definitions for Memoria Ally
 *
 * Philosophy: Every user gets FULL access to their own portal.
 * No user ever sees a locked screen, a lock icon, or a "you can't do this" message.
 * Permissions define what tools each role has available — not what is hidden from them.
 *
 * Role hierarchy:
 *   superadmin   Owner-level. Full platform control. Super Fantastic Enterprises only.
 *   admin        Internal staff. Full access across all orgs. Cannot create/delete superadmin.
 *   master       Facility/org manager. Full access within their organization.
 *   therapist    Clinical. Full PHI + behavioral access for assigned patients only.
 *   patient_care_coordinator  Care conduit. Full patient record access. Manages care execution.
 *   patient      Full access to their own account. Cannot delete account or remove caregivers.
 */

import { useApp } from '@/store/AppContext';

export function usePermissions() {
  const { state } = useApp();
  const role = (state.currentUser?.role ?? '') as string;

  const isSuperAdmin = role === 'superadmin';
  const isAdmin      = role === 'admin';
  const isMaster     = role === 'master';
  const isTherapist  = role === 'therapist';
  const isPCC        = role === 'patient_care_coordinator' || role === 'caregiver';
  const isPatient    = role === 'patient';

  return {
    // ── Role booleans ──────────────────────────────────────────────────────
    isSuperAdmin,
    isAdmin,
    isMaster,
    isTherapist,
    isPCC,
    isPatient,

    // ── Platform-level (superadmin / admin / master) ───────────────────────
    platform: {
      // SuperAdmin: full platform, creates/removes admins
      canCreateAdminAccounts:    isSuperAdmin,
      canDeleteAdminAccounts:    isSuperAdmin,
      canViewBilling:            isSuperAdmin,
      canEditSystemSettings:     isSuperAdmin,
      canViewAllOrganizations:   isSuperAdmin || isAdmin,

      // Admin: full cross-org access, cannot touch superadmin accounts
      canCreateMasterAccounts:   isSuperAdmin || isAdmin,
      canViewAuditLogs:          isSuperAdmin || isAdmin,

      // Master: full org-level control
      canManageOrgUsers:         isSuperAdmin || isAdmin || isMaster,
      canCreateCaregivers:       isSuperAdmin || isAdmin || isMaster,
      canCreateTherapists:       isSuperAdmin || isAdmin || isMaster,
      canCreatePatients:         isSuperAdmin || isAdmin || isMaster,
      canPreviewPortals:         isSuperAdmin || isAdmin || isMaster,
    },

    // ── Clinical (therapist) ──────────────────────────────────────────────
    clinical: {
      // Full PHI + behavioral access for assigned patients only
      viewAssignedPatientsOnly:  isTherapist,
      viewFullPatientRecord:     isTherapist || isPCC || isMaster || isAdmin || isSuperAdmin,
      viewPHI:                   isTherapist || isPCC || isMaster || isAdmin || isSuperAdmin,
      viewDiagnosis:             isTherapist || isPCC,
      viewMedications:           isTherapist || isPCC,
      viewBehavioralData:        isTherapist || isPCC,

      // What therapists can modify
      editCarePlans:             isTherapist,
      editBehavioralProtocols:   isTherapist,
      editTherapyNotes:          isTherapist,
      addClinicalObservations:   isTherapist,
      respondToAlerts:           isTherapist || isPCC,

      // What therapists CANNOT do (enforced by not showing those UI elements)
      canChangePatientsOutsideAssignment: false,
      canChangeAdminRoles:               false,
    },

    // ── Care coordination (patient_care_coordinator) ───────────────────────
    care: {
      viewFullPatientRecord:     isPCC || isTherapist || isMaster || isAdmin || isSuperAdmin,
      assignTherapistsToPatients: isPCC || isMaster,
      monitorCaregiverLogs:      isPCC,
      monitorAlerts:             isPCC || isTherapist,
      monitorRiskScores:         isPCC,
      escalateToTherapist:       isPCC,
      manageCareExecution:       isPCC,     // NOT clinical decisions
      communicateWithFamily:     isPCC,
      communicateWithStaff:      isPCC || isTherapist,
      communicateWithTherapists: isPCC,

      // What PCCs cannot do
      canOverrideTherapistDecisions: false,
      canPrescribeMedication:        false,
      canModifyMedicalTreatment:     false,
    },

    // ── Patient self-access ────────────────────────────────────────────────
    patient: {
      viewOwnRecord:             isPatient,
      editOwnProfile:            isPatient,
      editPersonalPreferences:   isPatient,

      // Hard limits — these UI elements simply do not appear for patients
      canDeleteOwnAccount:       false,
      canRemoveCaregivers:       false,
      canModifyCarePlans:        false,
    },

    // ── Role display metadata ──────────────────────────────────────────────
    display: {
      label: isSuperAdmin ? 'SuperAdmin'
           : isAdmin      ? 'Admin'
           : isMaster     ? 'Master Admin'
           : isTherapist  ? 'Therapist'
           : isPCC        ? 'Care Coordinator'
           : isPatient    ? 'Patient'
           : 'User',

      color: isSuperAdmin ? 'bg-purple-100 text-purple-700'
           : isAdmin      ? 'bg-deep-bronze/10 text-deep-bronze'
           : isMaster     ? 'bg-warm-bronze/10 text-warm-bronze'
           : isTherapist  ? 'bg-calm-blue/10 text-blue-700'
           : isPCC        ? 'bg-amber-100 text-amber-700'
           : isPatient    ? 'bg-soft-sage/20 text-green-700'
           : 'bg-soft-taupe text-medium-gray',

      headerGradient: isSuperAdmin ? 'from-purple-900 to-deep-bronze'
                    : isAdmin      ? 'from-deep-bronze to-warm-bronze'
                    : isMaster     ? 'from-warm-bronze to-amber-600'
                    : isTherapist  ? 'from-calm-blue to-blue-700'
                    : 'from-warm-bronze to-amber-500',

      accentClass: isSuperAdmin ? 'bg-purple-700'
                 : isAdmin      ? 'bg-deep-bronze'
                 : isMaster     ? 'bg-warm-bronze'
                 : isTherapist  ? 'bg-calm-blue'
                 : isPCC        ? 'bg-warm-bronze'
                 : 'bg-soft-sage',
    },
  };
}
