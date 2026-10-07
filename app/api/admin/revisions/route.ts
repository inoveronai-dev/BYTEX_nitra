import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api/admin-guard";
import { reorderByDirection } from "@/lib/cms/reorder";
import { getDb } from "@/lib/db/client";
import { revisions, revisionsIntro } from "@/lib/db/schema";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  const db = getDb();
  return jsonOk({
    intro: db.select().from(revisionsIntro).get() || null,
    items: db.select().from(revisions).orderBy(asc(revisions.sortOrder)).all(),
  });
}

const schema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  frequency: z.string().min(1),
  body: z.string().min(1),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const body = await request.json().catch(() => null);
  if (body?.action === "saveIntro") {
    const introBody = String(body.body || "");
    const db = getDb();
    const existing = db.select().from(revisionsIntro).get();
    if (existing) {
      db.update(revisionsIntro)
        .set({ body: introBody, updatedAt: new Date().toISOString() })
        .where(eq(revisionsIntro.id, existing.id))
        .run();
    } else {
      db.insert(revisionsIntro).values({ body: introBody }).run();
    }
    return jsonOk({ ok: true });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const sortOrder = db.select().from(revisions).all().reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
  const item = db
    .insert(revisions)
    .values({
      title: parsed.data.title,
      frequency: parsed.data.frequency,
      body: parsed.data.body,
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
    reorderByDirection(revisions, Number(body.id), body.direction === "up" ? "up" : "down");
    return jsonOk({ ok: true });
  }
  const parsed = schema.extend({ id: z.number() }).safeParse(body);
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const item = getDb()
    .update(revisions)
    .set({
      title: parsed.data.title,
      frequency: parsed.data.frequency,
      body: parsed.data.body,
      isActive: parsed.data.isActive ?? true,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(revisions.id, parsed.data.id))
    .returning()
    .get();
  return jsonOk({ item });
}

export async function DELETE(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const id = Number((await request.json().catch(() => null))?.id);
  if (!id) return jsonError("Chýba ID.");
  getDb().delete(revisions).where(eq(revisions.id, id)).run();
  return jsonOk({ ok: true });
}
