/**
 * Content storage mode:
 * - sqlite  → local CMS (default when not on Vercel)
 * - static  → committed public snapshot (Vercel / CMS_STORAGE_MODE=static)
 *
 * Prefer explicit CMS_STORAGE_MODE when set; otherwise Vercel ⇒ static.
 */
export type CmsStorageMode = "sqlite" | "static";

export function getCmsStorageMode(): CmsStorageMode {
  const explicit = process.env.CMS_STORAGE_MODE?.trim().toLowerCase();
  if (explicit === "static" || explicit === "sqlite") {
    return explicit;
  }
  if (process.env.VERCEL === "1") {
    return "static";
  }
  return "sqlite";
}

export function isStaticPublicContent(): boolean {
  return getCmsStorageMode() === "static";
}

export function isSqliteCmsEnabled(): boolean {
  return getCmsStorageMode() === "sqlite";
}
