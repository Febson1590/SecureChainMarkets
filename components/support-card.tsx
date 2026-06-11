import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CONTACT } from "@/lib/company";

/**
 * The single, canonical "Contact Support" surface. Replaces every
 * contact/support form in the product — no fields, just a clean card
 * that opens the user's email client addressed to the support inbox.
 */
export function SupportCard() {
  return (
    <Card className="glass-card border-0 rounded-xl p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#2B6BFF]/12 border border-[#2B6BFF]/25 flex items-center justify-center mx-auto mb-5">
        <Mail className="h-6 w-6 text-[#2B6BFF]" />
      </div>
      <h2 className="text-lg font-bold text-white mb-2">Contact Support</h2>
      <p className="text-[13.5px] text-slate-400 leading-relaxed max-w-sm mx-auto mb-6">
        Need help? Email our support team and we will respond as soon as possible.
      </p>
      <a
        href={`mailto:${CONTACT.supportEmail}`}
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[260px] h-12 px-8 rounded-xl bg-[#2B6BFF] hover:brightness-110 text-white font-semibold text-[14px] transition-all"
        style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 8px 22px rgba(43,107,255,0.30)" }}
      >
        <Mail size={16} /> Email Support
      </a>
      <p className="text-[11.5px] text-slate-500 mt-4">
        {CONTACT.supportEmail}
      </p>
    </Card>
  );
}
