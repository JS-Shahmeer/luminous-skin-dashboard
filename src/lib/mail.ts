import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

/**
 * Sends an email and never throws — a misconfigured/placeholder SMTP setup (expected until
 * real credentials are added) must not break the checkout/certificate/application flow that
 * triggered it. Failures are logged, not swallowed silently.
 */
export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!process.env.SMTP_HOST) {
    console.warn(`[mail] SMTP not configured — skipping email to ${to}: "${subject}"`);
    return;
  }

  try {
    await getTransporter().sendMail({
      from: process.env.MAIL_FROM ?? "Luminous SKN Academy <no-reply@luminousskn.com>",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`[mail] Failed to send "${subject}" to ${to}:`, error);
  }
}
