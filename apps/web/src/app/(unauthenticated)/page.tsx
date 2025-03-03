import { useTranslations } from "next-intl";
import Link from "next/link";

export default function HomePage() {
  const t = useTranslations("auth");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div>
        <Link href="/auth/login">{t("login_button")}</Link>
        <Link href="/auth/signup">{t("signup_button")}</Link>
      </div>
    </main>
  );
}
