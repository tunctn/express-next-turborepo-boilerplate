"use client";
import type { Locale } from "@packages/shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

import type { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
  locale: Locale;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools position="left" initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
};
