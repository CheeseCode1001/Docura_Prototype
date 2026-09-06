import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button, Chip, C, StepIndicator, DocuraLogo } from "@/components/ui";

const CONDITIONS = [
  "General health", "Mental wellbeing", "Women's health", "Men's health",
  "Child health", "Skin", "Digestive health", "Respiratory health",
  "Heart & blood pressure", "Other",
];

export default function PatientOnboarding() {
  const { navigate } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [lang, setLang] = useState("English");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (c: string) => setSelected((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);

  const finish = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.warm }}>
      <div className="p-6">
        <DocuraLogo size={32} showText />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          {step < 3 && (
            <div className="mb-8">
              <StepIndicator current={step} total={3} />
            </div>
          )}

          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Let's get to know you.</h1>
                <p className="text-sm" style={{ color: C.muted }}>This helps your doctor understand you better.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: C.label }}>Full name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Adaeze Okafor" className="rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }} onFocus={(e) => { e.currentTarget.style.borderColor = C.amber; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: C.label }}>Date of birth</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: C.label }}>Preferred language</label>
                  <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }}>
                    {["English", "Yoruba", "Igbo", "Hausa"].map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <Button fullWidth size="lg" disabled={!name || !dob} onClick={() => setStep(1)}>Continue</Button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>What would you like help with?</h1>
                <p className="text-sm" style={{ color: C.muted }}>Select all that apply. You can change this later.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((c) => <Chip key={c} label={c} selected={selected.includes(c)} onClick={() => toggle(c)} />)}
                <Chip label="Not sure yet" selected={selected.includes("Not sure yet")} onClick={() => toggle("Not sure yet")} />
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
                <Button fullWidth size="lg" onClick={finish} loading={loading}>Continue</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: C.amberLight }}>
                <span className="text-4xl">🎉</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Welcome to Docura, {name.split(" ")[0]}!</h1>
                <p className="text-sm" style={{ color: C.muted }}>Your account is ready. Find a doctor and start your healthcare journey.</p>
              </div>
              <Button fullWidth size="lg" onClick={() => navigate("patient-dashboard")}>Go to my dashboard</Button>
              <button onClick={() => navigate("find-doctor")} className="text-sm font-semibold" style={{ color: C.amber }}>Find a doctor now →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
