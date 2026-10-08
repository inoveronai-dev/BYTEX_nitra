import { NextResponse } from "next/server";
import { assertSameOrigin, verifyCsrfToken } from "@/lib/auth/csrf";
import { getCurrentAdmin } from "@/lib/auth/session";
import { GithubCmsError } from "@/lib/github-cms/errors";

export async function requireAdminApi(request: Request, opts?: { mutate?: boolean }) {
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

export function jsonFromUnknownError(error: unknown) {
  if (error instanceof GithubCmsError) {
    return jsonError(error.message, error.status);
  }
  const message = error instanceof Error ? error.message : "Operácia zlyhala.";
  return jsonError(message, 500);
}
