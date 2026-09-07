import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Button, C, Card, EmptyState, FilterBar, PageHeader } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import type { NotificationAudience } from "@/data/types";

const TYPE_ICON: Record<string, string> = {
  message: "💬",
  prescription: "💊",
  payment: "💳",
  system: "🔔",
  consultation: "🩺",
  "follow-up": "📅",
  support: "🎫",
  referral: "🔗",
  verification: "✅",
};

export default function Notifications() {
  const { navigate, role, domain, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState("all");

  // The notification list is scoped to whoever is signed in — a doctor never
  // sees a patient's notifications, and vice versa.
  const audience: NotificationAudience = (role || "patient") as NotificationAudience;
  const mine = domain.notifications.filter((item) => item.audience === audience);
  const unread = mine.filter((item) => !item.read).length;
  const visible = mine.filter((item) => (filter === "all" ? true : filter === "unread" ? !item.read : item.type === filter));

  const filters = [
    { id: "all", label: "All" },
    { id: "unread", label: `Unread${unread ? ` (${unread})` : ""}` },
    { id: "message", label: "Messages" },
    { id: "prescription", label: "Prescriptions" },
    { id: "follow-up", label: "Follow-ups" },
    { id: "payment", label: "Payments" },
    { id: "support", label: "Support" },
  ];

  return (
    <AppShell role={role} topBarTitle="Notifications">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-5 max-w-3xl mx-auto w-full" style={{ fontFamily: "var(--font-body)" }}>
        <PageHeader
          eyebrow="Activity"
          title="Notifications"
          subtitle={unread ? `${unread} unread update${unread === 1 ? "" : "s"} from your care.` : "You are all caught up."}
          actions={<>
            {unread > 0 && <Button size="sm" variant="ghost" onClick={() => markAllNotificationsRead(audience)}>Mark all read</Button>}
            <Button size="sm" variant="outline" onClick={() => navigate("notification-preferences")}>Preferences</Button>
          </>}
        />

        <FilterBar value={filter} onChange={setFilter} options={filters} />

        {visible.length === 0 ? (
          <EmptyState
            icon="🔔"
            title={filter === "all" ? "Nothing here yet" : "Nothing in this filter"}
            body="Notifications appear as your care progresses — messages, prescriptions, follow-ups and payments."
            cta={filter === "all" ? undefined : "Show everything"}
            onCta={() => setFilter("all")}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {visible.map((notification) => (
              <Card
                key={notification.id}
                onClick={() => { markNotificationRead(notification.id); navigate(notification.page); }}
                className="relative"
                padding={false}
              >
                <div className="flex items-start gap-4 p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: notification.read ? C.warm : C.amberLight }}>
                    {TYPE_ICON[notification.type] || "🔔"}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <p className={`text-sm mb-0.5 ${notification.read ? "" : "font-semibold"}`} style={{ color: C.navy }}>{notification.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{notification.body}</p>
                    <p className="text-xs mt-1.5" style={{ color: C.muted }}>{notification.date} · {notification.time}</p>
                  </div>
                  {!notification.read && <span className="absolute top-4 right-4 w-2 h-2 rounded-full" style={{ backgroundColor: C.amber }} />}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
