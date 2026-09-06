import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { Button, Card, Avatar, VerifiedBadge, Badge, C, AlertBanner } from "@/components/ui";
import { DOCTORS } from "@/data/mock";

type Step = "choose" | "payment" | "processing" | "success";

function ChooseStep({ doctorId, onNext }: { doctorId: string; onNext: () => void }) {
  const doc = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="px-4 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Choose your care</h1>
        <p className="text-sm" style={{ color: C.muted }}>You're about to start a monthly care relationship with this doctor.</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <Avatar src={doc.photo} name={doc.name} size={56} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold" style={{ color: C.navy }}>{doc.name}</p>
              <VerifiedBadge />
            </div>
            <p className="text-sm" style={{ color: C.muted }}>{doc.specialty} · {doc.country}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold" style={{ color: C.navy }}>Monthly price</p>
          <p className="text-2xl font-bold" style={{ color: C.amber }}>{doc.currency}{doc.monthlyPrice.toLocaleString()}<span className="text-sm font-normal" style={{ color: C.muted }}>/mo</span></p>
        </div>
        <p className="text-xs mb-4" style={{ color: C.muted }}>Your doctor sets their monthly price. If they increase it later, your existing rate is protected.</p>
        <div className="flex flex-col gap-2">
          {["Ongoing relationship with your doctor", "Unlimited messaging", "Consultations included", "Prescriptions when needed", "Health record maintained", "Cross-border care support"].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm" style={{ color: C.navy }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              {f}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.navy }}>About this subscription</h3>
        {[
          { label: "Billing", value: "Monthly, billed on the same date" },
          { label: "Cancel", value: "Cancel anytime from your settings" },
          { label: "Start date", value: "Today — care begins immediately" },
        ].map((row) => (
          <div key={row.label} className="flex justify-between py-2.5 border-b last:border-0 text-sm" style={{ borderColor: C.border }}>
            <span style={{ color: C.muted }}>{row.label}</span>
            <span style={{ color: C.navy }}>{row.value}</span>
          </div>
        ))}
      </Card>

      <button type="button" onClick={() => setShowDetails((visible) => !visible)} className="text-xs text-center" style={{ color: C.muted }}>
        What happens after I subscribe? <span style={{ color: C.amber }}>{showDetails ? "Hide details" : "Learn more"}</span>
      </button>
      {showDetails && (
        <div className="rounded-xl p-4 text-xs leading-relaxed" style={{ backgroundColor: "#EAF4F1", color: C.navy }}>
          Your care relationship starts after the simulated payment succeeds. You can then message your doctor, view your care plan, and manage follow-ups from your Docura workspace.
        </div>
      )}
      <Button fullWidth size="lg" onClick={onNext}>Continue to payment</Button>
    </div>
  );
}

function PaymentStep({ doctorId, onPay }: { doctorId: string; onPay: () => void }) {
  const doc = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
  const [phone, setPhone] = useState("+234 803 456 7890");
  const [country, setCountry] = useState("Nigeria");
  const [loading, setLoading] = useState(false);
  const handlePay = () => { setLoading(true); setTimeout(() => { setLoading(false); onPay(); }, 2500); };
  return (
    <div className="px-4 py-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Payment details</h2>

      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.navy }}>Your details</h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: C.label }}>Phone number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: C.label }}>Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }}>
              <option>Nigeria</option>
              <option>United Kingdom</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: C.navy }}>Payment method</h3>
        <div className="flex flex-col gap-2">
          {["🇳🇬 Paystack (Nigeria)", "💳 Debit card"].map((m, i) => (
            <label key={m} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer" style={{ borderColor: i === 0 ? C.amber : C.border, backgroundColor: i === 0 ? C.amberLight : "white" }}>
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: i === 0 ? C.amber : C.border }}>
                {i === 0 && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.amber }} />}
              </div>
              <span className="text-sm" style={{ color: C.navy }}>{m}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex justify-between text-sm mb-2"><span style={{ color: C.muted }}>Monthly subscription</span><span style={{ color: C.navy }}>{doc.currency}{doc.monthlyPrice.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm mb-2"><span style={{ color: C.muted }}>First charge</span><span style={{ color: C.navy }}>Today</span></div>
        <div className="border-t pt-2 flex justify-between font-bold" style={{ borderColor: C.border }}><span style={{ color: C.navy }}>Total today</span><span style={{ color: C.amber }}>{doc.currency}{doc.monthlyPrice.toLocaleString()}</span></div>
      </Card>

      <Button fullWidth size="lg" loading={loading} onClick={handlePay}>Subscribe — {doc.currency}{doc.monthlyPrice.toLocaleString()}/month</Button>
      <p className="text-xs text-center" style={{ color: C.muted }}>🔒 Payment secured · Cancel anytime</p>
    </div>
  );
}

function SuccessStep({ doctorId, onDone }: { doctorId: string; onDone: () => void }) {
  const doc = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
  return (
    <div className="px-4 py-16 flex flex-col items-center text-center gap-6">
      <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: C.amberLight }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>You're now connected with {doc.name}.</h2>
        <p className="text-sm" style={{ color: C.muted }}>Your care is active. You can message your doctor and receive ongoing care starting now.</p>
      </div>
      <div className="rounded-2xl p-5 border w-full text-left" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-3">
          <Avatar src={doc.photo} name={doc.name} size={48} />
          <div>
            <p className="font-bold" style={{ color: C.navy }}>{doc.name}</p>
            <p className="text-sm" style={{ color: C.muted }}>Your personal doctor</p>
            <Badge variant="green">Care active</Badge>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Button fullWidth onClick={onDone}>Message your doctor</Button>
        <Button fullWidth variant="ghost" onClick={onDone}>Go to dashboard</Button>
      </div>
    </div>
  );
}

export default function DocuraCare() {
  const { params, navigate } = useApp();
  const doctorId = params.doctorId || "d1";
  const [step, setStep] = useState<Step>("choose");

  return (
    <AppShell role="patient" topBarTitle="Docura Care" showTopBarBack>
      {step === "choose" && <ChooseStep doctorId={doctorId} onNext={() => setStep("payment")} />}
      {step === "payment" && <PaymentStep doctorId={doctorId} onPay={() => setStep("success")} />}
      {step === "success" && <SuccessStep doctorId={doctorId} onDone={() => navigate("patient-chat")} />}
    </AppShell>
  );
}
