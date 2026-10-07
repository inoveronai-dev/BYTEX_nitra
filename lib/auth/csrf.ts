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

export function assertSameOrigin(request: Request) {
  const appUrl = process.env.APP_URL;
  if (!appUrl) {
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const allowed = new URL(appUrl).origin;

  if (origin) return origin === allowed;
  if (referer) {
    try {
      return new URL(referer).origin === allowed;
    } catch {
      return false;
    }
  }
  // Same-site navigations may omit Origin; allow when cookie present and no cross-origin header
  return true;
}
