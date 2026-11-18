"use server";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { generateResetToken, RESET_TOKEN_TTL_MS } from "@/lib/password-reset";
import { appUrl } from "@/lib/stripe";

export type ActionResult = { ok: boolean; message: string } | undefined;

const GENERIC_MESSAGE = "If an account exists for that email, we've sent a password reset link.";

export async function requestPasswordResetAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email");
  if (typeof email !== "string" || !email.trim()) {
    return { ok: false, message: "Please enter your email address." };
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim() } });
  if (user) {
    // One active reset link per user at a time — requesting again invalidates the last one.
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const { rawToken, tokenHash } = generateResetToken();
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
    });

    const resetUrl = `${appUrl}/reset-password/${rawToken}`;
    await sendMail({
      to: user.email,
      subject: "Reset your Luminous SKN Academy password",
      html: `
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your password. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
        <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
        <p>— Luminous SKN Academy</p>
      `,
    });
  }

  // Same response whether or not the email was found — don't leak account existence.
  return { ok: true, message: GENERIC_MESSAGE };
}
