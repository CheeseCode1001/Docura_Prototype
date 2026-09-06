import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, C, Badge, Avatar, Button } from "@/components/ui";
import { DOCTOR_PATIENTS } from "@/data/mock";

interface PatientRow {
  id: string;
  name: string;
  photo: string;
  country: string;
  condition?: string;
  doctor?: string;
}

const ALL_PATIENTS: PatientRow[] = [
  ...DOCTOR_PATIENTS.map((p) => ({ id: p.id, name: p.name, photo: p.photo, country: p.country })),
  { id: "p4", name: "Chukwuemeka Eze", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", condition: "Asthma", doctor: "Dr. Sarah Adeyemi", country: "United Kingdom" },
  { id: "p5", name: "Blessing Okonkwo", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop", condition: "Diabetes", doctor: "Dr. Chidi Okonkwo", country: "Canada" },
];

export default function AdminPatients() {
  const [query, setQuery] = useState("");
  const filtered = ALL_PATIENTS.filter((p) =>
    !query || p.name.toLowerCase().includes(query.toLowerCase()) || (p.doctor || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell role="admin" topBarTitle="Patients">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patients..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: C.border }}
              onFocus={(e) => { e.currentTarget.style.borderColor = C.amber; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
          </div>
          <p className="text-sm whitespace-nowrap" style={{ color: C.muted }}>{filtered.length} patients</p>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((p) => (
            <Card key={p.id}>
              <div className="flex items-center gap-4">
                <Avatar src={p.photo} name={p.name} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: C.navy }}>{p.name}</p>
                  <p className="text-xs" style={{ color: C.muted }}>
                    {p.condition || "General"} · {p.doctor || "No doctor"} · {p.country}
                  </p>
                </div>
                <Badge variant="green">active</Badge>
                <Button size="sm" variant="ghost">View</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
