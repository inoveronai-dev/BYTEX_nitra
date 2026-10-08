import { z } from "zod";
import {
  jsonError,
  jsonFromUnknownError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin-guard";
import { loadContent, saveContent, SAVE_FLASH } from "@/lib/cms/admin-store";

type ContactContent = {
  contact: {
    person: string;
    email: string;
    phone: string;
    phoneHref: string;
    addressLine1: string;
    addressLine2: string;
    facebookUrl: string;
    instagramUrl: string;
    mapEmbedUrl: string;
    clientCentreIntro: string;
    formIntroBeforeEmail: string;
    formIntroAfterEmail: string;
  };
  hours: Array<{
    day: string;
    timeText: string;
    isOpen: boolean;
    sortOrder: number;
  }>;
  settings: {
    companyName: string;
    ico: string;
    dic: string;
    copyrightText: string;
  };
};

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  try {
    const { data } = await loadContent<ContactContent>("contact");
    return jsonOk({
      contact: data.contact,
      hours: [...data.hours].sort((a, b) => a.sortOrder - b.sortOrder),
      settings: data.settings,
    });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}

const schema = z.object({
  contact: z.object({
    person: z.string().min(1),
    email: z.string().min(1),
    phone: z.string().min(1),
    phoneHref: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().min(1),
    facebookUrl: z.string().min(1),
    instagramUrl: z.string().min(1),
    mapEmbedUrl: z.string().min(1),
    clientCentreIntro: z.string().min(1),
    formIntroBeforeEmail: z.string().min(1),
    formIntroAfterEmail: z.string().min(1),
  }),
  hours: z.array(
    z.object({
      id: z.number().optional(),
      day: z.string(),
      timeText: z.string(),
      isOpen: z.boolean(),
      sortOrder: z.number(),
    })
  ),
  settings: z.object({
    companyName: z.string().min(1),
    ico: z.string().min(1),
    dic: z.string().min(1),
    copyrightText: z.string().min(1),
  }),
});

export async function PUT(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");

  try {
    const next: ContactContent = {
      contact: parsed.data.contact,
      hours: parsed.data.hours.map(({ day, timeText, isOpen, sortOrder }) => ({
        day,
        timeText,
        isOpen,
        sortOrder,
      })),
      settings: parsed.data.settings,
    };
    const saved = await saveContent("contact", next, "cms: update contact");
    return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}
