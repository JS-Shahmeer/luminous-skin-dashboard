import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getCourseForLearner } from "@/lib/queries/courses";
import { getEnrollmentsForUser } from "@/lib/queries/student";
import { getQuizForLesson } from "@/lib/queries/progress";
import { auth } from "@/auth";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { VideoPlayer } from "@/components/dashboard/VideoPlayer";
import { CurriculumSidebar } from "@/components/dashboard/CurriculumSidebar";
import { LessonTabs } from "@/components/dashboard/LessonTabs";
import { markLessonCompleteAction } from "./actions";

// No generateStaticParams here on purpose: this page is gated by auth() and its
// content (enrollment, progress) is per-user, so it can never actually be static —
// prerendering it would only add a needless build-time database dependency.

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const enrollments = await getEnrollmentsForUser(userId);
  const enrollment = enrollments.find((e) => e.slug === slug);
  if (!enrollment) redirect(`/catalog/${slug}`);

  const course = await getCourseForLearner(slug, userId);
  if (!course) notFound();

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentLesson = allLessons.find((l) => l.status === "current") ?? allLessons[0];

  const quiz =
    currentLesson.type === "quiz" ? await getQuizForLesson(currentLesson.id, userId) : null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/my-courses" className="flex items-center gap-1 text-xs text-beige hover:text-gold">
          <ChevronLeft size={14} /> Back to My Courses
        </Link>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-serif text-2xl text-cream md:text-3xl">{course.title}</h1>
          <div className="flex min-w-50 items-center gap-3">
            <ProgressBar value={enrollment?.progress ?? 0} className="w-40" />
            <span className="whitespace-nowrap text-xs text-beige">
              {enrollment?.progress ?? 0}% complete
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <VideoPlayer
            title={currentLesson.title}
            duration={currentLesson.duration}
            src={currentLesson.hasFile ? `/api/media/${currentLesson.id}` : undefined}
          />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gold">Now Playing</p>
              <h2 className="mt-1 font-serif text-xl text-cream">{currentLesson.title}</h2>
            </div>
            {currentLesson.type !== "quiz" && currentLesson.status !== "completed" && (
              <form action={markLessonCompleteAction}>
                <input type="hidden" name="lessonId" value={currentLesson.id} />
                <input type="hidden" name="courseSlug" value={slug} />
                <Button type="submit" size="sm">
                  Complete & Continue
                </Button>
              </form>
            )}
          </div>

          <LessonTabs
            course={course}
            courseSlug={slug}
            currentLessonId={currentLesson.id}
            currentLessonStatus={currentLesson.status}
            currentLessonType={currentLesson.type}
            quiz={quiz}
          />
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <CurriculumSidebar course={course} />
        </div>
      </div>
    </div>
  );
}
