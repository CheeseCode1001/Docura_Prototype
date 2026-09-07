import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Avatar, Badge, Button, C, EmptyState, Tabs } from "@/components/ui";
import { useApp } from "@/context/AppContext";

type FollowUp = ReturnType<typeof useApp>["domain"]["followUps"][number];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function UpcomingCard({ fu }: { fu: FollowUp }) {
  const { addToast } = useApp();
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-4"
      style={{ borderColor: C.border, backgroundColor: "white" }}
    >
      <div className="flex items-start gap-3">
        <Avatar src={fu.doctorPhoto} name={fu.doctorName} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold" style={{ color: C.navy }}>{fu.doctorName}</p>
            <Badge variant={fu.type === "care" ? "navy" : "amber"}>
              {fu.type === "care" ? "Care" : "Now"}
            </Badge>
          </div>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{fu.reason}</p>
        </div>
      </div>

      <div
        className="rounded-xl px-4 py-3"
        style={{ backgroundColor: C.amberLight }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.amber }}>Scheduled</p>
        <p className="text-sm font-bold mt-0.5" style={{ color: C.navy }}>{formatDate(fu.scheduledDate)}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => addToast("info", "Starting consultation...")}>
          Start consultation
        </Button>
        <button
          className="text-sm font-semibold"
          style={{ color: C.muted }}
          onClick={() => addToast("info", "Reschedule feature coming soon.")}
        >
          Reschedule
        </button>
      </div>
    </div>
  );
}

function CompletedCard({ fu }: { fu: FollowUp }) {
  const { addToast } = useApp();
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-4"
      style={{ borderColor: C.border, backgroundColor: "white" }}
    >
      <div className="flex items-start gap-3">
        <Avatar src={fu.doctorPhoto} name={fu.doctorName} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold" style={{ color: C.navy }}>{fu.doctorName}</p>
            <Badge variant="green">Completed</Badge>
          </div>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{fu.reason}</p>
        </div>
      </div>

      <p className="text-sm" style={{ color: C.muted }}>
        {formatDate(fu.scheduledDate)}
      </p>

      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: C.greenLight }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <button
          className="text-sm font-semibold"
          style={{ color: C.amber }}
          onClick={() => addToast("info", "Summary feature coming soon.")}
        >
          View summary
        </button>
      </div>
    </div>
  );
}

function MissedCard({ fu }: { fu: FollowUp }) {
  const { addToast } = useApp();
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-4"
      style={{ borderColor: "#FECACA", backgroundColor: "#FFF5F5" }}
    >
      <div className="flex items-start gap-3">
        <Avatar src={fu.doctorPhoto} name={fu.doctorName} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold" style={{ color: C.navy }}>{fu.doctorName}</p>
            <Badge variant="red">Missed</Badge>
          </div>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{fu.reason}</p>
        </div>
      </div>

      <div
        className="rounded-xl px-3 py-2 flex items-center gap-2"
        style={{ backgroundColor: C.amberLight }}
      >
        <span className="text-sm">⚠️</span>
        <p className="text-xs" style={{ color: C.amber }}>
          This follow-up was missed on {formatDate(fu.scheduledDate)}. Please rebook soon.
        </p>
      </div>

      <Button size="sm" onClick={() => addToast("info", "Booking follow-up...")}>
        Book again
      </Button>
    </div>
  );
}

const TABS = ["Upcoming", "Completed", "Missed"];

export default function FollowUps() {
  const { domain } = useApp();
  const [activeTab, setActiveTab] = useState("Upcoming");

  const filtered = domain.followUps.filter((fu) => {
    if (activeTab === "Upcoming") return fu.status === "upcoming";
    if (activeTab === "Completed") return fu.status === "completed";
    if (activeTab === "Missed") return fu.status === "missed";
    return false;
  });

  return (
    <AppShell role="patient" topBarTitle="Follow-ups" showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: C.navy }}
          >
            Follow-ups
          </h1>
        </div>

        {/* Info card */}
        <div
          className="rounded-2xl p-4 border"
          style={{ borderColor: "rgba(232,160,32,0.25)", backgroundColor: C.amberLight }}
        >
          <p className="text-sm" style={{ color: C.navy }}>
            Your doctor schedules follow-ups to make sure your care continues.
            Completing them helps keep your health on track.
          </p>
        </div>

        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {filtered.length === 0 ? (
          <EmptyState
            icon={<span className="text-3xl">📅</span>}
            title={`No ${activeTab.toLowerCase()} follow-ups`}
            body={
              activeTab === "Upcoming"
                ? "No upcoming follow-ups scheduled. Your doctor will schedule one after your next consultation."
                : activeTab === "Completed"
                ? "No completed follow-ups yet."
                : "No missed follow-ups. Great job staying on track!"
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((fu) =>
              fu.status === "upcoming" ? (
                <UpcomingCard key={fu.id} fu={fu} />
              ) : fu.status === "completed" ? (
                <CompletedCard key={fu.id} fu={fu} />
              ) : (
                <MissedCard key={fu.id} fu={fu} />
              )
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
