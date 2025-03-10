import { APP } from "./constants";

const WEB_URL = process.env["NEXT_PUBLIC_WEB_URL"];
if (!WEB_URL) {
  throw new Error("NEXT_PUBLIC_WEB_URL is not set");
}

const API_URL = process.env["NEXT_PUBLIC_API_URL"];
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export const RESERVED_WORDS = [
  WEB_URL,
  API_URL,
  WEB_URL.replace("http://", ""),
  API_URL.replace("http://", ""),
  WEB_URL.replace("https://", ""),
  API_URL.replace("https://", ""),

  APP.COM,
  `${APP.COM}-admin`,
  `${APP.COM}admin`,
  `${APP.COM}-admins`,
  `${APP.COM}admins`,

  "new",
  "edit",
  "delete",
  "login",
  "logout",
  "register",
  "auth",
  "signup",
  "signin",
  "signout",
  "sign-up",
  "sign-in",
  "sign-out",
  "log-in",
  "log-out",
  "forgotpassword",
  "resetpassword",

  "mail",
  "mails",
  "email",
  "emails",
  "marketing",
  "notifications",
  "notification",
  "notification-settings",
  "market",
  "shop",
  "forgot-password",
  "reset-password",
  "account",
  "settings",
  "admin",
  "dashboard",
  "orders",
  "order",
  "customers",
  "customer",
  "users",
  "user",
  "payments",
  "payment",
  "reviews",
  "review",
  "coupons",
  "coupon",
  "promotions",
  "promotion",
  "categories",
  "category",
  "items",
  "item",
  "addons",
  "addon",
  "modifiers",
  "modifier",
  "modifier-groups",
  "modifier-group",
  "modifier-options",
  "modifier-option",
  "free",
  "freebie",
  "freebies",
  "test",
  "tests",
  "dev",
  "development",
  "local",
  "localhost",
  "preview",
  "production",
  "pre",
  "prod",
  "testing",
  "qa",
  "live",
] as const;
