"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SignUpWithPasswordPayload, SignUpWithPasswordSchema, type UserRole } from "@packages/shared";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";

const useSignupWithPassword = () => {
  return useMutation({
    mutationFn: async (payload: SignUpWithPasswordPayload) => {
      const { data, error } = await authClient.signUp.email({
        email: payload.email,
        password: payload.password,
        name: payload.name,
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

const useSignupWithGoogle = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
      });

      if (error) throw new Error(error.message);

      return data;
    },
  });
};

export const SignupForm = () => {
  const t = useTranslations("auth");
  const router = useRouter();

  const form = useForm<SignUpWithPasswordPayload>({
    resolver: zodResolver(SignUpWithPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    reValidateMode: "onChange",
  });

  const signup = useSignupWithPassword();
  const onSubmit: SubmitHandler<SignUpWithPasswordPayload> = (data) => {
    signup.mutate(data, {
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  const signupWithGoogle = useSignupWithGoogle();
  const onSignupWithGoogle = () => {
    signupWithGoogle.mutate(undefined, {
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("signup.title")}</CardTitle>
        <CardDescription>{t("signup.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("signup.form.name.label")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("signup.form.email.label")}</FormLabel>
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
                  <FormLabel>{t("signup.form.password.label")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button loading={signup.isPending} type="submit" className="w-full">
              {t("signup_button")}
            </Button>
            <Button type="button" loading={signupWithGoogle.isPending} variant="outline" className="w-full" onClick={onSignupWithGoogle}>
              {t("social_login.google")}
            </Button>
            <div className="mt-4 text-center text-sm">
              {t("signup.already_have_account")}
              <Link href="/auth/login" className="ml-1 underline">
                {t("login_button")}
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
