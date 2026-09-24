import { useState, useId } from "react";
import { useApp } from "@/context/AppContext";
import { Button, C, DocuraLogo, Input, AlertBanner, Modal } from "@/components/ui";

const BANKS = [
  "Access Bank",
  "Guaranty Trust Bank (GTBank)",
  "Zenith Bank",
  "First Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Kuda Bank",
  "Standard Chartered Bank",
  "Barclays Bank UK",
  "HSBC UK",
  "Lloyds Bank",
];

const SPECIALTIES = [
  "General Practice",
  "Women's Health / Obstetrics & Gynaecology",
  "Mental Wellbeing / Psychiatry",
  "Dermatology",
  "Cardiology",
  "Paediatrics",
  "Internal Medicine",
  "Endocrinology",
];

const LANGUAGES = ["English", "Yoruba", "Igbo", "Hausa", "Pidgin", "French", "Spanish"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorOnboarding() {
  const { navigate, markOnboardingComplete } = useApp();

  // Part 1: Core Details
  const [name, setName] = useState("Dr. Chinedu Okafor");
  const [dob, setDob] = useState("1986-04-12");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("+234 803 123 4567");
  const [email, setEmail] = useState("dr.chinedu@docura.ng");
  const [country, setCountry] = useState("Nigeria");
  const [city, setCity] = useState("Lagos State");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English", "Igbo"]);

  // 1B Credentials
  const [licenceNum, setLicenceNum] = useState("MDCN/2016/5920");
  const [licensingBody, setLicensingBody] = useState("Medical and Dental Council of Nigeria (MDCN)");
  const [licenceCountry, setLicenceCountry] = useState("Nigeria");
  const [medicalSchool, setMedicalSchool] = useState("University of Ibadan College of Medicine");
  const [gradYear, setGradYear] = useState("2011");
  const [specialty, setSpecialty] = useState("General Practice");
  const [subspecialty, setSubspecialty] = useState("Preventive Cardiology & Metabolic Health");
  const [yearsExperience, setYearsExperience] = useState("13");
  const [currentHospital, setCurrentHospital] = useState("Lagos University Teaching Hospital (LUTH)");

  // 1C Documents Uploaded State
  const [uploadedDocs, setUploadedDocs] = useState({
    licence: true,
    degree: true,
    govId: true,
    residency: false,
    fellowship: true,
  });

  // Part 2: Practice
  const [photo, setPhoto] = useState("https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face");
  const [bio, setBio] = useState(
    "Compassionate General Practitioner with 13 years of clinical hospital and community experience. I specialize in preventive cardiology, long-term diabetes management, and comprehensive family care with dedicated, prompt response times."
  );
  const [monthlyPrice, setMonthlyPrice] = useState("18000");
  const [activeDays, setActiveDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [window1, setWindow1] = useState("08:00 - 12:00");
  const [window2, setWindow2] = useState("16:00 - 20:00");
  const [responseTime, setResponseTime] = useState("Usually replies within 2 hours");

  // Part 3: Payout Account
  const [bank, setBank] = useState("Guaranty Trust Bank (GTBank)");
  const [accountNumber, setAccountNumber] = useState("0123456789");
  const [verifiedAccountName, setVerifiedAccountName] = useState("DR. CHINEDU EZE OKAFOR");
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);

  // Part 4: Navigation / Step control (0 = 1A, 1 = 1B, 2 = 1C, 3 = 2A, 4 = 2B, 5 = 2C, 6 = 2D, 7 = 3A, 8 = 3B, 9 = Review, 10 = Post-submission)
  const [currentPart, setCurrentPart] = useState<1 | 2 | 3 | 4>(1);
  const [subStep, setSubStep] = useState<string>("1A");
  const [postSubmitStatus, setPostSubmitStatus] = useState<"pending" | "verified" | "live" | "correction">("pending");

  // Inline edit modal for Part 4
  const [inlineEditSection, setInlineEditSection] = useState<string | null>(null);

  // AI Bio Assistant helper
  function generateAiBio() {
    const generated = `I am ${name}, a ${specialty} specialist with ${yearsExperience} years of experience at ${currentHospital}. My clinical practice is dedicated to evidence-based care in ${subspecialty}. I communicate fluently in ${selectedLanguages.join(", ")} and commit to responsive, empathetic consultation.`;
    setBio(generated);
  }

  function handleBankVerify() {
    setIsVerifyingBank(true);
    setTimeout(() => {
      setIsVerifyingBank(false);
      setVerifiedAccountName(name.toUpperCase());
    }, 800);
  }

  // Earnings calculations
  const priceNum = parseInt(monthlyPrice, 10) || 0;
  const samplePatients = 25;
  const platformFee = 0.15; // 15% platform fee
  const grossMonthly = priceNum * samplePatients;
  const netEarnings = grossMonthly * (1 - platformFee);

  const wordCount = bio.trim() ? bio.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.warm, fontFamily: "var(--font-body)" }}>
      {/* Top Bar */}
      <header className="px-6 py-4 border-b bg-white flex items-center justify-between" style={{ borderColor: C.border }}>
        <DocuraLogo size={34} showText />
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">Clinician Onboarding</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
            <span>Part {currentPart} of 4</span>
            <span className="opacity-40">·</span>
            <span>{subStep}</span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-8">
        {/* Step Progress Tracker */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            { num: 1, label: "Core Details" },
            { num: 2, label: "Your Practice" },
            { num: 3, label: "Payout Details" },
            { num: 4, label: "Review & Submit" },
          ].map((p) => {
            const active = currentPart === p.num;
            const completed = currentPart > p.num;
            return (
              <button
                key={p.num}
                type="button"
                onClick={() => {
                  setCurrentPart(p.num as typeof currentPart);
                  if (p.num === 1) setSubStep("1A");
                  if (p.num === 2) setSubStep("2A");
                  if (p.num === 3) setSubStep("3A");
                  if (p.num === 4) setSubStep("4A");
                }}
                className="text-left group"
              >
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: active ? C.amber : completed ? C.navy : C.border,
                  }}
                />
                <p className="text-[11px] font-bold mt-1.5 transition-colors" style={{ color: active ? C.navy : C.muted }}>
                  PART {p.num}
                </p>
                <p className="text-xs font-semibold truncate hidden sm:block" style={{ color: active ? C.navy : C.label }}>
                  {p.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* PART 1 — CORE DETAILS                                          */}
        {/* ============================================================== */}
        {currentPart === 1 && (
          <div className="space-y-6">
            <div className="flex border-b" style={{ borderColor: C.border }}>
              {[
                { key: "1A", label: "1A. About You" },
                { key: "1B", label: "1B. Credentials" },
                { key: "1C", label: "1C. Documents" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSubStep(tab.key)}
                  className="px-4 py-2.5 text-xs font-bold border-b-2 transition-all"
                  style={{
                    borderColor: subStep === tab.key ? C.navy : "transparent",
                    color: subStep === tab.key ? C.navy : C.muted,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 1A. About You */}
            {subStep === "1A" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                  1A. About You
                </h2>
                <p className="text-xs text-slate-500">Provide your verified personal contact details.</p>

                <Input label="Full legal name *" placeholder="Dr. First Middle Last" value={name} onChange={setName} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Date of birth *" type="date" value={dob} onChange={setDob} />
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: C.muted }}>Gender *</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded-xl border p-3 text-sm outline-none" style={{ borderColor: C.border }}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Phone number *" type="tel" value={phone} onChange={setPhone} />
                  <Input label="Email address *" type="email" value={email} onChange={setEmail} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Country of current location *" value={country} onChange={setCountry} />
                  <Input label="City / State *" value={city} onChange={setCity} />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: C.muted }}>Languages Spoken *</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => {
                      const sel = selectedLanguages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setSelectedLanguages(sel ? selectedLanguages.filter((l) => l !== lang) : [...selectedLanguages, lang]);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                          style={{
                            backgroundColor: sel ? "#E6F1EE" : "white",
                            borderColor: sel ? C.navy : C.border,
                            color: sel ? C.navy : C.label,
                          }}
                        >
                          {sel ? "✓ " : "+ "} {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={() => setSubStep("1B")}>Continue to 1B. Credentials →</Button>
                </div>
              </div>
            )}

            {/* 1B. Credentials */}
            {subStep === "1B" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                  1B. Credentials & Licensing
                </h2>
                <p className="text-xs text-slate-500">Your medical license will be cross-checked directly with the licensing council.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Medical registration / licence number *" value={licenceNum} onChange={setLicenceNum} />
                  <Input label="Licensing body *" value={licensingBody} onChange={setLicensingBody} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Country of licence *" value={licenceCountry} onChange={setLicenceCountry} />
                  <Input label="Medical school *" value={medicalSchool} onChange={setMedicalSchool} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Graduation year *" type="number" value={gradYear} onChange={setGradYear} />
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: C.muted }}>Primary Specialty *</label>
                    <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full rounded-xl border p-3 text-sm outline-none" style={{ borderColor: C.border }}>
                      {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <Input label="Subspecialties / areas of focus" value={subspecialty} onChange={setSubspecialty} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Years of clinical experience *" type="number" value={yearsExperience} onChange={setYearsExperience} />
                  <Input label="Current hospital / clinic *" value={currentHospital} onChange={setCurrentHospital} />
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="ghost" onClick={() => setSubStep("1A")}>← Back to 1A</Button>
                  <Button onClick={() => setSubStep("1C")}>Continue to 1C. Documents →</Button>
                </div>
              </div>
            )}

            {/* 1C. Documents */}
            {subStep === "1C" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                    1C. Verification Documents
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload official government and medical council records to complete your clinical verification.
                  </p>
                </div>

                {/* Required Documents */}
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Required Documents (3 of 3)</p>
                  {[
                    { key: "licence", title: "Medical licence / practising certificate", desc: "Current annual practicing certificate from MDCN or GMC" },
                    { key: "degree", title: "Medical degree certificate (MBBS/MBChB)", desc: "University degree certificate" },
                    { key: "govId", title: "Government-issued photo ID", desc: "International passport, National NIN, or Driver's license" },
                  ].map((item) => (
                    <div key={item.key} className="p-4 rounded-xl border bg-white flex items-center justify-between" style={{ borderColor: C.border }}>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.navy }}>{item.title}</p>
                        <p className="text-xs" style={{ color: C.muted }}>{item.desc}</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800">
                        ✓ Uploaded
                      </span>
                    </div>
                  ))}
                </div>

                {/* Optional Certificates */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Optional Additional Qualifications</p>
                  {[
                    { key: "residency", title: "Residency / Senior Resident certificate", desc: "Postgraduate residency completion" },
                    { key: "fellowship", title: "Fellowship / Consultant certificate", desc: "WACP, FWACS, MRCP, or equivalent" },
                  ].map((item) => (
                    <div key={item.key} className="p-4 rounded-xl border bg-white flex items-center justify-between" style={{ borderColor: C.border }}>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.navy }}>{item.title}</p>
                        <p className="text-xs" style={{ color: C.muted }}>{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedDocs((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border hover:bg-slate-50"
                        style={{ borderColor: C.border, color: C.navy }}
                      >
                        {uploadedDocs[item.key as keyof typeof uploadedDocs] ? "✓ Attached" : "+ Upload File"}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="ghost" onClick={() => setSubStep("1B")}>← Back</Button>
                  <Button onClick={() => { setCurrentPart(2); setSubStep("2A"); }}>
                    Proceed to Part 2: Your Practice →
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* PART 2 — YOUR PRACTICE                                         */}
        {/* ============================================================== */}
        {currentPart === 2 && (
          <div className="space-y-6">
            <div className="flex border-b" style={{ borderColor: C.border }}>
              {[
                { key: "2A", label: "2A. Photo" },
                { key: "2B", label: "2B. Doctor Bio" },
                { key: "2C", label: "2C. Pricing" },
                { key: "2D", label: "2D. Availability" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSubStep(tab.key)}
                  className="px-4 py-2.5 text-xs font-bold border-b-2 transition-all"
                  style={{
                    borderColor: subStep === tab.key ? C.navy : "transparent",
                    color: subStep === tab.key ? C.navy : C.muted,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 2A. Professional Photo */}
            {subStep === "2A" && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                  2A. Professional Photo
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white border" style={{ borderColor: C.border }}>
                  <img src={photo} alt="Doctor" className="w-32 h-32 rounded-2xl object-cover border-2 shadow-sm" style={{ borderColor: C.navy }} />
                  <div className="space-y-2 text-center sm:text-left">
                    <p className="font-bold text-sm" style={{ color: C.navy }}>Crop &amp; Live Patient Preview</p>
                    <p className="text-xs text-slate-500">
                      High resolution headshot with clean background. Smiling, front-facing, professional attire or lab coat.
                    </p>
                    <div className="flex gap-2 justify-center sm:justify-start pt-2">
                      <Button size="sm" variant="outline">Change Photo</Button>
                      <Button size="sm" variant="ghost">Adjust Crop</Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-amber-900">Photo Quality Guidance:</p>
                  <p>• Avoid selfies, hats, sunglasses, or low-light clinic shots.</p>
                  <p>• Profiles with clear professional photos receive 3.4x more consultation requests.</p>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="ghost" onClick={() => { setCurrentPart(1); setSubStep("1C"); }}>← Back</Button>
                  <Button onClick={() => setSubStep("2B")}>Continue to 2B. Doctor Bio →</Button>
                </div>
              </div>
            )}

            {/* 2B. Doctor Bio */}
            {subStep === "2B" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                    2B. Doctor Bio
                  </h2>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${wordCount >= 50 && wordCount <= 200 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {wordCount} words (Target: 50–200 words)
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Introduce yourself to prospective patients. Highlight your specialties, clinical approach, response commitment, and languages.
                </p>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={generateAiBio}>
                    ✨ AI Generate Bio Template
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setBio((b) => b + " I am committed to responsive, patient-centered clinical care.")}>
                    ✨ AI Polish &amp; Rewrite
                  </Button>
                </div>

                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border p-4 text-sm outline-none resize-none leading-relaxed"
                  style={{ borderColor: C.border }}
                />

                <div className="pt-4 flex justify-between">
                  <Button variant="ghost" onClick={() => setSubStep("2A")}>← Back</Button>
                  <Button onClick={() => setSubStep("2C")}>Continue to 2C. Pricing →</Button>
                </div>
              </div>
            )}

            {/* 2C. Pricing */}
            {subStep === "2C" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                    2C. Monthly Subscription Pricing
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Set your private monthly Docura Care patient subscription price. You can change this anytime.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input label="Monthly subscription price (₦) *" type="number" value={monthlyPrice} onChange={setMonthlyPrice} />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMonthlyPrice("15000")}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        Market benchmark: ₦15,000
                      </button>
                      <button
                        type="button"
                        onClick={() => setMonthlyPrice("18000")}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-900 hover:bg-amber-200"
                      >
                        Recommended: ₦18,000
                      </button>
                    </div>
                  </div>

                  {/* Interactive Earnings Calculator */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                    <p className="font-bold text-emerald-950 uppercase tracking-wider">Live Monthly Earnings Calculator</p>
                    <div className="flex justify-between py-1 border-b border-emerald-200">
                      <span>Based on active care panel:</span>
                      <strong>{samplePatients} subscribed patients</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-emerald-200">
                      <span>Gross monthly fees:</span>
                      <strong>₦{grossMonthly.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-emerald-200 text-slate-500">
                      <span>Platform fee (15% platform/infra/Rx):</span>
                      <span>- ₦{(grossMonthly * platformFee).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-1 font-bold text-sm text-emerald-900">
                      <span>Estimated Doctor Net Payout:</span>
                      <span>₦{Math.round(netEarnings).toLocaleString()} / month</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 text-xs text-slate-600">
                  🛡️ <strong>Price Protection</strong>: You can adjust your price anytime. Existing subscribers will retain their grandfathered price until they renew.
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="ghost" onClick={() => setSubStep("2B")}>← Back</Button>
                  <Button onClick={() => setSubStep("2D")}>Continue to 2D. Availability →</Button>
                </div>
              </div>
            )}

            {/* 2D. Availability */}
            {subStep === "2D" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                    2D. Availability &amp; Response Commitment
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Set your consultation windows and response commitment for your active patient panel.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: C.muted }}>Active Practice Days *</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => {
                      const sel = activeDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setActiveDays(sel ? activeDays.filter((d) => d !== day) : [...activeDays, day]);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                          style={{
                            backgroundColor: sel ? C.navy : "white",
                            color: sel ? "white" : C.label,
                            borderColor: sel ? C.navy : C.border,
                          }}
                        >
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Consultation Window 1 *" value={window1} onChange={setWindow1} placeholder="e.g. 08:00 - 12:00" />
                  <Input label="Consultation Window 2 (Optional)" value={window2} onChange={setWindow2} placeholder="e.g. 16:00 - 20:00" />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: C.muted }}>Response-Time Commitment *</label>
                  <select
                    value={responseTime}
                    onChange={(e) => setResponseTime(e.target.value)}
                    className="w-full rounded-xl border p-3 text-sm outline-none font-medium"
                    style={{ borderColor: C.border }}
                  >
                    <option>Usually replies within 1 hour</option>
                    <option>Usually replies within 2 hours</option>
                    <option>Usually replies within 4 hours</option>
                    <option>Usually replies within 6 hours</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="ghost" onClick={() => setSubStep("2C")}>← Back</Button>
                  <Button onClick={() => { setCurrentPart(3); setSubStep("3A"); }}>
                    Proceed to Part 3: Payout Account →
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* PART 3 — A LITTLE MORE                                         */}
        {/* ============================================================== */}
        {currentPart === 3 && (
          <div className="space-y-6">
            <div className="flex border-b" style={{ borderColor: C.border }}>
              {[
                { key: "3A", label: "3A. Payout Account" },
                { key: "3B", label: "3B. Payout Information" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSubStep(tab.key)}
                  className="px-4 py-2.5 text-xs font-bold border-b-2 transition-all"
                  style={{
                    borderColor: subStep === tab.key ? C.navy : "transparent",
                    color: subStep === tab.key ? C.navy : C.muted,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 3A. Payout Account */}
            {subStep === "3A" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                    3A. Payout Account
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Docura routes patient subscription fees directly to your local bank account.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: C.muted }}>Bank *</label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full rounded-xl border p-3 text-sm outline-none font-medium"
                    style={{ borderColor: C.border }}
                  >
                    {BANKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <Input label="Account number *" value={accountNumber} onChange={setAccountNumber} placeholder="10-digit NUBAN" />
                  <Button size="sm" variant="outline" loading={isVerifyingBank} onClick={handleBankVerify}>
                    Verify Account Name
                  </Button>
                </div>

                {verifiedAccountName && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-slate-500 font-medium">Automatically Retrieved Account Name:</p>
                      <p className="font-bold text-sm text-emerald-950 mt-0.5">{verifiedAccountName}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-200 text-emerald-900">
                      ✓ Match Verified
                    </span>
                  </div>
                )}

                <div className="pt-4 flex justify-between">
                  <Button variant="ghost" onClick={() => { setCurrentPart(2); setSubStep("2D"); }}>← Back</Button>
                  <Button onClick={() => setSubStep("3B")}>Continue to 3B. Payout Information →</Button>
                </div>
              </div>
            )}

            {/* 3B. Payout Information */}
            {subStep === "3B" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                    3B. Payout Information &amp; Schedule
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Review settlement schedules, minimum thresholds, and security disclosures.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-white border flex justify-between" style={{ borderColor: C.border }}>
                    <span className="text-slate-500">Payout Schedule:</span>
                    <strong className="text-slate-800">Bi-weekly settlement (1st and 15th of every month)</strong>
                  </div>
                  <div className="p-4 rounded-xl bg-white border flex justify-between" style={{ borderColor: C.border }}>
                    <span className="text-slate-500">Minimum Payout Threshold:</span>
                    <strong className="text-slate-800">₦10,000 (No rollover fees)</strong>
                  </div>
                  <div className="p-4 rounded-xl bg-white border flex justify-between" style={{ borderColor: C.border }}>
                    <span className="text-slate-500">Processing Time:</span>
                    <strong className="text-slate-800">Direct NIP deposit (Within 2 - 4 business hours)</strong>
                  </div>
                  <div className="p-4 rounded-xl bg-white border flex justify-between" style={{ borderColor: C.border }}>
                    <span className="text-slate-500">Settlement Currency:</span>
                    <strong className="text-slate-800">Nigerian Naira (₦ NGN)</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border text-xs text-slate-600 leading-relaxed" style={{ borderColor: C.border }}>
                  🔒 <strong>Security &amp; Regulatory Disclosure</strong>: Payment processing is handled by licensed Tier-1 payment processors (Paystack/Flutterwave) under CBN regulatory guidelines with 256-bit SSL encryption.
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="ghost" onClick={() => setSubStep("3A")}>← Back</Button>
                  <Button onClick={() => { setCurrentPart(4); setSubStep("4A"); }}>
                    Proceed to Part 4: Review &amp; Submit →
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* PART 4 — REVIEW & SUBMIT                                       */}
        {/* ============================================================== */}
        {currentPart === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                Part 4 — Review Profile &amp; Submit Application
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Inspect how patients will see your profile before going live. Inline editing is enabled for all sections.
              </p>
            </div>

            {/* 4A. Patient-facing profile preview */}
            <div className="p-6 rounded-3xl border bg-white shadow-sm space-y-6" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: C.border }}>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Patient-Facing Public View
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  New Doctor · Available for Booking
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-5">
                <img src={photo} alt={name} className="w-24 h-24 rounded-2xl object-cover border" style={{ borderColor: C.border }} />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                      {name}
                    </h3>
                    <span className="text-xs text-emerald-700 font-bold">✓ Verified MDCN</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{specialty}</p>
                  <p className="text-xs text-slate-500">
                    {city}, {country} · {yearsExperience} years clinical experience
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs pt-1">
                    <span className="text-slate-600">🗣️ {selectedLanguages.join(", ")}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-emerald-700 font-semibold">⚡ {responseTime}</span>
                  </div>
                </div>
              </div>

              {/* Bio Preview */}
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Doctor Bio</p>
                <p className="text-sm text-slate-700 leading-relaxed">{bio}</p>
              </div>

              {/* Subscription card preview */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900">Docura Care Monthly Subscription</p>
                  <p className="text-lg font-bold" style={{ color: C.navy }}>₦{parseInt(monthlyPrice, 10).toLocaleString()} / month</p>
                  <p className="text-[11px] text-slate-500">Includes direct chat, care plans, check-ins, and local prescriptions</p>
                </div>
                <button type="button" className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-900 shadow-sm cursor-not-allowed">
                  Subscribe to Dr. {name.split(" ").pop()}
                </button>
              </div>

              {/* 4B. Inline editing buttons */}
              <div className="pt-2 border-t flex flex-wrap gap-2" style={{ borderColor: C.border }}>
                <span className="text-xs font-bold text-slate-400 self-center mr-2">Quick Edit:</span>
                <button onClick={() => setInlineEditSection("photo")} className="px-3 py-1 rounded-lg text-xs font-semibold border hover:bg-slate-50">
                  Edit Photo
                </button>
                <button onClick={() => setInlineEditSection("bio")} className="px-3 py-1 rounded-lg text-xs font-semibold border hover:bg-slate-50">
                  Edit Bio
                </button>
                <button onClick={() => setInlineEditSection("price")} className="px-3 py-1 rounded-lg text-xs font-semibold border hover:bg-slate-50">
                  Edit Price
                </button>
                <button onClick={() => setInlineEditSection("hours")} className="px-3 py-1 rounded-lg text-xs font-semibold border hover:bg-slate-50">
                  Edit Hours &amp; Response
                </button>
              </div>
            </div>

            {/* 4C. Final Confirmation Checkboxes */}
            <div className="p-5 rounded-2xl bg-white border space-y-3" style={{ borderColor: C.border }}>
              <h4 className="text-sm font-bold" style={{ color: C.navy }}>4C. Declarations &amp; Consent</h4>
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded" />
                <span>I confirm that all credentials, certificates, and council registration numbers provided are accurate and genuine.</span>
              </label>
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded" />
                <span>I agree to the Docura Clinician Terms of Service, Medical Governance Protocols, and Patient Privacy Regulations.</span>
              </label>
            </div>

            {/* Submit / Go Live CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Button variant="ghost" onClick={() => { setCurrentPart(3); setSubStep("3B"); }}>
                ← Back to Payouts
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  markOnboardingComplete();
                  setSubStep("4D");
                }}
              >
                Submit Application &amp; Go Live 🚀
              </Button>
            </div>

            {/* 4D. Post-submission interactive simulator */}
            {subStep === "4D" && (
              <div className="mt-8 p-6 rounded-3xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base">4D. Post-Submission Lifecycle Simulation</h4>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setPostSubmitStatus("pending")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${postSubmitStatus === "pending" ? "bg-amber-400 text-slate-900" : "bg-slate-800 text-slate-300"}`}
                    >
                      Pending Verification
                    </button>
                    <button
                      onClick={() => setPostSubmitStatus("verified")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${postSubmitStatus === "verified" ? "bg-blue-400 text-slate-900" : "bg-slate-800 text-slate-300"}`}
                    >
                      Verified
                    </button>
                    <button
                      onClick={() => setPostSubmitStatus("live")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${postSubmitStatus === "live" ? "bg-emerald-400 text-slate-900" : "bg-slate-800 text-slate-300"}`}
                    >
                      Live
                    </button>
                    <button
                      onClick={() => setPostSubmitStatus("correction")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${postSubmitStatus === "correction" ? "bg-red-400 text-slate-900" : "bg-slate-800 text-slate-300"}`}
                    >
                      Needs Correction
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-2">
                  {postSubmitStatus === "pending" && (
                    <>
                      <p className="font-bold text-amber-400">⏳ Application Status: Pending Verification</p>
                      <p className="text-slate-300">Your documents are under review by the Docura Medical Board. Verification typically takes 24 hours.</p>
                    </>
                  )}
                  {postSubmitStatus === "verified" && (
                    <>
                      <p className="font-bold text-blue-400">✓ Application Status: Verified</p>
                      <p className="text-slate-300">Your MDCN license and documents have passed validation. You can now toggle your practice Live.</p>
                    </>
                  )}
                  {postSubmitStatus === "live" && (
                    <>
                      <p className="font-bold text-emerald-400">🟢 Application Status: Live &amp; Accepting Patients</p>
                      <p className="text-slate-300">Your profile is visible in patient discovery and ready for Docura Care subscribers.</p>
                    </>
                  )}
                  {postSubmitStatus === "correction" && (
                    <>
                      <p className="font-bold text-red-400">⚠️ Application Status: Needs Correction → Resubmit</p>
                      <p className="text-slate-300">The medical board requested a clearer scan of your 2025 Annual Practicing Certificate.</p>
                    </>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={() => navigate("doctor-dashboard")}>
                    Enter Doctor Dashboard →
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Inline Edit Modal */}
        <Modal open={!!inlineEditSection} onClose={() => setInlineEditSection(null)} title={`Edit ${inlineEditSection?.toUpperCase()}`}>
          <div className="space-y-4">
            {inlineEditSection === "bio" && (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className="w-full rounded-xl border p-3 text-sm outline-none resize-none"
                style={{ borderColor: C.border }}
              />
            )}
            {inlineEditSection === "price" && (
              <Input label="Monthly subscription price (₦)" type="number" value={monthlyPrice} onChange={setMonthlyPrice} />
            )}
            {inlineEditSection === "photo" && (
              <Input label="Profile Photo Image URL" value={photo} onChange={setPhoto} />
            )}
            {inlineEditSection === "hours" && (
              <div className="space-y-2">
                <Input label="Window 1" value={window1} onChange={setWindow1} />
                <Input label="Window 2" value={window2} onChange={setWindow2} />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button onClick={() => setInlineEditSection(null)}>Save &amp; Update Preview</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
