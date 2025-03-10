import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import "@/styles/globals.css";

import { cn } from "@/lib/utils";
import { APP } from "@packages/shared";
import { Toaster } from "sonner";
import { Providers } from "./providers";

export const metadata = {
  title: APP.TITLE,
  description: "",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} className="h-full w-full">
      <body className={cn(inter.className, "h-full min-h-screen")}>
        <NextIntlClientProvider messages={messages}>
          <div className="h-full min-h-0 w-full">
            <Providers>{children}</Providers>
            <Toaster
              toastOptions={{
                closeButton: true,
                style: {
                  fontWeight: "lighter",
                },
                classNames: {
                  toast: "text-[15px] pr-16",
                  closeButton: "bg-white",
                  error: "bg-red-50 text-red-700 border border-red-400",
                  warning: "bg-orange-50 text-orange-700 border border-orange-400",
                  success: "bg-indigo-500 text-white border border-indigo-800",
                  info: "bg-blue-50 text-blue-700 border border-blue-400",
                },
              }}
            />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
