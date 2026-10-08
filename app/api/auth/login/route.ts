import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword } from "@/lib/auth/password";
import {
  checkLoginAllowed,
  clearLoginFailures,
  recordLoginFailure,
} from "@/lib/auth/rate-limit";
import { createSession, getAdminCredentials } from "@/lib/auth/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Vyplňte e-mail a heslo." }, { status: 400 });
  }

  const creds = getAdminCredentials();
  if (!creds) {
    return NextResponse.json(
      { error: "Admin nie je nakonfigurovaný (ADMIN_EMAIL / ADMIN_PASSWORD_HASH)." },
      { status: 500 }
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `${ip}:${email}`;

  const allowed = checkLoginAllowed(key);
  if (!allowed.ok) {
    return NextResponse.json({ error: allowed.message }, { status: 429 });
  }

  const emailOk = email === creds.email;
  const passwordOk = emailOk
    ? await verifyPassword(parsed.data.password, creds.passwordHash)
    : false;

  if (!emailOk || !passwordOk) {
    recordLoginFailure(key);
    return NextResponse.json({ error: "Nesprávny e-mail alebo heslo." }, { status: 401 });
  }

  clearLoginFailures(key);
  await createSession(email);

  return NextResponse.json({ ok: true, email });
}
