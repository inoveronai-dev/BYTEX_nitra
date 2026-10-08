import { randomUUID } from "node:crypto";
import { isUploadKind, type UploadKind } from "@/lib/content/paths";

const IMAGE_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const DOC_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

/** Vercel body limit ~4.5 MB — keep below with headroom */
export const IMAGE_MAX_BYTES = 3 * 1024 * 1024;
export const DOC_MAX_BYTES = 4 * 1024 * 1024;

export type UploadMode = "image" | "document" | "any";

export function validateUploadFile(
  file: File,
  kind: string,
  mode: UploadMode = "any"
): {
  kind: UploadKind;
  mime: string;
  ext: string;
  filename: string;
  publicPath: string;
} {
  if (!isUploadKind(kind)) {
    throw new Error("Neplatný typ uloženia.");
  }

  const mime = file.type;
  const map =
    mode === "image" ? IMAGE_MIME : mode === "document" ? DOC_MIME : { ...IMAGE_MIME, ...DOC_MIME };
  const ext = map[mime];
  if (!ext) {
    throw new Error("Nepovolený typ súboru.");
  }

  const max = IMAGE_MIME[mime] ? IMAGE_MAX_BYTES : DOC_MAX_BYTES;
  if (file.size <= 0 || file.size > max) {
    const mb = Math.round(max / (1024 * 1024));
    throw new Error(`Súbor je prázdny alebo väčší ako ${mb} MB.`);
  }

  const filename = `${randomUUID()}${ext}`;
  return {
    kind,
    mime,
    ext: ext.replace(".", ""),
    filename,
    publicPath: `/uploads/${kind}/${filename}`,
  };
}
