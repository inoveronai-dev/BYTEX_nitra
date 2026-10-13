import { getPublicSiteStats } from "@/lib/public-stats";

export default async function FooterStats() {
  const stats = await getPublicSiteStats();
  if (!stats) return null;

  const visitors = stats.visitors.toLocaleString("sk-SK");
  const pageviews = stats.pageviews.toLocaleString("sk-SK");

  return (
    <p className="mt-3 text-[11px] font-light tracking-wide text-white/30">
      <span>Návštevníci: {visitors}</span>
      <span className="mx-2 text-white/15" aria-hidden>
        ·
      </span>
      <span>Zobrazenia stránky: {pageviews}</span>
    </p>
  );
}
