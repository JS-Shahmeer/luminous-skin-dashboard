import { PageHeader } from "@/components/ui/PageHeader";
import { CertificateCard, LockedCertificateCard } from "@/components/dashboard/CertificateCard";
import { auth } from "@/auth";
import { getCertificatesForUser, getEnrollmentsForUser, getStudentProfile } from "@/lib/queries/student";
import { getCourseBySlug } from "@/lib/queries/courses";

export default async function CertificatesPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [profile, certificates, enrollments] = await Promise.all([
    getStudentProfile(userId),
    getCertificatesForUser(userId),
    getEnrollmentsForUser(userId),
  ]);
  const inProgress = enrollments.filter((e) => e.status !== "completed");
  const inProgressCourses = await Promise.all(inProgress.map((e) => getCourseBySlug(e.slug)));

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Achievements"
        title="My Certificates"
        description="Certificates are issued automatically once you complete a course and pass its final assessment."
      />

      <section>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-beige">
          Earned ({certificates.length})
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {certificates.map((c) => (
            <CertificateCard key={c.id} certificate={c} studentName={profile?.name ?? ""} />
          ))}
        </div>
      </section>

      {inProgress.length > 0 && (
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-beige">
            In Progress
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {inProgress.map((e, i) => {
              const course = inProgressCourses[i];
              if (!course) return null;
              return (
                <LockedCertificateCard key={e.slug} courseTitle={course.title} progress={e.progress} />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
