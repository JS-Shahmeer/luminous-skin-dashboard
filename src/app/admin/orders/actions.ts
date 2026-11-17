"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function markOrderPaidAction(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Not authorized.");

  const orderId = formData.get("orderId");
  if (typeof orderId !== "string") return;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID" },
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
    create: { userId: order.userId, courseId: order.courseId, status: "ACTIVE", lastActivityAt: new Date() },
    update: { status: "ACTIVE" },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/students");
}
