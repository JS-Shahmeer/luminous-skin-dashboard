import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { addQuizQuestionAction, deleteQuizQuestionAction } from "./actions";

export default async function ManageQuizPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      quizQuestions: {
        orderBy: { position: "asc" },
        include: { choices: { orderBy: { position: "asc" } } },
      },
    },
  });
  if (!lesson || lesson.type !== "QUIZ") notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Manage · Quiz"
        title={lesson.title}
        description="Each question needs exactly 4 choices, with one marked correct. Pass mark is 80%."
      />

      <div className="space-y-4">
        {lesson.quizQuestions.map((q, qi) => (
          <div key={q.id} className="rounded-lg border border-line bg-charcoal p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-cream">
                {qi + 1}. {q.text}
              </p>
              <form action={deleteQuizQuestionAction}>
                <input type="hidden" name="questionId" value={q.id} />
                <input type="hidden" name="courseSlug" value={slug} />
                <input type="hidden" name="lessonId" value={lessonId} />
                <button type="submit" className="text-beige hover:text-rust" aria-label="Delete question">
                  <Trash2 size={15} />
                </button>
              </form>
            </div>
            <div className="mt-3 space-y-1.5">
              {q.choices.map((c) => (
                <p
                  key={c.id}
                  className={c.isCorrect ? "text-sm text-sage" : "text-sm text-beige"}
                >
                  {c.isCorrect ? "✓ " : "— "}
                  {c.text}
                </p>
              ))}
            </div>
          </div>
        ))}
        {lesson.quizQuestions.length === 0 && (
          <p className="text-sm text-beige">No questions yet — add the first one below.</p>
        )}
      </div>

      <form action={addQuizQuestionAction} className="space-y-4 rounded-lg border border-dashed border-line p-5">
        <input type="hidden" name="lessonId" value={lessonId} />
        <input type="hidden" name="courseSlug" value={slug} />
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-beige">
            Question
          </span>
          <input
            name="text"
            required
            className="w-full rounded-sm border border-line bg-ink/40 px-3.5 py-2.5 text-sm text-cream placeholder:text-beige/60 focus:border-gold/50 focus:outline-none"
            placeholder="e.g. What is the recommended patch-test duration?"
          />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <label key={i} className="flex items-center gap-2.5">
              <input type="radio" name="correctIndex" value={i} required className="accent-[#C6A875]" />
              <input
                name={`choice${i}`}
                required
                placeholder={`Choice ${i + 1}`}
                className="w-full rounded-sm border border-line bg-ink/40 px-3 py-2 text-sm text-cream placeholder:text-beige/60 focus:border-gold/50 focus:outline-none"
              />
            </label>
          ))}
        </div>
        <p className="text-xs text-beige/70">Select the radio button next to the correct choice.</p>
        <Button type="submit" size="sm">
          Add Question
        </Button>
      </form>
    </div>
  );
}
