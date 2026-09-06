import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, C, Badge, Avatar, Button, VerifiedBadge } from "@/components/ui";
import { DOCTORS } from "@/data/mock";

export default function AdminDoctors() {
  const [query, setQuery] = useState("");
  const filtered = DOCTORS.filter((d) =>
    !query || d.name.toLowerCase().includes(query.toLowerCase()) || d.specialty.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell role="admin" topBarTitle="Doctors">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search doctors..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: C.border }}
              onFocus={(e) => { e.currentTarget.style.borderColor = C.amber; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
          </div>
          <p className="text-sm whitespace-nowrap" style={{ color: C.muted }}>{filtered.length} doctors</p>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((d) => (
            <Card key={d.id}>
              <div className="flex items-center gap-4">
                <img src={d.photo} alt={d.name} className="w-11 h-11 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm" style={{ color: C.navy }}>{d.name}</p>
                    {d.verified && <VerifiedBadge />}
                  </div>
                  <p className="text-xs" style={{ color: C.muted }}>{d.specialty} · {d.country} · {d.experience}y exp</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge variant={d.verified ? "green" : "amber"}>{d.verified ? "verified" : "pending"}</Badge>
                  <p className="text-xs" style={{ color: C.muted }}>{d.rating}★ ({d.reviews})</p>
                </div>
                <Button size="sm" variant="ghost">View</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
