import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { C } from "@/components/ui";
import logo from "@/assets/logo.png";

export type PublicPageKey =
  | "how-it-works" | "care" | "now" | "doctors" | "about" | "contact" | "help" | "privacy" | "terms" | "security"
  | "crossborder" | "health-record" | "health-passport" | "care-team" | "proxy" | "intelligence" | "hospitals"
  | "referrals" | "tv" | "pricing" | "faq" | "careers" | "clinical-safety";

interface PublicPageContent {
  eyebrow: string;
  title: string;
  intro: string;
  /** The three-step promise in the hero panel. */
  points: string[];
  /** Feature cards — the substance of the page. */
  features: { title: string; body: string }[];
  /** Optional numbered walkthrough. */
  steps?: { title: string; body: string }[];
  /** Optional Q&A. The FAQ page uses this heavily. */
  faqs?: { q: string; a: string }[];
  cta: { title: string; body: string; label: string; page: string };
  /** A short honesty note where a claim needs qualifying. */
  note?: string;
}

// ─── Content registry ─────────────────────────────────────────────────────────
export const PUBLIC_PAGES: Record<PublicPageKey, PublicPageContent> = {
  "how-it-works": {
    eyebrow: "How it works",
    title: "Care that makes sense from the first conversation.",
    intro: "Docura brings trusted doctors, secure health information and continuity into one calm healthcare home.",
    points: ["Tell us what you need today.", "Meet a verified doctor who understands your context.", "Keep your care history and your relationship together over time."],
    steps: [
      { title: "Tell us what you need", body: "Describe your symptoms or the kind of relationship you are looking for. You never start from a blank form." },
      { title: "Connect with the right professional", body: "See verified doctors matched on specialty, language, availability and country — with the reasons shown." },
      { title: "Get care", body: "Consult by video, audio or chat. Prescriptions, summaries and next steps arrive in your record." },
      { title: "Keep your history organised", body: "Consultations, medicines, documents and care plans build one continuous health story." },
      { title: "Continue wherever life takes you", body: "Travel or relocate and your personal doctor stays with you, supported locally where prescribing rules require it." },
    ],
    features: [
      { title: "Two ways to start", body: "Docura Now for care today. Docura Care when you want a doctor who knows you over years, not minutes." },
      { title: "Verified before they practise", body: "Every doctor is identity-checked and licence-confirmed with their regulator before seeing a patient on Docura." },
      { title: "One record, yours", body: "Your consultations, prescriptions and documents live in one place that you own and control access to." },
    ],
    cta: { title: "Start with the care you need today.", body: "Create an account in a couple of minutes.", label: "Get started", page: "role-select" },
  },
  care: {
    eyebrow: "Docura Care",
    title: "A personal doctor for the long run.",
    intro: "Build an ongoing relationship with a doctor who gets to know your health, your goals and your everyday life.",
    points: ["A doctor who remembers your history.", "Care plans and follow-ups that stay organised.", "Continuity as your life and needs change."],
    steps: [
      { title: "Choose your personal doctor", body: "Browse verified doctors and read why each one is suggested for you before you commit." },
      { title: "Start your care relationship", body: "A monthly care fee covers messaging, scheduled consultations and care plan reviews." },
      { title: "Build a plan together", body: "Your doctor sets goals, medications and monitoring, and reviews them with you over time." },
      { title: "Stay in touch between visits", body: "Message your doctor rather than waiting for the next appointment to ask a question." },
    ],
    features: [
      { title: "Continuity, not repetition", body: "You stop re-explaining your history at every appointment. Your doctor already knows it." },
      { title: "Care plans that live somewhere", body: "Goals, medicines, monitoring and review dates in one place you can both see." },
      { title: "Follow-ups that actually happen", body: "Scheduled reviews with reminders, so chronic conditions do not drift between appointments." },
      { title: "Medication management", body: "Reminders, adherence tracking and repeat prescriptions coordinated with your doctor." },
      { title: "A record that travels", body: "Your health history moves with you between doctors, countries and hospitals." },
      { title: "Your care team grows with you", body: "Specialists, prescribing doctors and coordinators join around your personal doctor, not instead of them." },
    ],
    faqs: [
      { q: "What is the difference between Docura Care and Docura Now?", a: "Docura Now is a one-off consultation with an available verified doctor. Docura Care is an ongoing relationship with a personal doctor, billed monthly, including messaging, care plans and follow-ups." },
      { q: "Can I change my personal doctor?", a: "Yes. You can end a care relationship at any time and start with another doctor. Your health record stays with you." },
      { q: "Does a monthly fee include prescriptions?", a: "It covers the consultation and care coordination. The cost of dispensed medicines is separate and paid at the pharmacy." },
    ],
    cta: { title: "Find a doctor who will know you.", body: "Browse verified doctors and start a care relationship.", label: "Find a doctor", page: "role-select" },
  },
  now: {
    eyebrow: "Docura Now",
    title: "Talk to a doctor when you need care today.",
    intro: "Connect with a verified doctor for an immediate consultation, wherever you are.",
    points: ["Start with what is on your mind.", "See an available verified doctor.", "Leave with clear next steps."],
    steps: [
      { title: "Describe your symptoms", body: "A guided intake captures what matters so the consultation starts informed." },
      { title: "Choose an available doctor", body: "See who is online now, their specialty, languages and price before you pay." },
      { title: "Consult", body: "Video, audio or chat — whichever your connection supports at that moment." },
      { title: "Get your next steps", body: "A summary, a prescription where appropriate, and a follow-up if you need one." },
    ],
    features: [
      { title: "No waiting room", body: "Most Docura Now consultations start within minutes of payment." },
      { title: "Works on a weak connection", body: "If video struggles, the consultation steps down to audio and then chat rather than dropping." },
      { title: "It still counts", body: "A one-off consultation is added to your health record, so it is there next time." },
    ],
    note: "Docura Now is not an emergency service. If someone is in immediate danger, contact local emergency services.",
    cta: { title: "Need care today?", body: "Start a consultation with an available verified doctor.", label: "Get care now", page: "role-select" },
  },
  crossborder: {
    eyebrow: "Cross-border care",
    title: "Your doctor stays with you when you cross a border.",
    intro: "Docura keeps the relationship intact between Nigeria and the United Kingdom, while respecting where each doctor is licensed to prescribe.",
    points: ["Your personal doctor continues to know your care.", "A locally licensed doctor handles prescribing.", "One health history across both countries."],
    steps: [
      { title: "Tell Docura where you are", body: "Update your location — through Travel Mode for a trip, or your profile for a move." },
      { title: "Your personal doctor continues", body: "They keep leading your care: reviewing your history, adjusting your plan and answering questions." },
      { title: "A prescribing doctor joins", body: "Where your personal doctor is not licensed to prescribe, a locally registered doctor joins your care team for that purpose." },
      { title: "The two coordinate", body: "Both work from the same record, so nothing is repeated and nothing is lost." },
    ],
    features: [
      { title: "Personal Doctor", body: "The doctor who knows your history and leads your care, wherever you happen to be." },
      { title: "Prescribing Doctor", body: "Licensed with the regulator in the country you are in — MDCN in Nigeria, GMC in the UK — and responsible for prescriptions issued there." },
      { title: "Care status", body: "You always see which country your care is active in and who can prescribe for you right now." },
      { title: "Shared health history", body: "One record, read by both doctors, so care does not restart when you land." },
      { title: "For students and the diaspora", body: "Built for people whose lives already run across two countries." },
      { title: "Coordinated handovers", body: "When you return, your personal doctor picks up with the full picture of what happened while you were away." },
    ],
    faqs: [
      { q: "Can my Nigerian doctor prescribe for me in the UK?", a: "No. Prescribing is governed by the regulator in the country you are in. Your personal doctor keeps leading your care, and a locally licensed prescribing doctor issues the prescription." },
      { q: "Do I pay twice?", a: "Your care relationship fee stays with your personal doctor. Prescribing consultations are charged separately and shown before you confirm." },
      { q: "Which countries are supported?", a: "Nigeria and the United Kingdom today. Additional countries follow as licensing partnerships are established." },
    ],
    note: "Docura does not enable prescribing outside the country where a doctor holds a current licence.",
    cta: { title: "Care that follows you.", body: "Start with a personal doctor who can continue wherever you go.", label: "Explore Docura Care", page: "public-care" },
  },
  "health-record": {
    eyebrow: "Health record",
    title: "One organised health history, not scattered paperwork.",
    intro: "Every consultation, prescription, document and care plan in one place — arranged as a story rather than a filing cabinet.",
    points: ["Everything in one timeline.", "Written in language you can read.", "Yours to share or keep private."],
    features: [
      { title: "Health timeline", body: "Consultations, results, prescriptions and plan changes in the order they happened." },
      { title: "Consultation summaries", body: "What was discussed, what was decided and what happens next — after every consultation." },
      { title: "Prescriptions", body: "Current, used and expired, with dosage and instructions you can check any time." },
      { title: "Medications", body: "What you take, why you take it, reminders and how you are doing with them." },
      { title: "Documents", body: "Lab results, imaging and reports, attached to the consultation they belong to." },
      { title: "Conditions and care plans", body: "Active conditions with the plan your doctor set, and the progress against it." },
    ],
    cta: { title: "Start building your health history.", body: "Your record begins with your first consultation.", label: "Get started", page: "role-select" },
  },
  "health-passport": {
    eyebrow: "Health Passport",
    title: "A portable summary any clinician can read in seconds.",
    intro: "The essentials of your health, ready to hand over — and to take back.",
    points: ["The information that matters first.", "Shared on your terms.", "Expires when you say so."],
    features: [
      { title: "What it holds", body: "Identity, blood group, allergies, active conditions, current medicines and your care team." },
      { title: "Share by link or QR", body: "Hand a clinician a link or let them scan a code. No account, no app, no delay." },
      { title: "Scoped sharing", body: "Choose which sections travel. Identity and safety information are always included; the rest is your call." },
      { title: "Time-limited by default", body: "Every share expires — 24 hours, 7 days or 30 days — and can be revoked before then." },
      { title: "Download as PDF", body: "Keep an offline copy for travel, insurance or a clinic that cannot open a link." },
      { title: "Ownership stays with you", body: "Sharing is not transferring. You remain the owner of the record at all times." },
    ],
    cta: { title: "Carry your health with you.", body: "Create your Health Passport from your Docura account.", label: "Get started", page: "role-select" },
  },
  "care-team": {
    eyebrow: "Care team",
    title: "The people looking after you, in one place.",
    intro: "Docura organises everyone involved in your care around you — and shows you exactly what each of them can see.",
    points: ["Know who is on your team.", "Know what each can access.", "Coordinate without repeating yourself."],
    features: [
      { title: "Personal Doctor", body: "Leads your care and knows your history. The constant as everything else changes." },
      { title: "Prescribing Doctor", body: "Licensed where you are, responsible for prescriptions issued in that country." },
      { title: "Specialists", body: "Brought in by referral for a specific question, with the context they need and nothing more." },
      { title: "Coordinators", body: "A family member or carer you delegate to, with scoped and revocable access." },
      { title: "Hospital and diagnostic partners", body: "Receive the referral and the summary you agreed to share — never your private conversations." },
      { title: "Pharmacies", body: "Verified dispensing partners who receive the prescription, not your medical history." },
    ],
    cta: { title: "Build a care team around you.", body: "Start with a personal doctor and grow from there.", label: "Find a doctor", page: "role-select" },
  },
  proxy: {
    eyebrow: "Docura Proxy",
    title: "Healthcare coordination for people who care for others.",
    intro: "Look after a parent, a child or someone who needs support — with permission that is explicit, scoped and reversible.",
    points: ["Consent given deliberately.", "Access scoped to what is needed.", "Withdrawn the moment it should be."],
    steps: [
      { title: "The patient invites you", body: "Coordination always starts with the person whose record it is. Nothing is shared before they accept." },
      { title: "They choose what you see", body: "Each scope — medicines, appointments, documents, payments — is granted individually." },
      { title: "You coordinate care", body: "Book consultations, keep track of medicines and message the care team within what was granted." },
      { title: "Access expires or is withdrawn", body: "Every delegation has an end date, and the patient can revoke it at any moment without explaining why." },
    ],
    features: [
      { title: "Delegation, not ownership", body: "A proxy coordinates care. The patient remains the owner of their health record — always." },
      { title: "Scoped permissions", body: "Sensitive scopes such as the full clinical record require an explicit, separate grant." },
      { title: "Care timeline", body: "See consultation summaries and upcoming appointments for the person you support." },
      { title: "Coordination messaging", body: "Talk to the care team about scheduling and practicalities, visibly to the patient." },
      { title: "Emergency information", body: "Blood group, allergies and contacts to hand when minutes matter — where the patient has shared them." },
      { title: "A written consent record", body: "What was shared, from when, until when. Auditable by both sides." },
    ],
    faqs: [
      { q: "Can a proxy see everything?", a: "No. A proxy sees only the scopes the patient granted. Sensitive scopes such as the full medical record must be granted explicitly and can be withdrawn at any time." },
      { q: "Can I coordinate care for more than one person?", a: "Yes. Each relationship is separate, with its own consent record and permissions." },
      { q: "Does the patient see what I do?", a: "Yes. Coordination messages and actions are visible to the patient." },
    ],
    cta: { title: "Caring for someone else?", body: "Set up coordination with consent at the centre.", label: "Get started", page: "role-select" },
  },
  intelligence: {
    eyebrow: "Health intelligence",
    title: "Intelligence that helps people understand care — not replace clinicians.",
    intro: "Docura uses AI to organise, summarise and translate. Every clinical decision remains with a licensed doctor.",
    points: ["Assists patients in understanding.", "Assists doctors with paperwork.", "Never decides clinical care."],
    features: [
      { title: "AI receptionist", body: "Captures why you are seeking care and routes you to the right kind of consultation." },
      { title: "Consultation summaries", body: "Plain-language summaries of what was discussed, for you to read after the consultation." },
      { title: "SOAP note suggestions", body: "Drafts a structured note for the doctor to review, edit and take responsibility for." },
      { title: "Translation", body: "Helps patients and doctors communicate across languages, with the original always preserved." },
      { title: "Chronic condition monitoring", body: "Spots trends in readings and adherence and flags them to your doctor — not to you as a diagnosis." },
      { title: "Safety support", body: "Checks for interactions and missing information, and prompts a human to look." },
    ],
    note: "Docura's intelligence layer does not diagnose, prescribe or make clinical decisions. Suggestions are reviewed by the responsible clinician before they affect your care.",
    cta: { title: "Care you can understand.", body: "See how Docura organises your health information.", label: "Explore the health record", page: "public-health-record" },
  },
  doctors: {
    eyebrow: "For doctors",
    title: "Build care relationships that last.",
    intro: "Docura gives doctors the tools to provide thoughtful, continuous care across time and borders.",
    points: ["Meet patients looking for continuity.", "One workspace for the whole practice.", "Get paid reliably."],
    steps: [
      { title: "Apply", body: "Register with your licence details and practising credentials." },
      { title: "Get verified", body: "Docura confirms your identity and licence with your regulator before you see patients." },
      { title: "Set your availability and pricing", body: "Decide when you work, what you charge and how many care relationships you take on." },
      { title: "Start caring", body: "Consult, prescribe, plan and follow up — with everything in one record." },
    ],
    features: [
      { title: "Patients who want continuity", body: "Docura Care patients choose a personal doctor. Your practice compounds instead of resetting." },
      { title: "One clinical workspace", body: "Consultations, messages, prescriptions, care plans and follow-ups in a single place." },
      { title: "Care plans and follow-ups", body: "Structure chronic care and see who is due, overdue or drifting." },
      { title: "Referrals", body: "Refer to colleagues and pharmacies with a letter and the summary the patient agreed to share." },
      { title: "Practice analytics", body: "Consultation volume, response times, retention and earnings — your data, shown plainly." },
      { title: "Earnings and payouts", body: "Transparent fees, tracked earnings and payouts in your local currency." },
    ],
    faqs: [
      { q: "What does verification involve?", a: "Identity confirmation and a licence check with your regulator (MDCN in Nigeria, GMC in the UK), plus review by the Docura medical board." },
      { q: "Can I practise across borders?", a: "You can care for patients anywhere, but you may only prescribe where you hold a current licence. Docura pairs you with a locally licensed prescribing doctor when needed." },
      { q: "How is Docura paid?", a: "A platform fee is deducted from consultation and subscription revenue. Fees are shown in your earnings breakdown before payout." },
    ],
    cta: { title: "Join Docura as a doctor.", body: "Verification usually completes within a few working days.", label: "Join Docura as a Doctor", page: "doctor-signup" },
  },
  hospitals: {
    eyebrow: "Hospitals & organisations",
    title: "Partner with Docura to extend care beyond your walls.",
    intro: "Referral pathways, discharge follow-up and employee healthcare — coordinated, measurable and privacy-respecting.",
    points: ["Extend care after discharge.", "Receive structured referrals.", "Measure outcomes, not just visits."],
    features: [
      { title: "Referral pathways", body: "Receive referrals with a clinical letter and the health summary the patient consented to share." },
      { title: "Discharge follow-up", body: "Patients leave with a Docura doctor following up, reducing avoidable readmission." },
      { title: "Employee health programmes", body: "Annual checks, chronic condition support and mental wellbeing for your workforce." },
      { title: "Utilisation reporting", body: "Enrolment, participation and programme outcomes at an aggregate level." },
      { title: "Clear data boundaries", body: "Partners receive referrals and shared summaries. Doctor-patient conversations are never shared." },
      { title: "Billing built for organisations", body: "One invoice, member-level eligibility and payment controls." },
    ],
    note: "Organisations see aggregate reporting and the specific artefacts a patient has consented to share — never an employee's clinical record.",
    cta: { title: "Partner with Docura.", body: "Tell us about your organisation and we will get in touch.", label: "Partner with Docura", page: "public-contact" },
  },
  referrals: {
    eyebrow: "Referrals & discovery",
    title: "Finding the right doctor should not be a black box.",
    intro: "Docura shows why a doctor is suggested, and keeps referrals transparent to the patient they are about.",
    points: ["Ranking you can inspect.", "Fair exposure for new doctors.", "Referrals the patient can see."],
    features: [
      { title: "Discovery Score, explained", body: "Responsiveness, continuity, patient ratings and availability — each shown alongside the doctor, not hidden in a ranking." },
      { title: "Rotation for fairness", body: "Newly verified doctors receive exposure so discovery does not simply entrench whoever arrived first." },
      { title: "Matched on what matters", body: "Specialty, language, country and prescribing rights — filters that reflect real clinical constraints." },
      { title: "Doctor referrals", body: "A colleague receives your doctor's letter and the summary you agreed to share." },
      { title: "Pharmacy referrals", body: "Prescriptions routed to verified dispensing partners near you." },
      { title: "Visible to the patient", body: "Every referral appears in your record, including what information travelled with it." },
    ],
    cta: { title: "See how doctors are matched to you.", body: "Browse verified doctors and the reasons behind each suggestion.", label: "Find a doctor", page: "role-select" },
  },
  tv: {
    eyebrow: "Docura TV",
    title: "Health education from people who are actually qualified.",
    intro: "Short, clear explainers from verified healthcare professionals — licence-checked before they can publish.",
    points: ["Verified creators only.", "Reviewed against a clinical content policy.", "Free to watch."],
    features: [
      { title: "Verified healthcare creators", body: "Every creator holds a current licence with a recognised regulator, confirmed by Docura." },
      { title: "Short and specific", body: "Two to four minute explainers on the questions people actually ask." },
      { title: "Topics that reflect real life", body: "Diabetes, blood pressure, women's health, mental wellbeing, skin and children's health." },
      { title: "Moderated", body: "Content is reviewed by the Docura medical board and can be reported by anyone watching." },
      { title: "Save for later", body: "Keep videos to revisit, or to show someone you care for." },
      { title: "From watching to care", body: "When a video raises a question about you, start a consultation from the same place." },
    ],
    note: "Docura TV is general health education. It cannot replace a consultation about your own health.",
    cta: { title: "Explore Docura TV.", body: "Browse topics and verified creators. No account needed.", label: "Explore Docura TV", page: "tv-home" },
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Clear prices, shown before you commit.",
    intro: "You always see the cost of a consultation or a care relationship before you pay. Nothing is charged silently.",
    points: ["Pay per consultation, or monthly for care.", "Prices set by each doctor.", "Cancel a care relationship at any time."],
    features: [
      { title: "Docura Now", body: "A one-off consultation, priced by the doctor. Typical range ₦4,500–₦8,000 in Nigeria or £20–£30 in the UK." },
      { title: "Docura Care", body: "A monthly care relationship including messaging, consultations and care plan reviews. Typically ₦12,000–₦20,000 or £45–£60." },
      { title: "Cross-border prescribing", body: "Where a locally licensed prescribing doctor is required, their consultation is charged separately and shown first." },
      { title: "Medicines", body: "Dispensed medicines are paid at the pharmacy and are not part of your Docura fee." },
      { title: "Organisations", body: "Enterprise programmes are billed per enrolled member, invoiced monthly." },
      { title: "Refunds", body: "If a consultation does not take place, you can raise it through support and request a refund." },
    ],
    faqs: [
      { q: "Are there hidden fees?", a: "No. The price of a consultation or subscription is shown before payment, and receipts appear in your payments history." },
      { q: "Can I cancel Docura Care?", a: "Yes, at any time. Your care relationship runs to the end of the paid month and your record stays with you." },
      { q: "What currencies are supported?", a: "Nigerian Naira and Pounds Sterling today, matching the countries Docura currently operates in." },
    ],
    cta: { title: "See prices for real doctors.", body: "Every doctor's fees appear on their profile.", label: "Browse doctors", page: "role-select" },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions people ask before they start.",
    intro: "If your question is not here, our support team will answer it.",
    points: ["Straight answers about care.", "Clear about what we do not do.", "Support when you need a person."],
    features: [
      { title: "Still stuck?", body: "Open a support ticket from your account and a person from the Docura team will pick it up." },
      { title: "Clinical questions", body: "Anything about your own health belongs in a consultation with your doctor, not with support." },
      { title: "Urgent situations", body: "Docura is not an emergency service. Contact local emergency services if someone is in danger." },
    ],
    faqs: [
      { q: "What is Docura?", a: "A healthcare platform where you build a relationship with a verified doctor, keep one organised health record, and continue that care across countries." },
      { q: "How is Docura Now different from Docura Care?", a: "Docura Now is one consultation with an available doctor. Docura Care is an ongoing relationship with a personal doctor who knows your history." },
      { q: "How much does it cost?", a: "Doctors set their own prices. Consultations typically run ₦4,500–₦8,000 or £20–£30; monthly care relationships ₦12,000–₦20,000 or £45–£60." },
      { q: "Are Docura doctors verified?", a: "Yes. Identity and licence are confirmed with the doctor's regulator — MDCN in Nigeria, GMC in the UK — before they can see patients." },
      { q: "Can I get a prescription?", a: "Where clinically appropriate, yes. Prescriptions are issued by a doctor licensed in the country you are in." },
      { q: "What happens when I travel?", a: "Your personal doctor continues to lead your care, and a locally licensed prescribing doctor joins your care team where prescriptions are needed." },
      { q: "Who owns my health record?", a: "You do. Doctors see what is relevant to your care, a proxy sees only what you delegate, and you can revoke sharing at any time." },
      { q: "Can someone manage my care for me?", a: "Yes, through Docura Proxy. You choose exactly what they can see and for how long, and can withdraw it at any moment." },
      { q: "Does Docura use AI?", a: "Yes, to summarise, organise and translate. It does not diagnose or prescribe — a licensed doctor is responsible for every clinical decision." },
      { q: "How do payments work?", a: "You pay per consultation or monthly for a care relationship. Receipts appear in your payments history and refunds can be requested through support." },
      { q: "How do doctors get paid?", a: "Earnings accumulate from consultations and subscriptions, less the platform fee, and are paid out in local currency." },
      { q: "Can hospitals work with Docura?", a: "Yes — for referrals, discharge follow-up and employee health programmes. Partners never receive doctor-patient conversations." },
      { q: "Is my information private?", a: "Access is limited to the people involved in your care and the scopes you grant. Support staff do not have access to clinical records." },
      { q: "What if something goes wrong?", a: "Open a support ticket. Disputes about a consultation or payment are reviewed by the Docura operations and trust teams." },
    ],
    cta: { title: "Ready to start?", body: "Choose how you would like to use Docura.", label: "Get started", page: "role-select" },
  },
  about: {
    eyebrow: "About Docura",
    title: "Healthcare designed around people.",
    intro: "We are building a healthcare home where good care can continue, wherever life takes you.",
    points: ["Continuity over disconnected appointments.", "Clarity over confusing health information.", "Trust between patients and verified doctors."],
    features: [
      { title: "Why we exist", body: "Care in Nigeria and across the diaspora is fragmented. People repeat their history to strangers and lose the thread of their own health." },
      { title: "What we believe", body: "A relationship with one doctor who knows you is worth more than fast access to a doctor who does not." },
      { title: "How we build", body: "Patiently, with safety and trust first. We would rather ship less and be relied upon." },
    ],
    cta: { title: "Join us.", body: "Start with the care you need today.", label: "Get started", page: "role-select" },
  },
  careers: {
    eyebrow: "Careers",
    title: "Build healthcare infrastructure that people rely on.",
    intro: "We are a small team building carefully in a domain where being wrong has consequences.",
    points: ["Clinical safety is everyone's job.", "We ship deliberately.", "Nigeria and the UK, remote-friendly."],
    features: [
      { title: "Engineering", body: "Frontend, backend and infrastructure engineers who care about the people on the other side of the screen." },
      { title: "Clinical", body: "Doctors and clinical safety officers shaping how care actually works on the platform." },
      { title: "Operations & support", body: "Verification, trust and support roles that keep the platform honest." },
    ],
    cta: { title: "Interested?", body: "Send us a note about what you would like to work on.", label: "Contact us", page: "public-contact" },
  },
  contact: {
    eyebrow: "Contact",
    title: "We are here to help.",
    intro: "Have a question about care, your account, or working with Docura? Our team is ready to listen.",
    points: ["Patient support: care@docura.health", "Doctor support: doctors@docura.health", "Partnerships: partners@docura.health"],
    features: [
      { title: "Patients", body: "For help with a consultation, your record or your account, contact care@docura.health or open a ticket in the app." },
      { title: "Doctors", body: "Onboarding, verification and practice questions go to doctors@docura.health." },
      { title: "Organisations", body: "Hospitals, clinics and employers can reach the partnerships team at partners@docura.health." },
    ],
    note: "Docura is not an emergency service. If someone is in immediate danger, contact local emergency services.",
    cta: { title: "Prefer to get started?", body: "Create an account and reach support from inside Docura.", label: "Get started", page: "role-select" },
  },
  help: {
    eyebrow: "Help centre",
    title: "Find your way around Docura.",
    intro: "Straightforward answers about consultations, records, prescriptions and your account.",
    points: ["Your health information stays private.", "Your care history is always available.", "Support can help when you are stuck."],
    features: [
      { title: "Getting started", body: "Create an account, choose how you want to use Docura, and complete a short onboarding." },
      { title: "During a consultation", body: "Video, audio or chat — and a summary in your record afterwards." },
      { title: "Your record", body: "Consultations, prescriptions, medicines, documents and care plans, all in your dashboard." },
      { title: "Payments", body: "Receipts, refunds and subscription management from the payments page." },
      { title: "Sharing and access", body: "Health Passport, sharing links and proxy permissions — all revocable." },
      { title: "Talking to a person", body: "Open a support ticket from your account for anything an article does not answer." },
    ],
    cta: { title: "Need a person?", body: "Open a support ticket from inside your account.", label: "Get started", page: "role-select" },
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Your health information belongs to you.",
    intro: "Docura is built so that access to your information is deliberate, scoped and visible to you.",
    points: ["We collect only what care requires.", "Access is limited to your care.", "You can revoke sharing at any time."],
    features: [
      { title: "What we collect", body: "Account details, the health information you or your doctor add, and records of consultations and payments." },
      { title: "Who can see it", body: "Doctors involved in your care see what is relevant to it. A proxy sees only delegated scopes. Support staff do not see clinical records." },
      { title: "Sharing is scoped", body: "Health Passport links and referrals carry only what you agreed, and expire." },
      { title: "Partners", body: "Hospitals and pharmacies receive specific artefacts — never doctor-patient conversations." },
      { title: "AI processing", body: "Summarisation and translation operate on your record to help you and your clinician. They do not make clinical decisions." },
      { title: "Your controls", body: "Review sharing, revoke access and export your record from your account." },
    ],
    note: "This page explains our approach in plain language. It sits alongside, and does not replace, our full privacy policy and applicable data protection law.",
    cta: { title: "Questions about your data?", body: "Contact our team and we will explain.", label: "Contact us", page: "public-contact" },
  },
  terms: {
    eyebrow: "Terms",
    title: "Clear expectations for better care.",
    intro: "Our terms explain how Docura works and what patients, doctors and partners can expect.",
    points: ["Docura connects patients with healthcare professionals.", "Doctors remain responsible for clinical decisions.", "Use of Docura carries responsibilities on both sides."],
    features: [
      { title: "What Docura is", body: "A platform that connects patients with licensed healthcare professionals and organises the care that follows." },
      { title: "What Docura is not", body: "Docura does not practise medicine and is not an emergency service." },
      { title: "Clinical responsibility", body: "Clinical decisions, including prescribing, rest with the appropriately licensed healthcare professional." },
      { title: "Prescribing limits", body: "Doctors may only prescribe where they hold a current licence. Docura enforces this in the product." },
      { title: "Payments", body: "Prices are shown before payment. Refunds and disputes are handled through support." },
      { title: "Acceptable use", body: "Accounts are personal, information provided should be accurate, and misuse may result in suspension." },
    ],
    cta: { title: "Still have questions?", body: "Our team can walk you through anything here.", label: "Contact us", page: "public-contact" },
  },
  "clinical-safety": {
    eyebrow: "Clinical safety",
    title: "How Docura keeps care safe.",
    intro: "Safety is a set of specific controls, not a slogan. Here is what is actually in place.",
    points: ["Verified clinicians only.", "Prescribing bound to licence.", "Human accountability for every decision."],
    features: [
      { title: "Doctor verification", body: "Identity and licence confirmed with the regulator before a doctor sees any patient, with periodic re-checks." },
      { title: "Prescribing controls", body: "The platform prevents prescribing outside the country where a doctor holds a current licence." },
      { title: "Medical board review", body: "An internal clinical governance role reviews prescribing patterns, verification decisions and published content." },
      { title: "AI is assistive only", body: "Summaries and note drafts are reviewed and accepted by the responsible clinician before they enter the record." },
      { title: "Reporting", body: "Patients can report content, raise a dispute or contact the safety team directly." },
      { title: "Audit trail", body: "Administrative and clinical governance actions are logged and reviewable." },
    ],
    note: "Docura is not an emergency service and does not provide urgent or in-person care.",
    cta: { title: "Read how we handle your data.", body: "Privacy and safety work together.", label: "Read the privacy approach", page: "public-privacy" },
  },
  security: {
    eyebrow: "Security",
    title: "Protection built into every step.",
    intro: "We use considered controls to protect the information entrusted to Docura.",
    points: ["Authenticated access to every account.", "Encrypted in transit and at rest.", "Reviewed as the platform grows."],
    features: [
      { title: "Account security", body: "Authentication on every account, with verification codes for sensitive changes." },
      { title: "Encryption", body: "Health information is encrypted in transit and at rest." },
      { title: "Least privilege", body: "Internal roles — operations, finance, support, medical board — see only what their remit requires." },
      { title: "Audit logging", body: "Administrative actions are recorded so they can be reviewed." },
      { title: "Ongoing review", body: "Security controls are reviewed as the platform and its risks change." },
      { title: "Reporting an issue", body: "Security concerns can be reported to security@docura.health and are triaged promptly." },
    ],
    note: "No platform can promise absolute security. We describe the controls we operate rather than making blanket guarantees.",
    cta: { title: "Have a security question?", body: "Our team is happy to go into detail.", label: "Contact us", page: "public-contact" },
  },
};

// ─── Site navigation ──────────────────────────────────────────────────────────
const NAV = [
  { label: "How it works", page: "public-how-it-works" },
  { label: "Docura Care", page: "public-care" },
  { label: "Docura Now", page: "public-now" },
  { label: "Global care", page: "public-crossborder" },
  { label: "Docura TV", page: "tv-home" },
  { label: "For Doctors", page: "public-doctors" },
];

export const FOOTER_COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Product",
    links: [
      ["Docura Now", "public-now"],
      ["Docura Care", "public-care"],
      ["Health Record", "public-health-record"],
      ["Health Passport", "public-health-passport"],
      ["Care Team", "public-care-team"],
      ["Docura Proxy", "public-proxy"],
      ["Global care", "public-crossborder"],
      ["Health intelligence", "public-intelligence"],
      ["Docura TV", "tv-home"],
      ["Pricing", "public-pricing"],
    ],
  },
  {
    title: "Professionals",
    links: [
      ["For Doctors", "public-doctors"],
      ["Join as a Doctor", "doctor-signup"],
      ["Doctor login", "doctor-login"],
      ["For Hospitals", "public-hospitals"],
      ["Referrals & discovery", "public-referrals"],
      ["Partner with Docura", "public-contact"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "public-about"],
      ["Careers", "public-careers"],
      ["Contact", "public-contact"],
      ["How it works", "public-how-it-works"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Help centre", "public-help"],
      ["FAQs", "public-faq"],
      ["Support", "public-help"],
      ["Admin login", "admin-login"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "public-privacy"],
      ["Terms", "public-terms"],
      ["Security", "public-security"],
      ["Clinical safety", "public-clinical-safety"],
    ],
  },
];

export function SiteFooter() {
  const { navigate } = useApp();
  return (
    <footer style={{ backgroundColor: C.navy }} className="px-5 sm:px-6 pt-14 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <button onClick={() => navigate("landing")} className="flex items-center gap-2">
              <img src={logo} alt="Docura" width={34} height={34} className="object-contain" />
              <span className="font-bold text-xl" style={{ color: "white", fontFamily: "var(--font-display)" }}>Docura</span>
            </button>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 240 }}>
              Your healthcare home.<br />One relationship. One health history. Wherever life takes you.
            </p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>{column.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {column.links.map(([label, target]) => (
                  <li key={`${column.title}-${label}`}>
                    <button onClick={() => navigate(target)} className="text-sm text-left hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.56)" }}>{label}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>© 2025 Docura Health Ltd. Docura is not an emergency service.</p>
          <button onClick={() => navigate("landing")} className="text-xs hover:text-white" style={{ color: "rgba(255,255,255,0.3)" }}>Back to home</button>
        </div>
      </div>
    </footer>
  );
}

export function SiteHeader() {
  const { navigate } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: C.border, backgroundColor: "rgba(250,250,248,0.96)", backdropFilter: "blur(10px)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 h-[68px] flex items-center justify-between gap-6">
        <button onClick={() => navigate("landing")} aria-label="Return to Docura home" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Docura" width={32} height={32} className="object-contain" />
          <span className="font-bold text-xl" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>Docura</span>
        </button>
        <nav className="hidden lg:flex items-center gap-6">
          {NAV.map((item) => (
            <button key={item.page} onClick={() => navigate(item.page)} className="text-sm font-medium hover:opacity-60" style={{ color: C.navy }}>{item.label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => navigate("login")} className="hidden sm:block text-sm font-medium hover:opacity-60" style={{ color: C.navy }}>Log in</button>
          <button onClick={() => navigate("role-select")} className="px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold" style={{ backgroundColor: C.navy, color: "white" }}>Get started</button>
          <button aria-label="Open menu" onClick={() => setOpen(!open)} className="lg:hidden w-9 h-9 flex items-center justify-center" style={{ color: C.navy }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={open ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t px-5 py-4 flex flex-col gap-3" style={{ borderColor: C.border, backgroundColor: C.warm }}>
          {NAV.map((item) => (
            <button key={item.page} onClick={() => { navigate(item.page); setOpen(false); }} className="text-sm text-left font-medium" style={{ color: C.navy }}>{item.label}</button>
          ))}
          <button onClick={() => { navigate("public-faq"); setOpen(false); }} className="text-sm text-left font-medium" style={{ color: C.navy }}>FAQ</button>
          <button onClick={() => { navigate("login"); setOpen(false); }} className="text-sm text-left font-medium" style={{ color: C.amber }}>Log in</button>
        </div>
      )}
    </header>
  );
}

// ─── Page template ────────────────────────────────────────────────────────────
export default function PublicPage({ page }: { page: PublicPageKey }) {
  const { navigate } = useApp();
  const content = PUBLIC_PAGES[page];
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.warm, fontFamily: "var(--font-body)" }}>
      <SiteHeader />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ backgroundColor: C.navy }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-5" style={{ color: C.amber }}>{content.eyebrow}</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.08] mb-5" style={{ color: C.amber, fontFamily: "var(--font-display)" }}>{content.title}</h1>
              <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 620 }}>{content.intro}</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate(content.cta.page)} className="px-6 sm:px-7 py-3.5 rounded-full text-sm font-semibold" style={{ backgroundColor: C.amber, color: "white" }}>{content.cta.label}</button>
                <button onClick={() => navigate("landing")} className="px-6 sm:px-7 py-3.5 rounded-full text-sm font-semibold border hover:bg-white/10" style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>Explore Docura</button>
              </div>
            </div>
            <div className="rounded-3xl p-6 sm:p-8" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.48)" }}>What this means</p>
              <div className="flex flex-col gap-5">
                {content.points.map((point, index) => (
                  <div key={point} className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: C.amber, color: C.navy }}>0{index + 1}</span>
                    <p className="text-sm leading-relaxed pt-1.5" style={{ color: "rgba(255,255,255,0.82)" }}>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Steps ────────────────────────────────────────────────────── */}
        {content.steps && (
          <section className="max-w-7xl mx-auto px-5 sm:px-6 py-14 md:py-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-10" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>How it works, step by step</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.steps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border p-6" style={{ backgroundColor: "white", borderColor: C.border }}>
                  <span className="text-3xl font-bold" style={{ color: C.amberLight, fontFamily: "var(--font-display)" }}>0{index + 1}</span>
                  <p className="font-semibold mt-3" style={{ color: C.navy }}>{step.title}</p>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: C.muted }}>{step.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Features ─────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-5 sm:px-6 py-14 md:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.features.map((feature, index) => (
              <article key={feature.title} className="rounded-2xl border p-6 sm:p-7 flex flex-col" style={{ backgroundColor: index % 4 === 1 ? C.amberLight : "white", borderColor: C.border }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: C.amber }}>0{index + 1}</p>
                <h3 className="text-lg font-bold" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>{feature.title}</h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: C.muted }}>{feature.body}</p>
              </article>
            ))}
          </div>
          {content.note && (
            <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{ backgroundColor: "white", border: `1px solid ${C.border}` }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Worth being clear about</p>
              <p className="text-sm leading-relaxed" style={{ color: C.label }}>{content.note}</p>
            </div>
          )}
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        {content.faqs && (
          <section className="max-w-3xl mx-auto px-5 sm:px-6 pb-14 md:pb-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>Common questions</h2>
            <div className="flex flex-col gap-2">
              {content.faqs.map((faq) => (
                <div key={faq.q} className="rounded-2xl border" style={{ backgroundColor: "white", borderColor: C.border }}>
                  <button onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                    <span className="text-sm font-semibold" style={{ color: C.navy }}>{faq.q}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" className="shrink-0" style={{ transform: openFaq === faq.q ? "rotate(180deg)" : "none", transition: "transform 150ms" }}><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  {openFaq === faq.q && <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: C.muted }}>{faq.a}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="px-5 sm:px-6 pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto rounded-3xl px-6 py-10 sm:px-12 sm:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style={{ backgroundColor: "white", border: `1px solid ${C.border}` }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.amber }}>Your healthcare home</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: C.navy, fontFamily: "var(--font-display)" }}>{content.cta.title}</h2>
              <p className="text-sm mt-2" style={{ color: C.muted }}>{content.cta.body}</p>
            </div>
            <button onClick={() => navigate(content.cta.page)} className="px-7 py-3.5 rounded-full text-sm font-semibold shrink-0" style={{ backgroundColor: C.navy, color: "white" }}>{content.cta.label}</button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
