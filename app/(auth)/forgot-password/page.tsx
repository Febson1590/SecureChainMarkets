"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail, Lock, Loader2, AlertCircle, ArrowLeft, CheckCircle2,
} from "lucide-react";
import { requestPasswordReset } from "@/lib/actions/password-reset";

export default function ForgotPasswordPage() {
  const [email,    setEmail]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Enter your email address.");
      return;
    }
    setLoading(true);
    setError("");

    const result = await requestPasswordReset(email);
    setLoading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-14 pb-12 sm:pb-16">
      <div className="w-full max-w-[480px] mx-auto">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2B6BFF]/10 border border-[#2B6BFF]/20 mb-4">
            <Lock className="h-7 w-7 text-[#2B6BFF]" strokeWidth={2} />
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#0A1A3A]">
            Forgot your password?
          </h1>
          <p className="mt-2 text-[13.5px] text-slate-600 leading-[1.6]">
            Enter your account email and we&rsquo;ll send you a link to choose a new password.
          </p>
        </div>

        <div
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8"
          style={{ boxShadow: "0 22px 60px -28px rgba(15,23,42,0.18)" }}
        >
          {submitted ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 mb-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-[18px] font-bold text-[#0A1A3A] mb-2">Check your inbox</h2>
              <p className="text-[13.5px] text-slate-600 leading-[1.6] mb-1">
                If an account exists for{" "}
                <span className="font-semibold text-[#2B6BFF] break-all">{email}</span>,
                we&rsquo;ve sent a password-reset link to it.
              </p>
              <p className="text-[12.5px] text-slate-500 leading-[1.6]">
                The link expires in 30 minutes. Check your spam folder if you don&rsquo;t see it within a few minutes.
              </p>
              <div className="mt-6 pt-5 border-t border-slate-200">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#2B6BFF] hover:text-[#1A4FCC]"
                >
                  <ArrowLeft size={14} />
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 flex items-center gap-2.5 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-12 pl-11 pr-4 rounded-lg bg-white border border-slate-200 text-[14px] text-[#0A1A3A] placeholder:text-slate-400 focus:outline-none focus:border-[#2B6BFF] focus:ring-2 focus:ring-[#2B6BFF]/15 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-lg text-[15px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  style={{
                    background: "#2B6BFF",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(43,107,255,0.32)",
                  }}
                >
                  {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>) : ("Send reset link")}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-200 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-[13px] text-slate-600 hover:text-[#0A1A3A]"
                >
                  <ArrowLeft size={12} />
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
