import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { verifyPasswordResetToken } from "@/lib/actions/password-reset";
import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token
    ? await verifyPasswordResetToken(token)
    : { valid: false as const, reason: "Missing reset token. Use the link from your email." };

  if (!result.valid) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-14 pb-12 sm:pb-16">
        <div className="w-full max-w-[480px] mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 mb-4">
            <ShieldAlert className="h-7 w-7 text-rose-600" />
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#0A1A3A]">
            Reset link not valid
          </h1>
          <p className="mt-2 text-[13.5px] text-slate-600 leading-[1.6]">
            {result.reason}
          </p>

          <div
            className="mt-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-7"
            style={{ boxShadow: "0 22px 60px -28px rgba(15,23,42,0.18)" }}
          >
            <p className="text-[13px] text-slate-600 mb-5">
              Reset links expire after 30 minutes and can only be used once.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-[14px] font-semibold text-white"
              style={{
                background: "#2B6BFF",
                boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(43,107,255,0.32)",
              }}
            >
              Request a new link
            </Link>
            <div className="mt-5 pt-5 border-t border-slate-200">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-[13px] text-slate-600 hover:text-[#0A1A3A]"
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

  return <ResetPasswordForm token={token!} email={result.email} />;
}
