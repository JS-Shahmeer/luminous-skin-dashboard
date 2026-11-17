"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteLessonFiles } from "@/lib/storage";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Not authorized.");
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdmin();
  const slug = formData.get("courseSlug");
  if (typeof slug !== "string") return;

  const course = await prisma.course.findUnique({ where: { slug }, select: { id: true } });
  if (!course) return;

  // Deleting a Course cascades to Enrollment/Order/Certificate rows (see schema.prisma) —
  // never let that happen to a course with real students or payment history. The UI
  // already hides the delete option in that case; this is the server-side backstop.
  const [enrollmentCount, orderCount] = await Promise.all([
    prisma.enrollment.count({ where: { courseId: course.id } }),
    prisma.order.count({ where: { courseId: course.id } }),
  ]);
  if (enrollmentCount > 0 || orderCount > 0) return;

  const lessons = await prisma.lesson.findMany({
    where: { module: { courseId: course.id } },
    select: { id: true },
  });

  await prisma.course.delete({ where: { id: course.id } }); // cascades modules + lessons

  await Promise.all(lessons.map((l) => deleteLessonFiles(l.id)));

  revalidatePath("/admin/courses");
  revalidatePath("/catalog");
}
