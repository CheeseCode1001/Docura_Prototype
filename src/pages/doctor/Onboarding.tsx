import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button, C, StepIndicator, DocuraLogo, Input, AlertBanner } from "@/components/ui";

const STEPS = ["Personal info", "Professional", "Licensing", "ID verification", "Selfie", "Profile", "Pricing"];

export default function DoctorOnboarding() {
  const { navigate } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("General Practice");
  const [years, setYears] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [license, setLicense] = useState("");
  const [bio, setBio] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const next = () => {
    if (step < 6) setStep((s) => s + 1);
    else {
      setLoading(true);
      setTimeout(() => { setLoading(false); navigate("doctor-verification"); }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.warm }}>
      <div className="p-6"><DocuraLogo size={32} showText /></div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <StepIndicator current={step} total={7} />
            <p className="text-sm mt-2" style={{ color: C.muted }}>Step {step + 1} of 7 — {STEPS[step]}</p>
          </div>

          {step === 0 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Tell us about yourself</h1>
              <Input label="Full name" placeholder="Dr. Amara Osei" value={name} onChange={setName} />
              <Input label="Email address" type="email" placeholder="amara@example.com" value="" onChange={() => {}} />
              <Input label="Phone number" type="tel" placeholder="+234 803 456 7890" value="" onChange={() => {}} />
              <Button fullWidth disabled={!name} onClick={next}>Continue</Button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Professional information</h1>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: C.label }}>Primary specialty</label>
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }}>
                  {["General Practice", "Women's Health", "Mental Wellbeing", "Dermatology", "Cardiology", "Paediatrics", "Obstetrics"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Input label="Years of experience" type="number" placeholder="9" value={years} onChange={setYears} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: C.label }}>Languages</label>
                <div className="flex flex-wrap gap-2">
                  {["English", "Yoruba", "Igbo", "Hausa", "French"].map((l) => (
                    <label key={l} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" defaultChecked={l === "English"} className="rounded" />
                      {l}
                    </label>
                  ))}
                </div>
              </div>
              <Button fullWidth onClick={next}>Continue</Button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Licensing</h1>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: C.label }}>Country of license</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }}>
                  <option>Nigeria</option>
                  <option>United Kingdom</option>
                </select>
              </div>
              <Input
                label={country === "Nigeria" ? "MDCN license number" : "GMC registration number"}
                placeholder={country === "Nigeria" ? "MDCN/YYYY/NNNN" : "GMC/NNNNNNN"}
                value={license}
                onChange={setLicense}
              />
              <AlertBanner type="info" title="We verify all licenses" body="Your license number will be checked with the relevant medical authority before your account is approved." />
              <Button fullWidth disabled={!license} onClick={next}>Continue</Button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Government ID</h1>
              <p className="text-sm" style={{ color: C.muted }}>Upload a valid government-issued ID for identity verification.</p>
              <div className="border-2 border-dashed rounded-2xl p-8 text-center" style={{ borderColor: C.border }}>
                <span className="text-4xl block mb-3">🪪</span>
                <p className="text-sm font-medium mb-1" style={{ color: C.navy }}>Upload ID document</p>
                <p className="text-xs" style={{ color: C.muted }}>National ID, Driver's License, or Passport</p>
                <button className="mt-4 px-4 py-2 rounded-full text-sm font-semibold border" style={{ borderColor: C.amber, color: C.amber }}>Choose file</button>
              </div>
              <Button fullWidth onClick={next}>Continue</Button>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Selfie verification</h1>
              <p className="text-sm" style={{ color: C.muted }}>Take a photo of yourself holding your ID to verify your identity.</p>
              <div className="border-2 border-dashed rounded-2xl p-8 text-center" style={{ borderColor: C.border }}>
                <span className="text-4xl block mb-3">🤳</span>
                <p className="text-sm font-medium mb-1" style={{ color: C.navy }}>Take a selfie</p>
                <p className="text-xs" style={{ color: C.muted }}>Hold your ID next to your face</p>
                <button className="mt-4 px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: C.amber, color: "white" }}>Open camera</button>
              </div>
              <Button fullWidth onClick={next}>Continue</Button>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Your profile</h1>
              <p className="text-sm" style={{ color: C.muted }}>This is how patients will see you. You can update it anytime.</p>
              <Input label="Professional bio" value={bio} onChange={setBio} multiline rows={5} placeholder="Tell patients about your experience, approach, and specialties..." />
              <Button fullWidth onClick={next}>Continue</Button>
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Set your pricing</h1>
              <p className="text-sm" style={{ color: C.muted }}>You control your own pricing. Minimum monthly care price is ₦10,000.</p>
              <Input label="Monthly care price (₦)" type="number" placeholder="15000" value={price} onChange={setPrice} />
              <Input label="Docura Now consultation price (₦)" type="number" placeholder="5000" value="" onChange={() => {}} />
              <AlertBanner type="info" title="Pricing is protected for existing subscribers" body="If you increase your price, existing subscribers keep their current rate." />
              <Button fullWidth loading={loading} onClick={next}>Submit for verification</Button>
            </div>
          )}

          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 mx-auto mt-6 text-sm" style={{ color: C.muted }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
