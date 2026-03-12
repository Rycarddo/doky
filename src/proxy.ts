import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const sessionCookie =
    req.cookies.get("better-auth.session_token") ??
    req.cookies.get("__Secure-better-auth.session_token");

  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/login";
  const isAdminPage = pathname.startsWith("/admin");

  // Redirect unauthenticated users to login
  if (!sessionCookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users away from login
  if (sessionCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect /admin: check role via session API
  if (sessionCookie && isAdminPage) {
    const sessionRes = await fetch(new URL("/api/auth/get-session", req.url), {
      headers: { cookie: req.headers.get("cookie") ?? "" },
    });
    const session = await sessionRes.json();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
