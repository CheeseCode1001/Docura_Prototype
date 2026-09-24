import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Button, Input, C, VerifiedBadge, ProgressBar, Badge } from "@/components/ui";
import { DOCTORS } from "@/data/mock";
import { useApp } from "@/context/AppContext";

export default function DoctorProfileMgmt() {
  const { addToast } = useApp();
  const doc = DOCTORS[0];
  const [bio, setBio] = useState(doc.bio);
  const [monthlyPrice, setMonthlyPrice] = useState(String(doc.monthlyPrice));
  const [consultPrice, setConsultPrice] = useState(String(doc.consultationPrice));
  const [availability, setAvailability] = useState(doc.availability);
  const [saving, setSaving] = useState(false);
  const [prescribingEnabled, setPrescribingEnabled] = useState(true);

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast("Profile credentials & practice pricing updated successfully", "success");
    }, 800);
  };

  return (
    <AppShell role="doctor" topBarTitle="Doctor Profile & Credentials">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5 max-w-4xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
        {/* Profile header with Doctor ID */}
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={doc.photo} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover border-2 shadow-sm" style={{ borderColor: C.amber }} />
                <button
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
                  style={{ backgroundColor: C.amber }}
                  title="Update photo"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-xl font-bold" style={{ color: C.navy }}>{doc.name}</h2>
                  <VerifiedBadge />
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-300">
                    DOC-NG-8842
                  </span>
                </div>
                <p className="text-sm font-medium text-stone-600">
                  {doc.specialty} · {doc.qualifications} · {doc.experience} Experience
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Primary Licence: MDCN Full Reg #48291 (Nigeria) · GMC Registered (UK)
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 self-stretch sm:self-center">
              <Badge variant="green">Active Practicing Certificate</Badge>
              <span className="text-[11px] text-stone-400">Renewal: Nov 2026</span>
            </div>
          </div>

          {/* Verification Level & Badges */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 grid sm:grid-cols-3 gap-3 text-xs mb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400">Verification Level</p>
              <p className="font-semibold text-stone-900 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Tier 1 Verified (Full Clinical)
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400">Prescribing Privileges</p>
              <p className="font-semibold text-stone-900 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Dual (Personal + Local Prescriber)
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400">Profile Completeness</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[95%]"></div>
                </div>
                <span className="font-bold text-[11px] text-stone-700">95%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Doctor Bio (Part 2B requirements) */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                Doctor Bio & Clinical Philosophy
              </h3>
              <p className="text-xs text-stone-500">
                50–200 words visible on your patient-facing profile and care team cards.
              </p>
            </div>
            <button
              onClick={() => {
                setBio("I am a consultant family physician with 14 years of clinical experience across Nigeria and the United Kingdom. My practice focuses on cardiovascular risk reduction, proactive diabetes prevention, and empowering patients with clear health literacy. I believe in continuous, patient-centred care that prevents emergencies before they start.");
                addToast("AI generated clinical bio inserted", "info");
              }}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              <span>✨ Re-generate with AI</span>
            </button>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none resize-none focus:border-amber-600 transition-colors"
            style={{ borderColor: C.border }}
          />
          <div className="flex justify-between items-center text-xs text-stone-400 mt-2">
            <span>Minimum 50 words recommended for patient trust</span>
            <span className="font-mono">{bio.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </Card>

        {/* Prescribing Workspace Eligibility */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-base text-stone-900">Statutory Prescribing Desk Participation</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Opt in to receive statutory prescription validation requests from cross-border personal doctors in your jurisdiction.
              </p>
              <p className="text-xs text-amber-800 mt-1 font-medium">
                Standard compensation: ₦3,500 statutory review fee per prescription episode.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={prescribingEnabled}
                onChange={(e) => setPrescribingEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
        </Card>

        {/* Real-Time Availability */}
        <Card>
          <h3 className="font-bold text-base mb-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
            Live Clinical Availability
          </h3>
          <p className="text-xs text-stone-500 mb-3">
            Sets your immediate status on Docura Now acute consultation queues.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["online", "available-today", "away", "offline"] as const).map((s) => (
              <label
                key={s}
                className="flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all"
                style={{
                  borderColor: availability === s ? C.amber : C.border,
                  backgroundColor: availability === s ? C.amberLight : "white",
                }}
              >
                <input
                  type="radio"
                  name="availability-status"
                  checked={availability === s}
                  onChange={() => setAvailability(s)}
                  className="sr-only"
                />
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      s === "online"
                        ? "#16A34A"
                        : s === "available-today"
                        ? C.amber
                        : s === "away"
                        ? "#CA8A04"
                        : "#9CA3AF",
                  }}
                />
                <span className="text-xs font-semibold capitalize" style={{ color: C.navy }}>
                  {s.replace("-", " ")}
                </span>
              </label>
            ))}
          </div>
        </Card>

        {/* Pricing & Subscriber Protection Rule */}
        <Card>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Consultation & Subscription Pricing
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Grandfathering Active
            </span>
          </div>
          <p className="text-xs text-stone-500 mb-4">
            Under Docura practice terms, existing subscribers keep their agreed subscription rate for 12 months. Price increases apply to new panel subscribers only with 30 days notice.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Docura Care Monthly Retainer (₦)"
                type="number"
                value={monthlyPrice}
                onChange={setMonthlyPrice}
              />
              <p className="text-[11px] text-stone-400 mt-1">Recommended: ₦25,000 – ₦50,000 / month</p>
            </div>
            <div>
              <Input
                label="Docura Now One-Off Consultation (₦)"
                type="number"
                value={consultPrice}
                onChange={setConsultPrice}
              />
              <p className="text-[11px] text-stone-400 mt-1">Recommended: ₦15,000 – ₦25,000 / session</p>
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-3 pt-2">
          <Button fullWidth size="lg" loading={saving} onClick={save} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
            Save Profile & Credentials Changes
          </Button>
        </div>

        <p className="text-xs text-center text-stone-400">
          Credential updates are recorded in the Docura medical compliance registry. ID: DOC-NG-8842.
        </p>
      </div>
    </AppShell>
  );
}
