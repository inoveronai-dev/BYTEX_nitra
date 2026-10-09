"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Safety net if a request reaches an admin page without a verified session
 * (so AdminShell was not rendered). Middleware should normally prevent this.
 */
export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!isLogin) {
      router.replace("/admin/login");
    }
  }, [isLogin, router]);

  if (!isLogin) {
    return null;
  }

  return <>{children}</>;
}
