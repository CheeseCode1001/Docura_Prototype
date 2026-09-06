import { AppShell } from "@/components/layout";
import { C, ProgressBar } from "@/components/ui";
import { CARE_JOURNEY } from "@/data/mock";

const ICON_MAP: Record<string, string> = {
  star: "⭐",
  doctor: "👨‍⚕️",
  consultation: "🩺",
  plan: "📋",
  globe: "🌍",
  prescription: "💊",
  health: "❤️",
  milestone: "🏆",
  now: "📍",
};

export default function CareJourney() {
  const milestones = CARE_JOURNEY.filter((e) => e.milestone).length;
  const months = 14;

  return (
    <AppShell role="patient" topBarTitle="Care Journey" showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: C.navy }}
          >
            Your Care Journey
          </h1>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            Your healthcare story, from beginning to now.
          </p>
        </div>

        {/* Progress summary */}
        <div
          className="rounded-2xl p-5 border"
          style={{ borderColor: "rgba(232,160,32,0.25)", backgroundColor: C.amberLight }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.amber }}>
                Care progress
              </p>
              <p className="text-sm font-bold mt-0.5" style={{ color: C.navy }}>
                {milestones} milestones · {months} months of care
              </p>
            </div>
            <span className="text-3xl">🏆</span>
          </div>
          <ProgressBar value={72} />
          <p className="text-xs mt-2" style={{ color: C.amber }}>Your care is growing.</p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col">
          {CARE_JOURNEY.map((entry, index) => {
            const isMilestone = entry.milestone;
            const isLast = index === CARE_JOURNEY.length - 1;

            return (
              <div key={entry.id} className="flex gap-4">
                {/* Left: connector */}
                <div className="flex flex-col items-center" style={{ minWidth: 36 }}>
                  {/* Dot */}
                  <div
                    className="flex items-center justify-center rounded-full shrink-0 font-bold z-10"
                    style={{
                      width: isMilestone ? 36 : 26,
                      height: isMilestone ? 36 : 26,
                      backgroundColor: isMilestone ? C.amber : C.amberLight,
                      color: isMilestone ? "white" : C.amber,
                      fontSize: isMilestone ? 16 : 12,
                      border: isMilestone ? `3px solid white` : undefined,
                      boxShadow: isMilestone ? `0 0 0 3px ${C.amber}` : undefined,
                      marginTop: 4,
                    }}
                  >
                    {isMilestone ? ICON_MAP[entry.icon] ?? "⭐" : ICON_MAP[entry.icon] ?? "•"}
                  </div>
                  {/* Line */}
                  {!isLast && (
                    <div
                      className="w-0.5 flex-1 mt-1"
                      style={{ backgroundColor: C.border, minHeight: 32 }}
                    />
                  )}
                </div>

                {/* Right: card */}
                <div className={`flex-1 pb-6 ${isLast ? "pb-2" : ""}`}>
                  <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>
                    {entry.date}
                  </p>
                  <div
                    className={`rounded-xl p-4 border ${isMilestone ? "shadow-sm" : ""}`}
                    style={{
                      borderColor: isMilestone ? "rgba(232,160,32,0.3)" : C.border,
                      backgroundColor: isMilestone ? C.amberLight : "white",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`font-bold ${isMilestone ? "text-base" : "text-sm"}`}
                        style={{
                          fontFamily: isMilestone ? "var(--font-display)" : "var(--font-body)",
                          color: C.navy,
                        }}
                      >
                        {entry.title}
                      </p>
                      {isMilestone && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: C.amber, color: "white" }}>
                          Milestone
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1" style={{ color: isMilestone ? C.navy : C.muted }}>
                      {entry.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer tagline */}
        <div className="text-center py-4">
          <p
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-display)", color: C.amber }}
          >
            Your care is growing. 🌱
          </p>
          <p className="text-xs mt-1" style={{ color: C.muted }}>
            Every consultation, every plan, every milestone — tracked here.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
