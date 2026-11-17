export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  initials: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  totalSpent: number;
  joined: string;
  status: "active" | "inactive";
}

export const adminStudents: AdminStudent[] = [
  { id: "STU-1042", name: "Jordan Blake", email: "jordan.blake@example.com", initials: "JB", coursesEnrolled: 4, coursesCompleted: 1, totalSpent: 897, joined: "12 Feb 2025", status: "active" },
  { id: "STU-1041", name: "Olivia Bennett", email: "olivia.bennett@example.com", initials: "OB", coursesEnrolled: 2, coursesCompleted: 2, totalSpent: 598, joined: "3 Jan 2025", status: "active" },
  { id: "STU-1040", name: "Sofia Marchetti", email: "sofia.m@example.com", initials: "SM", coursesEnrolled: 1, coursesCompleted: 0, totalSpent: 15000, joined: "28 Nov 2024", status: "active" },
  { id: "STU-1039", name: "Ava Whitfield", email: "ava.whitfield@example.com", initials: "AW", coursesEnrolled: 3, coursesCompleted: 3, totalSpent: 897, joined: "14 Nov 2024", status: "active" },
  { id: "STU-1038", name: "Chloe Ndiaye", email: "chloe.ndiaye@example.com", initials: "CN", coursesEnrolled: 1, coursesCompleted: 0, totalSpent: 10000, joined: "2 Oct 2024", status: "active" },
  { id: "STU-1037", name: "Grace Sullivan", email: "grace.sullivan@example.com", initials: "GS", coursesEnrolled: 2, coursesCompleted: 1, totalSpent: 598, joined: "19 Sep 2024", status: "inactive" },
  { id: "STU-1036", name: "Ruby Patterson", email: "ruby.p@example.com", initials: "RP", coursesEnrolled: 1, coursesCompleted: 1, totalSpent: 4000, joined: "5 Aug 2024", status: "active" },
  { id: "STU-1035", name: "Isabella Conti", email: "isabella.conti@example.com", initials: "IC", coursesEnrolled: 5, coursesCompleted: 4, totalSpent: 1196, joined: "22 Jun 2024", status: "active" },
];

export interface AdminOrder {
  id: string;
  student: string;
  course: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "refunded";
  method: string;
}

export const adminOrders: AdminOrder[] = [
  { id: "ORD-3391", student: "Jordan Blake", course: "Intimate Lightening", amount: 299, date: "24 Sep 2026", status: "paid", method: "Visa •• 4291" },
  { id: "ORD-3390", student: "Sofia Marchetti", course: "Dermal Therapy Training", amount: 15000, date: "22 Sep 2026", status: "pending", method: "Payment Plan" },
  { id: "ORD-3389", student: "Grace Sullivan", course: "Acne Microneedling", amount: 299, date: "20 Sep 2026", status: "paid", method: "Mastercard •• 8832" },
  { id: "ORD-3388", student: "Ruby Patterson", course: "Fibroblast Skin Tightening + Device", amount: 4000, date: "18 Sep 2026", status: "paid", method: "Bank Transfer" },
  { id: "ORD-3387", student: "Isabella Conti", course: "Melasma & Pigmentation", amount: 299, date: "15 Sep 2026", status: "refunded", method: "Visa •• 1123" },
  { id: "ORD-3386", student: "Chloe Ndiaye", course: "Beauty Therapist → Advanced Dermal", amount: 10000, date: "9 Sep 2026", status: "paid", method: "Payment Plan" },
  { id: "ORD-3385", student: "Olivia Bennett", course: "Bio-Microneedling / Algae Peel", amount: 299, date: "2 Sep 2026", status: "paid", method: "Visa •• 4291" },
  { id: "ORD-3384", student: "Ava Whitfield", course: "Treating Acne", amount: 299, date: "27 Aug 2026", status: "paid", method: "Mastercard •• 5510" },
];

export interface AdminCertificate {
  id: string;
  student: string;
  course: string;
  issuedOn: string;
  credentialId: string;
}

export const adminCertificates: AdminCertificate[] = [
  { id: "c1", student: "Jordan Blake", course: "Bio-Microneedling / Algae Peel", issuedOn: "3 Sep 2025", credentialId: "LSK-BMA-08841" },
  { id: "c2", student: "Olivia Bennett", course: "Intimate Lightening", issuedOn: "18 Aug 2025", credentialId: "LSK-INT-08790" },
  { id: "c3", student: "Olivia Bennett", course: "Treating Acne", issuedOn: "2 Jul 2025", credentialId: "LSK-TAC-08654" },
  { id: "c4", student: "Ava Whitfield", course: "Acne Microneedling", issuedOn: "30 Jun 2025", credentialId: "LSK-AMN-08601" },
  { id: "c5", student: "Ava Whitfield", course: "Melasma & Pigmentation", issuedOn: "14 May 2025", credentialId: "LSK-MEL-08477" },
  { id: "c6", student: "Ava Whitfield", course: "Bio-Microneedling / Algae Peel", issuedOn: "2 Apr 2025", credentialId: "LSK-BMA-08312" },
  { id: "c7", student: "Ruby Patterson", course: "Fibroblast Skin Tightening + Device", issuedOn: "22 Mar 2025", credentialId: "LSK-FIB-08201" },
  { id: "c8", student: "Isabella Conti", course: "Intimate Lightening", issuedOn: "9 Feb 2025", credentialId: "LSK-INT-08055" },
];
