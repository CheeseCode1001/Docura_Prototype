import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Card, Button, Badge, Avatar, Modal, Tabs, EmptyState, SectionHeader } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { DOCTOR_FOLLOW_UPS, DOCTOR_PATIENTS } from "@/data/mock";

const TABS = ["Upcoming", "Missed", "Completed", "Monthly Check-ins"];

const COMPLETED_MOCK = [
  { id: "cfu1", patient: "Chidinma Eze", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", reason: "Monthly check-in", date: "2025-08-10", status: "completed" as const, urgent: false },
];

const TEMPLATES: Record<string, { title: string; text: string }> = {
  "diabetes-routine": {
    title: "Diabetes Monthly Review",
    text: "Hello! This is your monthly diabetes check-in from Dr. Amara Osei. How have your morning fasting blood sugars been this past week, and are you having any medication side effects?",
  },
  "hypertension-vitals": {
    title: "Hypertension Vitals Request",
    text: "Good day! Dr. Amara here for your monthly blood pressure review. Please share your two most recent home blood pressure readings and let us know if your Lisinopril supply is running low.",
  },
  "general-wellness": {
    title: "Chronic Care Routine Check",
    text: "Hi there! Just checking in on your general health and medication routine for this month. Please let me know how you are feeling or if any new symptoms have arisen.",
  },
};

export default function DoctorFollowUps() {
  const { addToast, navigate, domain, scheduleFollowUp, completeFollowUp, sendMonthlyCheckIn } = useApp();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedPatient, setSchedPatient] = useState("");
  const [schedReason, setSchedReason] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [schedDuration, setSchedDuration] = useState("1 week");

  // Check-in modal state
  const [selectedCheckIn, setSelectedCheckIn] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("diabetes-routine");
  const [checkInText, setCheckInText] = useState(TEMPLATES["diabetes-routine"].text);
  const [bulkModal, setBulkModal] = useState(false);

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
  const monthlyList = domain.monthlyCheckIns;

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

  function handleSendCheckIn() {
    if (!selectedCheckIn) return;
    sendMonthlyCheckIn(selectedCheckIn, checkInText);
    addToast("success", "Monthly check-in sent to patient!");
    setSelectedCheckIn(null);
  }

  function handleBulkSend() {
    const dueItems = monthlyList.filter((m) => m.status === "due" || m.status === "overdue");
    dueItems.forEach((m) => sendMonthlyCheckIn(m.id));
    addToast("success", `Bulk check-ins dispatched to ${dueItems.length} chronic care patients.`);
    setBulkModal(false);
  }

  return (
    <AppShell role="doctor" topBarTitle="Follow-ups & Check-ins">
      <div className="px-4 md:px-6 py-6 space-y-6" style={{ fontFamily: "var(--font-body)" }}>
        <SectionHeader
          title="Follow-ups & Check-ins"
          action="Schedule follow-up"
          onAction={() => setShowSchedule(true)}
        />

        {/* Summary Metric Pills */}
        <div className="flex gap-4 flex-wrap">
          <div className="text-sm">
            <span className="font-bold" style={{ color: C.navy }}>{upcoming.length}</span>
            <span style={{ color: C.muted }}> upcoming follow-ups</span>
          </div>
          <div className="text-sm">
            <span className="font-bold" style={{ color: C.coral }}>{missed.length}</span>
            <span style={{ color: C.muted }}> missed</span>
          </div>
          <div className="text-sm">
            <span className="font-bold" style={{ color: C.amber }}>
              {monthlyList.filter((m) => m.status === "due" || m.status === "overdue").length}
            </span>
            <span style={{ color: C.muted }}> monthly check-ins due</span>
          </div>
          <div className="text-sm">
            <span className="font-bold" style={{ color: C.green }}>{completed.length}</span>
            <span style={{ color: C.muted }}> completed this month</span>
          </div>
        </div>

        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {/* Monthly Check-ins Tab View */}
        {activeTab === "Monthly Check-ins" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/60 border" style={{ borderColor: C.amberLight }}>
              <div>
                <h3 className="font-bold text-sm" style={{ color: C.navy }}>Chronic Care Monthly Check-in Engine</h3>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                  Automated monthly schedule with structured templates, response tracking, and escalation triggers.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="primary" onClick={() => setBulkModal(true)}>
                  ⚡ Bulk Send to Due ({monthlyList.filter((m) => m.status === "due" || m.status === "overdue").length})
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {monthlyList.map((m) => (
                <Card key={m.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar src={m.patientPhoto} name={m.patientName} size={44} />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm" style={{ color: C.navy }}>{m.patientName}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                            backgroundColor: m.status === "overdue" ? C.redLight : m.status === "due" ? C.amberLight : C.greenLight,
                            color: m.status === "overdue" ? C.red : m.status === "due" ? C.amber : C.green,
                          }}>
                            {m.status === "overdue" ? "Overdue" : m.status === "due" ? "Due Now" : m.status === "pending" ? "Awaiting Reply" : "Responded"}
                          </span>
                          {m.status === "overdue" && (
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                              ⚠️ Escalated (No response &gt; 7d)
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-1 font-medium" style={{ color: C.label }}>{m.condition}</p>
                        <div className="flex flex-wrap gap-4 text-xs mt-1" style={{ color: C.muted }}>
                          <span>📅 Next due: <strong className="font-semibold text-slate-700">{m.nextDue}</strong></span>
                          <span>💬 Last response: {m.lastResponse}</span>
                          <span>🔁 Schedule: Monthly recurring</span>
                        </div>
                        {m.customNote && (
                          <p className="text-xs italic mt-1.5 text-slate-500">Note: {m.customNote}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setSelectedCheckIn(m.id);
                          setSelectedTemplate(m.templateKey || "diabetes-routine");
                          setCheckInText(TEMPLATES[m.templateKey]?.text || TEMPLATES["diabetes-routine"].text);
                        }}
                      >
                        Send Check-in
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("doctor-chat")}
                      >
                        View Chat
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Standard Follow-ups (Upcoming / Missed / Completed) */}
        {activeTab !== "Monthly Check-ins" && (
          <div>
            {(activeTab === "Upcoming" ? upcoming : activeTab === "Missed" ? missed : completed).length === 0 ? (
              <EmptyState
                icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>}
                title={"No " + activeTab.toLowerCase() + " follow-ups"}
                body="All clear for now."
              />
            ) : (
              <div className="space-y-3">
                {(activeTab === "Upcoming" ? upcoming : activeTab === "Missed" ? missed : completed).map((fu) => (
                  <Card key={fu.id} className="p-4">
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
          </div>
        )}

        {/* Schedule Modal */}
        <Modal open={showSchedule} onClose={() => setShowSchedule(false)} title="Schedule Follow-up">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.label }}>Patient</label>
              <select
                value={schedPatient}
                onChange={(e) => setSchedPatient(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                style={{ borderColor: C.border, color: C.navy }}
              >
                <option value="">Choose a patient...</option>
                {DOCTOR_PATIENTS.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.label }}>Reason</label>
              <input
                type="text"
                value={schedReason}
                onChange={(e) => setSchedReason(e.target.value)}
                placeholder="Reason for follow-up"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                style={{ borderColor: C.border, color: C.navy }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.label }}>Date</label>
              <input
                type="date"
                value={schedDate}
                onChange={(e) => setSchedDate(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                style={{ borderColor: C.border, color: C.navy }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.label }}>Timeframe duration</label>
              <select
                value={schedDuration}
                onChange={(e) => setSchedDuration(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                style={{ borderColor: C.border, color: C.navy }}
              >
                {["3 days", "1 week", "2 weeks", "1 month", "Custom"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <Button fullWidth onClick={schedule}>Confirm follow-up</Button>
          </div>
        </Modal>

        {/* Send Single Check-in Modal */}
        <Modal open={!!selectedCheckIn} onClose={() => setSelectedCheckIn(null)} title="Send Monthly Chronic Check-in">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: C.muted }}>
                Choose Check-in Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  setCheckInText(TEMPLATES[e.target.value]?.text || "");
                }}
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none bg-slate-50 font-medium"
                style={{ borderColor: C.border }}
              >
                {Object.entries(TEMPLATES).map(([key, item]) => (
                  <option key={key} value={key}>{item.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: C.muted }}>
                Message Text (Editable)
              </label>
              <textarea
                value={checkInText}
                onChange={(e) => setCheckInText(e.target.value)}
                rows={4}
                className="w-full rounded-xl border p-3 text-sm outline-none resize-none"
                style={{ borderColor: C.border }}
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border text-xs" style={{ borderColor: C.border, color: C.muted }}>
              💡 If the patient does not reply within 7 days, this check-in will be automatically marked as <strong>Escalated</strong> in your Patient Alerts.
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setSelectedCheckIn(null)}>Cancel</Button>
              <Button onClick={handleSendCheckIn}>Send Check-in</Button>
            </div>
          </div>
        </Modal>

        {/* Bulk Send Modal */}
        <Modal open={bulkModal} onClose={() => setBulkModal(false)} title="Send Bulk Monthly Check-ins">
          <div className="space-y-4">
            <p className="text-sm" style={{ color: C.muted }}>
              You are about to dispatch automated monthly check-ins to all patients with <strong>Due</strong> or <strong>Overdue</strong> status using their personalized chronic-care templates.
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium" style={{ color: C.navy }}>
              📋 2 patients selected: Adaeze Okafor (Diabetes), Emeka Nwosu (Hypertension).
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setBulkModal(false)}>Cancel</Button>
              <Button onClick={handleBulkSend}>Dispatch All Check-ins</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
