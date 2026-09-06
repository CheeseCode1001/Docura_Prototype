import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Button, Card, Badge, Modal, Divider, QRCode } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { PATIENT, MEDICATIONS, CARE_TEAM } from "@/data/mock";

export default function EmergencyCard() {
  const { addToast } = useApp();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const currentMeds = MEDICATIONS.filter((m) => m.status === "current");
  const personalDoctor = CARE_TEAM.find((ct) => ct.role === "Personal Doctor");

  return (
    <AppShell role="patient">
      {/* Hero Banner */}
      <div
        style={{
          background: C.coral,
          borderRadius: 14,
          padding: "28px 28px 24px",
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            color: "white",
            fontSize: "1.9rem",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          Emergency Health Card
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", lineHeight: 1.5 }}>
          In case of emergency, show this card to healthcare providers.
        </p>
      </div>

      {/* THE CARD */}
      <Card className="mb-6" padding={false}>
        <div
          style={{
            borderTop: `4px solid ${C.coral}`,
            borderRadius: "inherit",
            padding: "24px 24px 28px",
          }}
        >
          {/* ICE label */}
          <p
            style={{
              color: C.coral,
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            In Case of Emergency
          </p>

          {/* Patient Name */}
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              color: C.navy,
              fontSize: "1.7rem",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            {PATIENT.name}
          </h2>

          {/* Blood Group */}
          <div className="flex items-center gap-3 mb-5">
            <span style={{ color: C.label, fontSize: "0.82rem", fontWeight: 600 }}>Blood Group</span>
            <span
              style={{
                background: C.amberLight,
                color: C.amber,
                borderRadius: 9999,
                padding: "5px 22px",
                fontSize: "1.4rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
              }}
            >
              {PATIENT.bloodGroup}
            </span>
          </div>

          <Divider />

          {/* Allergies */}
          <div className="mb-5 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.coral} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span style={{ color: C.navy, fontWeight: 700, fontSize: "0.88rem" }}>Allergies</span>
            </div>
            {PATIENT.allergies.length === 0 ? (
              <p style={{ color: C.muted, fontSize: "0.82rem" }}>No known allergies.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="flex flex-col gap-1">
                {PATIENT.allergies.map((a) => (
                  <li key={a} style={{ color: C.coral, fontWeight: 600, fontSize: "0.85rem" }}>
                    &bull; {a}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Medical Conditions */}
          <div className="mb-5">
            <p style={{ color: C.navy, fontWeight: 700, fontSize: "0.88rem", marginBottom: 6 }}>
              Medical Conditions
            </p>
            {PATIENT.conditions.length === 0 ? (
              <p style={{ color: C.muted, fontSize: "0.82rem" }}>None recorded.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="flex flex-col gap-1">
                {PATIENT.conditions.map((c) => (
                  <li key={c} style={{ color: C.label, fontSize: "0.85rem" }}>
                    &bull; {c}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Current Medications */}
          <div className="mb-5">
            <p style={{ color: C.navy, fontWeight: 700, fontSize: "0.88rem", marginBottom: 6 }}>
              Current Medications
            </p>
            {currentMeds.length === 0 ? (
              <p style={{ color: C.muted, fontSize: "0.82rem" }}>No current medications.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="flex flex-col gap-1">
                {currentMeds.map((m) => (
                  <li key={m.id} style={{ color: C.label, fontSize: "0.84rem" }}>
                    &bull; {m.name} {m.dosage} &mdash; {m.frequency}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Divider />

          {/* Emergency Contact */}
          <div className="mt-4 mb-5">
            <p style={{ color: C.navy, fontWeight: 700, fontSize: "0.88rem", marginBottom: 6 }}>
              Emergency Contact
            </p>
            <p style={{ color: C.label, fontSize: "0.85rem", fontWeight: 600 }}>Chukwuemeka Okafor</p>
            <p style={{ color: C.muted, fontSize: "0.82rem" }}>+234 803 111 2222</p>
          </div>

          {/* Personal Doctor */}
          {personalDoctor && (
            <div className="mb-5">
              <p style={{ color: C.navy, fontWeight: 700, fontSize: "0.88rem", marginBottom: 6 }}>
                Personal Doctor
              </p>
              <p style={{ color: C.label, fontSize: "0.85rem", fontWeight: 600 }}>{personalDoctor.name}</p>
              <p style={{ color: C.muted, fontSize: "0.8rem" }}>{personalDoctor.specialty}</p>
              <p style={{ color: C.muted, fontSize: "0.8rem" }}>+234 1 XXX XXXX</p>
            </div>
          )}

          <Divider />

          {/* QR Code */}
          <div className="mt-5 flex flex-col items-center gap-2">
            <div style={{ background: "white", padding: 10, borderRadius: 10, display: "inline-block" }}>
              <QRCode value="docura-emergency-p1" />
            </div>
            <p style={{ color: C.muted, fontSize: "0.78rem", textAlign: "center" }}>
              Scan QR for full health record
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <Button variant="primary" onClick={() => setShareModalOpen(true)}>
          Share Emergency Card
        </Button>
        <Button variant="outline" onClick={() => addToast("info", "Preparing for print...")}>
          Print
        </Button>
      </div>

      {/* Privacy Notice */}
      <p style={{ color: C.muted, fontSize: "0.78rem", lineHeight: 1.6 }}>
        Only essential information is shown. You control what is included in your emergency card.
      </p>

      {/* Share Modal */}
      <Modal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Emergency Card"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4">
          {/* Warning */}
          <div
            style={{
              background: C.yellowLight,
              border: `1px solid ${C.yellow}`,
              borderRadius: 8,
              padding: "10px 14px",
            }}
          >
            <p style={{ color: "#7a5c00", fontSize: "0.83rem", fontWeight: 600 }}>
              Emergency cards are temporary and expire after 24 hours.
            </p>
          </div>

          {/* Link */}
          <div>
            <p style={{ color: C.label, fontSize: "0.8rem", marginBottom: 6, fontWeight: 600 }}>
              Shareable link
            </p>
            <div
              style={{
                background: C.warm,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span style={{ color: C.navy, fontSize: "0.8rem", wordBreak: "break-all" }}>
                https://docura.health/emergency/p1-abc123
              </span>
              <button
                onClick={() => addToast("success", "Emergency link copied")}
                style={{
                  background: C.navy,
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "5px 12px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Copy
              </button>
            </div>
          </div>

          <p style={{ color: C.muted, fontSize: "0.8rem", lineHeight: 1.5 }}>
            Anyone with this link can view your emergency information for 24 hours.
          </p>

          <Button variant="outline" onClick={() => setShareModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}
