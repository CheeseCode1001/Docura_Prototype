import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Avatar, Badge, Button, Card, C, Input, Modal, ProgressBar } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { api } from "@/services/api";

const MEMBERS = [
  { name: "Emeka Okafor", email: "emeka@helix.example", dept: "Engineering", status: "active", lastSeen: "Today" },
  { name: "Ngozi Adeyemi", email: "ngozi@helix.example", dept: "HR", status: "active", lastSeen: "Yesterday" },
  { name: "Tunde Fashola", email: "tunde@helix.example", dept: "Finance", status: "pending", lastSeen: "-" },
  { name: "Aisha Bello", email: "aisha@helix.example", dept: "Operations", status: "active", lastSeen: "Today" },
  { name: "Chidi Okeke", email: "chidi@helix.example", dept: "Engineering", status: "inactive", lastSeen: "3 days ago" },
];

const PROGRAMS = [
  { id: "annual", name: "Annual Health Check", members: 98, enrolled: 148, color: C.amber },
  { id: "wellbeing", name: "Mental Wellbeing", members: 61, enrolled: 148, color: "#8b5cf6" },
  { id: "chronic", name: "Chronic Disease Management", members: 14, enrolled: 148, color: "#0ea5e9" },
];

const shellStyle = { fontFamily: "var(--font-body)" };
const cardStyle = { backgroundColor: "white", borderColor: C.border };

function Page({ title, eyebrow, children, action }: { title: string; eyebrow: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <AppShell role="enterprise" topBarTitle={title}><div className="px-4 md:px-6 py-6 flex flex-col gap-6" style={shellStyle}><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-widest font-semibold" style={{ color: C.amber }}>{eyebrow}</p><h1 className="text-3xl font-bold mt-1" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>{title}</h1></div>{action}</div>{children}</div></AppShell>;
}

function TableMember({ member }: { member: { name: string; email?: string; dept: string; status: string; lastSeen: string } }) {
  return <div className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: C.border }}><Avatar name={member.name} size={38} /><div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate" style={{ color: C.navy }}>{member.name}</p><p className="text-xs truncate" style={{ color: C.muted }}>{member.email || ""} · {member.dept}</p></div><span className="text-xs font-semibold capitalize" style={{ color: member.status === "active" ? C.green : member.status === "pending" ? C.amber : C.muted }}>{member.status}</span><span className="hidden sm:block text-xs" style={{ color: C.muted }}>{member.lastSeen}</span></div>;
}

function useEnterpriseData() {
  const { domain } = useApp();
  return { members: [...MEMBERS, ...domain.enterpriseMembers], programs: domain.enterprisePrograms.length ? domain.enterprisePrograms : PROGRAMS, activity: domain.enterpriseActivity };
}

export function EnterpriseMembers() {
  const { members } = useEnterpriseData();
  const { inviteEnterpriseMember, addToast } = useApp();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const visible = members.filter((member) => (filter === "all" || member.status === filter) && `${member.name} ${member.email} ${member.dept}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <Page title="Members" eyebrow="People and eligibility" action={<Button onClick={() => setInviteOpen(true)}>Invite member</Button>}>
      <Card style={cardStyle}>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input aria-label="Search members" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, or department" className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none" style={{ borderColor: C.border }} />
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {["all", "active", "pending", "inactive"].map((item) => (
              <button key={item} onClick={() => setFilter(item)} className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold capitalize border" style={{ backgroundColor: filter === item ? C.navy : "white", color: filter === item ? "white" : C.muted, borderColor: filter === item ? C.navy : C.border }}>{item}</button>
            ))}
          </div>
        </div>
        {visible.length ? visible.map((member) => <TableMember key={`${member.name}-${member.email}`} member={member} />) : <p className="py-8 text-center text-sm" style={{ color: C.muted }}>No members match this filter.</p>}
      </Card>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite a member">
        <div className="flex flex-col gap-4">
          <Input label="Work email" type="email" value={email} onChange={setEmail} placeholder="name@company.com" />
          <p className="text-xs" style={{ color: C.muted }}>An invitation gives this person access to Docura care under your organisation's programmes. Their health record stays private to them.</p>
          <Button disabled={!email.includes("@")} onClick={() => { inviteEnterpriseMember(email); addToast("success", `Invitation sent to ${email}.`); setEmail(""); setInviteOpen(false); }} fullWidth>
            Send invitation
          </Button>
        </div>
      </Modal>
    </Page>
  );
}

export function EnterpriseInvitations() {
  const { domain, inviteEnterpriseMember, addToast } = useApp();
  const [email, setEmail] = useState("");
  const invitations = domain.enterpriseMembers.filter((member) => member.status === "pending");
  return <Page title="Invitations" eyebrow="Member onboarding" action={<Button disabled={!email.includes("@")} onClick={() => { inviteEnterpriseMember(email); addToast("success", `Invitation sent to ${email}.`); setEmail(""); }}>Send invitation</Button>}><Card style={cardStyle}><div className="flex gap-3 mb-5"><Input label="Work email" type="email" placeholder="name@company.com" value={email} onChange={setEmail} /></div><h2 className="font-bold mb-2" style={{ color: C.navy }}>Pending invitations</h2>{invitations.length ? invitations.map((member) => <div key={member.id} className="flex items-center justify-between py-3 border-b" style={{ borderColor: C.border }}><div><p className="text-sm font-semibold" style={{ color: C.navy }}>{member.email}</p><p className="text-xs" style={{ color: C.muted }}>Pending assignment</p></div><Badge variant="amber">Pending</Badge></div>) : <p className="text-sm py-5" style={{ color: C.muted }}>No invitations sent yet.</p>}</Card></Page>;
}

export function EnterprisePrograms() {
  const { programs } = useEnterpriseData();
  const { createEnterpriseProgram, addToast } = useApp();
  return <Page title="Care Programs" eyebrow="Employee health pathways" action={<Button onClick={() => { createEnterpriseProgram(); addToast("success", "Care program created."); }}>Add program</Button>}><div className="grid md:grid-cols-3 gap-4">{programs.map((program) => <Card key={program.id || program.name} style={cardStyle}><p className="text-sm font-semibold" style={{ color: C.navy }}>{program.name}</p><p className="text-3xl font-bold mt-4" style={{ color: program.color }}>{program.members}/{program.enrolled}</p><p className="text-xs mt-1 mb-3" style={{ color: C.muted }}>members enrolled</p><ProgressBar value={program.enrolled ? (program.members / program.enrolled) * 100 : 0} /></Card>)}</div></Page>;
}

export function EnterpriseUtilization() {
  const { members, programs } = useEnterpriseData();
  return <Page title="Utilization" eyebrow="Care usage"><div className="grid md:grid-cols-3 gap-4"><Card style={cardStyle}><p className="text-xs" style={{ color: C.muted }}>Eligible members</p><p className="text-3xl font-bold mt-2" style={{ color: C.navy }}>{148 + members.length - 5}</p></Card><Card style={cardStyle}><p className="text-xs" style={{ color: C.muted }}>Active programmes</p><p className="text-3xl font-bold mt-2" style={{ color: C.navy }}>{programs.length}</p></Card><Card style={cardStyle}><p className="text-xs" style={{ color: C.muted }}>Consultations this month</p><p className="text-3xl font-bold mt-2" style={{ color: C.navy }}>38</p></Card></div><Card style={cardStyle}><h2 className="font-bold mb-4" style={{ color: C.navy }}>Programme participation</h2>{programs.map((program) => <div key={program.id || program.name} className="mb-4"><div className="flex justify-between text-sm mb-1"><span style={{ color: C.navy }}>{program.name}</span><span style={{ color: C.muted }}>{program.members} members</span></div><ProgressBar value={program.enrolled ? (program.members / program.enrolled) * 100 : 0} /></div>)}</Card></Page>;
}

export function EnterpriseAssessments() {
  const { addToast } = useApp();
  const [open, setOpen] = useState(false);
  const [assessmentName, setAssessmentName] = useState("");
  return <Page title="Assessments" eyebrow="Population health" action={<Button onClick={() => setOpen(true)}>Create assessment</Button>}><Card style={cardStyle}><h2 className="font-bold" style={{ color: C.navy }}>Assessment library</h2>{["Annual wellbeing check", "Chronic risk questionnaire", "Workplace stress pulse"].map((item) => <div key={item} className="flex items-center justify-between py-4 border-b last:border-0" style={{ borderColor: C.border }}><div><p className="text-sm font-semibold" style={{ color: C.navy }}>{item}</p><p className="text-xs mt-1" style={{ color: C.muted }}>Available to eligible members</p></div><Button size="sm" variant="outline" onClick={() => addToast("info", `${item} opened in demo mode.`)}>Review</Button></div>)}</Card><Modal open={open} onClose={() => setOpen(false)} title="Create assessment"><div className="flex flex-col gap-4"><Input label="Assessment name" value={assessmentName} onChange={setAssessmentName} placeholder="e.g. Annual wellbeing check" /><Button disabled={assessmentName.trim().length < 3} onClick={() => { addToast("success", `${assessmentName} draft created.`); setAssessmentName(""); setOpen(false); }}>Create draft</Button></div></Modal></Page>;
}

export function EnterpriseBilling() {
  const { addToast } = useApp();
  return <Page title="Billing and Payments" eyebrow="Finance"><div className="grid md:grid-cols-3 gap-4"><Card style={cardStyle}><p className="text-xs" style={{ color: C.muted }}>Current plan</p><p className="text-xl font-bold mt-2" style={{ color: C.navy }}>Enterprise Pro</p><Badge variant="green">Active</Badge></Card><Card style={cardStyle}><p className="text-xs" style={{ color: C.muted }}>Current month</p><p className="text-xl font-bold mt-2" style={{ color: C.navy }}>₦640,000</p><p className="text-xs" style={{ color: C.muted }}>Next invoice: 01 Oct 2025</p></Card><Card style={cardStyle}><p className="text-xs" style={{ color: C.muted }}>Payment method</p><p className="text-xl font-bold mt-2" style={{ color: C.navy }}>Card · 4521</p><Button size="sm" variant="outline" onClick={() => addToast("info", "Payment method editor opened in demo mode.")}>Manage</Button></Card></div><Card style={cardStyle}><h2 className="font-bold" style={{ color: C.navy }}>Invoices</h2>{["September 2025", "August 2025", "July 2025"].map((invoice) => <div key={invoice} className="flex items-center justify-between py-4 border-b last:border-0" style={{ borderColor: C.border }}><span className="text-sm" style={{ color: C.navy }}>{invoice}</span><Button size="sm" variant="outline" onClick={() => addToast("success", `${invoice} invoice downloaded.`)}>Download</Button></div>)}</Card></Page>;
}

export function EnterpriseReports() {
  const { addToast } = useApp();
  return <Page title="Reports" eyebrow="Organisation insights"><div className="grid md:grid-cols-3 gap-4">{["Utilization report", "Care outcomes", "Healthcare spend"].map((report) => <Card key={report} style={cardStyle}><p className="font-semibold" style={{ color: C.navy }}>{report}</p><p className="text-xs mt-2 mb-5" style={{ color: C.muted }}>Updated this month</p><Button size="sm" onClick={() => addToast("info", `${report} opened in demo mode.`)}>Open report</Button></Card>)}</div></Page>;
}

export function EnterpriseSettings() {
  const { addToast } = useApp();
  const [name, setName] = useState("Helix Technologies Ltd.");
  const [adminEmail, setAdminEmail] = useState("admin@helix.example");
  return <Page title="Organisation settings" eyebrow="Workspace configuration"><Card style={cardStyle}><div className="max-w-xl flex flex-col gap-4"><Input label="Organisation name" value={name} onChange={setName} /><Input label="Primary admin email" type="email" value={adminEmail} onChange={setAdminEmail} /><Button onClick={() => addToast("success", `Organisation settings saved for ${name}.`)}>Save changes</Button></div></Card><Card style={cardStyle}><h2 className="font-bold" style={{ color: C.navy }}>Data access</h2><p className="text-sm mt-2" style={{ color: C.muted }}>Connected Care Partners see only linked patients and continuity information. Private doctor-patient conversations remain private.</p></Card></Page>;
}

export function EnterpriseReferrals() {
  const { domain, addToast } = useApp();
  const partners = api.hospitals();
  return (
    <Page title="Referral network" eyebrow="Connected care" action={<Button onClick={() => addToast("info", "Referral request opens with your account manager.")}>Request a partner</Button>}>
      <Card style={cardStyle}>
        <h2 className="font-bold" style={{ color: C.navy }}>What partners receive</h2>
        <p className="text-sm mt-2" style={{ color: C.muted }}>
          A referral carries the clinical letter and the health summary the member consented to share. Private doctor-patient conversations are never included, and your organisation sees referral status only, never clinical content.
        </p>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        {partners.map((partner) => (
          <Card key={partner.id} style={cardStyle}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold" style={{ color: C.navy }}>{partner.name}</p>
                <p className="text-xs mt-1" style={{ color: C.muted }}>{partner.type} · {partner.city}</p>
              </div>
              <Badge variant={partner.status === "active" ? "green" : "yellow"}>{partner.status}</Badge>
            </div>
            <p className="text-xs mt-3" style={{ color: C.muted }}>{partner.services.join(" · ")}</p>
            <p className="text-xs mt-3 font-semibold" style={{ color: C.navy }}>{partner.referralsThisMonth} referrals in the last 30 days</p>
          </Card>
        ))}
      </div>
      <Card style={cardStyle}>
        <h2 className="font-bold mb-3" style={{ color: C.navy }}>Referral activity</h2>
        {domain.referrals.length ? domain.referrals.map((referral) => (
          <div key={referral.id} className="flex flex-wrap items-center justify-between gap-3 py-3 border-b last:border-0" style={{ borderColor: C.border }}>
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ color: C.navy }}>{referral.toName}</p>
              <p className="text-xs" style={{ color: C.muted }}>{referral.kind === "doctor" ? "Specialist referral" : "Pharmacy referral"} · {referral.date}</p>
            </div>
            <Badge variant={referral.status === "completed" || referral.status === "accepted" ? "green" : referral.status === "pending" ? "amber" : "gray"}>{referral.status}</Badge>
          </div>
        )) : <p className="text-sm" style={{ color: C.muted }}>No referral activity yet.</p>}
      </Card>
    </Page>
  );
}
