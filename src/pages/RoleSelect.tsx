import { useApp } from "@/context/AppContext";
import { C, DocuraLogo, Badge } from "@/components/ui";

const ROLES = [
  {
    id: "care",
    title: "Docura Care",
    subtitle: "Continue My Care",
    icon: "🩺",
    description: "Build a lasting relationship with a personal doctor who knows your health.",
    page: "signup",
    active: true,
    color: C.navy,
  },
  {
    id: "now",
    title: "Docura Now",
    subtitle: "Talk to a Doctor",
    icon: "⚡",
    description: "Connect with a verified doctor right now for an immediate consultation.",
    page: "signup",
    active: true,
    color: C.amber,
  },
  {
    id: "proxy",
    title: "Docura Proxy",
    subtitle: "Care for Someone Else",
    icon: "👨‍👩‍👧",
    description: "Manage healthcare for a family member or loved one.",
    page: "proxy-waitlist",
    active: false,
    color: "#9CA3AF",
  },
  {
    id: "doctor",
    title: "I'm a Doctor",
    subtitle: "Join Docura as a doctor",
    icon: "👩‍⚕️",
    description: "Join Docura to build lasting relationships with patients across Nigeria and the UK.",
    page: "doctor-signup",
    active: true,
    color: "#0D1B3E",
  },
];

export default function RoleSelect() {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.warm, fontFamily: "var(--font-body)" }}>
      <div className="p-6">
        <DocuraLogo size={36} showText />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-bold mb-3 text-center" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
            How can we help you?
          </h1>
          <p className="text-center mb-10" style={{ color: C.muted }}>
            Choose how you'd like to use Docura today.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => navigate(role.page)}
                disabled={!role.active}
                className="p-6 rounded-2xl border text-left transition-all duration-200 group disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "white",
                  borderColor: C.border,
                }}
                onMouseEnter={(e) => { if (role.active) e.currentTarget.style.borderColor = C.amber; e.currentTarget.style.boxShadow = "0 4px 16px rgba(232,160,32,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: role.active ? C.amberLight : "#F3F4F6" }}>
                    {role.icon}
                  </div>
                  {!role.active && <Badge variant="gray">Coming Soon</Badge>}
                </div>
                <h3 className="font-bold text-base mb-1" style={{ fontFamily: "var(--font-display)", color: C.navy }}>{role.title}</h3>
                <p className="text-sm font-medium mb-2" style={{ color: C.amber }}>{role.subtitle}</p>
                <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{role.description}</p>
                {role.active && (
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold" style={{ color: C.amber }}>
                    Get started
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <button onClick={() => navigate("landing")} className="flex items-center gap-2 mx-auto mt-8 text-sm" style={{ color: C.muted }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProxyWaitlist() {
  const { navigate } = useApp();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: C.warm }}>
      <div className="mb-6">
        <DocuraLogo size={40} />
      </div>
      <Badge variant="gray">Coming Soon</Badge>
      <h2 className="text-3xl font-bold mt-4 mb-3" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Docura Proxy</h2>
      <p className="max-w-sm mb-8" style={{ color: C.muted }}>We're building a way to help you care for a family member or loved one. Be the first to know when it launches.</p>
      <div className="flex gap-3 w-full max-w-sm">
        <input placeholder="Your email address" className="flex-1 rounded-full border px-4 py-2.5 text-sm outline-none" style={{ borderColor: C.border }} />
        <button className="px-5 py-2.5 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: C.amber }}>Notify me</button>
      </div>
      <button onClick={() => navigate("role-select")} className="mt-8 text-sm" style={{ color: C.muted }}>← Back</button>
    </div>
  );
}
