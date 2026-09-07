import { AppShell } from "@/components/layout";
import { Avatar, Badge, Button, Card, C } from "@/components/ui";
import { DOCTORS, PATIENT, PRESCRIPTIONS } from "@/data/mock";
import { useApp } from "@/context/AppContext";

export default function ProxyDashboard() {
  const { navigate, addToast } = useApp();
  const doctor = DOCTORS.find((item) => item.id === PATIENT.personalDoctorId)!;
  return (
    <AppShell role="proxy" topBarTitle="Docura Proxy">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 px-4 py-6" style={{ fontFamily: "var(--font-body)" }}>
        <div><p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: C.amber }}>Care for someone else</p><h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Adaeze's care, kept close.</h1><p className="text-sm mt-2" style={{ color: C.muted }}>You have delegated access as the primary coordinator. Adaeze owns her medical record.</p></div>
        <div className="grid md:grid-cols-3 gap-4">
          <Card><p className="text-xs" style={{ color: C.muted }}>Relationship</p><p className="text-lg font-bold mt-1" style={{ color: C.navy }}>Daughter</p><Badge variant="green">Primary coordinator</Badge></Card>
          <Card><p className="text-xs" style={{ color: C.muted }}>Personal doctor</p><div className="flex items-center gap-3 mt-3"><Avatar src={doctor.photo} name={doctor.name} size={40} /><p className="text-sm font-semibold" style={{ color: C.navy }}>{doctor.name}</p></div></Card>
          <Card><p className="text-xs" style={{ color: C.muted }}>Active prescriptions</p><p className="text-3xl font-bold mt-1" style={{ color: C.navy }}>{PRESCRIPTIONS.filter((item) => item.status === "active").length}</p></Card>
        </div>
        <Card><div className="flex items-center justify-between gap-4 mb-4"><div><h2 className="font-bold" style={{ color: C.navy }}>Today's care timeline</h2><p className="text-xs mt-1" style={{ color: C.muted }}>Shared updates for remote family care.</p></div><Button size="sm" onClick={() => navigate("patient-chat")}>Message doctor</Button></div>{["Medication confirmed", "Blood pressure recorded", "Next follow-up upcoming"].map((event, index) => <div key={event} className="flex items-center gap-3 py-3 border-t" style={{ borderColor: C.border }}><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: index === 2 ? C.amber : "#16a34a" }} /><p className="text-sm flex-1" style={{ color: C.navy }}>{event}</p><span className="text-xs" style={{ color: C.muted }}>{index === 0 ? "Today" : index === 1 ? "Yesterday" : "In 7 days"}</span></div>)}</Card>
        <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => navigate("patient-prescriptions")}>View prescriptions</Button><Button variant="outline" onClick={() => navigate("health-timeline")}>Open care timeline</Button><Button variant="ghost" onClick={() => addToast("info", "Proxy permissions can be revoked by the patient at any time.")}>Review access</Button></div>
      </div>
    </AppShell>
  );
}