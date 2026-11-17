"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { markLessonComplete, submitQuizAttempt } from "@/lib/queries/progress";

export async function markLessonCompleteAction(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated.");

  const lessonId = formData.get("lessonId");
  const courseSlug = formData.get("courseSlug");
  if (typeof lessonId !== "string") return;

  await markLessonComplete(session.user.id, lessonId);

  if (typeof courseSlug === "string") {
    revalidatePath(`/learn/${courseSlug}`);
    revalidatePath("/my-courses");
    revalidatePath("/dashboard");
    revalidatePath("/certificates");
  }
}

export type QuizResult =
  | { ok: true; score: number; passed: boolean; attemptsLeft: number }
  | { ok: false; message: string }
  | undefined;

export async function submitQuizAction(_prev: QuizResult, formData: FormData): Promise<QuizResult> {
  const session = await auth();
  if (!session) return { ok: false, message: "Not authenticated." };

  const lessonId = formData.get("lessonId");
  const courseSlug = formData.get("courseSlug");
  if (typeof lessonId !== "string") return { ok: false, message: "Invalid lesson." };

  const answers: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("question_") && typeof value === "string") {
      answers[key.replace("question_", "")] = value;
    }
  }

  const result = await submitQuizAttempt(session.user.id, lessonId, answers);

  if (typeof courseSlug === "string") {
    revalidatePath(`/learn/${courseSlug}`);
    revalidatePath("/my-courses");
    revalidatePath("/dashboard");
    revalidatePath("/certificates");
  }

  if (!result.ok) return result;
  return { ok: true, score: result.score, passed: result.passed, attemptsLeft: result.attemptsLeft };
}
