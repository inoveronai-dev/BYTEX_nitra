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

type RevisionItem = {
  id: number;
  title: string;
  frequency: string;
  body: string;
  isActive: boolean;
  sortOrder: number;
};

type RevisionsContent = {
  intro: string;
  items: RevisionItem[];
};

const schema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  frequency: z.string().min(1),
  body: z.string().min(1),
  isActive: z.boolean().optional(),
});

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  try {
    const { data } = await loadContent<RevisionsContent>("revisions");
    const items = [...data.items].sort((a, b) => a.sortOrder - b.sortOrder);
    return jsonOk({
      intro: { body: data.intro },
      items,
    });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const body = await request.json().catch(() => null);

  try {
    const { data } = await loadContent<RevisionsContent>("revisions");

    if (body?.action === "saveIntro") {
      const next = { ...data, intro: String(body.body || "") };
      const saved = await saveContent("revisions", next, "cms: update revisions intro");
      return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) return jsonError("Neplatné údaje.");
    const sortOrder = data.items.reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
    const item: RevisionItem = {
      id: nextId(data.items),
      title: parsed.data.title,
      frequency: parsed.data.frequency,
      body: parsed.data.body,
      isActive: parsed.data.isActive ?? true,
      sortOrder,
    };
    await saveContent(
      "revisions",
      { ...data, items: [...data.items, item] },
      "cms: create revision"
    );
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
    const { data } = await loadContent<RevisionsContent>("revisions");

    if (body?.action === "reorder") {
      const items = reorderItems(
        data.items,
        Number(body.id),
        body.direction === "up" ? "up" : "down"
      );
      const saved = await saveContent(
        "revisions",
        { ...data, items },
        "cms: reorder revisions"
      );
      return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
    }

    const parsed = schema.extend({ id: z.number() }).safeParse(body);
    if (!parsed.success) return jsonError("Neplatné údaje.");
    const existing = data.items.find((i) => i.id === parsed.data.id);
    if (!existing) return jsonError("Záznam neexistuje.", 404);

    const item: RevisionItem = {
      ...existing,
      title: parsed.data.title,
      frequency: parsed.data.frequency,
      body: parsed.data.body,
      isActive: parsed.data.isActive ?? true,
    };
    await saveContent(
      "revisions",
      {
        ...data,
        items: data.items.map((i) => (i.id === item.id ? item : i)),
      },
      "cms: update revision"
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
    const { data } = await loadContent<RevisionsContent>("revisions");
    const saved = await saveContent(
      "revisions",
      { ...data, items: data.items.filter((i) => i.id !== id) },
      "cms: delete revision"
    );
    return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}
