import fs from "node:fs";
import path from "node:path";
import {
  jsonError,
  jsonFromUnknownError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin-guard";
import { commitUploadFile, isGithubCmsConfigured } from "@/lib/github-cms";
import { validateUploadFile } from "@/lib/uploads/validate";

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;

  const form = await request.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") || "general");
  const mode = String(form.get("mode") || "any") as "image" | "document" | "any";

  if (!(file instanceof File)) {
    return jsonError("Chýba súbor.");
  }

  try {
    const validated = validateUploadFile(file, kind, mode);
    const buffer = Buffer.from(await file.arrayBuffer());
    const publicPath = validated.publicPath;

    if (isGithubCmsConfigured()) {
      await commitUploadFile({
        publicPath,
        buffer,
        message: `cms: upload ${publicPath}`,
      });
    } else {
      if (process.env.NODE_ENV === "production") {
        return jsonError("GitHub CMS nie je nakonfigurovaný. Nastavte GITHUB_CONTENT_TOKEN.", 500);
      }
      const absolute = path.join(
        /*turbopackIgnore: true*/ process.cwd(),
        "public",
        publicPath.replace(/^\//, "")
      );
      fs.mkdirSync(path.dirname(absolute), { recursive: true });
      fs.writeFileSync(absolute, buffer);
    }

    return jsonOk({
      path: publicPath,
      url: publicPath,
      mimeType: validated.mime,
      fileExt: validated.ext,
    });
  } catch (e) {
    return jsonFromUnknownError(e);
  }
}
