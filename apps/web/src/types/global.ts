import type en from "../dict/en.json";

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
