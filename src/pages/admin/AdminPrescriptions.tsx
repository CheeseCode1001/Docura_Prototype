import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Button, Badge, Modal, StatCard, Tabs } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { ADMIN_PRESCRIPTIONS } from "@/data/mock";

type Prescription = typeof ADMIN_PRESCRIPTIONS[number];
type FilterTab = "All" | "Active" | "Cross-border" | "Used" | "Expired";

const TABS: FilterTab[] = ["All", "Active", "Cross-border", "Used", "Expired"];

function statusBadge(status: string): "green" | "gray" | "red" {
  if (status === "active") return "green";
  if (status === "expired") return "red";
  return "gray";
}

export default function AdminPrescriptions() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [selected, setSelected] = useState<Prescription | null>(null);
  const [voidConfirm, setVoidConfirm] = useState(false);

  const active = ADMIN_PRESCRIPTIONS.filter((p) => p.status === "active");
  const crossBorder = ADMIN_PRESCRIPTIONS.filter((p) => p.crossBorder);

  function getFiltered(): Prescription[] {
    if (activeTab === "Active") return ADMIN_PRESCRIPTIONS.filter((p) => p.status === "active");
    if (activeTab === "Cross-border") return ADMIN_PRESCRIPTIONS.filter((p) => p.crossBorder);
    if (activeTab === "Used") return ADMIN_PRESCRIPTIONS.filter((p) => p.status === "used");
    if (activeTab === "Expired") return ADMIN_PRESCRIPTIONS.filter((p) => p.status === "expired");
    return ADMIN_PRESCRIPTIONS;
  }

  function handleVoid() {
    addToast("success", "Prescription voided");
    setVoidConfirm(false);
    setSelected(null);
  }

  const filtered = getFiltered();

  return (
    <AppShell role="admin">
      <div className="px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>Prescriptions</h1>
          <p className="text-sm mt-1" style={{ color: C.muted, fontFamily: "var(--font-body)" }}>Platform-wide prescription oversight.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            label="Active"
            value={active.length}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>}
            color={C.greenLight}
          />
          <StatCard
            label="Cross-border"
            value={crossBorder.length}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>}
            color="#DBEAFE"
          />
          <StatCard
            label="Total this month"
            value={ADMIN_PRESCRIPTIONS.length}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
            color="#E8ECF5"
          />
        </div>

        <Tabs tabs={TABS} active={activeTab} onChange={(t) => setActiveTab(t as FilterTab)} />

        {/* Table */}
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: "var(--font-body)" }}>
              <thead>
                <tr className="border-b" style={{ borderColor: C.border }}>
                  {["Patient", "Doctor", "Medication", "Date", "Status", "Cross-border", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: C.muted }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-sm" style={{ color: C.muted }}>
                      No prescriptions for this filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((rx, i) => (
                    <tr
                      key={rx.id}
                      className="border-b last:border-0"
                      style={{ borderColor: C.border, backgroundColor: i % 2 === 0 ? "white" : C.warm }}
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: C.navy }}>{rx.patient}</td>
                      <td className="px-4 py-3" style={{ color: C.label }}>{rx.doctor}</td>
                      <td className="px-4 py-3" style={{ color: C.label }}>{rx.medication}</td>
                      <td className="px-4 py-3" style={{ color: C.muted }}>{rx.date}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadge(rx.status)}>{rx.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {rx.crossBorder ? "🌐" : <span style={{ color: C.muted }}>—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" onClick={() => setSelected(rx)}>
                          View details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        <Modal open={!!selected && !voidConfirm} onClose={() => setSelected(null)} title="Prescription Details">
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Patient", selected.patient],
                  ["Doctor", selected.doctor],
                  ["Medication", selected.medication],
                  ["Date", selected.date],
                  ["Status", selected.status],
                  ["Cross-border", selected.crossBorder ? "Yes 🌐" : "No"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg p-3" style={{ backgroundColor: C.warm }}>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: C.muted }}>{label}</p>
                    <p className="font-medium" style={{ color: C.navy, fontFamily: "var(--font-body)" }}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => { addToast("success", "Prescription flagged for review"); setSelected(null); }}
                >
                  Flag for review
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setVoidConfirm(true)}
                >
                  Void prescription
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Void Confirmation Modal */}
        <Modal open={voidConfirm} onClose={() => setVoidConfirm(false)} title="Void Prescription">
          <div className="space-y-4">
            <p className="text-sm" style={{ color: C.label, fontFamily: "var(--font-body)" }}>
              Are you sure you want to void this prescription? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setVoidConfirm(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleVoid}>Confirm void</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
