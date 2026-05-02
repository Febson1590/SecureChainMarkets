import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "License & Regulation" };

export default function LicensingPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 hero-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#D4AF37]/12 text-[#D4AF37] border-[#D4AF37]/20 text-xs tracking-widest uppercase">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-3">License &amp; Regulation</h1>
          <p className="text-sm text-slate-600">Last updated: April 2026</p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-6 text-sm text-slate-500 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Operating Entity</h2>
            <p>
              VorateTrade is a digital-asset brokerage platform operated by the company
              of the same name. Where the platform operates a regulated activity in a given
              jurisdiction, it does so through the appropriate licensed entity or licensed
              partner.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Regulatory Framework</h2>
            <p>
              The platform operates in accordance with applicable financial-services and
              digital-asset regulation, including but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Anti-money-laundering and counter-terrorist-financing rules.</li>
              <li>Know-Your-Customer and customer due-diligence requirements.</li>
              <li>Sanctions and embargo screening obligations.</li>
              <li>Consumer-protection and disclosure standards for retail investors.</li>
              <li>Local data-protection regulation (e.g. GDPR where applicable).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Geographic Scope</h2>
            <p>
              Services are offered only in jurisdictions where they are lawful and where
              VorateTrade is permitted to provide them. We do not offer services to
              residents of jurisdictions on our restricted-jurisdictions list, nor to anyone
              listed on applicable sanctions registers. By creating an account you confirm
              that you are eligible to use the platform in your jurisdiction of residence.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Custody and Asset Segregation</h2>
            <p>
              Customer assets are accounted for separately from platform operating funds.
              Where applicable we partner with licensed custodians to hold digital assets in
              cold storage, and we maintain operational controls to ensure that customer
              balances are at all times reconciled with the underlying assets held.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Disclosures and Risk Warnings</h2>
            <p>
              Trading digital assets involves risk and is not suitable for everyone. Prices can
              be volatile and you may lose some or all of the funds you invest. Past
              performance is not a reliable indicator of future results. Before using the
              platform, please review the risk disclosures available at
              {" "}
              <a href="/risk" className="text-[#D4AF37] hover:text-[#E6C158]">/risk</a>
              {" "}and ensure you understand the risks involved.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Conflicts of Interest</h2>
            <p>
              VorateTrade operates a transparent fee model. Trading fees are shown on
              the order confirmation before submission and the full schedule is visible inside
              the dashboard. We do not receive payment for order flow in any way that
              disadvantages a customer&rsquo;s execution price.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Complaints</h2>
            <p>
              If you have a complaint, please contact our support team via the
              {" "}
              <a href="/contact" className="text-[#D4AF37] hover:text-[#E6C158]">support page</a>.
              We acknowledge complaints within two business days and aim to resolve them within
              fifteen business days. Where you remain dissatisfied with our response, you may
              be entitled to escalate the matter to the relevant regulator or alternative
              dispute-resolution scheme in your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Updates</h2>
            <p>
              The licensing and regulatory landscape for digital-asset platforms is evolving.
              We update this page when our authorisations, partners, or regulatory framework
              change materially. Continued use of the platform after such an update
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">9. Related Documents</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><a href="/aml" className="text-[#D4AF37] hover:text-[#E6C158]">Anti-Money Laundering (AML) Policy</a></li>
              <li><a href="/kyc" className="text-[#D4AF37] hover:text-[#E6C158]">Know Your Customer (KYC) Policy</a></li>
              <li><a href="/privacy" className="text-[#D4AF37] hover:text-[#E6C158]">Privacy Policy</a></li>
              <li><a href="/terms" className="text-[#D4AF37] hover:text-[#E6C158]">Terms of Service</a></li>
              <li><a href="/risk" className="text-[#D4AF37] hover:text-[#E6C158]">Risk Disclosure</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
