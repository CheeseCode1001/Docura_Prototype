import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Badge, Button, C, Modal } from "@/components/ui";
import { CROSS_BORDER_CASES, DOCTORS } from "@/data/mock";

const prescribingDoctors = DOCTORS.filter((d) => d.isPrescribing || d.country === "United Kingdom");

export default function AdminCrossBorder() {
  const [cases, setCases] = useState(CROSS_BORDER_CASES);
  const [assignCase, setAssignCase] = useState<typeof CROSS_BORDER_CASES[0] | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [success, setSuccess] = useState(false);

  const handleAssign = () => {
    if (!selectedDoctor || !assignCase) return;
    const doc = DOCTORS.find((d) => d.id === selectedDoctor);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCases((c) => c.map((x) => x.id === assignCase.id ? { ...x, status: "assigned" as const, prescribingDoctor: doc?.name ?? "" } : x) as any);
    setSuccess(true);
  };

  return (
    <AppShell role="admin" topBarTitle="Cross-border cases">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5">
        <p className="text-sm" style={{ color: C.muted }}>{cases.length} active cases</p>

        {cases.map((cb) => (
          <Card key={cb.id}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold" style={{ color: C.navy }}>{cb.patient}</p>
                <p className="text-sm" style={{ color: C.muted }}>Personal Doctor: {cb.personalDoctor}</p>
              </div>
              <Badge variant={cb.status === "assigned" ? "green" : "amber"}>{cb.status.replace(/-/g, " ")}</Badge>
            </div>

            {/* Flow diagram */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.amberLight }}>👤</div>
                <p className="text-xs font-semibold" style={{ color: C.navy }}>{cb.patient}</p>
                <p className="text-xs" style={{ color: C.muted }}>{cb.patientCountry}</p>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="h-0.5 w-full" style={{ backgroundColor: C.border }} />
                <p className="text-xs" style={{ color: C.muted }}>Personal Doctor</p>
                <p className="text-xs font-medium" style={{ color: C.navy }}>{cb.personalDoctor}</p>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cb.prescribingDoctor ? "#DCFCE7" : "#F3F4F6" }}>🏥</div>
                <p className="text-xs font-semibold" style={{ color: C.navy }}>{cb.prescribingDoctor || "Not assigned"}</p>
                <p className="text-xs" style={{ color: C.muted }}>{cb.prescribingCountry}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span style={{ color: C.muted }}>Required prescribing: {cb.prescribingCountry}</span>
              {cb.status !== "assigned" && (
                <Button size="sm" onClick={() => { setAssignCase(cb); setSelectedDoctor(""); setSuccess(false); }}>Assign prescribing doctor</Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!assignCase} onClose={() => { setAssignCase(null); setSuccess(false); }} title="Assign prescribing doctor">
        {!success ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl p-3" style={{ backgroundColor: C.warm }}>
              <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>Patient</p>
              <p className="text-sm font-medium" style={{ color: C.navy }}>{assignCase?.patient} — needs prescribing doctor in {assignCase?.prescribingCountry}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: C.label }}>Select prescribing doctor ({assignCase?.prescribingCountry})</label>
              <div className="flex flex-col gap-2">
                {prescribingDoctors.map((doc) => (
                  <label key={doc.id} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all" style={{ borderColor: selectedDoctor === doc.id ? C.amber : C.border, backgroundColor: selectedDoctor === doc.id ? C.amberLight : "white" }}>
                    <input type="radio" checked={selectedDoctor === doc.id} onChange={() => setSelectedDoctor(doc.id)} className="sr-only" />
                    <img src={doc.photo} alt={doc.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: C.navy }}>{doc.name}</p>
                      <p className="text-xs" style={{ color: C.muted }}>{doc.specialty} · {doc.country}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={() => setAssignCase(null)}>Cancel</Button>
              <Button fullWidth disabled={!selectedDoctor} onClick={handleAssign}>Assign doctor</Button>
            </div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "#DCFCE7" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Prescribing doctor assigned!</p>
            <p className="text-sm" style={{ color: C.muted }}>Both the patient and prescribing doctor have been notified.</p>
            <Button fullWidth onClick={() => { setAssignCase(null); setSuccess(false); }}>Done</Button>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
