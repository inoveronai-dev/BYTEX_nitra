import { z } from "zod";
import {
  jsonError,
  jsonFromUnknownError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin-guard";
import { loadContent, saveContent, SAVE_FLASH } from "@/lib/cms/admin-store";

type HeroContent = {
  headlineLines: string[];
  imageSrc: string;
  changeManager: {
    intro: string;
    quotes: Array<{ text: string; citation?: string }>;
    downloadUrl: string | null;
    downloadPath: string | null;
    backgroundImagePath: string | null;
  };
};

export async function GET(request: Request) {
  const gate = await requireAdminApi(request);
  if ("error" in gate && gate.error) return gate.error;
  try {
    const { data } = await loadContent<HeroContent>("hero");
    return jsonOk({
      hero: {
        headlineLinesJson: JSON.stringify(data.headlineLines),
        imagePath: data.imageSrc,
      },
      changeManager: {
        intro: data.changeManager.intro,
        quotesJson: JSON.stringify(data.changeManager.quotes),
        downloadPath: data.changeManager.downloadPath,
        downloadUrl: data.changeManager.downloadUrl,
        backgroundImagePath: data.changeManager.backgroundImagePath,
      },
    });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}

const schema = z.object({
  headlineLines: z.array(z.string()).min(1),
  imagePath: z.string().nullable().optional(),
  changeManager: z
    .object({
      intro: z.string(),
      quotes: z.array(
        z.object({
          text: z.string(),
          citation: z.string().optional(),
        })
      ),
      downloadPath: z.string().nullable().optional(),
      downloadUrl: z.string().nullable().optional(),
      backgroundImagePath: z.string().nullable().optional(),
    })
    .optional(),
});

export async function PUT(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Neplatné údaje.");

  try {
    const { data: existing } = await loadContent<HeroContent>("hero");
    const cm = parsed.data.changeManager;
    const next: HeroContent = {
      headlineLines: parsed.data.headlineLines,
      imageSrc: parsed.data.imagePath || existing.imageSrc,
      changeManager: cm
        ? {
            intro: cm.intro,
            quotes: cm.quotes,
            downloadPath: cm.downloadPath ?? null,
            downloadUrl: cm.downloadUrl ?? null,
            backgroundImagePath:
              cm.backgroundImagePath ?? existing.changeManager.backgroundImagePath,
          }
        : existing.changeManager,
    };
    const saved = await saveContent("hero", next, "cms: update hero");
    return jsonOk({ ok: true, message: SAVE_FLASH, commitSha: saved.commitSha });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}
