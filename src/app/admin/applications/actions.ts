"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Not authorized.");
}

export async function approveApplicationAction(formData: FormData) {
  await requireAdmin();
  const enrollmentId = formData.get("enrollmentId");
  if (typeof enrollmentId !== "string") return;

  const enrollment = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: "ACTIVE", lastActivityAt: new Date() },
    include: { course: { select: { price: true, title: true, slug: true } }, user: { select: { email: true, name: true } } },
  });

  // In-clinic programs are typically paid via invoice/bank transfer, not Stripe —
  // record a pending order now so it shows up for the admin to mark paid later.
  await prisma.order.create({
    data: {
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      amount: enrollment.course.price,
      status: "PENDING",
      method: "Invoice / Bank Transfer",
    },
  });

  await sendMail({
    to: enrollment.user.email,
    subject: `Your application for ${enrollment.course.title} has been approved`,
    html: `
      <p>Hi ${enrollment.user.name},</p>
      <p>Great news — your application for <strong>${enrollment.course.title}</strong> has been approved.</p>
      <p>Our team will be in touch with an invoice. You can start accessing course materials now at
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/learn/${enrollment.course.slug}">${process.env.NEXT_PUBLIC_APP_URL}/learn/${enrollment.course.slug}</a>.</p>
      <p>— Luminous SKN Academy</p>
    `,
  });

  revalidatePath("/admin/applications");
  revalidatePath("/admin/orders");
}

export async function rejectApplicationAction(formData: FormData) {
  await requireAdmin();
  const enrollmentId = formData.get("enrollmentId");
  if (typeof enrollmentId !== "string") return;

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin/applications");
}

export async function sendInClinicReminderAction(formData: FormData) {
  await requireAdmin();
  const enrollmentId = formData.get("enrollmentId");
  if (typeof enrollmentId !== "string") return;

  const enrollment = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { lastReminderSentAt: new Date() },
    include: { user: { select: { email: true, name: true } }, course: { select: { title: true, schedule: true } } },
  });

  await sendMail({
    to: enrollment.user.email,
    subject: `Reminder — your training at ${enrollment.course.title}`,
    html: `
      <p>Hi ${enrollment.user.name},</p>
      <p>This is a friendly reminder about your in-clinic training program, <strong>${enrollment.course.title}</strong>.</p>
      ${enrollment.course.schedule ? `<p>Schedule: ${enrollment.course.schedule}</p>` : ""}
      <p>If you have any questions about your upcoming sessions or need to reschedule, please contact the clinic directly.</p>
      <p>— Luminous SKN Academy</p>
    `,
  });

  revalidatePath("/admin/applications");
}
