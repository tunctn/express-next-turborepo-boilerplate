"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ResetPasswordPayload, type ResetPasswordResponse, ResetPasswordSchema } from "@packages/shared";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export const useResetPasswordMutation = () => {
  const mutation = useMutation({
    mutationFn: async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
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

export const ResetPasswordForm = () => {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const t = useTranslations("auth");

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
        <CardTitle className="text-2xl">{t("reset_password.title")}</CardTitle>
        <CardDescription>{t("reset_password.description")}</CardDescription>
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
                    <FormLabel>{t("reset_password.form.password.label")}</FormLabel>
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
                    <FormLabel>{t("reset_password.form.password_again.label")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button loading={resetPassword.isPending} type="submit" className="w-full">
                {t("reset_password.form.save")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
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
