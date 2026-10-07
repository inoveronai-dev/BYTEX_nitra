import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api/admin-guard";
import { reorderByDirection } from "@/lib/cms/reorder";
import { getDb } from "@/lib/db/client";
import { siteReferences } from "@/lib/db/schema";
import { deleteUploadIfExists } from "@/lib/uploads/storage";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  return jsonOk({
    items: getDb().select().from(siteReferences).orderBy(asc(siteReferences.sortOrder)).all(),
  });
}

const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  imagePath: z.string().min(1),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const sortOrder =
    db.select().from(siteReferences).all().reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
  const item = db
    .insert(siteReferences)
    .values({
      name: parsed.data.name,
      imagePath: parsed.data.imagePath,
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
    reorderByDirection(siteReferences, Number(body.id), body.direction === "up" ? "up" : "down");
    return jsonOk({ ok: true });
  }
  const parsed = schema.extend({ id: z.number() }).safeParse(body);
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const existing = db.select().from(siteReferences).where(eq(siteReferences.id, parsed.data.id)).get();
  if (!existing) return jsonError("Záznam neexistuje.", 404);
  if (parsed.data.imagePath !== existing.imagePath) deleteUploadIfExists(existing.imagePath);
  const item = db
    .update(siteReferences)
    .set({
      name: parsed.data.name,
      imagePath: parsed.data.imagePath,
      isActive: parsed.data.isActive ?? true,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(siteReferences.id, parsed.data.id))
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
  const existing = db.select().from(siteReferences).where(eq(siteReferences.id, id)).get();
  if (existing) deleteUploadIfExists(existing.imagePath);
  db.delete(siteReferences).where(eq(siteReferences.id, id)).run();
  return jsonOk({ ok: true });
}
