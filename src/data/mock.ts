import type {
  AdminRoleDefinition, AppNotification, CarePlan, CareTeamMember, Consultation, CrossBorderCase, Dispute, Doctor,
  DoctorPatient, FollowUp, HealthShare, HospitalPartner, MedicalDocument, Medication, Message, Patient, Payment,
  Payout, Pharmacy, Prescription, ProxyRelationship, Referral, SupportTicket, TvContent, TvCreator, TvTopic,
  VerificationApplication, NotificationPreference,
} from "@/data/types";

// ─── Doctors ──────────────────────────────────────────────────────────────────
export const DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Amara Osei",
    specialty: "General Practice",
    country: "Nigeria",
    license: "MDCN",
    licenseNum: "MDCN/2018/4421",
    experience: 9,
    patients: 142,
    rating: 4.9,
    reviews: 87,
    languages: ["English", "Yoruba", "Igbo"],
    availability: "online" as const,
    responseTime: "Usually replies within 2 hours",
    monthlyPrice: 15000,
    consultationPrice: 5000,
    currency: "₦",
    bio: "I'm a dedicated general practitioner with 9 years of experience providing compassionate care to patients across Nigeria. My practice focuses on preventive care, chronic disease management, and building long-term relationships with my patients.",
    verified: true,
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    conditions: ["General health", "Diabetes", "Hypertension", "Respiratory"],
  },
  {
    id: "d2",
    name: "Dr. Sarah Adeyemi",
    specialty: "Women's Health",
    country: "United Kingdom",
    license: "GMC",
    licenseNum: "GMC/7834521",
    experience: 12,
    patients: 203,
    rating: 4.8,
    reviews: 124,
    languages: ["English", "Yoruba"],
    availability: "available-today" as const,
    responseTime: "Usually replies within 4 hours",
    monthlyPrice: 45,
    consultationPrice: 20,
    currency: "£",
    bio: "As a women's health specialist based in the UK, I offer expert care for women at every stage of life — from reproductive health to menopause. I have a particular interest in cross-border care for Nigerian women in the diaspora.",
    verified: true,
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    conditions: ["Women's health", "Mental wellbeing", "Reproductive health"],
  },
  {
    id: "d3",
    name: "Dr. Chidi Okonkwo",
    specialty: "Mental Wellbeing",
    country: "Nigeria",
    license: "MDCN",
    licenseNum: "MDCN/2015/2819",
    experience: 14,
    patients: 178,
    rating: 4.7,
    reviews: 96,
    languages: ["English", "Igbo"],
    availability: "away" as const,
    responseTime: "Usually replies within 6 hours",
    monthlyPrice: 20000,
    consultationPrice: 8000,
    currency: "₦",
    bio: "I specialize in mental health and emotional wellbeing with a focus on anxiety, depression, and stress management. My practice integrates evidence-based therapy with compassionate listening.",
    verified: true,
    photo: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&h=400&fit=crop&crop=face",
    conditions: ["Mental wellbeing", "Anxiety", "Depression"],
  },
  {
    id: "d4",
    name: "Dr. Fatima Bello",
    specialty: "Dermatology",
    country: "Nigeria",
    license: "MDCN",
    licenseNum: "MDCN/2019/5503",
    experience: 6,
    patients: 89,
    rating: 4.9,
    reviews: 52,
    languages: ["English", "Hausa"],
    availability: "online" as const,
    responseTime: "Usually replies within 1 hour",
    monthlyPrice: 12000,
    consultationPrice: 4500,
    currency: "₦",
    bio: "Dermatologist specializing in skin conditions common in people of African descent. I provide evidence-based care for acne, eczema, hyperpigmentation, and other dermatological concerns.",
    verified: true,
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    conditions: ["Skin", "Eczema", "Acne"],
  },
  {
    id: "d5",
    name: "Dr. James Okafor",
    specialty: "Cardiology",
    country: "United Kingdom",
    license: "GMC",
    licenseNum: "GMC/6912334",
    experience: 18,
    patients: 267,
    rating: 4.6,
    reviews: 143,
    languages: ["English"],
    availability: "offline" as const,
    responseTime: "Usually replies within 24 hours",
    monthlyPrice: 60,
    consultationPrice: 30,
    currency: "£",
    bio: "Consultant cardiologist with 18 years of experience managing heart disease, hypertension, and cardiovascular risk. Currently serving as a prescribing doctor for cross-border Docura Care patients.",
    verified: true,
    photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    conditions: ["Heart & blood pressure", "Cardiology"],
    isPrescribing: true,
  },
];

// ─── Patient ──────────────────────────────────────────────────────────────────
export const PATIENT: Patient = {
  id: "p1",
  name: "Adaeze Okafor",
  phone: "+234 803 456 7890",
  dob: "1990-06-15",
  country: "Nigeria",
  language: "English",
  bloodGroup: "O+",
  conditions: ["Type 2 Diabetes", "Mild Hypertension"],
  medications: ["Metformin 500mg", "Lisinopril 10mg"],
  allergies: ["Penicillin"],
  personalDoctorId: "d1",
  prescribingDoctorId: "d5",
  photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
};

// ─── Consultations ────────────────────────────────────────────────────────────
export const CONSULTATIONS: Consultation[] = [
  {
    id: "c1",
    type: "care" as const,
    doctorId: "d1",
    date: "2025-08-28",
    status: "completed" as const,
    summary: "Routine diabetes management check. HbA1c improving. Continued current medication.",
    diagnosis: "Type 2 Diabetes — well controlled",
    notes: "Patient showing good compliance with medication. Recommend dietary adjustments.",
    hasPrescription: true,
    prescriptionId: "rx1",
  },
  {
    id: "c2",
    type: "now" as const,
    doctorId: "d4",
    date: "2025-08-10",
    status: "completed" as const,
    summary: "Skin rash assessment. Diagnosed as mild eczema flare.",
    diagnosis: "Mild eczema",
    notes: "Prescribed hydrocortisone cream. Avoid harsh soaps.",
    hasPrescription: true,
    prescriptionId: "rx2",
  },
  {
    id: "c3",
    type: "care" as const,
    doctorId: "d1",
    date: "2025-07-15",
    status: "completed" as const,
    summary: "Monthly check-in. Blood pressure monitoring. All readings within normal range.",
    diagnosis: "Hypertension — stable",
    notes: "Continue Lisinopril. Monthly BP monitoring advised.",
    hasPrescription: false,
  },
];

// ─── Prescriptions ────────────────────────────────────────────────────────────
export const PRESCRIPTIONS: Prescription[] = [
  {
    id: "rx1",
    consultationId: "c1",
    doctorId: "d1",
    doctorName: "Dr. Amara Osei",
    date: "2025-08-28",
    status: "active" as const,
    medication: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    duration: "3 months",
    instructions: "Take with meals. Do not crush or chew tablets. Monitor blood sugar regularly.",
    crossBorder: false,
  },
  {
    id: "rx2",
    consultationId: "c2",
    doctorId: "d4",
    doctorName: "Dr. Fatima Bello",
    date: "2025-08-10",
    status: "used" as const,
    medication: "Hydrocortisone Cream 1%",
    dosage: "Apply thin layer",
    frequency: "Twice daily",
    duration: "2 weeks",
    instructions: "Apply to affected areas only. Avoid eyes and broken skin.",
    crossBorder: false,
  },
  {
    id: "rx3",
    consultationId: "c1",
    doctorId: "d5",
    doctorName: "Dr. James Okafor",
    personalDoctorName: "Dr. Amara Osei",
    date: "2025-07-20",
    status: "expired" as const,
    medication: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    duration: "1 month",
    instructions: "Take in the morning. Monitor blood pressure. Stay hydrated.",
    crossBorder: true,
  },
];

// ─── Messages ─────────────────────────────────────────────────────────────────
export const MESSAGES: Message[] = [
  {
    id: "m1",
    senderId: "p1",
    senderName: "Adaeze Okafor",
    text: "Good morning Dr. Osei. I wanted to let you know my blood sugar readings have been better this week.",
    time: "09:14",
    date: "2025-08-29",
    status: "read" as const,
    isDoctor: false,
  },
  {
    id: "m2",
    senderId: "d1",
    senderName: "Dr. Amara Osei",
    text: "That's great to hear, Adaeze! The Metformin is working well. What are your average morning readings?",
    time: "09:32",
    date: "2025-08-29",
    status: "read" as const,
    isDoctor: true,
  },
  {
    id: "m3",
    senderId: "p1",
    senderName: "Adaeze Okafor",
    text: "Between 95 and 110 mg/dL. Much better than last month.",
    time: "09:45",
    date: "2025-08-29",
    status: "read" as const,
    isDoctor: false,
  },
  {
    id: "m4",
    senderId: "d1",
    senderName: "Dr. Amara Osei",
    text: "Excellent progress! That's right in the target range. Keep up the good work with diet and medication. Let's check in again next week.",
    time: "10:01",
    date: "2025-08-29",
    status: "read" as const,
    isDoctor: true,
  },
  {
    id: "m5",
    senderId: "p1",
    senderName: "Adaeze Okafor",
    text: "Thank you doctor. I have a question — is it okay if I exercise in the evenings?",
    time: "10:15",
    date: "2025-08-29",
    status: "delivered" as const,
    isDoctor: false,
  },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    audience: "patient" as const,
    type: "message" as const,
    title: "Dr. Amara Osei replied",
    body: "Excellent progress! That's right in the target range...",
    time: "10:01",
    date: "2025-08-29",
    read: false,
    page: "patient-chat",
  },
  {
    id: "n2",
    audience: "patient" as const,
    type: "prescription" as const,
    title: "Prescription ready",
    body: "Your prescription for Metformin 500mg is ready to view.",
    time: "09:00",
    date: "2025-08-28",
    read: false,
    page: "patient-prescriptions",
  },
  {
    id: "n3",
    audience: "patient" as const,
    type: "payment" as const,
    title: "Payment confirmed",
    body: "₦15,000 subscription payment to Dr. Amara Osei processed.",
    time: "08:30",
    date: "2025-08-01",
    read: true,
    page: "patient-payments",
  },
  {
    id: "n4",
    audience: "patient" as const,
    type: "system" as const,
    title: "Cross-border care update",
    body: "Dr. James Okafor has been assigned as your prescribing doctor in the UK.",
    time: "14:00",
    date: "2025-07-20",
    read: true,
    page: "patient-dashboard",
  },
];

// ─── Payments ─────────────────────────────────────────────────────────────────
export const PAYMENTS: Payment[] = [
  {
    id: "pay1",
    date: "2025-09-01",
    description: "Docura Care — Monthly subscription",
    doctor: "Dr. Amara Osei",
    amount: 15000,
    currency: "₦",
    status: "paid" as const,
  },
  {
    id: "pay2",
    date: "2025-08-01",
    description: "Docura Care — Monthly subscription",
    doctor: "Dr. Amara Osei",
    amount: 15000,
    currency: "₦",
    status: "paid" as const,
  },
  {
    id: "pay3",
    date: "2025-08-10",
    description: "Docura Now — One-off consultation",
    doctor: "Dr. Fatima Bello",
    amount: 4500,
    currency: "₦",
    status: "paid" as const,
  },
  {
    id: "pay4",
    date: "2025-07-01",
    description: "Docura Care — Monthly subscription",
    doctor: "Dr. Amara Osei",
    amount: 15000,
    currency: "₦",
    status: "paid" as const,
  },
];

// ─── Doctor's patient list ────────────────────────────────────────────────────
export const DOCTOR_PATIENTS: DoctorPatient[] = [
  {
    id: "p1",
    name: "Adaeze Okafor",
    country: "Nigeria",
    careStatus: "active",
    lastConsultation: "2025-08-28",
    nextAction: "Monthly check-in due",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
    type: "care",
    crossBorder: true,
  },
  {
    id: "p2",
    name: "Emeka Nwosu",
    country: "Nigeria",
    careStatus: "active",
    lastConsultation: "2025-08-25",
    nextAction: "Awaiting lab results",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    type: "care",
    crossBorder: false,
  },
  {
    id: "p3",
    name: "Chidinma Eze",
    country: "Nigeria",
    careStatus: "active",
    lastConsultation: "2025-08-20",
    nextAction: "Review blood pressure readings",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    type: "now",
    crossBorder: false,
  },
];

// ─── Admin data ───────────────────────────────────────────────────────────────
export const PENDING_VERIFICATIONS: VerificationApplication[] = [
  {
    id: "v1",
    name: "Dr. Kemi Adeyinka",
    specialty: "Paediatrics",
    country: "Nigeria",
    license: "MDCN/2022/8821",
    submitted: "2025-08-30",
    status: "under-review" as const,
    photo: "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "v2",
    name: "Dr. Tunde Bankole",
    specialty: "General Practice",
    country: "Nigeria",
    license: "MDCN/2021/7203",
    submitted: "2025-08-28",
    status: "documents-submitted" as const,
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "v3",
    name: "Dr. Ngozi Ike",
    specialty: "Obstetrics",
    country: "United Kingdom",
    license: "GMC/8234901",
    submitted: "2025-08-25",
    status: "more-info-required" as const,
    photo: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&h=200&fit=crop&crop=face",
  },
];

export const CROSS_BORDER_CASES: CrossBorderCase[] = [
  {
    id: "cb1",
    patient: "Adaeze Okafor",
    personalDoctor: "Dr. Amara Osei",
    patientCountry: "Nigeria",
    prescribingCountry: "United Kingdom",
    status: "assigned" as const,
    prescribingDoctor: "Dr. James Okafor",
    date: "2025-07-20",
  },
  {
    id: "cb2",
    patient: "Emeka Nwosu",
    personalDoctor: "Dr. Chidi Okonkwo",
    patientCountry: "Nigeria",
    prescribingCountry: "United Kingdom",
    status: "awaiting-assignment" as const,
    date: "2025-08-28",
  },
];

export const ADMIN_PAYOUTS: Payout[] = [
  {
    id: "po1",
    doctor: "Dr. Amara Osei",
    amount: 125000,
    currency: "₦",
    country: "Nigeria",
    requested: "2025-08-31",
    status: "requested" as const,
  },
  {
    id: "po2",
    doctor: "Dr. Sarah Adeyemi",
    amount: 680,
    currency: "£",
    country: "United Kingdom",
    requested: "2025-08-29",
    status: "processing" as const,
  },
  {
    id: "po3",
    doctor: "Dr. Chidi Okonkwo",
    amount: 88000,
    currency: "₦",
    country: "Nigeria",
    requested: "2025-08-25",
    status: "paid" as const,
  },
];

export const ADMIN_DISPUTES: Dispute[] = [
  {
    id: "dis1",
    patient: "Emeka Nwosu",
    doctor: "Dr. Chidi Okonkwo",
    issue: "Consultation not completed",
    date: "2025-08-28",
    status: "open" as const,
    admin: "Unassigned",
  },
  {
    id: "dis2",
    patient: "Chidinma Eze",
    doctor: "Dr. Fatima Bello",
    issue: "Prescription error",
    date: "2025-08-20",
    status: "investigating" as const,
    admin: "Admin A",
  },
];

// ─── Care Plans ───────────────────────────────────────────────────────────────
export const CARE_PLANS: CarePlan[] = [
  {
    id: "cp1",
    title: "Diabetes Management Plan",
    goal: "Maintain HbA1c below 7% and blood pressure within normal range",
    doctorId: "d1",
    doctorName: "Dr. Amara Osei",
    status: "active" as const,
    startDate: "2025-07-01",
    nextReview: "2025-09-18",
    progress: 68,
    recommendations: [
      "Take Metformin 500mg twice daily with meals",
      "Monitor blood sugar every morning before breakfast",
      "Walk 30 minutes at least 5 days a week",
      "Follow a low-glycaemic diet — limit refined sugars",
      "Attend monthly check-in consultations",
    ],
    linkedMedications: ["Metformin 500mg", "Lisinopril 10mg"],
    nextFollowUp: "September 18, 2025",
    lastUpdated: "2025-08-28",
    updates: [
      { date: "2025-08-28", note: "HbA1c improved to 6.8%. Continue current plan.", by: "Dr. Amara Osei" },
      { date: "2025-07-15", note: "Plan initiated. Baseline readings established.", by: "Dr. Amara Osei" },
    ],
  },
  {
    id: "cp2",
    title: "Blood Pressure Monitoring Plan",
    goal: "Keep blood pressure below 130/85 mmHg consistently",
    doctorId: "d1",
    doctorName: "Dr. Amara Osei",
    status: "active" as const,
    startDate: "2025-06-01",
    nextReview: "2025-09-25",
    progress: 82,
    recommendations: [
      "Take Lisinopril 10mg every morning",
      "Record blood pressure readings weekly",
      "Reduce sodium intake",
      "Avoid excessive caffeine",
      "Manage stress through regular relaxation",
    ],
    linkedMedications: ["Lisinopril 10mg"],
    nextFollowUp: "September 25, 2025",
    lastUpdated: "2025-07-15",
    updates: [
      { date: "2025-07-15", note: "BP readings stable at 125/82. Well controlled.", by: "Dr. Amara Osei" },
    ],
  },
];

// ─── Follow-ups ───────────────────────────────────────────────────────────────
export const FOLLOW_UPS: FollowUp[] = [
  {
    id: "fu1",
    doctorId: "d1",
    doctorName: "Dr. Amara Osei",
    doctorPhoto: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    consultationId: "c1",
    reason: "Diabetes management review — check HbA1c response to medication",
    scheduledDate: "2025-09-18",
    status: "upcoming" as const,
    type: "care" as const,
  },
  {
    id: "fu2",
    doctorId: "d1",
    doctorName: "Dr. Amara Osei",
    doctorPhoto: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    consultationId: "c3",
    reason: "Blood pressure monitoring — review monthly readings",
    scheduledDate: "2025-09-25",
    status: "upcoming" as const,
    type: "care" as const,
  },
  {
    id: "fu3",
    doctorId: "d4",
    doctorName: "Dr. Fatima Bello",
    doctorPhoto: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    consultationId: "c2",
    reason: "Eczema follow-up — assess response to hydrocortisone cream",
    scheduledDate: "2025-08-24",
    status: "completed" as const,
    type: "now" as const,
  },
  {
    id: "fu4",
    doctorId: "d1",
    doctorName: "Dr. Amara Osei",
    doctorPhoto: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    consultationId: "c1",
    reason: "Routine check — blood sugar trend review",
    scheduledDate: "2025-07-28",
    status: "missed" as const,
    type: "care" as const,
  },
];

// ─── Medications (detailed) ───────────────────────────────────────────────────
export const MEDICATIONS: Medication[] = [
  {
    id: "med1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: "2025-07-01",
    endDate: null,
    status: "current" as const,
    doctorId: "d1",
    doctorName: "Dr. Amara Osei",
    prescriptionId: "rx1",
    instructions: "Take with meals. Do not crush or chew tablets.",
    purpose: "Blood sugar control for Type 2 Diabetes",
    adherence: 92,
    remindersEnabled: true,
    reminderTimes: ["08:00", "20:00"],
    carePlanId: "cp1",
    lastTaken: "2025-09-06",
    todayTaken: true,
  },
  {
    id: "med2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: "2025-06-01",
    endDate: null,
    status: "current" as const,
    doctorId: "d1",
    doctorName: "Dr. Amara Osei",
    prescriptionId: "rx3",
    instructions: "Take every morning. Stay well hydrated.",
    purpose: "Blood pressure management",
    adherence: 88,
    remindersEnabled: true,
    reminderTimes: ["08:00"],
    carePlanId: "cp2",
    lastTaken: "2025-09-06",
    todayTaken: true,
  },
  {
    id: "med3",
    name: "Hydrocortisone Cream 1%",
    dosage: "Thin layer",
    frequency: "Twice daily",
    startDate: "2025-08-10",
    endDate: "2025-08-24",
    status: "past" as const,
    doctorId: "d4",
    doctorName: "Dr. Fatima Bello",
    prescriptionId: "rx2",
    instructions: "Apply to affected areas only. Avoid eyes and broken skin.",
    purpose: "Eczema treatment",
    adherence: 75,
    remindersEnabled: false,
    reminderTimes: [],
    carePlanId: null,
    lastTaken: "2025-08-24",
    todayTaken: false,
  },
];

// ─── Medical Documents ────────────────────────────────────────────────────────
export const MEDICAL_DOCUMENTS: MedicalDocument[] = [
  {
    id: "doc1",
    type: "Lab Result",
    title: "HbA1c Blood Test",
    date: "2025-08-25",
    doctor: "Dr. Amara Osei",
    consultationId: "c1",
    status: "uploaded" as const,
    size: "128 KB",
    format: "PDF",
    description: "Glycated haemoglobin test. Result: 6.8% (target range achieved).",
  },
  {
    id: "doc2",
    type: "Lab Result",
    title: "Full Blood Count",
    date: "2025-07-15",
    doctor: "Dr. Amara Osei",
    consultationId: "c3",
    status: "uploaded" as const,
    size: "95 KB",
    format: "PDF",
    description: "Routine full blood count. All values within normal range.",
  },
  {
    id: "doc3",
    type: "Medical Report",
    title: "Annual Physical Report",
    date: "2025-06-10",
    doctor: "Dr. Amara Osei",
    consultationId: null,
    status: "uploaded" as const,
    size: "340 KB",
    format: "PDF",
    description: "Comprehensive annual physical examination report.",
  },
  {
    id: "doc4",
    type: "Imaging",
    title: "Chest X-Ray",
    date: "2025-05-20",
    doctor: "External radiologist",
    consultationId: null,
    status: "uploaded" as const,
    size: "1.4 MB",
    format: "DICOM / PDF",
    description: "Routine chest x-ray. No abnormalities detected.",
  },
];

// ─── Health Shares ────────────────────────────────────────────────────────────
export const HEALTH_SHARES: HealthShare[] = [
  {
    id: "hs1",
    sharedWith: "Dr. James Okafor",
    sharedWithRole: "Prescribing Doctor",
    items: ["Conditions", "Medications", "Allergies", "Lab Results"],
    created: "2025-07-20",
    expires: "2025-10-20",
    status: "active" as const,
    link: "https://docura.health/share/hs1-abc",
  },
  {
    id: "hs2",
    sharedWith: "Emergency Department — LUTH",
    sharedWithRole: "Hospital",
    items: ["Conditions", "Allergies", "Medications"],
    created: "2025-08-10",
    expires: "2025-08-17",
    status: "expired" as const,
    link: "https://docura.health/share/hs2-def",
  },
];

// ─── Care Team ────────────────────────────────────────────────────────────────
export const CARE_TEAM: CareTeamMember[] = [
  {
    id: "ct1",
    doctorId: "d1",
    name: "Dr. Amara Osei",
    specialty: "General Practice",
    country: "Nigeria",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    role: "Personal Doctor",
    status: "active" as const,
    since: "2024-07-01",
    consultations: 14,
    availability: "online" as const,
  },
  {
    id: "ct2",
    doctorId: "d5",
    name: "Dr. James Okafor",
    specialty: "Cardiology",
    country: "United Kingdom",
    photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    role: "Prescribing Doctor",
    status: "active" as const,
    since: "2025-07-20",
    consultations: 2,
    availability: "offline" as const,
  },
];

// ─── Care Journey milestones ──────────────────────────────────────────────────
export const CARE_JOURNEY = [
  { id: "cj1", date: "July 2024", title: "Started with Docura", body: "Created your Docura account and completed onboarding.", icon: "star", milestone: true },
  { id: "cj2", date: "July 2024", title: "Found a Personal Doctor", body: "Connected with Dr. Amara Osei as your Personal Doctor.", icon: "doctor", milestone: true },
  { id: "cj3", date: "July 2024", title: "First consultation", body: "Completed your first care consultation with Dr. Amara Osei.", icon: "consultation", milestone: true },
  { id: "cj4", date: "June 2025", title: "Care plan created", body: "Dr. Amara Osei created your Blood Pressure Management care plan.", icon: "plan" },
  { id: "cj5", date: "July 2025", title: "Cross-border care activated", body: "Dr. James Okafor joined your care team as UK prescribing doctor.", icon: "globe", milestone: true },
  { id: "cj6", date: "July 2025", title: "Prescription issued", body: "Lisinopril 10mg prescribed and dispensed through cross-border care.", icon: "prescription" },
  { id: "cj7", date: "July 2025", title: "Diabetes care plan created", body: "Comprehensive diabetes management plan initiated.", icon: "plan" },
  { id: "cj8", date: "August 2025", title: "14 consultations", body: "Milestone: 14 consultations with your care team.", icon: "milestone", milestone: true },
  { id: "cj9", date: "August 2025", title: "HbA1c improved", body: "Your HbA1c reached target range — 6.8%. A significant improvement.", icon: "health" },
  { id: "cj10", date: "September 2025", title: "Current care", body: "Continuing your care journey with Dr. Amara Osei.", icon: "now", milestone: false },
];

// ─── Health Timeline events ───────────────────────────────────────────────────
export const HEALTH_TIMELINE = [
  { id: "ht1", date: "2025-09-06", type: "medication", title: "Medication taken", body: "Metformin 500mg and Lisinopril 10mg taken.", icon: "pill" },
  { id: "ht2", date: "2025-08-28", type: "consultation", title: "Consultation with Dr. Amara Osei", body: "Routine diabetes management check. HbA1c improving. Continued current medication.", icon: "consultation", consultationId: "c1" },
  { id: "ht3", date: "2025-08-25", type: "lab", title: "HbA1c blood test result", body: "Result: 6.8% — within target range. Improvement from last result.", icon: "lab", documentId: "doc1" },
  { id: "ht4", date: "2025-08-10", type: "consultation", title: "Consultation with Dr. Fatima Bello", body: "Skin rash assessment. Mild eczema diagnosed.", icon: "consultation", consultationId: "c2" },
  { id: "ht5", date: "2025-08-10", type: "prescription", title: "Prescription issued", body: "Hydrocortisone Cream 1% prescribed by Dr. Fatima Bello.", icon: "prescription", prescriptionId: "rx2" },
  { id: "ht6", date: "2025-07-20", type: "care", title: "Cross-border care activated", body: "Dr. James Okafor assigned as your prescribing doctor in the UK.", icon: "globe" },
  { id: "ht7", date: "2025-07-15", type: "lab", title: "Full Blood Count", body: "Routine full blood count. All values within normal range.", icon: "lab", documentId: "doc2" },
  { id: "ht8", date: "2025-07-15", type: "consultation", title: "Consultation with Dr. Amara Osei", body: "Monthly check-in. Blood pressure monitoring. All readings within normal range.", icon: "consultation", consultationId: "c3" },
  { id: "ht9", date: "2025-07-01", type: "plan", title: "Care plan started", body: "Diabetes Management Plan initiated by Dr. Amara Osei.", icon: "plan", carePlanId: "cp1" },
  { id: "ht10", date: "2025-06-01", type: "plan", title: "Care plan started", body: "Blood Pressure Monitoring Plan initiated by Dr. Amara Osei.", icon: "plan", carePlanId: "cp2" },
];

// ─── Consultation summaries ───────────────────────────────────────────────────
export const CONSULTATION_SUMMARIES = [
  {
    id: "cs1",
    consultationId: "c1",
    doctorName: "Dr. Amara Osei",
    date: "2025-08-28",
    reason: "Routine diabetes management review",
    discussed: "Blood sugar readings reviewed. Diet and exercise habits discussed. HbA1c result reviewed — significant improvement from last quarter.",
    assessment: "Type 2 Diabetes — well controlled. HbA1c improved to 6.8%, within the target range. Hypertension remains stable.",
    recommendations: [
      "Continue Metformin 500mg twice daily",
      "Continue Lisinopril 10mg daily",
      "Maintain current diet and exercise routine",
      "Monitor blood sugar daily before breakfast",
    ],
    prescription: "rx1",
    nextSteps: "Continue current medication. Next blood sugar reading due before follow-up.",
    followUpId: "fu1",
    followUpDate: "September 18, 2025",
  },
];

// ─── Audit Log ────────────────────────────────────────────────────────────────
export const AUDIT_LOG = [
  { id: "al1", event: "Doctor verification approved", actor: "Admin A", target: "Dr. Amara Osei", date: "2025-08-15", time: "11:32", category: "verification" },
  { id: "al2", event: "Prescribing doctor assigned", actor: "Admin A", target: "Adaeze Okafor → Dr. James Okafor", date: "2025-07-20", time: "14:00", category: "crossborder" },
  { id: "al3", event: "Refund processed", actor: "Admin B", target: "Emeka Nwosu — ₦4,500", date: "2025-08-28", time: "09:15", category: "payment" },
  { id: "al4", event: "Dispute status changed to investigating", actor: "Admin A", target: "Chidinma Eze vs Dr. Fatima Bello", date: "2025-08-20", time: "16:45", category: "dispute" },
  { id: "al5", event: "Doctor verification rejected", actor: "Admin B", target: "Dr. Ngozi Ike — insufficient documents", date: "2025-08-25", time: "10:00", category: "verification" },
  { id: "al6", event: "Payout processed", actor: "Admin A", target: "Dr. Chidi Okonkwo — ₦88,000", date: "2025-08-25", time: "15:20", category: "payment" },
  { id: "al7", event: "Cross-border case created", actor: "System", target: "Emeka Nwosu — awaiting prescribing doctor", date: "2025-08-28", time: "08:00", category: "crossborder" },
  { id: "al8", event: "Doctor verification submitted", actor: "Dr. Tunde Bankole", target: "MDCN/2021/7203 documents uploaded", date: "2025-08-28", time: "10:30", category: "verification" },
];

// ─── Admin prescriptions ──────────────────────────────────────────────────────
export const ADMIN_PRESCRIPTIONS = [
  { id: "rx1", patient: "Adaeze Okafor", doctor: "Dr. Amara Osei", medication: "Metformin 500mg", date: "2025-08-28", status: "active" as const, crossBorder: false },
  { id: "rx2", patient: "Adaeze Okafor", doctor: "Dr. Fatima Bello", medication: "Hydrocortisone Cream 1%", date: "2025-08-10", status: "used" as const, crossBorder: false },
  { id: "rx3", patient: "Adaeze Okafor", doctor: "Dr. James Okafor", medication: "Lisinopril 10mg", date: "2025-07-20", status: "expired" as const, crossBorder: true },
  { id: "rx4", patient: "Emeka Nwosu", doctor: "Dr. Chidi Okonkwo", medication: "Sertraline 50mg", date: "2025-08-25", status: "active" as const, crossBorder: false },
];

// ─── Doctor follow-up list (doctor view) ─────────────────────────────────────
export const DOCTOR_FOLLOW_UPS = [
  { id: "dfu1", patient: "Adaeze Okafor", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face", reason: "Diabetes HbA1c review", date: "2025-09-18", status: "upcoming" as const, urgent: false },
  { id: "dfu2", patient: "Emeka Nwosu", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", reason: "Awaiting lab results review", date: "2025-09-10", status: "upcoming" as const, urgent: true },
  { id: "dfu3", patient: "Chidinma Eze", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", reason: "Blood pressure readings review", date: "2025-08-30", status: "missed" as const, urgent: true },
];

// ─── Doctor care plans ────────────────────────────────────────────────────────
export const DOCTOR_CARE_PLANS = [
  {
    id: "dcp1",
    patient: "Adaeze Okafor",
    patientPhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
    title: "Diabetes Management Plan",
    status: "active" as const,
    progress: 68,
    nextReview: "2025-09-18",
    lastUpdated: "2025-08-28",
  },
  {
    id: "dcp2",
    patient: "Adaeze Okafor",
    patientPhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
    title: "Blood Pressure Monitoring Plan",
    status: "active" as const,
    progress: 82,
    nextReview: "2025-09-25",
    lastUpdated: "2025-07-15",
  },
  {
    id: "dcp3",
    patient: "Emeka Nwosu",
    patientPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    title: "Mental Wellbeing Support Plan",
    status: "active" as const,
    progress: 45,
    nextReview: "2025-09-20",
    lastUpdated: "2025-08-25",
  },
];

// ─── Discovery signals (V2.2) ────────────────────────────────────────────────
// Attached to doctors so the discovery UI can always explain *why* a doctor is
// being suggested instead of presenting an opaque ranking.
export const DISCOVERY_SIGNALS: Record<string, Doctor["discovery"]> = {
  d1: { score: 94, responsiveness: 96, continuity: 92, patientRating: 98, availability: 90, rotationBoost: false, reasons: ["Replies within 2 hours on average", "Long-term care relationships with 142 patients", "Speaks English, Yoruba and Igbo"] },
  d2: { score: 89, responsiveness: 84, continuity: 90, patientRating: 96, availability: 86, rotationBoost: false, reasons: ["Women's health specialist registered with the GMC", "Experienced with Nigeria to UK continuity", "Available today"] },
  d3: { score: 82, responsiveness: 74, continuity: 88, patientRating: 94, availability: 70, rotationBoost: false, reasons: ["14 years in mental wellbeing", "High follow-up completion rate"] },
  d4: { score: 87, responsiveness: 98, continuity: 72, patientRating: 98, availability: 96, rotationBoost: true, reasons: ["Newly verified — shown fairly through rotation", "Fastest average reply time on Docura", "Dermatology for melanin-rich skin"] },
  d5: { score: 80, responsiveness: 62, continuity: 86, patientRating: 92, availability: 52, rotationBoost: false, reasons: ["Licensed to prescribe in the United Kingdom", "Supports cross-border care patients"] },
};

// ─── Docura Proxy (V2.0) ─────────────────────────────────────────────────────
export const PROXY_RELATIONSHIPS: ProxyRelationship[] = [
  {
    id: "px1",
    proxyName: "Ifeoma Okafor",
    proxyRelationship: "Daughter",
    patientId: "p1",
    patientName: "Adaeze Okafor",
    patientPhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
    status: "active",
    consentGivenAt: "2025-06-14",
    expiresAt: "2026-06-14",
    emergencyContact: true,
    permissions: [
      { scope: "view-summary", label: "Health summary", description: "Conditions, allergies and blood group.", granted: true, sensitive: false },
      { scope: "view-medications", label: "Medications", description: "Current medicines, doses and reminders.", granted: true, sensitive: false },
      { scope: "view-consultations", label: "Consultation summaries", description: "Doctor summaries after each consultation.", granted: true, sensitive: false },
      { scope: "book-consultations", label: "Book consultations", description: "Request Docura Now or Care appointments.", granted: true, sensitive: false },
      { scope: "message-care-team", label: "Message the care team", description: "Send non-clinical coordination messages.", granted: true, sensitive: false },
      { scope: "manage-payments", label: "Payments", description: "Pay for consultations and subscriptions.", granted: false, sensitive: false },
      { scope: "view-documents", label: "Medical documents", description: "Lab results, imaging and reports.", granted: false, sensitive: true },
      { scope: "view-full-record", label: "Full medical record", description: "Complete clinical history and doctor notes.", granted: false, sensitive: true },
    ],
  },
  {
    id: "px2",
    proxyName: "Ifeoma Okafor",
    proxyRelationship: "Granddaughter",
    patientId: "p4",
    patientName: "Chief Nnamdi Okafor",
    patientPhoto: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face",
    status: "pending",
    consentGivenAt: "Not yet given",
    expiresAt: "Not set",
    emergencyContact: false,
    permissions: [
      { scope: "view-summary", label: "Health summary", description: "Conditions, allergies and blood group.", granted: false, sensitive: false },
      { scope: "view-medications", label: "Medications", description: "Current medicines, doses and reminders.", granted: false, sensitive: false },
      { scope: "book-consultations", label: "Book consultations", description: "Request Docura Now or Care appointments.", granted: false, sensitive: false },
    ],
  },
];

// ─── Referrals & pharmacies (V2.2) ───────────────────────────────────────────
export const REFERRALS: Referral[] = [
  { id: "ref1", kind: "doctor", patientId: "p1", patientName: "Adaeze Okafor", fromDoctor: "Dr. Amara Osei", toName: "Dr. James Okafor", toDetail: "Cardiology · United Kingdom", reason: "Cardiovascular risk review alongside cross-border prescribing.", date: "2025-08-29", status: "accepted", notes: "Patient consented to share diabetes and blood pressure history only." },
  { id: "ref2", kind: "pharmacy", patientId: "p1", patientName: "Adaeze Okafor", fromDoctor: "Dr. Amara Osei", toName: "HealthPlus Pharmacy, Ikeja", toDetail: "Dispensing · Lagos", reason: "Metformin 500mg — 3 month supply.", date: "2025-08-28", status: "completed" },
  { id: "ref3", kind: "doctor", patientId: "p2", patientName: "Emeka Nwosu", fromDoctor: "Dr. Chidi Okonkwo", toName: "Dr. Sarah Adeyemi", toDetail: "Women's Health · United Kingdom", reason: "Second opinion requested by patient.", date: "2025-09-02", status: "pending" },
];

export const PHARMACIES: Pharmacy[] = [
  { id: "ph1", name: "HealthPlus Pharmacy", city: "Ikeja, Lagos", country: "Nigeria", distance: "2.4 km", dispenses: ["Metformin", "Lisinopril", "Insulin"], verified: true },
  { id: "ph2", name: "MedPlus Pharmacy", city: "Lekki, Lagos", country: "Nigeria", distance: "6.1 km", dispenses: ["General dispensing", "Cold chain"], verified: true },
  { id: "ph3", name: "Boots Pharmacy", city: "Peckham, London", country: "United Kingdom", distance: "1.2 km", dispenses: ["NHS repeat", "Private prescriptions"], verified: true },
];

// ─── Support (V2.3) ──────────────────────────────────────────────────────────
export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "sup1",
    subject: "Payment taken twice for September subscription",
    category: "payments",
    openedBy: "Adaeze Okafor",
    openedByRole: "patient",
    createdAt: "2025-09-02",
    updatedAt: "2025-09-03",
    status: "in-progress",
    priority: "high",
    assignee: "Support · Tola",
    clinicalAccess: false,
    replies: [
      { id: "sr1", author: "Adaeze Okafor", role: "patient", text: "I was charged 15,000 naira twice on 1 September for my Docura Care subscription.", at: "2025-09-02 09:12" },
      { id: "sr2", author: "Support · Tola", role: "support", text: "Thank you for flagging this. I can see two authorisations against your card and have raised a refund for the duplicate.", at: "2025-09-03 11:40" },
    ],
  },
  {
    id: "sup2",
    subject: "Cannot upload a lab result PDF",
    category: "technical",
    openedBy: "Adaeze Okafor",
    openedByRole: "patient",
    createdAt: "2025-08-21",
    updatedAt: "2025-08-22",
    status: "resolved",
    priority: "normal",
    assignee: "Support · Kelechi",
    clinicalAccess: false,
    replies: [
      { id: "sr3", author: "Adaeze Okafor", role: "patient", text: "The upload spins forever when I add my HbA1c result.", at: "2025-08-21 16:02" },
      { id: "sr4", author: "Support · Kelechi", role: "support", text: "This was a file size limit. We have raised the limit to 25MB — please try again.", at: "2025-08-22 10:15" },
    ],
  },
  {
    id: "sup3",
    subject: "Payout not received for August",
    category: "payments",
    openedBy: "Dr. Chidi Okonkwo",
    openedByRole: "doctor",
    createdAt: "2025-09-04",
    updatedAt: "2025-09-04",
    status: "open",
    priority: "high",
    assignee: null,
    clinicalAccess: false,
    replies: [
      { id: "sr5", author: "Dr. Chidi Okonkwo", role: "doctor", text: "My August payout of 88,000 naira is marked paid but has not arrived.", at: "2025-09-04 08:30" },
    ],
  },
];

export const NOTIFICATION_PREFERENCES: NotificationPreference[] = [
  { id: "np1", label: "Messages from your care team", description: "New replies from your doctor or coordinator.", channels: { inApp: true, email: true, sms: false, whatsapp: true } },
  { id: "np2", label: "Prescriptions", description: "When a prescription is issued, changed or expires.", channels: { inApp: true, email: true, sms: true, whatsapp: false } },
  { id: "np3", label: "Follow-ups and appointments", description: "Reminders before a scheduled follow-up.", channels: { inApp: true, email: false, sms: true, whatsapp: true } },
  { id: "np4", label: "Payments and receipts", description: "Payment confirmations, refunds and failures.", channels: { inApp: true, email: true, sms: false, whatsapp: false } },
  { id: "np5", label: "Medication reminders", description: "Daily reminders for medicines you are taking.", channels: { inApp: true, email: false, sms: false, whatsapp: true } },
  { id: "np6", label: "Docura product updates", description: "Occasional news about new Docura features.", channels: { inApp: true, email: false, sms: false, whatsapp: false } },
];

// ─── Hospital partners (V3.0) ────────────────────────────────────────────────
export const HOSPITAL_PARTNERS: HospitalPartner[] = [
  { id: "hp1", name: "Lagos University Teaching Hospital", city: "Idi-Araba, Lagos", country: "Nigeria", type: "Teaching hospital", services: ["Emergency", "Diagnostics", "Specialist referral"], status: "active", referralsThisMonth: 34, dataScope: ["Referral letter", "Shared health summary", "Discharge follow-up status"] },
  { id: "hp2", name: "Reddington Hospital", city: "Victoria Island, Lagos", country: "Nigeria", type: "Private hospital", services: ["Cardiology", "Imaging", "Day surgery"], status: "active", referralsThisMonth: 18, dataScope: ["Referral letter", "Shared health summary"] },
  { id: "hp3", name: "Synlab Diagnostics", city: "Lagos and Abuja", country: "Nigeria", type: "Diagnostics", services: ["Laboratory", "Home sample collection"], status: "active", referralsThisMonth: 52, dataScope: ["Test request", "Result delivery"] },
  { id: "hp4", name: "Peckham Community Clinics", city: "London", country: "United Kingdom", type: "Clinic network", services: ["Primary care", "Prescribing support"], status: "onboarding", referralsThisMonth: 0, dataScope: ["Referral letter"] },
];

// ─── Docura TV (V4.0) ────────────────────────────────────────────────────────
export const TV_TOPICS: TvTopic[] = [
  { id: "diabetes", label: "Living with diabetes", description: "Everyday management, food, and monitoring.", emoji: "🩸" },
  { id: "heart", label: "Heart and blood pressure", description: "Understanding readings and reducing risk.", emoji: "❤️" },
  { id: "womens-health", label: "Women's health", description: "Cycles, fertility, pregnancy and menopause.", emoji: "🌸" },
  { id: "mental-wellbeing", label: "Mental wellbeing", description: "Stress, sleep, anxiety and getting support.", emoji: "🧠" },
  { id: "skin", label: "Skin and hair", description: "Care for melanin-rich skin and common conditions.", emoji: "✨" },
  { id: "children", label: "Children's health", description: "Fevers, vaccines and childhood milestones.", emoji: "🧸" },
];

export const TV_CREATORS: TvCreator[] = [
  { id: "cr1", name: "Dr. Amara Osei", credential: "General Practitioner, MDCN", country: "Nigeria", photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face", followers: 24800, verified: true, verificationBody: "MDCN licence confirmed by Docura", bio: "Everyday explanations of chronic condition care, in plain language.", topics: ["diabetes", "heart"] },
  { id: "cr2", name: "Dr. Sarah Adeyemi", credential: "Women's Health, GMC", country: "United Kingdom", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face", followers: 41200, verified: true, verificationBody: "GMC registration confirmed by Docura", bio: "Women's health answers for the diaspora and at home.", topics: ["womens-health"] },
  { id: "cr3", name: "Dr. Fatima Bello", credential: "Dermatologist, MDCN", country: "Nigeria", photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face", followers: 18600, verified: true, verificationBody: "MDCN licence confirmed by Docura", bio: "Evidence-based skincare for melanin-rich skin.", topics: ["skin"] },
  { id: "cr4", name: "Dr. Chidi Okonkwo", credential: "Mental Wellbeing, MDCN", country: "Nigeria", photo: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&h=400&fit=crop&crop=face", followers: 12300, verified: true, verificationBody: "MDCN licence confirmed by Docura", bio: "Talking honestly about stress, sleep and asking for help.", topics: ["mental-wellbeing"] },
];

export const TV_CONTENT: TvContent[] = [
  { id: "tv1", title: "What your HbA1c number actually means", creatorId: "cr1", topic: "diabetes", duration: "2:40", views: 128400, published: "2025-08-30", thumbnail: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&h=800&fit=crop", summary: "A short explainer on how HbA1c reflects three months of blood sugar, and what a change of 0.5% really means day to day.", transcript: ["HbA1c is an average, not a snapshot.", "It reflects roughly the last three months.", "Small, sustained changes matter more than one good week.", "Always review your target with your own doctor."], moderation: "published", language: "English" },
  { id: "tv2", title: "Blood pressure readings: when to worry", creatorId: "cr1", topic: "heart", duration: "3:10", views: 96200, published: "2025-08-22", thumbnail: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&h=800&fit=crop", summary: "How to take a reliable reading at home, and which numbers mean you should contact your doctor rather than wait.", transcript: ["Sit still for five minutes before measuring.", "Take two readings, a minute apart.", "Record them — trends matter more than single numbers.", "Seek urgent care for very high readings with symptoms."], moderation: "published", language: "English" },
  { id: "tv3", title: "Perimenopause: the signs people miss", creatorId: "cr2", topic: "womens-health", duration: "4:05", views: 214600, published: "2025-08-18", thumbnail: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=800&fit=crop", summary: "Beyond hot flushes — sleep changes, joint aches and mood shifts that often go unrecognised.", transcript: ["Perimenopause can start years before periods stop.", "Symptoms are wider than most people expect.", "Track what changes and when.", "Treatment options should be discussed with a clinician who knows your history."], moderation: "published", language: "English" },
  { id: "tv4", title: "Hyperpigmentation: what actually helps", creatorId: "cr3", topic: "skin", duration: "2:15", views: 87300, published: "2025-09-01", thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=800&fit=crop", summary: "Sun protection, ingredient realities and why aggressive lightening products cause more harm than good.", transcript: ["Pigmentation needs patience and sun protection.", "Harsh bleaching agents damage the skin barrier.", "Consistency beats intensity.", "See a dermatologist for stubborn or spreading patches."], moderation: "published", language: "English" },
  { id: "tv5", title: "Sleep and stress: the two-way street", creatorId: "cr4", topic: "mental-wellbeing", duration: "3:35", views: 64100, published: "2025-08-12", thumbnail: "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=600&h=800&fit=crop", summary: "Why poor sleep amplifies stress and three practical steps to interrupt the cycle.", transcript: ["Stress and sleep feed each other.", "A consistent wake time helps more than a strict bedtime.", "Screens late at night delay sleep onset.", "Persistent insomnia deserves a proper consultation."], moderation: "published", language: "English" },
  { id: "tv6", title: "Fever in children: when to go to hospital", creatorId: "cr1", topic: "children", duration: "3:00", views: 152900, published: "2025-07-29", thumbnail: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=800&fit=crop", summary: "Clear red flags for parents, and what a fever on its own does and does not tell you.", transcript: ["Fever is a sign, not a diagnosis.", "Behaviour matters more than the number.", "Red flags: breathing difficulty, a rash that does not fade, unresponsiveness.", "When in doubt, get the child seen."], moderation: "published", language: "English" },
  { id: "tv7", title: "Managing diabetes during Ramadan", creatorId: "cr1", topic: "diabetes", duration: "4:20", views: 71800, published: "2025-07-10", thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=800&fit=crop", summary: "Planning ahead with your doctor, adjusting timings safely, and the signs that mean you should break a fast.", transcript: ["Plan medication timing with your doctor before fasting.", "Hypoglycaemia is the main risk.", "Break the fast if you feel unwell.", "Individual advice always overrides general guidance."], moderation: "published", language: "English" },
  { id: "tv8", title: "Anxiety at work: practical scripts", creatorId: "cr4", topic: "mental-wellbeing", duration: "2:55", views: 39400, published: "2025-09-03", thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=800&fit=crop", summary: "Grounding techniques you can use at your desk and how to ask for what you need without oversharing.", transcript: ["Name what is happening in your body.", "Slow the out-breath.", "Ask for a specific adjustment, not a diagnosis conversation.", "Ongoing anxiety is treatable — talk to a professional."], moderation: "in-review", language: "English" },
];

// ─── Internal admin roles (V2.1) ─────────────────────────────────────────────
export const ADMIN_ROLES: AdminRoleDefinition[] = [
  { id: "super-admin", label: "Super Admin", summary: "Full platform access across operations, finance, trust and clinical governance.", pages: ["admin-dashboard", "admin-verification", "admin-patients", "admin-doctors", "admin-crossborder", "admin-prescriptions", "admin-payouts", "admin-refunds", "admin-disputes", "admin-audit-log", "admin-support", "admin-analytics", "admin-hospitals", "admin-content"] },
  { id: "operations", label: "Operations", summary: "Verification queue, cross-border assignment and day-to-day platform operations.", pages: ["admin-dashboard", "admin-verification", "admin-patients", "admin-doctors", "admin-crossborder", "admin-audit-log", "admin-analytics", "admin-hospitals"] },
  { id: "finance", label: "Finance", summary: "Payouts, refunds and revenue reporting. No clinical record access.", pages: ["admin-dashboard", "admin-payouts", "admin-refunds", "admin-analytics", "admin-audit-log"] },
  { id: "support", label: "Support", summary: "Support tickets and account help. Clinical records are out of scope.", pages: ["admin-dashboard", "admin-support", "admin-disputes", "admin-audit-log"] },
  { id: "medical-board", label: "Medical Board", summary: "Clinical governance: prescribing review, doctor verification and content moderation.", pages: ["admin-dashboard", "admin-verification", "admin-prescriptions", "admin-doctors", "admin-content", "admin-audit-log"] },
];

// ─── Doctor analytics (V2.1) ─────────────────────────────────────────────────
export const DOCTOR_ANALYTICS = {
  months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  consultations: [18, 22, 26, 24, 31, 12],
  earnings: [96000, 118000, 134000, 128000, 162000, 61000],
  newCareRelationships: [3, 5, 4, 6, 7, 2],
  followUpCompletion: 82,
  averageResponseMinutes: 104,
  patientRetention: 91,
  ratingTrend: [4.7, 4.8, 4.8, 4.9, 4.9, 4.9],
};

// ─── Platform analytics (V2.1) ───────────────────────────────────────────────
export const PLATFORM_ANALYTICS = {
  months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  consultations: [412, 486, 553, 601, 688, 240],
  revenue: [3120000, 3680000, 4210000, 4520000, 5180000, 1810000],
  newPatients: [148, 176, 194, 210, 246, 96],
  newDoctors: [6, 8, 7, 9, 11, 4],
  crossBorderCases: [12, 15, 18, 21, 26, 9],
  payoutVolume: [1980000, 2340000, 2670000, 2880000, 3290000, 1150000],
};
