import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Avatar, Button } from "@/components/ui";
import { DOCTOR_PATIENTS } from "@/data/mock";

const INIT_MESSAGES = [
  { id: 1, from: "patient", text: "Good morning Doctor, I have been experiencing some chest tightness since yesterday.", time: "9:02 AM" },
  { id: 2, from: "doctor", text: "Good morning Adaeze. How severe is the tightness on a scale of 1-10? Any shortness of breath?", time: "9:05 AM" },
  { id: 3, from: "patient", text: "About a 4. No shortness of breath, but it feels like pressure after meals.", time: "9:08 AM" },
];

export default function DoctorChat() {
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState("");
  const patient = DOCTOR_PATIENTS[0];

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), from: "doctor", text: input.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
  };

  return (
    <AppShell role="doctor" topBarTitle={patient.name} showTopBarBack>
      <div className="flex flex-col h-full">
        {/* Patient header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: C.border, backgroundColor: "white" }}>
          <Avatar src={patient.photo} name={patient.name} size={40} />
          <div>
            <p className="font-semibold text-sm" style={{ color: C.navy }}>{patient.name}</p>
            <p className="text-xs" style={{ color: "#16a34a" }}>Online now</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.92v1z" /></svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.89L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ backgroundColor: "#F9F9F7" }}>
          <p className="text-center text-xs font-medium py-1" style={{ color: C.muted }}>Today</p>
          {messages.map((m) => {
            const isMe = m.from === "doctor";
            return (
              <div key={m.id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                {!isMe && <Avatar src={patient.photo} name={patient.name} size={28} />}
                <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 text-sm leading-relaxed ${isMe ? "rounded-br-sm" : "rounded-bl-sm"}`}
                  style={{ backgroundColor: isMe ? C.amber : "white", color: isMe ? "white" : C.navy, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  {m.text}
                  <p className="text-xs mt-1 opacity-70 text-right">{m.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 px-4 py-2 border-t overflow-x-auto" style={{ borderColor: C.border }}>
          {["Write note", "Issue prescription", "View health record"].map((a) => (
            <button key={a} className="whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full border" style={{ borderColor: C.border, color: C.navy }}>
              {a}
            </button>
          ))}
        </div>

        {/* Composer */}
        <div className="flex items-center gap-3 px-4 py-3 border-t bg-white" style={{ borderColor: C.border }}>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
          </button>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message..." className="flex-1 text-sm outline-none bg-transparent" style={{ color: C.navy }} />
          <button onClick={send} className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-85" style={{ backgroundColor: input.trim() ? C.amber : C.border }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
