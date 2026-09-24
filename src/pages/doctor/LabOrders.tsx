import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Card, Button, Badge, Avatar, Modal, Tabs, EmptyState, SectionHeader } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { DOCTOR_PATIENTS } from "@/data/mock";
import type { LabCategory, LabOrder } from "@/data/types";

const TABS = ["Pending", "Results Received", "Needs Review", "Reviewed", "Abnormal"];

const CATEGORIES: { id: LabCategory; label: string; icon: string }[] = [
  { id: "blood", label: "Blood", icon: "🩸" },
  { id: "urine", label: "Urine", icon: "🧪" },
  { id: "heart", label: "Heart (ECG/Echo)", icon: "🫀" },
  { id: "imaging", label: "Imaging (X-ray/US)", icon: "🩻" },
  { id: "microbiology", label: "Microbiology", icon: "🔬" },
];

export default function LabOrders() {
  const { domain, navigate, addToast, orderLabTest, reviewLabOrder } = useApp();
  const [activeTab, setActiveTab] = useState("Needs Review");
  const [orderModal, setOrderModal] = useState(false);

  // New order form state
  const [patientId, setPatientId] = useState(DOCTOR_PATIENTS[0].id);
  const [category, setCategory] = useState<LabCategory>("blood");
  const [testName, setTestName] = useState("");
  const [indication, setIndication] = useState("");
  const [urgency, setUrgency] = useState<"routine" | "urgent">("routine");

  // Review modal state
  const [selectedLab, setSelectedLab] = useState<LabOrder | null>(null);
  const [clinicalNote, setClinicalNote] = useState("");

  const allLabs = domain.labOrders;
  const pendingLabs = allLabs.filter((l) => l.status === "pending");
  const receivedLabs = allLabs.filter((l) => l.status === "received");
  const needsReviewLabs = allLabs.filter((l) => l.status === "needs-review");
  const reviewedLabs = allLabs.filter((l) => l.status === "reviewed");
  const abnormalLabs = allLabs.filter((l) => l.isAbnormal);

  function getTabList() {
    switch (activeTab) {
      case "Pending": return pendingLabs;
      case "Results Received": return receivedLabs;
      case "Needs Review": return needsReviewLabs;
      case "Reviewed": return reviewedLabs;
      case "Abnormal": return abnormalLabs;
      default: return allLabs;
    }
  }

  const currentList = getTabList();

  function handleCreateOrder() {
    if (!testName.trim()) {
      addToast("error", "Please specify a test name.");
      return;
    }
    const pat = DOCTOR_PATIENTS.find((p) => p.id === patientId);
    orderLabTest({
      patientId,
      patientName: pat?.name || "Patient",
      category,
      testName,
      clinicalIndication: indication || "Clinical assessment",
      urgency,
    });
    addToast("success", `Lab order for ${testName} issued.`);
    setOrderModal(false);
    setTestName("");
    setIndication("");
  }

  function handleCompleteReview() {
    if (!selectedLab) return;
    reviewLabOrder(selectedLab.id, clinicalNote || "Reviewed and verified by Dr. Amara.");
    addToast("success", `Lab result for ${selectedLab.patientName} marked reviewed.`);
    setSelectedLab(null);
    setClinicalNote("");
  }

  return (
    <AppShell role="doctor" topBarTitle="Lab Orders & Results">
      <div className="px-4 md:px-6 py-6 space-y-6" style={{ fontFamily: "var(--font-body)" }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Lab Orders & Results
            </h1>
            <p className="text-sm mt-1" style={{ color: C.muted }}>
              First-class diagnostic workflow: Order Tests → Results Received → Clinical Review & Action.
            </p>
          </div>
          <Button onClick={() => setOrderModal(true)}>
            + Order Lab Test
          </Button>
        </div>

        {/* Diagnostic Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border" style={{ borderColor: C.border }}>
            <p className="text-xs" style={{ color: C.muted }}>Pending Orders</p>
            <p className="text-2xl font-bold mt-1" style={{ color: C.navy }}>{pendingLabs.length}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Awaiting laboratory sample</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border" style={{ borderColor: C.border }}>
            <p className="text-xs" style={{ color: C.muted }}>Needs Clinical Review</p>
            <p className="text-2xl font-bold mt-1" style={{ color: C.amber }}>{needsReviewLabs.length}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Results received</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border" style={{ borderColor: C.border }}>
            <p className="text-xs" style={{ color: C.muted }}>Abnormal Results</p>
            <p className="text-2xl font-bold mt-1" style={{ color: C.coral }}>{abnormalLabs.length}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Action required</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border" style={{ borderColor: C.border }}>
            <p className="text-xs" style={{ color: C.muted }}>Reviewed This Month</p>
            <p className="text-2xl font-bold mt-1" style={{ color: C.green }}>{reviewedLabs.length}</p>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>In patient chart</p>
          </div>
        </div>

        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {/* Labs List */}
        {currentList.length === 0 ? (
          <EmptyState
            icon="🧪"
            title={`No ${activeTab.toLowerCase()} lab records`}
            body="All orders in this diagnostic queue are up to date."
          />
        ) : (
          <div className="space-y-4">
            {currentList.map((lab) => (
              <Card key={lab.id} className={`p-5 ${lab.isAbnormal ? "border-l-4 border-l-red-500 bg-red-50/10" : ""}`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <Avatar src={lab.patientPhoto} name={lab.patientName} size={48} />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                          {lab.testName}
                        </h3>
                        <Badge variant={lab.urgency === "urgent" ? "red" : "navy"}>
                          {lab.urgency.toUpperCase()}
                        </Badge>
                        <span className="text-xs px-2 py-0.5 rounded-full capitalize font-semibold bg-slate-100 text-slate-700">
                          {lab.category}
                        </span>
                        {lab.isAbnormal && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                            🔴 Abnormal Result
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold" style={{ color: C.navy }}>
                        Patient: {lab.patientName}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                        Indication: {lab.clinicalIndication} · Ordered: {lab.orderedDate}
                      </p>
                      {lab.abnormalDetails && (
                        <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-800">
                          {lab.abnormalDetails}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions according to Lab State */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {lab.status === "needs-review" && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setSelectedLab(lab);
                          setClinicalNote(lab.clinicalNote || "");
                        }}
                      >
                        Review Results
                      </Button>
                    )}
                    {lab.isAbnormal && (
                      <>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            setSelectedLab(lab);
                            setClinicalNote(lab.clinicalNote || "");
                          }}
                        >
                          🔴 View Result
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate("doctor-chat")}
                        >
                          Message Patient
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate("consultation-room", { doctorId: "d1" })}
                        >
                          Start Consultation
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate("doctor-care-plans")}
                        >
                          Update Care Plan
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate("doctor-follow-ups")}
                        >
                          Schedule Follow-up
                        </Button>
                      </>
                    )}
                    {lab.status === "reviewed" && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          ✓ Reviewed on {lab.reviewedAt}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedLab(lab)}
                        >
                          View Values
                        </Button>
                      </div>
                    )}
                    {lab.status === "pending" && (
                      <span className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600">
                        ⏳ Dispatch pending with Synlab / Clina-Lancet
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Order Lab Test Modal */}
        <Modal open={orderModal} onClose={() => setOrderModal(false)} title="Order Diagnostic Lab Test">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Patient</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm outline-none font-medium"
                style={{ borderColor: C.border }}
              >
                {DOCTOR_PATIENTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.country})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.muted }}>Test Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className="p-3 rounded-xl border text-left flex items-center gap-2 text-xs font-semibold transition-all"
                    style={{
                      borderColor: category === c.id ? C.navy : C.border,
                      backgroundColor: category === c.id ? "#E6F1EE" : "white",
                      color: category === c.id ? C.navy : C.label,
                    }}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Test Name</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g. Comprehensive Metabolic Panel (CMP), HbA1c, 12-Lead ECG"
                className="w-full rounded-xl border p-3 text-sm outline-none"
                style={{ borderColor: C.border }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Clinical Indication / Question to be answered</label>
              <textarea
                value={indication}
                onChange={(e) => setIndication(e.target.value)}
                rows={2}
                placeholder="Reason for requesting this test (e.g. monitoring ACE inhibitor, dyspnea on exertion)"
                className="w-full rounded-xl border p-3 text-sm outline-none resize-none"
                style={{ borderColor: C.border }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Priority / Urgency</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    checked={urgency === "routine"}
                    onChange={() => setUrgency("routine")}
                  />
                  Routine Diagnostic
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer text-red-600 font-semibold">
                  <input
                    type="radio"
                    name="urgency"
                    checked={urgency === "urgent"}
                    onChange={() => setUrgency("urgent")}
                  />
                  🔴 Urgent Priority (24h turnaround)
                </label>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="ghost" onClick={() => setOrderModal(false)}>Cancel</Button>
              <Button onClick={handleCreateOrder}>Submit Lab Order</Button>
            </div>
          </div>
        </Modal>

        {/* View / Review Results Modal */}
        <Modal open={!!selectedLab} onClose={() => setSelectedLab(null)} title={selectedLab?.testName || "Lab Results"} maxWidth="max-w-2xl">
          {selectedLab && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: C.border }}>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: C.navy }}>{selectedLab.patientName}</h4>
                  <p className="text-xs" style={{ color: C.muted }}>Sample collected · Ordered {selectedLab.orderedDate}</p>
                </div>
                {selectedLab.isAbnormal && (
                  <Badge variant="red">🔴 Abnormal Result Detected</Badge>
                )}
              </div>

              {selectedLab.results && selectedLab.results.length > 0 ? (
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 border-b text-slate-500 font-semibold" style={{ borderColor: C.border }}>
                      <tr>
                        <th className="py-2.5 px-3 text-left">Parameter</th>
                        <th className="py-2.5 px-3 text-left">Value</th>
                        <th className="py-2.5 px-3 text-left">Reference Range</th>
                        <th className="py-2.5 px-3 text-left">Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: C.border }}>
                      {selectedLab.results.map((res, i) => (
                        <tr key={i} className={res.status === "critical" || res.status === "high" || res.status === "low" ? "bg-red-50/40" : ""}>
                          <td className="py-2 px-3 font-medium text-slate-800">{res.parameter}</td>
                          <td className="py-2 px-3 font-bold text-slate-900">{res.value} {res.unit}</td>
                          <td className="py-2 px-3 text-slate-500">{res.referenceRange}</td>
                          <td className="py-2 px-3">
                            {res.status === "critical" ? (
                              <span className="px-1.5 py-0.5 rounded font-bold bg-red-100 text-red-700">CRITICAL</span>
                            ) : res.status === "high" ? (
                              <span className="px-1.5 py-0.5 rounded font-semibold bg-amber-100 text-amber-700">HIGH</span>
                            ) : res.status === "low" ? (
                              <span className="px-1.5 py-0.5 rounded font-semibold bg-blue-100 text-blue-700">LOW</span>
                            ) : (
                              <span className="text-slate-400">Normal</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border text-xs text-slate-600" style={{ borderColor: C.border }}>
                  Imaging / microbiology report attached in electronic diagnostic record.
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: C.muted }}>
                  Clinician Review Note & Plan
                </label>
                <textarea
                  value={clinicalNote}
                  onChange={(e) => setClinicalNote(e.target.value)}
                  rows={3}
                  placeholder="Record your clinical interpretation, recommended adjustments, or follow-up instructions..."
                  className="w-full rounded-xl border p-3 text-sm outline-none resize-none"
                  style={{ borderColor: C.border }}
                />
              </div>

              {selectedLab.isAbnormal && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-xs font-bold text-red-800 mb-1">Recommended Emergency / Abnormal Actions:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="danger" onClick={() => { setSelectedLab(null); navigate("doctor-chat"); }}>
                      Message Patient Now
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedLab(null); navigate("consultation-room", { doctorId: "d1" }); }}>
                      Schedule Urgent Consult
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedLab(null); navigate("doctor-care-plans"); }}>
                      Update Care Plan Target
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="ghost" onClick={() => setSelectedLab(null)}>Close</Button>
                {selectedLab.status !== "reviewed" && (
                  <Button onClick={handleCompleteReview}>Mark as Clinically Reviewed</Button>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppShell>
  );
}
