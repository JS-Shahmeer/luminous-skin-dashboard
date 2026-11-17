"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: boolean; message: string } | undefined;

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCourseAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return { ok: false, message: "Not authorized." };

  const get = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v.trim() : "";
  };

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

  if (!title || !["ONLINE", "IN_CLINIC", "BUNDLE"].includes(format) || !price || !instructorName) {
    return { ok: false, message: "Please fill in all required fields." };
  }

  const slug = slugify(title);
  const existing = await prisma.course.findUnique({ where: { slug } });
  if (existing) return { ok: false, message: "A course with this title already exists." };

  let instructor = await prisma.instructor.findFirst({ where: { name: instructorName } });
  if (!instructor) {
    instructor = await prisma.instructor.create({
      data: { name: instructorName, title: instructorTitle || "Instructor" },
    });
  }

  await prisma.course.create({
    data: {
      slug,
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

  redirect(`/admin/courses/${slug}/manage`);
}
