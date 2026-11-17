import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

const PASS_MARK = 80;
const MAX_QUIZ_ATTEMPTS = 3;

function generateCredentialId(courseTitle: string) {
  const code = courseTitle
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");
  const digits = Math.floor(10000 + Math.random() * 90000);
  return `LSK-${code}-${digits}`;
}

async function issueCertificateIfNeeded(userId: string, courseId: string) {
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return existing;

  const [user, course] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.course.findUniqueOrThrow({ where: { id: courseId } }),
  ]);

  let credentialId = generateCredentialId(course.title);
  // Extremely unlikely collision, but guard anyway.
  for (let i = 0; i < 5; i++) {
    const clash = await prisma.certificate.findUnique({ where: { credentialId } });
    if (!clash) break;
    credentialId = generateCredentialId(course.title);
  }

  const certificate = await prisma.certificate.create({
    data: { userId, courseId, credentialId },
  });

  await sendMail({
    to: user.email,
    subject: `Your certificate for ${course.title} is ready`,
    html: `
      <p>Hi ${user.name},</p>
      <p>Congratulations — you've completed <strong>${course.title}</strong>.</p>
      <p>Your certificate credential ID is <strong>${credentialId}</strong>. You can view and download it from your
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/certificates">certificates page</a>.</p>
      <p>— Luminous SKN Academy</p>
    `,
  });

  return certificate;
}

/** Recomputes an enrollment's progress from real lesson completion / quiz pass state, and issues a certificate if the course just became fully complete. */
export async function recalculateEnrollmentProgress(userId: string, courseId: string) {
  const lessons = await prisma.lesson.findMany({
    where: { module: { courseId } },
    select: { id: true, type: true },
  });
  if (lessons.length === 0) return;

  const [completedProgress, passedAttempts] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: lessons.map((l) => l.id) }, completedAt: { not: null } },
      select: { lessonId: true },
    }),
    prisma.quizAttempt.findMany({
      where: { userId, lessonId: { in: lessons.map((l) => l.id) }, passed: true },
      select: { lessonId: true },
    }),
  ]);

  const doneIds = new Set([
    ...completedProgress.map((p) => p.lessonId),
    ...passedAttempts.map((a) => a.lessonId),
  ]);
  const doneCount = lessons.filter((l) => doneIds.has(l.id)).length;
  const progress = Math.round((doneCount / lessons.length) * 100);
  const isComplete = doneCount === lessons.length;

  await prisma.enrollment.update({
    where: { userId_courseId: { userId, courseId } },
    data: {
      progress,
      lastActivityAt: new Date(),
      status: isComplete ? "COMPLETED" : undefined,
    },
  });

  if (isComplete) {
    await issueCertificateIfNeeded(userId, courseId);
  }
}

export async function markLessonComplete(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUniqueOrThrow({
    where: { id: lessonId },
    select: { module: { select: { courseId: true } } },
  });

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, completedAt: new Date() },
    update: { completedAt: new Date() },
  });

  await recalculateEnrollmentProgress(userId, lesson.module.courseId);
}

export async function submitQuizAttempt(
  userId: string,
  lessonId: string,
  selectedChoiceIdsByQuestion: Record<string, string>
) {
  const lesson = await prisma.lesson.findUniqueOrThrow({
    where: { id: lessonId },
    include: {
      module: { select: { courseId: true } },
      quizQuestions: { include: { choices: true } },
      quizAttempts: { where: { userId } },
    },
  });

  const alreadyPassed = lesson.quizAttempts.some((a) => a.passed);
  if (alreadyPassed) {
    return { ok: false as const, message: "You've already passed this quiz." };
  }
  if (lesson.quizAttempts.length >= MAX_QUIZ_ATTEMPTS) {
    return { ok: false as const, message: "No attempts remaining for this quiz." };
  }

  let correct = 0;
  for (const question of lesson.quizQuestions) {
    const selectedId = selectedChoiceIdsByQuestion[question.id];
    const correctChoice = question.choices.find((c) => c.isCorrect);
    if (selectedId && correctChoice && selectedId === correctChoice.id) correct++;
  }
  const total = lesson.quizQuestions.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = score >= PASS_MARK;

  await prisma.quizAttempt.create({
    data: { userId, lessonId, score, passed },
  });

  if (passed) {
    await recalculateEnrollmentProgress(userId, lesson.module.courseId);
  }

  const attemptsLeft = MAX_QUIZ_ATTEMPTS - lesson.quizAttempts.length - 1;
  return { ok: true as const, score, passed, attemptsLeft };
}

export interface QuizView {
  lessonId: string;
  questions: { id: string; text: string; choices: { id: string; text: string }[] }[];
  attemptsUsed: number;
  attemptsLeft: number;
  passed: boolean;
  bestScore: number | null;
}

export async function getQuizForLesson(lessonId: string, userId: string): Promise<QuizView | null> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      quizQuestions: {
        orderBy: { position: "asc" },
        include: { choices: { orderBy: { position: "asc" }, select: { id: true, text: true } } },
      },
      quizAttempts: { where: { userId } },
    },
  });
  if (!lesson || lesson.type !== "QUIZ") return null;

  const passed = lesson.quizAttempts.some((a) => a.passed);
  const bestScore = lesson.quizAttempts.length
    ? Math.max(...lesson.quizAttempts.map((a) => a.score))
    : null;

  return {
    lessonId,
    questions: lesson.quizQuestions.map((q) => ({
      id: q.id,
      text: q.text,
      choices: q.choices,
    })),
    attemptsUsed: lesson.quizAttempts.length,
    attemptsLeft: Math.max(0, MAX_QUIZ_ATTEMPTS - lesson.quizAttempts.length),
    passed,
    bestScore,
  };
}

export { PASS_MARK, MAX_QUIZ_ATTEMPTS };
