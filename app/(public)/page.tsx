import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import {
  ArrowRight, ArrowUpRight, ArrowDownRight,
  ShieldCheck, BarChart3, Users, Lock, Eye, Award,
  LineChart, ChevronRight, LayoutGrid,
  Sparkles, Bitcoin, Landmark, Coins,
  Activity, KeyRound, FileCheck2, CheckCircle2,
  CandlestickChart, PieChart, BadgeCheck, Fingerprint,
  Wallet, TrendingUp, UserPlus,
} from "lucide-react";

type Tone = "blue" | "indigo" | "green" | "red" | "amber" | "violet" | "teal";

const TONE_STYLES: Record<Tone, { bg: string; fg: string; ring: string }> = {
  blue:   { bg: "bg-[#2B6BFF]/10",   fg: "text-[#2B6BFF]",   ring: "ring-[#2B6BFF]/20" },
  indigo: { bg: "bg-indigo-500/10",  fg: "text-indigo-600",  ring: "ring-indigo-500/20" },
  green:  { bg: "bg-emerald-500/12", fg: "text-emerald-600", ring: "ring-emerald-500/20" },
  red:    { bg: "bg-rose-500/12",    fg: "text-rose-600",    ring: "ring-rose-500/20" },
  amber:  { bg: "bg-amber-500/12",   fg: "text-amber-600",   ring: "ring-amber-500/20" },
  violet: { bg: "bg-violet-500/10",  fg: "text-violet-600",  ring: "ring-violet-500/20" },
  teal:   { bg: "bg-teal-500/12",    fg: "text-teal-600",    ring: "ring-teal-500/20" },
};
import { getMarketAssets } from "@/lib/coingecko";
import { formatCurrency, formatPercent, formatCompact } from "@/lib/utils";
import { CryptoIcon } from "@/components/public/crypto-icon";
import { PLATFORM } from "@/lib/company";

/* ─── Credibility bar ───────────────────────────────────────────────── */
const credibility: { icon: typeof ShieldCheck; title: string; desc: string; tone: Tone }[] = [
  { icon: Fingerprint,       title: "Account Protection",   tone: "blue",   desc: "Two-factor sign-in, password hashing and session monitoring on every account." },
  { icon: CandlestickChart,  title: "Transparent Trading",  tone: "green",  desc: "Bid, ask and order details shown clearly before every confirmation." },
  { icon: PieChart,          title: "Portfolio Monitoring", tone: "violet", desc: "Real-time holdings, P&L and full transaction history in one workspace." },
  { icon: BadgeCheck,        title: "Secure Verification",  tone: "amber",  desc: "Manual KYC review and identity checks before live funding is enabled." },
];

/* ─── Feature cards ─────────────────────────────────────────────────── */
const features: { icon: typeof Bitcoin; title: string; desc: string; tone: Tone }[] = [
  { icon: Bitcoin,          title: "Crypto Trading",         tone: "amber",  desc: "Buy and sell supported digital assets with market or limit orders and clear, itemised confirmations." },
  { icon: TrendingUp,       title: "Investment Plans",       tone: "green",  desc: "Structured plans with stated terms — review the plan details and risk information before participating." },
  { icon: Users,            title: "Copy Trading",           tone: "blue",   desc: "Mirror selected traders' activity in your own account. Transparent performance history; pause or exit any time." },
  { icon: Wallet,           title: "Wallet Management",      tone: "violet", desc: "Manage deposit and withdrawal addresses with reviewable activity and per-asset balances." },
  { icon: BadgeCheck,       title: "Account Verification",   tone: "teal",   desc: "Identity verification is required before funding. Submissions go through a manual review process before approval." },
  { icon: Activity,         title: "Transaction Monitoring", tone: "indigo", desc: "Every deposit, trade, and withdrawal is logged with timestamps and visible in your activity history." },
];

/* ─── Trust & Operations ────────────────────────────────────────────── */
const trust: { icon: typeof Lock; title: string; desc: string; tone: Tone }[] = [
  { icon: KeyRound,   title: "Encrypted Transport", tone: "blue",   desc: "All traffic to the platform is sent over TLS. Passwords are hashed with bcrypt and are never stored in plain text." },
  { icon: Activity,   title: "Full Activity Log",   tone: "indigo", desc: "Every deposit, trade, and withdrawal you make is visible in your account history with timestamps." },
  { icon: FileCheck2, title: "Reviewed Onboarding", tone: "teal",   desc: "Every funded account is manually reviewed against the identity documents you submit during KYC." },
  { icon: Coins,      title: "Transparent Fees",    tone: "amber",  desc: "Trading fees are published up-front and the final cost is shown on the order confirmation before you submit." },
];

/* ─── Markets we cover ──────────────────────────────────────────────── */
const coveredMarkets: { kind: "crypto" | "stack"; symbol?: string; symbols?: string[]; title: string; desc: string }[] = [
  { kind: "crypto", symbol: "BTC",                       title: "Bitcoin",      desc: "Buy, sell and hold BTC directly — the most-traded asset on the platform, priced in USD." },
  { kind: "crypto", symbol: "ETH",                       title: "Ethereum",     desc: "ETH spot trading with market or limit orders, quoted against USD and available on every plan." },
  { kind: "stack",  symbols: ["SOL", "BNB", "XRP"],      title: "Top Altcoins", desc: "SOL, BNB, XRP, ADA, AVAX, LINK, DOT, LTC and other majors — 15 listed assets under one USD quote layer." },
  { kind: "crypto", symbol: "USDT",                      title: "Stablecoins",  desc: "USDT for parking balance between trades or funding an investment plan without market exposure." },
];

/* ─── Onboarding steps ──────────────────────────────────────────────── */
const steps: { n: string; title: string; desc: string; icon: typeof UserPlus; tone: Tone }[] = [
  { n: "01", title: "Create your account",                    icon: UserPlus,   tone: "blue",  desc: "Register with your email and confirm ownership with a one-time code. No credit card required." },
  { n: "02", title: "Complete verification",                  icon: BadgeCheck, tone: "amber", desc: "Upload a government-issued ID and a short selfie. Submissions go through a manual review process before approval." },
  { n: "03", title: "Fund, trade and monitor your portfolio", icon: TrendingUp, tone: "green", desc: "Deposit through supported methods, place market or limit orders, and watch holdings in real time." },
];

/* ─── Security checklist ────────────────────────────────────────────── */
const securityList = [
  { icon: KeyRound,    text: "Encrypted access — TLS on every connection and bcrypt-hashed passwords" },
  { icon: ShieldCheck, text: "Identity verification reviewed manually before live funding is enabled" },
  { icon: Eye,         text: "Account activity log accessible from your dashboard at any time" },
  { icon: FileCheck2,  text: "Withdrawal review on every outbound transfer" },
  { icon: Activity,    text: "Email and in-app activity notifications for sign-ins and balance changes" },
];

/* ─── Section eyebrow label ─────────────────────────────────────────── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#2B6BFF] mb-3">
      {children}
    </div>
  );
}

export default async function HomePage() {
  const marketAssets = await getMarketAssets();
  const tickerSyms = ["BTC", "ETH", "BNB", "SOL", "XRP"];
  const tickerData = tickerSyms
    .map((s) => marketAssets.find((a) => a.symbol === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const btc = marketAssets.find((a) => a.symbol === "BTC");

  /* Derived stats for the hero. */
  const totalVolume = marketAssets.reduce((acc, a) => acc + a.volume24h, 0);
  const totalMcap   = marketAssets.reduce((acc, a) => acc + a.marketCap, 0);
  const avgChange   = marketAssets.reduce((acc, a) => acc + a.change, 0) / (marketAssets.length || 1);

  const heroStats: {
    label: string;
    value: string;
    accent?: "up" | "down";
    Icon: typeof BarChart3;
    tone: "blue" | "indigo" | "green" | "red" | "amber";
  }[] = [
    {
      label: "24h Volume",
      value: `$${formatCompact(totalVolume)}`,
      Icon: BarChart3,
      tone: "blue",
    },
    {
      label: "Market Cap",
      value: `$${formatCompact(totalMcap)}`,
      Icon: Coins,
      tone: "indigo",
    },
    {
      label: "Avg 24h Δ",
      value: formatPercent(avgChange),
      accent: avgChange >= 0 ? "up" : "down",
      Icon: avgChange >= 0 ? ArrowUpRight : ArrowDownRight,
      tone: avgChange >= 0 ? "green" : "red",
    },
    {
      label: "Listed",
      value: `${marketAssets.length}`,
      Icon: LayoutGrid,
      tone: "amber",
    },
  ];

  return (
    <div
      className="text-[#0A1A3A] overflow-x-hidden"
      style={{
        /* Soft gradient backdrop matching the hero photo background:
           pale-blue arc top-right, gentle pale-blue wash bottom-left,
           white base with a subtle diagonal blue tint. */
        backgroundImage:
          "radial-gradient(ellipse 90% 70% at 100% 0%, rgba(151,187,255,0.55), rgba(151,187,255,0) 62%)," +
          "radial-gradient(ellipse 80% 65% at 0% 100%, rgba(151,187,255,0.32), rgba(151,187,255,0) 65%)," +
          "linear-gradient(135deg, #FFFFFF 0%, #F4F8FF 45%, #E8F0FF 100%)",
        backgroundAttachment: "scroll",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      {/* ════════════════════════════════════════════════════════════════
          1 · HERO
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-20 sm:pt-28 lg:pt-36 pb-12 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8">
        {/* Soft layered glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 75% 30%, rgba(43,107,255,0.10) 0%, rgba(43,107,255,0) 70%)," +
              "radial-gradient(50% 40% at 15% 80%, rgba(43,107,255,0.05) 0%, rgba(43,107,255,0) 70%)",
          }}
        />
        {/* Subtle dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none -z-10 opacity-[0.45]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(10,26,58,0.05) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(60% 60% at 50% 40%, black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(60% 60% at 50% 40%, black, transparent 80%)",
          }}
        />

        {/* DESKTOP background hero image — absolute, behind the text. Sits to
            the right of the section, fills vertically, device anchored right. */}
        <div
          aria-hidden
          className="hidden lg:block absolute top-0 bottom-0 left-[12%] xl:left-[8%] right-[2%] xl:right-[3%] pointer-events-none z-0"
        >
          <Image
            src="/landing/hero.png"
            alt=""
            width={1536}
            height={1024}
            priority
            sizes="80vw"
            className="absolute inset-0 w-full h-full object-contain object-right"
            style={{
              opacity: 0.98,
              filter: "brightness(1.02) contrast(1.02)",
            }}
          />
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Cell A: Copy block — sits above the bg image on lg+ */}
          <div className="min-w-0 lg:max-w-[56%]">
            <Eyebrow>Digital-Asset Brokerage</Eyebrow>

            <Link
              href="/markets"
              className="group inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full text-[11px] font-semibold tabular-nums text-[#0A1A3A] border border-slate-200 bg-white hover:border-[#2B6BFF]/40 transition-colors shadow-[0_4px_12px_-6px_rgba(15,23,42,0.10)]"
            >
              <span className="inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full bg-[#2B6BFF] text-white text-[9px] font-black tracking-wider">
                <Sparkles className="h-2.5 w-2.5" /> NEW
              </span>
              Copy Top Traders in One Click
              <ArrowRight className="h-3 w-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <h1 className="text-[32px] sm:text-[44px] lg:text-[60px] leading-[1.05] font-bold tracking-tight">
              Trade Digital Assets
              <br />
              <span className="text-[#2B6BFF]">with Confidence.</span>
            </h1>
            <p className="mt-4 sm:mt-5 text-[14.5px] sm:text-[16px] lg:text-[17px] leading-[1.6] text-slate-600 max-w-[510px]">
              Access crypto markets, investment tools, and copy-trading features
              from one secure platform built for modern investors.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-md text-[14px] font-semibold text-white transition-all hover:brightness-110 hover:-translate-y-[1px]"
                style={{
                  background: "#2B6BFF",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 10px 28px rgba(43,107,255,0.32)",
                }}
              >
                Create Account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-md text-[14px] font-semibold text-[#0A1A3A] bg-white border border-[#0A1A3A]/15 hover:border-[#2B6BFF] hover:text-[#2B6BFF] transition-colors"
              >
                Sign In <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] sm:text-[12px] text-slate-500">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> Secure Account Access</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> KYC Verification</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> Real-Time Portfolio Tracking</span>
            </div>
          </div>

          {/* MOBILE/TABLET hero visual — in normal flow under the copy. */}
          <div className="lg:hidden relative mt-8 sm:mt-12 -mx-4 sm:mx-0">
            <Image
              src="/landing/hero.png"
              alt="SecureChainMarkets dashboard shown on a laptop and phone"
              width={1536}
              height={1024}
              priority
              sizes="(max-width: 640px) 100vw, 90vw"
              className="block w-full h-auto object-contain max-w-[450px] sm:max-w-[640px] mx-auto"
              style={{
                opacity: 0.98,
                filter: "brightness(1.02) contrast(1.02)",
              }}
            />
          </div>

          {/* Stat chips — under copy on desktop, after hero visual on mobile */}
          <div className="mt-7 sm:mt-10 lg:mt-9 lg:max-w-[56%]">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 max-w-[480px]">
              {heroStats.map((s) => {
                const tone = TONE_STYLES[s.tone];
                return (
                  <div
                    key={s.label}
                    className="group rounded-xl bg-white border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 shadow-[0_4px_14px_-8px_rgba(15,23,42,0.10)] flex items-center gap-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgba(15,23,42,0.18)]"
                  >
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${tone.bg} ring-1 ${tone.ring} inline-flex items-center justify-center flex-shrink-0`}
                    >
                      <s.Icon className={`h-[15px] w-[15px] sm:h-4 sm:w-4 ${tone.fg}`} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9.5px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-semibold truncate">
                        {s.label}
                      </div>
                      <div className={`mt-0.5 text-[14px] sm:text-[16px] font-bold tabular-nums truncate ${tone.fg}`}>
                        {s.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          TICKER CARD
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-8 pb-10 sm:pb-12 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          {/* ── Mobile: horizontal-scroll chip cards + View All centered ── */}
          <div className="sm:hidden">
            <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
              <div className="flex gap-3 pb-1 min-w-max">
                {tickerData.map((a) => {
                  const up = a.change >= 0;
                  return (
                    <div
                      key={a.symbol}
                      className="flex-shrink-0 w-[150px] rounded-xl bg-white border border-slate-200 shadow-[0_8px_22px_-14px_rgba(15,23,42,0.18)] p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CryptoIcon symbol={a.symbol} size={22} className="flex-shrink-0" />
                        <span className="font-bold text-[#0A1A3A] text-[12px] truncate">{a.symbol}/USDT</span>
                      </div>
                      <div className="text-[14px] font-bold text-[#0A1A3A] tabular-nums truncate">
                        {formatCurrency(a.price)}
                      </div>
                      <div className={`mt-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10.5px] font-semibold tabular-nums ${up ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"}`}>
                        {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {Math.abs(a.change).toFixed(2)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Link
                href="/markets"
                className="inline-flex items-center gap-1.5 px-5 h-10 rounded-md text-[12.5px] font-semibold text-[#2B6BFF] border border-[#2B6BFF]/30 hover:bg-[#2B6BFF] hover:text-white hover:border-[#2B6BFF] transition-colors"
              >
                View All Markets
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* ── Tablet+: single rounded card with row + side button ── */}
          <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-[0_24px_60px_-26px_rgba(15,23,42,0.20)] overflow-hidden">
            <div className="flex items-stretch">
              <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
                <div className="flex items-stretch divide-x divide-slate-100 min-w-max">
                  {tickerData.map((a) => {
                    const up = a.change >= 0;
                    return (
                      <div
                        key={a.symbol}
                        className="flex items-center gap-3 px-5 py-4 text-[12.5px] tabular-nums whitespace-nowrap hover:bg-[#F7FAFF] transition-colors"
                      >
                        <CryptoIcon symbol={a.symbol} size={26} className="flex-shrink-0" />
                        <div className="flex flex-col leading-tight">
                          <span className="font-bold text-[#0A1A3A] text-[12.5px]">{a.symbol}/USDT</span>
                          <span className="text-slate-500 text-[10.5px]">{a.symbol === "BTC" ? "Bitcoin" : a.symbol === "ETH" ? "Ethereum" : a.symbol === "BNB" ? "BNB" : a.symbol === "SOL" ? "Solana" : "XRP"}</span>
                        </div>
                        <span className="text-[#0A1A3A] font-semibold text-[13px]">{formatCurrency(a.price)}</span>
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11.5px] font-semibold ${up ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"}`}>
                          {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                          {Math.abs(a.change).toFixed(2)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center px-4 border-l border-slate-100 flex-shrink-0">
                <Link
                  href="/markets"
                  className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md text-[12.5px] font-semibold text-[#2B6BFF] border border-[#2B6BFF]/30 hover:bg-[#2B6BFF] hover:text-white hover:border-[#2B6BFF] transition-colors"
                >
                  View All Markets
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CREDIBILITY BAR (4 cards)
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {credibility.map((c) => {
              const t = TONE_STYLES[c.tone];
              return (
                <div
                  key={c.title}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 transition-all duration-300 hover:border-[#2B6BFF] hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_rgba(43,107,255,0.30)]"
                >
                  <div className={`w-11 h-11 rounded-lg ${t.bg} ring-1 ${t.ring} inline-flex items-center justify-center flex-shrink-0`}>
                    <c.icon className={`h-[18px] w-[18px] ${t.fg}`} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold text-[#0A1A3A] mb-1">{c.title}</h3>
                    <p className="text-[12.5px] text-slate-600 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FEATURE GRID — Platform
      ════════════════════════════════════════════════════════════════ */}
      <section id="capabilities" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 scroll-mt-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-2xl mb-12">
            <Eyebrow>Platform</Eyebrow>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0A1A3A] tracking-tight leading-[1.1]">
              Everything you need to{" "}
              <span className="text-[#2B6BFF]">trade with precision.</span>
            </h2>
            <p className="text-[14px] text-slate-600 mt-4 leading-relaxed">
              A focused set of tools and account controls — designed around how
              traders actually work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => {
              const t = TONE_STYLES[f.tone];
              return (
                <div
                  key={f.title}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300 hover:border-[#2B6BFF] hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_rgba(43,107,255,0.30)]"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-lg ${t.bg} ring-1 ${t.ring} inline-flex items-center justify-center flex-shrink-0`}>
                      <f.icon className={`h-[18px] w-[18px] ${t.fg}`} strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold text-[#0A1A3A] mb-1.5">{f.title}</h3>
                      <p className="text-[13px] text-slate-600 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          HOW IT WORKS — Onboarding
      ════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 scroll-mt-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
            <div>
              <Eyebrow>Onboarding</Eyebrow>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0A1A3A] tracking-tight leading-[1.1]">
                How account opening works.
              </h2>
            </div>
            <p className="text-[14px] text-slate-600 max-w-md leading-relaxed">
              A monitored, multi-step process. Identity verification goes through
              a manual review and typically takes one business day.
            </p>
          </div>

          <div className="relative">
            {/* Desktop dashed connector */}
            <div
              aria-hidden
              className="hidden lg:block absolute top-[26px] left-[14%] right-[14%] h-[1.5px] border-t-[1.5px] border-dashed border-[#2B6BFF]/30"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
              {steps.map((s) => {
                const t = TONE_STYLES[s.tone];
                return (
                  <Fragment key={s.n}>
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`relative w-12 h-12 rounded-lg ${t.bg} ring-1 ${t.ring} inline-flex items-center justify-center flex-shrink-0`}>
                          <s.icon className={`h-[18px] w-[18px] ${t.fg}`} strokeWidth={2.2} />
                          <span className={`absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold tabular-nums ${t.fg} inline-flex items-center justify-center`}>
                            {s.n}
                          </span>
                        </div>
                        <h3 className="text-[15px] font-semibold text-[#0A1A3A] leading-tight">{s.title}</h3>
                      </div>
                      <p className="text-[13px] text-slate-600 leading-relaxed">{s.desc}</p>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          TRUST & SECURITY
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 items-start">
            <div>
              <Eyebrow>Security</Eyebrow>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0A1A3A] tracking-tight leading-[1.1] mb-5">
                Built around{" "}
                <span className="text-[#2B6BFF]">your account&rsquo;s safety.</span>
              </h2>
              <p className="text-[14px] text-slate-600 leading-relaxed mb-6 max-w-lg">
                Every sign-in, deposit, trade, and withdrawal is recorded with timestamps in
                your account history. Identity documents and outbound transfers go through a
                manual review process, and you&rsquo;re notified of any meaningful activity on
                your account.
              </p>

              <ul className="space-y-2.5 max-w-md">
                {securityList.map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-[13px] text-[#0A1A3A]">
                    <div className="w-8 h-8 rounded-lg bg-[#2B6BFF]/10 border border-[#2B6BFF]/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-[#2B6BFF]" strokeWidth={2} />
                    </div>
                    <span className="leading-snug">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trust.map((t) => {
                const ts = TONE_STYLES[t.tone];
                return (
                  <div key={t.title} className="bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300 hover:border-[#2B6BFF] hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_rgba(43,107,255,0.30)]">
                    <div className={`w-10 h-10 rounded-lg ${ts.bg} ring-1 ${ts.ring} flex items-center justify-center mb-3`}>
                      <t.icon className={`h-4 w-4 ${ts.fg}`} strokeWidth={2} />
                    </div>
                    <h4 className="text-[14px] font-semibold text-[#0A1A3A] mb-1.5">{t.title}</h4>
                    <p className="text-[12.5px] text-slate-600 leading-relaxed">{t.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          MARKETS WE COVER
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
            <div>
              <Eyebrow>Coverage</Eyebrow>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0A1A3A] tracking-tight leading-[1.1]">
                Markets we cover.
              </h2>
            </div>
            <p className="text-[14px] text-slate-600 max-w-md leading-relaxed">
              Every asset you see on the landing is in the dashboard today —
              {" "}{PLATFORM.listedAssets} digital assets quoted against {PLATFORM.quoteCurrency},
              with the same fees, the same execution, and the same one-click buy/sell.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coveredMarkets.map((m) => (
              <div
                key={m.title}
                className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300 hover:border-[#2B6BFF] hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_rgba(43,107,255,0.30)]"
              >
                {/* Sparkline */}
                <svg viewBox="0 0 120 36" className="absolute right-3 top-3 w-[70px] h-[22px] opacity-70">
                  <defs>
                    <linearGradient id={`mk-${m.title}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor="#2B6BFF" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#2B6BFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M2,28 L16,22 L30,26 L44,18 L58,20 L72,12 L86,16 L100,8 L118,10"
                    stroke="#2B6BFF" strokeWidth="1.4" fill="none" strokeLinecap="round"
                  />
                  <path
                    d="M2,28 L16,22 L30,26 L44,18 L58,20 L72,12 L86,16 L100,8 L118,10 L118,36 L2,36 Z"
                    fill={`url(#mk-${m.title})`}
                  />
                </svg>
                {/* Real crypto brand mark, or a stack of marks for "Top Altcoins" */}
                <div className="mb-4 inline-flex items-center">
                  {m.kind === "crypto" && m.symbol ? (
                    <CryptoIcon symbol={m.symbol} size={44} />
                  ) : m.kind === "stack" && m.symbols ? (
                    <div className="flex items-center -space-x-2">
                      {m.symbols.map((sym) => (
                        <div
                          key={sym}
                          className="w-9 h-9 rounded-full ring-2 ring-white inline-flex items-center justify-center bg-white"
                        >
                          <CryptoIcon symbol={sym} size={36} />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <h3 className="text-[15px] font-semibold text-[#0A1A3A] mb-1.5">{m.title}</h3>
                <p className="text-[12.5px] text-slate-600 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════
          CTA — Open an Account
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="relative rounded-3xl px-7 sm:px-12 py-14 sm:py-20 overflow-hidden text-center border border-[#DCE6FA]"
            style={{
              background: "linear-gradient(135deg, #EAF2FF 0%, #F4F8FF 50%, #FFFFFF 100%)",
              boxShadow: "0 30px 80px -36px rgba(43,107,255,0.30)",
            }}
          >
            {/* Subtle grid background */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(43,107,255,0.06) 1px, transparent 1px)," +
                  "linear-gradient(90deg, rgba(43,107,255,0.06) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                maskImage:
                  "radial-gradient(70% 70% at 50% 50%, black, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(70% 70% at 50% 50%, black, transparent 100%)",
              }}
            />
            {/* Soft halo */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(43,107,255,0.12), transparent 60%)" }}
            />

            <div className="relative max-w-[680px] mx-auto">
              <div className="inline-flex"><Eyebrow>Open an Account</Eyebrow></div>
              <h2 className="text-[30px] sm:text-[42px] lg:text-[48px] font-bold text-[#0A1A3A] tracking-tight leading-[1.05]">
                Ready when you are.
              </h2>
              <p className="mt-5 text-[14.5px] sm:text-[16px] text-slate-600 leading-[1.65]">
                Create an account with your email to review the full dashboard. Identity verification
                is required before funding an account or placing an order.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 h-[52px] px-8 rounded-md text-[14px] font-semibold text-white transition-all hover:brightness-110 hover:-translate-y-[1px]"
                  style={{
                    background: "#2B6BFF",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 10px 28px rgba(43,107,255,0.32)",
                  }}
                >
                  Create Account <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center h-[52px] px-7 rounded-md text-[14px] font-semibold text-[#0A1A3A] bg-white border border-[#0A1A3A]/15 hover:border-[#2B6BFF] hover:text-[#2B6BFF] transition-colors"
                >
                  Sign In
                </Link>
              </div>
              <p className="text-[12px] text-slate-500 mt-6">
                No account fee · Manual KYC review · Supported digital assets only
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

