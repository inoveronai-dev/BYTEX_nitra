import { NextResponse } from "next/server";
import { assertSameOrigin, verifyCsrfToken } from "@/lib/auth/csrf";
import { getCurrentAdmin } from "@/lib/auth/session";
import { runMigrations } from "@/lib/db/migrate";

export async function requireAdminApi(request: Request, opts?: { mutate?: boolean }) {
  runMigrations();
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: NextResponse.json({ error: "Neautorizovaný prístup." }, { status: 401 }) };
  }

  if (opts?.mutate) {
    if (!assertSameOrigin(request)) {
      return { error: NextResponse.json({ error: "Neplatný origin požiadavky." }, { status: 403 }) };
    }
    const csrf = request.headers.get("x-csrf-token");
    if (!verifyCsrfToken(csrf)) {
      return { error: NextResponse.json({ error: "Neplatný CSRF token." }, { status: 403 }) };
    }
  }

  return { admin };
}

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
