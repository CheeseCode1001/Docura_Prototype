import { AppProvider, useApp } from "@/context/AppContext";
import { ToastContainer } from "@/components/ui";

// Public pages
import Landing from "@/pages/Landing";
import RoleSelect, { ProxyWaitlist } from "@/pages/RoleSelect";
import PublicPage from "@/pages/PublicPage";

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
import PatientNotifications from "@/pages/patient/Notifications";
import PatientConsultations from "@/pages/patient/Consultations";
import PatientSettings from "@/pages/patient/Settings";
import HealthIntelligence from "@/pages/patient/HealthIntelligence";
import HealthPassport from "@/pages/patient/HealthPassport";
import HealthTimeline from "@/pages/patient/HealthTimeline";
import Medications from "@/pages/patient/Medications";
import MedicalDocuments from "@/pages/patient/MedicalDocuments";
import EmergencyCard from "@/pages/patient/EmergencyCard";
import CarePlans from "@/pages/patient/CarePlans";
import FollowUps from "@/pages/patient/FollowUps";
import CareTeam from "@/pages/patient/CareTeam";
import CareJourney from "@/pages/patient/CareJourney";
import TravelMode from "@/pages/patient/TravelMode";
import HealthSharing from "@/pages/patient/HealthSharing";
import PatientProfile from "@/pages/patient/Profile";

// Enterprise pages
import EnterpriseDashboard from "@/pages/enterprise/Dashboard";
import ProxyDashboard from "@/pages/proxy/Dashboard";

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

function AppRoot() {
  const { toasts, removeToast } = useApp();
  return (
    <>
      <Router />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

function Router() {
  const { page, role, navigate } = useApp();

  const protectedRole = page.startsWith("doctor-") ? "doctor" : page.startsWith("admin-") ? "admin" : page.startsWith("patient-") || ["find-doctor", "doctor-profile", "docura-now-flow", "patient-care", "health-record", "health-intelligence", "health-passport", "health-timeline", "patient-medications", "medical-documents", "emergency-card", "patient-care-plans", "follow-ups", "care-team", "care-journey", "travel-mode", "health-sharing"].includes(page) ? "patient" : page.startsWith("enterprise-") ? "enterprise" : page.startsWith("proxy-") ? "proxy" : null;
  if (protectedRole && role !== protectedRole) {
    return <AccessDenied expectedRole={protectedRole} onReturn={() => navigate(role ? `${role}-dashboard` : "landing")} />;
  }

  switch (page) {
    // Public
    case "landing": return <Landing />;
    case "role-select": return <RoleSelect />;
    case "proxy-waitlist": return <ProxyWaitlist />;
    case "public-how-it-works": return <PublicPage page="how-it-works" />;
    case "public-care": return <PublicPage page="care" />;
    case "public-now": return <PublicPage page="now" />;
    case "public-doctors": return <PublicPage page="doctors" />;
    case "public-about": return <PublicPage page="about" />;
    case "public-contact": return <PublicPage page="contact" />;
    case "public-help": return <PublicPage page="help" />;
    case "public-privacy": return <PublicPage page="privacy" />;
    case "public-terms": return <PublicPage page="terms" />;
    case "public-security": return <PublicPage page="security" />;

    // Auth — patient
    case "login": return <AuthLayout initialView="login" />;
    case "signup": return <AuthLayout initialView="signup" />;
    case "forgot-password": return <AuthLayout initialView="forgot" />;
    case "otp": return <AuthLayout initialView="otp" />;
    case "reset-password": return <AuthLayout initialView="reset" />;
    case "signup-success": return <AuthLayout initialView="success" />;

    // Auth — doctor
    case "doctor-login": return <AuthLayout initialView="doctor-login" />;
    case "doctor-signup": return <AuthLayout initialView="doctor-signup" />;

    // Patient app
    case "patient-onboarding": return <PatientOnboarding />;
    case "patient-dashboard": return <PatientDashboard />;
    case "find-doctor": return <FindDoctor />;
    case "doctor-profile": return <DoctorProfile />;
    case "docura-now-flow": return <DocuraNow />;
    case "patient-care": return <DocuraCare />;
    case "patient-chat": return <PatientChat />;
    case "patient-prescriptions": return <Prescriptions />;
    case "health-record": return <HealthRecord />;
    case "patient-payments": return <PatientPayments />;
    case "patient-notifications": return <PatientNotifications />;
    case "patient-consultations": return <PatientConsultations />;
    case "patient-settings": return <PatientSettings />;
    case "health-intelligence": return <HealthIntelligence />;
    case "health-passport": return <HealthPassport />;
    case "health-timeline": return <HealthTimeline />;
    case "patient-medications": return <Medications />;
    case "medical-documents": return <MedicalDocuments />;
    case "emergency-card": return <EmergencyCard />;
    case "patient-care-plans": return <CarePlans />;
    case "follow-ups": return <FollowUps />;
    case "care-team": return <CareTeam />;
    case "care-journey": return <CareJourney />;
    case "travel-mode": return <TravelMode />;
    case "health-sharing": return <HealthSharing />;
    case "patient-profile": return <PatientProfile />;

    // Enterprise
    case "enterprise-dashboard": return <EnterpriseDashboard />;
    case "proxy-dashboard": return <ProxyDashboard />;

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

    default: return <Landing />;
  }
}

function AccessDenied({ expectedRole, onReturn }: { expectedRole: string; onReturn: () => void }) {
  return <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#FAFAF8", fontFamily: "var(--font-body)" }}><div className="max-w-md text-center"><p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#FFAA3D" }}>Restricted workspace</p><h1 className="text-3xl font-bold mb-3" style={{ color: "#155F54", fontFamily: "var(--font-display)" }}>This workspace is not available for your account.</h1><p className="text-sm mb-6" style={{ color: "#71817D" }}>Your current role does not have permission to view the {expectedRole} workspace.</p><button onClick={onReturn} className="px-5 py-3 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#155F54" }}>Return to my workspace</button></div></div>;
}

export default function App() {
  return (
    <AppProvider>
      <AppRoot />
    </AppProvider>
  );
}
