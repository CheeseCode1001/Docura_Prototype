import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { Card, Badge, Avatar, Tabs, Button, C, Modal } from "@/components/ui";
import { DOCTOR_PATIENTS } from "@/data/mock";

function PatientDetail({ patient, onClose }: { patient: typeof DOCTOR_PATIENTS[0]; onClose: () => void }) {
  const [tab, setTab] = useState("Snapshot");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar src={patient.photo} name={patient.name} size={52} />
        <div>
          <p className="font-bold" style={{ color: C.navy }}>{patient.name}</p>
          <p className="text-sm" style={{ color: C.muted }}>{patient.country} · {patient.type === "care" ? "Docura Care" : "Docura Now"}</p>
          {patient.crossBorder && <Badge variant="amber">Cross-border</Badge>}
        </div>
      </div>
      <Tabs tabs={["Snapshot", "Timeline", "Messages"]} active={tab} onChange={setTab} />
      {tab === "Snapshot" && (
        <div className="flex flex-col gap-3">
          {[["Blood group", "O+"], ["Conditions", "Type 2 Diabetes, Mild Hypertension"], ["Medications", "Metformin 500mg, Lisinopril 10mg"], ["Allergies", "Penicillin"]].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2.5 border-b last:border-0 text-sm" style={{ borderColor: C.border }}>
              <span style={{ color: C.muted }}>{k}</span>
              <span style={{ color: C.navy }}>{v}</span>
            </div>
          ))}
        </div>
      )}
      {tab === "Timeline" && (
        <div className="text-center py-8">
          <span className="text-3xl block mb-2">📅</span>
          <p className="text-sm" style={{ color: C.muted }}>3 consultations this month</p>
        </div>
      )}
      {tab === "Messages" && (
        <Button fullWidth onClick={onClose}>Open chat</Button>
      )}
    </div>
  );
}

export default function DoctorPatients() {
  const { navigate } = useApp();
  const [tab, setTab] = useState("Care");
  const [selected, setSelected] = useState<typeof DOCTOR_PATIENTS[0] | null>(null);

  const filtered = DOCTOR_PATIENTS.filter((p) =>
    tab === "Care" ? p.type === "care" : tab === "Now" ? p.type === "now" : p.crossBorder
  );

  return (
    <AppShell role="doctor" topBarTitle="Patients">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-4">
        <Tabs tabs={["Care", "Now", "Cross-border"]} active={tab} onChange={setTab} />
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl block mb-3">👥</span>
            <p className="font-bold mb-2" style={{ color: C.navy }}>No patients here yet</p>
            <p className="text-sm" style={{ color: C.muted }}>Patients will appear here once they connect with you.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((p) => (
              <Card key={p.id} onClick={() => setSelected(p)}>
                <div className="flex items-center gap-3">
                  <Avatar src={p.photo} name={p.name} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-semibold text-sm" style={{ color: C.navy }}>{p.name}</p>
                      {p.crossBorder && <Badge variant="amber">Cross-border</Badge>}
                    </div>
                    <p className="text-xs" style={{ color: C.muted }}>{p.country} · Last: {p.lastConsultation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: C.muted }}>Next action</p>
                    <p className="text-xs font-medium" style={{ color: C.amber }}>{p.nextAction}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" fullWidth onClick={(e) => { e?.stopPropagation(); navigate("doctor-chat"); }}>Message</Button>
                  <Button size="sm" fullWidth onClick={(e) => { e?.stopPropagation(); setSelected(p); }}>View health record</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Patient record">
        {selected && <PatientDetail patient={selected} onClose={() => setSelected(null)} />}
      </Modal>
    </AppShell>
  );
}
