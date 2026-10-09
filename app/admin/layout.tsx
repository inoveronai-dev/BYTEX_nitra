import type { Metadata } from "next";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BYTEX Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    // Stale/invalid cookie: middleware only checks presence, so AdminShell is
    // skipped. Gate clears the cookie and sends the user to login.
    return (
      <div className="min-h-screen bg-[#f4f1ea] text-charcoal-deep">
        <AdminAuthGate>{children}</AdminAuthGate>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-charcoal-deep">
      <AdminShell email={admin.email}>{children}</AdminShell>
    </div>
  );
}
