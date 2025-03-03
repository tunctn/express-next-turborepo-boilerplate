"use client";

import ky from "ky";
import { toast } from "sonner";
import { env } from "../env";

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          const body = await response.json();
          if ((body as any).message) {
            toast.error((body as any).message);
          } else {
            // Show generic error toast for unknown error
            toast.error("An error occurred while making the API request");
          }
        }
      },
    ],
  },
});
