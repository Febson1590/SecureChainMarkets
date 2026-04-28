"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { processWithdrawalRequest } from "@/lib/actions/admin";
import { formatCurrency, formatDateTime, getStatusBg } from "@/lib/utils";
import { CheckCircle2, XCircle, Clock, Loader2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

interface AdminWithdrawal {
  id:            string;
  userId:        string;
  currency:      string;
  amount:        string | number;
  method:        string;
  destination:   string | null;
  status:        "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING";
  cryptoAmount:  string | number | null;
  cryptoSymbol:  string | null;
  cryptoNetwork: string | null;
  exchangeRate:  string | number | null;
  createdAt:     string;
  processedAt:   string | null;
  user:          { id: string; name: string | null; email: string } | null;
}

function shortAddress(addr: string, head = 10, tail = 5): string {
  if (!addr) return "";
  if (addr.length <= head + tail + 3) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  // Reject flow opens a small modal to collect the required reason —
  // the server action rejects the call outright if notes is empty.
  const [rejectTarget, setRejectTarget] = useState<AdminWithdrawal | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchWithdrawals = () => {
    setLoading(true);
    fetch("/api/admin/withdrawals")
      .then((r) => r.json())
      .then((data) => setWithdrawals(Array.isArray(data) ? data : []))
      .catch(() => setWithdrawals([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWithdrawals(); }, []);

  const approve = async (id: string) => {
    setProcessing(id);
    const result = await processWithdrawalRequest(id, "APPROVE");
    if (result?.success) { toast.success("Withdrawal approved"); fetchWithdrawals(); }
    else toast.error(result?.error || "Failed");
    setProcessing(null);
  };

  const submitReject = async () => {
    if (!rejectTarget) return;
    const reason = rejectReason.trim();
    if (!reason) { toast.error("Please enter a rejection reason"); return; }
    setProcessing(rejectTarget.id);
    const result = await processWithdrawalRequest(rejectTarget.id, "REJECT", reason);
    if (result?.success) {
      toast.success("Withdrawal rejected");
      setRejectTarget(null);
      setRejectReason("");
      fetchWithdrawals();
    } else {
      toast.error(result?.error || "Failed");
    }
    setProcessing(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Withdrawal Requests</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Review and process user withdrawal requests</p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <Clock className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-semibold text-[#0F172A]">
            {withdrawals.filter((w) => w.status === "PENDING").length} Pending
          </span>
          <span className="text-xs text-[#64748B] ml-2">— {withdrawals.length} total</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#64748B] text-sm">Loading...</div>
        ) : withdrawals.length === 0 ? (
          <div className="p-12 text-center text-[#64748B] text-sm">No withdrawal requests yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full premium-table">
              <thead>
                <tr className="border-b border-white/5">
                  {["User", "Amount", "Coin / Network", "Destination", "Date", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-[#64748B] px-4 py-3 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-white/5 hover:bg-[#F6FAFF] align-top">
                    <td className="px-4 py-3">
                      <div className="text-sm text-[#0F172A]">{w.user?.name}</div>
                      <div className="text-xs text-[#64748B]">{w.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#0F172A] tabular-nums">
                        {formatCurrency(Number(w.amount))}
                      </div>
                      {w.cryptoAmount !== null && w.cryptoSymbol && (
                        <div className="text-[10.5px] text-[#64748B] tabular-nums mt-0.5">
                          {Number(w.cryptoAmount).toLocaleString("en-US", { maximumFractionDigits: 8 })} {w.cryptoSymbol}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-[#0F172A] font-semibold">{w.cryptoSymbol || w.currency}</div>
                      <div className="text-[11px] text-[#64748B]">
                        {w.cryptoNetwork || w.method || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#0F172A] max-w-[180px] truncate font-mono" title={w.destination ?? undefined}>
                      {w.destination ? shortAddress(w.destination, 12, 5) : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#64748B] whitespace-nowrap">
                      {formatDateTime(w.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusBg(w.status)}`}>{w.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {w.status === "PENDING" && (
                        <div className="flex gap-1.5">
                          <Button size="sm" disabled={!!processing} onClick={() => approve(w.id)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 h-7 px-2 text-xs">
                            {processing === w.id ? <Loader2 size={11} className="animate-spin" /> : <><CheckCircle2 size={11} className="mr-1" />Approve</>}
                          </Button>
                          <Button size="sm" disabled={!!processing} onClick={() => { setRejectTarget(w); setRejectReason(""); }}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 h-7 px-2 text-xs">
                            <XCircle size={11} className="mr-1" />Reject
                          </Button>
                        </div>
                      )}
                      {w.status !== "PENDING" && (
                        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                          <ArrowUpRight size={12} />
                          <span>{w.processedAt ? formatDateTime(w.processedAt) : "—"}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Reject reason modal ─────────────────────────────────── */}
      {rejectTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => processing ? null : setRejectTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#FFFFFF] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold text-[#0F172A]">Reject withdrawal</h2>
            <p className="text-xs text-[#64748B] mt-1">
              {rejectTarget.user?.email} · {formatCurrency(Number(rejectTarget.amount))}
            </p>
            <p className="text-[12.5px] text-[#64748B] mt-3">
              This reason is shown to the user in their notification and email.
            </p>
            <textarea
              autoFocus
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Destination address didn't match verified wallet on file."
              rows={4}
              className="mt-2 w-full rounded-xl bg-[#F6FAFF] border border-[#BFD5FF] px-3 py-2.5 text-[13px] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#2B6BFF]/40 resize-none"
            />
            <div className="flex gap-2 mt-4">
              <Button
                disabled={!!processing}
                onClick={() => setRejectTarget(null)}
                className="flex-1 h-10 bg-[#F6FAFF] hover:bg-[#F6FAFF] text-[#0F172A] border border-white/10 font-semibold text-[13px]"
              >
                Cancel
              </Button>
              <Button
                disabled={!!processing || !rejectReason.trim()}
                onClick={submitReject}
                className="flex-1 h-10 bg-red-500 hover:bg-red-400 text-white font-semibold text-[13px] disabled:opacity-50"
              >
                {processing === rejectTarget.id
                  ? <Loader2 size={13} className="animate-spin" />
                  : "Confirm reject"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
