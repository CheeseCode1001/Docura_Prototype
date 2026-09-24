import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Badge, Button, Avatar, C, EmptyState, SectionHeader } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import type { AlertCategory } from "@/data/types";

const CATEGORY_META: Record<AlertCategory, { label: string; dotColor: string; badgeVariant: "red" | "amber" | "yellow" | "gray" | "blue" }> = {
  "at-risk": { label: "At Risk", dotColor: C.red, badgeVariant: "red" },
  "needs-attention": { label: "Needs Attention", dotColor: C.amber, badgeVariant: "amber" },
  "due-checkin": { label: "Due Check-in", dotColor: C.yellow, badgeVariant: "yellow" },
  "silent": { label: "Silent / No Response", dotColor: "#9CA3AF", badgeVariant: "gray" },
  "abnormal-result": { label: "Abnormal Result", dotColor: "#3B82F6", badgeVariant: "blue" },
  "care-plan-overdue": { label: "Care Plan Overdue", dotColor: "#6366F1", badgeVariant: "blue" },
  "followup-missed": { label: "Follow-up Missed", dotColor: "#EC4899", badgeVariant: "red" },
};

export default function PatientAlerts() {
  const { domain, navigate, addToast, resolvePatientAlert, snoozePatientAlert } = useApp();
  const [filter, setFilter] = useState<string>("all");
  const [snoozeModal, setSnoozeModal] = useState<string | null>(null);

  const activeAlerts = domain.patientAlerts.filter((a) => a.status === "active");
  const filtered = filter === "all" ? activeAlerts : activeAlerts.filter((a) => a.category === filter);

  const urgentCount = activeAlerts.filter((a) => a.severity === "critical" || a.severity === "high").length;

  return (
    <AppShell role="doctor" topBarTitle="Patient Alerts">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6" style={{ fontFamily: "var(--font-body)" }}>
        {/* Header with Risk Engine Status */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: C.coral }} />
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: C.label }}>Proactive Patient-Risk Engine</p>
            </div>
            <h1 className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Patient Alerts · {activeAlerts.length}
            </h1>
            <p className="text-sm mt-1" style={{ color: C.muted }}>
              Continuous automated monitoring every 6 hours. Surfacing patients requiring clinical attention without waiting for self-booking.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl px-4 py-2 border bg-white" style={{ borderColor: C.border }}>
            <span className="text-lg">⏱️</span>
            <div>
              <p className="text-xs font-bold" style={{ color: C.navy }}>Scan cycle: 6 hours</p>
              <p className="text-[11px]" style={{ color: C.muted }}>Last verified: 14 mins ago · {urgentCount} urgent items</p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilter("all")}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border"
            style={{
              backgroundColor: filter === "all" ? C.navy : "white",
              color: filter === "all" ? "white" : C.label,
              borderColor: filter === "all" ? C.navy : C.border,
            }}
          >
            All Alerts ({activeAlerts.length})
          </button>
          {(Object.keys(CATEGORY_META) as AlertCategory[]).map((cat) => {
            const count = activeAlerts.filter((a) => a.category === cat).length;
            if (count === 0 && filter !== cat) return null;
            const meta = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border"
                style={{
                  backgroundColor: filter === cat ? C.navy : "white",
                  color: filter === cat ? "white" : C.label,
                  borderColor: filter === cat ? C.navy : C.border,
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.dotColor }} />
                <span>{meta.label}</span>
                <span className="opacity-70 text-[11px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Alert List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="✅"
            title="No active alerts in this category"
            body="All patient flags have been addressed or resolved by your care team."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((alert) => {
              const meta = CATEGORY_META[alert.category] || { label: alert.category, dotColor: C.muted, badgeVariant: "gray" };
              return (
                <Card key={alert.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 border-l-4" style={{ borderLeftColor: meta.dotColor }}>
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar src={alert.patientPhoto} name={alert.patientName} size={48} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                          {alert.patientName}
                        </h3>
                        <Badge variant={meta.badgeVariant}>{meta.label}</Badge>
                        {alert.severity === "critical" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 animate-pulse">
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold mb-1" style={{ color: C.navy }}>
                        {alert.why}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: C.muted }}>
                        <span>🕒 {alert.lastActivity}</span>
                        <span>💡 <strong className="font-semibold text-slate-700">{alert.recommendedAction}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate("doctor-chat")}
                    >
                      Message
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("consultation-room", { doctorId: "d1" })}
                    >
                      Start consultation
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate("doctor-patients")}
                    >
                      View record
                    </Button>
                    <button
                      onClick={() => {
                        resolvePatientAlert(alert.id);
                        addToast("success", `Alert for ${alert.patientName} marked resolved.`);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors border border-emerald-200"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => {
                        snoozePatientAlert(alert.id, 1);
                        addToast("info", `Alert snoozed for 24 hours.`);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors border"
                      style={{ borderColor: C.border, color: C.muted }}
                    >
                      Snooze
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
