import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentAdmin } from "@/lib/auth/session";
import { isStaticPublicContent } from "@/lib/content/storage-mode";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BYTEX Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (isStaticPublicContent()) {
    notFound();
  }

  const admin = await getCurrentAdmin();

  // Login page renders without sidebar
  if (!admin) {
    return <div className="min-h-screen bg-[#f4f1ea] text-charcoal-deep">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-charcoal-deep">
      <AdminShell email={admin.email}>{children}</AdminShell>
    </div>
  );
}
