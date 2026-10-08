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

type DocumentItem = {
  id: number;
  title: string;
  filePath: string | null;
  externalUrl: string | null;
  mimeType: string | null;
  fileExt: string | null;
  isActive: boolean;
  sortOrder: number;
};

type DocumentsContent = {
  intro: string;
  items: DocumentItem[];
};

const schema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  filePath: z.string().nullable().optional(),
  externalUrl: z.string().nullable().optional(),
  mimeType: z.string().nullable().optional(),
  fileExt: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  try {
    const { data } = await loadContent<DocumentsContent>("documents");
    const items = [...data.items].sort((a, b) => a.sortOrder - b.sortOrder);
    return jsonOk({
      intro: data.intro != null ? { body: data.intro } : null,
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
    const { data } = await loadContent<DocumentsContent>("documents");

    if (body?.action === "saveIntro") {
      const next = { ...data, intro: String(body.body || "") };
      const saved = await saveContent("documents", next, "cms: update documents intro");
      return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) return jsonError("Neplatné údaje.");
    if (!parsed.data.filePath && !parsed.data.externalUrl) {
      return jsonError("Nahrajte súbor alebo zadajte URL.");
    }

    const sortOrder = data.items.reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
    const item: DocumentItem = {
      id: nextId(data.items),
      title: parsed.data.title,
      filePath: parsed.data.filePath || null,
      externalUrl: parsed.data.externalUrl || null,
      mimeType: parsed.data.mimeType || null,
      fileExt: parsed.data.fileExt || null,
      isActive: parsed.data.isActive ?? true,
      sortOrder,
    };
    await saveContent(
      "documents",
      { ...data, items: [...data.items, item] },
      "cms: create document"
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
    const { data } = await loadContent<DocumentsContent>("documents");

    if (body?.action === "reorder") {
      const items = reorderItems(
        data.items,
        Number(body.id),
        body.direction === "up" ? "up" : "down"
      );
      const saved = await saveContent(
        "documents",
        { ...data, items },
        "cms: reorder documents"
      );
      return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
    }

    const parsed = schema.extend({ id: z.number() }).safeParse(body);
    if (!parsed.success) return jsonError("Neplatné údaje.");
    const existing = data.items.find((i) => i.id === parsed.data.id);
    if (!existing) return jsonError("Záznam neexistuje.", 404);

    const item: DocumentItem = {
      ...existing,
      title: parsed.data.title,
      filePath: parsed.data.filePath ?? null,
      externalUrl: parsed.data.externalUrl ?? null,
      mimeType: parsed.data.mimeType ?? null,
      fileExt: parsed.data.fileExt ?? null,
      isActive: parsed.data.isActive ?? true,
    };
    await saveContent(
      "documents",
      {
        ...data,
        items: data.items.map((i) => (i.id === item.id ? item : i)),
      },
      "cms: update document"
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
    const { data } = await loadContent<DocumentsContent>("documents");
    const saved = await saveContent(
      "documents",
      { ...data, items: data.items.filter((i) => i.id !== id) },
      "cms: delete document"
    );
    return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}
