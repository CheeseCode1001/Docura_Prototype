import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { Avatar, VerifiedBadge, AvailabilityDot, C } from "@/components/ui";
import { PATIENT, DOCTORS, CONSULTATIONS, MEDICATIONS } from "@/data/mock";

const CARD = { backgroundColor: "white", border: "1px solid rgba(21,95,84,0.08)", borderRadius: 20, boxShadow: "0 12px 32px rgba(21,95,84,0.05)" };
const BG = "#FAFAF7";

function Ico({ type }: { type: string }) {
  const s = { stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  switch (type) {
    case "consult": return <svg width="18" height="18" viewBox="0 0 24 24" {...s}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
    case "care": return <svg width="18" height="18" viewBox="0 0 24 24" {...s}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>;
    case "meds": return <svg width="18" height="18" viewBox="0 0 24 24" {...s}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z" /></svg>;
    case "plan": return <svg width="18" height="18" viewBox="0 0 24 24" {...s}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><path d="M9 5a2 2 0 002 2h2a2 2 0 002-2 2 2 0 00-2-2h-2a2 2 0 00-2 2z" /><path d="M9 12h6M9 16h6" /></svg>;
    case "followup": return <svg width="18" height="18" viewBox="0 0 24 24" {...s}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
    case "msg": return <svg width="18" height="18" viewBox="0 0 24 24" {...s}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
    case "check": return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>;
    case "arrow": return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>;
    default: return null;
  }
}

export default function PatientDashboard() {
  const { navigate, domain } = useApp();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const activeSubscription = domain.subscriptions.find((subscription) => subscription.patientId === PATIENT.id && subscription.status === "active");
  const doc = DOCTORS.find((d) => d.id === (activeSubscription?.doctorId || PATIENT.personalDoctorId))!;
  const prescDoc = DOCTORS.find((d) => d.id === PATIENT.prescribingDoctorId)!;
  const activePlan = domain.carePlans.find((p) => p.status === "active");
  const upcomingFollowUp = domain.followUps.find((f) => f.status === "upcoming");
  const currentMeds = MEDICATIONS.filter((m) => m.status === "current");
  const medsTaken = currentMeds.filter((m) => m.todayTaken).length;
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <AppShell role="patient">
      <div className="editorial-page min-h-full w-full flex flex-col gap-8" style={{ backgroundColor: BG, fontFamily: "var(--font-body)" }}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs mb-0.5" style={{ color: "#a0a9bc" }}>{today}</p>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              {greeting}, {PATIENT.name.split(" ")[0]}.
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#8892a4" }}>Here's your care at a glance.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate("patient-care")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
              style={{ backgroundColor: "white", borderColor: "#e8ebf2", color: C.navy }}
            >
              <div style={{ color: C.amber }}><Ico type="care" /></div>
              Docura Care
            </button>
            <button
              onClick={() => navigate("docura-now-flow")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: C.amber }}
            >
              <Ico type="consult" />
              Talk to a Doctor
            </button>
          </div>
        </div>

        {/* ── Upcoming Care Hero ─────────────────────────────── */}
        {upcomingFollowUp ? (
          <button
            onClick={() => navigate("follow-ups")}
            className="w-full text-left p-5 flex items-center gap-5 transition-all hover:opacity-95"
            style={{ ...CARD, border: "none", background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMuted} 100%)` }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(232,160,32,0.2)" }}>
              <div style={{ color: C.amber }}><Ico type="followup" /></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>Upcoming Follow-up</p>
              <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                {upcomingFollowUp.doctorName}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                {upcomingFollowUp.scheduledDate} · {upcomingFollowUp.reason.split("—")[0].trim()}
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: C.amber, color: "white" }}>
                Confirmed
              </span>
              <div style={{ color: "rgba(255,255,255,0.4)" }}><Ico type="arrow" /></div>
            </div>
          </button>
        ) : (
          <div className="p-6 md:p-8 flex items-center gap-5" style={{ ...CARD, border: "none", background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMuted} 100%)` }}>
            <div>
              <p className="text-base font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>No upcoming appointments</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Ready when you are. Start a consultation or book with your doctor.</p>
            </div>
            <button
              onClick={() => navigate("docura-now-flow")}
              className="ml-auto shrink-0 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: C.amber, color: "white" }}
            >
              Start now
            </button>
          </div>
        )}

        {/* ── Main 3-col layout ──────────────────────────────── */}
        <div className="grid w-full min-w-0 lg:grid-cols-12 gap-5">

          {/* Col 1: Doctor + Care Plan */}
          <div className="flex w-full min-w-0 flex-col gap-4 lg:col-span-4">

            {/* Personal Doctor */}
            <div className="p-5" style={CARD}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold" style={{ color: C.navy }}>Your Doctor</p>
                <button onClick={() => navigate("care-team")} className="text-xs font-semibold hover:opacity-70" style={{ color: C.amber }}>Care team →</button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Avatar src={doc.photo} name={doc.name} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-sm font-bold truncate" style={{ color: C.navy }}>{doc.name}</p>
                    <VerifiedBadge label="" />
                  </div>
                  <p className="text-xs mb-1" style={{ color: "#a0a9bc" }}>{doc.specialty}</p>
                  <AvailabilityDot status={doc.availability} />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("patient-chat")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                  style={{ backgroundColor: C.amberLight, color: C.amber }}
                >
                  <Ico type="msg" /> Message
                </button>
                <button
                  onClick={() => navigate("docura-now-flow")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-80"
                  style={{ backgroundColor: C.navy }}
                >
                  <Ico type="consult" /> Consult
                </button>
              </div>

              {/* Prescribing doc */}
              <div className="mt-3 pt-3 flex items-center gap-2.5" style={{ borderTop: "1px solid #f0f2f7" }}>
                <Avatar src={prescDoc.photo} name={prescDoc.name} size={30} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: C.navy }}>{prescDoc.name}</p>
                  <p className="text-xs" style={{ color: "#a0a9bc" }}>Prescribing doctor</p>
                </div>
                <span className="px-2 py-0.5 rounded-lg text-xs font-semibold shrink-0" style={{ backgroundColor: "#e7effc", color: C.navy }}>Rx</span>
              </div>
            </div>

            {/* Active Care Plan */}
            {activePlan && (
              <button onClick={() => navigate("patient-care-plans")} className="p-5 text-left transition-all hover:shadow-md w-full" style={CARD}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold" style={{ color: C.navy }}>Active Care Plan</p>
                  <span className="text-xs font-bold" style={{ color: C.amber }}>{activePlan.progress}%</span>
                </div>
                <p className="text-xs mb-3" style={{ color: "#a0a9bc" }}>{activePlan.title}</p>
                <div className="rounded-full overflow-hidden mb-2" style={{ height: 6, backgroundColor: "#e8ebf2" }}>
                  <div className="h-full rounded-full" style={{ width: `${activePlan.progress}%`, backgroundColor: C.amber }} />
                </div>
                <div className="flex justify-between text-xs" style={{ color: "#a0a9bc" }}>
                  <span>{activePlan.goal}</span>
                  <span>Next review: {activePlan.nextReview}</span>
                </div>
              </button>
            )}

            {/* Documents quick link */}
            <button
              onClick={() => navigate("medical-documents")}
              className="p-4 flex items-center gap-3 text-left transition-all hover:opacity-90 w-full"
              style={{ ...CARD, background: `linear-gradient(135deg, #e8f0ff 0%, #f3e8ff 100%)` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "white" }}>
                <span style={{ fontSize: 20 }}>▣</span>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: C.navy }}>Medical documents</p>
                <p className="text-xs" style={{ color: "#8892a4" }}>Keep your reports and results together</p>
              </div>
              <div className="ml-auto" style={{ color: "#a0a9bc" }}><Ico type="arrow" /></div>
            </button>
          </div>

          {/* Col 2: Recent Consultations */}
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-5">
            <div className="p-5 flex-1" style={CARD}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold" style={{ color: C.navy }}>Recent Consultations</p>
                  <p className="text-xs mt-0.5" style={{ color: "#a0a9bc" }}>{domain.consultations.length} total this year</p>
                </div>
                <button onClick={() => navigate("patient-consultations")} className="text-xs font-semibold hover:opacity-70" style={{ color: C.amber }}>See all →</button>
              </div>

              <div className="flex flex-col divide-y" style={{ "--tw-divide-opacity": 1 } as React.CSSProperties}>
                {domain.consultations.slice(-5).reverse().map((c) => {
                  const dr = DOCTORS.find((d) => d.id === c.doctorId)!;
                  const isNow = c.type === "now";
                  return (
                    <button key={c.id} onClick={() => navigate("patient-consultations")}
                      className="flex items-center gap-3 py-3 w-full text-left hover:bg-gray-50 transition-colors -mx-1 px-1 rounded-lg">
                      <Avatar src={dr.photo} name={dr.name} size={36} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: C.navy }}>{dr.name}</p>
                        <p className="text-xs truncate" style={{ color: "#a0a9bc" }}>{c.summary}</p>
                        <p className="text-xs" style={{ color: "#c0c8d8" }}>{c.date}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: isNow ? C.amberLight : "#e7effc", color: isNow ? C.amber : C.navy }}>
                        {isNow ? "Now" : "Care"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prescriptions quick link */}
            <button
              onClick={() => navigate("patient-prescriptions")}
              className="p-4 flex items-center gap-3 text-left w-full transition-all hover:shadow-md"
              style={CARD}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#e7effc" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: C.navy }}>Prescriptions</p>
                <p className="text-xs" style={{ color: "#a0a9bc" }}>View and manage your prescriptions</p>
              </div>
              <div style={{ color: "#a0a9bc" }}><Ico type="arrow" /></div>
            </button>
          </div>

          {/* Col 3: Medications + quick access */}
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-3">

            {/* Medications */}
            <div className="p-5" style={CARD}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold" style={{ color: C.navy }}>Medications Today</p>
                  <p className="text-xs mt-0.5" style={{ color: "#a0a9bc" }}>{medsTaken} of {currentMeds.length} taken</p>
                </div>
                <button onClick={() => navigate("patient-medications")} className="text-xs font-semibold hover:opacity-70" style={{ color: C.amber }}>Manage →</button>
              </div>

              {/* Progress bar */}
              <div className="rounded-full overflow-hidden mb-4" style={{ height: 6, backgroundColor: "#e8ebf2" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${currentMeds.length ? (medsTaken / currentMeds.length) * 100 : 0}%`, backgroundColor: "#16a34a" }} />
              </div>

              <div className="flex flex-col gap-2">
                {currentMeds.map((med) => (
                  <div key={med.id} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: "#f8f9fc" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: med.todayTaken ? "#dcfce7" : "#fff7e6" }}>
                      <div style={{ color: med.todayTaken ? "#16a34a" : C.amber }}><Ico type="meds" /></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: C.navy }}>{med.name} {med.dosage}</p>
                      <p className="text-xs truncate" style={{ color: "#a0a9bc" }}>{med.frequency}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: med.todayTaken ? "#16a34a" : "#e4e8f0" }}>
                      {med.todayTaken && <div style={{ color: "white" }}><Ico type="check" /></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick access grid */}
            <div className="p-4" style={CARD}>
              <p className="text-sm font-bold mb-3" style={{ color: C.navy }}>Quick Access</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Health Timeline", page: "health-timeline", bg: "#fff7e6", color: C.amber, icon: "⏱" },
                  { label: "Care Plans", page: "patient-care-plans", bg: "#f0e7ff", color: "#8b5cf6", icon: "📋" },
                  { label: "Care Journey", page: "care-journey", bg: "#e7effc", color: "#0ea5e9", icon: "🗺" },
                  { label: "Emergency", page: "emergency-card", bg: "#fce7e7", color: "#e85d40", icon: "🚨" },
                  { label: "Health Passport", page: "health-passport", bg: "#e6f1ee", color: C.navy, icon: "🛂" },
                  { label: "Referrals", page: "patient-referrals", bg: "#fff7e6", color: C.amber, icon: "🔗" },
                  { label: "Docura TV", page: "tv-home", bg: "#f0e7ff", color: "#8b5cf6", icon: "▶" },
                  { label: "Support", page: "support-center", bg: "#e7effc", color: "#0ea5e9", icon: "🛟" },
                ].map((q) => (
                  <button key={q.page} onClick={() => navigate(q.page)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:opacity-85"
                    style={{ backgroundColor: q.bg }}>
                    <span style={{ fontSize: 22 }}>{q.icon}</span>
                    <p className="text-xs font-semibold text-center" style={{ color: q.color }}>{q.label}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom stat row ────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Consultations", value: CONSULTATIONS.length, sub: "this year", color: C.amber, bg: C.amberLight, page: "patient-consultations" },
            { label: "Active Meds", value: currentMeds.length, sub: `${medsTaken} taken today`, color: "#16a34a", bg: "#dcfce7", page: "patient-medications" },
            { label: "Care Plans", value: domain.carePlans.filter(p => p.status === "active").length, sub: activePlan ? `${activePlan.progress}% progress` : "active", color: "#8b5cf6", bg: "#f0e7ff", page: "patient-care-plans" },
            { label: "Follow-ups", value: domain.followUps.filter(f => f.status === "upcoming").length, sub: "upcoming", color: "#0ea5e9", bg: "#e7effc", page: "follow-ups" },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => navigate(s.page)}
              className="p-4 text-left transition-all hover:shadow-md"
              style={CARD}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "#8892a4" }}>{s.label}</p>
              <p className="text-3xl font-bold mb-0.5" style={{ fontFamily: "var(--font-display)", color: s.color }}>{s.value}</p>
              <p className="text-xs" style={{ color: "#a0a9bc" }}>{s.sub}</p>
            </button>
          ))}
        </div>

      </div>
    </AppShell>
  );
}
