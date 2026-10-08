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

type ServiceItem = {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  imageClassName: string | null;
  imageOverlayClassName: string | null;
  isActive: boolean;
  sortOrder: number;
};

const upsertSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  imagePath: z.string().min(1),
  imageClassName: z.string().nullable().optional(),
  imageOverlayClassName: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  try {
    const { data } = await loadContent<ServiceItem[]>("services");
    const items = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
    return jsonOk({ items });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = upsertSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");

  try {
    const { data } = await loadContent<ServiceItem[]>("services");
    const sortOrder = data.reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
    const item: ServiceItem = {
      id: nextId(data),
      title: parsed.data.title,
      description: parsed.data.description,
      imagePath: parsed.data.imagePath,
      imageClassName: parsed.data.imageClassName ?? null,
      imageOverlayClassName: parsed.data.imageOverlayClassName ?? null,
      isActive: parsed.data.isActive ?? true,
      sortOrder,
    };
    await saveContent("services", [...data, item], "cms: create service");
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
    const { data } = await loadContent<ServiceItem[]>("services");

    if (body?.action === "reorder") {
      const next = reorderItems(data, Number(body.id), body.direction === "up" ? "up" : "down");
      const saved = await saveContent("services", next, "cms: reorder services");
      return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
    }

    const parsed = upsertSchema.extend({ id: z.number() }).safeParse(body);
    if (!parsed.success) return jsonError("Neplatné údaje.");
    const existing = data.find((i) => i.id === parsed.data.id);
    if (!existing) return jsonError("Záznam neexistuje.", 404);

    const item: ServiceItem = {
      ...existing,
      title: parsed.data.title,
      description: parsed.data.description,
      imagePath: parsed.data.imagePath,
      imageClassName: parsed.data.imageClassName ?? null,
      imageOverlayClassName: parsed.data.imageOverlayClassName ?? null,
      isActive: parsed.data.isActive ?? existing.isActive,
    };
    await saveContent(
      "services",
      data.map((i) => (i.id === item.id ? item : i)),
      "cms: update service"
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
    const { data } = await loadContent<ServiceItem[]>("services");
    const saved = await saveContent(
      "services",
      data.filter((i) => i.id !== id),
      "cms: delete service"
    );
    return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}
