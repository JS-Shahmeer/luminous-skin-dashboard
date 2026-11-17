import { formatDistanceToNowStrict, format } from "date-fns";
import { prisma } from "@/lib/prisma";
import type { Certificate, Enrollment } from "@/types/models";

export async function getStudentProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return {
    name: user.name,
    title: user.title ?? "Student",
    email: user.email,
    memberSince: format(user.createdAt, "MMM yyyy"),
  };
}

export async function getEnrollmentsForUser(userId: string): Promise<Enrollment[]> {
  const rows = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: { select: { slug: true } } },
    orderBy: { lastActivityAt: "desc" },
  });

  return rows.map((e) => ({
    slug: e.course.slug,
    progress: e.progress,
    status:
      e.status === "COMPLETED" ? "completed" : e.progress > 0 ? "in-progress" : "not-started",
    lastActivity: e.lastActivityAt ? `${formatDistanceToNowStrict(e.lastActivityAt)} ago` : "—",
  }));
}

export async function getCertificatesForUser(userId: string): Promise<Certificate[]> {
  const rows = await prisma.certificate.findMany({
    where: { userId },
    include: { course: { select: { slug: true, title: true } } },
    orderBy: { issuedAt: "desc" },
  });

  return rows.map((c) => ({
    id: c.id,
    courseSlug: c.course.slug,
    courseTitle: c.course.title,
    issuedOn: format(c.issuedAt, "d MMM yyyy"),
    credentialId: c.credentialId,
  }));
}
