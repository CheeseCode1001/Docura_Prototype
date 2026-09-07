import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { Card, Button, Avatar, Badge, VerifiedBadge, AvailabilityDot, StarRating, Chip, C, AlertBanner } from "@/components/ui";
import { api } from "@/services/api";

export default function FindDoctor() {
  const { navigate, role } = useApp();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [availableNow, setAvailableNow] = useState(false);
  const [sort, setSort] = useState<"match" | "rating" | "price">("match");
  const DOCTORS = api.doctors();

  const specialties = ["All", "General Practice", "Women's Health", "Mental Wellbeing", "Dermatology", "Cardiology"];

  const filtered = DOCTORS.filter((d) => {
    const matchSearch = search === "" || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialty === "All" || d.specialty === specialty;
    const matchAvail = !availableNow || d.availability === "online";
    return matchSearch && matchSpecialty && matchAvail;
  }).sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "price") return a.consultationPrice - b.consultationPrice;
    return (b.discovery?.score || 0) - (a.discovery?.score || 0);
  });

  return (
    <AppShell role={role} topBarTitle="Find a doctor">
      <div className="w-full px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors, specialties or conditions"
            className="w-full rounded-xl border pl-11 pr-4 py-3 text-sm outline-none"
            style={{ borderColor: C.border, fontFamily: "var(--font-body)" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = C.amber; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
          />
        </div>

        {/* Filters */}
        <div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {specialties.map((s) => (
              <Chip key={s} label={s} selected={specialty === s} onClick={() => setSpecialty(s)} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Chip label="🟢 Online now" selected={availableNow} onClick={() => setAvailableNow(!availableNow)} />
            <Chip label="Best match" selected={sort === "match"} onClick={() => setSort("match")} />
            <Chip label="Highest rated" selected={sort === "rating"} onClick={() => setSort("rating")} />
            <Chip label="Lowest price" selected={sort === "price"} onClick={() => setSort("price")} />
          </div>
        </div>

        <AlertBanner
          type="info"
          title="Why these doctors?"
          body="Docura ranks on responsiveness, continuity, patient ratings and availability — and rotates newly verified doctors into view so ranking does not simply reward whoever arrived first. Each card shows its reasons."
        />

        {/* Results */}
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: C.muted }}>{filtered.length} doctors found · sorted by {sort === "match" ? "best match" : sort === "rating" ? "rating" : "price"}</p>
          {filtered.map((doc) => (
            <Card key={doc.id} onClick={() => navigate("doctor-profile", { doctorId: doc.id })}>
              <div className="flex gap-4 items-start">
                <Avatar src={doc.photo} name={doc.name} size={60} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-bold" style={{ color: C.navy }}>{doc.name}</p>
                    <VerifiedBadge />
                    {doc.availability === "online" && <Badge variant="green">Online Now</Badge>}
                  </div>
                  <p className="text-sm mb-1" style={{ color: C.muted }}>{doc.specialty}</p>
                  <div className="flex flex-wrap gap-3 text-xs mb-3" style={{ color: C.muted }}>
                    <span>🌍 {doc.country}</span>
                    <span>💼 {doc.experience} yrs exp</span>
                    <span>🗣 {doc.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <StarRating rating={doc.rating} count={doc.reviews} />
                    <AvailabilityDot status={doc.availability} />
                    {doc.discovery?.rotationBoost && <Badge variant="blue">Newly verified</Badge>}
                  </div>
                  {doc.discovery && (
                    <div className="mt-3 rounded-xl p-3" style={{ backgroundColor: C.warm }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold" style={{ color: C.navy }}>Match score {doc.discovery.score}</p>
                        <span className="text-[11px]" style={{ color: C.muted }}>Why this doctor</span>
                      </div>
                      <ul className="flex flex-col gap-1">
                        {doc.discovery.reasons.slice(0, 2).map((reason) => (
                          <li key={reason} className="text-xs flex gap-2" style={{ color: C.muted }}>
                            <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: C.amber }} />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
                <div>
                  <p className="text-xs" style={{ color: C.muted }}>From</p>
                  <p className="text-base font-bold" style={{ color: C.navy }}>{doc.currency}{doc.monthlyPrice.toLocaleString()}<span className="text-xs font-normal" style={{ color: C.muted }}>/month</span></p>
                </div>
                <Button size="sm" onClick={(e) => { e?.stopPropagation(); navigate("doctor-profile", { doctorId: doc.id }); }}>View profile</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
