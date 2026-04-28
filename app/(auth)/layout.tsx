import Link from "next/link";
import Image from "next/image";
import { AuthHeader } from "./_header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFF] text-[#0A1A3A]">
      <AuthHeader />

      {/* ── Main slot — pages render their own body ──────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex flex-col sm:flex-row items-center justify-between gap-3 py-4 sm:py-0">
          <Link href="/" aria-label="Home" className="inline-flex items-center">
            <Image
              src="/assets/logos/securechainmarkets-logo.png"
              alt="SecureChainMarkets"
              width={1774}
              height={887}
              className="h-7 w-auto pointer-events-none select-none"
            />
          </Link>
          <p className="text-[12.5px] text-slate-500">
            &copy; {new Date().getFullYear()} Secure Chain Markets. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[12.5px]">
            <Link href="/privacy" className="text-slate-600 hover:text-[#2B6BFF] transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="text-slate-600 hover:text-[#2B6BFF] transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
