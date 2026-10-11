import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { C, Badge, Button, Avatar } from "@/components/ui";
import { SiteFooter } from "@/pages/PublicPage";
import logo from "@/assets/logo.png";
import type { Country } from "@/data/types";

interface StepSimulation {
  origin: Country;
  destination: Country;
  hasPersonalDoctor: boolean;
  selectedMedication: string;
}

export default function CrossBorderCare() {
  const { navigate, role, domain, updatePatientCrossBorder, addToast } = useApp();

  // Interactive Simulator State
  const [sim, setSim] = useState<StepSimulation>({
    origin: "Nigeria",
    destination: "United Kingdom",
    hasPersonalDoctor: true,
    selectedMedication: "Amlodipine 5mg Daily (Hypertension)",
  });

  const [activeTab, setActiveTab] = useState<"overview" | "simulator" | "roles" | "faq">("overview");
  const [simStep, setSimStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simCompleted, setSimCompleted] = useState(false);

  const startFlow = (page: string) => {
    navigate(role === "patient" || role === "proxy" ? page : "role-select");
  };

  const isNigeriaToUK = sim.origin === "Nigeria" && sim.destination === "United Kingdom";

  const personalDoc = isNigeriaToUK
    ? {
        name: "Dr. Amara Osei",
        role: "Personal Doctor",
        location: "Lagos, Nigeria",
        regulator: "MDCN (Medical and Dental Council of Nigeria)",
        license: "MDCN/2018/4421",
        responsibilities: "Longitudinal care leadership, symptom management, routine reviews, health history tracking, care plan creation.",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      }
    : {
        name: "Dr. Sarah Adeyemi",
        role: "Personal Doctor",
        location: "London, United Kingdom",
        regulator: "GMC (General Medical Council UK)",
        license: "GMC/7834521",
        responsibilities: "Longitudinal health oversight, care continuity during international relocations, follow-ups.",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      };

  const prescribingDoc = isNigeriaToUK
    ? {
        name: "Dr. James Adeyemi",
        role: "Locally Licensed Prescribing Doctor",
        location: "London, United Kingdom",
        regulator: "GMC (General Medical Council UK)",
        license: "GMC/6918234",
        responsibilities: "Independent clinical review in the UK, evaluating patient safety against UK prescribing formularies, issuing valid UK e-prescriptions.",
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
      }
    : {
        name: "Dr. Emeka Okafor",
        role: "Locally Licensed Prescribing Doctor",
        location: "Abuja, Nigeria",
        regulator: "MDCN (Medical and Dental Council of Nigeria)",
        license: "MDCN/2015/8842",
        responsibilities: "Statutory Nigerian clinical evaluation, cross-border care note authorization, issuing valid Nigerian pharmacy prescriptions.",
        photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face",
      };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimStep(2);
    setTimeout(() => {
      setSimStep(3);
      setTimeout(() => {
        setSimStep(4);
        setIsSimulating(false);
        setSimCompleted(true);
      }, 1200);
    }, 1200);
  };

  const activateInAccount = () => {
    updatePatientCrossBorder({
      originCountry: sim.origin,
      destinationCountry: sim.destination,
      status: "active",
      personalDoctorName: personalDoc.name,
      prescribingDoctorName: prescribingDoc.name,
      activeMedication: sim.selectedMedication,
    });
    addToast("success", `Cross-Border Care activated: ${sim.origin} ↔ ${sim.destination}`);
    navigate(role === "patient" ? "patient-dashboard" : "login");
  };

  return (
    <div style={{ fontFamily: "var(--font-body)", backgroundColor: "#FAFAF8", minHeight: "100vh" }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{ backgroundColor: "rgba(250,250,248,0.96)", borderColor: C.border }}
      >
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <button onClick={() => navigate("landing")} className="flex items-center gap-2.5 text-left">
            <img src={logo} width={34} height={34} alt="Docura" className="object-contain" />
            <div>
              <span className="font-bold text-xl block leading-none" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Docura</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider block mt-0.5" style={{ color: C.amber }}>Cross-Border Care</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium" style={{ color: C.navy }}>
            <button onClick={() => navigate("landing")} className="hover:opacity-70 transition-opacity">Home</button>
            <button onClick={() => setActiveTab("overview")} className="hover:opacity-70 transition-opacity" style={{ color: activeTab === "overview" ? C.amber : C.navy }}>Care Model</button>
            <button onClick={() => setActiveTab("simulator")} className="hover:opacity-70 transition-opacity" style={{ color: activeTab === "simulator" ? C.amber : C.navy }}>Interactive Demo</button>
            <button onClick={() => setActiveTab("roles")} className="hover:opacity-70 transition-opacity" style={{ color: activeTab === "roles" ? C.amber : C.navy }}>Doctor Roles</button>
            <button onClick={() => setActiveTab("faq")} className="hover:opacity-70 transition-opacity" style={{ color: activeTab === "faq" ? C.amber : C.navy }}>FAQ</button>
            <button onClick={() => navigate("public-care")} className="hover:opacity-70 transition-opacity">Docura Care</button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("login")}
              className="px-4 py-2 text-sm font-medium rounded-full border hover:bg-black/5 transition-colors"
              style={{ borderColor: C.border, color: C.navy }}
            >
              Sign in
            </button>
            <button
              onClick={() => startFlow("find-doctor")}
              className="px-5 py-2 text-sm font-semibold rounded-full text-white shadow-xs hover:opacity-90 transition-opacity"
              style={{ backgroundColor: C.navy }}
            >
              Find a Doctor
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="py-16 md:py-24 px-6 border-b" style={{ backgroundColor: "#F7F7F4", borderColor: C.border }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 bg-amber-100 text-amber-900 border border-amber-200">
            <span>🇳🇬 Nigeria ↔ 🇬🇧 United Kingdom</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            <span>Cross-Border Care Coordination</span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-4xl mx-auto"
            style={{ fontFamily: "var(--font-display)", color: C.navy }}
          >
            Your doctor relationship doesn't have to stop at the border.
          </h1>

          <p className="text-base md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Docura is your healthcare home. One relationship. One continuous health history. Wherever life takes you between Nigeria and the United Kingdom.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => {
                setActiveTab("simulator");
                const el = document.getElementById("interactive-simulator");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-full text-base shadow-sm"
              style={{ backgroundColor: C.amber }}
            >
              Try Interactive Simulation
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => startFlow("find-doctor")}
              className="border-stone-300 text-stone-800 px-8 py-4 rounded-full text-base bg-white hover:bg-stone-50"
            >
              Find Your Personal Doctor
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-2xl mb-1 block">🩺</span>
              <p className="text-sm font-bold" style={{ color: C.navy }}>One Personal Doctor</p>
              <p className="text-xs text-stone-500 mt-0.5">Knows your medical story and coordinates across borders.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-2xl mb-1 block">⚖️</span>
              <p className="text-sm font-bold" style={{ color: C.navy }}>Locally Licensed Rx</p>
              <p className="text-xs text-stone-500 mt-0.5">Prescriptions authorized in accordance with local regulations.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-2xl mb-1 block">📂</span>
              <p className="text-sm font-bold" style={{ color: C.navy }}>One Health History</p>
              <p className="text-xs text-stone-500 mt-0.5">Consultations, documents & meds stay in one longitudinal timeline.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-2xl mb-1 block">🛡️</span>
              <p className="text-sm font-bold" style={{ color: C.navy }}>Statutory Compliance</p>
              <p className="text-xs text-stone-500 mt-0.5">Doctors prescribe only in their verified authorized jurisdiction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Subnav Tabs ─────────────────────────────────────── */}
      <div className="sticky top-18 z-40 bg-white border-b shadow-2xs" style={{ borderColor: C.border }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
          {[
            { id: "overview", label: "1. The Care Model & Problem" },
            { id: "simulator", label: "2. Interactive Demonstration" },
            { id: "roles", label: "3. Professional Roles & Jurisdiction" },
            { id: "faq", label: "4. Regulated Care FAQ" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? C.navy : "#F5F5F0",
                color: activeTab === tab.id ? "white" : C.navy,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab 1: The Problem & The Care Model ───────────────── */}
      {(activeTab === "overview" || activeTab === "simulator") && (
        <section className="py-16 px-6 max-w-6xl mx-auto space-y-16">
          {/* The Continuity Problem */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">The Continuity Problem</p>
              <h2 className="text-3xl font-bold leading-tight mb-4" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                Healthcare shouldn't restart from scratch every time you travel.
              </h2>
              <div className="space-y-3 text-stone-600 text-sm leading-relaxed">
                <p>
                  Every year, thousands of people move, study, or conduct business between Nigeria and the United Kingdom. Traditionally, entering another country's healthcare system means:
                </p>
                <ul className="space-y-2.5 pt-1">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>Loss of healthcare relationship:</strong> Having to explain your chronic conditions, family history, and preferences to unfamiliar clinicians repeatedly.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>Scattered paper records:</strong> Diagnostic investigations, blood results, and past summaries stranded in hospital basements or WhatsApp chats.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>Prescription disruption:</strong> A doctor registered only in Nigeria cannot legally issue an NHS or UK private pharmacy prescription, and vice-versa.</span>
                  </li>
                </ul>
                <p className="pt-2 text-stone-800 font-medium">
                  Docura solves this through a dual-doctor coordinated care model that respects national licensing while keeping your health story unified.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-stone-900 border-b pb-3">The Docura Cross-Border Framework</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900">Your Personal Doctor leads your journey</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Whether you are in Lagos or London, your Personal Doctor reviews your ongoing symptoms, adjusts care plans, and conducts scheduled follow-ups.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900">Cross-Border Care Coordination activates</h4>
                    <p className="text-xs text-stone-500 mt-0.5">When medications, local labs, or physical interventions are needed, your Personal Doctor shares a structured clinical recommendation with your consent.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900">A Locally Licensed Prescribing Doctor validates</h4>
                    <p className="text-xs text-stone-500 mt-0.5">A doctor holding an active, verified licence with the destination country's regulator (MDCN in Nigeria or GMC in the UK) performs an independent clinical check and issues the local prescription.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-sm shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900">One Continuous Health Timeline updates</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Dispensed medications, consultation notes, and new laboratory results automatically attach to your shared record for your Personal Doctor to review.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Diagram of the Care Model */}
          <div className="p-8 md:p-10 rounded-3xl bg-slate-900 text-white shadow-md">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">Coordinated Care Model</span>
              <h3 className="text-2xl md:text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>
                How Coordinated Cross-Border Care Works
              </h3>
              <p className="text-xs md:text-sm text-slate-300 mt-2">
                Conceptual model of responsibility and clinical handoff between jurisdictions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Box 1 */}
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto text-xl">👤</div>
                <h4 className="font-bold text-sm text-white">Patient</h4>
                <p className="text-[11px] text-slate-400">Owns health record. Travels or relocates between Nigeria & UK.</p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-slate-700 text-amber-300">Consent Control</span>
              </div>

              {/* Arrow */}
              <div className="text-center text-slate-500 text-xl hidden md:block">➔</div>

              {/* Box 2 */}
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center mx-auto text-xl">🩺</div>
                <h4 className="font-bold text-sm text-white">Personal Doctor</h4>
                <p className="text-[11px] text-slate-400">Maintains ongoing relationship, monitors health history & formulates care plans.</p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-slate-700 text-emerald-300">Continuous Lead</span>
              </div>

              {/* Arrow */}
              <div className="text-center text-slate-500 text-xl hidden md:block">➔</div>

              {/* Box 3 */}
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-400/20 text-blue-300 flex items-center justify-center mx-auto text-xl">⚕️</div>
                <h4 className="font-bold text-sm text-white">Locally Licensed Prescribing Doctor</h4>
                <p className="text-[11px] text-slate-400">Statutory license in destination country (MDCN or GMC) for independent legal prescription.</p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-slate-700 text-blue-300">Statutory Rx</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✔</span>
                <span>Doctor-to-doctor clinical handoff with full audit trail</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✔</span>
                <span>Zero repetition of patient intake or medical history</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✔</span>
                <span>Statutory compliance strictly guaranteed per regulator</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Tab 2: Interactive Demonstration ─────────────────── */}
      <section id="interactive-simulator" className="py-16 px-6 bg-stone-100 border-t border-stone-200">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-200 text-amber-950 mb-3">
              Interactive Prototype Sandbox
            </div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Explore the Cross-Border Journey
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              Select your origin, destination, and care context below to test how Docura coordinates doctors across borders.
            </p>
          </div>

          {/* Interactive Control Console */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Step 1: Configuration */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-stone-900 border-b pb-3">Step 1: Choose Your Journey</h3>

              {/* Origin */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">Where is your care today?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSim((s) => ({ ...s, origin: "Nigeria", destination: "United Kingdom" }));
                      setSimCompleted(false);
                      setSimStep(1);
                    }}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold flex items-center gap-2 transition-all ${
                      sim.origin === "Nigeria" ? "border-amber-500 bg-amber-50/60 text-amber-950" : "border-stone-200 text-stone-700 bg-white"
                    }`}
                  >
                    <span className="text-xl">🇳🇬</span>
                    <div>
                      <span>Nigeria</span>
                      <span className="block text-[10px] font-normal text-stone-500">MDCN Licensed</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setSim((s) => ({ ...s, origin: "United Kingdom", destination: "Nigeria" }));
                      setSimCompleted(false);
                      setSimStep(1);
                    }}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold flex items-center gap-2 transition-all ${
                      sim.origin === "United Kingdom" ? "border-amber-500 bg-amber-50/60 text-amber-950" : "border-stone-200 text-stone-700 bg-white"
                    }`}
                  >
                    <span className="text-xl">🇬🇧</span>
                    <div>
                      <span>UK</span>
                      <span className="block text-[10px] font-normal text-stone-500">GMC Licensed</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">Where do you need care / travel to?</label>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs font-semibold text-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sim.destination === "United Kingdom" ? "🇬🇧" : "🇳🇬"}</span>
                    <span>{sim.destination}</span>
                  </div>
                  <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-bold">Destination</span>
                </div>
              </div>

              {/* Doctor relationship */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">Do you already have a Personal Doctor?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSim((s) => ({ ...s, hasPersonalDoctor: true }))}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                      sim.hasPersonalDoctor ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold" : "border-stone-200 text-stone-600"
                    }`}
                  >
                    Yes, on Docura
                  </button>
                  <button
                    onClick={() => setSim((s) => ({ ...s, hasPersonalDoctor: false }))}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                      !sim.hasPersonalDoctor ? "border-amber-500 bg-amber-50 text-amber-950 font-bold" : "border-stone-200 text-stone-600"
                    }`}
                  >
                    Need to Find One
                  </button>
                </div>
              </div>

              {/* Sample clinical concern */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">Sample Care Coordination Case</label>
                <select
                  value={sim.selectedMedication}
                  onChange={(e) => setSim((s) => ({ ...s, selectedMedication: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-800 font-medium outline-none"
                >
                  <option value="Amlodipine 5mg Daily (Hypertension)">Amlodipine 5mg Daily (Hypertension escalation)</option>
                  <option value="Metformin 500mg BD (Type 2 Diabetes)">Metformin 500mg BD (Type 2 Diabetes routine refill)</option>
                  <option value="Salbutamol Inhaler (Asthma Management)">Salbutamol Inhaler (Asthma travel care)</option>
                </select>
              </div>

              <Button
                fullWidth
                disabled={isSimulating}
                onClick={runSimulation}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 text-sm rounded-xl"
              >
                {isSimulating ? "Simulating Coordination..." : "Simulate Coordinated Handoff"}
              </Button>
            </div>

            {/* Step 2 & 3: Clinical Roles & Live Workflow */}
            <div className="lg:col-span-2 space-y-5">
              {/* Involved Doctors */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Personal Doctor Card */}
                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                      Personal Doctor
                    </span>
                    <span className="text-xs text-stone-500">{sim.origin}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar src={personalDoc.photo} name={personalDoc.name} size={46} />
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{personalDoc.name}</h4>
                      <p className="text-xs text-stone-500">{personalDoc.location}</p>
                      <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">{personalDoc.license}</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl leading-relaxed">
                    <strong>Jurisdiction:</strong> {personalDoc.regulator}. Leads health consultations, reviews timeline, submits coordination notes.
                  </p>
                </div>

                {/* Prescribing Doctor Card */}
                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                      Prescribing Doctor
                    </span>
                    <span className="text-xs text-stone-500">{sim.destination}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar src={prescribingDoc.photo} name={prescribingDoc.name} size={46} />
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{prescribingDoc.name}</h4>
                      <p className="text-xs text-stone-500">{prescribingDoc.location}</p>
                      <p className="text-[11px] font-semibold text-blue-700 mt-0.5">{prescribingDoc.license}</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl leading-relaxed">
                    <strong>Jurisdiction:</strong> {prescribingDoc.regulator}. Statutorily authorized to review and prescribe in {sim.destination}.
                  </p>
                </div>
              </div>

              {/* Simulation Output Monitor */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="font-bold text-base text-stone-900">Live Coordination Sequence</h3>
                    <p className="text-xs text-stone-500">Real-time status of cross-border handoff</p>
                  </div>
                  <Badge variant={simCompleted ? "green" : simStep > 1 ? "amber" : "blue"}>
                    {simCompleted ? "Completed · Prescription Issued" : simStep > 1 ? "In Progress" : "Ready to Simulate"}
                  </Badge>
                </div>

                {/* Sequence Step Tracker */}
                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${simStep >= 1 ? "bg-stone-50 border-stone-300" : "opacity-40"}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${simStep >= 2 ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-700"}`}>
                        {simStep >= 2 ? "✓" : "1"}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-stone-800">1. Personal Doctor Care Review ({sim.origin})</p>
                        <p className="text-[11px] text-stone-500">
                          {personalDoc.name} evaluates your symptoms and recommends <strong>{sim.selectedMedication}</strong> with clinical rationale.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${simStep >= 2 ? "bg-stone-50 border-stone-300" : "opacity-40"}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${simStep >= 3 ? "bg-emerald-600 text-white" : simStep === 2 ? "bg-amber-500 text-white animate-pulse" : "bg-stone-200 text-stone-700"}`}>
                        {simStep >= 3 ? "✓" : "2"}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-stone-800">2. Secure Doctor-to-Doctor Handoff & Patient Consent</p>
                        <p className="text-[11px] text-stone-500">
                          Structured clinical notes sent to {prescribingDoc.name}. Health Passport and contraindications shared with scoped patient consent.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${simStep >= 3 ? "bg-stone-50 border-stone-300" : "opacity-40"}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${simStep >= 4 ? "bg-emerald-600 text-white" : simStep === 3 ? "bg-amber-500 text-white animate-pulse" : "bg-stone-200 text-stone-700"}`}>
                        {simStep >= 4 ? "✓" : "3"}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-stone-800">3. Independent Clinical Review & Statutory Approval ({sim.destination})</p>
                        <p className="text-[11px] text-stone-500">
                          {prescribingDoc.name} confirms legal drug availability, checks local interactions, and issues authorized e-prescription.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${simStep >= 4 ? "bg-emerald-50 border-emerald-300" : "opacity-40"}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${simCompleted ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-700"}`}>
                        {simCompleted ? "✓" : "4"}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-emerald-950">4. Local Dispensing & Health Record Synchronization</p>
                        <p className="text-[11px] text-emerald-800">
                          Prescription sent to local pharmacy network in {sim.destination}. Care timeline updated for both you and your Personal Doctor.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions & Activation */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-stone-900">Want to use this in your Docura account?</p>
                    <p className="text-[11px] text-stone-500">Set this destination in your profile or view active status.</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      onClick={activateInAccount}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shrink-0"
                    >
                      Apply to My Account
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("find-doctor")}
                      className="text-xs py-2 px-3 rounded-xl bg-white"
                    >
                      Browse Doctors
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tab 3: Detailed Professional Roles & Regulatory Integrity ──────── */}
      {(activeTab === "overview" || activeTab === "roles") && (
        <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-600">Regulatory Integrity</span>
            <h2 className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Separation of Responsibilities & Compliance
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              Cross-border care on Docura does not bypass medicine laws. It coordinates authorized clinicians.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">1</div>
              <h3 className="text-xl font-bold" style={{ color: C.navy }}>The Personal Doctor</h3>
              <p className="text-xs uppercase tracking-wider font-semibold text-amber-700">Longitudinal Continuity Specialist</p>
              <p className="text-sm text-stone-600 leading-relaxed">
                Your Personal Doctor is your lifelong clinical advocate. They understand your lifestyle, chronic disease progression, family predispositions, and treatment history.
              </p>
              <div className="bg-stone-50 p-4 rounded-2xl text-xs space-y-2 text-stone-700">
                <p><strong>What they do:</strong> Video consultations, longitudinal health assessments, SOAP documentation, adjusting care plans, follow-ups.</p>
                <p><strong>What they do NOT do:</strong> They do not issue prescriptions into a foreign country where they do not hold an active statutory licence.</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">2</div>
              <h3 className="text-xl font-bold" style={{ color: C.navy }}>The Locally Licensed Prescribing Doctor</h3>
              <p className="text-xs uppercase tracking-wider font-semibold text-blue-700">Statutory Jurisdictional Authority</p>
              <p className="text-sm text-stone-600 leading-relaxed">
                Registered with the regulatory board in the patient's physical location (GMC in the UK, MDCN in Nigeria). They exercise independent clinical judgment before issuing any prescription.
              </p>
              <div className="bg-stone-50 p-4 rounded-2xl text-xs space-y-2 text-stone-700">
                <p><strong>What they do:</strong> Independent review of Personal Doctor handoff, checking local drug interactions, issuing legally valid e-prescriptions for local pharmacies.</p>
                <p><strong>Clinical freedom:</strong> They have the absolute statutory right to decline or modify recommendations if clinical safety requires it.</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold">Clear Healthcare Boundary</p>
                <p className="text-stone-600 mt-0.5">
                  Docura is not an emergency response service. If you or a loved one experiences chest pain, severe trauma, or acute breathing difficulty, immediately dial 999 (UK) or local emergency services (Nigeria).
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Tab 4: FAQ ───────────────────────────────────────── */}
      {(activeTab === "overview" || activeTab === "faq") && (
        <section className="py-16 px-6 bg-white border-t border-stone-200">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                Frequently Asked Questions
              </h2>
              <p className="text-stone-500 text-sm mt-1">Everything you need to know about navigating care across Nigeria and the UK.</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Can my Nigerian doctor prescribe directly for me in the United Kingdom?",
                  a: "No. United Kingdom law and the General Medical Council (GMC) require all valid prescriptions to be authorized by a practitioner registered and licensed in the UK. On Docura, your Nigerian Personal Doctor formulates the clinical recommendation, which is independently evaluated and authorized by a UK-licensed prescribing doctor before pharmacy dispensing.",
                },
                {
                  q: "Can my UK doctor prescribe for me when I am visiting Nigeria?",
                  a: "The same principle applies in reverse. Dispensing in Nigerian pharmacies requires registration with the Medical and Dental Council of Nigeria (MDCN). Your UK Personal Doctor formulates your care plan, and an MDCN-registered local doctor provides the statutory prescription review.",
                },
                {
                  q: "Do I have to pay two separate fees every month?",
                  a: "No. Your monthly Docura Care membership fee supports your continuous relationship with your Personal Doctor. When a cross-border prescribing handoff is clinically required, a transparent coordination and independent review fee is clearly displayed before confirmation.",
                },
                {
                  q: "Who owns and controls my medical documents?",
                  a: "You do. Your longitudinal health timeline and Health Passport belong entirely to you. You can grant, scope, and revoke access for any clinician at any time.",
                },
                {
                  q: "What if the prescribing doctor disagrees with my Personal Doctor's recommendation?",
                  a: "Both clinicians communicate securely via Docura's Doctor-to-Doctor (D2D) clinical chat to resolve nuances. The prescribing doctor retains ultimate statutory responsibility for any medication dispensed in their jurisdiction.",
                },
              ].map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-sm text-stone-900 mb-1.5">{faq.q}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="text-center pt-6">
              <Button
                size="lg"
                onClick={() => startFlow("find-doctor")}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-full text-sm"
              >
                Start Cross-Border Care with Docura
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ─────────────────────────────────────────── */}
      <SiteFooter />
    </div>
  );
}
