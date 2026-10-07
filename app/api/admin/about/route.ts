import { eq } from "drizzle-orm";
import { z } from "zod";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api/admin-guard";
import { getDb } from "@/lib/db/client";
import { aboutContent } from "@/lib/db/schema";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  return jsonOk({ item: getDb().select().from(aboutContent).get() || null });
}

const schema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  body: z.string().min(1),
});

export async function PUT(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const existing = db.select().from(aboutContent).get();
  if (existing) {
    db.update(aboutContent)
      .set({ ...parsed.data, updatedAt: new Date().toISOString() })
      .where(eq(aboutContent.id, existing.id))
      .run();
  } else {
    db.insert(aboutContent).values(parsed.data).run();
  }
  return jsonOk({ ok: true });
}
