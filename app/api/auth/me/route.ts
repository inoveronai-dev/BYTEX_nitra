import { NextResponse } from "next/server";
import { createCsrfToken } from "@/lib/auth/csrf";
import { getCurrentAdmin } from "@/lib/auth/session";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    email: admin.email,
    csrfToken: createCsrfToken(),
  });
}
