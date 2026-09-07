import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Badge, Tabs, C } from "@/components/ui";
import { PATIENT, DOCTORS } from "@/data/mock";
import { useApp } from "@/context/AppContext";

interface TimelineItem {
  key: string;
  date: string;
  title: string;
  body: string;
  icon: string;
  color: string;
}

export default function HealthRecord() {
  const { domain } = useApp();
  const [tab, setTab] = useState("Snapshot");

  // The timeline is derived from live records, so a consultation completed or a
  // prescription issued in this session appears here immediately.
  const timeline: TimelineItem[] = [
    ...domain.consultations.map((consultation) => ({
      key: `c-${consultation.id}`,
      date: consultation.date,
      title: `Consultation with ${DOCTORS.find((doctor) => doctor.id === consultation.doctorId)?.name || "your doctor"}`,
      body: consultation.summary,
      icon: "🩺",
      color: C.amberLight,
    })),
    ...domain.prescriptions.map((prescription) => ({
      key: `rx-${prescription.id}`,
      date: prescription.date,
      title: "Prescription issued",
      body: `${prescription.medication} ${prescription.dosage} · ${prescription.frequency} · ${prescription.duration}`,
      icon: "💊",
      color: "#DCFCE7",
    })),
    ...domain.followUps.map((followUp) => ({
      key: `fu-${followUp.id}`,
      date: followUp.scheduledDate,
      title: `Follow-up ${followUp.status}`,
      body: followUp.reason,
      icon: "📅",
      color: "#DBEAFE",
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <AppShell role="patient" topBarTitle="Health record">
      <div className="px-4 md:px-6 py-6">
        <Tabs tabs={["Snapshot", "Timeline"]} active={tab} onChange={setTab} />

        {tab === "Snapshot" && (
          <div className="flex flex-col gap-4 mt-5">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Blood group</h3>
                <span className="text-3xl font-bold" style={{ color: C.amber }}>{PATIENT.bloodGroup}</span>
              </div>
              <p className="text-xs" style={{ color: C.muted }}>Make sure your doctor knows your blood group for emergencies.</p>
            </Card>

            <Card>
              <h3 className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Conditions</h3>
              <div className="flex flex-col gap-2">
                {PATIENT.conditions.map((c) => (
                  <div key={c} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: C.warm }}>
                    <span className="text-lg">🏥</span>
                    <span className="text-sm font-medium" style={{ color: C.navy }}>{c}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Current medications</h3>
              <div className="flex flex-col gap-2">
                {PATIENT.medications.map((m) => (
                  <div key={m} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: C.warm }}>
                    <span className="text-lg">💊</span>
                    <span className="text-sm font-medium" style={{ color: C.navy }}>{m}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {PATIENT.allergies.map((a) => <Badge key={a} variant="red">⚠ {a}</Badge>)}
              </div>
              <p className="text-xs mt-3" style={{ color: C.muted }}>Always inform your doctor and pharmacist about your allergies.</p>
            </Card>

            <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: C.amberLight }}>
              <span>🔒</span>
              <p className="text-xs" style={{ color: C.navy }}>Your health information is encrypted and only shared with your care team.</p>
            </div>
          </div>
        )}

        {tab === "Timeline" && (
          <div className="mt-5 relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5" style={{ backgroundColor: C.border }} />
            <div className="flex flex-col gap-6">
              {timeline.map((item) => (
                <div key={item.key} className="flex gap-4 pl-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg z-10" style={{ backgroundColor: item.color }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-xs mb-1" style={{ color: C.muted }}>{item.date}</p>
                    <div className="rounded-xl border p-3" style={{ borderColor: C.border, backgroundColor: "white" }}>
                      <p className="text-sm font-semibold mb-1" style={{ color: C.navy }}>{item.title}</p>
                      <p className="text-xs" style={{ color: C.muted }}>{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
