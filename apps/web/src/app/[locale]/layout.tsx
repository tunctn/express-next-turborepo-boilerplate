import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import "@/styles/globals.scss";

import { cn } from "@/lib/utils";
import { APP_TITLE, Locale } from "@packages/shared";
import { Toaster } from "sonner";
import { Providers } from "./providers";

export const metadata = {
  title: APP_TITLE,
  description: "",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  return (
    <html lang={params.locale} className="h-full w-full">
      <body className={cn(inter.className, "h-full min-h-screen")}>
        <div className="h-full min-h-0 w-full">
          <Providers locale={params.locale}>{children}</Providers>
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
                warning:
                  "bg-orange-50 text-orange-700 border border-orange-400",
                success: "bg-indigo-500 text-white border border-indigo-800",
                info: "bg-blue-50 text-blue-700 border border-blue-400",
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}
