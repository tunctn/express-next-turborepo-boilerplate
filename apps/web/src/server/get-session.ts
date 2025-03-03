"use server";

import { authClient } from "@/lib/auth";
import { headers } from "next/headers";
export const getUser = async () => {
  const headerList = await headers();
  const session = await authClient.getSession({
    fetchOptions: {
      headers: Object.fromEntries(headerList.entries()),
    },
  });
  return session.data;
};
