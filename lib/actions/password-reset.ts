"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { OtpType } from "@prisma/client";
import { sendPasswordResetEmail } from "@/lib/email";

const TOKEN_BYTES = 32;          // 256-bit random token
const TOKEN_TTL_MIN = 30;        // 30 minutes

/* ────────────────────────────────────────────────────────────────────
   1) requestPasswordReset(email)
   Always returns success even when the email isn't registered — that's
   intentional, so a public endpoint can't be used to enumerate users.
   ──────────────────────────────────────────────────────────────────── */
export async function requestPasswordReset(
  email: string,
): Promise<{ success: true } | { error: string }> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const normalized = email.trim().toLowerCase();

  const user = await db.user.findUnique({
    where: { email: normalized },
    select: { id: true, name: true, email: true, status: true },
  });

  // Whether the user exists or not, return success to the caller. Only
  // actually send if the user exists AND is not suspended/frozen.
  if (!user || user.status === "SUSPENDED" || user.status === "FROZEN") {
    return { success: true };
  }

  // Generate a long opaque token. Reuse the OtpCode table — `code` field
  // holds the token, `type = PASSWORD_RESET`, expires in 30 min.
  const token = crypto.randomBytes(TOKEN_BYTES).toString("hex");
  const expires = new Date(Date.now() + TOKEN_TTL_MIN * 60 * 1000);

  // Invalidate every prior unused reset token for this email so the
  // newest link is the only one that works.
  await db.otpCode.updateMany({
    where: {
      identifier: normalized,
      type:       OtpType.PASSWORD_RESET,
      used:       false,
    },
    data: { used: true },
  });

  await db.otpCode.create({
    data: {
      identifier: normalized,
      code:       token,
      type:       OtpType.PASSWORD_RESET,
      expires,
    },
  });

  try {
    await sendPasswordResetEmail({
      to:   user.email,
      name: user.name ?? "there",
      token,
    });
  } catch (err) {
    console.error("[requestPasswordReset] failed to send email:", err);
    // Token is in the DB but email failed — surface a generic error
    // since we don't want to leak whether the email exists.
    return { error: "Could not send the reset email. Please try again in a moment." };
  }

  return { success: true };
}

/* ────────────────────────────────────────────────────────────────────
   2) verifyPasswordResetToken(token) — used by the reset page on load
   to decide whether to render the form or a "link expired" state.
   ──────────────────────────────────────────────────────────────────── */
export async function verifyPasswordResetToken(
  token: string,
): Promise<{ valid: true; email: string } | { valid: false; reason: string }> {
  if (!token || token.length < 32) {
    return { valid: false, reason: "Invalid reset link." };
  }

  const row = await db.otpCode.findFirst({
    where: {
      code: token,
      type: OtpType.PASSWORD_RESET,
      used: false,
    },
  });

  if (!row) return { valid: false, reason: "This reset link has already been used or is invalid." };
  if (row.expires < new Date()) return { valid: false, reason: "This reset link has expired. Request a new one." };

  return { valid: true, email: row.identifier };
}

/* ────────────────────────────────────────────────────────────────────
   3) completePasswordReset(token, newPassword)
   ──────────────────────────────────────────────────────────────────── */
export async function completePasswordReset(args: {
  token: string;
  newPassword: string;
}): Promise<{ success: true } | { error: string }> {
  const { token, newPassword } = args;

  if (!token || token.length < 32) return { error: "Invalid reset link." };

  if (!newPassword || newPassword.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!/[A-Z]/.test(newPassword)) {
    return { error: "Password must include at least one uppercase letter." };
  }
  if (!/[0-9]/.test(newPassword)) {
    return { error: "Password must include at least one number." };
  }

  const row = await db.otpCode.findFirst({
    where: {
      code: token,
      type: OtpType.PASSWORD_RESET,
      used: false,
    },
  });

  if (!row)                          return { error: "This reset link has already been used or is invalid." };
  if (row.expires < new Date())      return { error: "This reset link has expired. Request a new one." };

  const user = await db.user.findUnique({
    where: { email: row.identifier },
    select: { id: true, status: true },
  });
  if (!user)                                                       return { error: "User no longer exists." };
  if (user.status === "SUSPENDED" || user.status === "FROZEN")     return { error: "This account is currently disabled. Contact support." };

  const hash = await bcrypt.hash(newPassword, 10);

  // Atomically mark the token as used + update the password. Also
  // invalidate every other open reset token for this user.
  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data:  { password: hash, updatedAt: new Date() },
    }),
    db.otpCode.update({
      where: { id: row.id },
      data:  { used: true },
    }),
    db.otpCode.updateMany({
      where: {
        identifier: row.identifier,
        type:       OtpType.PASSWORD_RESET,
        used:       false,
      },
      data: { used: true },
    }),
  ]);

  return { success: true };
}
