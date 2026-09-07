import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CONSULTATIONS, MESSAGES, PRESCRIPTIONS, PATIENT, PAYMENTS, PENDING_VERIFICATIONS } from "@/data/mock";

// ─── Types ────────────────────────────────────────────────────────────────────
export type UserRole = "patient" | "doctor" | "proxy" | "admin" | "enterprise" | null;

export interface DomainState {
  consultations: typeof CONSULTATIONS;
  messages: typeof MESSAGES;
  prescriptions: typeof PRESCRIPTIONS;
  subscriptions: { id: string; patientId: string; doctorId: string; status: "active"; price: number; currency: string; startedAt: string }[];
  verificationDecisions: { id: string; status: "approved" | "rejected" | "more-info-required"; note?: string; updatedAt: string }[];
  paymentOverrides: { id: string; status: "paid" | "pending" | "failed" | "refunded" | "disputed" }[];
  activity: { id: string; title: string; detail: string; tone: "success" | "warning" | "info"; createdAt: string }[];
}

const DOMAIN_KEY = "docura-domain-state";
const ROLE_VALUES: UserRole[] = ["patient", "doctor", "proxy", "admin", "enterprise"];

function readDomainState(): DomainState {
  const saved = window.localStorage.getItem(DOMAIN_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Partial<DomainState>;
      return {
        consultations: parsed.consultations || CONSULTATIONS,
        messages: parsed.messages || MESSAGES,
        prescriptions: parsed.prescriptions || PRESCRIPTIONS,
        subscriptions: parsed.subscriptions || [],
        verificationDecisions: parsed.verificationDecisions || [],
        paymentOverrides: parsed.paymentOverrides || [],
        activity: parsed.activity || [],
      };
    } catch { /* use seed data when storage is invalid */ }
  }
  return { consultations: CONSULTATIONS, messages: MESSAGES, prescriptions: PRESCRIPTIONS, subscriptions: [], verificationDecisions: [], paymentOverrides: [], activity: [] };
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
  domain: DomainState;
  session: { authenticated: boolean; onboardingComplete: boolean };
  navigate: (page: string, params?: Record<string, string>) => void;
  back: () => void;
  setRole: (role: UserRole) => void;
  signOut: () => void;
  markOnboardingComplete: () => void;
  createConsultation: (input: { doctorId: string; type: "now" | "care"; price: number; currency: string }) => void;
  activateSubscription: (input: { doctorId: string; price: number; currency: string }) => void;
  addMessage: (input: { senderId: string; senderName: string; text: string; isDoctor: boolean }) => void;
  updateVerification: (input: { id: string; status: "approved" | "rejected" | "more-info-required"; note?: string }) => void;
  updatePayment: (id: string, status: "paid" | "pending" | "failed" | "refunded" | "disputed") => void;
  toasts: Toast[];
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = window.localStorage.getItem("docura-role");
    return ROLE_VALUES.includes(saved as UserRole) ? saved as UserRole : null;
  });
  const [page, setPage] = useState(() => {
    const saved = window.localStorage.getItem("docura-role");
    return ROLE_VALUES.includes(saved as UserRole) ? `${saved}-dashboard` : "landing";
  });
  const [params, setParams] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [domain, setDomain] = useState<DomainState>(readDomainState);
  const [session, setSession] = useState(() => ({
    authenticated: window.localStorage.getItem("docura-session") === "active",
    onboardingComplete: window.localStorage.getItem("docura-onboarding") === "complete",
  }));

  const updateDomain = useCallback((updater: (current: DomainState) => DomainState) => {
    setDomain((current) => {
      const next = updater(current);
      window.localStorage.setItem(DOMAIN_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

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
    if (nextRole) window.localStorage.setItem("docura-role", nextRole);
    else window.localStorage.removeItem("docura-role");
  }, []);

  const signOut = useCallback(() => {
    setRoleState(null);
    setSession({ authenticated: false, onboardingComplete: false });
    window.localStorage.removeItem("docura-role");
    window.localStorage.removeItem("docura-session");
    window.localStorage.removeItem("docura-onboarding");
    setPage("landing");
    setParams({});
  }, []);

  const markOnboardingComplete = useCallback(() => {
    setSession({ authenticated: true, onboardingComplete: true });
    window.localStorage.setItem("docura-session", "active");
    window.localStorage.setItem("docura-onboarding", "complete");
  }, []);

  const createConsultation = useCallback((input: { doctorId: string; type: "now" | "care"; price: number; currency: string }) => {
    updateDomain((current) => ({ ...current, consultations: [...current.consultations, { id: `c-${Date.now()}`, doctorId: input.doctorId, type: input.type, date: new Date().toISOString().slice(0, 10), status: "completed", summary: input.type === "now" ? "Docura Now consultation completed." : "Personal care consultation completed.", diagnosis: "Awaiting doctor summary", notes: "Consultation completed in demo mode.", hasPrescription: false }] }));
  }, [updateDomain]);

  const activateSubscription = useCallback((input: { doctorId: string; price: number; currency: string }) => {
    updateDomain((current) => ({ ...current, subscriptions: [...current.subscriptions.filter((item) => item.patientId !== PATIENT.id), { id: `sub-${Date.now()}`, patientId: PATIENT.id, doctorId: input.doctorId, status: "active", price: input.price, currency: input.currency, startedAt: new Date().toISOString().slice(0, 10) }] }));
  }, [updateDomain]);

  const addMessage = useCallback((input: { senderId: string; senderName: string; text: string; isDoctor: boolean }) => {
    updateDomain((current) => ({ ...current, messages: [...current.messages, { ...input, id: `m-${Date.now()}`, time: "Now", date: new Date().toISOString().slice(0, 10), status: "read" as const }] }));
  }, [updateDomain]);

  const updateVerification = useCallback((input: { id: string; status: "approved" | "rejected" | "more-info-required"; note?: string }) => {
    updateDomain((current) => ({
      ...current,
      verificationDecisions: [...current.verificationDecisions.filter((item) => item.id !== input.id), { ...input, updatedAt: new Date().toISOString().slice(0, 10) }],
      activity: [{ id: `activity-${Date.now()}`, title: `Doctor verification ${input.status.replace(/-/g, " ")}`, detail: PENDING_VERIFICATIONS.find((item) => item.id === input.id)?.name || input.id, tone: input.status === "approved" ? "success" : "warning", createdAt: new Date().toISOString() }, ...current.activity],
    }));
  }, [updateDomain]);

  const updatePayment = useCallback((id: string, status: "paid" | "pending" | "failed" | "refunded" | "disputed") => {
    updateDomain((current) => ({
      ...current,
      paymentOverrides: [...current.paymentOverrides.filter((item) => item.id !== id), { id, status }],
      activity: [{ id: `activity-${Date.now()}`, title: `Payment ${status}`, detail: PAYMENTS.find((item) => item.id === id)?.description || id, tone: status === "failed" || status === "disputed" ? "warning" : "success", createdAt: new Date().toISOString() }, ...current.activity],
    }));
  }, [updateDomain]);

  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{ page, params, history, role, domain, session, navigate, back, setRole, signOut, markOnboardingComplete, createConsultation, activateSubscription, addMessage, updateVerification, updatePayment, toasts, addToast, removeToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
