import { HttpException } from "@/exceptions/http.exception";
import { auth } from "@/lib/auth";
import { ERROR } from "@/lib/errors";
import type { AuthUser, UserRole } from "@packages/shared";
import type { Request, Response } from "express";

export const authMiddleware = async ({
  req,
  loose = false,
}: {
  req: Request;
  res: Response;
  loose?: boolean;
}): Promise<AuthUser | undefined> => {
  const session = await auth.api.getSession({
    headers: Object.entries(req.headers).reduce((acc, [key, value]) => {
      if (value) acc.append(key, Array.isArray(value) ? value.join(", ") : value);
      return acc;
    }, new Headers()) as Headers,
  });

  if (session) {
    return {
      id: session.user.id,
      role: session.user.role as UserRole,
      name: session.user.name,
      email_address: session.user.email,
      is_email_address_verified: session.user.emailVerified,
    } satisfies AuthUser;
  }

  if (loose) {
    return undefined;
  }

  throw new HttpException(401, ERROR.GENERIC.unauthorized);
};

export type RequestWithAuth = Request & { user: AuthUser };
export type RequestWithLooseAuth = Request & { user?: AuthUser };
