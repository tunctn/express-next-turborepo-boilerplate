import type { Locale } from "@packages/shared";
import { ResetPasswordForm } from "./reset-password-form";

interface ResetPasswordPageProps {
  params: { locale: Locale };
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  return <ResetPasswordForm locale={params.locale} />;
}
