import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { Button, Card, Avatar, Badge, VerifiedBadge, StarRating, AvailabilityDot, Chip, C, Spinner, AlertBanner } from "@/components/ui";
import { DOCTORS } from "@/data/mock";

type Step = "symptoms" | "doctors" | "payment" | "processing" | "chat" | "complete";

const SYMPTOM_CHIPS = ["Fever", "Pain", "Cough", "Headache", "Stomach", "Skin", "Other"];

function SymptomsStep({ onNext }: { onNext: (s: string[]) => void }) {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (s: string) => setSelected((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  return (
    <div className="px-4 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>What can we help you with?</h1>
        <p className="text-sm" style={{ color: C.muted }}>Describe your symptoms and a doctor will help you today.</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: C.label }}>Tell us what's happening</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Describe your symptoms in your own words..."
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none resize-none"
          style={{ borderColor: C.border, fontFamily: "var(--font-body)" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = C.amber; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
        />
      </div>
      <div>
        <p className="text-sm font-medium mb-3" style={{ color: C.label }}>Or select a category</p>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_CHIPS.map((s) => <Chip key={s} label={s} selected={selected.includes(s)} onClick={() => toggle(s)} />)}
        </div>
      </div>
      <AlertBanner type="info" title="Medical safety notice" body="Docura is not for emergencies. If this is urgent or life-threatening, please call your local emergency services." />
      <Button fullWidth size="lg" disabled={!text && !selected.length} onClick={() => onNext(selected)}>Find a doctor</Button>
    </div>
  );
}

function DoctorsStep({ onSelect }: { onSelect: (id: string) => void }) {
  const online = DOCTORS.filter((d) => d.availability === "online");
  return (
    <div className="px-4 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Available doctors</h2>
        <p className="text-sm" style={{ color: C.muted }}>These doctors are online and can see you now.</p>
      </div>
      <div className="flex flex-col gap-4">
        {online.map((doc) => (
          <Card key={doc.id}>
            <div className="flex gap-4 items-start">
              <div className="relative">
                <Avatar src={doc.photo} name={doc.name} size={56} />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white" style={{ backgroundColor: "#16A34A" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-bold text-sm" style={{ color: C.navy }}>{doc.name}</p>
                  <VerifiedBadge />
                </div>
                <p className="text-xs mb-1" style={{ color: C.muted }}>{doc.specialty} · {doc.country}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <StarRating rating={doc.rating} count={doc.reviews} />
                  <AvailabilityDot status="online" />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
              <p className="font-bold" style={{ color: C.navy }}>{doc.currency}{doc.consultationPrice.toLocaleString()}</p>
              <Button size="sm" onClick={() => onSelect(doc.id)}>Choose doctor</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PaymentStep({ doctorId, onPay }: { doctorId: string; onPay: () => void }) {
  const doc = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
  const [loading, setLoading] = useState(false);
  const handlePay = () => { setLoading(true); setTimeout(() => { setLoading(false); onPay(); }, 2000); };
  return (
    <div className="px-4 py-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Complete payment</h2>
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Avatar src={doc.photo} name={doc.name} size={44} />
          <div>
            <p className="font-semibold text-sm" style={{ color: C.navy }}>{doc.name}</p>
            <p className="text-xs" style={{ color: C.muted }}>One-off consultation</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {[["Consultation fee", `${doc.currency}${doc.consultationPrice.toLocaleString()}`], ["Platform fee", `${doc.currency}0`], ["Total", `${doc.currency}${doc.consultationPrice.toLocaleString()}`]].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b last:border-0 last:font-bold" style={{ borderColor: C.border, color: C.navy }}>
              <span style={{ color: k === "Total" ? C.navy : C.muted }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <p className="text-sm font-semibold mb-3" style={{ color: C.navy }}>Payment method</p>
        <div className="flex flex-col gap-2">
          {["Paystack (Nigeria)", "Card ending ****4521"].map((m, i) => (
            <label key={m} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer" style={{ borderColor: i === 0 ? C.amber : C.border, backgroundColor: i === 0 ? C.amberLight : "white" }}>
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: i === 0 ? C.amber : C.border }}>
                {i === 0 && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.amber }} />}
              </div>
              <span className="text-sm" style={{ color: C.navy }}>{m}</span>
            </label>
          ))}
        </div>
      </Card>
      <Button fullWidth size="lg" loading={loading} onClick={handlePay}>Pay {doc.currency}{doc.consultationPrice.toLocaleString()}</Button>
      <p className="text-xs text-center" style={{ color: C.muted }}>🔒 Payment secured by Paystack</p>
    </div>
  );
}

function ConsultationChat({ doctorId, onComplete }: { doctorId: string; onComplete: () => void }) {
  const doc = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([
    { from: "doctor", text: `Hello! I'm ${doc.name}. I've reviewed your symptoms. Can you tell me more about when this started?`, time: "Now" },
  ]);

  const send = () => {
    if (!msg.trim()) return;
    setMsgs((p) => [...p, { from: "patient", text: msg, time: "Now" }]);
    setMsg("");
    setTimeout(() => {
      setMsgs((p) => [...p, { from: "doctor", text: "Thank you for sharing that. Based on what you've described, I'd like to ask a few more questions to better understand your condition.", time: "Now" }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="border-b px-4 py-3 flex items-center gap-3" style={{ borderColor: C.border, backgroundColor: "white" }}>
        <Avatar src={doc.photo} name={doc.name} size={36} />
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: C.navy }}>{doc.name}</p>
          <p className="text-xs" style={{ color: "#16A34A" }}>● Online now</p>
        </div>
        <Button size="sm" variant="outline" onClick={onComplete}>End consultation</Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ backgroundColor: C.warm }}>
        <div className="text-center py-2">
          <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: C.amberLight, color: C.amber }}>🔒 Secure medical consultation</span>
        </div>
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "patient" ? "justify-end" : "justify-start"} gap-2`}>
            {m.from === "doctor" && <Avatar src={doc.photo} name={doc.name} size={28} />}
            <div className="max-w-xs rounded-2xl px-4 py-3" style={{
              backgroundColor: m.from === "patient" ? C.amber : "white",
              color: m.from === "patient" ? "white" : C.navy,
              borderRadius: m.from === "patient" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            }}>
              <p className="text-sm">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t px-4 py-3 bg-white" style={{ borderColor: C.border }}>
        <div className="flex gap-2 items-end">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: C.warm, color: C.muted }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
          </button>
          <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..." className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ borderColor: C.border }} />
          <button onClick={send} className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: C.amber }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function CompleteStep({ doctorId, onContinueCare, onDone }: { doctorId: string; onContinueCare: () => void; onDone: () => void }) {
  const doc = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
  return (
    <div className="px-4 py-8 flex flex-col gap-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: C.amberLight }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Your consultation is complete.</h2>
        <p className="text-sm" style={{ color: C.muted }}>Thank you for using Docura Now.</p>
      </div>

      <Card>
        <h3 className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Consultation summary</h3>
        {[
          { label: "What you discussed", value: "Skin rash and discomfort on forearm" },
          { label: "Doctor's assessment", value: "Mild eczema flare — likely triggered by environmental factors" },
          { label: "Recommendations", value: "Apply hydrocortisone cream twice daily. Avoid harsh soaps and synthetic fabrics." },
          { label: "Prescription", value: "Hydrocortisone Cream 1% — issued" },
          { label: "Next steps", value: "Follow up in 2 weeks if symptoms persist" },
        ].map((s) => (
          <div key={s.label} className="py-3 border-b last:border-0" style={{ borderColor: C.border }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: C.muted }}>{s.label}</p>
            <p className="text-sm" style={{ color: C.navy }}>{s.value}</p>
          </div>
        ))}
      </Card>

      <div className="rounded-2xl p-5 border" style={{ borderColor: C.amber, backgroundColor: C.amberLight }}>
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={doc.photo} name={doc.name} size={40} />
          <div>
            <p className="text-sm font-semibold" style={{ color: C.navy }}>Would you like to continue care with {doc.name}?</p>
            <p className="text-xs" style={{ color: C.muted }}>Build an ongoing relationship for {doc.currency}{doc.monthlyPrice.toLocaleString()}/month</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button fullWidth size="sm" onClick={onContinueCare}>Continue with Docura Care</Button>
          <Button fullWidth size="sm" variant="ghost" onClick={onDone}>Not now</Button>
        </div>
      </div>
    </div>
  );
}

export default function DocuraNow() {
  const { navigate } = useApp();
  const [step, setStep] = useState<Step>("symptoms");
  const [doctorId, setDoctorId] = useState("d1");

  return (
    <AppShell role="patient" topBarTitle="Docura Now" showTopBarBack>
      {step === "symptoms" && <SymptomsStep onNext={() => setStep("doctors")} />}
      {step === "doctors" && <DoctorsStep onSelect={(id) => { setDoctorId(id); setStep("payment"); }} />}
      {step === "payment" && <PaymentStep doctorId={doctorId} onPay={() => setStep("chat")} />}
      {step === "chat" && <ConsultationChat doctorId={doctorId} onComplete={() => setStep("complete")} />}
      {step === "complete" && <CompleteStep doctorId={doctorId} onContinueCare={() => navigate("patient-care", { doctorId })} onDone={() => navigate("patient-dashboard")} />}
    </AppShell>
  );
}
