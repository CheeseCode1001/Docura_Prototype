import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Badge, Tabs, Avatar, C, Modal } from "@/components/ui";
import { CONSULTATIONS, DOCTORS } from "@/data/mock";

export default function PatientConsultations() {
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState<typeof CONSULTATIONS[0] | null>(null);

  const filtered = CONSULTATIONS.filter((c) => tab === "All" || (tab === "Docura Now" && c.type === "now") || (tab === "Docura Care" && c.type === "care"));

  return (
    <AppShell role="patient" topBarTitle="Your consultations">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-4">
        <Tabs tabs={["All", "Docura Now", "Docura Care"]} active={tab} onChange={setTab} />
        <div className="flex flex-col gap-3 mt-2">
          {filtered.map((c) => {
            const dr = DOCTORS.find((d) => d.id === c.doctorId)!;
            return (
              <Card key={c.id} onClick={() => setSelected(c)}>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar src={dr.photo} name={dr.name} size={44} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: C.navy }}>{dr.name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{c.date} · {c.type === "care" ? "Docura Care" : "Docura Now"}</p>
                  </div>
                  <Badge variant={c.status === "completed" ? "green" : "amber"}>{c.status}</Badge>
                </div>
                <p className="text-sm line-clamp-2" style={{ color: C.muted }}>{c.summary}</p>
              </Card>
            );
          })}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Consultation detail">
        {selected && (() => {
          const dr = DOCTORS.find((d) => d.id === selected.doctorId)!;
          return (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar src={dr.photo} name={dr.name} size={48} />
                <div>
                  <p className="font-bold" style={{ color: C.navy }}>{dr.name}</p>
                  <p className="text-sm" style={{ color: C.muted }}>{selected.date}</p>
                </div>
              </div>
              {[["Summary", selected.summary], ["Diagnosis", selected.diagnosis], ["Doctor's notes", selected.notes]].map(([k, v]) => (
                <div key={k} className="border-t pt-3" style={{ borderColor: C.border }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: C.muted }}>{k}</p>
                  <p className="text-sm" style={{ color: C.navy }}>{v}</p>
                </div>
              ))}
            </div>
          );
        })()}
      </Modal>
    </AppShell>
  );
}
