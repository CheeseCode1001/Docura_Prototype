import { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { C } from "@/components/ui";
import { SiteFooter } from "@/pages/PublicPage";
import logo from "@/assets/logo.png";

const LANDING_NAV = [
  { label: "How it works", page: "public-how-it-works" },
  { label: "Docura Care", page: "public-care" },
  { label: "Docura Now", page: "public-now" },
  { label: "Global care", page: "public-crossborder" },
  { label: "Docura TV", page: "tv-home" },
  { label: "For Doctors", page: "public-doctors" },
];

const LANDING_TV = [
  { id: "tv1", title: "What your HbA1c number actually means", creator: "Dr. Amara Osei", thumb: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&h=800&fit=crop" },
  { id: "tv3", title: "Perimenopause: the signs people miss", creator: "Dr. Sarah Adeyemi", thumb: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=800&fit=crop" },
  { id: "tv4", title: "Hyperpigmentation: what actually helps", creator: "Dr. Fatima Bello", thumb: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=800&fit=crop" },
  { id: "tv6", title: "Fever in children: when to go to hospital", creator: "Dr. Amara Osei", thumb: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=800&fit=crop" },
];

const LANDING_FAQS = [
  { q: "What is the difference between Docura Now and Docura Care?", a: "Docura Now is a one-off consultation with an available verified doctor. Docura Care is an ongoing relationship with a personal doctor who knows your history, including messaging, care plans and follow-ups." },
  { q: "Are Docura doctors verified?", a: "Yes. Identity and licence are confirmed with the doctor's regulator — MDCN in Nigeria, GMC in the United Kingdom — before they can see any patient on Docura." },
  { q: "What happens to my care when I travel?", a: "Your personal doctor continues to lead your care. Where they are not licensed to prescribe, a locally licensed prescribing doctor joins your care team for that purpose." },
  { q: "Who can see my health record?", a: "You own it. Doctors see what is relevant to the care they provide, a proxy sees only what you delegate, support staff never see clinical records, and every share can be revoked." },
  { q: "Does Docura use AI to make decisions?", a: "No. AI summarises, organises and translates. Diagnosis, prescribing and every clinical decision remain with a licensed doctor." },
  { q: "How much does it cost?", a: "Doctors set their own prices. Consultations typically run ₦4,500–₦8,000 or £20–£30, and monthly care relationships ₦12,000–₦20,000 or £45–£60. Prices are always shown before you pay." },
];

function LandingLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} width={size} height={size} alt="Docura" className="object-contain" />
      <span className="font-bold text-xl" style={{ fontFamily: "var(--font-display)", color: C.navy }}>Docura</span>
    </div>
  );
}

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
  const { navigate, role } = useApp();

  /**
   * Marketing CTAs point at real product flows. A signed-in patient goes
   * straight there; a visitor is taken to account creation first, rather than
   * hitting a "sign in to continue" wall.
   */
  const startFlow = (page: string) => navigate(role === "patient" || role === "proxy" ? page : "role-select");
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
  const careTeam = useFadeIn();
  const proxySection = useFadeIn();
  const intelligence = useFadeIn();
  const hospitals = useFadeIn();
  const tv = useFadeIn();
  const faq = useFadeIn();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

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
          <LandingLogo size={32} />

          <nav className="hidden md:flex items-center gap-8">
            {LANDING_NAV.map(({ label, page }) => (
              <button
                key={label}
                onClick={() => navigate(page)}
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
            {LANDING_NAV.map(({ label, page }) => (
              <button key={label} onClick={() => { navigate(page); setMobileMenuOpen(false); }} className="text-sm text-left" style={{ color: C.navy }}>
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
                    onClick={() => startFlow("docura-now-flow")}
                    className="px-7 py-4 text-sm font-semibold rounded-full transition-opacity hover:opacity-88"
                    style={{ backgroundColor: C.amber, color: "white" }}
                  >
                    Talk to a Doctor
                  </button>
                  <button
                    onClick={() => startFlow("find-doctor")}
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
              onClick={() => startFlow("docura-now-flow")}
              className="self-start px-6 py-3 text-sm font-semibold rounded-full mt-2 transition-opacity hover:opacity-88"
              style={{ backgroundColor: C.navy, color: "white" }}
            >
              Talk to a Doctor
            </button>

            <button
              onClick={() => navigate("role-select")}
              className="rounded-3xl p-7 text-left border transition-transform hover:-translate-y-1"
              style={{ backgroundColor: "#EAF4F1", borderColor: C.border }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: C.amber }}>Docura Proxy</p>
              <h3 className="text-xl font-bold mb-3" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>Care for someone else.</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#5c6580" }}>Coordinate appointments, medications, and updates for a loved one while they remain the owner of their record.</p>
              <span className="inline-block mt-5 text-sm font-semibold" style={{ color: C.navy }}>Explore Proxy care →</span>
            </button>

            <button
              onClick={() => navigate("role-select")}
              className="rounded-3xl p-7 text-left border transition-transform hover:-translate-y-1"
              style={{ backgroundColor: "white", borderColor: C.border }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: C.amber }}>Connected Care Partners</p>
              <h3 className="text-xl font-bold mb-3" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>Continue care beyond discharge.</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#5c6580" }}>Help your organisation or hospital connect people to trusted follow-up care, referrals, and continuity.</p>
              <span className="inline-block mt-5 text-sm font-semibold" style={{ color: C.navy }}>Partner with Docura →</span>
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
              onClick={() => startFlow("find-doctor")}
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
              onClick={() => startFlow("find-doctor")}
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
              onClick={() => startFlow("docura-now-flow")}
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

      {/* ── Medical Documents ────────────────────────────────── */}
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
              Medical Documents
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
                      Medical Documents
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

      {/* ── Feature Bento ──────────────────────────────────── */}
      <section
        ref={proxy.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "#FAFAF8", ...fadeStyle(proxy.visible) }}
        className="py-20 md:py-28 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: C.amber }}>
              One healthcare home
            </p>
            <h2
              className="mb-5"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: C.navy, fontWeight: 700, lineHeight: 1.08 }}
            >
              Everything your care needs, together.
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#5c6580", maxWidth: 560 }}>
              From a quick consultation to a lifelong care relationship, Docura keeps the important parts of your health journey close at hand.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
            <button
              onClick={() => startFlow("patient-care")}
              className="md:col-span-2 md:row-span-2 rounded-3xl p-8 md:p-10 text-left relative overflow-hidden transition-transform hover:-translate-y-1"
              style={{ backgroundColor: C.navy, color: "white" }}
            >
              <div className="relative z-10 h-full flex flex-col justify-between min-h-[360px]">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-8" style={{ backgroundColor: "rgba(255,255,255,0.12)", color: C.amber }}>
                    Docura Care
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    Care that remembers you.
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", maxWidth: 330 }}>
                    Your doctor, your history, and your care plan stay connected over time.
                  </p>
                </div>
                <span className="text-sm font-semibold" style={{ color: C.amber }}>Explore personal care →</span>
              </div>
              <div className="absolute -right-16 -bottom-20 w-64 h-64 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.14)" }} />
              <div className="absolute -right-4 -bottom-8 w-40 h-40 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.14)" }} />
            </button>

            <button
              onClick={() => startFlow("docura-now-flow")}
              className="md:col-span-2 rounded-3xl p-7 text-left transition-transform hover:-translate-y-1"
              style={{ backgroundColor: C.amber, color: C.navy }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(21,95,84,0.68)" }}>Docura Now</p>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>A doctor for today.</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(21,95,84,0.72)", maxWidth: 260 }}>Get the care you need without waiting for tomorrow.</p>
                </div>
                <span className="text-3xl" aria-hidden="true">↗</span>
              </div>
            </button>

            <button
              onClick={() => navigate("public-health-record")}
              className="rounded-3xl p-7 text-left border transition-transform hover:-translate-y-1"
              style={{ backgroundColor: "white", borderColor: C.border }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: C.amber }}>Health record</p>
              <h3 className="text-xl font-bold mb-3" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>Your health, always with you.</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#7a8099" }}>One organised history, shared only with the people you choose.</p>
            </button>

            <button
              onClick={() => navigate("public-crossborder")}
              className="rounded-3xl p-7 text-left border transition-transform hover:-translate-y-1"
              style={{ backgroundColor: "#EAF4F1", borderColor: "#D7E9E4" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: C.navy }}>Global care</p>
              <h3 className="text-xl font-bold mb-3" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>Wherever life takes you.</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#55736D" }}>Your care can continue across borders.</p>
            </button>
          </div>
        </div>
      </section>

      {/* ── Care Team & Health Passport ────────────────────── */}
      <section
        ref={careTeam.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "white", ...fadeStyle(careTeam.visible) }}
        className="py-20 md:py-28 px-5 sm:px-6"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: C.amber }}>Your care team</p>
            <h2 className="mb-5" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 3.6vw, 3rem)", color: C.navy, fontWeight: 700, lineHeight: 1.1 }}>
              Everyone looking after you, in one place.
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "#5c6580", maxWidth: 520 }}>
              A personal doctor who knows you. A prescribing doctor where you are. Specialists, coordinators and partners
              brought in when they are needed — each seeing only what your care requires.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { role: "Personal Doctor", detail: "Leads your care and knows your history." },
                { role: "Prescribing Doctor", detail: "Licensed where you are, responsible for prescriptions there." },
                { role: "Specialists & partners", detail: "Joined by referral, with the context they need and nothing more." },
                { role: "Coordinators", detail: "A family member you delegate to, with scoped and revocable access." },
              ].map((item) => (
                <div key={item.role} className="flex gap-4 items-start rounded-2xl border p-4" style={{ borderColor: C.border }}>
                  <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: C.amber }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: C.navy }}>{item.role}</p>
                    <p className="text-sm mt-0.5" style={{ color: "#7a8099" }}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("public-care-team")} className="mt-8 px-7 py-3.5 rounded-full text-sm font-semibold" style={{ backgroundColor: C.navy, color: "white" }}>
              How care teams work
            </button>
          </div>

          <div className="rounded-3xl p-7 sm:p-9" style={{ backgroundColor: C.navy }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: C.amber }}>Health Passport</p>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "white", lineHeight: 1.15 }}>
              A summary you can hand over in seconds.
            </h3>
            <p className="text-sm leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.65)" }}>
              Blood group, allergies, conditions, current medicines and your care team — shared by link or QR code, scoped to
              what you choose, and expiring when you say so.
            </p>
            <div className="rounded-2xl p-5 mb-7" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
              {[
                ["Always included", "Identity, blood group, allergies"],
                ["Your choice", "Conditions, medicines, care team, summaries"],
                ["Never automatic", "Full clinical notes and private conversations"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2.5 text-sm" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ color: "rgba(255,255,255,0.45)" }}>{label}</span>
                  <span className="text-right font-medium" style={{ color: "white" }}>{value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("public-health-passport")} className="px-7 py-3.5 rounded-full text-sm font-semibold" style={{ backgroundColor: C.amber, color: "white" }}>
              Explore the Health Passport
            </button>
          </div>
        </div>
      </section>

      {/* ── Docura Proxy ───────────────────────────────────── */}
      <section
        ref={proxySection.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "#EAF4F1", ...fadeStyle(proxySection.visible) }}
        className="py-20 md:py-28 px-5 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: C.navy }}>Docura Proxy</p>
            <h2 className="mb-5" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 3.6vw, 3rem)", color: C.navy, fontWeight: 700, lineHeight: 1.1 }}>
              Healthcare coordination for people who care for others.
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#55736D" }}>
              Look after a parent, a child or someone who needs support — with access the patient grants deliberately,
              scoped to what is needed, and withdrawn the moment it should be.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "01", title: "The patient invites you", body: "Coordination always begins with the person whose record it is. Nothing is shared before they accept." },
              { step: "02", title: "They choose the scopes", body: "Medicines, appointments, documents, payments — each one granted separately." },
              { step: "03", title: "You coordinate care", body: "Book consultations, track medicines, message the care team — visibly to the patient." },
              { step: "04", title: "Access ends", body: "Every delegation expires, and can be revoked at any moment without a reason." },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl p-6" style={{ backgroundColor: "white" }}>
                <span className="text-3xl font-bold" style={{ color: "#D7E9E4", fontFamily: "var(--font-display)" }}>{item.step}</span>
                <p className="font-semibold mt-3" style={{ color: C.navy }}>{item.title}</p>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "#55736D" }}>{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5" style={{ backgroundColor: "white" }}>
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: "#55736D" }}>
              <strong style={{ color: C.navy }}>Delegation is not ownership.</strong> A proxy coordinates care; the patient
              remains the owner of their health record and can see everything a coordinator does.
            </p>
            <button onClick={() => navigate("public-proxy")} className="px-7 py-3.5 rounded-full text-sm font-semibold shrink-0" style={{ backgroundColor: C.navy, color: "white" }}>
              How Docura Proxy works
            </button>
          </div>
        </div>
      </section>

      {/* ── Health Intelligence ────────────────────────────── */}
      <section
        ref={intelligence.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "#FAFAF8", ...fadeStyle(intelligence.visible) }}
        className="py-20 md:py-28 px-5 sm:px-6"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: C.amber }}>Health intelligence</p>
            <h2 className="mb-5" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 3.6vw, 3rem)", color: C.navy, fontWeight: 700, lineHeight: 1.1 }}>
              Intelligence that helps people understand care.
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: "#5c6580" }}>
              Docura uses AI to organise, summarise and translate — so patients can follow what is happening and doctors
              spend their time on care rather than paperwork.
            </p>
            <div className="rounded-2xl p-5" style={{ backgroundColor: C.amberLight }}>
              <p className="text-sm font-semibold mb-1" style={{ color: C.navy }}>Assistive, never autonomous</p>
              <p className="text-sm leading-relaxed" style={{ color: "#7a6a4a" }}>
                Docura's intelligence layer does not diagnose, prescribe or decide anything clinical. A licensed doctor
                reviews and takes responsibility for every clinical decision.
              </p>
            </div>
            <button onClick={() => navigate("public-intelligence")} className="mt-7 px-7 py-3.5 rounded-full text-sm font-semibold" style={{ backgroundColor: C.navy, color: "white" }}>
              How Docura uses AI
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "🗒️", title: "Consultation summaries", body: "Plain-language recaps of what was discussed and decided." },
              { icon: "🧾", title: "SOAP note drafts", body: "A structured starting point the doctor reviews, edits and signs off." },
              { icon: "🗣️", title: "Translation", body: "Patients and doctors understand each other across languages." },
              { icon: "📈", title: "Chronic monitoring", body: "Trends in readings and adherence, flagged to your doctor." },
              { icon: "🛟", title: "Safety checks", body: "Interaction and missing-information prompts that ask a human to look." },
              { icon: "💬", title: "AI receptionist", body: "Captures why you are here and routes you to the right kind of care." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border p-6" style={{ backgroundColor: "white", borderColor: C.border }}>
                <span className="text-2xl">{item.icon}</span>
                <p className="font-semibold mt-3" style={{ color: C.navy }}>{item.title}</p>
                <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "#7a8099" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hospitals & organisations ──────────────────────── */}
      <section
        ref={hospitals.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: C.navy, ...fadeStyle(hospitals.visible) }}
        className="py-20 md:py-28 px-5 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: C.amber }}>Hospitals & organisations</p>
              <h2 className="mb-5" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 3.6vw, 3rem)", color: "white", fontWeight: 700, lineHeight: 1.1 }}>
                Extend care beyond your walls.
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.65)", maxWidth: 520 }}>
                Referral pathways, discharge follow-up and employee healthcare — coordinated through Docura, measured at an
                aggregate level, and bounded by clear privacy rules.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate("public-hospitals")} className="px-7 py-3.5 rounded-full text-sm font-semibold" style={{ backgroundColor: C.amber, color: "white" }}>
                  Partner with Docura
                </button>
                <button onClick={() => navigate("public-referrals")} className="px-7 py-3.5 rounded-full text-sm font-semibold border" style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>
                  See how referrals work
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Referral pathways", body: "Structured referrals with a clinical letter and a consented summary." },
                { title: "Discharge follow-up", body: "Patients leave with a Docura doctor following up on their recovery." },
                { title: "Employee health", body: "Annual checks, chronic support and mental wellbeing for your workforce." },
                { title: "Aggregate reporting", body: "Enrolment, participation and outcomes — never an individual's record." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl p-6" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <p className="font-semibold" style={{ color: "white" }}>{item.title}</p>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl p-6" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              <strong style={{ color: "white" }}>Where the line sits:</strong> partners receive the referral and the summary
              the patient consented to share. Doctor-patient conversations are never shared with an employer or a hospital.
            </p>
          </div>
        </div>
      </section>

      {/* ── Docura TV ──────────────────────────────────────── */}
      <section
        ref={tv.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "white", ...fadeStyle(tv.visible) }}
        className="py-20 md:py-28 px-5 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: C.amber }}>Docura TV</p>
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 3.6vw, 3rem)", color: C.navy, fontWeight: 700, lineHeight: 1.1 }}>
                Health education from people who are actually qualified.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "#5c6580" }}>
                Short explainers from verified healthcare professionals — every creator licence-checked before they can
                publish, every video reviewed against a clinical content policy.
              </p>
            </div>
            <button onClick={() => navigate("tv-home")} className="px-7 py-3.5 rounded-full text-sm font-semibold shrink-0" style={{ backgroundColor: C.navy, color: "white" }}>
              Explore Docura TV
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {LANDING_TV.map((item) => (
              <button key={item.id} onClick={() => navigate("tv-content", { contentId: item.id })} className="text-left group">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100">
                  <img src={item.thumb} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{item.title}</p>
                    <p className="text-white/70 text-[11px] mt-1 truncate">{item.creator}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p className="text-xs mt-6" style={{ color: "#7a8099" }}>
            Docura TV is general health education. For advice about your own health, start a consultation.
          </p>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section
        ref={faq.ref as React.RefObject<HTMLElement>}
        style={{ backgroundColor: "#FAFAF8", ...fadeStyle(faq.visible) }}
        className="py-20 md:py-28 px-5 sm:px-6"
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: C.amber }}>Questions</p>
          <h2 className="mb-10" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 3.6vw, 3rem)", color: C.navy, fontWeight: 700, lineHeight: 1.1 }}>
            What people ask before they start.
          </h2>

          <div className="flex flex-col gap-2">
            {LANDING_FAQS.map((item) => (
              <div key={item.q} className="rounded-2xl border" style={{ backgroundColor: "white", borderColor: C.border }}>
                <button onClick={() => setOpenFaq(openFaq === item.q ? null : item.q)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                  <span className="text-sm font-semibold" style={{ color: C.navy }}>{item.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a8099" strokeWidth="2" strokeLinecap="round" className="shrink-0" style={{ transform: openFaq === item.q ? "rotate(180deg)" : "none", transition: "transform 150ms" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {openFaq === item.q && <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "#7a8099" }}>{item.a}</p>}
              </div>
            ))}
          </div>

          <button onClick={() => navigate("public-faq")} className="mt-8 text-sm font-semibold" style={{ color: C.amber }}>
            Read all frequently asked questions →
          </button>
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
              onClick={() => startFlow("docura-now-flow")}
              className="px-8 py-4 text-sm font-semibold rounded-full border transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.35)", color: "white" }}
            >
              Talk to a Doctor
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
