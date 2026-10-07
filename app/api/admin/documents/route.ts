import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api/admin-guard";
import { reorderByDirection } from "@/lib/cms/reorder";
import { getDb } from "@/lib/db/client";
import { documents, downloadsIntro } from "@/lib/db/schema";
import { deleteUploadIfExists } from "@/lib/uploads/storage";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  const db = getDb();
  return jsonOk({
    intro: db.select().from(downloadsIntro).get() || null,
    items: db.select().from(documents).orderBy(asc(documents.sortOrder)).all(),
  });
}

const schema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  filePath: z.string().nullable().optional(),
  externalUrl: z.string().nullable().optional(),
  mimeType: z.string().nullable().optional(),
  fileExt: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const body = await request.json().catch(() => null);
  if (body?.action === "saveIntro") {
    const introBody = String(body.body || "");
    const db = getDb();
    const existing = db.select().from(downloadsIntro).get();
    if (existing) {
      db.update(downloadsIntro)
        .set({ body: introBody, updatedAt: new Date().toISOString() })
        .where(eq(downloadsIntro.id, existing.id))
        .run();
    } else {
      db.insert(downloadsIntro).values({ body: introBody }).run();
    }
    return jsonOk({ ok: true });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Neplatné údaje.");
  if (!parsed.data.filePath && !parsed.data.externalUrl) {
    return jsonError("Nahrajte súbor alebo zadajte URL.");
  }
  const db = getDb();
  const sortOrder = db.select().from(documents).all().reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
  const item = db
    .insert(documents)
    .values({
      title: parsed.data.title,
      filePath: parsed.data.filePath || null,
      externalUrl: parsed.data.externalUrl || null,
      mimeType: parsed.data.mimeType || null,
      fileExt: parsed.data.fileExt || null,
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
    reorderByDirection(documents, Number(body.id), body.direction === "up" ? "up" : "down");
    return jsonOk({ ok: true });
  }
  const parsed = schema.extend({ id: z.number() }).safeParse(body);
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const existing = db.select().from(documents).where(eq(documents.id, parsed.data.id)).get();
  if (!existing) return jsonError("Záznam neexistuje.", 404);
  if (parsed.data.filePath && parsed.data.filePath !== existing.filePath) {
    deleteUploadIfExists(existing.filePath);
  }
  const item = db
    .update(documents)
    .set({
      title: parsed.data.title,
      filePath: parsed.data.filePath ?? null,
      externalUrl: parsed.data.externalUrl ?? null,
      mimeType: parsed.data.mimeType ?? null,
      fileExt: parsed.data.fileExt ?? null,
      isActive: parsed.data.isActive ?? true,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(documents.id, parsed.data.id))
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
  const existing = db.select().from(documents).where(eq(documents.id, id)).get();
  if (existing) deleteUploadIfExists(existing.filePath);
  db.delete(documents).where(eq(documents.id, id)).run();
  return jsonOk({ ok: true });
}
