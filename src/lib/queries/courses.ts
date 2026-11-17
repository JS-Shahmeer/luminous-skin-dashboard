import { prisma } from "@/lib/prisma";
import type { Course, CourseFormat, LessonType } from "@/types/models";

const formatFromDb: Record<string, CourseFormat> = {
  ONLINE: "online",
  IN_CLINIC: "in-clinic",
  BUNDLE: "bundle",
};

const typeFromDb: Record<string, LessonType> = {
  VIDEO: "video",
  PDF: "pdf",
  QUIZ: "quiz",
};

const courseInclude = {
  instructor: true,
  modules: {
    orderBy: { position: "asc" as const },
    include: { lessons: { orderBy: { position: "asc" as const } } },
  },
  _count: { select: { enrollments: true } },
};

type CourseWithRelations = NonNullable<
  Awaited<ReturnType<typeof prisma.course.findFirst<{ include: typeof courseInclude }>>>
>;

function toCourse(
  c: CourseWithRelations,
  lessonStatus?: (lessonId: string, position: { moduleIndex: number; lessonIndex: number }) => "completed" | "current" | "locked"
): Course {
  return {
    slug: c.slug,
    title: c.title,
    format: formatFromDb[c.format],
    price: c.price,
    compareAtPrice: c.compareAtPrice ?? undefined,
    duration: c.duration,
    schedule: c.schedule ?? undefined,
    level: c.level,
    category: c.category,
    accent: c.accent,
    summary: c.summary,
    description: c.description,
    outcomes: c.outcomes as string[],
    includes: c.includes as string[],
    instructor: { name: c.instructor.name, title: c.instructor.title },
    studentsEnrolled: c._count.enrollments,
    rating: c.rating,
    modules: c.modules.map((m, moduleIndex) => ({
      title: m.title,
      lessons: m.lessons.map((l, lessonIndex) => ({
        id: l.id,
        title: l.title,
        type: typeFromDb[l.type],
        duration: l.duration,
        status: lessonStatus ? lessonStatus(l.id, { moduleIndex, lessonIndex }) : "locked",
        hasFile: Boolean(l.fileUrl),
      })),
    })),
  };
}

export async function listCourses(): Promise<Course[]> {
  const rows = await prisma.course.findMany({ include: courseInclude });
  return rows.map((r) => toCourse(r));
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const row = await prisma.course.findUnique({ where: { slug }, include: courseInclude });
  return row ? toCourse(row) : null;
}

/** Same as getCourseBySlug, but computes real per-user lesson status (completed / current / locked). */
export async function getCourseForLearner(slug: string, userId: string): Promise<Course | null> {
  const row = await prisma.course.findUnique({ where: { slug }, include: courseInclude });
  if (!row) return null;

  const allLessonIds = row.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const [progress, passedQuizzes] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: allLessonIds }, completedAt: { not: null } },
    }),
    prisma.quizAttempt.findMany({
      where: { userId, lessonId: { in: allLessonIds }, passed: true },
    }),
  ]);
  const completedIds = new Set([
    ...progress.map((p) => p.lessonId),
    ...passedQuizzes.map((a) => a.lessonId),
  ]);

  let currentAssigned = false;
  const statusFor = (lessonId: string): "completed" | "current" | "locked" => {
    if (completedIds.has(lessonId)) return "completed";
    if (!currentAssigned) {
      currentAssigned = true;
      return "current";
    }
    return "locked";
  };

  return toCourse(row, (lessonId) => statusFor(lessonId));
}
