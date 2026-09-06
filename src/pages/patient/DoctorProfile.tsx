import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { Button, Badge, VerifiedBadge, AvailabilityDot, StarRating, Card, C } from "@/components/ui";
import { DOCTORS } from "@/data/mock";

const REVIEWS = [
  { name: "Chidinma E.", rating: 5, text: "Dr. Osei is incredibly thorough and caring. He always takes time to explain everything clearly.", date: "Aug 2025" },
  { name: "Emeka N.", rating: 5, text: "The best decision I made was connecting with Dr. Osei on Docura. My health has improved significantly.", date: "Jul 2025" },
  { name: "Yemi A.", rating: 4, text: "Very professional and knowledgeable. I appreciate the continuity of care he provides.", date: "Jun 2025" },
];

export default function DoctorProfile() {
  const { navigate, params } = useApp();
  const doc = DOCTORS.find((d) => d.id === (params.doctorId || "d1")) || DOCTORS[0];

  return (
    <AppShell role="patient" showTopBarBack topBarTitle="">
      <div className="w-full">
        {/* Hero */}
        <div className="px-4 md:px-6 py-6">
          <div className="flex gap-5 items-start">
            <img src={doc.photo} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{doc.name}</h1>
                <VerifiedBadge />
              </div>
              <p className="text-sm mb-2" style={{ color: C.muted }}>{doc.specialty} · {doc.country}</p>
              <div className="flex flex-wrap items-center gap-3">
                <StarRating rating={doc.rating} count={doc.reviews} />
                <AvailabilityDot status={doc.availability} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: "Experience", value: `${doc.experience} yrs` },
              { label: "Patients", value: doc.patients },
              { label: "Rating", value: doc.rating },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border p-3 text-center" style={{ borderColor: C.border }}>
                <p className="font-bold text-lg" style={{ color: C.navy }}>{s.value}</p>
                <p className="text-xs" style={{ color: C.muted }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="green">✓ Identity Verified</Badge>
            <Badge variant="navy">Licensed in {doc.country}</Badge>
            <Badge variant="amber">Docura Verified Doctor</Badge>
          </div>
        </div>

        <div className="px-4 md:px-6 flex flex-col gap-6 pb-32">
          {/* About */}
          <Card>
            <h2 className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>About</h2>
            <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{doc.bio}</p>
            <p className="text-xs mt-3" style={{ color: C.muted }}>
              <span style={{ color: C.navy }}>Usually replies: </span>{doc.responseTime}
            </p>
          </Card>

          {/* Specialties */}
          <Card>
            <h2 className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {doc.conditions.map((c) => (
                <span key={c} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: C.amberLight, color: C.amber }}>{c}</span>
              ))}
            </div>
          </Card>

          {/* Languages */}
          <Card>
            <h2 className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Languages</h2>
            <div className="flex flex-wrap gap-2">
              {doc.languages.map((l) => <Badge key={l} variant="navy">{l}</Badge>)}
            </div>
          </Card>

          {/* Availability */}
          <Card>
            <h2 className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Availability</h2>
            <AvailabilityDot status={doc.availability} />
            <p className="text-xs mt-2" style={{ color: C.muted }}>{doc.responseTime}</p>
          </Card>

          {/* Pricing */}
          <Card>
            <h2 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Pricing</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: C.warm }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.navy }}>Docura Care</p>
                  <p className="text-xs" style={{ color: C.muted }}>Monthly relationship</p>
                </div>
                <p className="font-bold" style={{ color: C.navy }}>{doc.currency}{doc.monthlyPrice.toLocaleString()}/mo</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: C.warm }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.navy }}>Docura Now</p>
                  <p className="text-xs" style={{ color: C.muted }}>One-off consultation</p>
                </div>
                <p className="font-bold" style={{ color: C.navy }}>{doc.currency}{doc.consultationPrice.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs mt-3" style={{ color: C.muted }}>Your doctor sets their own price. If pricing changes, your existing subscription rate is protected.</p>
          </Card>

          {/* Reviews */}
          <Card>
            <h2 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Reviews</h2>
            <div className="flex flex-col gap-4">
              {REVIEWS.map((r, i) => (
                <div key={i} className={i > 0 ? "pt-4 border-t" : ""} style={{ borderColor: C.border }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: C.amber }}>{r.name[0]}</div>
                      <span className="text-sm font-semibold" style={{ color: C.navy }}>{r.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StarRating rating={r.rating} />
                      <span className="text-xs" style={{ color: C.muted }}>{r.date}</span>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: C.muted }}>{r.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 bg-white border-t p-4" style={{ borderColor: C.border }}>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => navigate("docura-now-flow", { doctorId: doc.id })}>Talk to this doctor</Button>
          <Button fullWidth onClick={() => navigate("patient-care", { doctorId: doc.id })}>Continue with {doc.name.split(" ")[1]}</Button>
        </div>
      </div>
    </AppShell>
  );
}
