"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Not authorized.");
}

export async function addQuizQuestionAction(formData: FormData) {
  await requireAdmin();
  const lessonId = formData.get("lessonId");
  const courseSlug = formData.get("courseSlug");
  const text = formData.get("text");
  const correctIndex = Number(formData.get("correctIndex"));
  const choices = [
    formData.get("choice0"),
    formData.get("choice1"),
    formData.get("choice2"),
    formData.get("choice3"),
  ];

  if (
    typeof lessonId !== "string" ||
    typeof text !== "string" ||
    !text.trim() ||
    choices.some((c) => typeof c !== "string" || !c.trim()) ||
    Number.isNaN(correctIndex)
  ) {
    return;
  }

  const position = await prisma.quizQuestion.count({ where: { lessonId } });
  await prisma.quizQuestion.create({
    data: {
      lessonId,
      text: text.trim(),
      position,
      choices: {
        create: choices.map((c, i) => ({
          text: (c as string).trim(),
          isCorrect: i === correctIndex,
          position: i,
        })),
      },
    },
  });

  if (typeof courseSlug === "string") {
    revalidatePath(`/admin/courses/${courseSlug}/manage/quiz/${lessonId}`);
    revalidatePath(`/admin/courses/${courseSlug}/manage`);
  }
}

export async function deleteQuizQuestionAction(formData: FormData) {
  await requireAdmin();
  const questionId = formData.get("questionId");
  const courseSlug = formData.get("courseSlug");
  const lessonId = formData.get("lessonId");
  if (typeof questionId !== "string") return;

  await prisma.quizQuestion.delete({ where: { id: questionId } });

  if (typeof courseSlug === "string" && typeof lessonId === "string") {
    revalidatePath(`/admin/courses/${courseSlug}/manage/quiz/${lessonId}`);
    revalidatePath(`/admin/courses/${courseSlug}/manage`);
  }
}
