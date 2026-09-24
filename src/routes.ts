// ─── Route registry ───────────────────────────────────────────────────────────
// One place that answers: does this page exist, who may open it, and where does
// someone land if they may not. The router in `App.tsx` enforces this — hiding
// a nav item is never the only control.

import type { AdminRole } from "@/data/types";
import type { UserRole } from "@/context/AppContext";

export type Access = "public" | "auth-only" | UserRole;

export interface RouteDefinition {
  /** Roles allowed to render the page. "public" means anyone, signed in or not. */
  roles: Exclude<UserRole, null>[] | "public";
  title?: string;
}

const publicRoute: RouteDefinition = { roles: "public" };

export const ROUTES: Record<string, RouteDefinition> = {
  // ── Public marketing & auth ────────────────────────────────────────────────
  landing: publicRoute,
  "role-select": publicRoute,
  login: publicRoute,
  signup: publicRoute,
  "forgot-password": publicRoute,
  otp: publicRoute,
  "reset-password": publicRoute,
  "signup-success": publicRoute,
  "doctor-login": publicRoute,
  "doctor-signup": publicRoute,
  "admin-login": publicRoute,

  "public-how-it-works": publicRoute,
  "public-care": publicRoute,
  "public-now": publicRoute,
  "public-doctors": publicRoute,
  "public-about": publicRoute,
  "public-contact": publicRoute,
  "public-help": publicRoute,
  "public-privacy": publicRoute,
  "public-terms": publicRoute,
  "public-security": publicRoute,
  "public-crossborder": publicRoute,
  "public-health-record": publicRoute,
  "public-health-passport": publicRoute,
  "public-care-team": publicRoute,
  "public-proxy": publicRoute,
  "public-intelligence": publicRoute,
  "public-hospitals": publicRoute,
  "public-referrals": publicRoute,
  "public-tv": publicRoute,
  "public-pricing": publicRoute,
  "public-faq": publicRoute,
  "public-careers": publicRoute,
  "public-clinical-safety": publicRoute,

  // ── Docura TV (public and in-app) ──────────────────────────────────────────
  "tv-home": publicRoute,
  "tv-topic": publicRoute,
  "tv-content": publicRoute,
  "tv-creator": publicRoute,
  "tv-saved": { roles: ["patient", "proxy", "doctor"] },

  // ── Patient ────────────────────────────────────────────────────────────────
  "patient-onboarding": { roles: ["patient", "proxy"] },
  "patient-dashboard": { roles: ["patient"] },
  "find-doctor": { roles: ["patient", "proxy"] },
  "doctor-profile": { roles: ["patient", "proxy"] },
  "docura-now-flow": { roles: ["patient", "proxy"] },
  "patient-care": { roles: ["patient", "proxy"] },
  "consultation-room": { roles: ["patient", "proxy", "doctor"] },
  "patient-chat": { roles: ["patient"] },
  "patient-prescriptions": { roles: ["patient"] },
  "health-record": { roles: ["patient"] },
  "patient-payments": { roles: ["patient"] },
  "patient-notifications": { roles: ["patient", "proxy", "doctor", "enterprise", "admin"] },
  "notification-preferences": { roles: ["patient", "proxy", "doctor", "enterprise", "admin"] },
  "patient-consultations": { roles: ["patient"] },
  "patient-settings": { roles: ["patient"] },
  "health-intelligence": { roles: ["patient"] },
  "health-timeline": { roles: ["patient"] },
  "patient-medications": { roles: ["patient"] },
  "medical-documents": { roles: ["patient"] },
  "emergency-card": { roles: ["patient"] },
  "health-passport": { roles: ["patient"] },
  "patient-care-plans": { roles: ["patient"] },
  "follow-ups": { roles: ["patient"] },
  "care-team": { roles: ["patient"] },
  "care-journey": { roles: ["patient"] },
  "travel-mode": { roles: ["patient"] },
  "health-sharing": { roles: ["patient"] },
  "patient-profile": { roles: ["patient"] },
  "patient-referrals": { roles: ["patient"] },
  "support-center": { roles: ["patient", "proxy", "doctor", "enterprise"] },
  "support-ticket": { roles: ["patient", "proxy", "doctor", "enterprise"] },

  // ── Proxy (V2.0) ───────────────────────────────────────────────────────────
  "proxy-dashboard": { roles: ["proxy"] },
  "proxy-permissions": { roles: ["proxy", "patient"] },
  "proxy-timeline": { roles: ["proxy"] },
  "proxy-messages": { roles: ["proxy"] },
  "proxy-consent": { roles: ["proxy", "patient"] },

  // ── Doctor ─────────────────────────────────────────────────────────────────
  "doctor-onboarding": { roles: ["doctor"] },
  "doctor-dashboard": { roles: ["doctor"] },
  "doctor-patients": { roles: ["doctor"] },
  "doctor-consultations": { roles: ["doctor"] },
  "doctor-chat": { roles: ["doctor"] },
  "prescription-reviews": { roles: ["doctor"] },
  "doctor-earnings": { roles: ["doctor"] },
  "doctor-profile-mgmt": { roles: ["doctor"] },
  "doctor-verification": { roles: ["doctor"] },
  "doctor-settings": { roles: ["doctor"] },
  "doctor-workspace": { roles: ["doctor"] },
  "doctor-care-plans": { roles: ["doctor"] },
  "doctor-follow-ups": { roles: ["doctor"] },
  "doctor-analytics": { roles: ["doctor"] },
  "doctor-referrals": { roles: ["doctor"] },
  "doctor-availability": { roles: ["doctor"] },
  "doctor-patient-alerts": { roles: ["doctor"] },
  "doctor-labs": { roles: ["doctor"] },
  "doctor-grow-practice": { roles: ["doctor"] },
  "prescribing-workspace": { roles: ["doctor"] },
  "doctor-concerns": { roles: ["doctor"] },

  // ── Enterprise / hospital partner ──────────────────────────────────────────
  "enterprise-dashboard": { roles: ["enterprise"] },
  "enterprise-members": { roles: ["enterprise"] },
  "enterprise-invitations": { roles: ["enterprise"] },
  "enterprise-programs": { roles: ["enterprise"] },
  "enterprise-utilization": { roles: ["enterprise"] },
  "enterprise-assessments": { roles: ["enterprise"] },
  "enterprise-billing": { roles: ["enterprise"] },
  "enterprise-reports": { roles: ["enterprise"] },
  "enterprise-referrals": { roles: ["enterprise"] },
  "enterprise-settings": { roles: ["enterprise"] },

  // ── Admin ──────────────────────────────────────────────────────────────────
  "admin-dashboard": { roles: ["admin"] },
  "admin-verification": { roles: ["admin"] },
  "admin-crossborder": { roles: ["admin"] },
  "admin-payouts": { roles: ["admin"] },
  "admin-refunds": { roles: ["admin"] },
  "admin-disputes": { roles: ["admin"] },
  "admin-patients": { roles: ["admin"] },
  "admin-doctors": { roles: ["admin"] },
  "admin-audit-log": { roles: ["admin"] },
  "admin-prescriptions": { roles: ["admin"] },
  "admin-support": { roles: ["admin"] },
  "admin-analytics": { roles: ["admin"] },
  "admin-hospitals": { roles: ["admin"] },
  "admin-content": { roles: ["admin"] },
};

/** Where each role lands when signed in. */
export const HOME_PAGE: Record<Exclude<UserRole, null>, string> = {
  patient: "patient-dashboard",
  doctor: "doctor-dashboard",
  proxy: "proxy-dashboard",
  enterprise: "enterprise-dashboard",
  admin: "admin-dashboard",
};

export function routeExists(page: string): boolean {
  return Object.prototype.hasOwnProperty.call(ROUTES, page);
}

/**
 * Decides whether `role` (optionally an internal admin role) may open `page`.
 * Unknown pages are treated as not permitted so a typo cannot render a blank
 * screen with a privileged shell around it.
 */
export function canAccess(page: string, role: UserRole, adminRole: AdminRole): boolean {
  const route = ROUTES[page];
  if (!route) return false;
  if (route.roles === "public") return true;
  if (!role) return false;
  if (!route.roles.includes(role)) return false;
  if (role === "admin" && page.startsWith("admin-") && page !== "admin-login") {
    const definition = ADMIN_ROLE_PAGES[adminRole];
    return definition ? definition.includes(page) : true;
  }
  return true;
}

/** Mirror of the seed definitions, kept here so the router has no data import cycle. */
export const ADMIN_ROLE_PAGES: Record<AdminRole, string[]> = {
  "super-admin": ["admin-dashboard", "admin-verification", "admin-patients", "admin-doctors", "admin-crossborder", "admin-prescriptions", "admin-payouts", "admin-refunds", "admin-disputes", "admin-audit-log", "admin-support", "admin-analytics", "admin-hospitals", "admin-content"],
  operations: ["admin-dashboard", "admin-verification", "admin-patients", "admin-doctors", "admin-crossborder", "admin-audit-log", "admin-analytics", "admin-hospitals"],
  finance: ["admin-dashboard", "admin-payouts", "admin-refunds", "admin-analytics", "admin-audit-log"],
  support: ["admin-dashboard", "admin-support", "admin-disputes", "admin-audit-log"],
  "medical-board": ["admin-dashboard", "admin-verification", "admin-prescriptions", "admin-doctors", "admin-content", "admin-audit-log"],
};
