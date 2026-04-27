import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trading Considerations" };

export default function RiskPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 hero-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#d4a857]/12 text-[#d4a857] border-[#d4a857]/20 text-xs tracking-widest uppercase">
            Trade Informed
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-3">Trading Considerations</h1>
          <p className="text-sm text-slate-500">A quick overview of how digital-asset markets behave so you can plan with confidence.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-6 border border-[#d4a857]/20 bg-[#d4a857]/[0.06] flex items-start gap-4">
          <AlertTriangle className="h-5 w-5 text-[#d4a857] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300 leading-relaxed">
            Digital-asset markets are dynamic — prices move quickly and conditions change. Take a moment
            to understand the points below so you can size your positions in a way that fits your goals.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-6 text-sm text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Market movement</h2>
            <p>
              The value of digital assets can change throughout the day. Prices respond to supply,
              demand, news, regulation, and broader economic events. Reviewing your strategy regularly
              helps you stay aligned with current conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Liquidity</h2>
            <p>
              Some assets trade with thinner liquidity than others, which can mean slightly wider
              spreads or fills on larger orders. Splitting orders or using limit pricing is often the
              cleanest way to manage this.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Technology &amp; networks</h2>
            <p>
              The platform relies on internet connectivity, third-party infrastructure, and blockchain
              networks. Temporary congestion or outages on those external services can occasionally
              delay orders, deposits, or withdrawals. We monitor continuously and keep you informed
              when conditions affect timing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Regulation</h2>
            <p>
              Digital-asset rules continue to evolve and vary by jurisdiction. Updates to law,
              taxation, or regional licensing can change which assets or features are available to
              you. We adapt the platform as the landscape develops.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Account security</h2>
            <p>
              We protect your account on our side with encryption, two-factor sign-in, and activity
              monitoring. On your side, the most important step is keeping your password and
              one-time codes private — SecureChainMarkets staff will never ask for either.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Educational content</h2>
            <p>
              Anything you read on the platform is informational, not personalised advice. If you
              would like advice tailored to your situation, a qualified professional in your country
              is the right place to start.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Trade with confidence</h2>
            <p>
              By using SecureChainMarkets, you confirm that you have reviewed these considerations and
              are comfortable making your own trading decisions. We&rsquo;re here to support you with
              the tools and information to do that well.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
