import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUp, FileText, HelpCircle, PlayCircle, Settings2, Trash2, Upload } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { prisma } from "@/lib/prisma";
import {
  addLessonAction,
  addModuleAction,
  deleteLessonAction,
  deleteModuleAction,
  moveLessonAction,
  moveModuleAction,
  uploadLessonFileAction,
} from "./actions";
import { EditCourseForm } from "./EditCourseForm";

const lessonIcon = { VIDEO: PlayCircle, PDF: FileText, QUIZ: HelpCircle };

export default async function ManageCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: true,
      modules: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
            include: { _count: { select: { quizQuestions: true } } },
          },
        },
      },
    },
  });
  if (!course) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Manage"
        title={course.title}
        description={`${course.modules.length} modules · taught by ${course.instructor.name}`}
      />

      <EditCourseForm
        course={{
          id: course.id,
          slug: course.slug,
          title: course.title,
          format: course.format,
          price: course.price,
          duration: course.duration,
          level: course.level,
          category: course.category,
          schedule: course.schedule,
          summary: course.summary,
          description: course.description,
          outcomes: course.outcomes as string[],
          includes: course.includes as string[],
          instructorName: course.instructor.name,
          instructorTitle: course.instructor.title,
        }}
      />

      <div className="space-y-5">
        {course.modules.map((module, mi) => (
          <div key={module.id} className="rounded-lg border border-line bg-charcoal">
            <div className="flex items-center justify-between gap-3 border-b border-line p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-xs text-beige">
                  {mi + 1}
                </span>
                <p className="text-sm text-cream">{module.title}</p>
              </div>
              <div className="flex items-center gap-1">
                <form action={moveModuleAction}>
                  <input type="hidden" name="moduleId" value={module.id} />
                  <input type="hidden" name="courseId" value={course.id} />
                  <input type="hidden" name="courseSlug" value={slug} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={mi === 0}
                    className="p-1.5 text-beige hover:text-gold disabled:opacity-30"
                    aria-label="Move module up"
                  >
                    <ArrowUp size={14} />
                  </button>
                </form>
                <form action={moveModuleAction}>
                  <input type="hidden" name="moduleId" value={module.id} />
                  <input type="hidden" name="courseId" value={course.id} />
                  <input type="hidden" name="courseSlug" value={slug} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={mi === course.modules.length - 1}
                    className="p-1.5 text-beige hover:text-gold disabled:opacity-30"
                    aria-label="Move module down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </form>
                <form action={deleteModuleAction}>
                  <input type="hidden" name="moduleId" value={module.id} />
                  <input type="hidden" name="courseSlug" value={slug} />
                  <ConfirmSubmitButton
                    confirmMessage={`Delete module "${module.title}" and all its lessons? This can't be undone.`}
                    className="p-1.5 hover:text-rust"
                    aria-label="Delete module"
                  >
                    <Trash2 size={14} />
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>

            <div className="divide-y divide-line">
              {module.lessons.map((lesson, li) => {
                const Icon = lessonIcon[lesson.type];
                return (
                  <div key={lesson.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className="text-beige" />
                      <span className="text-sm text-cream">{lesson.title}</span>
                      <span className="text-xs text-beige/70">{lesson.duration}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {lesson.type !== "QUIZ" &&
                        (lesson.fileUrl ? (
                          <Badge tone="sage">File uploaded</Badge>
                        ) : (
                          <Badge tone="outline">No file yet</Badge>
                        ))}
                      {lesson.type !== "QUIZ" ? (
                        <form action={uploadLessonFileAction} className="flex items-center gap-2">
                          <input type="hidden" name="lessonId" value={lesson.id} />
                          <input type="hidden" name="courseSlug" value={slug} />
                          <input
                            type="file"
                            name="file"
                            accept={lesson.type === "VIDEO" ? "video/*" : "application/pdf"}
                            required
                            className="text-xs text-beige file:mr-2 file:rounded-sm file:border file:border-line file:bg-ink/40 file:px-2.5 file:py-1.5 file:text-xs file:text-cream"
                          />
                          <button
                            type="submit"
                            className="flex items-center gap-1 rounded-sm border border-line px-2.5 py-1.5 text-xs text-beige hover:border-gold/50 hover:text-gold"
                          >
                            <Upload size={12} /> Upload
                          </button>
                        </form>
                      ) : (
                        <Link
                          href={`/admin/courses/${slug}/manage/quiz/${lesson.id}`}
                          className="flex items-center gap-1.5 rounded-sm border border-line px-2.5 py-1.5 text-xs text-beige hover:border-gold/50 hover:text-gold"
                        >
                          <Settings2 size={12} /> {lesson._count.quizQuestions} question(s)
                        </Link>
                      )}

                      <div className="flex items-center gap-0.5 border-l border-line pl-2">
                        <form action={moveLessonAction}>
                          <input type="hidden" name="lessonId" value={lesson.id} />
                          <input type="hidden" name="moduleId" value={module.id} />
                          <input type="hidden" name="courseSlug" value={slug} />
                          <input type="hidden" name="direction" value="up" />
                          <button
                            type="submit"
                            disabled={li === 0}
                            className="p-1 text-beige hover:text-gold disabled:opacity-30"
                            aria-label="Move lesson up"
                          >
                            <ArrowUp size={13} />
                          </button>
                        </form>
                        <form action={moveLessonAction}>
                          <input type="hidden" name="lessonId" value={lesson.id} />
                          <input type="hidden" name="moduleId" value={module.id} />
                          <input type="hidden" name="courseSlug" value={slug} />
                          <input type="hidden" name="direction" value="down" />
                          <button
                            type="submit"
                            disabled={li === module.lessons.length - 1}
                            className="p-1 text-beige hover:text-gold disabled:opacity-30"
                            aria-label="Move lesson down"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </form>
                        <form action={deleteLessonAction}>
                          <input type="hidden" name="lessonId" value={lesson.id} />
                          <input type="hidden" name="courseSlug" value={slug} />
                          <ConfirmSubmitButton
                            confirmMessage={`Delete lesson "${lesson.title}"? This can't be undone.`}
                            className="p-1 hover:text-rust"
                            aria-label="Delete lesson"
                          >
                            <Trash2 size={13} />
                          </ConfirmSubmitButton>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form action={addLessonAction} className="flex flex-wrap items-end gap-3 border-t border-line p-4">
              <input type="hidden" name="moduleId" value={module.id} />
              <input type="hidden" name="courseSlug" value={slug} />
              <input
                name="title"
                required
                placeholder="New lesson title"
                className="min-w-48 flex-1 rounded-sm border border-line bg-ink/40 px-3 py-2 text-sm text-cream placeholder:text-beige/60 focus:border-gold/50 focus:outline-none"
              />
              <select
                name="type"
                defaultValue="VIDEO"
                className="rounded-sm border border-line bg-ink/40 px-3 py-2 text-sm text-cream focus:border-gold/50 focus:outline-none"
              >
                <option value="VIDEO">Video</option>
                <option value="PDF">PDF</option>
                <option value="QUIZ">Quiz</option>
              </select>
              <input
                name="duration"
                placeholder="e.g. 12 min"
                className="w-28 rounded-sm border border-line bg-ink/40 px-3 py-2 text-sm text-cream placeholder:text-beige/60 focus:border-gold/50 focus:outline-none"
              />
              <Button type="submit" size="sm" variant="outline">
                Add Lesson
              </Button>
            </form>
          </div>
        ))}
      </div>

      <form action={addModuleAction} className="flex items-end gap-3 rounded-lg border border-dashed border-line p-4">
        <input type="hidden" name="courseId" value={course.id} />
        <input type="hidden" name="courseSlug" value={slug} />
        <input
          name="title"
          required
          placeholder="New module title"
          className="flex-1 rounded-sm border border-line bg-ink/40 px-3 py-2 text-sm text-cream placeholder:text-beige/60 focus:border-gold/50 focus:outline-none"
        />
        <Button type="submit" size="sm">
          Add Module
        </Button>
      </form>
    </div>
  );
}
