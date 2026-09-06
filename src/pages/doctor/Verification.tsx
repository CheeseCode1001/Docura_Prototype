import { AppShell } from "@/components/layout";
import { Card, Badge, Button, C, AlertBanner } from "@/components/ui";

const STATUS = "under-review" as "not-started" | "submitted" | "under-review" | "approved" | "rejected" | "more-info";

const statusConfig = {
  "not-started": { label: "Not started", badge: "gray" as const, icon: "📋" },
  "submitted": { label: "Documents submitted", badge: "blue" as const, icon: "📤" },
  "under-review": { label: "Under review", badge: "amber" as const, icon: "🔍" },
  "approved": { label: "Approved", badge: "green" as const, icon: "✅" },
  "rejected": { label: "Rejected", badge: "red" as const, icon: "❌" },
  "more-info": { label: "More information required", badge: "yellow" as const, icon: "❓" },
};

const DOCS = [
  { name: "MDCN License", status: "verified", desc: "MDCN/2018/4421" },
  { name: "Government ID", status: "verified", desc: "National ID Card" },
  { name: "Selfie verification", status: "under-review", desc: "Submitted Aug 20, 2025" },
  { name: "Medical certificate", status: "pending", desc: "Not yet uploaded" },
];

const docStatusBadge: Record<string, "green" | "amber" | "gray"> = { verified: "green", "under-review": "amber", pending: "gray" };

export default function DoctorVerification() {
  const cfg = statusConfig[STATUS];

  return (
    <AppShell role="doctor" topBarTitle="Verification">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Status card */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{cfg.icon}</div>
            <div>
              <p className="font-bold text-lg mb-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Verification status</p>
              <Badge variant={cfg.badge}>{cfg.label}</Badge>
            </div>
          </div>
          {STATUS === "under-review" && (
            <div className="mt-4 pt-4 border-t text-sm" style={{ borderColor: C.border, color: C.muted }}>
              Our team is reviewing your documents. This typically takes 2-3 business days. You'll receive a notification once the review is complete.
            </div>
          )}
          {STATUS === "approved" && (
            <AlertBanner type="success" title="Your account is verified!" body="You can now receive patients on Docura." />
          )}
          {STATUS === "rejected" && (
            <div className="mt-4">
              <AlertBanner type="error" title="Verification rejected" body="Reason: The MDCN license number provided could not be verified. Please resubmit with a correct license number." />
              <Button className="mt-3" fullWidth>Update documents</Button>
            </div>
          )}
        </Card>

        {/* Notice if pending */}
        {STATUS !== "approved" && (
          <AlertBanner type="warning" title="Account on hold" body="You cannot receive patients until your verification is approved. You can continue to complete your profile and pricing." />
        )}

        {/* Documents */}
        <div>
          <p className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Submitted documents</p>
          <div className="flex flex-col gap-3">
            {DOCS.map((doc) => (
              <Card key={doc.name}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: C.navy }}>{doc.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>{doc.desc}</p>
                  </div>
                  <Badge variant={docStatusBadge[doc.status] || "gray"}>{doc.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <p className="text-sm font-semibold mb-2" style={{ color: C.navy }}>Need help?</p>
          <p className="text-sm mb-3" style={{ color: C.muted }}>If you have questions about the verification process, contact our support team.</p>
          <Button variant="outline" size="sm">Contact support</Button>
        </Card>
      </div>
    </AppShell>
  );
}
