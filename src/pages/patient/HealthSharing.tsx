import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Badge, Button, C, EmptyState, Modal, QRCode, SectionHeader, StepIndicator } from "@/components/ui";
import { HEALTH_SHARES } from "@/data/mock";
import { useApp } from "@/context/AppContext";

type Share = typeof HEALTH_SHARES[0];

const SHARE_ITEMS = [
  "Conditions",
  "Allergies",
  "Medications",
  "Prescriptions",
  "Consultations",
  "Lab Results",
  "Care Plans",
  "Full health history",
];

const SHARE_WITH_ROLES = ["Doctor", "Hospital", "Family member", "Other"];
const DURATION_OPTIONS = ["24 hours", "7 days", "30 days", "Custom date"];

function ShareCard({ share, onRevoke }: { share: Share; onRevoke?: (id: string) => void }) {
  const { addToast } = useApp();
  const isExpired = share.status === "expired";

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-3"
      style={{
        borderColor: isExpired ? C.border : "rgba(232,160,32,0.25)",
        backgroundColor: isExpired ? C.warm : "white",
        opacity: isExpired ? 0.75 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold" style={{ color: C.navy }}>{share.sharedWith}</p>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{share.sharedWithRole}</p>
        </div>
        <Badge variant={isExpired ? "gray" : "green"}>
          {isExpired ? "Expired" : "Active"}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {share.items.map((item) => (
          <span
            key={item}
            className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: C.amberLight, color: C.amber }}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs" style={{ color: C.muted }}>
        <span>Created {new Date(share.created).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
        <span>Expires {new Date(share.expires).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
      </div>

      {!isExpired && (
        <div className="flex gap-2 pt-1 border-t" style={{ borderColor: C.border }}>
          <Button size="sm" variant="outline" onClick={() => addToast("info", "Opening share view...")}>
            View
          </Button>
          {onRevoke && (
            <Button size="sm" variant="danger" onClick={() => onRevoke(share.id)}>
              Revoke
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function RevokeConfirmModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal open onClose={onClose} title="Revoke share?" maxWidth="max-w-sm">
      <div className="flex flex-col gap-4">
        <p className="text-sm" style={{ color: C.label }}>
          This share will be immediately revoked. The recipient will no longer be able to access your health information through this link.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} fullWidth>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} fullWidth>Revoke</Button>
        </div>
      </div>
    </Modal>
  );
}

function CreateShareModal({ onClose }: { onClose: () => void }) {
  const { addToast } = useApp();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [generated, setGenerated] = useState(false);

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const generatedLink = "https://docura.health/share/new-abc123";

  return (
    <Modal open onClose={onClose} title="Create health share" maxWidth="max-w-lg">
      <div className="flex flex-col gap-5">
        {!generated && <StepIndicator current={step} total={3} />}

        {!generated && step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold" style={{ color: C.navy }}>Who are you sharing with?</p>
            <div className="flex flex-col gap-2">
              {SHARE_WITH_ROLES.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer"
                  style={{
                    borderColor: role === r ? C.amber : C.border,
                    backgroundColor: role === r ? C.amberLight : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                  />
                  <span className="text-sm font-semibold" style={{ color: C.navy }}>{r}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: C.label }}>Name</label>
              <input
                type="text"
                placeholder="Enter their name"
                className="w-full rounded-xl border px-4 py-3 text-sm"
                style={{ borderColor: C.border, color: C.navy, fontFamily: "var(--font-body)" }}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>
            <Button onClick={() => setStep(2)} disabled={!role || !recipientName}>Next</Button>
          </div>
        )}

        {!generated && step === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold" style={{ color: C.navy }}>What would you like to share?</p>
            <div className="flex flex-col gap-2">
              {SHARE_ITEMS.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer"
                  style={{
                    borderColor: selectedItems.includes(item) ? C.amber : C.border,
                    backgroundColor: selectedItems.includes(item) ? C.amberLight : "white",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item)}
                    onChange={() => toggleItem(item)}
                  />
                  <span className="text-sm" style={{ color: C.navy }}>{item}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={selectedItems.length === 0}>Next</Button>
            </div>
          </div>
        )}

        {!generated && step === 3 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold" style={{ color: C.navy }}>How long should the share last?</p>
            <div className="flex flex-col gap-2">
              {DURATION_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer"
                  style={{
                    borderColor: duration === opt ? C.amber : C.border,
                    backgroundColor: duration === opt ? C.amberLight : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={opt}
                    checked={duration === opt}
                    onChange={() => setDuration(opt)}
                  />
                  <span className="text-sm font-semibold" style={{ color: C.navy }}>{opt}</span>
                </label>
              ))}
              {duration === "Custom date" && (
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border px-4 py-3 text-sm"
                  style={{ borderColor: C.border, color: C.navy, fontFamily: "var(--font-body)" }}
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button
                onClick={() => {
                  setGenerated(true);
                  addToast("success", "Health share created successfully.");
                }}
                disabled={!duration || (duration === "Custom date" && !customDate)}
              >
                Generate share link
              </Button>
            </div>
          </div>
        )}

        {generated && (
          <div className="flex flex-col gap-5 items-center text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: C.greenLight }}
            >
              ✅
            </div>
            <div>
              <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
                Share created!
              </p>
              <p className="text-sm mt-1" style={{ color: C.muted }}>
                Shared with {recipientName} · {duration}
              </p>
            </div>

            <div className="w-full rounded-xl border p-4 flex flex-col gap-3 items-center" style={{ borderColor: C.border }}>
              <QRCode value={generatedLink} />
              <p className="text-xs break-all" style={{ color: C.muted }}>{generatedLink}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink).catch(() => null);
                  addToast("success", "Link copied to clipboard.");
                }}
              >
                Copy link
              </Button>
            </div>

            <Button fullWidth onClick={onClose}>Done</Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function HealthSharing() {
  const { addToast } = useApp();
  const [shares, setShares] = useState(HEALTH_SHARES);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const activeShares = shares.filter((s) => s.status === "active");
  const pastShares = shares.filter((s) => s.status === "expired");

  const handleRevoke = (id: string) => {
    setShares((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "expired" as const } : s))
    );
    setRevokeId(null);
    addToast("success", "Share revoked successfully.");
  };

  return (
    <AppShell role="patient" topBarTitle="Health Sharing" showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: C.navy }}
          >
            Share Health Information
          </h1>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            You decide what to share, who with, and for how long.
          </p>
        </div>

        {/* Privacy principles */}
        <div
          className="rounded-2xl p-4 border flex flex-col gap-2"
          style={{ borderColor: "rgba(232,160,32,0.25)", backgroundColor: C.amberLight }}
        >
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: C.amber }}>Privacy first</p>
          {[
            "You are always in control.",
            "Shares expire automatically.",
            "You can revoke any share at any time.",
          ].map((p) => (
            <div key={p} className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="3" strokeLinecap="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm" style={{ color: C.navy }}>{p}</p>
            </div>
          ))}
        </div>

        {/* Active shares */}
        <div>
          <SectionHeader title="Active Shares" />
          <div className="flex flex-col gap-3 mt-3">
            {activeShares.length === 0 ? (
              <EmptyState
                icon={<span className="text-3xl">🔒</span>}
                title="No active shares"
                body="You have not shared any health information yet."
              />
            ) : (
              activeShares.map((share) => (
                <ShareCard key={share.id} share={share} onRevoke={(id) => setRevokeId(id)} />
              ))
            )}
          </div>
        </div>

        {/* Past shares */}
        {pastShares.length > 0 && (
          <div>
            <SectionHeader title="Past Shares" />
            <div className="flex flex-col gap-3 mt-3">
              {pastShares.map((share) => (
                <ShareCard key={share.id} share={share} />
              ))}
            </div>
          </div>
        )}

        {/* Create button */}
        <div className="sticky bottom-6">
          <Button fullWidth size="lg" onClick={() => setCreateOpen(true)}>
            + Create new share
          </Button>
        </div>
      </div>

      {revokeId && (
        <RevokeConfirmModal
          onClose={() => setRevokeId(null)}
          onConfirm={() => handleRevoke(revokeId)}
        />
      )}

      {createOpen && <CreateShareModal onClose={() => setCreateOpen(false)} />}
    </AppShell>
  );
}
