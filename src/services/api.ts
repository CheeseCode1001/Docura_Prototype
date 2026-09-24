// ─── Docura service layer ─────────────────────────────────────────────────────
// Every page reads domain data through this module rather than importing mock
// arrays ad hoc. The functions are intentionally shaped like an HTTP client
// (resource in, resource out) so replacing `seed` with `fetch` later is a change
// confined to this file.

import * as seed from "@/data/mock";
import type {
  AdminRole, AdminRoleDefinition, AppNotification, CarePlan, CareTeamMember, Consultation, CrossBorderCase,
  Dispute, Doctor, DoctorPatient, FollowUp, HealthShare, HospitalPartner, MedicalDocument, Medication, Message,
  NotificationPreference, Patient, Payment, Payout, Pharmacy, Prescription, ProxyRelationship, Referral,
  SupportTicket, TvContent, TvCreator, TvTopic, VerificationApplication,
} from "@/data/types";

// ─── Reference data (read-only seeds) ────────────────────────────────────────
export const api = {
  doctors: (): Doctor[] => seed.DOCTORS.map((d) => ({ ...d, discovery: seed.DISCOVERY_SIGNALS[d.id] })),
  doctor: (id: string): Doctor | undefined => api.doctors().find((d) => d.id === id),
  patient: (): Patient => seed.PATIENT,
  doctorPatients: (): DoctorPatient[] => seed.DOCTOR_PATIENTS,
  carePlans: (): CarePlan[] => seed.CARE_PLANS,
  followUps: (): FollowUp[] => seed.FOLLOW_UPS,
  medications: (): Medication[] => seed.MEDICATIONS,
  documents: (): MedicalDocument[] => seed.MEDICAL_DOCUMENTS,
  healthShares: (): HealthShare[] => seed.HEALTH_SHARES,
  careTeam: (): CareTeamMember[] => seed.CARE_TEAM,
  payments: (): Payment[] => seed.PAYMENTS,
  payouts: (): Payout[] => seed.ADMIN_PAYOUTS,
  disputes: (): Dispute[] => seed.ADMIN_DISPUTES,
  verifications: (): VerificationApplication[] => seed.PENDING_VERIFICATIONS,
  crossBorderCases: (): CrossBorderCase[] => seed.CROSS_BORDER_CASES,
  pharmacies: (): Pharmacy[] => seed.PHARMACIES,
  hospitals: (): HospitalPartner[] => seed.HOSPITAL_PARTNERS,
  notificationPreferences: (): NotificationPreference[] => seed.NOTIFICATION_PREFERENCES,
  adminRoles: (): AdminRoleDefinition[] => seed.ADMIN_ROLES,
  adminRole: (id: AdminRole): AdminRoleDefinition => seed.ADMIN_ROLES.find((r) => r.id === id) || seed.ADMIN_ROLES[0],
  tvTopics: (): TvTopic[] => seed.TV_TOPICS,
  tvCreators: (): TvCreator[] => seed.TV_CREATORS,
  tvCreator: (id: string): TvCreator | undefined => seed.TV_CREATORS.find((c) => c.id === id),
  tvContent: (): TvContent[] => seed.TV_CONTENT.filter((c) => c.moderation === "published"),
  tvContentAll: (): TvContent[] => seed.TV_CONTENT,
  tvItem: (id: string): TvContent | undefined => seed.TV_CONTENT.find((c) => c.id === id),
  doctorAnalytics: () => seed.DOCTOR_ANALYTICS,
  platformAnalytics: () => seed.PLATFORM_ANALYTICS,
  patientAlerts: () => seed.PATIENT_ALERTS,
  monthlyCheckIns: () => seed.MONTHLY_CHECK_INS,
  labOrders: () => seed.LAB_ORDERS,
  prescribingRequests: () => seed.PRESCRIBING_REQUESTS,
  d2dMessages: () => seed.D2D_MESSAGES,
  professionalConcerns: () => seed.PROFESSIONAL_CONCERNS,
  practiceGrowth: () => seed.PRACTICE_GROWTH,
};

// ─── Seeds for mutable state (hydrated into AppContext) ──────────────────────
export const seeds = {
  consultations: (): Consultation[] => seed.CONSULTATIONS,
  messages: (): Message[] => seed.MESSAGES,
  prescriptions: (): Prescription[] => seed.PRESCRIPTIONS,
  notifications: (): AppNotification[] => seed.NOTIFICATIONS,
  referrals: (): Referral[] => seed.REFERRALS,
  supportTickets: (): SupportTicket[] => seed.SUPPORT_TICKETS,
  proxyRelationships: (): ProxyRelationship[] => seed.PROXY_RELATIONSHIPS,
  patientAlerts: () => seed.PATIENT_ALERTS,
  monthlyCheckIns: () => seed.MONTHLY_CHECK_INS,
  labOrders: () => seed.LAB_ORDERS,
  prescribingRequests: () => seed.PRESCRIBING_REQUESTS,
  d2dMessages: () => seed.D2D_MESSAGES,
  professionalConcerns: () => seed.PROFESSIONAL_CONCERNS,
};

// ─── Persistence ─────────────────────────────────────────────────────────────
// localStorage can throw (private mode, blocked site data), so every access is
// guarded and falls back to in-memory defaults.
export const storage = {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
    } catch {
      return fallback;
    }
  },
  readRaw(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  write(key: string, value: unknown) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — state stays in memory for this session */
    }
  },
  writeRaw(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
  remove(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

// ─── Small shared helpers ────────────────────────────────────────────────────
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function clockTime(): string {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function formatMoney(currency: string, amount: number): string {
  return `${currency}${amount.toLocaleString()}`;
}
