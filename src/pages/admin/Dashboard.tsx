import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { Card, StatCard, Badge, Button, C, Table } from "@/components/ui";
import { PENDING_VERIFICATIONS, CROSS_BORDER_CASES, ADMIN_PAYOUTS, ADMIN_DISPUTES } from "@/data/mock";

export default function AdminDashboard() {
  const { navigate } = useApp();

  return (
    <AppShell role="admin" topBarTitle="Admin — Overview">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Docura Admin</h1>
          <p className="text-sm" style={{ color: C.muted }}>Internal dashboard · {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Pending verifications" value={PENDING_VERIFICATIONS.length} icon={<span>🔍</span>} sub="Needs review" />
          <StatCard label="Active patients" value={48} icon={<span>👥</span>} sub="All time" color="#DCFCE7" />
          <StatCard label="Active doctors" value={12} icon={<span>🩺</span>} sub="Verified" color="#DBEAFE" />
          <StatCard label="Cross-border cases" value={CROSS_BORDER_CASES.length} icon={<span>🌍</span>} sub="Active" />
          <StatCard label="Pending payouts" value={ADMIN_PAYOUTS.filter((p) => p.status === "requested").length} icon={<span>💰</span>} sub="Awaiting processing" />
          <StatCard label="Open disputes" value={ADMIN_DISPUTES.filter((d) => d.status === "open").length} icon={<span>⚠️</span>} sub="Need attention" color="#FEE2E2" />
        </div>

        {/* Pending verifications */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Doctor verification queue</h2>
            <Button size="sm" variant="outline" onClick={() => navigate("admin-verification")}>View all</Button>
          </div>
          <Table
            headers={["Doctor", "Specialty", "Country", "License", "Submitted", "Status", ""]}
            rows={PENDING_VERIFICATIONS.map((v) => [
              <div className="flex items-center gap-2">
                <img src={v.photo} alt={v.name} className="w-8 h-8 rounded-full object-cover" />
                <span style={{ color: C.navy }}>{v.name}</span>
              </div>,
              v.specialty,
              v.country,
              v.license,
              v.submitted,
              <Badge variant={v.status === "under-review" ? "amber" : v.status === "more-info-required" ? "yellow" : "blue"}>{v.status.replace(/-/g, " ")}</Badge>,
              <Button size="sm" onClick={() => navigate("admin-verification")}>Review</Button>,
            ])}
          />
        </div>

        {/* Cross-border cases */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Cross-border cases</h2>
            <Button size="sm" variant="outline" onClick={() => navigate("admin-crossborder")}>View all</Button>
          </div>
          <div className="flex flex-col gap-3">
            {CROSS_BORDER_CASES.map((cb) => (
              <Card key={cb.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: C.navy }}>{cb.patient}</p>
                    <p className="text-xs" style={{ color: C.muted }}>via {cb.personalDoctor} · {cb.patientCountry} → {cb.prescribingCountry}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={cb.status === "assigned" ? "green" : "amber"}>{cb.status.replace(/-/g, " ")}</Badge>
                    {cb.status !== "assigned" && <Button size="sm" onClick={() => navigate("admin-crossborder")}>Assign doctor</Button>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
