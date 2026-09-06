import { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { C, DocuraLogo } from "@/components/ui";

const HERO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1536064479547-7ee40b74b807?w=1400&h=900&fit=crop&auto=format",
    alt: "Doctor in consultation with patient",
  },
  {
    url: "https://images.unsplash.com/photo-1678695972687-033fa0bdbac9?w=1400&h=900&fit=crop&auto=format",
    alt: "African doctor ready to care",
  },
  {
    url: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=1400&h=900&fit=crop&auto=format",
    alt: "Doctor with stethoscope",
  },
  {
    url: "https://images.unsplash.com/photo-1624272864537-8ecc72b67958?w=1400&h=900&fit=crop&auto=format",
    alt: "Family warmth and care",
  },
];

function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function fadeStyle(visible: boolean): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: "opacity 0.75s ease, transform 0.75s ease",
  };
}

export default function Landing() {
  const { navigate } = useApp();
  const [heroIdx, setHeroIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandStmt = useFadeIn();
  const howItWorks = useFadeIn();
  const personalDoc = useFadeIn();
  const docuraNow = useFadeIn();
  const globalCare = useFadeIn();
  const passport = useFadeIn();
  const journey = useFadeIn();
  const trust = useFadeIn();
  const doctorCta = useFadeIn();
  const proxy = useFadeIn();

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 5200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)", backgroundColor: "#FAFAF8", overflowX: "hidden" }}>

      {/* ── Navigation ─────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: scrolled ? "rgba(250,250,248,0.96)" : "#FAFAF8",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          backdropFilter: scrolled ? "blur(10px)" : "none",
          transition: "border-color 0.3s ease, backdrop-filter 0.3s ease",
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 flex items-center justify-between"
          style={{ height: scrolled ? 60 : 72, transition: "height 0.3s ease" }}
        >
          <DocuraLogo size={32} showText />

          <nav className="hidden md:flex items-center gap-8">
            {["How it works", "Docura Care", "Docura Now", "For Doctors"].map((label) => (
              <button
                key={label}
                className="text-sm transition-opacity hover:opacity-60"
                style={{ color: C.navy, fontWeight: 500 }}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("login")}
              className="text-sm font-medium transition-opacity hover:opacity-60"
              style={{ color: C.navy }}
            >
              Log in
            </button>
            <button
              onClick={() => navigate("role-select")}
              className="px-5 py-2.5 text-sm font-semibold rounded-full transition-opacity hover:opacity-85"
              style={{ backgroundColor: C.navy, color: "white" }}
            >
              Get Started
            </button>
          </div>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-5 h-0.5 rounded" style={{ backgroundColor: C.navy }} />
            <div className="w-4 h-0.5 rounded" style={{ backgroundColor: C.navy }} />
            <div className="w-5 h-0.5 rounded" style={{ backgroundColor: C.navy }} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            className="md:hidden border-t px-6 py-5 flex flex-col gap-4"
            style={{ borderColor: C.border, backgroundColor: "#FAFAF8" }}
          >
            {["How it works", "Docura Care", "Docura Now", "For Doctors"].map((label) => (
              <button key={label} className="text-sm text-left" style={{ color: C.navy }}>
                {label}
              </button>
            ))}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => navigate("login")}
                className="flex-1 py-2.5 text-sm font-medium rounded-full border"
                style={{ borderColor: C.border, color: C.navy }}
              >
                Log in
              </button>
              <button
                onClick={() => navigate("role-select")}
                className="flex-1 py-2.5 text-sm font-semibold rounded-full"
                style={{ backgroundColor: C.navy, color: "white" }}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ paddingTop: 96, paddingBottom: 24, minHeight: "100svh", backgroundColor: "#FAFAF8" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 overflow-hidden rounded-[28px]" style={{ minHeight: "calc(100svh - 144px)", backgroundColor: C.navy }}>

            {/* Left: editorial text */}
            <div
              className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 md:py-20 order-2 md:order-1"
              style={{ backgroundColor: C.navy }}
            >
              <div style={{ maxWidth: 480 }}>
                <p
                  className="text-xs font-semibold uppercase mb-7"
                  style={{ color: C.amber, letterSpacing: "0.16em" }}
                >
                  Docura · Your healthcare home
                </p>
                <h1
                  className="mb-6 leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.6rem, 5vw, 4.4rem)",
                    color: C.amber,
                    fontWeight: 700,
                    lineHeight: 1.06,
                  }}
                >
                  Your healthcare,<br />
                  <em style={{ fontStyle: "italic", color: C.amber }}>wherever</em><br />
                  life takes you.
                </h1>
                <p
                  className="mb-10 leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.68)", fontSize: "1.05rem", maxWidth: 400 }}
                >
                  Get trusted medical care when you need it, with a doctor who can continue caring for you over time.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mb-7">
                  <button
                    onClick={() => navigate("docura-now-flow")}
                    className="px-7 py-4 text-sm font-semibold rounded-full transition-opacity hover:opacity-88"
                    style={{ backgroundColor: C.amber, color: "white" }}
                  >
                    Talk to a Doctor
                  </button>
                  <button
                    onClick={() => navigate("find-doctor")}
                    className="px-7 py-4 text-sm font-semibold rounded-xl border transition-colors hover:bg-white/10"
                    style={{ borderColor: "rgba(255,255,255,0.35)", color: "white" }}
                  >
                    Find Your Personal Doctor
                  </button>
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.48)" }}>
                  Verified doctors · Secure care · Continuity wherever you go
                </p>
              </div>
            </div>

            {/* Right: full-bleed photo */}
            <div className="relative order-1 md:order-2" style={{ minHeight: 340, backgroundColor: C.navyMuted }}>
              {HERO_SLIDES.map((slide, i) => (
                <img
                  key={slide.url}
                  src={slide.url}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: i === heroIdx ? 1 : 0,
                    transition: "opacity 1.1s ease",
                  }}
                />
              ))}
              {/* amber left accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 hidden md:block"
                style={{ backgroundColor: C.amber }}
              />
              {/* carousel dots */}
              <div className="absolute bottom-7 right-7 flex items-center gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIdx(i)}
                    className="rounded-full transition-all duration-400"
                    style={{
                      width: i === heroIdx ? 28 : 8,
                      height: 8,
                      backgroundColor: i === heroIdx ? C.amber : "rgba(255,255,255,0.45)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Entry: Now + Care ──────────────────────── */}
      <section style={{ backgroundColor: "#FAFAF8", padding: "24px 0 72px" }}>
        <div
          className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-4"
        >
          {/* Docura Now */}
          <div
            className="px-8 py-12 md:py-16 flex flex-col gap-5 rounded-3xl"
            style={{ backgroundColor: "#F58A8D" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: C.navy }}
            >
              Docura Now
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.9rem, 3.5vw, 3rem)",
                color: C.navy,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Talk to a doctor<br />when you need one.
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: "rgba(21,95,84,0.72)", maxWidth: 360 }}
            >
              Get care for urgent symptoms, a diagnosis, and a prescription — all in one secure conversation.
            </p>
            <button
              onClick={() => navigate("docura-now-flow")}
              className="self-start px-6 py-3 text-sm font-semibold rounded-full mt-2 transition-opacity hover:opacity-88"
              style={{ backgroundColor: C.navy, color: "white" }}
            >
              Talk to a Doctor
            </button>
          </div>

          {/* Docura Care */}
          <div
            className="px-8 py-12 md:py-16 flex flex-col gap-5 rounded-3xl"
            style={{ backgroundColor: "#8FB8E8" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: C.navy }}
            >
              Docura Care
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.9rem, 3.5vw, 3rem)",
                color: C.navy,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Build a lasting<br />relationship.
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: "rgba(21,95,84,0.72)", maxWidth: 360 }}
            >
              Your personal doctor gets to know your health over time, wherever life takes you.
            </p>
            <button
              onClick={() => navigate("find-doctor")}
              className="self-start px-6 py-3 text-sm font-semibold rounded-full mt-2 border transition-colors hover:bg-white/10"
              style={{ borderColor: C.navy, color: C.navy }}
            >
              Continue My Care
            </button>
          </div>
        </div>
      </section>

      {/* ── Brand Statement ────────────────────────────────── */}
      <section
        ref={brandStmt.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "#FAFAF8", ...fadeStyle(brandStmt.visible) }}
        className="py-28 md:py-44 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              color: C.navy,
              fontWeight: 700,
              lineHeight: 1.08,
            }}
          >
            "Healthcare should<br />know you."
          </h2>
          <div className="w-14 h-px mx-auto my-10" style={{ backgroundColor: C.amber }} />
          <p
            className="text-xl md:text-2xl leading-relaxed"
            style={{
              color: "#7a8099",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
            }}
          >
            Not just your symptoms.<br />
            Not just your last appointment.<br />
            Your story.
          </p>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section
        ref={howItWorks.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "white", ...fadeStyle(howItWorks.visible) }}
        className="py-20 md:py-32 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-20">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: C.amber }}>
              The process
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: C.navy,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Care that stays<br />with you.
            </h2>
          </div>
          <div className="grid md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Find your doctor",
                body: "Choose a verified doctor who understands what you need. Browse by specialty, language, and country.",
              },
              {
                n: "02",
                title: "Get care",
                body: "Talk to your doctor, receive treatment and keep your health information together in one secure place.",
              },
              {
                n: "03",
                title: "Continue your care",
                body: "Your relationship and health history stay with you over time, wherever life takes you.",
              },
            ].map((step, i) => (
              <div
                key={step.n}
                className="py-10 md:py-0"
                style={{
                  paddingLeft: i === 0 ? 0 : "3rem",
                  paddingRight: i === 2 ? 0 : "3rem",
                  borderLeft: i > 0 ? `1px solid ${C.border}` : "none",
                  borderTop: i > 0 ? "none" : "none",
                }}
              >
                <div
                  className="mb-5 leading-none font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(5rem, 10vw, 8rem)",
                    color: "#EDE9E0",
                    lineHeight: 0.88,
                  }}
                >
                  {step.n}
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: "var(--font-display)", color: C.navy }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7a8099" }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Personal Doctor ────────────────────────────────── */}
      <section
        ref={personalDoc.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "#FAFAF8", ...fadeStyle(personalDoc.visible) }}
        className="overflow-hidden"
      >
        <div
          className="max-w-7xl mx-auto grid md:grid-cols-5"
          style={{ minHeight: 560 }}
        >
          {/* Photo 3/5 */}
          <div className="md:col-span-3 relative" style={{ minHeight: 340 }}>
            <img
              src="https://images.unsplash.com/photo-1536064479547-7ee40b74b807?w=900&h=700&fit=crop&auto=format"
              alt="Doctor consulting with patient"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 hidden md:block"
              style={{
                background: "linear-gradient(to right, transparent 60%, #FAFAF8 100%)",
              }}
            />
          </div>

          {/* Text 2/5 */}
          <div className="md:col-span-2 flex flex-col justify-center px-8 md:px-12 py-16 md:py-20">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: C.amber }}
            >
              Docura Care
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: C.navy,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Not just a doctor<br />for today.
            </h2>
            <p
              className="mb-8 leading-relaxed text-sm md:text-base"
              style={{ color: "#5c6580" }}
            >
              With Docura Care, you build an ongoing relationship with a personal doctor who gets to know your health over time.
            </p>

            {/* Mini doctor card */}
            <div
              className="rounded-2xl p-5 mb-8 border"
              style={{ backgroundColor: "white", borderColor: C.border, maxWidth: 276 }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-3"
                style={{ color: C.muted }}
              >
                Your Personal Doctor
              </p>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1678695972687-033fa0bdbac9?w=60&h=60&fit=crop&auto=format"
                  alt="Dr. Sarah Mensah"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm" style={{ color: C.navy }}>
                    Dr. Sarah Mensah
                  </p>
                  <p className="text-xs" style={{ color: C.muted }}>
                    General Medicine
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-4">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-xs font-medium" style={{ color: "#16a34a" }}>
                  Verified
                </span>
              </div>
              <button
                className="w-full py-2.5 text-xs font-semibold rounded-full transition-opacity hover:opacity-85"
                style={{ backgroundColor: C.navy, color: "white" }}
              >
                Message Doctor
              </button>
            </div>

            <button
              onClick={() => navigate("find-doctor")}
              className="self-start px-7 py-3.5 text-sm font-semibold rounded-full border transition-colors hover:bg-gray-100"
              style={{ borderColor: C.navy, color: C.navy }}
            >
              Explore Docura Care
            </button>
          </div>
        </div>
      </section>

      {/* ── Docura Now – Navy ──────────────────────────────── */}
      <section
        ref={docuraNow.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: C.navy, ...fadeStyle(docuraNow.visible) }}
        className="py-20 md:py-32 px-6"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: C.amber }}
            >
              On-demand care
            </p>
            <h2
              className="mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                color: "white",
                fontWeight: 700,
                lineHeight: 1.08,
              }}
            >
              Sometimes,<br />you just need<br />a doctor.
            </h2>
            <p
              className="mb-8 leading-relaxed text-base"
              style={{ color: "rgba(255,255,255,0.62)" }}
            >
              Talk to a verified doctor when you need care today.
            </p>
            <button
              onClick={() => navigate("docura-now-flow")}
              className="px-7 py-3.5 text-sm font-semibold rounded-full transition-opacity hover:opacity-88"
              style={{ backgroundColor: C.amber, color: "white" }}
            >
              Find a Doctor
            </button>
          </div>

          {/* Art-directed product preview */}
          <div
            className="rounded-2xl p-8"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p className="text-sm font-medium mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
              What can we help you with?
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {["Fever", "Headache", "Cough", "Stomach", "Skin", "Other"].map((s) => (
                <button
                  key={s}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{
                    border: `1px solid ${s === "Fever" ? C.amber : "rgba(255,255,255,0.14)"}`,
                    color: s === "Fever" ? C.amber : "rgba(255,255,255,0.72)",
                    backgroundColor: s === "Fever" ? "rgba(232,160,32,0.15)" : "transparent",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1666886573553-453e9cdbd967?w=80&h=80&fit=crop&auto=format"
                  alt="Doctor"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Dr. Kofi Asante</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    General Medicine · Available now
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#4ade80" }} />
              </div>
              <button
                className="w-full py-3 text-sm font-semibold rounded-full transition-opacity hover:opacity-88"
                style={{ backgroundColor: C.amber, color: "white" }}
              >
                Start Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Global Care ────────────────────────────────────── */}
      <section
        ref={globalCare.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "white", ...fadeStyle(globalCare.visible) }}
        className="py-20 md:py-32 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: C.amber }}>
            Cross-border care
          </p>
          <h2
            className="mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: C.navy,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 640,
            }}
          >
            Your doctor doesn't<br />have to stop at the border.
          </h2>
          <p
            className="mb-16 text-base leading-relaxed"
            style={{ color: "#5c6580", maxWidth: 540 }}
          >
            When you're in another supported country, Docura helps your personal doctor continue your care while a locally licensed doctor supports prescriptions when needed.
          </p>

          <div className="grid md:grid-cols-3 gap-6 items-center mb-12">
            {/* Nigeria */}
            <div
              className="p-8 rounded-2xl text-center"
              style={{ backgroundColor: "#FAFAF8", border: `1px solid ${C.border}` }}
            >
              <div className="text-4xl mb-3">🇳🇬</div>
              <p className="font-bold mb-1" style={{ color: C.navy }}>Nigeria</p>
              <p className="text-sm mb-4" style={{ color: C.muted }}>Your personal doctor</p>
              <div
                className="rounded-xl p-3 text-left"
                style={{ backgroundColor: "white", border: `1px solid ${C.border}` }}
              >
                <p className="text-xs font-semibold" style={{ color: C.navy }}>Dr. Amara Okafor</p>
                <p className="text-xs" style={{ color: C.muted }}>General Practice · Abuja</p>
              </div>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center gap-3 py-4">
              <div
                className="px-5 py-2 rounded-full text-xs font-semibold"
                style={{ backgroundColor: C.amberLight, color: C.amber }}
              >
                ↔ cross-border
              </div>
              <p className="text-xs text-center" style={{ color: C.muted, maxWidth: 180 }}>
                Care and prescriptions travel with you
              </p>
            </div>

            {/* UK */}
            <div
              className="p-8 rounded-2xl text-center"
              style={{ backgroundColor: "#FAFAF8", border: `1px solid ${C.border}` }}
            >
              <div className="text-4xl mb-3">🇬🇧</div>
              <p className="font-bold mb-1" style={{ color: C.navy }}>United Kingdom</p>
              <p className="text-sm mb-4" style={{ color: C.muted }}>Local prescribing doctor</p>
              <div
                className="rounded-xl p-3 text-left"
                style={{ backgroundColor: "white", border: `1px solid ${C.border}` }}
              >
                <p className="text-xs font-semibold" style={{ color: C.navy }}>Dr. James Adeyemi</p>
                <p className="text-xs" style={{ color: C.muted }}>General Practice · London</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("role-select")}
              className="px-7 py-3.5 text-sm font-semibold rounded-full border transition-colors hover:bg-gray-50"
              style={{ borderColor: C.navy, color: C.navy }}
            >
              Explore Global Care
            </button>
          </div>
        </div>
      </section>

      {/* ── Health Passport ────────────────────────────────── */}
      <section
        ref={passport.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "#FAFAF8", ...fadeStyle(passport.visible) }}
        className="py-20 md:py-32 px-6"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: C.amber }}
            >
              Health Passport
            </p>
            <h2
              className="mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                color: C.navy,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Your health.<br />Always with you.
            </h2>
            <p
              className="leading-relaxed text-base"
              style={{ color: "#5c6580", maxWidth: 420 }}
            >
              Wherever life takes you, your essential health information stays organized and accessible — instantly shareable with any doctor who needs it.
            </p>
          </div>

          {/* Passport card */}
          <div>
            <div
              className="rounded-3xl p-8 text-white relative overflow-hidden"
              style={{
                background: `linear-gradient(140deg, ${C.navy} 0%, #1a2f70 100%)`,
              }}
            >
              <div
                className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-10"
                style={{ backgroundColor: C.amber, transform: "translate(35%, -35%)" }}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-0.5">
                      Docura
                    </p>
                    <p
                      className="font-bold text-base"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Health Passport
                    </p>
                  </div>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ border: `2px solid rgba(232,160,32,0.4)` }}
                  >
                    <span style={{ color: C.amber, fontSize: 16 }}>◈</span>
                  </div>
                </div>

                <p
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Adaeze Okonkwo
                </p>
                <p className="text-sm opacity-50 mb-8">DOB: 14 Mar 1990 · Female</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: "Blood Group", value: "O+" },
                    { label: "Allergies", value: "Penicillin" },
                    { label: "Medications", value: "2 active" },
                    { label: "Conditions", value: "Type 2 Diabetes" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl p-3"
                      style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                    >
                      <p className="text-xs opacity-45 mb-1">{item.label}</p>
                      <p className="font-semibold text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div
                  className="pt-5 border-t flex items-center gap-3"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1678695972687-033fa0bdbac9?w=40&h=40&fit=crop&auto=format"
                    alt="Personal doctor"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs opacity-50">Personal Doctor</p>
                    <p className="text-xs font-semibold">Dr. Sarah Mensah</p>
                  </div>
                  <div className="ml-auto">
                    <div
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: "rgba(232,160,32,0.2)", color: C.amber }}
                    >
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Health Journey ─────────────────────────────────── */}
      <section
        ref={journey.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "white", ...fadeStyle(journey.visible) }}
        className="py-20 md:py-32 px-6"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: C.amber }}
            >
              Your journey
            </p>
            <h2
              className="mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                color: C.navy,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Your health is<br />a journey.<br />
              <em style={{ fontStyle: "italic" }}>Docura remembers.</em>
            </h2>
            <p
              className="leading-relaxed text-base"
              style={{ color: "#5c6580" }}
            >
              Every consultation, prescription, and care plan — kept together, so your story is never lost.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative pl-8">
            <div
              className="absolute left-0 top-2 bottom-2 w-px"
              style={{ backgroundColor: C.border }}
            />
            {[
              { date: "Jan 2024", label: "First consultation", note: "General health check-up" },
              { date: "Feb 2024", label: "Prescription issued", note: "Metformin 500mg" },
              { date: "Apr 2024", label: "Follow-up", note: "3-month diabetes review" },
              { date: "Jun 2024", label: "Care plan started", note: "Diabetes management plan" },
              { date: "Now", label: "Ongoing care", note: "With Dr. Sarah Mensah", active: true },
            ].map((item, i) => (
              <div key={i} className="relative mb-8 last:mb-0">
                <div
                  className="absolute -left-8 top-1.5 w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: item.active ? C.amber : C.border, transform: "translateX(-50%)" }}
                />
                <p
                  className="text-xs font-semibold mb-0.5"
                  style={{ color: item.active ? C.amber : C.muted }}
                >
                  {item.date}
                </p>
                <p className="font-semibold text-sm mb-0.5" style={{ color: C.navy }}>
                  {item.label}
                </p>
                <p className="text-xs" style={{ color: C.muted }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust ──────────────────────────────────────────── */}
      <section
        ref={trust.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "#FAFAF8", ...fadeStyle(trust.visible) }}
        className="py-20 md:py-32 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className="mb-16 md:mb-20"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: C.navy,
              fontWeight: 700,
              lineHeight: 1.08,
            }}
          >
            Healthcare<br />you can trust.
          </h2>
          <div className="grid md:grid-cols-2">
            {[
              {
                n: "01",
                title: "Verified doctors",
                body: "Every doctor is identity-verified and license-confirmed before they can practice on Docura.",
              },
              {
                n: "02",
                title: "Secure health information",
                body: "Your data is encrypted end-to-end. Only your care team sees your health records.",
              },
              {
                n: "03",
                title: "Prescriptions you can verify",
                body: "Digital prescriptions include a verification code — always legitimate, always traceable.",
              },
              {
                n: "04",
                title: "Care that continues",
                body: "We built Docura around continuity. Your relationship with your doctor never resets.",
              },
            ].map((item, i) => (
              <div
                key={item.n}
                className="py-10 px-8"
                style={{
                  borderLeft: i % 2 === 1 ? `1px solid ${C.border}` : "none",
                  borderTop: i >= 2 ? `1px solid ${C.border}` : "none",
                  borderBottom: `1px solid ${C.border}`,
                  borderRight: "none",
                }}
              >
                <p className="text-xs font-semibold mb-4" style={{ color: C.amber }}>
                  {item.n}
                </p>
                <h3
                  className="font-bold mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                    color: C.navy,
                  }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7a8099" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctor Section ─────────────────────────────────── */}
      <section
        ref={doctorCta.ref as React.RefObject<HTMLElement>}
        className="relative overflow-hidden"
        style={{ minHeight: 520, ...fadeStyle(doctorCta.visible) }}
      >
        <img
          src="https://images.unsplash.com/photo-1666886573553-453e9cdbd967?w=1400&h=700&fit=crop&auto=format"
          alt="Docura doctor"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.52)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, rgba(13,27,62,0.92) 0%, rgba(13,27,62,0.55) 55%, transparent 100%)`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div style={{ maxWidth: 520 }}>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: C.amber }}
            >
              For doctors
            </p>
            <h2
              className="mb-5 text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Great care starts<br />with great doctors.
            </h2>
            <p
              className="mb-8 leading-relaxed text-base"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Build lasting relationships with patients and provide care through a platform designed around continuity.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("doctor-signup")}
                className="px-7 py-3.5 text-sm font-semibold rounded-full transition-opacity hover:opacity-88"
                style={{ backgroundColor: C.amber, color: "white" }}
              >
                Join Docura as a Doctor
              </button>
              <button
                onClick={() => navigate("doctor-login")}
                className="px-7 py-3.5 text-sm font-semibold rounded-full border transition-colors hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Docura Proxy ───────────────────────────────────── */}
      <section
        ref={proxy.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "white", ...fadeStyle(proxy.visible) }}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div
            className="px-10 py-12 text-center rounded-2xl"
            style={{ backgroundColor: "#FAFAF8", border: `1px solid ${C.border}`, maxWidth: 520, margin: "0 auto" }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ backgroundColor: C.amberLight, color: C.amber }}
            >
              Coming Soon
            </span>
            <h3
              className="mb-3"
              style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: C.navy, fontWeight: 700 }}
            >
              Docura Proxy
            </h3>
            <p
              className="text-base italic mb-3"
              style={{ fontFamily: "var(--font-display)", color: "#5c6580" }}
            >
              "Care for someone you love."
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "#7a8099" }}>
              Soon, you'll be able to coordinate healthcare for someone else — a parent, partner, or child — from your Docura account.
            </p>
            <button
              className="px-7 py-3 text-sm font-semibold rounded-full border transition-colors hover:bg-gray-50"
              style={{ borderColor: C.border, color: C.navy }}
            >
              Notify Me
            </button>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 580 }}>
        <img
          src="https://images.unsplash.com/photo-1624272864537-8ecc72b67958?w=1400&h=700&fit=crop&auto=format"
          alt="Your healthcare home is waiting"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(13,27,62,0.55) 0%, rgba(13,27,62,0.88) 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-44 text-center">
          <h2
            className="mb-6 text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            Your healthcare home<br />is waiting.
          </h2>
          <p
            className="mb-10 text-base md:text-lg"
            style={{ color: "rgba(255,255,255,0.68)" }}
          >
            Start with the care you need today.<br />Build the relationship you need for tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("role-select")}
              className="px-8 py-4 text-sm font-semibold rounded-full transition-opacity hover:opacity-88"
              style={{ backgroundColor: C.amber, color: "white" }}
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("docura-now-flow")}
              className="px-8 py-4 text-sm font-semibold rounded-full border transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.35)", color: "white" }}
            >
              Talk to a Doctor
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ backgroundColor: C.navy }} className="px-6 pt-16 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-14">
            <div className="md:col-span-2">
              <DocuraLogo size={32} showText />
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.45)", maxWidth: 240 }}
              >
                Your healthcare home.<br />Anywhere. Anytime.
              </p>
            </div>

            {[
              {
                title: "Patients",
                links: ["Docura Now", "Docura Care", "Find a Doctor", "Health Passport"],
              },
              {
                title: "Doctors",
                links: ["Join Docura", "How it works", "Doctor Login"],
              },
              {
                title: "Company",
                links: ["About", "Contact", "Help"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm transition-colors hover:text-white"
                        style={{ color: "rgba(255,255,255,0.56)" }}
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              © 2025 Docura Health Ltd. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              Verified doctors · Secure care · Global reach
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
