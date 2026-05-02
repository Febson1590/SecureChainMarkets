import Link from "next/link";
import Image from "next/image";
import { AuthHeader } from "./_header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col text-[#0A1A3A]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 90% 70% at 100% 0%, rgba(151,187,255,0.55), rgba(151,187,255,0) 62%)," +
          "radial-gradient(ellipse 80% 65% at 0% 100%, rgba(151,187,255,0.32), rgba(151,187,255,0) 65%)," +
          "linear-gradient(135deg, #FFFFFF 0%, #F4F8FF 45%, #E8F0FF 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }}
    >
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
