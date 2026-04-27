"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { Label }  from "@/components/ui/label";
import { Card }   from "@/components/ui/card";
import { initiateLogin, completeLogin } from "@/lib/actions/auth";
import { sendOtp } from "@/lib/actions/otp";
import { OtpType } from "@prisma/client";
import {
  Eye, EyeOff, Lock, Mail, Loader2, AlertCircle,
  ShieldCheck, RefreshCw, ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/utils";

const schema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  // ── Step state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [lockedEmail,    setLockedEmail]    = useState("");
  const [lockedPassword, setLockedPassword] = useState("");

  // ── Credentials step ────────────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const result = await initiateLogin(data);
      setLoading(false);
      if ('error' in result) {
        setError(friendlyError(result.error));
        return;
      }
      // pending: true → move to OTP step
      setLockedEmail(data.email);
      setLockedPassword(data.password);
      setStep("otp");
    } catch {
      // Admin redirect fires here — Next.js handles the navigation
    }
  };

  // ── OTP step ─────────────────────────────────────────────────────────────
  const [digits,        setDigits]        = useState<string[]>(Array(6).fill(""));
  const [otpLoading,    setOtpLoading]    = useState(false);
  const [otpError,      setOtpError]      = useState("");
  const [resending,     setResending]     = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first OTP slot when step changes to otp
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 80);
    }
  }, [step]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  /** Always returns a length-6 string array, sanitised to digits-only, never longer. */
  function normaliseDigits(next: (string | undefined)[]): string[] {
    const out: string[] = [];
    for (let i = 0; i < 6; i++) {
      const v = (next[i] ?? "").replace(/\D/g, "");
      out[i] = v.slice(-1); // single char per slot
    }
    return out;
  }

  function handleDigitChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "");
    // Multi-char input (paste, autofill, fast typing): write only the first 6 digits starting at index.
    if (cleaned.length > 1) {
      const arr = [...digits];
      const maxWrite = Math.min(cleaned.length, 6 - index);
      for (let i = 0; i < maxWrite; i++) arr[index + i] = cleaned[i]!;
      const next = normaliseDigits(arr);
      setDigits(next);
      const lastFilled = Math.min(index + maxWrite, 5);
      inputRefs.current[lastFilled]?.focus();
      setOtpError("");
      return;
    }
    // Single-char input. Ignore if all 6 slots already filled and we'd be appending.
    if (cleaned && digits.every(d => d) && !digits[index]) return;
    const arr = [...digits];
    arr[index] = cleaned;
    setDigits(normaliseDigits(arr));
    setOtpError("");
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    // Block extra digit input once all 6 slots are filled.
    if (/^[0-9]$/.test(e.key) && digits.every(d => d) && digits[index]) {
      e.preventDefault();
      return;
    }
    // Block any non-digit / non-control key.
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

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) { setOtpError("Enter all 6 digits."); return; }

    setOtpLoading(true);
    setOtpError("");

    try {
      const result = await completeLogin({
        email:    lockedEmail,
        password: lockedPassword,
        otp:      code,
      });
      if (result && 'error' in result) {
        setOtpError(friendlyError(result.error));
        setDigits(Array(6).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    } catch {
      // redirect fires here — do nothing
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0 || !lockedEmail) return;
    setResending(true);
    const result = await sendOtp(lockedEmail, OtpType.LOGIN);
    setResending(false);
    if ('error' in result) { toast.error(friendlyError(result.error)); }
    else {
      toast.success("New code sent! Check your inbox.");
      setResendCooldown(60);
      setDigits(Array(6).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md">

      {/* ── STEP 1: Credentials ──────────────────────────────────────────── */}
      {step === "credentials" && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-sm text-slate-500">Sign in to your SecureChainMarkets account</p>
          </div>

          <Card className="bg-white/[0.03] border border-white/[0.08] shadow-[0_20px_60px_-24px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.04)_inset] rounded-2xl p-8">
            {error && (
              <div className="mb-5 flex items-center gap-2.5 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-lg px-4 py-3">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-500 uppercase tracking-widest">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="pl-11 bg-white/[0.04] border-white/[0.10] text-white placeholder:text-slate-500 h-12 rounded-lg shadow-sm transition-shadow focus:border-[#d4a857] focus:ring-2 focus:ring-[#d4a857]/20 focus:shadow-[0_0_0_4px_rgba(212,168,87,0.12)]"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-widest">Password</Label>
                  <Link href="/contact" className="text-xs text-[#d4a857] hover:text-white">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-11 pr-11 bg-white/[0.04] border-white/[0.10] text-white placeholder:text-slate-500 h-12 rounded-lg shadow-sm transition-shadow focus:border-[#d4a857] focus:ring-2 focus:ring-[#d4a857]/20 focus:shadow-[0_0_0_4px_rgba(212,168,87,0.12)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                style={{ background: "linear-gradient(180deg, #d4a857 0%, #b8902f 100%)" }}
                className="w-full h-12 rounded-md font-semibold text-[#08111F] shadow-[0_8px_24px_-8px_rgba(212,168,87,0.55)] hover:brightness-110 active:scale-[0.99] transition-all duration-200"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking…</>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/[0.08] text-center">
              <p className="text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-[#d4a857] hover:text-white font-medium">
                  Create account
                </Link>
              </p>
            </div>

          </Card>
        </>
      )}

      {/* ── STEP 2: OTP Verification ─────────────────────────────────────── */}
      {step === "otp" && (
        <>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(212,168,87,0.12)", border: "1px solid rgba(212,168,87,0.18)" }}>
                <ShieldCheck className="h-7 w-7 text-[#d4a857]" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Verify Your Identity</h1>
            <p className="text-sm text-slate-500">
              We sent a 6-digit code to{" "}
              <span className="text-[#d4a857] font-medium">{lockedEmail}</span>
            </p>
          </div>

          <Card className="bg-white/[0.03] border border-white/[0.08] shadow-[0_20px_60px_-24px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.04)_inset] rounded-2xl p-8">

            {/* Email hint */}
            <div className="flex items-center gap-3 rounded-xl p-3.5 mb-7"
              style={{ background: "rgba(212,168,87,0.08)", border: "1px solid rgba(212,168,87,0.14)" }}>
              <Mail className="h-4 w-4 text-[#d4a857] flex-shrink-0" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Check your inbox and spam folder. The code expires in{" "}
                <span className="text-slate-300 font-medium">10 minutes</span>.
              </p>
            </div>

            <form onSubmit={handleOtpSubmit}>
              {/* Digit inputs — always exactly 6 boxes regardless of state shape */}
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
                    onChange={e => handleDigitChange(i, e.target.value)}
                    onKeyDown={e => handleDigitKeyDown(i, e)}
                    onPaste={e => {
                      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                      if (!pasted) return;
                      e.preventDefault();
                      handleDigitChange(0, pasted);
                    }}
                    disabled={otpLoading}
                    className={`
                      flex-1 min-w-0 max-w-[52px] h-14 text-center text-xl font-bold rounded-xl
                      bg-white/[0.04] border text-white
                      focus:outline-none focus:ring-0
                      transition-all duration-150
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${otpError
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

              {otpError && (
                <div className="flex items-center gap-2 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-lg px-4 py-3 mb-5">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {otpError}
                </div>
              )}

              <Button
                type="submit"
                disabled={otpLoading || digits.join("").length < 6}
                style={{ background: "linear-gradient(180deg, #d4a857 0%, #b8902f 100%)" }}
                className="w-full h-12 rounded-md font-semibold text-[#08111F] shadow-[0_8px_24px_-8px_rgba(212,168,87,0.55)] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {otpLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…</>
                ) : (
                  "Confirm & Sign In"
                )}
              </Button>
            </form>

            {/* Resend */}
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

            {/* Back to credentials */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => { setStep("credentials"); setDigits(Array(6).fill("")); setOtpError(""); }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <ArrowLeft size={12} />
                Use a different account
              </button>
            </div>

          </Card>
        </>
      )}
    </div>
  );
}
