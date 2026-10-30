import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

function secret() {
  return process.env.SESSION_SECRET || "dev-only-insecure-session-secret";
}

export function createCsrfToken() {
  const nonce = randomBytes(16).toString("hex");
  const sig = createHmac("sha256", secret()).update(nonce).digest("hex");
  return `${nonce}.${sig}`;
}

export function verifyCsrfToken(token: string | null | undefined) {
  if (!token) return false;
  const [nonce, sig] = token.split(".");
  if (!nonce || !sig) return false;
  const expected = createHmac("sha256", secret()).update(nonce).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

/** Explicit BYTEX production hosts — never a broad wildcard. */
const TRUSTED_PRODUCTION_HOSTS = [
  "bytexnitra.sk",
  "www.bytexnitra.sk",
  "bytexnitra.vercel.app",
] as const;

function normalizeCandidateUrl(raw: string): URL | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    // Drop default ports; keep non-default (e.g. localhost:3000)
    url.hash = "";
    url.search = "";
    url.pathname = "/";
    return url;
  } catch {
    return null;
  }
}

function addOrigin(allowed: Set<string>, raw: string | undefined | null) {
  const url = raw ? normalizeCandidateUrl(raw) : null;
  if (!url) return;

  allowed.add(url.origin);

  // www ↔ apex variants for real site hosts only (not hashed Vercel deployment URLs)
  if (url.protocol === "https:" && !url.port && shouldAddWwwVariant(url.hostname)) {
    const host = url.hostname.toLowerCase();
    if (host.startsWith("www.")) {
      allowed.add(`https://${host.slice(4)}`);
    } else {
      allowed.add(`https://www.${host}`);
    }
  }
}

function shouldAddWwwVariant(hostname: string): boolean {
  const host = hostname.toLowerCase();
  // Never invent www.* for Vercel deployment hosts (also 3 labels).
  // Stable aliases are listed explicitly in TRUSTED_PRODUCTION_HOSTS.
  if (host.endsWith(".vercel.app")) return false;
  const labels = host.split(".");
  // Apex (bytexnitra.sk) or www.apex
  return labels.length === 2 || (labels.length === 3 && labels[0] === "www");
}

/**
 * Origins allowed for mutating admin API calls.
 * Built only from configured URLs + explicit trusted BYTEX hosts + current Vercel deployment hosts.
 */
export function allowedOrigins(): Set<string> {
  const allowed = new Set<string>();

  addOrigin(allowed, process.env.APP_URL);
  addOrigin(allowed, process.env.VERCEL_URL);
  addOrigin(allowed, process.env.VERCEL_BRANCH_URL);
  addOrigin(allowed, process.env.VERCEL_PROJECT_PRODUCTION_URL);

  for (const host of TRUSTED_PRODUCTION_HOSTS) {
    addOrigin(allowed, `https://${host}`);
  }

  // Local development (also covered when APP_URL is localhost)
  addOrigin(allowed, "http://localhost:3000");
  addOrigin(allowed, "http://127.0.0.1:3000");

  return allowed;
}

export function assertSameOrigin(request: Request) {
  const allowed = allowedOrigins();
  if (!allowed.size) {
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }

  const origin = request.headers.get("origin")?.trim() || null;
  const referer = request.headers.get("referer")?.trim() || null;

  if (origin) {
    try {
      return allowed.has(new URL(origin).origin);
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      return allowed.has(new URL(referer).origin);
    } catch {
      return false;
    }
  }

  // Same-site navigations may omit Origin; allow when cookie present and no cross-origin header
  return true;
}
