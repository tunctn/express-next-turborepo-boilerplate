import { Locale } from "@packages/shared";
import { LoginForm } from "./login-form";

interface LoginPageProps {
  params: { locale: Locale };
}

export default function LoginPage({ params }: LoginPageProps) {
  return <LoginForm locale={params.locale} />;
}
