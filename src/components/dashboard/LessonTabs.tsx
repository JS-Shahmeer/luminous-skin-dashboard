"use client";

import { useActionState } from "react";
import { AlertTriangle, CheckCircle2, Download, FileText, HelpCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { Course } from "@/types/models";
import type { QuizView } from "@/lib/queries/progress";
import { markLessonCompleteAction, submitQuizAction } from "@/app/(student)/learn/[slug]/actions";
import { useState } from "react";

const tabs = ["Overview", "Resources", "Quiz", "Notes"] as const;
type Tab = (typeof tabs)[number];

export function LessonTabs({
  course,
  courseSlug,
  currentLessonId,
  currentLessonStatus,
  currentLessonType,
  quiz,
}: {
  course: Course;
  courseSlug: string;
  currentLessonId: string;
  currentLessonStatus: "completed" | "current" | "locked";
  currentLessonType: "video" | "pdf" | "quiz";
  quiz: QuizView | null;
}) {
  const [active, setActive] = useState<Tab>("Overview");
  const pdfResources = course.modules.flatMap((m) => m.lessons.filter((l) => l.type === "pdf"));
  const quizLessonMeta = course.modules.flatMap((m) => m.lessons).find((l) => l.type === "quiz");
  const [quizResult, quizAction, quizPending] = useActionState(submitQuizAction, undefined);

  return (
    <div className="rounded-lg border border-line bg-charcoal">
      <div className="flex border-b border-line px-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "relative px-4 py-4 text-sm font-medium transition-colors",
              active === tab ? "text-cream" : "text-beige hover:text-cream"
            )}
          >
            {tab}
            {active === tab && <span className="absolute inset-x-4 -bottom-px h-0.5 bg-gold" />}
          </button>
        ))}
      </div>

      <div className="p-6">
        {active === "Overview" && (
          <div className="space-y-5">
            <div>
              <h3 className="font-serif text-lg text-cream">About this lesson</h3>
              <p className="mt-2 text-sm leading-relaxed text-beige">
                {course.description}
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-md border border-rust/30 bg-rust/5 p-4">
              <AlertTriangle size={17} className="mt-0.5 shrink-0 text-rust" />
              <div>
                <p className="text-sm text-cream">Contraindications apply</p>
                <p className="mt-1 text-xs leading-relaxed text-beige">
                  Review the consultation and contraindications material before performing this
                  treatment on a client. Always patch test where indicated.
                </p>
              </div>
            </div>

            {currentLessonType === "quiz" ? (
              <p className="text-sm text-beige">Head to the Quiz tab to complete this assessment.</p>
            ) : currentLessonStatus === "completed" ? (
              <div className="flex items-center gap-2 text-sm text-sage">
                <CheckCircle2 size={16} /> Lesson complete
              </div>
            ) : (
              <form action={markLessonCompleteAction}>
                <input type="hidden" name="lessonId" value={currentLessonId} />
                <input type="hidden" name="courseSlug" value={courseSlug} />
                <Button type="submit" icon={<CheckCircle2 size={15} />} size="sm">
                  Mark Lesson as Complete
                </Button>
              </form>
            )}
          </div>
        )}

        {active === "Resources" && (
          <div className="space-y-3">
            <h3 className="font-serif text-lg text-cream">Downloadable resources</h3>
            {pdfResources.map((r) => (
              <div
                key={r.title}
                className="flex items-center justify-between gap-3 rounded-md border border-line bg-ink/40 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold/10 text-gold">
                    <FileText size={17} />
                  </span>
                  <div>
                    <p className="text-sm text-cream">{r.title}</p>
                    <p className="text-xs text-beige">
                      {r.duration} · PDF{!r.hasFile && " · not uploaded yet"}
                    </p>
                  </div>
                </div>
                {r.hasFile ? (
                  <Button
                    href={`/api/media/${r.id}`}
                    variant="ghost"
                    size="sm"
                    icon={<Download size={14} />}
                  >
                    Download
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" icon={<Download size={14} />} disabled>
                    Download
                  </Button>
                )}
              </div>
            ))}
            {pdfResources.length === 0 && (
              <p className="text-sm text-beige">No downloadable resources for this course yet.</p>
            )}
          </div>
        )}

        {active === "Quiz" && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-cream">Knowledge check</h3>
            {!quizLessonMeta ? (
              <p className="text-sm text-beige">This course has no assessment.</p>
            ) : !quiz ? (
              <div className="rounded-md border border-gold/25 bg-gold/5 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <Lock size={17} />
                  </span>
                  <div>
                    <p className="text-sm text-cream">{quizLessonMeta.title}</p>
                    <p className="text-xs text-beige">{quizLessonMeta.duration} · Pass mark 80%</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-beige">
                  Complete every other lesson first to unlock this assessment. You can retake it up
                  to three times — your certificate is issued automatically on a passing score.
                </p>
              </div>
            ) : quiz.passed ? (
              <div className="flex items-center gap-3 rounded-md border border-sage/30 bg-sage/5 p-5 text-sage">
                <CheckCircle2 size={20} />
                <div>
                  <p className="text-sm">Quiz passed — best score {quiz.bestScore}%</p>
                  <p className="text-xs text-beige">Your certificate has been issued.</p>
                </div>
              </div>
            ) : quiz.attemptsLeft === 0 ? (
              <div className="flex items-center gap-3 rounded-md border border-rust/30 bg-rust/5 p-5 text-rust">
                <HelpCircle size={20} />
                <p className="text-sm">No attempts remaining. Contact the academy for a reset.</p>
              </div>
            ) : (
              <form action={quizAction} className="space-y-5">
                <input type="hidden" name="lessonId" value={quiz.lessonId} />
                <input type="hidden" name="courseSlug" value={courseSlug} />
                {quiz.questions.map((q, qi) => (
                  <div key={q.id} className="rounded-md border border-line bg-ink/40 p-4">
                    <p className="text-sm text-cream">
                      {qi + 1}. {q.text}
                    </p>
                    <div className="mt-3 space-y-2">
                      {q.choices.map((c) => (
                        <label key={c.id} className="flex items-center gap-2.5 text-sm text-beige">
                          <input
                            type="radio"
                            name={`question_${q.id}`}
                            value={c.id}
                            required
                            className="accent-[#C6A875]"
                          />
                          {c.text}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                {quizResult && !quizResult.ok && (
                  <p className="text-sm text-rust">{quizResult.message}</p>
                )}
                {quizResult && quizResult.ok && (
                  <p className={cn("text-sm", quizResult.passed ? "text-sage" : "text-rust")}>
                    Scored {quizResult.score}% —{" "}
                    {quizResult.passed
                      ? "passed!"
                      : `not quite there. ${quizResult.attemptsLeft} attempt(s) left.`}
                  </p>
                )}
                <Button type="submit" size="sm" disabled={quizPending}>
                  {quizPending ? "Submitting…" : `Submit (${quiz.attemptsLeft} attempt(s) left)`}
                </Button>
              </form>
            )}
          </div>
        )}

        {active === "Notes" && (
          <div className="space-y-3">
            <h3 className="font-serif text-lg text-cream">My notes</h3>
            <textarea
              rows={7}
              placeholder="Add private notes for this lesson…"
              className="w-full resize-none rounded-md border border-line bg-ink/40 p-4 text-sm text-cream placeholder:text-beige/60 focus:border-gold/50 focus:outline-none"
            />
            <Button size="sm" variant="outline">
              Save Notes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
