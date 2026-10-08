/** Allowlisted CMS content JSON files (repo-relative). */
export const CONTENT_FILES = {
  hero: "content/hero.json",
  about: "content/about.json",
  benefits: "content/benefits.json",
  services: "content/services.json",
  revisions: "content/revisions.json",
  references: "content/references.json",
  reconstructions: "content/reconstructions.json",
  partners: "content/partners.json",
  documents: "content/documents.json",
  pricing: "content/pricing.json",
  importantContacts: "content/important-contacts.json",
  contact: "content/contact.json",
  privacy: "content/privacy.json",
} as const;

export type ContentKey = keyof typeof CONTENT_FILES;

export const CONTENT_KEYS = Object.keys(CONTENT_FILES) as ContentKey[];

/** Allowlisted upload kind folders under public/uploads. */
export const UPLOAD_KINDS = [
  "hero",
  "services",
  "references",
  "reconstructions",
  "partners",
  "documents",
  "contacts",
  "general",
] as const;

export type UploadKind = (typeof UPLOAD_KINDS)[number];

export function isUploadKind(value: string): value is UploadKind {
  return (UPLOAD_KINDS as readonly string[]).includes(value);
}

/** Normalize a public upload path: /uploads/<kind>/<file> */
export function assertSafeUploadPath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");
  if (!normalized.startsWith("/uploads/")) {
    throw new Error("Neplatná cesta súboru.");
  }
  const parts = normalized.slice("/uploads/".length).split("/").filter(Boolean);
  if (parts.length !== 2) {
    throw new Error("Neplatná cesta súboru.");
  }
  const [kind, file] = parts;
  if (!isUploadKind(kind)) {
    throw new Error("Neplatný typ súboru.");
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(file) || file.includes("..")) {
    throw new Error("Neplatný názov súboru.");
  }
  return `/uploads/${kind}/${file}`;
}

export function uploadRepoPath(publicPath: string): string {
  const safe = assertSafeUploadPath(publicPath);
  return `public${safe}`;
}

export function contentRepoPath(key: ContentKey): string {
  return CONTENT_FILES[key];
}
