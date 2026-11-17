"use client";

import { useActionState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updateCourseAction } from "./actions";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-beige">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-sm border border-line bg-ink/40 px-3.5 py-2.5 text-sm text-cream placeholder:text-beige/60 focus:border-gold/50 focus:outline-none";

export interface EditableCourse {
  id: string;
  slug: string;
  title: string;
  format: "ONLINE" | "IN_CLINIC" | "BUNDLE";
  price: number;
  duration: string;
  level: string;
  category: string;
  schedule: string | null;
  summary: string;
  description: string;
  outcomes: string[];
  includes: string[];
  instructorName: string;
  instructorTitle: string;
}

export function EditCourseForm({ course }: { course: EditableCourse }) {
  const [result, formAction, pending] = useActionState(updateCourseAction, undefined);

  return (
    <details className="group rounded-lg border border-line bg-charcoal">
      <summary className="flex cursor-pointer list-none items-center justify-between p-5">
        <h3 className="font-serif text-lg text-cream">Edit Course Details</h3>
        <ChevronDown size={18} className="text-beige transition-transform group-open:rotate-180" />
      </summary>

      <form action={formAction} className="space-y-4 border-t border-line p-5">
        <input type="hidden" name="courseId" value={course.id} />
        <input type="hidden" name="courseSlug" value={course.slug} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input name="title" required defaultValue={course.title} className={inputClass} />
          </Field>
          <Field label="Format">
            <select name="format" required defaultValue={course.format} className={inputClass}>
              <option value="ONLINE">Online Course</option>
              <option value="IN_CLINIC">In-Clinic Program</option>
              <option value="BUNDLE">Course + Device</option>
            </select>
          </Field>
          <Field label="Price (AUD)">
            <input
              name="price"
              type="number"
              required
              min={0}
              defaultValue={course.price}
              className={inputClass}
            />
          </Field>
          <Field label="Duration">
            <input name="duration" required defaultValue={course.duration} className={inputClass} />
          </Field>
          <Field label="Level">
            <input name="level" defaultValue={course.level} className={inputClass} />
          </Field>
          <Field label="Category">
            <input name="category" defaultValue={course.category} className={inputClass} />
          </Field>
          <Field label="Schedule (in-clinic only)">
            <input name="schedule" defaultValue={course.schedule ?? ""} className={inputClass} />
          </Field>
        </div>

        <Field label="Summary (one line)">
          <input name="summary" required defaultValue={course.summary} className={inputClass} />
        </Field>

        <Field label="Full Description">
          <textarea name="description" required rows={4} defaultValue={course.description} className={inputClass} />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Outcomes (one per line)">
            <textarea name="outcomes" rows={4} defaultValue={course.outcomes.join("\n")} className={inputClass} />
          </Field>
          <Field label="Includes (one per line)">
            <textarea name="includes" rows={4} defaultValue={course.includes.join("\n")} className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Instructor Name">
            <input name="instructorName" required defaultValue={course.instructorName} className={inputClass} />
          </Field>
          <Field label="Instructor Title">
            <input name="instructorTitle" defaultValue={course.instructorTitle} className={inputClass} />
          </Field>
        </div>

        {result && (
          <p className={`text-sm ${result.ok ? "text-sage" : "text-rust"}`}>{result.message}</p>
        )}

        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </details>
  );
}
