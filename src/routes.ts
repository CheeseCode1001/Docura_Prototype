// ─── Route registry & URL Routing Engine ───────────────────────────────────────
// Provides canonical route mapping, URL synchronization (#/route), query param
// parsing, route alias resolution, and permission checking.

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

  // Public marketing pages (accessible with or without public- prefix)
  "public-how-it-works": publicRoute,
  "how-it-works": publicRoute,
  "public-care": publicRoute,
  "public-now": publicRoute,
  "public-doctors": publicRoute,
  "public-about": publicRoute,
  about: publicRoute,
  "public-contact": publicRoute,
  contact: publicRoute,
  "public-help": publicRoute,
  help: publicRoute,
  "public-privacy": publicRoute,
  privacy: publicRoute,
  "public-terms": publicRoute,
  terms: publicRoute,
  "public-security": publicRoute,
  security: publicRoute,
  "public-crossborder": publicRoute,
  "cross-border-care": publicRoute,
  "cross-border": publicRoute,
  crossborder: publicRoute,
  "public-health-record": publicRoute,
  "public-health-passport": publicRoute,
  "public-care-team": publicRoute,
  "public-proxy": publicRoute,
  "public-intelligence": publicRoute,
  "public-hospitals": publicRoute,
  "public-referrals": publicRoute,
  "public-tv": publicRoute,
  "public-pricing": publicRoute,
  pricing: publicRoute,
  "public-faq": publicRoute,
  faq: publicRoute,
  "public-careers": publicRoute,
  careers: publicRoute,
  "public-clinical-safety": publicRoute,
  "clinical-safety": publicRoute,

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

/**
 * Route aliases mapping friendly names and hierarchical URLs to canonical route IDs.
 */
export const ROUTE_ALIASES: Record<string, string> = {
  "": "landing",
  "/": "landing",
  home: "landing",
  index: "landing",

  // Cross-Border Care
  "cross-border": "cross-border-care",
  crossborder: "cross-border-care",
  "cross-border-care": "cross-border-care",
  "public-crossborder": "cross-border-care",
  "cross-border/simulator": "cross-border-care",

  // Marketing & Public
  "how-it-works": "public-how-it-works",
  "how-it-works/": "public-how-it-works",
  care: "public-care",
  "docura-care": "public-care",
  now: "public-now",
  "docura-now": "public-now",
  doctors: "public-doctors",
  about: "public-about",
  contact: "public-contact",
  help: "public-help",
  privacy: "public-privacy",
  terms: "public-terms",
  security: "public-security",
  pricing: "public-pricing",
  faq: "public-faq",
  careers: "public-careers",
  "clinical-safety": "public-clinical-safety",

  // TV
  tv: "tv-home",
  "tv/home": "tv-home",
  "tv/topic": "tv-topic",
  "tv/creator": "tv-creator",
  "tv/content": "tv-content",
  "tv/saved": "tv-saved",

  // Patient
  patient: "patient-dashboard",
  "patient/dashboard": "patient-dashboard",
  "patient/onboarding": "patient-onboarding",
  "patient/prescriptions": "patient-prescriptions",
  prescriptions: "patient-prescriptions",
  "patient/medications": "patient-medications",
  medications: "patient-medications",
  "patient/consultations": "patient-consultations",
  consultations: "patient-consultations",
  "patient/payments": "patient-payments",
  payments: "patient-payments",
  "patient/notifications": "patient-notifications",
  notifications: "patient-notifications",
  "patient/settings": "patient-settings",
  settings: "patient-settings",
  "patient/profile": "patient-profile",
  profile: "patient-profile",
  "patient/care-plans": "patient-care-plans",
  "care-plans": "patient-care-plans",
  "patient/referrals": "patient-referrals",
  "patient/chat": "patient-chat",
  records: "health-record",
  "health-record": "health-record",
  passport: "health-passport",
  "health-passport": "health-passport",
  timeline: "health-timeline",
  "health-timeline": "health-timeline",
  travel: "travel-mode",
  "travel-mode": "travel-mode",
  "care-team": "care-team",
  "care-journey": "care-journey",
  "find-doctor": "find-doctor",
  "doctors/find": "find-doctor",
  "doctor-profile": "doctor-profile",
  "docura-now-flow": "docura-now-flow",
  "patient-care": "patient-care",
  "consultation-room": "consultation-room",
  consultation: "consultation-room",
  documents: "medical-documents",
  "medical-documents": "medical-documents",
  emergency: "emergency-card",
  "emergency-card": "emergency-card",
  "health-sharing": "health-sharing",
  "health-intelligence": "health-intelligence",
  "follow-ups": "follow-ups",
  followups: "follow-ups",
  support: "support-center",
  "support-center": "support-center",
  "support-ticket": "support-ticket",

  // Doctor
  doctor: "doctor-dashboard",
  "doctor/dashboard": "doctor-dashboard",
  "doctor/onboarding": "doctor-onboarding",
  "doctor/patients": "doctor-patients",
  "doctor/consultations": "doctor-consultations",
  "doctor/chat": "doctor-chat",
  "doctor/earnings": "doctor-earnings",
  earnings: "doctor-earnings",
  "doctor/verification": "doctor-verification",
  "doctor/settings": "doctor-settings",
  "doctor/workspace": "doctor-workspace",
  workspace: "doctor-workspace",
  "doctor/care-plans": "doctor-care-plans",
  "doctor/follow-ups": "doctor-follow-ups",
  "doctor/analytics": "doctor-analytics",
  "doctor/referrals": "doctor-referrals",
  "doctor/availability": "doctor-availability",
  "doctor/alerts": "doctor-patient-alerts",
  "doctor/labs": "doctor-labs",
  "doctor/grow": "doctor-grow-practice",
  "doctor/concerns": "doctor-concerns",
  "doctor/prescribing": "prescribing-workspace",
  "prescribing-workspace": "prescribing-workspace",
  prescribing: "prescribing-workspace",

  // Proxy
  proxy: "proxy-dashboard",
  "proxy/dashboard": "proxy-dashboard",
  "proxy/permissions": "proxy-permissions",
  "proxy/consent": "proxy-consent",
  "proxy/timeline": "proxy-timeline",
  "proxy/messages": "proxy-messages",

  // Enterprise
  enterprise: "enterprise-dashboard",
  "enterprise/dashboard": "enterprise-dashboard",
  "enterprise/members": "enterprise-members",
  "enterprise/invitations": "enterprise-invitations",
  "enterprise/programs": "enterprise-programs",
  "enterprise/utilization": "enterprise-utilization",
  "enterprise/assessments": "enterprise-assessments",
  "enterprise/billing": "enterprise-billing",
  "enterprise/reports": "enterprise-reports",
  "enterprise/referrals": "enterprise-referrals",
  "enterprise/settings": "enterprise-settings",

  // Admin
  admin: "admin-dashboard",
  "admin/dashboard": "admin-dashboard",
  "admin/verification": "admin-verification",
  "admin/crossborder": "admin-crossborder",
  "admin/cross-border": "admin-crossborder",
  "admin/payouts": "admin-payouts",
  "admin/refunds": "admin-refunds",
  "admin/disputes": "admin-disputes",
  "admin/patients": "admin-patients",
  "admin/doctors": "admin-doctors",
  "admin/audit-log": "admin-audit-log",
  "admin/prescriptions": "admin-prescriptions",
  "admin/support": "admin-support",
  "admin/analytics": "admin-analytics",
  "admin/hospitals": "admin-hospitals",
  "admin/content": "admin-content",
};

/** Where each role lands when signed in. */
export const HOME_PAGE: Record<Exclude<UserRole, null>, string> = {
  patient: "patient-dashboard",
  doctor: "doctor-dashboard",
  proxy: "proxy-dashboard",
  enterprise: "enterprise-dashboard",
  admin: "admin-dashboard",
};

/**
 * Normalizes any route string or URL fragment into its canonical route key.
 */
export function resolveRoute(raw: string): string {
  if (!raw) return "landing";
  const clean = raw.trim().toLowerCase().replace(/^#\/?/, "").replace(/^\/+/, "").replace(/\/+$/, "");

  // Check direct alias
  if (ROUTE_ALIASES[clean]) return ROUTE_ALIASES[clean];

  // Convert slashes to hyphens (e.g., patient/dashboard -> patient-dashboard)
  const slashNormalized = clean.replace(/\//g, "-");
  if (ROUTE_ALIASES[slashNormalized]) return ROUTE_ALIASES[slashNormalized];

  // Check if exists in ROUTES
  if (ROUTES[clean]) return clean;
  if (ROUTES[slashNormalized]) return slashNormalized;

  // Check public prefix
  if (ROUTES[`public-${clean}`]) return `public-${clean}`;
  if (ROUTES[`public-${slashNormalized}`]) return `public-${slashNormalized}`;

  return clean;
}

/**
 * Checks whether a given route is recognized.
 */
export function routeExists(page: string): boolean {
  const canonical = resolveRoute(page);
  return Boolean(ROUTES[canonical] || ROUTES[page]);
}

/**
 * Decides whether `role` (optionally an internal admin role) may open `page`.
 */
export function canAccess(page: string, role: UserRole, adminRole: AdminRole): boolean {
  const canonical = resolveRoute(page);
  const route = ROUTES[canonical] || ROUTES[page];
  if (!route) return false;
  if (route.roles === "public") return true;
  if (!role) return false;
  if (!route.roles.includes(role)) return false;
  if (role === "admin" && canonical.startsWith("admin-") && canonical !== "admin-login") {
    const definition = ADMIN_ROLE_PAGES[adminRole];
    return definition ? definition.includes(canonical) : true;
  }
  return true;
}

/**
 * Parses the current window location (pathname or hash + search) into route and params.
 */
export function parseLocation(): { page: string; params: Record<string, string> } {
  if (typeof window === "undefined") {
    return { page: "landing", params: {} };
  }

  // 1. Inspect pathname first (clean URL: /tv-home)
  let raw = "";
  if (window.location.pathname && window.location.pathname !== "/") {
    raw = window.location.pathname.replace(/^\/+/, "").trim();
  }

  // 2. If no pathname, check hash fallback (#/tv-home)
  if (!raw && window.location.hash) {
    raw = window.location.hash.replace(/^#\/?/, "").trim();
  }

  if (!raw) {
    return { page: "", params: {} };
  }

  const [pathPart, queryPart] = raw.split("?");
  const params: Record<string, string> = {};

  if (queryPart) {
    const sp = new URLSearchParams(queryPart);
    sp.forEach((v, k) => {
      params[k] = v;
    });
  }

  if (Object.keys(params).length === 0 && window.location.search) {
    const sp = new URLSearchParams(window.location.search);
    sp.forEach((v, k) => {
      params[k] = v;
    });
  }

  const cleanPath = pathPart.replace(/\/+$/, "");
  const canonical = resolveRoute(cleanPath);

  return { page: canonical, params };
}

/**
 * Formats a clean canonical URL path for browser history and address bar (e.g. /tv-home).
 */
export function buildPath(page: string, params: Record<string, string> = {}): string {
  const canonical = resolveRoute(page);
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) search.set(k, v);
  }
  const queryString = search.toString();
  const base = canonical === "landing" ? "/" : `/${canonical}`;
  return `${base}${queryString ? `?${queryString}` : ""}`;
}

/** Legacy alias for compatibility */
export function buildHash(page: string, params: Record<string, string> = {}): string {
  return buildPath(page, params);
}

/** Mirror of the seed definitions, kept here so the router has no data import cycle. */
export const ADMIN_ROLE_PAGES: Record<AdminRole, string[]> = {
  "super-admin": [
    "admin-dashboard", "admin-verification", "admin-patients", "admin-doctors",
    "admin-crossborder", "admin-prescriptions", "admin-payouts", "admin-refunds",
    "admin-disputes", "admin-audit-log", "admin-support", "admin-analytics",
    "admin-hospitals", "admin-content"
  ],
  operations: [
    "admin-dashboard", "admin-verification", "admin-patients", "admin-doctors",
    "admin-crossborder", "admin-audit-log", "admin-analytics", "admin-hospitals"
  ],
  finance: ["admin-dashboard", "admin-payouts", "admin-refunds", "admin-analytics", "admin-audit-log"],
  support: ["admin-dashboard", "admin-support", "admin-disputes", "admin-audit-log"],
  "medical-board": ["admin-dashboard", "admin-verification", "admin-prescriptions", "admin-doctors", "admin-content", "admin-audit-log"],
};
