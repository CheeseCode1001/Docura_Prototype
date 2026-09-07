import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { AlertBanner, Avatar, Badge, Button, C, Card, EmptyState, Input, Modal, PageHeader, PermissionRow, SectionHeader, StatusPill } from "@/components/ui";
import { api } from "@/services/api";
import type { PermissionScope, ProxyRelationship } from "@/data/types";

const PROXY_NAME = "Ifeoma Okafor";

function useRelationships() {
  const { domain, params } = useApp();
  const relationships = domain.proxyRelationships;
  const active = relationships.find((item) => item.id === params.relationshipId) || relationships.find((item) => item.status === "active") || relationships[0];
  return { relationships, active };
}

/** Central rule for the whole proxy surface: no scope, no data. */
export function proxyCan(relationship: ProxyRelationship | undefined, scope: PermissionScope): boolean {
  if (!relationship || relationship.status !== "active") return false;
  return Boolean(relationship.permissions.find((item) => item.scope === scope)?.granted);
}

function LockedPanel({ label, onRequest }: { label: string; onRequest: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed p-6 text-center" style={{ borderColor: C.border }}>
      <p className="text-2xl mb-2">🔒</p>
      <p className="text-sm font-semibold" style={{ color: C.navy }}>{label} is not shared with you</p>
      <p className="text-xs mt-1 mb-4 max-w-sm mx-auto" style={{ color: C.muted }}>
        The patient owns this record. They can grant access at any time, and withdraw it just as easily.
      </p>
      <Button size="sm" variant="outline" onClick={onRequest}>Request access</Button>
    </div>
  );
}

// ─── Proxy dashboard ──────────────────────────────────────────────────────────
export function ProxyDashboard() {
  const { navigate, domain, addToast } = useApp();
  const { relationships, active } = useRelationships();
  const doctor = api.doctor(api.patient().personalDoctorId);
  const canMeds = proxyCan(active, "view-medications");
  const canConsultations = proxyCan(active, "view-consultations");
  const canBook = proxyCan(active, "book-consultations");
  const medications = api.medications().filter((item) => item.status === "current");
  const followUps = domain.followUps.filter((item) => item.status === "upcoming");

  if (!active) {
    return (
      <AppShell role="proxy" topBarTitle="Docura Proxy">
        <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto w-full">
          <EmptyState icon="👨‍👩‍👧" title="No care relationships yet" body="When someone delegates coordination to you, they will appear here." cta="Learn about Docura Proxy" onCta={() => navigate("public-proxy")} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="proxy" topBarTitle="Docura Proxy">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6 max-w-5xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Care for someone else"
          title={`${active.patientName.split(" ")[0]}'s care, kept close.`}
          subtitle={`You coordinate care as ${active.proxyRelationship.toLowerCase()}. ${active.patientName} owns the medical record — you see only what they have delegated.`}
          actions={<>
            <Button variant="outline" onClick={() => navigate("proxy-permissions", { relationshipId: active.id })}>Manage access</Button>
            {canBook && <Button onClick={() => navigate("find-doctor")}>Book care</Button>}
          </>}
        />

        {relationships.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {relationships.map((relationship) => (
              <button
                key={relationship.id}
                onClick={() => navigate("proxy-dashboard", { relationshipId: relationship.id })}
                className="shrink-0 flex items-center gap-2 rounded-xl border px-3 py-2"
                style={{ borderColor: relationship.id === active.id ? C.amber : C.border, backgroundColor: "white" }}
              >
                <Avatar src={relationship.patientPhoto} name={relationship.patientName} size={26} />
                <span className="text-xs font-semibold" style={{ color: C.navy }}>{relationship.patientName}</span>
                <StatusPill status={relationship.status} />
              </button>
            ))}
          </div>
        )}

        {active.status === "pending" && (
          <AlertBanner type="warning" title="Waiting for consent" body={`${active.patientName} has not accepted your coordination request yet. Nothing is shared until they do.`} />
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <p className="text-xs" style={{ color: C.muted }}>Relationship</p>
            <p className="text-lg font-bold mt-1" style={{ color: C.navy }}>{active.proxyRelationship}</p>
            <div className="mt-2"><StatusPill status={active.status} /></div>
          </Card>
          <Card>
            <p className="text-xs" style={{ color: C.muted }}>Personal doctor</p>
            <div className="flex items-center gap-3 mt-3">
              <Avatar src={doctor?.photo} name={doctor?.name || "Doctor"} size={40} />
              <p className="text-sm font-semibold" style={{ color: C.navy }}>{doctor?.name}</p>
            </div>
          </Card>
          <Card>
            <p className="text-xs" style={{ color: C.muted }}>Access expires</p>
            <p className="text-lg font-bold mt-1" style={{ color: C.navy }}>{active.expiresAt}</p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>{active.permissions.filter((p) => p.granted).length} of {active.permissions.length} permissions granted</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 items-start">
          <Card>
            <SectionHeader title="Current medicines" subtitle="Delegated view" action={canMeds ? "Timeline" : undefined} onAction={() => navigate("proxy-timeline")} />
            {canMeds ? medications.map((medication) => (
              <div key={medication.id} className="flex items-center justify-between gap-3 py-3 border-b last:border-0" style={{ borderColor: C.border }}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: C.navy }}>{medication.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>{medication.dosage} · {medication.frequency}</p>
                </div>
                <Badge variant={medication.todayTaken ? "green" : "yellow"}>{medication.todayTaken ? "Taken today" : "Due"}</Badge>
              </div>
            )) : <LockedPanel label="Medication detail" onRequest={() => addToast("info", `Access request sent to ${active.patientName}.`)} />}
          </Card>

          <Card>
            <SectionHeader title="Upcoming care" subtitle="Follow-ups and appointments" />
            {canConsultations ? (
              followUps.length ? followUps.slice(0, 3).map((followUp) => (
                <div key={followUp.id} className="py-3 border-b last:border-0" style={{ borderColor: C.border }}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold" style={{ color: C.navy }}>{followUp.scheduledDate}</p>
                    <StatusPill status={followUp.status} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>{followUp.reason}</p>
                </div>
              )) : <p className="text-sm py-4" style={{ color: C.muted }}>No upcoming appointments.</p>
            ) : <LockedPanel label="Consultation detail" onRequest={() => addToast("info", `Access request sent to ${active.patientName}.`)} />}
          </Card>
        </div>

        <Card>
          <SectionHeader title="Coordination actions" subtitle="What you can do with the access you hold" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Message the care team", page: "proxy-messages", allowed: proxyCan(active, "message-care-team") },
              { label: "Book a consultation", page: "find-doctor", allowed: canBook },
              { label: "View care timeline", page: "proxy-timeline", allowed: canConsultations },
              { label: "Manage payments", page: "patient-payments", allowed: proxyCan(active, "manage-payments") },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => (action.allowed ? navigate(action.page) : addToast("warning", "This action has not been delegated to you."))}
                className="rounded-xl border p-4 text-left transition-colors"
                style={{ borderColor: C.border, backgroundColor: action.allowed ? "white" : C.warm, opacity: action.allowed ? 1 : 0.65 }}
              >
                <p className="text-sm font-semibold" style={{ color: C.navy }}>{action.label}</p>
                <p className="text-xs mt-1" style={{ color: action.allowed ? C.amber : C.muted }}>{action.allowed ? "Available →" : "Not delegated"}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card style={{ backgroundColor: "#FFFBF0" }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ color: C.navy }}>Emergency information</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>
                {active.emergencyContact
                  ? `You are listed as an emergency contact. Blood group ${api.patient().bloodGroup}; allergies: ${api.patient().allergies.join(", ")}.`
                  : "You are not listed as an emergency contact for this person."}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate("proxy-consent", { relationshipId: active.id })}>Consent record</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

// ─── Permissions ──────────────────────────────────────────────────────────────
export function ProxyPermissions() {
  const { role, navigate, setProxyPermission, updateProxyStatus, addToast } = useApp();
  const { active } = useRelationships();
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  if (!active) {
    return (
      <AppShell role={role} topBarTitle="Permissions" showTopBarBack>
        <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto w-full">
          <EmptyState icon="🔐" title="No delegated access" body="Permissions appear here once a care relationship exists." cta="Back" onCta={() => navigate("proxy-dashboard")} />
        </div>
      </AppShell>
    );
  }

  // A proxy may relax their own access but never widen it into sensitive scopes —
  // only the patient can grant those, so those rows are read-only here.
  const patientOnly = role === "proxy";

  return (
    <AppShell role={role} topBarTitle="Permissions" showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5 max-w-3xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Delegated access"
          title={`What ${active.proxyName} can see`}
          subtitle={`${active.patientName} owns this record. Every scope below is granted individually, expires on ${active.expiresAt}, and can be withdrawn at any moment.`}
        />

        <AlertBanner
          type="info"
          title={patientOnly ? "You can reduce your own access" : "You control every switch"}
          body={patientOnly
            ? "Sensitive scopes such as the full medical record can only be granted by the patient. You can always hand access back."
            : "Granting access sends a notification to your coordinator so nothing changes silently."}
        />

        <Card>
          {active.permissions.map((permission) => (
            <PermissionRow
              key={permission.scope}
              label={permission.label}
              description={permission.description}
              granted={permission.granted}
              sensitive={permission.sensitive}
              disabled={patientOnly && permission.sensitive && !permission.granted}
              onChange={(value) => {
                setProxyPermission(active.id, permission.scope, value);
                addToast("success", `${permission.label} ${value ? "granted" : "removed"}.`);
              }}
            />
          ))}
        </Card>

        <Card>
          <SectionHeader title="Relationship status" subtitle={`Consent given ${active.consentGivenAt} · expires ${active.expiresAt}`} />
          <div className="flex flex-wrap gap-2">
            {active.status !== "active" && (
              <Button onClick={() => { updateProxyStatus(active.id, "active", "2026-09-07"); addToast("success", "Coordination access activated."); }}>Activate access</Button>
            )}
            <Button variant="outline" onClick={() => { updateProxyStatus(active.id, "active", "2026-09-07"); addToast("success", "Access extended by 12 months."); }}>Extend 12 months</Button>
            <Button variant="danger" onClick={() => setConfirmRevoke(true)}>Revoke all access</Button>
          </div>
        </Card>
      </div>

      <Modal open={confirmRevoke} onClose={() => setConfirmRevoke(false)} title="Revoke all delegated access?">
        <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
          Every permission is switched off immediately and {active.proxyName} loses coordination access to {active.patientName}'s record. The consent record keeps a history of what was shared and when.
        </p>
        <div className="flex gap-2 mt-5">
          <Button variant="danger" fullWidth onClick={() => { updateProxyStatus(active.id, "revoked"); setConfirmRevoke(false); addToast("success", "All access revoked."); }}>Revoke access</Button>
          <Button variant="outline" onClick={() => setConfirmRevoke(false)}>Cancel</Button>
        </div>
      </Modal>
    </AppShell>
  );
}

// ─── Consent record ───────────────────────────────────────────────────────────
export function ProxyConsent() {
  const { role, navigate, updateProxyStatus, addToast } = useApp();
  const { active } = useRelationships();
  if (!active) {
    return (
      <AppShell role={role} topBarTitle="Consent" showTopBarBack>
        <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto w-full">
          <EmptyState icon="📝" title="No consent record" body="A consent record is created when a patient delegates coordination." cta="Back" onCta={() => navigate("proxy-dashboard")} />
        </div>
      </AppShell>
    );
  }
  const granted = active.permissions.filter((item) => item.granted);

  return (
    <AppShell role={role} topBarTitle="Consent record" showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5 max-w-3xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader eyebrow="Consent" title="The written record of what was agreed" subtitle="Docura keeps consent explicit, scoped and time-bound so everyone can see exactly what was shared." />
        <Card>
          <dl className="flex flex-col gap-3 text-sm">
            {[
              ["Patient", active.patientName],
              ["Coordinator", `${active.proxyName} (${active.proxyRelationship})`],
              ["Consent given", active.consentGivenAt],
              ["Expires", active.expiresAt],
              ["Status", active.status],
              ["Emergency contact", active.emergencyContact ? "Yes" : "No"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2 border-b last:border-0" style={{ borderColor: C.border }}>
                <dt style={{ color: C.muted }}>{label}</dt>
                <dd className="font-semibold text-right" style={{ color: C.navy }}>{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <SectionHeader title="Scopes currently shared" subtitle={`${granted.length} of ${active.permissions.length}`} />
          {granted.length ? (
            <ul className="flex flex-col gap-2">
              {granted.map((permission) => (
                <li key={permission.scope} className="flex gap-3 text-sm" style={{ color: C.label }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: C.green }} />
                  <span><strong style={{ color: C.navy }}>{permission.label}</strong> — {permission.description}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm" style={{ color: C.muted }}>No scopes are currently shared.</p>}
          <p className="text-xs mt-5 pt-4 border-t" style={{ borderColor: C.border, color: C.muted }}>
            Delegated access never transfers ownership. {active.patientName} remains the owner of this health record and can withdraw consent at any time without giving a reason.
          </p>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate("proxy-permissions", { relationshipId: active.id })}>Manage permissions</Button>
          <Button variant="ghost" onClick={() => { updateProxyStatus(active.id, "revoked"); addToast("success", "Consent withdrawn."); }}>Withdraw consent</Button>
        </div>
      </div>
    </AppShell>
  );
}

// ─── Care timeline (delegated view) ───────────────────────────────────────────
export function ProxyTimeline() {
  const { role, navigate, domain, addToast } = useApp();
  const { active } = useRelationships();
  const canSee = proxyCan(active, "view-consultations");
  const canDocs = proxyCan(active, "view-documents");
  const consultations = [...domain.consultations].reverse();

  return (
    <AppShell role={role} topBarTitle="Care timeline" showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5 max-w-3xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader eyebrow="Coordination" title={`${active?.patientName || "Patient"}'s care timeline`} subtitle="Consultation summaries shared with you. Doctor's private clinical notes are not included." />
        {canSee ? (
          <Card>
            {consultations.map((consultation) => {
              const doctor = api.doctor(consultation.doctorId);
              return (
                <div key={consultation.id} className="flex gap-4 py-4 border-b last:border-0" style={{ borderColor: C.border }}>
                  <div className="flex flex-col items-center pt-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: consultation.type === "now" ? C.amber : C.navy }} />
                    <span className="flex-1 w-px mt-2" style={{ backgroundColor: C.border }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: C.navy }}>{doctor?.name || "Docura doctor"}</p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>{consultation.date} · {consultation.type === "now" ? "Docura Now" : "Docura Care"}</p>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: C.label }}>{consultation.summary}</p>
                  </div>
                </div>
              );
            })}
          </Card>
        ) : <LockedPanel label="The care timeline" onRequest={() => addToast("info", "Access request sent to the patient.")} />}

        <Card>
          <SectionHeader title="Documents" subtitle="Lab results, imaging and reports" />
          {canDocs ? api.documents().map((document) => (
            <div key={document.id} className="flex items-center justify-between gap-3 py-3 border-b last:border-0" style={{ borderColor: C.border }}>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: C.navy }}>{document.title}</p>
                <p className="text-xs" style={{ color: C.muted }}>{document.type} · {document.date}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => addToast("info", "Document opened in demo mode.")}>Open</Button>
            </div>
          )) : <LockedPanel label="Medical documents" onRequest={() => addToast("info", "Access request sent to the patient.")} />}
        </Card>

        <Button variant="outline" onClick={() => navigate("proxy-permissions")}>Review what is shared with you</Button>
      </div>
    </AppShell>
  );
}

// ─── Coordination messages ────────────────────────────────────────────────────
export function ProxyMessages() {
  const { role, domain, addMessage, addToast, navigate } = useApp();
  const { active } = useRelationships();
  const canMessage = proxyCan(active, "message-care-team");
  const [text, setText] = useState("");
  const doctor = api.doctor(api.patient().personalDoctorId);

  return (
    <AppShell role={role} topBarTitle="Messages" showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5 max-w-3xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader eyebrow="Coordination" title={`Messages with ${doctor?.name || "the care team"}`} subtitle="Coordination messages are visible to the patient. Clinical advice stays between the patient and their doctor." />

        {!canMessage ? (
          <LockedPanel label="Messaging the care team" onRequest={() => addToast("info", "Access request sent to the patient.")} />
        ) : (
          <>
            <AlertBanner type="info" title="The patient can read this thread" body="Nothing you send here is hidden from the person you care for." />
            <Card padding={false}>
              <div className="p-4 flex flex-col gap-3 max-h-[50vh] overflow-y-auto">
                {domain.messages.map((message) => (
                  <div key={message.id} className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.isDoctor ? "self-start" : "self-end"}`} style={{ backgroundColor: message.isDoctor ? C.warm : C.amberLight }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: message.isDoctor ? C.navy : C.amber }}>{message.senderName}</p>
                    <p className="text-sm leading-relaxed" style={{ color: C.label }}>{message.text}</p>
                    <p className="text-[11px] mt-1.5" style={{ color: C.muted }}>{message.date} · {message.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t flex flex-col sm:flex-row gap-2" style={{ borderColor: C.border }}>
                <div className="flex-1"><Input label="" value={text} onChange={setText} placeholder="Ask about scheduling, medicines or next steps" /></div>
                <Button
                  onClick={() => {
                    if (!text.trim()) { addToast("error", "Write a message first."); return; }
                    addMessage({ senderId: "proxy-1", senderName: `${PROXY_NAME} (coordinator)`, text, isDoctor: false });
                    setText("");
                    addToast("success", "Message sent to the care team.");
                  }}
                >
                  Send
                </Button>
              </div>
            </Card>
          </>
        )}
        <Button variant="ghost" onClick={() => navigate("proxy-dashboard")}>Back to coordination</Button>
      </div>
    </AppShell>
  );
}

export default ProxyDashboard;
