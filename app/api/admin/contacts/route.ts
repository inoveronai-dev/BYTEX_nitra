import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api/admin-guard";
import { reorderByDirection } from "@/lib/cms/reorder";
import { getDb } from "@/lib/db/client";
import { importantContacts } from "@/lib/db/schema";
import { deleteUploadIfExists } from "@/lib/uploads/storage";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  return jsonOk({
    items: getDb().select().from(importantContacts).orderBy(asc(importantContacts.sortOrder)).all(),
  });
}

const schema = z.object({
  id: z.number().optional(),
  groupKey: z.enum(["emergency", "service_partner", "utility"]),
  name: z.string().min(1),
  details: z.string().nullable().optional(),
  logoPath: z.string().nullable().optional(),
  imageAlt: z.string().nullable().optional(),
  websiteLabel: z.string().nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  contactsJson: z.string().min(2),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const sortOrder =
    db.select().from(importantContacts).all().reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
  const item = db
    .insert(importantContacts)
    .values({
      groupKey: parsed.data.groupKey,
      name: parsed.data.name,
      details: parsed.data.details ?? null,
      logoPath: parsed.data.logoPath ?? null,
      imageAlt: parsed.data.imageAlt ?? null,
      websiteLabel: parsed.data.websiteLabel ?? null,
      websiteUrl: parsed.data.websiteUrl ?? null,
      contactsJson: parsed.data.contactsJson,
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
    reorderByDirection(importantContacts, Number(body.id), body.direction === "up" ? "up" : "down");
    return jsonOk({ ok: true });
  }
  const parsed = schema.extend({ id: z.number() }).safeParse(body);
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const existing = db
    .select()
    .from(importantContacts)
    .where(eq(importantContacts.id, parsed.data.id))
    .get();
  if (!existing) return jsonError("Záznam neexistuje.", 404);
  if (parsed.data.logoPath !== existing.logoPath) deleteUploadIfExists(existing.logoPath);
  const item = db
    .update(importantContacts)
    .set({
      groupKey: parsed.data.groupKey,
      name: parsed.data.name,
      details: parsed.data.details ?? null,
      logoPath: parsed.data.logoPath ?? null,
      imageAlt: parsed.data.imageAlt ?? null,
      websiteLabel: parsed.data.websiteLabel ?? null,
      websiteUrl: parsed.data.websiteUrl ?? null,
      contactsJson: parsed.data.contactsJson,
      isActive: parsed.data.isActive ?? true,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(importantContacts.id, parsed.data.id))
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
  const existing = db.select().from(importantContacts).where(eq(importantContacts.id, id)).get();
  if (existing) deleteUploadIfExists(existing.logoPath);
  db.delete(importantContacts).where(eq(importantContacts.id, id)).run();
  return jsonOk({ ok: true });
}
