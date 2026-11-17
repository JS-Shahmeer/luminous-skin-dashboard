export type CourseFormat = "online" | "in-clinic" | "bundle";

export type LessonType = "video" | "pdf" | "quiz";

export interface Lesson {
  title: string;
  type: LessonType;
  duration: string;
  status: "completed" | "current" | "locked";
}

export interface CourseModule {
  title: string;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  title: string;
  format: CourseFormat;
  price: number;
  compareAtPrice?: number;
  duration: string;
  schedule?: string;
  level: string;
  category: string;
  accent: string;
  summary: string;
  description: string;
  outcomes: string[];
  includes: string[];
  instructor: {
    name: string;
    title: string;
  };
  modules: CourseModule[];
  studentsEnrolled: number;
  rating: number;
}

export const courses: Course[] = [
  {
    slug: "intimate-lightening",
    title: "Intimate Lightening",
    format: "online",
    price: 299,
    duration: "6 modules · 24 lessons",
    level: "Foundation",
    category: "Pigmentation",
    accent: "from-[#C6A875]/25",
    summary:
      "Client selection, contraindications and step-by-step protocol for safe, effective intimate lightening treatments.",
    description:
      "A complete clinical framework for intimate lightening — from consultation and skin assessment through to treatment delivery, aftercare and complication management. Includes downloadable protocol sheets, a client consultation kit, and real step-by-step treatment demonstrations for both the peel and advanced laser protocols.",
    outcomes: [
      "Run a compliant, comfortable client consultation",
      "Identify contraindications and manage patch testing",
      "Deliver the full step-by-step peel and laser treatment protocols",
      "Prescribe aftercare and manage complications confidently",
    ],
    includes: [
      "14 step-by-step treatment videos",
      "10 downloadable protocol & consultation documents",
      "Consultation & contraindication checklists",
      "Final assessment quiz",
      "Certificate of completion",
    ],
    instructor: { name: "Dr. Amara Voss", title: "Lead Dermal Clinician" },
    studentsEnrolled: 184,
    rating: 4.9,
    modules: [
      {
        title: "Module 1 — Consultation & Client Intake",
        lessons: [
          { title: "Intake Consultation Form", type: "pdf", duration: "2 pages", status: "locked" },
          { title: "Consultation & Consent Form", type: "pdf", duration: "1 page", status: "locked" },
        ],
      },
      {
        title: "Module 2 — Contraindications & Safety",
        lessons: [
          { title: "Contraindications & Client Checklists", type: "pdf", duration: "2 pages", status: "locked" },
          { title: "Safety, Complications & When to Refer", type: "pdf", duration: "1 page", status: "locked" },
        ],
      },
      {
        title: "Module 3 — Peel Treatment Protocol",
        lessons: [
          { title: "Treatment Protocol — Peel Selection & Application", type: "pdf", duration: "1 page", status: "locked" },
          { title: "Peels to Purchase — Product Guide", type: "pdf", duration: "1 page", status: "locked" },
          { title: "Step 1 — Cleanse", type: "video", duration: "Demo video", status: "locked" },
          { title: "Step 2 — Exfoliate", type: "video", duration: "Demo video", status: "locked" },
          { title: "Step 3 — Prep", type: "video", duration: "Demo video", status: "locked" },
          { title: "Step 4 — Apply Peel", type: "video", duration: "Demo video", status: "locked" },
          { title: "Step 5 — Treatment Time", type: "video", duration: "Demo video", status: "locked" },
          { title: "Step 6 — Remove & Neutralise", type: "video", duration: "Demo video", status: "locked" },
        ],
      },
      {
        title: "Module 4 — Advanced Laser Protocol (Optional)",
        lessons: [
          { title: "Advanced Laser Protocol Guide", type: "pdf", duration: "1 page", status: "locked" },
          { title: "Step 1 — Cleanse", type: "video", duration: "Demo video", status: "locked" },
          { title: "Step 2 — Exfoliate", type: "video", duration: "Demo video", status: "locked" },
          { title: "Step 3 — Prep", type: "video", duration: "Demo video", status: "locked" },
          { title: "Step 4 — Laser (Optional)", type: "video", duration: "Demo video", status: "locked" },
          { title: "Step 5 — Apply Peel", type: "video", duration: "Demo video", status: "locked" },
          { title: "Step 6 — Treatment Time", type: "video", duration: "Demo video", status: "locked" },
          { title: "Step 7 — Remove & Neutralise", type: "video", duration: "Demo video", status: "locked" },
          { title: "Step 8 — Red LED & Finish", type: "video", duration: "Demo video", status: "locked" },
        ],
      },
      {
        title: "Module 5 — Aftercare & Documentation",
        lessons: [
          { title: "Aftercare Instructions", type: "pdf", duration: "2 pages", status: "locked" },
          { title: "Client Treatment Record Template", type: "pdf", duration: "1 page", status: "locked" },
          { title: "Treatment Intervals & Progress Photography Guide", type: "pdf", duration: "1 page", status: "locked" },
        ],
      },
      {
        title: "Module 6 — Final Assessment",
        lessons: [{ title: "Final Knowledge Check", type: "quiz", duration: "10 questions", status: "locked" }],
      },
    ],
  },
  {
    slug: "acne-microneedling",
    title: "Acne Microneedling",
    format: "online",
    price: 299,
    duration: "3h 40m · 4 modules",
    level: "Foundation",
    category: "Acne & Scarring",
    accent: "from-[#C6A875]/25",
    summary:
      "Microneedling protocols for active acne and post-acne scarring, including depth selection and aftercare.",
    description:
      "Covers needling depth by skin zone, active-acne vs scar-revision protocols, and combination approaches with actives and LED. Includes treatment plan templates.",
    outcomes: [
      "Select correct needling depth by indication and zone",
      "Sequence treatments for active acne vs scarring",
      "Combine microneedling with complementary actives",
      "Build a client treatment plan and aftercare schedule",
    ],
    includes: ["4 video modules", "Downloadable eBook", "Treatment plan templates", "Final quiz", "Certificate of completion"],
    instructor: { name: "Charlotte Reeve", title: "Senior Dermal Therapist" },
    studentsEnrolled: 142,
    rating: 4.8,
    modules: [
      {
        title: "Module 1 — Acne Pathology & Skin Assessment",
        lessons: [
          { title: "Understanding Acne Subtypes", type: "video", duration: "16 min", status: "locked" },
          { title: "Scar Classification Guide", type: "pdf", duration: "9 pages", status: "locked" },
        ],
      },
      {
        title: "Module 2 — Needling Protocols",
        lessons: [
          { title: "Depth Selection by Zone", type: "video", duration: "21 min", status: "locked" },
          { title: "Active Acne Protocol", type: "video", duration: "17 min", status: "locked" },
        ],
      },
      {
        title: "Module 3 — Combination Therapy",
        lessons: [{ title: "Actives, LED & Sequencing", type: "video", duration: "24 min", status: "locked" }],
      },
      {
        title: "Module 4 — Assessment",
        lessons: [{ title: "Final Knowledge Quiz", type: "quiz", duration: "15 questions", status: "locked" }],
      },
    ],
  },
  {
    slug: "treating-acne",
    title: "Treating Acne",
    format: "online",
    price: 299,
    duration: "3h 10m · 4 modules",
    level: "Foundation",
    category: "Acne & Scarring",
    accent: "from-[#C6A875]/25",
    summary:
      "A clinical approach to grading, treating and managing acne across skin types with corrective in-clinic protocols.",
    description:
      "From grading and triggers to building a corrective treatment pathway — extractions, peels, LED and home-care integration for sustainable results.",
    outcomes: [
      "Grade acne severity and identify underlying triggers",
      "Design a multi-session corrective pathway",
      "Integrate peels, LED and extractions safely",
      "Prescribe compliant home-care support",
    ],
    includes: ["4 video modules", "Downloadable eBook", "Client intake forms", "Final quiz", "Certificate of completion"],
    instructor: { name: "Dr. Amara Voss", title: "Lead Dermal Clinician" },
    studentsEnrolled: 201,
    rating: 4.9,
    modules: [
      {
        title: "Module 1 — Grading & Triggers",
        lessons: [{ title: "Acne Grading Systems", type: "video", duration: "14 min", status: "locked" }],
      },
      {
        title: "Module 2 — Corrective Pathway",
        lessons: [
          { title: "Building a Treatment Pathway", type: "video", duration: "20 min", status: "locked" },
          { title: "Peels, LED & Extractions", type: "video", duration: "23 min", status: "locked" },
        ],
      },
      {
        title: "Module 3 — Home Care",
        lessons: [{ title: "Home-Care Integration", type: "pdf", duration: "8 pages", status: "locked" }],
      },
      {
        title: "Module 4 — Assessment",
        lessons: [{ title: "Final Knowledge Quiz", type: "quiz", duration: "15 questions", status: "locked" }],
      },
    ],
  },
  {
    slug: "melasma-pigmentation",
    title: "Melasma & Pigmentation",
    format: "online",
    price: 299,
    duration: "4h 05m · 5 modules",
    level: "Intermediate",
    category: "Pigmentation",
    accent: "from-[#C6A875]/25",
    summary:
      "Which modalities and lasers are appropriate for melasma and pigmentation — device selection, settings and safe sequencing.",
    description:
      "A device-led deep dive into melasma vs. other pigmentation, and how to choose between laser, IPL and non-device modalities safely across Fitzpatrick types.",
    outcomes: [
      "Differentiate melasma from other pigmentation types",
      "Select appropriate laser/IPL modalities by skin type",
      "Set safe parameters and sequencing across a treatment course",
      "Avoid rebound pigmentation and manage complications",
    ],
    includes: ["5 video modules", "Device selection guide (eBook)", "Settings & sequencing charts", "Final quiz", "Certificate of completion"],
    instructor: { name: "Dr. Amara Voss", title: "Lead Dermal Clinician" },
    studentsEnrolled: 129,
    rating: 5.0,
    modules: [
      {
        title: "Module 1 — Pigmentation Science",
        lessons: [{ title: "Melasma vs Other Pigmentation", type: "video", duration: "19 min", status: "locked" }],
      },
      {
        title: "Module 2 — Modalities & Lasers",
        lessons: [
          { title: "Laser & IPL Fundamentals", type: "video", duration: "25 min", status: "locked" },
          { title: "Device Selection Guide", type: "pdf", duration: "14 pages", status: "locked" },
        ],
      },
      {
        title: "Module 3 — Safe Sequencing",
        lessons: [{ title: "Settings & Treatment Sequencing", type: "video", duration: "22 min", status: "locked" }],
      },
      {
        title: "Module 4 — Complications",
        lessons: [{ title: "Avoiding Rebound Pigmentation", type: "video", duration: "16 min", status: "locked" }],
      },
      {
        title: "Module 5 — Assessment",
        lessons: [{ title: "Final Knowledge Quiz", type: "quiz", duration: "18 questions", status: "locked" }],
      },
    ],
  },
  {
    slug: "bio-microneedling-algae-peel",
    title: "Bio-Microneedling / Algae Peel",
    format: "online",
    price: 299,
    duration: "3h 30m · 4 modules",
    level: "Foundation",
    category: "Resurfacing",
    accent: "from-[#C6A875]/25",
    summary:
      "Bio-microneedling and algae peel protocols for gentle, effective resurfacing with minimal downtime.",
    description:
      "Combines bio-microneedling technique with algae peel layering for glow-focused resurfacing. Includes full protocol, contraindications and aftercare.",
    outcomes: [
      "Perform the bio-microneedling technique correctly",
      "Layer and time algae peel application safely",
      "Select candidates and manage contraindications",
      "Prescribe aftercare for minimal-downtime recovery",
    ],
    includes: ["4 video modules", "Downloadable eBook", "Protocol card", "Final quiz", "Certificate of completion"],
    instructor: { name: "Charlotte Reeve", title: "Senior Dermal Therapist" },
    studentsEnrolled: 97,
    rating: 4.9,
    modules: [
      {
        title: "Module 1 — Foundations",
        lessons: [{ title: "Bio-Microneedling Overview", type: "video", duration: "12 min", status: "completed" }],
      },
      {
        title: "Module 2 — Technique",
        lessons: [
          { title: "Bio-Microneedling Technique", type: "video", duration: "20 min", status: "completed" },
          { title: "Algae Peel Layering", type: "video", duration: "18 min", status: "completed" },
        ],
      },
      {
        title: "Module 3 — Client Care",
        lessons: [
          { title: "Contraindications & Candidate Selection", type: "pdf", duration: "7 pages", status: "completed" },
          { title: "Aftercare Instructions", type: "video", duration: "11 min", status: "completed" },
        ],
      },
      {
        title: "Module 4 — Assessment",
        lessons: [{ title: "Final Knowledge Quiz", type: "quiz", duration: "12 questions", status: "completed" }],
      },
    ],
  },
  {
    slug: "dermal-therapy-training",
    title: "Dermal Therapy Training — Beginner Level",
    format: "in-clinic",
    price: 15000,
    duration: "3–6 months",
    schedule: "2–3 days / week · In-clinic",
    level: "Beginner → Advanced",
    category: "Dermal Certification",
    accent: "from-[#C6A875]/30",
    summary:
      "Full in-clinic dermal therapy certification from beginner level — theory, hands-on practice and live model treatments.",
    description:
      "Our flagship in-clinic program. Students progress from foundational skin science through to advanced corrective treatments, working on real models under clinical supervision across the full Luminous SKN treatment menu.",
    outcomes: [
      "Build foundational and advanced dermal therapy skills",
      "Complete supervised treatments on live models",
      "Master the full Luminous SKN treatment menu",
      "Graduate clinic-ready with a certified practical portfolio",
    ],
    includes: [
      "In-clinic theory & practical training",
      "Live model treatment sessions",
      "1:1 mentoring from senior clinicians",
      "Full treatment protocol library",
      "Certificate of completion",
    ],
    instructor: { name: "Dr. Amara Voss", title: "Lead Dermal Clinician" },
    studentsEnrolled: 18,
    rating: 5.0,
    modules: [
      {
        title: "Phase 1 — Foundations (Weeks 1–6)",
        lessons: [
          { title: "Skin Science & Anatomy", type: "video", duration: "In-clinic", status: "current" },
          { title: "Infection Control & Compliance", type: "pdf", duration: "In-clinic", status: "locked" },
        ],
      },
      {
        title: "Phase 2 — Core Treatments (Weeks 7–14)",
        lessons: [{ title: "Supervised Practical — Core Menu", type: "video", duration: "In-clinic", status: "locked" }],
      },
      {
        title: "Phase 3 — Advanced Corrective (Weeks 15–20)",
        lessons: [{ title: "Supervised Practical — Advanced Menu", type: "video", duration: "In-clinic", status: "locked" }],
      },
      {
        title: "Phase 4 — Certification",
        lessons: [{ title: "Practical Assessment & Portfolio Review", type: "quiz", duration: "In-clinic", status: "locked" }],
      },
    ],
  },
  {
    slug: "advanced-dermal-upgrade",
    title: "Beauty Therapist → Advanced Dermal",
    format: "in-clinic",
    price: 10000,
    duration: "3–6 months",
    schedule: "2–3 days / week · In-clinic",
    level: "Upgrade",
    category: "Dermal Certification",
    accent: "from-[#C6A875]/30",
    summary:
      "An accelerated upgrade pathway for qualified beauty therapists moving into advanced dermal therapy.",
    description:
      "Designed for existing beauty therapists, this pathway fast-tracks advanced dermal competencies — device-based corrective treatments, complex case management and clinical protocol mastery.",
    outcomes: [
      "Bridge beauty-therapy knowledge into advanced dermal scope",
      "Operate advanced devices safely and effectively",
      "Manage complex, corrective client cases",
      "Graduate with an Advanced Dermal certification",
    ],
    includes: [
      "In-clinic theory & practical training",
      "Live model treatment sessions",
      "Advanced device certification",
      "Full treatment protocol library",
      "Certificate of completion",
    ],
    instructor: { name: "Charlotte Reeve", title: "Senior Dermal Therapist" },
    studentsEnrolled: 11,
    rating: 5.0,
    modules: [
      {
        title: "Phase 1 — Bridging Theory (Weeks 1–4)",
        lessons: [{ title: "Advanced Skin Science Bridge", type: "video", duration: "In-clinic", status: "locked" }],
      },
      {
        title: "Phase 2 — Device Certification (Weeks 5–10)",
        lessons: [{ title: "Advanced Device Training", type: "video", duration: "In-clinic", status: "locked" }],
      },
      {
        title: "Phase 3 — Complex Case Management (Weeks 11–16)",
        lessons: [{ title: "Supervised Complex Cases", type: "video", duration: "In-clinic", status: "locked" }],
      },
      {
        title: "Phase 4 — Certification",
        lessons: [{ title: "Practical Assessment & Portfolio Review", type: "quiz", duration: "In-clinic", status: "locked" }],
      },
    ],
  },
  {
    slug: "fibroblast-skin-tightening",
    title: "Fibroblast Skin Tightening Course + Device",
    format: "bundle",
    price: 4000,
    duration: "2 days training",
    schedule: "In-clinic + take-home device",
    level: "Certification",
    category: "Device & Certification",
    accent: "from-[#C6A875]/30",
    summary:
      "Course, device and full support package — theory, hands-on practical, protocols and aftercare included.",
    description:
      "A complete business-in-a-box: the Fibroblast device, certified training, treatment protocols, aftercare guidance and ongoing support so you can offer skin tightening from day one.",
    outcomes: [
      "Operate the Fibroblast device safely and confidently",
      "Deliver the full skin-tightening treatment protocol",
      "Manage aftercare and client expectations",
      "Launch the treatment in your clinic with ongoing support",
    ],
    includes: [
      "Fibroblast device (yours to keep)",
      "In-clinic theory & hands-on practical",
      "Treatment protocol library",
      "Aftercare & complications guide",
      "Ongoing clinical support",
      "Certificate of completion",
    ],
    instructor: { name: "Dr. Amara Voss", title: "Lead Dermal Clinician" },
    studentsEnrolled: 34,
    rating: 4.9,
    modules: [
      {
        title: "Day 1 — Theory & Device",
        lessons: [
          { title: "Fibroblast Technology & Theory", type: "video", duration: "45 min", status: "locked" },
          { title: "Device Setup & Safety", type: "video", duration: "30 min", status: "locked" },
        ],
      },
      {
        title: "Day 2 — Practical & Protocols",
        lessons: [
          { title: "Supervised Hands-On Practical", type: "video", duration: "In-clinic", status: "locked" },
          { title: "Treatment Protocol Guide", type: "pdf", duration: "16 pages", status: "locked" },
        ],
      },
      {
        title: "Certification",
        lessons: [{ title: "Practical Assessment", type: "quiz", duration: "In-clinic", status: "locked" }],
      },
    ],
  },
];
