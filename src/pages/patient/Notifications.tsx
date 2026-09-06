import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, Button, C } from "@/components/ui";
import { NOTIFICATIONS } from "@/data/mock";
import { useApp } from "@/context/AppContext";

const typeIcon: Record<string, string> = { message: "💬", prescription: "💊", payment: "💳", system: "🔔", consultation: "🩺" };

export default function PatientNotifications() {
  const { navigate } = useApp();
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unread = notifs.filter((n) => !n.read).length;

  const markAll = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const markRead = (id: string) => setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));

  return (
    <AppShell role="patient" topBarTitle="Notifications">
      <div className="px-4 md:px-6 py-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: C.muted }}>{unread} unread</p>
          {unread > 0 && <Button size="sm" variant="ghost" onClick={markAll}>Mark all read</Button>}
        </div>

        {notifs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔔</div>
            <p className="font-bold mb-2" style={{ color: C.navy }}>Nothing here yet</p>
            <p className="text-sm" style={{ color: C.muted }}>Notifications will appear here as you use Docura.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifs.map((n) => (
              <Card
                key={n.id}
                onClick={() => { markRead(n.id); navigate(n.page); }}
                className="relative"
                padding={false}
              >
                <div className="flex items-start gap-4 p-4">
                  {!n.read && <span className="absolute top-4 right-4 w-2 h-2 rounded-full" style={{ backgroundColor: C.amber }} />}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: n.read ? C.warm : C.amberLight }}>
                    {typeIcon[n.type] || "🔔"}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <p className={`text-sm mb-0.5 ${n.read ? "" : "font-semibold"}`} style={{ color: C.navy }}>{n.title}</p>
                    <p className="text-xs line-clamp-2" style={{ color: C.muted }}>{n.body}</p>
                    <p className="text-xs mt-1" style={{ color: C.muted }}>{n.date} · {n.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
