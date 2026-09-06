import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout";
import { Avatar, C } from "@/components/ui";

const CARD = { backgroundColor: "white", border: "1px solid rgba(21,95,84,0.08)", borderRadius: 20, boxShadow: "0 12px 32px rgba(21,95,84,0.05)" };
const BG = "#FAFAF7";

const ORG = {
  name: "Helix Technologies Ltd.",
  plan: "Enterprise Pro",
  memberCount: 148,
  activeCount: 112,
  pendingCount: 6,
};

const MEMBERS = [
  { name: "Emeka Okafor", dept: "Engineering", status: "active", lastSeen: "Today" },
  { name: "Ngozi Adeyemi", dept: "HR", status: "active", lastSeen: "Yesterday" },
  { name: "Tunde Fashola", dept: "Finance", status: "pending", lastSeen: "—" },
  { name: "Aisha Bello", dept: "Operations", status: "active", lastSeen: "Today" },
  { name: "Chidi Okeke", dept: "Engineering", status: "inactive", lastSeen: "3 days ago" },
];

const PROGRAMS = [
  { name: "Annual Health Check", members: 98, enrolled: 148, color: C.amber },
  { name: "Mental Wellbeing", members: 61, enrolled: 148, color: "#8b5cf6" },
  { name: "Chronic Disease Mgmt", members: 14, enrolled: 148, color: "#0ea5e9" },
];

const ACTIVITY = [
  { text: "Ngozi Adeyemi completed annual check-up", time: "2h ago", type: "success" },
  { text: "6 pending membership invitations", time: "4h ago", type: "warn" },
  { text: "Mental Wellbeing enrollment opened", time: "1d ago", type: "info" },
  { text: "Healthcare spend report for August ready", time: "2d ago", type: "info" },
  { text: "Tunde Fashola has not completed onboarding", time: "3d ago", type: "warn" },
];

const SPEND_DATA = [
  { month: "Apr", amount: 820 },
  { month: "May", amount: 1140 },
  { month: "Jun", amount: 970 },
  { month: "Jul", amount: 1380 },
  { month: "Aug", amount: 1210 },
  { month: "Sep", amount: 640 },
];

function SpendChart() {
  const max = Math.max(...SPEND_DATA.map(d => d.amount));
  return (
    <div className="flex items-end justify-between gap-2" style={{ height: 100 }}>
      {SPEND_DATA.map((d) => (
        <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
          <div className="w-full rounded-lg relative overflow-hidden" style={{ height: 70, backgroundColor: "#f0f4f9" }}>
            <div
              className="absolute bottom-0 left-0 right-0 rounded-lg"
              style={{ height: `${(d.amount / max) * 100}%`, backgroundColor: C.amber, opacity: 0.85 }}
            />
          </div>
          <p className="text-center" style={{ fontSize: 9, color: "#a0a9bc" }}>{d.month}</p>
        </div>
      ))}
    </div>
  );
}

function Ico({ type }: { type: string }) {
  const s = { stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  switch (type) {
    case "members": return <svg width="18" height="18" viewBox="0 0 24 24" {...s}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>;
    case "pulse": return <svg width="18" height="18" viewBox="0 0 24 24" {...s}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>;
    case "billing": return <svg width="18" height="18" viewBox="0 0 24 24" {...s}><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
    case "plan": return <svg width="18" height="18" viewBox="0 0 24 24" {...s}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><path d="M9 5a2 2 0 002 2h2a2 2 0 002-2 2 2 0 00-2-2h-2a2 2 0 00-2 2z" /><path d="M9 12h6M9 16h6" /></svg>;
    case "invite": return <svg width="18" height="18" viewBox="0 0 24 24" {...s}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg>;
    case "arrow": return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>;
    default: return null;
  }
}

export default function EnterpriseDashboard() {
  const { navigate } = useApp();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending">("all");
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const filteredMembers = activeTab === "all" ? MEMBERS
    : activeTab === "active" ? MEMBERS.filter(m => m.status === "active")
      : MEMBERS.filter(m => m.status === "pending");

  return (
    <AppShell role="enterprise">
      <div className="editorial-page min-h-full flex flex-col gap-8" style={{ backgroundColor: BG, fontFamily: "var(--font-body)" }}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs mb-0.5" style={{ color: "#a0a9bc" }}>{today}</p>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              {greeting}, {ORG.name}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#8892a4" }}>Here's how healthcare is running across your organisation.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
              style={{ backgroundColor: "white", borderColor: "#e8ebf2", color: C.navy }}
            >
              <Ico type="plan" /> View Reports
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: C.amber }}
            >
              <Ico type="invite" /> Invite Members
            </button>
          </div>
        </div>

        {/* ── Org Hero ───────────────────────────────────────── */}
        <div
          className="p-5 flex items-center gap-5 flex-wrap"
          style={{ ...CARD, border: "none", background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMuted} 100%)` }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(232,160,32,0.2)" }}>
            <span style={{ fontSize: 28 }}>🏢</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>{ORG.plan}</p>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{ORG.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>{ORG.memberCount} members · {ORG.activeCount} active</p>
          </div>
          <div className="flex gap-6 shrink-0 flex-wrap">
            {[
              { label: "Members", value: ORG.memberCount, color: "white" },
              { label: "Active", value: ORG.activeCount, color: "#4ade80" },
              { label: "Pending", value: ORG.pendingCount, color: C.amber },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: s.color }}>{s.value}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main 3-col layout ──────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Col 1: Members */}
          <div className="flex flex-col gap-4">
            <div className="p-5" style={CARD}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold" style={{ color: C.navy }}>Members</p>
                <div className="flex gap-1">
                  {(["all", "active", "pending"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all"
                      style={{ backgroundColor: activeTab === tab ? C.navy : "#f0f4f9", color: activeTab === tab ? "white" : "#a0a9bc" }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col divide-y" style={{ "--tw-divide-opacity": 1 } as React.CSSProperties}>
                {filteredMembers.map((m) => (
                  <div key={m.name} className="flex items-center gap-3 py-2.5">
                    <Avatar name={m.name} size={34} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: C.navy }}>{m.name}</p>
                      <p className="text-xs" style={{ color: "#a0a9bc" }}>{m.dept} · {m.lastSeen}</p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: m.status === "active" ? "#dcfce7" : m.status === "pending" ? C.amberLight : "#f3f4f6",
                        color: m.status === "active" ? "#16a34a" : m.status === "pending" ? C.amber : "#9ca3af",
                      }}
                    >
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>

              {ORG.pendingCount > 0 && (
                <div className="mt-3 pt-3 rounded-xl p-3" style={{ borderTop: "1px solid #f0f2f7", backgroundColor: C.amberLight }}>
                  <p className="text-xs font-semibold" style={{ color: C.amber }}>⚠ {ORG.pendingCount} pending invitations need attention</p>
                </div>
              )}
            </div>

            {/* Invite CTA */}
            <button
              className="p-4 flex items-center gap-3 text-left w-full transition-all hover:opacity-90"
              style={{ ...CARD, background: `linear-gradient(135deg, ${C.amberLight} 0%, #fef9ef 100%)` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: C.amber }}>
                <div style={{ color: "white" }}><Ico type="invite" /></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: C.navy }}>Invite new members</p>
                <p className="text-xs" style={{ color: "#8892a4" }}>Add employees to your health plan</p>
              </div>
              <div style={{ color: C.amber }}><Ico type="arrow" /></div>
            </button>
          </div>

          {/* Col 2: Healthcare utilization + Programs */}
          <div className="flex flex-col gap-4">

            {/* Spend chart */}
            <div className="p-5" style={CARD}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-bold" style={{ color: C.navy }}>Healthcare Spend</p>
                  <p className="text-xs mt-0.5" style={{ color: "#a0a9bc" }}>Monthly ₦ spend across your org</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}>
                  ↓ 7% vs last month
                </span>
              </div>
              <SpendChart />
              <div className="mt-3 pt-3 flex justify-between" style={{ borderTop: "1px solid #f0f2f7" }}>
                <div>
                  <p className="text-xs" style={{ color: "#a0a9bc" }}>This month</p>
                  <p className="text-lg font-bold" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>₦640,000</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "#a0a9bc" }}>YTD</p>
                  <p className="text-lg font-bold" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>₦6.16M</p>
                </div>
              </div>
            </div>

            {/* Active programs */}
            <div className="p-5" style={CARD}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold" style={{ color: C.navy }}>Care Programs</p>
                <button className="text-xs font-semibold hover:opacity-70" style={{ color: C.amber }}>Manage →</button>
              </div>
              <div className="flex flex-col gap-3">
                {PROGRAMS.map((p) => (
                  <div key={p.name}>
                    <div className="flex justify-between mb-1">
                      <p className="text-xs font-semibold" style={{ color: C.navy }}>{p.name}</p>
                      <p className="text-xs font-semibold" style={{ color: p.color }}>{p.members}/{p.enrolled}</p>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 5, backgroundColor: "#e8ebf2" }}>
                      <div className="h-full rounded-full" style={{ width: `${(p.members / p.enrolled) * 100}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: C.amberLight, color: C.amber }}>
                + Add Care Program
              </button>
            </div>
          </div>

          {/* Col 3: Activity feed + quick stats */}
          <div className="flex flex-col gap-4">

            {/* Org overview stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Members", value: ORG.memberCount, color: C.navy, bg: "#e7effc" },
                { label: "Active Users", value: ORG.activeCount, color: "#16a34a", bg: "#dcfce7" },
                { label: "Consultations", value: 38, color: C.amber, bg: C.amberLight },
                { label: "Programs", value: PROGRAMS.length, color: "#8b5cf6", bg: "#f0e7ff" },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-2xl" style={{ backgroundColor: s.bg }}>
                  <p className="text-xs mb-1.5" style={{ color: "#8892a4" }}>{s.label}</p>
                  <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Activity feed */}
            <div className="p-5 flex-1" style={CARD}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold" style={{ color: C.navy }}>Recent Activity</p>
                <button className="text-xs font-semibold hover:opacity-70" style={{ color: C.amber }}>View all →</button>
              </div>
              <div className="flex flex-col gap-3">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: a.type === "success" ? "#22c55e" : a.type === "warn" ? C.amber : "#6ea6f0" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed" style={{ color: C.navy }}>{a.text}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#a0a9bc" }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing quick link */}
            <button
              className="p-4 flex items-center gap-3 text-left w-full transition-all hover:shadow-md"
              style={CARD}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#e7effc" }}>
                <div style={{ color: C.navy }}><Ico type="billing" /></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: C.navy }}>Billing & Plans</p>
                <p className="text-xs" style={{ color: "#a0a9bc" }}>Manage subscription and invoices</p>
              </div>
              <div style={{ color: "#a0a9bc" }}><Ico type="arrow" /></div>
            </button>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
