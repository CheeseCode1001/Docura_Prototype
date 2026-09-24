import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Card, Button, Badge, Avatar, Modal, EmptyState } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import type { PrescribingRequest } from "@/data/types";

export default function PrescribingWorkspace() {
  const { domain, navigate, addToast, approvePrescriptionRequest, declinePrescriptionRequest, escalatePrescriptionRequest } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<"queue" | "d2d" | "earnings" | "profile">("queue");
  const [selectedReq, setSelectedReq] = useState<PrescribingRequest | null>(null);
  const [independentNote, setIndependentNote] = useState("");
  const [declineModal, setDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [showFullRecord, setShowFullRecord] = useState(false);

  const requests = domain.prescribingRequests;
  const pending = requests.filter((r) => r.status === "awaiting-local-review" || r.status === "under-review");
  const urgent = requests.filter((r) => r.isUrgent && (r.status === "awaiting-local-review" || r.status === "under-review"));
  const reviewedToday = requests.filter((r) => r.status === "approved-issued" || r.status === "declined");

  function handleApprove() {
    if (!selectedReq) return;
    if (!independentNote.trim()) {
      addToast("error", "Independent clinical note is mandatory before authorizing a local prescription.");
      return;
    }
    approvePrescriptionRequest(selectedReq.id, independentNote);
    addToast("success", `Local prescription authorized & issued for ${selectedReq.patientName}.`);
    setSelectedReq(null);
    setIndependentNote("");
  }

  function handleDecline() {
    if (!selectedReq) return;
    if (!declineReason.trim()) {
      addToast("error", "Please provide a clinical rationale for declining.");
      return;
    }
    declinePrescriptionRequest(selectedReq.id, declineReason);
    addToast("info", `Recommendation declined. Personal doctor notified with your rationale.`);
    setDeclineModal(false);
    setSelectedReq(null);
    setDeclineReason("");
  }

  function handleEscalate(req: PrescribingRequest) {
    escalatePrescriptionRequest(req.id);
    addToast("warning", `24h SLA reached: Prescription reassigned to next qualified licensed doctor.`);
  }

  return (
    <AppShell role="doctor" topBarTitle="Prescribing Doctor Workspace">
      <div className="px-4 md:px-6 py-6 space-y-6" style={{ fontFamily: "var(--font-body)" }}>
        {/* Workspace Banner */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900">
                LOCAL LEGAL PRESCRIBING LAYER
              </span>
              <span className="text-xs text-slate-300">Nigeria (MDCN Jurisdiction)</span>
            </div>
            <h1 className="text-2xl font-bold mt-2" style={{ fontFamily: "var(--font-display)" }}>
              Prescribing Doctor Workspace
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Independent clinical authorization for cross-border recommendations. You issue local prescriptions with statutory clinical liability.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
              onClick={() => navigate("doctor-dashboard")}
            >
              ← Back to Personal Doctor Mode
            </Button>
          </div>
        </div>

        {/* Top Prescribing Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-white border" style={{ borderColor: C.border }}>
            <p className="text-xs" style={{ color: C.muted }}>Pending Queue</p>
            <p className="text-2xl font-bold mt-1" style={{ color: C.navy }}>{pending.length}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Awaiting your review</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border" style={{ borderColor: C.border }}>
            <p className="text-xs" style={{ color: C.muted }}>Urgent Prescriptions</p>
            <p className="text-2xl font-bold mt-1" style={{ color: C.coral }}>{urgent.length}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>SLA &lt; 4h remaining</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border" style={{ borderColor: C.border }}>
            <p className="text-xs" style={{ color: C.muted }}>Reviewed Today</p>
            <p className="text-2xl font-bold mt-1" style={{ color: C.green }}>{reviewedToday.length}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Processed locally</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border" style={{ borderColor: C.border }}>
            <p className="text-xs" style={{ color: C.muted }}>Monthly Prescriptions</p>
            <p className="text-2xl font-bold mt-1" style={{ color: C.navy }}>19</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Authorized this cycle</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border" style={{ borderColor: C.border }}>
            <p className="text-xs" style={{ color: C.muted }}>On-Time SLA Rate</p>
            <p className="text-2xl font-bold mt-1" style={{ color: C.green }}>98.2%</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Target &gt; 95%</p>
          </div>
        </div>

        {/* Prescribing Workspace Nav Tabs */}
        <div className="flex border-b" style={{ borderColor: C.border }}>
          {[
            { id: "queue", label: `Prescription Queue (${pending.length})` },
            { id: "d2d", label: "D2D Clinical Chat" },
            { id: "earnings", label: "Prescribing Compensation" },
            { id: "profile", label: "Prescribing License & Scope" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className="px-5 py-3 text-sm font-semibold border-b-2 transition-all"
              style={{
                borderColor: activeSubTab === tab.id ? C.navy : "transparent",
                color: activeSubTab === tab.id ? C.navy : C.muted,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Queue */}
        {activeSubTab === "queue" && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <EmptyState
                icon="💊"
                title="Prescription queue is clear"
                body="No cross-border recommendation requests require your review at this time."
              />
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <Card key={req.id} className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      <div className="flex items-start gap-4">
                        <Avatar src={req.patientPhoto} name={req.patientName} size={48} />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                              {req.medication}
                            </h3>
                            {req.isUrgent && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse">
                                🔴 URGENT SLA
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize bg-slate-100 text-slate-700">
                              Status: {req.status.replace(/-/g, " ")}
                            </span>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: C.navy }}>
                            Patient: {req.patientName}, {req.patientAge}y · Location: {req.patientCountry}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                            Recommended by: <strong>{req.personalDoctorName}</strong> (Personal Doctor) · SLA: {req.slaDeadline}
                          </p>
                          <div className="mt-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700">
                            <strong>Personal Doctor Reasoning:</strong> {req.clinicalReasoning}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {req.status === "awaiting-local-review" || req.status === "under-review" ? (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => {
                                setSelectedReq(req);
                                setIndependentNote(req.independentClinicalNote || "");
                              }}
                            >
                              Review & Authorize
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedReq(req);
                                setDeclineModal(true);
                              }}
                            >
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEscalate(req)}
                            >
                              Simulate 24h Escalation
                            </Button>
                          </>
                        ) : (
                          <div className="text-right text-xs">
                            <span className="font-bold text-emerald-700 block">✓ Authorized locally</span>
                            <span className="text-slate-400">Rx ID: {req.issuedPrescriptionId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: D2D Chat */}
        {activeSubTab === "d2d" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs" style={{ color: C.label }}>
              🔒 <strong>Private Clinical Communication Layer</strong>: Doctor-to-doctor clinical threads and general protocol queries are completely private. Patients NEVER see clinical discussions or rejection rationales.
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: C.border }}>
                  <h3 className="font-bold text-sm" style={{ color: C.navy }}>Patient-Specific Clinical Thread</h3>
                  <Badge variant="navy">Attached to Patient Chart</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  {domain.d2dMessages.filter((m) => m.threadType === "patient-clinical").map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-slate-50 border" style={{ borderColor: C.border }}>
                      <div className="flex justify-between font-semibold mb-1">
                        <span style={{ color: C.navy }}>{m.senderDoctorName}</span>
                        <span style={{ color: C.muted }}>{m.sentAt}</span>
                      </div>
                      <p className="text-slate-700">{m.text}</p>
                    </div>
                  ))}
                </div>
                <Button size="sm" fullWidth onClick={() => navigate("doctor-chat")}>
                  Open Full Clinical D2D Thread
                </Button>
              </Card>

              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: C.border }}>
                  <h3 className="font-bold text-sm" style={{ color: C.navy }}>General Doctor-to-Doctor Inbox</h3>
                  <Badge variant="gray">No Patient PII</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  {domain.d2dMessages.filter((m) => m.threadType === "general").map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-slate-50 border" style={{ borderColor: C.border }}>
                      <div className="flex justify-between font-semibold mb-1">
                        <span style={{ color: C.navy }}>{m.senderDoctorName}</span>
                        <span style={{ color: C.muted }}>{m.sentAt}</span>
                      </div>
                      <p className="text-slate-700">{m.text}</p>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="outline" fullWidth onClick={() => navigate("doctor-chat")}>
                  Open General Colleague Inbox
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 3: Prescribing Earnings */}
        {activeSubTab === "earnings" && (
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Prescription Authorization Compensation
            </h3>
            <p className="text-xs text-slate-500">
              Prescribing doctors receive a dedicated statutory review fee per prescription authorized or comprehensively reviewed.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border" style={{ borderColor: C.border }}>
                <p className="text-xs text-slate-500">Fixed Fee per Review</p>
                <p className="text-xl font-bold mt-1" style={{ color: C.navy }}>₦3,500</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border" style={{ borderColor: C.border }}>
                <p className="text-xs text-slate-500">Authorized This Month</p>
                <p className="text-xl font-bold mt-1" style={{ color: C.navy }}>19 reviews</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border" style={{ borderColor: C.border }}>
                <p className="text-xs text-slate-500">Accrued Prescribing Payout</p>
                <p className="text-xl font-bold mt-1" style={{ color: C.green }}>₦66,500</p>
              </div>
            </div>
          </Card>
        )}

        {/* Tab 4: Profile & Scope */}
        {activeSubTab === "profile" && (
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Prescribing License Verification
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b" style={{ borderColor: C.border }}>
                <span className="text-slate-500">Licensing Authority</span>
                <span className="font-semibold text-slate-900">Medical and Dental Council of Nigeria (MDCN)</span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: C.border }}>
                <span className="text-slate-500">MDCN Folio Number</span>
                <span className="font-semibold text-slate-900">MDCN/2018/4421 (Active)</span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: C.border }}>
                <span className="text-slate-500">Eligible Prescribing Territory</span>
                <span className="font-semibold text-slate-900">Federal Republic of Nigeria (Schedule 1 - 4)</span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: C.border }}>
                <span className="text-slate-500">Prescribing Indemnity Coverage</span>
                <span className="font-semibold text-emerald-700">Verified & Active · Docura Clinical Underwrite</span>
              </div>
            </div>
          </Card>
        )}

        {/* Prescription Review & Independent Judgment Modal */}
        <Modal open={!!selectedReq && !declineModal} onClose={() => setSelectedReq(null)} title="Prescription Review & Authorization" maxWidth="max-w-3xl">
          {selectedReq && (
            <div className="space-y-5">
              {/* High-Visibility Patient Snapshot */}
              <div className="p-4 rounded-2xl bg-slate-50 border space-y-3" style={{ borderColor: C.border }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={selectedReq.patientPhoto} name={selectedReq.patientName} size={44} />
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: C.navy }}>{selectedReq.patientName}, {selectedReq.patientAge} years</h4>
                      <p className="text-xs text-slate-500">Location: {selectedReq.patientCountry} · Personal Doctor: {selectedReq.personalDoctorName}</p>
                    </div>
                  </div>
                  <Badge variant="navy">Cross-Border Transfer</Badge>
                </div>

                {/* Highly Visible Allergies Alert */}
                <div className="p-3 rounded-xl bg-red-100 border border-red-300 flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <div className="text-xs text-red-900">
                    <strong>KNOWN ALLERGIES:</strong> {selectedReq.allergies.join(", ")}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block">Diagnosed Conditions</span>
                    <strong className="text-slate-800">{selectedReq.conditions.join(", ")}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Current Medications</span>
                    <strong className="text-slate-800">{selectedReq.currentMedications.join(", ")}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Recent Blood Pressure</span>
                    <strong className="text-slate-800">{selectedReq.recentVitals.bp}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Pulse / Vitals</span>
                    <strong className="text-slate-800">{selectedReq.recentVitals.pulse} ({selectedReq.recentVitals.date})</strong>
                  </div>
                </div>
              </div>

              {/* Read-Only Longitudinal Medical Record Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowFullRecord(!showFullRecord)}
                  className="flex items-center justify-between w-full p-3 rounded-xl border bg-white text-xs font-semibold"
                  style={{ borderColor: C.border, color: C.navy }}
                >
                  <span>📋 Longitudinal Medical Record (Read-Only)</span>
                  <span>{showFullRecord ? "▲ Hide" : "▼ View Full History"}</span>
                </button>
                {showFullRecord && (
                  <div className="mt-2 p-4 rounded-xl border bg-slate-50 text-xs space-y-3" style={{ borderColor: C.border }}>
                    <div>
                      <p className="font-bold text-slate-700">Past Consultations:</p>
                      <p className="text-slate-600">2025-08-28: Routine diabetes management check with Dr. Sarah Adeyemi. HbA1c improving to 6.8%. Patient moving to Nigeria for 3 months.</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">Recent Lab Trends:</p>
                      <p className="text-slate-600">HbA1c: 6.8% (Target &lt; 7.0%) · Serum Creatinine: 0.9 mg/dL · eGFR: &gt; 90 mL/min/1.73m²</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Medication Details */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                <p className="font-bold text-sm" style={{ color: C.navy }}>{selectedReq.medication}</p>
                <p className="text-slate-700"><strong>Dosage & Frequency:</strong> {selectedReq.dosage} · {selectedReq.frequency} ({selectedReq.duration})</p>
                <p className="text-slate-600 mt-1"><strong>Personal Doctor's Clinical Reasoning:</strong> {selectedReq.clinicalReasoning}</p>
              </div>

              {/* Mandatory Independent Clinical Note Requirement */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-red-700">
                  Mandatory: Independent Prescribing Clinical Justification *
                </label>
                <p className="text-[11px] text-slate-500">
                  Docura clinical governance requires that local prescribing clinicians enter their independent assessment prior to issuing a legal prescription.
                </p>
                <textarea
                  value={independentNote}
                  onChange={(e) => setIndependentNote(e.target.value)}
                  rows={3}
                  placeholder="Record your independent clinical evaluation, dosage validation, and confirmation of allergy check..."
                  className="w-full rounded-xl border p-3 text-xs outline-none resize-none font-medium"
                  style={{ borderColor: C.navy }}
                />
              </div>

              {/* Three Primary Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigate("doctor-chat");
                    setSelectedReq(null);
                  }}
                >
                  💬 Discuss with {selectedReq.personalDoctorName}
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeclineModal(true)}
                  >
                    Decline Request
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApprove}
                    disabled={!independentNote.trim()}
                  >
                    Approve & Issue Local Prescription
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Decline Modal */}
        <Modal open={declineModal} onClose={() => setDeclineModal(false)} title="Decline Cross-Border Prescription">
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Provide clinical feedback to the personal doctor. Note: The patient will continue seeing <strong>"Prescription in progress"</strong> while the personal doctor addresses this without creating panic.
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={3}
              placeholder="e.g. Dose requires clarification, potential interaction with reported herbal supplement, recommend lower starting titration..."
              className="w-full rounded-xl border p-3 text-xs outline-none"
              style={{ borderColor: C.border }}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setDeclineModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleDecline}>Confirm Decline</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
