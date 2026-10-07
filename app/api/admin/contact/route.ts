import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api/admin-guard";
import { getDb } from "@/lib/db/client";
import { contactInfo, officeHours, siteSettings } from "@/lib/db/schema";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  const db = getDb();
  return jsonOk({
    contact: db.select().from(contactInfo).get() || null,
    hours: db.select().from(officeHours).orderBy(asc(officeHours.sortOrder)).all(),
    settings: db.select().from(siteSettings).get() || null,
  });
}

const schema = z.object({
  contact: z.object({
    person: z.string().min(1),
    email: z.string().min(1),
    phone: z.string().min(1),
    phoneHref: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().min(1),
    facebookUrl: z.string().min(1),
    instagramUrl: z.string().min(1),
    mapEmbedUrl: z.string().min(1),
    clientCentreIntro: z.string().min(1),
    formIntroBeforeEmail: z.string().min(1),
    formIntroAfterEmail: z.string().min(1),
  }),
  hours: z.array(
    z.object({
      id: z.number().optional(),
      day: z.string(),
      timeText: z.string(),
      isOpen: z.boolean(),
      sortOrder: z.number(),
    })
  ),
  settings: z.object({
    companyName: z.string().min(1),
    ico: z.string().min(1),
    dic: z.string().min(1),
    copyrightText: z.string().min(1),
  }),
});

export async function PUT(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();

  const contact = db.select().from(contactInfo).get();
  if (contact) {
    db.update(contactInfo)
      .set({ ...parsed.data.contact, updatedAt: new Date().toISOString() })
      .where(eq(contactInfo.id, contact.id))
      .run();
  } else {
    db.insert(contactInfo).values(parsed.data.contact).run();
  }

  db.delete(officeHours).run();
  for (const h of parsed.data.hours) {
    db.insert(officeHours)
      .values({
        day: h.day,
        timeText: h.timeText,
        isOpen: h.isOpen,
        sortOrder: h.sortOrder,
      })
      .run();
  }

  const settings = db.select().from(siteSettings).get();
  if (settings) {
    db.update(siteSettings)
      .set({ ...parsed.data.settings, updatedAt: new Date().toISOString() })
      .where(eq(siteSettings.id, settings.id))
      .run();
  } else {
    db.insert(siteSettings).values(parsed.data.settings).run();
  }

  return jsonOk({ ok: true });
}
