import fs from "node:fs";
import path from "node:path";
import { contentRepoPath, type ContentKey } from "@/lib/content/paths";
import { getFileContent, getBranchHead } from "./client";
import { getGithubCmsConfig, isGithubCmsConfigured } from "./config";
import { toSlovakGithubError } from "./errors";

export async function readContentJson<T = unknown>(key: ContentKey): Promise<{
  data: T;
  commitSha: string | null;
  source: "github" | "local";
}> {
  const repoPath = contentRepoPath(key);

  if (isGithubCmsConfigured()) {
    try {
      const config = getGithubCmsConfig();
      const head = await getBranchHead(config);
      const file = await getFileContent(config, repoPath, config.branch);
      return {
        data: JSON.parse(file.text) as T,
        commitSha: head.commitSha,
        source: "github",
      };
    } catch (err) {
      throw toSlovakGithubError(err);
    }
  }

  if (process.env.NODE_ENV === "production") {
    throw toSlovakGithubError(
      new Error("GitHub CMS nie je nakonfigurovaný. Nastavte GITHUB_CONTENT_TOKEN.")
    );
  }

  // Local fallback for development without GitHub token
  const absolute = path.join(/*turbopackIgnore: true*/ process.cwd(), repoPath);
  const text = fs.readFileSync(absolute, "utf8");
  return { data: JSON.parse(text) as T, commitSha: null, source: "local" };
}

export async function writeContentJsonLocal(key: ContentKey, data: unknown) {
  if (process.env.NODE_ENV === "production") {
    throw toSlovakGithubError(
      new Error("Lokálny zápis nie je dostupný v produkcii.")
    );
  }
  const repoPath = contentRepoPath(key);
  const absolute = path.join(/*turbopackIgnore: true*/ process.cwd(), repoPath);
  fs.writeFileSync(absolute, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
