import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { AiDisclosure, AlertBanner, Avatar, BarChart, Badge, Button, C, Card, EmptyState, FilterBar, Input, Modal, PageHeader, ProgressBar, ResponsiveTable, SectionHeader, Select, Sparkline, StatusPill, Toggle } from "@/components/ui";
import { api, formatMoney } from "@/services/api";
import type { Referral } from "@/data/types";

const DOCTOR = () => api.doctors()[0];

// ─── Analytics (V2.1) ─────────────────────────────────────────────────────────
export function DoctorAnalytics() {
  const { navigate, domain } = useApp();
  const doctor = DOCTOR();
  const analytics = api.doctorAnalytics();
  const [range, setRange] = useState("6m");
  const slice = range === "3m" ? 3 : 6;
  const months = analytics.months.slice(-slice);
  const consultations = analytics.consultations.slice(-slice);
  const earnings = analytics.earnings.slice(-slice);
  const relationships = analytics.newCareRelationships.slice(-slice);
  const totalEarnings = earnings.reduce((sum, value) => sum + value, 0);
  const totalConsultations = consultations.reduce((sum, value) => sum + value, 0);

  return (
    <AppShell role="doctor" topBarTitle="Practice analytics">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Practice"
          title="How your practice is doing."
          subtitle="Consultation volume, care relationships and responsiveness over time."
          actions={<>
            <Button variant="outline" onClick={() => navigate("doctor-earnings")}>Earnings & payouts</Button>
            <Button variant="outline" onClick={() => navigate("doctor-patients")}>Patients</Button>
          </>}
        />

        <FilterBar value={range} onChange={setRange} options={[{ id: "3m", label: "Last 3 months" }, { id: "6m", label: "Last 6 months" }]} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Consultations", value: totalConsultations, detail: `${months[0]} – ${months[months.length - 1]}` },
            { label: "Gross earnings", value: formatMoney(doctor.currency, totalEarnings), detail: "Before Docura fee" },
            { label: "Follow-up completion", value: `${analytics.followUpCompletion}%`, detail: "Patients attending" },
            { label: "Avg. response time", value: `${Math.round(analytics.averageResponseMinutes / 60)}h ${analytics.averageResponseMinutes % 60}m`, detail: "To first reply" },
          ].map((metric) => (
            <Card key={metric.label}>
              <p className="text-xs" style={{ color: C.muted }}>{metric.label}</p>
              <p className="text-xl sm:text-2xl font-bold mt-1 break-words" style={{ color: C.navy }}>{metric.value}</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>{metric.detail}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <Card>
            <SectionHeader title="Consultations per month" subtitle="Docura Now and Docura Care combined" />
            <BarChart labels={months} values={consultations} color={C.navy} />
          </Card>
          <Card>
            <SectionHeader title="Earnings per month" subtitle="Gross, before platform fee" />
            <BarChart labels={months} values={earnings} color={C.amber} format={(value) => `${Math.round(value / 1000)}k`} />
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <Card>
            <SectionHeader title="New care relationships" />
            <BarChart labels={months} values={relationships} color={C.coral} />
          </Card>
          <Card>
            <SectionHeader title="Patient rating trend" />
            <p className="text-3xl font-bold" style={{ color: C.navy }}>{analytics.ratingTrend[analytics.ratingTrend.length - 1]}</p>
            <Sparkline values={analytics.ratingTrend} />
            <p className="text-xs mt-2" style={{ color: C.muted }}>Based on {doctor.reviews} reviews across {doctor.patients} patients.</p>
          </Card>
          <Card>
            <SectionHeader title="Continuity" subtitle="Patients still in care after 6 months" />
            <p className="text-3xl font-bold mb-3" style={{ color: C.navy }}>{analytics.patientRetention}%</p>
            <ProgressBar value={analytics.patientRetention} />
            <p className="text-xs mt-3" style={{ color: C.muted }}>{domain.subscriptions.length} active subscription{domain.subscriptions.length === 1 ? "" : "s"} recorded in this session.</p>
          </Card>
        </div>

        <AiDisclosure detail="Trends are computed from your own consultation and payment records. Docura does not use them to rank your clinical judgement." />
      </div>
    </AppShell>
  );
}

// ─── Referrals (V2.2) ─────────────────────────────────────────────────────────
export function DoctorReferrals() {
  const { domain, createReferral, updateReferral, addToast, navigate } = useApp();
  const doctor = DOCTOR();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [kind, setKind] = useState<"doctor" | "pharmacy">("doctor");
  const [patient, setPatient] = useState(api.doctorPatients()[0]?.name || "");
  const [target, setTarget] = useState(api.doctors()[1]?.name || "");
  const [reason, setReason] = useState("");

  const referrals = domain.referrals.filter((item) => filter === "all" || item.status === filter);
  const targets = kind === "doctor"
    ? api.doctors().filter((item) => item.id !== doctor.id).map((item) => ({ value: item.name, label: `${item.name} — ${item.specialty}, ${item.country}` }))
    : api.pharmacies().map((item) => ({ value: item.name, label: `${item.name} — ${item.city}` }));

  function submit() {
    if (!reason.trim()) { addToast("error", "Add a reason for the referral."); return; }
    const chosen = kind === "doctor" ? api.doctors().find((item) => item.name === target) : api.pharmacies().find((item) => item.name === target);
    createReferral({
      kind,
      patientId: api.doctorPatients().find((item) => item.name === patient)?.id || "p1",
      patientName: patient,
      fromDoctor: doctor.name,
      toName: target,
      toDetail: chosen && "specialty" in chosen ? `${chosen.specialty} · ${chosen.country}` : chosen && "city" in chosen ? `Dispensing · ${chosen.city}` : "",
      reason,
    });
    setOpen(false);
    setReason("");
    addToast("success", "Referral sent and added to the patient's record.");
  }

  return (
    <AppShell role="doctor" topBarTitle="Referrals">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Coordination"
          title="Referrals"
          subtitle="Refer to a colleague or a pharmacy. The patient sees every referral you make and what was shared."
          actions={<Button onClick={() => setOpen(true)}>New referral</Button>}
        />

        <AlertBanner type="info" title="Referrals share a summary, not the whole record" body="A referral carries your letter and the health summary the patient has agreed to share. It does not open your consultation notes." />

        <FilterBar
          value={filter}
          onChange={setFilter}
          options={[{ id: "all", label: "All" }, { id: "pending", label: "Pending" }, { id: "accepted", label: "Accepted" }, { id: "completed", label: "Completed" }, { id: "declined", label: "Declined" }]}
        />

        <Card padding={false}>
          <div className="p-4">
            <ResponsiveTable<Referral>
              rows={referrals}
              rowKey={(row) => row.id}
              empty="No referrals in this view."
              columns={[
                { key: "patient", header: "Patient", primary: true, render: (row) => <span className="font-semibold">{row.patientName}</span> },
                { key: "to", header: "Referred to", render: (row) => <div><p>{row.toName}</p><p className="text-xs" style={{ color: C.muted }}>{row.toDetail}</p></div> },
                { key: "kind", header: "Type", render: (row) => <Badge variant={row.kind === "doctor" ? "navy" : "amber"}>{row.kind}</Badge> },
                { key: "reason", header: "Reason", render: (row) => <span className="text-xs" style={{ color: C.muted }}>{row.reason}</span> },
                { key: "date", header: "Date", render: (row) => row.date },
                { key: "status", header: "Status", render: (row) => <StatusPill status={row.status} /> },
                {
                  key: "actions",
                  header: "Action",
                  render: (row) => (row.status === "pending"
                    ? <div className="flex gap-2">
                      <Button size="sm" onClick={() => { updateReferral(row.id, "accepted"); addToast("success", "Referral accepted."); }}>Accept</Button>
                      <Button size="sm" variant="ghost" onClick={() => { updateReferral(row.id, "declined"); addToast("info", "Referral declined."); }}>Decline</Button>
                    </div>
                    : row.status === "accepted"
                      ? <Button size="sm" variant="outline" onClick={() => { updateReferral(row.id, "completed"); addToast("success", "Referral completed."); }}>Mark complete</Button>
                      : <span className="text-xs" style={{ color: C.muted }}>—</span>),
                },
              ]}
            />
          </div>
        </Card>

        <Card>
          <SectionHeader title="Pharmacy network" subtitle="Verified dispensing partners" action="Patient view" onAction={() => navigate("patient-referrals")} />
          <div className="grid sm:grid-cols-3 gap-3">
            {api.pharmacies().map((pharmacy) => (
              <div key={pharmacy.id} className="rounded-xl border p-4" style={{ borderColor: C.border }}>
                <p className="text-sm font-semibold" style={{ color: C.navy }}>{pharmacy.name}</p>
                <p className="text-xs mt-1" style={{ color: C.muted }}>{pharmacy.city} · {pharmacy.distance}</p>
                <p className="text-xs mt-2" style={{ color: C.muted }}>{pharmacy.dispenses.join(", ")}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create a referral">
        <div className="flex flex-col gap-4">
          <Select label="Referral type" value={kind} onChange={(value) => { setKind(value as "doctor" | "pharmacy"); setTarget(value === "doctor" ? api.doctors()[1].name : api.pharmacies()[0].name); }} options={[{ value: "doctor", label: "To a doctor" }, { value: "pharmacy", label: "To a pharmacy" }]} />
          <Select label="Patient" value={patient} onChange={setPatient} options={api.doctorPatients().map((item) => ({ value: item.name, label: item.name }))} />
          <Select label={kind === "doctor" ? "Refer to" : "Pharmacy"} value={target} onChange={setTarget} options={targets} />
          <Input label="Reason for referral" value={reason} onChange={setReason} multiline rows={3} placeholder="What should the receiving clinician know?" />
          <Button onClick={submit} fullWidth>Send referral</Button>
        </div>
      </Modal>
    </AppShell>
  );
}

// ─── Availability ─────────────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SLOTS = ["08:00 – 12:00", "12:00 – 16:00", "16:00 – 20:00"];

export function DoctorAvailability() {
  const { addToast, navigate } = useApp();
  const doctor = DOCTOR();
  const [acceptingNow, setAcceptingNow] = useState(true);
  const [acceptingCare, setAcceptingCare] = useState(true);
  const [schedule, setSchedule] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    DAYS.forEach((day, dayIndex) => SLOTS.forEach((slot, slotIndex) => {
      initial[`${day}-${slot}`] = dayIndex < 5 && slotIndex < 2;
    }));
    return initial;
  });
  const activeSlots = Object.values(schedule).filter(Boolean).length;

  return (
    <AppShell role="doctor" topBarTitle="Availability">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Practice"
          title="When you are available"
          subtitle="Your availability drives what patients see in discovery and which Docura Now requests reach you."
          actions={<Button onClick={() => addToast("success", `Availability saved — ${activeSlots} slots per week.`)}>Save availability</Button>}
        />

        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <p className="text-xs" style={{ color: C.muted }}>Docura Now requests</p>
            <div className="mt-3"><Toggle checked={acceptingNow} onChange={(value) => { setAcceptingNow(value); addToast("info", value ? "You will receive Docura Now requests." : "Docura Now requests paused."); }} label={acceptingNow ? "Accepting" : "Paused"} /></div>
          </Card>
          <Card>
            <p className="text-xs" style={{ color: C.muted }}>New Docura Care patients</p>
            <div className="mt-3"><Toggle checked={acceptingCare} onChange={(value) => { setAcceptingCare(value); addToast("info", value ? "Accepting new care relationships." : "New care relationships paused."); }} label={acceptingCare ? "Accepting" : "Paused"} /></div>
          </Card>
          <Card>
            <p className="text-xs" style={{ color: C.muted }}>Weekly capacity</p>
            <p className="text-2xl font-bold mt-1" style={{ color: C.navy }}>{activeSlots} slots</p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{doctor.responseTime}</p>
          </Card>
        </div>

        <Card padding={false}>
          <div className="p-5 border-b" style={{ borderColor: C.border }}>
            <h2 className="font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Weekly schedule</h2>
            <p className="text-xs mt-1" style={{ color: C.muted }}>Tap a block to open or close it. Times shown in your local timezone.</p>
          </div>
          <div className="p-4 scroll-x">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-[100px_repeat(3,1fr)] gap-2 mb-2">
                <span />
                {SLOTS.map((slot) => <span key={slot} className="text-xs font-semibold text-center" style={{ color: C.muted }}>{slot}</span>)}
              </div>
              {DAYS.map((day) => (
                <div key={day} className="grid grid-cols-[100px_repeat(3,1fr)] gap-2 mb-2 items-center">
                  <span className="text-sm font-medium" style={{ color: C.navy }}>{day.slice(0, 3)}</span>
                  {SLOTS.map((slot) => {
                    const key = `${day}-${slot}`;
                    const active = schedule[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setSchedule((current) => ({ ...current, [key]: !current[key] }))}
                        className="rounded-xl py-3 text-xs font-semibold border transition-colors"
                        style={{ backgroundColor: active ? "#E6F1EE" : "white", borderColor: active ? C.navy : C.border, color: active ? C.navy : C.muted }}
                      >
                        {active ? "Open" : "Closed"}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeader title="How availability affects discovery" subtitle="Docura explains ranking rather than hiding it" />
          <ul className="flex flex-col gap-2 text-sm" style={{ color: C.label }}>
            {[
              "Open slots in the next 24 hours push you higher for Docura Now searches.",
              "Response time is measured from a patient's first message, not from when you open the app.",
              "Pausing new patients never affects the patients already in your care.",
              "Newly verified doctors receive rotation exposure so ranking does not simply reward seniority.",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: C.amber }} />
                {line}
              </li>
            ))}
          </ul>
          <Button size="sm" variant="outline" className="mt-4" onClick={() => navigate("doctor-analytics")}>See your practice analytics</Button>
        </Card>
      </div>
    </AppShell>
  );
}

// ─── Doctor-side patient snapshot used by the referral flow ───────────────────
export function DoctorPatientSnapshot() {
  const { navigate, params } = useApp();
  const patient = api.doctorPatients().find((item) => item.id === params.patientId);
  if (!patient) {
    return (
      <AppShell role="doctor" topBarTitle="Patient" showTopBarBack>
        <div className="px-4 md:px-6 py-6"><EmptyState icon="👤" title="Patient not found" body="This patient is not in your care list." cta="Back to patients" onCta={() => navigate("doctor-patients")} /></div>
      </AppShell>
    );
  }
  return (
    <AppShell role="doctor" topBarTitle={patient.name} showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5 max-w-3xl mx-auto w-full">
        <Card>
          <div className="flex items-center gap-4">
            <Avatar src={patient.photo} name={patient.name} size={64} />
            <div>
              <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{patient.name}</h1>
              <p className="text-sm" style={{ color: C.muted }}>{patient.country} · {patient.type === "care" ? "Docura Care" : "Docura Now"}</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
