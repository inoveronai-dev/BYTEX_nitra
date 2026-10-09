import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionCookie } from "@/lib/auth/session-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionCookie(raw);

  if (isAdminApi && !session) {
    const res = NextResponse.json({ error: "Neautorizovaný prístup." }, { status: 401 });
    if (raw) {
      res.cookies.set(SESSION_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
    }
    return res;
  }

  if (isAdminPage && !isLogin && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    const res = NextResponse.redirect(url);
    if (raw) {
      res.cookies.set(SESSION_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
    }
    return res;
  }

  if (isLogin && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
