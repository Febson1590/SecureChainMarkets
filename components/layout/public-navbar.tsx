"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Globe } from "lucide-react";
import { LanguageMenuDialog } from "@/components/language-switcher";

const navLinks = [
  { href: "/markets",       label: "Markets"   },
  { href: "/#capabilities", label: "Platform"  },
  { href: "/#account-types",label: "Accounts"  },
  { href: "/about",         label: "Company"   },
  { href: "/help",          label: "Resources" },
];

export function PublicNavbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen,   setLangOpen]   = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#08111F]/85 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px]">
          {/* ── Left: logo ───────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/assets/logos/securechainmarkets-logo.png"
              alt="SecureChainMarkets"
              width={1774}
              height={887}
              priority
              className="h-10 lg:h-12 w-auto"
            />
          </Link>

          {/* ── Center: nav ────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 h-10 inline-flex items-center text-[13.5px] font-medium rounded-md transition-colors",
                    active
                      ? "text-white"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Right: auth CTAs ─────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              aria-label="Change language"
              onClick={() => setLangOpen(true)}
              className="h-10 w-10 inline-flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors"
            >
              <Globe size={16} />
            </button>
            <Link
              href="/login"
              className="h-10 px-5 inline-flex items-center text-[13.5px] font-semibold text-white/90 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="h-10 px-5 inline-flex items-center text-[13.5px] font-semibold text-[#08111F] rounded-md transition-all hover:brightness-110"
              style={{ background: "linear-gradient(180deg, #d4a857 0%, #b8902f 100%)" }}
            >
              Open Account
            </Link>
          </div>

          {/* ── Mobile hamburger ─────────────────────── */}
          <button
            className="lg:hidden h-10 w-10 inline-flex items-center justify-center text-white rounded-md transition-colors hover:bg-white/5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Global language dialog — shared by desktop globe + mobile drawer */}
      <LanguageMenuDialog open={langOpen} onOpenChange={setLangOpen} />

      {/* ── Mobile drawer ───────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#08111F] border-t border-white/[0.08]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 h-12 rounded-md text-[15px] font-medium text-slate-300 hover:text-white hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-white/[0.08] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => { setMobileOpen(false); setLangOpen(true); }}
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-md text-[15px] font-medium text-slate-300 hover:text-white border border-white/15 hover:border-white/25 transition-colors"
              >
                <Globe size={16} />
                Language
              </button>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full h-12 inline-flex items-center justify-center rounded-md text-[15px] font-semibold text-white border border-white/15"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full h-12 inline-flex items-center justify-center rounded-md text-[15px] font-semibold text-[#08111F]"
                style={{ background: "linear-gradient(180deg, #d4a857 0%, #b8902f 100%)" }}
              >
                Open Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
