"use server";

import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { OtpType } from "@prisma/client";

const OTP_EXPIRY_MS  = 10 * 60 * 1000; // 10 minutes
const EMAIL_REGEX    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ─── Send OTP ─────────────────────────────────────────────────────────────────
export async function sendOtp(
  rawEmail: string,
  type: OtpType,
  name?: string,
): Promise<{ error: string } | { success: true }> {
  const tag = "[sendOtp]";

  // ── 1. Sanitise & validate email ──────────────────────────────────────────
  const email = (rawEmail ?? "").trim().toLowerCase();
  console.log(`${tag} ── START ──────────────────────────────────────`);
  console.log(`${tag} raw email input : "${rawEmail}"`);
  console.log(`${tag} sanitised email : "${email}"`);
  console.log(`${tag} OTP type        : ${type}`);
  console.log(`${tag} name            : ${name ?? "(none provided)"}`);

  if (!email) {
    console.error(`${tag} ❌ Email is empty after sanitising. Aborting.`);
    return { error: "Email address is required." };
  }

  if (!EMAIL_REGEX.test(email)) {
    console.error(`${tag} ❌ Email failed format check: "${email}". Aborting.`);
    return { error: "Email address format is invalid." };
  }

  // PASSWORD_RESET uses its own flow (long token + reset link email),
  // not the 6-digit OTP this function emits. See lib/actions/password-reset.ts.
  if (type === "PASSWORD_RESET") {
    console.error(`${tag} ❌ sendOtp() does not handle PASSWORD_RESET — use requestPasswordReset() instead.`);
    return { error: "Wrong reset endpoint. Please contact support." };
  }

  // ── 2. Rate limit — at most one email per 60s per email+type ──────────────
  // If a still-valid code was issued less than 60s ago, do NOT send another
  // email. Return success so legitimate flows (login retry, double-click on
  // resend) keep working — the code from the earlier email remains valid.
  // This caps outbound email volume and removes the resend-spam vector.
  const RESEND_COOLDOWN_MS = 60_000;
  try {
    const lastCode = await db.otpCode.findFirst({
      where:   { identifier: email, type },
      orderBy: { createdAt: "desc" },
    });

    if (lastCode) {
      const ageMs = Date.now() - lastCode.createdAt.getTime();
      console.log(`${tag} Last OTP record  : id=${lastCode.id} age=${Math.round(ageMs / 1000)}s used=${lastCode.used}`);

      if (
        !lastCode.used &&
        lastCode.expires > new Date() &&
        ageMs < RESEND_COOLDOWN_MS
      ) {
        console.warn(`${tag} ⏳ Cooldown active (${Math.round(ageMs / 1000)}s since last send) — skipping duplicate email; previous code is still valid.`);
        return { success: true as const };
      }
    } else {
      console.log(`${tag} No previous OTP record found for this email+type.`);
    }
  } catch (rateErr) {
    // Non-fatal — just log and continue
    console.warn(`${tag} ⚠️  Could not query last OTP record:`, rateErr);
  }

  // ── 3. Invalidate existing unused codes ───────────────────────────────────
  try {
    const invalidated = await db.otpCode.updateMany({
      where: { identifier: email, type, used: false },
      data:  { used: true },
    });
    console.log(`${tag} Invalidated ${invalidated.count} existing unused code(s).`);
  } catch (invalidateErr) {
    console.error(`${tag} ❌ Failed to invalidate old codes:`, invalidateErr);
    return { error: "Database error while preparing OTP. Please try again." };
  }

  // ── 4. Generate & persist new code ────────────────────────────────────────
  const code    = generateCode();
  const expires = new Date(Date.now() + OTP_EXPIRY_MS);

  console.log(`${tag} Generated code   : ${code}`);
  console.log(`${tag} Expires at       : ${expires.toISOString()}`);

  try {
    const record = await db.otpCode.create({
      data: { identifier: email, code, type, expires },
    });
    console.log(`${tag} OTP record saved : id=${record.id}`);
  } catch (dbErr) {
    console.error(`${tag} ❌ Failed to save OTP record:`, dbErr);
    return { error: "Database error while saving OTP. Please try again." };
  }

  // ── 5. Send email — do NOT swallow provider errors ────────────────────────
  const displayName = name || email.split("@")[0];
  console.log(`${tag} Sending email to : "${email}" (display name: "${displayName}")`);

  try {
    const messageId = await sendVerificationEmail({
      to:   email,
      name: displayName,
      code,
      type: type as "REGISTER" | "LOGIN",
    });

    console.log(`${tag} ✅ Email sent successfully.`);
    console.log(`${tag}   Provider message id : ${messageId}`);
    console.log(`${tag} ── END (success) ──────────────────────────────`);
    return { success: true };

  } catch (emailErr: any) {
    console.error(`${tag} ❌ EMAIL SEND FAILED ──────────────────────────`);
    console.error(`${tag} email     : ${email}`);
    console.error(`${tag} error msg : ${emailErr?.message ?? "(no message)"}`);
    console.error(`${tag} full err  :`, emailErr);
    console.log(`${tag} ── END (failure) ──────────────────────────────`);
    return {
      error: `Failed to send verification email: ${emailErr?.message ?? "Unknown provider error"}`,
    };
  }
}

// ─── Verify OTP ───────────────────────────────────────────────────────────────
export async function verifyOtp(
  rawEmail: string,
  code:     string,
  type:     OtpType,
): Promise<{ error: string } | { success: true }> {
  const tag   = "[verifyOtp]";
  const email = (rawEmail ?? "").trim().toLowerCase();

  console.log(`${tag} Verifying OTP for email="${email}" type=${type} code="${code}"`);

  const MAX_ATTEMPTS = 5;

  try {
    // Fetch the latest still-valid code for this email+type FIRST (regardless
    // of what was submitted) so wrong guesses can be counted against it.
    const record = await db.otpCode.findFirst({
      where: {
        identifier: email,
        type,
        used:    false,
        expires: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      console.warn(`${tag} ❌ No valid OTP record for email="${email}" type=${type} (expired, used, or never sent)`);
      return { error: "Invalid or expired verification code." };
    }

    // Brute-force guard: after MAX_ATTEMPTS wrong guesses the code is burned
    // and the user must request a fresh one (which is itself rate-limited).
    if (record.attempts >= MAX_ATTEMPTS) {
      console.warn(`${tag} ❌ Attempt limit reached (${record.attempts}) — burning code id=${record.id}`);
      await db.otpCode.update({ where: { id: record.id }, data: { used: true } });
      return { error: "Too many incorrect attempts. Please request a new code." };
    }

    if (record.code !== code) {
      const updated = await db.otpCode.update({
        where: { id: record.id },
        data:  { attempts: { increment: 1 } },
      });
      console.warn(`${tag} ❌ Wrong code (attempt ${updated.attempts}/${MAX_ATTEMPTS}) for id=${record.id}`);
      if (updated.attempts >= MAX_ATTEMPTS) {
        await db.otpCode.update({ where: { id: record.id }, data: { used: true } });
        return { error: "Too many incorrect attempts. Please request a new code." };
      }
      return { error: "Invalid or expired verification code." };
    }

    console.log(`${tag} ✅ OTP matched. Marking as used. id=${record.id}`);

    await db.otpCode.update({
      where: { id: record.id },
      data:  { used: true },
    });

    // Mark email as verified for registration OTPs
    if (type === OtpType.REGISTER) {
      await db.user.updateMany({
        where: { email, emailVerified: null },
        data:  { emailVerified: new Date() },
      });
      console.log(`${tag} emailVerified set for ${email}`);
    }

    return { success: true };
  } catch (err) {
    console.error(`${tag} ❌ Unexpected error:`, err);
    return { error: "Verification failed. Please try again." };
  }
}

// ─── Manual test function (req #5) ────────────────────────────────────────────
// Call this from a server action or API route to confirm the email pipeline works.
// Change TEST_EMAIL to any inbox you can access.
export async function testSendEmail(): Promise<{ success: boolean; message: string }> {
  const tag        = "[testSendEmail]";
  const TEST_EMAIL = "james.carter@example.com"; // ← change to your real inbox

  console.log(`${tag} ── MANUAL EMAIL TEST ──────────────────────────`);
  console.log(`${tag} Sending test OTP to: ${TEST_EMAIL}`);

  try {
    const messageId = await sendVerificationEmail({
      to:   TEST_EMAIL,
      name: "Test User",
      code: "123456",
      type: "LOGIN",
    });

    const msg = `✅ Test email sent. Resend message id: ${messageId}`;
    console.log(`${tag} ${msg}`);
    console.log(`${tag} ── END TEST ────────────────────────────────────`);
    return { success: true, message: msg };

  } catch (err: any) {
    const msg = `❌ Test email FAILED: ${err?.message ?? "Unknown error"}`;
    console.error(`${tag} ${msg}`);
    console.error(`${tag} Full error:`, err);
    console.log(`${tag} ── END TEST ────────────────────────────────────`);
    return { success: false, message: msg };
  }
}
