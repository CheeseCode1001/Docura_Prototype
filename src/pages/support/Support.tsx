import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { AlertBanner, Badge, Button, C, Card, EmptyState, FilterBar, Input, Modal, PageHeader, Select, StatusPill, Toggle } from "@/components/ui";
import { api } from "@/services/api";
import type { SupportTicket } from "@/data/types";

const CATEGORY_OPTIONS = [
  { value: "account", label: "My account" },
  { value: "payments", label: "Payments & refunds" },
  { value: "consultations", label: "Consultations" },
  { value: "prescriptions", label: "Prescriptions" },
  { value: "technical", label: "Something is not working" },
  { value: "other", label: "Something else" },
];

const HELP_ARTICLES = [
  { title: "How Docura Care billing works", body: "Your monthly care fee covers unlimited messaging with your personal doctor, scheduled consultations and care plan reviews. It renews on the same date each month and can be cancelled from Payments.", page: "patient-payments" },
  { title: "Getting a prescription across borders", body: "Your personal doctor stays with you. When you are in a country where they cannot prescribe, a locally licensed prescribing doctor joins your care team to issue the prescription.", page: "travel-mode" },
  { title: "Who can see my health record", body: "You do. Doctors see what is relevant to the care they provide, a proxy sees only what you delegate, and support staff never see clinical notes.", page: "health-sharing" },
  { title: "Rescheduling or cancelling a follow-up", body: "Open Follow-ups, choose the appointment and pick a new time. Your doctor is notified automatically.", page: "follow-ups" },
];

function currentIdentity(role: string | null) {
  if (role === "doctor") return { name: api.doctors()[0].name, role: "doctor" as const };
  if (role === "enterprise") return { name: "Helix Technologies Ltd.", role: "enterprise" as const };
  if (role === "proxy") return { name: api.patient().name === "Adaeze Okafor" ? "Ifeoma Okafor" : "Proxy coordinator", role: "proxy" as const };
  return { name: api.patient().name, role: "patient" as const };
}

// ─── Support centre ───────────────────────────────────────────────────────────
export function SupportCenter() {
  const { navigate, role, domain, createSupportTicket, addToast } = useApp();
  const identity = currentIdentity(role);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("account");
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const myTickets = domain.supportTickets.filter((ticket) => ticket.openedBy === identity.name);
  const visible = myTickets.filter((ticket) => filter === "all" || (filter === "open" ? ticket.status !== "resolved" : ticket.status === "resolved"));

  function submit() {
    if (subject.trim().length < 4 || message.trim().length < 10) {
      addToast("error", "Add a subject and a short description so we can help.");
      return;
    }
    const id = createSupportTicket({ subject, category: category as SupportTicket["category"], message, openedBy: identity.name, openedByRole: identity.role });
    setOpen(false);
    setSubject("");
    setMessage("");
    addToast("success", "Ticket created. Our team will reply shortly.");
    navigate("support-ticket", { ticketId: id });
  }

  return (
    <AppShell role={role} topBarTitle="Support">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6 max-w-5xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Help centre"
          title="We are here to help."
          subtitle="Search common answers, or open a ticket and a person from the Docura team will pick it up."
          actions={<Button onClick={() => setOpen(true)}>New ticket</Button>}
        />

        <AlertBanner
          type="info"
          title="Support does not see your clinical notes"
          body="Our support team can help with accounts, payments and access. Anything clinical goes to your doctor, through your consultations."
        />

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Common questions</h2>
          <div className="flex flex-col gap-2">
            {HELP_ARTICLES.map((article) => (
              <Card key={article.title} padding={false}>
                <button onClick={() => setExpanded(expanded === article.title ? null : article.title)} className="w-full flex items-center justify-between gap-4 p-4 text-left">
                  <span className="text-sm font-semibold" style={{ color: C.navy }}>{article.title}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" style={{ transform: expanded === article.title ? "rotate(180deg)" : "none", transition: "transform 150ms" }}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {expanded === article.title && (
                  <div className="px-4 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{article.body}</p>
                    {role === "patient" && <Button size="sm" variant="ghost" className="mt-3" onClick={() => navigate(article.page)}>Open the related page</Button>}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Your tickets</h2>
            <FilterBar value={filter} onChange={setFilter} options={[{ id: "all", label: "All" }, { id: "open", label: "Open" }, { id: "resolved", label: "Resolved" }]} />
          </div>
          {visible.length ? (
            <div className="flex flex-col gap-2">
              {visible.map((ticket) => (
                <Card key={ticket.id} onClick={() => navigate("support-ticket", { ticketId: ticket.id })}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: C.navy }}>{ticket.subject}</p>
                      <p className="text-xs mt-1" style={{ color: C.muted }}>#{ticket.id.slice(-6)} · {ticket.category} · updated {ticket.updatedAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={ticket.status} />
                      <Badge variant={ticket.priority === "high" ? "red" : "gray"}>{ticket.priority}</Badge>
                    </div>
                  </div>
                  <p className="text-xs mt-3 line-clamp-2" style={{ color: C.muted }}>{ticket.replies[ticket.replies.length - 1]?.text}</p>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon="🎫" title="No tickets yet" body="When you need help with your account, payments or access, open a ticket and we will follow it through." cta="New ticket" onCta={() => setOpen(true)} />
          )}
        </section>

        <Card>
          <h2 className="font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Other ways to reach us</h2>
          <div className="grid sm:grid-cols-3 gap-4 mt-4 text-sm">
            <div><p className="font-semibold" style={{ color: C.navy }}>Patient support</p><p style={{ color: C.muted }}>care@docura.health</p></div>
            <div><p className="font-semibold" style={{ color: C.navy }}>Doctor support</p><p style={{ color: C.muted }}>doctors@docura.health</p></div>
            <div><p className="font-semibold" style={{ color: C.navy }}>Urgent safety concern</p><p style={{ color: C.muted }}>safety@docura.health</p></div>
          </div>
          <p className="text-xs mt-4" style={{ color: C.muted }}>Docura is not an emergency service. If someone is in immediate danger, contact local emergency services.</p>
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Open a support ticket">
        <div className="flex flex-col gap-4">
          <Input label="Subject" value={subject} onChange={setSubject} placeholder="Briefly, what is happening?" />
          <Select label="Category" value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
          <Input label="Description" value={message} onChange={setMessage} multiline rows={5} placeholder="Tell us what you expected and what happened instead." />
          <p className="text-xs" style={{ color: C.muted }}>Please do not include clinical details here — message your doctor for anything about your health.</p>
          <div className="flex gap-2">
            <Button onClick={submit} fullWidth>Create ticket</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}

// ─── Ticket detail ────────────────────────────────────────────────────────────
export function SupportTicketPage() {
  const { role, params, domain, replySupportTicket, updateSupportTicket, addToast, navigate } = useApp();
  const identity = currentIdentity(role);
  const ticket = domain.supportTickets.find((item) => item.id === params.ticketId);
  const [reply, setReply] = useState("");

  if (!ticket) {
    return (
      <AppShell role={role} topBarTitle="Support ticket" showTopBarBack>
        <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto w-full">
          <EmptyState icon="🎫" title="Ticket not found" body="This ticket may have been closed or belongs to another account." cta="Back to support" onCta={() => navigate("support-center")} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role={role} topBarTitle={`Ticket #${ticket.id.slice(-6)}`} showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5 max-w-3xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{ticket.subject}</h1>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Opened {ticket.createdAt} · {ticket.category} · {ticket.assignee || "Awaiting assignment"}</p>
            </div>
            <StatusPill status={ticket.status} />
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          {ticket.replies.filter((item) => !item.internal).map((item) => {
            const fromSupport = item.role === "support";
            return (
              <div key={item.id} className={`max-w-[85%] rounded-2xl p-4 ${fromSupport ? "self-start" : "self-end"}`} style={{ backgroundColor: fromSupport ? "white" : C.amberLight, border: `1px solid ${C.border}` }}>
                <p className="text-xs font-semibold mb-1" style={{ color: fromSupport ? C.navy : C.amber }}>{item.author}</p>
                <p className="text-sm leading-relaxed" style={{ color: C.label }}>{item.text}</p>
                <p className="text-[11px] mt-2" style={{ color: C.muted }}>{item.at}</p>
              </div>
            );
          })}
        </div>

        {ticket.status !== "resolved" ? (
          <Card>
            <Input label="Add a reply" value={reply} onChange={setReply} multiline rows={3} placeholder="Anything else we should know?" />
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                onClick={() => {
                  if (reply.trim().length < 2) { addToast("error", "Write a reply first."); return; }
                  replySupportTicket(ticket.id, { author: identity.name, role: identity.role === "doctor" ? "doctor" : "patient", text: reply });
                  setReply("");
                  addToast("success", "Reply sent to the support team.");
                }}
              >
                Send reply
              </Button>
              <Button variant="outline" onClick={() => { updateSupportTicket(ticket.id, { status: "resolved" }); addToast("success", "Ticket marked resolved."); }}>Mark as resolved</Button>
            </div>
          </Card>
        ) : (
          <AlertBanner type="success" title="This ticket is resolved" body="Reply below to reopen the conversation if the problem comes back." />
        )}

        {ticket.status === "resolved" && (
          <Button variant="outline" onClick={() => { updateSupportTicket(ticket.id, { status: "open" }); addToast("info", "Ticket reopened."); }}>Reopen ticket</Button>
        )}
      </div>
    </AppShell>
  );
}

// ─── Notification preferences ─────────────────────────────────────────────────
export function NotificationPreferences() {
  const { role, domain, setNotificationChannel, addToast, navigate } = useApp();
  return (
    <AppShell role={role} topBarTitle="Notification preferences" showTopBarBack>
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5 max-w-3xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Notifications"
          title="Choose how Docura reaches you."
          subtitle="Turning off in-app notifications for a category also stops new items appearing in your notification list."
          actions={<Button variant="outline" onClick={() => navigate("patient-notifications")}>View notifications</Button>}
        />
        <AlertBanner type="info" title="Where connectivity is limited" body="WhatsApp and SMS keep working when data is patchy, so time-sensitive reminders still arrive." />
        {domain.notificationPreferences.map((preference) => (
          <Card key={preference.id}>
            <p className="text-sm font-semibold" style={{ color: C.navy }}>{preference.label}</p>
            <p className="text-xs mt-1 mb-4" style={{ color: C.muted }}>{preference.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["inApp", "email", "sms", "whatsapp"] as const).map((channel) => (
                <div key={channel} className="flex items-center gap-2">
                  <Toggle
                    checked={preference.channels[channel]}
                    onChange={(value) => { setNotificationChannel(preference.id, channel, value); addToast("success", "Preference saved."); }}
                  />
                  <span className="text-xs" style={{ color: C.label }}>{channel === "inApp" ? "In app" : channel === "whatsapp" ? "WhatsApp" : channel.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

export default SupportCenter;
