"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { createCourseAction } from "./actions";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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

export function CreateCourseForm() {
  const [result, formAction, pending] = useActionState(createCourseAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-lg border border-line bg-charcoal p-6">
        <h3 className="font-serif text-lg text-cream">Course Details</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input name="title" required className={inputClass} placeholder="e.g. Advanced Peel Protocols" />
          </Field>
          <Field label="Format">
            <select name="format" required defaultValue="ONLINE" className={inputClass}>
              <option value="ONLINE">Online Course</option>
              <option value="IN_CLINIC">In-Clinic Program</option>
              <option value="BUNDLE">Course + Device</option>
            </select>
          </Field>
          <Field label="Price (AUD)">
            <input name="price" type="number" required min={0} className={inputClass} placeholder="299" />
          </Field>
          <Field label="Duration">
            <input name="duration" required className={inputClass} placeholder="e.g. 3h 30m · 4 modules" />
          </Field>
          <Field label="Level">
            <input name="level" className={inputClass} placeholder="Foundation" />
          </Field>
          <Field label="Category">
            <input name="category" className={inputClass} placeholder="e.g. Pigmentation" />
          </Field>
          <Field label="Schedule (in-clinic only)">
            <input name="schedule" className={inputClass} placeholder="e.g. 2–3 days / week · In-clinic" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Summary (one line)">
            <input name="summary" required className={inputClass} placeholder="Short catalog card summary" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Full Description">
            <textarea name="description" required rows={4} className={inputClass} />
          </Field>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Outcomes (one per line)">
            <textarea name="outcomes" rows={4} className={inputClass} />
          </Field>
          <Field label="Includes (one per line)">
            <textarea name="includes" rows={4} className={inputClass} />
          </Field>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-charcoal p-6">
        <h3 className="font-serif text-lg text-cream">Instructor</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input name="instructorName" required className={inputClass} placeholder="Existing or new name" />
          </Field>
          <Field label="Title">
            <input name="instructorTitle" className={inputClass} placeholder="e.g. Senior Dermal Therapist" />
          </Field>
        </div>
        <p className="mt-2 text-xs text-beige/70">
          If this name matches an existing instructor, they&apos;ll be reused — otherwise a new instructor is created.
        </p>
      </div>

      {result && !result.ok && <p className="text-sm text-rust">{result.message}</p>}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create Course"}
        </Button>
      </div>
    </form>
  );
}
