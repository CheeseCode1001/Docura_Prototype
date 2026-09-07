import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Badge, Button, C, EmptyState, Modal } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { api } from "@/services/api";
import type { Payment } from "@/data/types";

const statusBadge: Record<string, "green" | "amber" | "red" | "gray"> = { paid: "green", pending: "amber", failed: "red", refunded: "gray", disputed: "red" };

export default function Payments() {
  const { domain, navigate } = useApp();
  const [selected, setSelected] = useState<Payment | null>(null);

  // Seeded history plus anything paid during this session, with admin status
  // overrides applied so a refund shows the same everywhere.
  const payments: Payment[] = [...domain.extraPayments, ...api.payments()]
    .map((payment) => ({ ...payment, status: domain.paymentOverrides.find((item) => item.id === payment.id)?.status || payment.status }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const subscription = domain.subscriptions[0];
  const subscriptionDoctor = subscription ? api.doctor(subscription.doctorId) : undefined;
  const totalPaid = payments.filter((payment) => payment.status === "paid" && payment.currency === "₦").reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <AppShell role="patient" topBarTitle="Payments">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: C.muted }}>Total paid</p>
            <p className="text-2xl font-bold" style={{ color: C.navy }}>₦{totalPaid.toLocaleString()}</p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{payments.length} transaction{payments.length === 1 ? "" : "s"}</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: C.muted }}>Active subscription</p>
            <p className="text-lg font-bold" style={{ color: C.amber }}>
              {subscription ? `${subscription.currency}${subscription.price.toLocaleString()}/mo` : "None active"}
            </p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{subscriptionDoctor?.name || "Start Docura Care to add one"}</p>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          {payments.length === 0 && (
            <EmptyState icon="💳" title="No payments yet" body="Receipts for consultations and care subscriptions appear here." cta="Find a doctor" onCta={() => navigate("find-doctor")} />
          )}
          {payments.map((pay) => (
            <Card key={pay.id} onClick={() => setSelected(pay)}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: C.navy }}>{pay.description}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>{pay.doctor} · {pay.date}</p>
                </div>
                <div className="text-right ml-3">
                  <p className="font-bold" style={{ color: C.navy }}>{pay.currency}{pay.amount.toLocaleString()}</p>
                  <Badge variant={statusBadge[pay.status] || "gray"}>{pay.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Payment receipt">
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: C.greenLight }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{selected.currency}{selected.amount.toLocaleString()}</p>
              <p className="text-sm" style={{ color: C.muted }}>{selected.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              {[["Date", selected.date], ["Doctor", selected.doctor], ["Status", selected.status], ["Transaction ID", `TXN-${selected.id.toUpperCase()}`]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 border-b last:border-0 text-sm" style={{ borderColor: C.border }}>
                  <span style={{ color: C.muted }}>{k}</span>
                  <span style={{ color: C.navy }}>{v}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" fullWidth onClick={() => setSelected(null)}>Download receipt</Button>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
