import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Button, Badge, EmptyState } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { AUDIT_LOG } from "@/data/mock";

type Category = "all" | "verification" | "crossborder" | "payment" | "dispute";

const CATEGORY_CHIPS: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Verification", value: "verification" },
  { label: "Cross-border", value: "crossborder" },
  { label: "Payments", value: "payment" },
  { label: "Disputes", value: "dispute" },
];

function categoryColor(cat: string) {
  if (cat === "verification") return C.amber;
  if (cat === "crossborder") return C.blue ?? "#2563EB";
  if (cat === "payment") return C.green;
  if (cat === "dispute") return C.coral;
  return C.muted;
}

function categoryBadge(cat: string): "amber" | "blue" | "green" | "red" | "gray" {
  if (cat === "verification") return "amber";
  if (cat === "crossborder") return "blue";
  if (cat === "payment") return "green";
  if (cat === "dispute") return "red";
  return "gray";
}

function formatTimestamp(date: string, time: string) {
  const d = new Date(date + "T" + time);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " · " + time;
}

export default function AuditLog() {
  const { addToast } = useApp();
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered = activeCategory === "all"
    ? AUDIT_LOG
    : AUDIT_LOG.filter((e) => e.category === activeCategory);

  return (
    <AppShell role="admin">
      <div className="px-4 py-8 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>Audit Log</h1>
            <p className="text-sm mt-1" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
              A record of all significant platform actions.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => addToast("info", "Export coming soon")}>
            Export
          </Button>
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setActiveCategory(chip.value)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
              style={{
                borderColor: activeCategory === chip.value ? categoryColor(chip.value === "all" ? "none" : chip.value) : C.border,
                backgroundColor: activeCategory === chip.value ? (chip.value === "all" ? C.navy : categoryColor(chip.value) + "20") : "white",
                color: activeCategory === chip.value ? (chip.value === "all" ? "white" : categoryColor(chip.value)) : C.navy,
                fontFamily: "var(--font-body)",
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Log entries */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6M9 16h6M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
            title="No entries for this filter"
            body="Try selecting a different category."
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-xl border pl-4 pr-5 py-4 flex items-start gap-4"
                style={{ borderColor: C.border, borderLeftColor: categoryColor(entry.category), borderLeftWidth: 3 }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-bold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>{entry.event}</p>
                    <Badge variant={categoryBadge(entry.category)}>{entry.category}</Badge>
                  </div>
                  <p className="text-xs" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                    <span className="font-medium" style={{ color: C.label }}>{entry.actor}</span>
                    {" · "}
                    {entry.target}
                  </p>
                </div>
                <span className="text-xs shrink-0 mt-0.5" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
                  {formatTimestamp(entry.date, entry.time)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Privacy notice */}
        <p className="text-xs text-center pb-4" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>
          Audit logs are retained for 90 days and accessible to authorized administrators only.
        </p>
      </div>
    </AppShell>
  );
}
