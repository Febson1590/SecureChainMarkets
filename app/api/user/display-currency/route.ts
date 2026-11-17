import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { asDisplayCurrency } from "@/lib/currency";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const currency = asDisplayCurrency(body?.currency);
  if (!currency) return NextResponse.json({ error: "Invalid currency" }, { status: 400 });

  try {
    await db.profile.upsert({
      where:  { userId: session.user.id },
      update: { displayCurrency: currency },
      create: { userId: session.user.id, displayCurrency: currency },
    });
    return NextResponse.json({ success: true, currency });
  } catch (err) {
    console.error("[display-currency POST]", err);
    return NextResponse.json({ error: "Could not save preference" }, { status: 500 });
  }
}
