import { useState } from "react";
import { AppShell } from "@/components/layout";
import {
  C,
  Button,
  Card,
  Modal,
  SectionHeader,
  QRCode,
} from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { PATIENT, MEDICATIONS, CARE_TEAM } from "@/data/mock";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDob(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

// ─── Passport Field ───────────────────────────────────────────────────────────
function PassportField({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex-1 rounded-lg px-3 py-2.5"
      style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: C.amber, opacity: 0.8 }}>
        {label}
      </p>
      <p className="text-sm font-medium text-white leading-tight">{value}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HealthPassport() {
  const { addToast } = useApp();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const currentMeds = MEDICATIONS.filter((m) => m.status === "current");
  const personalDoctor = CARE_TEAM.find((ct) => ct.role === "Personal Doctor");
  const prescribingDoctor = CARE_TEAM.find((ct) => ct.role === "Prescribing Doctor");

  const shareUrl = "https://docura.health/passport/p1-share";

  return (
    <AppShell role="patient">
      {/* Page Header */}
      <div className="mb-6">
        <SectionHeader
          title="Health Passport"
          subtitle="Your essential health information, wherever you are."
        />
      </div>

      {/* Premium Passport Card */}
      <div
        className="rounded-3xl overflow-hidden shadow-2xl mb-6 w-full max-w-lg mx-auto"
        style={{
          background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMuted} 60%, #27786b 100%)`,
        }}
      >
        {/* Card Inner Padding */}
        <div className="p-6 pb-0">

          {/* Top Row: Logo + Label + Flag */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              {/* Docura D logo */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: C.amber, color: C.navyMuted }}
              >
                D
              </div>
              <span
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: C.amber }}
              >
                Health Passport
              </span>
            </div>
            {/* Country flag placeholder */}
            <div
              className="rounded-md px-2.5 py-1 text-xs font-semibold"
              style={{ backgroundColor: "rgba(232,160,32,0.15)", color: C.amber, border: "1px solid rgba(232,160,32,0.3)" }}
            >
              🇳🇬 NG
            </div>
          </div>

          {/* Patient Identity Row */}
          <div className="flex items-center gap-5 mb-6">
            {/* Photo */}
            <div
              className="rounded-full shrink-0"
              style={{
                width: 80,
                height: 80,
                padding: 3,
                background: `linear-gradient(135deg, ${C.amber}, #f5c842)`,
              }}
            >
              <img
                src={PATIENT.photo}
                alt={PATIENT.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              {/* Name */}
              <h2
                className="text-xl font-bold text-white leading-tight mb-2 truncate"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {PATIENT.name}
              </h2>
              {/* Blood Group Badge */}
              <div className="flex items-center gap-2">
                <div
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold"
                  style={{ backgroundColor: C.amber, color: C.navyMuted }}
                >
                  {PATIENT.bloodGroup}
                </div>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Blood Group</span>
              </div>
            </div>
          </div>

          {/* Data Fields Row */}
          <div className="flex gap-2 mb-6">
            <PassportField label="Date of Birth" value={formatDob(PATIENT.dob)} />
            <PassportField label="Country" value={PATIENT.country} />
            <PassportField label="Language" value={PATIENT.language} />
          </div>

          {/* Amber Divider */}
          <div
            className="h-px w-full mb-5"
            style={{ background: `linear-gradient(to right, transparent, ${C.amber}, transparent)`, opacity: 0.4 }}
          />

          {/* Conditions */}
          <div className="mb-5">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: C.amber, opacity: 0.8 }}
            >
              Conditions
            </p>
            <div className="flex flex-wrap gap-2">
              {PATIENT.conditions.map((cond) => (
                <span
                  key={cond}
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: "rgba(232,160,32,0.25)", border: "1px solid rgba(232,160,32,0.3)" }}
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>

          {/* Allergies */}
          {PATIENT.allergies.length > 0 && (
            <div className="mb-5">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: C.amber, opacity: 0.8 }}
              >
                Allergies
              </p>
              <div className="flex flex-col gap-1">
                {PATIENT.allergies.map((allergy) => (
                  <div key={allergy} className="flex items-center gap-2">
                    <span style={{ color: "#FF6B6B" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium" style={{ color: "#FF8080" }}>{allergy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Medications */}
          <div className="mb-5">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: C.amber, opacity: 0.8 }}
            >
              Current Medications
            </p>
            <ul className="space-y-1">
              {currentMeds.map((med) => (
                <li key={med.id} className="text-sm text-white opacity-90">
                  {med.name} {med.dosage} — {med.frequency}
                </li>
              ))}
            </ul>
          </div>

          {/* Amber Divider */}
          <div
            className="h-px w-full mb-5"
            style={{ background: `linear-gradient(to right, transparent, ${C.amber}, transparent)`, opacity: 0.4 }}
          />

          {/* Care Team */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {personalDoctor && (
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: C.amber, opacity: 0.8 }}
                >
                  Personal Doctor
                </p>
                <p className="text-sm font-semibold text-white">{personalDoctor.name}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{personalDoctor.specialty}</p>
              </div>
            )}
            {prescribingDoctor && (
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: C.amber, opacity: 0.8 }}
                >
                  Prescribing Doctor
                </p>
                <p className="text-sm font-semibold text-white">{prescribingDoctor.name}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{prescribingDoctor.country}</p>
              </div>
            )}
          </div>

        </div>

        {/* Card Footer */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: "rgba(0,0,0,0.25)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.amber }}>
              Docura Health Passport
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              ID: {PATIENT.id} · Secure & Verified
            </p>
          </div>
          {/* QR Code with white background */}
          <div className="rounded-xl overflow-hidden p-1.5 bg-white shadow-lg">
            <QRCode value="docura-passport-p1" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-center flex-wrap mb-8 max-w-lg mx-auto">
        <Button variant="primary" size="sm">View</Button>
        <Button variant="outline" size="sm" onClick={() => setShareModalOpen(true)}>Share</Button>
        <Button variant="outline" size="sm">Generate QR</Button>
        <Button variant="outline" size="sm">Download</Button>
      </div>

      {/* Share Modal */}
      <Modal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Health Passport"
      >
        <div className="space-y-4">
          <p className="text-sm" style={{ color: C.muted }}>
            Share a secure, read-only link to your essential health information.
          </p>

          {/* Link Field + Copy Button */}
          <div
            className="flex items-center rounded-xl overflow-hidden"
            style={{ border: `1px solid ${C.border}`, backgroundColor: C.warm }}
          >
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none truncate"
              style={{ color: C.label, fontFamily: "monospace" }}
            />
            <button
              onClick={() => {
                addToast("success", "Link copied to clipboard");
              }}
              className="shrink-0 px-4 py-2.5 text-sm font-semibold transition-colors"
              style={{ backgroundColor: C.amber, color: C.navyMuted }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.amberHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.amber; }}
            >
              Copy
            </button>
          </div>

          {/* Expiry note */}
          <div
            className="flex items-start gap-2 rounded-xl p-3"
            style={{ backgroundColor: "#FEF9C3", border: "1px solid #FDE68A" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs" style={{ color: "#92400E" }}>
              This link expires in 24 hours and only shows essential information.
            </p>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
