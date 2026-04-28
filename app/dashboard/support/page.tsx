"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSupportTicket } from "@/lib/actions/support";
import { getStatusBg } from "@/lib/utils";
import { HeadphonesIcon, Plus, CheckCircle2, Clock, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1),
  message: z.string().min(20, "Message must be at least 20 characters"),
  priority: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const categories = ["General", "Trading", "Deposits", "Withdrawals", "Verification", "Account", "Technical", "Other"];

export default function SupportPage() {
  const [view, setView] = useState<"list" | "new">("list");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: "General", priority: "MEDIUM" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await createSupportTicket(data);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Support ticket created!");
        reset();
        setView("list");
      }
    } catch { toast.error("Failed to create ticket."); }
    finally { setLoading(false); }
  };

  const faqs = [
    { q: "How long does verification take?", a: "Identity verification typically takes 1–3 business days." },
    { q: "When will my deposit be credited?", a: "Deposits are reviewed and credited within 24 hours after approval." },
    { q: "How do I place a trade?", a: "Navigate to the Trade section, select an asset, choose BUY or SELL, enter your quantity and submit." },
    { q: "Can I withdraw my funds?", a: "Yes. Submit a withdrawal request and our team will process it within 1–5 business days." },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Support Center</h1>
          <p className="text-sm text-slate-500 mt-0.5">Get help from our team anytime</p>
        </div>
        <Button
          onClick={() => setView(view === "new" ? "list" : "new")}
          size="sm"
          className="bg-[#2B6BFF] hover:bg-[#2B6BFF] text-white text-xs"
        >
          {view === "new" ? "← Back" : <><Plus size={13} className="mr-1" /> New Ticket</>}
        </Button>
      </div>

      {view === "new" ? (
        <Card className="glass-card border-0 rounded-xl p-6">
          <h2 className="text-base font-semibold text-[#0F172A] mb-5">Open a New Ticket</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#64748B] uppercase tracking-widest">Category</Label>
              <Select defaultValue="General" onValueChange={(v) => v !== null && setValue("category", v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-[#0F172A] h-10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-[#2B6BFF]/20 text-[#0F172A]">
                  {categories.map((c) => (
                    <SelectItem key={c} value={c} className="hover:bg-[#2B6BFF]/12 focus:bg-[#2B6BFF]/12">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#64748B] uppercase tracking-widest">Subject</Label>
              <Input {...register("subject")} placeholder="Brief description of your issue" className="bg-white/5 border-white/10 text-[#0F172A] placeholder:text-slate-600 h-10" />
              {errors.subject && <p className="text-xs text-red-400">{errors.subject.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#64748B] uppercase tracking-widest">Priority</Label>
              <Select defaultValue="MEDIUM" onValueChange={(v) => v !== null && setValue("priority", v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-[#0F172A] h-10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white border-[#2B6BFF]/20 text-[#0F172A]">
                  {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                    <SelectItem key={p} value={p} className="hover:bg-[#2B6BFF]/12 focus:bg-[#2B6BFF]/12">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#64748B] uppercase tracking-widest">Message</Label>
              <Textarea {...register("message")} rows={6} placeholder="Describe your issue in detail..." className="bg-white/5 border-white/10 text-[#0F172A] placeholder:text-slate-600 resize-none" />
              {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#2B6BFF] hover:bg-[#2B6BFF] text-white font-semibold h-11">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Ticket"}
            </Button>
          </form>
        </Card>
      ) : (
        <div className="space-y-5">
          {/* Quick help */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#2B6BFF]/12 border border-[#2B6BFF]/20 flex items-center justify-center">
                <HeadphonesIcon className="h-5 w-5 text-[#2B6BFF]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#0F172A]">24/7 Support Available</div>
                <div className="text-xs text-slate-500">Average response time: under 4 hours</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-xs text-[#64748B] bg-white/5 px-3 py-2 rounded-lg">
                <CheckCircle2 size={12} className="text-emerald-400" /> Email Support
              </div>
              <div className="flex items-center gap-2 text-xs text-[#64748B] bg-white/5 px-3 py-2 rounded-lg">
                <CheckCircle2 size={12} className="text-emerald-400" /> Ticket System
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h2 className="text-sm font-semibold text-[#0F172A]">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-white/5">
              {faqs.map((faq) => (
                <div key={faq.q} className="p-5">
                  <div className="text-sm font-medium text-[#0F172A] mb-1.5">{faq.q}</div>
                  <div className="text-sm text-[#64748B]">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-500 mb-3">Can't find what you're looking for?</p>
            <Button onClick={() => setView("new")} size="sm" className="bg-[#2B6BFF] hover:bg-[#2B6BFF] text-white">
              <MessageSquare size={13} className="mr-1" /> Open a Support Ticket
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
