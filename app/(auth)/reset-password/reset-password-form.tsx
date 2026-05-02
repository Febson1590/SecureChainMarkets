"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, ArrowLeft,
} from "lucide-react";
import { completePasswordReset } from "@/lib/actions/password-reset";
import { toast } from "sonner";

const PWD_RULES = [
  { label: "At least 8 characters",       test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter",   test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains number",             test: (p: string) => /[0-9]/.test(p) },
];

export function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [done,        setDone]        = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8)         return setError("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(password))     return setError("Password must include at least one uppercase letter.");
    if (!/[0-9]/.test(password))     return setError("Password must include at least one number.");
    if (password !== confirm)        return setError("Passwords do not match.");

    setLoading(true);
    setError("");

    const result = await completePasswordReset({ token, newPassword: password });
    setLoading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    setDone(true);
    toast.success("Password updated", {
      description: "You can now sign in with your new password.",
    });
    setTimeout(() => router.push("/login"), 1500);
  }

  if (done) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-14 pb-12 sm:pb-16">
        <div className="w-full max-w-[480px] mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 mb-4">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#1A1A22]">
            Password updated
          </h1>
          <p className="mt-2 text-[13.5px] text-slate-600">
            Redirecting you to sign in…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-14 pb-12 sm:pb-16">
      <div className="w-full max-w-[480px] mx-auto">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4">
            <Lock className="h-7 w-7 text-[#D4AF37]" strokeWidth={2} />
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#1A1A22]">
            Choose a new password
          </h1>
          <p className="mt-2 text-[13.5px] text-slate-600">
            For{" "}
            <span className="text-[#D4AF37] font-semibold break-all">{email}</span>
          </p>
        </div>

        <div
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8"
          style={{ boxShadow: "0 22px 60px -28px rgba(20, 20, 26,0.18)" }}
        >
          {error && (
            <div className="mb-5 flex items-center gap-2.5 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            {/* New password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  autoFocus
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full h-12 pl-11 pr-11 rounded-lg bg-white border border-slate-200 text-[14px] text-[#1A1A22] placeholder:text-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all"
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {password && (
                <div className="space-y-1 pt-1">
                  {PWD_RULES.map(r => {
                    const ok = r.test(password);
                    return (
                      <div key={r.label} className={`flex items-center gap-2 text-[12px] ${ok ? "text-emerald-600" : "text-slate-500"}`}>
                        <CheckCircle2 size={11} className={ok ? "text-emerald-600" : "text-slate-400"} />
                        {r.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                Confirm new password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Type the password again"
                  className="w-full h-12 pl-11 pr-11 rounded-lg bg-white border border-slate-200 text-[14px] text-[#1A1A22] placeholder:text-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all"
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg text-[15px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              style={{
                background: "#D4AF37",
                boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(212, 175, 55,0.32)",
              }}
            >
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Updating…</>) : ("Update password")}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-[13px] text-slate-600 hover:text-[#1A1A22]"
            >
              <ArrowLeft size={12} />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
