import type { ContentKey } from "@/lib/content/paths";
import {
  commitContentJson,
  isGithubCmsConfigured,
  readContentJson,
  writeContentJsonLocal,
} from "@/lib/github-cms";
import { GithubCmsError } from "@/lib/github-cms/errors";

export const SAVE_FLASH =
  "Zmeny boli uložené. Web sa aktualizuje (zvyčajne do 1–2 minút).";

export async function loadContent<T>(key: ContentKey) {
  return readContentJson<T>(key);
}

export async function saveContent<T>(
  key: ContentKey,
  data: T,
  message: string
): Promise<{ commitSha: string | null; message: string }> {
  if (isGithubCmsConfigured()) {
    const result = await commitContentJson(key, data, message);
    return { commitSha: result.commitSha, message: SAVE_FLASH };
  }
  if (process.env.NODE_ENV === "production") {
    throw new GithubCmsError(
      "GitHub CMS nie je nakonfigurovaný. Nastavte GITHUB_CONTENT_TOKEN.",
      500
    );
  }
  await writeContentJsonLocal(key, data);
  return { commitSha: null, message: "Uložené lokálne (dev bez GitHub tokenu)." };
}

export function nextId(items: Array<{ id: number }>) {
  return items.reduce((m, r) => Math.max(m, r.id), 0) + 1;
}

export function reorderItems<T extends { id: number; sortOrder: number }>(
  items: T[],
  id: number,
  direction: "up" | "down"
): T[] {
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  const index = sorted.findIndex((i) => i.id === id);
  if (index < 0) return items;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= sorted.length) return items;
  const a = sorted[index];
  const b = sorted[swapWith];
  const orderA = a.sortOrder;
  const orderB = b.sortOrder;
  return items.map((item) => {
    if (item.id === a.id) return { ...item, sortOrder: orderB };
    if (item.id === b.id) return { ...item, sortOrder: orderA };
    return item;
  });
}
