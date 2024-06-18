"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { translateTo } from "@/lib/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ForgotPasswordSchema,
  Locale,
} from "@packages/shared";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export const useForgotPasswordMutation = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ForgotPasswordPayload,
    ): Promise<ForgotPasswordResponse> => {
      return await api.post("/auth/forgot-password", {
        body: payload,
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return mutation;
};

interface ForgotPasswordFormProps {
  locale: Locale;
}

export const ForgotPasswordForm = ({ locale }: ForgotPasswordFormProps) => {
  const t = translateTo(locale);

  const form = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
    reValidateMode: "onChange",
  });

  const forgotPassword = useForgotPasswordMutation();
  const onSubmit: SubmitHandler<ForgotPasswordPayload> = (data) => {
    forgotPassword.mutate(data);
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {t({ en: "Forgot Password", tr: "Şifremi Unuttum" })}
        </CardTitle>
        <CardDescription>
          {t({
            en: "Enter your email below to send a password reset link",
            tr: "Şifrenizi sıfırlamak için e-posta adresinizi buraya girin",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t({ en: "Email", tr: "E-posta" })}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={forgotPassword.data === true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                loading={forgotPassword.isPending}
                disabled={forgotPassword.data === true}
                className="w-full"
              >
                {forgotPassword.data === true &&
                  t({ en: "Link Sent", tr: "Bağlantı Gönderildi" })}

                {!forgotPassword.data &&
                  t({
                    en: "Send Reset Link",
                    tr: "Sıfırlama Bağlantısı Gönder",
                  })}
              </Button>

              {forgotPassword.data === true && (
                <span className="text-center text-sm text-muted-foreground">
                  {t({
                    en: "Please check your inbox (and also your spam box) for the link. ",
                    tr: "Lütfen bağlantı için gelen kutunuzu (ve spam alanınızı) kontrol edin. ",
                  })}
                </span>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              <Link href="/auth/login" className="ml-1 underline">
                {t({ en: "Login", tr: "Giriş Yap" })}
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
