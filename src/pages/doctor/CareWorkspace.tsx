import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Card, Button, Badge, Avatar, StatCard } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { DOCTOR_PATIENTS, DOCTOR_FOLLOW_UPS } from "@/data/mock";

const TODAY = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export default function CareWorkspace() {
  const { navigate, addToast } = useApp();
  const [accepted, setAccepted] = useState<string[]>([]);

  const upcomingFollowUps = DOCTOR_FOLLOW_UPS.filter((f) => f.status === "upcoming" || f.status === "missed");

  function handleAccept(name: string, id: string) {
    setAccepted((prev) => [...prev, id]);
    addToast("success", "Consultation accepted for " + name);
  }

  return (
    <AppShell role="doctor">
      <div className="px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm mb-1" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>{TODAY}</p>
          <h1 className="text-3xl font-bold mb-1" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>
            Good morning, Dr. Amara
          </h1>
          <p style={{ color: C.muted, fontFamily: "var(--font-body)" }}>8 patients need attention today.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Urgent messages"
            value={2}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>}
            color="#FEE2E2"
          />
          <StatCard
            label="Follow-ups due"
            value={1}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
            color={C.amberLight}
          />
          <StatCard
            label="New consultations"
            value={3}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>}
            color="#E8ECF5"
          />
          <StatCard
            label="Prescription reviews"
            value={2}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>}
            color="#F3F4F6"
          />
        </div>

        {/* Urgent Messages */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ backgroundColor: C.coral }} />
            <h2 className="text-base font-bold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>Urgent Messages</h2>
            <Badge variant="red">2</Badge>
          </div>
          <div className="space-y-2">
            {[
              { name: "Adaeze Okafor", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face", message: "Chest tightness since yesterday", time: "09:02 AM" },
              { name: "Emeka Nwosu", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", message: "Asking about medication timing", time: "08:45 AM" },
            ].map((msg) => (
              <Card key={msg.name} className="flex items-center gap-4">
                <Avatar src={msg.photo} name={msg.name} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>{msg.name}</p>
                  <p className="text-sm truncate" style={{ color: C.muted }}>{msg.message}</p>
                </div>
                <span className="text-xs shrink-0" style={{ color: C.muted }}>{msg.time}</span>
                <Button size="sm" variant="outline" onClick={() => navigate("doctor-chat")}>Reply</Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Follow-ups Due */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ backgroundColor: C.amber }} />
            <h2 className="text-base font-bold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>Follow-ups Due</h2>
            <Badge variant="amber">{upcomingFollowUps.length}</Badge>
          </div>
          <div className="space-y-2">
            {upcomingFollowUps.map((fu) => (
              <Card key={fu.id} className="flex items-center gap-4">
                <Avatar src={fu.photo} name={fu.patient} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>{fu.patient}</p>
                    {fu.urgent && <Badge variant="red">Urgent</Badge>}
                    {fu.status === "missed" && <Badge variant="red">Missed</Badge>}
                  </div>
                  <p className="text-sm truncate" style={{ color: C.muted }}>{fu.reason}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>{fu.date}</p>
                </div>
                <Button size="sm" onClick={() => addToast("info", "Starting follow-up with " + fu.patient)}>
                  Start follow-up
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* New Consultations */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ backgroundColor: C.navy }} />
            <h2 className="text-base font-bold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>New Consultations</h2>
            <Badge variant="navy">3</Badge>
          </div>
          <div className="space-y-2">
            {[
              { id: "nc1", name: "Chidinma Eze", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", reason: "Respiratory symptoms" },
              { id: "nc2", name: "Blessing Ibrahim", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face", reason: "Back pain consultation" },
              { id: "nc3", name: "Tunde Obi", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", reason: "Diabetes review" },
            ].map((c) => (
              <Card key={c.id} className="flex items-center gap-4">
                <Avatar src={c.photo} name={c.name} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>{c.name}</p>
                  <p className="text-sm" style={{ color: C.muted }}>{c.reason}</p>
                </div>
                {accepted.includes(c.id) ? (
                  <Badge variant="green">Accepted</Badge>
                ) : (
                  <Button size="sm" onClick={() => handleAccept(c.name, c.id)}>Accept</Button>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Prescription Reviews */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ backgroundColor: "#6B7280" }} />
            <h2 className="text-base font-bold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>Prescription Reviews</h2>
            <Badge variant="gray">2</Badge>
          </div>
          <div className="space-y-2">
            {[
              { name: "Adaeze Okafor", medication: "cross-border Lisinopril renewal" },
              { name: "Emeka Nwosu", medication: "Sertraline 50mg renewal" },
            ].map((rx) => (
              <Card key={rx.name + rx.medication} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>{rx.name}</p>
                  <p className="text-sm" style={{ color: C.muted }}>{rx.medication}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate("prescription-reviews")}>Review</Button>
              </Card>
            ))}
          </div>
        </section>

        {/* My Patients Quick Summary */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-bold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>My Patients</h2>
          </div>
          <div className="space-y-2">
            {DOCTOR_PATIENTS.slice(0, 3).map((p) => (
              <Card key={p.id} className="flex items-center gap-4">
                <Avatar src={p.photo} name={p.name} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>{p.name}</p>
                    {p.crossBorder && <Badge variant="blue">Cross-border</Badge>}
                  </div>
                  <p className="text-xs" style={{ color: C.muted }}>{p.nextAction}</p>
                </div>
                <Badge variant="green">{p.careStatus}</Badge>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
