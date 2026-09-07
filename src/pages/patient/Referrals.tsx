import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { AlertBanner, Badge, Button, C, Card, EmptyState, PageHeader, SectionHeader, StatusPill } from "@/components/ui";
import { api } from "@/services/api";

export default function PatientReferrals() {
  const { navigate, domain, addToast } = useApp();
  const patient = api.patient();
  const referrals = domain.referrals.filter((item) => item.patientId === patient.id);
  const doctorReferrals = referrals.filter((item) => item.kind === "doctor");
  const pharmacyReferrals = referrals.filter((item) => item.kind === "pharmacy");

  return (
    <AppShell role="patient" topBarTitle="Referrals">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6 max-w-4xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Your care network"
          title="Referrals"
          subtitle="When your doctor sends you on to a colleague or a pharmacy, it is recorded here — including what was shared."
          actions={<Button variant="outline" onClick={() => navigate("care-team")}>View care team</Button>}
        />

        <AlertBanner type="info" title="You can see exactly what travels with a referral" body="A referral carries your doctor's letter and the health summary you agreed to share. Your full record stays with you." />

        {referrals.length === 0 ? (
          <EmptyState icon="🔗" title="No referrals yet" body="If your doctor refers you to a specialist or a pharmacy, you will find the details here." cta="Find a doctor" onCta={() => navigate("find-doctor")} />
        ) : (
          <>
            <Card>
              <SectionHeader title="Doctor referrals" subtitle={`${doctorReferrals.length} in your record`} />
              {doctorReferrals.length ? doctorReferrals.map((referral) => (
                <div key={referral.id} className="py-4 border-b last:border-0" style={{ borderColor: C.border }}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: C.navy }}>{referral.toName}</p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>{referral.toDetail} · referred by {referral.fromDoctor}</p>
                    </div>
                    <StatusPill status={referral.status} />
                  </div>
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: C.label }}>{referral.reason}</p>
                  {referral.notes && <p className="text-xs mt-2 rounded-lg p-3" style={{ backgroundColor: C.warm, color: C.muted }}>Shared with this referral: {referral.notes}</p>}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs" style={{ color: C.muted }}>{referral.date}</span>
                    {referral.status === "accepted" && <Button size="sm" variant="outline" onClick={() => navigate("find-doctor")}>Book with this doctor</Button>}
                  </div>
                </div>
              )) : <p className="text-sm py-3" style={{ color: C.muted }}>No doctor referrals yet.</p>}
            </Card>

            <Card>
              <SectionHeader title="Pharmacy referrals" subtitle="Where your prescriptions can be dispensed" />
              {pharmacyReferrals.length ? pharmacyReferrals.map((referral) => (
                <div key={referral.id} className="flex flex-wrap items-center justify-between gap-3 py-4 border-b last:border-0" style={{ borderColor: C.border }}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: C.navy }}>{referral.toName}</p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>{referral.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={referral.status} />
                    <Button size="sm" variant="ghost" onClick={() => addToast("info", "Directions open in your maps app.")}>Directions</Button>
                  </div>
                </div>
              )) : <p className="text-sm py-3" style={{ color: C.muted }}>No pharmacy referrals yet.</p>}
            </Card>
          </>
        )}

        <Card>
          <SectionHeader title="Verified pharmacies near you" subtitle="Docura only lists licensed dispensing partners" />
          <div className="grid sm:grid-cols-3 gap-3">
            {api.pharmacies().map((pharmacy) => (
              <div key={pharmacy.id} className="rounded-xl border p-4" style={{ borderColor: C.border }}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: C.navy }}>{pharmacy.name}</p>
                  {pharmacy.verified && <Badge variant="green">Verified</Badge>}
                </div>
                <p className="text-xs mt-1" style={{ color: C.muted }}>{pharmacy.city} · {pharmacy.distance}</p>
                <p className="text-xs mt-2" style={{ color: C.muted }}>{pharmacy.dispenses.join(", ")}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
