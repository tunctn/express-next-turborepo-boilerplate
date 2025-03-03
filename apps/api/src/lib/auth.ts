import { db } from "@packages/database";
import type { UserRole } from "@packages/shared";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "./env";

export const auth = betterAuth({
  appName: "Monorepo App",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: env.NEXT_PUBLIC_API_URL.replace("/api", ""),
  basePath: "/v1/auth",
  trustedOrigins: [env.NEXT_PUBLIC_WEB_URL],
  advanced: {
    generateId: false,
    cookiePrefix: "monorepoapp",
    useSecureCookies: true,
    crossSubDomainCookies: {
      enabled: true,
      domain: ".monorepoapp.com",
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectURI: `${env.NEXT_PUBLIC_API_URL}/v1/auth/callback/google`,
    },
  },
  user: {
    modelName: "users",
    fields: {
      createdAt: "created_at",
      email: "email_address",
      emailVerified: "is_email_address_verified",
      image: "image",
      name: "name",
      updatedAt: "updated_at",
    },
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user" as UserRole,
        input: false,
      },
      deletedAt: {
        type: "date",
        required: false,
      },
    },
  },
  session: {
    modelName: "sessions",
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  account: {
    modelName: "accounts",
    fields: {
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      idToken: "id_token",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  verification: {
    modelName: "verifications",
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
});
