"use client";

import { useState, useEffect } from "react";
import { Bell, Menu, ChevronDown, Globe } from "lucide-react";
import Link from "next/link";
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
    <header
      className="h-16 backdrop-blur-md border-b border-slate-200 flex items-center px-4 sm:px-6 flex-shrink-0 sticky top-0 z-30"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #F7FAFF 100%)",
      }}
    >
      {/* Mobile menu — controlled Sheet so we can close it on nav click */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger render={<button className="lg:hidden p-2 text-slate-600 hover:text-[#0A1A3A] mr-2" />}>
          <Menu size={20} />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 p-0 border-white/[0.06] overflow-hidden text-slate-200 bg-[#0B1220]"
        >
          <DashboardSidebar
            unreadCount={unreadCount}
            isMobile={true}
            onNavClick={() => setSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="lg:hidden">
        <Logo size="sm" href="/dashboard" />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language — opens the global LanguageMenuDialog.
            Sits between the logo and the notification bell as the
            dedicated, always-visible translator entry point. */}
        <button
          type="button"
          aria-label="Change language"
          onClick={() => setLangOpen(true)}
          className="p-2 text-slate-600 hover:text-[#0A1A3A] hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Globe size={18} />
        </button>

        {/* Notifications */}
        <Link
          href="/dashboard/notifications"
          className="relative p-2 text-slate-600 hover:text-[#0A1A3A] hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ background: "linear-gradient(180deg, #2B6BFF 0%, #1A4FCC 100%)" }}>
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
          <DropdownMenuContent align="end" className="w-60 bg-white border-slate-200 text-[#0A1A3A] shadow-[0_18px_40px_-18px_rgba(15,23,42,0.18)] rounded-xl p-1.5">
            <div className="px-3 py-2.5">
              <p className="text-[13.5px] font-semibold text-[#0A1A3A] truncate leading-tight">{user.name}</p>
              <p className="text-[11.5px] text-slate-500 truncate mt-0.5">{user.email}</p>
              {user.status && (
                <span className={`inline-flex mt-2 items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBg(user.status)}`}>
                  {user.status}
                </span>
              )}
            </div>
            <DropdownMenuSeparator className="bg-slate-100 my-1" />
            {user.role === "ADMIN" && (
              <>
                <DropdownMenuItem render={<Link href="/admin" />} className="hover:bg-slate-50 cursor-pointer text-[#2B6BFF] font-semibold rounded-lg px-3 py-2 text-[13px]">
                  Admin Panel
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 my-1" />
              </>
            )}
            <DropdownMenuItem render={<Link href="/dashboard/settings" />} className="hover:bg-slate-50 cursor-pointer text-slate-700 rounded-lg px-3 py-2 text-[13px]">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/support" />} className="hover:bg-slate-50 cursor-pointer text-slate-700 rounded-lg px-3 py-2 text-[13px]">
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100 my-1" />
            <DropdownMenuItem className="p-0 text-rose-600 hover:bg-rose-50 focus:text-rose-600 focus:bg-rose-50 rounded-lg">
              <form action={logoutUser} className="w-full">
                <button
                  type="submit"
                  className="w-full flex items-center px-3 py-2 text-[13px] font-semibold !text-rose-600 cursor-pointer"
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
