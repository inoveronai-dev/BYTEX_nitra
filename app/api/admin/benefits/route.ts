import { z } from "zod";
import {
  jsonError,
  jsonFromUnknownError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin-guard";
import {
  loadContent,
  nextId,
  reorderItems,
  saveContent,
  SAVE_FLASH,
} from "@/lib/cms/admin-store";

type BenefitItem = {
  id: number;
  body: string;
  iconKey: string;
  emphasize: boolean;
  isActive: boolean;
  sortOrder: number;
};

const schema = z.object({
  id: z.number().optional(),
  body: z.string().min(1),
  iconKey: z.string().min(1),
  emphasize: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  try {
    const { data } = await loadContent<BenefitItem[]>("benefits");
    const items = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
    return jsonOk({ items });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");

  try {
    const { data } = await loadContent<BenefitItem[]>("benefits");
    const sortOrder = data.reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
    const item: BenefitItem = {
      id: nextId(data),
      body: parsed.data.body,
      iconKey: parsed.data.iconKey,
      emphasize: parsed.data.emphasize ?? false,
      isActive: parsed.data.isActive ?? true,
      sortOrder,
    };
    const next = [...data, item];
    await saveContent("benefits", next, "cms: create benefit");
    return jsonOk({ item });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}

export async function PATCH(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const body = await request.json().catch(() => null);

  try {
    const { data } = await loadContent<BenefitItem[]>("benefits");

    if (body?.action === "reorder") {
      const next = reorderItems(data, Number(body.id), body.direction === "up" ? "up" : "down");
      const saved = await saveContent("benefits", next, "cms: reorder benefits");
      return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
    }

    const parsed = schema.extend({ id: z.number() }).safeParse(body);
    if (!parsed.success) return jsonError("Neplatné údaje.");
    const index = data.findIndex((i) => i.id === parsed.data.id);
    if (index < 0) return jsonError("Záznam neexistuje.", 404);

    const item: BenefitItem = {
      ...data[index],
      body: parsed.data.body,
      iconKey: parsed.data.iconKey,
      emphasize: parsed.data.emphasize ?? false,
      isActive: parsed.data.isActive ?? true,
    };
    const next = data.map((i) => (i.id === item.id ? item : i));
    await saveContent("benefits", next, "cms: update benefit");
    return jsonOk({ item });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}

export async function DELETE(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const id = Number((await request.json().catch(() => null))?.id);
  if (!id) return jsonError("Chýba ID.");

  try {
    const { data } = await loadContent<BenefitItem[]>("benefits");
    const next = data.filter((i) => i.id !== id);
    const saved = await saveContent("benefits", next, "cms: delete benefit");
    return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}
