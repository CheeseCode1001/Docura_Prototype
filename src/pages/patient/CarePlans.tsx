import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Badge, Button, C, EmptyState, Modal, ProgressBar, Divider } from "@/components/ui";
import { useApp } from "@/context/AppContext";

type Plan = ReturnType<typeof useApp>["domain"]["carePlans"][number];

function PlanDetailModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const { addToast } = useApp();
  return (
    <Modal open onClose={onClose} title={plan.title} maxWidth="max-w-xl">
      <div className="flex flex-col gap-5">
        {/* Status + meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="green">Active</Badge>
          <span className="text-xs" style={{ color: C.muted }}>
            Started {new Date(plan.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        {/* Goal */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: C.amberLight }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: C.amber }}>
            Goal
          </p>
          <p className="text-sm italic" style={{ color: C.navy }}>{plan.goal}</p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold" style={{ color: C.label }}>Progress</p>
            <p className="text-xs font-bold" style={{ color: C.amber }}>{plan.progress}%</p>
          </div>
          <ProgressBar value={plan.progress} />
        </div>

        {/* Recommendations */}
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: C.navy }}>Recommendations</p>
          <ol className="flex flex-col gap-2">
            {plan.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ backgroundColor: C.navy, color: "white" }}
                >
                  {i + 1}
                </span>
                <p className="text-sm" style={{ color: C.label }}>{rec}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Linked medications */}
        <div>
          <p className="text-sm font-semibold mb-2" style={{ color: C.navy }}>Linked medications</p>
          <div className="flex flex-wrap gap-2">
            {plan.linkedMedications.map((m) => (
              <span
                key={m}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: C.amberLight, color: C.amber }}
              >
                💊 {m}
              </span>
            ))}
          </div>
        </div>

        <Divider />

        {/* Connected flow */}
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: C.navy }}>Plan connected to</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { icon: "💊", label: "Medications" },
              { icon: "📅", label: "Follow-up" },
              { icon: "👨‍⚕️", label: "Personal Doctor" },
            ].map((node, i, arr) => (
              <div key={node.label} className="flex items-center gap-2">
                <div
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-center"
                  style={{ borderColor: C.border, minWidth: 80 }}
                >
                  <span className="text-lg">{node.icon}</span>
                  <p className="text-xs font-semibold whitespace-nowrap" style={{ color: C.navy }}>{node.label}</p>
                </div>
                {i < arr.length - 1 && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Update history */}
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: C.navy }}>Update history</p>
          <div className="flex flex-col gap-3">
            {plan.updates.map((u, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full mt-1" style={{ backgroundColor: C.amber }} />
                  {i < plan.updates.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{ backgroundColor: C.border }} />
                  )}
                </div>
                <div className="pb-3">
                  <p className="text-xs" style={{ color: C.muted }}>
                    {new Date(u.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {u.by}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: C.label }}>{u.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          fullWidth
          onClick={() => {
            addToast("info", "Opening message...");
            onClose();
          }}
        >
          Message doctor
        </Button>
      </div>
    </Modal>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const { addToast } = useApp();
  const [detailOpen, setDetailOpen] = useState(false);
  const [recsExpanded, setRecsExpanded] = useState(false);
  const [updatesExpanded, setUpdatesExpanded] = useState(false);

  return (
    <>
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: C.border, backgroundColor: "white" }}
      >
        <div className="p-5 flex flex-col gap-4">
          {/* Title + status */}
          <div className="flex items-start justify-between gap-3">
            <h3
              className="text-lg font-bold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: C.navy }}
            >
              {plan.title}
            </h3>
            <Badge variant="green">Active</Badge>
          </div>

          {/* Doctor + next review */}
          <div className="flex items-center gap-4 text-xs" style={{ color: C.muted }}>
            <span>👨‍⚕️ {plan.doctorName}</span>
            <span>📅 Review: {new Date(plan.nextReview).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
          </div>

          {/* Goal */}
          <p className="text-sm italic" style={{ color: C.muted }}>{plan.goal}</p>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs" style={{ color: C.label }}>Progress</p>
              <p className="text-xs font-bold" style={{ color: C.amber }}>{plan.progress}%</p>
            </div>
            <ProgressBar value={plan.progress} />
          </div>

          {/* Linked medications */}
          <div className="flex flex-wrap gap-2">
            {plan.linkedMedications.map((m) => (
              <span
                key={m}
                className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: C.amberLight, color: C.amber }}
              >
                💊 {m}
              </span>
            ))}
          </div>

          {/* Expandable recommendations */}
          <button
            className="flex items-center justify-between w-full text-left"
            onClick={() => setRecsExpanded((v) => !v)}
          >
            <span className="text-sm font-semibold" style={{ color: C.navy }}>
              Recommendations ({plan.recommendations.length})
            </span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={C.muted} strokeWidth="2" strokeLinecap="round"
              className={`transition-transform ${recsExpanded ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {recsExpanded && (
            <ol className="flex flex-col gap-2 pl-1">
              {plan.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold mt-0.5"
                    style={{ backgroundColor: C.navy, color: "white" }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm" style={{ color: C.label }}>{rec}</p>
                </li>
              ))}
            </ol>
          )}

          {/* View updates */}
          <button
            className="flex items-center gap-1 text-sm font-semibold"
            style={{ color: C.amber }}
            onClick={() => setUpdatesExpanded((v) => !v)}
          >
            {updatesExpanded ? "Hide updates" : "View updates"}
          </button>

          {updatesExpanded && (
            <div className="flex flex-col gap-3">
              {plan.updates.map((u, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: C.amber }} />
                    {i < plan.updates.length - 1 && <div className="w-px flex-1 mt-1" style={{ backgroundColor: C.border }} />}
                  </div>
                  <div className="pb-2">
                    <p className="text-xs" style={{ color: C.muted }}>
                      {new Date(u.date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })} · {u.by}
                    </p>
                    <p className="text-sm" style={{ color: C.label }}>{u.note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1 border-t" style={{ borderColor: C.border }}>
            <Button size="sm" onClick={() => setDetailOpen(true)} variant="outline">
              View full plan
            </Button>
            <Button size="sm" onClick={() => addToast("info", "Opening message...")}>
              Message doctor
            </Button>
          </div>
        </div>
      </div>

      {detailOpen && <PlanDetailModal plan={plan} onClose={() => setDetailOpen(false)} />}
    </>
  );
}

export default function CarePlans() {
  const { domain } = useApp();
  const carePlans = domain.carePlans;
  return (
    <AppShell role="patient" topBarTitle="Care Plans" showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: C.navy }}
          >
            Care Plans
          </h1>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            Your structured healthcare plans.
          </p>
        </div>

        {carePlans.length === 0 ? (
          <EmptyState
            icon={<span className="text-3xl">📋</span>}
            title="No care plans yet"
            body="Your doctor will create care plans to help you manage your health."
          />
        ) : (
          carePlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
        )}
      </div>
    </AppShell>
  );
}
