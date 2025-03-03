import { z } from "zod";

export const USER_ROLES = ["user", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export interface User {
  id: string;
  name: string;
  email_address: string;
  role: UserRole;
}

// Get me response
export const GetMeSchema = z.object({});
export type GetMePayload = z.infer<typeof GetMeSchema>;
export type GetMeResponse = User;
