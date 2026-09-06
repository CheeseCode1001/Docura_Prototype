import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Toggle, Button, C } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { DOCTORS } from "@/data/mock";

function SettingsRow({ label, value, onClick }: { label: string; value?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between w-full py-3.5 border-b last:border-0 text-left" style={{ borderColor: C.border }}>
      <span className="text-sm" style={{ color: C.navy }}>{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm" style={{ color: C.muted }}>{value}</span>}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
      </div>
    </button>
  );
}

export default function DoctorSettings() {
  const { navigate, setRole } = useApp();
  const doc = DOCTORS[0];
  const [notifPatient, setNotifPatient] = useState(true);
  const [notifPayment, setNotifPayment] = useState(true);
  const [notifReview, setNotifReview] = useState(true);

  return (
    <AppShell role="doctor" topBarTitle="Settings">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.muted }}>Profile</p>
          <Card padding={false}>
            <div className="px-4">
              <SettingsRow label="Edit profile" onClick={() => navigate("doctor-profile-mgmt")} />
              <SettingsRow label="Professional information" value={doc.specialty} />
              <SettingsRow label="Licensing" value={doc.licenseNum} />
              <SettingsRow label="Verification status" onClick={() => navigate("doctor-verification")} />
              <SettingsRow label="Pricing" value={`₦${doc.monthlyPrice.toLocaleString()}/mo`} />
            </div>
          </Card>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.muted }}>Notifications</p>
          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between"><p className="text-sm" style={{ color: C.navy }}>New patient messages</p><Toggle checked={notifPatient} onChange={setNotifPatient} /></div>
              <div className="flex items-center justify-between"><p className="text-sm" style={{ color: C.navy }}>Payment notifications</p><Toggle checked={notifPayment} onChange={setNotifPayment} /></div>
              <div className="flex items-center justify-between"><p className="text-sm" style={{ color: C.navy }}>Prescription review alerts</p><Toggle checked={notifReview} onChange={setNotifReview} /></div>
            </div>
          </Card>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.muted }}>Financial</p>
          <Card padding={false}>
            <div className="px-4">
              <SettingsRow label="Payout information" />
              <SettingsRow label="Earnings" onClick={() => navigate("doctor-earnings")} />
            </div>
          </Card>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.muted }}>Security & Support</p>
          <Card padding={false}>
            <div className="px-4">
              <SettingsRow label="Change password" />
              <SettingsRow label="Two-factor authentication" value="Off" />
              <SettingsRow label="Help & support" />
            </div>
          </Card>
        </div>

        <Button variant="ghost" fullWidth onClick={() => { setRole(null); navigate("landing"); }} className="border" style={{ borderColor: C.border } as React.CSSProperties}>Sign out</Button>
      </div>
    </AppShell>
  );
}
