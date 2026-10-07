/** Resolve a CMS storage path or legacy public path for Next/Image / <img>. */
export function mediaSrc(pathOrUrl: string | null | undefined) {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  if (pathOrUrl.startsWith("/uploads/")) return pathOrUrl;
  if (pathOrUrl.startsWith("/")) return pathOrUrl; // legacy public/
  return `/uploads/${pathOrUrl.split(/[/\\]/).join("/")}`;
}
