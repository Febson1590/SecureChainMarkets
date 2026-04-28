import Link from "next/link";
import { Fragment } from "react";
import {
  ArrowRight, ArrowUpRight, ArrowDownRight,
  ShieldCheck, BarChart3, Users, BadgeCheck, Headphones,
  TrendingUp, Globe, Lock, ChevronRight,
  UserPlus, CreditCard, LineChart, Search, Bell,
  Wallet, Activity,
} from "lucide-react";
import { getMarketAssets } from "@/lib/coingecko";
import { formatCurrency, formatCompact } from "@/lib/utils";

const CRYPTO_COLORS: Record<string, string> = {
  BTC: "#F7931A", ETH: "#627EEA", USDT: "#26A17B", BNB: "#F3BA2F",
  SOL: "#9945FF", XRP: "#346AA9", ADA: "#3CC8C8", DOGE: "#C2A633",
  AVAX: "#E84142", DOT: "#E6007A", LINK: "#2A5ADA", LTC: "#BEBEBE",
};

/* ── Why Traders Choose Us ────────────────────────────────── */
const valueProps = [
  { icon: ShieldCheck, title: "Secure & Reliable",      desc: "Top-tier security with cold storage, encryption, and multi-layer protection for your assets." },
  { icon: TrendingUp,  title: "Advanced Trading",       desc: "Powerful tools, real-time data, and low spreads for a superior trading experience." },
  { icon: Users,       title: "User Focused",           desc: "Intuitive platform, 24/7 support, and a smooth experience for every level of trader." },
  { icon: BadgeCheck,  title: "Regulated & Transparent",desc: "We operate with full transparency and compliance with global regulatory standards." },
];

const stats = [
  { icon: Users,       value: "50K+",   label: "Active Traders"       },
  { icon: BarChart3,   value: "$2.5B+", label: "Daily Trading Volume" },
  { icon: Globe,       value: "150+",   label: "Countries"            },
  { icon: ShieldCheck, value: "99.9%",  label: "Platform Uptime"      },
];

const steps = [
  { n: 1, icon: UserPlus,   title: "Create Account",    desc: "Sign up in minutes and verify your identity securely." },
  { n: 2, icon: CreditCard, title: "Fund Your Account", desc: "Deposit funds using multiple secure payment methods."   },
  { n: 3, icon: LineChart,  title: "Start Trading",     desc: "Access markets and trade with confidence and ease."     },
];

const heroBadges = [
  { icon: Lock,        title: "256-bit SSL",  sub: "Encryption" },
  { icon: BadgeCheck,  title: "Regulated &",  sub: "Compliant"  },
  { icon: ShieldCheck, title: "Secure Asset", sub: "Protection" },
  { icon: Headphones,  title: "24/7 Expert",  sub: "Support"    },
];

/* ── Section eyebrow label ────────────────────────────────── */
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
  const eth = marketAssets.find((a) => a.symbol === "ETH");

  return (
    <div className="bg-white text-[#0A1A3A] overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════════════
          1 · HERO
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 sm:pt-36 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
        {/* Soft layered glow background — premium fintech, no kitsch */}
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
            maskImage:
              "radial-gradient(60% 60% at 50% 40%, black, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(60% 60% at 50% 40%, black, transparent 80%)",
          }}
        />

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-12 lg:gap-12 items-center">
          {/* Left — copy */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[12px] font-semibold text-[#0A1A3A] mb-6 shadow-[0_4px_12px_-6px_rgba(15,23,42,0.10)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live markets · {marketAssets.length}+ assets
            </div>

            <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] leading-[1.04] font-bold tracking-tight">
              Trade Secure.
              <br />
              <span className="text-[#2B6BFF]">Grow Confident.</span>
            </h1>
            <p className="mt-5 text-[15px] sm:text-[17px] leading-[1.65] text-slate-600 max-w-[510px]">
              Secure Chain Markets offers a next-generation trading
              experience with advanced tools, deep liquidity,
              and institutional-grade security.
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
                Start Trading Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/markets"
                className="inline-flex items-center justify-center h-12 px-7 rounded-md text-[14px] font-semibold text-[#0A1A3A] bg-white border border-[#0A1A3A]/15 hover:border-[#2B6BFF] hover:text-[#2B6BFF] transition-colors"
              >
                Explore Markets
              </Link>
            </div>

            {/* Security badges — 2x2 */}
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 max-w-[480px]">
              {heroBadges.map((b) => (
                <div key={b.title} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 inline-flex items-center justify-center flex-shrink-0 shadow-[0_4px_10px_-4px_rgba(15,23,42,0.08)]">
                    <b.icon className="h-[18px] w-[18px] text-[#2B6BFF]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-semibold text-[#0A1A3A] leading-tight">{b.title}</div>
                    <div className="text-[11.5px] text-slate-500 leading-tight">{b.sub}</div>
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
              ethPrice={eth?.price ?? 3142.88}
              ethChange={eth?.change ?? 1.24}
              btcSpark={btc?.sparkline ?? []}
              assets={marketAssets}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2 · MARKET TICKER CARD
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-8 pb-12 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_24px_60px_-26px_rgba(15,23,42,0.20)] overflow-hidden">
            <div className="flex items-stretch">
              <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
                <div className="flex items-stretch divide-x divide-slate-100 min-w-max">
                  {tickerData.map((a) => {
                    const color = CRYPTO_COLORS[a.symbol] ?? "#2B6BFF";
                    const up = a.change >= 0;
                    return (
                      <div
                        key={a.symbol}
                        className="flex items-center gap-3 px-5 py-4 text-[12.5px] tabular-nums whitespace-nowrap hover:bg-[#F7FAFF] transition-colors"
                      >
                        <span
                          className="w-7 h-7 rounded-full inline-flex items-center justify-center text-[10px] font-black flex-shrink-0"
                          style={{ background: `${color}1F`, border: `1px solid ${color}55`, color }}
                        >
                          {a.symbol.slice(0, 1)}
                        </span>
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
              <div className="flex items-center px-3 sm:px-4 border-l border-slate-100 flex-shrink-0">
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
          3 · WHY TRADERS CHOOSE US
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <Eyebrow>Why Us</Eyebrow>
            <h2 className="text-[30px] sm:text-[38px] font-bold text-[#0A1A3A] tracking-tight">
              Why Traders Choose Us
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-12 rounded-full bg-[#2B6BFF]" />
            <p className="mx-auto mt-5 text-[14.5px] text-slate-600 max-w-[640px] leading-[1.6]">
              Built for serious traders. Designed for everyone. Backed by world-class
              security and transparent operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valueProps.map((v) => (
              <div
                key={v.title}
                className="group relative bg-white rounded-2xl border border-slate-200 p-7 text-center transition-all duration-300 hover:border-[#2B6BFF] hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(43,107,255,0.35)] flex flex-col"
              >
                <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-[#2B6BFF]/12 inline-flex items-center justify-center mb-5 transition-colors duration-300">
                  <v.icon className="h-6 w-6 text-[#2B6BFF]" strokeWidth={2} />
                </div>
                <h3 className="text-[16px] font-semibold text-[#0A1A3A] mb-2">{v.title}</h3>
                <p className="text-[13px] text-slate-600 leading-[1.6] flex-1">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          4 · STATS — premium wide card with subtle pattern
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="relative bg-white rounded-3xl border border-slate-200 shadow-[0_30px_70px_-32px_rgba(15,23,42,0.18)] py-12 px-6 sm:px-12 overflow-hidden"
          >
            {/* Subtle grid pattern background — refined, not childish */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(43,107,255,0.05) 1px, transparent 1px)," +
                  "linear-gradient(90deg, rgba(43,107,255,0.05) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
                maskImage:
                  "radial-gradient(70% 70% at 50% 50%, black 0%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(70% 70% at 50% 50%, black 0%, transparent 100%)",
              }}
            />
            {/* Soft tint */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 80% at 50% 0%, rgba(43,107,255,0.06), transparent 60%)",
              }}
            />

            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0 lg:divide-x lg:divide-slate-200">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center text-center px-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#2B6BFF]/10 inline-flex items-center justify-center flex-shrink-0 mb-4">
                    <s.icon className="h-6 w-6 text-[#2B6BFF]" strokeWidth={2} />
                  </div>
                  <div className="text-[28px] sm:text-[34px] font-bold text-[#0A1A3A] tabular-nums leading-none">
                    {s.value}
                  </div>
                  <div className="text-[13px] text-slate-600 mt-2">{s.label}</div>
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
        className="px-4 sm:px-6 lg:px-8 py-24 bg-[#F7FAFF] scroll-mt-24"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="text-[30px] sm:text-[38px] font-bold text-[#0A1A3A] tracking-tight">
              Start Your Journey in 3 Simple Steps
            </h2>
            <p className="mx-auto mt-5 text-[14.5px] text-slate-600 max-w-[600px] leading-[1.6]">
              From sign-up to your first trade — a clear, monitored process from start to finish.
            </p>
          </div>

          <div className="relative">
            {/* Desktop dashed connector */}
            <div
              aria-hidden
              className="hidden lg:block absolute top-[44px] left-[16%] right-[16%] h-px"
              style={{
                background: "linear-gradient(90deg, transparent, #2B6BFF55 12%, #2B6BFF55 88%, transparent)",
                backgroundSize: "100% 100%",
              }}
            />
            <div className="hidden lg:block absolute top-[42px] left-[16%] right-[16%] h-[5px] -translate-y-1/2 border-t-[1.5px] border-dashed border-[#2B6BFF]/30" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-x-8 relative">
              {steps.map((s, i) => (
                <Fragment key={s.n}>
                  <div className="flex flex-col items-center text-center px-2">
                    {/* Numbered circle with icon */}
                    <div className="relative mb-6">
                      <div
                        className="w-[88px] h-[88px] rounded-full bg-white border-2 border-[#2B6BFF]/15 inline-flex items-center justify-center"
                        style={{ boxShadow: "0 18px 40px -18px rgba(43,107,255,0.30)" }}
                      >
                        <div className="w-[64px] h-[64px] rounded-full bg-[#2B6BFF] inline-flex items-center justify-center">
                          <s.icon className="h-6 w-6 text-white" strokeWidth={2} />
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#0A1A3A] text-white text-[12px] font-bold inline-flex items-center justify-center">
                        {s.n}
                      </div>
                    </div>
                    <h3 className="text-[18px] font-semibold text-[#0A1A3A] mb-2">{s.title}</h3>
                    <p className="text-[13.5px] text-slate-600 leading-[1.6] max-w-[280px]">{s.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden absolute" aria-hidden />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          6 · FINAL CTA
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="relative rounded-3xl px-7 sm:px-14 py-14 sm:py-20 overflow-hidden border border-[#DCE6FA]"
            style={{
              background:
                "linear-gradient(135deg, #EAF2FF 0%, #F4F8FF 50%, #FFFFFF 100%)",
              boxShadow: "0 30px 80px -36px rgba(43,107,255,0.30)",
            }}
          >
            {/* Subtle grid */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(43,107,255,0.06) 1px, transparent 1px)," +
                  "linear-gradient(90deg, rgba(43,107,255,0.06) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                maskImage:
                  "radial-gradient(60% 70% at 100% 50%, black, transparent 90%)",
                WebkitMaskImage:
                  "radial-gradient(60% 70% at 100% 50%, black, transparent 90%)",
              }}
            />
            {/* Soft glow */}
            <div
              aria-hidden
              className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(43,107,255,0.15), transparent 60%)" }}
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-10 items-center">
              <div className="min-w-0">
                <Eyebrow>Get Started Today</Eyebrow>
                <h2 className="text-[30px] sm:text-[42px] lg:text-[48px] font-bold text-[#0A1A3A] tracking-tight leading-[1.05]">
                  Ready to Trade Smarter?
                </h2>
                <p className="mt-5 text-[14.5px] sm:text-[16px] text-slate-600 max-w-[480px] leading-[1.65]">
                  Join thousands of traders already using Secure Chain Markets
                  to trade and invest in digital assets.
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
                    Create Your Account <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/markets"
                    className="inline-flex items-center justify-center h-12 px-7 rounded-md text-[14px] font-semibold text-[#0A1A3A] bg-white border border-[#0A1A3A]/15 hover:border-[#2B6BFF] hover:text-[#2B6BFF] transition-colors"
                  >
                    Explore Markets
                  </Link>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-600" /> Bank-grade security</span>
                  <span className="inline-flex items-center gap-1.5"><BadgeCheck size={13} className="text-emerald-600" /> Regulated platform</span>
                  <span className="inline-flex items-center gap-1.5"><Headphones size={13} className="text-emerald-600" /> 24/7 expert support</span>
                </div>
              </div>

              <div className="relative min-h-[320px] flex items-center justify-center">
                <CtaPhoneVisual btcPrice={btc?.price ?? 63321.25} />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HERO MOCKUP — Premium laptop + floating phone, real fintech feel
   ══════════════════════════════════════════════════════════════════════ */
function HeroMockup({
  btcPrice, btcChange, ethPrice, ethChange, btcSpark, assets,
}: {
  btcPrice: number;
  btcChange: number;
  ethPrice: number;
  ethChange: number;
  btcSpark: number[];
  assets: import("@/lib/coingecko").MarketAsset[];
}) {
  const watchlist = assets.slice(0, 5);
  const sparkPath = sparklinePath(btcSpark);

  return (
    <div className="relative w-full">
      {/* Ambient glow behind laptop */}
      <div
        aria-hidden
        className="absolute -inset-6 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(43,107,255,0.18), transparent 70%)",
        }}
      />

      {/* Laptop */}
      <div className="relative w-full">
        {/* Top bezel */}
        <div className="rounded-t-2xl bg-[#0F1729] h-3 mx-[3%] relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#1F2A3F]" />
        </div>
        {/* Screen body */}
        <div
          className="rounded-b-md border-x border-b border-[#0F1729]/40 bg-white overflow-hidden"
          style={{ boxShadow: "0 30px 70px -28px rgba(15,23,42,0.45), 0 8px 18px -8px rgba(15,23,42,0.18)" }}
        >
          <DashboardScreen
            btcPrice={btcPrice}
            btcChange={btcChange}
            ethPrice={ethPrice}
            ethChange={ethChange}
            sparkPath={sparkPath}
            watchlist={watchlist}
          />
        </div>
        {/* Hinge / base */}
        <div
          className="h-[14px] -mx-[6%] rounded-b-[16px]"
          style={{
            background:
              "linear-gradient(180deg, #C7CFD9 0%, #94A0B0 55%, #6E7886 100%)",
          }}
        />
        <div className="mx-auto -mt-[11px] h-[7px] w-[28%] rounded-b-md bg-[#5E6878]" />
      </div>

      {/* Floating phone */}
      <div className="hidden sm:block absolute right-2 lg:right-0 bottom-[-36px] w-[28%] max-w-[195px]">
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
  ethPrice?:  number;
  ethChange?: number;
  sparkPath: { line: string; area: string } | null;
  watchlist: import("@/lib/coingecko").MarketAsset[];
}) {
  const up = btcChange >= 0;
  return (
    <div className="bg-[#FBFCFE] text-[10.5px]">
      {/* Window chrome */}
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

      <div className="grid grid-cols-[44px_1fr]">
        {/* Sidebar */}
        <div className="bg-white border-r border-slate-100 py-3 flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[#2B6BFF] inline-flex items-center justify-center">
            <ShieldCheck className="h-3.5 w-3.5 text-white" strokeWidth={2.4} />
          </div>
          <div className="w-px h-2 bg-slate-100" />
          {[BarChart3, Wallet, Activity, Users, Globe].map((Icon, i) => (
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

        {/* Main */}
        <div className="p-3.5 sm:p-4">
          {/* Top bar: search + bell + avatar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[12px] font-bold text-[#0A1A3A]">Dashboard</span>
              <span className="hidden sm:inline text-[9px] text-slate-400">/ Markets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 h-6 rounded bg-slate-100 px-2 text-[9px] text-slate-500">
                <Search size={9} /> Search
              </div>
              <div className="w-6 h-6 rounded bg-slate-100 inline-flex items-center justify-center">
                <Bell size={10} className="text-slate-500" />
              </div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2B6BFF] to-[#1A4FCC]" />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_148px] gap-3">
            {/* Chart panel */}
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[8px] font-black"
                    style={{ background: "#F7931A1F", border: "1px solid #F7931A55", color: "#F7931A" }}
                  >B</span>
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

              {/* Timeframe pills */}
              <div className="flex items-center gap-1 mb-2">
                {["1H","4H","1D","1W","1M"].map((t, i) => (
                  <span
                    key={t}
                    className={`px-1.5 py-0.5 rounded text-[8.5px] font-semibold ${
                      i === 2 ? "bg-[#2B6BFF]/10 text-[#2B6BFF]" : "text-slate-400"
                    }`}
                  >{t}</span>
                ))}
                <div className="ml-auto text-[8.5px] text-slate-400">Candle</div>
              </div>

              {/* Chart */}
              <div className="relative h-[110px]">
                <svg viewBox="0 0 320 110" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor="#2B6BFF" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#2B6BFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Y grid */}
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
                {/* Y-axis labels */}
                <div className="absolute right-1 top-0 flex flex-col justify-between h-full text-[7.5px] text-slate-400 tabular-nums font-semibold py-1">
                  <span>{formatCurrency(btcPrice * 1.015)}</span>
                  <span>{formatCurrency(btcPrice * 1.005)}</span>
                  <span>{formatCurrency(btcPrice * 0.99)}</span>
                </div>
              </div>

              {/* Mini stats below chart */}
              <div className="grid grid-cols-4 gap-1.5 mt-2.5">
                {[
                  { l: "24h High",  v: formatCurrency(btcPrice * 1.012) },
                  { l: "24h Low",   v: formatCurrency(btcPrice * 0.988) },
                  { l: "24h Vol",   v: "$1.46B" },
                  { l: "Active",    v: "12" },
                ].map((c) => (
                  <div key={c.l} className="rounded bg-slate-50 px-1.5 py-1.5">
                    <div className="text-[7.5px] text-slate-400 uppercase tracking-wider truncate">{c.l}</div>
                    <div className="text-[9.5px] font-semibold text-[#0A1A3A] tabular-nums truncate">{c.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Watchlist + portfolio */}
            <div className="space-y-2">
              <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Watchlist</div>
                  <Search size={9} className="text-slate-400" />
                </div>
                <ul className="space-y-1.5">
                  {watchlist.map((a) => {
                    const color = CRYPTO_COLORS[a.symbol] ?? "#2B6BFF";
                    const isUp = a.change >= 0;
                    return (
                      <li key={a.symbol} className="flex items-center justify-between text-[9.5px]">
                        <span className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[6.5px] font-black flex-shrink-0"
                            style={{ background: `${color}26`, color }}
                          >
                            {a.symbol.slice(0, 1)}
                          </span>
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
      {/* Dynamic island */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[36%] h-1.5 rounded-full bg-black z-10" />
      <div className="rounded-[20px] bg-white overflow-hidden p-3 pt-5">
        <div className="text-[8px] text-slate-400 font-semibold tracking-wider mb-0.5">PORTFOLIO</div>
        <div className="text-[14px] font-bold text-[#0A1A3A] tabular-nums leading-none">$87,650.18</div>
        <div className={`text-[8px] mt-0.5 font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
          {up ? "+" : ""}{btcChange.toFixed(2)}% · {formatCurrency(btcPrice)}
        </div>

        {/* Mini chart */}
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
            { s: "BTC", c: "#F7931A", chg: "+2.45" },
            { s: "ETH", c: "#627EEA", chg: "+1.24" },
            { s: "SOL", c: "#9945FF", chg: "+3.82" },
          ].map((i) => (
            <li key={i.s} className="flex items-center justify-between text-[9px]">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[6.5px] font-black"
                  style={{ background: `${i.c}26`, color: i.c }}>{i.s.slice(0,1)}</span>
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

/* ── CTA visual: refined phone (no toy coin badges) ─────────────────── */
function CtaPhoneVisual({ btcPrice }: { btcPrice: number }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center py-4">
      {/* Soft halo */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(43,107,255,0.15), transparent 70%)",
        }}
      />

      <div className="relative w-[230px]">
        {/* Backing card silhouette to add depth */}
        <div
          aria-hidden
          className="absolute -right-5 top-6 w-[200px] h-[300px] rounded-[24px] bg-white/70 border border-[#DCE6FA]"
          style={{ boxShadow: "0 30px 60px -28px rgba(15,23,42,0.20)" }}
        />
        {/* Phone */}
        <div
          className="relative rounded-[28px] bg-[#0A1A3A] p-1.5 border border-slate-700"
          style={{
            boxShadow: "0 35px 70px -22px rgba(15,23,42,0.50)",
          }}
        >
          <div className="absolute left-1/2 -translate-x-1/2 top-3 w-[40%] h-1.5 rounded-full bg-black z-10" />
          <div className="rounded-[22px] bg-white overflow-hidden p-4 pt-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] text-slate-400 font-semibold tracking-wider">BTC / USDT</div>
                <div className="text-[20px] font-bold text-[#0A1A3A] tabular-nums leading-none mt-0.5">
                  {formatCurrency(btcPrice)}
                </div>
              </div>
              <span className="px-2 py-1 rounded text-[10px] font-bold text-emerald-700 bg-emerald-50">+2.45%</span>
            </div>

            <svg viewBox="0 0 200 70" className="w-full h-[60px] mt-3">
              <defs>
                <linearGradient id="cta-spark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2B6BFF" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2B6BFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[15, 35, 55].map(y => (
                <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#F1F5F9" strokeWidth="1" />
              ))}
              <path d="M0,55 L20,46 L40,52 L60,38 L80,44 L100,28 L120,34 L140,18 L160,24 L180,10 L200,16" stroke="#2B6BFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0,55 L20,46 L40,52 L60,38 L80,44 L100,28 L120,34 L140,18 L160,24 L180,10 L200,16 L200,70 L0,70 Z" fill="url(#cta-spark)" />
            </svg>

            <div className="grid grid-cols-3 gap-1.5 mt-3">
              {["1H","1D","1W"].map((t, i) => (
                <div key={t} className={`h-7 rounded text-[10px] font-semibold inline-flex items-center justify-center ${i === 1 ? "bg-[#2B6BFF]/10 text-[#2B6BFF]" : "text-slate-500 bg-slate-50"}`}>{t}</div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="h-9 rounded-md text-[12px] font-bold text-white bg-emerald-500 inline-flex items-center justify-center">Buy</div>
              <div className="h-9 rounded-md text-[12px] font-bold text-white bg-rose-500 inline-flex items-center justify-center">Sell</div>
            </div>
          </div>
        </div>
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
