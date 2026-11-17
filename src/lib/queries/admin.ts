import { format, startOfMonth, subMonths } from "date-fns";
import { prisma } from "@/lib/prisma";
import type {
  AdminApplication,
  AdminCertificate,
  AdminInClinicStudent,
  AdminOrder,
  AdminStudent,
} from "@/types/models";
import { getInitials } from "@/lib/utils";

export async function getPendingApplications(): Promise<AdminApplication[]> {
  const rows = await prisma.enrollment.findMany({
    where: { status: "PENDING_APPROVAL" },
    include: { user: { select: { name: true, email: true } }, course: { select: { title: true, slug: true, price: true } } },
    orderBy: { createdAt: "asc" },
  });

  return rows.map((e) => ({
    id: e.id,
    studentName: e.user.name,
    studentEmail: e.user.email,
    course: e.course.title,
    courseSlug: e.course.slug,
    price: e.course.price,
    notes: e.notes,
    appliedOn: format(e.createdAt, "d MMM yyyy"),
  }));
}

export async function getActiveInClinicStudents(): Promise<AdminInClinicStudent[]> {
  const rows = await prisma.enrollment.findMany({
    where: { status: "ACTIVE", course: { format: "IN_CLINIC" } },
    include: { user: { select: { name: true, email: true } }, course: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "asc" },
  });

  return rows.map((e) => ({
    enrollmentId: e.id,
    studentName: e.user.name,
    studentEmail: e.user.email,
    course: e.course.title,
    courseSlug: e.course.slug,
    progress: e.progress,
    enrolledOn: format(e.createdAt, "d MMM yyyy"),
    lastReminderSentOn: e.lastReminderSentAt ? format(e.lastReminderSentAt, "d MMM yyyy") : null,
  }));
}

export async function getAdminStudents(): Promise<AdminStudent[]> {
  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      enrollments: true,
      orders: { where: { status: "PAID" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    initials: getInitials(u.name),
    coursesEnrolled: u.enrollments.length,
    coursesCompleted: u.enrollments.filter((e) => e.status === "COMPLETED").length,
    totalSpent: u.orders.reduce((sum, o) => sum + o.amount, 0),
    joined: format(u.createdAt, "d MMM yyyy"),
    status: u.status === "ACTIVE" ? "active" : "inactive",
  }));
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const rows = await prisma.order.findMany({
    include: { user: { select: { name: true } }, course: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((o) => ({
    id: `ORD-${o.id.slice(-6).toUpperCase()}`,
    rawId: o.id,
    student: o.user.name,
    course: o.course.title,
    amount: o.amount,
    date: format(o.createdAt, "d MMM yyyy"),
    status: o.status === "PAID" ? "paid" : o.status === "PENDING" ? "pending" : "refunded",
    method: o.method,
  }));
}

export async function getAdminCertificates(): Promise<AdminCertificate[]> {
  const rows = await prisma.certificate.findMany({
    include: { user: { select: { name: true } }, course: { select: { title: true } } },
    orderBy: { issuedAt: "desc" },
  });

  return rows.map((c) => ({
    id: c.id,
    student: c.user.name,
    course: c.course.title,
    issuedOn: format(c.issuedAt, "d MMM yyyy"),
    credentialId: c.credentialId,
  }));
}

export async function getRevenueByMonth(): Promise<{ month: string; value: number }[]> {
  const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));
  const paidOrders = await prisma.order.findMany({
    where: { status: "PAID", createdAt: { gte: sixMonthsAgo } },
    select: { amount: true, createdAt: true },
  });

  const months: { key: string; month: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(new Date(), i);
    months.push({ key: format(d, "yyyy-MM"), month: format(d, "MMM"), value: 0 });
  }
  for (const o of paidOrders) {
    const key = format(o.createdAt, "yyyy-MM");
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.value += o.amount;
  }

  return months.map(({ month, value }) => ({ month, value }));
}
