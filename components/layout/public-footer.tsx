import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Send, Linkedin, ShieldCheck } from "lucide-react";
import { COMPANY } from "@/lib/company";

const footerColumns = [
  {
    title: "Company",
    links: [
      { href: "/about",   label: "About Company" },
      { href: "/pricing", label: "Account Types" },
      { href: "/contact", label: "Contact Us"    },
      { href: "/terms",   label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
  {
    title: "Markets",
    links: [
      { href: "/markets",                label: "All Markets"      },
      { href: "/markets#cryptocurrencies", label: "Cryptocurrencies" },
      { href: "/markets#forex",          label: "Forex"            },
      { href: "/markets#indices",        label: "Indices"          },
      { href: "/markets#commodities",    label: "Commodities"      },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help",     label: "Help Center"  },
      { href: "/help#faq", label: "FAQs"         },
      { href: "/contact",  label: "Live Support" },
      { href: "/security", label: "Security"     },
    ],
  },
  {
    title: "Legal & Compliance",
    links: [
      { href: "/terms",   label: "License & Regulation" },
      { href: "/risk",    label: "Risk Disclosure"      },
      { href: "/privacy", label: "AML Policy"           },
      { href: "/privacy", label: "KYC Policy"           },
    ],
  },
];

const socials = [
  { href: "https://facebook.com",  label: "Facebook", Icon: Facebook },
  { href: "https://twitter.com",   label: "Twitter",  Icon: Twitter  },
  { href: "https://t.me",          label: "Telegram", Icon: Send     },
  { href: "https://linkedin.com",  label: "LinkedIn", Icon: Linkedin },
];

export function PublicFooter() {
  return (
    <footer className="bg-[#0A1A3A] text-slate-300">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-14 lg:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr] gap-10">
          {/* Brand + description + socials */}
          <div>
            <Link
              href="/"
              aria-label="SecureChainMarkets — home"
              className="relative inline-flex items-center justify-center h-24 w-[210px] rounded-2xl bg-white shadow-[0_14px_32px_-14px_rgba(0,0,0,0.55)] mb-6"
            >
              <Image
                src="/assets/logos/securechainmarkets-logo.png"
                alt="SecureChainMarkets"
                width={1774}
                height={887}
                className="h-[72px] w-auto max-w-none pointer-events-none select-none"
              />
            </Link>
            <p className="text-[13px] leading-relaxed text-slate-400 max-w-xs mb-6">
              SecureChainMarkets is a regulated digital
              asset trading platform offering secure,
              transparent, and innovative trading
              solutions worldwide.
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.12] inline-flex items-center justify-center text-slate-300 hover:bg-[#2B6BFF] hover:border-[#2B6BFF] hover:text-white transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13.5px] font-semibold text-white mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-slate-400 hover:text-[#5C8BFF] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-[12px] text-slate-500">
            &copy; {COMPANY.launchYear} {COMPANY.brand}. All rights reserved.
          </p>
          <div className="inline-flex items-center gap-2 text-[12px] text-slate-400">
            <ShieldCheck size={14} className="text-[#5C8BFF]" />
            Regulated and Authorized Platform
          </div>
        </div>
      </div>
    </footer>
  );
}
