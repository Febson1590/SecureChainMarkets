import Link from "next/link";
import Image from "next/image";
import { COMPANY } from "@/lib/company";

const footerColumns = [
  {
    title: "Markets",
    links: [
      { href: "/markets",         label: "All markets"    },
      { href: "/markets#bitcoin", label: "Bitcoin"        },
      { href: "/markets#ethereum",label: "Ethereum"       },
      { href: "/markets#altcoins",label: "Top altcoins"   },
      { href: "/markets#stablecoins", label: "Stablecoins" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/#capabilities", label: "Capabilities" },
      { href: "/pricing",       label: "Pricing"      },
      { href: "/security",      label: "Security"     },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about",   label: "About"   },
      { href: "/contact", label: "Contact" },
      { href: "/help",    label: "Help Center" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms",   label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy"   },
      { href: "/risk",    label: "Trading Considerations" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="bg-[#08111F] border-t border-white/[0.06] text-slate-400">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-10">
          {/* Brand + description */}
          <div>
            <Image
              src="/assets/logos/securechainmarkets-logo.png"
              alt="SecureChainMarkets"
              width={1774}
              height={887}
              className="h-11 w-auto mb-5"
            />
            <p className="text-[13px] leading-relaxed text-slate-500 max-w-xs">
              SecureChainMarkets is a digital-asset trading platform built around
              transparent pricing, account verification, and tools that help
              modern investors trade and monitor their portfolio with clarity.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-slate-400 hover:text-[#d4a857] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Risk + copyright */}
        <div className="mt-14 pt-6 border-t border-white/[0.06] flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-4xl">
            <span className="font-semibold text-slate-400">Note:</span>{" "}
            Markets can move quickly. Take a moment to review our{" "}
            <Link href="/risk" className="text-slate-400 hover:text-[#d4a857] underline underline-offset-2">risk overview</Link>{" "}
            before opening an account so you can trade with confidence.
          </p>
          <p className="text-[11px] text-slate-500 whitespace-nowrap">
            &copy; {COMPANY.launchYear} {COMPANY.brand}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
