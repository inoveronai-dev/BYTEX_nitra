import { requireAdminApi, jsonOk, jsonFromUnknownError } from "@/lib/api/admin-guard";
import { fetchWebAnalyticsSummary } from "@/lib/vercel-web-analytics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if (gate.error) return gate.error;

  try {
    const summary = await fetchWebAnalyticsSummary(30);
    return jsonOk(summary);
  } catch (error) {
    return jsonFromUnknownError(error);
  }
}
