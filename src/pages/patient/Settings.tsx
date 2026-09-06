import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Button, Toggle, C, Modal } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { PATIENT } from "@/data/mock";

function SettingsRow({ label, value, onClick }: { label: string; value?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between w-full py-3.5 border-b last:border-0 text-left group" style={{ borderColor: C.border }}>
      <span className="text-sm" style={{ color: C.navy }}>{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm" style={{ color: C.muted }}>{value}</span>}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
      </div>
    </button>
  );
}

export default function PatientSettings() {
  const { navigate, setRole } = useApp();
  const [notifConsult, setNotifConsult] = useState(true);
  const [notifRx, setNotifRx] = useState(true);
  const [notifPay, setNotifPay] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [cancelSubModal, setCancelSubModal] = useState(false);

  return (
    <AppShell role="patient" topBarTitle="Settings">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5">
        {/* Profile */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.muted }}>Profile</p>
          <Card padding={false}>
            <div className="px-4">
              <SettingsRow label="Full name" value={PATIENT.name} />
              <SettingsRow label="Phone number" value={PATIENT.phone} />
              <SettingsRow label="Date of birth" value={PATIENT.dob} />
              <SettingsRow label="Preferred language" value={PATIENT.language} />
              <SettingsRow label="Country" value={PATIENT.country} />
            </div>
          </Card>
        </div>

        {/* Security */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.muted }}>Security</p>
          <Card padding={false}>
            <div className="px-4">
              <SettingsRow label="Change password" />
              <SettingsRow label="Two-factor authentication" value="Off" />
            </div>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.muted }}>Notifications</p>
          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: C.navy }}>Consultation updates</p>
                <Toggle checked={notifConsult} onChange={setNotifConsult} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: C.navy }}>Prescription updates</p>
                <Toggle checked={notifRx} onChange={setNotifRx} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: C.navy }}>Payment receipts</p>
                <Toggle checked={notifPay} onChange={setNotifPay} />
              </div>
            </div>
          </Card>
        </div>

        {/* Subscriptions */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.muted }}>Subscriptions</p>
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: C.navy }}>Dr. Amara Osei</p>
                <p className="text-xs" style={{ color: C.muted }}>₦15,000/month · Active</p>
              </div>
              <Button size="sm" variant="danger" onClick={() => setCancelSubModal(true)}>Cancel</Button>
            </div>
          </Card>
        </div>

        {/* Legal & Help */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.muted }}>Support & Legal</p>
          <Card padding={false}>
            <div className="px-4">
              <SettingsRow label="Help & support" />
              <SettingsRow label="Privacy policy" />
              <SettingsRow label="Terms of service" />
            </div>
          </Card>
        </div>

        {/* Danger zone */}
        <div className="flex flex-col gap-3">
          <Button variant="ghost" fullWidth onClick={() => { setRole(null); navigate("landing"); }} className="border" style={{ borderColor: C.border } as React.CSSProperties}>Sign out</Button>
          <button onClick={() => setDeleteModal(true)} className="text-sm text-center" style={{ color: C.coral }}>Delete my account</button>
        </div>
      </div>

      {/* Cancel subscription confirmation */}
      <Modal open={cancelSubModal} onClose={() => setCancelSubModal(false)} title="Cancel subscription?">
        <p className="text-sm mb-6" style={{ color: C.muted }}>Are you sure you want to cancel your subscription with Dr. Amara Osei? Your care relationship will end at the next billing date.</p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={() => setCancelSubModal(false)}>Keep subscription</Button>
          <Button variant="danger" fullWidth onClick={() => setCancelSubModal(false)}>Cancel subscription</Button>
        </div>
      </Modal>

      {/* Delete account confirmation */}
      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete account?">
        <p className="text-sm mb-3" style={{ color: C.muted }}>This will permanently delete your account and all associated data, including your health records, prescriptions, and consultation history.</p>
        <p className="text-sm font-semibold mb-6" style={{ color: C.coral }}>This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={() => setDeleteModal(false)}>Delete account</Button>
        </div>
      </Modal>
    </AppShell>
  );
}
