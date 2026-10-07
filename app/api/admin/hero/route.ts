import { eq } from "drizzle-orm";
import { z } from "zod";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api/admin-guard";
import { getDb } from "@/lib/db/client";
import { changeManagerCta, heroContent } from "@/lib/db/schema";
import { deleteUploadIfExists } from "@/lib/uploads/storage";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  const db = getDb();
  return jsonOk({
    hero: db.select().from(heroContent).get() || null,
    changeManager: db.select().from(changeManagerCta).get() || null,
  });
}

const schema = z.object({
  headlineLines: z.array(z.string()).min(1),
  imagePath: z.string().nullable().optional(),
  changeManager: z
    .object({
      intro: z.string(),
      quotes: z.array(
        z.object({
          text: z.string(),
          citation: z.string().optional(),
        })
      ),
      downloadPath: z.string().nullable().optional(),
      downloadUrl: z.string().nullable().optional(),
      backgroundImagePath: z.string().nullable().optional(),
    })
    .optional(),
});

export async function PUT(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");
  const db = getDb();
  const hero = db.select().from(heroContent).get();
  const lines = JSON.stringify(parsed.data.headlineLines);
  if (hero) {
    if (parsed.data.imagePath && parsed.data.imagePath !== hero.imagePath) {
      deleteUploadIfExists(hero.imagePath);
    }
    db.update(heroContent)
      .set({
        headlineLinesJson: lines,
        imagePath: parsed.data.imagePath ?? hero.imagePath,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(heroContent.id, hero.id))
      .run();
  } else {
    db.insert(heroContent)
      .values({
        headlineLinesJson: lines,
        imagePath: parsed.data.imagePath ?? null,
      })
      .run();
  }

  if (parsed.data.changeManager) {
    const cm = parsed.data.changeManager;
    const existing = db.select().from(changeManagerCta).get();
    if (existing) {
      db.update(changeManagerCta)
        .set({
          intro: cm.intro,
          quotesJson: JSON.stringify(cm.quotes),
          downloadPath: cm.downloadPath ?? null,
          downloadUrl: cm.downloadUrl ?? null,
          backgroundImagePath: cm.backgroundImagePath ?? existing.backgroundImagePath,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(changeManagerCta.id, existing.id))
        .run();
    } else {
      db.insert(changeManagerCta)
        .values({
          intro: cm.intro,
          quotesJson: JSON.stringify(cm.quotes),
          downloadPath: cm.downloadPath ?? null,
          downloadUrl: cm.downloadUrl ?? null,
          backgroundImagePath: cm.backgroundImagePath ?? null,
        })
        .run();
    }
  }

  return jsonOk({ ok: true });
}
