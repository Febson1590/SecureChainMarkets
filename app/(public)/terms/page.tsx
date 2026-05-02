import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 hero-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#D4AF37]/12 text-[#D4AF37] border-[#D4AF37]/20 text-xs tracking-widest uppercase">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-sm text-slate-600">Last updated: April 2026</p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-6 text-sm text-slate-500 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h2>
            <p>
              By creating a VorateTrade account or using any part of the platform, you agree to
              these Terms of Service, our Privacy Policy, and our Trading Considerations. If you do
              not agree with any part of these terms, you must not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Eligibility</h2>
            <p>
              You must be at least 18 years old and legally able to enter into binding contracts in your
              jurisdiction to open an account. You are responsible for ensuring that the use of digital
              asset services is permitted in the country or region where you reside.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Account Registration &amp; Verification</h2>
            <p>
              You agree to provide accurate, current, and complete information during registration and
              to keep it updated. VorateTrade may require identity verification (KYC) before unlocking
              deposits, withdrawals, or higher trading limits. We may suspend or close accounts that
              provide false information or fail verification.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Trading &amp; Orders</h2>
            <p>
              Trades executed on VorateTrade are final once confirmed. Prices and market data are
              provided for informational purposes and may differ from execution prices due to market
              movement. You are solely responsible for reviewing each order before confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Deposits &amp; Withdrawals</h2>
            <p>
              Deposits and withdrawals go through a verification step before processing. Processing
              times vary based on method, compliance checks, and network conditions. VorateTrade
              is not responsible for losses caused by incorrect wallet addresses or third-party network
              issues.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Prohibited Activities</h2>
            <p>
              You agree not to use VorateTrade for any unlawful activity, including money laundering,
              fraud, market manipulation, financing of illegal activities, or sanctioned-party transactions.
              Accounts engaging in prohibited activity will be suspended and reported as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Fees</h2>
            <p>
              Current trading fees are shown on the order confirmation before you submit, and the
              full schedule is visible inside the dashboard.
              Fees may be updated from time to time, and continued use of the platform after a fee change
              constitutes acceptance of the updated fees.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Limitation of Liability</h2>
            <p>
              VorateTrade is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. To the
              maximum extent permitted by law, we shall not be liable for any indirect, incidental, or
              consequential loss arising from platform downtime, market volatility, third-party service
              failures, or user error.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">9. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Material changes will be communicated
              through the platform or via email. Continued use of the service after an update constitutes
              your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">10. Contact</h2>
            <p>
              Questions about these terms can be sent to{" "}
              <a href="mailto:support@VorateTrade.com" className="text-[#D4AF37] hover:text-[#E6C158]">
                support@VorateTrade.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
