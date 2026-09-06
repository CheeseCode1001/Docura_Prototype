import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Badge, Card, Button, AlertBanner, ProgressBar, Divider } from "@/components/ui";
import { MEDICATIONS } from "@/data/mock";

type ActiveTab = "current" | "past";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function duration(startDate: string, endDate: string | null): string {
  const start = new Date(startDate + "T00:00:00");
  const end = endDate ? new Date(endDate + "T00:00:00") : new Date();
  const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""}`;
  const months = Math.round(days / 30);
  return `${months} month${months !== 1 ? "s" : ""}`;
}

function nextReminder(): string {
  // Find next reminder from current medications
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const currentMinutes = currentHour * 60 + currentMin;

  const allReminders: { time: string; medName: string; dosage: string }[] = [];
  MEDICATIONS.filter((m) => m.status === "current" && m.remindersEnabled).forEach((m) => {
    m.reminderTimes.forEach((t) => {
      allReminders.push({ time: t, medName: m.name, dosage: m.dosage });
    });
  });

  allReminders.sort((a, b) => a.time.localeCompare(b.time));

  // Find next after current time
  const next = allReminders.find((r) => {
    const [h, min] = r.time.split(":").map(Number);
    return h * 60 + min > currentMinutes;
  }) || allReminders[0];

  if (!next) return "No reminders set";
  const [h] = next.time.split(":").map(Number);
  const period = h >= 12 ? (h === 12 ? "noon" : "tonight") : "this morning";
  return `Next reminder: ${next.time} ${period} — ${next.medName} ${next.dosage}`;
}

export default function Medications() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("current");
  const [expandedMed, setExpandedMed] = useState<string | null>(null);
  const [takenToday, setTakenToday] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    MEDICATIONS.forEach((m) => {
      init[m.id] = m.todayTaken;
    });
    return init;
  });

  const currentMeds = MEDICATIONS.filter((m) => m.status === "current");
  const pastMeds = MEDICATIONS.filter((m) => m.status === "past");

  function handleMarkTaken(id: string) {
    setTakenToday((prev) => ({ ...prev, [id]: true }));
  }

  function toggleExpanded(id: string) {
    setExpandedMed((prev) => (prev === id ? null : id));
  }

  return (
    <AppShell role="patient">
      <div className="px-4 py-6">
        <h1
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: "var(--font-display)", color: C.navy }}
        >
          My Medications
        </h1>

        {/* Safety reminder */}
        <div className="mb-4">
          <AlertBanner
            type="warning"
            title="Safety reminder"
            body="Always follow your doctor's prescription instructions. Do not start, stop, or change medication without consulting your doctor."
          />
        </div>

        {/* Next Reminder card */}
        <div
          className="rounded-xl p-4 mb-5"
          style={{
            backgroundColor: C.amberLight,
            borderLeft: `4px solid ${C.amber}`,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: C.navy }}>
            {nextReminder()}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(["current", "past"] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-150 capitalize"
              style={{
                backgroundColor: activeTab === tab ? C.navy : C.warm,
                color: activeTab === tab ? "white" : C.label,
                border: `1px solid ${activeTab === tab ? C.navy : C.border}`,
              }}
            >
              {tab === "current" ? "Current" : "Past"}
            </button>
          ))}
        </div>

        {/* Current medications */}
        {activeTab === "current" && (
          <div className="flex flex-col gap-4">
            {currentMeds.map((med) => (
              <Card key={med.id}>
                {/* Header */}
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-display)", color: C.navy }}
                  >
                    {med.name}
                  </span>
                  <Badge variant="amber">{med.dosage}</Badge>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: C.border, color: C.muted }}
                  >
                    {med.frequency}
                  </span>
                </div>

                {/* Purpose */}
                <p className="text-sm mb-3" style={{ color: C.muted }}>
                  {med.purpose}
                </p>

                <Divider />

                {/* Doctor & Start date */}
                <div className="flex flex-wrap gap-4 my-3">
                  <div className="flex items-center gap-1.5">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="7" r="4" stroke={C.muted} strokeWidth="1.5" />
                      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs" style={{ color: C.muted }}>
                      {med.doctorName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs" style={{ color: C.muted }}>
                      Started {formatDate(med.startDate)}
                    </span>
                  </div>
                </div>

                <Divider />

                {/* Adherence */}
                <div className="my-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: C.label }}>
                      Adherence
                    </span>
                    <span className="text-xs font-bold" style={{ color: med.adherence >= 80 ? C.green : C.coral }}>
                      {med.adherence}%
                    </span>
                  </div>
                  <ProgressBar value={med.adherence} max={100} color={med.adherence >= 80 ? C.green : C.coral} />
                </div>

                {/* Reminders */}
                {med.remindersEnabled && med.reminderTimes.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold" style={{ color: C.label }}>
                      Reminders:{" "}
                    </span>
                    <span className="text-xs" style={{ color: C.muted }}>
                      {med.reminderTimes.join(", ")}
                    </span>
                  </div>
                )}

                <Divider />

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {takenToday[med.id] ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: C.greenLight, color: C.green }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Taken today
                    </div>
                  ) : (
                    <Button variant="primary" size="sm" onClick={() => handleMarkTaken(med.id)}>
                      Mark as taken
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpanded(med.id)}
                  >
                    {expandedMed === med.id ? "Hide instructions" : "View instructions"}
                  </Button>
                </div>

                {/* Expanded instructions */}
                {expandedMed === med.id && (
                  <div
                    className="mt-3 rounded-lg p-3 text-sm leading-relaxed"
                    style={{ backgroundColor: C.warm, color: C.label, border: `1px solid ${C.border}` }}
                  >
                    {med.instructions}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Past medications */}
        {activeTab === "past" && (
          <div className="flex flex-col gap-4">
            {pastMeds.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: C.muted }}>
                No past medications on record.
              </p>
            ) : (
              pastMeds.map((med) => (
                <Card key={med.id} className="opacity-80">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className="text-base font-bold"
                      style={{ fontFamily: "var(--font-display)", color: C.muted }}
                    >
                      {med.name}
                    </span>
                    <Badge variant="gray">{med.dosage}</Badge>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: C.border, color: C.muted }}
                    >
                      {med.frequency}
                    </span>
                  </div>

                  <p className="text-sm mb-2" style={{ color: C.muted }}>
                    {med.purpose}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs" style={{ color: C.muted }}>
                    <span>
                      <strong>Doctor:</strong> {med.doctorName}
                    </span>
                    <span>
                      <strong>From:</strong> {formatDate(med.startDate)}
                      {med.endDate ? ` — ${formatDate(med.endDate)}` : ""}
                    </span>
                    {med.endDate && (
                      <span>
                        <strong>Duration:</strong> {duration(med.startDate, med.endDate)}
                      </span>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
