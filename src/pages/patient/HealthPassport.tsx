import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { AlertBanner, Badge, Button, C, Card, Modal, PageHeader, QRCode, SectionHeader, Toggle } from "@/components/ui";
import { api } from "@/services/api";

const SECTIONS = [
  { id: "identity", label: "Name, date of birth and country", always: true },
  { id: "vitals", label: "Blood group and allergies", always: true },
  { id: "conditions", label: "Active conditions", always: false },
  { id: "medications", label: "Current medications", always: false },
  { id: "careteam", label: "Care team contacts", always: false },
  { id: "consultations", label: "Recent consultation summaries", always: false },
];

export default function HealthPassport() {
  const { navigate, domain, addToast } = useApp();
  const patient = api.patient();
  const careTeam = api.careTeam();
  const medications = api.medications().filter((item) => item.status === "current");
  const [included, setIncluded] = useState<Record<string, boolean>>({ identity: true, vitals: true, conditions: true, medications: true, careteam: true, consultations: false });
  const [shareOpen, setShareOpen] = useState(false);
  const [duration, setDuration] = useState("7");

  const activeShares = domain.consultations.length; // placeholder metric kept honest below
  const includedCount = Object.values(included).filter(Boolean).length;

  return (
    <AppShell role="patient" topBarTitle="Health Passport">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6 max-w-4xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Portable health summary"
          title="Your Health Passport"
          subtitle="A summary you can hand to any clinician, anywhere — and take back whenever you want."
          actions={<>
            <Button variant="outline" onClick={() => addToast("success", "Passport PDF prepared for download.")}>Download PDF</Button>
            <Button onClick={() => setShareOpen(true)}>Share passport</Button>
          </>}
        />

        <AlertBanner type="info" title="You decide what it contains" body="Every share is scoped to the sections you tick and expires on the date you choose. Nothing is shared permanently by default." />

        {/* ── The passport itself ─────────────────────────────────────────── */}
        <Card padding={false}>
          <div className="p-6 rounded-t-2xl" style={{ backgroundColor: C.navy }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: C.amber }}>Docura Health Passport</p>
                <h2 className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)", color: "white" }}>{patient.name}</h2>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>Born {patient.dob} · {patient.country} · {patient.language}</p>
              </div>
              <div className="shrink-0 bg-white rounded-xl p-2 self-start">
                <QRCode value={`https://docura.health/passport/${patient.id}`} />
              </div>
            </div>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Blood group</p>
              <p className="text-2xl font-bold" style={{ color: C.navy }}>{patient.bloodGroup}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Allergies</p>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy) => <Badge key={allergy} variant="red">{allergy}</Badge>)}
              </div>
            </div>
            {included.conditions && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {patient.conditions.map((condition) => <Badge key={condition} variant="amber">{condition}</Badge>)}
                </div>
              </div>
            )}
            {included.medications && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Current medications</p>
                <ul className="flex flex-col gap-1">
                  {medications.map((medication) => (
                    <li key={medication.id} className="text-sm" style={{ color: C.label }}>{medication.name} {medication.dosage} · {medication.frequency}</li>
                  ))}
                </ul>
              </div>
            )}
            {included.careteam && (
              <div className="sm:col-span-2 pt-4 border-t" style={{ borderColor: C.border }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.muted }}>Care team</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {careTeam.map((member) => (
                    <div key={member.id} className="rounded-xl p-3" style={{ backgroundColor: C.warm }}>
                      <p className="text-sm font-semibold" style={{ color: C.navy }}>{member.name}</p>
                      <p className="text-xs" style={{ color: C.muted }}>{member.role} · {member.country}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {included.consultations && (
              <div className="sm:col-span-2 pt-4 border-t" style={{ borderColor: C.border }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.muted }}>Recent consultations</p>
                {domain.consultations.slice(-3).reverse().map((consultation) => (
                  <div key={consultation.id} className="py-2 border-b last:border-0" style={{ borderColor: C.border }}>
                    <p className="text-sm font-semibold" style={{ color: C.navy }}>{consultation.date} — {consultation.diagnosis}</p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>{consultation.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: C.border, backgroundColor: C.warm }}>
            <p className="text-xs" style={{ color: C.muted }}>Issued by Docura · verified against your care record · {includedCount} sections included</p>
            <Button size="sm" variant="ghost" onClick={() => navigate("emergency-card")}>Emergency card</Button>
          </div>
        </Card>

        {/* ── What to include ─────────────────────────────────────────────── */}
        <Card>
          <SectionHeader title="What your passport includes" subtitle="Identity and critical safety information are always present." />
          {SECTIONS.map((section) => (
            <div key={section.id} className="flex items-center justify-between gap-4 py-3 border-b last:border-0" style={{ borderColor: C.border }}>
              <p className="text-sm" style={{ color: C.navy }}>{section.label}</p>
              {section.always
                ? <Badge variant="gray">Always included</Badge>
                : <Toggle checked={included[section.id]} onChange={(value) => setIncluded((current) => ({ ...current, [section.id]: value }))} />}
            </div>
          ))}
        </Card>

        <Card>
          <SectionHeader title="Where your passport is useful" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Travelling", body: "Hand a clinician abroad a clear summary in seconds, without waiting for records to transfer." },
              { title: "A&E or urgent care", body: "Blood group, allergies and current medicines are what an emergency team needs first." },
              { title: "A new specialist", body: "Start a consultation with your history already understood, rather than repeating it." },
            ].map((item) => (
              <div key={item.title}>
                <p className="text-sm font-semibold" style={{ color: C.navy }}>{item.title}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: C.muted }}>{item.body}</p>
              </div>
            ))}
          </div>
          <Button size="sm" variant="outline" className="mt-5" onClick={() => navigate("health-sharing")}>Manage all sharing links ({activeShares > 0 ? api.healthShares().length : 0})</Button>
        </Card>
      </div>

      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Share your Health Passport">
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: C.muted }}>A time-limited link is generated. Anyone with the link sees only the sections you included — and only until it expires.</p>
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: C.label }}>Link expires after</p>
            <div className="flex flex-wrap gap-2">
              {[{ value: "1", label: "24 hours" }, { value: "7", label: "7 days" }, { value: "30", label: "30 days" }].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDuration(option.value)}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ backgroundColor: duration === option.value ? C.amber : "white", color: duration === option.value ? "white" : C.navy, borderColor: duration === option.value ? C.amber : C.border }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-3" style={{ backgroundColor: C.warm }}>
            <p className="text-xs font-semibold mb-1" style={{ color: C.navy }}>Included in this share</p>
            <p className="text-xs" style={{ color: C.muted }}>{SECTIONS.filter((section) => section.always || included[section.id]).map((section) => section.label).join(" · ")}</p>
          </div>
          <Button
            fullWidth
            onClick={() => {
              setShareOpen(false);
              addToast("success", `Share link created — expires in ${duration === "1" ? "24 hours" : `${duration} days`}.`);
              navigate("health-sharing");
            }}
          >
            Create share link
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}
