/**
 * Server-only Vercel Web Analytics queries.
 * Never import this from client components.
 */

export type WebAnalyticsSummary = {
  visitors: number;
  pageviews: number;
  periodDays: number;
  since: string;
  until: string;
};

type CountResponse = {
  data?: {
    visitors?: number;
    pageviews?: number;
  };
  error?: { message?: string };
  message?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Chýba premenná prostredia ${name}.`);
  }
  return value;
}

async function queryVisitsCount(params: URLSearchParams, token: string) {
  const endpoint = `https://api.vercel.com/v1/query/web-analytics/visits/count?${params.toString()}`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as CountResponse;
  return { res, body };
}

/** Last N days of production Web Analytics totals (visitors + pageviews). */
export async function fetchWebAnalyticsSummary(
  periodDays = 30
): Promise<WebAnalyticsSummary> {
  const token = requireEnv("VERCEL_TOKEN");
  const projectId = requireEnv("VERCEL_PROJECT_ID");
  const teamId = process.env.VERCEL_TEAM_ID?.trim();

  const until = new Date();
  const since = new Date(until.getTime() - periodDays * 24 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    projectId,
    since: since.toISOString(),
    until: until.toISOString(),
    // Defense in depth if any /admin events were ever recorded
    filter: "not startswith(requestPath,'/admin')",
  });
  if (teamId) {
    params.set("teamId", teamId);
  }

  let { res, body } = await queryVisitsCount(params, token);

  // Some accounts reject this OData filter — retry without it
  if (!res.ok && res.status === 400 && params.has("filter")) {
    params.delete("filter");
    ({ res, body } = await queryVisitsCount(params, token));
  }

  if (!res.ok) {
    throw new Error(
      body.error?.message ||
        body.message ||
        `Vercel Analytics API (${res.status}).`
    );
  }

  return {
    visitors: Number(body.data?.visitors ?? 0),
    pageviews: Number(body.data?.pageviews ?? 0),
    periodDays,
    since: since.toISOString(),
    until: until.toISOString(),
  };
}
