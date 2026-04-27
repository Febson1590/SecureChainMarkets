import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Zap, Globe2 } from "lucide-react";

const valueProps = [
  { icon: Globe2,      title: "Major digital assets",  desc: "Bitcoin, Ethereum and the most-traded altcoins quoted against USD." },
  { icon: Zap,         title: "Built for clarity",     desc: "Bid, ask and spread shown plainly — no hidden markups." },
  { icon: ShieldCheck, title: "Account protection",    desc: "Two-factor sign-in and reviewed funding on every account." },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] bg-[#08111F] text-slate-300">
      {/* ── Left: branding panel (desktop only) ───────────────────────── */}
      <aside className="relative hidden lg:flex flex-col justify-between bg-[#08111F] text-white px-14 xl:px-16 py-12 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 25% 0%, rgba(212,168,87,0.12), transparent 60%), radial-gradient(ellipse 60% 55% at 85% 100%, rgba(26,115,232,0.18), transparent 65%), linear-gradient(180deg, #08111F 0%, #0A1530 55%, #08111F 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent 80%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-1/2 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,168,87,0.32) 50%, transparent)",
          }}
        />

        <Link href="/" className="relative z-10 inline-flex w-fit">
          <Image
            src="/assets/logos/securechainmarkets-logo.png"
            alt="SecureChainMarkets"
            width={1774}
            height={887}
            priority
            className="h-12 w-auto"
          />
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-[36px] xl:text-[44px] font-bold leading-[1.05] tracking-tight mb-6 text-white">
            Trade Smarter.
            <br />
            Invest <span className="text-[#d4a857]">Confidently.</span>
          </h2>
          <p className="text-[15px] text-slate-400 leading-relaxed max-w-sm mb-10">
            A focused brokerage for major digital assets — clear pricing,
            reviewed funding, and a clean trading experience.
          </p>

          <ul className="space-y-5">
            {valueProps.map((v) => (
              <li key={v.title} className="flex items-start gap-4">
                <span className="mt-0.5 w-9 h-9 rounded-md bg-[#d4a857]/12 border border-[#d4a857]/25 flex items-center justify-center flex-shrink-0">
                  <v.icon size={16} className="text-[#d4a857]" />
                </span>
                <div>
                  <div className="text-[14px] font-semibold text-white leading-snug">{v.title}</div>
                  <div className="text-[12.5px] text-slate-400 leading-relaxed mt-0.5">{v.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-[11px] text-slate-500">
          © {new Date().getFullYear()} SecureChainMarkets · All rights reserved
        </p>
      </aside>

      {/* ── Right: form panel (dark, premium) ─────────────────────────── */}
      <main className="relative flex flex-col bg-[#08111F]">
        {/* Mobile-only logo (centered) */}
        <div className="lg:hidden px-6 py-6 border-b border-white/[0.06] flex justify-center">
          <Link href="/" className="inline-flex">
            <Image
              src="/assets/logos/securechainmarkets-logo.png"
              alt="SecureChainMarkets"
              width={1774}
              height={887}
              priority
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Subtle right-side glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none lg:block hidden"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 100% 50%, rgba(212,168,87,0.06), transparent 70%)",
          }}
        />

        <div className="relative flex-1 flex items-center justify-center px-5 sm:px-8 py-10 sm:py-14">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>

        <div className="relative px-6 pb-8 text-center">
          <p className="text-[11px] text-slate-500">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-[#d4a857] hover:text-white underline-offset-2 hover:underline">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#d4a857] hover:text-white underline-offset-2 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
