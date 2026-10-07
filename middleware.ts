import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "bytex_session";

function isVercelStaticPublic() {
  const mode = process.env.CMS_STORAGE_MODE?.trim().toLowerCase();
  if (mode === "sqlite") return false;
  if (mode === "static") return true;
  return process.env.VERCEL === "1";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");
  const isAuthApi = pathname.startsWith("/api/auth");
  const isUploadApi = pathname.startsWith("/uploads");

  // Vercel public mode: admin / auth / local uploads are local-CMS only.
  if (isVercelStaticPublic() && (isAdminPage || isAdminApi || isAuthApi || isUploadApi)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (isAdminApi && !hasSession) {
    return NextResponse.json({ error: "Neautorizovaný prístup." }, { status: 401 });
  }

  if (isAdminPage && !isLogin && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isLogin && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*", "/uploads/:path*"],
};
