import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { AiDisclosure, AlertBanner, Avatar, BarChart, Badge, Button, C, Card, EmptyState, FilterBar, Input, Modal, PageHeader, ResponsiveTable, SearchField, SectionHeader, Select, StatusPill } from "@/components/ui";
import { api, formatMoney } from "@/services/api";
import type { HospitalPartner, SupportTicket, TvContent } from "@/data/types";

const STAFF = ["Support · Tola", "Support · Kelechi", "Support · Amaka"];

// ─── Support queue (V2.3) ─────────────────────────────────────────────────────
export function AdminSupport() {
  const { domain, replySupportTicket, updateSupportTicket, addToast } = useApp();
  const [filter, setFilter] = useState("open");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [internal, setInternal] = useState(false);

  const tickets = domain.supportTickets
    .filter((ticket) => (filter === "all" ? true : filter === "open" ? ticket.status !== "resolved" : ticket.status === filter))
    .filter((ticket) => `${ticket.subject} ${ticket.openedBy} ${ticket.category}`.toLowerCase().includes(query.toLowerCase()));

  const selected = domain.supportTickets.find((ticket) => ticket.id === selectedId);

  return (
    <AppShell role="admin" topBarTitle="Support tickets">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Trust & support"
          title="Support queue"
          subtitle="Account, payment and access issues raised by patients, doctors and organisations."
        />

        <AlertBanner type="warning" title="Support has no clinical access" body="Ticket views deliberately exclude consultation notes, prescriptions and health records. Escalate clinical questions to the medical board." />

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1"><SearchField label="Search tickets" value={query} onChange={setQuery} placeholder="Subject, person or category" /></div>
          <FilterBar value={filter} onChange={setFilter} options={[{ id: "open", label: "Open" }, { id: "in-progress", label: "In progress" }, { id: "resolved", label: "Resolved" }, { id: "all", label: "All" }]} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Open", value: domain.supportTickets.filter((t) => t.status === "open").length },
            { label: "In progress", value: domain.supportTickets.filter((t) => t.status === "in-progress").length },
            { label: "Unassigned", value: domain.supportTickets.filter((t) => !t.assignee && t.status !== "resolved").length },
            { label: "High priority", value: domain.supportTickets.filter((t) => t.priority === "high" && t.status !== "resolved").length },
          ].map((metric) => (
            <Card key={metric.label}>
              <p className="text-xs" style={{ color: C.muted }}>{metric.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: C.navy }}>{metric.value}</p>
            </Card>
          ))}
        </div>

        <Card padding={false}>
          <div className="p-4">
            <ResponsiveTable<SupportTicket>
              rows={tickets}
              rowKey={(row) => row.id}
              onRowClick={(row) => setSelectedId(row.id)}
              empty="No tickets in this view."
              columns={[
                { key: "subject", header: "Subject", primary: true, render: (row) => <span className="font-semibold">{row.subject}</span> },
                { key: "from", header: "From", render: (row) => <div><p>{row.openedBy}</p><p className="text-xs" style={{ color: C.muted }}>{row.openedByRole}</p></div> },
                { key: "category", header: "Category", render: (row) => <Badge variant="gray">{row.category}</Badge> },
                { key: "priority", header: "Priority", render: (row) => <Badge variant={row.priority === "high" ? "red" : row.priority === "normal" ? "amber" : "gray"}>{row.priority}</Badge> },
                { key: "assignee", header: "Assignee", render: (row) => row.assignee || <span style={{ color: C.coral }}>Unassigned</span> },
                { key: "updated", header: "Updated", render: (row) => row.updatedAt },
                { key: "status", header: "Status", render: (row) => <StatusPill status={row.status} /> },
              ]}
            />
          </div>
        </Card>
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelectedId(null)} title={selected?.subject} maxWidth="max-w-2xl">
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              <StatusPill status={selected.status} />
              <Badge variant="gray">{selected.category}</Badge>
              <span className="text-xs" style={{ color: C.muted }}>#{selected.id.slice(-6)} · opened {selected.createdAt} by {selected.openedBy}</span>
            </div>

            <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
              {selected.replies.map((item) => (
                <div key={item.id} className="rounded-xl p-3" style={{ backgroundColor: item.internal ? C.yellowLight : item.role === "support" ? C.warm : C.amberLight }}>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold" style={{ color: C.navy }}>{item.author}</p>
                    {item.internal && <Badge variant="yellow">Internal note</Badge>}
                  </div>
                  <p className="text-sm mt-1" style={{ color: C.label }}>{item.text}</p>
                  <p className="text-[11px] mt-1" style={{ color: C.muted }}>{item.at}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Select
                label="Assign to"
                value={selected.assignee || ""}
                onChange={(value) => { updateSupportTicket(selected.id, { assignee: value || null }); addToast("success", value ? `Assigned to ${value}.` : "Unassigned."); }}
                options={[{ value: "", label: "Unassigned" }, ...STAFF.map((name) => ({ value: name, label: name }))]}
              />
              <Select
                label="Status"
                value={selected.status}
                onChange={(value) => { updateSupportTicket(selected.id, { status: value as SupportTicket["status"] }); addToast("success", `Ticket marked ${value}.`); }}
                options={[{ value: "open", label: "Open" }, { value: "in-progress", label: "In progress" }, { value: "waiting", label: "Waiting on customer" }, { value: "resolved", label: "Resolved" }]}
              />
            </div>

            <Input label="Reply" value={reply} onChange={setReply} multiline rows={3} placeholder="Write a response to the customer" />
            <label className="flex items-center gap-2 text-xs" style={{ color: C.muted }}>
              <input type="checkbox" checked={internal} onChange={(event) => setInternal(event.target.checked)} />
              Save as an internal note (not visible to the customer)
            </label>
            <Button
              onClick={() => {
                if (!reply.trim()) { addToast("error", "Write a reply first."); return; }
                replySupportTicket(selected.id, { author: selected.assignee || STAFF[0], role: "support", text: reply, internal });
                setReply("");
                addToast("success", internal ? "Internal note saved." : "Reply sent to the customer.");
              }}
            >
              {internal ? "Save note" : "Send reply"}
            </Button>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}

// ─── Business intelligence (V2.1) ─────────────────────────────────────────────
export function AdminAnalytics() {
  const { adminRole, navigate, domain } = useApp();
  const analytics = api.platformAnalytics();
  const [metric, setMetric] = useState("consultations");
  const financeOnly = adminRole === "finance";

  const series: Record<string, { label: string; values: number[]; color: string; format?: (value: number) => string }> = {
    consultations: { label: "Consultations", values: analytics.consultations, color: C.navy },
    revenue: { label: "Revenue (₦)", values: analytics.revenue, color: C.amber, format: (value) => `${Math.round(value / 1000000)}m` },
    newPatients: { label: "New patients", values: analytics.newPatients, color: C.coral },
    crossBorderCases: { label: "Cross-border cases", values: analytics.crossBorderCases, color: C.blue },
  };
  const active = series[metric];

  return (
    <AppShell role="admin" topBarTitle="Business insights">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-6" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow={`${api.adminRole(adminRole).label} view`}
          title="Platform intelligence"
          subtitle={api.adminRole(adminRole).summary}
          actions={<Button variant="outline" onClick={() => navigate("admin-audit-log")}>Audit log</Button>}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Consultations (6m)", value: analytics.consultations.reduce((a, b) => a + b, 0) },
            { label: "Revenue (6m)", value: formatMoney("₦", analytics.revenue.reduce((a, b) => a + b, 0)) },
            { label: "New patients (6m)", value: analytics.newPatients.reduce((a, b) => a + b, 0) },
            { label: "Payout volume (6m)", value: formatMoney("₦", analytics.payoutVolume.reduce((a, b) => a + b, 0)) },
          ].map((item) => (
            <Card key={item.label}>
              <p className="text-xs" style={{ color: C.muted }}>{item.label}</p>
              <p className="text-lg sm:text-xl font-bold mt-1 break-words" style={{ color: C.navy }}>{item.value}</p>
            </Card>
          ))}
        </div>

        <Card>
          <SectionHeader title={active.label} subtitle="Last six months" />
          <FilterBar
            value={metric}
            onChange={setMetric}
            options={Object.entries(series).map(([id, value]) => ({ id, label: value.label }))}
          />
          <div className="mt-5"><BarChart labels={analytics.months} values={active.values} color={active.color} format={active.format} /></div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-5">
          <Card>
            <SectionHeader title="Revenue vs payouts" subtitle="Gross platform revenue against doctor payouts" />
            <div className="flex flex-col gap-4">
              {analytics.months.map((month, index) => (
                <div key={month}>
                  <div className="flex justify-between text-xs mb-1"><span style={{ color: C.muted }}>{month}</span><span style={{ color: C.navy }}>{formatMoney("₦", analytics.revenue[index])} / {formatMoney("₦", analytics.payoutVolume[index])}</span></div>
                  <div className="h-2 rounded-full overflow-hidden flex" style={{ backgroundColor: "#F3F4F6" }}>
                    <div style={{ width: `${(analytics.payoutVolume[index] / analytics.revenue[index]) * 100}%`, backgroundColor: C.amber }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Supply and demand" subtitle="Doctors joining against patient growth" />
            <BarChart labels={analytics.months} values={analytics.newDoctors} color={C.navy} />
            <p className="text-xs mt-4" style={{ color: C.muted }}>
              {analytics.newPatients[analytics.newPatients.length - 1]} new patients joined last month against {analytics.newDoctors[analytics.newDoctors.length - 1]} new doctors.
            </p>
          </Card>
        </div>

        {!financeOnly && (
          <Card>
            <SectionHeader title="Operational load" subtitle="Live from this session's queues" />
            <div className="grid sm:grid-cols-3 gap-4">
              <div><p className="text-xs" style={{ color: C.muted }}>Open support tickets</p><p className="text-2xl font-bold" style={{ color: C.navy }}>{domain.supportTickets.filter((t) => t.status !== "resolved").length}</p></div>
              <div><p className="text-xs" style={{ color: C.muted }}>Pending referrals</p><p className="text-2xl font-bold" style={{ color: C.navy }}>{domain.referrals.filter((r) => r.status === "pending").length}</p></div>
              <div><p className="text-xs" style={{ color: C.muted }}>Verification decisions made</p><p className="text-2xl font-bold" style={{ color: C.navy }}>{domain.verificationDecisions.length}</p></div>
            </div>
          </Card>
        )}

        <AiDisclosure detail="Aggregate reporting only. Platform intelligence never exposes individual clinical records to commercial or operational reporting." />
      </div>
    </AppShell>
  );
}

// ─── Hospital partners (V3.0) ─────────────────────────────────────────────────
export function AdminHospitals() {
  const { addToast } = useApp();
  const [selected, setSelected] = useState<HospitalPartner | null>(null);
  const hospitals = api.hospitals();

  return (
    <AppShell role="admin" topBarTitle="Hospital partners">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Connected healthcare"
          title="Hospital and diagnostics partners"
          subtitle="Partners receive referrals and shared summaries. They never receive doctor-patient conversations."
          actions={<Button onClick={() => addToast("info", "Partner onboarding opens in the operations console.")}>Add partner</Button>}
        />

        <AlertBanner type="info" title="Partner data boundary" body="Each partnership declares exactly which artefacts it can receive. Anything outside that list is not transmitted." />

        <Card padding={false}>
          <div className="p-4">
            <ResponsiveTable<HospitalPartner>
              rows={hospitals}
              rowKey={(row) => row.id}
              onRowClick={(row) => setSelected(row)}
              columns={[
                { key: "name", header: "Partner", primary: true, render: (row) => <span className="font-semibold">{row.name}</span> },
                { key: "type", header: "Type", render: (row) => row.type },
                { key: "location", header: "Location", render: (row) => `${row.city}, ${row.country}` },
                { key: "services", header: "Services", render: (row) => <span className="text-xs" style={{ color: C.muted }}>{row.services.join(", ")}</span> },
                { key: "referrals", header: "Referrals (30d)", render: (row) => row.referralsThisMonth },
                { key: "status", header: "Status", render: (row) => <StatusPill status={row.status} /> },
              ]}
            />
          </div>
        </Card>
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="flex flex-col gap-4">
            <p className="text-sm" style={{ color: C.muted }}>{selected.type} · {selected.city}, {selected.country}</p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Data this partner receives</p>
              <ul className="flex flex-col gap-2">
                {selected.dataScope.map((scope) => (
                  <li key={scope} className="flex gap-2 text-sm" style={{ color: C.label }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: C.green }} />{scope}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: C.redLight }}>
              <p className="text-xs font-semibold" style={{ color: C.red }}>Never shared</p>
              <p className="text-xs mt-1" style={{ color: C.red }}>Doctor-patient messages, consultation notes and any record the patient has not consented to share.</p>
            </div>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}

// ─── Content moderation (V4.0) ────────────────────────────────────────────────
export function AdminContent() {
  const { addToast, navigate } = useApp();
  const [filter, setFilter] = useState("all");
  const content = api.tvContentAll().filter((item) => filter === "all" || item.moderation === filter);

  return (
    <AppShell role="admin" topBarTitle="Content moderation">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Docura TV"
          title="Creator content review"
          subtitle="Every video is reviewed against the clinical content policy before it reaches patients. Creators must hold a current licence."
          actions={<Button variant="outline" onClick={() => navigate("tv-home")}>Open Docura TV</Button>}
        />

        <FilterBar value={filter} onChange={setFilter} options={[{ id: "all", label: "All" }, { id: "in-review", label: "In review" }, { id: "published", label: "Published" }, { id: "restricted", label: "Restricted" }]} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.map((item: TvContent) => {
            const creator = api.tvCreator(item.creatorId);
            return (
              <Card key={item.id}>
                <div className="flex gap-3">
                  <img src={item.thumbnail} alt="" className="w-16 h-20 rounded-lg object-cover shrink-0" loading="lazy" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold line-clamp-2" style={{ color: C.navy }}>{item.title}</p>
                    <p className="text-xs mt-1" style={{ color: C.muted }}>{creator?.name}</p>
                    <div className="mt-2"><StatusPill status={item.moderation} /></div>
                  </div>
                </div>
                <p className="text-xs mt-3 line-clamp-2" style={{ color: C.muted }}>{item.summary}</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => addToast("success", `${item.title} approved for publication.`)}>Approve</Button>
                  <Button size="sm" variant="ghost" onClick={() => addToast("warning", `${item.title} restricted pending creator response.`)}>Restrict</Button>
                </div>
              </Card>
            );
          })}
        </div>

        <Card>
          <SectionHeader title="Creator verification" subtitle="Licence checks behind every verified badge" />
          {api.tvCreators().map((creator) => (
            <div key={creator.id} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: C.border }}>
              <Avatar src={creator.photo} name={creator.name} size={38} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: C.navy }}>{creator.name}</p>
                <p className="text-xs truncate" style={{ color: C.muted }}>{creator.verificationBody}</p>
              </div>
              <Badge variant="green">Verified</Badge>
            </div>
          ))}
        </Card>

        {!content.length && <EmptyState icon="🎬" title="Nothing in this queue" body="No content matches this moderation state." cta="Show all" onCta={() => setFilter("all")} />}
      </div>
    </AppShell>
  );
}
