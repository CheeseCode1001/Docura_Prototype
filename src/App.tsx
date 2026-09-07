import { useEffect } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { Button, C, ToastContainer } from "@/components/ui";
import { canAccess, HOME_PAGE, routeExists } from "@/routes";

// Public pages
import Landing from "@/pages/Landing";
import RoleSelect from "@/pages/RoleSelect";
import PublicPage, { PUBLIC_PAGES, type PublicPageKey } from "@/pages/PublicPage";

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
      <RouteGuard />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

/**
 * Enforces the route registry before a page renders. Permissions are not solved
 * by hiding navigation: someone who reaches a page they may not open is sent to
 * their own home, and an unknown page renders a real not-found screen.
 */
function RouteGuard() {
  const { page, role, adminRole, navigate } = useApp();
  const known = routeExists(page);
  const allowed = known && canAccess(page, role, adminRole);

  useEffect(() => {
    if (known && !allowed && role) {
      // Signed in but out of scope — land on the role's own dashboard.
      navigate(HOME_PAGE[role]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role, adminRole]);

  if (!known) return <NotFound />;
  if (!allowed) return role ? <NotFound /> : <SignInRequired />;
  return <Router />;
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
  const { navigate, role, signOut } = useApp();
  return (
    <Shell
      title="We could not find that page"
      body="The link may be out of date, or the page may not be part of your Docura account."
      actions={<>
        <Button onClick={() => navigate(role ? HOME_PAGE[role] : "landing")}>{role ? "Back to your dashboard" : "Back to home"}</Button>
        {role && <Button variant="outline" onClick={signOut}>Sign out</Button>}
      </>}
    />
  );
}

function SignInRequired() {
  const { navigate } = useApp();
  return (
    <Shell
      title="Sign in to continue"
      body="This part of Docura is only available once you are signed in to an account."
      actions={<>
        <Button onClick={() => navigate("login")}>Log in</Button>
        <Button variant="outline" onClick={() => navigate("role-select")}>Create an account</Button>
      </>}
    />
  );
}

function Router() {
  const { page } = useApp();

  // Every marketing page shares one template driven by the content registry.
  if (page.startsWith("public-")) {
    const key = page.replace("public-", "") as PublicPageKey;
    if (PUBLIC_PAGES[key]) return <PublicPage page={key} />;
  }

  switch (page) {
    // Public
    case "landing": return <Landing />;
    case "role-select": return <RoleSelect />;

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
    <AppProvider>
      <AppRoot />
    </AppProvider>
  );
}
