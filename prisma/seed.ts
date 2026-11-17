import "dotenv/config";
import { rm, mkdir } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { courses as mockCourses } from "./seed-data/courses";
import { adminStudents, adminOrders, adminCertificates } from "./seed-data/admin";
import {
  populateIntimateLighteningRealContent,
  populateIntimateLighteningQuiz,
} from "./seed-data/intimate-lightening-content";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const DEMO_STUDENT_PASSWORD = "Student123!";
const DEMO_ADMIN_PASSWORD = "Admin123!";

// Mock order/certificate rows refer to courses by display title, sometimes
// abbreviated — map those back to real slugs explicitly rather than fuzzy-matching.
const courseTitleToSlug: Record<string, string> = {
  "Intimate Lightening": "intimate-lightening",
  "Acne Microneedling": "acne-microneedling",
  "Treating Acne": "treating-acne",
  "Melasma & Pigmentation": "melasma-pigmentation",
  "Bio-Microneedling / Algae Peel": "bio-microneedling-algae-peel",
  "Dermal Therapy Training": "dermal-therapy-training",
  "Beauty Therapist → Advanced Dermal": "advanced-dermal-upgrade",
  "Fibroblast Skin Tightening + Device": "fibroblast-skin-tightening",
};

const studentEmailByName: Record<string, string> = {
  "Jordan Blake": "jordan.blake@example.com",
  "Olivia Bennett": "olivia.bennett@example.com",
  "Sofia Marchetti": "sofia.m@example.com",
  "Ava Whitfield": "ava.whitfield@example.com",
  "Chloe Ndiaye": "chloe.ndiaye@example.com",
  "Grace Sullivan": "grace.sullivan@example.com",
  "Ruby Patterson": "ruby.p@example.com",
  "Isabella Conti": "isabella.conti@example.com",
};

const formatMap = { online: "ONLINE", "in-clinic": "IN_CLINIC", bundle: "BUNDLE" } as const;
const typeMap = { video: "VIDEO", pdf: "PDF", quiz: "QUIZ" } as const;

async function main() {
  console.log("Clearing existing data…");
  // Also clear uploaded lesson files — every reseed generates fresh lesson IDs,
  // so leftover folders from previous runs would otherwise accumulate as orphans
  // forever (this is dev-only; seed.ts must never be run against production).
  const uploadsDir = path.resolve(process.cwd(), process.env.STORAGE_DIR ?? "./storage", "uploads");
  await rm(uploadsDir, { recursive: true, force: true });
  await mkdir(uploadsDir, { recursive: true });

  await prisma.order.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany(); // cascades modules + lessons
  await prisma.instructor.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding instructors…");
  const instructorNames = [...new Set(mockCourses.map((c) => c.instructor.name))];
  const instructorByName = new Map<string, string>();
  for (const name of instructorNames) {
    const title = mockCourses.find((c) => c.instructor.name === name)!.instructor.title;
    const instructor = await prisma.instructor.create({ data: { name, title } });
    instructorByName.set(name, instructor.id);
  }

  console.log("Seeding courses, modules & lessons…");
  const courseIdBySlug = new Map<string, string>();
  for (const c of mockCourses) {
    const course = await prisma.course.create({
      data: {
        slug: c.slug,
        title: c.title,
        format: formatMap[c.format],
        price: c.price,
        compareAtPrice: c.compareAtPrice ?? null,
        duration: c.duration,
        schedule: c.schedule ?? null,
        level: c.level,
        category: c.category,
        accent: c.accent,
        summary: c.summary,
        description: c.description,
        outcomes: c.outcomes,
        includes: c.includes,
        rating: c.rating,
        instructorId: instructorByName.get(c.instructor.name)!,
        modules: {
          create: c.modules.map((m, mi) => ({
            title: m.title,
            position: mi,
            lessons: {
              create: m.lessons.map((l, li) => ({
                title: l.title,
                type: typeMap[l.type],
                duration: l.duration,
                position: li,
              })),
            },
          })),
        },
      },
    });
    courseIdBySlug.set(c.slug, course.id);
  }

  console.log("Seeding users…");
  const studentPasswordHash = await bcrypt.hash(DEMO_STUDENT_PASSWORD, 10);
  const adminPasswordHash = await bcrypt.hash(DEMO_ADMIN_PASSWORD, 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@luminousskn.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      title: "Academy Admin",
    },
  });

  const userIdByEmail = new Map<string, string>();
  for (const s of adminStudents) {
    const email = studentEmailByName[s.name] ?? s.email;
    const user = await prisma.user.create({
      data: {
        name: s.name,
        email,
        passwordHash: studentPasswordHash,
        role: "STUDENT",
        status: s.status === "inactive" ? "INACTIVE" : "ACTIVE",
        title: s.name === "Jordan Blake" ? "Dermal Therapist" : null,
      },
    });
    userIdByEmail.set(s.name, user.id);
  }

  console.log("Seeding enrollments & lesson progress for the demo student (Jordan Blake)…");
  const jordanId = userIdByEmail.get("Jordan Blake")!;
  const demoEnrollments: {
    slug: string;
    progress: number;
    status: "ACTIVE" | "COMPLETED";
  }[] = [
    { slug: "intimate-lightening", progress: 0, status: "ACTIVE" },
    { slug: "bio-microneedling-algae-peel", progress: 100, status: "COMPLETED" },
    { slug: "dermal-therapy-training", progress: 18, status: "ACTIVE" },
    { slug: "melasma-pigmentation", progress: 0, status: "ACTIVE" },
  ];
  for (const e of demoEnrollments) {
    await prisma.enrollment.create({
      data: {
        userId: jordanId,
        courseId: courseIdBySlug.get(e.slug)!,
        progress: e.progress,
        status: e.status,
        lastActivityAt: new Date(),
      },
    });
  }
  const intimateLessons = await prisma.courseModule.findMany({
    where: { courseId: courseIdBySlug.get("intimate-lightening") },
    orderBy: { position: "asc" },
    include: { lessons: { orderBy: { position: "asc" } } },
  });
  const flatIntimateLessons = intimateLessons.flatMap((m) => m.lessons);

  console.log("Populating Intimate Lightening with the client's real course content…");
  await populateIntimateLighteningRealContent(prisma, flatIntimateLessons);
  const intimateQuizLesson = flatIntimateLessons.find((l) => l.type === "QUIZ")!;
  await populateIntimateLighteningQuiz(prisma, intimateQuizLesson.id);

  const bioCourseModules = await prisma.courseModule.findMany({
    where: { courseId: courseIdBySlug.get("bio-microneedling-algae-peel") },
    include: { lessons: true },
  });
  for (const m of bioCourseModules) {
    for (const l of m.lessons) {
      await prisma.lessonProgress.create({
        data: { userId: jordanId, lessonId: l.id, completedAt: new Date() },
      });
    }
  }

  console.log("Seeding certificates…");
  for (const c of adminCertificates) {
    const userId = userIdByEmail.get(c.student);
    const slug = courseTitleToSlug[c.course];
    if (!userId || !slug) continue;
    const courseId = courseIdBySlug.get(slug)!;
    await prisma.certificate.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, credentialId: c.credentialId, issuedAt: new Date(c.issuedOn) },
      update: {},
    });
    // Certificates imply a completed enrollment for every student, not just Jordan.
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, progress: 100, status: "COMPLETED", lastActivityAt: new Date(c.issuedOn) },
      update: { progress: 100, status: "COMPLETED" },
    });
  }

  console.log("Seeding orders…");
  const statusMap = { paid: "PAID", pending: "PENDING", refunded: "REFUNDED" } as const;
  for (const o of adminOrders) {
    const userId = userIdByEmail.get(o.student);
    const slug = courseTitleToSlug[o.course];
    if (!userId || !slug) continue;
    const courseId = courseIdBySlug.get(slug)!;
    await prisma.order.create({
      data: {
        userId,
        courseId,
        amount: o.amount,
        status: statusMap[o.status],
        method: o.method,
        createdAt: new Date(o.date),
      },
    });
    // A paid order not already recorded as completed means an active enrollment.
    if (o.status === "paid") {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId, progress: 0, status: "ACTIVE", lastActivityAt: new Date(o.date) },
        update: {},
      });
    }
  }

  console.log("Seed complete.");
  console.log(`Demo student login: jordan.blake@example.com / ${DEMO_STUDENT_PASSWORD}`);
  console.log(`Demo admin login:   admin@luminousskn.com / ${DEMO_ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
