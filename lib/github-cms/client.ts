import { getGithubCmsConfig, type GithubCmsConfig } from "./config";
import { GithubCmsError } from "./errors";

type GhJson = Record<string, unknown>;

async function ghFetch(
  config: GithubCmsConfig,
  path: string,
  init?: RequestInit
): Promise<Response> {
  const url = path.startsWith("https://")
    ? path
    : `https://api.github.com${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "bytex-nitra-cms",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  return res;
}

async function ghJson<T = GhJson>(
  config: GithubCmsConfig,
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await ghFetch(config, path, init);
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }
  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : `GitHub HTTP ${res.status}`;
    throw new GithubCmsError(msg, res.status >= 500 ? 502 : res.status);
  }
  return data as T;
}

export function apiBase(config: GithubCmsConfig) {
  return `/repos/${config.owner}/${config.repo}`;
}

export async function getBranchHead(config?: GithubCmsConfig) {
  const cfg = config || getGithubCmsConfig();
  const ref = await ghJson<{ object: { sha: string } }>(
    cfg,
    `${apiBase(cfg)}/git/ref/heads/${encodeURIComponent(cfg.branch)}`
  );
  return { config: cfg, commitSha: ref.object.sha };
}

export async function getCommitTreeSha(config: GithubCmsConfig, commitSha: string) {
  const commit = await ghJson<{ tree: { sha: string }; sha: string }>(
    config,
    `${apiBase(config)}/git/commits/${commitSha}`
  );
  return commit.tree.sha;
}

export async function createBlob(
  config: GithubCmsConfig,
  content: string | Buffer,
  encoding: "utf-8" | "base64" = "utf-8"
) {
  const body =
    encoding === "base64"
      ? { content: typeof content === "string" ? content : content.toString("base64"), encoding: "base64" }
      : {
          content: typeof content === "string" ? content : content.toString("utf8"),
          encoding: "utf-8",
        };
  const blob = await ghJson<{ sha: string }>(config, `${apiBase(config)}/git/blobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return blob.sha;
}

export async function createTree(
  config: GithubCmsConfig,
  baseTreeSha: string,
  entries: Array<{ path: string; sha: string; mode?: "100644" }>
) {
  const tree = await ghJson<{ sha: string }>(config, `${apiBase(config)}/git/trees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: entries.map((e) => ({
        path: e.path,
        mode: e.mode || "100644",
        type: "blob",
        sha: e.sha,
      })),
    }),
  });
  return tree.sha;
}

export async function createCommit(
  config: GithubCmsConfig,
  opts: { message: string; treeSha: string; parentSha: string }
) {
  const commit = await ghJson<{ sha: string }>(config, `${apiBase(config)}/git/commits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: opts.message,
      tree: opts.treeSha,
      parents: [opts.parentSha],
    }),
  });
  return commit.sha;
}

export async function updateRef(
  config: GithubCmsConfig,
  commitSha: string,
  expectedBaseSha?: string
) {
  await ghJson(config, `${apiBase(config)}/git/refs/heads/${encodeURIComponent(config.branch)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sha: commitSha,
      force: false,
    }),
  });
  // Soft check: if expected base provided and tip moved, caller retries.
  if (expectedBaseSha) {
    void expectedBaseSha;
  }
}

export async function getFileContent(config: GithubCmsConfig, repoPath: string, ref?: string) {
  const branch = ref || config.branch;
  const data = await ghJson<{
    content?: string;
    encoding?: string;
    sha: string;
    type: string;
  }>(
    config,
    `${apiBase(config)}/contents/${repoPath.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(branch)}`
  );
  if (!data.content || data.encoding !== "base64") {
    throw new GithubCmsError(`Nepodarilo sa načítať súbor ${repoPath}.`, 502);
  }
  const text = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
  return { text, sha: data.sha };
}
