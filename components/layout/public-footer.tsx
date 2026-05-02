import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Send, Linkedin, ShieldCheck } from "lucide-react";
import { COMPANY } from "@/lib/company";

const footerColumns = [
  {
    title: "Company",
    links: [
      { href: "/about",   label: "About Company" },
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
      { href: "/licensing", label: "License & Regulation" },
      { href: "/risk",      label: "Risk Disclosure"      },
      { href: "/aml",       label: "AML Policy"           },
      { href: "/kyc",       label: "KYC Policy"           },
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
    <footer
      className="text-[#1A1A22] border-t border-[#E6D9A6]/60"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FFFAF0 100%)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-14 lg:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr] gap-10">
          {/* Brand + description + socials */}
          <div>
            <Link
              href="/"
              aria-label="VorateTrade — home"
              className="inline-block mb-6"
            >
              <Image
                src="/assets/logos/voratetrade-logo.png"
                alt="VorateTrade"
                width={1774}
                height={887}
                className="h-[72px] w-auto max-w-none pointer-events-none select-none"
              />
            </Link>
            <p className="text-[13px] leading-relaxed text-slate-700 max-w-xs mb-6">
              VorateTrade is a regulated digital
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
                  className="w-9 h-9 rounded-full bg-white border border-[#E6D9A6] inline-flex items-center justify-center text-slate-700 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13.5px] font-semibold text-[#D4AF37] mb-4 tracking-wide">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-slate-700 hover:text-[#D4AF37] transition-colors"
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
        <div className="mt-10 sm:mt-12 pt-6 border-t border-[#E6D9A6]/60 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-[12px] text-slate-600">
            &copy; {COMPANY.launchYear} {COMPANY.brand}. All rights reserved.
          </p>
          <div className="inline-flex items-center gap-2 text-[12px] text-slate-700">
            <ShieldCheck size={14} className="text-[#D4AF37]" />
            Regulated and Authorized Platform
          </div>
        </div>
      </div>
    </footer>
  );
}
