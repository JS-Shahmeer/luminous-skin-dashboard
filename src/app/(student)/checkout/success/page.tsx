import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fulfillCheckoutSession } from "@/lib/queries/checkout";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const course = session_id ? await fulfillCheckoutSession(session_id) : null;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-sage/40 text-sage">
        <CheckCircle2 size={32} strokeWidth={1.75} />
      </span>
      <h1 className="mt-6 font-serif text-3xl text-cream">
        {course ? "You're enrolled!" : "Payment processing"}
      </h1>
      <p className="mt-2 max-w-md text-sm text-beige">
        {course
          ? `Access to ${course.title} is unlocked — jump straight in, or find it anytime in My Courses.`
          : "We're confirming your payment with Stripe. This usually takes only a moment — check My Courses shortly."}
      </p>
      <div className="mt-6 flex gap-3">
        {course ? (
          <Button href={`/learn/${course.slug}`}>Start Learning</Button>
        ) : (
          <Button href="/my-courses">Go to My Courses</Button>
        )}
        <Button href="/catalog" variant="outline">
          Browse Catalog
        </Button>
      </div>
      <Link href="/dashboard" className="mt-6 text-xs text-beige hover:text-gold">
        Back to Dashboard
      </Link>
    </div>
  );
}
