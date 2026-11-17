export type CourseFormat = "online" | "in-clinic" | "bundle";

export type LessonType = "video" | "pdf" | "quiz";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  status: "completed" | "current" | "locked";
  hasFile: boolean;
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

export interface Enrollment {
  slug: string;
  progress: number;
  status: "in-progress" | "completed" | "not-started";
  lastActivity: string;
}

export interface Certificate {
  id: string;
  courseSlug: string;
  courseTitle: string;
  issuedOn: string;
  credentialId: string;
}

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

export interface AdminOrder {
  id: string;
  rawId: string;
  student: string;
  course: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "refunded";
  method: string;
}

export interface AdminCertificate {
  id: string;
  student: string;
  course: string;
  issuedOn: string;
  credentialId: string;
}

export interface AdminApplication {
  id: string;
  studentName: string;
  studentEmail: string;
  course: string;
  courseSlug: string;
  price: number;
  notes: string | null;
  appliedOn: string;
}

export interface AdminInClinicStudent {
  enrollmentId: string;
  studentName: string;
  studentEmail: string;
  course: string;
  courseSlug: string;
  progress: number;
  enrolledOn: string;
  lastReminderSentOn: string | null;
}
