import { mkdir, writeFile, stat, rm } from "fs/promises";
import { createReadStream } from "fs";
import path from "path";

function storageRoot() {
  // turbopackIgnore: STORAGE_DIR is runtime-only config, not a build-time asset path —
  // tracing it would bundle the entire (potentially huge) upload directory into the build.
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.STORAGE_DIR ?? "./storage");
}

function uploadsDir() {
  return path.join(storageRoot(), "uploads");
}

/** Saves an uploaded file under storage/uploads/<lessonId>/<safeFilename> and returns a relative path to store on the Lesson. */
export async function saveLessonFile(lessonId: string, file: File): Promise<string> {
  const dir = path.join(uploadsDir(), lessonId);
  await mkdir(dir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const destPath = path.join(dir, safeName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(destPath, buffer);

  return path.join(lessonId, safeName);
}

function resolveStoredFile(relativePath: string) {
  const full = path.join(uploadsDir(), relativePath);
  const normalizedRoot = path.resolve(uploadsDir());
  const normalizedFull = path.resolve(full);
  if (!normalizedFull.startsWith(normalizedRoot)) {
    throw new Error("Invalid file path");
  }
  return normalizedFull;
}

export async function getStoredFileInfo(relativePath: string) {
  const fullPath = resolveStoredFile(relativePath);
  const stats = await stat(fullPath);
  return { fullPath, size: stats.size };
}

export function createStoredFileStream(fullPath: string, start?: number, end?: number) {
  return createReadStream(fullPath, start !== undefined ? { start, end } : undefined);
}

/** Removes a lesson's whole upload folder (storage/uploads/<lessonId>/), if any. */
export async function deleteLessonFiles(lessonId: string): Promise<void> {
  const dir = path.join(uploadsDir(), lessonId);
  await rm(dir, { recursive: true, force: true });
}
