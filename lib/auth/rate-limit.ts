/** In-memory login rate limit (per server instance). */

type Attempt = { count: number; firstAt: number; lockedUntil?: number };

const attempts = new Map<string, Attempt>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;
const LOCK_MS = 15 * 60 * 1000;

function prune(key: string, now: number) {
  const row = attempts.get(key);
  if (!row) return;
  if (row.lockedUntil && row.lockedUntil < now) {
    attempts.delete(key);
    return;
  }
  if (!row.lockedUntil && now - row.firstAt > WINDOW_MS) {
    attempts.delete(key);
  }
}

export function checkLoginAllowed(key: string): { ok: true } | { ok: false; message: string } {
  const now = Date.now();
  prune(key, now);
  const row = attempts.get(key);
  if (row?.lockedUntil && row.lockedUntil > now) {
    const mins = Math.ceil((row.lockedUntil - now) / 60000);
    return {
      ok: false,
      message: `Príliš veľa neúspešných pokusov. Skúste znova o ${mins} min.`,
    };
  }
  return { ok: true };
}

export function recordLoginFailure(key: string) {
  const now = Date.now();
  prune(key, now);
  const row = attempts.get(key);
  if (!row) {
    attempts.set(key, { count: 1, firstAt: now });
    return;
  }
  row.count += 1;
  if (row.count >= MAX_FAILURES) {
    row.lockedUntil = now + LOCK_MS;
  }
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}
