import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Badge, QRCode, Button, Tabs, C, SectionHeader, DocuraLogo, Modal } from "@/components/ui";
import { PRESCRIPTIONS, DOCTORS, PATIENT } from "@/data/mock";

function RxCard({ rx, onClick }: { rx: typeof PRESCRIPTIONS[0]; onClick: () => void }) {
  const statusMap: Record<string, "green" | "amber" | "gray" | "red"> = { active: "green", used: "amber", expired: "gray", void: "red" };
  return (
    <Card onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold" style={{ color: C.navy }}>{rx.medication}</p>
            <Badge variant={statusMap[rx.status] || "gray"}>{rx.status}</Badge>
          </div>
          <p className="text-sm" style={{ color: C.muted }}>{rx.dosage} · {rx.frequency}</p>
        </div>
        {rx.crossBorder && <Badge variant="amber">Cross-border</Badge>}
      </div>
      <div className="flex flex-wrap gap-4 text-xs" style={{ color: C.muted }}>
        <span>🩺 {rx.doctorName}</span>
        <span>📅 {rx.date}</span>
        <span>⏱ {rx.duration}</span>
      </div>
    </Card>
  );
}

function RxDetail({ rx, onClose }: { rx: typeof PRESCRIPTIONS[0]; onClose: () => void }) {
  const [enlarged, setEnlarged] = useState(false);
  const statusMap: Record<string, "green" | "amber" | "gray" | "red"> = { active: "green", used: "amber", expired: "gray", void: "red" };

  return (
    <div className="flex flex-col gap-6">
      {/* Prescription card */}
      <div className="rounded-2xl border p-5" style={{ borderColor: C.border, backgroundColor: C.warm }}>
        <div className="flex items-center justify-between mb-4">
          <DocuraLogo size={28} showText />
          <Badge variant={statusMap[rx.status] || "gray"}>{rx.status.toUpperCase()}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          {[
            ["Doctor", rx.doctorName],
            ["Patient", PATIENT.name],
            ["Date", rx.date],
            ["Duration", rx.duration],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: C.muted }}>{k}</p>
              <p style={{ color: C.navy }}>{v}</p>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 mb-4" style={{ borderColor: C.border }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>Medication</p>
          <p className="font-bold" style={{ color: C.navy }}>{rx.medication} {rx.dosage}</p>
          <p className="text-sm mt-1" style={{ color: C.muted }}>{rx.frequency} · {rx.duration}</p>
        </div>
        <div className="rounded-xl p-3" style={{ backgroundColor: "white", border: `1px solid ${C.border}` }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: C.muted }}>Instructions</p>
          <p className="text-sm" style={{ color: C.navy }}>{rx.instructions}</p>
        </div>
        {rx.crossBorder && (
          <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: C.amberLight }}>
            <p className="text-xs font-semibold" style={{ color: C.amber }}>Cross-border prescription</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Recommended by {rx.personalDoctorName} · Issued by {rx.doctorName}</p>
          </div>
        )}
      </div>

      {/* QR Code */}
      {rx.status === "active" && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-semibold" style={{ color: C.navy }}>Show this QR code at a pharmacy</p>
          <div onClick={() => setEnlarged(true)} className="cursor-pointer hover:opacity-80 transition-opacity">
            <QRCode value={rx.id} />
          </div>
          <p className="text-xs" style={{ color: C.muted }}>Tap QR code to enlarge · Prescription ID: {rx.id.toUpperCase()}</p>
        </div>
      )}

      <Modal open={enlarged} onClose={() => setEnlarged(false)} title="QR Code">
        <div className="flex flex-col items-center gap-4">
          <div style={{ transform: "scale(2)", marginBlock: "3rem" }}><QRCode value={rx.id} /></div>
          <p className="text-sm text-center" style={{ color: C.muted }}>Show this to the pharmacist to fill your prescription.</p>
        </div>
      </Modal>

      <Button variant="outline" fullWidth onClick={onClose}>Close</Button>
    </div>
  );
}

export default function Prescriptions() {
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState<typeof PRESCRIPTIONS[0] | null>(null);
  const tabs = ["All", "Active", "Used", "Expired"];

  const filtered = PRESCRIPTIONS.filter((rx) => tab === "All" || rx.status === tab.toLowerCase());

  return (
    <AppShell role="patient" topBarTitle="Prescriptions">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">💊</div>
            <p className="font-bold mb-2" style={{ color: C.navy }}>No prescriptions yet</p>
            <p className="text-sm" style={{ color: C.muted }}>Your prescriptions will appear here after a consultation.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((rx) => <RxCard key={rx.id} rx={rx} onClick={() => setSelected(rx)} />)}
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Prescription details">
        {selected && <RxDetail rx={selected} onClose={() => setSelected(null)} />}
      </Modal>
    </AppShell>
  );
}
