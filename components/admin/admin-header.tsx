"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logoutUser } from "@/lib/actions/auth";
import { Logo } from "@/components/logo";
import AdminNav from "./admin-nav";

export function AdminHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on any route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="h-20 backdrop-blur-md border-b border-slate-200 flex items-center px-4 sm:px-6 flex-shrink-0 sticky top-0 z-30"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #FBF7E8 100%)",
      }}
    >
      {/* Mobile hamburger — visible on < lg */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<button className="lg:hidden p-2 text-slate-600 hover:text-[#1A1A22] mr-2 rounded-md transition-colors" />}>
          <Menu size={20} />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 border-white/[0.06] overflow-hidden bg-[#0B1220] text-slate-200">
          <AdminNav isMobile onNavClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Logo — mobile only (desktop sidebar has its own logo) */}
      <div className="lg:hidden mr-2">
        <Logo size="xl" href="/admin" />
      </div>

      {/* Title — desktop */}
      <div className="hidden lg:flex items-center gap-2.5">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25">
          <ShieldCheck size={14} className="text-[#D4AF37]" />
        </span>
        <div className="leading-tight">
          <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.22em]">Admin Panel</div>
          <div className="text-[12px] font-semibold text-[#1A1A22]">Control Center</div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-3">
        <form action={logoutUser}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-md text-[12.5px] font-semibold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-colors"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
