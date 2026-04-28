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
  ShieldCheck, RefreshCw, ArrowLeft,
  TrendingUp, Zap, Headphones,
} from "lucide-react";
import { toast } from "sonner";
import { friendlyError } from "@/lib/utils";

const schema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

const features = [
  { icon: ShieldCheck, title: "Bank-Level Security",  desc: "Your funds and data are protected with 256-bit SSL encryption." },
  { icon: TrendingUp,  title: "Advanced Trading",     desc: "Access real-time markets, advanced charts, and powerful trading tools." },
  { icon: Zap,         title: "Instant Transactions", desc: "Deposit, trade, and withdraw with fast and secure processing." },
  { icon: Headphones,  title: "24/7 Expert Support",  desc: "Our dedicated support team is here to help you anytime." },
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
    <div className="px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

        {/* ════════════════════ LEFT: Welcome + features + illustration ═════════════════ */}
        <div className="order-2 lg:order-1">
          <h1 className="text-[36px] sm:text-[44px] font-bold tracking-tight leading-[1.1] text-[#0A1A3A]">
            Welcome Back!
            <br />
            <span className="text-[#2B6BFF]">Trade with Confidence.</span>
          </h1>
          <p className="mt-5 text-[14px] sm:text-[15px] text-slate-600 leading-[1.65] max-w-[460px]">
            Access your account to continue trading
            and managing your investments securely.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-4 max-w-[460px]">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/80">
                <div className="w-11 h-11 rounded-lg bg-[#2B6BFF]/10 inline-flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-5 w-5 text-[#2B6BFF]" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-[#0A1A3A] leading-tight">{f.title}</div>
                  <p className="text-[12.5px] text-slate-600 mt-1 leading-[1.55]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Illustration — stylized shield on plinth with candlestick chart behind */}
          <div className="mt-10 max-w-[460px]">
            <div className="relative h-[220px] sm:h-[240px]">
              <ShieldIllustration />
            </div>
          </div>

          {/* Company description card */}
          <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200/80 max-w-[460px] flex items-start gap-3">
            <Lock className="h-4 w-4 text-[#2B6BFF] mt-1 flex-shrink-0" />
            <p className="text-[12.5px] text-slate-600 leading-[1.6]">
              SecureChainMarkets is a regulated digital asset
              trading platform offering secure, transparent,
              and innovative trading solutions worldwide.
            </p>
          </div>
        </div>

        {/* ════════════════════ RIGHT: Form card ═════════════════ */}
        <div className="order-1 lg:order-2 w-full">
          <div
            className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-9"
            style={{ boxShadow: "0 22px 60px -28px rgba(15,23,42,0.18)" }}
          >
            {step === "credentials" && (
              <>
                <h2 className="text-[26px] sm:text-[28px] font-bold text-[#0A1A3A] tracking-tight">
                  Login to Your Account
                </h2>
                <p className="mt-2 text-[13.5px] text-slate-500">
                  Enter your credentials to access your account
                </p>

                {error && (
                  <div className="mt-6 flex items-center gap-2.5 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#0A1A3A]">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full h-12 pl-11 pr-4 rounded-lg bg-white border border-slate-200 text-[14px] text-[#0A1A3A] placeholder:text-slate-400 focus:outline-none focus:border-[#2B6BFF] focus:ring-2 focus:ring-[#2B6BFF]/15 transition-all"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#0A1A3A]">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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

                  {/* Forgot password — right aligned */}
                  <div className="flex justify-end">
                    <Link href="/contact" className="text-[13px] font-semibold text-[#2B6BFF] hover:text-[#1A4FCC]">
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-lg text-[15px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    style={{
                      background: "#2B6BFF",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(43,107,255,0.32)",
                    }}
                  >
                    {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Checking…</>) : ("Login")}
                  </button>
                </form>

                {/* Secure Login info card */}
                <div className="mt-6 p-4 rounded-xl bg-[#EAF2FF] border border-[#DCE6FA] flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#2B6BFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[13.5px] font-semibold text-[#0A1A3A]">Secure Login</div>
                    <p className="text-[12.5px] text-slate-600 mt-1 leading-[1.55]">
                      We use advanced encryption to ensure your account
                      information is always protected.
                    </p>
                  </div>
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

          {/* Below-card security note */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0A1A3A]">
              <Lock size={14} className="text-[#2B6BFF]" />
              Your security is our priority
            </div>
            <p className="text-[12px] text-slate-500 mt-1.5">
              All connections are secured with 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Stylized shield-on-plinth illustration with candlestick backdrop ─ */
function ShieldIllustration() {
  return (
    <svg viewBox="0 0 460 240" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="shield-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#5C8BFF" />
          <stop offset="100%" stopColor="#1A4FCC" />
        </linearGradient>
        <linearGradient id="plinth-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <radialGradient id="floor-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"  stopColor="#2B6BFF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2B6BFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Candlestick chart silhouette */}
      <g opacity="0.5">
        {[
          [60,140,30,8,true],   [95,120,45,8,true],  [130,100,30,8,false],
          [165,80, 50,8,true],  [200,60, 35,8,true], [235,75, 28,8,false],
          [355,100,40,8,true],  [385,80, 32,8,true], [415,60, 25,8,true],
        ].map(([x,y,h,w,up], i) => {
          const ox = Number(x), oy = Number(y), oh = Number(h), ow = Number(w);
          const green = Boolean(up);
          return (
            <g key={i}>
              <line x1={ox} y1={oy - 12} x2={ox} y2={oy + oh + 12} stroke={green ? "#10B981" : "#EF4444"} strokeWidth="1.4" opacity="0.5" />
              <rect x={ox - ow/2} y={oy} width={ow} height={oh} fill={green ? "#10B981" : "#EF4444"} opacity="0.7" rx="1.5" />
            </g>
          );
        })}
      </g>

      {/* Floor glow */}
      <ellipse cx="230" cy="210" rx="170" ry="14" fill="url(#floor-glow)" />

      {/* Plinth */}
      <ellipse cx="230" cy="208" rx="120" ry="16" fill="#0A1A3A" opacity="0.10" />
      <rect x="130" y="170" width="200" height="42" rx="10" fill="url(#plinth-grad)" stroke="#CBD5E1" />
      <ellipse cx="230" cy="170" rx="100" ry="10" fill="#FFFFFF" stroke="#CBD5E1" />

      {/* Shield */}
      <g transform="translate(230 95)">
        <path
          d="M0,-65 L55,-45 L55,15 C55,45 30,65 0,75 C-30,65 -55,45 -55,15 L-55,-45 Z"
          fill="url(#shield-grad)"
          stroke="#1A4FCC"
          strokeWidth="1.5"
        />
        <path
          d="M0,-58 L48,-40 L48,12 C48,38 26,55 0,64 C-26,55 -48,38 -48,12 L-48,-40 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        {/* Lock body */}
        <rect x="-16" y="-5" width="32" height="28" rx="4" fill="#FFFFFF" />
        {/* Shackle */}
        <path d="M-10,-5 L-10,-15 A10 10 0 0 1 10 -15 L10,-5" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Keyhole */}
        <circle cx="0" cy="6" r="3" fill="#2B6BFF" />
        <rect x="-1.5" y="6" width="3" height="8" fill="#2B6BFF" />
      </g>
    </svg>
  );
}
