import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Button, C, Modal, AlertBanner } from "@/components/ui";

export default function AdminRefunds() {
  const [search, setSearch] = useState("");
  const [found, setFound] = useState(false);
  const [refundModal, setRefundModal] = useState(false);
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => { if (search) setFound(true); };
  const handleRefund = () => { setLoading(true); setTimeout(() => { setLoading(false); setSuccess(true); }, 1500); };

  const TRANSACTION = { id: "TXN-PAY3", patient: "Adaeze Okafor", doctor: "Dr. Fatima Bello", amount: 4500, currency: "₦", date: "2025-08-10", desc: "Docura Now consultation" };

  return (
    <AppShell role="admin" topBarTitle="Refunds">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <h2 className="font-bold text-lg mb-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Process a refund</h2>
          <p className="text-sm" style={{ color: C.muted }}>Search for a transaction by ID, patient name, or email.</p>
        </div>

        <div className="flex gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="TXN-ID, patient name or email..." className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }} onFocus={(e) => { e.currentTarget.style.borderColor = C.amber; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }} />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {found && (
          <Card>
            <div className="flex flex-col gap-3">
              <p className="font-bold" style={{ color: C.navy }}>Transaction found</p>
              {[["Transaction ID", TRANSACTION.id], ["Patient", TRANSACTION.patient], ["Doctor", TRANSACTION.doctor], ["Amount", `${TRANSACTION.currency}${TRANSACTION.amount.toLocaleString()}`], ["Date", TRANSACTION.date], ["Description", TRANSACTION.desc]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b last:border-0 text-sm" style={{ borderColor: C.border }}>
                  <span style={{ color: C.muted }}>{k}</span>
                  <span className="font-medium" style={{ color: C.navy }}>{v}</span>
                </div>
              ))}
              <Button onClick={() => setRefundModal(true)}>Process refund</Button>
            </div>
          </Card>
        )}
      </div>

      <Modal open={refundModal} onClose={() => { setRefundModal(false); setSuccess(false); }} title="Process refund">
        {!success ? (
          <div className="flex flex-col gap-4">
            <AlertBanner type="warning" title="Confirm before refunding" body="This action will initiate a refund to the patient. This cannot be undone." />
            <div className="flex flex-col gap-2 text-sm">
              {[["Amount", `${TRANSACTION.currency}${TRANSACTION.amount.toLocaleString()}`], ["Patient", TRANSACTION.patient], ["Original transaction", TRANSACTION.id]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b" style={{ borderColor: C.border }}>
                  <span style={{ color: C.muted }}>{k}</span>
                  <span style={{ color: C.navy }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: C.label }}>Reason for refund</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="e.g. Doctor did not complete consultation..." className="w-full rounded-lg border px-4 py-3 text-sm outline-none resize-none" style={{ borderColor: C.border }} />
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={() => setRefundModal(false)}>Cancel</Button>
              <Button fullWidth loading={loading} disabled={!reason} onClick={handleRefund}>Confirm refund</Button>
            </div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "#DCFCE7" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Refund initiated!</p>
            <p className="text-sm" style={{ color: C.muted }}>{TRANSACTION.currency}{TRANSACTION.amount.toLocaleString()} refund has been initiated for {TRANSACTION.patient}.</p>
            <Button fullWidth onClick={() => { setRefundModal(false); setSuccess(false); setFound(false); setSearch(""); }}>Done</Button>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
