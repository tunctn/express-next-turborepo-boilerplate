import type { Locale } from "@packages/shared";

export const getLocaleFromPath = (path: string): Locale | undefined => {
  const locale = path.split("/")?.[1];
  if (locale === "tr") return "tr";
  if (locale === "en") return "en";
  return undefined;
};

export const getPathnameWithoutLocale = (pathname: string) => {
  const locale = getLocaleFromPath(pathname);
  if (locale !== undefined) {
    return pathname.replace(`/${locale}`, "");
  }
  return pathname;
};
