import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "KYC Policy" };

export default function KycPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 hero-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#2B6BFF]/12 text-[#2B6BFF] border-[#2B6BFF]/20 text-xs tracking-widest uppercase">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-3">Know Your Customer (KYC) Policy</h1>
          <p className="text-sm text-slate-500">Last updated: April 2026</p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-6 text-sm text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Why We Verify</h2>
            <p>
              SecureChainMarkets is required by anti-money-laundering and counter-terrorist-financing
              laws — and by best practice for any regulated digital-asset platform — to know who
              its customers are. Verification protects every account holder on the platform from
              fraud, identity theft, and unauthorised access, and lets us meet our reporting
              obligations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. When Verification is Required</h2>
            <p className="mb-2">
              All accounts must complete identity verification before:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Funding the account with any deposit method.</li>
              <li>Placing live trading orders.</li>
              <li>Withdrawing assets to an external wallet.</li>
              <li>Joining or copying any trader strategy.</li>
            </ul>
            <p className="mt-2">
              Browsing markets, viewing learning material, and configuring an unfunded account
              do not require verification.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. What We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full legal name, date of birth, nationality, and country of residence.</li>
              <li>A government-issued photo ID (passport, national ID, or driver&rsquo;s licence).</li>
              <li>A live selfie used to confirm the ID matches the applicant.</li>
              <li>Where applicable, proof of address (utility bill or bank statement &lt; 3 months old).</li>
              <li>For higher tiers, source-of-funds documentation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. How Submissions are Reviewed</h2>
            <p>
              Submissions are reviewed manually by our compliance team. Most reviews complete
              within one business day, although enhanced due-diligence cases can take longer.
              You will receive an email notification when your verification is approved,
              rejected, or when additional information is requested.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Document Standards</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Documents must be valid and not expired.</li>
              <li>Photos must be in colour, clear, and show all four corners of the document.</li>
              <li>Selfies must show the full face, taken in good lighting, without sunglasses or filters.</li>
              <li>Screenshots, photocopies, and edited images are not accepted.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Ongoing Verification</h2>
            <p>
              Verified status is not permanent. We may ask for refreshed documentation if your
              risk profile changes, if a document approaches expiry, if regulatory rules
              change, or if your account triggers a compliance review. Failure to respond to a
              re-verification request within the timeframe stated in the email will result in
              account restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Rejected Submissions</h2>
            <p>
              If a submission is rejected, you will receive an email explaining the reason. You
              can resubmit with corrected documents. Repeated rejections may result in your
              account being closed. We will not store rejected document copies beyond the
              minimum retention period required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Data Protection</h2>
            <p>
              All identification information is encrypted in transit and at rest. Access is
              restricted to compliance personnel under a strict need-to-know basis. We do not
              sell, rent, or otherwise share KYC data with third parties except as required by
              law or to verified service providers (e.g. identity-verification vendors) acting
              under a confidentiality agreement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">9. Your Rights</h2>
            <p>
              You may request a copy of the personal information we hold about you, ask us to
              correct inaccurate information, or — subject to our regulatory record-retention
              obligations — request that we delete your account. See our
              {" "}
              <a href="/privacy" className="text-[#2B6BFF] hover:text-[#5C8BFF]">Privacy Policy</a>
              {" "}for the full set of rights and the procedure for exercising them.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">10. Contact</h2>
            <p>
              KYC questions and document requests can be sent to our compliance team via the
              {" "}
              <a href="/contact" className="text-[#2B6BFF] hover:text-[#5C8BFF]">support page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
