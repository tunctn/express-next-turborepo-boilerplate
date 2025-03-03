import type { Locale } from "@packages/shared";

export const t = (obj: Record<Locale, string> & { locale: Locale }) => {
  const { locale, ...translations } = obj;
  return translations[locale];
};
