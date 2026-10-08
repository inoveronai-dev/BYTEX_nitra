export class GithubCmsError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "GithubCmsError";
    this.status = status;
  }
}

export function toSlovakGithubError(error: unknown): GithubCmsError {
  if (error instanceof GithubCmsError) return error;
  const message = error instanceof Error ? error.message : String(error);
  if (/conflict|not a fast forward|Reference update failed/i.test(message)) {
    return new GithubCmsError(
      "Konflikt pri ukladaní. Obsah sa medzitým zmenil. Skúste znova.",
      409
    );
  }
  if (/Bad credentials|401|Unauthorized/i.test(message)) {
    return new GithubCmsError("GitHub autentifikácia zlyhala. Skontrolujte GITHUB_CONTENT_TOKEN.", 502);
  }
  if (/403|rate limit/i.test(message)) {
    return new GithubCmsError("GitHub API odmietlo požiadavku. Skúste neskôr.", 502);
  }
  return new GithubCmsError(
    message.startsWith("GitHub") ? message : `Uloženie na GitHub zlyhalo: ${message}`,
    502
  );
}
