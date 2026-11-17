import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  Building2,
  Check,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  Lock,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";
import { getCourseBySlug, listCourses } from "@/lib/queries/courses";
import type { Lesson } from "@/types/models";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatCurrency, cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PurchaseActions } from "./PurchaseActions";

const lessonIcon: Record<Lesson["type"], typeof PlayCircle> = {
  video: PlayCircle,
  pdf: FileText,
  quiz: HelpCircle,
};

export async function generateStaticParams() {
  const courses = await listCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, courses, session] = await Promise.all([
    getCourseBySlug(slug),
    listCourses(),
    auth(),
  ]);
  if (!course) notFound();

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const isInClinic = course.format === "in-clinic";

  const existingEnrollment = session
    ? await prisma.enrollment.findFirst({
        where: { userId: session.user.id, course: { slug } },
      })
    : null;
  const enrollmentState =
    existingEnrollment?.status === "ACTIVE"
      ? "active"
      : existingEnrollment?.status === "COMPLETED"
      ? "completed"
      : existingEnrollment?.status === "PENDING_APPROVAL"
      ? "pending"
      : existingEnrollment?.status === "REJECTED"
      ? "rejected"
      : "none";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-1.5 text-xs text-beige">
        <Link href="/catalog" className="hover:text-gold">
          Catalog
        </Link>
        <ChevronRight size={13} />
        <span className="text-cream">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-8 lg:col-span-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={isInClinic ? "gold" : "outline"}>
                {isInClinic && <Building2 size={11} />}
                {course.format === "online"
                  ? "Online Course"
                  : course.format === "bundle"
                  ? "Course + Device"
                  : "In-Clinic Program"}
              </Badge>
              <Badge tone="neutral">{course.category}</Badge>
              <Badge tone="neutral">{course.level}</Badge>
            </div>
            <h1 className="mt-4 font-serif text-3xl text-cream md:text-4xl">{course.title}</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-beige">
              {course.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-beige">
              <span className="flex items-center gap-1.5">
                <Clock size={15} /> {course.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={15} /> {course.studentsEnrolled} enrolled
              </span>
              <span className="flex items-center gap-1.5 text-gold">
                <Star size={15} fill="currentColor" /> {course.rating} rating
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
              <Avatar initials={course.instructor.name.split(" ").map((n) => n[0]).join("")} size={40} />
              <div>
                <p className="text-sm text-cream">{course.instructor.name}</p>
                <p className="text-xs text-beige">{course.instructor.title}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-xl text-cream">What you&apos;ll learn</h2>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <div key={o} className="flex items-start gap-2.5 text-sm text-beige">
                  <Check size={16} className="mt-0.5 shrink-0 text-gold" strokeWidth={2} />
                  {o}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-cream">Curriculum</h2>
              <span className="text-xs text-beige">
                {course.modules.length} modules · {totalLessons} lessons
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {course.modules.map((module, i) => (
                <details
                  key={module.title}
                  className="group rounded-lg border border-line bg-charcoal open:border-gold/30"
                  open={i === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm text-cream">
                    <span className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-xs text-beige">
                        {i + 1}
                      </span>
                      {module.title}
                    </span>
                    <ChevronRight size={16} className="text-beige transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="border-t border-line px-4 pb-2">
                    {module.lessons.map((lesson) => {
                      const Icon = lessonIcon[lesson.type];
                      return (
                        <div
                          key={lesson.title}
                          className="flex items-center justify-between gap-3 border-b border-line/60 py-3 text-sm last:border-none"
                        >
                          <span className="flex items-center gap-2.5 text-beige">
                            <Icon size={15} className="shrink-0 text-beige" />
                            {lesson.title}
                          </span>
                          <span className="flex items-center gap-2 whitespace-nowrap text-xs text-beige/70">
                            {lesson.duration}
                            <Lock size={12} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-lg border border-gold/25 bg-charcoal p-6">
            <div className={`mb-5 flex h-32 items-center justify-center rounded-md bg-gradient-to-br ${course.accent} via-charcoal to-ink`}>
              <span className="font-serif text-5xl text-cream/15">{course.title.charAt(0)}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-serif text-4xl text-cream">{formatCurrency(course.price)}</span>
              <span className="text-xs text-beige">AUD{isInClinic ? " · payment plans available" : ""}</span>
            </div>

            <div className="mt-5">
              <PurchaseActions courseSlug={course.slug} isInClinic={isInClinic} enrollmentState={enrollmentState} />
            </div>
            {enrollmentState === "none" && (
              <p className="mt-3 text-center text-xs text-beige">
                {isInClinic ? "Limited intake — application required" : "Instant access after purchase"}
              </p>
            )}

            <div className="mt-6 space-y-3 border-t border-line pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-beige">This includes</p>
              {course.includes.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-beige">
                  <Check size={15} className="mt-0.5 shrink-0 text-gold" />
                  {item}
                </div>
              ))}
            </div>

            {course.schedule && (
              <div className="mt-5 flex items-center gap-2.5 rounded-md border border-line bg-ink/50 p-3 text-xs text-beige">
                <Building2 size={15} className="shrink-0 text-gold" />
                {course.schedule}
              </div>
            )}

            <div className="mt-5 flex items-center gap-2.5 rounded-md border border-line bg-ink/50 p-3 text-xs text-beige">
              <Award size={15} className="shrink-0 text-gold" />
              Certificate of completion included
            </div>
          </div>
        </div>
      </div>

      {/* Cross-sell */}
      <div className="border-t border-line pt-8">
        <h2 className="mb-4 font-serif text-xl text-cream">You may also like</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {courses
            .filter((c) => c.slug !== course.slug && c.format === course.format)
            .slice(0, 3)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/catalog/${c.slug}`}
                className={cn(
                  "rounded-lg border border-line bg-charcoal p-4 text-sm text-cream transition-colors hover:border-gold/40"
                )}
              >
                <p className="font-serif text-lg">{c.title}</p>
                <p className="mt-1 text-xs text-beige">{formatCurrency(c.price)} AUD</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
