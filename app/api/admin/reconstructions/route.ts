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

type ReconstructionItem = {
  id: number;
  slug: string;
  title: string;
  yearStatus: string;
  investment: string;
  beforeImagePath: string;
  afterImagePath: string;
  beforeText: string;
  afterText: string;
  facts: string[];
  isActive: boolean;
  sortOrder: number;
};

function toAdminItem(item: ReconstructionItem) {
  return {
    ...item,
    factsJson: JSON.stringify(item.facts ?? []),
  };
}

const schema = z.object({
  id: z.number().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  yearStatus: z.string().min(1),
  investment: z.string().min(1),
  beforeImagePath: z.string().min(1),
  afterImagePath: z.string().min(1),
  beforeText: z.string().min(1),
  afterText: z.string().min(1),
  facts: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  try {
    const { data } = await loadContent<ReconstructionItem[]>("reconstructions");
    const items = [...data]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(toAdminItem);
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
    const { data } = await loadContent<ReconstructionItem[]>("reconstructions");
    const sortOrder = data.reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
    const item: ReconstructionItem = {
      id: nextId(data),
      slug: parsed.data.slug,
      title: parsed.data.title,
      yearStatus: parsed.data.yearStatus,
      investment: parsed.data.investment,
      beforeImagePath: parsed.data.beforeImagePath,
      afterImagePath: parsed.data.afterImagePath,
      beforeText: parsed.data.beforeText,
      afterText: parsed.data.afterText,
      facts: parsed.data.facts || [],
      isActive: parsed.data.isActive ?? true,
      sortOrder,
    };
    await saveContent("reconstructions", [...data, item], "cms: create reconstruction");
    return jsonOk({ item: toAdminItem(item) });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}

export async function PATCH(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const body = await request.json().catch(() => null);

  try {
    const { data } = await loadContent<ReconstructionItem[]>("reconstructions");

    if (body?.action === "reorder") {
      const next = reorderItems(data, Number(body.id), body.direction === "up" ? "up" : "down");
      const saved = await saveContent("reconstructions", next, "cms: reorder reconstructions");
      return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
    }

    const parsed = schema.extend({ id: z.number() }).safeParse(body);
    if (!parsed.success) return jsonError("Neplatné údaje.");
    const existing = data.find((i) => i.id === parsed.data.id);
    if (!existing) return jsonError("Záznam neexistuje.", 404);

    const item: ReconstructionItem = {
      ...existing,
      slug: parsed.data.slug,
      title: parsed.data.title,
      yearStatus: parsed.data.yearStatus,
      investment: parsed.data.investment,
      beforeImagePath: parsed.data.beforeImagePath,
      afterImagePath: parsed.data.afterImagePath,
      beforeText: parsed.data.beforeText,
      afterText: parsed.data.afterText,
      facts: parsed.data.facts || [],
      isActive: parsed.data.isActive ?? true,
    };
    await saveContent(
      "reconstructions",
      data.map((i) => (i.id === item.id ? item : i)),
      "cms: update reconstruction"
    );
    return jsonOk({ item: toAdminItem(item) });
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
    const { data } = await loadContent<ReconstructionItem[]>("reconstructions");
    const saved = await saveContent(
      "reconstructions",
      data.filter((i) => i.id !== id),
      "cms: delete reconstruction"
    );
    return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}
