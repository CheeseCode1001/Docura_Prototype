import { ReactNode, useState } from "react";
import { useApp, UserRole } from "@/context/AppContext";
import { DocuraLogo, Avatar, C } from "@/components/ui";
import { ADMIN_ROLE_PAGES } from "@/routes";
import { api } from "@/services/api";
import type { AdminRole } from "@/data/types";

interface NavItem {
  id: string;
  label: string;
  page: string;
  params?: Record<string, string>;
  icon: ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

function Icon({ d, filled }: { d: string | string[]; filled?: boolean }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

// ─── Shared icon paths ────────────────────────────────────────────────────────
const I = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  user: ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 3a4 4 0 100 8 4 4 0 000-8z"],
  users: ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 3a4 4 0 100 8 4 4 0 000-8z", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"],
  chat: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  pulse: "M22 12h-4l-3 9L9 3l-3 9H2",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  pill: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z",
  doc: ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8"],
  clipboard: ["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2 2 2 0 00-2-2h-2a2 2 0 00-2 2z", "M9 12h6", "M9 16h6"],
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  layers: ["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
  money: ["M12 2v20", "M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"],
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  globe: ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z", "M12 7a3 3 0 100 6 3 3 0 000-6z"],
  card: ["M3 10h18", "M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"],
  mail: ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  bell: ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 01-3.46 0"],
  play: ["M23 7l-7 5 7 5V7z", "M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z"],
  life: ["M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 16a4 4 0 100-8 4 4 0 000 8z", "M4.93 4.93l4.24 4.24", "M14.83 14.83l4.24 4.24", "M14.83 9.17l4.24-4.24", "M4.93 19.07l4.24-4.24"],
  share: ["M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8", "M16 6l-4-4-4 4", "M12 2v13"],
  building: ["M3 21h18", "M5 21V7l8-4v18", "M19 21V11l-6-4", "M9 9v.01M9 12v.01M9 15v.01M9 18v.01"],
  alert: ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"],
  settings: ["M12 15a3 3 0 100-6 3 3 0 000 6z", "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"],
  calendar: ["M8 2v4M16 2v4M3 10h18", "M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"],
};

// ─── Patient ──────────────────────────────────────────────────────────────────
const PATIENT_NAV: NavItem[] = [
  { id: "home", label: "Home", page: "patient-dashboard", icon: <Icon d={I.home} /> },
  { id: "doctors", label: "Doctors", page: "find-doctor", icon: <Icon d={I.user} /> },
  { id: "care", label: "Care", page: "care-team", icon: <Icon d={I.users} /> },
  { id: "health", label: "Health", page: "health-intelligence", icon: <Icon d={I.pulse} /> },
  { id: "messages", label: "Messages", page: "patient-chat", icon: <Icon d={I.chat} /> },
];

const PATIENT_SIDEBAR_GROUPS: NavGroup[] = [
  {
    label: "Home",
    items: [
      { id: "home", label: "Home", page: "patient-dashboard", icon: <Icon d={I.home} /> },
      { id: "doctors", label: "Find a Doctor", page: "find-doctor", icon: <Icon d={I.user} /> },
      { id: "messages", label: "Messages", page: "patient-chat", icon: <Icon d={I.chat} /> },
      { id: "notifications", label: "Notifications", page: "patient-notifications", icon: <Icon d={I.bell} /> },
    ],
  },
  {
    label: "My Health",
    items: [
      { id: "health-intelligence", label: "Health Overview", page: "health-intelligence", icon: <Icon d={I.pulse} /> },
      { id: "health-timeline", label: "Timeline", page: "health-timeline", icon: <Icon d={I.clock} /> },
      { id: "medications", label: "Medications", page: "patient-medications", icon: <Icon d={I.pill} /> },
      { id: "documents", label: "Documents", page: "medical-documents", icon: <Icon d={I.doc} /> },
      { id: "prescriptions", label: "Prescriptions", page: "patient-prescriptions", icon: <Icon d={I.doc} /> },
      { id: "care-plans", label: "Care Plans", page: "patient-care-plans", icon: <Icon d={I.clipboard} /> },
      { id: "health-passport", label: "Health Passport", page: "health-passport", icon: <Icon d={I.share} /> },
    ],
  },
  {
    label: "My Care",
    items: [
      { id: "care-team", label: "Care Team", page: "care-team", icon: <Icon d={I.users} /> },
      { id: "care-journey", label: "Care Journey", page: "care-journey", icon: <Icon d={I.layers} /> },
      { id: "follow-ups", label: "Follow-ups", page: "follow-ups", icon: <Icon d={I.list} /> },
      { id: "referrals", label: "Referrals", page: "patient-referrals", icon: <Icon d={I.share} /> },
      { id: "travel", label: "Travel & Cross-border", page: "travel-mode", icon: <Icon d={I.globe} /> },
    ],
  },
  {
    label: "Learn & Support",
    items: [
      { id: "tv", label: "Docura TV", page: "tv-home", icon: <Icon d={I.play} /> },
      { id: "support", label: "Support", page: "support-center", icon: <Icon d={I.life} /> },
      { id: "payments", label: "Payments", page: "patient-payments", icon: <Icon d={I.card} /> },
      { id: "settings", label: "Settings", page: "patient-settings", icon: <Icon d={I.settings} /> },
    ],
  },
];

// ─── Proxy (V2.0) ─────────────────────────────────────────────────────────────
const PROXY_NAV: NavItem[] = [
  { id: "home", label: "Coordinate", page: "proxy-dashboard", icon: <Icon d={I.home} /> },
  { id: "timeline", label: "Timeline", page: "proxy-timeline", icon: <Icon d={I.clock} /> },
  { id: "permissions", label: "Access", page: "proxy-permissions", icon: <Icon d={I.shield} /> },
  { id: "messages", label: "Messages", page: "proxy-messages", icon: <Icon d={I.chat} /> },
  { id: "doctors", label: "Doctors", page: "find-doctor", icon: <Icon d={I.user} /> },
];

const PROXY_SIDEBAR_GROUPS: NavGroup[] = [
  {
    label: "Coordination",
    items: [
      { id: "home", label: "Dashboard", page: "proxy-dashboard", icon: <Icon d={I.home} /> },
      { id: "timeline", label: "Care timeline", page: "proxy-timeline", icon: <Icon d={I.clock} /> },
      { id: "messages", label: "Messages", page: "proxy-messages", icon: <Icon d={I.chat} /> },
      { id: "doctors", label: "Find a doctor", page: "find-doctor", icon: <Icon d={I.user} /> },
    ],
  },
  {
    label: "Consent & access",
    items: [
      { id: "permissions", label: "Permissions", page: "proxy-permissions", icon: <Icon d={I.shield} /> },
      { id: "consent", label: "Consent record", page: "proxy-consent", icon: <Icon d={I.check} /> },
    ],
  },
  {
    label: "Learn & support",
    items: [
      { id: "tv", label: "Docura TV", page: "tv-home", icon: <Icon d={I.play} /> },
      { id: "support", label: "Support", page: "support-center", icon: <Icon d={I.life} /> },
      { id: "notifications", label: "Notifications", page: "patient-notifications", icon: <Icon d={I.bell} /> },
    ],
  },
];

// ─── Doctor ───────────────────────────────────────────────────────────────────
const DOCTOR_NAV: NavItem[] = [
  { id: "home", label: "Home", page: "doctor-dashboard", icon: <Icon d={I.home} /> },
  { id: "patients", label: "Patients", page: "doctor-patients", icon: <Icon d={I.users} /> },
  { id: "messages", label: "Messages", page: "doctor-chat", icon: <Icon d={I.chat} /> },
  { id: "earnings", label: "Earnings", page: "doctor-earnings", icon: <Icon d={I.money} /> },
  { id: "profile", label: "Profile", page: "doctor-profile-mgmt", icon: <Icon d={I.user} /> },
];

const DOCTOR_SIDEBAR_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: [
      { id: "home", label: "Dashboard", page: "doctor-dashboard", icon: <Icon d={I.home} /> },
      { id: "workspace", label: "Today's Care", page: "doctor-workspace", icon: <Icon d={I.clipboard} /> },
      { id: "patients", label: "Patients", page: "doctor-patients", icon: <Icon d={I.users} /> },
      { id: "consultations", label: "Consultations", page: "doctor-consultations", icon: <Icon d={I.list} /> },
      { id: "messages", label: "Messages", page: "doctor-chat", icon: <Icon d={I.chat} /> },
    ],
  },
  {
    label: "Clinical",
    items: [
      { id: "care-plans", label: "Care Plans", page: "doctor-care-plans", icon: <Icon d={I.clipboard} /> },
      { id: "follow-ups", label: "Follow-ups", page: "doctor-follow-ups", icon: <Icon d={I.list} /> },
      { id: "rx-reviews", label: "Rx Reviews", page: "prescription-reviews", icon: <Icon d={I.doc} /> },
      { id: "referrals", label: "Referrals", page: "doctor-referrals", icon: <Icon d={I.share} /> },
    ],
  },
  {
    label: "Practice",
    items: [
      { id: "availability", label: "Availability", page: "doctor-availability", icon: <Icon d={I.calendar} /> },
      { id: "analytics", label: "Analytics", page: "doctor-analytics", icon: <Icon d={I.pulse} /> },
      { id: "earnings", label: "Earnings", page: "doctor-earnings", icon: <Icon d={I.money} /> },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "verification", label: "Verification", page: "doctor-verification", icon: <Icon d={I.check} /> },
      { id: "profile-mgmt", label: "My Profile", page: "doctor-profile-mgmt", icon: <Icon d={I.user} /> },
      { id: "support", label: "Support", page: "support-center", icon: <Icon d={I.life} /> },
      { id: "settings", label: "Settings", page: "doctor-settings", icon: <Icon d={I.settings} /> },
    ],
  },
];

// ─── Enterprise ───────────────────────────────────────────────────────────────
const ENTERPRISE_NAV: NavItem[] = [
  { id: "home", label: "Overview", page: "enterprise-dashboard", icon: <Icon d={I.home} /> },
  { id: "members", label: "Members", page: "enterprise-members", icon: <Icon d={I.users} /> },
  { id: "programs", label: "Programs", page: "enterprise-programs", icon: <Icon d={I.clipboard} /> },
  { id: "reports", label: "Reports", page: "enterprise-reports", icon: <Icon d={I.pulse} /> },
  { id: "billing", label: "Billing", page: "enterprise-billing", icon: <Icon d={I.card} /> },
];

const ENTERPRISE_SIDEBAR_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ id: "home", label: "Dashboard", page: "enterprise-dashboard", icon: <Icon d={I.home} /> }],
  },
  {
    label: "Members",
    items: [
      { id: "members", label: "All Members", page: "enterprise-members", icon: <Icon d={I.users} /> },
      { id: "invitations", label: "Invitations", page: "enterprise-invitations", icon: <Icon d={I.mail} /> },
    ],
  },
  {
    label: "Healthcare",
    items: [
      { id: "programs", label: "Care Programs", page: "enterprise-programs", icon: <Icon d={I.clipboard} /> },
      { id: "utilization", label: "Utilization", page: "enterprise-utilization", icon: <Icon d={I.pulse} /> },
      { id: "assessments", label: "Assessments", page: "enterprise-assessments", icon: <Icon d={I.check} /> },
      { id: "referrals", label: "Referral network", page: "enterprise-referrals", icon: <Icon d={I.share} /> },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "billing", label: "Billing & Payments", page: "enterprise-billing", icon: <Icon d={I.card} /> },
      { id: "reports", label: "Reports", page: "enterprise-reports", icon: <Icon d={I.doc} /> },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "org-settings", label: "Organisation", page: "enterprise-settings", icon: <Icon d={I.settings} /> },
      { id: "support", label: "Support", page: "support-center", icon: <Icon d={I.life} /> },
    ],
  },
];

// ─── Admin ────────────────────────────────────────────────────────────────────
const ADMIN_NAV: NavItem[] = [
  { id: "overview", label: "Overview", page: "admin-dashboard", icon: <Icon d={I.home} /> },
  { id: "verification", label: "Verify", page: "admin-verification", icon: <Icon d={I.check} /> },
  { id: "support", label: "Support", page: "admin-support", icon: <Icon d={I.life} /> },
  { id: "payouts", label: "Payouts", page: "admin-payouts", icon: <Icon d={I.money} /> },
  { id: "analytics", label: "Insights", page: "admin-analytics", icon: <Icon d={I.pulse} /> },
];

const ADMIN_SIDEBAR_GROUPS: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { id: "overview", label: "Overview", page: "admin-dashboard", icon: <Icon d={I.home} /> },
      { id: "verification", label: "Doctor Verification", page: "admin-verification", icon: <Icon d={I.check} /> },
      { id: "patients", label: "Patients", page: "admin-patients", icon: <Icon d={I.user} /> },
      { id: "doctors", label: "Doctors", page: "admin-doctors", icon: <Icon d={I.users} /> },
      { id: "cross-border", label: "Cross-border", page: "admin-crossborder", icon: <Icon d={I.globe} /> },
      { id: "hospitals", label: "Hospital partners", page: "admin-hospitals", icon: <Icon d={I.building} /> },
    ],
  },
  {
    label: "Clinical",
    items: [
      { id: "prescriptions", label: "Prescriptions", page: "admin-prescriptions", icon: <Icon d={I.doc} /> },
      { id: "content", label: "Content moderation", page: "admin-content", icon: <Icon d={I.play} /> },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "payouts", label: "Payouts", page: "admin-payouts", icon: <Icon d={I.money} /> },
      { id: "refunds", label: "Refunds", page: "admin-refunds", icon: <Icon d={I.card} /> },
      { id: "analytics", label: "Business insights", page: "admin-analytics", icon: <Icon d={I.pulse} /> },
    ],
  },
  {
    label: "Trust",
    items: [
      { id: "support", label: "Support tickets", page: "admin-support", icon: <Icon d={I.life} /> },
      { id: "disputes", label: "Disputes", page: "admin-disputes", icon: <Icon d={I.alert} /> },
      { id: "audit-log", label: "Audit Log", page: "admin-audit-log", icon: <Icon d={I.shield} /> },
    ],
  },
];

function groupsFor(role: UserRole): NavGroup[] {
  if (role === "admin") return ADMIN_SIDEBAR_GROUPS;
  if (role === "doctor") return DOCTOR_SIDEBAR_GROUPS;
  if (role === "proxy") return PROXY_SIDEBAR_GROUPS;
  if (role === "enterprise") return ENTERPRISE_SIDEBAR_GROUPS;
  return PATIENT_SIDEBAR_GROUPS;
}

function navFor(role: UserRole): NavItem[] {
  if (role === "admin") return ADMIN_NAV;
  if (role === "proxy") return PROXY_NAV;
  if (role === "doctor") return DOCTOR_NAV;
  if (role === "enterprise") return ENTERPRISE_NAV;
  return PATIENT_NAV;
}

/** Internal admin roles only see the areas their remit covers. */
function filterGroups(groups: NavGroup[], role: UserRole, adminRole: AdminRole): NavGroup[] {
  if (role !== "admin") return groups;
  const allowed = ADMIN_ROLE_PAGES[adminRole];
  return groups
    .map((group) => ({ ...group, items: group.items.filter((item) => allowed.includes(item.page)) }))
    .filter((group) => group.items.length > 0);
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar({ role, mobileOpen, onClose }: { role: UserRole; mobileOpen: boolean; onClose: () => void }) {
  const { page, navigate, signOut, adminRole } = useApp();
  const patient = api.patient();
  const groups = filterGroups(groupsFor(role), role, adminRole);

  return (
    <>
      {mobileOpen && <button aria-label="Close navigation" onClick={onClose} className="lg:hidden fixed inset-0 z-40 bg-black/25" />}
      <aside
        className={`flex flex-col w-64 h-screen fixed lg:sticky top-0 left-0 z-50 border-r shrink-0 overflow-hidden transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ borderColor: C.border, backgroundColor: "white" }}
      >
        <div className="p-6 border-b shrink-0 flex items-center justify-between" style={{ borderColor: C.border }}>
          <button onClick={() => { navigate(role ? `${role}-dashboard` : "landing"); onClose(); }} aria-label="Docura home">
            <DocuraLogo size={36} showText />
          </button>
          <button aria-label="Close navigation" onClick={onClose} className="lg:hidden p-1" style={{ color: C.muted }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-5 overflow-y-auto scrollbar-none">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-4 mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: C.muted }}>{group.label}</p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = page === item.page;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { navigate(item.page, item.params || {}); onClose(); }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left w-full"
                      style={{ backgroundColor: active ? "#E6F1EE" : "transparent", color: active ? C.navy : C.muted, fontFamily: "var(--font-body)" }}
                    >
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t shrink-0" style={{ borderColor: C.border }}>
          {role === "patient" && (
            <button onClick={() => { navigate("patient-profile"); onClose(); }} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full text-left hover:bg-gray-50 transition-colors mb-1" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>
              <Avatar name={patient.name} size={26} />
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold truncate">{patient.name}</p>
                <p className="text-xs truncate" style={{ color: C.muted }}>View profile</p>
              </div>
            </button>
          )}
          <button onClick={() => { signOut(); onClose(); }} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full text-left hover:bg-red-50 transition-colors" style={{ color: C.coral, fontFamily: "var(--font-body)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── BottomNav ────────────────────────────────────────────────────────────────
const ACTIVE_GROUPS: Record<string, string[]> = {
  health: ["health-intelligence", "health-timeline", "patient-medications", "medical-documents", "patient-care-plans", "emergency-card", "health-passport", "patient-prescriptions"],
  care: ["care-team", "care-journey", "follow-ups", "travel-mode", "health-sharing", "patient-referrals"],
};

export function BottomNav({ nav }: { nav: NavItem[] }) {
  const { page, navigate } = useApp();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 flex" style={{ borderColor: C.border }}>
      {nav.map((item) => {
        const active = page === item.page || (ACTIVE_GROUPS[item.id] || []).includes(page);
        return (
          <button key={item.id} onClick={() => navigate(item.page, item.params || {})} className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors min-w-0" style={{ color: active ? C.navy : C.muted, fontFamily: "var(--font-body)" }}>
            {item.icon}
            <span className="truncate max-w-full px-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
export function TopBar({ title, back, actions, onOpenNav }: { title?: string; back?: boolean; actions?: ReactNode; onOpenNav: () => void }) {
  const { back: goBack, navigate, role, setRole, adminRole, setAdminRole, unreadCount } = useApp();
  const patient = api.patient();
  const notificationsPage = role === "admin" ? "admin-dashboard" : role === "enterprise" ? "enterprise-dashboard" : "patient-notifications";
  const dashboardOptions: { value: Exclude<UserRole, null>; label: string }[] = [
    { value: "patient", label: "Patient" },
    { value: "doctor", label: "Doctor" },
    { value: "proxy", label: "Proxy coordinator" },
    { value: "enterprise", label: "Enterprise" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b flex items-center gap-2 sm:gap-3 px-3 sm:px-4 h-14" style={{ borderColor: C.border }}>
      <button aria-label="Open navigation" onClick={onOpenNav} className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 shrink-0" style={{ color: C.navy }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {back && (
        <button aria-label="Go back" onClick={goBack} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0" style={{ color: C.navy }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
      )}
      {title && <h1 className="font-bold text-sm sm:text-base flex-1 truncate" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>{title}</h1>}
      {!title && <div className="flex-1" />}

      {role === "admin" && (
        <label className="hidden sm:flex items-center gap-1.5 rounded-xl border px-2 py-1.5" style={{ borderColor: C.border, color: C.muted }}>
          <span className="text-[10px] font-semibold uppercase tracking-wider">Role</span>
          <select
            aria-label="Switch internal admin role"
            value={adminRole}
            onChange={(event) => { setAdminRole(event.target.value as AdminRole); navigate("admin-dashboard"); }}
            className="bg-transparent text-xs font-semibold outline-none"
            style={{ color: C.navy }}
          >
            {api.adminRoles().map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </label>
      )}

      {role && (
        <label className="hidden sm:flex items-center gap-1.5 rounded-xl border px-2 py-1.5" style={{ borderColor: C.border, color: C.muted }}>
          <span className="text-[10px] font-semibold uppercase tracking-wider">Dashboard</span>
          <select
            aria-label="Switch dashboard"
            value={role}
            onChange={(event) => {
              const nextRole = event.target.value as Exclude<UserRole, null>;
              setRole(nextRole);
              navigate(`${nextRole}-dashboard`);
            }}
            className="bg-transparent text-xs font-semibold outline-none"
            style={{ color: C.navy }}
          >
            {dashboardOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      )}

      {role === "patient" && (
        <button onClick={() => navigate("patient-profile")} className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
          <Avatar name={patient.name} size={28} />
          <span className="text-sm font-medium" style={{ color: C.navy }}>{patient.name.split(" ")[0]}</span>
        </button>
      )}

      <button aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} onClick={() => navigate(notificationsPage)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors relative shrink-0" style={{ color: C.navy }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ backgroundColor: C.coral }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {actions}
    </header>
  );
}

// ─── AppShell ─────────────────────────────────────────────────────────────────
export function AppShell({ role, children, topBarTitle, showTopBarBack }: { role: UserRole; children: ReactNode; topBarTitle?: string; showTopBarBack?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = navFor(role);
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: C.warm }}>
      <Sidebar role={role} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <TopBar title={topBarTitle} back={showTopBarBack} onOpenNav={() => setMobileOpen(true)} />
        <main className="app-main flex-1 min-h-[calc(100vh-3.5rem)] w-full pb-24 lg:pb-8 p-0">
          {children}
        </main>
        {role !== "admin" && <BottomNav nav={nav} />}
      </div>
    </div>
  );
}
