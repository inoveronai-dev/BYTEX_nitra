"use client";

import { Analytics } from "@vercel/analytics/next";

/** Public-site Web Analytics. Never tracks `/admin` routes. */
export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        try {
          const pathname = new URL(event.url).pathname;
          if (pathname === "/admin" || pathname.startsWith("/admin/")) {
            return null;
          }
        } catch {
          if (event.url.includes("/admin")) return null;
        }
        return event;
      }}
    />
  );
}
