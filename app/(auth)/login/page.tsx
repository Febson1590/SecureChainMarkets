"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { initiateLogin, completeLogin } from "@/lib/actions/auth";
import { sendOtp } from "@/lib/actions/otp";
import { OtpType } from "@prisma/client";
import {
  Eye, EyeOff, Lock, Mail, Loader2, AlertCircle,
  ShieldCheck, RefreshCw, ArrowLeft, Globe, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/utils";

const schema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

const valueProps = [
  { icon: Globe,       title: "Major digital assets", desc: "Bitcoin, Ethereum and the most-traded altcoins quoted against USD." },
  { icon: Zap,         title: "Built for clarity",    desc: "Bid, ask and spread shown plainly — no hidden markups." },
  { icon: ShieldCheck, title: "Account protection",   desc: "Two-factor sign-in and reviewed funding on every account." },
];

export default function LoginPage() {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [lockedEmail,    setLockedEmail]    = useState("");
  const [lockedPassword, setLockedPassword] = useState("");

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
      setLockedEmail(data.email);
      setLockedPassword(data.password);
      setStep("otp");
    } catch {
      // Admin redirect — handled by Next.js
    }
  };

  /* ── OTP step ─────────────────────────────────────────────────────────── */
  const [digits,        setDigits]        = useState<string[]>(Array(6).fill(""));
  const [otpLoading,    setOtpLoading]    = useState(false);
  const [otpError,      setOtpError]      = useState("");
  const [resending,     setResending]     = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "otp") setTimeout(() => inputRefs.current[0]?.focus(), 80);
  }, [step]);

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
  function handleDigitChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "");
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
    if (cleaned && digits.every(d => d) && !digits[index]) return;
    const arr = [...digits]; arr[index] = cleaned;
    setDigits(normaliseDigits(arr));
    setOtpError("");
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();
  }
  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (/^[0-9]$/.test(e.key) && digits.every(d => d) && digits[index]) { e.preventDefault(); return; }
    if (e.key.length === 1 && !/^[0-9]$/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); return; }
    if (e.key === "Backspace") {
      if (digits[index]) { const arr = [...digits]; arr[index] = ""; setDigits(normaliseDigits(arr)); }
      else if (index > 0) inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft"  && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  }
  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) { setOtpError("Enter all 6 digits."); return; }
    setOtpLoading(true); setOtpError("");
    try {
      const result = await completeLogin({ email: lockedEmail, password: lockedPassword, otp: code });
      if (result && 'error' in result) {
        setOtpError(friendlyError(result.error));
        setDigits(Array(6).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    } catch { /* redirect */ } finally { setOtpLoading(false); }
  }
  async function handleResend() {
    if (resendCooldown > 0 || !lockedEmail) return;
    setResending(true);
    const result = await sendOtp(lockedEmail, OtpType.LOGIN);
    setResending(false);
    if ('error' in result) toast.error(friendlyError(result.error));
    else {
      toast.success("New code sent! Check your inbox.");
      setResendCooldown(60);
      setDigits(Array(6).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-14 pb-12 sm:pb-16">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

        {/* ════════════════════ LEFT: Branding panel (desktop only) ═════════════════ */}
        <div className="hidden lg:block lg:order-1">
          <h1 className="text-[36px] sm:text-[44px] font-bold tracking-tight leading-[1.05] text-[#0A1A3A]">
            Trade Smarter.
            <br />
            Invest <span className="text-[#2B6BFF]">Confidently.</span>
          </h1>
          <p className="mt-5 text-[14px] sm:text-[15px] text-slate-600 leading-[1.65] max-w-[460px]">
            A focused brokerage for major digital assets — clear pricing,
            reviewed funding, and a clean trading experience.
          </p>

          <ul className="mt-9 space-y-5 max-w-[460px]">
            {valueProps.map((v) => (
              <li key={v.title} className="flex items-start gap-4">
                <span className="mt-0.5 w-10 h-10 rounded-lg bg-[#2B6BFF]/10 border border-[#2B6BFF]/20 flex items-center justify-center flex-shrink-0">
                  <v.icon size={17} className="text-[#2B6BFF]" />
                </span>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-[#0A1A3A] leading-snug">{v.title}</div>
                  <div className="text-[12.5px] text-slate-600 leading-relaxed mt-1">{v.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ════════════════════ RIGHT: Form card ═════════════════ */}
        <div className="order-1 lg:order-2 w-full max-w-[560px] mx-auto lg:mx-0 lg:max-w-none">
          <div
            className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 lg:p-9"
            style={{ boxShadow: "0 22px 60px -28px rgba(15,23,42,0.18)" }}
          >
            {step === "credentials" && (
              <>
                <div className="text-center mb-7">
                  <h2 className="text-[24px] sm:text-[26px] font-bold text-[#0A1A3A] tracking-tight">
                    Welcome Back
                  </h2>
                  <p className="mt-1.5 text-[13.5px] text-slate-500">
                    Sign in to your SecureChainMarkets account
                  </p>
                </div>

                {error && (
                  <div className="mb-5 flex items-center gap-2.5 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full h-12 pl-11 pr-4 rounded-lg bg-white border border-slate-200 text-[14px] text-[#0A1A3A] placeholder:text-slate-400 focus:outline-none focus:border-[#2B6BFF] focus:ring-2 focus:ring-[#2B6BFF]/15 transition-all"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Password</label>
                      <Link href="/contact" className="text-[12px] font-semibold text-[#2B6BFF] hover:text-[#1A4FCC]">Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full h-12 pl-11 pr-11 rounded-lg bg-white border border-slate-200 text-[14px] text-[#0A1A3A] placeholder:text-slate-400 focus:outline-none focus:border-[#2B6BFF] focus:ring-2 focus:ring-[#2B6BFF]/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
                  </div>

                  {/* Sign In button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-lg text-[15px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    style={{
                      background: "#2B6BFF",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(43,107,255,0.32)",
                    }}
                  >
                    {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Checking…</>) : ("Sign In")}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                  <p className="text-[13.5px] text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-semibold text-[#2B6BFF] hover:text-[#1A4FCC]">
                      Create account
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* ── OTP STEP ─────────────────────────────────────────────────── */}
            {step === "otp" && (
              <>
                <div className="flex items-center justify-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#2B6BFF]/10 inline-flex items-center justify-center">
                    <ShieldCheck className="h-7 w-7 text-[#2B6BFF]" />
                  </div>
                </div>
                <h2 className="text-center text-[24px] font-bold text-[#0A1A3A] tracking-tight">Verify Your Identity</h2>
                <p className="text-center mt-2 text-[13.5px] text-slate-500">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-[#2B6BFF]">{lockedEmail}</span>
                </p>

                <div className="mt-6 flex items-center gap-3 rounded-xl p-3.5 bg-[#EAF2FF] border border-[#DCE6FA]">
                  <Mail className="h-4 w-4 text-[#2B6BFF] flex-shrink-0" />
                  <p className="text-[12.5px] text-slate-600 leading-relaxed">
                    Check your inbox and spam folder. The code expires in{" "}
                    <span className="font-semibold text-[#0A1A3A]">10 minutes</span>.
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="mt-6">
                  <div className="flex gap-2 sm:gap-2.5 justify-center mb-5">
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
                          className={`flex-1 min-w-0 max-w-[52px] h-14 text-center text-xl font-bold rounded-xl bg-white border text-[#0A1A3A] focus:outline-none focus:ring-2 focus:ring-[#2B6BFF]/20 transition-all duration-150 disabled:opacity-50
                            ${otpError ? "border-rose-400 bg-rose-50" : d ? "border-[#2B6BFF] bg-[#EAF2FF]" : "border-slate-200 focus:border-[#2B6BFF]"}`}
                          aria-label={`Digit ${i + 1}`}
                        />
                      );
                    })}
                  </div>

                  {otpError && (
                    <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 mb-5">
                      <AlertCircle size={14} className="flex-shrink-0" />
                      {otpError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={otpLoading || digits.join("").length < 6}
                    className="w-full h-12 rounded-lg text-[15px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    style={{
                      background: "#2B6BFF",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(43,107,255,0.32)",
                    }}
                  >
                    {otpLoading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>) : ("Confirm & Sign In")}
                  </button>
                </form>

                <div className="mt-5 pt-5 border-t border-slate-200 text-center">
                  <p className="text-[13px] text-slate-500 mb-2">Didn&apos;t receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending || resendCooldown > 0}
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#2B6BFF] hover:text-[#1A4FCC] disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    {resending ? (<><Loader2 size={14} className="animate-spin" /> Sending…</>)
                      : resendCooldown > 0 ? (<><RefreshCw size={14} /> Resend in {resendCooldown}s</>)
                      : (<><RefreshCw size={14} /> Resend code</>)}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => { setStep("credentials"); setDigits(Array(6).fill("")); setOtpError(""); }}
                    className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-700"
                  >
                    <ArrowLeft size={12} />
                    Use a different account
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Below-card legal line */}
          <p className="text-[11.5px] text-slate-500 text-center mt-6">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-[#2B6BFF] hover:underline underline-offset-2 font-semibold">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#2B6BFF] hover:underline underline-offset-2 font-semibold">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
