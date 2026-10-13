import { unstable_cache } from "next/cache";
import { fetchWebAnalyticsSummary } from "@/lib/vercel-web-analytics";

/** Safe public aggregates only — never includes tokens, IDs, or raw analytics. */
export type PublicSiteStats = {
  visitors: number;
  pageviews: number;
};

/**
 * Cached public Web Analytics totals (same 30-day window as admin cards).
 * Returns null when analytics are unavailable so the footer can stay intact.
 */
export const getPublicSiteStats = unstable_cache(
  async (): Promise<PublicSiteStats | null> => {
    try {
      const summary = await fetchWebAnalyticsSummary(30);
      return {
        visitors: summary.visitors,
        pageviews: summary.pageviews,
      };
    } catch {
      return null;
    }
  },
  ["public-site-stats-v1"],
  { revalidate: 3600 }
);
