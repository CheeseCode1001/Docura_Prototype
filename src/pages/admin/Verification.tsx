import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { Card, Badge, Button, Avatar, C, Modal, AlertBanner, Table } from "@/components/ui";
import { PENDING_VERIFICATIONS } from "@/data/mock";

type VerifDoc = typeof PENDING_VERIFICATIONS[0];

function VerificationDetail({ doc, onApprove, onReject, onRequest }: { doc: VerifDoc; onApprove: () => void; onReject: () => void; onRequest: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <img src={doc.photo} alt={doc.name} className="w-14 h-14 rounded-xl object-cover" />
        <div>
          <p className="font-bold" style={{ color: C.navy }}>{doc.name}</p>
          <p className="text-sm" style={{ color: C.muted }}>{doc.specialty} · {doc.country}</p>
          <Badge variant={doc.status === "under-review" ? "amber" : "blue"}>{doc.status.replace(/-/g, " ")}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {[["Specialty", doc.specialty], ["Country", doc.country], ["License", doc.license], ["Submitted", doc.submitted]].map(([k, v]) => (
          <div key={k} className="rounded-xl p-3" style={{ backgroundColor: C.warm }}>
            <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>{k}</p>
            <p style={{ color: C.navy }}>{v}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-sm font-semibold mb-2" style={{ color: C.navy }}>Submitted documents</p>
        <div className="flex flex-col gap-2">
          {["Medical license", "Government ID", "Selfie verification"].map((d, i) => (
            <div key={d} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: C.border }}>
              <span className="text-sm" style={{ color: C.navy }}>{d}</span>
              <Badge variant={i < 2 ? "green" : "amber"}>{i < 2 ? "Verified" : "Pending review"}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button fullWidth onClick={onApprove}>Approve doctor</Button>
        <Button fullWidth variant="outline" onClick={onRequest}>Request more information</Button>
        <Button fullWidth variant="danger" onClick={onReject}>Reject application</Button>
      </div>
    </div>
  );
}

export default function AdminVerification() {
  const { domain, updateVerification, addToast } = useApp();
  const [selected, setSelected] = useState<VerifDoc | null>(null);
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const [confirmNote, setConfirmNote] = useState("");

  const pending = PENDING_VERIFICATIONS.filter((v) => !doneIds.includes(v.id) && !domain.verificationDecisions.some((decision) => decision.id === v.id && decision.status !== "more-info-required"));

  const handleAction = (action: "approve" | "reject") => {
    if (selected) {
      updateVerification({ id: selected.id, status: action === "approve" ? "approved" : "rejected", note: confirmNote });
      setDoneIds((d) => [...d, selected.id]);
      addToast(action === "approve" ? "success" : "warning", action === "approve" ? `${selected.name} is now approved.` : `${selected.name}'s application was rejected.`);
    }
    setSelected(null);
    setConfirmAction(null);
  };

  return (
    <AppShell role="admin" topBarTitle="Doctor verification">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <p className="text-sm" style={{ color: C.muted }}>{pending.length} pending</p>
        </div>

        <Table
          headers={["Doctor", "Specialty", "Country", "License", "Submitted", "Status", "Action"]}
          rows={pending.map((v) => [
            <div className="flex items-center gap-2">
              <img src={v.photo} alt={v.name} className="w-8 h-8 rounded-full object-cover" />
              <span className="font-medium" style={{ color: C.navy }}>{v.name}</span>
            </div>,
            v.specialty,
            v.country,
            <span className="font-mono text-xs">{v.license}</span>,
            v.submitted,
            <Badge variant={v.status === "under-review" ? "amber" : v.status === "more-info-required" ? "yellow" : "blue"}>
              {v.status.replace(/-/g, " ")}
            </Badge>,
            <Button size="sm" onClick={() => setSelected(v)}>Review</Button>,
          ])}
        />
      </div>

      <Modal open={!!selected && !confirmAction} onClose={() => setSelected(null)} title="Verification review" maxWidth="max-w-2xl">
        {selected && (
          <VerificationDetail
            doc={selected}
            onApprove={() => setConfirmAction("approve")}
            onReject={() => setConfirmAction("reject")}
            onRequest={() => { updateVerification({ id: selected.id, status: "more-info-required" }); addToast("info", `More information requested from ${selected.name}.`); setDoneIds((d) => [...d, selected.id]); setSelected(null); }}
          />
        )}
      </Modal>

      <Modal open={!!confirmAction} onClose={() => setConfirmAction(null)} title={confirmAction === "approve" ? "Approve doctor?" : "Reject application?"}>
        <div className="flex flex-col gap-4">
          {confirmAction === "reject" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: C.label }}>Reason for rejection</label>
              <textarea value={confirmNote} onChange={(e) => setConfirmNote(e.target.value)} rows={3} placeholder="Explain why this application is being rejected..." className="w-full rounded-lg border px-4 py-3 text-sm outline-none resize-none" style={{ borderColor: C.border }} />
            </div>
          )}
          <AlertBanner type={confirmAction === "approve" ? "success" : "error"} title={confirmAction === "approve" ? "Doctor will be notified and can begin accepting patients" : "Doctor will be notified with the reason provided"} />
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button variant={confirmAction === "approve" ? "primary" : "danger"} fullWidth onClick={() => handleAction(confirmAction!)}>
              {confirmAction === "approve" ? "Confirm approval" : "Confirm rejection"}
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
