import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Avatar, Badge, Button, C, SectionHeader, AvailabilityDot } from "@/components/ui";
import { CARE_TEAM } from "@/data/mock";
import { useApp } from "@/context/AppContext";

const COUNTRY_FLAGS: Record<string, string> = {
  Nigeria: "🇳🇬",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  Canada: "🇨🇦",
  Germany: "🇩🇪",
  France: "🇫🇷",
};

export default function CareTeam() {
  const { navigate, addToast, domain } = useApp();
  const [showExplainerModal, setShowExplainerModal] = useState(false);

  // Active cross-border prescription request if any
  const activeRxHandoff = domain.prescribingRequests?.find(
    (r) => r.patientName === "Adaeze Okonkwo" || r.patientId === "p1"
  ) || {
    id: "rx-demo",
    status: "approved" as const,
    medication: "Amlodipine 5mg Daily",
    indication: "Hypertension Stage 2 Escalation",
  };

  const personalDoc = {
    id: "doc-personal",
    name: "Dr. Oluwaseun Adeleke",
    role: "Personal Doctor",
    specialty: "Consultant Family Physician",
    country: "United Kingdom",
    qualifications: "MBBS, MRCGP (UK), FWACP",
    doctorId: "DOC-UK-9142",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    availability: "online" as const,
    since: "2025-06-15",
    consultations: 8,
    scope: "Manages your ongoing health, monthly check-ins, chronic condition plans, and proactive alerts.",
  };

  const prescribingDoc = {
    id: "doc-prescriber",
    name: "Dr. Emeka Okafor",
    role: "Local Prescribing Doctor",
    specialty: "Cardiovascular Medicine & General Practice",
    country: "Nigeria",
    qualifications: "MBBS, FMCP (Nigeria), MDCN #48291",
    doctorId: "DOC-NG-8842",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    availability: "available-today" as const,
    since: "2025-08-01",
    consultations: 3,
    scope: "Statutorily registered in Nigeria to validate cross-border care notes, verify local drug safety, and issue legally binding pharmacy prescriptions.",
  };

  return (
    <AppShell role="patient" topBarTitle="Your Care Team" showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Your Care Team
            </h1>
            <p className="text-sm mt-0.5 text-stone-500">
              Coordinated care between your dedicated Personal Doctor and verified Local Prescriber.
            </p>
          </div>
          <button
            onClick={() => setShowExplainerModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors self-start"
          >
            <span>💡 Why are there two doctors?</span>
          </button>
        </div>

        {/* Educational Explainer Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <h2 className="text-sm font-bold text-amber-950">
                Cross-Border Clinical Collaboration Model
              </h2>
              <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
                Your <strong>Personal Doctor</strong> in the UK guides your overall health journey, while your <strong>Local Prescribing Doctor</strong> in Nigeria provides independent verification and statutory prescription issuance.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowExplainerModal(true)}
            className="shrink-0 text-xs bg-white border-amber-300 text-amber-900 hover:bg-amber-100"
          >
            How it works
          </Button>
        </div>

        {/* Active Prescription Status Tracker (strictly hides internal D2D clinical notes) */}
        <div className="p-5 rounded-2xl bg-white border shadow-xs" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Current Cross-Border Prescription</p>
              <h3 className="text-sm font-bold text-stone-900 mt-0.5">
                {activeRxHandoff.medication}
              </h3>
            </div>
            <Badge variant={activeRxHandoff.status === "approved" ? "green" : "amber"}>
              {activeRxHandoff.status === "approved" ? "Prescription Issued" : "Prescription In Progress"}
            </Badge>
          </div>

          {/* 3-Step Progress Bar */}
          <div className="relative flex items-center justify-between mt-2 mb-4">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: activeRxHandoff.status === "approved" ? "100%" : "50%" }}
            />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                ✓
              </div>
              <span className="text-[11px] font-semibold text-stone-800 mt-1">Recommended</span>
              <span className="text-[10px] text-stone-400">Dr. Adeleke (UK)</span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                  activeRxHandoff.status === "approved" ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
                }`}
              >
                {activeRxHandoff.status === "approved" ? "✓" : "2"}
              </div>
              <span className="text-[11px] font-semibold text-stone-800 mt-1">Statutory Review</span>
              <span className="text-[10px] text-stone-400">Dr. Okafor (Nigeria)</span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                  activeRxHandoff.status === "approved" ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-500"
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-semibold text-stone-800 mt-1">Prescription Ready</span>
              <span className="text-[10px] text-stone-400">Pharmacy Delivery</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 flex items-center justify-between">
            <span>
              Status:{" "}
              <strong>
                {activeRxHandoff.status === "approved"
                  ? "Approved and statutory e-prescription generated for local pharmacy fulfillment."
                  : "Under review by Dr. Emeka Okafor for local EMDEX interaction safety."}
              </strong>
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("patient-prescriptions")}
              className="text-xs shrink-0 ml-3"
            >
              View Prescription
            </Button>
          </div>
        </div>

        {/* Doctor 1: Personal Doctor */}
        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: C.border }}>
          <div className="h-2 w-full bg-amber-600" />
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar src={personalDoc.photo} name={personalDoc.name} size={64} />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-stone-900">{personalDoc.name}</h3>
                  <Badge variant="amber">Personal Doctor</Badge>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                    {personalDoc.doctorId}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {personalDoc.specialty} · {COUNTRY_FLAGS[personalDoc.country]} {personalDoc.country}
                </p>
                <p className="text-[11px] text-stone-400">{personalDoc.qualifications}</p>
                <div className="mt-1">
                  <AvailabilityDot status="online" />
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200/60 leading-relaxed">
              <strong>Role in your care:</strong> {personalDoc.scope}
            </p>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-amber-50/50 text-xs">
              <div>
                <p className="text-stone-400">Doctor since</p>
                <p className="font-semibold text-stone-800">June 2025 (9 months)</p>
              </div>
              <div>
                <p className="text-stone-400">Consultations completed</p>
                <p className="font-semibold text-stone-800">{personalDoc.consultations} sessions</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={() => navigate("patient-chat")} className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
                Message Dr. Adeleke
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate("doctor-profile")} className="text-xs">
                View Full Credentials
              </Button>
            </div>
          </div>
        </div>

        {/* Doctor 2: Local Prescribing Doctor */}
        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: C.border }}>
          <div className="h-2 w-full bg-stone-800" />
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar src={prescribingDoc.photo} name={prescribingDoc.name} size={64} />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-stone-900">{prescribingDoc.name}</h3>
                  <Badge variant="navy">Local Prescribing Doctor</Badge>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                    {prescribingDoc.doctorId}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {prescribingDoc.specialty} · {COUNTRY_FLAGS[prescribingDoc.country]} {prescribingDoc.country}
                </p>
                <p className="text-[11px] text-stone-400">{prescribingDoc.qualifications}</p>
                <div className="mt-1">
                  <AvailabilityDot status="available-today" />
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200/60 leading-relaxed">
              <strong>Role in your care:</strong> {prescribingDoc.scope}
            </p>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-100/70 text-xs">
              <div>
                <p className="text-stone-400">Prescribing Jurisdiction</p>
                <p className="font-semibold text-stone-800">Lagos, Nigeria (MDCN #48291)</p>
              </div>
              <div>
                <p className="text-stone-400">Prescriptions Authorized</p>
                <p className="font-semibold text-stone-800">{prescribingDoc.consultations} statutory orders</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => addToast("Dr. Okafor is reviewing current medication orders", "info")} className="text-xs">
                Clinical Overview
              </Button>
            </div>
          </div>
        </div>

        {/* Modal: Why are there two doctors? */}
        {showExplainerModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: C.border }}>
                <h3 className="font-bold text-lg text-stone-900">Why are there two doctors in my care team?</h3>
                <button onClick={() => setShowExplainerModal(false)} className="text-stone-400 hover:text-stone-600 text-lg">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <h4 className="font-bold text-amber-950 mb-1">1. Your Personal Doctor (UK or Global)</h4>
                  <p>
                    Your Personal Doctor is your primary health champion. They maintain a continuous relationship with you, analyze your blood pressure and glucose trends, and build your long-term wellness strategy.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-950 mb-1">2. Your Local Prescribing Doctor (In Nigeria)</h4>
                  <p>
                    By Nigerian medical regulation, only a medical doctor licensed and in good standing with the Medical and Dental Council of Nigeria (MDCN) can issue a legally valid prescription or lab test for you.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <h4 className="font-bold mb-1">3. Safe & Rigorous Cross-Border Protection</h4>
                  <p>
                    Your Personal Doctor recommends the therapy based on your history. Your Local Prescriber performs an independent clinical check against local drug safety (EMDEX) and local pharmacy availability, signing off with full statutory legal responsibility.
                  </p>
                </div>
              </div>

              <Button fullWidth onClick={() => setShowExplainerModal(false)} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs">
                Understood
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
