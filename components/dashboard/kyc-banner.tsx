"use client";

import Link from "next/link";
import { ShieldAlert, Clock, XCircle, ChevronRight } from "lucide-react";
import type { KycStatus } from "@/lib/kyc";

const CONFIG: Record<
  Exclude<KycStatus, "approved">,
  { icon: typeof ShieldAlert; color: string; bg: string; border: string; iconBg: string; title: string; message: string; cta: string; ctaSolid: boolean }
> = {
  not_submitted: {
    icon: ShieldAlert,
    color: "text-[#0A1A3A]",
    bg: "bg-[#EAF2FF]",
    border: "border-[#DCE6FA]",
    iconBg: "bg-white",
    title: "Identity verification required",
    message: "Complete KYC to unlock deposits, withdrawals, and investing.",
    cta: "Verify Now",
    ctaSolid: true,
  },
  pending: {
    icon: Clock,
    color: "text-[#0A1A3A]",
    bg: "bg-[#EAF2FF]",
    border: "border-[#DCE6FA]",
    iconBg: "bg-white",
    title: "Verification under review",
    message: "Our compliance team is reviewing your documents. This typically takes 1–3 business days.",
    cta: "View Status",
    ctaSolid: false,
  },
  rejected: {
    icon: XCircle,
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    iconBg: "bg-white",
    title: "Verification rejected",
    message: "Please resubmit with valid documents to unlock full platform access.",
    cta: "Resubmit",
    ctaSolid: true,
  },
};

interface KycBannerProps {
  kycStatus: KycStatus;
  className?: string;
}

/**
 * Shared KYC restriction banner — shows an inline notice when KYC is not
 * approved. Renders nothing for approved users.
 */
export function KycBanner({ kycStatus, className }: KycBannerProps) {
  if (kycStatus === "approved") return null;

  const cfg = CONFIG[kycStatus];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-xl p-4 flex items-center gap-4 border ${cfg.bg} ${cfg.border} ${className ?? ""}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.iconBg} ring-1 ring-[#2B6BFF]/15`}>
        <Icon className={`h-5 w-5 ${cfg.color === "text-rose-700" ? "text-rose-600" : "text-[#2B6BFF]"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${cfg.color}`}>{cfg.title}</p>
        <p className="text-xs text-[#64748B] mt-0.5">{cfg.message}</p>
      </div>
      {cfg.ctaSolid ? (
        <Link
          href="/dashboard/verification"
          className="flex-shrink-0 inline-flex items-center gap-1 px-4 h-9 rounded-md text-xs font-semibold text-[#0F172A] transition-all hover:brightness-110"
          style={{
            background: "#2B6BFF",
            boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 6px 14px rgba(43,107,255,0.30)",
          }}
        >
          {cfg.cta} <ChevronRight size={12} />
        </Link>
      ) : (
        <Link
          href="/dashboard/verification"
          className="flex-shrink-0 inline-flex items-center gap-1 px-4 h-9 rounded-md text-xs font-semibold text-[#2B6BFF] border border-[#2B6BFF]/30 hover:bg-[#2B6BFF] hover:text-white transition-colors"
        >
          {cfg.cta} <ChevronRight size={12} />
        </Link>
      )}
    </div>
  );
}
