import { PageHeader } from "@/components/ui/PageHeader";
import { CreateCourseForm } from "./CreateCourseForm";

export default function NewCoursePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Manage"
        title="Add Course"
        description="Create a new course, then add modules, lessons and upload content from its manage page."
      />
      <div className="max-w-3xl">
        <CreateCourseForm />
      </div>
    </div>
  );
}
