import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "bytex_session";
const SESSION_DAYS = 7;

type SessionPayload = {
  email: string;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set to a long random value in production.");
    }
    return "dev-only-insecure-session-secret";
  }
  return secret;
}

function cookieSecure() {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;
  return process.env.NODE_ENV === "production";
}

function b64url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromB64url(input: string) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function sign(payloadB64: string) {
  return createHmac("sha256", getSessionSecret()).update(payloadB64).digest("base64url");
}

function encodeSession(payload: SessionPayload) {
  const payloadB64 = b64url(JSON.stringify(payload));
  return `${payloadB64}.${sign(payloadB64)}`;
}

function decodeSession(raw: string): SessionPayload | null {
  const [payloadB64, sig] = raw.split(".");
  if (!payloadB64 || !sig) return null;
  const expected = sign(payloadB64);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(fromB64url(payloadB64)) as SessionPayload;
    if (!payload.email || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!email || !passwordHash) return null;
  return { email, passwordHash };
}

export async function createSession(email: string) {
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const token = encodeSession({ email: email.toLowerCase(), exp: expires.getTime() });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: "/",
    expires,
  });
  return { expires };
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: "/",
    maxAge: 0,
  });
}

export type AuthAdmin = {
  id: number;
  email: string;
};

export async function getCurrentAdmin(): Promise<AuthAdmin | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const payload = decodeSession(raw);
  if (!payload) return null;
  const creds = getAdminCredentials();
  if (!creds || creds.email !== payload.email.toLowerCase()) return null;
  return { id: 1, email: payload.email };
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("UNAUTHORIZED");
  }
  return admin;
}

/** @deprecated No DB sessions in GitHub CMS mode. */
export function purgeExpiredSessions() {
  // no-op
}

/** Kept for compatibility with older imports. */
export function hashToken(_token: string) {
  return "";
}
