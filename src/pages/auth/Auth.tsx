import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { DocuraLogo, C, Spinner } from "@/components/ui";
import type { AdminRole } from "@/data/types";

type AuthView =
  | "login" | "signup" | "forgot" | "otp" | "reset" | "success"
  | "doctor-login" | "doctor-signup" | "admin-login"
  | "account-type"
  | "onboarding-welcome" | "onboarding-profile" | "onboarding-health"
  | "onboarding-care" | "onboarding-location" | "onboarding-complete";

// ── Panel content per view ──────────────────────────────────

const PANEL_SLIDES = [
  {
    photo: "https://images.unsplash.com/photo-1536064479547-7ee40b74b807?w=800&h=1100&fit=crop&auto=format",
    headline: "Your healthcare,\nwherever life\ntakes you.",
    sub: "Trusted medical care with a doctor who continues caring for you over time.",
  },
  {
    photo: "https://images.unsplash.com/photo-1678695972687-033fa0bdbac9?w=800&h=1100&fit=crop&auto=format",
    headline: "A doctor who\nknows you,\nalways.",
    sub: "Build a lasting relationship with a verified doctor who understands your health story.",
  },
  {
    photo: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=800&h=1100&fit=crop&auto=format",
    headline: "Care that crosses\nborders\nwith you.",
    sub: "Your personal doctor stays connected whether you're in Nigeria or the UK.",
  },
];

const VIEW_PANEL: Partial<Record<AuthView, (typeof PANEL_SLIDES)[0]>> = {
  signup: { ...PANEL_SLIDES[1], headline: "Healthcare that\nstays with you.", sub: "Join thousands building lasting healthcare relationships." },
  "doctor-signup": { ...PANEL_SLIDES[0], headline: "Build lasting\nrelationships\nwith patients.", sub: "A platform designed around continuity, trust, and real medical care." },
  forgot: { ...PANEL_SLIDES[0], headline: "We're here\nfor you.", sub: "Secure account recovery in just a few steps." },
  reset: { ...PANEL_SLIDES[0], headline: "A fresh start\nfor your account.", sub: "Create a strong new password and get back to your care." },
  otp: { ...PANEL_SLIDES[0], headline: "Your security\nmatters to us.", sub: "We verify every account to protect your health information." },
  "account-type": { ...PANEL_SLIDES[1], headline: "The right care\nfor you.", sub: "Tell us how you'll use Docura so we can personalise your experience." },
  "onboarding-welcome": { ...PANEL_SLIDES[1], headline: "Let's make your\ncare personal.", sub: "A few quick steps and your healthcare home will be ready." },
  "onboarding-profile": { ...PANEL_SLIDES[0], headline: "Tell us\nabout you.", sub: "We only ask for what we need to connect you with the right care." },
  "onboarding-health": { ...PANEL_SLIDES[1], headline: "Your health\nstory matters.", sub: "The more we understand, the better care we can connect you with." },
  "onboarding-care": { ...PANEL_SLIDES[2], headline: "Care designed\naround you.", sub: "Whether you need help today or want ongoing support — Docura has you." },
  "onboarding-location": { ...PANEL_SLIDES[2], headline: "Wherever you are,\nwe're here.", sub: "Location helps us connect you with local doctors and care options." },
  "onboarding-complete": {
    photo: "https://images.unsplash.com/photo-1624272864537-8ecc72b67958?w=800&h=1100&fit=crop&auto=format",
    headline: "Your Docura\njourney\nstarts here.",
    sub: "Your healthcare home is ready. Let's find the right care for you.",
  },
};

const ONBOARDING_STEPS: AuthView[] = ["onboarding-profile", "onboarding-health", "onboarding-care", "onboarding-location"];
const ONBOARDING_LABELS = ["About you", "Your health", "Care type", "Location"];

// ── Input components ────────────────────────────────────────

function Field({
  label, type = "text", placeholder, value, onChange, error, hint, autoFocus,
}: {
  label: string; type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; error?: string; hint?: string; autoFocus?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#8892a4" }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all"
        style={{
          border: `1.5px solid ${error ? C.coral : focused ? C.amber : "#e4e8f0"}`,
          boxShadow: error ? "0 0 0 3px rgba(232,93,64,0.1)" : focused ? "0 0 0 3px rgba(232,160,32,0.12)" : "none",
          backgroundColor: "#f8f9fc",
          color: C.navy,
          fontFamily: "var(--font-body)",
        }}
      />
      {error && <p className="text-xs font-medium" style={{ color: C.coral }}>{error}</p>}
      {hint && !error && <p className="text-xs" style={{ color: "#a0a9bc" }}>{hint}</p>}
    </div>
  );
}

function PwField({
  label, placeholder, value, onChange, showStrength = false, error,
}: {
  label: string; placeholder?: string; value: string;
  onChange: (v: string) => void; showStrength?: boolean; error?: string;
}) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  const strength = (() => {
    if (!value) return 0;
    let s = 0;
    if (value.length >= 8) s++;
    if (/[A-Z]/.test(value)) s++;
    if (/[0-9]/.test(value)) s++;
    if (/[^A-Za-z0-9]/.test(value)) s++;
    return s;
  })();

  const strengthColor = ["", C.coral, "#f59e0b", C.amber, "#16a34a"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  const reqs = [
    { t: "8+ characters", ok: value.length >= 8 },
    { t: "One uppercase", ok: /[A-Z]/.test(value) },
    { t: "One number", ok: /[0-9]/.test(value) },
    { t: "One special character", ok: /[^A-Za-z0-9]/.test(value) },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#8892a4" }}>{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder ?? "Enter password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-xl px-4 py-3.5 pr-11 text-sm outline-none transition-all"
          style={{
            border: `1.5px solid ${error ? C.coral : focused ? C.amber : "#e4e8f0"}`,
            boxShadow: error ? "0 0 0 3px rgba(232,93,64,0.1)" : focused ? "0 0 0 3px rgba(232,160,32,0.12)" : "none",
            backgroundColor: "#f8f9fc",
            color: C.navy,
          }}
        />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60" style={{ color: "#a0a9bc" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {show
              ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
              : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>}
          </svg>
        </button>
      </div>
      {error && <p className="text-xs font-medium" style={{ color: C.coral }}>{error}</p>}
      {showStrength && value.length > 0 && (
        <div className="mt-0.5 flex flex-col gap-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 h-1 rounded-full transition-colors duration-300" style={{ backgroundColor: i <= strength ? strengthColor : "#e4e8f0" }} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold" style={{ color: strengthColor }}>{strengthLabel}</p>
          </div>
          {focused && (
            <div className="grid grid-cols-2 gap-1 mt-0.5">
              {reqs.map((r) => (
                <div key={r.t} className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: r.ok ? "#dcfce7" : "#f0f2f8" }}>
                    {r.ok && <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span className="text-xs" style={{ color: r.ok ? "#16a34a" : "#a0a9bc" }}>{r.t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px" style={{ backgroundColor: "#e8ebf2" }} />
      <span className="text-xs font-medium" style={{ color: "#a0a9bc" }}>{label}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: "#e8ebf2" }} />
    </div>
  );
}

function GoogleBtn({ label = "Continue with Google" }: { label?: string }) {
  return (
    <button className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-medium transition-all hover:bg-gray-50 active:scale-[0.99]"
      style={{ border: "1.5px solid #e4e8f0", color: C.navy, backgroundColor: "white" }}>
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      {label}
    </button>
  );
}

function Btn({
  children, onClick, loading = false, disabled = false, variant = "primary",
}: {
  children: React.ReactNode; onClick?: () => void; loading?: boolean; disabled?: boolean; variant?: "primary" | "outline" | "ghost";
}) {
  const base = "w-full py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.99] flex items-center justify-center gap-2";
  if (variant === "outline") return (
    <button onClick={onClick} className={base} style={{ border: `1.5px solid ${C.border}`, color: C.navy, backgroundColor: "white" }}>
      {children}
    </button>
  );
  if (variant === "ghost") return (
    <button onClick={onClick} className={base + " hover:opacity-70"} style={{ color: "#a0a9bc", background: "none" }}>
      {children}
    </button>
  );
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={base + " hover:opacity-90"}
      style={{ backgroundColor: disabled ? "#e4e8f0" : C.amber, color: disabled ? "#a0a9bc" : "white" }}
    >
      {loading ? <Spinner size={17} color="white" /> : children}
    </button>
  );
}

function BackLink({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-sm font-medium mb-7 transition-opacity hover:opacity-60" style={{ color: "#8892a4" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}

function StepBar({ view }: { view: AuthView }) {
  const idx = ONBOARDING_STEPS.indexOf(view);
  if (idx < 0) return null;
  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.amber }}>
          Step {idx + 1} of {ONBOARDING_STEPS.length}
        </span>
        <span className="text-xs" style={{ color: "#a0a9bc" }}>{ONBOARDING_LABELS[idx]}</span>
      </div>
      <div className="flex gap-1.5">
        {ONBOARDING_STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full transition-colors duration-500"
            style={{ backgroundColor: i <= idx ? C.amber : "#e4e8f0" }} />
        ))}
      </div>
    </div>
  );
}

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 shrink-0"
      style={{ backgroundColor: "#fff7e6", border: "1.5px solid #fde8b0" }}>
      {children}
    </div>
  );
}

// ── Photo panel ─────────────────────────────────────────────

function PhotoPanel({ view, slide, onSlide }: { view: AuthView; slide: number; onSlide: (i: number) => void }) {
  const custom = VIEW_PANEL[view];
  const base = PANEL_SLIDES[slide];
  const { photo, headline, sub } = custom ?? base;
  const showDots = !custom;

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: "inherit" }}>
      {/* Photo */}
      <img
        key={photo}
        src={photo}
        alt="Healthcare"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: 0.72 }}
      />
      {/* Gradient overlay — stronger at bottom */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(170deg, rgba(13,27,62,0.18) 0%, rgba(13,27,62,0.5) 60%, rgba(13,27,62,0.88) 100%)"
      }} />

      {/* Amber left edge accent */}
      <div className="absolute left-0 top-8 bottom-8 w-0.5 rounded-full" style={{ backgroundColor: C.amber, opacity: 0.7 }} />

      {/* Content — pinned bottom */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 pb-10">
        {/* Logo top-left */}
        <div>
          <DocuraLogo size={28} showText />
        </div>

        {/* Headline + dots bottom */}
        <div>
          <h2
            className="font-bold leading-tight whitespace-pre-line mb-3"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)", color: "white" }}
          >
            {headline}
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 280 }}>
            {sub}
          </p>
          {showDots && (
            <div className="flex items-center gap-2">
              {PANEL_SLIDES.map((_, i) => (
                <button key={i} onClick={() => onSlide(i)} className="rounded-full transition-all duration-300"
                  style={{ width: i === slide ? 24 : 6, height: 6, backgroundColor: i === slide ? C.amber : "rgba(255,255,255,0.35)" }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────

export default function AuthLayout({ initialView = "login" }: { initialView?: AuthView }) {
  const { navigate, setRole, setAdminRole, params, markOnboardingComplete } = useApp();
  const [view, setView] = useState<AuthView>(initialView);
  const [accountRole] = useState<"patient" | "doctor" | "proxy" | "enterprise">(params.accountRole === "proxy" ? "proxy" : params.accountRole === "enterprise" ? "enterprise" : initialView.includes("doctor") ? "doctor" : "patient");
  const [staffRole, setStaffRole] = useState<AdminRole>("super-admin");
  const [visible, setVisible] = useState(true);
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+234 000 2222 333");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(30);
  const [selectedAccType, setSelectedAccType] = useState("");
  const [selectedCare, setSelectedCare] = useState<string[]>([]);
  const [country, setCountry] = useState("Nigeria");
  const [city, setCity] = useState("Lagos");
  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Female");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isDoctor = view === "doctor-login" || view === "doctor-signup";

  useEffect(() => {
    if (view !== "otp") return;
    setOtpTimer(30);
    const t = setInterval(() => setOtpTimer((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(t);
  }, [view]);

  function goTo(next: AuthView) {
    setVisible(false);
    setTimeout(() => { setView(next); setVisible(true); }, 180);
  }

  function fakeLoad(cb: () => void, ms = 1200) {
    setLoading(true);
    setTimeout(() => { setLoading(false); cb(); }, ms);
  }

  function otpChange(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...otp]; next[i] = d; setOtp(next);
    if (d && i < 5) inputRefs.current[i + 1]?.focus();
  }

  // ── Views ─────────────────────────────────────────────────

  function renderView() {
    switch (view) {

      case "login":
      case "doctor-login":
        return (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: C.amber }}>
              {isDoctor ? "Doctor portal" : "Welcome back"}
            </p>
            <h2 className="text-2xl font-bold mb-1 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Sign in to Docura
            </h2>
            <p className="text-sm mb-6" style={{ color: "#8892a4" }}>
              Provide your login details to continue.
            </p>
            <GoogleBtn />
            <Divider label="or sign in with" />
            <div className="flex flex-col gap-3.5">
              <Field label="Phone number or email" type="tel" placeholder="+234 000 0000 000" value={phone} onChange={setPhone} />
              <PwField label="Password" value={password} onChange={setPassword} />
              <div className="flex justify-end">
                <button onClick={() => goTo("forgot")} className="text-xs font-semibold transition-opacity hover:opacity-70" style={{ color: C.navy }}>
                  Forgot password?
                </button>
              </div>
              <Btn loading={loading} onClick={() => fakeLoad(() => {
                if (isDoctor) { setRole("doctor"); markOnboardingComplete(); navigate("doctor-dashboard"); }
                else { setRole(accountRole); markOnboardingComplete(); navigate(`${accountRole}-dashboard`); }
              })}>
                Sign in
              </Btn>
            </div>
            <p className="text-center text-sm mt-5" style={{ color: "#8892a4" }}>
              {"Don't have an account? "}
              <button onClick={() => goTo(isDoctor ? "doctor-signup" : "signup")} className="font-semibold hover:opacity-70" style={{ color: C.amber }}>
                Sign up
              </button>
            </p>
            {isDoctor && (
              <p className="text-center text-xs mt-2">
                <button onClick={() => goTo("login")} className="hover:underline" style={{ color: "#a0a9bc" }}>
                  Patient login instead
                </button>
              </p>
            )}
          </>
        );

      case "admin-login":
        return (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: C.amber }}>Internal access</p>
            <h2 className="text-2xl font-bold mb-1 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Docura operations
            </h2>
            <p className="text-sm mb-6" style={{ color: "#8892a4" }}>
              Sign in with your Docura staff account. Your internal role decides what you can open.
            </p>
            <div className="flex flex-col gap-3.5">
              <Field label="Work email" type="email" placeholder="you@docura.health" value={phone} onChange={setPhone} />
              <PwField label="Password" value={password} onChange={setPassword} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: C.label }}>Internal role</label>
                <select
                  aria-label="Internal role"
                  value={staffRole}
                  onChange={(event) => setStaffRole(event.target.value as AdminRole)}
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                  style={{ borderColor: C.border, color: C.navy, backgroundColor: "white" }}
                >
                  <option value="super-admin">Super Admin</option>
                  <option value="operations">Operations</option>
                  <option value="finance">Finance</option>
                  <option value="support">Support</option>
                  <option value="medical-board">Medical Board</option>
                </select>
              </div>
              <Btn loading={loading} onClick={() => fakeLoad(() => {
                setRole("admin");
                setAdminRole(staffRole);
                markOnboardingComplete();
                navigate("admin-dashboard");
              })}>
                Sign in to operations
              </Btn>
            </div>
            <p className="text-center text-xs mt-4">
              <button onClick={() => goTo("login")} className="hover:underline" style={{ color: "#a0a9bc" }}>Patient login instead</button>
            </p>
          </>
        );

      case "signup":
      case "doctor-signup":
        return (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: C.amber }}>
              {isDoctor ? "Join as a doctor" : "Get started"}
            </p>
            <h2 className="text-2xl font-bold mb-1 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Create your Docura account
            </h2>
            <p className="text-sm mb-6" style={{ color: "#8892a4" }}>
              {isDoctor ? "Start building lasting relationships with patients." : "Start your journey to better, continuous healthcare."}
            </p>
            <GoogleBtn label="Continue with Google" />
            <Divider label="or sign up with" />
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" placeholder="Adaeze" value={firstName} onChange={setFirstName} />
                <Field label="Last name" placeholder="Okafor" value={lastName} onChange={setLastName} />
              </div>
              <Field label="Phone number" type="tel" placeholder="+234 000 0000 000" value={phone} onChange={setPhone} />
              <PwField label="Password" placeholder="Create a strong password" value={password} onChange={setPassword} showStrength />
              <Btn loading={loading} onClick={() => fakeLoad(() => goTo("otp"), 1000)}>
                Create account
              </Btn>
            </div>
            <p className="text-center text-xs mt-3" style={{ color: "#a0a9bc" }}>
              By continuing you agree to our{" "}
              <span className="underline cursor-pointer" style={{ color: C.navy }}>Terms</span>{" "}
              and{" "}
              <span className="underline cursor-pointer" style={{ color: C.navy }}>Privacy Policy</span>
            </p>
            <p className="text-center text-sm mt-4" style={{ color: "#8892a4" }}>
              Already have an account?{" "}
              <button onClick={() => goTo(isDoctor ? "doctor-login" : "login")} className="font-semibold hover:opacity-70" style={{ color: C.amber }}>
                Log in
              </button>
            </p>
          </>
        );

      case "forgot":
        return (
          <>
            <BackLink onClick={() => goTo("login")} label="Back to login" />
            <IconBadge>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
              </svg>
            </IconBadge>
            <h2 className="text-2xl font-bold mb-1.5 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Forgot your password?
            </h2>
            <p className="text-sm mb-6" style={{ color: "#8892a4" }}>
              Enter the email or phone number connected to your account and {"we'll"} help you get back in.
            </p>
            <div className="flex flex-col gap-4">
              <Field label="Email or phone number" placeholder="+234 000 0000 000" value={phone} onChange={setPhone} />
              <Btn loading={loading} onClick={() => fakeLoad(() => goTo("otp"), 1000)}>Continue</Btn>
            </div>
            <p className="text-center text-sm mt-5" style={{ color: "#8892a4" }}>
              {"Remember your password? "}
              <button onClick={() => goTo("login")} className="font-semibold hover:opacity-70" style={{ color: C.amber }}>Sign in</button>
            </p>
          </>
        );

      case "otp":
        return (
          <>
            <IconBadge>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </IconBadge>
            <h2 className="text-2xl font-bold mb-1.5 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Verify your account
            </h2>
            <p className="text-sm mb-1" style={{ color: "#8892a4" }}>We sent a 6-digit code to</p>
            <p className="text-sm font-semibold mb-6" style={{ color: C.navy }}>{phone}</p>
            <div className="flex gap-2 justify-between mb-5">
              {otp.map((d, i) => (
                <input key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={(e) => otpChange(i, e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) inputRefs.current[i - 1]?.focus(); }}
                  className="flex-1 aspect-square text-center text-xl font-bold rounded-xl outline-none transition-all"
                  style={{
                    border: `1.5px solid ${d ? C.amber : "#e4e8f0"}`,
                    boxShadow: d ? "0 0 0 3px rgba(232,160,32,0.12)" : "none",
                    backgroundColor: d ? "#fff7e6" : "#f8f9fc",
                    color: C.navy,
                    maxWidth: 52,
                  }}
                />
              ))}
            </div>
            <Btn loading={loading} onClick={() => fakeLoad(() => goTo("account-type"), 900)}>Verify code</Btn>
            <div className="text-center mt-4">
              {otpTimer > 0
                ? <p className="text-sm" style={{ color: "#8892a4" }}>Resend code in <span className="font-semibold" style={{ color: C.navy }}>00:{String(otpTimer).padStart(2, "0")}</span></p>
                : <button onClick={() => { setOtpTimer(30); setOtp(["", "", "", "", "", ""]); }} className="text-sm font-semibold hover:opacity-70" style={{ color: C.amber }}>Resend code</button>
              }
            </div>
            <p className="text-center mt-2">
              <button onClick={() => goTo("login")} className="text-xs hover:underline" style={{ color: "#a0a9bc" }}>Change phone number</button>
            </p>
          </>
        );

      case "reset":
        return (
          <>
            <IconBadge>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </IconBadge>
            <h2 className="text-2xl font-bold mb-1.5 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Create a new password
            </h2>
            <p className="text-sm mb-6" style={{ color: "#8892a4" }}>Choose a strong password to keep your account secure.</p>
            <div className="flex flex-col gap-3.5">
              <PwField label="New password" value={password} onChange={setPassword} showStrength />
              <PwField label="Confirm password" placeholder="Confirm your new password" value={confirmPw} onChange={setConfirmPw}
                error={confirmPw.length > 0 && confirmPw !== password ? "Passwords don't match" : undefined} />
              <Btn loading={loading} disabled={!password || confirmPw !== password}
                onClick={() => fakeLoad(() => goTo("success"), 1100)}>
                Reset password
              </Btn>
            </div>
          </>
        );

      case "success":
        return (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: "#dcfce7", border: "2px solid #bbf7d0" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2.5" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Password updated!</h2>
            <p className="text-sm mb-7 max-w-xs" style={{ color: "#8892a4" }}>Your password has been updated successfully. Sign in with your new password.</p>
            <div className="w-full"><Btn onClick={() => goTo("login")}>Continue to Docura</Btn></div>
          </div>
        );

      case "account-type":
        return (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: C.amber }}>One quick step</p>
            <h2 className="text-2xl font-bold mb-1.5 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              How will you use Docura?
            </h2>
            <p className="text-sm mb-6" style={{ color: "#8892a4" }}>Choose how you'd like to use your account.</p>
            <div className="flex flex-col gap-3 mb-6">
              {[
                { id: "personal", title: "Personal Care", desc: "For your own healthcare journey.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
                { id: "proxy", title: "Care for someone else", desc: "Coordinate care for a parent, child, or loved one.", icon: <span aria-hidden="true">♥</span> },
                { id: "enterprise", title: "Connected Care Partner", desc: "For organisations and hospitals coordinating continuity of care.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg> },
              ].map((opt) => {
                const sel = selectedAccType === opt.id;
                return (
                  <button key={opt.id} onClick={() => setSelectedAccType(opt.id)}
                    className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                    style={{ border: `1.5px solid ${sel ? C.amber : "#e4e8f0"}`, backgroundColor: sel ? "#fff7e6" : "#f8f9fc" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: sel ? "white" : "#eef0f8", border: `1px solid ${sel ? "#fde8b0" : "#e4e8f0"}` }}>
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color: C.navy }}>{opt.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#a0a9bc" }}>{opt.desc}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: sel ? C.amber : "#d1d5e0", backgroundColor: sel ? C.amber : "white" }}>
                      {sel && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                  </button>
                );
              })}
            </div>
            <Btn disabled={!selectedAccType} onClick={() => goTo("onboarding-welcome")}>Continue</Btn>
          </>
        );

      case "onboarding-welcome":
        return (
          <div className="flex flex-col items-center text-center py-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ backgroundColor: "#fff7e6", border: "1.5px solid #fde8b0" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: C.amber }}>Almost there</p>
            <h2 className="text-2xl font-bold mb-2 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Welcome to Docura,<br />{firstName || "there"}.
            </h2>
            <p className="text-sm mb-1.5" style={{ color: "#8892a4" }}>{"Let's personalise your healthcare experience."}</p>
            <p className="text-xs mb-8" style={{ color: "#b0b8cc" }}>Takes about 2 minutes · You can update this anytime</p>
            <div className="w-full flex flex-col gap-2.5">
              <Btn onClick={() => goTo("onboarding-profile")}>Get started</Btn>
              <Btn variant="ghost" onClick={() => { const nextRole = selectedAccType === "enterprise" ? "enterprise" : accountRole; setRole(nextRole); navigate(`${nextRole}-dashboard`); }}>Skip for now</Btn>
            </div>
          </div>
        );

      case "onboarding-profile":
        return (
          <>
            <StepBar view={view} />
            <h2 className="text-2xl font-bold mb-1.5 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Tell us about you</h2>
            <p className="text-sm mb-5" style={{ color: "#8892a4" }}>Basic details to personalise your care experience.</p>
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" placeholder="Adaeze" value={firstName} onChange={setFirstName} />
                <Field label="Last name" placeholder="Okafor" value={lastName} onChange={setLastName} />
              </div>
              <Field label="Date of birth" type="date" value={dob} onChange={setDob} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#8892a4" }}>Gender</label>
                <div className="flex gap-2">
                  {["Female", "Male", "Prefer not to say"].map((g) => (
                    <button key={g} onClick={() => setGender(g)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all"
                      style={{ borderColor: gender === g ? C.amber : "#e4e8f0", backgroundColor: gender === g ? "#fff7e6" : "#f8f9fc", color: gender === g ? C.amber : "#8892a4" }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <Btn onClick={() => goTo("onboarding-health")}>Continue</Btn>
            </div>
          </>
        );

      case "onboarding-health":
        return (
          <>
            <StepBar view={view} />
            <BackLink onClick={() => goTo("onboarding-profile")} />
            <h2 className="text-2xl font-bold mb-1.5 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>A little about your health</h2>
            <p className="text-sm mb-1" style={{ color: "#8892a4" }}>Helps us connect you with the right care.</p>
            <p className="text-xs mb-5" style={{ color: "#b0b8cc" }}>All fields are optional — you can update this anytime.</p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#8892a4" }}>Blood group</label>
                <div className="flex flex-wrap gap-1.5">
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                    <button key={bg} onClick={() => setBloodGroup(bg)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                      style={{ borderColor: bloodGroup === bg ? C.amber : "#e4e8f0", backgroundColor: bloodGroup === bg ? "#fff7e6" : "#f8f9fc", color: bloodGroup === bg ? C.amber : "#8892a4" }}>
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Allergies" placeholder="e.g. Penicillin, Peanuts" value={allergies} onChange={setAllergies} hint="Separate with commas" />
              <Field label="Existing conditions" placeholder="e.g. Diabetes, Hypertension" value={conditions} onChange={setConditions} hint="Optional — add more later" />
              <Btn onClick={() => goTo("onboarding-care")}>Continue</Btn>
            </div>
          </>
        );

      case "onboarding-care":
        return (
          <>
            <StepBar view={view} />
            <BackLink onClick={() => goTo("onboarding-health")} />
            <h2 className="text-2xl font-bold mb-1.5 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>How would you like care?</h2>
            <p className="text-sm mb-5" style={{ color: "#8892a4" }}>You can use both — choose what suits you.</p>
            <div className="flex flex-col gap-2.5 mb-5">
              {[
                { id: "now", title: "Docura Now", desc: "Talk to a doctor when you need urgent care.", tag: "Immediate" },
                { id: "care", title: "Docura Care", desc: "Build an ongoing relationship with your personal doctor.", tag: "Ongoing" },
              ].map((opt) => {
                const sel = selectedCare.includes(opt.id);
                return (
                  <button key={opt.id} onClick={() => setSelectedCare((p) => sel ? p.filter((x) => x !== opt.id) : [...p, opt.id])}
                    className="flex items-start gap-3.5 p-4 rounded-2xl text-left transition-all"
                    style={{ border: `1.5px solid ${sel ? C.amber : "#e4e8f0"}`, backgroundColor: sel ? "#fff7e6" : "#f8f9fc" }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm" style={{ color: C.navy }}>{opt.title}</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: sel ? C.amber : "#e4e8f0", color: sel ? "white" : "#a0a9bc" }}>{opt.tag}</span>
                      </div>
                      <p className="text-xs" style={{ color: "#a0a9bc" }}>{opt.desc}</p>
                    </div>
                    <div className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5"
                      style={{ borderColor: sel ? C.amber : "#d1d5e0", backgroundColor: sel ? C.amber : "white" }}>
                      {sel && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                  </button>
                );
              })}
            </div>
            <Btn onClick={() => goTo("onboarding-location")}>Continue</Btn>
          </>
        );

      case "onboarding-location":
        return (
          <>
            <StepBar view={view} />
            <BackLink onClick={() => goTo("onboarding-care")} />
            <h2 className="text-2xl font-bold mb-1.5 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Where are you based?</h2>
            <p className="text-sm mb-1" style={{ color: "#8892a4" }}>Helps us connect you with locally available doctors.</p>
            <p className="text-xs mb-5" style={{ color: "#b0b8cc" }}>Important for cross-border care.</p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#8892a4" }}>Country</label>
                <div className="flex flex-wrap gap-1.5">
                  {["Nigeria", "United Kingdom", "Ghana", "Kenya", "Canada"].map((c) => (
                    <button key={c} onClick={() => setCountry(c)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all"
                      style={{ borderColor: country === c ? C.amber : "#e4e8f0", backgroundColor: country === c ? "#fff7e6" : "#f8f9fc", color: country === c ? C.amber : "#8892a4" }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="City" placeholder="Lagos" value={city} onChange={setCity} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#8892a4" }}>Preferred language</label>
                <div className="flex flex-wrap gap-1.5">
                  {["English", "Igbo", "Yoruba", "Hausa", "French"].map((l) => (
                    <button key={l} onClick={() => setLanguages((p) => p.includes(l) ? p.filter((x) => x !== l) : [...p, l])}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all"
                      style={{ borderColor: languages.includes(l) ? C.amber : "#e4e8f0", backgroundColor: languages.includes(l) ? "#fff7e6" : "#f8f9fc", color: languages.includes(l) ? C.amber : "#8892a4" }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <Btn loading={loading} onClick={() => fakeLoad(() => goTo("onboarding-complete"), 900)}>Complete profile</Btn>
            </div>
          </>
        );

      case "onboarding-complete":
        return (
          <div className="flex flex-col items-center text-center py-2">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: "#dcfce7", border: "2px solid #bbf7d0" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#16a34a" }}>Profile complete</p>
            <h2 className="text-2xl font-bold mb-2 leading-tight" style={{ fontFamily: "var(--font-display)", color: C.navy }}>
              Your Docura journey<br />starts here.
            </h2>
            <p className="text-sm mb-8 max-w-xs" style={{ color: "#8892a4" }}>
              Your profile is ready. {"Let's"} find the right care for you.
            </p>
            <div className="w-full flex flex-col gap-2.5">
              <Btn onClick={() => { const nextRole = selectedAccType === "enterprise" ? "enterprise" : selectedAccType === "proxy" ? "proxy" : accountRole; setRole(nextRole); markOnboardingComplete(); navigate(`${nextRole}-dashboard`); }}>Explore Docura</Btn>
              <Btn variant="outline" onClick={() => { const nextRole = selectedAccType === "enterprise" ? "enterprise" : selectedAccType === "proxy" ? "proxy" : accountRole; setRole(nextRole); markOnboardingComplete(); navigate(nextRole === "patient" ? "find-doctor" : `${nextRole}-dashboard`); }}>Continue</Btn>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  // ── Shell ────────────────────────────────────────────────

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── Left: photo panel ────────────────────────────── */}
      <div
        className="hidden lg:block shrink-0"
        style={{ width: "44%", overflow: "hidden" }}
      >
        <PhotoPanel view={view} slide={slide} onSlide={setSlide} />
      </div>

      {/* ── Right: form panel ────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: "white" }}>

        {/* Mobile: compact image strip */}
        <div
          className="lg:hidden relative overflow-hidden shrink-0"
          style={{ height: 140, backgroundColor: C.navy }}
        >
          {(() => {
            const custom = VIEW_PANEL[view];
            const base = PANEL_SLIDES[slide];
            const photo = custom?.photo ?? base.photo;
            return (
              <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.5 }} />
            );
          })()}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,27,62,0.2), rgba(13,27,62,0.7))" }} />
          <div className="absolute bottom-4 left-5"><DocuraLogo size={26} showText /></div>
        </div>

        {/* Top bar — desktop only */}
        <div className="hidden lg:flex items-center justify-between px-8 pt-7 pb-2 shrink-0">
          <DocuraLogo size={30} showText />
          <button
            onClick={() => navigate("landing")}
            className="text-xs font-medium transition-opacity hover:opacity-60"
            style={{ color: "#a0a9bc" }}
          >
            ← Back to home
          </button>
        </div>

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-5 py-3.5 shrink-0">
          <span className="text-xs font-medium" style={{ color: "#a0a9bc" }}>Docura</span>
          <button onClick={() => navigate("landing")} className="text-xs" style={{ color: "#a0a9bc" }}>← Home</button>
        </div>

        {/* Form — vertically centered */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-10 py-6">
          <div
            className="w-full"
            style={{
              maxWidth: 360,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.18s ease, transform 0.18s ease",
            }}
          >
            {renderView()}
          </div>
        </div>

      </div>
    </div>
  );
}
