import { Locale } from "@packages/shared";
import { ForgotPasswordForm } from "./forgot-password-form";

interface ForgotPasswordPageProps {
  params: { locale: Locale };
}

export default function ForgotPasswordPage({
  params,
}: ForgotPasswordPageProps) {
  return <ForgotPasswordForm locale={params.locale} />;
}
