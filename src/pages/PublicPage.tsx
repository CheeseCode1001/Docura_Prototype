import { useApp } from "@/context/AppContext";
import { C } from "@/components/ui";
import logo from "@/assets/logo.png";

type PublicPageKey =
    | "how-it-works"
    | "care"
    | "now"
    | "doctors"
    | "about"
    | "contact"
    | "help"
    | "privacy"
    | "terms"
    | "security";

const PAGE_CONTENT: Record<PublicPageKey, { eyebrow: string; title: string; intro: string; points: string[]; details: string[] }> = {
    "how-it-works": {
        eyebrow: "How it works",
        title: "Care that makes sense from the first conversation.",
        intro: "Docura brings trusted doctors, secure health information, and continuity into one calm healthcare home.",
        points: ["Choose the kind of care you need today.", "Meet a verified doctor who understands your context.", "Keep your care history and relationship together over time."],
        details: ["Start with Docura Now for immediate support, or choose Docura Care when you want an ongoing relationship.", "Every doctor on Docura is identity-verified and license-confirmed before practicing on the platform.", "Your consultations, prescriptions, and care plans remain organized as your health story develops."],
    },
    care: {
        eyebrow: "Docura Care",
        title: "A personal doctor for the long run.",
        intro: "Build an ongoing relationship with a doctor who gets to know your health, your goals, and your everyday life.",
        points: ["Personalized consultations and follow-ups.", "Care plans that stay organized in one place.", "A health record you can share whenever you need it."],
        details: ["Your personal doctor learns what matters to you, not just what brought you in today.", "Keep goals, medications, appointments, and next steps together in one calm workspace.", "Continue your relationship with the same care team as your needs change."],
    },
    now: {
        eyebrow: "Docura Now",
        title: "Talk to a doctor when you need care today.",
        intro: "Connect with a verified doctor for an immediate consultation, wherever you are.",
        points: ["Start with the symptoms or questions on your mind.", "Connect with an available verified doctor.", "Receive clear next steps and digital prescriptions when appropriate."],
        details: ["Tell us what you need help with and we will guide you toward the right consultation.", "See a doctor who is available now, without losing the context of your health record.", "Leave with practical next steps and a clear record of what was discussed."],
    },
    doctors: {
        eyebrow: "For doctors",
        title: "Build care relationships that last.",
        intro: "Docura gives doctors the tools to provide thoughtful, continuous care across time and borders.",
        points: ["Meet patients who are looking for continuity.", "Manage consultations, care plans, and follow-ups.", "Grow your practice through a trusted healthcare platform."],
        details: ["Build meaningful patient relationships beyond one-off appointments.", "Use one workspace for consultations, messages, follow-ups, and care plans.", "Docura supports doctors with a focused platform designed around excellent care."],
    },
    about: {
        eyebrow: "About Docura",
        title: "Healthcare designed around people.",
        intro: "We are building a healthcare home where good care can continue, wherever life takes you.",
        points: ["Continuity over disconnected appointments.", "Clarity over confusing health information.", "Trust between patients and verified doctors."],
        details: ["Healthcare should feel like a relationship, not a series of disconnected transactions.", "We turn scattered information into a story that patients and care teams can understand.", "We are building patiently, with safety, trust, and useful care at the centre."],
    },
    contact: {
        eyebrow: "Contact",
        title: "We are here to help.",
        intro: "Have a question about care, your account, or working with Docura? Our team is ready to listen.",
        points: ["Patient support: care@docura.health", "Doctor support: doctors@docura.health", "General enquiries: hello@docura.health"],
        details: ["For help with a consultation or account, contact the patient support team.", "Doctors can reach the dedicated support team for onboarding and practice questions.", "For partnerships and general enquiries, send us a note and we will route it to the right team."],
    },
    help: {
        eyebrow: "Help centre",
        title: "Find your way around Docura.",
        intro: "Get straightforward answers about consultations, records, prescriptions, and your account.",
        points: ["Your health information stays private and secure.", "You can access your care history from your account.", "Our support team can help when you are stuck."],
        details: ["Find your consultations, prescriptions, care plans, and messages from your dashboard.", "Use your Health Passport when a new doctor needs the essentials quickly.", "When something does not look right, our support team is ready to help you find the next step."],
    },
    privacy: {
        eyebrow: "Privacy",
        title: "Your health information belongs to you.",
        intro: "Docura is built to keep your personal and health information private, clear, and under your control.",
        points: ["We collect only what is needed to provide care.", "Access is limited to the people involved in your care.", "You can ask questions about how your information is used."],
        details: ["We explain what information we collect and why it helps us provide the service.", "Your information is handled with controls designed to limit unnecessary access.", "Privacy questions are welcome. Contact our team for clarification about your account or data."],
    },
    terms: {
        eyebrow: "Terms",
        title: "Clear expectations for better care.",
        intro: "Our terms explain how Docura works and what patients, doctors, and partners can expect from the service.",
        points: ["Docura connects patients with healthcare professionals.", "Doctors remain responsible for their clinical decisions.", "Using Docura means agreeing to use the service responsibly."],
        details: ["The service helps patients and doctors communicate, organize care, and continue relationships.", "Clinical decisions remain with the appropriately licensed healthcare professional.", "Our terms are designed to make responsibilities clear for everyone using Docura."],
    },
    security: {
        eyebrow: "Security",
        title: "Protection built into every step.",
        intro: "We use thoughtful controls and secure systems to protect the information entrusted to Docura.",
        points: ["Secure access to patient and doctor accounts.", "Health information is protected in transit and at rest.", "We continuously review and improve our security practices."],
        details: ["Account access is designed around authentication and responsible permissions.", "We use secure transport and storage practices to protect information.", "Security is an ongoing practice, so we review our controls as the platform grows."],
    },
};

export default function PublicPage({ page }: { page: PublicPageKey }) {
    const { navigate } = useApp();
    const content = PAGE_CONTENT[page];

    return (
        <div className="min-h-screen" style={{ backgroundColor: C.warm, fontFamily: "var(--font-body)" }}>
            <header className="sticky top-0 z-50 border-b" style={{ borderColor: C.border, backgroundColor: "rgba(250,250,248,0.96)", backdropFilter: "blur(10px)" }}>
                <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between gap-8">
                    <button onClick={() => navigate("landing")} aria-label="Return to Docura home" className="flex items-center gap-2 shrink-0">
                        <img src={logo} alt="Docura" width={34} height={34} className="object-contain" />
                        <span className="font-bold text-xl" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>Docura</span>
                    </button>
                    <nav className="hidden md:flex items-center gap-7">
                        <button onClick={() => navigate("public-how-it-works")} className="text-sm font-medium hover:opacity-60" style={{ color: C.navy }}>How it works</button>
                        <button onClick={() => navigate("public-care")} className="text-sm font-medium hover:opacity-60" style={{ color: C.navy }}>Docura Care</button>
                        <button onClick={() => navigate("public-now")} className="text-sm font-medium hover:opacity-60" style={{ color: C.navy }}>Docura Now</button>
                        <button onClick={() => navigate("public-doctors")} className="text-sm font-medium hover:opacity-60" style={{ color: C.navy }}>For Doctors</button>
                    </nav>
                    <div className="flex items-center gap-4 shrink-0">
                        <button onClick={() => navigate("login")} className="hidden sm:block text-sm font-medium hover:opacity-60" style={{ color: C.navy }}>Log in</button>
                        <button onClick={() => navigate("role-select")} className="px-5 py-2.5 rounded-full text-sm font-semibold" style={{ backgroundColor: C.navy, color: "white" }}>Get started</button>
                    </div>
                </div>
            </header>

            <main>
                <section className="relative overflow-hidden" style={{ backgroundColor: C.navy }}>
                    <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-6" style={{ color: C.amber }}>{content.eyebrow}</p>
                            <h1 className="text-4xl md:text-6xl font-bold leading-[1.06] mb-6" style={{ color: C.amber, fontFamily: "var(--font-display)" }}>{content.title}</h1>
                            <p className="text-lg leading-relaxed mb-9" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 620 }}>{content.intro}</p>
                            <div className="flex flex-wrap gap-3">
                                <button onClick={() => navigate("role-select")} className="px-7 py-3.5 rounded-full text-sm font-semibold" style={{ backgroundColor: C.amber, color: "white" }}>Get started</button>
                                <button onClick={() => navigate("landing")} className="px-7 py-3.5 rounded-full text-sm font-semibold border hover:bg-white/10" style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>Explore Docura</button>
                            </div>
                        </div>
                        <div className="rounded-3xl p-7 md:p-9" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-7" style={{ color: "rgba(255,255,255,0.48)" }}>The Docura difference</p>
                            <div className="space-y-6">
                                {content.points.map((point, index) => (
                                    <div key={point} className="flex gap-4 items-start">
                                        <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: C.amber, color: C.navy }}>0{index + 1}</span>
                                        <p className="text-sm leading-relaxed pt-1" style={{ color: "rgba(255,255,255,0.82)" }}>{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
                    <div className="grid md:grid-cols-3 gap-5">
                        {content.details.map((detail, index) => (
                            <article key={detail} className="rounded-2xl border p-7 min-h-[220px]" style={{ backgroundColor: index === 1 ? C.amberLight : "white", borderColor: C.border }}>
                                <p className="text-xs font-semibold uppercase tracking-widest mb-12" style={{ color: C.amber }}>Why it matters</p>
                                <p className="text-base leading-relaxed font-semibold" style={{ color: C.navy }}>{detail}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="px-6 pb-20 md:pb-28">
                    <div className="max-w-7xl mx-auto rounded-3xl px-8 py-12 md:px-14 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8" style={{ backgroundColor: "white", border: `1px solid ${C.border}` }}>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: C.amber }}>Your healthcare home</p>
                            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>Start with the care you need today.</h2>
                        </div>
                        <button onClick={() => navigate("role-select")} className="px-7 py-3.5 rounded-full text-sm font-semibold shrink-0" style={{ backgroundColor: C.navy, color: "white" }}>Get started</button>
                    </div>
                </section>
            </main>

            <footer style={{ backgroundColor: C.navy }} className="px-6 pt-16 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-5 gap-10 mb-14">
                        <div className="md:col-span-2">
                            <button onClick={() => navigate("landing")} className="flex items-center gap-2">
                                <img src={logo} alt="Docura" width={34} height={34} className="object-contain" />
                                <span className="font-bold text-xl" style={{ color: "white", fontFamily: "var(--font-display)" }}>Docura</span>
                            </button>
                            <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 240 }}>Your healthcare home.<br />Anywhere. Anytime.</p>
                        </div>
                        {[{ title: "Patients", links: [["Docura Now", "public-now"], ["Docura Care", "public-care"], ["Find a Doctor", "find-doctor"], ["Health Passport", "health-passport"]] }, { title: "Doctors", links: [["Join Docura", "public-doctors"], ["How it works", "public-how-it-works"], ["Doctor Login", "doctor-login"]] }, { title: "Company", links: [["About", "public-about"], ["Contact", "public-contact"], ["Help", "public-help"]] }, { title: "Legal", links: [["Privacy", "public-privacy"], ["Terms", "public-terms"], ["Security", "public-security"]] }].map((column) => (
                            <div key={column.title}>
                                <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>{column.title}</h4>
                                <ul className="flex flex-col gap-2.5">{column.links.map(([label, target]) => <li key={label}><button onClick={() => navigate(target)} className="text-sm hover:text-white" style={{ color: "rgba(255,255,255,0.56)" }}>{label}</button></li>)}</ul>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>© 2025 Docura Health Ltd. All rights reserved.</p>
                        <button onClick={() => navigate("landing")} className="text-xs hover:text-white" style={{ color: "rgba(255,255,255,0.3)" }}>Back to home</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}