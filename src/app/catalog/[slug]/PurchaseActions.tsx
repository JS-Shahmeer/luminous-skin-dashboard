"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { applyForCourseAction, startCheckoutAction, type ActionResult } from "./actions";

type EnrollmentState = "none" | "pending" | "active" | "completed" | "rejected";

export function PurchaseActions({
  courseSlug,
  isInClinic,
  enrollmentState,
}: {
  courseSlug: string;
  isInClinic: boolean;
  enrollmentState: EnrollmentState;
}) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [result, applyAction, applyPending] = useActionState<ActionResult, FormData>(
    applyForCourseAction,
    undefined
  );

  if (enrollmentState === "active" || enrollmentState === "completed") {
    return (
      <Button href={`/learn/${courseSlug}`} size="lg" className="w-full" icon={<CheckCircle2 size={16} />}>
        {enrollmentState === "completed" ? "Review Course" : "Continue Learning"}
      </Button>
    );
  }

  if (enrollmentState === "pending") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-sm border border-gold/30 bg-gold/5 py-3.5 text-sm text-gold">
        <Clock size={15} /> Application pending review
      </div>
    );
  }

  if (enrollmentState === "rejected") {
    return (
      <p className="text-center text-sm text-beige">
        Your application wasn&apos;t approved this time — contact the clinic for details.
      </p>
    );
  }

  if (isInClinic) {
    if (result?.ok) {
      return <p className="text-center text-sm text-sage">{result.message}</p>;
    }
    if (!showApplyForm) {
      return (
        <Button size="lg" className="w-full" onClick={() => setShowApplyForm(true)}>
          Apply Now
        </Button>
      );
    }
    return (
      <form action={applyAction} className="space-y-3">
        <input type="hidden" name="courseSlug" value={courseSlug} />
        <textarea
          name="notes"
          rows={3}
          placeholder="Tell us a little about your background and goals (optional)"
          className="w-full resize-none rounded-sm border border-line bg-ink/40 p-3 text-sm text-cream placeholder:text-beige/60 focus:border-gold/50 focus:outline-none"
        />
        {result && !result.ok && <p className="text-xs text-rust">{result.message}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={applyPending}>
          {applyPending ? "Submitting…" : "Submit Application"}
        </Button>
      </form>
    );
  }

  return (
    <form action={startCheckoutAction}>
      <input type="hidden" name="courseSlug" value={courseSlug} />
      <Button type="submit" size="lg" className="w-full">
        Enroll Now
      </Button>
    </form>
  );
}
