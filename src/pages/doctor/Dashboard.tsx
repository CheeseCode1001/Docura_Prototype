import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { Card, StatCard, SectionHeader, Avatar, Badge, Button, ProgressBar, C } from "@/components/ui";
import { DOCTORS, DOCTOR_PATIENTS } from "@/data/mock";

export default function DoctorDashboard() {
  const { navigate } = useApp();
  const doc = DOCTORS[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <AppShell role="doctor">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm" style={{ color: C.muted }}>{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
            <h1 className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{greeting}, {doc.name} 👋</h1>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: C.amber }}>
            <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Profile completeness */}
        <div className="rounded-2xl p-4 border" style={{ borderColor: C.amber, backgroundColor: C.amberLight }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold" style={{ color: C.navy }}>Your profile is 85% complete</p>
            <button className="text-xs font-semibold" style={{ color: C.amber }} onClick={() => navigate("doctor-profile-mgmt")}>Complete profile →</button>
          </div>
          <ProgressBar value={85} />
          <p className="text-xs mt-2" style={{ color: C.muted }}>Add your bio and languages to complete your profile.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Active care patients" value={3} icon={<span>👥</span>} sub="This month" />
          <StatCard label="Pending consultations" value={1} icon={<span>⚡</span>} sub="Docura Now" color="#DBEAFE" />
          <StatCard label="Earnings this month" value="₦45,000" icon={<span>💰</span>} sub="Net earnings" color="#DCFCE7" />
          <StatCard label="Prescription reviews" value={2} icon={<span>📋</span>} sub="Awaiting review" color={C.amberLight} />
        </div>

        {/* Pending consultation alert */}
        <div className="rounded-2xl p-4 flex items-center gap-4" style={{ backgroundColor: C.navy }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>⚡</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Docura Now request</p>
            <p className="text-xs text-white/60">Chidinma Eze is waiting for a consultation</p>
          </div>
          <Button size="sm" onClick={() => navigate("doctor-consultations")}>Review</Button>
        </div>

        {/* Active patients */}
        <div>
          <SectionHeader title="Active patients" action="See all" onAction={() => navigate("doctor-patients")} />
          <div className="flex flex-col gap-3">
            {DOCTOR_PATIENTS.slice(0, 3).map((p) => (
              <Card key={p.id} onClick={() => navigate("doctor-patients")}>
                <div className="flex items-center gap-3">
                  <Avatar src={p.photo} name={p.name} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: C.navy }}>{p.name}</p>
                      {p.crossBorder && <Badge variant="amber">Cross-border</Badge>}
                    </div>
                    <p className="text-xs" style={{ color: C.muted }}>{p.country} · Last: {p.lastConsultation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium" style={{ color: C.amber }}>{p.nextAction}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Earnings summary */}
        <Card>
          <SectionHeader title="Earnings summary" action="View all" onAction={() => navigate("doctor-earnings")} />
          <div className="grid grid-cols-3 gap-3 text-center">
            {[["Available", "₦45,000"], ["Pending", "₦12,000"], ["Last payout", "₦38,000"]].map(([l, v]) => (
              <div key={l}>
                <p className="text-xl font-bold" style={{ color: C.navy }}>{v}</p>
                <p className="text-xs" style={{ color: C.muted }}>{l}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
