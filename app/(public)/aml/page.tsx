import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "AML Policy" };

export default function AmlPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 hero-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#D4AF37]/12 text-[#D4AF37] border-[#D4AF37]/20 text-xs tracking-widest uppercase">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-3">Anti-Money Laundering (AML) Policy</h1>
          <p className="text-sm text-slate-600">Last updated: April 2026</p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-6 text-sm text-slate-500 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Purpose</h2>
            <p>
              VorateTrade is committed to preventing the use of its platform for money
              laundering, terrorist financing, sanctions evasion, fraud, or any other financial
              crime. This policy summarises the controls we operate to detect and deter such
              activity, and the obligations placed on every account holder.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Customer Identification (KYC)</h2>
            <p className="mb-2">
              Identity verification is required before any account can be funded or used to place
              an order. Submissions go through manual review by our compliance team. We collect:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Government-issued photo identification (passport, national ID, or driver&rsquo;s licence).</li>
              <li>A short live selfie matched against the submitted ID.</li>
              <li>Country of residence and contact details.</li>
              <li>Where applicable, source-of-funds documentation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Risk-Based Approach</h2>
            <p>
              Each account is risk-scored at onboarding and continuously thereafter, based on
              jurisdiction, transaction volume and pattern, asset mix, and counterparty exposure.
              Higher-risk accounts are subject to enhanced due diligence, transaction limits, and
              additional documentation requests.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Transaction Monitoring</h2>
            <p>
              All deposits, withdrawals, trades, and copy-trade activity are logged with
              timestamps and reviewed against rule-based and behavioural triggers including but
              not limited to: rapid in-and-out transfers, structuring, mismatch with stated
              source of funds, transactions involving sanctioned jurisdictions, and unusual
              changes in trading behaviour.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Sanctions and Prohibited Persons</h2>
            <p>
              We screen every applicant and ongoing account against international sanctions
              lists (including OFAC, UN, EU, UK HMT) and politically-exposed-persons (PEP)
              registers. Accounts matching these lists are rejected or restricted, and
              suspicious matches are reported to the relevant authority.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Suspicious Activity Reporting</h2>
            <p>
              Where activity raises reasonable suspicion of money laundering or terrorist
              financing, our compliance team will file a Suspicious Activity Report (SAR) with
              the appropriate financial-intelligence unit and may freeze the underlying account
              pending review. Account holders will not be tipped off about the existence or
              content of any such report, in line with applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Record Keeping</h2>
            <p>
              KYC records, transaction histories, and supporting documents are retained for
              the period required by applicable regulation — typically a minimum of five years
              after account closure or the date of the relevant transaction, whichever is later.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Account Holder Obligations</h2>
            <p>
              By using VorateTrade you agree to provide accurate and current
              identification information, to respond promptly to compliance requests, and to
              use the platform only for lawful purposes. Providing false information,
              attempting to circumvent our controls, or engaging in any prohibited activity
              will result in account closure and may be reported to authorities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">9. Updates to this Policy</h2>
            <p>
              This policy is reviewed regularly and updated to reflect changes in regulation
              and our internal controls. Continued use of the platform after a material change
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">10. Contact</h2>
            <p>
              For AML, sanctions, or compliance questions, contact our team via the
              {" "}
              <a href="/contact" className="text-[#D4AF37] hover:text-[#E6C158]">support page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
