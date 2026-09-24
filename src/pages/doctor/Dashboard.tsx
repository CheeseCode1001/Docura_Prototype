import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { Card, StatCard, SectionHeader, Avatar, Badge, Button, ProgressBar, C } from "@/components/ui";
import { DOCTORS, DOCTOR_PATIENTS } from "@/data/mock";

function Metric({ label, value, detail, page, color }: { label: string; value: string | number; detail: string; page: string; color?: string }) {
  const { navigate } = useApp();
  return (
    <button onClick={() => navigate(page)} className="text-left w-full">
      <StatCard label={label} value={value} icon={<span className="text-xs font-bold" style={{ color: C.navy }}>DOC</span>} sub={detail} color={color} />
    </button>
  );
}

export default function DoctorDashboard() {
  const { navigate, domain, activeWorkspaceRole } = useApp();
  const doc = DOCTORS[0];
  const doctorConsultations = domain.consultations.filter((item) => item.doctorId === doc.id);
  const doctorFollowUps = domain.followUps.filter((item) => item.doctorId === doc.id);
  const dueFollowUps = doctorFollowUps.filter((item) => item.status === "upcoming").length;
  const activePlans = domain.carePlans.filter((item) => item.doctorId === doc.id && item.status === "active").length;
  const unreadMessages = domain.messages.filter((item) => item.isDoctor === false && item.status === "unread").length;
  const verification = domain.verificationDecisions.find((item) => item.id === "v1");
  const verificationLabel = verification?.status === "approved" ? "Verified" : verification?.status === "rejected" ? "Restricted" : "Under review";

  // Dynamic Patient Alerts calculations
  const unresolvedAlerts = domain.patientAlerts.filter((a) => a.status === "active");
  const urgentAlerts = unresolvedAlerts.filter((a) => a.severity === "high");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <AppShell role="doctor" topBarTitle="Clinical Workspace Dashboard">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6" style={{ fontFamily: "var(--font-body)" }}>
        {/* Top Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: C.amber }}>
                Clinical workspace
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {activeWorkspaceRole === "prescribing" ? "Prescribing Doctor Mode" : "Personal Doctor Mode"}
              </span>
            </div>
            <h1 className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              {greeting}, {doc.name}.
            </h1>
            <p className="text-sm mt-1" style={{ color: C.muted }}>
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} · Proactive continuity & high-integrity practice.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <Badge variant={verification?.status === "approved" ? "green" : "amber"}>{verificationLabel}</Badge>
              <p className="text-xs mt-1" style={{ color: C.muted }}>ID: DOC-NG-8842</p>
            </div>
            <Avatar src={doc.photo} name={doc.name} size={48} />
          </div>
        </div>

        {/* Urgent Patient Alerts Banner */}
        {urgentAlerts.length > 0 && (
          <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
                !
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-red-950">
                    {urgentAlerts.length} High-Risk Patient Alerts Require Action
                  </h3>
                  <span className="bg-red-200 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    6-Hour Monitoring Loop
                  </span>
                </div>
                <p className="text-xs text-red-800 mt-0.5">
                  {urgentAlerts[0]?.patientName}: {urgentAlerts[0]?.title} — {urgentAlerts[0]?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => navigate("doctor-patient-alerts")}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2"
              >
                Review Patient Alerts ({unresolvedAlerts.length})
              </Button>
            </div>
          </div>
        )}

        {/* Quick Workflow Action Shortcuts */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => navigate("doctor-patient-alerts")} className="bg-amber-600 hover:bg-amber-700 text-white">
            🔔 Patient Alerts ({unresolvedAlerts.length})
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate("consultation-room", { doctorId: "d1" })}>
            Start Care Episode
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate("doctor-labs")}>
            🧪 Lab Orders
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate("doctor-follow-ups")}>
            📅 Follow-ups & Check-ins
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate("doctor-grow-practice")}>
            📈 Grow My Panel
          </Button>
          {activeWorkspaceRole === "prescribing" && (
            <Button size="sm" onClick={() => navigate("prescribing-workspace")} className="bg-purple-700 hover:bg-purple-800 text-white">
              ⚕️ Prescribing Queue (2 pending)
            </Button>
          )}
        </div>

        {/* Top 4 Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Metric label="Patient Alerts" value={unresolvedAlerts.length} detail="Proactive risk flags" page="doctor-patient-alerts" color="#FEE2E2" />
          <Metric label="Active Patients" value={DOCTOR_PATIENTS.length} detail="Docura Care panel" page="doctor-patients" color="#DCFCE7" />
          <Metric label="Pending Labs" value={domain.labOrders?.filter(l => l.status === "ordered" || l.status === "abnormal").length || 3} detail="Diagnostic loop" page="doctor-labs" color={C.amberLight} />
          <Metric label="Follow-ups Due" value={dueFollowUps} detail="Monthly check-ins & visits" page="doctor-follow-ups" color="#E0E7FF" />
        </div>

        {/* Main Grid: Today's Care + Needs Attention */}
        <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-5 items-start">
          <Card>
            <SectionHeader
              title="Today's Care Episode Schedule"
              action="All consultations"
              onAction={() => navigate("doctor-consultations")}
            />
            <div className="flex flex-col divide-y" style={{ borderColor: C.border }}>
              <div className="py-4 flex flex-wrap items-center gap-3">
                <div className="w-12 text-center">
                  <p className="text-xs font-bold" style={{ color: C.navy }}>Now</p>
                  <p className="text-[11px]" style={{ color: C.muted }}>12:30</p>
                </div>
                <Avatar name="Chidinma Eze" size={38} />
                <div className="flex-1 min-w-[160px]">
                  <p className="text-sm font-semibold" style={{ color: C.navy }}>Chidinma Eze</p>
                  <p className="text-xs" style={{ color: C.muted }}>Docura Now · Persistent stomach pain</p>
                </div>
                <Badge variant="green">Paid · Waiting</Badge>
                <Button size="sm" onClick={() => navigate("doctor-consultations")}>Open Episode</Button>
              </div>

              {DOCTOR_PATIENTS.slice(0, 2).map((patient) => (
                <div key={patient.id} className="py-4 flex flex-wrap items-center gap-3">
                  <div className="w-12 text-center">
                    <p className="text-xs font-bold" style={{ color: C.navy }}>Next</p>
                    <p className="text-[11px]" style={{ color: C.muted }}>Today</p>
                  </div>
                  <Avatar src={patient.photo} name={patient.name} size={38} />
                  <div className="flex-1 min-w-[160px]">
                    <p className="text-sm font-semibold" style={{ color: C.navy }}>{patient.name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>
                      {patient.type === "care" ? "Docura Care" : "Docura Now"} · {patient.nextAction}
                    </p>
                  </div>
                  <Badge variant="amber">Upcoming</Badge>
                  <Button size="sm" variant="outline" onClick={() => navigate("doctor-consultations")}>
                    Care Note
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Needs Immediate Attention" action="View all" onAction={() => navigate("doctor-patient-alerts")} />
            <div className="flex flex-col gap-2.5">
              {unresolvedAlerts.slice(0, 4).map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => navigate("doctor-patient-alerts")}
                  className="text-left p-3 rounded-xl border hover:border-amber-300 transition-colors bg-stone-50/60"
                  style={{ borderColor: C.border }}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                        alert.severity === "high" ? "bg-red-500" : alert.severity === "medium" ? "bg-amber-500" : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-stone-900 truncate">{alert.patientName}</p>
                        <span className="text-[10px] text-stone-400">{alert.timestamp}</span>
                      </div>
                      <p className="text-xs font-medium text-stone-700 truncate">{alert.title}</p>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{alert.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Practice Pulse, Diagnostic Activity & Panels */}
        <div className="grid lg:grid-cols-3 gap-5">
          <Card>
            <SectionHeader title="Active Panel Overview" action="Grow Panel" onAction={() => navigate("doctor-grow-practice")} />
            {DOCTOR_PATIENTS.slice(0, 3).map((patient) => (
              <button
                key={patient.id}
                onClick={() => navigate("doctor-patients")}
                className="w-full flex items-center gap-3 py-3 border-b last:border-0 text-left"
                style={{ borderColor: C.border }}
              >
                <Avatar src={patient.photo} name={patient.name} size={34} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: C.navy }}>{patient.name}</p>
                  <p className="text-xs truncate" style={{ color: C.muted }}>{patient.nextAction}</p>
                </div>
                {patient.crossBorder && <Badge variant="amber">Cross-border</Badge>}
              </button>
            ))}
          </Card>

          <Card>
            <SectionHeader title="Diagnostics & Labs" action="All Orders" onAction={() => navigate("doctor-labs")} />
            <div className="flex flex-col gap-3 py-1">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-900">1 Critical Lab Abnormal</span>
                  <Badge variant="coral">Action Req.</Badge>
                </div>
                <p className="text-xs text-red-800 mt-1">Adaeze Okonkwo: Serum Potassium 5.7 mmol/L</p>
                <Button size="sm" onClick={() => navigate("doctor-labs")} className="mt-2 text-xs w-full bg-red-600 hover:bg-red-700 text-white">
                  Review & Adjust Medication
                </Button>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-800">Lipid & Metabolic Routine</span>
                  <Badge variant="green">Ready</Badge>
                </div>
                <p className="text-xs text-stone-600 mt-1">Babatunde Lawal: HbA1c 6.8% (Target met)</p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Practice Health Pulse" action="Earnings" onAction={() => navigate("doctor-earnings")} />
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: C.muted }}>Monthly Check-in Response</span>
                  <strong style={{ color: C.navy }}>94%</strong>
                </div>
                <ProgressBar value={94} />
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: C.muted }}>Patient Retention Rate</span>
                <strong style={{ color: C.navy }}>96.2%</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: C.muted }}>Prescribing Handoff SLA</span>
                <strong style={{ color: "#16a34a" }}>100% (&lt; 24h)</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: C.muted }}>Current Monthly Retainers</span>
                <strong style={{ color: C.navy }}>N1,450,000</strong>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate("doctor-earnings")}>
                View Financial Payouts
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}