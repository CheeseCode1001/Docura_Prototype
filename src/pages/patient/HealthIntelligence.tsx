import { AppShell } from "@/components/layout";
import {
  C,
  Button,
  Card,
  Badge,
  ProgressBar,
  AlertBanner,
  SectionHeader,
  Divider,
} from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { PATIENT, MEDICATIONS, CARE_PLANS } from "@/data/mock";

// ─── Icons ────────────────────────────────────────────────────────────────────
function PillIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CheckboxItem({ label }: { label: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div
        className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center"
        style={{ borderColor: C.amber, backgroundColor: C.amberLight }}
      >
        <div className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: C.amber }} />
      </div>
      <span className="text-sm leading-relaxed" style={{ color: C.label }}>{label}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HealthIntelligence() {
  const { navigate, back } = useApp();

  const currentMeds = MEDICATIONS.filter((m) => m.status === "current");
  const recentCarePlans = [...CARE_PLANS].slice(0, 2);

  const smartPrompts = [
    "Review blood sugar readings from this week",
    "Discuss Metformin dosage effectiveness",
    "Ask about exercise recommendations with hypertension",
  ];

  return (
    <AppShell role="patient">
      {/* Page Header */}
      <div className="mb-6">
        <SectionHeader
          title="Health Intelligence"
          subtitle="Your health, organized."
        />
      </div>

      {/* Clinical Disclaimer */}
      <div className="mb-6">
        <AlertBanner
          type="info"
          title="Clinical disclaimer"
          body="This summary is generated from your Docura records. All clinical decisions should be discussed with your doctor."
        />
      </div>

      {/* 6-section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

        {/* 1. Current Conditions */}
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.muted }}>
            Current Conditions
          </p>
          <div className="flex flex-wrap gap-2">
            {PATIENT.conditions.map((cond) => (
              <span
                key={cond}
                className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: "#FEF3DC", color: C.amber }}
              >
                {cond}
              </span>
            ))}
          </div>
        </Card>

        {/* 2. Current Medications */}
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.muted }}>
            Current Medications
          </p>
          <ul className="space-y-2">
            {currentMeds.map((med) => (
              <li key={med.id} className="flex items-center gap-2.5">
                <span style={{ color: C.amber }}>
                  <PillIcon />
                </span>
                <span className="text-sm" style={{ color: C.label }}>
                  <span className="font-semibold">{med.name}</span>{" "}
                  <span style={{ color: C.muted }}>{med.dosage} — {med.frequency}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* 3. Recent Care */}
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.muted }}>
            Recent Care
          </p>
          <ul className="space-y-3">
            {recentCarePlans.map((cp) => (
              <li key={cp.id} className="flex items-start gap-2.5">
                <span className="mt-0.5" style={{ color: C.amber }}>
                  <CalendarIcon />
                </span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.label }}>{cp.doctorName}</p>
                  <p className="text-xs" style={{ color: C.muted }}>Next review: {cp.nextReview}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* 4. Active Care Plans */}
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.muted }}>
            Active Care Plans
          </p>
          <ul className="space-y-4">
            {CARE_PLANS.map((cp) => (
              <li key={cp.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color: C.label }}>{cp.title}</span>
                  <Badge variant="amber">{cp.progress}%</Badge>
                </div>
                <ProgressBar value={cp.progress} max={100} />
              </li>
            ))}
          </ul>
        </Card>

        {/* 5. Things to Discuss */}
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: C.muted }}>
            Things to Discuss
          </p>
          <p className="text-xs mb-3" style={{ color: C.muted }}>Smart prompts for your next appointment</p>
          <div className="flex items-center gap-1.5 mb-2">
            <span style={{ color: C.amber }}>
              <ChatIcon />
            </span>
            <span className="text-xs font-medium" style={{ color: C.amber }}>Suggested topics</span>
          </div>
          <Divider />
          <div>
            {smartPrompts.map((prompt) => (
              <CheckboxItem key={prompt} label={prompt} />
            ))}
          </div>
        </Card>

        {/* 6. Upcoming Follow-ups */}
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.muted }}>
            Upcoming Follow-ups
          </p>
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: C.warm, border: `1px solid ${C.border}` }}
          >
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: C.amberLight }}
            >
              <CalendarIcon />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: C.navy }}>September 18, 2025</p>
              <p className="text-xs mt-0.5" style={{ color: C.label }}>Dr. Amara Osei</p>
              <p className="text-xs" style={{ color: C.muted }}>Diabetes review</p>
            </div>
          </div>
        </Card>

      </div>

      {/* Bottom CTA */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ backgroundColor: C.warm, border: `1px solid ${C.border}` }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: C.navy }}>Have a question for your doctor?</p>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>Send a message directly from Docura.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={back}>Back to dashboard</Button>
          <Button variant="primary" onClick={() => navigate("patient-chat")}>Message your doctor</Button>
        </div>
      </div>
    </AppShell>
  );
}
