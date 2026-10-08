import { z } from "zod";
import {
  jsonError,
  jsonFromUnknownError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin-guard";
import { loadContent, saveContent, SAVE_FLASH } from "@/lib/cms/admin-store";

type PricingPrice = { amount: string; unit?: string };
type PricingItem = {
  title: string;
  description: string;
  isActive?: boolean;
  prices: PricingPrice[];
};
type PricingSection = {
  id: string;
  title: string;
  note?: string;
  isActive?: boolean;
  items: PricingItem[];
};
type PricingContent = {
  note: string;
  sections: PricingSection[];
};

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  try {
    const { data } = await loadContent<PricingContent>("pricing");
    return jsonOk({
      note: data.note || "",
      categories: (data.sections || []).map((section, index) => ({
        id: index + 1,
        slug: section.id,
        title: section.title,
        note: section.note ?? null,
        isActive: section.isActive ?? true,
        items: (section.items || []).map((item, itemIndex) => ({
          id: itemIndex + 1,
          title: item.title,
          description: item.description,
          isActive: item.isActive ?? true,
          prices: (item.prices || []).map((p) => ({
            amount: p.amount,
            unit: p.unit ?? null,
          })),
        })),
      })),
    });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
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

  try {
    const next: PricingContent = {
      note: parsed.data.note,
      sections: parsed.data.categories.map((cat) => ({
        id: cat.slug,
        title: cat.title,
        ...(cat.note ? { note: cat.note } : {}),
        ...(cat.isActive === false ? { isActive: false } : {}),
        items: cat.items.map((item) => ({
          title: item.title,
          description: item.description,
          ...(item.isActive === false ? { isActive: false } : {}),
          prices: item.prices.map((p) => ({
            amount: p.amount,
            ...(p.unit ? { unit: p.unit } : {}),
          })),
        })),
      })),
    };
    const saved = await saveContent("pricing", next, "cms: update pricing");
    return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}
