import Link from "next/link";
import { Fragment } from "react";
import {
  ArrowRight, ArrowUpRight, ArrowDownRight,
  ShieldCheck, BarChart3, Users, Lock, Eye, Award,
  LineChart, ChevronRight, LayoutGrid,
  Sparkles, Bitcoin, Landmark, Coins,
  Activity, KeyRound, FileCheck2, CheckCircle2,
} from "lucide-react";
import { getMarketAssets } from "@/lib/coingecko";
import { formatCurrency, formatPercent, formatCompact } from "@/lib/utils";
import { CryptoIcon } from "@/components/public/crypto-icon";
import { PLATFORM } from "@/lib/company";

/* ─── Credibility bar ───────────────────────────────────────────────── */
const credibility = [
  { icon: ShieldCheck, title: "Account Protection",   desc: "Two-factor sign-in, password hashing and session monitoring on every account." },
  { icon: LineChart,   title: "Transparent Trading",  desc: "Bid, ask and order details shown clearly before every confirmation." },
  { icon: BarChart3,   title: "Portfolio Monitoring", desc: "Real-time holdings, P&L and full transaction history in one workspace." },
  { icon: FileCheck2,  title: "Secure Verification",  desc: "Manual KYC review and identity checks before live funding is enabled." },
];

/* ─── Feature cards ─────────────────────────────────────────────────── */
const features = [
  { icon: Bitcoin,    title: "Crypto Trading",         desc: "Buy and sell supported digital assets with market or limit orders and clear, itemised confirmations." },
  { icon: BarChart3,  title: "Investment Plans",       desc: "Structured plans with stated terms — review the plan details and risk information before participating." },
  { icon: Users,      title: "Copy Trading",           desc: "Mirror selected traders' activity in your own account. Transparent performance history; pause or exit any time." },
  { icon: LayoutGrid, title: "Wallet Management",      desc: "Manage deposit and withdrawal addresses with reviewable activity and per-asset balances." },
  { icon: ShieldCheck,title: "Account Verification",   desc: "Identity verification is required before funding. Submissions go through a manual review process before approval." },
  { icon: Eye,        title: "Transaction Monitoring", desc: "Every deposit, trade, and withdrawal is logged with timestamps and visible in your activity history." },
];

/* ─── Trust & Operations ────────────────────────────────────────────── */
const trust = [
  { icon: Lock,       title: "Encrypted Transport", desc: "All traffic to the platform is sent over TLS. Passwords are hashed with bcrypt and are never stored in plain text." },
  { icon: Eye,        title: "Full Activity Log",   desc: "Every deposit, trade, and withdrawal you make is visible in your account history with timestamps." },
  { icon: FileCheck2, title: "Reviewed Onboarding", desc: "Every funded account is manually reviewed against the identity documents you submit during KYC." },
  { icon: Award,      title: "Transparent Fees",    desc: "Trading fees are published up-front and the final cost is shown on the order confirmation before you submit." },
];

/* ─── Markets we cover ──────────────────────────────────────────────── */
const coveredMarkets = [
  { icon: Bitcoin,    title: "Bitcoin",      desc: "Buy, sell and hold BTC directly — the most-traded asset on the platform, priced in USD." },
  { icon: Coins,      title: "Ethereum",     desc: "ETH spot trading with market or limit orders, quoted against USD and available on every plan." },
  { icon: LayoutGrid, title: "Top Altcoins", desc: "SOL, BNB, XRP, ADA, AVAX, LINK, DOT, LTC and other majors — 15 listed assets under one USD quote layer." },
  { icon: Landmark,   title: "Stablecoins",  desc: "USDT for parking balance between trades or funding an investment plan without market exposure." },
];

/* ─── Onboarding steps ──────────────────────────────────────────────── */
const steps = [
  { n: "01", title: "Create your account",                    desc: "Register with your email and confirm ownership with a one-time code. No credit card required." },
  { n: "02", title: "Complete verification",                  desc: "Upload a government-issued ID and a short selfie. Submissions go through a manual review process before approval." },
  { n: "03", title: "Fund, trade and monitor your portfolio", desc: "Deposit through supported methods, place market or limit orders, and watch holdings in real time." },
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

  const heroStats: { label: string; value: string; accent?: "up" | "down" }[] = [
    { label: "24h Volume", value: `$${formatCompact(totalVolume)}` },
    { label: "Market Cap", value: `$${formatCompact(totalMcap)}`   },
    { label: "Avg 24h Δ",  value: formatPercent(avgChange), accent: avgChange >= 0 ? "up" : "down" },
    { label: "Listed",     value: `${marketAssets.length}`         },
  ];

  return (
    <div className="bg-white text-[#0A1A3A] overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════════════
          1 · HERO
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 sm:pt-36 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
        {/* Soft layered glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 75% 30%, rgba(43,107,255,0.12) 0%, rgba(43,107,255,0) 70%)," +
              "radial-gradient(50% 40% at 15% 80%, rgba(43,107,255,0.06) 0%, rgba(43,107,255,0) 70%)," +
              "linear-gradient(180deg, #FFFFFF 0%, #F7FAFF 60%, #FFFFFF 100%)",
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

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-14 lg:gap-12 items-center">
          {/* Left — copy */}
          <div className="min-w-0">
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

            <h1 className="text-[36px] sm:text-[48px] lg:text-[60px] leading-[1.04] font-bold tracking-tight">
              Trade Digital Assets
              <br />
              <span className="text-[#2B6BFF]">with Confidence.</span>
            </h1>
            <p className="mt-5 text-[15px] sm:text-[17px] leading-[1.65] text-slate-600 max-w-[510px]">
              Access crypto markets, investment tools, and copy-trading features
              from one secure platform built for modern investors.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
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
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-slate-500">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> Secure Account Access</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> KYC Verification</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> Real-Time Portfolio Tracking</span>
            </div>

            {/* Stat chips — 2x2 */}
            <div className="mt-8 grid grid-cols-2 gap-3 max-w-[480px]">
              {heroStats.map((s) => (
                <div key={s.label} className="rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-[0_4px_14px_-8px_rgba(15,23,42,0.10)]">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold truncate">{s.label}</div>
                  <div
                    className={`mt-1 text-[16px] font-bold tabular-nums truncate ${
                      s.accent === "up"   ? "text-emerald-600" :
                      s.accent === "down" ? "text-rose-600" :
                      "text-[#0A1A3A]"
                    }`}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — laptop + phone mockup */}
          <div className="relative min-w-0">
            <HeroMockup
              btcPrice={btc?.price ?? 63321.25}
              btcChange={btc?.change ?? 2.45}
              btcSpark={btc?.sparkline ?? []}
              assets={marketAssets}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          TICKER CARD
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-8 pb-12 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_24px_60px_-26px_rgba(15,23,42,0.20)] overflow-hidden">
            <div className="flex items-stretch flex-col sm:flex-row">
              <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
                <div className="flex items-stretch divide-x divide-slate-100 min-w-max">
                  {tickerData.map((a) => {
                    const up = a.change >= 0;
                    return (
                      <div
                        key={a.symbol}
                        className="flex items-center gap-3 px-4 sm:px-5 py-4 text-[12.5px] tabular-nums whitespace-nowrap hover:bg-[#F7FAFF] transition-colors"
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
              <div className="flex items-center justify-center sm:justify-start px-3 sm:px-4 py-3 sm:py-0 border-t sm:border-t-0 sm:border-l border-slate-100 flex-shrink-0">
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
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {credibility.map((c) => (
              <div
                key={c.title}
                className="group bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 transition-all duration-300 hover:border-[#2B6BFF] hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_rgba(43,107,255,0.30)]"
              >
                <div className="w-11 h-11 rounded-lg bg-[#2B6BFF]/10 inline-flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                  <c.icon className="h-[18px] w-[18px] text-[#2B6BFF]" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[14px] font-semibold text-[#0A1A3A] mb-1">{c.title}</h3>
                  <p className="text-[12.5px] text-slate-600 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FEATURE GRID — Platform
      ════════════════════════════════════════════════════════════════ */}
      <section id="capabilities" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-[#F7FAFF] scroll-mt-24">
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
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300 hover:border-[#2B6BFF] hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_rgba(43,107,255,0.30)]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[#2B6BFF]/10 inline-flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#2B6BFF]/15">
                    <f.icon className="h-[18px] w-[18px] text-[#2B6BFF]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-[#0A1A3A] mb-1.5">{f.title}</h3>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          HOW IT WORKS — Onboarding
      ════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white scroll-mt-24">
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
              {steps.map((s) => (
                <Fragment key={s.n}>
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-lg inline-flex items-center justify-center text-[15px] font-bold text-[#2B6BFF] bg-[#2B6BFF]/10 border border-[#2B6BFF]/15 tabular-nums"
                      >
                        {s.n}
                      </div>
                      <h3 className="text-[15px] font-semibold text-[#0A1A3A] leading-tight">{s.title}</h3>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          TRUST & SECURITY
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-[#F7FAFF]">
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
              {trust.map((t) => (
                <div key={t.title} className="bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300 hover:border-[#2B6BFF] hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_rgba(43,107,255,0.30)]">
                  <div className="w-10 h-10 rounded-lg bg-[#2B6BFF]/10 border border-[#2B6BFF]/20 flex items-center justify-center mb-3">
                    <t.icon className="h-4 w-4 text-[#2B6BFF]" strokeWidth={2} />
                  </div>
                  <h4 className="text-[14px] font-semibold text-[#0A1A3A] mb-1.5">{t.title}</h4>
                  <p className="text-[12.5px] text-slate-600 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          MARKETS WE COVER
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white">
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
                <div className="w-11 h-11 rounded-lg bg-[#2B6BFF]/10 border border-[#2B6BFF]/15 flex items-center justify-center mb-4">
                  <m.icon className="h-[18px] w-[18px] text-[#2B6BFF]" strokeWidth={2} />
                </div>
                <h3 className="text-[15px] font-semibold text-[#0A1A3A] mb-1.5">{m.title}</h3>
                <p className="text-[12.5px] text-slate-600 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          RISK DISCLOSURE BAND
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <div className="rounded-2xl p-5 sm:p-6 flex items-start gap-4 bg-[#EAF2FF] border border-[#DCE6FA]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border border-[#2B6BFF]/20">
              <ShieldCheck className="h-4 w-4 text-[#2B6BFF]" />
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-[0.18em] text-[#2B6BFF] uppercase mb-1.5">Trade Informed</div>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                Markets move quickly, and every investor&rsquo;s situation is different. We
                publish a full{" "}
                <Link href="/risk" className="text-[#2B6BFF] underline-offset-2 hover:underline font-semibold">
                  risk overview
                </Link>{" "}
                so you can review the details and trade with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CTA — Open an Account
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 bg-white">
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

/* ══════════════════════════════════════════════════════════════════════
   HERO MOCKUP — Premium browser/laptop dashboard with floating phone
   ══════════════════════════════════════════════════════════════════════ */
function HeroMockup({
  btcPrice, btcChange, btcSpark, assets,
}: {
  btcPrice: number;
  btcChange: number;
  btcSpark: number[];
  assets: import("@/lib/coingecko").MarketAsset[];
}) {
  const watchlist = assets.slice(0, 5);
  const sparkPath = sparklinePath(btcSpark);

  return (
    <div className="relative w-full">
      <div
        aria-hidden
        className="absolute -inset-6 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(43,107,255,0.18), transparent 70%)",
        }}
      />

      <div className="relative w-full">
        <div className="rounded-t-2xl bg-[#0F1729] h-3 mx-[3%] relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#1F2A3F]" />
        </div>
        <div
          className="rounded-b-md border-x border-b border-[#0F1729]/40 bg-white overflow-hidden"
          style={{ boxShadow: "0 30px 70px -28px rgba(15,23,42,0.45), 0 8px 18px -8px rgba(15,23,42,0.18)" }}
        >
          <DashboardScreen
            btcPrice={btcPrice}
            btcChange={btcChange}
            sparkPath={sparkPath}
            watchlist={watchlist}
          />
        </div>
        <div
          className="h-[14px] -mx-[6%] rounded-b-[16px]"
          style={{
            background: "linear-gradient(180deg, #C7CFD9 0%, #94A0B0 55%, #6E7886 100%)",
          }}
        />
        <div className="mx-auto -mt-[11px] h-[7px] w-[28%] rounded-b-md bg-[#5E6878]" />
      </div>

      <div className="absolute right-1 sm:right-2 lg:right-0 bottom-[-30px] sm:bottom-[-36px] w-[30%] max-w-[150px] sm:max-w-[195px]">
        <PhoneMockup btcPrice={btcPrice} btcChange={btcChange} />
      </div>
    </div>
  );
}

function DashboardScreen({
  btcPrice, btcChange, sparkPath, watchlist,
}: {
  btcPrice:  number;
  btcChange: number;
  sparkPath: { line: string; area: string } | null;
  watchlist: import("@/lib/coingecko").MarketAsset[];
}) {
  const up = btcChange >= 0;
  return (
    <div className="bg-[#FBFCFE] text-[10.5px]">
      <div className="bg-white border-b border-slate-100 flex items-center px-3 h-7 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="ml-3 flex-1 max-w-[180px] h-4 rounded bg-slate-100 flex items-center justify-center text-[8px] text-slate-400 font-medium">
          securechainmarkets.com/dashboard
        </div>
      </div>

      <div className="grid grid-cols-[36px_1fr] sm:grid-cols-[44px_1fr]">
        <div className="bg-white border-r border-slate-100 py-3 flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[#2B6BFF] inline-flex items-center justify-center">
            <ShieldCheck className="h-3.5 w-3.5 text-white" strokeWidth={2.4} />
          </div>
          <div className="w-px h-2 bg-slate-100" />
          {[BarChart3, Activity, Users].map((Icon, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-md inline-flex items-center justify-center ${
                i === 0 ? "bg-[#2B6BFF]/10 text-[#2B6BFF]" : "text-slate-400"
              }`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            </div>
          ))}
        </div>

        <div className="p-3.5 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[12px] font-bold text-[#0A1A3A]">Dashboard</span>
              <span className="hidden sm:inline text-[9px] text-slate-400">/ Markets</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2B6BFF] to-[#1A4FCC]" />
          </div>

          <div className="grid grid-cols-[1fr_120px] sm:grid-cols-[1fr_148px] gap-2 sm:gap-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <CryptoIcon symbol="BTC" size={20} />
                  <div className="leading-tight">
                    <div className="font-bold text-[#0A1A3A] text-[11px]">BTC/USDT</div>
                    <div className="text-[8.5px] text-slate-400">Bitcoin · Spot</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="font-bold text-[#0A1A3A] text-[12px]">{formatCurrency(btcPrice)}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${up ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"}`}>
                    {up ? "▲" : "▼"} {Math.abs(btcChange).toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-2">
                {["1H","4H","1D","1W","1M"].map((t, i) => (
                  <span
                    key={t}
                    className={`px-1.5 py-0.5 rounded text-[8.5px] font-semibold ${
                      i === 2 ? "bg-[#2B6BFF]/10 text-[#2B6BFF]" : "text-slate-400"
                    }`}
                  >{t}</span>
                ))}
              </div>

              <div className="relative h-[110px]">
                <svg viewBox="0 0 320 110" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor="#2B6BFF" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#2B6BFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[20, 45, 70, 95].map((y) => (
                    <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#EEF2F7" strokeWidth="1" />
                  ))}
                  {sparkPath ? (
                    <>
                      <path d={sparkPath.line} stroke="#2B6BFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <path d={sparkPath.area} fill="url(#chart-area)" />
                    </>
                  ) : (
                    <>
                      <path d="M0,85 L26,75 L52,82 L78,62 L104,68 L130,46 L156,54 L182,38 L208,44 L234,28 L260,34 L286,18 L320,24" stroke="#2B6BFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M0,85 L26,75 L52,82 L78,62 L104,68 L130,46 L156,54 L182,38 L208,44 L234,28 L260,34 L286,18 L320,24 L320,110 L0,110 Z" fill="url(#chart-area)" />
                    </>
                  )}
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="text-[9px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">Watchlist</div>
                <ul className="space-y-1.5">
                  {watchlist.map((a) => {
                    const isUp = a.change >= 0;
                    return (
                      <li key={a.symbol} className="flex items-center justify-between text-[9.5px]">
                        <span className="flex items-center gap-1.5 min-w-0 flex-1">
                          <CryptoIcon symbol={a.symbol} size={14} className="flex-shrink-0" />
                          <span className="font-semibold text-[#0A1A3A] truncate">{a.symbol}</span>
                        </span>
                        <span className={`tabular-nums text-[8.5px] font-semibold ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
                          {isUp ? "+" : ""}{a.change.toFixed(2)}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="text-[9px] font-bold uppercase text-slate-500 tracking-wider mb-1">Portfolio</div>
                <div className="text-[14px] font-bold text-[#0A1A3A] tabular-nums leading-none">$87,650.18</div>
                <div className="text-[8.5px] text-emerald-600 font-semibold mt-0.5">+2.45% today</div>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  <div className="h-6 rounded text-[8.5px] font-bold text-white bg-emerald-500 inline-flex items-center justify-center">Buy</div>
                  <div className="h-6 rounded text-[8.5px] font-bold text-white bg-rose-500 inline-flex items-center justify-center">Sell</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneMockup({ btcPrice, btcChange }: { btcPrice: number; btcChange: number }) {
  const up = btcChange >= 0;
  return (
    <div
      className="relative rounded-[26px] bg-[#0A1A3A] p-1.5 border border-slate-700"
      style={{
        boxShadow: "0 30px 60px -20px rgba(15,23,42,0.55), 0 10px 24px -8px rgba(15,23,42,0.30)",
      }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[36%] h-1.5 rounded-full bg-black z-10" />
      <div className="rounded-[20px] bg-white overflow-hidden p-3 pt-5">
        <div className="text-[8px] text-slate-400 font-semibold tracking-wider mb-0.5">PORTFOLIO</div>
        <div className="text-[14px] font-bold text-[#0A1A3A] tabular-nums leading-none">$87,650.18</div>
        <div className={`text-[8px] mt-0.5 font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
          {up ? "+" : ""}{btcChange.toFixed(2)}% · {formatCurrency(btcPrice)}
        </div>

        <svg viewBox="0 0 160 50" className="w-full h-[40px] mt-2">
          <defs>
            <linearGradient id="phone-spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#2B6BFF" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#2B6BFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,38 L20,32 L40,36 L60,24 L80,28 L100,18 L120,22 L140,12 L160,16" stroke="#2B6BFF" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0,38 L20,32 L40,36 L60,24 L80,28 L100,18 L120,22 L140,12 L160,16 L160,50 L0,50 Z" fill="url(#phone-spark)" />
        </svg>

        <ul className="mt-2 space-y-1">
          {[
            { s: "BTC", chg: "+2.45" },
            { s: "ETH", chg: "+1.24" },
            { s: "SOL", chg: "+3.82" },
          ].map((i) => (
            <li key={i.s} className="flex items-center justify-between text-[9px]">
              <span className="flex items-center gap-1.5">
                <CryptoIcon symbol={i.s} size={14} />
                <span className="font-bold text-[#0A1A3A]">{i.s}</span>
              </span>
              <span className="text-emerald-600 font-semibold tabular-nums text-[8.5px]">{i.chg}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Sparkline path generator ───────────────────────────────────────── */
function sparklinePath(data: number[]): { line: string; area: string } | null {
  if (!data || data.length < 2) return null;
  const W = 320, H = 110, P = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = (W - P * 2) / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = P + step * i;
    const y = P + (H - P * 2) * (1 - (v - min) / range);
    return [x, y];
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1]!;
  const first = pts[0]!;
  const area = `${line} L${last[0].toFixed(1)},${H} L${first[0].toFixed(1)},${H} Z`;
  return { line, area };
}
