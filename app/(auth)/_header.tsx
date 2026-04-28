"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function AuthHeader() {
  const pathname = usePathname() ?? "";
  const isRegister = pathname.startsWith("/register");

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 h-[80px] flex items-center justify-between">
        <Link
          href="/"
          aria-label="SecureChainMarkets — home"
          className="inline-flex items-center"
        >
          <Image
            src="/assets/logos/securechainmarkets-logo.png"
            alt="SecureChainMarkets"
            width={1774}
            height={887}
            priority
            className="h-9 sm:h-10 w-auto pointer-events-none select-none"
          />
        </Link>

        <div className="flex items-center gap-2 text-[13.5px]">
          {isRegister ? (
            <>
              <span className="hidden sm:inline text-slate-600">Already have an account?</span>
              <Link
                href="/login"
                className="font-semibold text-[#2B6BFF] hover:text-[#1A4FCC] transition-colors"
              >
                Log In
              </Link>
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-slate-600">Don&apos;t have an account?</span>
              <Link
                href="/register"
                className="font-semibold text-[#2B6BFF] hover:text-[#1A4FCC] transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
