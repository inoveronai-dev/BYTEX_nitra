import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api/admin-guard";
import { reorderByDirection } from "@/lib/cms/reorder";
import { getDb } from "@/lib/db/client";
import { partners } from "@/lib/db/schema";
import { deleteUploadIfExists } from "@/lib/uploads/storage";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  return jsonOk({ items: getDb().select().from(partners).orderBy(asc(partners.sortOrder)).all() });
}

const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  logoPath: z.string().min(1),
  url: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const sortOrder = db.select().from(partners).all().reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
  const item = db
    .insert(partners)
    .values({
      name: parsed.data.name,
      logoPath: parsed.data.logoPath,
      url: parsed.data.url || null,
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
    reorderByDirection(partners, Number(body.id), body.direction === "up" ? "up" : "down");
    return jsonOk({ ok: true });
  }
  const parsed = schema.extend({ id: z.number() }).safeParse(body);
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const existing = db.select().from(partners).where(eq(partners.id, parsed.data.id)).get();
  if (!existing) return jsonError("Záznam neexistuje.", 404);
  if (parsed.data.logoPath !== existing.logoPath) deleteUploadIfExists(existing.logoPath);
  const item = db
    .update(partners)
    .set({
      name: parsed.data.name,
      logoPath: parsed.data.logoPath,
      url: parsed.data.url || null,
      isActive: parsed.data.isActive ?? true,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(partners.id, parsed.data.id))
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
  const existing = db.select().from(partners).where(eq(partners.id, id)).get();
  if (existing) deleteUploadIfExists(existing.logoPath);
  db.delete(partners).where(eq(partners.id, id)).run();
  return jsonOk({ ok: true });
}
