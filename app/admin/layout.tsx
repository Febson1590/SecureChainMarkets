import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import AdminNav from "@/components/admin/admin-nav";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") redirect("/login");

  // Re-check role + status from the DB on every navigation. Admins are
  // no longer admins the moment their `role` changes, even if their JWT
  // still says ADMIN. Suspended/frozen admins are bounced to the status
  // page so a stolen/stale session can't poke at admin endpoints.
  const me = await db.user.findUnique({
    where:  { id: session.user.id },
    select: { role: true, status: true },
  });
  if (!me || me.role !== "ADMIN") redirect("/dashboard");
  if (me.status === "FROZEN" || me.status === "SUSPENDED") redirect("/account-status");

  return (
    <div
      className="flex h-[100dvh] w-full text-[#0F172A] overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 90% 70% at 100% 0%, rgba(47,107,255,0.10), rgba(47,107,255,0) 62%)," +
          "radial-gradient(ellipse 80% 65% at 0% 100%, rgba(47,107,255,0.06), rgba(47,107,255,0) 65%)," +
          "linear-gradient(180deg, #F6FAFF 0%, #EEF5FF 100%)",
      }}
    >
      {/* Desktop sidebar — hidden on mobile (AdminNav handles its own visibility) */}
      <AdminNav />
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile-aware header with hamburger + Sheet drawer */}
        <AdminHeader />
        <main className="flex-1 overflow-y-auto overscroll-contain p-6">{children}</main>
      </div>
    </div>
  );
}
