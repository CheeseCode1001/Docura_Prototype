import { ReactNode, useState } from "react";
import { useApp, UserRole } from "@/context/AppContext";
import { DocuraLogo, Avatar, C } from "@/components/ui";

interface NavItem {
  id: string;
  label: string;
  page: string;
  icon: ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

function Icon({ d, filled }: { d: string | string[]; filled?: boolean }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const PATIENT_NAV: NavItem[] = [
  { id: "home", label: "Home", page: "patient-dashboard", icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
  { id: "doctors", label: "Doctors", page: "find-doctor", icon: <Icon d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 3a4 4 0 100 8 4 4 0 000-8z"]} /> },
  { id: "care", label: "Care", page: "care-team", icon: <Icon d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 3a4 4 0 100 8 4 4 0 000-8z", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"]} /> },
  { id: "health", label: "Health", page: "health-intelligence", icon: <Icon d={["M22 12h-4l-3 9L9 3l-3 9H2"]} /> },
  { id: "messages", label: "Messages", page: "patient-chat", icon: <Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /> },
];

const PATIENT_SIDEBAR_GROUPS: NavGroup[] = [
  {
    label: "Home",
    items: [
      { id: "home", label: "Home", page: "patient-dashboard", icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
      { id: "doctors", label: "Find a Doctor", page: "find-doctor", icon: <Icon d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 3a4 4 0 100 8 4 4 0 000-8z"]} /> },
      { id: "messages", label: "Messages", page: "patient-chat", icon: <Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /> },
    ],
  },
  {
    label: "My Health",
    items: [
      { id: "health-intelligence", label: "Health Overview", page: "health-intelligence", icon: <Icon d={["M22 12h-4l-3 9L9 3l-3 9H2"]} /> },
      { id: "health-passport", label: "Health Passport", page: "health-passport", icon: <Icon d={["M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"]} /> },
      { id: "health-timeline", label: "Timeline", page: "health-timeline", icon: <Icon d={["M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"]} /> },
      { id: "medications", label: "Medications", page: "patient-medications", icon: <Icon d={["M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z"]} /> },
      { id: "documents", label: "Documents", page: "medical-documents", icon: <Icon d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8"]} /> },
      { id: "prescriptions", label: "Prescriptions", page: "patient-prescriptions", icon: <Icon d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6", "M16 13H8"]} /> },
      { id: "care-plans", label: "Care Plans", page: "patient-care-plans", icon: <Icon d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2 2 2 0 00-2-2h-2a2 2 0 00-2 2z", "M9 12h6", "M9 16h6"]} /> },
    ],
  },
  {
    label: "My Care",
    items: [
      { id: "care-team", label: "Care Team", page: "care-team", icon: <Icon d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 3a4 4 0 100 8 4 4 0 000-8z", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"]} /> },
      { id: "care-journey", label: "Care Journey", page: "care-journey", icon: <Icon d={["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"]} /> },
      { id: "follow-ups", label: "Follow-ups", page: "follow-ups", icon: <Icon d={["M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"]} /> },
    ],
  },
];

const DOCTOR_NAV: NavItem[] = [
  { id: "home", label: "Home", page: "doctor-dashboard", icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
  { id: "patients", label: "Patients", page: "doctor-patients", icon: <Icon d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 3a4 4 0 100 8 4 4 0 000-8z", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"]} /> },
  { id: "messages", label: "Messages", page: "doctor-chat", icon: <Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /> },
  { id: "earnings", label: "Earnings", page: "doctor-earnings", icon: <Icon d={["M12 2v20", "M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"]} /> },
  { id: "profile", label: "Profile", page: "doctor-profile-mgmt", icon: <Icon d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 3a4 4 0 100 8 4 4 0 000-8z"]} /> },
];

const DOCTOR_SIDEBAR_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: [
      { id: "home", label: "Dashboard", page: "doctor-dashboard", icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
      { id: "workspace", label: "Today's Care", page: "doctor-workspace", icon: <Icon d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2 2 2 0 00-2-2h-2a2 2 0 00-2 2z"]} /> },
      { id: "patients", label: "Patients", page: "doctor-patients", icon: <Icon d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 3a4 4 0 100 8 4 4 0 000-8z", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"]} /> },
      { id: "consultations", label: "Consultations", page: "doctor-consultations", icon: <Icon d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /> },
      { id: "messages", label: "Messages", page: "doctor-chat", icon: <Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /> },
    ],
  },
  {
    label: "Clinical",
    items: [
      { id: "care-plans", label: "Care Plans", page: "doctor-care-plans", icon: <Icon d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2 2 2 0 00-2-2h-2a2 2 0 00-2 2z", "M9 12h6", "M9 16h6"]} /> },
      { id: "follow-ups", label: "Follow-ups", page: "doctor-follow-ups", icon: <Icon d={["M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"]} /> },
      { id: "rx-reviews", label: "Rx Reviews", page: "prescription-reviews", icon: <Icon d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6"]} /> },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "earnings", label: "Earnings", page: "doctor-earnings", icon: <Icon d={["M12 2v20", "M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"]} /> },
      { id: "verification", label: "Verification", page: "doctor-verification", icon: <Icon d={["M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"]} /> },
      { id: "profile-mgmt", label: "My Profile", page: "doctor-profile-mgmt", icon: <Icon d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 3a4 4 0 100 8 4 4 0 000-8z"]} /> },
      { id: "settings", label: "Settings", page: "doctor-settings", icon: <Icon d={["M12 15a3 3 0 100-6 3 3 0 000 6z", "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"]} /> },
    ],
  },
];

const ENTERPRISE_NAV: NavItem[] = [
  { id: "home", label: "Overview", page: "enterprise-dashboard", icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
  { id: "members", label: "Members", page: "enterprise-dashboard", icon: <Icon d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 3a4 4 0 100 8 4 4 0 000-8z", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"]} /> },
  { id: "reports", label: "Reports", page: "enterprise-dashboard", icon: <Icon d={["M22 12h-4l-3 9L9 3l-3 9H2"]} /> },
  { id: "billing", label: "Billing", page: "enterprise-dashboard", icon: <Icon d={["M3 10h18", "M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"]} /> },
];

const ENTERPRISE_SIDEBAR_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { id: "home", label: "Dashboard", page: "enterprise-dashboard", icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
    ],
  },
  {
    label: "Members",
    items: [
      { id: "members", label: "All Members", page: "enterprise-dashboard", icon: <Icon d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 3a4 4 0 100 8 4 4 0 000-8z", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"]} /> },
      { id: "invitations", label: "Invitations", page: "enterprise-dashboard", icon: <Icon d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"]} /> },
    ],
  },
  {
    label: "Healthcare",
    items: [
      { id: "programs", label: "Care Programs", page: "enterprise-dashboard", icon: <Icon d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", "M9 5a2 2 0 002 2h2a2 2 0 002-2 2 2 0 00-2-2h-2a2 2 0 00-2 2z", "M9 12h6", "M9 16h6"]} /> },
      { id: "utilization", label: "Utilization", page: "enterprise-dashboard", icon: <Icon d={["M22 12h-4l-3 9L9 3l-3 9H2"]} /> },
      { id: "assessments", label: "Assessments", page: "enterprise-dashboard", icon: <Icon d={["M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"]} /> },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "billing", label: "Billing & Payments", page: "enterprise-dashboard", icon: <Icon d={["M3 10h18", "M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"]} /> },
      { id: "reports", label: "Reports", page: "enterprise-dashboard", icon: <Icon d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8"]} /> },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "org-settings", label: "Organisation", page: "enterprise-dashboard", icon: <Icon d={["M12 15a3 3 0 100-6 3 3 0 000 6z", "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"]} /> },
    ],
  },
];

const ADMIN_NAV: NavItem[] = [
  { id: "overview", label: "Overview", page: "admin-dashboard", icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
  { id: "verification", label: "Verify", page: "admin-verification", icon: <Icon d={["M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"]} /> },
  { id: "cross-border", label: "Cross-border", page: "admin-crossborder", icon: <Icon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /> },
  { id: "payouts", label: "Payouts", page: "admin-payouts", icon: <Icon d={["M12 2v20", "M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"]} /> },
  { id: "disputes", label: "Disputes", page: "admin-disputes", icon: <Icon d={["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"]} /> },
];

const ADMIN_SIDEBAR_GROUPS: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { id: "overview", label: "Overview", page: "admin-dashboard", icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /> },
      { id: "verification", label: "Doctor Verification", page: "admin-verification", icon: <Icon d={["M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"]} /> },
      { id: "patients", label: "Patients", page: "admin-patients", icon: <Icon d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 3a4 4 0 100 8 4 4 0 000-8z"]} /> },
      { id: "doctors", label: "Doctors", page: "admin-doctors", icon: <Icon d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 3a4 4 0 100 8 4 4 0 000-8z"]} /> },
      { id: "cross-border", label: "Cross-border", page: "admin-crossborder", icon: <Icon d={["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z", "M12 7a3 3 0 100 6 3 3 0 000-6z"]} /> },
    ],
  },
  {
    label: "Clinical",
    items: [
      { id: "prescriptions", label: "Prescriptions", page: "admin-prescriptions", icon: <Icon d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6"]} /> },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "payouts", label: "Payouts", page: "admin-payouts", icon: <Icon d={["M12 2v20", "M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"]} /> },
      { id: "refunds", label: "Refunds", page: "admin-refunds", icon: <Icon d={["M3 10h18", "M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"]} /> },
    ],
  },
  {
    label: "Trust",
    items: [
      { id: "disputes", label: "Disputes", page: "admin-disputes", icon: <Icon d={["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"]} /> },
      { id: "audit-log", label: "Audit Log", page: "admin-audit-log", icon: <Icon d={["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"]} /> },
    ],
  },
];

// ─── Sidebar (grouped, desktop) ───────────────────────────────────────────────
export function Sidebar({ role }: { role: UserRole }) {
  const { page, navigate, setRole } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const patientName = "Adaeze Okafor";
  const doctorName = "Dr. Amara Osei";
  const groups = role === "patient" ? PATIENT_SIDEBAR_GROUPS : role === "doctor" ? DOCTOR_SIDEBAR_GROUPS : role === "enterprise" ? ENTERPRISE_SIDEBAR_GROUPS : ADMIN_SIDEBAR_GROUPS;

  return (
    <>
      {mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 z-40 bg-black/25" />}
      <aside className={`flex flex-col w-64 h-screen fixed lg:sticky top-0 left-0 z-50 border-r shrink-0 overflow-hidden transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ borderColor: C.border, backgroundColor: "white" }}>
        <div className="p-6 border-b shrink-0" style={{ borderColor: C.border }}>
          <DocuraLogo size={36} showText />
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
                      onClick={() => { navigate(item.page); setMobileOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left w-full"
                      style={{ backgroundColor: active ? "#E6F1EE" : "transparent", color: active ? C.navy : C.muted, fontFamily: "var(--font-body)" }}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t shrink-0" style={{ borderColor: C.border }}>
          {role === "patient" && (
            <button onClick={() => { navigate("patient-profile"); setMobileOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full text-left hover:bg-gray-50 transition-colors mb-1" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>
              <Avatar name={patientName} size={26} />
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold truncate">{patientName}</p>
                <p className="text-xs truncate" style={{ color: C.muted }}>View profile</p>
              </div>
            </button>
          )}
          <button onClick={() => { setRole(null); navigate("landing"); setMobileOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full text-left hover:bg-red-50 transition-colors" style={{ color: C.coral, fontFamily: "var(--font-body)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            Sign out
          </button>
        </div>
      </aside>
      <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="lg:hidden fixed left-4 bottom-20 z-30 w-11 h-11 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: C.navy, color: "white" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
    </>
  );
}

// ─── BottomNav ────────────────────────────────────────────────────────────────
export function BottomNav({ nav }: { nav: NavItem[] }) {
  const { page, navigate } = useApp();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 flex" style={{ borderColor: C.border }}>
      {nav.map((item) => {
        const active = page === item.page || (item.id === "health" && ["health-intelligence", "health-passport", "health-timeline", "patient-medications", "medical-documents", "patient-care-plans", "emergency-card"].includes(page)) || (item.id === "care" && ["care-team", "care-journey", "follow-ups", "travel-mode", "health-sharing"].includes(page));
        return (
          <button key={item.id} onClick={() => navigate(item.page)} className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors" style={{ color: active ? C.navy : C.muted, fontFamily: "var(--font-body)" }}>
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
export function TopBar({ title, back, actions }: { title?: string; back?: boolean; actions?: ReactNode }) {
  const { back: goBack, navigate, role } = useApp();
  const patientName = "Adaeze Okafor";
  const notificationsPage = role === "patient" ? "patient-notifications" : role === "doctor" ? "doctor-chat" : role === "enterprise" ? "enterprise-dashboard" : "admin-dashboard";
  return (
    <header className="sticky top-0 z-30 bg-white border-b flex items-center gap-3 px-4 h-14" style={{ borderColor: C.border }}>
      {back && (
        <button onClick={goBack} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0" style={{ color: C.navy }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
      )}
      <div className="lg:hidden mr-auto">
        {!back && <DocuraLogo size={30} showText />}
      </div>
      {title && <h1 className="font-bold text-base flex-1 truncate" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>{title}</h1>}
      {!title && <div className="flex-1" />}
      {role === "patient" && (
        <button
          onClick={() => navigate("patient-profile")}
          className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Avatar name={patientName} size={28} />
          <span className="text-sm font-medium" style={{ color: C.navy }}>{patientName.split(" ")[0]}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
        </button>
      )}
      <button aria-label="Open notifications" onClick={() => navigate(notificationsPage)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors relative" style={{ color: C.navy }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: C.coral }} />
      </button>
      {actions}
    </header>
  );
}

// ─── AppShell ─────────────────────────────────────────────────────────────────
export function AppShell({ role, children, topBarTitle, showTopBarBack }: { role: UserRole; children: ReactNode; topBarTitle?: string; showTopBarBack?: boolean }) {
  const nav = role === "patient" ? PATIENT_NAV : role === "doctor" ? DOCTOR_NAV : role === "enterprise" ? ENTERPRISE_NAV : ADMIN_NAV;
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: C.warm }}>
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <TopBar title={topBarTitle} back={showTopBarBack} />
        <main className="app-main flex-1 min-h-[calc(100vh-3.5rem)] w-full pb-24 lg:pb-8 p-0">
          {children}
        </main>
        {role !== "admin" && <BottomNav nav={nav} />}
      </div>
    </div>
  );
}
