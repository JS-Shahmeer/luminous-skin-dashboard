"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: boolean; message: string } | undefined;

export async function updateProfileAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { ok: false, message: "Not authenticated." };

  const name = formData.get("name");
  const title = formData.get("title");
  if (typeof name !== "string" || name.trim().length < 2) {
    return { ok: false, message: "Please enter your full name." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim(),
      title: typeof title === "string" && title.trim() ? title.trim() : null,
    },
  });

  return { ok: true, message: "Profile updated." };
}

export async function updatePasswordAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { ok: false, message: "Not authenticated." };

  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  if (typeof password !== "string" || password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { ok: false, message: "Passwords do not match." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  return { ok: true, message: "Password updated." };
}
