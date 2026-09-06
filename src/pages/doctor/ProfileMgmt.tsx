import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Button, Input, C, VerifiedBadge, Badge, ProgressBar } from "@/components/ui";
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

  const save = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); addToast("success", "Profile updated successfully"); }, 1000);
  };

  return (
    <AppShell role="doctor" topBarTitle="My profile">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5">
        {/* Profile header */}
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <img src={doc.photo} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover" />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: C.amber }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold" style={{ color: C.navy }}>{doc.name}</p>
                <VerifiedBadge />
              </div>
              <p className="text-sm" style={{ color: C.muted }}>{doc.specialty} · {doc.country}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold" style={{ color: C.muted }}>Profile completeness</p>
              <p className="text-xs font-bold" style={{ color: C.amber }}>85%</p>
            </div>
            <ProgressBar value={85} />
            <p className="text-xs mt-2" style={{ color: C.muted }}>Add languages to complete your profile</p>
          </div>
        </Card>

        {/* Bio */}
        <Card>
          <p className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>About you</p>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="w-full rounded-lg border px-4 py-3 text-sm outline-none resize-none" style={{ borderColor: C.border }} />
        </Card>

        {/* Availability */}
        <Card>
          <p className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Availability</p>
          <div className="grid grid-cols-2 gap-2">
            {(["online", "available-today", "away", "offline"] as const).map((s) => (
              <label key={s} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all" style={{ borderColor: availability === s ? C.amber : C.border, backgroundColor: availability === s ? C.amberLight : "white" }}>
                <input type="radio" checked={availability === s} onChange={() => setAvailability(s)} className="sr-only" />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s === "online" ? "#16A34A" : s === "available-today" ? C.amber : s === "away" ? "#CA8A04" : "#9CA3AF" }} />
                <span className="text-sm capitalize" style={{ color: C.navy }}>{s.replace("-", " ")}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Pricing */}
        <Card>
          <p className="font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Pricing</p>
          <p className="text-xs mb-4" style={{ color: C.muted }}>Existing subscribers keep their current rate if you increase pricing.</p>
          <div className="flex flex-col gap-3">
            <Input label="Monthly care price (₦)" type="number" value={monthlyPrice} onChange={setMonthlyPrice} />
            <Input label="Docura Now consultation price (₦)" type="number" value={consultPrice} onChange={setConsultPrice} />
          </div>
        </Card>

        <Button fullWidth size="lg" loading={saving} onClick={save}>Save changes</Button>

        {/* Profile preview note */}
        <p className="text-xs text-center" style={{ color: C.muted }}>
          Changes will be visible to patients immediately. Existing subscription pricing is protected.
        </p>
      </div>
    </AppShell>
  );
}
