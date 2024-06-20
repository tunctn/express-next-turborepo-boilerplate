import { match } from "@formatjs/intl-localematcher";
import { COOKIE_NAME, DEFAULT_LOCALE, LOCALES } from "@packages/shared";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

function getLocaleFromRequest(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE_NAME.API_LOCALE);
  if (cookie) {
    return cookie.value;
  }

  const headers = req.headers;
  const acceptLanguage = headers.get("accept-language") ?? "";
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  }).languages();

  return match(languages, LOCALES, DEFAULT_LOCALE);
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!pathnameHasLocale) {
    // Redirect if there is no locale
    const locale = getLocaleFromRequest(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(request.nextUrl);
  }

  const locale = pathname.split("/")[1] ?? DEFAULT_LOCALE;
  response.cookies.set(COOKIE_NAME.API_LOCALE, locale);

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
