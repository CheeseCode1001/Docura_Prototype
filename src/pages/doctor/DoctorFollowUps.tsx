import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Card, Button, Badge, Avatar, Modal, Tabs, EmptyState, SectionHeader } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { DOCTOR_FOLLOW_UPS, DOCTOR_PATIENTS } from "@/data/mock";

const TABS = ["Upcoming", "Missed", "Completed"];

const COMPLETED_MOCK = [
  { id: "cfu1", patient: "Chidinma Eze", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", reason: "Monthly check-in", date: "2025-08-10", status: "completed" as const, urgent: false },
];

const DURATIONS = ["3 days", "1 week", "2 weeks", "1 month", "Custom"];

export default function DoctorFollowUps() {
  const { addToast, navigate, domain, scheduleFollowUp, completeFollowUp } = useApp();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedPatient, setSchedPatient] = useState("");
  const [schedReason, setSchedReason] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [schedDuration, setSchedDuration] = useState("1 week");

  // Follow-ups created anywhere in the app (consultation room, care plan, this
  // page) land in shared state, so every view agrees on the queue.
  const live = domain.followUps.map((item) => ({
    id: item.id,
    patient: DOCTOR_PATIENTS.find((patient) => patient.id === "p1")?.name || "Adaeze Okafor",
    photo: item.doctorPhoto,
    reason: item.reason,
    date: item.scheduledDate,
    status: item.status,
    urgent: item.status === "missed",
  }));
  const all = [...live, ...DOCTOR_FOLLOW_UPS.filter((seed) => !live.some((item) => item.reason === seed.reason))];
  const upcoming = all.filter((f) => f.status === "upcoming");
  const missed = all.filter((f) => f.status === "missed");
  const completed = [...all.filter((f) => f.status === "completed"), ...COMPLETED_MOCK];

  function getList() {
    if (activeTab === "Upcoming") return upcoming;
    if (activeTab === "Missed") return missed;
    return completed;
  }

  function schedule() {
    if (!schedPatient || !schedDate) {
      addToast("error", "Please fill in all required fields");
      return;
    }
    scheduleFollowUp({
      doctorId: "d1",
      doctorName: "Dr. Amara Osei",
      doctorPhoto: DOCTOR_PATIENTS.find((patient) => patient.name === schedPatient)?.photo || "",
      reason: schedReason || `Review in ${schedDuration}`,
      scheduledDate: schedDate,
    });
    addToast("success", "Follow-up scheduled and the patient notified");
    setShowSchedule(false);
    setSchedPatient("");
    setSchedReason("");
    setSchedDate("");
    setSchedDuration("1 week");
  }

  const list = getList();

  return (
    <AppShell role="doctor">
      <div className="px-4 py-8 space-y-6">
        <SectionHeader
          title="Follow-ups"
          action="Schedule follow-up"
          onAction={() => setShowSchedule(true)}
        />

        {/* Summary */}
        <div className="flex gap-4 flex-wrap">
          <div className="text-sm" style={{ fontFamily: "var(--font-body)" }}>
            <span className="font-bold" style={{ color: C.navy }}>{upcoming.length}</span>
            <span style={{ color: C.muted }}> upcoming</span>
          </div>
          <div className="text-sm" style={{ fontFamily: "var(--font-body)" }}>
            <span className="font-bold" style={{ color: C.coral }}>{missed.length}</span>
            <span style={{ color: C.muted }}> missed</span>
          </div>
          <div className="text-sm" style={{ fontFamily: "var(--font-body)" }}>
            <span className="font-bold" style={{ color: C.green }}>{COMPLETED_MOCK.length}</span>
            <span style={{ color: C.muted }}> completed this month</span>
          </div>
        </div>

        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {list.length === 0 ? (
          <EmptyState
            icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>}
            title={"No " + activeTab.toLowerCase() + " follow-ups"}
            body="All clear for now."
          />
        ) : (
          <div className="space-y-3">
            {list.map((fu) => (
              <Card key={fu.id}>
                <div className="flex items-center gap-4">
                  <Avatar src={fu.photo} name={fu.patient} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>{fu.patient}</p>
                      {fu.urgent && <Badge variant="red">Urgent</Badge>}
                      {fu.status === "missed" && (
                        <span className="text-xs font-semibold" style={{ color: C.coral }}>Missed</span>
                      )}
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: C.muted }}>{fu.reason}</p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>{fu.date}</p>
                  </div>
                  {fu.status === "upcoming" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => navigate("consultation-room", { doctorId: "d1" })}>
                        Start consultation
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { completeFollowUp(fu.id); addToast("success", `Follow-up for ${fu.patient} marked complete.`); }}>
                        Complete
                      </Button>
                    </div>
                  )}
                  {fu.status === "missed" && (
                    <Button size="sm" variant="outline" onClick={() => addToast("info", "Rescheduling follow-up for " + fu.patient)}>
                      Reschedule
                    </Button>
                  )}
                  {fu.status === "completed" && (
                    <Badge variant="green">Completed</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Schedule Modal */}
        <Modal open={showSchedule} onClose={() => setShowSchedule(false)} title="Schedule Follow-up">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.label, fontFamily: "var(--font-body)" }}>Patient</label>
              <select
                value={schedPatient}
                onChange={(e) => setSchedPatient(e.target.value)}
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
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.label, fontFamily: "var(--font-body)" }}>Reason</label>
              <input
                type="text"
                value={schedReason}
                onChange={(e) => setSchedReason(e.target.value)}
                placeholder="Reason for follow-up"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                style={{ borderColor: C.border, color: C.navy, fontFamily: "var(--font-body)" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.label, fontFamily: "var(--font-body)" }}>Date</label>
              <input
                type="date"
                value={schedDate}
                onChange={(e) => setSchedDate(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                style={{ borderColor: C.border, color: C.navy, fontFamily: "var(--font-body)" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: C.label, fontFamily: "var(--font-body)" }}>Duration</label>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSchedDuration(d)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
                    style={{
                      borderColor: schedDuration === d ? C.amber : C.border,
                      backgroundColor: schedDuration === d ? C.amberLight : "white",
                      color: schedDuration === d ? C.amber : C.navy,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <Button fullWidth onClick={schedule}>Schedule</Button>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
