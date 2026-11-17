import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";
import type { PrismaClient } from "@prisma/client";

/**
 * Populates Intimate Lightening with the client's own real course material —
 * provided directly by her (consultation forms, protocol sheets, treatment-step
 * videos, and the real final quiz). Not placeholder content.
 *
 * Video-to-lesson mapping is inferred, not verified: the peel protocol has 6 steps
 * and the laser protocol has 8 (6+8=14, exactly matching the 14 provided video
 * files), so video1–6 are assumed to be the peel steps in order and video7–14 the
 * laser steps in order. Nobody has watched the videos to confirm this — verify via
 * the admin manage page and reorder/relabel if wrong (points 1 on Module 5 built
 * exactly this capability).
 */

const ASSETS_DIR = path.resolve(process.cwd(), "prisma/seed-data/assets/intimate-lightening");

// Maps each PDF lesson title to the source image(s) that make up its pages, in order.
const pdfPageMap: Record<string, string[]> = {
  "Intake Consultation Form": ["image8.jpeg", "image7.jpeg"],
  "Consultation & Consent Form": ["image1.jpeg"],
  "Contraindications & Client Checklists": ["image9.jpeg", "image10.jpeg"],
  "Safety, Complications & When to Refer": ["image4.jpeg"],
  "Treatment Protocol — Peel Selection & Application": ["image6.jpeg"],
  "Peels to Purchase — Product Guide": ["image11.jpeg"],
  "Advanced Laser Protocol Guide": ["image5.jpeg"],
  "Aftercare Instructions": ["image3.jpeg", "image2.jpeg"],
  "Client Treatment Record Template": ["image12.jpeg"],
  "Treatment Intervals & Progress Photography Guide": ["image13.jpeg"],
};

// Peel protocol (6 steps) then laser protocol (8 steps), in filename order.
const videoOrder = [
  "video1.mp4",
  "video2.mp4",
  "video3.mp4",
  "video4.mp4",
  "video5.mp4",
  "video6.mp4",
  "video7.mp4",
  "video8.mp4",
  "video9.mp4",
  "video10.mp4",
  "video11.mp4",
  "video12.mp4",
  "video13.mp4",
  "video14.mp4",
];

async function imageToPdf(imageFilenames: string[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (const filename of imageFilenames) {
    const bytes = await readFile(path.join(ASSETS_DIR, "images", filename));
    const jpg = await doc.embedJpg(bytes);
    const page = doc.addPage([jpg.width, jpg.height]);
    page.drawImage(jpg, { x: 0, y: 0, width: jpg.width, height: jpg.height });
  }
  return doc.save();
}

export async function populateIntimateLighteningRealContent(
  prisma: PrismaClient,
  lessons: { id: string; type: string; title: string }[]
) {
  const uploadsDir = path.resolve(process.cwd(), process.env.STORAGE_DIR ?? "./storage", "uploads");

  const videoLessons = lessons.filter((l) => l.type === "VIDEO");
  if (videoLessons.length !== videoOrder.length) {
    throw new Error(
      `Expected ${videoOrder.length} video lessons for Intimate Lightening, found ${videoLessons.length}. Did the course structure change without updating this seeder?`
    );
  }

  for (let i = 0; i < videoLessons.length; i++) {
    const lesson = videoLessons[i];
    const sourceFile = path.join(ASSETS_DIR, "videos", videoOrder[i]);
    const dir = path.join(uploadsDir, lesson.id);
    await mkdir(dir, { recursive: true });
    const destFilename = "lesson-video.mp4";
    await writeFile(path.join(dir, destFilename), await readFile(sourceFile));
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: { fileUrl: path.join(lesson.id, destFilename) },
    });
  }

  for (const lesson of lessons.filter((l) => l.type === "PDF")) {
    const pages = pdfPageMap[lesson.title];
    if (!pages) continue;
    const pdfBytes = await imageToPdf(pages);
    const dir = path.join(uploadsDir, lesson.id);
    await mkdir(dir, { recursive: true });
    const destFilename = "lesson.pdf";
    await writeFile(path.join(dir, destFilename), pdfBytes);
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: { fileUrl: path.join(lesson.id, destFilename) },
    });
  }
}

// The real "Final Knowledge Check" — extracted from the client's own quiz sheet.
// Correct answers determined from the surrounding course material (Fitzpatrick
// assessment emphasis, the treatment-interval table, the burns/blistering
// protocol, etc.) — not independently verified by the client, worth a quick
// read-through before this goes live for real students.
export const realQuizQuestions: { text: string; choices: string[]; correctIndex: number }[] = [
  {
    text: "What is the most important factor to assess before treatment?",
    choices: ["Client's age", "Fitzpatrick skin type", "Pain tolerance", "Previous laser"],
    correctIndex: 1,
  },
  {
    text: "Which of the following is a contraindication to treatment?",
    choices: ["Mild pigmentation", "Pregnancy", "Uneven skin tone", "Dry skin"],
    correctIndex: 1,
  },
  {
    text: "How long should you wait before repeating a TCA peel?",
    choices: ["2 weeks", "4 weeks", "6–8 weeks", "12 weeks"],
    correctIndex: 2,
  },
  {
    text: "What is the main risk of treating darker skin types?",
    choices: ["Redness", "Hypopigmentation", "PIH", "Dryness"],
    correctIndex: 2,
  },
  {
    text: "Which aftercare instruction is most important?",
    choices: ["Exfoliate daily", "Avoid sun exposure", "Use retinol", "Exercise daily"],
    correctIndex: 1,
  },
  {
    text: "Which laser wavelength is commonly used for deeper pigmentation?",
    choices: ["532 nm", "755 nm", "1064 nm", "1927 nm"],
    correctIndex: 2,
  },
  {
    text: "How many sessions are usually required for laser treatments?",
    choices: ["1", "2", "3–6", "10+"],
    correctIndex: 2,
  },
  {
    text: "What should you do if the client develops blistering after treatment?",
    choices: [
      "Continue as planned",
      "Advise exfoliation",
      "Stop treatment and manage appropriately or refer",
      "Increase settings next time",
    ],
    correctIndex: 2,
  },
  {
    text: "Why is standardised progress photography important?",
    choices: [
      "For social media only",
      "To compare results and guide treatment",
      "To make the skin look better",
      "It is not necessary",
    ],
    correctIndex: 1,
  },
  {
    text: "What is the purpose of a manufacturer's manual?",
    choices: [
      "Marketing information",
      "Treatment pricing",
      "Safety guidelines, correct settings and device use",
      "Client aftercare products",
    ],
    correctIndex: 2,
  },
];

export async function populateIntimateLighteningQuiz(prisma: PrismaClient, quizLessonId: string) {
  for (let qi = 0; qi < realQuizQuestions.length; qi++) {
    const q = realQuizQuestions[qi];
    await prisma.quizQuestion.create({
      data: {
        lessonId: quizLessonId,
        text: q.text,
        position: qi,
        choices: {
          create: q.choices.map((text, ci) => ({ text, isCorrect: ci === q.correctIndex, position: ci })),
        },
      },
    });
  }
}
