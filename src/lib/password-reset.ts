import crypto from "crypto";

// Only the hash is ever stored — the raw token only exists in the emailed
// link, so a database leak alone can't be used to reset anyone's password.
export function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(rawToken);
  return { rawToken, tokenHash };
}

export function hashResetToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
