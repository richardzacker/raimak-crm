import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow login page and API routes through without auth check
  if (pathname.startsWith("/login") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check for MSAL account in cookies
  const hasMsalAccount = request.cookies.getAll()
    .some(cookie => cookie.name.startsWith("msal."));

  if (!hasMsalAccount) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};