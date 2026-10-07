import { requireAdminApi, jsonError, jsonOk } from "@/lib/api/admin-guard";
import { saveUpload, type UploadKind } from "@/lib/uploads/storage";

const KINDS = new Set<UploadKind>([
  "services",
  "references",
  "reconstructions",
  "partners",
  "documents",
  "contacts",
  "hero",
  "general",
]);

export async function POST(request: Request) {
  const gate = await requireAdminApi(request, { mutate: true });
  if ("error" in gate && gate.error) return gate.error;

  const form = await request.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") || "general") as UploadKind;
  const mode = String(form.get("mode") || "any") as "image" | "document" | "any";

  if (!(file instanceof File)) {
    return jsonError("Chýba súbor.");
  }
  if (!KINDS.has(kind)) {
    return jsonError("Neplatný typ uloženia.");
  }

  try {
    const saved = await saveUpload(file, kind, mode);
    return jsonOk(saved);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Nahrávanie zlyhalo.");
  }
}
