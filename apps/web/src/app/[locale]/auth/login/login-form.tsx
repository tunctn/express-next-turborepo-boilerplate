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
  LoginWithEmailPasswordPayload,
  LoginWithEmailPasswordResponse,
  LoginWithEmailPasswordSchema,
} from "@packages/shared";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";

export const useLoginWithEmailAndPassword = () => {
  const mutation = useMutation({
    mutationFn: async (
      payload: LoginWithEmailPasswordPayload,
    ): Promise<LoginWithEmailPasswordResponse> => {
      return await api.post("/auth/login/email-and-password", {
        body: payload,
      });
    },
  });

  return mutation;
};

interface LoginFormProps {
  locale: Locale;
}

export const LoginForm = ({ locale }: LoginFormProps) => {
  const t = translateTo(locale);
  const router = useRouter();

  const form = useForm<LoginWithEmailPasswordPayload>({
    resolver: zodResolver(LoginWithEmailPasswordSchema),
    defaultValues: { email: "", password: "" },
    reValidateMode: "onChange",
  });

  const login = useLoginWithEmailAndPassword();
  const onSubmit: SubmitHandler<LoginWithEmailPasswordPayload> = (data) => {
    login.mutate(data, {
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {t({ en: "Login", tr: "Giriş" })}
        </CardTitle>
        <CardDescription>
          {t({
            en: "Enter your email below to login to your account",
            tr: "Hesabınızın e-posta adresini buraya girin",
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>
                        {t({ en: "Password", tr: "Şifre" })}
                      </FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        {t({
                          en: "Forgot your password?",
                          tr: "Şifremi unuttum",
                        })}
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                loading={login.isPending}
                type="submit"
                className="w-full"
              >
                {t({ en: "Login", tr: "Giriş Yap" })}
              </Button>
              <Button type="button" variant="outline" className="w-full">
                {t({ en: "Login with Google", tr: "Google ile Devam Et" })}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t({
                en: "Don't have an account?",
                tr: "Hesabınız yok mu?",
              })}
              <Link href="/auth/signup" className="ml-1 underline">
                {t({ en: "Sign up", tr: "Kayıt Ol" })}
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
