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
  SignUpWithPasswordSchema,
  type Locale,
  type SignUpWithPasswordPayload,
} from "@packages/shared";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";

export const useSignupWithPassword = () => {
  return useMutation({
    mutationFn: async (payload: SignUpWithPasswordPayload) => {
      return await api.post("/auth/sign-up/password", { body: payload });
    },
  });
};

interface SignupFormProps {
  locale: Locale;
}

export const SignupForm = ({ locale }: SignupFormProps) => {
  const t = translateTo(locale);
  const router = useRouter();

  const form = useForm<SignUpWithPasswordPayload>({
    resolver: zodResolver(SignUpWithPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      username: "",
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

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {t({ en: "Sign Up", tr: "Kayıt Ol" })}
        </CardTitle>
        <CardDescription>
          {t({
            en: "Enter your information to create an account",
            tr: "Hesap açmak için bilgilerinizi girin",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t({ en: "First Name", tr: "Ad" })}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t({ en: "Last Name", tr: "Soyad" })}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t({ en: "Username", tr: "Kullanıcı Adı" })}
                    </FormLabel>
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
                    <FormLabel>{t({ en: "Password", tr: "Şifre" })}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                loading={signup.isPending}
                type="submit"
                className="w-full"
              >
                {t({ en: "Sign Up", tr: "Kayıt Ol" })}
              </Button>
              <Button type="button" variant="outline" className="w-full">
                {t({ en: "Sign Up with Google", tr: "Google ile Devam Et" })}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t({
                en: "Already have an account?",
                tr: "Zaten bir hesabınız mı var?",
              })}
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
