import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout";
import { Avatar, VerifiedBadge, Badge, C } from "@/components/ui";
import { DOCTORS, MESSAGES, PATIENT } from "@/data/mock";

type Msg = { from: "patient" | "doctor"; text: string; time: string; status?: string; type?: string };

export default function PatientChat() {
  const doc = DOCTORS.find((d) => d.id === PATIENT.personalDoctorId)!;
  const [msgs, setMsgs] = useState<Msg[]>(
    MESSAGES.map((m) => ({ from: m.isDoctor ? "doctor" : "patient", text: m.text, time: m.time, status: m.status }))
  );
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs((p) => [...p, { from: "patient", text: input, time: "Now", status: "sent" }]);
    setInput("");
    setTimeout(() => {
      setMsgs((p) => [...p, { from: "doctor", text: "Evening exercise is generally fine with diabetes — in fact, it can help lower blood sugar. Just monitor your levels before and after, and have a small snack if needed.", time: "Now" }]);
    }, 2000);
  };

  return (
    <AppShell role="patient">
      <div className="flex flex-col h-[calc(100vh-56px-80px)] lg:h-[calc(100vh-56px)]">
        {/* Doctor header */}
        <div className="border-b px-4 py-3 flex items-center gap-3 bg-white shrink-0" style={{ borderColor: C.border }}>
          <div className="relative">
            <Avatar src={doc.photo} name={doc.name} size={40} />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: "#16A34A" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm truncate" style={{ color: C.navy }}>{doc.name}</p>
              <VerifiedBadge />
            </div>
            <p className="text-xs" style={{ color: "#16A34A" }}>● Online now</p>
          </div>
          <Badge variant="green">Care active</Badge>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ backgroundColor: C.warm }}>
          <div className="text-center my-2">
            <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: "white", color: C.muted, border: `1px solid ${C.border}` }}>Today, August 29</span>
          </div>

          {msgs.map((m, i) => (
            <div key={i} className={`flex items-end gap-2 ${m.from === "patient" ? "justify-end" : "justify-start"}`}>
              {m.from === "doctor" && <Avatar src={doc.photo} name={doc.name} size={28} />}
              <div className="max-w-[72%]">
                <div
                  className="px-4 py-3"
                  style={{
                    backgroundColor: m.from === "patient" ? C.amber : "white",
                    color: m.from === "patient" ? "white" : C.navy,
                    borderRadius: m.from === "patient" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  }}
                >
                  <p className="text-sm leading-relaxed">{m.text}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 ${m.from === "patient" ? "justify-end" : ""}`}>
                  <p className="text-xs" style={{ color: C.muted }}>{m.time}</p>
                  {m.from === "patient" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round">
                      {m.status === "read" ? <><polyline points="20 6 9 17 4 12" /><polyline points="20 6 9 17 4 12" style={{ transform: "translateX(-4px)" }} /></> : <polyline points="20 6 9 17 4 12" />}
                    </svg>
                  )}
                </div>
              </div>
              {m.from === "patient" && <Avatar name={PATIENT.name} size={28} />}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Medical notice */}
        <div className="px-4 py-2 bg-white border-t" style={{ borderColor: C.border }}>
          <p className="text-xs text-center" style={{ color: C.muted }}>🔒 This is a private medical conversation. Not for emergencies.</p>
        </div>

        {/* Composer */}
        <div className="px-4 py-3 bg-white border-t" style={{ borderColor: C.border }}>
          <div className="flex items-end gap-2">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 hover:bg-gray-100" style={{ color: C.muted }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 hover:bg-gray-100" style={{ color: C.muted }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
              </svg>
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message..."
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none"
              style={{ borderColor: C.border, fontFamily: "var(--font-body)" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = C.amber; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
            />
            <button
              onClick={send}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
              style={{ backgroundColor: input.trim() ? C.amber : "#E5E7EB" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? "white" : C.muted} strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
