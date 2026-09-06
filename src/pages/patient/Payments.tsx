import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Badge, Button, C, Modal } from "@/components/ui";
import { PAYMENTS } from "@/data/mock";

const statusBadge: Record<string, "green" | "amber" | "red" | "gray"> = { paid: "green", pending: "amber", failed: "red", refunded: "gray" };

export default function Payments() {
  const [selected, setSelected] = useState<typeof PAYMENTS[0] | null>(null);

  return (
    <AppShell role="patient" topBarTitle="Payments">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: C.muted }}>Total paid</p>
            <p className="text-2xl font-bold" style={{ color: C.navy }}>₦49,500</p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>All time</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: C.muted }}>Active subscription</p>
            <p className="text-lg font-bold" style={{ color: C.amber }}>₦15,000/mo</p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>Dr. Amara Osei</p>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          {PAYMENTS.map((pay) => (
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
