import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { auth } from "@/auth";
import { getEnrollmentsForUser } from "@/lib/queries/student";
import { getCourseBySlug } from "@/lib/queries/courses";
import { MyCoursesList } from "./MyCoursesList";

export default async function MyCoursesPage() {
  const session = await auth();
  const enrollments = await getEnrollmentsForUser(session!.user.id);
  const courses = (await Promise.all(enrollments.map((e) => getCourseBySlug(e.slug)))).filter(
    (c) => c !== null
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="My Learning"
        title="My Courses"
        description="Track your progress across every course and in-clinic program you're enrolled in."
        actions={<Button href="/catalog" variant="outline">Browse Catalog</Button>}
      />
      <MyCoursesList enrollments={enrollments} courses={courses} />
    </div>
  );
}
