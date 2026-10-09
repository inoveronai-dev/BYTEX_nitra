/**
 * Edge-compatible session cookie verification for middleware.
 * Must stay in sync with encode/decode in lib/auth/session.ts.
 */

export const SESSION_COOKIE = "bytex_session";

type SessionPayload = {
  email: string;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") {
      return null;
    }
    return "dev-only-insecure-session-secret";
  }
  return secret;
}

function fromB64url(input: string) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function toBase64Url(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i)! ^ b.charCodeAt(i)!;
  return out === 0;
}

async function sign(payloadB64: string, secret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  return toBase64Url(sig);
}

/** Returns the session email when the cookie is valid for the configured admin. */
export async function verifySessionCookie(
  raw: string | undefined
): Promise<{ email: string } | null> {
  if (!raw) return null;
  const secret = getSessionSecret();
  if (!secret) return null;

  const [payloadB64, sig] = raw.split(".");
  if (!payloadB64 || !sig) return null;

  const expected = await sign(payloadB64, secret);
  if (!safeEqual(sig, expected)) return null;

  try {
    const payload = JSON.parse(fromB64url(payloadB64)) as SessionPayload;
    if (!payload.email || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!adminEmail || payload.email.toLowerCase() !== adminEmail) return null;

    return { email: payload.email };
  } catch {
    return null;
  }
}
