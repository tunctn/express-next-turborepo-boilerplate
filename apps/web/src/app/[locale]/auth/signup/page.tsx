import { Locale } from "@packages/shared";
import { SignupForm } from "./signup-form";

interface SignupPageProps {
  params: { locale: Locale };
}

export default function SignupPage({ params }: SignupPageProps) {
  return <SignupForm locale={params.locale} />;
}
