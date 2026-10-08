import { GithubCmsError } from "./errors";

export type GithubCmsConfig = {
  owner: string;
  repo: string;
  branch: string;
  token: string;
};

export function getGithubCmsConfig(): GithubCmsConfig {
  const owner = process.env.GITHUB_OWNER?.trim();
  const repo = process.env.GITHUB_REPO?.trim();
  const branch = process.env.GITHUB_BRANCH?.trim() || "main";
  const token = process.env.GITHUB_CONTENT_TOKEN?.trim();

  if (!owner || !repo || !token) {
    throw new GithubCmsError(
      "Chýba konfigurácia GitHub CMS (GITHUB_OWNER, GITHUB_REPO, GITHUB_CONTENT_TOKEN).",
      500
    );
  }

  return { owner, repo, branch, token };
}

export function isGithubCmsConfigured() {
  return Boolean(
    process.env.GITHUB_OWNER?.trim() &&
      process.env.GITHUB_REPO?.trim() &&
      process.env.GITHUB_CONTENT_TOKEN?.trim()
  );
}
