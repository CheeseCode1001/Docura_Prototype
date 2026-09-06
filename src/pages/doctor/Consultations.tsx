import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Badge, Button, Avatar, C, AlertBanner, Modal } from "@/components/ui";

const PENDING = [
  {
    id: "cons1",
    patient: "Chidinma Eze",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    symptoms: "Persistent stomach pain for 2 days. No fever. Some nausea.",
    type: "now",
    paid: true,
    time: "12 minutes ago",
  },
];

function ConsultationView({ cons, onComplete }: { cons: typeof PENDING[0]; onComplete: () => void }) {
  const [msgs, setMsgs] = useState([
    { from: "system", text: "Consultation started. Patient is connected.", time: "" },
    { from: "patient", text: cons.symptoms, time: "Now" },
  ]);
  const [input, setInput] = useState("");
  const [noteModal, setNoteModal] = useState(false);
  const [rxModal, setRxModal] = useState(false);
  const [note, setNote] = useState("");
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMsgs((p) => [...p, { from: "doctor", text: input, time: "Now" }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px-80px)] lg:h-[calc(100vh-56px)]">
      <div className="border-b px-4 py-3 flex items-center gap-3 bg-white shrink-0" style={{ borderColor: C.border }}>
        <Avatar src={cons.photo} name={cons.patient} size={36} />
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color: C.navy }}>{cons.patient}</p>
          <p className="text-xs" style={{ color: C.muted }}>Docura Now · {cons.time}</p>
        </div>
        <Badge variant="green">Payment confirmed</Badge>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ backgroundColor: C.warm }}>
        {msgs.map((m, i) => (
          m.from === "system" ? (
            <div key={i} className="text-center">
              <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: "white", color: C.muted, border: `1px solid ${C.border}` }}>{m.text}</span>
            </div>
          ) : (
            <div key={i} className={`flex ${m.from === "doctor" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[72%] rounded-2xl px-4 py-3" style={{ backgroundColor: m.from === "doctor" ? C.amber : "white", color: m.from === "doctor" ? "white" : C.navy }}>
                <p className="text-sm">{m.text}</p>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Doctor action bar */}
      <div className="border-t px-4 py-2 bg-white flex gap-2 flex-wrap" style={{ borderColor: C.border }}>
        <Button size="sm" variant="outline" onClick={() => setNoteModal(true)}>✏️ Write note</Button>
        <Button size="sm" variant="outline" onClick={() => setRxModal(true)}>💊 Issue prescription</Button>
        <Button size="sm" variant="danger" onClick={onComplete}>Complete consultation</Button>
      </div>

      <div className="px-4 py-3 bg-white border-t flex gap-2" style={{ borderColor: C.border }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Reply to patient..." className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ borderColor: C.border }} />
        <button onClick={send} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.amber }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
        </button>
      </div>

      <Modal open={noteModal} onClose={() => setNoteModal(false)} title="Write a doctor's note">
        <div className="flex flex-col gap-4">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Assessment and recommendations..." className="w-full rounded-lg border px-4 py-3 text-sm outline-none resize-none" style={{ borderColor: C.border }} />
          <Button fullWidth onClick={() => { setNoteModal(false); setMsgs((p) => [...p, { from: "system", text: `Doctor's note saved: ${note}`, time: "" }]); }}>Save note</Button>
        </div>
      </Modal>

      <Modal open={rxModal} onClose={() => setRxModal(false)} title="Issue prescription">
        <div className="flex flex-col gap-4">
          <AlertBanner type="warning" title="Confirm before issuing" body="Issued prescriptions cannot be edited. Review carefully before proceeding." />
          {[["Medication", medication, setMedication, "e.g. Amoxicillin"], ["Dosage", dosage, setDosage, "e.g. 500mg"]].map(([l, v, s, p]) => (
            <div key={l as string} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: C.label }}>{l as string}</label>
              <input value={v as string} onChange={(e) => (s as (v: string) => void)(e.target.value)} placeholder={p as string} className="rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }} />
            </div>
          ))}
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setRxModal(false)}>Cancel</Button>
            <Button fullWidth onClick={() => { setRxModal(false); setMsgs((p) => [...p, { from: "system", text: `Prescription issued: ${medication} ${dosage}`, time: "" }]); }}>Issue prescription</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function DoctorConsultations() {
  const [active, setActive] = useState<typeof PENDING[0] | null>(null);
  const [completed, setCompleted] = useState(false);

  if (active && !completed) return (
    <AppShell role="doctor" topBarTitle="Consultation" showTopBarBack>
      <ConsultationView cons={active} onComplete={() => setCompleted(true)} />
    </AppShell>
  );

  if (completed) return (
    <AppShell role="doctor" topBarTitle="Consultation complete">
      <div className="px-4 py-16 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: C.greenLight }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Consultation completed</h2>
        <p className="text-sm" style={{ color: C.muted }}>The consultation summary has been shared with the patient.</p>
        <Button onClick={() => { setActive(null); setCompleted(false); }}>Back to consultations</Button>
      </div>
    </AppShell>
  );

  return (
    <AppShell role="doctor" topBarTitle="Consultations">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-4">
        {PENDING.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl block mb-3">📋</span>
            <p className="font-bold mb-2" style={{ color: C.navy }}>No pending consultations</p>
            <p className="text-sm" style={{ color: C.muted }}>Docura Now requests will appear here.</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold" style={{ color: C.navy }}>Pending ({PENDING.length})</p>
            {PENDING.map((cons) => (
              <Card key={cons.id}>
                <div className="flex items-start gap-3 mb-3">
                  <Avatar src={cons.photo} name={cons.patient} size={44} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: C.navy }}>{cons.patient}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{cons.time} · Docura Now</p>
                  </div>
                  <Badge variant="green">Payment confirmed</Badge>
                </div>
                <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: C.warm }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>Symptoms</p>
                  <p className="text-sm" style={{ color: C.navy }}>{cons.symptoms}</p>
                </div>
                <Button fullWidth onClick={() => setActive(cons)}>Start consultation</Button>
              </Card>
            ))}
          </>
        )}
      </div>
    </AppShell>
  );
}
