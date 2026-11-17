import { PageHeader } from "@/components/ui/PageHeader";
import { listCourses } from "@/lib/queries/courses";
import { CatalogGrid } from "./CatalogGrid";

export default async function CatalogPage() {
  const courses = await listCourses();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Academy Catalog"
        title="Courses & Training Programs"
        description="Online certification courses and in-clinic training pathways, taught by the Luminous SKN clinical team."
      />
      <CatalogGrid courses={courses} />
    </div>
  );
}
