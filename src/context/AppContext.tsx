import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { api, seeds, storage, today, clockTime, uid } from "@/services/api";
import type {
  AdminRole, AppNotification, CarePlan, Consultation, EnterpriseMember, EnterpriseProgram, FollowUp, Message,
  NotificationAudience, NotificationPreference, PermissionScope, Prescription, ProxyRelationship, Referral,
  SupportTicket, PatientAlert, MonthlyCheckIn, LabOrder, LabCategory, PrescribingRequest, D2DMessage, ProfessionalConcern,
} from "@/data/types";

// ─── Types ────────────────────────────────────────────────────────────────────
export type UserRole = "patient" | "doctor" | "proxy" | "admin" | "enterprise" | null;
export type { EnterpriseMember, EnterpriseProgram };

export interface DomainState {
  consultations: Consultation[];
  messages: Message[];
  prescriptions: Prescription[];
  notifications: AppNotification[];
  notificationPreferences: NotificationPreference[];
  supportTickets: SupportTicket[];
  referrals: Referral[];
  proxyRelationships: ProxyRelationship[];
  carePlans: CarePlan[];
  followUps: FollowUp[];
  savedContent: string[];
  subscriptions: { id: string; patientId: string; doctorId: string; status: "active"; price: number; currency: string; startedAt: string }[];
  verificationDecisions: { id: string; status: "approved" | "rejected" | "more-info-required"; note?: string; updatedAt: string }[];
  paymentOverrides: { id: string; status: "paid" | "pending" | "failed" | "refunded" | "disputed" }[];
  extraPayments: { id: string; date: string; description: string; doctor: string; amount: number; currency: string; status: "paid" | "pending" | "failed" | "refunded" | "disputed" }[];
  activity: { id: string; title: string; detail: string; tone: "success" | "warning" | "info"; createdAt: string }[];
  enterpriseMembers: EnterpriseMember[];
  enterprisePrograms: EnterpriseProgram[];
  enterpriseActivity: { id: string; text: string; time: string; type: "success" | "warn" | "info" }[];
  patientAlerts: PatientAlert[];
  monthlyCheckIns: MonthlyCheckIn[];
  labOrders: LabOrder[];
  prescribingRequests: PrescribingRequest[];
  d2dMessages: D2DMessage[];
  professionalConcerns: ProfessionalConcern[];
  lockedConsultations: Record<string, { note: string; lockedAt: string; addenda: { id: string; text: string; createdAt: string; doctorName: string }[] }>;
  activeWorkspaceRole: "personal" | "prescribing";
}

const DOMAIN_KEY = "docura-domain-state";
const ROLE_KEY = "docura-role";
const ADMIN_ROLE_KEY = "docura-admin-role";
const SESSION_KEY = "docura-session";
const ONBOARDING_KEY = "docura-onboarding";
const ROLE_VALUES: UserRole[] = ["patient", "doctor", "proxy", "admin", "enterprise"];
const ADMIN_ROLE_VALUES: AdminRole[] = ["super-admin", "operations", "finance", "support", "medical-board"];

function initialDomain(): DomainState {
  return {
    consultations: seeds.consultations(),
    messages: seeds.messages(),
    prescriptions: seeds.prescriptions(),
    notifications: seeds.notifications(),
    notificationPreferences: api.notificationPreferences(),
    supportTickets: seeds.supportTickets(),
    referrals: seeds.referrals(),
    proxyRelationships: seeds.proxyRelationships(),
    carePlans: api.carePlans(),
    followUps: api.followUps(),
    savedContent: [],
    subscriptions: [],
    verificationDecisions: [],
    paymentOverrides: [],
    extraPayments: [],
    activity: [],
    enterpriseMembers: [],
    enterprisePrograms: [],
    enterpriseActivity: [],
    patientAlerts: seeds.patientAlerts(),
    monthlyCheckIns: seeds.monthlyCheckIns(),
    labOrders: seeds.labOrders(),
    prescribingRequests: seeds.prescribingRequests(),
    d2dMessages: seeds.d2dMessages(),
    professionalConcerns: seeds.professionalConcerns(),
    lockedConsultations: {},
    activeWorkspaceRole: "personal",
  };
}

function readDomainState(): DomainState {
  const base = initialDomain();
  const raw = storage.readRaw(DOMAIN_KEY);
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<DomainState>;
    // Merge key by key so a seed added in a later release still appears for
    // someone whose browser holds an older snapshot.
    return { ...base, ...parsed } as DomainState;
  } catch {
    return base;
  }
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface AppContextType {
  page: string;
  params: Record<string, string>;
  history: string[];
  role: UserRole;
  adminRole: AdminRole;
  domain: DomainState;
  session: { authenticated: boolean; onboardingComplete: boolean };
  navigate: (page: string, params?: Record<string, string>) => void;
  back: () => void;
  setRole: (role: UserRole) => void;
  setAdminRole: (role: AdminRole) => void;
  signOut: () => void;
  markOnboardingComplete: () => void;
  // Care
  createConsultation: (input: { doctorId: string; type: "now" | "care"; price: number; currency: string; channel?: "video" | "audio" | "chat" }) => void;
  activateSubscription: (input: { doctorId: string; price: number; currency: string }) => void;
  addMessage: (input: { senderId: string; senderName: string; text: string; isDoctor: boolean }) => void;
  issuePrescription: (input: { doctorId: string; doctorName: string; medication: string; dosage: string; frequency: string; duration: string; instructions: string; consultationId?: string; crossBorder?: boolean }) => void;
  createCarePlan: (input: { title: string; goal: string; doctorId: string; doctorName: string; recommendations: string[] }) => void;
  scheduleFollowUp: (input: { doctorId: string; doctorName: string; doctorPhoto: string; reason: string; scheduledDate: string; consultationId?: string; type?: "now" | "care" }) => void;
  completeFollowUp: (id: string) => void;
  // Trust & money
  updateVerification: (input: { id: string; status: "approved" | "rejected" | "more-info-required"; note?: string }) => void;
  updatePayment: (id: string, status: "paid" | "pending" | "failed" | "refunded" | "disputed") => void;
  // Referrals
  createReferral: (input: { kind: "doctor" | "pharmacy"; patientId: string; patientName: string; fromDoctor: string; toName: string; toDetail: string; reason: string }) => void;
  updateReferral: (id: string, status: Referral["status"]) => void;
  // Support
  createSupportTicket: (input: { subject: string; category: SupportTicket["category"]; message: string; openedBy: string; openedByRole: SupportTicket["openedByRole"]; priority?: SupportTicket["priority"] }) => string;
  replySupportTicket: (id: string, input: { author: string; role: "patient" | "doctor" | "support"; text: string; internal?: boolean }) => void;
  updateSupportTicket: (id: string, changes: { status?: SupportTicket["status"]; assignee?: string | null; priority?: SupportTicket["priority"] }) => void;
  // Proxy
  setProxyPermission: (relationshipId: string, scope: PermissionScope, granted: boolean) => void;
  updateProxyStatus: (relationshipId: string, status: ProxyRelationship["status"], expiresAt?: string) => void;
  // Docura TV
  toggleSavedContent: (contentId: string) => void;
  // Notifications
  addNotification: (input: { audience: NotificationAudience; type: AppNotification["type"]; title: string; body: string; page: string }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (audience: NotificationAudience) => void;
  setNotificationChannel: (id: string, channel: keyof NotificationPreference["channels"], value: boolean) => void;
  unreadCount: number;
  // Enterprise
  inviteEnterpriseMember: (email: string) => void;
  createEnterpriseProgram: () => void;
  // Proactive Patient Alerts
  resolvePatientAlert: (id: string) => void;
  snoozePatientAlert: (id: string, days?: number) => void;
  // Monthly Check-ins
  sendMonthlyCheckIn: (id: string, customMessage?: string) => void;
  // Lab Orders
  orderLabTest: (input: { patientId: string; patientName: string; category: LabCategory; testName: string; clinicalIndication: string; urgency: "routine" | "urgent" }) => void;
  reviewLabOrder: (id: string, clinicalNote: string) => void;
  // Cross-Border Prescribing Workspace
  approvePrescriptionRequest: (id: string, independentClinicalNote: string) => void;
  declinePrescriptionRequest: (id: string, declineReason: string) => void;
  escalatePrescriptionRequest: (id: string) => void;
  sendD2DMessage: (input: { threadType: "patient-clinical" | "general"; patientId?: string; patientName?: string; recipientDoctorId: string; recipientDoctorName: string; text: string; isUrgent?: boolean }) => void;
  // Professional Concerns
  respondProfessionalConcern: (id: string, response: string) => void;
  // Consultation Care Episode
  lockConsultationNote: (consultationId: string, note: string) => void;
  addConsultationAddendum: (consultationId: string, text: string) => void;
  // Workspace Switcher
  setActiveWorkspaceRole: (role: "personal" | "prescribing") => void;
  // Toasts
  toasts: Toast[];
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = storage.readRaw(ROLE_KEY);
    return ROLE_VALUES.includes(saved as UserRole) ? (saved as UserRole) : null;
  });
  const [adminRole, setAdminRoleState] = useState<AdminRole>(() => {
    const saved = storage.readRaw(ADMIN_ROLE_KEY);
    return ADMIN_ROLE_VALUES.includes(saved as AdminRole) ? (saved as AdminRole) : "super-admin";
  });
  const [page, setPage] = useState(() => {
    const saved = storage.readRaw(ROLE_KEY);
    return ROLE_VALUES.includes(saved as UserRole) ? `${saved}-dashboard` : "landing";
  });
  const [params, setParams] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [domain, setDomain] = useState<DomainState>(readDomainState);
  const [session, setSession] = useState(() => ({
    authenticated: storage.readRaw(SESSION_KEY) === "active",
    onboardingComplete: storage.readRaw(ONBOARDING_KEY) === "complete",
  }));

  const updateDomain = useCallback((updater: (current: DomainState) => DomainState) => {
    setDomain((current) => {
      const next = updater(current);
      storage.write(DOMAIN_KEY, next);
      return next;
    });
  }, []);

  // ─── Navigation ────────────────────────────────────────────────────────────
  const navigate = useCallback((newPage: string, newParams: Record<string, string> = {}) => {
    setHistory((h) => [...h, page]);
    setPage(newPage);
    setParams(newParams);
    window.scrollTo(0, 0);
  }, [page]);

  const back = useCallback(() => {
    setHistory((h) => {
      const prev = [...h];
      const target = prev.pop();
      if (target) { setPage(target); setParams({}); }
      return prev;
    });
  }, []);

  const setRole = useCallback((nextRole: UserRole) => {
    setRoleState(nextRole);
    if (nextRole) storage.writeRaw(ROLE_KEY, nextRole);
    else storage.remove(ROLE_KEY);
  }, []);

  const setAdminRole = useCallback((nextRole: AdminRole) => {
    setAdminRoleState(nextRole);
    storage.writeRaw(ADMIN_ROLE_KEY, nextRole);
  }, []);

  const signOut = useCallback(() => {
    setRoleState(null);
    setSession({ authenticated: false, onboardingComplete: false });
    storage.remove(ROLE_KEY);
    storage.remove(SESSION_KEY);
    storage.remove(ONBOARDING_KEY);
    setPage("landing");
    setParams({});
    setHistory([]);
  }, []);

  const markOnboardingComplete = useCallback(() => {
    setSession({ authenticated: true, onboardingComplete: true });
    storage.writeRaw(SESSION_KEY, "active");
    storage.writeRaw(ONBOARDING_KEY, "complete");
  }, []);

  // ─── Notifications ─────────────────────────────────────────────────────────
  // Every state-changing action below routes through `notify` so the bell, the
  // notification page and the dashboards can never disagree about what happened.
  type NotifyInput = { audience: NotificationAudience; type: AppNotification["type"]; title: string; body: string; page: string };

  /** Applies one or more events against the current preferences in a single pass. */
  function notify(current: DomainState, ...inputs: NotifyInput[]): AppNotification[] {
    const gate: Record<string, string> = { message: "np1", prescription: "np2", "follow-up": "np3", payment: "np4" };
    return inputs.reduce<AppNotification[]>((list, input) => {
      const preference = current.notificationPreferences.find((item) => item.id === gate[input.type]);
      if (preference && !preference.channels.inApp) return list;
      return [{ id: uid("n"), read: false, date: today(), time: clockTime(), ...input }, ...list];
    }, current.notifications);
  }

  const addNotification = useCallback((input: { audience: NotificationAudience; type: AppNotification["type"]; title: string; body: string; page: string }) => {
    updateDomain((current) => ({ ...current, notifications: notify(current, input) }));
  }, [updateDomain]);

  const markNotificationRead = useCallback((id: string) => {
    updateDomain((current) => ({ ...current, notifications: current.notifications.map((item) => (item.id === id ? { ...item, read: true } : item)) }));
  }, [updateDomain]);

  const markAllNotificationsRead = useCallback((audience: NotificationAudience) => {
    updateDomain((current) => ({ ...current, notifications: current.notifications.map((item) => (item.audience === audience ? { ...item, read: true } : item)) }));
  }, [updateDomain]);

  const setNotificationChannel = useCallback((id: string, channel: keyof NotificationPreference["channels"], value: boolean) => {
    updateDomain((current) => ({
      ...current,
      notificationPreferences: current.notificationPreferences.map((item) => (item.id === id ? { ...item, channels: { ...item.channels, [channel]: value } } : item)),
    }));
  }, [updateDomain]);

  const unreadCount = useMemo(() => {
    const audience: NotificationAudience = role && role !== null ? role : "patient";
    return domain.notifications.filter((item) => item.audience === audience && !item.read).length;
  }, [domain.notifications, role]);

  // ─── Care actions ──────────────────────────────────────────────────────────
  const createConsultation = useCallback((input: { doctorId: string; type: "now" | "care"; price: number; currency: string; channel?: "video" | "audio" | "chat" }) => {
    const doctor = api.doctor(input.doctorId);
    updateDomain((current) => {
      const consultation: Consultation = {
        id: uid("c"),
        doctorId: input.doctorId,
        type: input.type,
        date: today(),
        status: "completed",
        summary: input.type === "now" ? "Docura Now consultation completed." : "Personal care consultation completed.",
        diagnosis: "Awaiting doctor summary",
        notes: "Consultation completed in demo mode.",
        hasPrescription: false,
        channel: input.channel || "video",
      };
      return {
        ...current,
        consultations: [...current.consultations, consultation],
        extraPayments: [{ id: uid("pay"), date: today(), description: input.type === "now" ? "Docura Now — One-off consultation" : "Docura Care — Consultation", doctor: doctor?.name || "Docura doctor", amount: input.price, currency: input.currency, status: "paid" }, ...current.extraPayments],
        notifications: notify(current,
          { audience: "patient", type: "consultation", title: "Consultation completed", body: `Your ${input.type === "now" ? "Docura Now" : "Docura Care"} consultation with ${doctor?.name || "your doctor"} is on your record.`, page: "patient-consultations" },
          { audience: "patient", type: "payment", title: "Payment confirmed", body: `${input.currency}${input.price.toLocaleString()} paid for your consultation.`, page: "patient-payments" },
          { audience: "doctor", type: "consultation", title: "Consultation recorded", body: `A ${input.type === "now" ? "Docura Now" : "Docura Care"} consultation was completed and added to the shared record.`, page: "doctor-consultations" },
        ),
        activity: [{ id: uid("activity"), title: "Consultation completed", detail: `${doctor?.name || "Doctor"} · ${input.type}`, tone: "success", createdAt: new Date().toISOString() }, ...current.activity],
      };
    });
  }, [updateDomain]);

  const activateSubscription = useCallback((input: { doctorId: string; price: number; currency: string }) => {
    const doctor = api.doctor(input.doctorId);
    const patient = api.patient();
    updateDomain((current) => ({
      ...current,
      subscriptions: [...current.subscriptions.filter((item) => item.patientId !== patient.id), { id: uid("sub"), patientId: patient.id, doctorId: input.doctorId, status: "active", price: input.price, currency: input.currency, startedAt: today() }],
      extraPayments: [{ id: uid("pay"), date: today(), description: "Docura Care — Monthly subscription", doctor: doctor?.name || "Docura doctor", amount: input.price, currency: input.currency, status: "paid" }, ...current.extraPayments],
      notifications: notify(current,
        { audience: "patient", type: "system", title: "Docura Care started", body: `${doctor?.name || "Your doctor"} is now your personal doctor.`, page: "care-team" },
        { audience: "patient", type: "payment", title: "Subscription payment confirmed", body: `${input.currency}${input.price.toLocaleString()} paid for your monthly care.`, page: "patient-payments" },
        { audience: "doctor", type: "system", title: "New care relationship", body: `${patient.name} started Docura Care with you.`, page: "doctor-patients" },
      ),
      activity: [{ id: uid("activity"), title: "Care relationship started", detail: `${patient.name} → ${doctor?.name || "Doctor"}`, tone: "success", createdAt: new Date().toISOString() }, ...current.activity],
    }));
  }, [updateDomain]);

  const addMessage = useCallback((input: { senderId: string; senderName: string; text: string; isDoctor: boolean }) => {
    updateDomain((current) => ({
      ...current,
      messages: [...current.messages, { ...input, id: uid("m"), time: clockTime(), date: today(), status: "delivered" as const }],
      notifications: notify(current, {
        audience: input.isDoctor ? "patient" : "doctor",
        type: "message",
        title: input.isDoctor ? `${input.senderName} replied` : `New message from ${input.senderName}`,
        body: input.text.slice(0, 90),
        page: input.isDoctor ? "patient-chat" : "doctor-chat",
      }),
    }));
  }, [updateDomain]);

  const issuePrescription = useCallback((input: { doctorId: string; doctorName: string; medication: string; dosage: string; frequency: string; duration: string; instructions: string; consultationId?: string; crossBorder?: boolean }) => {
    updateDomain((current) => ({
      ...current,
      prescriptions: [{
        id: uid("rx"),
        consultationId: input.consultationId || current.consultations[current.consultations.length - 1]?.id || "c1",
        doctorId: input.doctorId,
        doctorName: input.doctorName,
        date: today(),
        status: "active" as const,
        medication: input.medication,
        dosage: input.dosage,
        frequency: input.frequency,
        duration: input.duration,
        instructions: input.instructions,
        crossBorder: Boolean(input.crossBorder),
      }, ...current.prescriptions],
      notifications: notify(current, { audience: "patient", type: "prescription", title: "Prescription ready", body: `${input.doctorName} issued ${input.medication} ${input.dosage}.`, page: "patient-prescriptions" }),
      activity: [{ id: uid("activity"), title: "Prescription issued", detail: `${input.medication} · ${input.doctorName}`, tone: "success", createdAt: new Date().toISOString() }, ...current.activity],
    }));
  }, [updateDomain]);

  const createCarePlan = useCallback((input: { title: string; goal: string; doctorId: string; doctorName: string; recommendations: string[] }) => {
    updateDomain((current) => ({
      ...current,
      carePlans: [{
        id: uid("cp"),
        title: input.title,
        goal: input.goal,
        doctorId: input.doctorId,
        doctorName: input.doctorName,
        status: "active" as const,
        startDate: today(),
        nextReview: today(),
        progress: 0,
        recommendations: input.recommendations,
        linkedMedications: [],
        nextFollowUp: "To be scheduled",
        lastUpdated: today(),
        updates: [{ date: today(), note: "Care plan created.", by: input.doctorName }],
      }, ...current.carePlans],
      notifications: notify(current, { audience: "patient", type: "system", title: "New care plan", body: `${input.doctorName} created "${input.title}" for you.`, page: "patient-care-plans" }),
    }));
  }, [updateDomain]);

  const scheduleFollowUp = useCallback((input: { doctorId: string; doctorName: string; doctorPhoto: string; reason: string; scheduledDate: string; consultationId?: string; type?: "now" | "care" }) => {
    updateDomain((current) => ({
      ...current,
      followUps: [{
        id: uid("fu"),
        doctorId: input.doctorId,
        doctorName: input.doctorName,
        doctorPhoto: input.doctorPhoto,
        consultationId: input.consultationId || "c1",
        reason: input.reason,
        scheduledDate: input.scheduledDate,
        status: "upcoming" as const,
        type: input.type || "care",
      }, ...current.followUps],
      notifications: notify(current, { audience: "patient", type: "follow-up", title: "Follow-up scheduled", body: `${input.doctorName} scheduled a follow-up for ${input.scheduledDate}.`, page: "follow-ups" }),
    }));
  }, [updateDomain]);

  const completeFollowUp = useCallback((id: string) => {
    updateDomain((current) => {
      const followUp = current.followUps.find((item) => item.id === id);
      return {
        ...current,
        followUps: current.followUps.map((item) => (item.id === id ? { ...item, status: "completed" as const } : item)),
        notifications: followUp ? notify(current, { audience: "patient", type: "follow-up", title: "Follow-up completed", body: `${followUp.reason} was marked complete.`, page: "follow-ups" }) : current.notifications,
      };
    });
  }, [updateDomain]);

  // ─── Trust & money ─────────────────────────────────────────────────────────
  const updateVerification = useCallback((input: { id: string; status: "approved" | "rejected" | "more-info-required"; note?: string }) => {
    const application = api.verifications().find((item) => item.id === input.id);
    updateDomain((current) => ({
      ...current,
      verificationDecisions: [...current.verificationDecisions.filter((item) => item.id !== input.id), { ...input, updatedAt: today() }],
      notifications: notify(current, { audience: "doctor", type: "verification", title: `Verification ${input.status.replace(/-/g, " ")}`, body: input.note || `${application?.name || "Your application"} was reviewed by the Docura medical board.`, page: "doctor-verification" }),
      activity: [{ id: uid("activity"), title: `Doctor verification ${input.status.replace(/-/g, " ")}`, detail: application?.name || input.id, tone: input.status === "approved" ? "success" : "warning", createdAt: new Date().toISOString() }, ...current.activity],
    }));
  }, [updateDomain]);

  const updatePayment = useCallback((id: string, status: "paid" | "pending" | "failed" | "refunded" | "disputed") => {
    const payment = api.payments().find((item) => item.id === id);
    updateDomain((current) => ({
      ...current,
      paymentOverrides: [...current.paymentOverrides.filter((item) => item.id !== id), { id, status }],
      extraPayments: current.extraPayments.map((item) => (item.id === id ? { ...item, status } : item)),
      notifications: notify(current, { audience: "patient", type: "payment", title: `Payment ${status}`, body: payment?.description || "A transaction on your account changed status.", page: "patient-payments" }),
      activity: [{ id: uid("activity"), title: `Payment ${status}`, detail: payment?.description || id, tone: status === "failed" || status === "disputed" ? "warning" : "success", createdAt: new Date().toISOString() }, ...current.activity],
    }));
  }, [updateDomain]);

  // ─── Referrals ─────────────────────────────────────────────────────────────
  const createReferral = useCallback((input: { kind: "doctor" | "pharmacy"; patientId: string; patientName: string; fromDoctor: string; toName: string; toDetail: string; reason: string }) => {
    updateDomain((current) => ({
      ...current,
      referrals: [{ ...input, id: uid("ref"), date: today(), status: "pending" as const }, ...current.referrals],
      notifications: notify(current, { audience: "patient", type: "referral", title: `${input.kind === "doctor" ? "Referral" : "Pharmacy referral"} created`, body: `${input.fromDoctor} referred you to ${input.toName}.`, page: "patient-referrals" }),
    }));
  }, [updateDomain]);

  const updateReferral = useCallback((id: string, status: Referral["status"]) => {
    updateDomain((current) => ({
      ...current,
      referrals: current.referrals.map((item) => (item.id === id ? { ...item, status } : item)),
      notifications: notify(current, { audience: "patient", type: "referral", title: `Referral ${status}`, body: `Your referral status changed to ${status}.`, page: "patient-referrals" }),
    }));
  }, [updateDomain]);

  // ─── Support ───────────────────────────────────────────────────────────────
  const createSupportTicket = useCallback((input: { subject: string; category: SupportTicket["category"]; message: string; openedBy: string; openedByRole: SupportTicket["openedByRole"]; priority?: SupportTicket["priority"] }) => {
    const id = uid("sup");
    updateDomain((current) => ({
      ...current,
      supportTickets: [{
        id,
        subject: input.subject,
        category: input.category,
        openedBy: input.openedBy,
        openedByRole: input.openedByRole,
        createdAt: today(),
        updatedAt: today(),
        status: "open" as const,
        priority: input.priority || "normal",
        assignee: null,
        clinicalAccess: false as const,
        replies: [{ id: uid("sr"), author: input.openedBy, role: input.openedByRole === "doctor" ? "doctor" : "patient", text: input.message, at: `${today()} ${clockTime()}` }],
      }, ...current.supportTickets],
      notifications: notify(current, { audience: "admin", type: "support", title: "New support ticket", body: `${input.openedBy}: ${input.subject}`, page: "admin-support" }),
    }));
    return id;
  }, [updateDomain]);

  const replySupportTicket = useCallback((id: string, input: { author: string; role: "patient" | "doctor" | "support"; text: string; internal?: boolean }) => {
    updateDomain((current) => {
      const ticket = current.supportTickets.find((item) => item.id === id);
      return {
        ...current,
        supportTickets: current.supportTickets.map((item) => (item.id === id
          ? { ...item, updatedAt: today(), status: input.role === "support" && item.status === "open" ? "in-progress" as const : item.status, replies: [...item.replies, { id: uid("sr"), at: `${today()} ${clockTime()}`, ...input }] }
          : item)),
        notifications: input.internal
          ? current.notifications
          : notify(current, {
            audience: input.role === "support" ? (ticket?.openedByRole === "doctor" ? "doctor" : "patient") : "admin",
            type: "support",
            title: input.role === "support" ? "Support replied" : "New reply on ticket",
            body: `${ticket?.subject || "Support ticket"} — ${input.text.slice(0, 70)}`,
            page: input.role === "support" ? "support-center" : "admin-support",
          }),
      };
    });
  }, [updateDomain]);

  const updateSupportTicket = useCallback((id: string, changes: { status?: SupportTicket["status"]; assignee?: string | null; priority?: SupportTicket["priority"] }) => {
    updateDomain((current) => {
      const ticket = current.supportTickets.find((item) => item.id === id);
      return {
        ...current,
        supportTickets: current.supportTickets.map((item) => (item.id === id ? { ...item, ...changes, updatedAt: today() } : item)),
        notifications: changes.status === "resolved" && ticket
          ? notify(current, { audience: ticket.openedByRole === "doctor" ? "doctor" : "patient", type: "support", title: "Ticket resolved", body: ticket.subject, page: "support-center" })
          : current.notifications,
      };
    });
  }, [updateDomain]);

  // ─── Proxy ─────────────────────────────────────────────────────────────────
  const setProxyPermission = useCallback((relationshipId: string, scope: PermissionScope, granted: boolean) => {
    updateDomain((current) => {
      const relationship = current.proxyRelationships.find((item) => item.id === relationshipId);
      const permission = relationship?.permissions.find((item) => item.scope === scope);
      return {
        ...current,
        proxyRelationships: current.proxyRelationships.map((item) => (item.id === relationshipId
          ? { ...item, permissions: item.permissions.map((p) => (p.scope === scope ? { ...p, granted } : p)) }
          : item)),
        notifications: notify(current, {
          audience: "proxy",
          type: "system",
          title: granted ? "Access granted" : "Access removed",
          body: `${relationship?.patientName || "The patient"} ${granted ? "granted" : "removed"} "${permission?.label || scope}".`,
          page: "proxy-permissions",
        }),
      };
    });
  }, [updateDomain]);

  const updateProxyStatus = useCallback((relationshipId: string, status: ProxyRelationship["status"], expiresAt?: string) => {
    updateDomain((current) => {
      const relationship = current.proxyRelationships.find((item) => item.id === relationshipId);
      return {
        ...current,
        proxyRelationships: current.proxyRelationships.map((item) => (item.id === relationshipId
          ? {
            ...item,
            status,
            expiresAt: expiresAt || item.expiresAt,
            consentGivenAt: status === "active" && item.consentGivenAt === "Not yet given" ? today() : item.consentGivenAt,
            permissions: status === "revoked" ? item.permissions.map((p) => ({ ...p, granted: false })) : item.permissions,
          }
          : item)),
        notifications: notify(current, { audience: "proxy", type: "system", title: `Care relationship ${status}`, body: `${relationship?.patientName || "A patient"} — coordination access is now ${status}.`, page: "proxy-dashboard" }),
      };
    });
  }, [updateDomain]);

  // ─── Docura TV ─────────────────────────────────────────────────────────────
  const toggleSavedContent = useCallback((contentId: string) => {
    updateDomain((current) => ({
      ...current,
      savedContent: current.savedContent.includes(contentId)
        ? current.savedContent.filter((item) => item !== contentId)
        : [contentId, ...current.savedContent],
    }));
  }, [updateDomain]);

  // ─── Enterprise ────────────────────────────────────────────────────────────
  const inviteEnterpriseMember = useCallback((email: string) => {
    updateDomain((current) => ({
      ...current,
      enterpriseMembers: [...current.enterpriseMembers, { id: uid("member"), name: email.split("@")[0], email, dept: "Pending assignment", status: "pending", lastSeen: "—" }],
      enterpriseActivity: [{ id: uid("enterprise-activity"), text: `Invitation sent to ${email}`, time: "Just now", type: "info" }, ...current.enterpriseActivity],
      notifications: notify(current, { audience: "enterprise", type: "system", title: "Invitation sent", body: `${email} was invited to your organisation.`, page: "enterprise-members" }),
    }));
  }, [updateDomain]);

  const createEnterpriseProgram = useCallback(() => {
    updateDomain((current) => ({
      ...current,
      enterprisePrograms: [...current.enterprisePrograms, { id: uid("program"), name: "Preventive Care Starter", members: 0, enrolled: 148, color: "#F58A8D" }],
      enterpriseActivity: [{ id: uid("enterprise-activity"), text: "Preventive Care Starter programme created", time: "Just now", type: "success" }, ...current.enterpriseActivity],
      notifications: notify(current, { audience: "enterprise", type: "system", title: "Programme created", body: "Preventive Care Starter is ready for enrolment.", page: "enterprise-programs" }),
    }));
  }, [updateDomain]);

  // ─── Proactive Patient Alerts ──────────────────────────────────────────────
  const resolvePatientAlert = useCallback((id: string) => {
    updateDomain((current) => ({
      ...current,
      patientAlerts: current.patientAlerts.map((a) => (a.id === id ? { ...a, status: "resolved" } : a)),
    }));
  }, [updateDomain]);

  const snoozePatientAlert = useCallback((id: string, days = 1) => {
    const until = new Date(Date.now() + days * 86400000).toLocaleDateString("en-GB");
    updateDomain((current) => ({
      ...current,
      patientAlerts: current.patientAlerts.map((a) => (a.id === id ? { ...a, status: "snoozed", snoozedUntil: until } : a)),
    }));
  }, [updateDomain]);

  // ─── Monthly Check-ins ─────────────────────────────────────────────────────
  const sendMonthlyCheckIn = useCallback((id: string, customMessage?: string) => {
    updateDomain((current) => {
      const checkIn = current.monthlyCheckIns.find((c) => c.id === id);
      if (!checkIn) return current;
      const text = customMessage || `Hi ${checkIn.patientName}, this is your monthly chronic care check-in from Dr. Amara Osei. How have your symptoms and readings been over the past month?`;
      const newMsg: Message = {
        id: uid("m"),
        senderId: "d1",
        senderName: "Dr. Amara Osei",
        text,
        time: clockTime(),
        date: today(),
        status: "delivered",
        isDoctor: true,
      };
      return {
        ...current,
        messages: [...current.messages, newMsg],
        monthlyCheckIns: current.monthlyCheckIns.map((c) => (c.id === id ? { ...c, status: "pending", lastResponse: "Sent today" } : c)),
        notifications: notify(current, {
          audience: "patient",
          type: "message",
          title: "Monthly Check-in from Dr. Amara",
          body: text,
          page: "patient-chat",
        }),
      };
    });
  }, [updateDomain]);

  // ─── Lab Orders ────────────────────────────────────────────────────────────
  const orderLabTest = useCallback((input: { patientId: string; patientName: string; category: LabCategory; testName: string; clinicalIndication: string; urgency: "routine" | "urgent" }) => {
    updateDomain((current) => {
      const newOrder: LabOrder = {
        id: uid("lab"),
        patientId: input.patientId,
        patientName: input.patientName,
        doctorId: "d1",
        doctorName: "Dr. Amara Osei",
        category: input.category,
        testName: input.testName,
        clinicalIndication: input.clinicalIndication,
        urgency: input.urgency,
        orderedDate: today(),
        status: "pending",
      };
      return {
        ...current,
        labOrders: [newOrder, ...current.labOrders],
        notifications: notify(current, {
          audience: "patient",
          type: "system",
          title: "New Lab Order Issued",
          body: `Dr. Amara ordered ${input.testName} (${input.urgency}).`,
          page: "medical-documents",
        }),
      };
    });
  }, [updateDomain]);

  const reviewLabOrder = useCallback((id: string, clinicalNote: string) => {
    updateDomain((current) => ({
      ...current,
      labOrders: current.labOrders.map((o) => (o.id === id ? { ...o, status: "reviewed", clinicalNote, reviewedAt: today() } : o)),
    }));
  }, [updateDomain]);

  // ─── Cross-Border Prescribing Workspace ─────────────────────────────────────
  const approvePrescriptionRequest = useCallback((id: string, independentClinicalNote: string) => {
    updateDomain((current) => {
      const req = current.prescribingRequests.find((r) => r.id === id);
      if (!req) return current;
      const rxId = uid("rx-local");
      const newPrescription: Prescription = {
        id: rxId,
        consultationId: "crossborder-" + req.id,
        doctorId: "d1",
        doctorName: "Dr. Amara Osei (Local Prescribing Doctor)",
        personalDoctorName: req.personalDoctorName,
        date: today(),
        status: "active",
        medication: req.medication,
        dosage: req.dosage,
        frequency: req.frequency,
        duration: req.duration,
        instructions: `Authorized locally in Nigeria following clinical review of recommendation from ${req.personalDoctorName}.`,
        crossBorder: true,
      };
      return {
        ...current,
        prescriptions: [newPrescription, ...current.prescriptions],
        prescribingRequests: current.prescribingRequests.map((r) => (r.id === id ? {
          ...r,
          status: "approved-issued",
          independentClinicalNote,
          issuedPrescriptionId: rxId,
        } : r)),
        notifications: notify(current, {
          audience: "patient",
          type: "prescription",
          title: "Prescription issued",
          body: `Your prescription for ${req.medication} has been reviewed and authorized for local dispensing.`,
          page: "patient-prescriptions",
        }),
      };
    });
  }, [updateDomain]);

  const declinePrescriptionRequest = useCallback((id: string, declineReason: string) => {
    updateDomain((current) => ({
      ...current,
      prescribingRequests: current.prescribingRequests.map((r) => (r.id === id ? {
        ...r,
        status: "declined",
        declineReason,
      } : r)),
    }));
  }, [updateDomain]);

  const escalatePrescriptionRequest = useCallback((id: string) => {
    updateDomain((current) => ({
      ...current,
      prescribingRequests: current.prescribingRequests.map((r) => (r.id === id ? {
        ...r,
        status: "auto-escalated",
        escalatedTo: "Dr. Fatima Bello (MDCN Local Prescribing Network)",
      } : r)),
    }));
  }, [updateDomain]);

  const sendD2DMessage = useCallback((input: { threadType: "patient-clinical" | "general"; patientId?: string; patientName?: string; recipientDoctorId: string; recipientDoctorName: string; text: string; isUrgent?: boolean }) => {
    updateDomain((current) => {
      const msg: D2DMessage = {
        id: uid("d2d"),
        threadType: input.threadType,
        patientId: input.patientId,
        patientName: input.patientName,
        senderDoctorId: "d1",
        senderDoctorName: "Dr. Amara Osei",
        recipientDoctorId: input.recipientDoctorId,
        recipientDoctorName: input.recipientDoctorName,
        text: input.text,
        sentAt: `${today()} ${clockTime()}`,
        isUrgent: input.isUrgent,
      };
      return {
        ...current,
        d2dMessages: [...current.d2dMessages, msg],
      };
    });
  }, [updateDomain]);

  // ─── Professional Concerns ──────────────────────────────────────────────────
  const respondProfessionalConcern = useCallback((id: string, response: string) => {
    updateDomain((current) => ({
      ...current,
      professionalConcerns: current.professionalConcerns.map((c) => (c.id === id ? {
        ...c,
        status: "response-submitted",
        doctorResponse: response,
        submittedAt: `${today()} ${clockTime()}`,
        auditTrail: [...c.auditTrail, { date: `${today()} ${clockTime()}`, action: "Response submitted by Doctor", actor: "Dr. Amara Osei" }],
      } : c)),
    }));
  }, [updateDomain]);

  // ─── Consultation Care Episode Note Locking ─────────────────────────────────
  const lockConsultationNote = useCallback((consultationId: string, note: string) => {
    updateDomain((current) => ({
      ...current,
      lockedConsultations: {
        ...current.lockedConsultations,
        [consultationId]: {
          note,
          lockedAt: `${today()} ${clockTime()}`,
          addenda: [],
        },
      },
    }));
  }, [updateDomain]);

  const addConsultationAddendum = useCallback((consultationId: string, text: string) => {
    updateDomain((current) => {
      const existing = current.lockedConsultations[consultationId];
      if (!existing) return current;
      const newAddendum = {
        id: uid("addendum"),
        text,
        createdAt: `${today()} ${clockTime()}`,
        doctorName: "Dr. Amara Osei",
      };
      return {
        ...current,
        lockedConsultations: {
          ...current.lockedConsultations,
          [consultationId]: {
            ...existing,
            addenda: [...existing.addenda, newAddendum],
          },
        },
      };
    });
  }, [updateDomain]);

  const setActiveWorkspaceRole = useCallback((newRole: "personal" | "prescribing") => {
    updateDomain((current) => ({
      ...current,
      activeWorkspaceRole: newRole,
    }));
  }, [updateDomain]);

  // ─── Toasts ────────────────────────────────────────────────────────────────
  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      page, params, history, role, adminRole, domain, session,
      navigate, back, setRole, setAdminRole, signOut, markOnboardingComplete,
      createConsultation, activateSubscription, addMessage, issuePrescription, createCarePlan, scheduleFollowUp, completeFollowUp,
      updateVerification, updatePayment,
      createReferral, updateReferral,
      createSupportTicket, replySupportTicket, updateSupportTicket,
      setProxyPermission, updateProxyStatus,
      toggleSavedContent,
      addNotification, markNotificationRead, markAllNotificationsRead, setNotificationChannel, unreadCount,
      inviteEnterpriseMember, createEnterpriseProgram,
      resolvePatientAlert, snoozePatientAlert,
      sendMonthlyCheckIn,
      orderLabTest, reviewLabOrder,
      approvePrescriptionRequest, declinePrescriptionRequest, escalatePrescriptionRequest, sendD2DMessage,
      respondProfessionalConcern,
      lockConsultationNote, addConsultationAddendum,
      setActiveWorkspaceRole,
      toasts, addToast, removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

