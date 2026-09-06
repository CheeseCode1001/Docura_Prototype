import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Badge, Card, Modal, EmptyState } from "@/components/ui";
import { HEALTH_TIMELINE } from "@/data/mock";

type TimelineItem = (typeof HEALTH_TIMELINE)[number];
type ActiveTab = "all" | "consultation" | "prescription" | "lab" | "medication" | "care" | "plan";

const TABS: { label: string; value: ActiveTab }[] = [
  { label: "All", value: "all" },
  { label: "Consultations", value: "consultation" },
  { label: "Prescriptions", value: "prescription" },
  { label: "Lab Results", value: "lab" },
  { label: "Medications", value: "medication" },
  { label: "Care Plans", value: "plan" },
];

function dotColor(type: string): string {
  if (type === "consultation") return C.amber;
  if (type === "lab") return C.blue;
  if (type === "prescription") return C.navy;
  if (type === "medication") return C.green;
  if (type === "care" || type === "plan") return C.coral;
  return C.muted;
}

function badgeVariant(type: string): "amber" | "blue" | "navy" | "green" | "red" | "gray" {
  if (type === "consultation") return "amber";
  if (type === "lab") return "blue";
  if (type === "prescription") return "navy";
  if (type === "medication") return "green";
  if (type === "care" || type === "plan") return "red";
  return "gray";
}

function badgeLabel(type: string): string {
  if (type === "consultation") return "Consultation";
  if (type === "lab") return "Lab Result";
  if (type === "prescription") return "Prescription";
  if (type === "medication") return "Medication";
  if (type === "care") return "Care";
  if (type === "plan") return "Care Plan";
  return type;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function monthKey(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function HealthTimeline() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [selectedEvent, setSelectedEvent] = useState<TimelineItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = HEALTH_TIMELINE.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "plan") return item.type === "plan" || item.type === "care";
    return item.type === activeTab;
  });

  // Group by month
  const groups: { month: string; items: TimelineItem[] }[] = [];
  filtered.forEach((item) => {
    const m = monthKey(item.date);
    const existing = groups.find((g) => g.month === m);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.push({ month: m, items: [item] });
    }
  });

  function openModal(item: TimelineItem) {
    setSelectedEvent(item);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedEvent(null);
  }

  return (
    <AppShell role="patient">
      <div className="w-full px-4 py-6">
        <h1
          className="text-2xl font-bold mb-5"
          style={{ fontFamily: "var(--font-display)", color: C.navy }}
        >
          My Health Timeline
        </h1>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150"
              style={{
                backgroundColor: activeTab === tab.value ? C.navy : C.warm,
                color: activeTab === tab.value ? "white" : C.label,
                border: `1px solid ${activeTab === tab.value ? C.navy : C.border}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke={C.muted} strokeWidth="1.5" />
                <path d="M12 8v4m0 4h.01" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            title="No events found"
            body="There are no timeline events for this category yet."
          />
        ) : (
          <div>
            {groups.map((group) => (
              <div key={group.month} className="mb-6">
                {/* Month header */}
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: C.muted }}>
                  {group.month}
                </p>

                {/* Events with timeline line */}
                <div className="relative border-l-2 pl-6 ml-3" style={{ borderColor: C.border }}>
                  {group.items.map((item) => (
                    <div key={item.id} className="relative mb-5 last:mb-0">
                      {/* Dot */}
                      <span
                        className="absolute -left-8 top-3 w-4 h-4 rounded-full border-2 border-white"
                        style={{ backgroundColor: dotColor(item.type), marginLeft: "1px" }}
                      />

                      <Card>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs" style={{ color: C.muted }}>
                            {formatDate(item.date)}
                          </span>
                          <Badge variant={badgeVariant(item.type)}>{badgeLabel(item.type)}</Badge>
                        </div>
                        <p
                          className="font-bold text-base mb-1"
                          style={{ fontFamily: "var(--font-display)", color: C.navy }}
                        >
                          {item.title}
                        </p>
                        <p className="text-sm mb-3" style={{ color: C.muted }}>
                          {item.body}
                        </p>
                        <button
                          className="text-sm font-semibold underline"
                          style={{ color: C.amber }}
                          onClick={() => openModal(item)}
                        >
                          View details
                        </button>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={modalOpen} onClose={closeModal} title="Event Details">
        {selectedEvent && (
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-sm" style={{ color: C.muted }}>
                {formatDate(selectedEvent.date)}
              </span>
              <Badge variant={badgeVariant(selectedEvent.type)}>{badgeLabel(selectedEvent.type)}</Badge>
            </div>
            <h2
              className="text-lg font-bold mb-2"
              style={{ fontFamily: "var(--font-display)", color: C.navy }}
            >
              {selectedEvent.title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
              {selectedEvent.body}
            </p>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
