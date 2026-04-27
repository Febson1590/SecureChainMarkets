"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card }   from "@/components/ui/card";
import { verifyOtp, sendOtp } from "@/lib/actions/otp";
import { signInAfterRegister } from "@/lib/actions/auth";
import { OtpType } from "@prisma/client";
import {
  ShieldCheck, Mail, Loader2, AlertCircle, RefreshCw, ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/utils";

function VerifyContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const type  = (searchParams.get("type") || "REGISTER").toUpperCase() as OtpType;

  const [digits,   setDigits]   = useState<string[]>(Array(6).fill(""));
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Digit input handling ──────────────────────────────────────────────────
  /** Always returns a length-6 string array, sanitised to digits-only, never longer. */
  function normaliseDigits(next: (string | undefined)[]): string[] {
    const out: string[] = [];
    for (let i = 0; i < 6; i++) {
      const v = (next[i] ?? "").replace(/\D/g, "");
      out[i] = v.slice(-1);
    }
    return out;
  }

  function handleChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length > 1) {
      const arr = [...digits];
      const maxWrite = Math.min(cleaned.length, 6 - index);
      for (let i = 0; i < maxWrite; i++) arr[index + i] = cleaned[i]!;
      const next = normaliseDigits(arr);
      setDigits(next);
      const lastFilled = Math.min(index + maxWrite, 5);
      inputRefs.current[lastFilled]?.focus();
      setError("");
      return;
    }

    if (cleaned && digits.every(d => d) && !digits[index]) return;

    const arr = [...digits];
    arr[index] = cleaned;
    setDigits(normaliseDigits(arr));
    setError("");

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (/^[0-9]$/.test(e.key) && digits.every(d => d) && digits[index]) {
      e.preventDefault();
      return;
    }
    if (
      e.key.length === 1 &&
      !/^[0-9]$/.test(e.key) &&
      !e.metaKey && !e.ctrlKey && !e.altKey
    ) {
      e.preventDefault();
      return;
    }
    if (e.key === "Backspace") {
      if (digits[index]) {
        const arr = [...digits]; arr[index] = ""; setDigits(normaliseDigits(arr));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft"  && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  }

  // ── Submit OTP ───────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) { setError("Enter all 6 digits."); return; }

    setLoading(true);
    setError("");

    const result = await verifyOtp(email, code, type);

    if ('error' in result) {
      setError(friendlyError(result.error));
      // Shake + clear on wrong code
      setDigits(Array(6).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
      setLoading(false);
      return;
    }

    if (type === OtpType.REGISTER) {
      // Try to automatically sign the user in using the password the
      // register page stashed in sessionStorage. If it's present and
      // valid, signIn throws NEXT_REDIRECT and the browser navigates to
      // /dashboard. If anything goes wrong we fall back to /login with a
      // success-but-sign-in-required toast.
      const storageKey = `SECURECHAINMARKETS:postVerifyAuth:${email.toLowerCase()}`;
      let storedPassword = "";
      try {
        storedPassword = sessionStorage.getItem(storageKey) ?? "";
      } catch { /* storage blocked */ }

      if (storedPassword) {
        toast.success("Email verified successfully", {
          description: "Redirecting you to your account…",
        });
        try {
          const r = await signInAfterRegister({ email, password: storedPassword });
          if (r && "error" in r) {
            try { sessionStorage.removeItem(storageKey); } catch { /* noop */ }
            toast.success("Email verified successfully", {
              description: "Please sign in to continue.",
            });
            router.push("/login");
          }
        } catch (err: any) {
          if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith?.("NEXT_REDIRECT")) {
            try { sessionStorage.removeItem(storageKey); } catch { /* noop */ }
            throw err;
          }
          try { sessionStorage.removeItem(storageKey); } catch { /* noop */ }
          toast.success("Email verified successfully", {
            description: "Please sign in to continue.",
          });
          router.push("/login");
        }
        return;
      }

      // No stashed password (refreshed tab, different browser, etc.) —
      // graceful fallback to /login.
      toast.success("Email verified successfully", {
        description: "Please sign in to continue.",
      });
      router.push("/login");
    }
    // For LOGIN type, this page is never shown (login page handles it inline).
  }

  // ── Resend OTP ───────────────────────────────────────────────────────────
  async function handleResend() {
    if (resendCooldown > 0 || !email) return;
    setResending(true);

    const result = await sendOtp(email, type);
    setResending(false);

    if ('error' in result) {
      toast.error(friendlyError(result.error));
    } else {
      toast.success("New code sent! Check your inbox.");
      setResendCooldown(60);
      setDigits(Array(6).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }

  const isRegister = type === OtpType.REGISTER;

  return (
    <div className="w-full max-w-md">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(212,168,87,0.12)", border: "1px solid rgba(212,168,87,0.18)" }}>
            <ShieldCheck className="h-7 w-7 text-[#d4a857]" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {isRegister ? "Verify Your Email" : "Two-Factor Verification"}
        </h1>
        <p className="text-sm text-slate-500">
          We sent a 6-digit code to{" "}
          <span className="text-[#d4a857] font-medium">{email || "your email"}</span>
        </p>
      </div>

      <Card className="bg-white/[0.03] border border-white/[0.08] shadow-[0_20px_60px_-24px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.04)_inset] rounded-2xl p-8 ">

        {/* Email reminder */}
        <div className="flex items-center gap-3 rounded-xl p-3.5 mb-7"
          style={{ background: "rgba(212,168,87,0.08)", border: "1px solid rgba(212,168,87,0.14)" }}>
          <Mail className="h-4 w-4 text-[#d4a857] flex-shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Check your inbox and spam folder. The code expires in{" "}
            <span className="text-slate-300 font-medium">10 minutes</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* OTP digit inputs — always exactly 6 boxes, never more */}
          <div className="flex gap-2 sm:gap-2.5 justify-center mb-5 max-w-full">
            {Array.from({ length: 6 }).map((_, i) => {
              const d = digits[i] ?? "";
              return (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={e => {
                  const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                  if (!pasted) return;
                  e.preventDefault();
                  handleChange(0, pasted);
                }}
                disabled={loading}
                className={`
                  flex-1 min-w-0 max-w-[52px] h-14 text-center text-xl font-bold rounded-xl
                  bg-white/[0.04] border text-white
                  focus:outline-none focus:ring-0
                  transition-all duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${error
                    ? "border-red-500/50 bg-red-500/5"
                    : d
                      ? "border-[#d4a857]/60 bg-[#d4a857]/8 shadow-[0_0_0_3px_rgba(212,168,87,0.12)]"
                      : "border-white/[0.10] focus:border-[#d4a857]/50 focus:bg-white/[0.05]"}
                `}
                style={{
                  caretColor: "#d4a857",
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                  WebkitAppearance: "none",
                  backgroundColor: d ? "rgba(212,168,87,0.10)" : "rgba(255,255,255,0.04)",
                  borderColor: d ? "rgba(212,168,87,0.55)" : "rgba(255,255,255,0.10)",
                }}
                aria-label={`Digit ${i + 1}`}
              />
              );
            })}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-lg px-4 py-3 mb-5">
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={loading || digits.join("").length < 6}
            style={{ background: "linear-gradient(180deg, #d4a857 0%, #b8902f 100%)" }}
            className="w-full h-12 rounded-md font-semibold text-[#08111F] shadow-[0_8px_24px_-8px_rgba(212,168,87,0.55)] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…</>
            ) : (
              isRegister ? "Verify Email" : "Confirm & Sign In"
            )}
          </Button>
        </form>

        {/* Resend code */}
        <div className="mt-5 pt-5 border-t border-white/[0.08] text-center">
          <p className="text-sm text-slate-500 mb-2">Didn&apos;t receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || resendCooldown > 0}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#d4a857]
              hover:text-white transition-colors disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            {resending ? (
              <><Loader2 size={14} className="animate-spin" /> Sending…</>
            ) : resendCooldown > 0 ? (
              <><RefreshCw size={14} /> Resend in {resendCooldown}s</>
            ) : (
              <><RefreshCw size={14} /> Resend code</>
            )}
          </button>
        </div>

        {/* Back link */}
        <div className="mt-4 text-center">
          <Link
            href={isRegister ? "/register" : "/login"}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft size={12} />
            {isRegister ? "Back to registration" : "Back to login"}
          </Link>
        </div>

      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md" />}>
      <VerifyContent />
    </Suspense>
  );
}
