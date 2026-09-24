import { useState } from "react";
import { AppShell } from "@/components/layout";
import { C, Card, Button, Avatar, Modal } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { api } from "@/services/api";

export default function GrowPractice() {
  const { addToast, navigate } = useApp();
  const doctor = api.doctors()[0];
  const metrics = api.practiceGrowth();
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const referralLink = `${window.location.origin}/dr/${doctor.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  const whatsappText = encodeURIComponent(
    `Hello! I am Dr. Amara Osei on Docura. You can now subscribe to my private primary care practice or consult with me directly from anywhere: ${referralLink}`
  );

  function copyLink() {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    addToast("success", "Practice invitation link copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <AppShell role="doctor" topBarTitle="Grow My Practice">
      <div className="px-4 md:px-6 py-6 space-y-6" style={{ fontFamily: "var(--font-body)" }}>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: C.amber }}>Panel Acquisition & Retention</p>
            </div>
            <h1 className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Grow Your Patient Panel
            </h1>
            <p className="text-sm mt-1" style={{ color: C.muted }}>
              Tools to invite patients, share your professional credentials, and build an independent ongoing care panel.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("doctor-profile-mgmt")}>
            Edit Public Profile
          </Button>
        </div>

        {/* Growth Dashboard Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.muted }}>Profile Views</p>
            <p className="text-3xl font-bold mt-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              {metrics.profileViews}
            </p>
            <p className="text-xs mt-1" style={{ color: C.green }}>↑ +24% from last month</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.muted }}>New Inquiries</p>
            <p className="text-3xl font-bold mt-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              {metrics.newInquiries}
            </p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>Prospective patients exploring care</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.muted }}>Docura Care Subscriptions</p>
            <p className="text-3xl font-bold mt-2" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              {metrics.subscriptionConversions}
            </p>
            <p className="text-xs mt-1" style={{ color: C.green }}>4.8% conversion from profile link</p>
          </Card>
        </div>

        {/* Share Tools & Profile Card */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                Share Your Practice
              </h2>
              <p className="text-xs mt-1" style={{ color: C.muted }}>
                Share your direct registration link with private patients, clinic visitors, or professional networks.
              </p>
            </div>

            {/* Direct Link Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.muted }}>
                Your Direct Patient Link
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl border bg-slate-50" style={{ borderColor: C.border }}>
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 bg-transparent text-sm px-2 outline-none font-medium truncate"
                  style={{ color: C.navy }}
                />
                <Button size="sm" onClick={copyLink}>
                  {copied ? "Copied! ✓" : "Copy Link"}
                </Button>
              </div>
            </div>

            {/* Sharing Channels */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider block" style={{ color: C.muted }}>
                Quick Share Channels
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <a
                  href={`https://wa.me/?text=${whatsappText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl border flex items-center gap-2 hover:bg-emerald-50 transition-colors text-xs font-semibold text-emerald-800 border-emerald-200"
                >
                  <span className="text-lg">💬</span>
                  <span>WhatsApp Share</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="p-3 rounded-xl border flex items-center gap-2 hover:bg-slate-50 transition-colors text-xs font-semibold"
                  style={{ borderColor: C.border, color: C.navy }}
                >
                  <span className="text-lg">📱</span>
                  <span>Desk QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: doctor.name, text: "Consult with me on Docura", url: referralLink });
                    } else {
                      copyLink();
                    }
                  }}
                  className="p-3 rounded-xl border flex items-center gap-2 hover:bg-slate-50 transition-colors text-xs font-semibold"
                  style={{ borderColor: C.border, color: C.navy }}
                >
                  <span className="text-lg">🔗</span>
                  <span>System Share</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs" style={{ color: C.label }}>
              💡 <strong>Practice Growth Tip</strong>: Print the Desk QR code and place it at your physical hospital or clinic reception. Patients scanning it will automatically link you as their primary doctor.
            </div>
          </Card>

          {/* Doctor Profile Card Live Preview */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider block" style={{ color: C.muted }}>
              Patient Discovery Preview
            </label>
            <div className="rounded-2xl p-5 border bg-white shadow-sm space-y-4" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-4">
                <Avatar src={doctor.photo} name={doctor.name} size={64} />
                <div>
                  <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                    {doctor.name}
                  </h3>
                  <p className="text-xs" style={{ color: C.muted }}>
                    {doctor.specialty} · {doctor.country}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-700 font-semibold">
                    <span>✓ Verified Clinician</span>
                    <span>· MDCN</span>
                  </div>
                </div>
              </div>

              <p className="text-xs line-clamp-3 leading-relaxed" style={{ color: C.label }}>
                {doctor.bio}
              </p>

              <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Monthly Care</p>
                  <p className="text-sm font-bold" style={{ color: C.navy }}>₦{doctor.monthlyPrice.toLocaleString()}/mo</p>
                </div>
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 text-white">
                  Subscribe
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        <Modal open={showQrModal} onClose={() => setShowQrModal(false)} title="Clinic Desk QR Code">
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <div className="p-6 rounded-2xl bg-white border-2 border-dashed flex flex-col items-center gap-3" style={{ borderColor: C.navy }}>
              {/* Simulated stylized SVG QR code */}
              <div className="w-48 h-48 bg-slate-900 rounded-xl p-3 flex flex-wrap gap-1 items-center justify-center">
                <div className="w-full h-full bg-white rounded-lg p-2 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-10 h-10 border-4 border-slate-900 rounded-md p-1"><div className="w-full h-full bg-slate-900" /></div>
                    <div className="w-10 h-10 border-4 border-slate-900 rounded-md p-1"><div className="w-full h-full bg-slate-900" /></div>
                  </div>
                  <div className="text-center font-bold text-[10px] text-slate-700 tracking-wider">
                    SCAN TO CONNECT
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-10 h-10 border-4 border-slate-900 rounded-md p-1"><div className="w-full h-full bg-slate-900" /></div>
                    <div className="text-[9px] font-bold text-emerald-700">DOCURA</div>
                  </div>
                </div>
              </div>
              <p className="font-bold text-sm" style={{ color: C.navy }}>{doctor.name}</p>
              <p className="text-xs text-slate-500">Scan to subscribe or start consultation</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => { addToast("success", "QR code image ready for print."); setShowQrModal(false); }}>
                Download Print PDF
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowQrModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
