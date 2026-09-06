import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Avatar, Badge, C } from "@/components/ui";
import { useApp } from "@/context/AppContext";

const PATIENT = {
  name: "Adaeze Okafor",
  preferredName: "Ada",
  dob: "14 March 1994",
  gender: "Female",
  id: "PT-20481",
  phone: "+234 803 445 7821",
  email: "adaeze.okafor@gmail.com",
  address: "14 Bourdillon Road, Ikoyi, Lagos",
  emergencyContact: "Chukwuemeka Okafor — +234 802 330 1192",
  bloodType: "O+",
  allergies: ["Penicillin", "Latex"],
  conditions: ["Type 2 Diabetes", "Mild Hypertension"],
  physician: "Dr. Amara Osei",
  pharmacy: "HealthPlus Pharmacy, Victoria Island",
  insurer: "AIICO Insurance",
  insurerNo: "AIC-2024-998871",
};

const CARD = {
  backgroundColor: "white",
  border: "1px solid rgba(21,95,84,0.08)",
  borderRadius: 20,
  boxShadow: "0 12px 32px rgba(21,95,84,0.05)",
};

const SECTION_TITLE = { fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: C.muted, marginBottom: 16 };

function SectionCard({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <div style={CARD} className="p-6">
      <div className="flex items-center justify-between mb-4">
        <p style={SECTION_TITLE}>{title}</p>
        {action && (
          <button className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80" style={{ backgroundColor: C.amberLight, color: C.amber }}>
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b last:border-0" style={{ borderColor: "#f0f2f7" }}>
      <span className="text-xs font-medium" style={{ color: C.muted }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: C.navy }}>{value}</span>
    </div>
  );
}

function Toggle({ label, sub, defaultOn = false }: { label: string; sub?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: "#f0f2f7" }}>
      <div>
        <p className="text-sm font-medium" style={{ color: C.navy }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: C.muted }}>{sub}</p>}
      </div>
      <button
        onClick={() => setOn(v => !v)}
        className="w-10 h-6 rounded-full transition-colors relative shrink-0"
        style={{ backgroundColor: on ? C.amber : "#d1d5db" }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
          style={{ transform: on ? "translateX(18px)" : "translateX(2px)" }}
        />
      </button>
    </div>
  );
}

function LinkBtn({ label, page }: { label: string; page: string }) {
  const { navigate } = useApp();
  return (
    <button
      onClick={() => navigate(page)}
      className="flex items-center justify-between w-full py-2.5 text-sm font-medium border-b last:border-0 hover:opacity-70 transition-opacity"
      style={{ color: C.navy, borderColor: "#f0f2f7" }}
    >
      {label}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
    </button>
  );
}

export default function PatientProfile() {
  const { navigate } = useApp();

  return (
    <AppShell role="patient" topBarTitle="Profile">
      <div className="editorial-page w-full flex flex-col gap-8">

        {/* Profile Header */}
        <div style={{ ...CARD, border: "none", background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMuted} 100%)` }} className="p-6 md:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative shrink-0">
              <Avatar name={PATIENT.name} size={80} />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#22c55e" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60 mb-2">Your health, your way</p>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>{PATIENT.name}</h1>
              <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Date of birth: {PATIENT.dob} · {PATIENT.gender}</p>
              <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>Patient ID #{PATIENT.id}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(34,197,94,0.2)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                  <span className="text-xs font-semibold" style={{ color: "#4ade80" }}>Profile verified</span>
                </div>
              </div>
            </div>
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0"
              style={{ backgroundColor: C.amber, color: "white" }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid lg:grid-cols-2 gap-5">

          {/* Personal Information */}
          <SectionCard title="Personal Information" action="Edit">
            <InfoRow label="Full name" value={PATIENT.name} />
            <InfoRow label="Preferred name" value={PATIENT.preferredName} />
            <InfoRow label="Date of birth" value={PATIENT.dob} />
            <InfoRow label="Gender" value={PATIENT.gender} />
            <InfoRow label="Phone number" value={PATIENT.phone} />
            <InfoRow label="Email address" value={PATIENT.email} />
            <InfoRow label="Home address" value={PATIENT.address} />
            <InfoRow label="Emergency contact" value={PATIENT.emergencyContact} />
          </SectionCard>

          {/* Health Profile */}
          <SectionCard title="Health Profile" action="Edit">
            <InfoRow label="Blood type" value={PATIENT.bloodType} />
            <InfoRow label="Allergies" value={PATIENT.allergies.join(", ")} />
            <InfoRow label="Chronic conditions" value={PATIENT.conditions.join(", ")} />
            <InfoRow label="Primary physician" value={PATIENT.physician} />
            <InfoRow label="Preferred pharmacy" value={PATIENT.pharmacy} />
            <InfoRow label="Insurance provider" value={PATIENT.insurer} />
            <InfoRow label="Member number" value={PATIENT.insurerNo} />
          </SectionCard>

        </div>

        {/* Emergency Information */}
        <SectionCard title="Emergency Information">
          <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: "#fff5f5", border: "1px solid #fecaca" }}>
            <div className="flex items-center gap-2 mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#ef4444" }}>Emergency Card</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: C.muted }}>Patient</p>
                <p className="font-semibold" style={{ color: C.navy }}>{PATIENT.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: C.muted }}>Blood type</p>
                <p className="font-bold text-lg" style={{ color: "#ef4444" }}>{PATIENT.bloodType}</p>
              </div>
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: C.muted }}>Critical allergies</p>
                <p className="font-medium" style={{ color: C.navy }}>{PATIENT.allergies.join(", ")}</p>
              </div>
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: C.muted }}>Emergency contact</p>
                <p className="font-medium" style={{ color: C.navy }}>Chukwuemeka Okafor</p>
              </div>
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: C.muted }}>Primary physician</p>
                <p className="font-medium" style={{ color: C.navy }}>{PATIENT.physician}</p>
              </div>
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: C.muted }}>Conditions</p>
                <p className="font-medium" style={{ color: C.navy }}>{PATIENT.conditions[0]}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("emergency-card")} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center transition-colors" style={{ backgroundColor: "#fee2e2", color: "#ef4444" }}>
              View Emergency Card
            </button>
            <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center transition-colors" style={{ backgroundColor: C.amberLight, color: C.amber }}>
              Edit Emergency Info
            </button>
          </div>
        </SectionCard>

        <div className="grid lg:grid-cols-2 gap-5">

          {/* Health Information Sharing */}
          <SectionCard title="Health Information Sharing">
            <p className="text-sm mb-4" style={{ color: C.muted }}>Control who has access to your health records and information.</p>
            <div className="flex flex-col gap-1 mb-4">
              {["Dr. Amara Osei — Full access", "Lagos Care Team — Summary only", "2 shared documents"].map((item) => (
                <div key={item} className="flex items-center gap-2 py-2 border-b last:border-0 text-sm" style={{ borderColor: "#f0f2f7", color: C.navy }}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#22c55e" }} />
                  {item}
                </div>
              ))}
            </div>
            <button onClick={() => navigate("health-sharing")} className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors" style={{ backgroundColor: C.amberLight, color: C.amber }}>
              Manage Sharing
            </button>
          </SectionCard>

          {/* Care & Consultations */}
          <SectionCard title="Care & Consultations">
            <p className="text-sm mb-4" style={{ color: C.muted }}>Your upcoming and recent care activity.</p>
            <div className="flex flex-col gap-2 mb-4">
              <div className="rounded-xl p-3.5" style={{ backgroundColor: C.amberLight }}>
                <p className="text-xs font-semibold mb-0.5" style={{ color: C.amber }}>Upcoming</p>
                <p className="text-sm font-semibold" style={{ color: C.navy }}>Dr. Amara Osei — Follow-up</p>
                <p className="text-xs" style={{ color: C.muted }}>Thu 12 Sep 2026 · 10:00 AM</p>
              </div>
              <div className="rounded-xl p-3.5" style={{ backgroundColor: "#f8f9fc" }}>
                <p className="text-xs font-semibold mb-0.5" style={{ color: C.muted }}>Last consultation</p>
                <p className="text-sm font-semibold" style={{ color: C.navy }}>Dr. Chidi Nwachukwu · Docura Now</p>
                <p className="text-xs" style={{ color: C.muted }}>2 Sep 2026</p>
              </div>
            </div>
            <button onClick={() => navigate("patient-consultations")} className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors" style={{ backgroundColor: C.amberLight, color: C.amber }}>
              View Consultation History
            </button>
          </SectionCard>

        </div>

        <div className="grid lg:grid-cols-2 gap-5">

          {/* Travel Mode */}
          <SectionCard title="Travel Mode">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold" style={{ color: C.navy }}>Status</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>Your health info travels with you.</p>
              </div>
              <Badge variant="gray">Inactive</Badge>
            </div>
            <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: "#f8f9fc" }}>
              <p className="text-xs font-medium mb-2" style={{ color: C.muted }}>When active, Travel Mode makes available:</p>
              {["Emergency information", "Important medications", "Emergency contacts", "Care access abroad"].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm py-1" style={{ color: C.navy }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                  {item}
                </div>
              ))}
            </div>
            <button onClick={() => navigate("travel-mode")} className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: C.amberLight, color: C.amber }}>
              Manage Travel Mode
            </button>
          </SectionCard>

          {/* Notifications */}
          <SectionCard title="Notifications & Communication">
            <Toggle label="Appointment reminders" defaultOn />
            <Toggle label="Medication reminders" defaultOn />
            <Toggle label="Follow-up reminders" defaultOn />
            <Toggle label="Messages from doctors" defaultOn />
            <Toggle label="Care team updates" defaultOn />
            <Toggle label="Health alerts" defaultOn />
            <Toggle label="Email notifications" defaultOn />
            <Toggle label="SMS notifications" defaultOn />
            <Toggle label="Push notifications" />
          </SectionCard>

        </div>

        {/* Payments & Billing */}
        <SectionCard title="Payments & Billing">
          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            <div className="rounded-xl p-4" style={{ backgroundColor: "#f8f9fc" }}>
              <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>Outstanding balance</p>
              <p className="text-2xl font-bold" style={{ color: C.navy }}>₦0.00</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: "#f8f9fc" }}>
              <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>Payment method</p>
              <p className="text-sm font-semibold" style={{ color: C.navy }}>Visa ···· 4821</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: "#f8f9fc" }}>
              <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>Insurance</p>
              <p className="text-sm font-semibold" style={{ color: C.navy }}>AIICO · Active</p>
            </div>
          </div>
          <div className="mb-4">
            <LinkBtn label="View billing history" page="patient-payments" />
            <LinkBtn label="Manage payment methods" page="patient-payments" />
          </div>
        </SectionCard>

        {/* Account & Security */}
        <SectionCard title="Account & Security">
          <div className="grid sm:grid-cols-2 gap-0">
            <div>
              <InfoRow label="Email" value={PATIENT.email} />
              <InfoRow label="Phone" value={PATIENT.phone} />
              <InfoRow label="Password" value="Last changed 3 months ago" />
              <InfoRow label="Two-factor authentication" value="Enabled via SMS" />
            </div>
            <div className="sm:pl-6 sm:border-l" style={{ borderColor: "#f0f2f7" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-3 pt-2.5" style={{ color: C.muted }}>Actions</p>
              <LinkBtn label="Change password" page="patient-settings" />
              <LinkBtn label="Manage connected devices" page="patient-settings" />
              <LinkBtn label="Login activity" page="patient-settings" />
              <LinkBtn label="Privacy settings" page="patient-settings" />
            </div>
          </div>
        </SectionCard>

        {/* Preferences */}
        <SectionCard title="Preferences" action="Edit">
          <div className="grid sm:grid-cols-2 gap-x-8">
            <InfoRow label="Language" value="English" />
            <InfoRow label="Time zone" value="WAT (UTC+1)" />
            <InfoRow label="Date format" value="DD MMM YYYY" />
            <InfoRow label="Accessibility" value="Standard" />
          </div>
        </SectionCard>

      </div>
    </AppShell>
  );
}
