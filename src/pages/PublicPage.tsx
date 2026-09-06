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

const PAGE_CONTENT: Record<PublicPageKey, { eyebrow: string; title: string; intro: string; points: string[] }> = {
    "how-it-works": {
        eyebrow: "How it works",
        title: "Care that makes sense from the first conversation.",
        intro: "Docura brings trusted doctors, secure health information, and continuity into one calm healthcare home.",
        points: ["Choose the kind of care you need today.", "Meet a verified doctor who understands your context.", "Keep your care history and relationship together over time."],
    },
    care: {
        eyebrow: "Docura Care",
        title: "A personal doctor for the long run.",
        intro: "Build an ongoing relationship with a doctor who gets to know your health, your goals, and your everyday life.",
        points: ["Personalized consultations and follow-ups.", "Care plans that stay organized in one place.", "A health record you can share whenever you need it."],
    },
    now: {
        eyebrow: "Docura Now",
        title: "Talk to a doctor when you need care today.",
        intro: "Connect with a verified doctor for an immediate consultation, wherever you are.",
        points: ["Start with the symptoms or questions on your mind.", "Connect with an available verified doctor.", "Receive clear next steps and digital prescriptions when appropriate."],
    },
    doctors: {
        eyebrow: "For doctors",
        title: "Build care relationships that last.",
        intro: "Docura gives doctors the tools to provide thoughtful, continuous care across time and borders.",
        points: ["Meet patients who are looking for continuity.", "Manage consultations, care plans, and follow-ups.", "Grow your practice through a trusted healthcare platform."],
    },
    about: {
        eyebrow: "About Docura",
        title: "Healthcare designed around people.",
        intro: "We are building a healthcare home where good care can continue, wherever life takes you.",
        points: ["Continuity over disconnected appointments.", "Clarity over confusing health information.", "Trust between patients and verified doctors."],
    },
    contact: {
        eyebrow: "Contact",
        title: "We are here to help.",
        intro: "Have a question about care, your account, or working with Docura? Our team is ready to listen.",
        points: ["Patient support: care@docura.health", "Doctor support: doctors@docura.health", "General enquiries: hello@docura.health"],
    },
    help: {
        eyebrow: "Help centre",
        title: "Find your way around Docura.",
        intro: "Get straightforward answers about consultations, records, prescriptions, and your account.",
        points: ["Your health information stays private and secure.", "You can access your care history from your account.", "Our support team can help when you are stuck."],
    },
    privacy: {
        eyebrow: "Privacy",
        title: "Your health information belongs to you.",
        intro: "Docura is built to keep your personal and health information private, clear, and under your control.",
        points: ["We collect only what is needed to provide care.", "Access is limited to the people involved in your care.", "You can ask questions about how your information is used."],
    },
    terms: {
        eyebrow: "Terms",
        title: "Clear expectations for better care.",
        intro: "Our terms explain how Docura works and what patients, doctors, and partners can expect from the service.",
        points: ["Docura connects patients with healthcare professionals.", "Doctors remain responsible for their clinical decisions.", "Using Docura means agreeing to use the service responsibly."],
    },
    security: {
        eyebrow: "Security",
        title: "Protection built into every step.",
        intro: "We use thoughtful controls and secure systems to protect the information entrusted to Docura.",
        points: ["Secure access to patient and doctor accounts.", "Health information is protected in transit and at rest.", "We continuously review and improve our security practices."],
    },
};

export default function PublicPage({ page }: { page: PublicPageKey }) {
    const { navigate } = useApp();
    const content = PAGE_CONTENT[page];

    return (
        <div className="min-h-screen" style={{ backgroundColor: C.warm, fontFamily: "var(--font-body)" }}>
            <header className="border-b" style={{ borderColor: C.border, backgroundColor: "rgba(250,250,248,0.96)" }}>
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button onClick={() => navigate("landing")} aria-label="Return to Docura home" className="flex items-center gap-2">
                        <img src={logo} alt="Docura" width={34} height={34} className="object-contain" />
                        <span className="font-bold text-xl" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>Docura</span>
                    </button>
                    <button onClick={() => navigate("role-select")} className="px-5 py-2.5 rounded-full text-sm font-semibold" style={{ backgroundColor: C.navy, color: "white" }}>
                        Get started
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-20 md:py-28">
                <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-5" style={{ color: C.amber }}>{content.eyebrow}</p>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>{content.title}</h1>
                    <p className="text-lg leading-relaxed mb-12" style={{ color: C.muted, maxWidth: 650 }}>{content.intro}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-5 mb-14">
                    {content.points.map((point, index) => (
                        <article key={point} className="p-6 rounded-2xl border bg-white" style={{ borderColor: C.border }}>
                            <p className="text-sm font-bold mb-5" style={{ color: C.amber }}>0{index + 1}</p>
                            <p className="font-semibold leading-relaxed" style={{ color: C.navy }}>{point}</p>
                        </article>
                    ))}
                </div>

                <button onClick={() => navigate("landing")} className="text-sm font-semibold" style={{ color: C.navy }}>
                    Back to home
                </button>
            </main>
        </div>
    );
}