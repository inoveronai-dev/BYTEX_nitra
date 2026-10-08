import { assertSafeUploadPath, contentRepoPath, type ContentKey, uploadRepoPath } from "@/lib/content/paths";
import {
  createBlob,
  createCommit,
  createTree,
  getBranchHead,
  getCommitTreeSha,
  updateRef,
} from "./client";
import { getGithubCmsConfig } from "./config";
import { GithubCmsError, toSlovakGithubError } from "./errors";

export type CommitFile =
  | { path: string; text: string }
  | { path: string; binary: Buffer };

function assertAllowlistedRepoPath(repoPath: string) {
  if (repoPath.startsWith("content/") && repoPath.endsWith(".json")) {
    const allowed = Object.values(
      // lazy import values via contentRepoPath keys
      (
        [
          "hero",
          "about",
          "benefits",
          "services",
          "revisions",
          "references",
          "reconstructions",
          "partners",
          "documents",
          "pricing",
          "importantContacts",
          "contact",
          "privacy",
        ] as ContentKey[]
      ).map(contentRepoPath)
    );
    if (!allowed.includes(repoPath)) {
      throw new GithubCmsError("Nepovolená cesta obsahu.");
    }
    return;
  }
  if (repoPath.startsWith("public/uploads/")) {
    const publicPath = repoPath.replace(/^public/, "");
    assertSafeUploadPath(publicPath);
    return;
  }
  throw new GithubCmsError("Nepovolená cesta súboru.");
}

async function commitOnce(files: CommitFile[], message: string, baseCommitSha?: string) {
  const config = getGithubCmsConfig();
  const head = await getBranchHead(config);
  const parentSha = baseCommitSha || head.commitSha;
  if (baseCommitSha && baseCommitSha !== head.commitSha) {
    throw new GithubCmsError(
      "Konflikt pri ukladaní. Obsah sa medzitým zmenil. Skúste znova.",
      409
    );
  }

  const baseTreeSha = await getCommitTreeSha(config, parentSha);
  const entries: Array<{ path: string; sha: string }> = [];

  for (const file of files) {
    assertAllowlistedRepoPath(file.path);
    if ("text" in file) {
      const sha = await createBlob(config, file.text, "utf-8");
      entries.push({ path: file.path, sha });
    } else {
      const sha = await createBlob(config, file.binary, "base64");
      entries.push({ path: file.path, sha });
    }
  }

  const treeSha = await createTree(config, baseTreeSha, entries);
  const commitSha = await createCommit(config, {
    message,
    treeSha,
    parentSha,
  });

  // Re-check tip before updating ref
  const tip = await getBranchHead(config);
  if (tip.commitSha !== parentSha) {
    throw new GithubCmsError(
      "Konflikt pri ukladaní. Obsah sa medzitým zmenil. Skúste znova.",
      409
    );
  }

  await updateRef(config, commitSha, parentSha);
  return { commitSha, branch: config.branch };
}

/** One admin action = one commit. Retries once on conflict. */
export async function commitFiles(files: CommitFile[], message: string) {
  if (!files.length) {
    throw new GithubCmsError("Žiadne súbory na uloženie.");
  }
  try {
    return await commitOnce(files, message);
  } catch (err) {
    const first = toSlovakGithubError(err);
    if (first.status !== 409) throw first;
    try {
      return await commitOnce(files, message);
    } catch (err2) {
      throw toSlovakGithubError(err2);
    }
  }
}

export async function commitContentJson(key: ContentKey, data: unknown, message: string) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  return commitFiles([{ path: contentRepoPath(key), text }], message);
}

export async function commitUploadFile(opts: {
  publicPath: string;
  buffer: Buffer;
  message: string;
  extraJson?: { key: ContentKey; data: unknown };
}) {
  const repoPath = uploadRepoPath(opts.publicPath);
  const files: CommitFile[] = [{ path: repoPath, binary: opts.buffer }];
  if (opts.extraJson) {
    files.push({
      path: contentRepoPath(opts.extraJson.key),
      text: `${JSON.stringify(opts.extraJson.data, null, 2)}\n`,
    });
  }
  return commitFiles(files, opts.message);
}
