import { NextResponse } from "next/server";
import { format } from "date-fns";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateCertificatePdf } from "@/lib/certificate-pdf";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { certificateId } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: { user: { select: { id: true, name: true } }, course: { select: { title: true } } },
  });
  if (!certificate) return new NextResponse("Not found", { status: 404 });

  if (session.user.role !== "ADMIN" && certificate.userId !== session.user.id) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const pdfBytes = await generateCertificatePdf({
    studentName: certificate.user.name,
    courseTitle: certificate.course.title,
    issuedOn: format(certificate.issuedAt, "d MMMM yyyy"),
    credentialId: certificate.credentialId,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${certificate.credentialId}.pdf"`,
    },
  });
}
