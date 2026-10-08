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

type PrivacyItem = {
  id: number;
  heading: string;
  body: string;
  isActive: boolean;
  sortOrder: number;
};

const schema = z.object({
  id: z.number().optional(),
  heading: z.string().min(1),
  body: z.string().min(1),
  isActive: z.boolean().optional(),
});

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  try {
    const { data } = await loadContent<PrivacyItem[]>("privacy");
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
    const { data } = await loadContent<PrivacyItem[]>("privacy");
    const sortOrder = data.reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
    const item: PrivacyItem = {
      id: nextId(data),
      heading: parsed.data.heading,
      body: parsed.data.body,
      isActive: parsed.data.isActive ?? true,
      sortOrder,
    };
    await saveContent("privacy", [...data, item], "cms: create privacy section");
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
    const { data } = await loadContent<PrivacyItem[]>("privacy");

    if (body?.action === "reorder") {
      const next = reorderItems(data, Number(body.id), body.direction === "up" ? "up" : "down");
      const saved = await saveContent("privacy", next, "cms: reorder privacy");
      return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
    }

    const parsed = schema.extend({ id: z.number() }).safeParse(body);
    if (!parsed.success) return jsonError("Neplatné údaje.");
    const existing = data.find((i) => i.id === parsed.data.id);
    if (!existing) return jsonError("Záznam neexistuje.", 404);

    const item: PrivacyItem = {
      ...existing,
      heading: parsed.data.heading,
      body: parsed.data.body,
      isActive: parsed.data.isActive ?? true,
    };
    await saveContent(
      "privacy",
      data.map((i) => (i.id === item.id ? item : i)),
      "cms: update privacy section"
    );
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
    const { data } = await loadContent<PrivacyItem[]>("privacy");
    const saved = await saveContent(
      "privacy",
      data.filter((i) => i.id !== id),
      "cms: delete privacy section"
    );
    return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}
