import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Avatar, Badge, Button } from "@/components/ui";
import { DOCTOR_PATIENTS } from "@/data/mock";
import { useApp } from "@/context/AppContext";

type ChannelType = "patient" | "patient-d2d" | "general-d2d";
type TriageFilter = "all" | "unread" | "action-needed";

interface ChatThread {
  id: string;
  type: ChannelType;
  title: string;
  subtitle: string;
  patientName?: string;
  patientPhoto?: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  actionNeeded?: boolean;
  priority?: "urgent" | "normal";
  statusBadge?: string;
  messages: Array<{
    id: string;
    from: "doctor" | "other" | "system";
    senderName: string;
    text: string;
    time: string;
    isD2DNote?: boolean;
    d2dMeta?: {
      targetDoctor?: string;
      specialty?: string;
    };
  }>;
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: "p1",
    type: "patient",
    title: "Adaeze Okonkwo",
    subtitle: "Docura Care · Hypertension & Wellness",
    patientName: "Adaeze Okonkwo",
    patientPhoto: DOCTOR_PATIENTS[0]?.photo,
    lastMessage: "Doctor, I logged my BP this morning (142/92). Should I take the extra dose?",
    time: "10:14 AM",
    unreadCount: 1,
    actionNeeded: true,
    priority: "urgent",
    statusBadge: "Action Needed",
    messages: [
      { id: "m1", from: "other", senderName: "Adaeze Okonkwo", text: "Good morning Doctor, I have been experiencing some mild morning headaches.", time: "9:02 AM" },
      { id: "m2", from: "doctor", senderName: "Dr. Oluwaseun Adeleke", text: "Good morning Adaeze. Please check your blood pressure with your cuff and log it here right away.", time: "9:05 AM" },
      { id: "m3", from: "other", senderName: "Adaeze Okonkwo", text: "Doctor, I logged my BP this morning (142/92). Should I take the extra dose?", time: "10:14 AM" },
    ],
  },
  {
    id: "p2",
    type: "patient",
    title: "Babatunde Lawal",
    subtitle: "Docura Care · Post-Op Cardiology",
    patientName: "Babatunde Lawal",
    patientPhoto: DOCTOR_PATIENTS[1]?.photo,
    lastMessage: "I picked up the Metformin refills today. Feeling steady.",
    time: "Yesterday",
    unreadCount: 0,
    actionNeeded: false,
    statusBadge: "Stable",
    messages: [
      { id: "m4", from: "other", senderName: "Babatunde Lawal", text: "Hi Doctor, checking in after the monthly plan adjustment.", time: "Yesterday, 3:15 PM" },
      { id: "m5", from: "doctor", senderName: "Dr. Oluwaseun Adeleke", text: "Glad to hear Babatunde! Remember your lipid panel test is scheduled for Tuesday.", time: "Yesterday, 3:20 PM" },
      { id: "m6", from: "other", senderName: "Babatunde Lawal", text: "I picked up the Metformin refills today. Feeling steady.", time: "Yesterday, 4:10 PM" },
    ],
  },
  {
    id: "p3",
    type: "patient",
    title: "Chidinma Eze",
    subtitle: "Docura Now · Acute Migraine",
    patientName: "Chidinma Eze",
    patientPhoto: DOCTOR_PATIENTS[2]?.photo,
    lastMessage: "Thank you Dr. Adeleke, the prescription arrived via pharmacy delivery.",
    time: "2 days ago",
    unreadCount: 0,
    actionNeeded: false,
    messages: [
      { id: "m7", from: "doctor", senderName: "Dr. Oluwaseun Adeleke", text: "Chidinma, how is the headache responding to the Sumatriptan?", time: "2 days ago, 11:00 AM" },
      { id: "m8", from: "other", senderName: "Chidinma Eze", text: "Thank you Dr. Adeleke, the prescription arrived via pharmacy delivery.", time: "2 days ago, 11:45 AM" },
    ],
  },
  // Patient-specific D2D Threads
  {
    id: "d2d-1",
    type: "patient-d2d",
    title: "Adaeze Okonkwo — Rx Review",
    subtitle: "Personal Doctor (UK) ↔ Dr. Emeka Okafor (Local Prescriber, NG)",
    patientName: "Adaeze Okonkwo",
    patientPhoto: DOCTOR_PATIENTS[0]?.photo,
    lastMessage: "Dr. Okafor: Approved Amlodipine 5mg. Requesting 2-week follow-up renal panel.",
    time: "11:30 AM",
    unreadCount: 1,
    actionNeeded: true,
    priority: "urgent",
    statusBadge: "Clinical Endorsement",
    messages: [
      {
        id: "d1",
        from: "doctor",
        senderName: "Dr. Oluwaseun Adeleke (Personal Doctor - UK)",
        text: "Dear Dr. Okafor: Recommending Amlodipine 5mg PO OD for Adaeze Okonkwo (MRN-9921) due to BP escalation (142/92 mmHg) despite Lisinopril 10mg. Patient has no allergy to CCBs. Kindly verify local stock and issue statutory prescription.",
        time: "10:30 AM",
        isD2DNote: true,
      },
      {
        id: "d2",
        from: "other",
        senderName: "Dr. Emeka Okafor (Prescribing Doctor - Lagos)",
        text: "Dr. Adeleke, reviewed Adaeze's file and cross-checked EMDEX. Lisinopril 10mg + Amlodipine 5mg combination is sound. Approved Amlodipine 5mg. Requesting 2-week follow-up renal panel.",
        time: "11:30 AM",
        isD2DNote: true,
      },
    ],
  },
  {
    id: "d2d-2",
    type: "patient-d2d",
    title: "Emeka Nwosu — Lab Consultation",
    subtitle: "Personal Doctor ↔ Dr. Fatima Al-Hassan (Endocrinology)",
    patientName: "Emeka Nwosu",
    patientPhoto: DOCTOR_PATIENTS[3]?.photo,
    lastMessage: "HbA1c of 8.4% warrants GLP-1 initiation or SGLT2i add-on.",
    time: "Sep 22",
    unreadCount: 0,
    actionNeeded: false,
    messages: [
      {
        id: "d3",
        from: "other",
        senderName: "Dr. Fatima Al-Hassan",
        text: "Colleague, reviewed Emeka's recent metabolic panel. HbA1c of 8.4% warrants GLP-1 initiation or SGLT2i add-on before our scheduled care review.",
        time: "Sep 22, 2:15 PM",
        isD2DNote: true,
      },
    ],
  },
  // General D2D Inbox
  {
    id: "gen-1",
    type: "general-d2d",
    title: "Docura Clinical Governance Circle",
    subtitle: "General Peer Forum · West Africa & UK Liaison",
    lastMessage: "Reminder: New EMDEX 2026 formulary updates for ACEi combinations live in prescribing workspace.",
    time: "Yesterday",
    unreadCount: 0,
    actionNeeded: false,
    messages: [
      {
        id: "g1",
        from: "system",
        senderName: "Docura Clinical Governance",
        text: "Reminder: New EMDEX 2026 formulary updates for ACEi combinations live in prescribing workspace. All cross-border clinical notes must document renal baseline.",
        time: "Yesterday, 8:00 AM",
      },
    ],
  },
];

export default function DoctorChat() {
  const { navigate, addToast } = useApp();
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeChannel, setActiveChannel] = useState<ChannelType>("patient");
  const [triageFilter, setTriageFilter] = useState<TriageFilter>("all");
  const [activeThreadId, setActiveThreadId] = useState<string>("p1");
  const [inputText, setInputText] = useState("");

  const filteredThreads = threads.filter((t) => {
    if (t.type !== activeChannel) return false;
    if (triageFilter === "unread") return t.unreadCount > 0;
    if (triageFilter === "action-needed") return t.actionNeeded;
    return true;
  });

  const activeThread = threads.find((t) => t.id === activeThreadId) || filteredThreads[0] || threads[0];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage = {
      id: `msg-${Date.now()}`,
      from: "doctor" as const,
      senderName: "Dr. Oluwaseun Adeleke",
      text: inputText.trim(),
      time: now,
      isD2DNote: activeChannel === "patient-d2d",
    };

    setThreads((prev) =>
      prev.map((th) => {
        if (th.id === activeThread.id) {
          return {
            ...th,
            lastMessage: inputText.trim(),
            time: "Just now",
            unreadCount: 0,
            messages: [...th.messages, newMessage],
          };
        }
        return th;
      })
    );
    setInputText("");
    addToast(activeChannel === "patient-d2d" ? "Clinical D2D message recorded in private audit log" : "Message sent to patient", "success");
  };

  const unreadTotal = threads.filter((t) => t.unreadCount > 0).length;
  const actionNeededTotal = threads.filter((t) => t.actionNeeded).length;

  return (
    <AppShell role="doctor" topBarTitle="Clinical Messages & D2D Triage">
      <div className="flex h-full flex-col lg:flex-row bg-white overflow-hidden">
        {/* Left Column: Triage Inbox & Channel Navigator */}
        <div className="w-full lg:w-96 border-r flex flex-col shrink-0" style={{ borderColor: C.border, backgroundColor: "#FAF9F6" }}>
          {/* Channel Switcher */}
          <div className="p-3 border-b bg-white" style={{ borderColor: C.border }}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">Message Channels</p>
            <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => {
                  setActiveChannel("patient");
                  const match = threads.find((t) => t.type === "patient");
                  if (match) setActiveThreadId(match.id);
                }}
                className={`py-2 px-1 rounded-lg text-center transition-all ${
                  activeChannel === "patient" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Patients
              </button>
              <button
                onClick={() => {
                  setActiveChannel("patient-d2d");
                  const match = threads.find((t) => t.type === "patient-d2d");
                  if (match) setActiveThreadId(match.id);
                }}
                className={`py-2 px-1 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  activeChannel === "patient-d2d" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <span>D2D Care</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              </button>
              <button
                onClick={() => {
                  setActiveChannel("general-d2d");
                  const match = threads.find((t) => t.type === "general-d2d");
                  if (match) setActiveThreadId(match.id);
                }}
                className={`py-2 px-1 rounded-lg text-center transition-all ${
                  activeChannel === "general-d2d" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
                }`}
              >
                D2D Forum
              </button>
            </div>
          </div>

          {/* Triage Filter Bar */}
          <div className="px-3 py-2 border-b bg-white flex items-center justify-between gap-1 text-xs" style={{ borderColor: C.border }}>
            <div className="flex gap-1">
              <button
                onClick={() => setTriageFilter("all")}
                className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                  triageFilter === "all" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTriageFilter("unread")}
                className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 ${
                  triageFilter === "unread" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Unread {unreadTotal > 0 && <span className="bg-red-500 text-white text-[10px] px-1 rounded-full">{unreadTotal}</span>}
              </button>
              <button
                onClick={() => setTriageFilter("action-needed")}
                className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 ${
                  triageFilter === "action-needed" ? "bg-amber-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Action Needed {actionNeededTotal > 0 && <span className="bg-amber-500 text-white text-[10px] px-1 rounded-full">{actionNeededTotal}</span>}
              </button>
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: C.border }}>
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs">
                No conversations in this triage filter.
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = thread.id === activeThread?.id;
                return (
                  <button
                    key={thread.id}
                    onClick={() => {
                      setActiveThreadId(thread.id);
                      if (thread.unreadCount > 0) {
                        setThreads((prev) => prev.map((t) => (t.id === thread.id ? { ...t, unreadCount: 0 } : t)));
                      }
                    }}
                    className={`w-full text-left p-3.5 transition-all flex items-start gap-3 relative ${
                      isSelected ? "bg-amber-50/80 border-l-4 border-l-amber-600" : "hover:bg-stone-50 bg-white"
                    }`}
                  >
                    {thread.patientPhoto ? (
                      <Avatar src={thread.patientPhoto} name={thread.title} size={42} />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-700 shrink-0 text-xs">
                        {thread.type === "patient-d2d" ? "D2D" : "GOV"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="font-semibold text-xs text-stone-900 truncate">{thread.title}</p>
                        <span className="text-[10px] text-stone-400 shrink-0">{thread.time}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate mb-1">{thread.subtitle}</p>
                      <p className="text-xs text-stone-600 truncate">{thread.lastMessage}</p>

                      <div className="flex items-center gap-1.5 mt-2">
                        {thread.actionNeeded && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                            Action Needed
                          </span>
                        )}
                        {thread.statusBadge && !thread.actionNeeded && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-700">
                            {thread.statusBadge}
                          </span>
                        )}
                        {thread.unreadCount > 0 && (
                          <span className="ml-auto bg-amber-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Canvas */}
        {activeThread ? (
          <div className="flex-1 flex flex-col h-full bg-stone-50">
            {/* Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-3">
                {activeThread.patientPhoto ? (
                  <Avatar src={activeThread.patientPhoto} name={activeThread.title} size={44} />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    {activeThread.type === "patient-d2d" ? "D2D" : "GRP"}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-sm text-stone-900">{activeThread.title}</h2>
                    {activeThread.type === "patient-d2d" && (
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        🔒 Confidential D2D Thread (Hidden from Patient)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500">{activeThread.subtitle}</p>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="flex items-center gap-2">
                {activeThread.type === "patient" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("doctor-consultations")}
                      className="text-xs"
                    >
                      Open Care Episode
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("doctor-labs")}
                      className="text-xs"
                    >
                      Order Labs
                    </Button>
                  </>
                )}
                {activeThread.type === "patient-d2d" && (
                  <Button
                    size="sm"
                    onClick={() => navigate("prescribing-workspace")}
                    className="bg-amber-600 text-white text-xs hover:bg-amber-700"
                  >
                    Open Prescribing Desk
                  </Button>
                )}
              </div>
            </div>

            {/* D2D Governance Disclaimer Banner if applicable */}
            {activeThread.type === "patient-d2d" && (
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-[11px] text-amber-900 flex items-center gap-2">
                <span className="font-bold">Clinical Governance Rule:</span> This conversation is encrypted and logged for medical audit. The patient does NOT have visibility into clinical disagreements or prescribing handoff logs.
              </div>
            )}

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-center my-2">
                <span className="text-[11px] font-semibold text-stone-400 bg-stone-200/60 px-3 py-1 rounded-full">
                  Today · High Security Encrypted Session
                </span>
              </div>

              {activeThread.messages.map((msg) => {
                const isMe = msg.from === "doctor";
                const isSys = msg.from === "system";

                if (isSys) {
                  return (
                    <div key={msg.id} className="p-3 bg-stone-200/50 rounded-xl text-center text-xs text-stone-600 border border-stone-300">
                      <p className="font-bold text-stone-800">{msg.senderName}</p>
                      <p className="mt-0.5">{msg.text}</p>
                      <span className="text-[10px] text-stone-400 mt-1 block">{msg.time}</span>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[11px] font-medium text-stone-500">{msg.senderName}</span>
                      <span className="text-[10px] text-stone-400">{msg.time}</span>
                    </div>
                    <div
                      className={`max-w-lg rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? "bg-amber-700 text-white rounded-br-sm"
                          : msg.isD2DNote
                          ? "bg-white border-2 border-purple-200 text-stone-900 rounded-bl-sm"
                          : "bg-white text-stone-900 rounded-bl-sm border border-stone-200"
                      }`}
                    >
                      {msg.isD2DNote && !isMe && (
                        <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <span>⚕️ Prescriber Clinical Response</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick response helpers */}
            {activeThread.type === "patient" && (
              <div className="px-4 py-2 bg-white border-t flex gap-2 overflow-x-auto text-xs" style={{ borderColor: C.border }}>
                <span className="text-stone-400 text-[11px] self-center shrink-0">Quick responses:</span>
                {[
                  "Please log your morning BP reading here.",
                  "Take the prescribed dosage with food and plenty of water.",
                  "I've initiated a lab order for your review.",
                  "If symptoms persist or pain increases, visit the nearest emergency room.",
                ].map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(qr)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] border border-stone-200 transition-colors"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input Composer */}
            <div className="p-3 bg-white border-t flex items-center gap-2" style={{ borderColor: C.border }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={
                  activeThread.type === "patient-d2d"
                    ? "Type a secure D2D clinical rationale / handoff note..."
                    : "Type your clinical message to the patient..."
                }
                className="flex-1 text-xs border rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-600 transition-colors"
                style={{ borderColor: C.border }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-xs"
              >
                Send
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-stone-400 text-sm">
            Select a conversation to begin.
          </div>
        )}
      </div>
    </AppShell>
  );
}
