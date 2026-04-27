import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = "USD",
  decimals?: number
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : (amount ?? NaN);
  if (!Number.isFinite(num)) return "$0.00";

  if (currency === "USD" || currency === "USDT") {
    // Auto-scale decimals for sub-dollar assets so we don't lose precision.
    const abs = Math.abs(num);
    const auto =
      decimals ??
      (abs >= 1     ? 2
        : abs >= 0.01  ? 4
        : abs >= 0.0001 ? 6
        : 8);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: auto,
      maximumFractionDigits: auto,
    }).format(num);
  }

  return `${num.toFixed(8)} ${currency}`;
}

export function formatNumber(num: number | string, decimals: number = 2): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export function formatCompact(num: number | string | null | undefined): string {
  const n = typeof num === "string" ? parseFloat(num) : (num ?? NaN);
  if (!Number.isFinite(n)) return "0";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatPercent(num: number | string | null | undefined): string {
  const n = typeof num === "string" ? parseFloat(num) : (num ?? NaN);
  if (!Number.isFinite(n)) return "0.00%";
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function generateWalletAddress(currency: string): string {
  const prefixes: Record<string, string> = {
    BTC: "1",
    ETH: "0x",
    USDT: "0x",
    USD: "VAULT-",
  };
  const prefix = prefixes[currency] || "";
  const chars = "abcdef0123456789";
  const length = currency === "BTC" ? 33 : 40;
  let address = prefix;
  for (let i = 0; i < length; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

export function truncateAddress(address: string, chars: number = 6): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getStatusBg(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    FROZEN: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    RESTRICTED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    SUSPENDED: "bg-red-500/10 text-red-400 border-red-500/20",
    PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
    CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    OPEN: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    IN_PROGRESS: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    CLOSED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    FILLED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    PROCESSING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    UNDER_REVIEW: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    BUY: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    SELL: "bg-red-500/10 text-red-400 border-red-500/20",
    DEPOSIT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    WITHDRAWAL: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };
  return colors[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
}

/**
 * Translate raw server / provider error strings into customer-friendly text.
 * Strips out vendor names (Resend, SMTP, etc.) and validation jargon so the
 * UI never surfaces messages like "Email provider rejected the send request.
 * name=\"validation_error\" message=\"…\"" to a real user.
 */
export function friendlyError(raw: string | undefined | null): string {
  if (!raw) return "Something went wrong. Please try again.";
  const s = String(raw);

  // Resend / generic email provider rejections
  if (
    /Email provider rejected/i.test(s) ||
    /validation_error/i.test(s) ||
    /resend\.com\/domains/i.test(s) ||
    /verify a domain/i.test(s) ||
    /onboarding@resend\.dev/i.test(s) ||
    /testing emails to your own/i.test(s)
  ) {
    return "We couldn't send the verification email right now. Please try again in a moment, or contact support if the problem continues.";
  }

  // SMTP / nodemailer surfaces
  if (/SMTP|ECONNREFUSED|ENOTFOUND|EAUTH|getaddrinfo|Greeting never received/i.test(s)) {
    return "Email service is temporarily unavailable. Please try again in a moment.";
  }

  // Rate-limit messages
  if (/rate ?limit|too many requests/i.test(s)) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  // Network blips
  if (/network|fetch failed|timeout|TimedOut/i.test(s)) {
    return "Connection issue. Please check your internet and try again.";
  }

  return s;
}
