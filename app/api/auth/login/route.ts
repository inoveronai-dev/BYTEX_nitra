import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword } from "@/lib/auth/password";
import {
  checkLoginAllowed,
  clearLoginFailures,
  recordLoginFailure,
} from "@/lib/auth/rate-limit";
import { createSession } from "@/lib/auth/session";
import { isStaticPublicContent } from "@/lib/content/storage-mode";
import { getDb } from "@/lib/db/client";
import { admins } from "@/lib/db/schema";
import { runMigrations } from "@/lib/db/migrate";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  if (isStaticPublicContent()) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  runMigrations();
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Vyplňte e-mail a heslo." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `${ip}:${email}`;

  const allowed = checkLoginAllowed(key);
  if (!allowed.ok) {
    return NextResponse.json({ error: allowed.message }, { status: 429 });
  }

  const db = getDb();
  const admin = db.select().from(admins).where(eq(admins.email, email)).get();
  const ok = admin ? await verifyPassword(parsed.data.password, admin.passwordHash) : false;

  if (!admin || !ok) {
    recordLoginFailure(key);
    return NextResponse.json({ error: "Nesprávny e-mail alebo heslo." }, { status: 401 });
  }

  clearLoginFailures(key);
  db.update(admins)
    .set({ lastLoginAt: new Date().toISOString() })
    .where(eq(admins.id, admin.id))
    .run();

  await createSession(admin.id, {
    ip,
    userAgent: request.headers.get("user-agent") || undefined,
  });

  return NextResponse.json({ ok: true, email: admin.email });
}
