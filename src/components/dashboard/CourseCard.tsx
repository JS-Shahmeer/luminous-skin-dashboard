import { ArrowRight, Building2, Clock, Play, Star, Users } from "lucide-react";
import type { Course, Enrollment } from "@/types/models";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils";

const formatLabel: Record<Course["format"], string> = {
  online: "Online Course",
  "in-clinic": "In-Clinic Program",
  bundle: "Course + Device",
};

function CourseThumb({ course }: { course: Course }) {
  return (
    <div
      className={`relative flex h-36 items-center justify-center overflow-hidden rounded-t-lg border-b border-line bg-gradient-to-br ${course.accent} via-charcoal to-charcoal`}
    >
      <span className="font-serif text-6xl text-cream/10">
        {course.title.charAt(0)}
      </span>
      <div className="absolute left-3 top-3">
        <Badge tone={course.format === "online" ? "outline" : "gold"}>
          {course.format === "in-clinic" ? <Building2 size={11} /> : null}
          {formatLabel[course.format]}
        </Badge>
      </div>
    </div>
  );
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-line bg-charcoal transition-colors hover:border-gold/40">
      <CourseThumb course={course} />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">
          {course.category}
        </p>
        <h3 className="mt-1.5 font-serif text-xl leading-snug text-cream">{course.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-beige">
          {course.summary}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-beige">
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} /> {course.studentsEnrolled}
          </span>
          <span className="flex items-center gap-1.5 text-gold">
            <Star size={13} fill="currentColor" /> {course.rating}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="font-serif text-2xl text-cream">
            {formatCurrency(course.price)}
            {course.format === "in-clinic" && (
              <span className="ml-1 text-xs font-sans text-beige">AUD</span>
            )}
          </span>
          <Button href={`/catalog/${course.slug}`} size="sm" variant="outline" iconRight={<ArrowRight size={14} />}>
            View Course
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EnrolledCourseCard({
  course,
  enrollment,
}: {
  course: Course;
  enrollment: Enrollment;
}) {
  const completed = enrollment.status === "completed";
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-line bg-charcoal transition-colors hover:border-gold/40 sm:flex-row">
      <div
        className={`relative flex h-32 shrink-0 items-center justify-center overflow-hidden border-b border-line bg-gradient-to-br ${course.accent} via-charcoal to-charcoal sm:h-auto sm:w-44 sm:border-b-0 sm:border-r`}
      >
        <span className="font-serif text-5xl text-cream/10">{course.title.charAt(0)}</span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                {formatLabel[course.format]}
              </p>
              <h3 className="mt-1 font-serif text-lg text-cream">{course.title}</h3>
            </div>
            {completed ? (
              <Badge tone="sage">Completed</Badge>
            ) : enrollment.status === "not-started" ? (
              <Badge tone="outline">Not Started</Badge>
            ) : (
              <Badge tone="gold">In Progress</Badge>
            )}
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs text-beige">
              <span>{enrollment.progress}% complete</span>
              <span>Last activity: {enrollment.lastActivity}</span>
            </div>
            <ProgressBar value={enrollment.progress} />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            href={`/learn/${course.slug}`}
            size="sm"
            variant={completed ? "outline" : "primary"}
            icon={!completed ? <Play size={13} /> : undefined}
          >
            {completed ? "Review Course" : enrollment.status === "not-started" ? "Start Course" : "Resume"}
          </Button>
        </div>
      </div>
    </div>
  );
}
