import { createHash, randomBytes } from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { isStaticPublicContent } from "@/lib/content/storage-mode";
import { getDb } from "@/lib/db/client";
import { admins, sessions } from "@/lib/db/schema";
import { runMigrations } from "@/lib/db/migrate";

export const SESSION_COOKIE = "bytex_session";
const SESSION_DAYS = 7;

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

export function hashToken(token: string) {
  return createHash("sha256")
    .update(`${getSessionSecret()}:${token}`)
    .digest("hex");
}

function cookieSecure() {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;
  return process.env.NODE_ENV === "production";
}

export async function createSession(adminId: number, meta?: { ip?: string; userAgent?: string }) {
  if (isStaticPublicContent()) {
    throw new Error("Admin sessions are disabled in static public content mode.");
  }
  runMigrations();
  const db = getDb();
  const token = randomBytes(32).toString("hex");
  const id = randomBytes(16).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({
    id,
    adminId,
    tokenHash: hashToken(token),
    expiresAt: expires.toISOString(),
    ip: meta?.ip ?? null,
    userAgent: meta?.userAgent ?? null,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${id}.${token}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: "/",
    expires,
  });

  return { id, expires };
}

export async function destroySession() {
  if (isStaticPublicContent()) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: cookieSecure(),
      path: "/",
      maxAge: 0,
    });
    return;
  }
  runMigrations();
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (raw) {
    const [id] = raw.split(".");
    if (id) {
      const db = getDb();
      await db.delete(sessions).where(eq(sessions.id, id));
    }
  }
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
  if (isStaticPublicContent()) return null;
  runMigrations();
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const [id, token] = raw.split(".");
  if (!id || !token) return null;

  const db = getDb();
  const row = db
    .select({
      sessionId: sessions.id,
      tokenHash: sessions.tokenHash,
      expiresAt: sessions.expiresAt,
      adminId: admins.id,
      email: admins.email,
    })
    .from(sessions)
    .innerJoin(admins, eq(sessions.adminId, admins.id))
    .where(eq(sessions.id, id))
    .get();

  if (!row) return null;
  if (new Date(row.expiresAt).getTime() < Date.now()) {
    db.delete(sessions).where(eq(sessions.id, id)).run();
    return null;
  }
  if (row.tokenHash !== hashToken(token)) return null;

  // Sliding expiration (DB only — avoid setting cookies during RSC render)
  const newExpires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  db.update(sessions)
    .set({ expiresAt: newExpires.toISOString() })
    .where(eq(sessions.id, id))
    .run();

  return { id: row.adminId, email: row.email };
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("UNAUTHORIZED");
  }
  return admin;
}

export function purgeExpiredSessions() {
  runMigrations();
  const db = getDb();
  db.delete(sessions).where(lt(sessions.expiresAt, new Date().toISOString())).run();
}
