import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Badge, Button, Avatar, C, AlertBanner, Modal } from "@/components/ui";
import { useApp } from "@/context/AppContext";

const PENDING = [
  {
    id: "cons1",
    patient: "Chidinma Eze",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    symptoms: "Persistent epigastric pain for 2 days, worse after spicy food. No fever. Mild nausea.",
    type: "now",
    paid: true,
    time: "12 minutes ago",
    allergies: ["Penicillin", "NSAIDs (Severe Gastritis)"],
  },
];

const EMDEX_DRUGS = [
  { generic: "Omeprazole", brand: "Prilosec / Losec", defaultDose: "20mg", frequency: "Once daily before breakfast", duration: "14 days", safety: "safe" as const, note: "🟢 No obvious issue. Safe with reported allergy profile." },
  { generic: "Amoxicillin", brand: "Amoxil", defaultDose: "500mg", frequency: "Three times daily", duration: "7 days", safety: "danger" as const, note: "🔴 Potential safety issue: Patient has documented Penicillin allergy!" },
  { generic: "Ibuprofen", brand: "Advil / Motrin", defaultDose: "400mg", frequency: "Twice daily after meals", duration: "3 days", safety: "danger" as const, note: "🔴 Potential safety alert: Contraindicated with documented NSAID-induced gastritis!" },
  { generic: "Metronidazole", brand: "Flagyl", defaultDose: "400mg", frequency: "Three times daily with food", duration: "5 days", safety: "warning" as const, note: "🟠 Review recommended: Avoid all alcohol intake during therapy." },
  { generic: "Gaviscon Suspension", brand: "Gaviscon Double Action", defaultDose: "10ml", frequency: "Four times daily after meals & bedtime", duration: "7 days", safety: "safe" as const, note: "🟢 No obvious issue. Provides immediate mucosal barrier relief." },
];

function CareEpisodeWorkspace({ cons, onComplete }: { cons: typeof PENDING[0]; onComplete: () => void }) {
  const { domain, addToast, lockConsultationNote, addConsultationAddendum, issuePrescription, orderLabTest } = useApp();
  const [activeTab, setActiveTab] = useState<"chat" | "note" | "rx" | "labs" | "followup">("chat");

  // Chat state
  const [msgs, setMsgs] = useState([
    { from: "system", text: "Care Episode initiated. Patient connected via Docura Secure Channel.", time: "" },
    { from: "patient", text: cons.symptoms, time: "12:30" },
  ]);
  const [input, setInput] = useState("");

  // Clinical Note state & Locking
  const lockedState = domain.lockedConsultations[cons.id];
  const [noteContent, setNoteContent] = useState(
    "SUBJECTIVE:\nPatient reports 2-day history of burning epigastric discomfort, aggravated post-prandially. Denies hematemesis, melena, or fever.\n\nOBJECTIVE:\nPatient alert, in mild distress. Vital signs stable.\n\nASSESSMENT:\nAcute Gastritis / Peptic Ulcer Disease (PUD flare).\n\nPLAN:\n1. Proton-Pump Inhibitor (Omeprazole 20mg OD)\n2. Dietary counselling: avoid spicy foods, alcohol, caffeine\n3. Lab: H. Pylori Stool Antigen test\n4. Review in 7 days."
  );
  const [addendumInput, setAddendumInput] = useState("");

  // Prescription Composer state with safety validation
  const [drugSearch, setDrugSearch] = useState("Omeprazole");
  const [dosage, setDosage] = useState("20mg");
  const [frequency, setFrequency] = useState("Once daily before breakfast");
  const [duration, setDuration] = useState("14 days");
  const [isCrossBorderRx, setIsCrossBorderRx] = useState(false);
  const [issuedLocalRxs, setIssuedLocalRxs] = useState<string[]>([]);

  // Find matched drug for EMDEX validation
  const matchedDrug = EMDEX_DRUGS.find((d) => d.generic.toLowerCase().includes(drugSearch.toLowerCase()) || d.brand.toLowerCase().includes(drugSearch.toLowerCase()));

  // Inline lab ordering
  const [orderedLabs, setOrderedLabs] = useState<string[]>([]);

  function sendChatMessage() {
    if (!input.trim()) return;
    setMsgs((p) => [...p, { from: "doctor", text: input.trim(), time: "Now" }]);
    setInput("");
  }

  function handleLockNote() {
    lockConsultationNote(cons.id, noteContent);
    addToast("success", "Clinical note locked as permanent, immutable medical record.");
  }

  function handleAddAddendum() {
    if (!addendumInput.trim()) return;
    addConsultationAddendum(cons.id, addendumInput.trim());
    addToast("success", "Timestamped addendum added to permanent record.");
    setAddendumInput("");
  }

  function handleIssueRx() {
    if (matchedDrug?.safety === "danger") {
      addToast("error", "Cannot issue prescription: Drug safety alert flagged severe contraindication.");
      return;
    }
    issuePrescription({
      doctorId: "d1",
      doctorName: "Dr. Amara Osei",
      medication: `${drugSearch} ${dosage}`,
      dosage,
      frequency,
      duration,
      instructions: `Take ${frequency} for ${duration}.`,
      consultationId: cons.id,
      crossBorder: isCrossBorderRx,
    });
    setIssuedLocalRxs((prev) => [...prev, `${drugSearch} ${dosage}`]);
    addToast("success", isCrossBorderRx ? "Cross-border Rx recommendation routed to local prescribing doctor." : "Prescription issued successfully.");
  }

  function handleQuickOrderLab(test: string) {
    orderLabTest({
      patientId: "p3",
      patientName: cons.patient,
      category: "microbiology",
      testName: test,
      clinicalIndication: "Epigastric pain evaluation",
      urgency: "routine",
    });
    setOrderedLabs((prev) => [...prev, test]);
    addToast("success", `Lab test order for ${test} submitted.`);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px-70px)] lg:h-[calc(100vh-56px)] bg-slate-50">
      {/* Care Episode Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between bg-white shrink-0" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-3">
          <Avatar src={cons.photo} name={cons.patient} size={40} />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm" style={{ color: C.navy }}>{cons.patient}</p>
              <Badge variant="green">Connected</Badge>
              {lockedState && <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">🔒 Note Locked</span>}
            </div>
            <p className="text-xs" style={{ color: C.muted }}>Docura Now · Unified Care Episode</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="danger" onClick={onComplete}>
            Complete Episode
          </Button>
        </div>
      </div>

      {/* Episode Navigation Tabs: Chat | Clinical Note | Prescription | Labs | Follow-up */}
      <div className="flex border-b bg-white px-4 shrink-0 overflow-x-auto scrollbar-none" style={{ borderColor: C.border }}>
        {[
          { id: "chat", label: "💬 Patient Chat" },
          { id: "note", label: `📝 Clinical Note ${lockedState ? "(Locked)" : ""}` },
          { id: "rx", label: `💊 Prescription (${issuedLocalRxs.length})` },
          { id: "labs", label: `🧪 Labs & Diagnostics (${orderedLabs.length})` },
          { id: "followup", label: "🗓️ Follow-up & Referral" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className="py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap"
            style={{
              borderColor: activeTab === tab.id ? C.navy : "transparent",
              color: activeTab === tab.id ? C.navy : C.muted,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Chat View */}
      {activeTab === "chat" && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {msgs.map((m, i) => (
              m.from === "system" ? (
                <div key={i} className="text-center my-1">
                  <span className="text-xs px-3 py-1 rounded-full bg-white border text-slate-500" style={{ borderColor: C.border }}>
                    {m.text}
                  </span>
                </div>
              ) : (
                <div key={i} className={`flex ${m.from === "doctor" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${m.from === "doctor" ? "bg-amber-400 text-slate-900 rounded-br-sm" : "bg-white border rounded-bl-sm"}`} style={{ borderColor: C.border }}>
                    <p>{m.text}</p>
                    <span className="text-[10px] opacity-60 block text-right mt-1">{m.time}</span>
                  </div>
                </div>
              )
            ))}
          </div>
          <div className="p-3 bg-white border-t flex gap-2" style={{ borderColor: C.border }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
              placeholder="Message patient directly..."
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none"
              style={{ borderColor: C.border }}
            />
            <Button onClick={sendChatMessage}>Send</Button>
          </div>
        </div>
      )}

      {/* Tab 2: Clinical Note & Locking Mechanism */}
      {activeTab === "note" && (
        <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base" style={{ color: C.navy }}>Consultation Documentation &amp; Governance</h3>
              <p className="text-xs text-slate-500">AI-assisted note generation → Doctor review → Permanent locked clinical record.</p>
            </div>
            {!lockedState ? (
              <Button size="sm" onClick={handleLockNote}>
                🔒 Lock Consultation Note
              </Button>
            ) : (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                ✓ Locked: {lockedState.lockedAt}
              </span>
            )}
          </div>

          {!lockedState ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setNoteContent((c) => c + "\n[AI Generated: Patient exhibits no peritoneal irritation flags. Recommend trial of PPI.]")}>
                  ✨ AI SOAP Assistant
                </Button>
              </div>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={12}
                className="w-full rounded-2xl border p-4 text-xs font-mono outline-none leading-relaxed bg-white"
                style={{ borderColor: C.border }}
              />
              <p className="text-[11px] text-slate-500">
                ⚠️ Once locked, this original note becomes a permanent legal clinical document and cannot be edited.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed shadow-sm" style={{ borderColor: C.border }}>
                {lockedState.note}
              </div>

              {/* Addenda Section */}
              <div className="p-5 rounded-2xl bg-slate-100 border space-y-3" style={{ borderColor: C.border }}>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Permanent Record Addenda</h4>
                {lockedState.addenda.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No addenda recorded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {lockedState.addenda.map((ad) => (
                      <div key={ad.id} className="p-3 rounded-xl bg-white border text-xs text-slate-800" style={{ borderColor: C.border }}>
                        <div className="flex justify-between font-bold text-[11px] text-slate-500 mb-1">
                          <span>{ad.doctorName}</span>
                          <span>{ad.createdAt}</span>
                        </div>
                        <p>{ad.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <textarea
                    value={addendumInput}
                    onChange={(e) => setAddendumInput(e.target.value)}
                    rows={2}
                    placeholder="Type addendum to permanently attach to this consultation..."
                    className="w-full rounded-xl border p-2.5 text-xs outline-none bg-white"
                    style={{ borderColor: C.border }}
                  />
                  <Button size="sm" onClick={handleAddAddendum}>
                    + Record Clinical Addendum
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Prescription UX with EMDEX Safety Validation */}
      {activeTab === "rx" && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl mx-auto w-full">
          <div>
            <h3 className="font-bold text-base" style={{ color: C.navy }}>Prescription Composer &amp; Safety Validator</h3>
            <p className="text-xs text-slate-500">Integrated EMDEX clinical drug search with automated Red/Amber/Green allergy &amp; interaction checks.</p>
          </div>

          <Card className="p-5 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Drug Search (EMDEX Formulary Autocomplete)
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {EMDEX_DRUGS.map((d) => (
                  <button
                    key={d.generic}
                    type="button"
                    onClick={() => {
                      setDrugSearch(d.generic);
                      setDosage(d.defaultDose);
                      setFrequency(d.frequency);
                      setDuration(d.duration);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${drugSearch === d.generic ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"}`}
                  >
                    {d.generic} ({d.brand.split("/")[0]})
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Dose</label>
                <input value={dosage} onChange={(e) => setDosage(e.target.value)} className="w-full rounded-xl border p-2.5 text-xs outline-none" style={{ borderColor: C.border }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Frequency</label>
                <input value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full rounded-xl border p-2.5 text-xs outline-none" style={{ borderColor: C.border }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Duration</label>
                <input value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-xl border p-2.5 text-xs outline-none" style={{ borderColor: C.border }} />
              </div>
            </div>

            {/* Visible Clinical Safety Indicator Banner */}
            {matchedDrug && (
              <div className={`p-4 rounded-xl border text-xs font-medium ${matchedDrug.safety === "danger" ? "bg-red-100 border-red-300 text-red-900" : matchedDrug.safety === "warning" ? "bg-amber-100 border-amber-300 text-amber-900" : "bg-emerald-100 border-emerald-300 text-emerald-900"}`}>
                <p className="font-bold">{matchedDrug.note}</p>
                <p className="text-[11px] mt-0.5 opacity-80">Patient Reported Allergies: {cons.allergies.join(", ")}</p>
              </div>
            )}

            {/* Cross-border prescription toggle */}
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border text-xs font-semibold cursor-pointer" style={{ borderColor: C.border }}>
              <input type="checkbox" checked={isCrossBorderRx} onChange={(e) => setIsCrossBorderRx(e.target.checked)} className="rounded" />
              <span>Patient is in another country (Send for local prescribing authorization)</span>
            </label>

            <Button onClick={handleIssueRx} fullWidth disabled={matchedDrug?.safety === "danger"}>
              {isCrossBorderRx ? "Send Recommendation to Local Prescribing Doctor →" : "Issue Electronic Prescription"}
            </Button>
          </Card>

          {issuedLocalRxs.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <p className="font-bold text-emerald-950 mb-1">Prescriptions Issued in This Episode:</p>
              <ul className="list-disc list-inside space-y-0.5 text-emerald-800">
                {issuedLocalRxs.map((rx, idx) => <li key={idx}>{rx}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Labs & Diagnostic Ordering */}
      {activeTab === "labs" && (
        <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-3xl mx-auto w-full">
          <div>
            <h3 className="font-bold text-base" style={{ color: C.navy }}>Connected Diagnostic Orders</h3>
            <p className="text-xs text-slate-500">Order labs or review diagnostics without leaving this care episode.</p>
          </div>

          <Card className="p-5 space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Common Diagnostic Tests</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { name: "H. Pylori Stool Antigen Test", category: "Microbiology" },
                { name: "Full Blood Count (FBC)", category: "Hematology" },
                { name: "Abdominal Ultrasound", category: "Imaging" },
                { name: "Upper GI Endoscopy Referral", category: "Specialist" },
              ].map((test) => (
                <div key={test.name} className="p-3 rounded-xl border flex items-center justify-between" style={{ borderColor: C.border }}>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{test.name}</p>
                    <p className="text-[10px] text-slate-500">{test.category}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleQuickOrderLab(test.name)}>
                    {orderedLabs.includes(test.name) ? "✓ Ordered" : "+ Order"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 5: Follow-up & Referral */}
      {activeTab === "followup" && (
        <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-3xl mx-auto w-full">
          <div>
            <h3 className="font-bold text-base" style={{ color: C.navy }}>Schedule Follow-up &amp; Colleague Referral</h3>
            <p className="text-xs text-slate-500">Close the care episode with structured continuity.</p>
          </div>

          <Card className="p-5 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Schedule Review</h4>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => addToast("success", "Follow-up scheduled for 7 days.")}>
                In 7 Days (Gastritis Review)
              </Button>
              <Button size="sm" variant="outline" onClick={() => addToast("success", "Follow-up scheduled for 14 days.")}>
                In 14 Days
              </Button>
              <Button size="sm" variant="ghost" onClick={() => addToast("success", "Referral letter generated for Gastroenterologist.")}>
                Refer to Specialist Colleague
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function DoctorConsultations() {
  const [active, setActive] = useState<typeof PENDING[0] | null>(null);
  const [completed, setCompleted] = useState(false);

  if (active && !completed) {
    return (
      <AppShell role="doctor" topBarTitle={`Care Episode: ${active.patient}`} showTopBarBack>
        <CareEpisodeWorkspace cons={active} onComplete={() => setCompleted(true)} />
      </AppShell>
    );
  }

  if (completed) {
    return (
      <AppShell role="doctor" topBarTitle="Care Episode Complete">
        <div className="px-4 py-16 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-emerald-100">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
            Care Episode Completed
          </h2>
          <p className="text-sm max-w-md text-slate-500">
            Consultation note locked to patient chart, electronic prescriptions issued, and diagnostic orders dispatched.
          </p>
          <Button onClick={() => { setActive(null); setCompleted(false); }}>
            Back to Queue
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="doctor" topBarTitle="Consultations">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-4" style={{ fontFamily: "var(--font-body)" }}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
            Active Consultations Queue ({PENDING.length})
          </h1>
          <Badge variant="green">Payment Confirmed</Badge>
        </div>

        {PENDING.map((cons) => (
          <Card key={cons.id} className="p-5">
            <div className="flex items-start gap-4 mb-3">
              <Avatar src={cons.photo} name={cons.patient} size={48} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base" style={{ color: C.navy }}>{cons.patient}</h3>
                  <Badge variant="amber">Docura Now</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{cons.time} · Paid &amp; Waiting</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 mb-4 text-xs space-y-1">
              <p className="font-bold text-amber-900">Reported Symptoms:</p>
              <p className="text-slate-700">{cons.symptoms}</p>
              <p className="text-red-700 pt-1 font-semibold">⚠️ Allergies on file: {cons.allergies.join(", ")}</p>
            </div>

            <Button fullWidth onClick={() => setActive(cons)}>
              Enter Unified Care Episode Workspace →
            </Button>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
