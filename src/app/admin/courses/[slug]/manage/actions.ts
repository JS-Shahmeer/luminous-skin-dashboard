"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveLessonFile } from "@/lib/storage";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Not authorized.");
}

export async function addModuleAction(formData: FormData) {
  await requireAdmin();
  const courseId = formData.get("courseId");
  const courseSlug = formData.get("courseSlug");
  const title = formData.get("title");
  if (typeof courseId !== "string" || typeof title !== "string" || !title.trim()) return;

  const count = await prisma.courseModule.count({ where: { courseId } });
  await prisma.courseModule.create({
    data: { courseId, title: title.trim(), position: count },
  });

  if (typeof courseSlug === "string") revalidatePath(`/admin/courses/${courseSlug}/manage`);
}

export async function addLessonAction(formData: FormData) {
  await requireAdmin();
  const moduleId = formData.get("moduleId");
  const courseSlug = formData.get("courseSlug");
  const title = formData.get("title");
  const type = formData.get("type");
  const duration = formData.get("duration");
  if (
    typeof moduleId !== "string" ||
    typeof title !== "string" ||
    !title.trim() ||
    typeof type !== "string" ||
    !["VIDEO", "PDF", "QUIZ"].includes(type) ||
    typeof duration !== "string"
  ) {
    return;
  }

  const count = await prisma.lesson.count({ where: { moduleId } });
  await prisma.lesson.create({
    data: {
      moduleId,
      title: title.trim(),
      type: type as "VIDEO" | "PDF" | "QUIZ",
      duration: duration.trim() || "—",
      position: count,
    },
  });

  if (typeof courseSlug === "string") revalidatePath(`/admin/courses/${courseSlug}/manage`);
}

export async function uploadLessonFileAction(formData: FormData) {
  await requireAdmin();
  const lessonId = formData.get("lessonId");
  const courseSlug = formData.get("courseSlug");
  const file = formData.get("file");
  if (typeof lessonId !== "string" || !(file instanceof File) || file.size === 0) return;

  const relativePath = await saveLessonFile(lessonId, file);
  await prisma.lesson.update({ where: { id: lessonId }, data: { fileUrl: relativePath } });

  if (typeof courseSlug === "string") revalidatePath(`/admin/courses/${courseSlug}/manage`);
}

export type UpdateCourseResult = { ok: boolean; message: string } | undefined;

export async function updateCourseAction(
  _prev: UpdateCourseResult,
  formData: FormData
): Promise<UpdateCourseResult> {
  await requireAdmin();

  const get = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v.trim() : "";
  };

  const courseId = get("courseId");
  const courseSlug = get("courseSlug");
  const title = get("title");
  const format = get("format");
  const price = Number(get("price"));
  const duration = get("duration");
  const level = get("level");
  const category = get("category");
  const summary = get("summary");
  const description = get("description");
  const outcomes = get("outcomes").split("\n").map((s) => s.trim()).filter(Boolean);
  const includes = get("includes").split("\n").map((s) => s.trim()).filter(Boolean);
  const schedule = get("schedule");
  const instructorName = get("instructorName");
  const instructorTitle = get("instructorTitle");

  if (!courseId || !title || !["ONLINE", "IN_CLINIC", "BUNDLE"].includes(format) || !price || !instructorName) {
    return { ok: false, message: "Please fill in all required fields." };
  }

  let instructor = await prisma.instructor.findFirst({ where: { name: instructorName } });
  if (!instructor) {
    instructor = await prisma.instructor.create({
      data: { name: instructorName, title: instructorTitle || "Instructor" },
    });
  }

  await prisma.course.update({
    where: { id: courseId },
    data: {
      title,
      format: format as "ONLINE" | "IN_CLINIC" | "BUNDLE",
      price,
      duration,
      schedule: schedule || null,
      level: level || "Foundation",
      category: category || "General",
      summary,
      description,
      outcomes,
      includes,
      instructorId: instructor.id,
    },
  });

  revalidatePath(`/admin/courses/${courseSlug}/manage`);
  revalidatePath("/admin/courses");
  revalidatePath("/catalog");
  revalidatePath(`/catalog/${courseSlug}`);

  return { ok: true, message: "Course details saved." };
}

export async function deleteModuleAction(formData: FormData) {
  await requireAdmin();
  const moduleId = formData.get("moduleId");
  const courseSlug = formData.get("courseSlug");
  if (typeof moduleId !== "string") return;

  await prisma.courseModule.delete({ where: { id: moduleId } });

  if (typeof courseSlug === "string") revalidatePath(`/admin/courses/${courseSlug}/manage`);
}

export async function deleteLessonAction(formData: FormData) {
  await requireAdmin();
  const lessonId = formData.get("lessonId");
  const courseSlug = formData.get("courseSlug");
  if (typeof lessonId !== "string") return;

  await prisma.lesson.delete({ where: { id: lessonId } });

  if (typeof courseSlug === "string") revalidatePath(`/admin/courses/${courseSlug}/manage`);
}

async function swapPositions<T extends { id: string; position: number }>(
  model: { update: (args: { where: { id: string }; data: { position: number } }) => Promise<unknown> },
  siblings: T[],
  id: string,
  direction: "up" | "down"
) {
  const index = siblings.findIndex((s) => s.id === id);
  if (index === -1) return;
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= siblings.length) return;

  const current = siblings[index];
  const target = siblings[targetIndex];
  await model.update({ where: { id: current.id }, data: { position: target.position } });
  await model.update({ where: { id: target.id }, data: { position: current.position } });
}

export async function moveModuleAction(formData: FormData) {
  await requireAdmin();
  const moduleId = formData.get("moduleId");
  const courseId = formData.get("courseId");
  const courseSlug = formData.get("courseSlug");
  const direction = formData.get("direction");
  if (
    typeof moduleId !== "string" ||
    typeof courseId !== "string" ||
    (direction !== "up" && direction !== "down")
  ) {
    return;
  }

  const siblings = await prisma.courseModule.findMany({
    where: { courseId },
    orderBy: { position: "asc" },
    select: { id: true, position: true },
  });
  await swapPositions(prisma.courseModule, siblings, moduleId, direction);

  if (typeof courseSlug === "string") revalidatePath(`/admin/courses/${courseSlug}/manage`);
}

export async function moveLessonAction(formData: FormData) {
  await requireAdmin();
  const lessonId = formData.get("lessonId");
  const moduleId = formData.get("moduleId");
  const courseSlug = formData.get("courseSlug");
  const direction = formData.get("direction");
  if (
    typeof lessonId !== "string" ||
    typeof moduleId !== "string" ||
    (direction !== "up" && direction !== "down")
  ) {
    return;
  }

  const siblings = await prisma.lesson.findMany({
    where: { moduleId },
    orderBy: { position: "asc" },
    select: { id: true, position: true },
  });
  await swapPositions(prisma.lesson, siblings, lessonId, direction);

  if (typeof courseSlug === "string") revalidatePath(`/admin/courses/${courseSlug}/manage`);
}
