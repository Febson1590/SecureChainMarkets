"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Globe } from "lucide-react";
import { LanguageMenuDialog } from "@/components/language-switcher";

const navLinks = [
  { href: "/",                label: "Home"          },
  { href: "/markets",         label: "Markets"       },
  { href: "/#how-it-works",   label: "How It Works"  },
  { href: "/about",           label: "About Company" },
  { href: "/contact",         label: "Contact Us"    },
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
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_0_rgba(20, 20, 26,0.04),0_8px_24px_-12px_rgba(20, 20, 26,0.10)]"
          : "bg-white/85 backdrop-blur-sm border-b border-slate-200/60"
      )}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px] sm:h-[72px] lg:h-[80px]">
          {/* ── Left: logo (bleeds vertically; row height stays at 80px) ─ */}
          <Link
            href="/"
            aria-label="VorateTrade — home"
            className="relative flex-shrink-0 h-[60px] sm:h-[72px] lg:h-[80px] w-[80px] sm:w-[100px] lg:w-[120px]"
          >
            <Image
              src="/assets/logos/voratetrade-logo.png"
              alt="VorateTrade"
              width={1774}
              height={887}
              priority
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[72px] sm:h-[100px] lg:h-[128px] w-auto max-w-none pointer-events-none select-none"
            />
          </Link>

          {/* ── Right cluster: nav + language + auth CTAs ──────────────
                Grouped on the right so the nav links sit next to the
                language selector and the wide logo on the left has room. */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <nav className="flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(link.href.split("#")[0] + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3 xl:px-4 h-10 inline-flex items-center text-[13.5px] xl:text-[14px] font-medium transition-colors",
                      active
                        ? "text-[#D4AF37]"
                        : "text-slate-700 hover:text-[#1A1A22]"
                    )}
                  >
                    {link.label}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-[#D4AF37]"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="w-px h-6 bg-slate-200" aria-hidden />

            <button
              type="button"
              aria-label="Change language"
              onClick={() => setLangOpen(true)}
              className="h-10 w-10 inline-flex items-center justify-center text-slate-600 hover:text-[#1A1A22] hover:bg-slate-100 rounded-md transition-colors"
            >
              <Globe size={16} />
            </button>
            <Link
              href="/login"
              className="h-10 px-5 inline-flex items-center text-[14px] font-semibold text-[#1A1A22] border border-[#1A1A22]/15 rounded-md hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="h-10 px-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-white rounded-md transition-all hover:brightness-110"
              style={{
                background: "#D4AF37",
                boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 6px 14px rgba(212, 175, 55,0.30)",
              }}
            >
              Get Started
            </Link>
          </div>

          {/* ── Mobile hamburger ─────────────────────── */}
          <button
            className="lg:hidden h-10 w-10 inline-flex items-center justify-center text-[#1A1A22] rounded-md transition-colors hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <LanguageMenuDialog open={langOpen} onOpenChange={setLangOpen} />

      {/* ── Mobile drawer ───────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-slate-200"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 90% 70% at 100% 0%, rgba(212, 175, 55, 0.30), rgba(212, 175, 55, 0.00) 62%)," +
              "radial-gradient(ellipse 80% 65% at 0% 100%, rgba(212, 175, 55, 0.18), rgba(212, 175, 55, 0.00) 65%)," +
              "linear-gradient(135deg, #FFFFFF 0%, #FBF7E8 45%, #F7F0D6 100%)",
          }}
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 h-12 rounded-md text-[15px] font-medium text-slate-700 hover:text-[#1A1A22] hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-slate-200 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => { setMobileOpen(false); setLangOpen(true); }}
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-md text-[15px] font-medium text-slate-700 hover:text-[#1A1A22] border border-slate-300 hover:border-slate-400 transition-colors"
              >
                <Globe size={16} />
                Language
              </button>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full h-12 inline-flex items-center justify-center rounded-md text-[15px] font-semibold text-[#1A1A22] border border-slate-300 hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full h-12 inline-flex items-center justify-center rounded-md text-[15px] font-semibold text-white"
                style={{
                  background: "#D4AF37",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(212, 175, 55,0.32)",
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
