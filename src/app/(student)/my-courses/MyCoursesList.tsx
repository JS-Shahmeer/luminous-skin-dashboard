"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Course, Enrollment } from "@/types/models";
import { EnrolledCourseCard } from "@/components/dashboard/CourseCard";

const tabs: { label: string; value: Enrollment["status"] | "all" }[] = [
  { label: "All", value: "all" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Not Started", value: "not-started" },
];

export function MyCoursesList({
  enrollments,
  courses,
}: {
  enrollments: Enrollment[];
  courses: Course[];
}) {
  const [active, setActive] = useState<Enrollment["status"] | "all">("all");
  const filtered = active === "all" ? enrollments : enrollments.filter((e) => e.status === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-line pb-6">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setActive(t.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors",
              active === t.value
                ? "border-gold bg-gold/10 text-gold"
                : "border-line text-beige hover:border-gold/40 hover:text-cream"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map((e) => {
          const course = courses.find((c) => c.slug === e.slug);
          if (!course) return null;
          return <EnrolledCourseCard key={e.slug} course={course} enrollment={e} />;
        })}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-beige">No courses in this category yet.</p>
        )}
      </div>
    </div>
  );
}
