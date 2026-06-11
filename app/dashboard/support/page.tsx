"use client";

import { SupportCard } from "@/components/support-card";
import { HeadphonesIcon, CheckCircle2 } from "lucide-react";

export default function SupportPage() {
  const faqs = [
    { q: "How long does verification take?", a: "Identity verification typically takes 1–3 business days." },
    { q: "When will my deposit be credited?", a: "Deposits are reviewed and credited within 24 hours after approval." },
    { q: "How do I place a trade?", a: "Navigate to the Trade section, select an asset, choose BUY or SELL, enter your quantity and submit." },
    { q: "Can I withdraw my funds?", a: "Yes. Submit a withdrawal request and our team will process it within 1–5 business days." },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Support Center</h1>
        <p className="text-sm text-slate-500 mt-0.5">Get help from our team anytime</p>
      </div>

      <div className="space-y-5">
        {/* Quick help */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#2B6BFF]/12 border border-[#2B6BFF]/20 flex items-center justify-center">
              <HeadphonesIcon className="h-5 w-5 text-[#2B6BFF]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">24/7 Support Available</div>
              <div className="text-xs text-slate-500">Average response time: under 4 hours</div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-3 py-2 rounded-lg">
              <CheckCircle2 size={12} className="text-emerald-400" /> Email Support
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-3 py-2 rounded-lg">
              <CheckCircle2 size={12} className="text-emerald-400" /> Fast Response
            </div>
          </div>
        </div>

        {/* Contact Support card — the only contact path */}
        <SupportCard />

        {/* FAQ */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-white/5">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-5">
                <div className="text-sm font-medium text-white mb-1.5">{faq.q}</div>
                <div className="text-sm text-slate-400">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
