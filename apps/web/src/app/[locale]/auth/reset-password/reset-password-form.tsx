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
  Locale,
  ResetPasswordPayload,
  ResetPasswordResponse,
  ResetPasswordSchema,
} from "@packages/shared";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export const useResetPasswordMutation = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: ResetPasswordPayload,
    ): Promise<ResetPasswordResponse> => {
      return await api.post("/auth/reset-password", {
        body: payload,
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return mutation;
};

interface ResetPasswordFormProps {
  locale: Locale;
}

export const ResetPasswordForm = ({ locale }: ResetPasswordFormProps) => {
  const token = useSearchParams().get("token");
  const t = translateTo(locale);
  const router = useRouter();

  const form = useForm<ResetPasswordPayload>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", passwordAgain: "", token: token ?? "" },
    reValidateMode: "onChange",
  });

  const resetPassword = useResetPasswordMutation();
  const onSubmit: SubmitHandler<ResetPasswordPayload> = (data) => {
    resetPassword.mutate(data, {
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {t({ en: "Reset Password", tr: "Şifremi Unuttum" })}
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t({ en: "Password", tr: "Şifre" })}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordAgain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t({ en: "Password Again", tr: "Şifre Tekrar" })}
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                loading={resetPassword.isPending}
                type="submit"
                className="w-full"
              >
                {t({
                  en: "Save",
                  tr: "Kaydet",
                })}
              </Button>
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
