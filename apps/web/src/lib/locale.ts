import type { Locale } from "@packages/shared";
import { getLocale as getLocaleServer } from "next-intl/server";
export const getLocale = async (): Promise<Locale> => {
  return (await getLocaleServer()) as Locale;
};
