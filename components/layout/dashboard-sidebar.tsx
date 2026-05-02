"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, TrendingUp, Users, ArrowDownToLine,
  ArrowUpFromLine, History, HeadphonesIcon, Settings,
  ChevronLeft, ChevronRight, LogOut, Bell,
} from "lucide-react";
import { logoutUser } from "@/lib/actions/auth";
import { useState } from "react";

type NavGroup = {
  label: string;
  items: { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[];
};

/* Grouped nav so the sidebar reads as three logical sections instead of a
   flat list — matches the rhythm of premium fintech dashboards. */
const navGroups: NavGroup[] = [
  {
    label: "Trading",
    items: [
      { href: "/dashboard",              label: "Overview",     icon: LayoutDashboard, exact: true },
      { href: "/dashboard/investments",  label: "Investments",  icon: TrendingUp },
      { href: "/dashboard/copy-trading", label: "Copy Trading", icon: Users },
      { href: "/dashboard/transactions", label: "Transactions", icon: History },
    ],
  },
  {
    label: "Wallet",
    items: [
      { href: "/dashboard/deposit",  label: "Deposit",  icon: ArrowDownToLine },
      { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/dashboard/support",  label: "Support",  icon: HeadphonesIcon },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

interface DashboardSidebarProps {
  unreadCount?: number;
  /** Pass true when rendered inside the mobile Sheet drawer */
  isMobile?: boolean;
  /** Called when a nav item is clicked — used to close the mobile drawer */
  onNavClick?: () => void;
}

export function DashboardSidebar({ unreadCount = 0, isMobile = false, onNavClick }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isCollapsed = isMobile ? false : collapsed;

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-[#0B1220]/85 backdrop-blur-md border-r border-white/[0.06] transition-all duration-300 flex-shrink-0",
        !isMobile && (isCollapsed ? "hidden lg:flex w-16" : "hidden lg:flex w-60"),
        isMobile && "w-full h-full"
      )}
    >
      {/* Logo header — matches the dashboard top navbar (white → soft blue) */}
      <div
        className={cn(
          "flex items-center h-20 px-4 border-b border-slate-200 flex-shrink-0",
          isCollapsed && "justify-center px-2"
        )}
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FBF7E8 100%)",
        }}
      >
        {isCollapsed
          ? <Logo variant="icon" size="xl" href="/dashboard" />
          : <Logo size="xl" href="/dashboard" />
        }
      </div>

      {/* Nav — grouped into Trading / Wallet / Account */}
      <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div key={group.label}>
            {!isCollapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {group.label}
              </div>
            )}
            {isCollapsed && gi > 0 && (
              <div className="mx-2 mb-2 h-px bg-white/[0.06]" />
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    onClick={onNavClick}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-200 group",
                      active
                        ? "bg-[#D4AF37]/[0.14] text-white shadow-[inset_0_0_0_1px_rgba(212, 175, 55,0.22)]"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.05]",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    {active && !isCollapsed && (
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
                    {!isCollapsed && <span className="tracking-tight">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t border-white/[0.06] space-y-0.5 flex-shrink-0">
        <Link
          href="/dashboard/notifications"
          onClick={onNavClick}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors relative",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Bell className="h-[17px] w-[17px] flex-shrink-0" strokeWidth={2} />
          {!isCollapsed && <span>Notifications</span>}
          {unreadCount > 0 && (
            <span
              className={cn(
                "text-white text-xs font-bold rounded-full flex items-center justify-center",
                isCollapsed
                  ? "absolute -top-1 -right-1 w-4 h-4 text-[10px]"
                  : "ml-auto w-5 h-5"
              )}
              style={{
                background: "linear-gradient(180deg, #3B82F6 0%, #B8941F 100%)",
                boxShadow: "0 0 10px rgba(59,130,246,0.55)",
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <form action={logoutUser}>
          <button
            type="submit"
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 transition-colors",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </form>

        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!isCollapsed)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12.5px] text-slate-500 hover:text-white hover:bg-white/[0.04] transition-colors",
              isCollapsed && "justify-center px-2"
            )}
          >
            {isCollapsed
              ? <ChevronRight className="h-4 w-4" />
              : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>
            }
          </button>
        )}
      </div>
    </aside>
  );
}
