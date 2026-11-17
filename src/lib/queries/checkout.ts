import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { sendMail } from "@/lib/mail";

/**
 * Grants access for a completed Stripe Checkout session. Called from both the webhook
 * (source of truth) and the success-page redirect (immediate UX) — safe to call twice,
 * everything here is upserted by stripeSessionId / [userId, courseId].
 */
export async function fulfillCheckoutSession(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") return null;

  const userId = session.metadata?.userId;
  const courseId = session.metadata?.courseId;
  if (!userId || !courseId) return null;

  const existingOrder = await prisma.order.findUnique({ where: { stripeSessionId: sessionId } });
  const alreadyFulfilled = existingOrder?.status === "PAID";

  await prisma.order.upsert({
    where: { stripeSessionId: sessionId },
    create: {
      userId,
      courseId,
      amount: Math.round((session.amount_total ?? 0) / 100),
      status: "PAID",
      method: "Card",
      stripeSessionId: sessionId,
    },
    update: { status: "PAID" },
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, status: "ACTIVE", progress: 0, lastActivityAt: new Date() },
    update: { status: "ACTIVE" },
  });

  const [course, user] = await Promise.all([
    prisma.course.findUnique({ where: { id: courseId }, select: { slug: true, title: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } }),
  ]);

  if (course && user && !alreadyFulfilled) {
    await sendMail({
      to: user.email,
      subject: `You're enrolled in ${course.title}`,
      html: `
        <p>Hi ${user.name},</p>
        <p>Your payment was successful and you're now enrolled in <strong>${course.title}</strong>.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/learn/${course.slug}">Start learning now</a>.</p>
        <p>— Luminous SKN Academy</p>
      `,
    });
  }

  return course;
}
