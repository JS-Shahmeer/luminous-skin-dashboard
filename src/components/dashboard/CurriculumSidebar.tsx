import { CheckCircle2, FileText, HelpCircle, Lock, PlayCircle } from "lucide-react";
import type { Course, Lesson } from "@/types/models";
import { cn } from "@/lib/utils";

const lessonIcon: Record<Lesson["type"], typeof PlayCircle> = {
  video: PlayCircle,
  pdf: FileText,
  quiz: HelpCircle,
};

export function CurriculumSidebar({ course }: { course: Course }) {
  return (
    <div className="rounded-lg border border-line bg-charcoal">
      <div className="border-b border-line p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-beige">Course Content</p>
        <p className="mt-1 font-serif text-lg text-cream">{course.title}</p>
      </div>

      <div className="max-h-[520px] overflow-y-auto">
        {course.modules.map((module, mi) => (
          <div key={module.title} className="border-b border-line last:border-none">
            <p className="px-4 pt-3 pb-2 text-xs font-medium text-beige">
              {mi + 1}. {module.title}
            </p>
            <div className="pb-2">
              {module.lessons.map((lesson) => {
                const Icon = lessonIcon[lesson.type];
                const isCompleted = lesson.status === "completed";
                const isCurrent = lesson.status === "current";
                const isLocked = lesson.status === "locked";
                return (
                  <button
                    key={lesson.title}
                    disabled={isLocked}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                      isCurrent && "bg-gold/10",
                      !isLocked && !isCurrent && "hover:bg-white/[0.03]",
                      isLocked && "cursor-not-allowed opacity-50"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="shrink-0 text-gold" />
                    ) : isLocked ? (
                      <Lock size={14} className="shrink-0 text-beige" />
                    ) : (
                      <Icon size={16} className="shrink-0 text-gold" />
                    )}
                    <span className={cn("flex-1 truncate", isCurrent ? "text-cream" : "text-beige")}>
                      {lesson.title}
                    </span>
                    <span className="shrink-0 text-[11px] text-beige/70">{lesson.duration}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
