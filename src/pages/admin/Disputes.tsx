import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Badge, Button, C, Modal, Table } from "@/components/ui";
import { ADMIN_DISPUTES } from "@/data/mock";

const statusBadge: Record<string, "red" | "amber" | "green"> = { open: "red", investigating: "amber", resolved: "green" };

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState(ADMIN_DISPUTES);
  const [selected, setSelected] = useState<typeof ADMIN_DISPUTES[0] | null>(null);
  const [note, setNote] = useState("");

  const resolve = () => {
    if (!selected) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setDisputes((d) => d.map((x) => x.id === selected.id ? { ...x, status: "resolved" as const } : x) as any);
    setSelected(null);
  };

  const investigate = () => {
    if (!selected) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setDisputes((d) => d.map((x) => x.id === selected.id ? { ...x, status: "investigating" as const } : x) as any);
    setSelected(null);
  };

  return (
    <AppShell role="admin" topBarTitle="Disputes">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-4">
        <Table
          headers={["Patient", "Doctor", "Issue", "Date", "Status", "Assigned", "Action"]}
          rows={disputes.map((d) => [
            <span style={{ color: C.navy }}>{d.patient}</span>,
            <span style={{ color: C.navy }}>{d.doctor}</span>,
            d.issue,
            d.date,
            <Badge variant={statusBadge[d.status]}>{d.status}</Badge>,
            <span style={{ color: C.muted }}>{d.admin}</span>,
            <Button size="sm" onClick={() => { setSelected(d); setNote(""); }}>View</Button>,
          ])}
        />
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Dispute detail">
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Patient", selected.patient], ["Doctor", selected.doctor], ["Issue", selected.issue], ["Date", selected.date], ["Status", selected.status], ["Assigned to", selected.admin]].map(([k, v]) => (
                <div key={k} className="rounded-xl p-3" style={{ backgroundColor: C.warm }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>{k}</p>
                  <p style={{ color: C.navy }}>{v}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: C.label }}>Add a note</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Document investigation notes here..." className="w-full rounded-lg border px-4 py-3 text-sm outline-none resize-none" style={{ borderColor: C.border }} />
            </div>

            <div className="flex flex-col gap-2">
              {selected.status === "open" && <Button fullWidth variant="outline" onClick={investigate}>Begin investigation</Button>}
              <Button fullWidth onClick={resolve}>Mark as resolved</Button>
            </div>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
