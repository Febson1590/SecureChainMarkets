import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, ArrowDownRight,
  ShieldCheck, BarChart3, Users, BadgeCheck, Headphones,
  TrendingUp, Globe, Lock, Wallet, ChevronRight,
  UserPlus, CreditCard, LineChart, Bitcoin,
} from "lucide-react";
import { getMarketAssets } from "@/lib/coingecko";
import { formatCurrency, formatPercent, formatCompact } from "@/lib/utils";

const CRYPTO_COLORS: Record<string, string> = {
  BTC: "#F7931A", ETH: "#627EEA", USDT: "#26A17B", BNB: "#F3BA2F",
  SOL: "#9945FF", XRP: "#346AA9", ADA: "#3CC8C8", DOGE: "#C2A633",
  AVAX: "#E84142", DOT: "#E6007A", LINK: "#2A5ADA", LTC: "#BEBEBE",
};

/* ── Why Traders Choose Us ────────────────────────────────── */
const valueProps = [
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    desc: "Top-tier security with cold storage, encryption, and multi-layer protection for your assets.",
  },
  {
    icon: TrendingUp,
    title: "Advanced Trading",
    desc: "Powerful tools, real-time data, and low spreads for a superior trading experience.",
  },
  {
    icon: Users,
    title: "User Focused",
    desc: "Intuitive platform, 24/7 support, and a smooth experience for every level of trader.",
  },
  {
    icon: BadgeCheck,
    title: "Regulated & Transparent",
    desc: "We operate with full transparency and compliance with global regulatory standards.",
  },
];

/* ── Stats ──────────────────────────────────────────────────── */
const stats = [
  { icon: Users,      value: "50K+",   label: "Active Traders"      },
  { icon: BarChart3,  value: "$2.5B+", label: "Daily Trading Volume"},
  { icon: Globe,      value: "150+",   label: "Countries"           },
  { icon: ShieldCheck,value: "99.9%",  label: "Platform Uptime"     },
];

/* ── How It Works ──────────────────────────────────────────── */
const steps = [
  { n: 1, icon: UserPlus,   title: "Create Account",     desc: "Sign up in minutes and verify your identity securely."   },
  { n: 2, icon: CreditCard, title: "Fund Your Account",  desc: "Deposit funds using multiple secure payment methods."     },
  { n: 3, icon: LineChart,  title: "Start Trading",      desc: "Access markets and trade with confidence and ease."       },
];

/* ── Hero security badges ──────────────────────────────────── */
const heroBadges = [
  { icon: Lock,        title: "256-bit SSL",         sub: "Encryption" },
  { icon: BadgeCheck,  title: "Regulated &",         sub: "Compliant" },
  { icon: ShieldCheck, title: "Secure Asset",        sub: "Protection" },
  { icon: Headphones,  title: "24/7 Expert",         sub: "Support" },
];

export default async function HomePage() {
  const marketAssets = await getMarketAssets();
  const tickerSyms = ["BTC", "ETH", "BNB", "SOL", "XRP"];
  const tickerData = tickerSyms
    .map((s) => marketAssets.find((a) => a.symbol === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const btc = marketAssets.find((a) => a.symbol === "BTC");

  return (
    <div className="bg-white text-[#0A1A3A] overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════════════
          1 · HERO
      ════════════════════════════════════════════════════════════════ */}
      <section
        className="pt-32 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 relative"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #F4F8FF 60%, #FFFFFF 100%)",
        }}
      >
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-12 lg:gap-10 items-center">
          {/* Left — copy */}
          <div className="min-w-0">
            <h1 className="text-[40px] sm:text-[52px] lg:text-[60px] leading-[1.05] font-bold tracking-tight">
              Trade Secure.
              <br />
              <span className="text-[#2B6BFF]">Grow Confident.</span>
            </h1>
            <p className="mt-5 text-[15px] sm:text-[16px] leading-[1.65] text-slate-600 max-w-[480px]">
              Secure Chain Markets offers a next-generation trading
              experience with advanced tools, deep liquidity,
              and institutional-grade security.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-12 px-7 rounded-md text-[14px] font-semibold text-white transition-all hover:brightness-110"
                style={{
                  background: "#2B6BFF",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(43,107,255,0.32)",
                }}
              >
                Start Trading Now
              </Link>
              <Link
                href="/markets"
                className="inline-flex items-center justify-center h-12 px-7 rounded-md text-[14px] font-semibold text-[#0A1A3A] border border-[#0A1A3A]/15 hover:border-[#2B6BFF] hover:text-[#2B6BFF] transition-colors"
              >
                Explore Markets
              </Link>
            </div>

            {/* Security badges — 2x2 */}
            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 max-w-[460px]">
              {heroBadges.map((b) => (
                <div key={b.title} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-[#2B6BFF]/10 border border-[#2B6BFF]/20 inline-flex items-center justify-center flex-shrink-0">
                    <b.icon className="h-4 w-4 text-[#2B6BFF]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-[#0A1A3A] leading-tight">{b.title}</div>
                    <div className="text-[11px] text-slate-500 leading-tight">{b.sub}</div>
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
              assets={marketAssets}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2 · MARKET TICKER CARD
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-2 pb-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_18px_50px_-22px_rgba(15,23,42,0.18)] overflow-hidden">
            <div className="flex items-center overflow-x-auto no-scrollbar">
              <div className="flex items-center divide-x divide-slate-200 flex-1 min-w-max">
                {tickerData.map((a) => {
                  const color = CRYPTO_COLORS[a.symbol] ?? "#2B6BFF";
                  const up = a.change >= 0;
                  return (
                    <div
                      key={a.symbol}
                      className="flex items-center gap-2.5 px-5 py-4 text-[12.5px] tabular-nums whitespace-nowrap"
                    >
                      <span
                        className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[9px] font-black flex-shrink-0"
                        style={{ background: `${color}1F`, border: `1px solid ${color}66`, color }}
                      >
                        {a.symbol.slice(0, 1)}
                      </span>
                      <span className="font-bold text-[#0A1A3A]">{a.symbol}/USDT</span>
                      <span className="text-slate-700 font-semibold">{formatCurrency(a.price)}</span>
                      <span className={`inline-flex items-center gap-0.5 text-[12px] font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
                        {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {Math.abs(a.change).toFixed(2)}%
                      </span>
                    </div>
                  );
                })}
              </div>
              <Link
                href="/markets"
                className="flex-shrink-0 inline-flex items-center gap-1.5 mr-4 px-4 h-9 rounded-md text-[12.5px] font-semibold text-[#2B6BFF] border border-[#2B6BFF]/30 hover:bg-[#2B6BFF] hover:text-white hover:border-[#2B6BFF] transition-colors"
              >
                View All Markets
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          3 · WHY TRADERS CHOOSE US
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#0A1A3A] tracking-tight">
              Why Traders Choose Us
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-12 rounded-full bg-[#2B6BFF]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valueProps.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-xl border border-slate-200 p-7 text-center transition-all hover:border-[#2B6BFF]/40 hover:shadow-[0_18px_40px_-22px_rgba(43,107,255,0.35)]"
              >
                <div className="mx-auto w-14 h-14 rounded-2xl bg-[#2B6BFF]/10 inline-flex items-center justify-center mb-5">
                  <v.icon className="h-6 w-6 text-[#2B6BFF]" strokeWidth={2} />
                </div>
                <h3 className="text-[16px] font-semibold text-[#0A1A3A] mb-2">{v.title}</h3>
                <p className="text-[13px] text-slate-600 leading-[1.6]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          4 · STATS — single wide white card
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_18px_50px_-22px_rgba(15,23,42,0.10)] py-10 px-6 sm:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 lg:gap-y-0 lg:divide-x lg:divide-slate-200">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center justify-center gap-4 px-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2B6BFF]/10 inline-flex items-center justify-center flex-shrink-0">
                    <s.icon className="h-5 w-5 text-[#2B6BFF]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[24px] sm:text-[28px] font-bold text-[#0A1A3A] tabular-nums leading-none">
                      {s.value}
                    </div>
                    <div className="text-[12.5px] text-slate-600 mt-1">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          5 · HOW IT WORKS
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="px-4 sm:px-6 lg:px-8 py-20 bg-white scroll-mt-24"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#2B6BFF] mb-3">
              How It Works
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#0A1A3A] tracking-tight">
              Start Your Journey in 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-y-10 lg:gap-x-4 items-start">
            {steps.map((s, i) => (
              <>
                <div key={s.n} className="flex flex-col items-center text-center px-2">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-11 h-11 rounded-full bg-[#0A1A3A] text-white inline-flex items-center justify-center text-[15px] font-bold tabular-nums">
                      {s.n}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#2B6BFF]/10 inline-flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-[#2B6BFF]" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#0A1A3A] mb-2">{s.title}</h3>
                  <p className="text-[13px] text-slate-600 leading-[1.6] max-w-[260px]">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div key={`arrow-${i}`} className="hidden lg:flex items-center justify-center pt-3">
                    <ArrowRight className="h-5 w-5 text-slate-300" strokeWidth={2.2} />
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          6 · FINAL CTA — light blue card with phone + floating coins
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="relative rounded-2xl px-7 sm:px-12 py-14 sm:py-16 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #EAF2FF 0%, #F4F8FF 60%, #FFFFFF 100%)",
              border: "1px solid #DCE6FA",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-10 items-center">
              <div className="min-w-0">
                <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0A1A3A] tracking-tight">
                  Ready to Trade Smarter?
                </h2>
                <p className="mt-4 text-[14px] sm:text-[15px] text-slate-600 max-w-[460px] leading-[1.65]">
                  Join thousands of traders already using Secure Chain Markets
                  to trade and invest in digital assets.
                </p>
                <div className="mt-7">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center h-12 px-7 rounded-md text-[14px] font-semibold text-white transition-all hover:brightness-110"
                    style={{
                      background: "#2B6BFF",
                      boxShadow:
                        "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(43,107,255,0.32)",
                    }}
                  >
                    Create Your Account
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[280px] sm:min-h-[320px]">
                <CtaPhoneMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HERO MOCKUP — Laptop frame containing dashboard, phone clipping in
   ══════════════════════════════════════════════════════════════════════ */
function HeroMockup({
  btcPrice, btcChange, assets,
}: {
  btcPrice: number;
  btcChange: number;
  assets: import("@/lib/coingecko").MarketAsset[];
}) {
  const watchlist = assets.slice(0, 5);

  return (
    <div className="relative w-full">
      {/* Laptop frame */}
      <div className="relative w-full pl-[6%] pr-[2%]">
        {/* Screen */}
        <div
          className="rounded-t-xl border border-slate-300 bg-white overflow-hidden"
          style={{
            boxShadow: "0 22px 60px -28px rgba(15,23,42,0.45), 0 8px 18px -10px rgba(15,23,42,0.18)",
          }}
        >
          <DashboardScreen
            btcPrice={btcPrice}
            btcChange={btcChange}
            watchlist={watchlist}
          />
        </div>
        {/* Laptop base */}
        <div
          className="h-[14px] -mx-[6%] rounded-b-[14px]"
          style={{
            background: "linear-gradient(180deg, #C7CFD9 0%, #94A0B0 60%, #6E7886 100%)",
          }}
        />
        <div className="mx-auto -mt-[11px] h-[8px] w-[36%] rounded-b-md bg-[#5E6878]" />
      </div>

      {/* Phone mockup */}
      <div className="absolute right-2 sm:right-4 bottom-[-30px] sm:bottom-[-40px] w-[34%] max-w-[200px]">
        <PhoneMockup />
      </div>
    </div>
  );
}

function DashboardScreen({
  btcPrice, btcChange, watchlist,
}: {
  btcPrice: number;
  btcChange: number;
  watchlist: import("@/lib/coingecko").MarketAsset[];
}) {
  const up = btcChange >= 0;
  return (
    <div className="bg-white p-3 sm:p-4 text-[10px] sm:text-[11px]">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#2B6BFF] inline-flex items-center justify-center">
            <ShieldCheck size={11} className="text-white" />
          </div>
          <span className="font-bold text-[#0A1A3A] text-[11px]">SecureChainMarkets</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span>Dashboard</span>
          <span className="hidden sm:inline">Markets</span>
          <div className="w-5 h-5 rounded-full bg-slate-200" />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_minmax(0,140px)] gap-3">
        {/* Left: chart panel */}
        <div className="rounded-md border border-slate-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#F7931A]/20 text-[#F7931A] text-[8px] font-bold inline-flex items-center justify-center">B</span>
              <span className="font-semibold text-[#0A1A3A]">BTC/USDT</span>
            </div>
            <div className="flex items-center gap-2 tabular-nums">
              <span className="font-bold text-[#0A1A3A]">{formatCurrency(btcPrice)}</span>
              <span className={`text-[10px] font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
                {up ? "+" : ""}{btcChange.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { l: "24h High", v: formatCurrency(btcPrice * 1.012) },
              { l: "24h Low",  v: formatCurrency(btcPrice * 0.988) },
              { l: "24h Vol",  v: "$1.46B" },
            ].map((c) => (
              <div key={c.l} className="rounded bg-slate-50 px-2 py-1.5">
                <div className="text-[8px] text-slate-500 uppercase tracking-wider">{c.l}</div>
                <div className="text-[10px] font-semibold text-[#0A1A3A] tabular-nums truncate">{c.v}</div>
              </div>
            ))}
          </div>

          {/* Mini chart */}
          <svg viewBox="0 0 240 90" className="w-full h-[90px]">
            <defs>
              <linearGradient id="hero-chart" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2B6BFF" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#2B6BFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[15, 30, 45, 60, 75].map((y) => (
              <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="#EEF2F7" strokeWidth="1" />
            ))}
            <path
              d="M0,70 L20,60 L40,68 L60,52 L80,58 L100,42 L120,50 L140,38 L160,28 L180,40 L200,22 L220,32 L240,18"
              stroke="#2B6BFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
            <path
              d="M0,70 L20,60 L40,68 L60,52 L80,58 L100,42 L120,50 L140,38 L160,28 L180,40 L200,22 L220,32 L240,18 L240,90 L0,90 Z"
              fill="url(#hero-chart)"
            />
          </svg>

          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { l: "Portfolio Value", v: "$125,430.50", c: "+1.4%" },
              { l: "24h P&L",         v: "$2,754.32",   c: "+1.20%" },
              { l: "Total Balance",   v: "$87,650.18",  c: "+2.4%" },
            ].map((s) => (
              <div key={s.l} className="rounded bg-slate-50 px-2 py-1.5">
                <div className="text-[8px] text-slate-500 uppercase tracking-wider">{s.l}</div>
                <div className="text-[10px] font-semibold text-[#0A1A3A] tabular-nums">{s.v}</div>
                <div className="text-[8px] text-emerald-600 font-semibold">{s.c}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: watchlist + buttons */}
        <div className="rounded-md border border-slate-200 p-2.5">
          <div className="text-[9px] font-bold uppercase text-slate-500 tracking-wider mb-2">Watchlist</div>
          <ul className="space-y-1.5">
            {watchlist.map((a) => {
              const color = CRYPTO_COLORS[a.symbol] ?? "#2B6BFF";
              const isUp = a.change >= 0;
              return (
                <li key={a.symbol} className="flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[7px] font-black flex-shrink-0"
                      style={{ background: `${color}26`, color }}
                    >
                      {a.symbol.slice(0, 1)}
                    </span>
                    <span className="font-semibold text-[#0A1A3A] truncate">{a.symbol}</span>
                  </span>
                  <span className="tabular-nums text-slate-600 font-medium">{formatCompact(a.price)}</span>
                  <span className={`tabular-nums text-[9px] font-semibold ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
                    {isUp ? "+" : ""}{a.change.toFixed(2)}%
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <div className="h-7 rounded text-[10px] font-bold text-white bg-emerald-500 inline-flex items-center justify-center">Buy</div>
            <div className="h-7 rounded text-[10px] font-bold text-white bg-rose-500 inline-flex items-center justify-center">Sell</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div
      className="relative rounded-[28px] bg-[#0A1A3A] p-2 border border-slate-700"
      style={{
        boxShadow: "0 30px 60px -20px rgba(15,23,42,0.55), 0 10px 24px -8px rgba(15,23,42,0.3)",
      }}
    >
      <div className="rounded-[22px] bg-[#0A1A3A] overflow-hidden p-3 text-white">
        <div className="text-[8px] text-white/60 mb-1">Portfolio Overview</div>
        <div className="text-[14px] font-bold tabular-nums">$87,650.18</div>
        <div className="text-[8px] text-emerald-400 font-semibold">+2.45%</div>

        <div className="mt-3 text-[8px] text-white/60 font-bold uppercase tracking-wider">Watchlist</div>
        <ul className="mt-1 space-y-1.5">
          {["BTC", "ETH", "BNB", "SOL", "XRP"].map((s, i) => {
            const color = CRYPTO_COLORS[s] ?? "#2B6BFF";
            const up = i % 2 === 0;
            return (
              <li key={s} className="flex items-center justify-between text-[9px]">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[7px] font-black"
                    style={{ background: `${color}33`, color }}
                  >
                    {s.slice(0, 1)}
                  </span>
                  <span className="font-bold">{s}</span>
                </span>
                <span className={`tabular-nums font-semibold ${up ? "text-emerald-400" : "text-rose-400"}`}>
                  {up ? "+" : "-"}{(0.5 + i * 0.4).toFixed(2)}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function CtaPhoneMockup() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Floating coins */}
      <div
        aria-hidden
        className="absolute left-[8%] top-[20%] w-12 h-12 rounded-full inline-flex items-center justify-center text-white text-[20px] font-black shadow-[0_14px_30px_-10px_rgba(247,147,26,0.55)]"
        style={{ background: "#F7931A" }}
      >
        ₿
      </div>
      <div
        aria-hidden
        className="absolute right-[8%] top-[10%] w-12 h-12 rounded-full inline-flex items-center justify-center text-white text-[18px] font-black shadow-[0_14px_30px_-10px_rgba(98,126,234,0.55)]"
        style={{ background: "#627EEA" }}
      >
        Ξ
      </div>
      <div
        aria-hidden
        className="absolute right-[2%] bottom-[12%] w-12 h-12 rounded-full inline-flex items-center justify-center text-white text-[16px] font-black shadow-[0_14px_30px_-10px_rgba(153,69,255,0.55)]"
        style={{ background: "#9945FF" }}
      >
        S
      </div>

      {/* Phone */}
      <div className="relative w-[200px] sm:w-[220px]">
        <div
          className="rounded-[28px] bg-[#0A1A3A] p-2 border border-slate-700"
          style={{ boxShadow: "0 30px 60px -20px rgba(15,23,42,0.45)" }}
        >
          <div className="rounded-[22px] bg-[#0A1A3A] overflow-hidden p-4 text-white">
            <div className="text-[9px] text-white/60 mb-1">BTC/USDT</div>
            <div className="text-[20px] font-bold tabular-nums">$63,321</div>
            <svg viewBox="0 0 200 50" className="w-full h-[50px] mt-2">
              <defs>
                <linearGradient id="cta-spark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5C8BFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#5C8BFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,40 L20,32 L40,36 L60,24 L80,30 L100,18 L120,22 L140,12 L160,20 L180,8 L200,14"
                stroke="#5C8BFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d="M0,40 L20,32 L40,36 L60,24 L80,30 L100,18 L120,22 L140,12 L160,20 L180,8 L200,14 L200,50 L0,50 Z"
                fill="url(#cta-spark)"
              />
            </svg>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="h-7 rounded text-[10px] font-bold text-white bg-emerald-500 inline-flex items-center justify-center">Buy</div>
              <div className="h-7 rounded text-[10px] font-bold text-white bg-rose-500 inline-flex items-center justify-center">Sell</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
