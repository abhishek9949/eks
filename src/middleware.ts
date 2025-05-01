import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // ✅ Redirect to the pre-login page login page
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl.origin));
  }
  // ✅ Prevent caching to stop back button from showing old pages
  const response = NextResponse.next();
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/community-table/:path*",
    "/community-table/",
    "/resource-and-research/:path*",
    "/personal-info/:path*",
    "/content-details/:path*",
    "/bins/:path*",
    "/chats/:path*",
  ],
};
