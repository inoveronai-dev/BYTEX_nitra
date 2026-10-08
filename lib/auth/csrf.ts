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

function allowedOrigins(): Set<string> {
  const allowed = new Set<string>();
  const appUrl = process.env.APP_URL?.trim();
  if (appUrl) {
    try {
      allowed.add(new URL(appUrl).origin);
    } catch {
      // ignore
    }
  }
  // Vercel preview / deployment host
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    const host = vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
    try {
      allowed.add(new URL(host).origin);
    } catch {
      // ignore
    }
  }
  const vercelBranch = process.env.VERCEL_BRANCH_URL?.trim();
  if (vercelBranch) {
    const host = vercelBranch.startsWith("http") ? vercelBranch : `https://${vercelBranch}`;
    try {
      allowed.add(new URL(host).origin);
    } catch {
      // ignore
    }
  }
  return allowed;
}

export function assertSameOrigin(request: Request) {
  const allowed = allowedOrigins();
  if (!allowed.size) {
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin) return allowed.has(origin);
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
