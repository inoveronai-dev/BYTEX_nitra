import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api/admin-guard";
import { reorderByDirection } from "@/lib/cms/reorder";
import { getDb } from "@/lib/db/client";
import { benefits } from "@/lib/db/schema";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  return jsonOk({ items: getDb().select().from(benefits).orderBy(asc(benefits.sortOrder)).all() });
}

const schema = z.object({
  id: z.number().optional(),
  body: z.string().min(1),
  iconKey: z.string().min(1),
  emphasize: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const sortOrder = db.select().from(benefits).all().reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
  const item = db
    .insert(benefits)
    .values({
      body: parsed.data.body,
      iconKey: parsed.data.iconKey,
      emphasize: parsed.data.emphasize ?? false,
      isActive: parsed.data.isActive ?? true,
      sortOrder,
    })
    .returning()
    .get();
  return jsonOk({ item });
}

export async function PATCH(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const body = await request.json().catch(() => null);
  if (body?.action === "reorder") {
    reorderByDirection(benefits, Number(body.id), body.direction === "up" ? "up" : "down");
    return jsonOk({ ok: true });
  }
  const parsed = schema.extend({ id: z.number() }).safeParse(body);
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const item = db
    .update(benefits)
    .set({
      body: parsed.data.body,
      iconKey: parsed.data.iconKey,
      emphasize: parsed.data.emphasize ?? false,
      isActive: parsed.data.isActive ?? true,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(benefits.id, parsed.data.id))
    .returning()
    .get();
  return jsonOk({ item });
}

export async function DELETE(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const id = Number((await request.json().catch(() => null))?.id);
  if (!id) return jsonError("Chýba ID.");
  getDb().delete(benefits).where(eq(benefits.id, id)).run();
  return jsonOk({ ok: true });
}
