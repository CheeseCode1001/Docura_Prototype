import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Card, Button, Badge, Avatar, Modal, ProgressBar, EmptyState, SectionHeader } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { DOCTOR_CARE_PLANS, DOCTOR_PATIENTS } from "@/data/mock";

type CarePlan = typeof DOCTOR_CARE_PLANS[number];

function isDueSoon(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 7;
}

export default function DoctorCarePlans() {
  const { addToast, navigate, createCarePlan, domain } = useApp();

  const [updateTarget, setUpdateTarget] = useState<CarePlan | null>(null);
  const [updateNote, setUpdateNote] = useState("");
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateReview, setUpdateReview] = useState("");

  const [showNewModal, setShowNewModal] = useState(false);
  const [newPatient, setNewPatient] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [newRecs, setNewRecs] = useState(["", "", ""]);

  function openUpdate(plan: CarePlan) {
    setUpdateTarget(plan);
    setUpdateProgress(plan.progress);
    setUpdateNote("");
    setUpdateReview(plan.nextReview);
  }

  function saveUpdate() {
    addToast("success", "Plan updated");
    setUpdateTarget(null);
  }

  function createPlan() {
    if (!newPatient || !newTitle) {
      addToast("error", "Please fill in all required fields");
      return;
    }
    // The plan lands in shared state, so it appears on the patient's Care Plans
    // page and generates a notification for them.
    createCarePlan({
      title: newTitle,
      goal: newGoal || "Goal to be agreed at the next review",
      doctorId: "d1",
      doctorName: "Dr. Amara Osei",
      recommendations: newRecs.filter((item) => item.trim().length > 0),
    });
    addToast("success", `Care plan created for ${newPatient} and shared with them`);
    setShowNewModal(false);
    setNewPatient("");
    setNewTitle("");
    setNewGoal("");
    setNewRecs(["", "", ""]);
  }

  // Seeded doctor-view plans plus anything created in this session.
  const plans: CarePlan[] = [
    ...domain.carePlans
      .filter((plan) => plan.doctorId === "d1" && !DOCTOR_CARE_PLANS.some((seed) => seed.title === plan.title))
      .map((plan) => ({
        id: plan.id,
        patient: "Adaeze Okafor",
        patientPhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
        title: plan.title,
        status: "active" as const,
        progress: plan.progress,
        nextReview: plan.nextReview,
        lastUpdated: plan.lastUpdated,
      })),
    ...DOCTOR_CARE_PLANS,
  ];

  return (
    <AppShell role="doctor">
      <div className="px-4 py-8 space-y-6">
        <SectionHeader
          title="Care Plans"
          subtitle="Structured care for your patients."
          action="New care plan"
          onAction={() => setShowNewModal(true)}
        />

        {plans.length === 0 ? (
          <EmptyState
            icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>}
            title="No care plans yet"
            body="Create your first care plan to start structured care for a patient."
            cta="New care plan"
            onCta={() => setShowNewModal(true)}
          />
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <div className="flex items-start gap-4">
                  <Avatar src={plan.patientPhoto} name={plan.patient} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-xs mb-0.5" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>{plan.patient}</p>
                        <h3 className="text-lg font-bold leading-tight" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>{plan.title}</h3>
                      </div>
                      <Badge variant={plan.status === "active" ? "green" : "gray"}>{plan.status}</Badge>
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs" style={{ color: C.muted }}>
                        <span>Progress</span>
                        <span>{plan.progress}%</span>
                      </div>
                      <ProgressBar value={plan.progress} />
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-xs" style={{ color: C.muted }}>
                      <span>
                        Next review:{" "}
                        <span
                          className="font-semibold"
                          style={{ color: isDueSoon(plan.nextReview) ? C.coral : C.navy }}
                        >
                          {plan.nextReview}
                          {isDueSoon(plan.nextReview) ? " — due soon" : ""}
                        </span>
                      </span>
                      <span>Last updated: {plan.lastUpdated}</span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => navigate("doctor-patients")}>View plan</Button>
                      <Button size="sm" onClick={() => openUpdate(plan)}>Update</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Update Modal */}
        <Modal open={!!updateTarget} onClose={() => setUpdateTarget(null)} title={"Update Plan — " + (updateTarget?.title ?? "")}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.label, fontFamily: "var(--font-body)" }}>Clinical note</label>
              <textarea
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                placeholder="Add a clinical note..."
                rows={3}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none resize-none"
                style={{ borderColor: C.border, color: C.navy, fontFamily: "var(--font-body)" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.amber; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: C.label, fontFamily: "var(--font-body)" }}>
                Progress — {updateProgress}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={updateProgress}
                onChange={(e) => setUpdateProgress(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: C.amber }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.label, fontFamily: "var(--font-body)" }}>Next review date</label>
              <input
                type="date"
                value={updateReview}
                onChange={(e) => setUpdateReview(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                style={{ borderColor: C.border, color: C.navy, fontFamily: "var(--font-body)" }}
              />
            </div>

            <Button fullWidth onClick={saveUpdate}>Save update</Button>
          </div>
        </Modal>

        {/* New Care Plan Modal */}
        <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="New Care Plan" maxWidth="max-w-xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.label, fontFamily: "var(--font-body)" }}>Select patient</label>
              <select
                value={newPatient}
                onChange={(e) => setNewPatient(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                style={{ borderColor: C.border, color: C.navy, fontFamily: "var(--font-body)" }}
              >
                <option value="">Choose a patient...</option>
                {DOCTOR_PATIENTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.label, fontFamily: "var(--font-body)" }}>Plan title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Hypertension Management Plan"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                style={{ borderColor: C.border, color: C.navy, fontFamily: "var(--font-body)" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.label, fontFamily: "var(--font-body)" }}>Goal</label>
              <textarea
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Describe the clinical goal..."
                rows={2}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none resize-none"
                style={{ borderColor: C.border, color: C.navy, fontFamily: "var(--font-body)" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: C.label, fontFamily: "var(--font-body)" }}>Recommendations</label>
              <div className="space-y-2">
                {newRecs.map((rec, i) => (
                  <input
                    key={i}
                    type="text"
                    value={rec}
                    onChange={(e) => {
                      const updated = [...newRecs];
                      updated[i] = e.target.value;
                      setNewRecs(updated);
                    }}
                    placeholder={`Recommendation ${i + 1}`}
                    className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none"
                    style={{ borderColor: C.border, color: C.navy, fontFamily: "var(--font-body)" }}
                  />
                ))}
                <button
                  onClick={() => setNewRecs([...newRecs, ""])}
                  className="text-sm font-medium"
                  style={{ color: C.amber, fontFamily: "var(--font-body)" }}
                >
                  + Add another
                </button>
              </div>
            </div>

            <Button fullWidth onClick={createPlan}>Create plan</Button>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
