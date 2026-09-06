import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Avatar, Badge, Button, C, SectionHeader, AvailabilityDot } from "@/components/ui";
import { CARE_TEAM, PATIENT } from "@/data/mock";
import { useApp } from "@/context/AppContext";

const COUNTRY_FLAGS: Record<string, string> = {
  Nigeria: "🇳🇬",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  Canada: "🇨🇦",
  Germany: "🇩🇪",
  France: "🇫🇷",
};

function formatSince(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function monthsAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.max(1, Math.round((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 30)));
}

function DoctorCard({ doc }: { doc: typeof CARE_TEAM[0] }) {
  const { navigate, addToast } = useApp();
  const [expanded, setExpanded] = useState(false);
  const isPersonal = doc.role === "Personal Doctor";
  const months = monthsAgo(doc.since);

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: C.border, backgroundColor: "white" }}
    >
      {/* Top banner */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: isPersonal ? C.amber : C.navy }}
      />

      <div className="p-5 flex flex-col gap-4">
        {/* Doctor header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar src={doc.photo} name={doc.name} size={64} />
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
              style={{
                backgroundColor:
                  doc.availability === "online" ? C.green : "#9CA3AF",
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="text-base font-bold"
                style={{ fontFamily: "var(--font-display)", color: C.navy }}
              >
                {doc.name}
              </h3>
              <Badge variant={isPersonal ? "amber" : "navy"}>
                {doc.role}
              </Badge>
            </div>
            <p className="text-sm mt-0.5" style={{ color: C.muted }}>
              {doc.specialty} · {COUNTRY_FLAGS[doc.country] ?? "🌍"} {doc.country}
            </p>
            <AvailabilityDot status={doc.availability} />
          </div>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-2 gap-3 rounded-xl p-3"
          style={{ backgroundColor: C.warm }}
        >
          <div>
            <p className="text-xs" style={{ color: C.muted }}>Care since</p>
            <p className="text-sm font-semibold" style={{ color: C.navy }}>
              {formatSince(doc.since)}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: C.muted }}>Consultations</p>
            <p className="text-sm font-semibold" style={{ color: C.navy }}>
              {doc.consultations}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => addToast("info", "Opening message...")}
          >
            Message
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("doctor-profile")}
          >
            View profile
          </Button>
        </div>

        {/* Expandable care details */}
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="text-sm font-semibold" style={{ color: C.navy }}>
            Your care with {doc.name.split(" ").slice(1).join(" ")}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.muted}
            strokeWidth="2"
            strokeLinecap="round"
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {expanded && (
          <div
            className="rounded-xl p-4 flex flex-col gap-2 border"
            style={{ backgroundColor: C.warm, borderColor: C.border }}
          >
            <Row label="Duration" value={`${months} month${months !== 1 ? "s" : ""}`} />
            <Row label="Consultations" value={String(doc.consultations)} />
            <Row label="Care since" value={formatSince(doc.since)} />
            <Row label="Role" value={doc.role} />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: C.muted }}>{label}</span>
      <span className="text-xs font-semibold" style={{ color: C.navy }}>{value}</span>
    </div>
  );
}

export default function CareTeam() {
  const { addToast } = useApp();
  const primaryDoc = CARE_TEAM.find((d) => d.role === "Personal Doctor")!;
  const totalConsultations = CARE_TEAM.reduce((s, d) => s + d.consultations, 0);
  const months = monthsAgo(primaryDoc.since);

  return (
    <AppShell role="patient" topBarTitle="Your Care Team" showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Page header */}
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: C.navy }}
          >
            Your Care Team
          </h1>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            Your coordinated care, in one place.
          </p>
        </div>

        {/* Relationship insight card */}
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ backgroundColor: C.navy }}
        >
          <Avatar src={primaryDoc.photo} name={primaryDoc.name} size={48} />
          <div>
            <p className="text-xs text-white/60">Relationship summary</p>
            <p className="text-sm font-semibold text-white mt-0.5">
              {months} months with {primaryDoc.name}
            </p>
            <p className="text-xs text-white/70">· {totalConsultations} consultations total</p>
          </div>
        </div>

        {/* Doctor cards */}
        {CARE_TEAM.map((doc) => (
          <DoctorCard key={doc.id} doc={doc} />
        ))}

        {/* Care Fit section */}
        <div>
          <SectionHeader title="Care Fit" subtitle="Why Dr. Amara Osei is right for you" />
          <div
            className="rounded-2xl p-5 border mt-3 flex flex-col gap-3"
            style={{ borderColor: C.border, backgroundColor: "white" }}
          >
            {[
              "Treats your conditions (Diabetes, Hypertension)",
              "Speaks your language (English)",
              "Available in Nigeria",
              "Docura Care subscribed",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span
                  className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: C.greenLight }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="text-sm" style={{ color: C.label }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add specialist — coming soon */}
        <button
          disabled
          className="rounded-2xl border-2 border-dashed p-5 flex items-center justify-between opacity-50"
          style={{ borderColor: C.border }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: C.amberLight }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold" style={{ color: C.navy }}>Add a specialist</p>
              <p className="text-xs" style={{ color: C.muted }}>Expand your care team</p>
            </div>
          </div>
          <Badge variant="gray">Coming soon</Badge>
        </button>
      </div>
    </AppShell>
  );
}
