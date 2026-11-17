"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, appUrl } from "@/lib/stripe";

export type ActionResult = { ok: boolean; message: string } | undefined;

export async function startCheckoutAction(formData: FormData) {
  const courseSlug = formData.get("courseSlug");
  if (typeof courseSlug !== "string") throw new Error("Invalid course.");

  const session = await auth();
  if (!session) redirect("/login");

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course || course.format === "IN_CLINIC") {
    throw new Error("This course cannot be purchased directly.");
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (existing && (existing.status === "ACTIVE" || existing.status === "COMPLETED")) {
    redirect(`/learn/${courseSlug}`);
  }

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "aud",
          unit_amount: course.price * 100,
          product_data: { name: course.title },
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/catalog/${courseSlug}`,
    metadata: { userId: session.user.id, courseId: course.id },
  });

  if (checkoutSession.url) redirect(checkoutSession.url);
}

export async function applyForCourseAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { ok: false, message: "Please sign in first." };

  const courseSlug = formData.get("courseSlug");
  const notes = formData.get("notes");
  if (typeof courseSlug !== "string") return { ok: false, message: "Invalid course." };

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) return { ok: false, message: "Course not found." };

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (existing) {
    return { ok: false, message: "You've already applied, or are already enrolled, in this program." };
  }

  await prisma.enrollment.create({
    data: {
      userId: session.user.id,
      courseId: course.id,
      status: "PENDING_APPROVAL",
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    },
  });

  return { ok: true, message: "Application submitted — our clinical team will be in touch within 2 business days." };
}
