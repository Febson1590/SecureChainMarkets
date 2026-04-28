"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, TrendingUp, Users, ArrowDownToLine,
  ArrowUpFromLine, History, HeadphonesIcon, Settings,
  ChevronLeft, ChevronRight, LogOut, Bell,
} from "lucide-react";
import { logoutUser } from "@/lib/actions/auth";
import { useState } from "react";

const navItems = [
  { href: "/dashboard",                 label: "Overview",      icon: LayoutDashboard, exact: true },
  { href: "/dashboard/investments",     label: "Investments",   icon: TrendingUp },
  { href: "/dashboard/copy-trading",    label: "Copy Trading",  icon: Users },
  { href: "/dashboard/transactions",    label: "Transactions",  icon: History },
  { href: "/dashboard/deposit",         label: "Deposit",       icon: ArrowDownToLine },
  { href: "/dashboard/withdraw",        label: "Withdraw",      icon: ArrowUpFromLine },
  { href: "/dashboard/support",         label: "Support",       icon: HeadphonesIcon },
  { href: "/dashboard/settings",        label: "Settings",      icon: Settings },
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

  // Mobile drawer never collapses
  const isCollapsed = isMobile ? false : collapsed;

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col backdrop-blur-md border-r border-slate-200 transition-all duration-300 flex-shrink-0",
        !isMobile && (isCollapsed ? "hidden lg:flex w-16" : "hidden lg:flex w-60"),
        isMobile && "w-full h-full"
      )}
      style={{
        backgroundImage:
          "radial-gradient(ellipse 90% 70% at 100% 0%, rgba(151,187,255,0.55), rgba(151,187,255,0) 62%)," +
          "radial-gradient(ellipse 80% 65% at 0% 100%, rgba(151,187,255,0.32), rgba(151,187,255,0) 65%)," +
          "linear-gradient(135deg, #FFFFFF 0%, #F4F8FF 45%, #E8F0FF 100%)",
      }}
    >
      {/* Logo — bleeds vertically, same treatment as the public navbar */}
      <div className={cn(
        "flex items-center h-[60px] sm:h-[72px] lg:h-[80px] px-4 border-b border-slate-200 flex-shrink-0",
        isCollapsed && "justify-center px-2"
      )}>
        {isCollapsed ? (
          <Link href="/dashboard" aria-label="SecureChainMarkets — dashboard" className="inline-flex items-center">
            <Image
              src="/assets/logos/securechainmarkets-icon.png"
              alt="SecureChainMarkets"
              width={32}
              height={32}
              priority
              className="flex-shrink-0"
            />
          </Link>
        ) : (
          <Link
            href="/dashboard"
            aria-label="SecureChainMarkets — dashboard"
            className="relative h-full w-full"
          >
            <Image
              src="/assets/logos/securechainmarkets-logo.png"
              alt="SecureChainMarkets"
              width={1774}
              height={887}
              priority
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[100px] sm:h-[120px] lg:h-[128px] w-auto max-w-none pointer-events-none select-none"
            />
          </Link>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              onClick={onNavClick}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-[#2B6BFF]/12 text-[#0A1A3A] shadow-[inset_0_0_0_1px_rgba(43,107,255,0.20)]"
                  : "text-slate-600 hover:text-[#0A1A3A] hover:bg-white/70",
                isCollapsed && "justify-center px-2"
              )}
            >
              {active && !isCollapsed && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#2B6BFF]"
                  style={{ boxShadow: "0 0 12px rgba(43,107,255,0.45)" }}
                />
              )}
              <item.icon
                className={cn(
                  "h-[17px] w-[17px] flex-shrink-0 transition-colors",
                  active ? "text-[#2B6BFF]" : "text-slate-500 group-hover:text-[#0A1A3A]"
                )}
              />
              {!isCollapsed && <span className="tracking-tight">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t border-slate-200 space-y-0.5">
        <Link
          href="/dashboard/notifications"
          onClick={onNavClick}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-[#0A1A3A] hover:bg-white/70 transition-colors relative",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Bell className="h-[17px] w-[17px] flex-shrink-0" />
          {!isCollapsed && <span>Notifications</span>}
          {unreadCount > 0 && (
            <span
              className={cn(
                "text-white text-xs font-bold rounded-full flex items-center justify-center bg-[#2B6BFF]",
                isCollapsed
                  ? "absolute -top-1 -right-1 w-4 h-4 text-[10px]"
                  : "ml-auto w-5 h-5"
              )}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <form action={logoutUser}>
          <button
            type="submit"
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </form>

        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!isCollapsed)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-[#0A1A3A] hover:bg-white/70 transition-colors",
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
