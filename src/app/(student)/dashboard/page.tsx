import Link from "next/link";
import { Award, BookOpen, Clock3, GraduationCap, Play, ArrowRight, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EnrolledCourseCard } from "@/components/dashboard/CourseCard";
import { auth } from "@/auth";
import { listCourses, getCourseBySlug, getCourseForLearner } from "@/lib/queries/courses";
import { getCertificatesForUser, getEnrollmentsForUser, getStudentProfile } from "@/lib/queries/student";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [profile, enrollments, certificates, courses] = await Promise.all([
    getStudentProfile(userId),
    getEnrollmentsForUser(userId),
    getCertificatesForUser(userId),
    listCourses(),
  ]);

  const inProgress = enrollments.filter((e) => e.status === "in-progress");
  const completed = enrollments.filter((e) => e.status === "completed");
  const featured = inProgress[0];
  const featuredCourse = featured ? await getCourseForLearner(featured.slug, userId) : undefined;
  const currentLesson = featuredCourse?.modules
    .flatMap((m) => m.lessons.map((l) => ({ ...l, module: m.title })))
    .find((l) => l.status === "current");

  const recommended = courses.find((c) => !enrollments.some((e) => e.slug === c.slug));
  const latestCertificate = certificates[0];
  const remainingEnrollments = enrollments.filter((e) => e.slug !== featured?.slug);
  const remainingCourses = await Promise.all(remainingEnrollments.map((e) => getCourseBySlug(e.slug)));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${profile?.name.split(" ")[0] ?? "there"}`}
        description="Pick up where you left off, or explore new courses to expand your certification."
        actions={
          <Button href="/catalog" variant="outline" iconRight={<ArrowRight size={15} />}>
            Browse Catalog
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="In Progress" value={String(inProgress.length)} icon={BookOpen} />
        <StatCard label="Completed" value={String(completed.length)} icon={GraduationCap} />
        <StatCard label="Certificates" value={String(certificates.length)} icon={Award} />
        <StatCard label="Learning Hours" value="18.5h" icon={Clock3} trend={12} trendLabel="vs last month" />
      </div>

      {featuredCourse && featured && (
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-beige">
            Continue Learning
          </p>
          <div
            className={`relative overflow-hidden rounded-lg border border-line bg-gradient-to-br ${featuredCourse.accent} via-charcoal to-charcoal p-6 md:p-8`}
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <Badge tone="gold">{featuredCourse.category}</Badge>
                <h2 className="mt-3 font-serif text-2xl text-cream md:text-3xl">
                  {featuredCourse.title}
                </h2>
                {currentLesson && (
                  <p className="mt-2 text-sm text-beige">
                    Next up in <span className="text-cream">{currentLesson.module}</span> —{" "}
                    <span className="text-cream">{currentLesson.title}</span> · {currentLesson.duration}
                  </p>
                )}

                <div className="mt-5 max-w-sm">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-beige">
                    <span>{featured.progress}% complete</span>
                    <span>{featuredCourse.duration}</span>
                  </div>
                  <ProgressBar value={featured.progress} />
                </div>

                <Button href={`/learn/${featuredCourse.slug}`} className="mt-6" icon={<Play size={14} />}>
                  Resume Course
                </Button>
              </div>

              <div className="hidden shrink-0 items-center justify-center rounded-lg border border-line bg-ink/60 p-8 md:flex">
                <span className="font-serif text-7xl text-gold/25">
                  {featuredCourse.title.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-beige">My Courses</p>
            <Link href="/my-courses" className="flex items-center gap-1 text-xs text-gold hover:text-gold-soft">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-4">
            {remainingEnrollments.map((e, i) => {
              const c = remainingCourses[i];
              if (!c) return null;
              return <EnrolledCourseCard key={e.slug} course={c} enrollment={e} />;
            })}
          </div>
        </div>

        <div className="space-y-6">
          {latestCertificate && (
            <div className="rounded-lg border border-line bg-charcoal p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-beige">
                Latest Certificate
              </p>
              <div className="flex items-center gap-4 rounded-md border border-gold/25 bg-gold/5 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Award size={20} strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm text-cream">{latestCertificate.courseTitle}</p>
                  <p className="text-xs text-beige">Issued {latestCertificate.issuedOn}</p>
                </div>
              </div>
              <Button href="/certificates" variant="ghost" size="sm" className="mt-4 w-full">
                View All Certificates
              </Button>
            </div>
          )}

          {recommended && (
            <div className="rounded-lg border border-line bg-charcoal p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-beige">
                Recommended For You
              </p>
              <p className="font-serif text-lg text-cream">{recommended.title}</p>
              <p className="mt-1.5 line-clamp-2 text-sm text-beige">{recommended.summary}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-beige">
                <FileText size={13} /> {recommended.duration}
              </div>
              <Button href={`/catalog/${recommended.slug}`} variant="outline" size="sm" className="mt-4 w-full">
                View Course
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
