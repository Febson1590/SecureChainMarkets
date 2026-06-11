"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireApprovedKyc } from "@/lib/kyc";
import { requireActiveStatus } from "@/lib/user-status";
import { notifyAdmin, APP_URL } from "@/lib/notifications";

/** Best-effort lookup of name/email for admin alert summaries. */
async function userSummary(userId: string) {
  const u = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  }).catch(() => null);
  return { name: u?.name ?? "—", email: u?.email ?? userId };
}

/**
 * Step 1 of the deposit flow: user has clicked "I've Sent the Payment".
 *
 * Creates a DepositRequest with `proofUrl: null` — this is the
 * "Awaiting Payment" state. The user still needs to upload proof
 * before the admin can review it.
 */
export async function createDepositRequest(data: {
  currency:      string;
  amount:        number;                  // USD — primary amount
  method:        string;
  walletId?:     string;
  cryptoAmount?: number;                  // Snapshot: crypto amount at submission
  cryptoSymbol?: string;                  // e.g. "BTC"
  cryptoNetwork?: string | null;          // e.g. "TRC20"
  exchangeRate?: number;                  // USD per 1 unit of cryptoSymbol
}) {
  try {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const kycError = await requireApprovedKyc(session.user.id);
  if (kycError) return kycError;

  const statusError = await requireActiveStatus(session.user.id, "deposit");
  if (statusError) return statusError;

  if (!data.amount || data.amount <= 0) return { error: "Enter a valid amount" };

  const request = await db.depositRequest.create({
    data: {
      userId:        session.user.id,
      currency:      data.currency,
      amount:        data.amount,                // USD
      method:        data.method,
      walletId:      data.walletId,
      cryptoAmount:  data.cryptoAmount  ?? null,
      cryptoSymbol:  data.cryptoSymbol  ?? null,
      cryptoNetwork: data.cryptoNetwork ?? null,
      exchangeRate:  data.exchangeRate  ?? null,
      // proofUrl + txHash filled in by submitDepositProof
    },
  });

  const cryptoSuffix = data.cryptoAmount && data.cryptoSymbol
    ? ` (${data.cryptoAmount.toLocaleString("en-US", { maximumFractionDigits: 8 })} ${data.cryptoSymbol})`
    : "";

  await db.notification.create({
    data: {
      userId:  session.user.id,
      title:   "Deposit initiated",
      message: `Awaiting payment of $${data.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD${cryptoSuffix}. Upload proof once you've sent the payment.`,
      type:    "DEPOSIT",
    },
  });

  // Admin heads-up — fire-and-forget.
  userSummary(session.user.id).then((u) =>
    notifyAdmin({
      subject: `New deposit request — $${data.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} from ${u.email}`,
      heading: "New Deposit Request",
      body: ["A user has initiated a deposit. They will upload payment proof next; the request then lands in the review queue."],
      summaryCard: {
        title: "Deposit Details",
        status: "Awaiting Proof",
        statusColor: "warning",
        primary: { label: "Amount", value: `$${data.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD` },
        secondary: data.cryptoAmount && data.cryptoSymbol
          ? { label: "Crypto", value: `${data.cryptoAmount.toLocaleString("en-US", { maximumFractionDigits: 8 })} ${data.cryptoSymbol}` }
          : undefined,
        rows: [
          { label: "User",   value: `${u.name} · ${u.email}` },
          { label: "Method", value: data.method },
        ],
      },
      cta: { label: "Review Deposits", url: `${APP_URL}/admin/deposits` },
    }),
  ).catch(() => {});

  revalidatePath("/dashboard/deposit");
  return { success: true, requestId: request.id };
  } catch (err: any) {
    // Re-throw Next.js control-flow "errors" (redirect/notFound) untouched.
    if (typeof err?.digest === "string" && err.digest.startsWith("NEXT_")) throw err;
    console.error("[createDepositRequest] unexpected error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

/**
 * Step 2 of the deposit flow: user has uploaded proof of payment.
 *
 * Fills in `proofUrl` + optional `txHash` on an existing Awaiting-Payment
 * record. The UI now reads the deposit as "Under Review" because proofUrl
 * is no longer null.
 */
export async function submitDepositProof(data: {
  requestId: string;
  proofUrl:  string;
  txHash?:   string;
}) {
  try {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const existing = await db.depositRequest.findUnique({ where: { id: data.requestId } });
  if (!existing) return { error: "Deposit request not found" };
  if (existing.userId !== session.user.id) return { error: "Not your deposit" };
  if (existing.status !== "PENDING") {
    return { error: "This deposit has already been reviewed" };
  }
  if (!data.proofUrl) return { error: "Proof file is required" };

  await db.depositRequest.update({
    where: { id: data.requestId },
    data: {
      proofUrl: data.proofUrl,
      txHash:   data.txHash,
    },
  });

  const cryptoSuffix = existing.cryptoAmount !== null && existing.cryptoSymbol
    ? ` (${Number(existing.cryptoAmount).toLocaleString("en-US", { maximumFractionDigits: 8 })} ${existing.cryptoSymbol})`
    : "";

  await db.notification.create({
    data: {
      userId:  session.user.id,
      title:   "Deposit under review",
      message: `Your proof for $${Number(existing.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD${cryptoSuffix} has been submitted and is under review by our team.`,
      type:    "DEPOSIT",
    },
  });

  revalidatePath("/dashboard/deposit");
  return { success: true };
  } catch (err: any) {
    // Re-throw Next.js control-flow "errors" (redirect/notFound) untouched.
    if (typeof err?.digest === "string" && err.digest.startsWith("NEXT_")) throw err;
    console.error("[submitDepositProof] unexpected error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

/**
 * Let the user cancel an Awaiting-Payment deposit they haven't uploaded
 * proof for yet (e.g. they changed their mind about sending). Cannot
 * cancel once proof is uploaded — that requires admin review.
 */
export async function cancelDepositRequest(requestId: string) {
  try {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const existing = await db.depositRequest.findUnique({ where: { id: requestId } });
  if (!existing) return { error: "Deposit request not found" };
  if (existing.userId !== session.user.id) return { error: "Not your deposit" };
  if (existing.status !== "PENDING") return { error: "This deposit has already been reviewed" };
  if (existing.proofUrl) return { error: "Proof already uploaded — contact support to cancel" };

  await db.depositRequest.delete({ where: { id: requestId } });
  revalidatePath("/dashboard/deposit");
  return { success: true };
  } catch (err: any) {
    // Re-throw Next.js control-flow "errors" (redirect/notFound) untouched.
    if (typeof err?.digest === "string" && err.digest.startsWith("NEXT_")) throw err;
    console.error("[cancelDepositRequest] unexpected error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

/**
 * Legacy entry point — some code (admin tools, old tests) may still call
 * requestDeposit directly with a full payload. Kept as a one-shot flow that
 * goes straight to Under Review when proofUrl is supplied.
 *
 * @deprecated Prefer createDepositRequest + submitDepositProof.
 */
export async function requestDeposit(data: {
  currency: string;
  amount:   number;
  method:   string;
  proofUrl?: string;
  txHash?:   string;
  walletId?: string;
}) {
  try {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const kycError = await requireApprovedKyc(session.user.id);
  if (kycError) return kycError;

  const statusError = await requireActiveStatus(session.user.id, "deposit");
  if (statusError) return statusError;

  const request = await db.depositRequest.create({
    data: {
      userId:   session.user.id,
      currency: data.currency,
      amount:   data.amount,
      method:   data.method,
      proofUrl: data.proofUrl,
      txHash:   data.txHash,
      walletId: data.walletId,
    },
  });

  await db.notification.create({
    data: {
      userId:  session.user.id,
      title:   "Deposit submitted",
      message: `Your deposit request for ${data.amount} ${data.currency} has been submitted.`,
      type:    "DEPOSIT",
    },
  });

  revalidatePath("/dashboard/deposit");
  return { success: true, requestId: request.id };
  } catch (err: any) {
    // Re-throw Next.js control-flow "errors" (redirect/notFound) untouched.
    if (typeof err?.digest === "string" && err.digest.startsWith("NEXT_")) throw err;
    console.error("[requestDeposit] unexpected error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

/** Return active deposit wallets for the user deposit page. */
export async function getActiveDepositWallets() {
  return db.depositWallet.findMany({
    where: { isActive: true },
    orderBy: { asset: "asc" },
  });
}

/**
 * Crypto withdrawal request.
 *
 * The primary `amount` is always USD — debited from the user's USD
 * wallet on admin approval. We also capture the crypto snapshot
 * (`cryptoAmount`, `cryptoSymbol`, `cryptoNetwork`, `exchangeRate`)
 * so the user and admin can see which coin + network + rate was
 * requested at submission time.
 *
 * `method` stores the network (TRC20, ERC20, Bitcoin, etc.) for
 * backward compatibility with existing admin tooling.
 */
export async function requestWithdrawal(data: {
  currency:       string;     // Crypto symbol, e.g. "BTC"
  amount:         number;     // USD — primary amount
  method:         string;     // Network label
  destination:    string;     // External wallet address
  cryptoAmount?:  number;
  cryptoSymbol?:  string;
  cryptoNetwork?: string | null;
  exchangeRate?:  number;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userId = session.user.id;

  const kycError = await requireApprovedKyc(userId);
  if (kycError) return kycError;

  const statusError = await requireActiveStatus(userId, "withdraw");
  if (statusError) return statusError;

  if (!data.amount || data.amount <= 0) {
    return { error: "Enter a valid amount" };
  }
  if (!data.destination || data.destination.trim().length < 6) {
    return { error: "Enter a valid wallet address" };
  }

  /* Funds go on hold the moment the request is submitted: the USD wallet
     is debited atomically with the request creation, so the user cannot
     spend the same money elsewhere while an admin reviews. The debit is
     conditional on `balance >= amount`, which makes the balance check and
     the debit one indivisible step — no race can drive the balance
     negative. A PENDING ledger row (reference = request id) records the
     hold; processWithdrawalRequest later completes it (approve) or
     cancels it and refunds the wallet (reject). */
  let request;
  try {
    request = await db.$transaction(async (tx) => {
      const debited = await tx.wallet.updateMany({
        where: { userId, currency: "USD", balance: { gte: data.amount } },
        data:  { balance: { decrement: data.amount } },
      });
      if (debited.count === 0) throw new Error("INSUFFICIENT_BALANCE");

      const req = await tx.withdrawalRequest.create({
        data: {
          userId,
          currency:      data.currency,
          amount:        data.amount,                    // USD
          method:        data.method,
          destination:   data.destination.trim(),
          cryptoAmount:  data.cryptoAmount  ?? null,
          cryptoSymbol:  data.cryptoSymbol  ?? data.currency,
          cryptoNetwork: data.cryptoNetwork ?? null,
          exchangeRate:  data.exchangeRate  ?? null,
        },
      });

      await tx.transaction.create({
        data: {
          userId,
          type:        "WITHDRAWAL",
          currency:    "USD",
          amount:      data.amount,
          status:      "PENDING",
          reference:   req.id,
          description: data.cryptoAmount && data.cryptoSymbol
            ? `Withdrawal via ${data.cryptoNetwork ?? data.method} · ${data.cryptoAmount} ${data.cryptoSymbol}`
            : `Withdrawal via ${data.method}`,
        },
      });

      return req;
    });
  } catch (e: any) {
    if (e?.message === "INSUFFICIENT_BALANCE") {
      return { error: "Insufficient USD balance" };
    }
    console.error("[requestWithdrawal]", e);
    return { error: "Something went wrong submitting your withdrawal. Please try again." };
  }

  // Admin heads-up — fire-and-forget. Funds are already on hold, so the
  // request is immediately actionable in the review queue.
  userSummary(userId).then((u) =>
    notifyAdmin({
      subject: `New withdrawal request — $${data.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} from ${u.email}`,
      heading: "New Withdrawal Request",
      body: ["A user has requested a withdrawal. The amount has been reserved from their balance and the request is awaiting review."],
      summaryCard: {
        title: "Withdrawal Details",
        status: "Pending Review",
        statusColor: "warning",
        primary: { label: "Amount", value: `$${data.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD` },
        secondary: data.cryptoAmount && data.cryptoSymbol
          ? { label: "Crypto", value: `${data.cryptoAmount.toLocaleString("en-US", { maximumFractionDigits: 8 })} ${data.cryptoSymbol}` }
          : undefined,
        rows: [
          { label: "User",        value: `${u.name} · ${u.email}` },
          { label: "Method",      value: data.method },
          { label: "Destination", value: data.destination.trim(), mono: true },
        ],
      },
      cta: { label: "Review Withdrawals", url: `${APP_URL}/admin/withdrawals` },
    }),
  ).catch(() => {});

  const cryptoSuffix = data.cryptoAmount && data.cryptoSymbol
    ? ` (${data.cryptoAmount.toLocaleString("en-US", { maximumFractionDigits: 8 })} ${data.cryptoSymbol})`
    : "";

  await db.notification.create({
    data: {
      userId,
      title:   "Withdrawal submitted",
      message: `Your withdrawal of $${data.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD${cryptoSuffix} is pending review. The amount has been reserved from your balance.`,
      type:    "WITHDRAWAL",
    },
  });

  revalidatePath("/dashboard/withdraw");
  return { success: true, requestId: request.id };
}
