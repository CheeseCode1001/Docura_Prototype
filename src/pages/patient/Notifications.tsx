import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Button, C, Card, EmptyState, PageHeader, Badge } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import type { NotificationAudience } from "@/data/types";

type OperationalCategory = "all" | "urgent" | "action-required" | "information" | "financial" | "professional";

interface EnrichedNotification {
  id: string;
  category: OperationalCategory;
  categoryLabel: string;
  title: string;
  body: string;
  date: string;
  time: string;
  read: boolean;
  page: string;
  icon: string;
  severityColor: string;
  badgeBg: string;
  badgeText: string;
}

const DEFAULT_NOTIFICATIONS: EnrichedNotification[] = [
  {
    id: "notif-1",
    category: "urgent",
    categoryLabel: "🔴 Urgent",
    title: "Critical Lab Result: Adaeze Okonkwo",
    body: "Serum Potassium 5.7 mmol/L (Hyperkalemia flag). Immediate review and ACE-inhibitor adjustment recommended.",
    date: "Today",
    time: "10:14 AM",
    read: false,
    page: "doctor-labs",
    icon: "⚠️",
    severityColor: "#DC2626",
    badgeBg: "#FEE2E2",
    badgeText: "#991B1B",
  },
  {
    id: "notif-2",
    category: "action-required",
    categoryLabel: "🟠 Action Required",
    title: "Prescription Handoff Awaiting Sign-off",
    body: "Dr. Oluwaseun Adeleke has recommended Amlodipine 5mg for Adaeze Okonkwo. Statutory EMDEX check required.",
    date: "Today",
    time: "9:30 AM",
    read: false,
    page: "prescribing-workspace",
    icon: "💊",
    severityColor: "#D97706",
    badgeBg: "#FEF3C7",
    badgeText: "#92400E",
  },
  {
    id: "notif-3",
    category: "action-required",
    categoryLabel: "🟠 Action Required",
    title: "Monthly Chronic Check-ins Scheduled",
    body: "4 chronic hypertension patients are due for their 30-day symptom and blood pressure review today.",
    date: "Today",
    time: "8:00 AM",
    read: false,
    page: "doctor-follow-ups",
    icon: "📅",
    severityColor: "#D97706",
    badgeBg: "#FEF3C7",
    badgeText: "#92400E",
  },
  {
    id: "notif-4",
    category: "information",
    categoryLabel: "🔵 Information",
    title: "Care Episode Summary Generated",
    body: "AI draft for Babatunde Lawal's cardiology follow-up is ready for your clinical review and signature.",
    date: "Yesterday",
    time: "4:30 PM",
    read: true,
    page: "doctor-consultations",
    icon: "📄",
    severityColor: "#2563EB",
    badgeBg: "#DBEAFE",
    badgeText: "#1E40AF",
  },
  {
    id: "notif-5",
    category: "financial",
    categoryLabel: "💰 Financial",
    title: "Retainer Payout Processed (₦450,000)",
    body: "Mid-month settlement for 18 Docura Care active subscribers and 4 prescribing desk reviews has been credited.",
    date: "Sep 22",
    time: "11:00 AM",
    read: true,
    page: "doctor-earnings",
    icon: "💳",
    severityColor: "#059669",
    badgeBg: "#D1FAE5",
    badgeText: "#065F46",
  },
  {
    id: "notif-6",
    category: "professional",
    categoryLabel: "⚕️ Professional",
    title: "Annual MDCN Practising Licence Renewal",
    body: "Docura Clinical Governance reminder: Your Nigerian medical licence renewal window opens in 45 days.",
    date: "Sep 20",
    time: "9:00 AM",
    read: true,
    page: "doctor-profile-mgmt",
    icon: "🏛️",
    severityColor: "#7C3AED",
    badgeBg: "#EDE9FE",
    badgeText: "#5B21B6",
  },
];

export default function Notifications() {
  const { navigate, role, markAllNotificationsRead } = useApp();
  const [activeCategory, setActiveCategory] = useState<OperationalCategory>("all");
  const [notifications, setNotifications] = useState<EnrichedNotification[]>(DEFAULT_NOTIFICATIONS);

  const audience: NotificationAudience = (role || "patient") as NotificationAudience;

  const markItemRead = (id: string, page: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (page) navigate(page);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllNotificationsRead(audience);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  const categories: Array<{ id: OperationalCategory; label: string; icon: string; badge?: number }> = [
    { id: "all", label: "All Updates", icon: "📋", badge: unreadCount },
    { id: "urgent", label: "Urgent", icon: "🔴", badge: notifications.filter((n) => n.category === "urgent" && !n.read).length },
    { id: "action-required", label: "Action Required", icon: "🟠", badge: notifications.filter((n) => n.category === "action-required" && !n.read).length },
    { id: "information", label: "Information", icon: "🔵" },
    { id: "financial", label: "Financial", icon: "💰" },
    { id: "professional", label: "Professional", icon: "⚕️" },
  ];

  return (
    <AppShell role={role} topBarTitle="Notification Center">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5 max-w-4xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Clinical & Operational Alerts"
          title="Notification Center"
          subtitle={
            unreadCount
              ? `${unreadCount} actionable notification${unreadCount === 1 ? "" : "s"} require your attention.`
              : "All operational and clinical streams are current."
          }
          actions={
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button size="sm" variant="ghost" onClick={handleMarkAllRead} className="text-xs">
                  Mark all as read
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => navigate("notification-preferences")} className="text-xs">
                Alert Preferences
              </Button>
            </div>
          }
        />

        {/* Operational Categories Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 border-b" style={{ borderColor: C.border }}>
          {categories.map((c) => {
            const isSelected = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
                {Boolean(c.badge && c.badge > 0) && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-amber-500 text-white" : "bg-red-500 text-white"
                    }`}
                  >
                    {c.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="No notifications in this category"
            body="When clinical alerts, prescriptions, or financial milestones occur, they will appear here organized by urgency."
            cta="Show all notifications"
            onCta={() => setActiveCategory("all")}
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((n) => (
              <Card
                key={n.id}
                onClick={() => markItemRead(n.id, n.page)}
                className="relative transition-all hover:border-amber-400 cursor-pointer"
                padding={false}
              >
                <div className={`p-4 flex items-start gap-4 ${!n.read ? "bg-amber-50/20" : "bg-white"}`}>
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 border"
                    style={{ backgroundColor: n.badgeBg, borderColor: n.severityColor + "40" }}
                  >
                    {n.icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{ backgroundColor: n.badgeBg, color: n.badgeText }}
                      >
                        {n.categoryLabel}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {n.date} · {n.time}
                      </span>
                    </div>

                    <h4 className={`text-sm ${n.read ? "text-stone-800 font-medium" : "text-stone-950 font-bold"}`}>
                      {n.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{n.body}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                        Open action &gt;
                      </span>
                    </div>
                  </div>

                  {!n.read && (
                    <span
                      className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: n.severityColor }}
                    />
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
