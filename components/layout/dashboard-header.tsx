"use client";

import { useState, useEffect } from "react";
import { Bell, Menu, ChevronDown, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/logo";
import { logoutUser } from "@/lib/actions/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "./dashboard-sidebar";
import { getStatusBg } from "@/lib/utils";
import { LanguageMenuDialog } from "@/components/language-switcher";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
    status?: string;
  };
  unreadCount?: number;
}

export function DashboardHeader({ user, unreadCount = 0 }: DashboardHeaderProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [langOpen,  setLangOpen]  = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes (failsafe for any navigation)
  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="h-[60px] sm:h-[72px] lg:h-[80px] bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center px-4 sm:px-6 flex-shrink-0 sticky top-0 z-30">
      {/* Mobile menu — controlled Sheet so we can close it on nav click */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger render={<button className="lg:hidden p-2 text-slate-600 hover:text-[#0A1A3A] mr-2" />}>
          <Menu size={20} />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 p-0 border-slate-200 overflow-hidden text-[#0A1A3A]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 90% 70% at 100% 0%, rgba(151,187,255,0.55), rgba(151,187,255,0) 62%)," +
              "radial-gradient(ellipse 80% 65% at 0% 100%, rgba(151,187,255,0.32), rgba(151,187,255,0) 65%)," +
              "linear-gradient(135deg, #FFFFFF 0%, #F4F8FF 45%, #E8F0FF 100%)",
          }}
        >
          <DashboardSidebar
            unreadCount={unreadCount}
            isMobile={true}
            onNavClick={() => setSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Mobile logo — same bleeding treatment as the public navbar */}
      <Link
        href="/dashboard"
        aria-label="SecureChainMarkets — dashboard"
        className="lg:hidden relative h-[60px] sm:h-[72px] w-[80px] sm:w-[100px] flex-shrink-0"
      >
        <Image
          src="/assets/logos/securechainmarkets-logo.png"
          alt="SecureChainMarkets"
          width={1774}
          height={887}
          priority
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[72px] sm:h-[100px] w-auto max-w-none pointer-events-none select-none"
        />
      </Link>

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language — opens the global LanguageMenuDialog.
            Sits between the logo and the notification bell as the
            dedicated, always-visible translator entry point. */}
        <button
          type="button"
          aria-label="Change language"
          onClick={() => setLangOpen(true)}
          className="p-2 text-slate-500 hover:text-[#0A1A3A] hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Globe size={18} />
        </button>

        {/* Notifications */}
        <Link
          href="/dashboard/notifications"
          className="relative p-2 text-slate-500 hover:text-[#0A1A3A] hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center bg-[#2B6BFF]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors" />}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[#2B6BFF]/15 text-[#2B6BFF] text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-[#0A1A3A] leading-none mb-0.5">{user.name || "User"}</div>
              <div className="text-xs text-slate-500 leading-none">{user.role === "ADMIN" ? "Administrator" : "Trader"}</div>
            </div>
            <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 text-[#0A1A3A] shadow-[0_18px_40px_-18px_rgba(15,23,42,0.18)]">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-[#0A1A3A] truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
              {user.status && (
                <span className={`inline-flex mt-1.5 items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusBg(user.status)}`}>
                  {user.status}
                </span>
              )}
            </div>
            <DropdownMenuSeparator className="bg-slate-100" />
            {user.role === "ADMIN" && (
              <>
                <DropdownMenuItem render={<Link href="/admin" />} className="hover:bg-slate-100 cursor-pointer text-[#2B6BFF] font-semibold">
                  Admin Panel
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100" />
              </>
            )}
            <DropdownMenuItem render={<Link href="/dashboard/settings" />} className="hover:bg-slate-100 cursor-pointer text-slate-700">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/support" />} className="hover:bg-slate-100 cursor-pointer text-slate-700">
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem className="p-0 text-rose-600 hover:bg-rose-50 focus:text-rose-600 focus:bg-rose-50">
              <form action={logoutUser} className="w-full">
                <button
                  type="submit"
                  className="w-full flex items-center px-1.5 py-1 text-sm !text-rose-600 cursor-pointer"
                >
                  Sign Out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Portaled to document.body so the sticky/blurred header can't
          clip it. Single source of truth for the dashboard translator. */}
      <LanguageMenuDialog open={langOpen} onOpenChange={setLangOpen} />
    </header>
  );
}
