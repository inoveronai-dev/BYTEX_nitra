import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api/admin-guard";
import { reorderByDirection } from "@/lib/cms/reorder";
import { getDb } from "@/lib/db/client";
import { reconstructions } from "@/lib/db/schema";
import { deleteUploadIfExists } from "@/lib/uploads/storage";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  return jsonOk({
    items: getDb().select().from(reconstructions).orderBy(asc(reconstructions.sortOrder)).all(),
  });
}

const schema = z.object({
  id: z.number().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  yearStatus: z.string().min(1),
  investment: z.string().min(1),
  beforeImagePath: z.string().min(1),
  afterImagePath: z.string().min(1),
  beforeText: z.string().min(1),
  afterText: z.string().min(1),
  facts: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const sortOrder =
    db.select().from(reconstructions).all().reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
  const item = db
    .insert(reconstructions)
    .values({
      slug: parsed.data.slug,
      title: parsed.data.title,
      yearStatus: parsed.data.yearStatus,
      investment: parsed.data.investment,
      beforeImagePath: parsed.data.beforeImagePath,
      afterImagePath: parsed.data.afterImagePath,
      beforeText: parsed.data.beforeText,
      afterText: parsed.data.afterText,
      factsJson: JSON.stringify(parsed.data.facts || []),
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
    reorderByDirection(reconstructions, Number(body.id), body.direction === "up" ? "up" : "down");
    return jsonOk({ ok: true });
  }
  const parsed = schema.extend({ id: z.number() }).safeParse(body);
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const existing = db
    .select()
    .from(reconstructions)
    .where(eq(reconstructions.id, parsed.data.id))
    .get();
  if (!existing) return jsonError("Záznam neexistuje.", 404);
  if (parsed.data.beforeImagePath !== existing.beforeImagePath) {
    deleteUploadIfExists(existing.beforeImagePath);
  }
  if (parsed.data.afterImagePath !== existing.afterImagePath) {
    deleteUploadIfExists(existing.afterImagePath);
  }
  const item = db
    .update(reconstructions)
    .set({
      slug: parsed.data.slug,
      title: parsed.data.title,
      yearStatus: parsed.data.yearStatus,
      investment: parsed.data.investment,
      beforeImagePath: parsed.data.beforeImagePath,
      afterImagePath: parsed.data.afterImagePath,
      beforeText: parsed.data.beforeText,
      afterText: parsed.data.afterText,
      factsJson: JSON.stringify(parsed.data.facts || []),
      isActive: parsed.data.isActive ?? true,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(reconstructions.id, parsed.data.id))
    .returning()
    .get();
  return jsonOk({ item });
}

export async function DELETE(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const id = Number((await request.json().catch(() => null))?.id);
  if (!id) return jsonError("Chýba ID.");
  const db = getDb();
  const existing = db.select().from(reconstructions).where(eq(reconstructions.id, id)).get();
  if (existing) {
    deleteUploadIfExists(existing.beforeImagePath);
    deleteUploadIfExists(existing.afterImagePath);
  }
  db.delete(reconstructions).where(eq(reconstructions.id, id)).run();
  return jsonOk({ ok: true });
}
