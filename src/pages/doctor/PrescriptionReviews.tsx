import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Badge, Button, Avatar, C, AlertBanner, Modal } from "@/components/ui";

const REVIEWS = [
  {
    id: "rev1",
    patient: "Adaeze Okafor",
    patientPhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
    personalDoctor: "Dr. Amara Osei",
    patientCountry: "Nigeria",
    recommendation: "Patient has Type 2 Diabetes and requires Metformin 500mg twice daily. Blood pressure also elevated, recommending Lisinopril 10mg once daily. Patient relocating to Nigeria temporarily.",
    medication: "Metformin 500mg (twice daily) + Lisinopril 10mg (once daily)",
    submitted: "2025-08-28",
    status: "pending" as const,
  },
];

function ReviewDetail({ review, onApprove, onDecline, onClarify }: { review: typeof REVIEWS[0]; onApprove: () => void; onDecline: () => void; onClarify: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      <AlertBanner type="info" title="Cross-border prescription review" body="Review the personal doctor's recommendation before issuing a local prescription. You are responsible for the local prescription you issue." />

      <div className="flex items-center gap-3">
        <Avatar src={review.patientPhoto} name={review.patient} size={44} />
        <div>
          <p className="font-bold" style={{ color: C.navy }}>{review.patient}</p>
          <p className="text-sm" style={{ color: C.muted }}>Currently in: {review.patientCountry}</p>
        </div>
      </div>

      <div className="rounded-xl border p-4" style={{ borderColor: C.border }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>Recommendation from {review.personalDoctor}</p>
        <p className="text-sm leading-relaxed" style={{ color: C.navy }}>{review.recommendation}</p>
      </div>

      <div className="rounded-xl p-4" style={{ backgroundColor: C.amberLight }}>
        <p className="text-xs font-semibold mb-1" style={{ color: C.navy }}>Recommended medication</p>
        <p className="text-sm font-medium" style={{ color: C.navy }}>{review.medication}</p>
      </div>

      <div className="rounded-xl border p-4" style={{ borderColor: C.border }}>
        <p className="text-xs font-semibold mb-3" style={{ color: C.muted }}>Patient health snapshot</p>
        {[["Blood group", "O+"], ["Conditions", "Type 2 Diabetes, Mild Hypertension"], ["Allergies", "Penicillin"]].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b last:border-0 text-sm" style={{ borderColor: C.border }}>
            <span style={{ color: C.muted }}>{k}</span>
            <span style={{ color: C.navy }}>{v}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Button fullWidth onClick={onApprove}>Approve & issue prescription</Button>
        <Button fullWidth variant="outline" onClick={onClarify}>Request clarification</Button>
        <Button fullWidth variant="danger" onClick={onDecline}>Decline</Button>
      </div>
    </div>
  );
}

export default function PrescriptionReviews() {
  const [selected, setSelected] = useState<typeof REVIEWS[0] | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState<"approve" | "decline" | null>(null);

  const pending = REVIEWS.filter((r) => !done.includes(r.id));

  return (
    <AppShell role="doctor" topBarTitle="Prescription reviews">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-4">
        {pending.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl block mb-3">✅</span>
            <p className="font-bold mb-2" style={{ color: C.navy }}>All reviews complete</p>
            <p className="text-sm" style={{ color: C.muted }}>No prescription reviews awaiting your attention.</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold" style={{ color: C.navy }}>{pending.length} awaiting review</p>
            {pending.map((rev) => (
              <Card key={rev.id} onClick={() => setSelected(rev)}>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar src={rev.patientPhoto} name={rev.patient} size={44} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: C.navy }}>{rev.patient}</p>
                    <p className="text-xs" style={{ color: C.muted }}>via {rev.personalDoctor} · {rev.submitted}</p>
                  </div>
                  <Badge variant="amber">Pending review</Badge>
                </div>
                <p className="text-xs line-clamp-2" style={{ color: C.muted }}>{rev.recommendation}</p>
                <Button size="sm" className="mt-3" onClick={(e) => { e?.stopPropagation(); setSelected(rev); }}>Review request</Button>
              </Card>
            ))}
          </>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Prescription review" maxWidth="max-w-2xl">
        {selected && (
          <ReviewDetail
            review={selected}
            onApprove={() => setConfirmModal("approve")}
            onDecline={() => setConfirmModal("decline")}
            onClarify={() => setSelected(null)}
          />
        )}
      </Modal>

      <Modal open={!!confirmModal} onClose={() => setConfirmModal(null)} title={confirmModal === "approve" ? "Issue prescription?" : "Decline prescription?"}>
        <p className="text-sm mb-5" style={{ color: C.muted }}>
          {confirmModal === "approve"
            ? "You are about to issue a local prescription for this patient. This prescription will be valid in Nigeria. Please confirm."
            : "Are you sure you want to decline this prescription request? The personal doctor and patient will be notified."}
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={() => setConfirmModal(null)}>Cancel</Button>
          <Button variant={confirmModal === "approve" ? "primary" : "danger"} fullWidth onClick={() => { if (selected) setDone((d) => [...d, selected.id]); setSelected(null); setConfirmModal(null); }}>
            {confirmModal === "approve" ? "Confirm & issue" : "Decline"}
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}
