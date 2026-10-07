import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { jsonError, jsonOk, requireAdminApi } from "@/lib/api/admin-guard";
import { getDb } from "@/lib/db/client";
import { pricingCategories, pricingItems, pricingNote, pricingPrices } from "@/lib/db/schema";

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  const db = getDb();
  const categories = db
    .select()
    .from(pricingCategories)
    .orderBy(asc(pricingCategories.sortOrder))
    .all();
  const items = db.select().from(pricingItems).orderBy(asc(pricingItems.sortOrder)).all();
  const prices = db.select().from(pricingPrices).orderBy(asc(pricingPrices.sortOrder)).all();
  const note = db.select().from(pricingNote).get();

  return jsonOk({
    note: note?.note || "",
    categories: categories.map((c) => ({
      ...c,
      items: items
        .filter((i) => i.categoryId === c.id)
        .map((i) => ({
          ...i,
          prices: prices.filter((p) => p.itemId === i.id),
        })),
    })),
  });
}

const schema = z.object({
  note: z.string(),
  categories: z.array(
    z.object({
      id: z.number().optional(),
      slug: z.string(),
      title: z.string(),
      note: z.string().nullable().optional(),
      isActive: z.boolean().optional(),
      items: z.array(
        z.object({
          id: z.number().optional(),
          title: z.string(),
          description: z.string(),
          isActive: z.boolean().optional(),
          prices: z.array(
            z.object({
              amount: z.string(),
              unit: z.string().nullable().optional(),
            })
          ),
        })
      ),
    })
  ),
});

export async function PUT(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");

  const db = getDb();
  db.delete(pricingPrices).run();
  db.delete(pricingItems).run();
  db.delete(pricingCategories).run();

  const noteRow = db.select().from(pricingNote).get();
  if (noteRow) {
    db.update(pricingNote)
      .set({ note: parsed.data.note, updatedAt: new Date().toISOString() })
      .where(eq(pricingNote.id, noteRow.id))
      .run();
  } else {
    db.insert(pricingNote).values({ note: parsed.data.note }).run();
  }

  parsed.data.categories.forEach((cat, catIndex) => {
    const category = db
      .insert(pricingCategories)
      .values({
        slug: cat.slug,
        title: cat.title,
        note: cat.note ?? null,
        sortOrder: catIndex,
        isActive: cat.isActive ?? true,
      })
      .returning()
      .get();

    cat.items.forEach((item, itemIndex) => {
      const inserted = db
        .insert(pricingItems)
        .values({
          categoryId: category.id,
          title: item.title,
          description: item.description,
          sortOrder: itemIndex,
          isActive: item.isActive ?? true,
        })
        .returning()
        .get();

      item.prices.forEach((price, priceIndex) => {
        db.insert(pricingPrices)
          .values({
            itemId: inserted.id,
            amount: price.amount,
            unit: price.unit ?? null,
            sortOrder: priceIndex,
          })
          .run();
      });
    });
  });

  return jsonOk({ ok: true });
}
