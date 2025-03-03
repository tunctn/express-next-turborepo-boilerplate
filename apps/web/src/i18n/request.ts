import { COOKIE_NAME } from "@packages/shared";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const config = getRequestConfig(async () => {
  // Read locale from cookies, fallback to "en" if not found
  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_NAME.APP_LOCALE)?.value || "en";
  if (!locale) {
    cookieStore.set(COOKIE_NAME.APP_LOCALE, "en");
  }

  return {
    locale,
    messages: (await import(`../dict/${locale}.json`)).default,
  };
});

export default config;
