import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Card, Button, Badge, Modal, EmptyState } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import type { ProfessionalConcern } from "@/data/types";

export default function ProfessionalConcerns() {
  const { domain, addToast, respondProfessionalConcern } = useApp();
  const [selectedConcern, setSelectedConcern] = useState<ProfessionalConcern | null>(null);
  const [responseText, setResponseText] = useState("");

  const concerns = domain.professionalConcerns;
  const pendingCount = concerns.filter((c) => c.status === "awaiting-response" || c.status === "under-review").length;

  function handleSubmitResponse() {
    if (!selectedConcern || !responseText.trim()) {
      addToast("error", "Please write your formal clinical response before submitting.");
      return;
    }
    respondProfessionalConcern(selectedConcern.id, responseText);
    addToast("success", "Clinical response submitted to Medical Governance Board.");
    setSelectedConcern(null);
    setResponseText("");
  }

  return (
    <AppShell role="doctor" topBarTitle="Professional Concerns">
      <div className="px-4 md:px-6 py-6 space-y-6" style={{ fontFamily: "var(--font-body)" }}>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: C.navy }} />
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: C.muted }}>Clinical Governance & Quality</p>
            </div>
            <h1 className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Professional Concerns & Inquiries
            </h1>
            <p className="text-sm mt-1" style={{ color: C.muted }}>
              Dedicated, segregated workflow for patient feedback, administrative inquiries, and medical board audit requests.
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold" style={{ color: C.navy }}>
            🔒 Strictly isolated from patient messaging threads
          </div>
        </div>

        {/* Case List */}
        {concerns.length === 0 ? (
          <EmptyState
            icon="🛡️"
            title="No open concerns or inquiries"
            body="Your professional record and clinical audit status are completely up to date."
          />
        ) : (
          <div className="space-y-4">
            {concerns.map((concern) => (
              <Card key={concern.id} className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {concern.caseReference}
                      </span>
                      <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                        {concern.issueTitle}
                      </h3>
                      <Badge variant={concern.status === "resolved" ? "green" : concern.status === "response-submitted" ? "blue" : "amber"}>
                        {concern.status.replace(/-/g, " ").toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Date Received: {concern.dateReceived} · Reference: {concern.patientReference || "General Compliance"}
                    </p>
                    <p className="text-sm text-slate-700 pt-1">
                      {concern.issueDescription}
                    </p>
                    <p className="text-xs font-semibold" style={{ color: concern.status === "resolved" ? C.green : C.coral }}>
                      ⏱️ Deadline: {concern.responseDeadline}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant={concern.status === "awaiting-response" ? "primary" : "outline"}
                      onClick={() => {
                        setSelectedConcern(concern);
                        setResponseText(concern.doctorResponse || "");
                      }}
                    >
                      {concern.status === "awaiting-response" ? "Submit Response" : "View Case & Audit Trail"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Case Detail / Response Modal */}
        <Modal open={!!selectedConcern} onClose={() => setSelectedConcern(null)} title={`Case File: ${selectedConcern?.caseReference}`} maxWidth="max-w-2xl">
          {selectedConcern && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 border text-xs space-y-2" style={{ borderColor: C.border }}>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-500">Case Subject:</span>
                  <span className="text-slate-900">{selectedConcern.issueTitle}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-500">Statutory Deadline:</span>
                  <span className="text-red-700">{selectedConcern.responseDeadline}</span>
                </div>
                <p className="text-slate-700 pt-1 leading-relaxed">{selectedConcern.issueDescription}</p>
              </div>

              {/* Response Section */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: C.muted }}>
                  Clinician Formal Response
                </label>
                {selectedConcern.status === "resolved" || selectedConcern.status === "response-submitted" ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-800 leading-relaxed">
                    <p className="font-semibold text-emerald-900 mb-1">Submitted Response:</p>
                    {selectedConcern.doctorResponse}
                  </div>
                ) : (
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={4}
                    placeholder="Provide a factual, clinical summary and clarification regarding this case..."
                    className="w-full rounded-xl border p-3 text-xs outline-none resize-none font-medium"
                    style={{ borderColor: C.border }}
                  />
                )}
              </div>

              {/* Audit Trail */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.muted }}>
                  Audit Trail
                </label>
                <div className="space-y-1.5 border rounded-xl p-3 bg-slate-50 text-[11px]" style={{ borderColor: C.border }}>
                  {selectedConcern.auditTrail.map((log, i) => (
                    <div key={i} className="flex justify-between text-slate-600">
                      <span>• {log.action} ({log.actor})</span>
                      <span className="text-slate-400">{log.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="ghost" onClick={() => setSelectedConcern(null)}>Close</Button>
                {selectedConcern.status === "awaiting-response" && (
                  <Button onClick={handleSubmitResponse}>Submit Formal Response</Button>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppShell>
  );
}
