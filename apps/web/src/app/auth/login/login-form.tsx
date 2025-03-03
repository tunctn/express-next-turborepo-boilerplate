"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type LoginWithEmailPasswordPayload,
  type LoginWithEmailPasswordResponse,
  LoginWithEmailPasswordSchema,
  type UserRole,
} from "@packages/shared";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";

export const useLoginWithEmailAndPassword = () => {
  return useMutation({
    mutationFn: async (payload: LoginWithEmailPasswordPayload): Promise<LoginWithEmailPasswordResponse> => {
      const { data, error } = await authClient.signIn.email({
        email: payload.email,
        password: payload.password,
        rememberMe: true,
      });

      if (error) throw new Error(error.message);

      const userData = data.user as typeof data.user & { role: UserRole };
      return {
        email_address: userData.email,
        id: userData.id,
        name: userData.name,
        role: userData.role,
        is_email_address_verified: userData.emailVerified,
      };
    },
  });
};

export const LoginForm = () => {
  const router = useRouter();
  const t = useTranslations("auth");

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
        <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
        <CardDescription>{t("login.description")}</CardDescription>
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
                    <FormLabel>{t("login.form.email.label")}</FormLabel>
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
                      <FormLabel>{t("login.form.password.label")}</FormLabel>
                      <Link href="/auth/forgot-password" className="ml-auto inline-block text-sm underline">
                        {t("login.form.forgot_password.label")}
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button loading={login.isPending} type="submit" className="w-full">
                {t("login_button")}
              </Button>
              <Button type="button" variant="outline" className="w-full">
                {t("social_login.google")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("login.dont_have_account")}
              <Link href="/auth/signup" className="ml-1 underline">
                {t("signup_button")}
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
