"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Course, CourseFormat } from "@/types/models";
import { CourseCard } from "@/components/dashboard/CourseCard";

const filters: { label: string; value: CourseFormat | "all" }[] = [
  { label: "All Programs", value: "all" },
  { label: "Online Courses", value: "online" },
  { label: "In-Clinic Training", value: "in-clinic" },
  { label: "Course + Device", value: "bundle" },
];

export function CatalogGrid({ courses }: { courses: Course[] }) {
  const [active, setActive] = useState<CourseFormat | "all">("all");
  const filtered = active === "all" ? courses : courses.filter((c) => c.format === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-line pb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors",
              active === f.value
                ? "border-gold bg-gold/10 text-gold"
                : "border-line text-beige hover:border-gold/40 hover:text-cream"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}
