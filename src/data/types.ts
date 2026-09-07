// ─── Docura domain types ──────────────────────────────────────────────────────
// Single source of truth for every entity the frontend renders. Mock seeds in
// `@/data/mock` and the live state in `@/context/AppContext` both use these, so
// swapping the mock repository for a real API only means changing the service
// layer in `@/services/api`.

export type Country = "Nigeria" | "United Kingdom";
export type Availability = "online" | "available-today" | "away" | "offline";
export type CareType = "now" | "care";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  country: Country;
  license: string;
  licenseNum: string;
  experience: number;
  patients: number;
  rating: number;
  reviews: number;
  languages: string[];
  availability: Availability;
  responseTime: string;
  monthlyPrice: number;
  consultationPrice: number;
  currency: string;
  bio: string;
  verified: boolean;
  photo: string;
  conditions: string[];
  isPrescribing?: boolean;
  /** Discovery Score inputs — surfaced to patients so ranking is explainable. */
  discovery?: DiscoverySignals;
}

export interface DiscoverySignals {
  score: number;
  responsiveness: number;
  continuity: number;
  patientRating: number;
  availability: number;
  /** Rotation keeps newer verified doctors visible rather than entrenching rank. */
  rotationBoost: boolean;
  reasons: string[];
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  dob: string;
  country: Country;
  language: string;
  bloodGroup: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
  personalDoctorId: string;
  prescribingDoctorId: string;
  photo: string;
}

export interface Consultation {
  id: string;
  type: CareType;
  doctorId: string;
  date: string;
  status: "completed" | "scheduled" | "cancelled" | "in-progress";
  summary: string;
  diagnosis: string;
  notes: string;
  hasPrescription: boolean;
  prescriptionId?: string;
  channel?: "video" | "audio" | "chat";
}

export interface Prescription {
  id: string;
  consultationId: string;
  doctorId: string;
  doctorName: string;
  personalDoctorName?: string;
  date: string;
  status: "active" | "used" | "expired";
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  crossBorder: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  date: string;
  status: "unread" | "delivered" | "read";
  isDoctor: boolean;
}

export type NotificationAudience = "patient" | "doctor" | "proxy" | "admin" | "enterprise";

export interface AppNotification {
  id: string;
  audience: NotificationAudience;
  type: "message" | "prescription" | "payment" | "system" | "consultation" | "follow-up" | "support" | "referral" | "verification";
  title: string;
  body: string;
  time: string;
  date: string;
  read: boolean;
  page: string;
}

export interface Payment {
  id: string;
  date: string;
  description: string;
  doctor: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded" | "disputed";
}

export interface DoctorPatient {
  id: string;
  name: string;
  country: Country;
  careStatus: string;
  lastConsultation: string;
  nextAction: string;
  photo: string;
  type: CareType;
  crossBorder: boolean;
}

export interface VerificationApplication {
  id: string;
  name: string;
  specialty: string;
  country: Country;
  license: string;
  submitted: string;
  status: "under-review" | "documents-submitted" | "more-info-required";
  photo: string;
}

export interface CrossBorderCase {
  id: string;
  patient: string;
  personalDoctor: string;
  patientCountry: Country;
  prescribingCountry: Country;
  status: "assigned" | "awaiting-assignment";
  prescribingDoctor?: string;
  date: string;
}

export interface Payout {
  id: string;
  doctor: string;
  amount: number;
  currency: string;
  country: Country;
  requested: string;
  status: "requested" | "processing" | "paid";
}

export interface Dispute {
  id: string;
  patient: string;
  doctor: string;
  issue: string;
  date: string;
  status: "open" | "investigating" | "resolved";
  admin: string;
}

export interface CarePlan {
  id: string;
  title: string;
  goal: string;
  doctorId: string;
  doctorName: string;
  status: "active" | "completed" | "paused";
  startDate: string;
  nextReview: string;
  progress: number;
  recommendations: string[];
  linkedMedications: string[];
  nextFollowUp: string;
  lastUpdated: string;
  updates: { date: string; note: string; by: string }[];
}

export interface FollowUp {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorPhoto: string;
  consultationId: string;
  reason: string;
  scheduledDate: string;
  status: "upcoming" | "completed" | "missed";
  type: CareType;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  status: "current" | "past";
  doctorId: string;
  doctorName: string;
  prescriptionId: string;
  instructions: string;
  purpose: string;
  adherence: number;
  remindersEnabled: boolean;
  reminderTimes: string[];
  carePlanId: string | null;
  lastTaken: string;
  todayTaken: boolean;
}

export interface MedicalDocument {
  id: string;
  type: string;
  title: string;
  date: string;
  doctor: string;
  consultationId: string | null;
  status: "uploaded" | "processing";
  size: string;
  format: string;
  description: string;
}

export interface HealthShare {
  id: string;
  sharedWith: string;
  sharedWithRole: string;
  items: string[];
  created: string;
  expires: string;
  status: "active" | "expired" | "revoked";
  link: string;
}

export interface CareTeamMember {
  id: string;
  doctorId: string;
  name: string;
  specialty: string;
  country: Country;
  photo: string;
  role: string;
  status: "active" | "inactive";
  since: string;
  consultations: number;
  availability: Availability;
}

// ─── V2.0 — Docura Proxy ──────────────────────────────────────────────────────
export type PermissionScope =
  | "view-summary"
  | "view-medications"
  | "view-consultations"
  | "view-documents"
  | "book-consultations"
  | "message-care-team"
  | "manage-payments"
  | "view-full-record";

export interface ProxyPermission {
  scope: PermissionScope;
  label: string;
  description: string;
  granted: boolean;
  /** Scopes the patient has never delegated cannot be self-granted by a proxy. */
  sensitive: boolean;
}

export interface ProxyRelationship {
  id: string;
  proxyName: string;
  proxyRelationship: string;
  patientId: string;
  patientName: string;
  patientPhoto: string;
  status: "active" | "pending" | "revoked" | "expired";
  consentGivenAt: string;
  expiresAt: string;
  permissions: ProxyPermission[];
  emergencyContact: boolean;
}

// ─── V2.2 — Referrals ─────────────────────────────────────────────────────────
export interface Referral {
  id: string;
  kind: "doctor" | "pharmacy";
  patientId: string;
  patientName: string;
  fromDoctor: string;
  toName: string;
  toDetail: string;
  reason: string;
  date: string;
  status: "pending" | "accepted" | "declined" | "completed";
  notes?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  city: string;
  country: Country;
  distance: string;
  dispenses: string[];
  verified: boolean;
}

// ─── V2.3 — Support ───────────────────────────────────────────────────────────
export interface SupportReply {
  id: string;
  author: string;
  role: "patient" | "doctor" | "support" | "system";
  text: string;
  at: string;
  internal?: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: "account" | "payments" | "consultations" | "prescriptions" | "technical" | "other";
  openedBy: string;
  openedByRole: "patient" | "doctor" | "proxy" | "enterprise";
  createdAt: string;
  updatedAt: string;
  status: "open" | "in-progress" | "waiting" | "resolved";
  priority: "low" | "normal" | "high";
  assignee: string | null;
  replies: SupportReply[];
  /** Support staff never see clinical detail unless the user attaches it. */
  clinicalAccess: false;
}

export interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  channels: { inApp: boolean; email: boolean; sms: boolean; whatsapp: boolean };
}

// ─── V3.0 — Hospitals & connectivity ──────────────────────────────────────────
export interface HospitalPartner {
  id: string;
  name: string;
  city: string;
  country: Country;
  type: "Teaching hospital" | "Private hospital" | "Clinic network" | "Diagnostics";
  services: string[];
  status: "active" | "onboarding";
  referralsThisMonth: number;
  /** Partners never receive doctor-patient conversation content. */
  dataScope: string[];
}

// ─── V4.0 — Docura TV ─────────────────────────────────────────────────────────
export interface TvCreator {
  id: string;
  name: string;
  credential: string;
  country: Country;
  photo: string;
  followers: number;
  verified: boolean;
  verificationBody: string;
  bio: string;
  topics: string[];
}

export interface TvContent {
  id: string;
  title: string;
  creatorId: string;
  topic: string;
  duration: string;
  views: number;
  published: string;
  thumbnail: string;
  summary: string;
  transcript: string[];
  moderation: "published" | "in-review" | "restricted";
  language: string;
}

export interface TvTopic {
  id: string;
  label: string;
  description: string;
  emoji: string;
}

// ─── V2.1 — Admin roles & analytics ───────────────────────────────────────────
export type AdminRole = "super-admin" | "operations" | "finance" | "support" | "medical-board";

export interface AdminRoleDefinition {
  id: AdminRole;
  label: string;
  summary: string;
  /** Pages this internal role may open. Enforced in the router, not just the nav. */
  pages: string[];
}

export interface EnterpriseMember {
  id: string;
  name: string;
  email?: string;
  dept: string;
  status: "active" | "pending" | "inactive";
  lastSeen: string;
}

export interface EnterpriseProgram {
  id: string;
  name: string;
  members: number;
  enrolled: number;
  color: string;
}
