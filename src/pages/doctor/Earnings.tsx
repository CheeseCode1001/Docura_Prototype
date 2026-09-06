import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Button, Badge, C, StatCard, Modal, AlertBanner } from "@/components/ui";

const HISTORY = [
  { id: "p1", date: "2025-08-01", description: "Monthly payout", amount: 38000, currency: "₦", status: "paid" as const },
  { id: "p2", date: "2025-07-01", description: "Monthly payout", amount: 42000, currency: "₦", status: "paid" as const },
  { id: "p3", date: "2025-06-01", description: "Monthly payout", amount: 31000, currency: "₦", status: "paid" as const },
];

const statusBadge: Record<string, "green" | "amber" | "red" | "gray"> = { paid: "green", processing: "amber", failed: "red", requested: "amber" };

export default function DoctorEarnings() {
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleWithdraw = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1800);
  };

  return (
    <AppShell role="doctor" topBarTitle="Your earnings">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Overview */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Available earnings" value="₦45,000" icon={<span>💰</span>} sub="Ready to withdraw" color="#DCFCE7" />
          <StatCard label="Pending payout" value="₦12,000" icon={<span>⏳</span>} sub="Processing" />
          <StatCard label="This month" value="₦57,000" icon={<span>📈</span>} sub="Gross" />
          <StatCard label="Last payout" value="₦38,000" icon={<span>✅</span>} sub="Aug 1, 2025" color="white" />
        </div>

        {/* Earnings breakdown */}
        <Card>
          <p className="font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: C.navy }}>This month's earnings</p>
          <div className="flex flex-col gap-2">
            {[["Care subscriptions (3 patients)", "₦45,000"], ["Docura Now consultations (2)", "₦9,000"], ["Platform fee (20%)", "-₦10,800"], ["Net earnings", "₦43,200"]].map(([k, v], i) => (
              <div key={k} className={`flex justify-between py-2.5 text-sm ${i === 3 ? "border-t font-bold" : "border-b"}`} style={{ borderColor: C.border }}>
                <span style={{ color: i === 3 ? C.navy : C.muted }}>{k}</span>
                <span style={{ color: i === 2 ? C.coral : C.navy }}>{v}</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: C.muted }}>You see net earnings only. Platform fees are deducted before payout.</p>
        </Card>

        {/* Withdraw */}
        <Card>
          <p className="font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Withdraw earnings</p>
          <p className="text-sm mb-4" style={{ color: C.muted }}>Available: ₦45,000 · Minimum withdrawal: ₦10,000</p>
          <Button fullWidth onClick={() => setWithdrawModal(true)}>Request withdrawal</Button>
        </Card>

        {/* Payout history */}
        <div>
          <p className="font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Payout history</p>
          <div className="flex flex-col gap-3">
            {HISTORY.map((h) => (
              <Card key={h.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: C.navy }}>{h.description}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{h.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: C.navy }}>{h.currency}{h.amount.toLocaleString()}</p>
                    <Badge variant={statusBadge[h.status]}>{h.status}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Modal open={withdrawModal} onClose={() => { setWithdrawModal(false); setDone(false); }} title="Request withdrawal">
        {!done ? (
          <div className="flex flex-col gap-4">
            <AlertBanner type="info" title="Withdrawal request" body="Payouts are processed manually within 2-3 business days." />
            <div className="flex justify-between py-3 border-b text-sm" style={{ borderColor: C.border }}>
              <span style={{ color: C.muted }}>Amount to withdraw</span>
              <span className="font-bold" style={{ color: C.navy }}>₦45,000</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: C.label }}>Bank account</label>
              <select className="rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }}>
                <option>GTBank — ****4521</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={() => setWithdrawModal(false)}>Cancel</Button>
              <Button fullWidth loading={loading} onClick={handleWithdraw}>Confirm withdrawal</Button>
            </div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: C.greenLight }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Withdrawal requested!</p>
            <p className="text-sm" style={{ color: C.muted }}>₦45,000 will be sent to your GTBank account within 2-3 business days.</p>
            <Button fullWidth onClick={() => { setWithdrawModal(false); setDone(false); }}>Done</Button>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
