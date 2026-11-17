import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createStoredFileStream, getStoredFileInfo } from "@/lib/storage";

const contentTypeByExt: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".pdf": "application/pdf",
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { select: { courseId: true } } },
  });
  if (!lesson || !lesson.fileUrl) return new NextResponse("Not found", { status: 404 });

  if (session.user.role !== "ADMIN") {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: lesson.module.courseId } },
    });
    if (!enrollment || !["ACTIVE", "COMPLETED"].includes(enrollment.status)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  let fileInfo;
  try {
    fileInfo = await getStoredFileInfo(lesson.fileUrl);
  } catch {
    return new NextResponse("File missing on disk", { status: 404 });
  }

  const ext = lesson.fileUrl.slice(lesson.fileUrl.lastIndexOf(".")).toLowerCase();
  const contentType = contentTypeByExt[ext] ?? "application/octet-stream";

  const range = req.headers.get("range");
  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    const start = match?.[1] ? parseInt(match[1], 10) : 0;
    const end = match?.[2] ? parseInt(match[2], 10) : fileInfo.size - 1;
    const chunkSize = end - start + 1;

    const stream = Readable.toWeb(createStoredFileStream(fileInfo.fullPath, start, end)) as ReadableStream;
    return new NextResponse(stream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileInfo.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": String(chunkSize),
        "Content-Type": contentType,
      },
    });
  }

  const stream = Readable.toWeb(createStoredFileStream(fileInfo.fullPath)) as ReadableStream;
  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Length": String(fileInfo.size),
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
    },
  });
}
