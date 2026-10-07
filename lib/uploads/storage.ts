import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getUploadDir } from "@/lib/db/paths";

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

const IMAGE_MAX = 8 * 1024 * 1024;
const DOC_MAX = 15 * 1024 * 1024;

export type UploadKind =
  | "services"
  | "references"
  | "reconstructions"
  | "partners"
  | "documents"
  | "contacts"
  | "hero"
  | "general";

export function publicUploadUrl(storagePath: string) {
  return `/uploads/${storagePath.split(path.sep).join("/")}`;
}

export function resolveUploadAbsolute(storagePath: string) {
  const root = path.resolve(getUploadDir());
  const absolute = path.resolve(root, storagePath);
  if (!absolute.startsWith(root + path.sep) && absolute !== root) {
    throw new Error("Neplatná cesta súboru.");
  }
  return absolute;
}

export async function saveUpload(
  file: File,
  kind: UploadKind,
  mode: "image" | "document" | "any" = "any"
) {
  const mime = file.type;
  const map =
    mode === "image" ? IMAGE_MIME : mode === "document" ? DOC_MIME : { ...IMAGE_MIME, ...DOC_MIME };

  const ext = map[mime];
  if (!ext) {
    throw new Error("Nepovolený typ súboru.");
  }

  const max = IMAGE_MIME[mime] ? IMAGE_MAX : DOC_MAX;
  if (file.size <= 0 || file.size > max) {
    throw new Error("Súbor je prázdny alebo príliš veľký.");
  }

  const filename = `${randomUUID()}${ext}`;
  const relative = path.join(kind, filename);
  const absolute = resolveUploadAbsolute(relative);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(absolute, buffer);

  return {
    path: relative.split(path.sep).join("/"),
    url: publicUploadUrl(relative),
    mimeType: mime,
    fileExt: ext.replace(".", ""),
  };
}

export function deleteUploadIfExists(storagePath: string | null | undefined) {
  if (!storagePath) return;
  try {
    const absolute = resolveUploadAbsolute(storagePath);
    if (fs.existsSync(absolute)) fs.unlinkSync(absolute);
  } catch {
    // ignore invalid paths
  }
}

export function copyPublicAssetToUploads(
  publicRelative: string,
  kind: UploadKind,
  preferredName?: string
) {
  const source = path.join(process.cwd(), "public", publicRelative.replace(/^\//, ""));
  if (!fs.existsSync(source)) {
    throw new Error(`Chýba asset: ${publicRelative}`);
  }
  const ext = path.extname(source) || ".bin";
  const filename = preferredName || `${randomUUID()}${ext}`;
  const relative = path.join(kind, filename).split(path.sep).join("/");
  const dest = resolveUploadAbsolute(relative);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);
  return relative;
}
