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

type ContactItem = {
  id: number;
  groupKey: "emergency" | "service_partner" | "utility";
  name: string;
  details: string | null;
  logoPath: string | null;
  imageAlt: string | null;
  websiteLabel: string | null;
  websiteUrl: string | null;
  contactsJson: string;
  isActive: boolean;
  sortOrder: number;
};

const schema = z.object({
  id: z.number().optional(),
  groupKey: z.enum(["emergency", "service_partner", "utility"]),
  name: z.string().min(1),
  details: z.string().nullable().optional(),
  logoPath: z.string().nullable().optional(),
  imageAlt: z.string().nullable().optional(),
  websiteLabel: z.string().nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  contactsJson: z.string().min(2),
  isActive: z.boolean().optional(),
});

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  try {
    const { data } = await loadContent<ContactItem[]>("importantContacts");
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
    const { data } = await loadContent<ContactItem[]>("importantContacts");
    const sortOrder = data.reduce((m, r) => Math.max(m, r.sortOrder), -1) + 1;
    const item: ContactItem = {
      id: nextId(data),
      groupKey: parsed.data.groupKey,
      name: parsed.data.name,
      details: parsed.data.details ?? null,
      logoPath: parsed.data.logoPath ?? null,
      imageAlt: parsed.data.imageAlt ?? null,
      websiteLabel: parsed.data.websiteLabel ?? null,
      websiteUrl: parsed.data.websiteUrl ?? null,
      contactsJson: parsed.data.contactsJson,
      isActive: parsed.data.isActive ?? true,
      sortOrder,
    };
    await saveContent("importantContacts", [...data, item], "cms: create contact");
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
    const { data } = await loadContent<ContactItem[]>("importantContacts");

    if (body?.action === "reorder") {
      const next = reorderItems(data, Number(body.id), body.direction === "up" ? "up" : "down");
      const saved = await saveContent("importantContacts", next, "cms: reorder contacts");
      return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
    }

    const parsed = schema.extend({ id: z.number() }).safeParse(body);
    if (!parsed.success) return jsonError("Neplatné údaje.");
    const existing = data.find((i) => i.id === parsed.data.id);
    if (!existing) return jsonError("Záznam neexistuje.", 404);

    const item: ContactItem = {
      ...existing,
      groupKey: parsed.data.groupKey,
      name: parsed.data.name,
      details: parsed.data.details ?? null,
      logoPath: parsed.data.logoPath ?? null,
      imageAlt: parsed.data.imageAlt ?? null,
      websiteLabel: parsed.data.websiteLabel ?? null,
      websiteUrl: parsed.data.websiteUrl ?? null,
      contactsJson: parsed.data.contactsJson,
      isActive: parsed.data.isActive ?? true,
    };
    await saveContent(
      "importantContacts",
      data.map((i) => (i.id === item.id ? item : i)),
      "cms: update contact"
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
    const { data } = await loadContent<ContactItem[]>("importantContacts");
    const saved = await saveContent(
      "importantContacts",
      data.filter((i) => i.id !== id),
      "cms: delete contact"
    );
    return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}
