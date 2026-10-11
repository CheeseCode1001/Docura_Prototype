import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import { Button, C, ToastContainer } from "@/components/ui";
import { canAccess, HOME_PAGE, routeExists, resolveRoute, ROUTES } from "@/routes";

// Public pages
import Landing from "@/pages/Landing";
import RoleSelect from "@/pages/RoleSelect";
import PublicPage, { PUBLIC_PAGES, type PublicPageKey } from "@/pages/PublicPage";
import CrossBorderCare from "@/pages/CrossBorderCare";

// Auth
import AuthLayout from "@/pages/auth/Auth";

// Patient pages
import PatientOnboarding from "@/pages/patient/Onboarding";
import PatientDashboard from "@/pages/patient/Dashboard";
import FindDoctor from "@/pages/patient/FindDoctor";
import DoctorProfile from "@/pages/patient/DoctorProfile";
import DocuraNow from "@/pages/patient/DocuraNow";
import DocuraCare from "@/pages/patient/DocuraCare";
import PatientChat from "@/pages/patient/Chat";
import Prescriptions from "@/pages/patient/Prescriptions";
import HealthRecord from "@/pages/patient/HealthRecord";
import PatientPayments from "@/pages/patient/Payments";
import Notifications from "@/pages/patient/Notifications";
import PatientConsultations from "@/pages/patient/Consultations";
import PatientSettings from "@/pages/patient/Settings";
import HealthIntelligence from "@/pages/patient/HealthIntelligence";
import HealthTimeline from "@/pages/patient/HealthTimeline";
import Medications from "@/pages/patient/Medications";
import MedicalDocuments from "@/pages/patient/MedicalDocuments";
import EmergencyCard from "@/pages/patient/EmergencyCard";
import HealthPassport from "@/pages/patient/HealthPassport";
import CarePlans from "@/pages/patient/CarePlans";
import FollowUps from "@/pages/patient/FollowUps";
import CareTeam from "@/pages/patient/CareTeam";
import CareJourney from "@/pages/patient/CareJourney";
import TravelMode from "@/pages/patient/TravelMode";
import HealthSharing from "@/pages/patient/HealthSharing";
import PatientProfile from "@/pages/patient/Profile";
import PatientReferrals from "@/pages/patient/Referrals";

// Shared feature pages
import ConsultationRoom from "@/pages/consultation/ConsultationRoom";
import { SupportCenter, SupportTicketPage, NotificationPreferences } from "@/pages/support/Support";
import { TvHome, TvTopic, TvContentPage, TvCreatorPage, TvSaved } from "@/pages/tv/DocuraTV";

// Proxy pages
import { ProxyDashboard, ProxyPermissions, ProxyConsent, ProxyTimeline, ProxyMessages } from "@/pages/proxy/Proxy";

// Enterprise pages
import EnterpriseDashboard from "@/pages/enterprise/Dashboard";
import {
  EnterpriseMembers, EnterpriseInvitations, EnterprisePrograms, EnterpriseUtilization, EnterpriseAssessments,
  EnterpriseBilling, EnterpriseReports, EnterpriseReferrals, EnterpriseSettings,
} from "@/pages/enterprise/Pages";

// Doctor pages
import DoctorOnboarding from "@/pages/doctor/Onboarding";
import DoctorDashboard from "@/pages/doctor/Dashboard";
import DoctorPatients from "@/pages/doctor/Patients";
import DoctorConsultations from "@/pages/doctor/Consultations";
import DoctorChat from "@/pages/doctor/DoctorChat";
import PrescriptionReviews from "@/pages/doctor/PrescriptionReviews";
import DoctorEarnings from "@/pages/doctor/Earnings";
import DoctorVerification from "@/pages/doctor/Verification";
import DoctorProfileMgmt from "@/pages/doctor/ProfileMgmt";
import DoctorSettings from "@/pages/doctor/Settings";
import CareWorkspace from "@/pages/doctor/CareWorkspace";
import DoctorCarePlans from "@/pages/doctor/DoctorCarePlans";
import DoctorFollowUps from "@/pages/doctor/DoctorFollowUps";
import { DoctorAnalytics, DoctorReferrals, DoctorAvailability } from "@/pages/doctor/Practice";
import PatientAlerts from "@/pages/doctor/PatientAlerts";
import LabOrders from "@/pages/doctor/LabOrders";
import GrowPractice from "@/pages/doctor/GrowPractice";
import PrescribingWorkspace from "@/pages/doctor/PrescribingWorkspace";
import ProfessionalConcerns from "@/pages/doctor/ProfessionalConcerns";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminVerification from "@/pages/admin/Verification";
import AdminCrossBorder from "@/pages/admin/CrossBorder";
import AdminPayouts from "@/pages/admin/Payouts";
import AdminRefunds from "@/pages/admin/Refunds";
import AdminDisputes from "@/pages/admin/Disputes";
import AdminPatients from "@/pages/admin/AdminPatients";
import AdminDoctors from "@/pages/admin/AdminDoctors";
import AuditLog from "@/pages/admin/AuditLog";
import AdminPrescriptions from "@/pages/admin/AdminPrescriptions";
import { AdminSupport, AdminAnalytics, AdminHospitals, AdminContent } from "@/pages/admin/Platform";

function AppRoot() {
  const { toasts, removeToast } = useApp();
  return (
    <>
      <Routes>
        {/* Core Marketing */}
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/role-select" element={<RoleSelect />} />
        <Route path="/cross-border" element={<CrossBorderCare />} />
        <Route path="/crossborder" element={<CrossBorderCare />} />
        <Route path="/cross-border-care" element={<CrossBorderCare />} />
        <Route path="/public-crossborder" element={<CrossBorderCare />} />

        {/* Doctor Dashboard direct routes */}
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />

        {/* Patient Dashboard direct routes */}
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />

        {/* Admin Dashboard direct routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Proxy Dashboard direct routes */}
        <Route path="/proxy-dashboard" element={<ProxyDashboard />} />
        <Route path="/proxy" element={<ProxyDashboard />} />

        {/* Enterprise Dashboard direct routes */}
        <Route path="/enterprise-dashboard" element={<EnterpriseDashboard />} />
        <Route path="/enterprise" element={<EnterpriseDashboard />} />

        {/* Catch-all dynamic routes */}
        <Route path="/:pageId" element={<RouteDispatcher />} />
        <Route path="/:section/:pageId" element={<NestedRouteDispatcher />} />
        <Route path="*" element={<RouteDispatcher />} />
      </Routes>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

function RouteDispatcher() {
  const params = useParams();
  const { page } = useApp();
  const rawKey = params.pageId || page;
  const canonical = resolveRoute(rawKey);

  if (canonical === "cross-border-care" || canonical === "cross-border" || canonical === "public-crossborder") {
    return <CrossBorderCare />;
  }

  if (canonical.startsWith("public-")) {
    const key = canonical.replace("public-", "") as PublicPageKey;
    if (PUBLIC_PAGES[key]) return <PublicPage page={key} />;
  } else if (PUBLIC_PAGES[canonical as PublicPageKey]) {
    return <PublicPage page={canonical as PublicPageKey} />;
  }

  return <Router canonical={canonical} />;
}

function NestedRouteDispatcher() {
  const params = useParams();
  const rawKey = `${params.section || ""}/${params.pageId || ""}`;
  const canonical = resolveRoute(rawKey);

  if (canonical.startsWith("public-")) {
    const key = canonical.replace("public-", "") as PublicPageKey;
    if (PUBLIC_PAGES[key]) return <PublicPage page={key} />;
  } else if (PUBLIC_PAGES[canonical as PublicPageKey]) {
    return <PublicPage page={canonical as PublicPageKey} />;
  }

  return <Router canonical={canonical} />;
}

function Shell({ title, body, actions }: { title: string; body: string; actions: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ backgroundColor: C.warm, fontFamily: "var(--font-body)" }}>
      <p className="text-5xl mb-4">🧭</p>
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{title}</h1>
      <p className="text-sm max-w-sm mb-7" style={{ color: C.muted }}>{body}</p>
      <div className="flex flex-wrap gap-2 justify-center">{actions}</div>
    </div>
  );
}

function NotFound() {
  const { navigate, role, signOut, page } = useApp();
  return (
    <Shell
      title="We could not find that page"
      body={`The link "${page}" may be out of date, or the page may not be part of your Docura account.`}
      actions={<>
        <Button onClick={() => navigate(role ? HOME_PAGE[role] : "landing")}>{role ? "Back to your dashboard" : "Back to home"}</Button>
        {role && <Button variant="outline" onClick={signOut}>Sign out</Button>}
      </>}
    />
  );
}

function SignInRequired() {
  const { navigate, setRole, page } = useApp();
  const canonical = resolveRoute(page);
  const route = ROUTES[canonical];
  const requiredRoles = route && route.roles !== "public" ? route.roles : [];

  const handleDemoAccess = (demoRole: "patient" | "doctor" | "proxy" | "enterprise" | "admin") => {
    setRole(demoRole);
    navigate(canonical);
  };

  return (
    <Shell
      title="Sign in to continue"
      body={`This section (${canonical}) is available to signed-in accounts.`}
      actions={
        <div className="flex flex-col gap-3 items-center">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={() => navigate("login")}>Log in</Button>
            <Button variant="outline" onClick={() => navigate("role-select")}>Create an account</Button>
          </div>
          {requiredRoles.length > 0 && (
            <div className="pt-2 border-t border-slate-200 w-full flex flex-wrap gap-2 justify-center items-center">
              <span className="text-xs text-slate-500 font-medium mr-1">Demo Access:</span>
              {requiredRoles.map((r) => (
                <button
                  key={r}
                  onClick={() => handleDemoAccess(r as any)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer"
                >
                  ⚡ Access as {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      }
    />
  );
}

function Router({ canonical: propCanonical }: { canonical?: string } = {}) {
  const { page } = useApp();
  const canonical = propCanonical || resolveRoute(page);

  // Cross-Border Care
  if (canonical === "cross-border-care" || canonical === "cross-border" || canonical === "public-crossborder") {
    return <CrossBorderCare />;
  }

  // Public marketing pages (both public-prefix and short names)
  if (canonical.startsWith("public-")) {
    const key = canonical.replace("public-", "") as PublicPageKey;
    if (PUBLIC_PAGES[key]) return <PublicPage page={key} />;
  } else if (PUBLIC_PAGES[canonical as PublicPageKey]) {
    return <PublicPage page={canonical as PublicPageKey} />;
  }

  switch (canonical) {
    // Public
    case "landing": return <Landing />;
    case "role-select": return <RoleSelect />;
    case "cross-border-care": return <CrossBorderCare />;

    // Auth
    case "login": return <AuthLayout initialView="login" />;
    case "signup": return <AuthLayout initialView="signup" />;
    case "forgot-password": return <AuthLayout initialView="forgot" />;
    case "otp": return <AuthLayout initialView="otp" />;
    case "reset-password": return <AuthLayout initialView="reset" />;
    case "signup-success": return <AuthLayout initialView="success" />;
    case "doctor-login": return <AuthLayout initialView="doctor-login" />;
    case "doctor-signup": return <AuthLayout initialView="doctor-signup" />;
    case "admin-login": return <AuthLayout initialView="admin-login" />;

    // Docura TV
    case "tv-home": return <TvHome />;
    case "tv-topic": return <TvTopic />;
    case "tv-content": return <TvContentPage />;
    case "tv-creator": return <TvCreatorPage />;
    case "tv-saved": return <TvSaved />;

    // Patient app
    case "patient-onboarding": return <PatientOnboarding />;
    case "patient-dashboard": return <PatientDashboard />;
    case "find-doctor": return <FindDoctor />;
    case "doctor-profile": return <DoctorProfile />;
    case "docura-now-flow": return <DocuraNow />;
    case "patient-care": return <DocuraCare />;
    case "consultation-room": return <ConsultationRoom />;
    case "patient-chat": return <PatientChat />;
    case "patient-prescriptions": return <Prescriptions />;
    case "health-record": return <HealthRecord />;
    case "patient-payments": return <PatientPayments />;
    case "patient-notifications": return <Notifications />;
    case "notification-preferences": return <NotificationPreferences />;
    case "patient-consultations": return <PatientConsultations />;
    case "patient-settings": return <PatientSettings />;
    case "health-intelligence": return <HealthIntelligence />;
    case "health-timeline": return <HealthTimeline />;
    case "patient-medications": return <Medications />;
    case "medical-documents": return <MedicalDocuments />;
    case "emergency-card": return <EmergencyCard />;
    case "health-passport": return <HealthPassport />;
    case "patient-care-plans": return <CarePlans />;
    case "follow-ups": return <FollowUps />;
    case "care-team": return <CareTeam />;
    case "care-journey": return <CareJourney />;
    case "travel-mode": return <TravelMode />;
    case "health-sharing": return <HealthSharing />;
    case "patient-profile": return <PatientProfile />;
    case "patient-referrals": return <PatientReferrals />;
    case "support-center": return <SupportCenter />;
    case "support-ticket": return <SupportTicketPage />;

    // Proxy
    case "proxy-dashboard": return <ProxyDashboard />;
    case "proxy-permissions": return <ProxyPermissions />;
    case "proxy-consent": return <ProxyConsent />;
    case "proxy-timeline": return <ProxyTimeline />;
    case "proxy-messages": return <ProxyMessages />;

    // Enterprise
    case "enterprise-dashboard": return <EnterpriseDashboard />;
    case "enterprise-members": return <EnterpriseMembers />;
    case "enterprise-invitations": return <EnterpriseInvitations />;
    case "enterprise-programs": return <EnterprisePrograms />;
    case "enterprise-utilization": return <EnterpriseUtilization />;
    case "enterprise-assessments": return <EnterpriseAssessments />;
    case "enterprise-billing": return <EnterpriseBilling />;
    case "enterprise-reports": return <EnterpriseReports />;
    case "enterprise-referrals": return <EnterpriseReferrals />;
    case "enterprise-settings": return <EnterpriseSettings />;

    // Doctor app
    case "doctor-onboarding": return <DoctorOnboarding />;
    case "doctor-dashboard": return <DoctorDashboard />;
    case "doctor-patients": return <DoctorPatients />;
    case "doctor-consultations": return <DoctorConsultations />;
    case "doctor-chat": return <DoctorChat />;
    case "prescription-reviews": return <PrescriptionReviews />;
    case "doctor-earnings": return <DoctorEarnings />;
    case "doctor-profile-mgmt": return <DoctorProfileMgmt />;
    case "doctor-verification": return <DoctorVerification />;
    case "doctor-settings": return <DoctorSettings />;
    case "doctor-workspace": return <CareWorkspace />;
    case "doctor-care-plans": return <DoctorCarePlans />;
    case "doctor-follow-ups": return <DoctorFollowUps />;
    case "doctor-analytics": return <DoctorAnalytics />;
    case "doctor-referrals": return <DoctorReferrals />;
    case "doctor-availability": return <DoctorAvailability />;
    case "doctor-patient-alerts": return <PatientAlerts />;
    case "doctor-labs": return <LabOrders />;
    case "doctor-grow-practice": return <GrowPractice />;
    case "prescribing-workspace": return <PrescribingWorkspace />;
    case "doctor-concerns": return <ProfessionalConcerns />;

    // Admin app
    case "admin-dashboard": return <AdminDashboard />;
    case "admin-verification": return <AdminVerification />;
    case "admin-crossborder": return <AdminCrossBorder />;
    case "admin-payouts": return <AdminPayouts />;
    case "admin-refunds": return <AdminRefunds />;
    case "admin-disputes": return <AdminDisputes />;
    case "admin-patients": return <AdminPatients />;
    case "admin-doctors": return <AdminDoctors />;
    case "admin-audit-log": return <AuditLog />;
    case "admin-prescriptions": return <AdminPrescriptions />;
    case "admin-support": return <AdminSupport />;
    case "admin-analytics": return <AdminAnalytics />;
    case "admin-hospitals": return <AdminHospitals />;
    case "admin-content": return <AdminContent />;

    default: return <NotFound />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoot />
      </AppProvider>
    </BrowserRouter>
  );
}
