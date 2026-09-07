import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { AiDisclosure, AlertBanner, Avatar, Badge, Button, C, Card, Input, Modal, SectionHeader, Select } from "@/components/ui";
import { api } from "@/services/api";

type Channel = "video" | "audio" | "chat";
type Quality = "good" | "weak" | "poor";

const QUALITY_COPY: Record<Quality, { label: string; body: string; tone: "success" | "warning" | "error" }> = {
  good: { label: "Connection stable", body: "Video is running at full quality.", tone: "success" },
  weak: { label: "Connection is unstable", body: "We have dropped to audio to keep the consultation going. Video resumes automatically when the line improves.", tone: "warning" },
  poor: { label: "Connection lost", body: "We have moved the consultation to chat. Nothing said so far is lost, and your doctor can still send a prescription.", tone: "error" },
};

/**
 * A single consultation room used by both sides of the call. Connectivity is a
 * first-class state here rather than an error: on a weak line the room steps
 * down video → audio → chat instead of ending the consultation.
 */
export default function ConsultationRoom() {
  const { role, params, navigate, addToast, addMessage, issuePrescription, scheduleFollowUp, domain } = useApp();
  const doctor = api.doctor(params.doctorId || api.patient().personalDoctorId) || api.doctors()[0];
  const patient = api.patient();
  const isDoctor = role === "doctor";

  const [channel, setChannel] = useState<Channel>((params.channel as Channel) || "video");
  const [quality, setQuality] = useState<Quality>("good");
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [note, setNote] = useState("");
  const [rxOpen, setRxOpen] = useState(false);
  const [medication, setMedication] = useState("Metformin");
  const [dosage, setDosage] = useState("500mg");
  const [frequency, setFrequency] = useState("Twice daily");
  const [duration, setDuration] = useState("3 months");
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Connectivity degrades the channel rather than dropping the consultation.
  useEffect(() => {
    if (quality === "good") setChannel((current) => (current === "chat" ? current : current));
    if (quality === "weak" && channel === "video") setChannel("audio");
    if (quality === "poor") setChannel("chat");
  }, [quality, channel]);

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  const other = isDoctor ? { name: patient.name, photo: patient.photo, detail: `${patient.country} · ${patient.conditions.join(", ")}` } : { name: doctor.name, photo: doctor.photo, detail: `${doctor.specialty} · ${doctor.country}` };

  return (
    <AppShell role={role} topBarTitle="Consultation room" showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5 max-w-5xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <AlertBanner type={QUALITY_COPY[quality].tone} title={QUALITY_COPY[quality].label} body={QUALITY_COPY[quality].body} />

        <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-5 items-start">
          {/* ── Stage ─────────────────────────────────────────────────────── */}
          <Card padding={false}>
            <div className="relative rounded-t-2xl overflow-hidden" style={{ backgroundColor: C.navy, minHeight: 320 }}>
              {channel === "chat" ? (
                <div className="p-5 flex flex-col gap-3 h-80 overflow-y-auto">
                  {domain.messages.slice(-6).map((message) => (
                    <div key={message.id} className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.isDoctor ? "self-start" : "self-end"}`} style={{ backgroundColor: message.isDoctor ? "rgba(255,255,255,0.12)" : C.amber }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: message.isDoctor ? "rgba(255,255,255,0.7)" : "white" }}>{message.senderName}</p>
                      <p className="text-sm" style={{ color: "white" }}>{message.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-80 flex flex-col items-center justify-center gap-4">
                  <Avatar src={other.photo} name={other.name} size={96} />
                  <div className="text-center">
                    <p className="font-semibold" style={{ color: "white" }}>{other.name}</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{other.detail}</p>
                  </div>
                  <Badge variant="green">{channel === "video" ? (cameraOff ? "Camera off" : "Video connected") : "Audio connected"}</Badge>
                </div>
              )}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C.coral }} />
                <span className="text-xs font-semibold" style={{ color: "white" }}>{minutes}:{seconds}</span>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="amber">{channel}</Badge>
              </div>
            </div>

            <div className="p-4 flex flex-wrap items-center justify-center gap-2 border-t" style={{ borderColor: C.border }}>
              <Button size="sm" variant={muted ? "primary" : "outline"} onClick={() => { setMuted(!muted); addToast("info", muted ? "Microphone on" : "Microphone muted"); }}>{muted ? "Unmute" : "Mute"}</Button>
              {channel === "video" && <Button size="sm" variant={cameraOff ? "primary" : "outline"} onClick={() => setCameraOff(!cameraOff)}>{cameraOff ? "Start video" : "Stop video"}</Button>}
              {channel !== "video" && quality === "good" && <Button size="sm" variant="outline" onClick={() => { setChannel("video"); addToast("success", "Video restored."); }}>Switch to video</Button>}
              {channel !== "chat" && <Button size="sm" variant="outline" onClick={() => setChannel("chat")}>Switch to chat</Button>}
              <Button size="sm" variant="danger" onClick={() => setEnded(true)}>End consultation</Button>
            </div>

            <div className="px-4 pb-4">
              <p className="text-xs mb-2" style={{ color: C.muted }}>Simulate network conditions</p>
              <Select
                label=""
                value={quality}
                onChange={(value) => { setQuality(value as Quality); addToast("info", QUALITY_COPY[value as Quality].label); }}
                options={[{ value: "good", label: "Good connection" }, { value: "weak", label: "Weak — drop to audio" }, { value: "poor", label: "Poor — fall back to chat" }]}
              />
            </div>
          </Card>

          {/* ── Side panel ────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {isDoctor ? (
              <>
                <Card>
                  <SectionHeader title="Consultation note" subtitle="SOAP structure" />
                  <Input label="" value={note} onChange={setNote} multiline rows={6} placeholder={"Subjective:\nObjective:\nAssessment:\nPlan:"} />
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button size="sm" onClick={() => addToast("success", "Note saved to the consultation record.")}>Save note</Button>
                    <Button size="sm" variant="outline" onClick={() => { setNote("Subjective: Patient reports improved blood sugar readings this week.\nObjective: Self-reported fasting readings 95–110 mg/dL.\nAssessment: Type 2 diabetes, responding to current regimen.\nPlan: Continue Metformin 500mg BD; review in 4 weeks."); addToast("info", "Draft suggestion inserted — review before saving."); }}>Suggest draft</Button>
                  </div>
                  <div className="mt-4"><AiDisclosure detail="Draft notes are a starting point generated from the consultation. You remain responsible for the clinical record and must review before saving." /></div>
                </Card>
                <Card>
                  <SectionHeader title="Clinical actions" />
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => setRxOpen(true)}>Issue prescription</Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        scheduleFollowUp({ doctorId: doctor.id, doctorName: doctor.name, doctorPhoto: doctor.photo, reason: "Post-consultation review", scheduledDate: new Date(Date.now() + 12096e5).toISOString().slice(0, 10) });
                        addToast("success", "Follow-up scheduled and the patient notified.");
                      }}
                    >
                      Schedule follow-up
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate("doctor-referrals")}>Refer to a colleague</Button>
                  </div>
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <SectionHeader title="Your doctor" />
                  <div className="flex items-center gap-3">
                    <Avatar src={doctor.photo} name={doctor.name} size={44} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: C.navy }}>{doctor.name}</p>
                      <p className="text-xs truncate" style={{ color: C.muted }}>{doctor.specialty}</p>
                    </div>
                  </div>
                  <p className="text-xs mt-4 leading-relaxed" style={{ color: C.muted }}>
                    Everything discussed is added to your health record. You can read the summary afterwards and ask questions in messages.
                  </p>
                </Card>
                <Card>
                  <SectionHeader title="Send a note" subtitle="Useful when the line is poor" />
                  <Input label="" value={note} onChange={setNote} multiline rows={3} placeholder="Something you want to be sure your doctor sees" />
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      if (!note.trim()) { addToast("error", "Write something first."); return; }
                      addMessage({ senderId: patient.id, senderName: patient.name, text: note, isDoctor: false });
                      setNote("");
                      addToast("success", "Sent to your doctor.");
                    }}
                  >
                    Send
                  </Button>
                </Card>
              </>
            )}

            <Card style={{ backgroundColor: C.warm }}>
              <p className="text-xs font-semibold" style={{ color: C.navy }}>Low-bandwidth mode</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>
                Docura keeps consultations usable on unreliable connections: video steps down to audio, audio steps down to chat, and prescriptions and summaries are delivered either way.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Prescription ────────────────────────────────────────────────── */}
      <Modal open={rxOpen} onClose={() => setRxOpen(false)} title="Issue a prescription">
        <div className="flex flex-col gap-4">
          <Input label="Medication" value={medication} onChange={setMedication} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Dosage" value={dosage} onChange={setDosage} />
            <Input label="Frequency" value={frequency} onChange={setFrequency} />
          </div>
          <Input label="Duration" value={duration} onChange={setDuration} />
          {doctor.country !== patient.country && (
            <AlertBanner type="warning" title="Cross-border prescribing" body={`You are licensed in ${doctor.country} and this patient is in ${patient.country}. A locally licensed prescribing doctor must issue this prescription.`} />
          )}
          <Button
            fullWidth
            onClick={() => {
              issuePrescription({
                doctorId: doctor.id,
                doctorName: doctor.name,
                medication,
                dosage,
                frequency,
                duration,
                instructions: "Take as directed. Contact your doctor if symptoms change.",
                crossBorder: doctor.country !== patient.country,
              });
              setRxOpen(false);
              addToast("success", "Prescription issued and sent to the patient.");
            }}
          >
            Issue prescription
          </Button>
        </div>
      </Modal>

      {/* ── End of consultation ─────────────────────────────────────────── */}
      <Modal open={ended} onClose={() => setEnded(false)} title="Consultation ended">
        <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
          The consultation lasted {minutes}:{seconds}. {isDoctor ? "Your note and any prescription have been added to the shared record." : "Your doctor's summary will appear in your health record shortly."}
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          <Button onClick={() => navigate(isDoctor ? "doctor-consultations" : "patient-consultations")}>View consultation record</Button>
          <Button variant="outline" onClick={() => navigate(isDoctor ? "doctor-dashboard" : "patient-dashboard")}>Back to dashboard</Button>
        </div>
      </Modal>
    </AppShell>
  );
}
