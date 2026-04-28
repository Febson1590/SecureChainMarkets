"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, ArrowDownToLine, ArrowUpFromLine,
  ShieldCheck, TrendingUp, History, HeadphonesIcon, Bell, Copy, Wallet,
  SlidersHorizontal, Lock,
} from "lucide-react";

type NavGroup = {
  label: string;
  items: { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[];
};

/* Grouped admin nav. Mirrors the user-dashboard sidebar structure so the
   two views feel like the same product. */
const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin",                 label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/users",           label: "Users",     icon: Users },
    ],
  },
  {
    label: "Trading",
    items: [
      { href: "/admin/investments",     label: "Investments",  icon: TrendingUp },
      { href: "/admin/copy-traders",    label: "Copy Traders", icon: Copy },
      { href: "/admin/transactions",    label: "Transactions", icon: History },
    ],
  },
  {
    label: "Wallet",
    items: [
      { href: "/admin/deposits",        label: "Deposits",        icon: ArrowDownToLine },
      { href: "/admin/deposit-wallets", label: "Deposit Wallets", icon: Wallet },
      { href: "/admin/withdrawals",     label: "Withdrawals",     icon: ArrowUpFromLine },
      { href: "/admin/limits",          label: "Limits",          icon: SlidersHorizontal },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/verification",    label: "KYC / Verification", icon: ShieldCheck },
      { href: "/admin/support",         label: "Support",            icon: HeadphonesIcon },
      { href: "/admin/notifications",   label: "Notifications",      icon: Bell },
      { href: "/admin/security",        label: "Security",           icon: Lock },
    ],
  },
];

interface AdminNavProps {
  isMobile?: boolean;
  onNavClick?: () => void;
}

export default function AdminNav({ isMobile = false, onNavClick }: AdminNavProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-[#0B1220]/85 backdrop-blur-md border-r border-white/[0.06] flex-shrink-0",
        isMobile ? "w-full h-full" : "w-60 hidden lg:flex"
      )}
    >
      {/* Logo header — matches user dashboard top navbar */}
      <div
        className="flex items-center h-16 px-4 border-b border-slate-200 flex-shrink-0"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F7FAFF 100%)",
        }}
      >
        <Logo size="sm" href="/admin" />
      </div>

      {/* Admin Control label */}
      <div className="px-5 pt-4 pb-1 flex-shrink-0">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#3B82F6]/10 border border-[#3B82F6]/25">
          <span className="w-1 h-1 rounded-full bg-[#3B82F6]" />
          <span className="text-[9.5px] font-bold text-[#3B82F6] uppercase tracking-[0.22em]">
            Admin Control
          </span>
        </div>
      </div>

      <nav className="flex-1 px-2 pt-3 pb-4 space-y-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavClick}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-200 group",
                      active
                        ? "bg-[#2B6BFF]/[0.14] text-white shadow-[inset_0_0_0_1px_rgba(43,107,255,0.22)]"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                    )}
                  >
                    {active && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#3B82F6]"
                        style={{ boxShadow: "0 0 14px rgba(59,130,246,0.65)" }}
                      />
                    )}
                    <item.icon
                      className={cn(
                        "h-[17px] w-[17px] flex-shrink-0 transition-colors",
                        active ? "text-[#3B82F6]" : "text-slate-400 group-hover:text-white"
                      )}
                      strokeWidth={2}
                    />
                    <span className="tracking-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
