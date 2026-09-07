import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Badge, Button, C, Modal, Table } from "@/components/ui";
import { ADMIN_PAYOUTS } from "@/data/mock";

const statusBadge: Record<string, "amber" | "blue" | "green" | "red"> = { requested: "amber", processing: "blue", paid: "green", failed: "red" };

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState(ADMIN_PAYOUTS);
  const [selected, setSelected] = useState<typeof ADMIN_PAYOUTS[0] | null>(null);
  const [action, setAction] = useState<"process" | "paid" | "reject" | null>(null);

  const handleAction = (a: "process" | "paid" | "reject") => {
    if (!selected) return;
    const newStatus = a === "process" ? "processing" : a === "paid" ? "paid" : "failed";
    setPayouts((p) => p.map((x) => x.id === selected.id ? { ...x, status: newStatus as typeof x.status } : x));
    setSelected(null);
    setAction(null);
  };

  return (
    <AppShell role="admin" topBarTitle="Payouts">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[["Requested", payouts.filter((p) => p.status === "requested").length, "amber"], ["Processing", payouts.filter((p) => p.status === "processing").length, "blue"], ["Paid this month", payouts.filter((p) => p.status === "paid").length, "green"]].map(([l, v, c]) => (
            <div key={l as string} className="rounded-xl border p-4 text-center" style={{ borderColor: C.border }}>
              <p className="text-2xl font-bold" style={{ color: c === "amber" ? C.amber : c === "blue" ? C.blue : C.green }}>{v as number}</p>
              <p className="text-xs" style={{ color: C.muted }}>{l as string}</p>
            </div>
          ))}
        </div>

        <Table
          headers={["Doctor", "Amount", "Country", "Requested", "Status", "Action"]}
          rows={payouts.map((p) => [
            <span style={{ color: C.navy }}>{p.doctor}</span>,
            <span className="font-bold" style={{ color: C.navy }}>{p.currency}{p.amount.toLocaleString()}</span>,
            p.country,
            p.requested,
            <Badge variant={statusBadge[p.status] || "gray"}>{p.status}</Badge>,
            p.status === "requested" ? (
              <Button size="sm" onClick={() => { setSelected(p); setAction("process"); }}>Process</Button>
            ) : p.status === "processing" ? (
              <Button size="sm" onClick={() => { setSelected(p); setAction("paid"); }}>Mark paid</Button>
            ) : (
              <span className="text-xs" style={{ color: C.muted }}>Done</span>
            ),
          ])}
        />
      </div>

      <Modal open={!!action} onClose={() => { setSelected(null); setAction(null); }} title={action === "process" ? "Process payout?" : action === "paid" ? "Mark as paid?" : "Reject payout?"}>
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: C.muted }}>
            {action === "process" ? `Process ${selected?.currency}${selected?.amount.toLocaleString()} payout to ${selected?.doctor}?` :
             action === "paid" ? `Confirm that ${selected?.currency}${selected?.amount.toLocaleString()} has been sent to ${selected?.doctor}?` :
             `Reject ${selected?.currency}${selected?.amount.toLocaleString()} payout to ${selected?.doctor}?`}
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => { setSelected(null); setAction(null); }}>Cancel</Button>
            <Button variant={action === "reject" ? "danger" : "primary"} fullWidth onClick={() => handleAction(action!)}>
              {action === "process" ? "Process payout" : action === "paid" ? "Mark as paid" : "Reject"}
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
