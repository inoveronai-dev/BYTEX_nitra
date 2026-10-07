import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { loginAttempts } from "@/lib/db/schema";
import { runMigrations } from "@/lib/db/migrate";

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function checkLoginAllowed(key: string): { ok: true } | { ok: false; message: string } {
  runMigrations();
  const db = getDb();
  const row = db.select().from(loginAttempts).where(eq(loginAttempts.key, key)).get();
  if (!row?.windowUntil) return { ok: true };

  const until = new Date(row.windowUntil).getTime();
  if (until > Date.now() && row.failedCount >= MAX_FAILURES) {
    return {
      ok: false,
      message: "Príliš veľa neúspešných pokusov. Skúste to znova o 15 minút.",
    };
  }
  if (until <= Date.now()) {
    db.delete(loginAttempts).where(eq(loginAttempts.key, key)).run();
  }
  return { ok: true };
}

export function recordLoginFailure(key: string) {
  runMigrations();
  const db = getDb();
  const row = db.select().from(loginAttempts).where(eq(loginAttempts.key, key)).get();
  const now = Date.now();
  const windowUntil = new Date(now + WINDOW_MS).toISOString();

  if (!row) {
    db.insert(loginAttempts)
      .values({
        key,
        failedCount: 1,
        windowUntil,
        updatedAt: new Date().toISOString(),
      })
      .run();
    return;
  }

  const previousUntil = row.windowUntil ? new Date(row.windowUntil).getTime() : 0;
  const count = previousUntil > now ? row.failedCount + 1 : 1;

  db.update(loginAttempts)
    .set({
      failedCount: count,
      windowUntil,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(loginAttempts.key, key))
    .run();
}

export function clearLoginFailures(key: string) {
  runMigrations();
  const db = getDb();
  db.delete(loginAttempts).where(eq(loginAttempts.key, key)).run();
}
