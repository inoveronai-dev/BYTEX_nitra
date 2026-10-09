"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/admin/ui";
import { adminFetch } from "@/lib/admin/api-client";

type Summary = {
  visitors: number;
  pageviews: number;
  periodDays: number;
};

export function AnalyticsSummary() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await adminFetch("/api/admin/analytics");
        const body = (await res.json().catch(() => ({}))) as Summary & {
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          setError(body.error || "Analytiku sa nepodarilo načítať.");
          setData(null);
        } else {
          setError(null);
          setData({
            visitors: body.visitors ?? 0,
            pageviews: body.pageviews ?? 0,
            periodDays: body.periodDays ?? 30,
          });
        }
      } catch {
        if (!cancelled) {
          setError("Analytiku sa nepodarilo načítať.");
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <p className="text-xs uppercase tracking-wider text-charcoal/45">
          Návštevnosť webu
        </p>
        <p className="text-xs text-charcoal/40">
          Posledných {data?.periodDays ?? 30} dní
        </p>
      </div>
      {error ? (
        <Card>
          <p className="text-sm text-charcoal/60">{error}</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-xs uppercase tracking-wider text-charcoal/45">
              Návštevníci
            </p>
            <p className="mt-2 font-serif text-3xl">
              {loading ? "—" : data?.visitors.toLocaleString("sk-SK")}
            </p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-wider text-charcoal/45">
              Zobrazenia stránky
            </p>
            <p className="mt-2 font-serif text-3xl">
              {loading ? "—" : data?.pageviews.toLocaleString("sk-SK")}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
