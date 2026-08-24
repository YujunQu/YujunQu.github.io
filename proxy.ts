import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME, verifySession } from "./lib/session";

const PUBLIC_PATHS = ["/login", "/forbidden"];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) {
    return true;
  }

  return pathname.startsWith("/_next") || pathname.startsWith("/favicon");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.rewrite(new URL("/login", request.url));
  }

  const session = await verifySession(token);
  if (!session) {
    return NextResponse.rewrite(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
    return NextResponse.rewrite(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|api/auth).*)"],
};
