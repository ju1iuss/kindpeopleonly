import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, isValidToken } from "@/lib/admin/session";

// Schneller Vorab-Check für /admin. Die eigentliche Prüfung passiert zusätzlich
// in jedem Admin-Layout, jeder Seite und jeder Server-Action (requireAdmin).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!isValidToken(request.cookies.get(COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
