import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Button, Card, StepIndicator } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { DOCTORS, PATIENT } from "@/data/mock";

const COUNTRIES = ["United Kingdom", "United States", "Canada", "Germany", "France", "South Africa", "Ghana", "Kenya"];
type TravelState = "idle" | "setup" | "active";

export default function TravelMode() {
  const { navigate } = useApp();
  const [state, setState] = useState<TravelState>("active");
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState("United Kingdom");
  const [departure, setDeparture] = useState("2025-09-10");
  const [returnDate, setReturnDate] = useState("2025-10-05");
  const personalDoc = DOCTORS.find((d) => d.id === PATIENT.personalDoctorId)!;
  const prescribingDoc = DOCTORS.find((d) => d.id === PATIENT.prescribingDoctorId)!;
  const STEPS = ["Destination", "Travel dates", "Confirm"];

  const readyItems = [
    { label: "Personal Doctor", value: personalDoc.name },
    { label: "Prescribing Doctor", value: `${prescribingDoc.name} · ${prescribingDoc.country}` },
    { label: "Active medications", value: "2 medications listed" },
    { label: "Medical Documents", value: "Ready to share" },
    { label: "Emergency card", value: "Ready" },
  ];

  if (state === "idle") return (
    <AppShell role="patient" topBarTitle="Travel Mode" showTopBarBack>
      <div className="px-4 py-10 flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl" style={{ backgroundColor: C.amberLight }}>✈️</div>
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Travel Mode</h2>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: C.muted }}>Tell Docura when you travel so your care stays connected — your personal doctor, local prescribing support, and medical documents ready wherever you go.</p>
        </div>
        <div className="w-full rounded-2xl p-5 text-left" style={{ backgroundColor: C.warm, border: `1px solid ${C.border}` }}>
          <p className="text-sm font-semibold mb-3" style={{ color: C.navy }}>When you activate travel mode, Docura prepares:</p>
          {["Your Personal Doctor stays connected", "Local prescribing doctor support", "Active medications listed", "Medical Documents ready", "Emergency card available"].map((item) => (
            <div key={item} className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: C.amberLight }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p className="text-sm" style={{ color: C.navy }}>{item}</p>
            </div>
          ))}
        </div>
        <p className="text-xs" style={{ color: C.muted }}>Docura connects you to verified doctors. Coverage may vary by country.</p>
        <Button fullWidth onClick={() => { setState("setup"); setStep(0); }}>{"I'm travelling"}</Button>
      </div>
    </AppShell>
  );

  if (state === "setup") return (
    <AppShell role="patient" topBarTitle="Travel Mode" showTopBarBack>
      <div className="px-4 py-6 flex flex-col gap-6">
        <StepIndicator current={step + 1} total={STEPS.length} />
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Where are you travelling?</h2>
              <p className="text-sm" style={{ color: C.muted }}>Select your destination country.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <button key={c} onClick={() => setDestination(c)} className="px-4 py-2 rounded-full text-sm font-medium border transition-all" style={{ backgroundColor: destination === c ? C.amber : "white", color: destination === c ? "white" : C.navy, borderColor: destination === c ? C.amber : C.border }}>
                  {c}
                </button>
              ))}
            </div>
            <Button fullWidth onClick={() => setStep(1)}>Continue</Button>
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Travel dates</h2>
              <p className="text-sm" style={{ color: C.muted }}>When are you departing and returning?</p>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: C.label }}>Departure date</label>
                <input type="date" value={departure} onChange={(e) => setDeparture(e.target.value)} className="w-full rounded-xl border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: C.label }}>Return date</label>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full rounded-xl border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={() => setStep(0)}>Back</Button>
              <Button fullWidth onClick={() => setStep(2)}>Continue</Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Confirm your travel</h2>
              <p className="text-sm" style={{ color: C.muted }}>Docura will prepare your travel care.</p>
            </div>
            <Card>
              <div className="text-center mb-4">
                <p className="text-3xl mb-2">✈️</p>
                <p className="text-xl font-bold" style={{ color: C.navy }}>{destination}</p>
                <p className="text-sm" style={{ color: C.muted }}>{departure} – {returnDate}</p>
              </div>
              <div className="border-t pt-4" style={{ borderColor: C.border }}>
                <p className="text-sm font-semibold mb-3" style={{ color: C.navy }}>Docura will prepare:</p>
                {[`${personalDoc.name} stays connected`, `Prescribing support in ${destination}`, "2 active medications", "Medical Documents ready", "Emergency card activated"].map((item) => (
                  <div key={item} className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: C.amberLight }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <p className="text-sm" style={{ color: C.navy }}>{item}</p>
                  </div>
                ))}
              </div>
            </Card>
            <p className="text-xs text-center" style={{ color: C.muted }}>Coverage and prescription support may vary by country.</p>
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={() => setStep(1)}>Back</Button>
              <Button fullWidth onClick={() => setState("active")}>Confirm travel</Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );

  return (
    <AppShell role="patient" topBarTitle="Travel Mode" showTopBarBack>
      <div className="px-4 py-6 flex flex-col gap-5">
        <div className="rounded-2xl p-5" style={{ backgroundColor: C.navy }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
            <p className="text-xs font-semibold uppercase tracking-wider text-white opacity-70">Travel Mode Active</p>
          </div>
          <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>Travelling to {destination}</p>
          <p className="text-sm text-white opacity-60">Sep 10 – Oct 5, 2025</p>
        </div>
        <Card>
          <p className="font-semibold mb-4" style={{ color: C.navy }}>Your travel care is ready</p>
          {readyItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: C.border }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: C.greenLight }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: C.navy }}>{item.label}</p>
                <p className="text-xs" style={{ color: C.muted }}>{item.value}</p>
              </div>
            </div>
          ))}
        </Card>
        <div className="flex gap-3">
          <Button fullWidth variant="outline" onClick={() => navigate("medical-documents")}>View Medical Documents</Button>
          <Button fullWidth variant="ghost" onClick={() => navigate("emergency-card")}>Emergency Card</Button>
        </div>
        <button onClick={() => setState("idle")} className="text-sm text-center py-2" style={{ color: C.muted }}>End travel mode</button>
      </div>
    </AppShell>
  );
}
