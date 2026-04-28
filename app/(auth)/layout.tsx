import Link from "next/link";
import Image from "next/image";
import { AuthHeader } from "./_header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFF] text-[#0A1A3A]">
      <AuthHeader />

      {/* ── Main slot — pages render their own body. flex-1 pushes footer
           to the bottom of the viewport when content is short. ────────── */}
      <main className="flex-1 w-full">{children}</main>

      {/* ── Footer (in normal document flow, never absolute/fixed) ──── */}
      <footer
        className="bg-white border-t border-slate-200 mt-auto"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link href="/" aria-label="Home" className="inline-flex items-center">
            <Image
              src="/assets/logos/securechainmarkets-logo.png"
              alt="SecureChainMarkets"
              width={1774}
              height={887}
              className="h-14 w-auto pointer-events-none select-none"
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
