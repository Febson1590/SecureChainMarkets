"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyOtp, sendOtp } from "@/lib/actions/otp";
import { signInAfterRegister } from "@/lib/actions/auth";
import { OtpType } from "@prisma/client";
import {
  ShieldCheck, Mail, Loader2, AlertCircle, RefreshCw, ArrowLeft, Lock,
} from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/utils";

function VerifyContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const type  = (searchParams.get("type") || "REGISTER").toUpperCase() as OtpType;

  const [digits,         setDigits]         = useState<string[]>(Array(6).fill(""));
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");
  const [resending,      setResending]      = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

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
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (/^[0-9]$/.test(e.key) && digits.every(d => d) && digits[index]) { e.preventDefault(); return; }
    if (e.key.length === 1 && !/^[0-9]$/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault(); return;
    }
    if (e.key === "Backspace") {
      if (digits[index]) { const arr = [...digits]; arr[index] = ""; setDigits(normaliseDigits(arr)); }
      else if (index > 0) inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft"  && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) { setError("Enter all 6 digits."); return; }

    setLoading(true);
    setError("");

    const result = await verifyOtp(email, code, type);
    if ('error' in result) {
      setError(friendlyError(result.error));
      setDigits(Array(6).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
      setLoading(false);
      return;
    }

    if (type === OtpType.REGISTER) {
      const storageKey = `VorateTrade:postVerifyAuth:${email.toLowerCase()}`;
      let storedPassword = "";
      try { storedPassword = sessionStorage.getItem(storageKey) ?? ""; } catch { /* noop */ }

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

      toast.success("Email verified successfully", {
        description: "Please sign in to continue.",
      });
      router.push("/login");
    }
  }

  async function handleResend() {
    if (resendCooldown > 0 || !email) return;
    setResending(true);
    const result = await sendOtp(email, type);
    setResending(false);
    if ('error' in result) toast.error(friendlyError(result.error));
    else {
      toast.success("New code sent! Check your inbox.");
      setResendCooldown(60);
      setDigits(Array(6).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }

  const isRegister = type === OtpType.REGISTER;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-14 pb-12 sm:pb-16">
      <div className="w-full max-w-[480px] mx-auto">

        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4">
            <ShieldCheck className="h-7 w-7 text-[#D4AF37]" strokeWidth={2} />
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#1A1A22]">
            {isRegister ? "Verify Your Email" : "Two-Factor Verification"}
          </h1>
          <p className="mt-2 text-[13.5px] text-slate-600">
            We sent a 6-digit code to{" "}
            <span className="text-[#D4AF37] font-semibold break-all">{email || "your email"}</span>
          </p>
        </div>

        {/* Form card */}
        <div
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8"
          style={{ boxShadow: "0 22px 60px -28px rgba(20, 20, 26,0.18)" }}
        >
          {/* Email reminder */}
          <div className="flex items-start gap-3 rounded-xl p-3.5 mb-6 bg-[#FBF4DC] border border-[#E6D9A6]">
            <Mail className="h-4 w-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-slate-600 leading-relaxed">
              Check your inbox and spam folder. The code expires in{" "}
              <span className="text-[#1A1A22] font-semibold">10 minutes</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* OTP digit inputs */}
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
                    className={`flex-1 min-w-0 max-w-[52px] h-14 text-center text-[22px] font-bold rounded-xl bg-white text-[#1A1A22] tabular-nums caret-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-150 disabled:opacity-60
                      ${error
                        ? "border-2 border-rose-400 bg-rose-50"
                        : d
                          ? "border-2 border-[#D4AF37] bg-[#FBF4DC]"
                          : "border border-slate-200 focus:border-[#D4AF37]"}`}
                    aria-label={`Digit ${i + 1}`}
                  />
                );
              })}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 mb-5">
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || digits.join("").length < 6}
              className="w-full h-12 rounded-lg text-[15px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              style={{
                background: "#D4AF37",
                boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(212, 175, 55,0.32)",
              }}
            >
              {loading
                ? (<><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>)
                : (isRegister ? "Verify Email" : "Confirm & Sign In")}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-5 pt-5 border-t border-slate-200 text-center">
            <p className="text-[13px] text-slate-500 mb-2">Didn&apos;t receive the code?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || resendCooldown > 0}
              className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#D4AF37] hover:text-[#B8941F] transition-colors disabled:text-slate-400 disabled:cursor-not-allowed"
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
              className="inline-flex items-center gap-1.5 text-[12.5px] text-slate-600 hover:text-[#1A1A22] transition-colors"
            >
              <ArrowLeft size={12} />
              {isRegister ? "Back to registration" : "Back to login"}
            </Link>
          </div>
        </div>

        {/* Below-card security note */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#1A1A22]">
            <Lock size={13} className="text-[#D4AF37]" />
            Your security is our priority
          </div>
          <p className="text-[11.5px] text-slate-500 mt-1">
            All connections are secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="px-4 py-10" />}>
      <VerifyContent />
    </Suspense>
  );
}
