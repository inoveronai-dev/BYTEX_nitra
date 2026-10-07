import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api/admin-guard";
import { getDb } from "@/lib/db/client";
import { services } from "@/lib/db/schema";
import { reorderByDirection } from "@/lib/cms/reorder";
import { deleteUploadIfExists } from "@/lib/uploads/storage";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  const db = getDb();
  const rows = db.select().from(services).orderBy(asc(services.sortOrder)).all();
  return jsonOk({ items: rows });
}

const upsertSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  imagePath: z.string().min(1),
  imageClassName: z.string().nullable().optional(),
  imageOverlayClassName: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const body = await request.json().catch(() => null);
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) return jsonError("Neplatné údaje.");

  const db = getDb();
  const maxOrder =
    db
      .select()
      .from(services)
      .all()
      .reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;

  const result = db
    .insert(services)
    .values({
      title: parsed.data.title,
      description: parsed.data.description,
      imagePath: parsed.data.imagePath,
      imageClassName: parsed.data.imageClassName ?? null,
      imageOverlayClassName: parsed.data.imageOverlayClassName ?? null,
      sortOrder: maxOrder,
      isActive: parsed.data.isActive ?? true,
    })
    .returning()
    .get();

  return jsonOk({ item: result });
}

export async function PATCH(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const body = await request.json().catch(() => null);

  if (body?.action === "reorder") {
    const id = Number(body.id);
    const direction = body.direction === "up" ? "up" : "down";
    reorderByDirection(services, id, direction);
    return jsonOk({ ok: true });
  }

  const parsed = upsertSchema.extend({ id: z.number() }).safeParse(body);
  if (!parsed.success) return jsonError("Neplatné údaje.");

  const db = getDb();
  const existing = db.select().from(services).where(eq(services.id, parsed.data.id)).get();
  if (!existing) return jsonError("Záznam neexistuje.", 404);

  if (parsed.data.imagePath !== existing.imagePath) {
    deleteUploadIfExists(existing.imagePath);
  }

  const item = db
    .update(services)
    .set({
      title: parsed.data.title,
      description: parsed.data.description,
      imagePath: parsed.data.imagePath,
      imageClassName: parsed.data.imageClassName ?? null,
      imageOverlayClassName: parsed.data.imageOverlayClassName ?? null,
      isActive: parsed.data.isActive ?? existing.isActive,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(services.id, parsed.data.id))
    .returning()
    .get();

  return jsonOk({ item });
}

export async function DELETE(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  if (!id) return jsonError("Chýba ID.");

  const db = getDb();
  const existing = db.select().from(services).where(eq(services.id, id)).get();
  if (existing) deleteUploadIfExists(existing.imagePath);
  db.delete(services).where(eq(services.id, id)).run();
  return jsonOk({ ok: true });
}
