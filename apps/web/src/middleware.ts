import { type NextRequest, NextResponse } from "next/server";

export async function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
