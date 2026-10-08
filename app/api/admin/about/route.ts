import { z } from "zod";
import {
  jsonError,
  jsonFromUnknownError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin-guard";
import { loadContent, saveContent, SAVE_FLASH } from "@/lib/cms/admin-store";

type AboutContent = {
  eyebrow: string;
  heading: string;
  body: string;
};

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  try {
    const { data } = await loadContent<AboutContent>("about");
    return jsonOk({ item: data });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}

const schema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  body: z.string().min(1),
});

export async function PUT(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");

  try {
    const saved = await saveContent("about", parsed.data, "cms: update about");
    return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}
